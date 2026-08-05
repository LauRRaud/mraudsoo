import {
  Cormorant_Garamond,
  EB_Garamond,
  Inter,
  Jost,
  Karla,
  Libre_Baskerville,
  Lora,
  Marcellus,
  Playfair_Display,
  Poppins,
  Spectral,
  Work_Sans,
} from "next/font/google";

/*
  Nimekirjad (id, nimi, CSS-muutuja) elavad eraldi failis fondiNimekiri.js,
  sest neid loeb ka sisu puhastus, mis ei tohi next/font'i kaasa tirida.
*/
import {
  KOIK_FONDID,
  KUVA_FONDID,
  TEKSTI_FONDID,
  leiaFont,
} from "./fondiNimekiri";

export { KOIK_FONDID, KUVA_FONDID, TEKSTI_FONDID, leiaFont };

/*
  FONDID.

  MIKS VALIK, MITTE VABA VÄLI:
  fondid laaditakse alla ehituse ajal ja pannakse serverisse kaasa — nii on nad
  kiired ja Google ei näe külastajaid. Seetõttu peavad kõik võimalikud fondid
  olema koodis ette kirjas. Uue fondi lisamine siia nimekirja on väike muudatus.

  MIKS IGA SEADE ERALDI VÄLJA KIRJUTATUD:
  next/font loeb argumente ehituse ajal ja nõuab sõna-sõnalt kirjutatud
  objekti — ühist seadete objekti laiali laotada (`...uhised`) ei saa.

  latin-ext on kohustuslik: ilma selleta puuduvad õ ä ö ü š ž.

  Kuvafondid laaditakse koos PÄRIS kaldkirjaga (style: italic) — kaldkirjas
  alapealkirjad ja rõhud on kujunduskeele osa ning brauseri võltskaldkiri
  rikuks serifi joonise. Marcellusel kaldkirja lõiget ei ole.
*/

/* Pealkirjafondid */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-ebgaramond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Tekstifondid */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-worksans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/*
  ÜKSIKU TEKSTI FONDID.

  Need on mõeldud erandiks — üksikule pealkirjale või tsitaadile admin-lehelt
  valimiseks, mitte kogu lehe kandmiseks. Seepärast preload: false: fail
  laaditakse alles siis, kui mõni tekst seda päriselt kasutab. Ilma selleta
  eellaeks brauser iga kord kõik fondid, ka need, mida keegi ei vali.
*/
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
});

/* Kõik klassid korraga <html> külge, et iga font oleks kättesaadav */
export const koikFondiKlassid = [
  cormorant.variable,
  playfair.variable,
  ebGaramond.variable,
  marcellus.variable,
  lora.variable,
  spectral.variable,
  baskerville.variable,
  poppins.variable,
  jost.variable,
  workSans.variable,
  inter.variable,
  karla.variable,
].join(" ");

export function leiaKuvaFont(id) {
  return KUVA_FONDID.find((f) => f.id === id) ?? KUVA_FONDID[0];
}

export function leiaTekstiFont(id) {
  return TEKSTI_FONDID.find((f) => f.id === id) ?? TEKSTI_FONDID[0];
}
