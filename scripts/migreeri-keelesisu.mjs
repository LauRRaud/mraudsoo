/*
  ÜHEKEELSE SISU LAHUTAMINE KAHEKS KEELEFAILIKS.

  Enne kakskeelsust salvestas admin kogu eestikeelse sisupuu faili
  data/sisu.json. Keelelaadija oskab seda veel varuteena lugeda, kuid siis ei
  ole inglise poolel oma serveris salvestatud sisu. See skript teeb ühekordse
  ülemineku ilma teksti muutmata:

    data/sisu.json        -> data/sisu.et.json
    src/sisu/vaikimisiEn  -> data/sisu.en.json
    tekstiKujud           -> data/tekstikujud.json

  Vana fail LIIGUB pärast kontrollitud kirjutust varukoopiasse; seda ei
  kustutata. Vaikimisi on kuivkäivitus. Päriselt rakendamiseks:

    node scripts/migreeri-keelesisu.mjs --rakenda

  Skript keeldub olemasolevaid keelefaile üle kirjutamast. See on tahtlik:
  pärast esimest migratsiooni käib keelte sisu muutmine ainult admini kaudu.
*/

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const juur = path.join(import.meta.dirname, "..");
const andmed = path.join(juur, "data");
const vana = path.join(andmed, "sisu.json");
const eesti = path.join(andmed, "sisu.et.json");
const inglise = path.join(andmed, "sisu.en.json");
const kujud = path.join(andmed, "tekstikujud.json");
const rakenda = process.argv.includes("--rakenda");

const { vaikimisiSisuEn } = await import(
  pathToFileURL(path.join(juur, "src", "sisu", "vaikimisiEn.js")),
);

function onObjekt(vaartus) {
  return typeof vaartus === "object" && vaartus !== null && !Array.isArray(vaartus);
}

async function loeJson(tee, kohustuslik = false) {
  try {
    return JSON.parse(await readFile(tee, "utf8"));
  } catch (viga) {
    if (kohustuslik) throw new Error(`Ei saa lugeda JSON-faili ${tee}: ${viga.message}`);
    return null;
  }
}

function ajamark() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function kirjutaAjutine(tee, sisu) {
  const ajutine = `${tee}.keelemigreerimine.tmp`;
  await writeFile(ajutine, `${JSON.stringify(sisu, null, 2)}\n`, "utf8");
  /* Enne pärisfaili asendamist veendu, et just kirjutatud JSON on loetav. */
  await loeJson(ajutine, true);
  return ajutine;
}

const [vanaSisu, olemasEt, olemasEn, olemasKujud] = await Promise.all([
  loeJson(vana, true),
  loeJson(eesti),
  loeJson(inglise),
  loeJson(kujud),
]);

if (!onObjekt(vanaSisu)) {
  throw new Error("data/sisu.json peab olema JSON-objekt.");
}

const olemas = [
  ["data/sisu.et.json", olemasEt],
  ["data/sisu.en.json", olemasEn],
  ["data/tekstikujud.json", olemasKujud],
].filter(([, sisu]) => sisu !== null);

if (olemas.length > 0) {
  throw new Error(
    `Migratsiooni ei tehtud: olemas on juba ${olemas.map(([nimi]) => nimi).join(", ")}.`,
  );
}

const { tekstiKujud: eestiKujud = {}, ...eestiTekstid } = vanaSisu;
const { tekstiKujud: ingliseKujud, ...ingliseTekstid } = vaikimisiSisuEn;

if (!onObjekt(eestiKujud)) {
  throw new Error("data/sisu.json tekstiKujud peab olema objekt.");
}

if (!rakenda) {
  console.log("Kuivkäivitus: midagi ei muudetud.");
  console.log("Luuakse: data/sisu.et.json, data/sisu.en.json, data/tekstikujud.json");
  console.log("Varukoopiasse liigub: data/sisu.json");
  process.exit(0);
}

await mkdir(path.join(andmed, "varukoopiad"), { recursive: true });

/* Kõik kolm faili kirjutatakse ja kontrollitakse enne, kui ükski neist aktiivseks saab. */
const [etTmp, enTmp, kujudTmp] = await Promise.all([
  kirjutaAjutine(eesti, eestiTekstid),
  kirjutaAjutine(inglise, ingliseTekstid),
  kirjutaAjutine(kujud, eestiKujud),
]);

await Promise.all([
  rename(etTmp, eesti),
  rename(enTmp, inglise),
  rename(kujudTmp, kujud),
]);

const varukoopia = path.join(andmed, "varukoopiad", `sisu-enne-keelemigratsiooni-${ajamark()}.json`);
await rename(vana, varukoopia);

console.log("Keelefailid on eraldatud.");
console.log("Eesti:    data/sisu.et.json");
console.log("Inglise:  data/sisu.en.json");
console.log("Kujundus: data/tekstikujud.json");
console.log(`Varukoopia: ${path.relative(juur, varukoopia)}`);
