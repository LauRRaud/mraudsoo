/*
  KUJUNDUSE LAADIMINE JA SALVESTAMINE.

  Sama muster mis sisu juures (src/sisu/lae.js): vaikimisi väärtused on koodis,
  salvestatu failis, ja need liidetakse. Tundmatud võtmed jäetakse tähelepanuta.
*/

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { connection } from "next/server";
import { vaikimisiKujundus } from "./vaikimisi";
import { leiaKuvaFont, leiaTekstiFont } from "./fondid";
import { ASETUSED, onTaustaVoti } from "./sektsioonid";

const kaust = path.join(process.cwd(), "data");
const failiTee = path.join(kaust, "kujundus.json");

/* #rgb või #rrggbb — muud ei lubata CSS-i sisse */
function onVarv(vaartus) {
  return typeof vaartus === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(vaartus);
}

/*
  Taustapildi failinimi. Nime annab serveripool ise (vt taustaPildid.js),
  seega see kontroll on kaitse käsitsi muudetud kujundusfaili vastu: nimi
  läheb nii failiteesse kui ka CSS-i url(…) sisse, seega kaldkriipsu,
  punktipaari ega jutumärki seal olla ei tohi.
*/
const PILDI_NIMI = /^[a-z0-9][a-z0-9-]{0,63}\.(jpg|png|webp)$/;

export function onPildiNimi(vaartus) {
  return typeof vaartus === "string" && PILDI_NIMI.test(vaartus);
}

function arv(vaartus, min, max, vaikimisi) {
  const n = Number(vaartus);
  if (!Number.isFinite(n)) return vaikimisi;
  return Math.min(max, Math.max(min, n));
}

/*
  Puhastame alati. Käsitsi muudetud fail ei tohi lubada suvalist teksti
  CSS-i sisse — see oleks stiili sisestamise auk.
*/
export function puhastaKujundus(salvestatud) {
  const alus = vaikimisiKujundus;
  const s = salvestatud && typeof salvestatud === "object" ? salvestatud : {};

  const varvid = {};
  for (const [votme, vaikeVaartus] of Object.entries(alus.varvid)) {
    const antud = s.varvid?.[votme];
    varvid[votme] = onVarv(antud) ? antud : vaikeVaartus;
  }

  const suurused = {};
  for (const [votme, vaikeVaartus] of Object.entries(alus.suurused)) {
    suurused[votme] = arv(s.suurused?.[votme], 10, 48, vaikeVaartus);
  }

  const tahevahed = {};
  for (const [votme, vaikeVaartus] of Object.entries(alus.tahevahed)) {
    tahevahed[votme] = arv(s.tahevahed?.[votme], -0.05, 0.5, vaikeVaartus);
  }

  return {
    fondid: {
      /* leia* langeb tundmatu id korral tagasi esimesele */
      kuva: leiaKuvaFont(s.fondid?.kuva).id,
      tekst: leiaTekstiFont(s.fondid?.tekst).id,
    },
    varvid,
    suurused,
    tahevahed,
    taustad: puhastaTaustad(s.taustad),
  };
}

/*
  TAUSTAPILDID.

  Erinevalt ülejäänud kujundusest ei ole siin kindlat võtmehulka: kirje
  tekib alles siis, kui Marta pildi valib. Seepärast käib puhastus üle
  SALVESTATU ja iga võtit kontrollitakse registri vastu — tundmatu võti,
  vigane failinimi või puuduv pilt kukub vaikselt välja.

  Katte alampiir on 0,5. Madalamal muutub tekst pildi peal loetamatuks ja
  see on ainus koht, kus kujunduse admin päriselt lehe katki teha saaks.
*/
function puhastaTaustad(salvestatud) {
  if (!salvestatud || typeof salvestatud !== "object") return {};

  const taustad = {};

  for (const [votme, kirje] of Object.entries(salvestatud)) {
    if (!onTaustaVoti(votme)) continue;
    if (!kirje || typeof kirje !== "object") continue;
    if (!onPildiNimi(kirje.pilt)) continue;

    taustad[votme] = {
      pilt: kirje.pilt,
      kate: arv(kirje.kate, 0.5, 1, 0.85),
      asetus: Object.hasOwn(ASETUSED, kirje.asetus) ? kirje.asetus : "keskel",
    };
  }

  return taustad;
}

/* goldDeep -> gold-deep */
function sidekriipsuga(votme) {
  return votme.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}

/*
  Kujundusest CSS. Kirjutab :root muutujad üle — see läheb juurpaigutuses
  <style> silti. Väärtused on juba puhastatud, seega CSS-i sisse ei saa
  midagi ootamatut sattuda.
*/
export function kujundusCss(kujundus) {
  const read = [];

  for (const [votme, vaartus] of Object.entries(kujundus.varvid)) {
    read.push(`--color-${sidekriipsuga(votme)}:${vaartus}`);
  }

  /* px -> rem, et suurused austaksid brauseri kirjasuuruse seadet */
  read.push(`--silt-suurus:${kujundus.suurused.silt / 16}rem`);
  read.push(`--mikro-suurus:${kujundus.suurused.mikro / 16}rem`);
  read.push(`--tekst-suurus:${kujundus.suurused.tekst / 16}rem`);
  read.push(`--tekst-suur-suurus:${kujundus.suurused.tekstSuur / 16}rem`);

  read.push(`--silt-vahe:${kujundus.tahevahed.silt}em`);
  read.push(`--mikro-vahe:${kujundus.tahevahed.mikro}em`);
  read.push(`--nimi-vahe:${kujundus.tahevahed.nimi}em`);

  /* Valitud fondid */
  read.push(`--kuva-font:var(${leiaKuvaFont(kujundus.fondid.kuva).muutuja})`);
  read.push(`--tekst-font:var(${leiaTekstiFont(kujundus.fondid.tekst).muutuja})`);

  return `:root{${read.join(";")}}${taustadeCss(kujundus.taustad)}`;
}

/*
  TAUSTAPILDID CSS-INA.

  Reegel tekib ainult sektsioonile, millel pilt päriselt on — nii ei kanna
  leht kaasas tühja kihti iga sektsiooni kohal. Sektsioon ise annab
  --kate-varv väärtuse (oma pinnavärvi), sest CSS-i genereerimise hetkel me
  ei tea, millisel pinnal sektsioon seisab; kate peab olema sama värv, muidu
  tekiks pildi ümber vale toon.

  Väärtused on puhastatud (võti registrist, failinimi mustri järgi, kate
  arv 0,5…1), seega siia ei saa midagi ootamatut sattuda.
*/
function taustadeCss(taustad) {
  const kirjed = Object.entries(taustad ?? {});
  if (kirjed.length === 0) return "";

  return kirjed
    .map(([votme, { pilt, kate, asetus }]) => {
      const valik = `[data-taust="${votme}"]`;

      return (
        `${valik}{background-image:url("/taustad/${pilt}");` +
        `background-size:cover;background-position:${ASETUSED[asetus]};` +
        `background-repeat:no-repeat}` +
        `${valik}::before{opacity:${kate}}`
      );
    })
    .join("");
}

function loeFail() {
  try {
    return JSON.parse(readFileSync(failiTee, "utf8"));
  } catch {
    return null;
  }
}

/* Päringuaegne laadimine — muudatus on kohe näha, ilma uue ehituseta */
export async function laeKujundus() {
  await connection();
  try {
    return puhastaKujundus(JSON.parse(await readFile(failiTee, "utf8")));
  } catch {
    return puhastaKujundus(null);
  }
}

/* Sünkroonne variant sinna, kus päringukonteksti ei ole (nt 404-leht) */
export function laeKujundusSync() {
  return puhastaKujundus(loeFail());
}

export async function salvestaKujundus(uus) {
  const puhas = puhastaKujundus(uus);
  await mkdir(kaust, { recursive: true });

  const ajutine = `${failiTee}.tmp`;
  await writeFile(ajutine, `${JSON.stringify(puhas, null, 2)}\n`, "utf8");
  await rename(ajutine, failiTee);

  return puhas;
}
