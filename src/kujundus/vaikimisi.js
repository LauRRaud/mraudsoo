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
    /*
      Heledaid pindu on KOLM, mitte rohkem. Varem oli kuus (bone, linen,
      shell, clay, claySoft, sage) — vahe kahe naabri vahel jäi ühe protsendi
      kanti, seega admin-lehel oli kuus peaaegu ühesugust ruutu ja polnud
      võimalik aru saada, kumb neist millise sektsiooni all on. Kolm astet
      on ainsad, mis päriselt eristuvad.
    */
    bone: "#fdfcf9",
    linen: "#f7f5ef",
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
    silt: 16,
    mikro: 16,
    tekst: 18,
    tekstSuur: 21,
  },

  /* Tähevahed em-ühikutes */
  tahevahed: {
    silt: 0.28,
    mikro: 0.16,
    nimi: 0.05,
  },

  /*
    SEKTSIOONIDE TAUSTAPILDID.

    Võti on sektsiooni tee registrist (src/kujundus/sektsioonid.js), väärtus
    { pilt, kate, asetus }. Vaikimisi tühi: taust on värv, pilt on erand.

      pilt   — failinimi kaustas data/taustad (serveeritakse /taustad/<nimi>)
      kate   — sektsiooni pinnavärvi läbipaistmatus pildi peal, 0…1.
               Mida kõrgem, seda vaiksem pilt. Alla 0,5 ei lasta, sest
               tekst kaob.
      asetus — mis osa pildist raami jääb (vt ASETUSED)
  */
  taustad: {},
};

/*
  VÄRVID RÜHMADENA — admin-lehe jaoks.

  Rühm ütleb, MIS ASJA värv on (pind, nupp, kiri), ja `kus` ütleb, KUS seda
  lehel näeb. Ilma selleta on värvivalija seitseteist ühesugust ruutu ja
  muutmine käib katse-eksituse teel.

  Järjekord siin määrab järjekorra admin-lehel. Iga võti peab olema olemas
  vaikimisiKujundus.varvid all — mida siin ei ole, seda ei saa ka muuta.
*/
export const VARVI_RUHMAD = [
  {
    nimi: "Pinnad",
    selgitus:
      "Sektsioonide taustad lehe heledas osas. Leht vaheldab neid, et kõrvuti sektsioonid teineteisest eristuksid — seepärast on neid kolm, mitte rohkem.",
    varvid: [
      { votme: "bone", nimi: "Lehe taust", kus: "Avaleht ülevalt, enamik sektsioone" },
      { votme: "linen", nimi: "Vahelduv paneel", kus: "Iga teine sektsioon — teenuste register, lood, nimekirjad" },
      { votme: "sage", nimi: "Rõhutatud paneel", kus: "Kirjakohad ja salmid, kutseplokid, teenuse päis" },
    ],
  },
  {
    nimi: "Tume pühamu",
    selgitus:
      "Lehe kõige isiklikumad kohad seisavad sügavrohelisel. Nendel pindadel vahetuvad ka tekstivärvid (vt „Kiri tumedal pinnal”).",
    varvid: [
      { votme: "mets", nimi: "Tume sektsioon", kus: "Liikumine avalehel, pöördumislugu, Stiiliteekond" },
      { votme: "metsSyva", nimi: "Jalus ja mobiilimenüü", kus: "Lehe lõpp ja avatud menüü telefonis" },
    ],
  },
  {
    nimi: "Nupud",
    selgitus: "Nupu täidis. Nupu kiri on valge, seepärast peab toon jääma tumedaks.",
    varvid: [
      { votme: "rohe", nimi: "Nupp", kus: "„Broneeri aeg” ja muud nupud" },
      { votme: "roheHele", nimi: "Nupp hiire all", kus: "Sama nupp, kui hiir on peal" },
    ],
  },
  {
    nimi: "Kuld",
    selgitus:
      "Rõhuvärv. Hele kuld on loetav ainult suures kirjas, tume kuld ka tekstisuuruses — seepärast on neid kaks.",
    varvid: [
      { votme: "gold", nimi: "Kuld — suured pealkirjad", kus: "Kuvakirjas read, jooned, püstjooned" },
      { votme: "goldDeep", nimi: "Kuld — sildid ja lingid", kus: "SUURTÄHTEDES sildid sektsioonide kohal" },
      { votme: "kuldHele", nimi: "Kuld tumedal pinnal", kus: "Sildid ja jooned rohelistel sektsioonidel" },
    ],
  },
  {
    nimi: "Kiri",
    selgitus: "Teksti värvid. Kolm esimest on heledal pinnal, viimane tumedal.",
    varvid: [
      { votme: "ink", nimi: "Pealkirjad", kus: "Suured pealkirjad ja tsitaadid" },
      { votme: "inkSoft", nimi: "Põhitekst", kus: "Tavalised lõigud" },
      { votme: "inkFaint", nimi: "Kõrvaline tekst", kus: "Kuupäevad, märkused, vaiksem info" },
      { votme: "luu", nimi: "Kiri tumedal pinnal", kus: "Kogu tekst rohelistel sektsioonidel ja jaluses" },
    ],
  },
];

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
