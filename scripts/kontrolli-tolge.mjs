/*
  TÕLKEKONTROLL — eesti sisupuu vs inglise sisupuu.

  Kaks keelt on kaks eraldi puud (src/sisu/vaikimisi.js ja vaikimisiEn.js) ning
  laadija valideerib kumbagi AINULT iseenda vastu (src/sisu/lae.js, puhasta()).
  Seetõttu on lühem ingliskeelne massiiv täiesti korrektne inglise puu — build
  läheb roheliseks ja tekst on vaikselt kadunud. Nii kadus nt
  minust.pooordumine.loigud 19 lõigust 7 peale.

  Sama lõhe tekib ka ilma koodi puutumata: admin-liides lubab massiivi elemente
  lisada ja eemaldada (src/components/AdminToimeti.js) ja salvestus käib ühe
  keele kaupa (src/app/admin/tegevused.js), nii et ühte keelde lisatud lõik ei
  jäta teise keelde mingit jälge.

  See skript on ainus koht, kus keeli omavahel võrreldakse.

  Kontrollitakse KAHTE kihti:
    1. vaikimisi puud (kood) — alati;
    2. salvestatud sisu data/sisu.et.json vs data/sisu.en.json — kui failid on
       olemas. Serveris nad on, arendaja masinal enamasti mitte.

  Jooksuta: npm run kontrolli-tolge
*/

import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const juur = path.join(import.meta.dirname, "..");

const { vaikimisiSisu } = await import(
  pathToFileURL(path.join(juur, "src", "sisu", "vaikimisi.js"))
);
const { vaikimisiSisuEn } = await import(
  pathToFileURL(path.join(juur, "src", "sisu", "vaikimisiEn.js"))
);

/*
  ÜHESUGUSED TEKSTID, MIS ON ÕIGUSTATUD.

  Osa välju peabki mõlemas keeles sõna-sõnalt sama olema: aadress (slug), hind,
  e-post, telefon, link, Marta enda nimi. Neid ei loeta tõlkimata jäänuks.
  Ülejäänud identsed tekstid tulevad välja eraldi nimekirjas — need on tavaliselt
  kas päris tõlkimata jäänud laused või teadlik valik, mille üle tasub otsustada.
*/
const YHESUGUSED_VALJAD = new Set([
  "slug",
  "tee",
  "hind",
  "epost",
  "telefon",
  "link",
  "aadress",
  "toon", // kujunduse variant, mitte tekst
  "saidiNimi", // Marta enda nimi
]);
const YHESUGUSED_MUSTRID = [/^https?:\/\//, /@/, /^\+?\d[\d\s]{5,}$/, /^\d+\s*€/, /€$/];

function lubatudSama(tee, tekst) {
  const viimane = tee.split(".").pop().replace(/\[\d+\]$/, "");
  if (YHESUGUSED_VALJAD.has(viimane)) return true;
  if (YHESUGUSED_MUSTRID.some((muster) => muster.test(tekst.trim()))) return true;
  /* Üksik sõna või lühend (EST, MR, 2026) ei ole tõlkimata jäänud lause */
  return tekst.trim().length <= 3;
}

function onObjekt(vaartus) {
  return typeof vaartus === "object" && vaartus !== null && !Array.isArray(vaartus);
}

/*
  Kahe puu paralleelne läbikäimine. Iga leitud erinevus läheb omasse ämbrisse;
  läbimine ei katke, sest tahame korraga näha KÕIKI vahesid, mitte esimest.
*/
function vordle(et, en, tee = "") {
  const vahed = { votmed: [], pikkused: [], tyhjad: [], samad: [] };

  function kaiLabi(a, b, p) {
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b)) {
        vahed.votmed.push({ tee: p, viga: "üks pool ei ole massiiv" });
        return;
      }
      if (a.length !== b.length) {
        vahed.pikkused.push({ tee: p, et: a.length, en: b.length });
      }
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        kaiLabi(a[i], b[i], `${p}[${i}]`);
      }
      return;
    }

    if (onObjekt(a) || onObjekt(b)) {
      if (!onObjekt(a) || !onObjekt(b)) {
        vahed.votmed.push({ tee: p, viga: "üks pool ei ole objekt" });
        return;
      }
      for (const voti of new Set([...Object.keys(a), ...Object.keys(b)])) {
        if (!(voti in a)) vahed.votmed.push({ tee: `${p}.${voti}`, viga: "ainult inglise puus" });
        else if (!(voti in b)) vahed.votmed.push({ tee: `${p}.${voti}`, viga: "ainult eesti puus" });
        else kaiLabi(a[voti], b[voti], p ? `${p}.${voti}` : voti);
      }
      return;
    }

    const A = typeof a === "string" ? a : null;
    const B = typeof b === "string" ? b : null;

    /* Massiivi ots: element on ühel pool olemas, teisel mitte */
    if (A !== null && B === null) {
      if (A.trim()) vahed.tyhjad.push({ tee: p, et: A, viga: "inglise poolel puudub" });
      return;
    }
    if (A === null && B !== null) {
      if (B.trim()) vahed.tyhjad.push({ tee: p, et: "", en: B, viga: "ainult inglise poolel" });
      return;
    }
    if (A === null && B === null) return;

    if (A.trim() && !B.trim()) {
      vahed.tyhjad.push({ tee: p, et: A, viga: "inglise väli on tühi" });
      return;
    }
    if (A.trim() && A === B && !lubatudSama(p, A)) {
      vahed.samad.push({ tee: p, tekst: A });
    }
  }

  kaiLabi(et, en, tee);
  return vahed;
}

function lyhike(tekst, n = 90) {
  const yksrida = tekst.replace(/\s+/g, " ").trim();
  return yksrida.length > n ? `${yksrida.slice(0, n)}…` : yksrida;
}

function raporti(pealkiri, vahed) {
  const vigu = vahed.votmed.length + vahed.pikkused.length + vahed.tyhjad.length;

  console.log(`\n=== ${pealkiri} ===`);

  if (vahed.votmed.length > 0) {
    console.log("\nVÕTMED EI KLAPI (üks keel tunneb välja, teine mitte):");
    for (const v of vahed.votmed) console.log(`  ${v.tee} — ${v.viga}`);
  }

  if (vahed.pikkused.length > 0) {
    console.log("\nMASSIIVI PIKKUS EI KLAPI (siin kaob tekst kõige sagedamini):");
    for (const v of vahed.pikkused) console.log(`  ${v.tee} — eesti ${v.et}, inglise ${v.en}`);
  }

  if (vahed.tyhjad.length > 0) {
    console.log("\nTEKST ON ÜHEL POOL OLEMAS, TEISEL MITTE:");
    for (const v of vahed.tyhjad) {
      console.log(`  ${v.tee} — ${v.viga}`);
      console.log(`      ${lyhike(v.et || v.en)}`);
    }
  }

  /* Identne tekst ei ole viga, aga peaaegu alati märk tõlkimata jäänud lausest */
  if (vahed.samad.length > 0) {
    console.log("\nMÕLEMAS KEELES SAMA TEKST (kontrolli üle — kas tõlkimata?):");
    for (const v of vahed.samad) console.log(`  ${v.tee} — ${lyhike(v.tekst, 70)}`);
  }

  if (vigu === 0) console.log("Kuju klapib.");
  return vigu;
}

/* Puuduv või vigane fail annab null, mitte viga — arendaja masinal neid ei ole */
async function loeJson(tee) {
  try {
    return JSON.parse(await readFile(tee, "utf8"));
  } catch {
    return null;
  }
}

/*
  ELUS SISU = vaikimisi puu + salvestatud fail, täpselt nagu laadija seda teeb
  (src/sisu/lae.js, liidaJaPuhasta). SEE ON AINUS ÕIGE VÕRDLUS: vaikimisi puu
  üksi ei ole see, mida leht näitab. Eesti pool on serveris 113 kohas vaikimisi
  puust erinev, seega ainult koodi vaadates jääb mulje, nagu oleks inglise pool
  vale, kuigi ta on tõlgitud Marta päris tekstist.

  Vaikekeel loeb vajadusel VANA ühe faili data/sisu.json — sama varutee mis
  laadijal (lae.js, loeSalvestatud).
*/
/*
  Liitmisreeglid on siin ÜLE KORRATUD, mitte imporditud: src/sisu/lae.js toob
  kaasa `next/server`, mis tavalises node-skriptis ei lahene. Reeglid peavad
  jääma samaks nagu puhasta() (lae.js:192) — kui laadija muutub, muuda ka siin:
    massiiv  — pikkuse annab salvestatud fail, iga element käib malli läbi;
    objekt   — käiakse läbi ainult vaikimisi puu võtmed, tundmatud kukuvad ära;
    tekst    — salvestatud sõne võidab, muu tüüp jätab vaikimisi väärtuse.
*/
function tyhjendaKuju(vaartus) {
  if (Array.isArray(vaartus)) {
    return vaartus.length > 0 ? [liidaKujud(vaartus.map(tyhjendaKuju))] : [];
  }
  if (onObjekt(vaartus)) {
    return Object.fromEntries(
      Object.entries(vaartus).map(([voti, alam]) => [voti, tyhjendaKuju(alam)]),
    );
  }
  return "";
}

function liidaKaks(a, b) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) {
    const koos = [...a, ...b];
    return koos.length > 0 ? [liidaKujud(koos)] : [];
  }
  if (onObjekt(a) && onObjekt(b)) {
    const tulemus = { ...a };
    for (const [voti, alam] of Object.entries(b)) tulemus[voti] = liidaKaks(tulemus[voti], alam);
    return tulemus;
  }
  return a;
}

function liidaKujud(kujud) {
  return kujud.reduce(liidaKaks, undefined);
}

function liida(vaikimisi, uus) {
  if (Array.isArray(vaikimisi)) {
    if (!Array.isArray(uus)) return vaikimisi;
    const mall = vaikimisi.length > 0 ? liidaKujud(vaikimisi.map(tyhjendaKuju)) : undefined;
    return uus.map((element) => (mall === undefined ? element : liida(mall, element)));
  }
  if (onObjekt(vaikimisi)) {
    if (!onObjekt(uus)) return vaikimisi;
    return Object.fromEntries(
      Object.entries(vaikimisi).map(([voti, vaikeVaartus]) => [
        voti,
        liida(vaikeVaartus, uus[voti]),
      ]),
    );
  }
  return typeof uus === "string" ? uus : vaikimisi;
}

async function elus(vaikimisi, ...teed) {
  for (const tee of teed) {
    const salvestatud = await loeJson(path.join(juur, "data", tee));
    if (salvestatud) {
      const { tekstiKujud, ...tekstid } = salvestatud;
      return { puu: liida(vaikimisi, tekstid), allikas: tee };
    }
  }
  return { puu: vaikimisi, allikas: "ainult vaikimisi puu" };
}

const et = await elus(vaikimisiSisu, "sisu.et.json", "sisu.json");
const en = await elus(vaikimisiSisuEn, "sisu.en.json");

console.log(`Eesti allikas: ${et.allikas}\nInglise allikas: ${en.allikas}`);

let vigu = raporti("LEHEL NÄIDATAV SISU", vordle(et.puu, en.puu));

/*
  Vaikimisi puud eraldi: nad ei jõua lehele, kui salvestatud fail nad üle
  kirjutab, aga nad on see, mille pealt uus keel või uus server käivitub.
*/
vigu += raporti("VAIKIMISI PUUD (kood)", vordle(vaikimisiSisu, vaikimisiSisuEn));

console.log("");
if (vigu > 0) {
  console.log(`Kokku ${vigu} kohta, kus keeled on lahku läinud.`);
  process.exitCode = 1;
} else {
  console.log("Keeled on kujult ühesugused.");
}
