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
import { markiLoetuks } from "@/broneering/salvesta";

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
