/*
  VAIKIMISI KUJUNDUS.

  Need väärtused kehtivad seni, kuni admin-lehelt ei ole midagi salvestatud.
  Salvestatud kujundus läheb faili data/kujundus.json ja kirjutab siinsed üle.

  Kuju määratakse siin: tundmatud võtmed failist jäetakse tähelepanuta, nii ei
  lähe leht katki, kui kujundus hiljem täieneb.

  TÄHELEPANU: väärtused peavad olema samad, mis globals.css @theme plokis —
  muidu näeb „Lähtesta” teistsugune välja kui värske leht.
*/

export const vaikimisiKujundus = {
  fondid: {
    kuva: "cormorant",
    tekst: "worksans",
  },

  /*
    Värvid. Võti vastab CSS-muutujale --color-<võti>, kus suurtäht muutub
    sidekriipsuks (goldDeep -> --color-gold-deep). Vt kujundusCss().
  */
  varvid: {
    bone: "#fdfcf9",
    linen: "#f7f5ef",
    shell: "#f0ede5",
    clay: "#e8e4d9",
    claySoft: "#f3f1ea",
    sage: "#e4e3d7",
    rohe: "#4a5a46",
    roheHele: "#5c6e57",
    gold: "#a6862f",
    goldDeep: "#8a6f20",
    mets: "#46543f",
    metsSyva: "#3c4936",
    kuldHele: "#dcc27a",
    luu: "#f4f1e8",
    ink: "#161613",
    inkSoft: "#3d3c37",
    inkFaint: "#6e6c64",
  },

  /* Suurused pikslites — admin-lehel on need liugurid */
  suurused: {
    silt: 15,
    mikro: 15,
    tekst: 18,
    tekstSuur: 21,
  },

  /* Tähevahed em-ühikutes */
  tahevahed: {
    silt: 0.28,
    mikro: 0.16,
    nimi: 0.05,
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
  mets: "Tume sektsioon",
  metsSyva: "Jalus ja mobiilimenüü",
  kuldHele: "Kuld tumedal taustal",
  luu: "Tekst tumedal taustal",
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
