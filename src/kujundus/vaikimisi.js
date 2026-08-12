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
      Bone ja linen on teadlikult sama peaaegu-valge: kõrvuti sektsioonide
      vahele ei teki juhuslikku triipu ja rõhupaneel seisab ühesuguse tooni
      peal nii ülalt kui alt. Sage on soe elevandiluu — üks kraad soojem,
      mitte liivakarva ega hallikasroheline.
    */
    bone: "#fdfcfa",
    linen: "#fdfcfa",
    sage: "#f7f4ec",
    /*
      Mobiilimenüü paneel on sama soe elevandiluu, mis salmisektsioon. Eraldi
      muutuja on tal sellepärast, et menüüd saaks värvida ilma salmisektsiooni
      puutumata — mitte sellepärast, et ta oleks teist tooni.

      PÄISERIBA SIIA EI KUULU: seal proovitud, seal maha võetud — riba jäi lehe
      valge kohale nähtava astmena seisma. Päis kannab lehe põhitausta (bone).
    */
    menyy: "#f7f4ec",
    rohe: "#315348",
    roheHele: "#42685b",
    gold: "#a6862f",
    goldDeep: "#8a6f20",
    mets: "#29483f",
    metsSyva: "#20382f",
    kuldHele: "#dcc27a",
    luu: "#f4f1e8",
    ink: "#161613",
    inkSoft: "#3d3c37",
    inkFaint: "#6e6c64",
  },

  /* Suurused pikslites — admin-lehel on need liugurid */
  suurused: {
    /* 24, mitte 16: kuldne hõredalt tähestatud silt kadus 16 juures ära ning
       ka 18 ja 21 lugesid suure pealkirja kõrval märkusena. Teine pool
       parandusest on kaal 600 globals.css-is — silt jääb peen, mitte suur. */
    silt: 24,
    /* 16. Sai korra 18-ks tõstetud, et menüü seisaks päises Marta nime (36 px)
       kõrval kindlamalt — ekraanil luges see aga jämedalt ja rida läks
       päises kitsaks. Suurus jäi 16 peale ja menüü sai selguse mujalt:
       õhem kaal ning keelevahetus omaette paremasse nurka (vt Pais.js). */
    mikro: 16,
    tekst: 18,
    tekstSuur: 21,
  },

  /*
    SAMAD SUURUSED TELEFONI JAOKS (alla 640 px).

    Need neli suurust on kindlad pikslid, mitte clamp — seega kehtis üks
    väärtus korraga nii lauaarvutis kui telefonis ja üks ots jäi alati valeks.
    Siin on teine komplekt, mis kehtib ainult kitsal ekraanil.

    Vaikimisi on väärtused samad mis ülal: kes midagi ei muuda, ei näe mingit
    vahet. Salvestatud failis puuduv väärtus võtab LAUAARVUTI oma, mitte
    siinse vaikeväärtuse — vt puhastaKujundus() failis lae.js.
  */
  suurusedMobiil: {
    /* Sama 24 mis arvutis. Kui pikk silt („KOLM SAMMU KOOS”) telefonis
       murdub, on selle jaoks siin oma liugur — arvutit see ei puuduta. */
    silt: 24,
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
               0 (vaikimisi) = pilt täies tugevuses, 1 = paneeli värv on
               täiesti tagasi ja pilti ei paista. Vahepealne toob värvi
               pildi peale ja teeb teksti loetavamaks.
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
      "Lehe heledad pinnad. Esimesed kaks PEAVAD jääma sama tooni — rõhupaneel seisab nende vahel ja erinev toon ülal ja all annab paneelile nähtava astme. Kolmas on rõhupaneel ise: kraad soojem elevandiluu, mitte liivakarva. Neljas on menüü, mis seisab sama elevandiluu peal. Kõigil neil pinnal on kiri tume — hoia toonid heledana, muidu kaob menüü ja salmide tekst ära.",
    varvid: [
      { votme: "bone", nimi: "Lehe taust", kus: "Avaleht ülevalt ja enamik sektsioone" },
      { votme: "linen", nimi: "Lehe taust — teine roll", kus: "Teenuste register, lood ja nimekirjad; hoia sama väärtus mis „Lehe taust”" },
      { votme: "sage", nimi: "Soe rõhupaneel", kus: "Kirjakohad ja salmid, kutseplokid, teenuse päis" },
      { votme: "menyy", nimi: "Menüü", kus: "Päiseriba ja avatud menüü telefonis — vaikimisi sama toon mis „Soe rõhupaneel”" },
    ],
  },
  {
    nimi: "Tume pühamu",
    selgitus:
      "Lehe kõige isiklikumad kohad seisavad sügaval eukalüptirohelisel. Nendel pindadel vahetuvad ka tekstivärvid (vt „Kiri tumedal pinnal”).",
    varvid: [
      { votme: "mets", nimi: "Tume sektsioon", kus: "Liikumine avalehel, pöördumislugu, Stiiliteekond" },
      { votme: "metsSyva", nimi: "Jalus ja teenuse päis", kus: "Lehe lõpp ja teenuse alamlehe päis" },
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
