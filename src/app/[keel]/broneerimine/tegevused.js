"use server";

/*
  BRONEERIMISVORMI VASTUVÕTT.

  See on AVALIK otspunkt — igaüks saab siia pöörduda. Seepärast:
    - piirame saatmiste arvu,
    - kontrollime väljade pikkusi,
    - hoiame peibutusvälja (bot täidab, inimene ei näe).

  Soov salvestatakse alati enne saatmiskatset, vt src/broneering/salvesta.js.
*/

import { lisaBroneering, saadaTeavitus } from "@/broneering/salvesta";
import { laeSisu } from "@/sisu/lae";
import { VAIKEKEEL, keeleks } from "@/sisu/keeled";
import { liides } from "@/sisu/liides";

/* Kuni 5 saatmist 10 minuti jooksul (protsessi kohta) */
const PIIR = 5;
const AKEN = 10 * 60 * 1000;
let saatmised = [];

function piirajaLubab() {
  const nuud = Date.now();
  saatmised = saatmised.filter((aeg) => nuud - aeg < AKEN);
  return saatmised.length < PIIR;
}

/* Lõikame liiga pikad väljad — keegi ei kirjuta broneeringusse romaani */
function tekst(vaartus, maxPikkus) {
  if (typeof vaartus !== "string") return "";
  return vaartus.trim().slice(0, maxPikkus);
}

function loend(vaartus, maxArv, maxPikkus) {
  if (!Array.isArray(vaartus)) return [];
  return vaartus.slice(0, maxArv).map((v) => tekst(v, maxPikkus)).filter(Boolean);
}

/* Lihtne vormikontroll — täpsemat e-posti valideerimist ei ole mõtet teha */
function onEpost(vaartus) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vaartus);
}

/*
  Keel tuleb kaasa vormist, et veateade oleks samas keeles, mida külastaja
  loeb. Tundmatu väärtus annab vaikekeele — see on AVALIK otspunkt ja siia
  võib tulla mida iganes.
*/
export async function saadaBroneering(andmed) {
  const keel = keeleks(andmed?.keel);
  const sonad = liides(keel);

  const peibutus = tekst(andmed?.veebileht, 100);
  if (peibutus) {
    /* Bot täitis peidetud välja. Vaikselt „õnnestus", et ta ei õpiks. */
    return { ok: true };
  }

  if (!piirajaLubab()) {
    return { ok: false, viga: sonad.liigaPaljuSaatmisi };
  }

  const nimi = tekst(andmed?.nimi, 120);
  const epost = tekst(andmed?.epost, 200);
  const sonum = tekst(andmed?.sonum, 5000);

  if (!nimi) return { ok: false, viga: sonad.sisestaNimi };
  if (!onEpost(epost)) return { ok: false, viga: sonad.kontrolliEposti };
  if (!sonum) return { ok: false, viga: sonad.kirjutaPaarSona };

  const kirje = {
    /* Ajatempel annab nii id kui järjestuse */
    id: `${Date.now()}-${saatmised.length}`,
    saabus: new Date().toISOString(),
    loetud: false,
    /* Mis keeles külastaja kirjutas — Marta näeb seda admin-lehel */
    keel,
    nimi,
    epost,
    telefon: tekst(andmed?.telefon, 60),
    teenus: tekst(andmed?.teenus, 120),
    kuupaevad: loend(andmed?.kuupaevad, 3, 60),
    kellaajad: loend(andmed?.kellaajad, 3, 40),
    sonum,
  };

  saatmised.push(Date.now());

  /* 1. Salvestame. Kui see ei õnnestu, ei saa lubada, et soov jõudis kohale. */
  try {
    await lisaBroneering(kirje);
  } catch {
    return { ok: false, viga: sonad.salvestamineEbaonnestus };
  }

  /* 2. Proovime saata. Ebaõnnestumine ei tohi külastajale viga näidata —
        soov on juba salvestatud ja Marta näeb seda admin-lehel.

        E-posti aadress on mõlemas keeles sama, seepärast piisab vaikekeelest —
        Marta postkast ei sõltu sellest, mis keeles külastaja kirjutas. */
  try {
    const { kontakt } = await laeSisu(VAIKEKEEL);
    await saadaTeavitus(kirje, kontakt?.email);
  } catch {
    /* Vaikime tahtlikult: vt kommentaar ülal */
  }

  return { ok: true };
}
