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
import { ANDMEKAUST, tunnus } from "@/sisu/lukk";
import { varunda } from "@/sisu/ajalugu";

const kaust = ANDMEKAUST;
const failiTee = path.join(kaust, "kujundus.json");

/* Luku failid ja tunnus — sama muster mis sisul, vt src/sisu/lukk.js */
export function kujunduseFailid() {
  return [failiTee];
}

export function kujunduseTunnus() {
  return tunnus(kujunduseFailid());
}

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

/*
  VANA PALETI ÜHEKORDNE ÜLEMINEK.

  Kujundusfailis on KÕIK värvid päriselt väärtustena kirjas — ka need, mida
  keegi ei ole puutunud, sest puhastus kirjutab iga võtme välja. Seetõttu võidab
  salvestatud fail koodi vaikeväärtuse ALATI ja koodipoolne paletivahetus jääb
  lehel nähtamatuks, kuni keegi läheb admin-lehele „Lähtesta” vajutama. Just nii
  jäi hall lehepõhi ekraanile ka siis, kui koodis oli ammu luuvalge.

  Siin loetletud väärtus tähendab „see toon on maha kantud”: kui failis seisab
  täpselt see, võtab leht uue vaikevärvi. Kõik muu jääb puutumata, seega Marta
  enda valitud toon püsib.

  HELEDATE PINDADE RIDA (august 2026): maha kantud on nii vanad vaikeväärtused
  kui ka käsitsi valitud hall lehepõhi #f4f3f0. See hall tegi kaks viga korraga
  — lehepõhi luges hallina ja rõhupaneel jäi seisma kahe ERINEVA tooni vahele,
  sest linen jäi samal ajal soojaks. Bone ja linen peavad olema sama toon.
*/
const EELMISED_VAIKEVARVID = {
  bone: ["#fdfcf9", "#fbf8f1", "#f4f3f0"],
  linen: ["#f7f5ef", "#f3eee3", "#fbf8f1"],
  sage: ["#e4e3d7", "#dce5dc", "#f0eadf"],
  rohe: ["#4a5a46"],
  roheHele: ["#5c6e57"],
  mets: ["#46543f"],
  metsSyva: ["#3c4936"],
};

function puhastaVarv(votme, antud, vaikeVaartus) {
  if (!onVarv(antud)) return vaikeVaartus;

  const eelmised = EELMISED_VAIKEVARVID[votme] ?? [];
  if (eelmised.includes(antud.toLowerCase())) return vaikeVaartus;

  return antud;
}

/*
  MAHA KANTUD VAIKESUURUSED — sama lugu, mis värvidega ülal.

  Salvestatud fail sisaldab KÕIKI nelja suurust, ka neid, mida keegi ei ole
  liigutanud. Seega koodipoolne vaikemõõdu muutmine ei jõua ekraanile kunagi:
  fail seisab alati ees.

  SILDID (august 2026): 16 px oli sektsioonisiltide algne mõõt. Suurtähtedes,
  hõreda tähevahega ja kuldsena kadus silt selles mõõdus tühja sektsiooni
  kohal lihtsalt ära — kõige selgemini üksik sõna („VÄÄRTUS”, „KONTAKT”,
  „KUTSUMUS”). Uus mõõt on 24 px ja teine pool parandusest on kaal 600
  (globals.css) — peenike kuldne silt vajab mõlemat.

  AINULT LAUAARVUTI KOMPLEKT. Telefoni väärtus puudub vanas failis niikuinii
  ja võtab varuväärtusena juba parandatud lauaarvuti mõõdu. Kui keegi seab
  hiljem telefonile teadlikult 16 px, peab see püsima — seepärast siin
  ülekirjutust ei ole.
*/
const EELMISED_VAIKESUURUSED = {
  silt: [16],
};

function puhastaSuurus(votme, antud, vaikeVaartus) {
  const mahaKantud = EELMISED_VAIKESUURUSED[votme] ?? [];
  if (mahaKantud.includes(Number(antud))) return vaikeVaartus;

  return arv(antud, 10, 48, vaikeVaartus);
}

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
    varvid[votme] = puhastaVarv(votme, antud, vaikeVaartus);
  }

  const suurused = {};
  for (const [votme, vaikeVaartus] of Object.entries(alus.suurused)) {
    suurused[votme] = puhastaSuurus(votme, s.suurused?.[votme], vaikeVaartus);
  }

  /*
    MOBIILISUURUSE VARUVÄÄRTUS ON PUHASTATUD LAUAARVUTI OMA, MITTE KOODI VAIKE.

    Salvestatud kujundusfail on kirjutatud enne selle võtme sündi, seega
    mobiiliväärtusi seal ei ole ühtegi. Koodi vaikega (18 px) langeks käsitsi
    seatud 22 px põhitekst telefonis vaikselt 18 peale — muudatus, mida keegi
    ei palunud. Lauaarvuti väärtusega ei muutu vana faili puhul mitte midagi.
  */
  const suurusedMobiil = {};
  for (const votme of Object.keys(alus.suurusedMobiil)) {
    suurusedMobiil[votme] = arv(s.suurusedMobiil?.[votme], 10, 48, suurused[votme]);
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
    suurusedMobiil,
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

  Kate on vaikimisi 0: valitud pilt paistab täies tugevuses ja alles liugur
  toob paneeli värvi tagasi. Alampiiri ei ole — kui tekst pildi peal ei loe,
  on see nähtav kohe admin-lehe eelvaates ja liugur on selle jaoks olemas.
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
      kate: arv(kirje.kate, 0, 1, 0),
      asetus: Object.hasOwn(ASETUSED, kirje.asetus) ? kirje.asetus : "keskel",
    };
  }

  return taustad;
}

/* goldDeep -> gold-deep */
function sidekriipsuga(votme) {
  return votme.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}

/* px -> rem, et suurused austaksid brauseri kirjasuuruse seadet */
function suuruseRead(suurused) {
  return [
    `--silt-suurus:${suurused.silt / 16}rem`,
    `--mikro-suurus:${suurused.mikro / 16}rem`,
    `--tekst-suurus:${suurused.tekst / 16}rem`,
    `--tekst-suur-suurus:${suurused.tekstSuur / 16}rem`,
  ];
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

  read.push(...suuruseRead(kujundus.suurused));

  read.push(`--silt-vahe:${kujundus.tahevahed.silt}em`);
  read.push(`--mikro-vahe:${kujundus.tahevahed.mikro}em`);
  read.push(`--nimi-vahe:${kujundus.tahevahed.nimi}em`);

  /* Valitud fondid */
  read.push(`--kuva-font:var(${leiaKuvaFont(kujundus.fondid.kuva).muutuja})`);
  read.push(`--tekst-font:var(${leiaTekstiFont(kujundus.fondid.tekst).muutuja})`);

  /*
    Telefoni suurused seisavad PÄRAST :root plokki: valija on täpselt sama,
    seega spetsiifilisus ei otsusta midagi ja võidab hilisem reegel. Enne
    kirjutatuna ei jõuaks nad kitsal ekraanil kunagi ekraanile.

    Piir on 639 px — sama koht, kus üksiku teksti .kuju-mobiil ümber lülitub
    (vt globals.css), et kaks kraadi vahetuksid ühel ja samal laiusel.
  */
  const mobiil = suuruseRead(kujundus.suurusedMobiil).join(";");

  return (
    `:root{${read.join(";")}}` +
    `@media (max-width:639px){:root{${mobiil}}}` +
    taustadeCss(kujundus.taustad)
  );
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

  /* Koopia eelmisest seisust enne ülekirjutamist */
  await varunda(failiTee);

  const ajutine = `${failiTee}.tmp`;
  await writeFile(ajutine, `${JSON.stringify(puhas, null, 2)}\n`, "utf8");
  await rename(ajutine, failiTee);

  return puhas;
}
