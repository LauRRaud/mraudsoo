/*
  Kogu lehe tekstiline sisu on koondatud siia ühte faili, et seda saaks muuta
  ilma komponentide koodi puutumata.

  HINNAD on ettepanek ja vajavad Marta lõplikku kinnitust.
  Lähtekoht: Stiiliteekond (kolm stiiliteenust koos) 400–500 € vahemikus.
  Üksikteenused on hinnastatud nii, et koos ostes jääb väike sääst.
*/

export const kontakt = {
  email: "martaraudsoo@gmail.com",
  instagram: "https://www.instagram.com/martaraudsoo/",
  instagramNimi: "@martaraudsoo",
  facebook: "https://www.facebook.com/marta.raudsoo",
  substack: "https://substack.com/@martaraudsoo",
};

export const navi = [
  { nimi: "Minust", tee: "/minust" },
  { nimi: "Teenused", tee: "/teenused" },
  { nimi: "Hinnakiri", tee: "/hinnakiri" },
  { nimi: "Blogi", tee: "/blogi" },
  { nimi: "Broneerimine", tee: "/broneerimine" },
];

/* Marta enda sõnastus liikumisest — lehe kõige tugevam sõnum */
export const liikumine = [
  { millest: "Kaosest", milleks: "selgusesse" },
  { millest: "Raskusest", milleks: "kergusesse" },
  { millest: "Killustatusest", milleks: "tasakaalu" },
  { millest: "Rahutusest", milleks: "rahusse" },
  { millest: "Lõksust", milleks: "vabadusse" },
];

/* Annid — Marta enda sõnastus, 1. Korintlastele 12 põhjal */
export const annid = [
  {
    nimi: "Tarkuse jagamine",
    kirjeldus: "aidata näha olukordi laiemalt ja mõista järgmisi samme",
  },
  {
    nimi: "Tunnetus",
    kirjeldus: "märgata seda, mis vajab tähelepanu või korrastumist",
  },
  {
    nimi: "Usu julgustamine",
    kirjeldus: "tuletada meelde lootust ja usaldust Jumala vastu",
  },
  {
    nimi: "Kuulamine ja kohalolu",
    kirjeldus:
      "luua turvaline ruum, kus inimene võib olla aus ning kogeda selgust",
  },
];

export const teenused = [
  {
    slug: "puha-ruum",
    nimi: "Püha Ruum",
    alapealkiri: "Püha Kohalolu Kristuses",
    luhike:
      "Turvaline ruum kuulamiseks, peegelduseks, palveks ja selguse leidmiseks.",
    sissejuhatus:
      "Pakun inimestele ruumi, kus on võimalik peatuda, olla kuuldud ja märgata uuesti seda, mis on elus oluline.",
    loigud: [
      "Usun, et Jumal kasutab erinevaid inimesi erineval viisil. Minu südames on saanud oluliseks luua keskkond, kus võivad sündida kuulamine, selgus, korrastumine, julgustus ja järgmiste sammude eristamine.",
      "Kõik see sünnib usus, palves ja sooviga anda kogu au Jumalale.",
    ],
    nimekirjaPealkiri: "Selles ruumis võib sündida",
    nimekiri: [
      "kuulamine",
      "selgus",
      "korrastumine",
      "julgustus",
      "järgmiste sammude eristamine",
    ],
    toon: "sygav",
  },
  {
    slug: "stiiliselgus",
    nimi: "Stiiliselgus",
    alapealkiri: "Nähtavaks saanud olemus",
    luhike:
      "Aitan luua selguse, mis väljendab inimese olemust, väärtusi ja eluhooaega.",
    sissejuhatus:
      "Esimene samm sinu isikliku stiili essentsi, garderoobi inventuuri ja teadlikumate valikute suunas.",
    loigud: [
      "Stiil ei ole ainult välimus. See on viis, kuidas inimene väljendab seda, kes ta on.",
      "Riided, kodu, välimus ja valikud kannavad sageli inimese sisemist seisundit. Seepärast ei vaata me ainult riideid, vaid ka seda, mis on nende taga.",
    ],
    nimekirjaPealkiri: "Saad selgust",
    nimekiri: [
      "milline on sinu põhiline stiiliessents ja millised lisaessentsid annavad sinu stiilile sügavust",
      "milline on sinu energeetiline kohalolu",
      "millised toonid, lõiked, materjalid ja detailid sind toetavad",
      "millises riietuses tunned end päriselt nähtuna",
      "milline stiilisuund aitab sul liikuda lähemale iseendale",
    ],
    toon: "soe",
  },
  {
    slug: "garderoobi-korrastus",
    nimi: "Garderoobi korrastus",
    alapealkiri: "Kergus · Rahu · Tasakaal · Rõõm",
    luhike:
      "Loome koos korra ja lihtsuse, et igapäevased valikud toetaksid sinu elu.",
    sissejuhatus:
      "Tulemuseks on garderoob, mis loob rohkem kergust, selgust ja rahu — ning on kooskõlas sinu elu, keha ja olemusega.",
    loigud: [
      "Garderoobi korrastades ei korrasta me ainult riideid. Vaatame koos, mis sobib, mis teenib sinu praegust eluhooaega ja millest on aeg lahti lasta.",
    ],
    nimekirjaPealkiri: "Vaatame koos",
    nimekiri: [
      "milline garderoob teenib sinu praegust eluhooaega",
      "millest on aeg loobuda",
      "mis on puudu ja mis on juba olemas",
      "kuidas hoida kord püsivana",
    ],
    toon: "soe",
  },
  {
    slug: "teadlik-ostlemine",
    nimi: "Teadlik ostlemine",
    alapealkiri: "Valikud, mis lähtuvad vajadusest",
    luhike:
      "Kogemus teha läbimõeldud valikuid, mis lähtuvad vajadusest, mitte survest või emotsioonist.",
    sissejuhatus:
      "Ostlemine muutub rahulikuks, kui tead, mida otsid ja miks.",
    loigud: [
      "Käime koos poes või veebis ja teeme valikuid, mis on kooskõlas sinu stiiliessentsi, eluhooaja ja tegeliku vajadusega.",
    ],
    nimekirjaPealkiri: "Õpid",
    nimekiri: [
      "eristama vajadust survest ja hetkeemotsioonist",
      "märkama, mis päriselt sobib",
      "tegema valikuid, mida hiljem ei kahetse",
      "ostma vähem, aga paremini",
    ],
    toon: "soe",
  },
  {
    slug: "fotograafia",
    nimi: "Fotograafia",
    alapealkiri: "Must-valge",
    luhike:
      "Loomulikud ja ehedad hetked, mis jäädvustavad inimese sellisena, nagu ta on.",
    sissejuhatus:
      "Portreed, mis ei püüa kedagi kellekski teiseks teha.",
    loigud: [
      "Must-valge jätab alles selle, mis on oluline: valguse, kohalolu ja inimese enda.",
    ],
    nimekirjaPealkiri: null,
    nimekiri: [],
    toon: "sygav",
  },
];

export function leiaTeenus(slug) {
  return teenused.find((t) => t.slug === slug);
}

/*
  HINNAKIRI — ETTEPANEK, vajab Marta kinnitust.
  Üksikteenused kokku 490 €, Stiiliteekonnana koos 450 € (sääst 40 €).
*/
export const hinnakiri = [
  {
    nimi: "Püha Ruum | Püha Kohalolu",
    kestus: "1 tund",
    hind: "60 €",
    kirjeldus:
      "Vestlus, kuulamine, peegeldus ja palve. Kohtume kas kohapeal või veebis.",
  },
  {
    nimi: "Stiiliselgus",
    kestus: "2–3 tundi",
    hind: "150 €",
    kirjeldus:
      "Sinu stiiliessentsi kaardistamine: toonid, lõiked, materjalid ja see, mis sind päriselt toetab.",
  },
  {
    nimi: "Garderoobi korrastus",
    kestus: "3–4 tundi",
    hind: "180 €",
    kirjeldus:
      "Käime garderoobi koos läbi. Jääb kord, selgus ja arusaam sellest, mis on olemas ja mis puudu.",
  },
  {
    nimi: "Teadlik ostlemine",
    kestus: "3 tundi",
    hind: "160 €",
    kirjeldus:
      "Koos poes või veebis. Praktiline kogemus, mis jääb sind edaspidi teenima.",
  },
  {
    nimi: "Fotograafia",
    kestus: "1–2 tundi",
    hind: "180 €",
    kirjeldus: "Must-valge portreesessioon ja töödeldud pildid.",
  },
];

/* Stiiliteekond — kolm stiiliteenust ühe teekonnana */
export const teekond = {
  nimi: "Stiiliteekond",
  hind: "450 €",
  vordlus: "eraldi 490 €",
  kirjeldus:
    "Kolm sammu ühe teekonnana: esmalt selgus selles, kes sa oled ja mis sind toetab, seejärel garderoobi korrastus ning lõpuks praktiline kogemus teadlikust ostlemisest. Teekonna tempo lepime kokku sinu elu järgi.",
  sisaldab: [
    "Stiiliselgus — sinu stiiliessents ja see, mis sind toetab",
    "Garderoobi korrastus — kord, selgus ja lihtsus",
    "Teadlik ostlemine — praktiline kogemus koos",
    "kirjalik kokkuvõte ja suund edasiseks",
  ],
};

/*
  BLOGI — postitused lisatakse siia.
  Iga postitus: { slug, pealkiri, kuupaev (ISO), sissejuhatus, loigud: [] }
  Praegu tühi: Marta kirjutab hetkel Substackis, esimesed postitused tulevad siia hiljem.
*/
export const postitused = [];
