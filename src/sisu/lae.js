/*
  SISU LAADIJA.

  Vaikimisi sisu (src/sisu/vaikimisi.js) määrab puu kuju. Admin-lehelt
  salvestatud muudatused elavad failis data/sisu.json ja liidetakse vaikimisi
  sisu peale. Kui faili pole, see on vigane VÕI kui selle kuju ei vasta
  vaikimisi puule, jääb leht vaikimisi sisu peale püsti — viga ei visata.

  Sama puhastus käib nii lugemisel kui kirjutamisel: puhasta() elab siin ja
  src/app/admin/tegevused.js impordib selle. Nii ei saa ka käsitsi serveris
  redigeeritud data/sisu.json lehte maha võtta.
*/

import { connection } from "next/server";
import { readFileSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { vaikimisiSisu } from "./vaikimisi.js";
import { TEKSTIKUJUDE_VOTI, puhastaTekstiKujud } from "./tekstikujud.js";

export { vaikimisiSisu };

/* data/sisu.json asub projekti juurkaustas, mitte src-i sees */
const kaust = path.join(process.cwd(), "data");
const failiTee = path.join(kaust, "sisu.json");
const ajutineTee = `${failiTee}.tmp`;

/* Prototüübi reostuse vastu: neid võtmeid me kunagi läbi ei lase */
const KEELATUD_VOTMED = new Set(["__proto__", "constructor", "prototype"]);

/* Mõistlikud ülempiirid, et vigane või pahatahtlik fail ei sööks mälu */
const MAX_TEKST = 20000;
const MAX_MASSIIV = 300;
const MAX_SUGAVUS = 6;

/*
  Mallid nende massiivide jaoks, mis on vaikimisi puus TÜHJAD ja millel seega
  esimest elementi malliks võtta ei ole. Ilma mallita läheks element vabasse
  puhastusse, mis lubab suvalise kuju — ja siis lööks blogileht postituse
  puuduva välja peal vea. Sama mall on kliendipoolses toimetis
  (src/components/AdminToimeti.js, MALLID) — hoia need kaks sünkroonis.
*/
const MALLID = {
  postitused: {
    slug: "",
    pealkiri: "",
    kuupaev: "",
    sissejuhatus: "",
    loigud: [""],
  },
};

/* Tavaline objekt = mitte null, mitte massiiv */
function onObjekt(vaartus) {
  return (
    typeof vaartus === "object" && vaartus !== null && !Array.isArray(vaartus)
  );
}

/* Kuju alles, tekstid tühjaks — mall ei tohi kanda ühegi elemendi sisu */
function tyhjendaKuju(vaartus) {
  if (Array.isArray(vaartus)) {
    return vaartus.length > 0 ? [liidaKujud(vaartus.map(tyhjendaKuju))] : [];
  }

  if (onObjekt(vaartus)) {
    const tulemus = {};
    for (const [voti, alam] of Object.entries(vaartus)) {
      if (KEELATUD_VOTMED.has(voti)) continue;
      tulemus[voti] = tyhjendaKuju(alam);
    }
    return tulemus;
  }

  return "";
}

/* Kahe juba tühjendatud kuju liit: võtmed mõlemast */
function liidaKaks(a, b) {
  if (a === undefined) return b;
  if (b === undefined) return a;

  if (Array.isArray(a) && Array.isArray(b)) {
    const koos = [...a, ...b];
    return koos.length > 0 ? [liidaKujud(koos)] : [];
  }

  if (onObjekt(a) && onObjekt(b)) {
    const tulemus = { ...a };
    for (const [voti, alam] of Object.entries(b)) {
      tulemus[voti] = liidaKaks(tulemus[voti], alam);
    }
    return tulemus;
  }

  return a;
}

function liidaKujud(kujud) {
  return kujud.reduce(liidaKaks, undefined);
}

/*
  MASSIIVI MALL.

  Mall peab katma KÕIGI vaikimisi elementide kuju, mitte ainult esimese oma.
  Esimesest üksi ei piisa: teenustest on nt „tsitaat” ainult osal ja kuna
  esimesel (Püha Ruum) seda ei ole, kadus see salvestamisel teistelt ära.

  Väärtused on tühjad — mall on KUJU, mitte sisu. Muidu päriks element
  puuduva välja kohale mõne teise elemendi teksti.
*/
function massiiviMall(vaikimisiMassiiv) {
  return liidaKujud(vaikimisiMassiiv.map(tyhjendaKuju));
}

/*
  Vaba väärtuse puhastus. Kasutame ainult seal, kus vaikimisi puus MALLI EI OLE
  ega leia seda ka MALLID-ist. Lubatud on üksnes JSON-ile omased kujud: sõne,
  massiiv ja tavaline objekt. Funktsioonid, klassid, Date jms visatakse minema —
  sisupuusse tohib jõuda ainult tekst.
*/
function puhastaVaba(vaartus, sugavus = 0) {
  if (sugavus > MAX_SUGAVUS) {
    throw new Error("Sisu on liiga sügavalt pesastatud.");
  }

  if (typeof vaartus === "string") return vaartus.slice(0, MAX_TEKST);

  if (Array.isArray(vaartus)) {
    return vaartus
      .slice(0, MAX_MASSIIV)
      .map((element) => puhastaVaba(element, sugavus + 1));
  }

  if (onObjekt(vaartus)) {
    const tulemus = {};
    for (const voti of Object.keys(vaartus)) {
      if (KEELATUD_VOTMED.has(voti)) {
        throw new Error(`Sisu sisaldab lubamatut võtit: ${voti}`);
      }
      tulemus[voti] = puhastaVaba(vaartus[voti], sugavus + 1);
    }
    return tulemus;
  }

  /* Kõik muu (funktsioon, number, boolean, null, undefined) asendub tühja tekstiga */
  return "";
}

/*
  Kuju valideerimine vaikimisi puu vastu.
  Kuju määrab ALATI vaikimisiSisu: tundmatud võtmed kukuvad vaikselt välja,
  vale tüübi korral jääb kehtima vaikimisi väärtus. Ka massiivi iga element
  käib malli läbi, nii et vale elemenditüüp (nt null teenuste nimekirjas) ei
  jõua kunagi JSX-ini.

  voti = vaikimisi puu võtmenimi, mille alt see haru tuli. Vajalik ainult
  tühjade massiivide malli leidmiseks; väärtus tuleb alati vaikimisi puust,
  mitte kasutaja saadetisest.
*/
export function puhasta(vaikimisi, uus, sugavus = 0, voti = "") {
  if (sugavus > MAX_SUGAVUS) {
    throw new Error("Sisu on liiga sügavalt pesastatud.");
  }

  /*
    Tekstikujud on vaba kujuga kaart (tee -> kuju), mitte vaikimisi puu järgi
    valideeritav haru. Kuju järgi käies kaoks siin iga võti, sest vaikimisi
    väärtus on tühi objekt — seepärast oma puhastus (src/sisu/tekstikujud.js).
  */
  if (voti === TEKSTIKUJUDE_VOTI) return puhastaTekstiKujud(uus);

  if (Array.isArray(vaikimisi)) {
    if (!Array.isArray(uus)) return vaikimisi;

    /* Mall: kõigi vaikimisi elementide kuju liit, tühja massiivi puhul MALLID */
    const mall =
      vaikimisi.length > 0
        ? massiiviMall(vaikimisi)
        : Object.hasOwn(MALLID, voti)
          ? MALLID[voti]
          : undefined;

    return uus
      .slice(0, MAX_MASSIIV)
      .map((element) =>
        mall === undefined
          ? puhastaVaba(element, sugavus + 1)
          : puhasta(mall, element, sugavus + 1, voti),
      );
  }

  if (onObjekt(vaikimisi)) {
    if (!onObjekt(uus)) return vaikimisi;

    const tulemus = {};
    for (const [alamVoti, vaikeVaartus] of Object.entries(vaikimisi)) {
      if (KEELATUD_VOTMED.has(alamVoti)) continue;
      tulemus[alamVoti] = puhasta(
        vaikeVaartus,
        uus[alamVoti],
        sugavus + 1,
        alamVoti,
      );
    }
    return tulemus;
  }

  /* Lihtväärtus — vaikimisi puus on need kõik sõned */
  if (typeof uus === typeof vaikimisi && typeof uus === "string") {
    return uus.slice(0, MAX_TEKST);
  }
  return vaikimisi;
}

/* Sõnest objektiks; vigane JSON annab null, mitte viga */
function parsi(sisu) {
  try {
    const objekt = JSON.parse(sisu);
    return onObjekt(objekt) ? objekt : null;
  } catch {
    return null;
  }
}

/*
  Salvestatud sisu liidetakse vaikimisi puu peale ja valideeritakse.
  Kui puhastus mingil põhjusel ebaõnnestub (liiga sügav pesastus, lubamatu
  võti), tagastame terve vaikimisi puu — leht jääb püsti.
*/
function liidaJaPuhasta(salvestatud) {
  if (!onObjekt(salvestatud)) return vaikimisiSisu;

  try {
    return puhasta(vaikimisiSisu, salvestatud);
  } catch {
    return vaikimisiSisu;
  }
}

/*
  Sisu koos salvestatud muudatustega.
  connection() hoiab lehe päringuaegsena, et failist loetud sisu ei külmuks
  ehitusaegsesse eelrenderdusse. Kasuta seda lehekomponentides ja
  generateMetadata's.
*/
export async function laeSisu() {
  await connection();

  let salvestatud = null;
  try {
    salvestatud = parsi(await readFile(failiTee, "utf8"));
  } catch {
    salvestatud = null;
  }

  return liidaJaPuhasta(salvestatud);
}

/*
  Sünkroonne variant ILMA connection()-ita.
  Kasuta AINULT generateStaticParams's, kus päringukonteksti veel ei ole.
*/
export function laeSisuSync() {
  let salvestatud = null;
  try {
    salvestatud = parsi(readFileSync(failiTee, "utf8"));
  } catch {
    salvestatud = null;
  }

  return liidaJaPuhasta(salvestatud);
}

/*
  Kirjutab kogu sisupuu faili data/sisu.json.
  Aatomiliselt: esmalt .tmp fail, siis rename — nii ei jää poolikut faili,
  kui kirjutamine katkeb.
*/
export async function salvestaSisu(uusSisu) {
  await mkdir(kaust, { recursive: true });
  await writeFile(ajutineTee, `${JSON.stringify(uusSisu, null, 2)}\n`, "utf8");
  await rename(ajutineTee, failiTee);
  return uusSisu;
}
