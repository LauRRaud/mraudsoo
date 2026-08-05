/*
  KAETUSE KONTROLL — taustapiltide register vs lehed.

  Registrisse kirjutatud võti annab admin-lehel valiku, aga taust ilmub alles
  siis, kui sama võti on ka mõne sektsiooni küljes (`taustaVoti="…"` või
  käsitsi `data-taust="…"`). Ainult ühe tegemine annab admini, kus midagi ei
  juhtu — sama lõks, mis tekstikujude juures.

  Jooksuta: npm run kontrolli-taustad
*/

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const juur = path.join(import.meta.dirname, "..");
const lehed = path.join(juur, "src", "app");

const { TAUSTA_SEKTSIOONID, TAUSTA_VOTMED } = await import(
  pathToFileURL(path.join(juur, "src", "kujundus", "sektsioonid.js"))
);

/* Kõik .js failid src/app all */
async function failid(kaust) {
  const kirjed = await readdir(kaust, { withFileTypes: true });

  const read = await Promise.all(
    kirjed.map((kirje) => {
      const tee = path.join(kaust, kirje.name);
      return kirje.isDirectory() ? failid(tee) : tee.endsWith(".js") ? [tee] : [];
    }),
  );

  return read.flat();
}

const MUSTER = /(?:taustaVoti|data-taust)="([^"]+)"/g;

const leitud = new Map();

for (const tee of await failid(lehed)) {
  const sisu = await readFile(tee, "utf8");

  for (const [, votme] of sisu.matchAll(MUSTER)) {
    if (!leitud.has(votme)) leitud.set(votme, []);
    leitud.get(votme).push(path.relative(juur, tee));
  }
}

const puuduvad = TAUSTA_VOTMED.filter((votme) => !leitud.has(votme));
const tundmatud = [...leitud.keys()].filter((votme) => !TAUSTA_VOTMED.includes(votme));
const topelt = [...leitud.entries()].filter(([, teed]) => teed.length > 1);

const nimed = new Map(
  TAUSTA_SEKTSIOONID.flatMap((ruhm) =>
    ruhm.sektsioonid.map((s) => [s.votme, `${ruhm.leht} — ${s.nimi}`]),
  ),
);

console.log(
  `Registris ${TAUSTA_VOTMED.length} sektsiooni, lehtedel ühendatud ${
    TAUSTA_VOTMED.length - puuduvad.length
  }.`,
);

if (puuduvad.length > 0) {
  console.log("\nRegistris, aga lehel ühendamata (admin lubab valida, midagi ei juhtu):");
  for (const votme of puuduvad) console.log(`  ${votme} — ${nimed.get(votme)}`);
}

if (tundmatud.length > 0) {
  console.log("\nLehel, aga registris puudub (pilti ei saa kunagi määrata):");
  for (const votme of tundmatud) console.log(`  ${votme} — ${leitud.get(votme).join(", ")}`);
}

/* Sama võti mitmes kohas on lubatud (nt korduv paigutus), aga tasub teada */
if (topelt.length > 0) {
  console.log("\nSama võti mitmes failis:");
  for (const [votme, teed] of topelt) console.log(`  ${votme} — ${teed.join(", ")}`);
}

if (puuduvad.length > 0 || tundmatud.length > 0) process.exitCode = 1;
else console.log("Kaetus on täielik.");
