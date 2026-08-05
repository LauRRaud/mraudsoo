"use server";

/*
  ADMIN — SERVERITEGEVUSED.

  Kõik siinsed funktsioonid jooksevad serveris ja kontrollivad ise sisselogimist.
  Seda ei tohi jätta ainult layout'i hooleks: serveritegevus on eraldi HTTP
  otspunkt, mille poole saab pöörduda ka ilma admin-lehte avamata.
*/

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kasSisseLoginud, loguSisse, loguValja } from "@/admin/turve";
import { laeSisu, puhasta, salvestaSisu, vaikimisiSisu } from "@/sisu/lae";
import { TEKSTIKUJUDE_VOTI, eemaldaHaru } from "@/sisu/tekstikujud";
import { markiLoetuks } from "@/broneering/salvesta";
import { salvestaKalender } from "@/broneering/kalender";
import { laeKujundus, salvestaKujundus } from "@/kujundus/lae";
import {
  kustutaTaustaPilt,
  laeTaustaPildid,
  salvestaTaustaPilt,
} from "@/kujundus/taustaPildid";

/*
  Kuju valideerimine (puhasta) elab failis src/sisu/lae.js, sest sama kontroll
  peab käima nii kirjutamisel kui lugemisel. Siin ei tohi seda dubleerida:
  "use server" fail tohib eksportida ainult asünkroonseid funktsioone.
*/

function onObjekt(vaartus) {
  return (
    typeof vaartus === "object" && vaartus !== null && !Array.isArray(vaartus)
  );
}

/* Ühine valvur: kas kutsujal on kehtiv sessioon */
async function noudaSessiooni() {
  if (await kasSisseLoginud()) return null;
  return { ok: false, viga: "Sessioon on aegunud. Palun logi uuesti sisse." };
}

/*
  SISSELOGIMINE.
  Seotakse vormiga useActionState kaudu, seepärast on esimene argument eelmine
  seis ja teine FormData. Õnnestumisel suuname /admin peale — redirect() peab
  olema väljaspool try-plokki, sest see viskab NEXT_REDIRECT vea.
*/
export async function loguSisseTegevus(eelmineSeis, vormiAndmed) {
  const parool = vormiAndmed.get("parool");
  const vastus = await loguSisse(typeof parool === "string" ? parool : "");

  if (!vastus.ok) return { viga: vastus.viga };

  redirect("/admin");
}

/* VÄLJALOGIMINE. Seotakse tavalise <form action={...}> külge, andmeid ei vaja. */
export async function loguValjaTegevus() {
  await loguValja();
  redirect("/admin");
}

/*
  SALVESTAMINE.
  Kogu sisupuu tuleb korraga: valideerime kuju, kirjutame faili ja värskendame
  kõik lehed korraga (revalidatePath juurpaigutuse peal puhastab kliendipuhvri).
*/
export async function salvestaTegevus(uusSisu) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  if (!onObjekt(uusSisu)) {
    return { ok: false, viga: "Salvestamine ebaõnnestus: sisu kuju on vigane." };
  }

  let puhastatud;
  try {
    puhastatud = puhasta(vaikimisiSisu, uusSisu);
  } catch (viga) {
    return { ok: false, viga: `Salvestamine ebaõnnestus: ${viga.message}` };
  }

  try {
    await salvestaSisu(puhastatud);
  } catch {
    return {
      ok: false,
      viga: "Salvestamine ebaõnnestus: faili data/sisu.json ei õnnestunud kirjutada.",
    };
  }

  revalidatePath("/", "layout");

  return { ok: true, sonum: "Salvestatud.", sisu: puhastatud };
}

/*
  ÜHE SEKTSIOONI LÄHTESTAMINE.
  tee = sisupuu ülemise taseme võti (nt "avaleht", "teenused", "hinnakiri").
  Ülejäänud sisu jääb puutumata.
*/
export async function lahtestaTegevus(tee) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  if (typeof tee !== "string" || !Object.hasOwn(vaikimisiSisu, tee)) {
    return { ok: false, viga: "Tundmatu sektsioon — lähtestamine katkestati." };
  }

  const praegune = await laeSisu();
  const uusSisu = puhasta(vaikimisiSisu, {
    ...praegune,
    [tee]: structuredClone(vaikimisiSisu[tee]),
    /*
      Sektsiooni tekstikujud lähevad koos tekstidega. Muidu jääks kaardile
      kirje teksti kohta, mida enam ei ole, ja järgmine sama teega tekst
      päriks võõra kuju.
    */
    [TEKSTIKUJUDE_VOTI]: eemaldaHaru(praegune[TEKSTIKUJUDE_VOTI], tee),
  });

  try {
    await salvestaSisu(uusSisu);
  } catch {
    return {
      ok: false,
      viga: "Lähtestamine ebaõnnestus: faili data/sisu.json ei õnnestunud kirjutada.",
    };
  }

  revalidatePath("/", "layout");

  return { ok: true, sonum: "Sektsioon on lähtestatud.", sisu: uusSisu };
}

/*
  BRONEERINGU LOETUKS MÄRKIMINE.
  Tavaline vorm (töötab ka ilma JavaScriptita), seepärast FormData.
*/
export async function markiLoetuksTegevus(vormiAndmed) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  const id = vormiAndmed.get("id");
  /* Tühi väärtus tähendab „märgi uueks” */
  const loetud = Boolean(vormiAndmed.get("loetud"));

  if (typeof id !== "string" || !id) {
    return { ok: false, viga: "Broneeringut ei leitud." };
  }

  await markiLoetuks(id, loetud);
  revalidatePath("/admin/broneeringud");

  return { ok: true };
}

/*
  KALENDRI SAADAVUS.
  Kuju puhastatakse salvestamisel (vt src/broneering/kalender.js), seega
  siin piisab sessioonikontrollist ja kirjutamisest.
*/
export async function salvestaKalendriTegevus(andmed) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  try {
    const salvestatud = await salvestaKalender(andmed);
    /* Broneerimisleht loeb kalendrit päringu ajal — värskendame vahemälu */
    revalidatePath("/broneerimine");
    revalidatePath("/admin/kalender");
    return { ok: true, seis: salvestatud };
  } catch {
    return {
      ok: false,
      viga: "Salvestamine ebaõnnestus: faili data/kalender.json ei õnnestunud kirjutada.",
    };
  }
}

/*
  KUJUNDUS.
  Kuju ja väärtused puhastatakse salvestamisel (vt src/kujundus/lae.js) —
  see on oluline, sest need lähevad CSS-i sisse.
*/
export async function salvestaKujundusTegevus(uus) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  try {
    const salvestatud = await salvestaKujundus(uus);
    /* Kujundus on juurpaigutuses, seega kogu leht vajab värskendust */
    revalidatePath("/", "layout");
    return { ok: true, kujundus: salvestatud };
  } catch {
    return {
      ok: false,
      viga: "Salvestamine ebaõnnestus: faili data/kujundus.json ei õnnestunud kirjutada.",
    };
  }
}

/*
  TAUSTAPILDI ÜLESLAADIMINE.

  Fail tuleb FormData'ga, sest serveritegevus ei võta File-objekti muidu
  vastu. Tüüp ja suurus kontrollitakse failisisu järgi (vt taustaPildid.js).
  Pilt ainult jõuab kausta — millisele sektsioonile ta läheb, otsustab
  Marta admin-lehel ja see salvestub alles „Salvesta” nupuga.
*/
export async function laeTaustaPiltTegevus(vormiAndmed) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  const fail = vormiAndmed.get("pilt");
  const vastus = await salvestaTaustaPilt(fail);

  if (!vastus.ok) return vastus;

  return { ok: true, nimi: vastus.nimi, pildid: await laeTaustaPildid() };
}

/*
  TAUSTAPILDI KUSTUTAMINE.

  Kasutuses olevat pilti ei kustutata: muidu jääks kujundusse viide failile,
  mida ei ole, ja sektsioon läheks tühjaks ilma et keegi aru saaks, miks.
*/
export async function kustutaTaustaPiltTegevus(nimi) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  const kujundus = await laeKujundus();
  const kasutusel = Object.values(kujundus.taustad).some((t) => t.pilt === nimi);

  if (kasutusel) {
    return {
      ok: false,
      viga: "Pilt on mõne sektsiooni taustaks. Võta see enne sektsioonilt maha.",
    };
  }

  if (!(await kustutaTaustaPilt(nimi))) {
    return { ok: false, viga: "Pilti ei õnnestunud kustutada." };
  }

  return { ok: true, pildid: await laeTaustaPildid() };
}
