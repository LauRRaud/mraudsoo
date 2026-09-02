/*
  LIIDESE SÕNAD.

  Siin on ainult see tekst, mis EI OLE Marta sisu: nuppude nimed, ekraanilugeja
  sildid, kalendri kuunimed, vormi juhised. Sisupuusse (src/sisu/vaikimisi.js)
  need ei kuulu — muidu täituks admin-leht väljadega, mille muutmine ainult
  lõhuks liidest, ja iga uus liidese sõna nõuaks sisupuu muutmist serveris.

  Reegel: kui tekst on Marta oma hääl, läheb ta sisupuusse. Kui ta on masina
  hääl („Ava menüü”, „Valitud 2/3”), siis siia.
*/

import { keeleks } from "./keeled.js";

const SONAD = {
  et: {
    /* Päis ja menüü */
    peamenyy: "Peamenüü",
    jaluseMenyy: "Jaluse menüü",
    avaMenyy: "Ava menüü",
    sulgeMenyy: "Sulge menüü",
    keelevahetus: "Keelevahetus",
    kontakt: "Kontakt",

    /* Blogi */
    koikPostitused: "Kõik postitused",

    /* Broneerimisvorm */
    vormiJuhis:
      "Täida ainult nimi, e-post ja sõnum — ülejäänu on abiks, aga pole vajalik.",
    nimi: "Nimi",
    nimeVihje: "Sinu nimi",
    epost: "E-post",
    epostiVihje: "sinu@epost.ee",
    telefon: "Telefon",
    telefoniVihje: "Kui eelistad, et helistan",
    teenus: "Teenus",
    teenustEiTeaVeel: "Ei tea veel / räägime",
    kolmSammu: "kolm sammu",
    millalSobiks: "Millal sulle sobiks?",
    kalendriJuhis:
      "Kui sul on mõni päev juba mõttes, vali kuni kolm. Kui ei ole, jäta vahele — lepime aja kokku kirja teel.",
    misKellaaeg: "Mis kellaaeg sulle sobib?",
    kellaajaJuhis: "Võid valida mitu või jätta valimata.",
    misPuudutab: "Mis sind praegu kõige rohkem puudutab?",
    sonumiVihje: "Kirjuta julgelt oma sõnadega.",
    peibutuseSilt: "Jäta see väli tühjaks",
    saada: "Saada soov",
    saadab: "Saadan …",
    aitah:
      "Aitäh — sinu soov on minuni jõudnud.",
    hommik: "Hommik",
    parastlouna: "Pärastlõuna",
    ohtu: "Õhtu",

    /* Kalender */
    eelmineKuu: "Eelmine kuu",
    jargmineKuu: "Järgmine kuu",
    valitud: "Valitud",
    tyhjenda: "Tühjenda",
    eemalda: "Eemalda",
    eiOleAvatud: "ei ole kohtumisteks avatud",
    kuud: [
      "jaanuar",
      "veebruar",
      "märts",
      "aprill",
      "mai",
      "juuni",
      "juuli",
      "august",
      "september",
      "oktoober",
      "november",
      "detsember",
    ],
    nadalapaevad: ["E", "T", "K", "N", "R", "L", "P"],

    /* Broneeringu serveritegevuse vastused */
    liigaPaljuSaatmisi:
      "Liiga palju saatmisi järjest. Proovi mõne minuti pärast uuesti.",
    sisestaNimi: "Palun sisesta oma nimi.",
    kontrolliEposti: "Palun kontrolli e-posti aadressi.",
    kirjutaPaarSona: "Palun kirjuta paar sõna endast.",
    salvestamineEbaonnestus:
      "Salvestamine ebaõnnestus. Palun kirjuta otse e-posti teel.",
    saatmineEbaonnestus: (email) =>
      `Saatmine ebaõnnestus. Palun kirjuta otse aadressile ${email}.`,
  },

  en: {
    peamenyy: "Main menu",
    jaluseMenyy: "Footer menu",
    avaMenyy: "Open menu",
    sulgeMenyy: "Close menu",
    keelevahetus: "Change language",
    kontakt: "Contact",

    koikPostitused: "All posts",

    vormiJuhis:
      "Fill in only your name, email and message — the rest is helpful, but not required.",
    nimi: "Name",
    nimeVihje: "Your name",
    epost: "Email",
    epostiVihje: "you@email.com",
    telefon: "Phone",
    telefoniVihje: "If you would rather I called",
    teenus: "Service",
    teenustEiTeaVeel: "Not sure yet / let us talk",
    kolmSammu: "three steps",
    millalSobiks: "When would suit you?",
    kalendriJuhis:
      "If you already have a day in mind, choose up to three. If not, skip this — we will agree a time by email.",
    misKellaaeg: "What time of day suits you?",
    kellaajaJuhis: "You may choose several or none at all.",
    misPuudutab: "What touches you most right now?",
    sonumiVihje: "Write freely, in your own words.",
    peibutuseSilt: "Leave this field empty",
    saada: "Send your request",
    saadab: "Sending …",
    aitah:
      "Thank you — I’ve received your request.",
    hommik: "Morning",
    parastlouna: "Afternoon",
    ohtu: "Evening",

    eelmineKuu: "Previous month",
    jargmineKuu: "Next month",
    valitud: "Chosen",
    tyhjenda: "Clear",
    eemalda: "Remove",
    eiOleAvatud: "not open for meetings",
    kuud: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    /* Inglise nädal algab pühapäevast, aga kalender ise algab esmaspäevast —
       tähed järgivad seepärast sama järjekorda mis eesti omad. */
    nadalapaevad: ["M", "T", "W", "T", "F", "S", "S"],

    liigaPaljuSaatmisi:
      "Too many messages in a row. Please try again in a few minutes.",
    sisestaNimi: "Please enter your name.",
    kontrolliEposti: "Please check the email address.",
    kirjutaPaarSona: "Please write a few words about yourself.",
    salvestamineEbaonnestus:
      "Saving failed. Please write directly by email instead.",
    saatmineEbaonnestus: (email) =>
      `Sending failed. Please write directly to ${email}.`,
  },
};

export function liides(keel) {
  return SONAD[keeleks(keel)];
}
