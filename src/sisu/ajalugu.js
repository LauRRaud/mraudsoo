/*
  VARUKOOPIAD JA SALVESTUSLOGI.

  Kaks asja, mis mõlemad vastavad küsimusele „mis vahepeal juhtus”:

    varukoopiad — data/varukoopiad/<nimi>-<ajatempel>.json
    logi        — data/logi.jsonl, üks rida iga salvestuskatse kohta

  Nimekuju on sama, mis skriptil `npm run sisu:varunda`, et serveris juba
  olemasolevad koopiad segamini ei läheks.

  KOOPIA TEHAKSE ENNE ÜLEKIRJUTAMIST ja koopiasse jääb EELMINE seis. Nii on
  „Taasta” all alati see, mis oli enne viimast salvestust — just seda on
  kadumise korral vaja.

  MÕLEMAD ON BEST-EFFORT. Kui koopia või logirida ebaõnnestub (õigused, ketas
  täis), peab salvestus ise siiski õnnestuma: ajalugu ei tohi kunagi saada
  salvestamise blokeerijaks.
*/

import { copyFile, mkdir, readdir, readFile, stat, unlink, appendFile } from "node:fs/promises";
import path from "node:path";
import { ANDMEKAUST } from "./lukk.js";

export const VARUKAUST = path.join(ANDMEKAUST, "varukoopiad");
const LOGI_TEE = path.join(ANDMEKAUST, "logi.jsonl");

/* Mitu koopiat ühe faili kohta alles hoiame */
const KOOPIAID_ALLES = 20;

/* Lubatud varukoopia nimi: <alus>-<20260812-181530>.json */
const KOOPIA_MUSTER = /^([a-z0-9.]+)-(\d{8}-\d{6})\.json$/i;

/* 20260812-181530 — sorditav ja inimesele loetav */
function ajatempel(hetk = new Date()) {
  const p = (arv, laius = 2) => String(arv).padStart(laius, "0");
  return (
    `${hetk.getFullYear()}${p(hetk.getMonth() + 1)}${p(hetk.getDate())}` +
    `-${p(hetk.getHours())}${p(hetk.getMinutes())}${p(hetk.getSeconds())}`
  );
}

/* „sisu.et.json” -> „sisu.et” */
function alusNimi(failinimi) {
  return failinimi.replace(/\.json$/i, "");
}

/*
  Vanad koopiad välja. Ainult SAMA alusnimega — muidu sööks tihedasti
  salvestatav kujundus ära sisu koopiad.
*/
async function karbi(alus) {
  try {
    const koik = await readdir(VARUKAUST);
    const omad = koik
      .filter((nimi) => {
        const vaste = nimi.match(KOOPIA_MUSTER);
        return vaste && vaste[1] === alus;
      })
      .sort();

    for (const vana of omad.slice(0, Math.max(0, omad.length - KOOPIAID_ALLES))) {
      await unlink(path.join(VARUKAUST, vana));
    }
  } catch {
    /* Vaikime: kärpimine on koristus, mitte salvestamise osa */
  }
}

/*
  Koopia praegusest failist. Tagastab koopia nime või null (fail puudub või
  kopeerimine ebaõnnestus) — kutsuja EI tohi selle peale katkestada.
*/
export async function varunda(failiTee) {
  const failinimi = path.basename(failiTee);
  const alus = alusNimi(failinimi);

  try {
    await mkdir(VARUKAUST, { recursive: true });
    const koopia = `${alus}-${ajatempel()}.json`;
    await copyFile(failiTee, path.join(VARUKAUST, koopia));
    await karbi(alus);
    return koopia;
  } catch {
    /* Faili veel ei ole (esimene salvestus) või ketas ei lubanud */
    return null;
  }
}

/* Üks rida logisse. Best-effort, nagu koopiadki. */
export async function logi(kirje) {
  try {
    await mkdir(ANDMEKAUST, { recursive: true });
    const rida = JSON.stringify({ aeg: new Date().toISOString(), ...kirje });
    await appendFile(LOGI_TEE, `${rida}\n`, "utf8");
  } catch {
    /* Vaikime meelega */
  }
}

/*
  Kõik varukoopiad, uuemad ees. Vigase nimega failid jäetakse vahele — kaustas
  võib olla ka käsitsi tehtud koopiaid.
*/
export async function loeVarukoopiad() {
  let nimed;
  try {
    nimed = await readdir(VARUKAUST);
  } catch {
    return [];
  }

  const kirjed = [];
  for (const nimi of nimed) {
    const vaste = nimi.match(KOOPIA_MUSTER);
    if (!vaste) continue;

    try {
      const info = await stat(path.join(VARUKAUST, nimi));
      kirjed.push({
        nimi,
        alus: vaste[1],
        tempel: vaste[2],
        baite: info.size,
        aeg: info.mtime.toISOString(),
      });
    } catch {
      /* Fail kadus lugemise ajal — jäta vahele */
    }
  }

  return kirjed.sort((a, b) => b.tempel.localeCompare(a.tempel));
}

/*
  Ühe koopia sisu. Nimi kontrollitakse mustri vastu ENNE failiteeks tegemist —
  see väärtus tuleb kliendilt ja ilma kontrollita saaks temaga kaustast välja
  ronida.
*/
export async function loeVarukoopia(nimi) {
  if (typeof nimi !== "string" || !KOOPIA_MUSTER.test(nimi)) return null;

  try {
    const toores = await readFile(path.join(VARUKAUST, nimi), "utf8");
    const andmed = JSON.parse(toores);
    return { alus: nimi.match(KOOPIA_MUSTER)[1], andmed };
  } catch {
    return null;
  }
}
