/*
  KEELED.

  Leht on kahes keeles. Eesti keel on VAIKEKEEL ja seisab ilma prefiksita
  (/minust), inglise keel prefiksiga (/en/minust). Nii jäid kõik senised
  aadressid kehtima — proxy.js kirjutab /minust seesmiselt ümber /et/minust
  peale, kuid brauseri aknas jääb vana aadress alles.

  Siin failis ei tohi olla ühtegi Next'i importi: teda loevad ka proxy,
  kliendikomponendid ja abiskriptid.
*/

export const VAIKEKEEL = "et";

/*
  Päis, mille proxy.js igale päringule külge paneb.

  Vaja on teda ühe koha jaoks: not-found.js EI SAA parameetreid (vt Next'i
  dokumentatsioon, „not-found.js components do not accept any props”), seega
  ei tea ta muidu, mis keeles 404-leht peaks olema. Kõik ülejäänud kohad
  loevad keele marsruudi segmendist [keel], mitte siit.
*/
export const KEELE_PAIS = "x-mr-keel";

/*
  silt   — mida näidatakse keelevahetuses (EST · ENG)
  html   — <html lang="…">
  og     — OpenGraph locale
  lokaat — kuupäevade vormindamiseks (toLocaleDateString)
*/
export const KEELED = [
  {
    kood: "et",
    silt: "EST",
    nimi: "Eesti keeles",
    html: "et",
    og: "et_EE",
    lokaat: "et-EE",
  },
  {
    kood: "en",
    silt: "ENG",
    nimi: "In English",
    html: "en",
    og: "en_GB",
    lokaat: "en-GB",
  },
];

export const KEELEKOODID = KEELED.map((keel) => keel.kood);

export function onKeel(keel) {
  return typeof keel === "string" && KEELEKOODID.includes(keel);
}

/* Tundmatu väärtus annab alati vaikekeele — leht ei tohi keele pärast katki minna */
export function keeleks(keel) {
  return onKeel(keel) ? keel : VAIKEKEEL;
}

export function leiaKeel(keel) {
  const kood = keeleks(keel);
  return KEELED.find((k) => k.kood === kood);
}

/*
  SISEMINE AADRESS KEELES.

      tee("et", "/minust")  ->  /minust
      tee("en", "/minust")  ->  /en/minust
      tee("en", "/")        ->  /en

  Kasuta seda KÕIGIS sisemistes linkides. Ankrud (#lugu) ja välised aadressid
  käivad mööda — need ei ole marsruudid.
*/
export function tee(keel, rada = "/") {
  const puhas = typeof rada === "string" && rada.startsWith("/") ? rada : "/";
  const kood = keeleks(keel);

  if (kood === VAIKEKEEL) return puhas;
  return puhas === "/" ? `/${kood}` : `/${kood}${puhas}`;
}

/*
  HREFLANG — sama leht teises keeles.

  Iga leht annab oma raja ise (`/minust`, `/teenused/puha-ruum`), sest paari
  saab osutada ainult konkreetse lehe peale. Juurpaigutus seda teha EI SAA:
  seal antud alternatiivid päriks iga leht, mis omi ei anna, ja siis viitaks
  /minust hreflang avalehele.

  metadataBase (vt src/app/[keel]/layout.js) teeb neist absoluutsed aadressid.
*/
export function keeleAlternatiivid(keel, rada = "/") {
  const keeled = Object.fromEntries(
    KEELED.map((k) => [k.html, tee(k.kood, rada)]),
  );

  return {
    canonical: tee(keel, rada),
    languages: { ...keeled, "x-default": tee(VAIKEKEEL, rada) },
  };
}

/*
  Aadress ilma keeleprefiksita. Keelevahetus vajab seda: kasutaja peab jääma
  samale lehele, ainult teise keelde.

      ilmaKeeleta("/en/teenused/puha-ruum")  ->  /teenused/puha-ruum
      ilmaKeeleta("/minust")                 ->  /minust

  MIKS KA VAIKEKEELE PREFIKS MAHA võetakse, kuigi aadressiribal seda ei ole:
  brauseris seisab /minust, aga seesmiselt on marsruut /et/minust (proxy.js
  rewrite). usePathname() peaks andma brauseri oma raja, kuid kui ta annaks
  seesmise, kaoks keelevahetuse link katki. Mõlema variandi lubamine teeb
  selle küsimuse olematuks.

  Hind: omaloodud lehe slug ei tohi olla „et” ega „en”. See on niikuinii
  kinni — /et suunatakse juurele ja /en on inglise pool.
*/
export function ilmaKeeleta(rada) {
  const puhas = typeof rada === "string" && rada.startsWith("/") ? rada : "/";

  for (const kood of KEELEKOODID) {
    if (puhas === `/${kood}`) return "/";
    if (puhas.startsWith(`/${kood}/`)) return puhas.slice(kood.length + 1);
  }

  return puhas;
}
