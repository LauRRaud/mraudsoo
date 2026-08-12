/*
  ÜKSIKU TEKSTI KUJU.

  Admin saab anda ÜHELE tekstile oma kuju: värvi, suuruse, joonduse, kaldkirja
  või rasvase kirja, jutumärgid ja fondi. Kõik elab sisupuu kõrval ühe kaardina:

      tekstiKujud = {
        "avaleht.kutsumus.valjendusSissejuhatus": {
          varv: "#8a6f20",
          suurus: 1.15,        // kordaja, mitte pikslid
          suurusMobiil: 0.9,   // sama kordaja telefonis (alla 640 px)
          joondus: "kesk",     // vasak | kesk | parem
          kaal: "rasvane",
          kalle: "kaldu",
          jutumargid: true,
          font: "cormorant",
        },
      }

  Võti on tee sisupuus, punktidega ühendatud (massiivi element = number).

  MIKS ÜKS KAART, MITTE MITU:
  omadusi tuleb aja jooksul juurde. Iga uue omaduse jaoks eraldi kaart
  tähendaks uut võtit sisupuus, uut puhastust ja uut abifunktsiooni — üks
  kaart objektidega kasvab ise kaasa.

  MIKS REGISTER, MITTE VABA VÄLI:
  kujundusnupud tohivad ilmuda ainult nende väljade juurde, mis on lehel
  PÄRISELT ühendatud (vt plokiStiil() ja tekstiKuju() kasutused src/app all).
  Muidu valiks Marta kuju ja lehel ei juhtuks midagi. KUJUNDATAVAD on seega
  lubatud teede nimekiri ja ühtlasi ainus koht, kus uut välja registreerida —
  kui lisad siia rea, ühenda see ka lehel.

  MIKS SUURUS ON KORDAJA:
  peaaegu iga tekst saab suuruse responsiivsest clamp()-ist, mis kahaneb
  mobiilis ise. Kindel piksliväärtus lõhuks selle. Kordaja rakendub
  em-ühikuna teksti ümber pandud <span>-il ja korrutab ELEMENDI enda
  kujundatud suurust, seega responsiivsus jääb alles.

  MIKS ERALDI MOBIILISUURUS:
  clamp() kahandab teksti ekraani laiuse järgi ÜHE reegli järgi, aga sama
  kordaja ei sobi mõlemale otsale — lauaarvutis paras rõhutus on telefonis
  liiga suur ja vastupidi. `suurusMobiil` on sama kordaja alla 640 px laiuse
  ekraani jaoks. Puudumisel kehtib telefonis sama kordaja mis mujal, seega
  vanad kirjed käituvad täpselt nagu enne.

  MIKS SEE EI SAA OLLA INLINE-STIIL:
  inline-stiilis ei ole meediapäringut. Seepärast annab <span> suuruse
  MUUTUJANA (--kuju-suurus / --kuju-suurus-mobiil) ja klass .kuju-mobiil
  valib nende vahel — vt globals.css. Klassireegel, mitte inline font-size:
  muidu võidaks inline-väärtus meediapäringu ära.
*/

import { createElement } from "react";
/* Suhteline tee, mitte @/ alias: seda faili loevad ka abiskriptid, mis
   jooksevad väljaspool Next'i moodulilahendajat. */
import { leiaFont } from "../kujundus/fondiNimekiri.js";

/* Sisupuu võti, mille all kaart elab. Vt src/sisu/vaikimisi.js ja lae.js. */
export const TEKSTIKUJUDE_VOTI = "tekstiKujud";

/* Kordaja piirid — allapoole muutub tekst loetamatuks, ülespoole lõhub rütmi */
export const SUURUSE_MIN = 0.7;
export const SUURUSE_MAX = 1.8;

export const JOONDUSED = ["vasak", "kesk", "parem"];

/* Eesti jutumärgid: alt algav ja ülalt lõppev */
const JUTUMARK_ALGUS = "„";
const JUTUMARK_LOPP = "”";

/* Märgid, mis loevad juba jutumärgiks — siis me teist paari peale ei pane */
const ALGUSMARGID = ["„", "“", "\"", "«", "‚", "‘"];
const LOPUMARGID = ["”", "“", "\"", "»", "‘", "’"];

/*
  Värvitavad ja kujundatavad teed. „*” tähistab massiivi indeksit
  (loigud.* = kõik lõigud). Nimekiri on rühmitatud lehtede kaupa,
  samas järjekorras nagu lehel.
*/
export const KUJUNDATAVAD = [
  /* Üldine */
  "meta.saidiNimi",

  /* Avaleht */
  "avaleht.hero.silt",
  "avaleht.hero.pealkiri",
  "avaleht.hero.alapealkiri",
  "avaleht.hero.tekst",
  "avaleht.kutsumus.silt",
  "avaleht.kutsumus.tsitaat",
  "avaleht.kutsumus.loigud.*",
  "avaleht.kutsumus.valjendusSissejuhatus",
  "avaleht.kutsumus.valjendus.*",
  "avaleht.liikumine.silt",
  "avaleht.liikumine.pealkiri",
  "avaleht.liikumine.read.*.millest",
  "avaleht.liikumine.read.*.milleks",
  "avaleht.essents.pealkiri",
  "avaleht.essents.alapealkiri",
  "avaleht.essents.loigud.*",
  "avaleht.essents.tsitaat",
  "avaleht.kirjakoht.viide",
  "avaleht.kirjakoht.tekst",
  "avaleht.kirjakoht.selgitus",
  "avaleht.teenusedPlokk.pealkiri",
  "avaleht.minustPlokk.tsitaat",
  "avaleht.minustPlokk.loigud.*",
  "avaleht.kutse.silt",
  "avaleht.kutse.pealkiri",

  /* Minust */
  "minust.hero.silt",
  "minust.hero.pealkiri",
  "minust.hero.tekst",
  "minust.lugu.pealkiri",
  "minust.lugu.loigud.*",
  "minust.kirjakoht.viide",
  "minust.kirjakoht.tekst",
  "minust.kirjakoht.selgitus",
  "minust.pooordumine.silt",
  "minust.pooordumine.pealkiri",
  "minust.pooordumine.loigud.*",
  "minust.pooordumine.tsitaat",
  "minust.pooordumine.kirjakohad.*.viide",
  "minust.pooordumine.kirjakohad.*.tekst",
  "minust.pooordumine.kirjakohad.*.selgitus",
  "minust.annid.silt",
  "minust.annid.pealkiri",
  "minust.annid.sissejuhatus",
  "minust.annid.loend.*.nimi",
  "minust.annid.loend.*.kirjeldus",
  "minust.tsitaat.tekst",
  "minust.terviklikkus.silt",
  "minust.terviklikkus.pealkiri",
  "minust.terviklikkus.loigud.*",
  "minust.lopp.tsitaat",

  /* Teenuste koondleht */
  "teenusedLeht.hero.silt",
  "teenusedLeht.hero.pealkiri",
  "teenusedLeht.hero.tekst",
  "teenusedLeht.tsitaadiSilt",
  "teenusedLeht.tsitaat",
  "teenusedLeht.lopp.pealkiri",
  "teenusedLeht.lopp.tekst",

  /*
    Teenused. Nimi on registris lingi sees ja muutub hiirega peal kuldseks.
    Selleks et inline-värv seda üleminekut ära ei sööks, antakse tema värv
    CSS-muutujana — vt plokiStiil() valikut `varvMuutujaks`.
  */
  "teenused.*.nimi",
  "teenused.*.alapealkiri",
  "teenused.*.luhike",
  /*
    Sama teenuse tekst ilmub mitmes eri suuruse ja taustaga kohas. Tekst ise
    jääb ühiseks, kuid iga kuvamiskoht saab oma kuju.
  */
  "teenused.*.kuva.avaleht.nimi",
  "teenused.*.kuva.avaleht.alapealkiri",
  "teenused.*.kuva.avaleht.luhike",
  "teenused.*.kuva.teenusteLeht.nimi",
  "teenused.*.kuva.teenusteLeht.alapealkiri",
  "teenused.*.kuva.teenusteLeht.luhike",
  "teenused.*.kuva.jargmineTeenus.nimi",
  "teenused.*.kuva.jargmineTeenus.luhike",
  "teenused.*.sissejuhatus",
  "teenused.*.loigud.*",
  "teenused.*.plokid.*.pealkiri",
  "teenused.*.plokid.*.loigud.*",
  "teenused.*.tsitaat.tekst",
  "teenused.*.tsitaat.selgitus",
  "teenused.*.nimekirjaPealkiri",
  "teenused.*.nimekiri.*",

  /* Teenuse alamlehe ühised tekstid */
  "teenuseLeht.nimekirjaSilt",
  "teenuseLeht.kutseSilt",
  "teenuseLeht.kutsePealkiri",
  "teenuseLeht.kutseTekst",

  /* Hinnakiri */
  "hinnakiriLeht.hero.silt",
  "hinnakiriLeht.hero.pealkiri",
  "hinnakiriLeht.hero.tekst",
  "hinnakiriLeht.uksikudSilt",
  "hinnakiriLeht.teekondSilt",
  "hinnakiriLeht.sisaldabSilt",
  "hinnakiriLeht.tsitaadiSilt",
  "hinnakiriLeht.tsitaat",
  "hinnakiriLeht.lopp.pealkiri",
  "hinnakiriLeht.lopp.tekst",
  "hinnakiri.*.nimi",
  "hinnakiri.*.kirjeldus",
  "hinnakiri.*.hind",
  "hinnakiri.*.kestus",
  "teekond.nimi",
  "teekond.kirjeldus",
  "teekond.hind",
  "teekond.sisaldab.*",

  /* Blogi */
  "blogiLeht.hero.silt",
  "blogiLeht.hero.pealkiri",
  "blogiLeht.hero.tekst",
  "blogiLeht.tyhiPealkiri",
  "blogiLeht.tyhiTekst",

  /* Broneerimine */
  "broneerimine.hero.silt",
  "broneerimine.hero.pealkiri",
  "broneerimine.hero.tekst",
  "broneerimine.vormSilt",
  "broneerimine.kontaktSilt",
  "broneerimine.markus",
  "broneerimine.kirjakoht.viide",
  "broneerimine.kirjakoht.tekst",
  "broneerimine.kirjakoht.selgitus",
];

/* Ainult #rgb või #rrggbb — muud ei tohi inline-stiili sisse pääseda */
const VARVI_MUSTER = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/* Ülempiir, et vigane või pahatahtlik fail ei kasvaks piiramatult */
const MAX_KIRJEID = 400;

/* Üks muster vs üks tee. „*” sobib ainult massiivi indeksiga. */
function sobib(muster, tee) {
  const musterOsad = muster.split(".");
  const teeOsad = tee.split(".");
  if (musterOsad.length !== teeOsad.length) return false;

  return musterOsad.every((osa, jrk) =>
    osa === "*" ? /^\d+$/.test(teeOsad[jrk]) : osa === teeOsad[jrk],
  );
}

/* Kas sellele teele tohib kuju anda (ja kas lehel on see ühendatud) */
export function onKujundatav(tee) {
  if (typeof tee !== "string" || tee === "") return false;
  return KUJUNDATAVAD.some((muster) => sobib(muster, tee));
}

/*
  Teenuse nime, alapealkirja ja lühikirjelduse kuvamiskohad admini jaoks.
  Sisuvälja tee jääb kujule `teenused.0.nimi`; kuju tee saab vahele `kuva`
  ja koha nime. „Järgmine teenus” ei näita alapealkirja, seepärast seda valikut
  alapealkirja juures ei ole.
*/
const TEENUSE_KUVA_KOHAD = [
  { id: "avaleht", nimi: "Avalehe teenuste loendis" },
  { id: "teenusteLeht", nimi: "Teenuste lehe loendis" },
  {
    id: "jargmineTeenus",
    nimi: "Alamlehe „Järgmine teenus” plokis",
    valjad: new Set(["nimi", "luhike"]),
  },
];

export function teenuseKujuVariandid(tee) {
  if (typeof tee !== "string") return [];

  const vaste = tee.match(/^teenused\.(\d+)\.(nimi|alapealkiri|luhike)$/);
  if (!vaste) return [];

  const [, indeks, vali] = vaste;
  return TEENUSE_KUVA_KOHAD.filter(
    (koht) => !koht.valjad || koht.valjad.has(vali),
  ).map((koht) => ({
    nimi: koht.nimi,
    tee: `teenused.${indeks}.kuva.${koht.id}.${vali}`,
  }));
}

/*
  Ühe kirje puhastus. Tundmatud võtmed ja vigased väärtused kukuvad vaikselt
  välja; vaikimisi tähendusega väärtusi (suurus 1, joondus vasak, kaal
  tavaline) ei salvestata, et kaart ei täituks tühja müraga.
*/
/* Suuruse kordaja piiridesse; kõlbmatu väärtus annab null. Kaks kohta
   piisab, sest admini liuguri samm on 0,05. */
function kordaja(vaartus) {
  const arv = Number(vaartus);
  if (!Number.isFinite(arv)) return null;
  if (arv < SUURUSE_MIN || arv > SUURUSE_MAX) return null;
  return Math.round(arv * 100) / 100;
}

function puhastaKuju(kuju) {
  if (typeof kuju !== "object" || kuju === null || Array.isArray(kuju)) {
    return null;
  }

  const tulemus = {};

  if (typeof kuju.varv === "string" && VARVI_MUSTER.test(kuju.varv)) {
    tulemus.varv = kuju.varv.toLowerCase();
  }

  const suurus = kordaja(kuju.suurus);
  if (suurus !== null && suurus !== 1) tulemus.suurus = suurus;

  /*
    MOBIILISUURUS SALVESTATAKSE KA SIIS, KUI TA ON TÄPSELT 1.

    „Telefonis tavasuurus, mujal suurendatud” on päris valik ja kaob ära, kui
    kohelda ühte samamoodi nagu lauaarvuti suuruse puhul. Välja kukub ainult
    väärtus, mis on lauaarvuti omaga SAMA — siis ei ole tal midagi öelda.
  */
  const mobiil = kordaja(kuju.suurusMobiil);
  if (mobiil !== null && mobiil !== (suurus ?? 1)) {
    tulemus.suurusMobiil = mobiil;
  }

  /* „vasak” on vaikimisi — seda ei ole mõtet kaardile kirjutada */
  if (JOONDUSED.includes(kuju.joondus) && kuju.joondus !== "vasak") {
    tulemus.joondus = kuju.joondus;
  }

  if (kuju.kaal === "rasvane") tulemus.kaal = "rasvane";
  if (kuju.kalle === "kaldu") tulemus.kalle = "kaldu";
  if (kuju.jutumargid === true) tulemus.jutumargid = true;

  if (typeof kuju.font === "string" && leiaFont(kuju.font)) {
    tulemus.font = kuju.font;
  }

  return Object.keys(tulemus).length > 0 ? tulemus : null;
}

/*
  Kogu kaardi puhastus. Sama kontroll käib nii lugemisel kui salvestamisel
  (vt src/sisu/lae.js) — väärtused lähevad inline-stiili, seepärast on see
  kohustuslik.
*/
export function puhastaTekstiKujud(kaart) {
  if (typeof kaart !== "object" || kaart === null || Array.isArray(kaart)) {
    return {};
  }

  const tulemus = {};
  const vanadTeenuseKujud = [];
  let arv = 0;

  for (const [tee, kuju] of Object.entries(kaart)) {
    if (arv >= MAX_KIRJEID) break;
    if (!onKujundatav(tee)) continue;

    const puhas = puhastaKuju(kuju);
    if (!puhas) continue;

    /*
      Enne kuvamiskohtade lahutamist oli üks kuju kõigil teenuse kaartidel ja
      alamlehe päisel ühine. Loeme vana võtme sisse, kuid jagame selle allpool
      kõigile uutele kohtadele — nii ei muutu deploy'l praegune välimus.
    */
    if (teenuseKujuVariandid(tee).length > 0) {
      vanadTeenuseKujud.push({ tee, kuju: puhas });
      continue;
    }

    tulemus[tee] = puhas;
    arv += 1;
  }

  /* Uus, juba eraldi salvestatud kuju võidab vana ühise kuju. */
  for (const vana of vanadTeenuseKujud) {
    for (const variant of teenuseKujuVariandid(vana.tee)) {
      if (arv >= MAX_KIRJEID) break;
      if (tulemus[variant.tee]) continue;
      tulemus[variant.tee] = { ...vana.kuju };
      arv += 1;
    }
  }

  return tulemus;
}

/* Kõik ühe haru kirjed maha — kasutab admini „Lähtesta” ühe sektsiooni peal */
export function eemaldaHaru(kaart, juur) {
  const tulemus = {};
  for (const [tee, kuju] of Object.entries(kaart ?? {})) {
    if (tee === juur || tee.startsWith(`${juur}.`)) continue;
    tulemus[tee] = kuju;
  }
  return tulemus;
}

/* Jutumärgid ümber, kui neid seal juba ei ole */
function jutumarkidega(tekst) {
  if (typeof tekst !== "string") return tekst;

  const puhas = tekst.trim();
  if (puhas === "") return tekst;

  const algusOlemas = ALGUSMARGID.includes(puhas[0]);
  const loppOlemas = LOPUMARGID.includes(puhas[puhas.length - 1]);
  if (algusOlemas && loppOlemas) return tekst;

  return `${algusOlemas ? "" : JUTUMARK_ALGUS}${puhas}${
    loppOlemas ? "" : JUTUMARK_LOPP
  }`;
}

/*
  VÄRV TUMEDAL PINNAL.

  Marta valib üksiku teksti värvi admin-lehel ja peaaegu iga valik on tume
  kuld (#8a6f20) või tint — heledal pinnal on need õiged. Tumedal
  sektsioonil annab tume kuld 2,6:1 ja rida kaob taustale ära.

  Salvestatud väärtust EI tohi selle pärast muuta: sama kuju teenib korraga
  heledat ja tumedat kohta (nt `teenusedLeht.hero.tekst` seisab koondlehel
  heledal ja teenuse alamlehel tumedal). Parandus käib seepärast kuvamise
  hetkel, mitte andmetes.

  Reegel: tumedal pinnal jääb alles ainult värv, mis on ise piisavalt hele.
  Liiga tume värv asendatakse sama tähendusega tumeda pinna värviga —
  kuldne kuldsega, muu tekstivärviga. Nii jääb Marta mõte („see rida on
  kuldne”) alles, aga rida jääb loetavaks.
*/
const TUMEDA_PINNA_LAVI = 0.4;

/* Kui palju peab punane sinisest üle olema, et värv loeks kuldsena */
const KULLASE_LAVI = 40;

function kanalid(varv) {
  const t = varv.replace("#", "");
  const taielik =
    t.length === 3
      ? t
          .split("")
          .map((m) => m + m)
          .join("")
      : t;

  return [0, 2, 4].map((i) => parseInt(taielik.slice(i, i + 2), 16));
}

/* WCAG suhteline heledus — sama valem mis admini kontrastihoiatuses */
function suhtelineHeledus(varv) {
  const [r, g, b] = kanalid(varv).map((k) => {
    const v = k / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function tumedaPinnaVarv(varv) {
  if (!VARVI_MUSTER.test(varv)) return varv;
  if (suhtelineHeledus(varv) >= TUMEDA_PINNA_LAVI) return varv;

  const [r, , b] = kanalid(varv);
  /* Kuld on soe: punane kanal on sinisest tublisti üle. Tint ei ole. */
  return r - b >= KULLASE_LAVI
    ? "var(--color-kuld-hele)"
    : "var(--color-luu)";
}

/*
  PLOKI STIIL — see, mis peab olema ploki enda küljes.

  Joondus ei toimi <span>-il, seepärast käib ta koos värviga elemendile:

      const p = plokiStiil(sisu.tekstiKujud, "avaleht");
      <p style={p("kutsumus.valjendusSissejuhatus")}>…</p>

  VALIK `varvMuutujaks`: mõni tekst (teenuse nimi registris) vahetab hiirega
  peal värvi klassi kaudu. Inline `color` võidaks selle ülemineku ära, sest
  inline-stiil on klassist tugevam. Siis anname värvi hoopis muutujana
  `--oma-varv` ja element kirjutab klassi `text-[var(--oma-varv,…)]` — nii
  jääb `group-hover:` peale, sest klassi spetsiifilisus on kõrgem kui
  muutujaviitel.

  VALIK `tume`: sektsioon seisab tumedal pinnal. Liiga tume valitud värv
  vahetatakse tumeda pinna vastu välja — vt tumedaPinnaVarv(). Anna see
  KÕIGIL tumeda sektsiooni väljakutsetel, muidu jääb üks rida loetamatuks.
*/
export function plokiStiil(tekstiKujud, eesliide = "") {
  const kaart = tekstiKujud ?? {};

  return function stiil(tee, valikud) {
    const kuju = kaart[eesliide ? `${eesliide}.${tee}` : tee];
    if (!kuju) return undefined;

    const tulemus = {};
    if (kuju.varv) {
      const varv = valikud?.tume ? tumedaPinnaVarv(kuju.varv) : kuju.varv;
      if (valikud?.varvMuutujaks) tulemus["--oma-varv"] = varv;
      else tulemus.color = varv;
    }
    if (kuju.joondus === "kesk") tulemus.textAlign = "center";
    if (kuju.joondus === "parem") tulemus.textAlign = "right";

    return Object.keys(tulemus).length > 0 ? tulemus : undefined;
  };
}

/*
  Sama mis plokiStiil(), aga tumeda sektsiooni jaoks: iga värv käib läbi
  tumedaPinnaVarv(). Eraldi funktsioon, mitte `{ tume: true }` igal real —
  üks unustatud rida tähendaks üht loetamatut lõiku, ja tumedas sektsioonis
  on neid ridu kümneid.
*/
export function tumePlokiStiil(tekstiKujud, eesliide = "") {
  const stiil = plokiStiil(tekstiKujud, eesliide);
  return (tee, valikud) => stiil(tee, { ...valikud, tume: true });
}

/*
  TEKSTI KUJU — see, mis käib teksti enda ümber.

  Suurus, kaal, kalle ja font lähevad <span>-ile: em korrutab ELEMENDI enda
  kujundatud suurust, seega clamp() jääb terveks. Jutumärgid on sisu muudatus.

      const t = tekstiKuju(sisu.tekstiKujud, "avaleht");
      <p style={p("hero.tekst")}>{t("hero.tekst", hero.tekst)}</p>

  ui.js komponendid (Tekst, Pealkiri, Salm) teevad mähise ise ja vajavad
  paljast kirjet — selle annab `t.kuju("tee")`.
*/
export function tekstiKuju(tekstiKujud, eesliide = "") {
  const kaart = tekstiKujud ?? {};
  const loe = (tee) => kaart[eesliide ? `${eesliide}.${tee}` : tee];

  function kujunda(tee, sisu) {
    return rakendaKuju(sisu, loe(tee));
  }

  kujunda.kuju = loe;

  return kujunda;
}

/*
  Kuju rakendamine ühele tekstile. Kasutavad nii tekstiKuju() kui ui.js
  komponendid, et reeglid oleksid ühes kohas.

  createElement, mitte JSX: see fail on sisupuu moodul, mida loevad ka
  abiskriptid väljaspool Next'i kompilaatorit.
*/
export function rakendaKuju(sisu, kuju) {
  if (!kuju) return sisu;

  const tekst = kuju.jutumargid ? jutumarkidega(sisu) : sisu;

  const stiil = {};
  const suurus = kuju.suurus && kuju.suurus !== 1 ? kuju.suurus : null;

  /*
    Kaks kraadi tähendab klassi ja muutujaid, üks kraad paljast font-size'i.
    Klass ainult siis, kui teda on päriselt vaja — nii jääb enamiku tekstide
    märgend täpselt selliseks nagu enne.
  */
  const kahesKraadis = typeof kuju.suurusMobiil === "number";

  if (kahesKraadis) {
    stiil["--kuju-suurus"] = `${suurus ?? 1}em`;
    stiil["--kuju-suurus-mobiil"] = `${kuju.suurusMobiil}em`;
  } else if (suurus) {
    stiil.fontSize = `${suurus}em`;
  }

  if (kuju.kaal === "rasvane") stiil.fontWeight = 600;
  if (kuju.kalle === "kaldu") stiil.fontStyle = "italic";

  const font = kuju.font ? leiaFont(kuju.font) : null;
  if (font) stiil.fontFamily = `var(${font.muutuja})`;

  if (Object.keys(stiil).length === 0) return tekst;

  return createElement(
    "span",
    { className: kahesKraadis ? "kuju-mobiil" : undefined, style: stiil },
    tekst,
  );
}
