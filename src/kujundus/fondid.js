import {
  Cormorant_Garamond,
  EB_Garamond,
  Jost,
  Lora,
  Marcellus,
  Playfair_Display,
  Poppins,
  Work_Sans,
} from "next/font/google";

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
*/

/* Pealkirjafondid */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-ebgaramond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
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
  Nimekirjad admin-lehe jaoks. `muutuja` on see CSS-muutuja, mille next/font
  tekitab; `nimi` on see, mida Marta admin-lehel näeb.
*/
export const KUVA_FONDID = [
  {
    id: "cormorant",
    nimi: "Cormorant Garamond",
    muutuja: "--font-cormorant",
    kirjeldus: "elegantne, kõrge kontrastiga",
  },
  {
    id: "playfair",
    nimi: "Playfair Display",
    muutuja: "--font-playfair",
    kirjeldus: "tugevam, ajakirjalik",
  },
  {
    id: "ebgaramond",
    nimi: "EB Garamond",
    muutuja: "--font-ebgaramond",
    kirjeldus: "klassikaline, rahulik",
  },
  {
    id: "marcellus",
    nimi: "Marcellus",
    muutuja: "--font-marcellus",
    kirjeldus: "kivisse raiutud, väärikas",
  },
  {
    id: "lora",
    nimi: "Lora",
    muutuja: "--font-lora",
    kirjeldus: "pehme, hästi loetav",
  },
];

export const TEKSTI_FONDID = [
  {
    id: "poppins",
    nimi: "Poppins",
    muutuja: "--font-poppins",
    kirjeldus: "geomeetriline, ümar",
  },
  {
    id: "jost",
    nimi: "Jost",
    muutuja: "--font-jost",
    kirjeldus: "geomeetriline, kitsam",
  },
  {
    id: "worksans",
    nimi: "Work Sans",
    muutuja: "--font-worksans",
    kirjeldus: "neutraalne, hea pikas tekstis",
  },
];

/* Kõik klassid korraga <html> külge, et iga font oleks kättesaadav */
export const koikFondiKlassid = [
  cormorant.variable,
  playfair.variable,
  ebGaramond.variable,
  marcellus.variable,
  lora.variable,
  poppins.variable,
  jost.variable,
  workSans.variable,
].join(" ");

export function leiaKuvaFont(id) {
  return KUVA_FONDID.find((f) => f.id === id) ?? KUVA_FONDID[0];
}

export function leiaTekstiFont(id) {
  return TEKSTI_FONDID.find((f) => f.id === id) ?? TEKSTI_FONDID[0];
}
