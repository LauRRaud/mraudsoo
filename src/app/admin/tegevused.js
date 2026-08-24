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
import {
  laeSisu,
  puhasta,
  salvestaKujud,
  salvestaTekstid,
  sisuFailid,
  sisuTunnus,
  vaikimisiSisu,
} from "@/sisu/lae";
import { KEELED, onKeel } from "@/sisu/keeled";
import { kontrolliTunnust } from "@/sisu/lukk";
import { loeVarukoopia, logi } from "@/sisu/ajalugu";
import { TEKSTIKUJUDE_VOTI, eemaldaHaru } from "@/sisu/tekstikujud";
import { markiLoetuks } from "@/broneering/salvesta";
import {
  kalendriFailid,
  kalendriTunnus,
  salvestaKalender,
} from "@/broneering/kalender";
import {
  kujunduseFailid,
  kujunduseTunnus,
  laeKujundus,
  salvestaKujundus,
} from "@/kujundus/lae";
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

const SISU_KEELED = ["et", "en"];

async function kakskeelneKonflikt(tunnusEt, tunnusEn, liik, sektsioon) {
  const [etKonflikt, enKonflikt] = await Promise.all([
    kontrolliTunnust(sisuFailid("et"), tunnusEt),
    kontrolliTunnust(sisuFailid("en"), tunnusEn),
  ]);
  const konflikt = etKonflikt ?? enKonflikt;
  if (!konflikt) return null;

  await logi({
    liik,
    sektsioon: sektsioon ?? null,
    keeled: SISU_KEELED,
    konflikt: true,
    oodatudEt: tunnusEt ?? null,
    oodatudEn: tunnusEn ?? null,
  });
  return konflikt;
}

function eraldaTekstid(sisu) {
  const { [TEKSTIKUJUDE_VOTI]: _kujud, ...tekstid } = sisu;
  return tekstid;
}

async function kirjutaKakskeelne(sisuEt, sisuEn) {
  const kujud = sisuEt[TEKSTIKUJUDE_VOTI] ?? {};
  await salvestaTekstid("et", eraldaTekstid(sisuEt));
  await salvestaTekstid("en", eraldaTekstid(sisuEn));
  await salvestaKujud(kujud);
}

async function kakskeelneVastus(sisuEt, sisuEn, sonum) {
  const [tunnusEt, tunnusEn] = await Promise.all([
    sisuTunnus("et"),
    sisuTunnus("en"),
  ]);
  return {
    ok: true,
    sonum,
    sisuEt,
    sisuEn,
    tunnusEt,
    tunnusEn,
    aeg: new Date().toISOString(),
  };
}

/*
  ÜKS SALVESTUS MÕLEMALE KEELELE.

  Admin saadab eesti teksti, samade väljade inglise tõlked ja ühe ühise
  kujunduskaardi. Mõlema keele optimistlik lukk kontrollitakse enne esimestki
  kirjutust. Kujundus võetakse ainult eesti põhipuust ja salvestatakse korra.
*/
export async function salvestaKakskeelneTegevus(
  uusEt,
  uusEn,
  tunnusEt,
  tunnusEn,
) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  if (!onObjekt(uusEt) || !onObjekt(uusEn)) {
    return { ok: false, viga: "Salvestamine ebaõnnestus: sisu kuju on vigane." };
  }

  const konflikt = await kakskeelneKonflikt(
    tunnusEt,
    tunnusEn,
    "sisu-kakskeelne",
  );
  if (konflikt) return konflikt;

  let sisuEt;
  let sisuEn;
  try {
    sisuEt = puhasta(vaikimisiSisu("et"), uusEt);
    sisuEn = puhasta(vaikimisiSisu("en"), {
      ...uusEn,
      [TEKSTIKUJUDE_VOTI]: sisuEt[TEKSTIKUJUDE_VOTI],
    });
  } catch (viga) {
    return { ok: false, viga: `Salvestamine ebaõnnestus: ${viga.message}` };
  }

  try {
    await kirjutaKakskeelne(sisuEt, sisuEn);
  } catch {
    return {
      ok: false,
      viga: "Salvestamine ebaõnnestus: kakskeelseid sisufaile ei õnnestunud kirjutada.",
    };
  }

  const vastus = await kakskeelneVastus(sisuEt, sisuEn, "Mõlemad keeled on salvestatud.");
  await logi({
    liik: "sisu-kakskeelne",
    keeled: SISU_KEELED,
    baiteEt: JSON.stringify(sisuEt).length,
    baiteEn: JSON.stringify(sisuEn).length,
    tunnusEt: vastus.tunnusEt,
    tunnusEn: vastus.tunnusEn,
    konflikt: false,
  });

  revalidatePath("/", "layout");
  return vastus;
}

/* Ühe sektsiooni tekstid ja kujundus lähtestatakse mõlemas keeles korraga. */
export async function lahtestaKakskeelneTegevus(
  tee,
  tunnusEt,
  tunnusEn,
) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  const vaikeEt = vaikimisiSisu("et");
  const vaikeEn = vaikimisiSisu("en");
  if (
    typeof tee !== "string" ||
    !Object.hasOwn(vaikeEt, tee) ||
    !Object.hasOwn(vaikeEn, tee)
  ) {
    return { ok: false, viga: "Tundmatu sektsioon — lähtestamine katkestati." };
  }

  const konflikt = await kakskeelneKonflikt(
    tunnusEt,
    tunnusEn,
    "lahtesta-kakskeelne",
    tee,
  );
  if (konflikt) return konflikt;

  const [praeguneEt, praeguneEn] = await Promise.all([
    laeSisu("et"),
    laeSisu("en"),
  ]);
  const kujud = eemaldaHaru(praeguneEt[TEKSTIKUJUDE_VOTI], tee);
  const sisuEt = puhasta(vaikeEt, {
    ...praeguneEt,
    [tee]: structuredClone(vaikeEt[tee]),
    [TEKSTIKUJUDE_VOTI]: kujud,
  });
  const sisuEn = puhasta(vaikeEn, {
    ...praeguneEn,
    [tee]: structuredClone(vaikeEn[tee]),
    [TEKSTIKUJUDE_VOTI]: kujud,
  });

  try {
    await kirjutaKakskeelne(sisuEt, sisuEn);
  } catch {
    return {
      ok: false,
      viga: "Lähtestamine ebaõnnestus: kakskeelseid sisufaile ei õnnestunud kirjutada.",
    };
  }

  const vastus = await kakskeelneVastus(
    sisuEt,
    sisuEn,
    "Sektsioon lähtestati mõlemas keeles.",
  );
  await logi({
    liik: "lahtesta-kakskeelne",
    sektsioon: tee,
    keeled: SISU_KEELED,
    tunnusEt: vastus.tunnusEt,
    tunnusEn: vastus.tunnusEn,
    konflikt: false,
  });

  revalidatePath("/", "layout");
  return vastus;
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
export async function salvestaKalendriTegevus(andmed, tunnus) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  const konflikt = await kontrolliTunnust(kalendriFailid(), tunnus);
  if (konflikt) {
    await logi({
      liik: "kalender",
      konflikt: true,
      oodatud: tunnus ?? null,
      tegelik: konflikt.tunnus,
    });
    return konflikt;
  }

  try {
    const salvestatud = await salvestaKalender(andmed);
    const uusTunnus = await kalendriTunnus();
    await logi({
      liik: "kalender",
      baite: JSON.stringify(salvestatud).length,
      tunnus: uusTunnus,
      konflikt: false,
    });

    /* Broneerimisleht loeb kalendrit päringu ajal — värskendame vahemälu */
    revalidatePath("/", "layout");
    revalidatePath("/admin/kalender");
    return { ok: true, seis: salvestatud, tunnus: uusTunnus };
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
export async function salvestaKujundusTegevus(uus, tunnus) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  const konflikt = await kontrolliTunnust(kujunduseFailid(), tunnus);
  if (konflikt) {
    await logi({
      liik: "kujundus",
      konflikt: true,
      oodatud: tunnus ?? null,
      tegelik: konflikt.tunnus,
    });
    return konflikt;
  }

  try {
    const salvestatud = await salvestaKujundus(uus);
    const uusTunnus = await kujunduseTunnus();
    await logi({
      liik: "kujundus",
      baite: JSON.stringify(salvestatud).length,
      tunnus: uusTunnus,
      konflikt: false,
    });

    /* Kujundus on juurpaigutuses, seega kogu leht vajab värskendust */
    revalidatePath("/", "layout");
    return { ok: true, kujundus: salvestatud, tunnus: uusTunnus };
  } catch {
    return {
      ok: false,
      viga: "Salvestamine ebaõnnestus: faili data/kujundus.json ei õnnestunud kirjutada.",
    };
  }
}

/*
  VARUKOOPIA TAASTAMINE.

  Taastamine on ISE samuti tavaline salvestus: salvestusfunktsioonid teevad
  enne ülekirjutamist koopia, seega taastamise-EELNE seis jääb ajalukku alles
  ja vale taastamise saab kohe tagasi keerata.

  Lukku siin ei ole: kasutaja valib koopia sellelt samalt lehelt, mille server
  äsja renderdas, ja tahe on selgesõnaline. Küll aga käib sisu läbi puhasta() —
  vana või käsitsi muudetud fail ei tohi lehte maha võtta.
*/
export async function taastaTegevus(nimi) {
  const keeld = await noudaSessiooni();
  if (keeld) return keeld;

  const koopia = await loeVarukoopia(nimi);
  if (!koopia) {
    return { ok: false, viga: "Varukoopiat ei leitud või selle sisu on vigane." };
  }

  const { alus, andmed } = koopia;

  try {
    if (alus.startsWith("sisu.")) {
      const kood = alus.slice("sisu.".length);
      if (!onKeel(kood)) {
        return { ok: false, viga: "Tundmatu keel varukoopia nimes." };
      }

      /*
        Keelefailis EI OLE tekstikujusid (need elavad ühises failis), seega
        kirjutame ainult tekstid. puhasta() annab alati ka tekstiKujud-võtme —
        see tuleb enne kirjutamist maha võtta, muidu tekiks keelefaili teine,
        alati tühi kaart.
      */
      const puhastatud = puhasta(vaikimisiSisu(kood), andmed);
      delete puhastatud[TEKSTIKUJUDE_VOTI];
      await salvestaTekstid(kood, puhastatud);
    } else if (alus === "tekstikujud") {
      await salvestaKujud(andmed);
    } else if (alus === "kujundus") {
      await salvestaKujundus(andmed);
    } else if (alus === "kalender") {
      await salvestaKalender(andmed);
    } else {
      return { ok: false, viga: `Seda liiki koopiat ei oska taastada: ${alus}` };
    }
  } catch (viga) {
    return { ok: false, viga: `Taastamine ebaõnnestus: ${viga.message}` };
  }

  await logi({ liik: "taasta", koopia: nimi, alus });

  revalidatePath("/", "layout");
  revalidatePath("/admin/varukoopiad");

  return { ok: true, sonum: `Taastatud koopiast ${nimi}.` };
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

  const keelteSisud = await Promise.all(
    KEELED.map(({ kood }) => laeSisu(kood)),
  );
  const galeriis = keelteSisud.some((sisu) =>
    sisu.fotograafiaGalerii?.pildid?.some((pilt) => pilt.fail === nimi),
  );

  if (galeriis) {
    return {
      ok: false,
      viga:
        "Pilt on fotograafia galeriis kasutusel. Eemalda või vaheta see enne galeriis.",
    };
  }

  if (!(await kustutaTaustaPilt(nimi))) {
    return { ok: false, viga: "Pilti ei õnnestunud kustutada." };
  }

  return { ok: true, pildid: await laeTaustaPildid() };
}
