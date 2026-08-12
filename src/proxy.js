import { NextResponse } from "next/server";
import { KEELEKOODID, KEELE_PAIS, VAIKEKEEL } from "./sisu/keeled.js";

/*
  KEELE MARSRUUTIMINE.

  Next 16 nimetab selle „Proxy” (varem „Middleware”) — vt
  node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
  Fail peab olema src-i juures, `app`-iga samal tasemel.

  KOLM REEGLIT:

  1. /en/... jääb rahule. See on ingliskeelne pool ja marsruut src/app/[keel]
     tunneb ta ise ära.

  2. Kõik muu KIRJUTATAKSE ÜMBER /et/... peale. Rewrite, MITTE redirect:
     brauseri aknas jääb /minust alles, senised lingid ja järjehoidjad
     kehtivad edasi ning eesti pool ei saa endale prefiksit, mida tal enne
     ei olnud.

  3. /et/... suunatakse tagasi puhtale aadressile. Muidu vastaks sama sisu
     kahe aadressi peal ja otsingumootor loeks selle kordusena.

  MIDA EI PUUDUTATA: admin (tal on oma juurpaigutus ja ainult eesti keel),
  serveritegevused ja marsruudikäsitlejad (/taustad), Next'i oma teed
  (_next), lehe ikoonid ning kõik staatilised failid kaustast public —
  nende ümberkirjutamine tähendaks 404-t.
*/

/* Keeled, mis seisavad aadressis prefiksina (vaikekeel ei seisa) */
const PREFIKSIGA = KEELEKOODID.filter((kood) => kood !== VAIKEKEEL);

/* Harud, mis ei ole keelega marsruudid */
const OMA_HARUD = ["/admin", "/api", "/taustad", "/icon", "/apple-icon"];

function jataRahule(tee) {
  if (tee.startsWith("/_next")) return true;

  if (OMA_HARUD.some((haru) => tee === haru || tee.startsWith(`${haru}/`))) {
    return true;
  }

  /* Laiendiga nimi = staatiline fail (favicon.ico, /pildid/…jpg, robots.txt) */
  return /\.[^/]+$/.test(tee);
}

function algabKeelega(tee, kood) {
  return tee === `/${kood}` || tee.startsWith(`/${kood}/`);
}

/*
  Keel käib päringu päisena kaasa. Seda loeb ainult not-found.js, kes
  parameetreid ei saa — vt KEELE_PAIS failis src/sisu/keeled.js.
*/
function keelePaised(paring, kood) {
  const paised = new Headers(paring.headers);
  paised.set(KEELE_PAIS, kood);
  return paised;
}

export function proxy(paring) {
  const tee = paring.nextUrl.pathname;

  if (jataRahule(tee)) return undefined;

  /* 1. Juba prefiksiga keel — marsruut saab ise hakkama, ainult päis külge */
  const prefiks = PREFIKSIGA.find((kood) => algabKeelega(tee, kood));
  if (prefiks) {
    return NextResponse.next({
      request: { headers: keelePaised(paring, prefiks) },
    });
  }

  /* 3. Vaikekeele prefiks maha (üks sisu, üks aadress) */
  if (algabKeelega(tee, VAIKEKEEL)) {
    const aadress = paring.nextUrl.clone();
    aadress.pathname = tee.slice(VAIKEKEEL.length + 1) || "/";
    return NextResponse.redirect(aadress, 308);
  }

  /* 2. Ülejäänu on vaikekeele pool — seesmiselt /et ette */
  const aadress = paring.nextUrl.clone();
  aadress.pathname = tee === "/" ? `/${VAIKEKEEL}` : `/${VAIKEKEEL}${tee}`;
  return NextResponse.rewrite(aadress, {
    request: { headers: keelePaised(paring, VAIKEKEEL) },
  });
}

export const config = {
  /* Next'i oma teed jäävad välja juba siin; ülejäänud sõela teeb jataRahule() */
  matcher: ["/((?!_next).*)"],
};
