/*
  SISU LAADIJA.

  Vaikimisi sisu (src/sisu/vaikimisi.js eesti, src/sisu/vaikimisiEn.js inglise)
  määrab puu kuju. Admin-lehelt salvestatud muudatused elavad failis
  data/sisu.<keel>.json ja liidetakse vaikimisi sisu peale. Kui faili pole, see
  on vigane VÕI kui selle kuju ei vasta vaikimisi puule, jääb leht vaikimisi
  sisu peale püsti — viga ei visata.

  Sama puhastus käib nii lugemisel kui kirjutamisel: puhasta() elab siin ja
  src/app/admin/tegevused.js impordib selle. Nii ei saa ka käsitsi serveris
  redigeeritud fail lehte maha võtta.

  KAKS ASJA, MIS SIIN ERINEVAD ÜHEST KEELEST:

  1. VANA FAIL. Enne kakskeelsust oli üksainus data/sisu.json ja serveris on
     temas Marta muudatused. Kui data/sisu.et.json veel ei ole, loeb vaikekeel
     vana faili — muidu kaoks tema sisu vaikselt ära. Esimene salvestus
     kirjutab data/sisu.et.json-i ja vana fail jääb alles varukoopiaks.

  2. TEKSTIKUJUD ON KEELTE PEALE ÜHISED ja elavad omaette failis
     data/tekstikujud.json. Marta kujundab teksti korra ja mõlemad keeled
     näevad ühtemoodi välja. Keelefaili sisse neid EI kirjutata; lugemisel
     kirjutatakse ühine kaart alati puu peale.
*/

import { connection } from "next/server";
import { readFileSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { vaikimisiSisu as vaikimisiEt } from "./vaikimisi.js";
import { vaikimisiSisuEn as vaikimisiEn } from "./vaikimisiEn.js";
import { VAIKEKEEL, keeleks } from "./keeled.js";
import { TEKSTIKUJUDE_VOTI, puhastaTekstiKujud } from "./tekstikujud.js";
import { ANDMEKAUST, tunnus } from "./lukk.js";
import { varunda } from "./ajalugu.js";

const PUUD = { et: vaikimisiEt, en: vaikimisiEn };

/* Vaikimisi puu keele järgi. Tundmatu keel annab vaikekeele. */
export function vaikimisiSisu(keel) {
  return PUUD[keeleks(keel)];
}

/* data-kaust asub projekti juurkaustas, mitte src-i sees */
const kaust = ANDMEKAUST;

function sisuTee(keel) {
  return path.join(kaust, `sisu.${keeleks(keel)}.json`);
}

/* Enne kakskeelsust: üksainus fail, milles on Marta senised muudatused */
const VANA_SISU_TEE = path.join(kaust, "sisu.json");

/* Keelte peale ühine tekstikujude kaart */
const KUJUDE_TEE = path.join(kaust, "tekstikujud.json");

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

/* Puuduv või vigane fail annab null, mitte viga */
async function loeJson(tee) {
  try {
    return parsi(await readFile(tee, "utf8"));
  } catch {
    return null;
  }
}

function loeJsonSync(tee) {
  try {
    return parsi(readFileSync(tee, "utf8"));
  } catch {
    return null;
  }
}

/*
  Ühe keele salvestatud sisu. Vaikekeel loeb vajadusel VANA ühe faili — vt
  faili päise punkt 1. Inglise pool varuteed ei vaja: teda ei ole kunagi
  olnud, ja vana faili lugemine annaks talle eestikeelse sisu.
*/
async function loeSalvestatud(keel) {
  const oma = await loeJson(sisuTee(keel));
  if (oma) return oma;
  return keeleks(keel) === VAIKEKEEL ? await loeJson(VANA_SISU_TEE) : null;
}

function loeSalvestatudSync(keel) {
  const oma = loeJsonSync(sisuTee(keel));
  if (oma) return oma;
  return keeleks(keel) === VAIKEKEEL ? loeJsonSync(VANA_SISU_TEE) : null;
}

/*
  Keelte peale ühine tekstikujude kaart. Enne lahutamist elasid kujud sisupuu
  sees — kui ühist faili veel ei ole, loeme nad vanast kohast, et Marta senine
  kujundus ei kaoks.
*/
async function loeKujud() {
  const yhine = await loeJson(KUJUDE_TEE);
  if (yhine) return yhine;

  const vana =
    (await loeJson(sisuTee(VAIKEKEEL))) ?? (await loeJson(VANA_SISU_TEE));
  return vana?.[TEKSTIKUJUDE_VOTI] ?? null;
}

function loeKujudSync() {
  const yhine = loeJsonSync(KUJUDE_TEE);
  if (yhine) return yhine;

  const vana = loeJsonSync(sisuTee(VAIKEKEEL)) ?? loeJsonSync(VANA_SISU_TEE);
  return vana?.[TEKSTIKUJUDE_VOTI] ?? null;
}

/*
  Salvestatud sisu liidetakse vaikimisi puu peale ja valideeritakse.
  Kui puhastus mingil põhjusel ebaõnnestub (liiga sügav pesastus, lubamatu
  võti), tagastame terve vaikimisi puu — leht jääb püsti.

  Tekstikujud tulevad ÜHISEST failist ja kirjutatakse alati puu peale, mis
  keelefailist ka ei tuleks.
*/
function liidaJaPuhasta(salvestatud, keel, kujud) {
  const vaikimisi = vaikimisiSisu(keel);

  let sisu = vaikimisi;
  if (onObjekt(salvestatud)) {
    try {
      sisu = puhasta(vaikimisi, salvestatud);
    } catch {
      sisu = vaikimisi;
    }
  }

  return { ...sisu, [TEKSTIKUJUDE_VOTI]: puhastaTekstiKujud(kujud ?? {}) };
}

/*
  Sisu koos salvestatud muudatustega.
  connection() hoiab lehe päringuaegsena, et failist loetud sisu ei külmuks
  ehitusaegsesse eelrenderdusse. Kasuta seda lehekomponentides ja
  generateMetadata's.
*/
export async function laeSisu(keel) {
  await connection();

  const kood = keeleks(keel);
  const [salvestatud, kujud] = await Promise.all([
    loeSalvestatud(kood),
    loeKujud(),
  ]);

  return liidaJaPuhasta(salvestatud, kood, kujud);
}

/*
  Sünkroonne variant ILMA connection()-ita.
  Kasuta AINULT generateStaticParams's, kus päringukonteksti veel ei ole.
*/
export function laeSisuSync(keel) {
  const kood = keeleks(keel);
  return liidaJaPuhasta(loeSalvestatudSync(kood), kood, loeKujudSync());
}

/* Aatomiline kirjutus: esmalt .tmp, siis rename — poolikut faili ei jää */
async function kirjuta(tee, sisu) {
  const ajutine = `${tee}.tmp`;
  await writeFile(ajutine, `${JSON.stringify(sisu, null, 2)}\n`, "utf8");
  await rename(ajutine, tee);
}

/*
  LUKU FAILID.

  Sisu salvestus puudutab KAHTE faili: keelefaili ja ühist tekstikujude faili.
  Vaikekeele juures loeme luku alla ka vana ühe faili — kuni ta serveris veel
  on, on ta osa sellest, mida laadimine tegelikult luges.

  Järjekord peab jääma samaks, muidu ei klapi tunnused iseendaga.
*/
export function sisuFailid(keel) {
  const kood = keeleks(keel);
  return kood === VAIKEKEEL
    ? [sisuTee(kood), VANA_SISU_TEE, KUJUDE_TEE]
    : [sisuTee(kood), KUJUDE_TEE];
}

/* Tunnus, mille admin laadimisel kaasa saab ja salvestusel tagasi saadab */
export function sisuTunnus(keel) {
  return tunnus(sisuFailid(keel));
}

/*
  Ainult ühe keele tekstid. Varukoopia tehakse ENNE ülekirjutamist, seega
  koopiasse jääb eelmine seis.
*/
export async function salvestaTekstid(keel, tekstid) {
  const tee = sisuTee(keel);
  await mkdir(kaust, { recursive: true });
  await varunda(tee);
  await kirjuta(tee, tekstid);
}

/* Ainult keelte peale ühine tekstikujude kaart */
export async function salvestaKujud(kujud) {
  await mkdir(kaust, { recursive: true });
  await varunda(KUJUDE_TEE);
  await kirjuta(KUJUDE_TEE, puhastaTekstiKujud(kujud));
}

/*
  Kirjutab ühe keele sisupuu faili data/sisu.<keel>.json.

  Tekstikujud lahutatakse välja ja lähevad ühisesse faili — vt faili päise
  punkt 2. Keelefaili nad ei jõua, muidu tekiks kaks lahkuminevat kaarti.
*/
export async function salvestaSisu(keel, uusSisu) {
  const { [TEKSTIKUJUDE_VOTI]: kujud, ...tekstid } = uusSisu;

  await salvestaTekstid(keel, tekstid);
  await salvestaKujud(kujud);

  return uusSisu;
}
