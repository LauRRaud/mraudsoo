/*
  OPTIMISTLIK LUKK.

  Miks: admin laeb lehe avamisel terve sisupuu Reacti olekusse ja „Salvesta”
  kirjutab terve puu tagasi. Vana vahekaart hoiab seega hetktõmmist LEHE
  AVAMISE HETKEST ja tema „Salvesta” veeretas kogu saidi sisu sinna hetke
  tagasi — vaikselt, koos rohelise teatega „Salvestatud.” Just see tegi
  kadumise juhuslikuks: ta ei sõltunud toimingust, vaid vahekaardi vanusest.

  Lahendus: iga laadimine annab sisu KÕRVALE tunnuse (failide sisu räsi). Iga
  salvestus saadab tunnuse kaasa. Server arvutab tunnuse uuesti ja keeldub, kui
  see on vahepeal muutunud.

  Räsi, mitte ajatempel: mtime on Windowsi ja võrgukettal ebausaldusväärne ning
  kaks salvestust sama sekundi sees annaksid sama väärtuse.

  Puuduv fail annab tühja sõne, mitte vea — esimene salvestus peab läbi minema.
*/

import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const ANDMEKAUST = path.join(process.cwd(), "data");

export function andmefail(nimi) {
  return path.join(ANDMEKAUST, nimi);
}

async function failiTunnus(tee) {
  try {
    const sisu = await readFile(tee);
    /* 16 märki on kokkupõrke vastu rohkem kui küllalt ja mahub logisse */
    return createHash("sha256").update(sisu).digest("hex").slice(0, 16);
  } catch {
    return "";
  }
}

/*
  Mitme faili koondtunnus. Järjekord loeb — anna teed alati samas järjekorras.

  Sisu salvestus puudutab kahte faili korraga (sisu.<keel>.json ja ühine
  tekstikujud.json), seepärast ei piisa ühest failist.
*/
export async function tunnus(teed) {
  const osad = await Promise.all(teed.map(failiTunnus));
  return osad.join(".");
}

/*
  Uusim muutmisaeg antud failide seast, ISO-sõnena. Puuduv fail jäetakse
  vahele; kui ühtki faili ei ole, tuleb null.

  Seda kasutame ainult admini päises („viimati salvestatud …”) — luku juures
  mitte, sest mtime on liiga jäme (kaks salvestust sama sekundi sees) ja
  võrgukettal ebausaldusväärne.
*/
export async function viimatiMuudetud(teed) {
  const ajad = await Promise.all(
    teed.map(async (tee) => {
      try {
        return (await stat(tee)).mtimeMs;
      } catch {
        return null;
      }
    }),
  );

  const olemas = ajad.filter((aeg) => aeg !== null);
  return olemas.length > 0 ? new Date(Math.max(...olemas)).toISOString() : null;
}

export const KONFLIKTI_TEADE =
  "Sisu on vahepeal mujal muutunud, seepärast ei salvestanud ma seda üle. " +
  "Sinu tekst on siin lehel alles — kopeeri muudetud kohad kõrvale ja laadi " +
  "siis leht uuesti.";

/*
  Kontroll enne kirjutamist. Tagastab null, kui tohib salvestada, ja valmis
  vastuse, kui ei tohi.

  `oodatud === undefined` tähendab, et klient on vana ja tunnust ei saatnud.
  Sellisel juhul KEELDUME samuti: lukuta salvestus on täpselt see, mille
  pärast see fail olemas on.
*/
export async function kontrolliTunnust(teed, oodatud) {
  const praegune = await tunnus(teed);

  if (oodatud === praegune) return null;

  return {
    ok: false,
    konflikt: true,
    viga: KONFLIKTI_TEADE,
    tunnus: praegune,
  };
}
