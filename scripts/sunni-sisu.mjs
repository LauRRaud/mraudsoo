/*
  KOODIS TEHTUD TEKSTIMUUDATUSE JÕUSTAMINE.

  Probleem: kui `data/sisu.<keel>.json` on olemas, siis salvestatud väärtus
  võidab alati ja koodis (src/sisu/vaikimisi.js) tehtud parandus ei jõua
  kunagi lehele. Massiividega on hullem: salvestatud massiiv asendab vaikimisi
  massiivi TERVENISTI, seega koodis lisatud uus teenus, hinnakirjarida või
  blogipostitus ei ilmu iialgi.

  See skript kirjutab ÜHE ülemise taseme haru vaikimisi väärtuse salvestatud
  faili peale. Enne kirjutamist tehakse varukoopia (data/varukoopiad), seega
  vale käsu saab admini lehelt „Varukoopiad” tagasi keerata.

  Jooksuta:
      npm run sisu:sunni -- et avaleht
      npm run sisu:sunni -- en teenused
      npm run sisu:sunni            (näitab, mis harud on olemas)

  MIKS SIIN EI KASUTATA src/sisu/lae.js-i: seal on `next/server` import ja see
  ei jookse väljaspool Next'i. Puhastust siin vaja ei ole — väärtus tuleb
  koodist endast, mitte kasutajalt.
*/

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const juur = path.join(import.meta.dirname, "..");
const andmekaust = path.join(juur, "data");

function moodul(...osad) {
  return pathToFileURL(path.join(juur, "src", ...osad));
}

const { KEELEKOODID, VAIKEKEEL, onKeel } = await import(moodul("sisu", "keeled.js"));
const { vaikimisiSisu: vaikimisiEt } = await import(moodul("sisu", "vaikimisi.js"));
const { vaikimisiSisuEn: vaikimisiEn } = await import(moodul("sisu", "vaikimisiEn.js"));
const { varunda, logi } = await import(moodul("sisu", "ajalugu.js"));

const PUUD = { et: vaikimisiEt, en: vaikimisiEn };

/*
  Tekstikujud ei ela keelefailis, vaid ühises data/tekstikujud.json-is
  (vt src/sisu/lae.js), seega selle haru sundimine kirjutaks keelefaili tühja
  võtme, mida keegi ei loe. Jätame ta nimekirjast välja.
*/
const VALJA = new Set(["tekstiKujud"]);

function harud(puu) {
  return Object.keys(puu).filter((voti) => !VALJA.has(voti));
}

const [keel, tee] = process.argv.slice(2);

function katkesta(sonum) {
  console.error(sonum);
  process.exit(1);
}

if (!keel || !tee) {
  console.log("Kasutus: npm run sisu:sunni -- <keel> <haru>\n");
  console.log(`Keeled: ${KEELEKOODID.join(", ")}`);
  console.log(`Harud:  ${harud(vaikimisiEt).join(", ")}`);
  process.exit(0);
}

if (!onKeel(keel)) {
  katkesta(`Tundmatu keel „${keel}”. Lubatud: ${KEELEKOODID.join(", ")}`);
}

const vaikimisi = PUUD[keel];

if (!Object.hasOwn(vaikimisi, tee) || VALJA.has(tee)) {
  katkesta(`Tundmatu haru „${tee}”.\nLubatud: ${harud(vaikimisi).join(", ")}`);
}

const failiTee = path.join(andmekaust, `sisu.${keel}.json`);
/* Enne kakskeelsust oli üksainus fail — vaikekeel loeb vajadusel teda */
const vanaTee = path.join(andmekaust, "sisu.json");

async function loe(tee) {
  try {
    return JSON.parse(await readFile(tee, "utf8"));
  } catch {
    return null;
  }
}

let salvestatud = await loe(failiTee);
let allikas = failiTee;

if (!salvestatud && keel === VAIKEKEEL) {
  salvestatud = await loe(vanaTee);
  if (salvestatud) allikas = vanaTee;
}

if (!salvestatud) {
  console.log(
    `Faili ${path.relative(juur, failiTee)} ei ole — salvestatud sisu ei ole ` +
      "ees ja koodi vaikeväärtused kehtivad niigi. Midagi ei muudetud.",
  );
  process.exit(0);
}

const enne = JSON.stringify(salvestatud[tee] ?? null);
const parast = JSON.stringify(vaikimisi[tee]);

if (enne === parast) {
  console.log(`Haru „${tee}” on juba koodi vaikeväärtusega identne.`);
  process.exit(0);
}

const uus = { ...salvestatud, [tee]: structuredClone(vaikimisi[tee]) };

await mkdir(andmekaust, { recursive: true });
const koopia = await varunda(failiTee);

const ajutine = `${failiTee}.tmp`;
await writeFile(ajutine, `${JSON.stringify(uus, null, 2)}\n`, "utf8");
await rename(ajutine, failiTee);

await logi({ liik: "sunni", keel, sektsioon: tee, baite: parast.length });

console.log(`Haru „${tee}” on nüüd koodi vaikeväärtusega (${keel}).`);
console.log(`Loetud:     ${path.relative(juur, allikas)}`);
console.log(`Kirjutatud: ${path.relative(juur, failiTee)}`);
console.log(
  koopia
    ? `Varukoopia: data/varukoopiad/${koopia}`
    : "Varukoopiat ei tehtud (faili ei olnud veel).",
);
