/*
  BRONEERINGUD — salvestamine ja e-kirja saatmine.

  Kaks eraldi asja, tahtlikult selles järjekorras:

    1. Broneering KIRJUTATAKSE alati faili `data/broneeringud.json`.
    2. Alles siis proovitakse saata e-kiri.

  Kui e-post ei ole seadistatud või saatmine ebaõnnestub, EI lähe soov kaduma —
  Marta näeb seda admin-lehel. Külastajale öeldakse mõlemal juhul, et soov
  jõudis kohale, sest tema jaoks see nii ongi.

  E-posti seadistus tuleb keskkonnamuutujatest (vt README). Ilma nendeta
  jääb saatmine lihtsalt vahele.
*/

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const kaust = path.join(process.cwd(), "data");
const failiTee = path.join(kaust, "broneeringud.json");

/* Hoiame viimased 500 soovi — vanemad kukuvad välja, et fail ei kasvaks lõputult */
const MAX_KIRJEID = 500;

async function loeKoik() {
  try {
    const toores = await readFile(failiTee, "utf8");
    const andmed = JSON.parse(toores);
    return Array.isArray(andmed) ? andmed : [];
  } catch {
    /* Faili ei ole veel või on vigane — alustame tühjalt */
    return [];
  }
}

/*
  Kirjutame ajutisse faili ja nihutame kohale. Nii ei jää faili poolikut
  sisu, kui protsess katkeb keset kirjutamist.
*/
async function kirjutaKoik(kirjed) {
  await mkdir(kaust, { recursive: true });
  const ajutine = `${failiTee}.tmp`;
  await writeFile(ajutine, `${JSON.stringify(kirjed, null, 2)}\n`, "utf8");
  await rename(ajutine, failiTee);
}

export async function loeBroneeringud() {
  const kirjed = await loeKoik();
  /* Uuemad ette */
  return kirjed.slice().reverse();
}

export async function lisaBroneering(kirje) {
  const kirjed = await loeKoik();
  kirjed.push(kirje);
  await kirjutaKoik(kirjed.slice(-MAX_KIRJEID));
}

export async function markiLoetuks(id, loetud) {
  const kirjed = await loeKoik();
  const leitud = kirjed.find((k) => k.id === id);
  if (!leitud) return false;
  leitud.loetud = Boolean(loetud);
  await kirjutaKoik(kirjed);
  return true;
}

/* Kas e-posti saatmine on seadistatud */
export function onPostSeadistatud() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_KASUTAJA && process.env.SMTP_PAROOL,
  );
}

/*
  Saadab teavituse Martale. Vastuvõtja on SMTP_SAAJA või vaikimisi
  SMTP_KASUTAJA. Vastamisaadressiks paneme külastaja e-posti, nii saab
  Marta lihtsalt „Vasta" vajutada.
*/
export async function saadaTeavitus(kirje, saaja) {
  if (!onPostSeadistatud()) {
    return { ok: false, pohjus: "SMTP ei ole seadistatud" };
  }

  /* Import siin, mitte failipeas — moodulit ei laadita, kui saatmist ei toimu */
  const { createTransport } = await import("nodemailer");

  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_KASUTAJA,
      pass: process.env.SMTP_PAROOL,
    },
  });

  const read = [
    /*
      Keel ainult siis, kui see ei ole eesti oma: ingliskeelne soov vajab
      ingliskeelset vastust ja see peab kirja avades kohe silma jääma.
    */
    kirje.keel && kirje.keel !== "et" ? `Keel: ${kirje.keel.toUpperCase()}` : null,
    `Nimi: ${kirje.nimi}`,
    `E-post: ${kirje.epost}`,
    kirje.telefon ? `Telefon: ${kirje.telefon}` : null,
    kirje.teenus ? `Teenus: ${kirje.teenus}` : null,
    kirje.kuupaevad?.length
      ? `Sobivad kuupäevad:\n${kirje.kuupaevad.map((k) => `  - ${k}`).join("\n")}`
      : null,
    kirje.kellaajad?.length ? `Sobiv kellaaeg: ${kirje.kellaajad.join(", ")}` : null,
    "",
    kirje.sonum,
  ].filter((rida) => rida !== null);

  await transport.sendMail({
    from: `"martaraudsoo.com" <${process.env.SMTP_KASUTAJA}>`,
    to: saaja || process.env.SMTP_SAAJA || process.env.SMTP_KASUTAJA,
    replyTo: kirje.epost,
    subject: kirje.teenus
      ? `Broneerimissoov: ${kirje.teenus}`
      : "Broneerimissoov",
    text: read.join("\n"),
  });

  return { ok: true };
}
