/*
  VAIKIMISI KUJUNDUS.

  Need väärtused kehtivad seni, kuni admin-lehelt ei ole midagi salvestatud.
  Salvestatud kujundus läheb faili data/kujundus.json ja kirjutab siinsed üle.

  Kuju määratakse siin: tundmatud võtmed failist jäetakse tähelepanuta, nii ei
  lähe leht katki, kui kujundus hiljem täieneb.
*/

export const vaikimisiKujundus = {
  fondid: {
    kuva: "cormorant",
    tekst: "poppins",
  },

  /*
    Värvid. Võti vastab CSS-muutujale --color-<võti>, kus suurtäht muutub
    sidekriipsuks (goldDeep -> --color-gold-deep). Vt kujundusCss().
  */
  varvid: {
    bone: "#ffffff",
    linen: "#f7f6f4",
    shell: "#efeeeb",
    clay: "#e9e7e3",
    claySoft: "#f2f1ee",
    sage: "#e3e1dd",
    rohe: "#4a5a46",
    roheHele: "#5c6e57",
    gold: "#a6862f",
    goldDeep: "#8a6f20",
    ink: "#121212",
    inkSoft: "#3b3b3b",
    inkFaint: "#6e6e6e",
  },

  /* Suurused pikslites — admin-lehel on need liugurid */
  suurused: {
    silt: 18,
    mikro: 17,
    tekst: 18,
    tekstSuur: 20,
  },

  /* Tähevahed em-ühikutes */
  tahevahed: {
    silt: 0.2,
    mikro: 0.14,
    nimi: 0.06,
  },
};

/* Inimloetavad nimed admin-lehe jaoks */
export const VARVI_NIMED = {
  bone: "Lehe põhitaust",
  linen: "Hele paneel",
  shell: "Tumedam paneel",
  clay: "Rahulik paneel",
  claySoft: "Kõige heledam paneel",
  sage: "Tumedaim hele paneel",
  rohe: "Nupud",
  roheHele: "Nupud (hiirega peal)",
  gold: "Kuld — suured pealkirjad",
  goldDeep: "Kuld — sildid ja lingid",
  ink: "Tekst — pealkirjad",
  inkSoft: "Tekst — põhitekst",
  inkFaint: "Tekst — kõrvaline",
};

export const SUURUSE_NIMED = {
  silt: "Sektsioonisildid (KULDSED SUURTÄHED)",
  mikro: "Nupud ja menüü",
  tekst: "Põhitekst",
  tekstSuur: "Juhtlõik",
};

export const TAHEVAHE_NIMED = {
  silt: "Sektsioonisildid",
  mikro: "Nupud ja menüü",
  nimi: "Lehe nimi päises",
};
