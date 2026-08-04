/*
  KALENDRI SAADAVUS — millal Marta kohtumisi EI võta.

  Kaks eraldi asja, sest need muutuvad erineva sagedusega:

    suletudPaevad       üksikud kuupäevad kujul "2026-08-15" (reis, täis päev)
    suletudNadalapaevad korduvad nädalapäevad, 1 = esmaspäev ... 7 = pühapäev

  Hoiame eraldi failis, mitte sisupuus: see ei ole lehe tekst ja seda
  muudetakse hoopis teises rütmis kui sisu.

  Number 1–7 (mitte JS-i 0–6) on valitud teadlikult: see ühtib
  ISO-nädalapäevadega ja on failis loetav ka inimesele.
*/

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const kaust = path.join(process.cwd(), "data");
const failiTee = path.join(kaust, "kalender.json");

const TYHI = { suletudPaevad: [], suletudNadalapaevad: [] };

/* "2026-08-15" — ainult see kuju on lubatud */
function onKuupaev(vaartus) {
  return typeof vaartus === "string" && /^\d{4}-\d{2}-\d{2}$/.test(vaartus);
}

function onNadalapaev(vaartus) {
  return Number.isInteger(vaartus) && vaartus >= 1 && vaartus <= 7;
}

/*
  Puhastame alati nii lugemisel kui kirjutamisel. Käsitsi muudetud või vigane
  fail ei tohi lehte katki teha ega lubada suvalist sisu kalendrisse.
*/
function puhasta(andmed) {
  if (!andmed || typeof andmed !== "object") return { ...TYHI };

  const paevad = Array.isArray(andmed.suletudPaevad)
    ? [...new Set(andmed.suletudPaevad.filter(onKuupaev))].sort()
    : [];

  const nadalapaevad = Array.isArray(andmed.suletudNadalapaevad)
    ? [...new Set(andmed.suletudNadalapaevad.filter(onNadalapaev))].sort(
        (a, b) => a - b,
      )
    : [];

  return { suletudPaevad: paevad, suletudNadalapaevad: nadalapaevad };
}

export async function laeKalender() {
  try {
    return puhasta(JSON.parse(await readFile(failiTee, "utf8")));
  } catch {
    /* Faili ei ole või on vigane — kõik päevad on avatud */
    return { ...TYHI };
  }
}

export async function salvestaKalender(andmed) {
  const puhas = puhasta(andmed);
  await mkdir(kaust, { recursive: true });

  /* Ajutine fail + nihutamine, et katkestus ei jätaks poolikut sisu */
  const ajutine = `${failiTee}.tmp`;
  await writeFile(ajutine, `${JSON.stringify(puhas, null, 2)}\n`, "utf8");
  await rename(ajutine, failiTee);

  return puhas;
}
