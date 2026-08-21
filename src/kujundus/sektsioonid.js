/*
  SEKTSIOONIDE REGISTER — taustapiltide jaoks.

  Lubatud võtmete nimekiri: admin-lehelt saab taustapildi anda AINULT siin
  loetletud sektsioonile. Sama muster nagu tekstikujudel — puhastus viskab
  tundmatu võtme välja, sest väärtus läheb CSS-i sisse.

  Uue sektsiooni lisamine nõuab KAHTE sammu:
    1. rida siia,
    2. `taustaVoti="<võti>"` sektsioonile leheküljel.
  Ainult ühe tegemine annab admini, mis lubab pildi valida, aga lehel ei
  juhtu midagi. Kaetust kontrollib `npm run kontrolli-taustad`.

  Võti on lehe nimi + punkt + sektsiooni nimi. Punkt on CSS-selektoris
  jutumärkide sees ohutu (vt kujundusCss).
*/
export const TAUSTA_SEKTSIOONID = [
  {
    leht: "Avaleht",
    sektsioonid: [
      { votme: "avaleht.hero", nimi: "Päis — nimi, juhtlause ja portree" },
      { votme: "avaleht.kutsumus", nimi: "Kutsumus" },
      { votme: "avaleht.liikumine", nimi: "Liikumine", tume: true },
      { votme: "avaleht.essents", nimi: "Sinu unikaalne essents" },
      { votme: "avaleht.kirjakoht", nimi: "Kirjakoht" },
      { votme: "avaleht.teenused", nimi: "Teenuste register" },
      { votme: "avaleht.minust", nimi: "Minust — foto ja tsitaat" },
      { votme: "avaleht.kutse", nimi: "Kutse lehe lõpus" },
    ],
  },
  {
    leht: "Minust",
    sektsioonid: [
      { votme: "minust.hero", nimi: "Päis — sissejuhatus ja foto" },
      { votme: "minust.lugu", nimi: "Minu lugu" },
      { votme: "minust.kirjakoht", nimi: "Kirjakoht" },
      { votme: "minust.poordumine", nimi: "Pöördumislugu", tume: true },
      { votme: "minust.salmid", nimi: "Loo kirjakohad" },
      { votme: "minust.annid", nimi: "Annid" },
      { votme: "minust.foto", nimi: "Horisontaalne foto ja tsitaat" },
      { votme: "minust.terviklikkus", nimi: "Terviklik inimene" },
      { votme: "minust.lopetuseks", nimi: "Lõpetuseks" },
    ],
  },
  {
    leht: "Teenused",
    sektsioonid: [
      { votme: "teenused.hero", nimi: "Päis" },
      { votme: "teenused.register", nimi: "Teenuste register" },
      { votme: "teenused.tsitaat", nimi: "Marta lause teenuste kohta" },
      { votme: "teenused.lopp", nimi: "Kutse lehe lõpus" },
    ],
  },
  {
    /* Üks kord kõigi teenuste kohta — teenuse alamleht on sama ehitus */
    leht: "Teenuse leht (kõik teenused korraga)",
    sektsioonid: [
      { votme: "teenuseLeht.hero", nimi: "Päis — teenuse nimi", tume: true },
      { votme: "teenuseLeht.sissejuhatus", nimi: "Sissejuhatus" },
      { votme: "teenuseLeht.kirjakoht", nimi: "Sissejuhatuse kirjakoht" },
      { votme: "teenuseLeht.ahel", nimi: "Vertikaalne mõtteahel", tume: true },
      { votme: "teenuseLeht.plokid", nimi: "Teenuse plokid" },
      { votme: "teenuseLeht.portfoolio", nimi: "Fotograafia portfoolio", tume: true },
      { votme: "teenuseLeht.tsitaat", nimi: "Teenuse tsitaat" },
      { votme: "teenuseLeht.nimekiri", nimi: "„Mida see annab” loend" },
      { votme: "teenuseLeht.kutse", nimi: "Kutse ja järgmine teenus" },
    ],
  },
  {
    leht: "Hinnakiri",
    sektsioonid: [
      { votme: "hinnakiri.hero", nimi: "Päis" },
      { votme: "hinnakiri.uksikteenused", nimi: "Üksikteenused" },
      { votme: "hinnakiri.teekond", nimi: "Stiiliteekond", tume: true },
      { votme: "hinnakiri.tsitaat", nimi: "Marta lause väärtusest" },
      { votme: "hinnakiri.lopp", nimi: "Kutse lehe lõpus" },
    ],
  },
  {
    leht: "Broneerimine",
    sektsioonid: [
      { votme: "broneerimine.hero", nimi: "Päis" },
      { votme: "broneerimine.vorm", nimi: "Broneerimisvorm" },
      { votme: "broneerimine.kirjakoht", nimi: "Kirjakoht lõpetuseks" },
    ],
  },
  {
    leht: "Blogi",
    sektsioonid: [
      { votme: "blogi.hero", nimi: "Päis" },
      { votme: "blogi.register", nimi: "Postituste nimekiri" },
      { votme: "blogiPostitus.hero", nimi: "Postitus — päis" },
      { votme: "blogiPostitus.sisu", nimi: "Postitus — tekst" },
    ],
  },
  {
    leht: "Vabad lehed",
    sektsioonid: [{ votme: "vabaLeht.hero", nimi: "Päis" }],
  },
];

/* Lame nimekiri — puhastus ja kaetuse kontroll käivad selle järgi */
export const TAUSTA_VOTMED = TAUSTA_SEKTSIOONID.flatMap((ruhm) =>
  ruhm.sektsioonid.map((s) => s.votme),
);

export function onTaustaVoti(votme) {
  return TAUSTA_VOTMED.includes(votme);
}

/*
  Pildi asetus raamis. Portreefoto keskkoht on rind — laias sektsioonis
  tähendab „keskel” sageli lõuga, seepärast on valik olemas.
*/
export const ASETUSED = {
  keskel: "center",
  ulevalt: "top",
  alt: "bottom",
};

export const ASETUSE_NIMED = {
  keskel: "Keskelt",
  ulevalt: "Ülevalt",
  alt: "Alt",
};
