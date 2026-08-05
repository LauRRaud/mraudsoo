/*
  FONDIDE NIMEKIRI — paljas metaandmestik.

  See fail on MEELEGA ilma next/font impordita: teda loevad nii kujundus
  (src/kujundus/fondid.js), admini valikud kui ka sisu puhastus
  (src/sisu/tekstikujud.js). Sisumoodul ei tohi next/font'i kaasa tirida —
  see käivitub ka väljaspool Next'i kompilaatorit (abiskriptid, kontrollid).

  `muutuja` on CSS-muutuja, mille next/font tekitab; `ruhm` ütleb, kas font
  on mõeldud pealkirjadeks või jooksvaks tekstiks. Tegelik laadimine ja
  kaalude valik on failis fondid.js — kui lisad siia rea, lisa see ka sinna.
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
  {
    id: "spectral",
    nimi: "Spectral",
    muutuja: "--font-spectral",
    kirjeldus: "sooja joonisega, kirjanduslik",
  },
  {
    id: "baskerville",
    nimi: "Libre Baskerville",
    muutuja: "--font-baskerville",
    kirjeldus: "laiem, raamatulik",
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
  {
    id: "inter",
    nimi: "Inter",
    muutuja: "--font-inter",
    kirjeldus: "selge ja tänapäevane",
  },
  {
    id: "karla",
    nimi: "Karla",
    muutuja: "--font-karla",
    kirjeldus: "sõbralik, veidi omanäoline",
  },
];

/* Kõik fondid koos — üksiku teksti fondivalikuks admin-lehel */
export const KOIK_FONDID = [
  ...KUVA_FONDID.map((font) => ({ ...font, ruhm: "kuva" })),
  ...TEKSTI_FONDID.map((font) => ({ ...font, ruhm: "tekst" })),
];

export function leiaFont(id) {
  return KOIK_FONDID.find((font) => font.id === id) ?? null;
}
