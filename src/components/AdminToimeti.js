"use client";

/*
  ADMIN — TOIMETI.

  Üldine rekursiivne sisutoimeti: käib sisupuu läbi ja renderdab välja tüübi
  järgi. Käsitsi kirjutatud välju siin EI OLE — kui vaikimisi sisusse lisandub
  uus võti, ilmub see toimetisse iseenesest. Nii ei vanane admin-leht.

  Failis on kaks eksporti:
    Sisselogimisvorm — paroolivorm (kasutab layout ja /admin/login)
    AdminToimeti     — sisu muutmise vaade (vaikimisi eksport)
*/

import Link from "next/link";
import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  lahtestaTegevus,
  loguSisseTegevus,
  salvestaTegevus,
} from "@/app/admin/tegevused";
import { KEELED, VAIKEKEEL, tee as keeleTee } from "@/sisu/keeled";
import {
  SUURUSE_MAX,
  SUURUSE_MIN,
  TEKSTIKUJUDE_VOTI,
  onKujundatav,
  teenuseKujuVariandid,
} from "@/sisu/tekstikujud";
import FotograafiaGaleriiHaldus from "@/components/FotograafiaGaleriiHaldus";
import { KUVA_FONDID, TEKSTI_FONDID } from "@/kujundus/fondiNimekiri";

/* ------------------------------------------------------------------ */
/* Sõnastikud                                                          */
/* ------------------------------------------------------------------ */

/*
  Eestikeelsed sildid võtmete jaoks. Tundmatu võti saab lihtsalt esitähega
  suureks tehtud kuju, nii ei jää uus võti kunagi sildita.
*/
const SILDID = {
  /* Ülemine tase */
  meta: "Saidi info",
  kontakt: "Kontakt",
  navi: "Menüü",
  avaleht: "Avaleht",
  minust: "Minust",
  teenusedLeht: "Teenuste koondleht",
  teenused: "Teenused",
  teenuseLeht: "Kõigi teenuse alamlehtede ühised tekstid",
  fotograafiaGalerii: "Fotograafia pildigalerii",
  hinnakiriLeht: "Hinnakirja leht",
  hinnakiri: "Hinnakirja read",
  teekond: "Stiiliteekond",
  blogiLeht: "Blogi leht",
  postitused: "Blogipostitused",
  broneerimine: "Broneerimine",
  jalus: "Jalus",
  eiLeitud: "404 leht",

  /* Plokid */
  hero: "Sissejuhatav plokk",
  kutsumus: "Kutsumus",
  liikumine: "Liikumine",
  essents: "Essents",
  teenusedPlokk: "Teenuste plokk",
  minustPlokk: "Minust plokk",
  kutse: "Kutseplokk",
  lugu: "Minu lugu",
  kirjakoht: "Kirjakoht",
  annid: "Annid",
  terviklikkus: "Terviklikkus",
  lopp: "Lõpuplokk",
  plokid: "Plokid",
  loend: "Loend",
  read: "Read",

  /* Väljad */
  saidiNimi: "Saidi nimi",
  tunnuslause: "Tunnuslause",
  kirjeldus: "Kirjeldus",
  email: "E-post",
  instagram: "Instagrami aadress",
  instagramNimi: "Instagrami kasutajanimi",
  facebook: "Facebooki aadress",
  substack: "Substacki aadress",
  nimi: "Nimi",
  tee: "Aadress lehel",
  silt: "Silt",
  pealkiri: "Pealkiri",
  alapealkiri: "Alapealkiri",
  tekst: "Tekst",
  tsitaat: "Tsitaat",
  loigud: "Lõigud",
  luhike: "Lühikirjeldus",
  sissejuhatus: "Sissejuhatus",
  selgitus: "Selgitus",
  viide: "Viide",
  nuppEsmane: "Esimene nupp",
  nuppTeine: "Teine nupp",
  nuppTekst: "Nupu tekst",
  linkTekst: "Lingi tekst",
  loeLahemalt: "„Loe lähemalt” tekst",
  nimekirjaPealkiri: "Ploki suur pealkiri",
  nimekiri: "Ploki tekstiread",
  nimekirjaSilt: "Ploki ülemine silt (nt „Mida see kogemus annab”)",
  kutseSilt: "Kutse silt",
  kutsePealkiri: "Kutse pealkiri",
  kutseTekst: "Kutse tekst",
  jargmineSilt: "„Järgmine teenus” silt",
  millest: "Millest",
  milleks: "Milleks",
  uksikudSilt: "Üksikteenuste silt",
  teekondSilt: "Teekonna silt",
  sisaldabSilt: "„Sisaldab” silt",
  sisaldab: "Sisaldab",
  kestus: "Kestus",
  hind: "Hind",
  vordlus: "Võrdlushind",
  kuupaev: "Kuupäev",
  tyhiPealkiri: "Tühja blogi pealkiri",
  tyhiTekst: "Tühja blogi tekst",
  substackTekst: "Substacki lingi tekst",
  vormSilt: "Vormi silt",
  kontaktSilt: "Kontakti silt",
  markus: "Märkus",
  tutvustus: "Tutvustus",
  slug: "Aadressiosa (slug)",
  toon: "Kujunduse toon",
};

/*
  Vasakpoolne navigatsioon. Iga kirje koondab ühe või mitu sisupuu ülemise
  taseme võtit — nii on menüü lühike, kuid kogu puu on kaetud.
*/
/*
  `leht` on avaliku lehe aadress ilma keeleprefiksita — sellest teeb
  „Vaata lehel” lingi õiges keeles. Sektsioonidel, mis ei vasta ühele lehele
  (jalus, kontakt, menüü), seda ei ole.
*/
const SEKTSIOONID = [
  { id: "avaleht", nimi: "Avaleht", teed: ["avaleht"], leht: "/" },
  { id: "minust", nimi: "Minust", teed: ["minust"], leht: "/minust" },
  {
    id: "teenused",
    nimi: "Teenused",
    teed: ["teenusedLeht", "teenuseLeht", "teenused"],
    leht: "/teenused",
  },
  {
    id: "fotograafia",
    nimi: "Fotograafia pildid",
    teed: ["fotograafiaGalerii"],
    leht: "/teenused/fotograafia",
  },
  {
    id: "hinnakiri",
    nimi: "Hinnakiri",
    teed: ["hinnakiriLeht", "hinnakiri", "teekond"],
    leht: "/hinnakiri",
  },
  {
    id: "blogi",
    nimi: "Blogi",
    teed: ["blogiLeht", "postitused"],
    leht: "/blogi",
  },
  {
    id: "broneerimine",
    nimi: "Broneerimine",
    teed: ["broneerimine"],
    leht: "/broneerimine",
  },
  { id: "jalus", nimi: "Jalus", teed: ["jalus", "eiLeitud"] },
  { id: "kontakt", nimi: "Kontakt", teed: ["kontakt", "meta"] },
  { id: "menyy", nimi: "Menüü", teed: ["navi"] },
];

/* ISO-ajast „12.08.2026 18:15”. Vigane väärtus ei tohi lehte maha võtta. */
function vormindaAeg(iso) {
  try {
    return new Date(iso).toLocaleString("et-EE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/*
  VIITED — kus üks või teine tekst päriselt elab.

  Sama sisu paistab tihti mitmel lehel, aga muuta saab teda ainult ühes
  kohas. Teenuste register (Püha Ruum, 1:1 teekond …) on nii avalehel kui
  teenuste lehel, tema tekstid aga sektsioonis „Teenused” — ilma viidata
  otsitakse neid „Avaleht” alt ja ei leita. `siht` teeb viitest nupu, mis
  hüppab kohe õigesse sektsiooni.
*/
const VIITED = {
  avaleht: {
    tekst:
      "Avalehe teenuste register (Püha Ruum, 1:1 teekond …) ei ela siin — teenuste nimed, alapealkirjad ja lühikirjeldused on sektsioonis „Teenused”.",
    siht: "teenused",
  },
  teenusedLeht: {
    tekst:
      "Siin on teenuste lehe oma tekstid: päis, tsitaat ja lõpuplokk. Register ise — teenuste nimed ja kirjeldused — on allpool, pealkirja „Teenused” all.",
  },
  teenused: {
    tekst:
      "Kaardi päises seisev nimi on ainult silt — muuta saab teda kaardi sees. Ava „Ava teenuse tekstid”: seal on teenuse nimi, alapealkiri ja lühikirjeldus (needsamad, mis seisavad avalehe ja teenuste lehe registris) ning nende järel ploki „Mida see kogemus annab” pealkiri, read ja lõpulause. Nimi, alapealkiri ja lühikirjeldus on kõigis kuvamiskohtades sama tekst — muuda siin, muutub kõikjal.",
  },
  teenuseLeht: {
    tekst:
      "Need tekstid on ühised kõigil teenuse alamlehtedel. Väljal „Ploki ülemine silt” muudad näiteks teksti „Mida see kogemus annab …”; iga teenuse suur pealkiri ja selle all olevad read asuvad allpool vastava teenuse kaardil.",
  },
};

/*
  Võtmed, mille sisu on alati pikk. Nende puhul kasutame kohe tekstiala,
  isegi kui praegune väärtus on lühike (nt uus tühi lõik).
*/
const PIKAD_VOTMED = new Set([
  "tekst",
  "kirjeldus",
  "tsitaat",
  "sissejuhatus",
  "selgitus",
  "luhike",
  "kutseTekst",
  "tyhiTekst",
  "markus",
  "tutvustus",
  "loigud",
]);

/*
  TEHNILISED VÄLJAD.
  slug = lehe aadressiosa (/teenused/<slug>, /blogi/<slug>) ja toon = kujunduse
  variant, mille väärtusi tunneb ainult kood. Muudame need eraldi märgituks:
  slug jääb muudetavaks, sest uuel blogipostitusel peab saama aadressi anda,
  aga hoiatus on juures — vana slugi muutmine katkestab olemasolevad lingid.
  toon on ainult loetav: koodis on tuntud väärtused ("soe", "sygav") ja
  suvaline uus väärtus ei teeks midagi, vaid tekitaks segadust.
*/
const TEHNILISED = new Set(["slug", "toon"]);
const AINULT_LOETAV = new Set(["toon"]);

/*
  Mallid tühjade massiivide jaoks. Kui massiiv on juba täidetud, võtame malli
  esimesest elemendist (tekstid tühjaks). Tühja massiivi puhul seda võimalust
  ei ole, seepärast on siin võtmenime järgi mallid.
*/
const MALLID = {
  postitused: {
    slug: "",
    pealkiri: "",
    kuupaev: "",
    sissejuhatus: "",
    loigud: [""],
  },
  plokid: { pealkiri: "", loigud: [""] },
  nimekiri: "",
  loigud: "",
  sisaldab: "",
  read: { millest: "", milleks: "" },
  loend: { nimi: "", kirjeldus: "" },
  navi: { nimi: "", tee: "" },
  lehed: {
    slug: "",
    pealkiri: "",
    silt: "",
    sissejuhatus: "",
    plokid: [{ pealkiri: "", loigud: [""] }],
  },
};

/* ------------------------------------------------------------------ */
/* Abifunktsioonid                                                     */
/* ------------------------------------------------------------------ */

function onObjekt(vaartus) {
  return (
    typeof vaartus === "object" && vaartus !== null && !Array.isArray(vaartus)
  );
}

function silt(voti) {
  if (SILDID[voti]) return SILDID[voti];
  const tekst = String(voti);
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

/*
  Teenuse „Mida see annab” plokk peab olema leitav enne pikka sisublokkide
  loendit. Muudame ainult toimeti kuvamisjärjekorda, sisupuu ise jääb samaks.
*/
const TEENUSE_VALJAJARJEKORD = [
  "slug",
  "nimi",
  "alapealkiri",
  "luhike",
  "nimekirjaPealkiri",
  "nimekiri",
  "sissejuhatus",
  "loigud",
  "plokid",
  "toon",
  "tsitaat",
];

function valjadJarjekorras(vaartus, tee) {
  const kirjed = Object.entries(vaartus);
  const teenuseKaart =
    tee.length === 2 && tee[0] === "teenused" && Number.isInteger(tee[1]);

  if (!teenuseKaart) return kirjed;

  const jarjekord = new Map(
    TEENUSE_VALJAJARJEKORD.map((voti, indeks) => [voti, indeks]),
  );

  return kirjed.sort(
    ([votiA], [votiB]) =>
      (jarjekord.get(votiA) ?? Number.MAX_SAFE_INTEGER) -
      (jarjekord.get(votiB) ?? Number.MAX_SAFE_INTEGER),
  );
}

/* Uus väärtus teel — kõik puudutatud tasemed kopeeritakse, ülejäänu jääb samaks */
function asendaTeel(juur, tee, uusVaartus) {
  if (tee.length === 0) return uusVaartus;

  const [voti, ...jaak] = tee;

  if (Array.isArray(juur)) {
    const koopia = juur.slice();
    koopia[voti] = asendaTeel(juur[voti], jaak, uusVaartus);
    return koopia;
  }

  return { ...juur, [voti]: asendaTeel(juur[voti], jaak, uusVaartus) };
}

/* Näidisest tühi mall: kogu tekst tühjaks, kuju alles */
function tyhjendaMall(naidis) {
  if (typeof naidis === "string") return "";
  if (Array.isArray(naidis)) {
    return naidis.length > 0 ? [tyhjendaMall(naidis[0])] : [];
  }
  if (onObjekt(naidis)) {
    const tulemus = {};
    for (const voti of Object.keys(naidis)) {
      tulemus[voti] = tyhjendaMall(naidis[voti]);
    }
    return tulemus;
  }
  return "";
}

/* Massiivi uue elemendi mall */
function uusElement(massiiv, voti) {
  if (massiiv.length > 0) return tyhjendaMall(massiiv[0]);
  if (Object.hasOwn(MALLID, voti)) return tyhjendaMall(MALLID[voti]);
  return "";
}

/* Objektimassiivi ploki kokkuvõtlik pealkiri */
function plokiNimi(element, indeks) {
  if (typeof element === "string") return `Rida ${indeks + 1}`;
  const nimi = element?.nimi || element?.pealkiri || element?.millest;
  return nimi ? String(nimi) : `Plokk ${indeks + 1}`;
}

/*
  Kas plokk on nii suur, et teda tasub kokku panna.

  Suur = tema sees on veel massiive või objekte. Teenusel on lõigud, plokid
  ja nimekiri, seega kuus lahtist teenust andsid lehe, kus üksiku teenuse
  nimi kadus tuhandete pikslite sisse ära. Kokkupandult on kõik kuus korraga
  näha ja õige avaneb ühe klõpsuga. Väikesed plokid — hinnakirja rida, menüü
  kirje, anni nimi ja kirjeldus — jäävad lahti, neil ei ole midagi peita.
*/
function suurPlokk(element) {
  return Object.values(element ?? {}).some(
    (vaartus) => Array.isArray(vaartus) || onObjekt(vaartus),
  );
}

/* ------------------------------------------------------------------ */
/* Ühised stiiliklassid — sama disainikeel mis lehel                    */
/* ------------------------------------------------------------------ */

const VALI_KLASS =
  "w-full border border-sage bg-bone px-3 py-2 text-[0.95rem] leading-relaxed text-ink-soft transition-colors placeholder:text-ink-faint focus:border-rohe focus:outline-2 focus:outline-offset-2 focus:outline-rohe";

const NUPP_ROHE =
  "mikro inline-flex items-center justify-center border border-rohe bg-rohe px-6 py-3 text-[0.8rem] text-white transition-colors hover:border-rohe-hele hover:bg-rohe-hele disabled:cursor-not-allowed disabled:opacity-50";

const NUPP_AARIS =
  "mikro inline-flex items-center justify-center border border-rohe px-5 py-2.5 text-[0.75rem] text-rohe transition-colors hover:bg-rohe hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

const NUPP_VAIKE =
  "inline-flex h-8 w-8 items-center justify-center border border-sage text-ink-faint transition-colors hover:border-rohe hover:text-rohe disabled:cursor-not-allowed disabled:opacity-40";

const NUPP_TEKST =
  "mikro text-[0.65rem] text-ink-faint underline underline-offset-4 transition-colors hover:text-rohe";

const MUSTANDI_VERSIOON = 1;

function mustandiVoti(keel) {
  return `marta-admin-mustand:${keel}`;
}

function loeMustand(keel) {
  try {
    const toores = window.sessionStorage.getItem(mustandiVoti(keel));
    if (!toores) return null;

    const mustand = JSON.parse(toores);
    if (
      mustand?.versioon !== MUSTANDI_VERSIOON ||
      typeof mustand?.tunnus !== "string" ||
      typeof mustand?.sisu !== "object" ||
      mustand.sisu === null ||
      Array.isArray(mustand.sisu)
    ) {
      window.sessionStorage.removeItem(mustandiVoti(keel));
      return null;
    }

    return mustand;
  } catch {
    return null;
  }
}

/* Kitsal ekraanil salvestusribale: „21.08 17:37”. */
function vormindaAegLuhike(iso) {
  try {
    return new Date(iso).toLocaleString("et-EE", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/* Ühe teksti kuju                                                     */
/* ------------------------------------------------------------------ */

/*
  Kujukaart ja selle muutja käivad kontekstiga, mitte propsidena: nii ei pea
  Valjad ja Massiiv neid iga taseme kaudu edasi andma. Muutmine käib täpselt
  samamoodi nagu tekstil — kirje läheb sisupuu külge ja salvestub sama
  „Salvesta” nupuga.
*/
const KujuKontekst = createContext(null);

/* Uue värvi lähtepunkt on lehe kuld — tavalisim esiletõst */
const VAIKE_ESILETOST = "#8a6f20";

const JOONDUSE_NIMED = [
  { vaartus: "vasak", nimi: "Vasakule" },
  { vaartus: "kesk", nimi: "Keskele" },
  { vaartus: "parem", nimi: "Paremale" },
];

/* Väike lülitusnupp paneeli sees */
function Lyliti({ peal, muuda, children, silt }) {
  return (
    <button
      type="button"
      onClick={muuda}
      aria-pressed={peal}
      title={silt}
      className={`mikro border px-3 py-1.5 text-[0.65rem] transition-colors ${
        peal
          ? "border-rohe bg-rohe text-white"
          : "border-sage text-ink-faint hover:border-rohe hover:text-rohe"
      }`}
    >
      {children}
    </button>
  );
}

/*
  Kogu ühe teksti kuju ühes paneelis: värv, suurus, joondus, kaldkiri,
  rasvane kiri, jutumärgid ja font. Paneel avaneb alles siis, kui Marta
  seda küsib — muidu oleks iga tekstivälja all seitse juhtnuppu.
*/
function Kujupaneel({ tee, nimi }) {
  const kontekst = useContext(KujuKontekst);
  const [avatud, setAvatud] = useState(false);

  if (!kontekst) return null;

  const { kujud, muudaKuju } = kontekst;
  const kuju = kujud[tee] ?? {};
  const midagiSeatud = Object.keys(kuju).length > 0;

  /* Ühe omaduse muutmine; sama väärtus uuesti = tagasi vaikimisi */
  function sea(votme, vaartus) {
    muudaKuju(tee, { ...kuju, [votme]: kuju[votme] === vaartus ? undefined : vaartus });
  }

  if (!avatud) {
    return (
      <button
        type="button"
        onClick={() => setAvatud(true)}
        aria-expanded="false"
        className={`${NUPP_TEKST} mt-2`}
      >
        {nimi
          ? `${nimi}${midagiSeatud ? " · kujundatud" : ""}`
          : `Kujunda see tekst${midagiSeatud ? " · kujundatud" : ""}`}
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-3 border border-sage bg-linen p-3">
      {nimi && (
        <p className="mikro text-[0.68rem] text-rohe" aria-live="polite">
          {nimi}
        </p>
      )}
      {/* Värv */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="mikro w-20 text-[0.65rem] text-ink-faint">Värv</span>
        {kuju.varv ? (
          <>
            <input
              type="color"
              value={kuju.varv}
              onChange={(sundmus) =>
                muudaKuju(tee, { ...kuju, varv: sundmus.target.value })
              }
              aria-label="Teksti värv"
              className="h-8 w-10 cursor-pointer border border-sage bg-transparent p-1"
            />
            <span className="text-[0.8rem] text-ink-faint">{kuju.varv}</span>
            <button
              type="button"
              onClick={() => muudaKuju(tee, { ...kuju, varv: undefined })}
              className={NUPP_TEKST}
            >
              vaikimisi
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => muudaKuju(tee, { ...kuju, varv: VAIKE_ESILETOST })}
            className={NUPP_TEKST}
          >
            Vali värv
          </button>
        )}
      </div>

      <fieldset className="space-y-3 border border-sage bg-bone p-3">
        <legend className="px-1 mikro text-[0.68rem] text-rohe">
          Teksti suurus eri ekraanidel
        </legend>
        <p className="max-w-[60ch] text-[0.8rem] leading-relaxed text-ink-soft">
          Arvuti ja telefoni väärtused ei võitle omavahel. Telefonis saad
          kasutada kas arvuti suurust või oma, eraldi suurust.
        </p>

        <div className="border-l-2 border-rohe bg-linen px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="mikro text-[0.65rem] text-ink-faint">
              ARVUTIS · alates 640 px
            </span>
            <output className="text-[0.85rem] text-rohe">
              {Math.round((kuju.suurus ?? 1) * 100)} %
            </output>
          </div>
          <input
            type="range"
            min={SUURUSE_MIN}
            max={SUURUSE_MAX}
            step={0.05}
            value={kuju.suurus ?? 1}
            onChange={(sundmus) =>
              muudaKuju(tee, { ...kuju, suurus: Number(sundmus.target.value) })
            }
            aria-label="Teksti suurus arvutis"
            className="mt-2 h-8 w-full cursor-pointer accent-rohe"
          />
        </div>

        <div
          className={`border-l-2 px-3 py-2.5 ${
            kuju.suurusMobiil === undefined
              ? "border-sage bg-linen"
              : "border-gold-deep bg-bone"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="mikro text-[0.65rem] text-ink-faint">
              TELEFONIS · kuni 639 px
            </span>
            {kuju.suurusMobiil === undefined ? (
              <button
                type="button"
                onClick={() =>
                  muudaKuju(tee, {
                    ...kuju,
                    suurusMobiil: Math.min(kuju.suurus ?? 1, 1),
                  })
                }
                className={NUPP_TEKST}
              >
                Määra telefonile oma suurus
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <output className="text-[0.85rem] text-gold-deep">
                  {Math.round(kuju.suurusMobiil * 100)} %
                </output>
                <button
                  type="button"
                  onClick={() =>
                    muudaKuju(tee, { ...kuju, suurusMobiil: undefined })
                  }
                  className={NUPP_TEKST}
                >
                  Kasuta arvuti suurust
                </button>
              </div>
            )}
          </div>

          {kuju.suurusMobiil === undefined ? (
            <p className="mt-2 text-[0.8rem] text-ink-faint">
              Praegu {Math.round((kuju.suurus ?? 1) * 100)} % — sama mis arvutis.
            </p>
          ) : (
            <input
              type="range"
              min={SUURUSE_MIN}
              max={SUURUSE_MAX}
              step={0.05}
              value={kuju.suurusMobiil}
              onChange={(sundmus) =>
                muudaKuju(tee, {
                  ...kuju,
                  suurusMobiil: Number(sundmus.target.value),
                })
              }
              aria-label="Teksti suurus telefonis"
              className="mt-2 h-8 w-full cursor-pointer accent-gold-deep"
            />
          )}
        </div>
      </fieldset>

      {/* Joondus */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mikro w-20 text-[0.65rem] text-ink-faint">Joondus</span>
        {JOONDUSE_NIMED.map((valik) => (
          <Lyliti
            key={valik.vaartus}
            peal={(kuju.joondus ?? "vasak") === valik.vaartus}
            muuda={() => muudaKuju(tee, { ...kuju, joondus: valik.vaartus })}
            silt={valik.nimi}
          >
            {valik.nimi}
          </Lyliti>
        ))}
      </div>

      {/* Kirjapilt */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mikro w-20 text-[0.65rem] text-ink-faint">Kiri</span>
        <Lyliti
          peal={kuju.kalle === "kaldu"}
          muuda={() => sea("kalle", "kaldu")}
          silt="Kaldkiri"
        >
          Kaldkiri
        </Lyliti>
        <Lyliti
          peal={kuju.kaal === "rasvane"}
          muuda={() => sea("kaal", "rasvane")}
          silt="Rasvane"
        >
          Rasvane
        </Lyliti>
        <Lyliti
          peal={kuju.jutumargid === true}
          muuda={() => sea("jutumargid", true)}
          silt="Paneb teksti ümber jutumärgid"
        >
          Jutumärgid
        </Lyliti>
      </div>

      {/* Font */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="mikro w-20 text-[0.65rem] text-ink-faint">Font</span>
        <select
          value={kuju.font ?? ""}
          onChange={(sundmus) =>
            muudaKuju(tee, { ...kuju, font: sundmus.target.value || undefined })
          }
          aria-label="Teksti font"
          className="border border-sage bg-bone px-2 py-1.5 text-[0.9rem] text-ink-soft"
        >
          <option value="">Vaikimisi</option>
          <optgroup label="Pealkirjafondid">
            {KUVA_FONDID.map((font) => (
              <option key={font.id} value={font.id}>
                {font.nimi}
              </option>
            ))}
          </optgroup>
          <optgroup label="Tekstifondid">
            {TEKSTI_FONDID.map((font) => (
              <option key={font.id} value={font.id}>
                {font.nimi}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-sage pt-3">
        <button
          type="button"
          onClick={() => {
            muudaKuju(tee, null);
            setAvatud(false);
          }}
          className={NUPP_TEKST}
        >
          Lähtesta kogu kuju
        </button>
        <button
          type="button"
          onClick={() => setAvatud(false)}
          className={NUPP_TEKST}
        >
          Sulge
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sisselogimine                                                       */
/* ------------------------------------------------------------------ */

export function Sisselogimisvorm({ lukus = false }) {
  const [seis, tegevus, ootel] = useActionState(loguSisseTegevus, { viga: "" });

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
      <p className="silt">Sisuhaldus</p>
      <h1 className="kuva mt-4 text-[clamp(1.8rem,3.4vw,2.5rem)] text-ink">
        Logi sisse
      </h1>
      <div className="joon mt-8" />

      {lukus ? (
        /* Parooli pole serveris määratud — admin on lukus */
        <div className="mt-8 border border-sage bg-linen p-6">
          <p className="text-[0.95rem] leading-relaxed text-ink-soft">
            Admin on lukus. Serveris ei ole määratud keskkonnamuutujat{" "}
            <code className="bg-sage px-1 text-ink">ADMIN_PAROOL</code>. Lisa
            see serveri seadistusse ja käivita rakendus uuesti — alles siis saab
            sisse logida.
          </p>
        </div>
      ) : (
        <form action={tegevus} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="admin-parool"
              className="mikro block text-[0.7rem] text-ink-faint"
            >
              Parool
            </label>
            <input
              id="admin-parool"
              name="parool"
              type="password"
              required
              autoComplete="current-password"
              className={`${VALI_KLASS} mt-2`}
            />
          </div>

          <p aria-live="polite" className="min-h-6 text-[0.9rem] text-gold-deep">
            {seis?.viga}
          </p>

          <button type="submit" disabled={ootel} className={`${NUPP_ROHE} w-full`}>
            {ootel ? "Kontrollin …" : "Logi sisse"}
          </button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Üksikväljad                                                         */
/* ------------------------------------------------------------------ */

/* Tekstiala, mis kasvab sisu järgi — kerimisriba ei teki kunagi */
function KasvavTekstiala({ id, vaartus, muuda, readOnly }) {
  const viide = useRef(null);

  useEffect(() => {
    const element = viide.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [vaartus]);

  return (
    <textarea
      id={id}
      ref={viide}
      rows={2}
      value={vaartus}
      readOnly={readOnly}
      onChange={(sundmus) => muuda(sundmus.target.value)}
      className={`${VALI_KLASS} resize-none overflow-hidden`}
    />
  );
}

/*
  Üks tekstiväli. Sisendi ja tekstiala vahel otsustame ÜKS KORD, välja
  loomisel — muidu vahetuks element keset kirjutamist ja fookus kaoks.
*/
function Tekstivali({ id, voti, vaartus, muuda, siltTekst, tee }) {
  const [pikk] = useState(
    () =>
      PIKAD_VOTMED.has(voti) || vaartus.length > 90 || vaartus.includes("\n"),
  );
  const tehniline = TEHNILISED.has(voti);
  const readOnly = AINULT_LOETAV.has(voti);

  /*
    Kujupaneel ilmub ainult nendele väljadele, mis on lehel päriselt kujuga
    ühendatud (vt src/sisu/tekstikujud.js KUJUNDATAVAD) — muidu saaks kuju
    valida ja lehel ei juhtuks midagi.
  */
  const kujuTee = Array.isArray(tee) ? tee.join(".") : null;
  const kujuVariandid = readOnly ? [] : teenuseKujuVariandid(kujuTee);
  const kujundatav =
    !readOnly &&
    kujuVariandid.length === 0 &&
    kujuTee !== null &&
    onKujundatav(kujuTee);

  return (
    <div>
      <label htmlFor={id} className="mikro block text-[0.7rem] text-ink-faint">
        {siltTekst ?? silt(voti)}
        {tehniline && (
          <span className="ml-2 normal-case tracking-normal text-gold-deep">
            tehniline väli
          </span>
        )}
      </label>

      <div className="mt-2">
        {pikk ? (
          <KasvavTekstiala
            id={id}
            vaartus={vaartus}
            muuda={muuda}
            readOnly={readOnly}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={vaartus}
            readOnly={readOnly}
            onChange={(sundmus) => muuda(sundmus.target.value)}
            className={VALI_KLASS}
          />
        )}
      </div>

      {voti === "slug" && (
        <p className="mt-1 text-[0.8rem] text-ink-faint">
          Osa lehe aadressist. Olemasoleva muutmine katkestab vanad lingid.
        </p>
      )}
      {readOnly && (
        <p className="mt-1 text-[0.8rem] text-ink-faint">
          Seda välja muudetakse ainult koodis.
        </p>
      )}

      {kujundatav && <Kujupaneel tee={kujuTee} />}
      {kujuVariandid.length > 0 && (
        <div className="mt-3 border-l border-sage pl-4">
          <p className="mikro text-[0.65rem] text-ink-faint">
            Kujundus eri kohtades
          </p>
          <div className="flex flex-col items-start">
            {kujuVariandid.map((variant) => (
              <Kujupaneel
                key={variant.tee}
                tee={variant.tee}
                nimi={variant.nimi}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Massiivid                                                           */
/* ------------------------------------------------------------------ */

function MassiiviNupud({ indeks, pikkus, liiguta, eemalda, nimetus }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => liiguta(indeks, -1)}
        disabled={indeks === 0}
        aria-label={`Liiguta ${nimetus} ülespoole`}
        title="Üles"
        className={NUPP_VAIKE}
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => liiguta(indeks, 1)}
        disabled={indeks === pikkus - 1}
        aria-label={`Liiguta ${nimetus} allapoole`}
        title="Alla"
        className={NUPP_VAIKE}
      >
        ↓
      </button>
      <button
        type="button"
        onClick={() => eemalda(indeks)}
        aria-label={`Eemalda ${nimetus}`}
        title="Eemalda"
        className={NUPP_VAIKE}
      >
        ×
      </button>
    </div>
  );
}

function Massiiv({ voti, vaartus, tee, muuda, sugavus }) {
  const id = tee.join("-");
  const [valitudIndeks, setValitudIndeks] = useState(0);
  const teenuseNimekirjaRead =
    tee.length === 3 && tee[0] === "teenused" && voti === "nimekiri";

  /*
    Kas tegu on objektiplokkide või tekstiridade massiiviga. Tühja massiivi
    puhul otsustab malli kuju — muidu näeks tühi blogipostituste loend välja
    nagu tekstiread ja "Lisa" annaks vale kujuga elemendi.
  */
  const mall = uusElement(vaartus, voti);
  const objektid = vaartus.some((element) => onObjekt(element)) || onObjekt(mall);
  const valikuline =
    objektid && vaartus.some((element) => suurPlokk(element));
  const aktiivneIndeks =
    vaartus.length > 0 ? Math.min(valitudIndeks, vaartus.length - 1) : -1;
  const aktiivneElement = vaartus[aktiivneIndeks];

  function lisa() {
    muuda(tee, [...vaartus, uusElement(vaartus, voti)]);
    setValitudIndeks(vaartus.length);
  }

  function eemalda(indeks) {
    muuda(
      tee,
      vaartus.filter((_, jrk) => jrk !== indeks),
    );
    setValitudIndeks((eelmine) => {
      if (eelmine > indeks) return eelmine - 1;
      if (eelmine === indeks) return Math.max(0, indeks - 1);
      return eelmine;
    });
  }

  function liiguta(indeks, suund) {
    const uusIndeks = indeks + suund;
    if (uusIndeks < 0 || uusIndeks >= vaartus.length) return;
    const koopia = vaartus.slice();
    [koopia[indeks], koopia[uusIndeks]] = [koopia[uusIndeks], koopia[indeks]];
    muuda(tee, koopia);
    setValitudIndeks((eelmine) => {
      if (eelmine === indeks) return uusIndeks;
      if (eelmine === uusIndeks) return indeks;
      return eelmine;
    });
  }

  return (
    <fieldset className="min-w-0 w-full border border-sage bg-bone p-4 sm:p-5">
      <legend className="mikro px-2 text-[0.7rem] text-ink-faint">
        {silt(voti)}
      </legend>

      {teenuseNimekirjaRead && (
        <p className="mb-4 border-l-2 border-gold-deep pl-4 text-[0.85rem] leading-relaxed text-ink-soft">
          Iga rida kuvatakse avalikul lehel eraldi. Siin on ka ploki lõpulause.
        </p>
      )}

      {vaartus.length === 0 && (
        <p className="text-[0.9rem] text-ink-faint">Ridu veel ei ole.</p>
      )}

      {valikuline ? (
        <>
          <div
            className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
            aria-label={`Vali ${silt(voti).toLowerCase()} kirje`}
          >
            {vaartus.map((element, indeks) => {
              const aktiivne = indeks === aktiivneIndeks;
              return (
                <button
                  key={`${id}-valik-${element?.slug ?? indeks}`}
                  type="button"
                  onClick={() => setValitudIndeks(indeks)}
                  aria-pressed={aktiivne}
                  className={`min-h-12 border px-4 py-3 text-left transition-colors ${
                    aktiivne
                      ? "border-rohe bg-rohe text-white"
                      : "border-sage bg-linen text-ink-soft hover:border-rohe hover:text-rohe"
                  }`}
                >
                  <span className="kuva block text-base leading-snug">
                    {plokiNimi(element, indeks)}
                  </span>
                  <span
                    className={`mt-1 block text-[0.72rem] ${
                      aktiivne ? "text-white/75" : "text-ink-faint"
                    }`}
                  >
                    {aktiivne ? "Praegu avatud" : "Ava muutmiseks"}
                  </span>
                </button>
              );
            })}
          </div>

          {aktiivneElement && (
            <div className="mt-5 border border-rohe/45 bg-linen p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sage pb-4">
                <div>
                  <p className="mikro text-[0.65rem] text-ink-faint">
                    Muudad praegu
                  </p>
                  <h3 className="kuva mt-1 text-xl text-ink">
                    {plokiNimi(aktiivneElement, aktiivneIndeks)}
                  </h3>
                </div>
                <MassiiviNupud
                  indeks={aktiivneIndeks}
                  pikkus={vaartus.length}
                  liiguta={liiguta}
                  eemalda={eemalda}
                  nimetus={`kirje ${aktiivneIndeks + 1}`}
                />
              </div>
              <div className="mt-5 space-y-4">
                <Valjad
                  vaartus={aktiivneElement}
                  tee={[...tee, aktiivneIndeks]}
                  muuda={muuda}
                  sugavus={sugavus + 1}
                />
              </div>
            </div>
          )}
        </>
      ) : (
      <div className="space-y-4">
        {vaartus.map((element, indeks) => (
          <div
            key={`${id}-${indeks}`}
            className={
              objektid
                ? "border border-sage bg-linen p-4"
                : "flex items-start gap-3"
            }
          >
            {objektid ? (
              <>
                {/*
                  Nupud jäävad päisereale, väljapoole <details>-it: nii saab
                  plokke ümber tõsta ja eemaldada ka siis, kui nad on kinni.
                */}
                <div className="flex items-start justify-between gap-4">
                  <p className="kuva text-lg text-ink">
                    {plokiNimi(element, indeks)}
                  </p>
                  <MassiiviNupud
                    indeks={indeks}
                    pikkus={vaartus.length}
                    liiguta={liiguta}
                    eemalda={eemalda}
                    nimetus={`plokk ${indeks + 1}`}
                  />
                </div>
                {suurPlokk(element) ? (
                  <details className="mt-3">
                    {/*
                      Silt peab ütlema KÕIK, mis kinnise nurga taga on. Vana
                      „Alamlehe tekstid” lubas ainult alamlehte, aga sama nurga
                      all on ka teenuse nimi, alapealkiri ja lühikirjeldus —
                      needsamad, mis seisavad avalehe ja teenuste lehe
                      registris. Marta luges sildi ära ja järeldas, et nime
                      muuta ei saagi.
                    */}
                    <summary className="mikro cursor-pointer text-[0.7rem] text-ink-faint transition-colors hover:text-rohe">
                      {voti === "teenused"
                        ? "Ava teenuse tekstid · nimi, alapealkiri, lühikirjeldus ja alamleht"
                        : "Tekstid"}
                    </summary>
                    <div className="mt-4 space-y-4">
                      <Valjad
                        vaartus={element}
                        tee={[...tee, indeks]}
                        muuda={muuda}
                        sugavus={sugavus + 1}
                      />
                    </div>
                  </details>
                ) : (
                  <div className="mt-4 space-y-4">
                    <Valjad
                      vaartus={element}
                      tee={[...tee, indeks]}
                      muuda={muuda}
                      sugavus={sugavus + 1}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex-1">
                  <Tekstivali
                    id={`${id}-${indeks}`}
                    voti={voti}
                    tee={[...tee, indeks]}
                    vaartus={typeof element === "string" ? element : ""}
                    muuda={(uus) => muuda([...tee, indeks], uus)}
                    siltTekst={`Rida ${indeks + 1}`}
                  />
                </div>
                <div className="pt-7">
                  <MassiiviNupud
                    indeks={indeks}
                    pikkus={vaartus.length}
                    liiguta={liiguta}
                    eemalda={eemalda}
                    nimetus={`rida ${indeks + 1}`}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      )}

      <button type="button" onClick={lisa} className={`${NUPP_AARIS} mt-4`}>
        {objektid ? "Lisa plokk" : "Lisa rida"}
      </button>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Rekursiivne renderdaja                                              */
/* ------------------------------------------------------------------ */

/*
  Renderdab objekti sisu. Väärtuse tüüp otsustab välja kuju:
    sõne            -> sisend või kasvav tekstiala
    sõnede massiiv  -> read koos nuppudega
    objektimassiiv  -> korduvad plokid
    objekt          -> kokkupandav alamsektsioon
*/
function Valjad({ vaartus, tee, muuda, sugavus = 0 }) {
  if (!onObjekt(vaartus)) return null;

  return valjadJarjekorras(vaartus, tee).map(([voti, alamVaartus]) => {
    const alamTee = [...tee, voti];
    const id = alamTee.join("-");

    if (typeof alamVaartus === "string") {
      return (
        <Tekstivali
          key={id}
          id={id}
          voti={voti}
          tee={alamTee}
          vaartus={alamVaartus}
          muuda={(uus) => muuda(alamTee, uus)}
        />
      );
    }

    if (Array.isArray(alamVaartus)) {
      return (
        <Massiiv
          key={id}
          voti={voti}
          vaartus={alamVaartus}
          tee={alamTee}
          muuda={muuda}
          sugavus={sugavus}
        />
      );
    }

    if (onObjekt(alamVaartus)) {
      return (
        <details
          key={id}
          open={sugavus < 1}
          className="border border-sage bg-bone"
        >
          <summary className="mikro cursor-pointer px-4 py-3 text-[0.7rem] text-ink-faint transition-colors hover:text-rohe">
            {silt(voti)}
          </summary>
          <div className="space-y-4 border-t border-sage p-4 sm:p-5">
            <Valjad
              vaartus={alamVaartus}
              tee={alamTee}
              muuda={muuda}
              sugavus={sugavus + 1}
            />
          </div>
        </details>
      );
    }

    return null;
  });
}

/*
  Lehe esimene tase on valik, mitte pikk lahtine vorm.

  Lihtsad tekstiväljad koonduvad ühe valiku „Üldtekstid” alla; iga suurem
  plokk (hero, kutsumus, kirjakoht …) saab oma nupu. Nii näeb Marta kohe,
  millised lehe osad on muudetavad, ja vormis on korraga ainult valitud osa.
  Sügavamal jääb rekursiivne Valjad alles, seega uued sisuvõtmed ilmuvad
  admini endiselt automaatselt.
*/
function KompaktneValjad({ vaartus, tee, muuda }) {
  const kirjed = onObjekt(vaartus) ? valjadJarjekorras(vaartus, tee) : [];
  const lihtsad = kirjed.filter(([, alamVaartus]) =>
    typeof alamVaartus === "string",
  );
  const keerukad = kirjed.filter(([, alamVaartus]) =>
    typeof alamVaartus !== "string",
  );
  const osad = [
    ...(lihtsad.length > 0
      ? [{ id: "__uldtekstid", nimi: "Üldtekstid", liik: "lihtsad", kirjed: lihtsad }]
      : []),
    ...keerukad.map(([voti, alamVaartus]) => ({
      id: String(voti),
      nimi: silt(voti),
      liik: Array.isArray(alamVaartus) ? "massiiv" : "objekt",
      voti,
      vaartus: alamVaartus,
    })),
  ];
  const [valitudOsa, setValitudOsa] = useState(osad[0]?.id ?? null);
  const aktiivne = osad.find((osa) => osa.id === valitudOsa) ?? osad[0];

  if (!onObjekt(vaartus)) return null;
  if (osad.length <= 1) {
    return <Valjad vaartus={vaartus} tee={tee} muuda={muuda} sugavus={0} />;
  }

  return (
    <div>
      <div
        className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Vali muudetav leheosa"
      >
        {osad.map((osa) => {
          const onAktiivne = osa.id === aktiivne?.id;
          return (
            <button
              key={osa.id}
              type="button"
              onClick={() => setValitudOsa(osa.id)}
              aria-pressed={onAktiivne}
              className={`min-h-11 border px-4 py-3 text-left text-[0.9rem] transition-colors ${
                onAktiivne
                  ? "border-rohe bg-rohe text-white"
                  : "border-sage bg-bone text-ink-soft hover:border-rohe hover:text-rohe"
              }`}
            >
              {osa.nimi}
            </button>
          );
        })}
      </div>

      {aktiivne && (
        <div className="mt-5 border-l-2 border-rohe bg-bone px-4 py-5 sm:px-6">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-sage pb-3">
            <h3 className="kuva text-xl text-ink">{aktiivne.nimi}</h3>
            <span className="mikro text-[0.62rem] text-ink-faint">
              Valitud leheosa
            </span>
          </div>

          <div className="space-y-4">
            {aktiivne.liik === "lihtsad" &&
              aktiivne.kirjed.map(([voti, alamVaartus]) => {
                const alamTee = [...tee, voti];
                return (
                  <Tekstivali
                    key={alamTee.join("-")}
                    id={alamTee.join("-")}
                    voti={voti}
                    tee={alamTee}
                    vaartus={alamVaartus}
                    muuda={(uus) => muuda(alamTee, uus)}
                  />
                );
              })}

            {aktiivne.liik === "massiiv" && (
              <Massiiv
                voti={aktiivne.voti}
                vaartus={aktiivne.vaartus}
                tee={[...tee, aktiivne.voti]}
                muuda={muuda}
                sugavus={0}
              />
            )}

            {aktiivne.liik === "objekt" && (
              <Valjad
                vaartus={aktiivne.vaartus}
                tee={[...tee, aktiivne.voti]}
                muuda={muuda}
                sugavus={1}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toimeti                                                             */
/* ------------------------------------------------------------------ */

export default function AdminToimeti({
  keel = VAIKEKEEL,
  algsisu,
  algtunnus,
  algsaeg = null,
}) {
  const [sisu, setSisu] = useState(algsisu);
  const [muudetud, setMuudetud] = useState(false);
  const [valitud, setValitud] = useState(SEKTSIOONID[0].id);
  const [valitudSisuTee, setValitudSisuTee] = useState(
    SEKTSIOONID[0].teed[0],
  );
  const [teade, setTeade] = useState(null);
  const [tootab, setTootab] = useState(false);
  /*
    Faili tunnus lehe avamise hetkest (vt src/sisu/lukk.js). Läheb iga
    salvestusega kaasa; server keeldub, kui fail on vahepeal mujal muutunud.
    Õnnestunud salvestus annab uue tunnuse tagasi.
  */
  const [tunnus, setTunnus] = useState(algtunnus);
  const [konflikt, setKonflikt] = useState(false);
  /* Millal see keel viimati faili kirjutati — päises, et seis oleks näha */
  const [salvestatud, setSalvestatud] = useState(algsaeg);
  const [mustand, setMustand] = useState(null);
  const mustandLoetud = useRef(false);

  const sektsioon =
    SEKTSIOONID.find((kirje) => kirje.id === valitud) ?? SEKTSIOONID[0];
  const aktiivneSisuTee = sektsioon.teed.includes(valitudSisuTee)
    ? valitudSisuTee
    : sektsioon.teed[0];

  function valiSektsioon(id) {
    const uusSektsioon =
      SEKTSIOONID.find((kirje) => kirje.id === id) ?? SEKTSIOONID[0];
    setValitud(uusSektsioon.id);
    setValitudSisuTee(uusSektsioon.teed[0]);
  }

  /* Hoiatus enne lahkumist, kui midagi on salvestamata */
  useEffect(() => {
    if (!muudetud) return undefined;

    function hoiata(sundmus) {
      sundmus.preventDefault();
      /* Brauserid näitavad oma teksti; väärtus peab lihtsalt olemas olema */
      sundmus.returnValue = "";
    }

    window.addEventListener("beforeunload", hoiata);
    return () => window.removeEventListener("beforeunload", hoiata);
  }, [muudetud]);

  /*
    Mustand on viimane kaitsevõrk enne serverit: kui Marta läheb kogemata
    admini teisele lehele või brauser taastab vahekaardi, saab ta oma sama
    brauseri salvestamata teksti tagasi võtta. Server ei näe seda kunagi ning
    ta ei kirjuta kellegi teise muudatusi üle.
  */
  useEffect(() => {
    const taimer = window.setTimeout(() => {
      mustandLoetud.current = true;
      setMustand(loeMustand(keel));
    }, 0);

    return () => window.clearTimeout(taimer);
  }, [keel]);

  useEffect(() => {
    try {
      if (!mustandLoetud.current) return;
      if (!muudetud) {
        /* Nähtav taastamisvalik ei ole veel otsus mustandit kustutada. */
        if (mustand) return;
        window.sessionStorage.removeItem(mustandiVoti(keel));
        return;
      }

      window.sessionStorage.setItem(
        mustandiVoti(keel),
        JSON.stringify({
          versioon: MUSTANDI_VERSIOON,
          tunnus,
          sisu,
          aeg: new Date().toISOString(),
        }),
      );
    } catch {
      /* Mustand on lisakaitse; brauseri keelatud salvestus ei tohi toimetit rikkuda. */
    }
  }, [keel, muudetud, sisu, tunnus, mustand]);

  function muuda(tee, uusVaartus) {
    setSisu((eelmine) => asendaTeel(eelmine, tee, uusVaartus));
    setMuudetud(true);
    setTeade(null);
  }

  function loobuMustandist() {
    try {
      window.sessionStorage.removeItem(mustandiVoti(keel));
    } catch {
      /* Eemaldamine on parim pingutus, nagu mustandi kirjutaminegi. */
    }
    setMustand(null);
  }

  function taastaMustand() {
    if (!mustand) return;

    setSisu(mustand.sisu);
    setMuudetud(true);
    setTeade({
      liik: "ok",
      tekst:
        mustand.tunnus === algtunnus
          ? "Salvestamata mustand taastati."
          : "Mustand taastati. Serveris on vahepeal muudatusi — enne salvestamist kontrolli tekst üle.",
    });
    setMustand(null);
  }

  /*
    Ühe teksti kuju. null tähendab „lähtesta” — siis võti kustutatakse.
    Tühjaks jäänud kuju (kõik omadused vaikimisi) kustutatakse samuti, et
    kaardile ei koguneks tühje kirjeid.
  */
  function muudaKuju(tee, uusKuju) {
    setSisu((eelmine) => {
      const kaart = { ...(eelmine[TEKSTIKUJUDE_VOTI] ?? {}) };

      /* undefined-väärtused välja: need tähendavad „vaikimisi” */
      const puhas = {};
      for (const [votme, vaartus] of Object.entries(uusKuju ?? {})) {
        if (vaartus === undefined || vaartus === null) continue;
        if (votme === "joondus" && vaartus === "vasak") continue;
        if (votme === "suurus" && Number(vaartus) === 1) continue;
        puhas[votme] = vaartus;
      }

      /*
        Telefonisuurus, mis on arvuti omaga sama, ei ütle midagi — sama reegel
        mis salvestuse puhastuses (src/sisu/tekstikujud.js). Ilma selleta jääks
        liuguri kõrvale protsent ka siis, kui vahet päriselt ei ole.
      */
      if (
        puhas.suurusMobiil !== undefined &&
        Number(puhas.suurusMobiil) === Number(puhas.suurus ?? 1)
      ) {
        delete puhas.suurusMobiil;
      }

      if (Object.keys(puhas).length === 0) {
        delete kaart[tee];
      } else {
        kaart[tee] = puhas;
      }

      return { ...eelmine, [TEKSTIKUJUDE_VOTI]: kaart };
    });
    setMuudetud(true);
    setTeade(null);
  }

  /*
    Ühine vastuse käsitlus salvestamisele ja lähtestamisele.

    KONFLIKT: sisu EI asendata ega väljasid ei puudutata — Marta tekst jääb
    ekraanile alles, et ta saaks selle enne uuesti laadimist kopeerida. See on
    kogu luku mõte: vaikne ülekirjutus asendub nähtava keeldumisega.
  */
  function votaVastus(vastus, vaikeViga) {
    if (vastus?.ok) {
      if (vastus.sisu) setSisu(vastus.sisu);
      if (vastus.tunnus) setTunnus(vastus.tunnus);
      if (vastus.aeg) setSalvestatud(vastus.aeg);
      setKonflikt(false);
      setMuudetud(false);
      setTeade({ liik: "ok", tekst: vastus.sonum ?? "Salvestatud." });
      return;
    }

    if (vastus?.konflikt) setKonflikt(true);
    setTeade({ liik: "viga", tekst: vastus?.viga ?? vaikeViga });
  }

  async function salvesta() {
    setTootab(true);
    setTeade(null);
    try {
      const vastus = await salvestaTegevus(keel, sisu, tunnus);
      votaVastus(vastus, "Salvestamine ebaõnnestus.");
    } catch {
      setTeade({
        liik: "viga",
        tekst: "Salvestamine ebaõnnestus — ühendus serveriga katkes.",
      });
    } finally {
      setTootab(false);
    }
  }

  async function lahtesta(tee) {
    const keeleNimi = KEELED.find((k) => k.kood === keel)?.silt ?? keel;
    const kinnitus = window.confirm(
      `Kas lähtestada „${silt(tee)}” vaikimisi tekstidele?\n\n` +
        `Tekstid lähtestatakse ainult keeles ${keeleNimi}.\n` +
        "Selle sektsiooni tekstide KUJU (värv, suurus, font) on aga keelte " +
        "peale ühine ja läheb maha mõlemas keeles.\n\n" +
        "Lähtestamine salvestab kohe. Kõik salvestamata muudatused lähevad kaotsi.",
    );
    if (!kinnitus) return;

    setTootab(true);
    setTeade(null);
    try {
      const vastus = await lahtestaTegevus(keel, tee, tunnus);
      votaVastus(vastus, "Lähtestamine ebaõnnestus.");
    } catch {
      setTeade({
        liik: "viga",
        tekst: "Lähtestamine ebaõnnestus — ühendus serveriga katkes.",
      });
    } finally {
      setTootab(false);
    }
  }

  return (
    <KujuKontekst.Provider
      value={{ kujud: sisu[TEKSTIKUJUDE_VOTI] ?? {}, muudaKuju }}
    >
    <div className="mx-auto w-full max-w-[1360px] px-6 py-10 lg:px-10">
      {/*
        KEELEVALIK.

        Keel elab aadressis (/admin?keel=en), mitte seisundis: nii saab lingi
        järjehoidjasse panna ja lehe värskendamine ei viska teist keelt maha.
        Salvestamata muudatuste korral küsime kinnitust — Link teeb
        kliendipoolse navigeerimise ja brauseri oma „kas lahkuda” hoiatus
        (beforeunload) siis ei käivitu.
      */}
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 border border-sage bg-bone px-4 py-3">
        <span className="mikro text-[0.7rem] text-ink-faint">Keel</span>
        <div className="flex flex-wrap items-center gap-2">
          {KEELED.map((k) => {
            const aktiivne = k.kood === keel;
            const aadress =
              k.kood === VAIKEKEEL ? "/admin" : `/admin?keel=${k.kood}`;

            return (
              <Link
                key={k.kood}
                href={aadress}
                aria-current={aktiivne ? "true" : undefined}
                onClick={(sundmus) => {
                  if (aktiivne || !muudetud) return;
                  const kinnitus = window.confirm(
                    "Sul on salvestamata muudatusi. Hoian need selles brauseris " +
                      "mustandina alles, kuid enne salvestamist pead need teises " +
                      "keeles uuesti üle vaatama. Kas jätkata?",
                  );
                  if (!kinnitus) sundmus.preventDefault();
                }}
                className={`mikro border px-4 py-2 text-[0.7rem] transition-colors ${
                  aktiivne
                    ? "border-rohe bg-rohe text-white"
                    : "border-sage text-ink-faint hover:border-rohe hover:text-rohe"
                }`}
              >
                {k.silt}
              </Link>
            );
          })}
        </div>
        <p className="text-[0.85rem] leading-relaxed text-ink-soft">
          Tekstid on kummalgi keelel omad. Tekstide KUJU — värv, suurus, font,
          joondus — on mõlemal keelel ühine: kujunda korra, muutub mõlemal
          pool.
        </p>
      </div>

      {mustand && (
        <div
          role="status"
          className="mb-8 border-l-2 border-rohe bg-linen px-5 py-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="kuva text-xl text-ink">Salvestamata mustand on alles</p>
              <p className="mt-2 max-w-[70ch] text-[0.9rem] leading-relaxed text-ink-soft">
                See on selle brauseri eelmise adminivaate tekst. {mustand.tunnus === algtunnus
                  ? "Serveri seis ei ole muutunud; taastamine on ohutu."
                  : "Serveri seis on vahepeal muutunud; pärast taastamist vaata tekst enne salvestamist üle."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loobuMustandist}
                className={NUPP_AARIS}
              >
                Ära taasta
              </button>
              <button
                type="button"
                onClick={taastaMustand}
                className={NUPP_ROHE}
              >
                Taasta mustand
              </button>
            </div>
          </div>
        </div>
      )}

      {/*
        KONFLIKT. Näeme seda siis, kui fail on vahepeal mujal muutunud (teine
        vahekaart, teine seade). Väljasid me EI puutu: Marta tekst peab jääma
        ekraanile, et ta saaks muudetud kohad kopeerida enne uuesti laadimist.
      */}
      {konflikt && (
        <div
          role="alert"
          className="mb-8 border-l-2 border-gold-deep bg-bone px-6 py-5"
        >
          <p className="kuva text-xl text-ink">Salvestamine peatati</p>
          <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-ink-soft">
            Sisu on vahepeal mujal muutunud — tõenäoliselt on admin lahti veel
            ühes vahekaardis või teises seadmes. Ma ei kirjutanud seda üle.
            Sinu tekst on siin lehel alles: kopeeri muudetud kohad kõrvale ja
            laadi siis leht uuesti.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`${NUPP_AARIS} mt-5`}
          >
            Laadi leht uuesti
          </button>
        </div>
      )}

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
        {/* Mobiilis vormi kohal, laual vasakul ja püsiv */}
        <nav
          aria-label="Sisu sektsioonid"
          className="lg:sticky lg:top-28 lg:w-56 lg:shrink-0"
        >
          <p className="mikro mb-3 text-[0.65rem] text-ink-faint">Vali leht</p>
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {SEKTSIOONID.map((kirje) => {
              const aktiivne = kirje.id === valitud;
              return (
                <li key={kirje.id} className="lg:border-b lg:border-sage">
                  <button
                    type="button"
                    onClick={() => valiSektsioon(kirje.id)}
                    aria-current={aktiivne ? "true" : undefined}
                    className={`mikro min-h-11 w-full border px-4 py-3 text-left text-[0.7rem] transition-colors lg:border-0 lg:border-l-2 lg:px-4 ${
                      aktiivne
                        ? "border-rohe bg-linen text-rohe"
                        : "border-sage text-ink-faint hover:border-rohe hover:text-ink"
                    }`}
                  >
                    {kirje.nimi}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          {/*
            Uues aknas, mitte samas: admini olek (avatud paneelid, salvestamata
            tekst) peab alles jääma. Aadress käib läbi keeleTee(), nii et
            inglise sisu vaadates avaneb inglise leht.
          */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-sage pb-5">
            <div>
              <p className="mikro text-[0.65rem] text-ink-faint">Muudad lehte</p>
              <h2 className="kuva mt-1 text-[clamp(1.8rem,3vw,2.5rem)] text-ink">
                {sektsioon.nimi}
              </h2>
            </div>
            {sektsioon.leht && (
              <a
                href={keeleTee(keel, sektsioon.leht)}
                target="_blank"
                rel="noreferrer"
                className={NUPP_AARIS}
              >
                Vaata lehel ↗
              </a>
            )}
          </div>

          {sektsioon.teed.length > 1 && (
            <div className="mb-8 border border-sage bg-linen p-4 sm:p-5">
              <p className="mikro mb-3 text-[0.65rem] text-ink-faint">
                Vali, millist osa muudad
              </p>
              <div className="flex flex-wrap gap-2" aria-label="Lehe sisuosad">
                {sektsioon.teed.map((tee) => {
                  const aktiivne = tee === aktiivneSisuTee;
                  return (
                    <button
                      key={tee}
                      type="button"
                      onClick={() => setValitudSisuTee(tee)}
                      aria-pressed={aktiivne}
                      className={`min-h-11 border px-4 py-2.5 text-left text-[0.85rem] transition-colors ${
                        aktiivne
                          ? "border-rohe bg-rohe text-white"
                          : "border-sage bg-bone text-ink-soft hover:border-rohe hover:text-rohe"
                      }`}
                    >
                      {silt(tee)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(() => {
            const tee = aktiivneSisuTee;
            const viide = VIITED[tee];
            const sihtNimi = viide?.siht
              ? (SEKTSIOONID.find((kirje) => kirje.id === viide.siht)?.nimi ??
                viide.siht)
              : null;

            return (
              <section key={tee} aria-labelledby={`sektsioon-${tee}`}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2
                    id={`sektsioon-${tee}`}
                    className="kuva text-[clamp(1.45rem,2.5vw,2rem)] text-ink"
                  >
                    {silt(tee)}
                  </h2>
                  <button
                    type="button"
                    onClick={() => lahtesta(tee)}
                    disabled={tootab}
                    className={NUPP_AARIS}
                  >
                    Lähtesta
                  </button>
                </div>
                <div className="joon mt-4 mb-6" />

                {viide && (
                  <details className="mb-6 border border-sage bg-linen">
                    <summary className="mikro cursor-pointer px-4 py-3 text-[0.68rem] text-ink-faint transition-colors hover:text-rohe">
                      Kus neid tekste kasutatakse?
                    </summary>
                    <p className="border-t border-sage px-4 py-3 text-[0.85rem] leading-relaxed text-ink-soft">
                      {viide.tekst}
                      {sihtNimi && (
                        <button
                          type="button"
                          onClick={() => valiSektsioon(viide.siht)}
                          className={`${NUPP_TEKST} ml-2`}
                        >
                          {`Ava „${sihtNimi}”`}
                        </button>
                      )}
                    </p>
                  </details>
                )}

                <div className="space-y-5">
                  {tee === "fotograafiaGalerii" ? (
                    <FotograafiaGaleriiHaldus
                      keel={keel}
                      galerii={sisu[tee]}
                      muuda={(uus) => muuda([tee], uus)}
                      keelatud={tootab}
                    />
                  ) : Array.isArray(sisu[tee]) ? (
                    <Massiiv
                      voti={tee}
                      vaartus={sisu[tee]}
                      tee={[tee]}
                      muuda={muuda}
                      sugavus={0}
                    />
                  ) : typeof sisu[tee] === "string" ? (
                    <Tekstivali
                      id={tee}
                      voti={tee}
                      tee={[tee]}
                      vaartus={sisu[tee]}
                      muuda={(uus) => muuda([tee], uus)}
                    />
                  ) : (
                    <KompaktneValjad
                      vaartus={sisu[tee]}
                      tee={[tee]}
                      muuda={muuda}
                    />
                  )}
                </div>
              </section>
            );
          })()}
        </div>
      </div>

      {/*
        Salvestusriba on lehe all ja jääb kerimisel nähtavale. Alla, mitte
        üles: lehe oma päis on juba sticky top-0 ja kaks riba kaklekisid seal.
      */}
      <div className="sticky bottom-0 z-30 -mx-6 mt-12 border-t border-sage bg-bone/95 px-6 py-3 backdrop-blur sm:py-4 lg:-mx-10 lg:px-10">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {muudetud ? (
              <span className="border border-gold-deep px-3 py-1 text-[0.8rem] text-gold-deep">
                Salvestamata muudatused
              </span>
            ) : (
              <span className="text-[0.8rem] text-ink-faint">
                <span className="sm:hidden">Salvestatud</span>
                <span className="hidden sm:inline">
                  Kõik muudatused on salvestatud
                </span>
              </span>
            )}
            {/* Millal see keel viimati faili kirjutati — vastab küsimusele
                „kas minu eelmine salvestus üldse jõudis kohale” */}
            {salvestatud && (
              <>
                <span className="text-[0.75rem] text-ink-faint sm:hidden">
                  Salv. {vormindaAegLuhike(salvestatud)}
                </span>
                <span className="hidden text-[0.8rem] text-ink-faint sm:inline">
                  Viimati salvestatud {vormindaAeg(salvestatud)}
                </span>
              </>
            )}
            <p
              aria-live="polite"
              className={`text-[0.9rem] ${
                teade?.liik === "viga" ? "text-gold-deep" : "text-ink-faint"
              }`}
            >
              {teade?.tekst}
            </p>
          </div>

          <button
            type="button"
            onClick={salvesta}
            disabled={tootab || !muudetud}
            className={NUPP_ROHE}
          >
            {tootab ? "Salvestan …" : "Salvesta"}
          </button>
        </div>
      </div>
    </div>
    </KujuKontekst.Provider>
  );
}
