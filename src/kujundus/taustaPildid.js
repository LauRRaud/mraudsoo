/*
  TAUSTAPILTIDE FAILID.

  Pildid elavad kaustas data/taustad — sama koht, kus sisu ja kujundus.
  Miks mitte public/: seal on git'i all olev sisu ja deploy käib git pull'iga,
  seega üleslaetud fail seisaks jälgimata failina keset jälgitud kausta.
  data/ on .gitignore-is ja jääb deploy'l puutumata.

  Serveerimine käib marsruudi /taustad/<nimi> kaudu (src/app/taustad).

  TÄHELEPANU: failinime EI VÕETA kasutajalt. Nimi tekib siin ja koosneb
  ainult tähtedest, numbritest ja sidekriipsudest — nii ei saa üleslaadimine
  kirjutada väljapoole kausta ega panna CSS-i sisse midagi ootamatut.
*/

import { mkdir, readdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { onPildiNimi } from "./lae";

const kaust = path.join(process.cwd(), "data", "taustad");

/* Suurim lubatud fail. Taustapilt läheb üle terve sektsiooni, seega ta
   tohib olla suur — aga mitte nii suur, et leht selle alla jääks. */
export const SUURIM_PILT = 8 * 1024 * 1024;

/*
  Failitüüp tuvastatakse SISU, mitte laiendi ega brauseri antud tüübi järgi.
  Ümber nimetatud .exe ei tohi pildina kausta jõuda.
*/
const TUUBID = [
  { laiend: "jpg", mime: "image/jpeg", algus: [0xff, 0xd8, 0xff] },
  { laiend: "png", mime: "image/png", algus: [0x89, 0x50, 0x4e, 0x47] },
  /* WEBP: "RIFF" .... "WEBP" — neljast baidist keskel on faili pikkus */
  {
    laiend: "webp",
    mime: "image/webp",
    algus: [0x52, 0x49, 0x46, 0x46],
    kaheksas: [0x57, 0x45, 0x42, 0x50],
  },
];

function tuvastaTuup(baidid) {
  return (
    TUUBID.find(
      (t) =>
        t.algus.every((bait, i) => baidid[i] === bait) &&
        (!t.kaheksas ||
          t.kaheksas.every((bait, i) => baidid[8 + i] === bait)),
    ) ?? null
  );
}

export function mimeTuup(nimi) {
  const laiend = nimi.split(".").pop();
  return TUUBID.find((t) => t.laiend === laiend)?.mime ?? "application/octet-stream";
}

/* Üleslaetud piltide nimekiri, uuemad ees */
export async function laeTaustaPildid() {
  try {
    const failid = await readdir(kaust);
    return failid.filter(onPildiNimi).sort().reverse();
  } catch {
    return [];
  }
}

export async function loeTaustaPilt(nimi) {
  if (!onPildiNimi(nimi)) return null;

  try {
    return await readFile(path.join(kaust, nimi));
  } catch {
    return null;
  }
}

/*
  Uus pilt kausta. Tagastab { ok, nimi } või { ok: false, viga }.
  `jrk` teeb nime ainulaadseks ka siis, kui kaks pilti jõuavad kohale
  samal millisekundil.
*/
export async function salvestaTaustaPilt(fail) {
  if (!fail || typeof fail.arrayBuffer !== "function") {
    return { ok: false, viga: "Faili ei tulnud kaasa." };
  }

  if (fail.size > SUURIM_PILT) {
    return {
      ok: false,
      viga: `Pilt on liiga suur (${Math.round(fail.size / 1024 / 1024)} MB). Suurim lubatud on ${SUURIM_PILT / 1024 / 1024} MB.`,
    };
  }

  const baidid = new Uint8Array(await fail.arrayBuffer());
  const tuup = tuvastaTuup(baidid);

  if (!tuup) {
    return { ok: false, viga: "See ei ole JPG-, PNG- ega WEBP-pilt." };
  }

  await mkdir(kaust, { recursive: true });

  const jrk = Math.floor(Math.random() * 1e6).toString(36);
  const nimi = `taust-${Date.now().toString(36)}-${jrk}.${tuup.laiend}`;
  const tee = path.join(kaust, nimi);
  const ajutine = `${tee}.tmp`;

  await writeFile(ajutine, baidid);
  await rename(ajutine, tee);

  return { ok: true, nimi };
}

export async function kustutaTaustaPilt(nimi) {
  if (!onPildiNimi(nimi)) return false;

  try {
    await unlink(path.join(kaust, nimi));
    return true;
  } catch {
    return false;
  }
}
