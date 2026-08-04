/*
  ADMIN — AUTENTIMINE.

  Kogu admin-ala turve on ühes kohas. Kasutajaid ei ole, on ainult üks parool,
  mis tuleb serveri keskkonnamuutujast ADMIN_PAROOL. Kui muutuja puudub, on
  admin LUKUS: ükski sisselogimine ei õnnestu ja login-vaade selgitab, mida
  serveris teha tuleb.

  See fail EI OLE "use server" moodul — siin on ka sünkroonseid abifunktsioone
  ja neid kutsutakse ainult serverist (serverikomponendid ja tegevused.js).
  next/headers ja node:crypto ei saa kliendipaketti sattuda.
*/

import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/* Sessiooniküpsise nimi ja HMAC-i sõnum. Sõnumi muutmine tühistab kõik sessioonid. */
const KUPSISE_NIMI = "mr_sessioon";
const SESSIOONI_SONUM = "mr-admin-v1";

/* 30 päeva sekundites */
const KUPSISE_KESTUS = 60 * 60 * 24 * 30;

/* Piiraja: kuni 8 ebaõnnestunud katset 15 minuti jooksul (sama protsessi kohta) */
const KATSETE_PIIR = 8;
const KATSETE_AKEN = 15 * 60 * 1000;

/*
  Ebaõnnestunud katsete ajatemplid. Mälusisene ja protsessipõhine — server
  taaskäivitub, loend nullitakse. Sellest piisab: eesmärk on aeglustada
  automaatset paroolinuhkimist, mitte pidada auditilogi.
*/
let ebaonnestunudKatsed = [];

/* Kas serveris on parool üldse määratud */
export function onParoolSeatud() {
  const parool = process.env.ADMIN_PAROOL;
  return typeof parool === "string" && parool.length > 0;
}

/*
  SHA-256 räsi. Räsime mõlemad pooled enne võrdlust, et timingSafeEqual saaks
  alati võrdse pikkusega puhvrid — vastasel juhul viskab see erineva pikkuse
  korral vea ja lekitab sellega parooli pikkuse.
*/
function rasi(tekst) {
  return createHash("sha256").update(String(tekst), "utf8").digest();
}

/* Ajakindel võrdlus: kestus ei sõltu sellest, mitmes tähemärk erineb */
function vordleAjakindlalt(a, b) {
  return timingSafeEqual(rasi(a), rasi(b));
}

/*
  Sessioonimärk = HMAC-SHA256(ADMIN_PAROOL, "mr-admin-v1").
  Parool on võti, seega parooli vahetamine serveris muudab märgi ja kõik
  vanad küpsised muutuvad automaatselt kehtetuks. Salajast väärtust küpsises
  ei ole — parooli ennast sealt tuletada ei saa.
*/
function sessiooniMark() {
  return createHmac("sha256", process.env.ADMIN_PAROOL)
    .update(SESSIOONI_SONUM, "utf8")
    .digest("hex");
}

/* Vanad katsed aknast välja ja vastus, kas veel tohib proovida */
function piirajaLubab() {
  const nuud = Date.now();
  ebaonnestunudKatsed = ebaonnestunudKatsed.filter(
    (aeg) => nuud - aeg < KATSETE_AKEN,
  );
  return ebaonnestunudKatsed.length < KATSETE_PIIR;
}

function markiEbaonnestumine() {
  ebaonnestunudKatsed.push(Date.now());
}

/*
  Kas praegusel päringul on kehtiv sessioon.
  Küpsisest loetud märk arvutatakse uuesti ja võrreldakse ajakindlalt.
*/
export async function kasSisseLoginud() {
  if (!onParoolSeatud()) return false;

  const kupsised = await cookies();
  const vaartus = kupsised.get(KUPSISE_NIMI)?.value;
  if (!vaartus) return false;

  return vordleAjakindlalt(vaartus, sessiooniMark());
}

/*
  Sisselogimine. Tagastab { ok: true } või { ok: false, viga: "..." }.
  Veateated on eesti keeles ja tahtlikult napid — nad ei ütle, kas parool oli
  peaaegu õige.
*/
export async function loguSisse(parool) {
  if (!onParoolSeatud()) {
    return {
      ok: false,
      viga:
        "Admin on lukus: serveris ei ole keskkonnamuutujat ADMIN_PAROOL määratud.",
    };
  }

  if (!piirajaLubab()) {
    return { ok: false, viga: "Liiga palju katseid, proovi hiljem uuesti." };
  }

  if (typeof parool !== "string" || parool.length === 0) {
    markiEbaonnestumine();
    return { ok: false, viga: "Sisesta parool." };
  }

  if (!vordleAjakindlalt(parool, process.env.ADMIN_PAROOL)) {
    markiEbaonnestumine();
    return { ok: false, viga: "Parool ei sobi." };
  }

  /* Õnnestus — loend puhtaks, et üks eksimus ei jääks kaua kummitama */
  ebaonnestunudKatsed = [];

  const kupsised = await cookies();
  kupsised.set(KUPSISE_NIMI, sessiooniMark(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: KUPSISE_KESTUS,
  });

  return { ok: true };
}

/* Väljalogimine — küpsis maha */
export async function loguValja() {
  const kupsised = await cookies();
  kupsised.delete(KUPSISE_NIMI);
  return { ok: true };
}
