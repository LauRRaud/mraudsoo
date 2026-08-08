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
import {
  SUURUSE_MAX,
  SUURUSE_MIN,
  TEKSTIKUJUDE_VOTI,
  onKujundatav,
  teenuseKujuVariandid,
} from "@/sisu/tekstikujud";
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
  teenuseLeht: "Teenuse alamlehe tekstid",
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
  nimekirjaPealkiri: "Nimekirja pealkiri",
  nimekiri: "Nimekiri",
  nimekirjaSilt: "Nimekirja silt",
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
const SEKTSIOONID = [
  { id: "avaleht", nimi: "Avaleht", teed: ["avaleht"] },
  { id: "minust", nimi: "Minust", teed: ["minust"] },
  {
    id: "teenused",
    nimi: "Teenused",
    teed: ["teenusedLeht", "teenused", "teenuseLeht"],
  },
  {
    id: "hinnakiri",
    nimi: "Hinnakiri",
    teed: ["hinnakiriLeht", "hinnakiri", "teekond"],
  },
  { id: "blogi", nimi: "Blogi", teed: ["blogiLeht", "postitused"] },
  { id: "broneerimine", nimi: "Broneerimine", teed: ["broneerimine"] },
  { id: "jalus", nimi: "Jalus", teed: ["jalus", "eiLeitud"] },
  { id: "kontakt", nimi: "Kontakt", teed: ["kontakt", "meta"] },
  { id: "menyy", nimi: "Menüü", teed: ["navi"] },
];

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
function Kujupaneel({ tee, nimi, kompaktne = false }) {
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

  if (!avatud && (!midagiSeatud || kompaktne)) {
    return (
      <button
        type="button"
        onClick={() => setAvatud(true)}
        aria-expanded="false"
        className={`${NUPP_TEKST} mt-2`}
      >
        {nimi
          ? `${nimi}${midagiSeatud ? " · kujundatud" : ""}`
          : "Kujunda see tekst"}
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

      {/*
        Suurus on KORDAJA, mitte pikslid: tekstid saavad suuruse
        responsiivsest clamp()-ist ja kordaja korrutab seda, seega
        mobiilivaade jääb terveks.
      */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="mikro w-20 text-[0.65rem] text-ink-faint">Suurus</span>
        <input
          type="range"
          min={SUURUSE_MIN}
          max={SUURUSE_MAX}
          step={0.05}
          value={kuju.suurus ?? 1}
          onChange={(sundmus) =>
            muudaKuju(tee, { ...kuju, suurus: Number(sundmus.target.value) })
          }
          aria-label="Teksti suurus"
          className="h-8 w-40 cursor-pointer accent-rohe"
        />
        <span className="text-[0.8rem] text-ink-faint">
          {Math.round((kuju.suurus ?? 1) * 100)} %
        </span>
      </div>

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
        {(!midagiSeatud || kompaktne) && (
          <button
            type="button"
            onClick={() => setAvatud(false)}
            className={NUPP_TEKST}
          >
            Sulge
          </button>
        )}
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
                kompaktne
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

  /*
    Kas tegu on objektiplokkide või tekstiridade massiiviga. Tühja massiivi
    puhul otsustab malli kuju — muidu näeks tühi blogipostituste loend välja
    nagu tekstiread ja "Lisa" annaks vale kujuga elemendi.
  */
  const mall = uusElement(vaartus, voti);
  const objektid = vaartus.some((element) => onObjekt(element)) || onObjekt(mall);

  function lisa() {
    muuda(tee, [...vaartus, uusElement(vaartus, voti)]);
  }

  function eemalda(indeks) {
    muuda(
      tee,
      vaartus.filter((_, jrk) => jrk !== indeks),
    );
  }

  function liiguta(indeks, suund) {
    const uusIndeks = indeks + suund;
    if (uusIndeks < 0 || uusIndeks >= vaartus.length) return;
    const koopia = vaartus.slice();
    [koopia[indeks], koopia[uusIndeks]] = [koopia[uusIndeks], koopia[indeks]];
    muuda(tee, koopia);
  }

  return (
    <fieldset className="border border-sage bg-bone p-4 sm:p-5">
      <legend className="mikro px-2 text-[0.7rem] text-ink-faint">
        {silt(voti)}
      </legend>

      {vaartus.length === 0 && (
        <p className="text-[0.9rem] text-ink-faint">Ridu veel ei ole.</p>
      )}

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
                <div className="mt-4 space-y-4">
                  <Valjad
                    vaartus={element}
                    tee={[...tee, indeks]}
                    muuda={muuda}
                    sugavus={sugavus + 1}
                  />
                </div>
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

  return Object.entries(vaartus).map(([voti, alamVaartus]) => {
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

/* ------------------------------------------------------------------ */
/* Toimeti                                                             */
/* ------------------------------------------------------------------ */

export default function AdminToimeti({ algsisu }) {
  const [sisu, setSisu] = useState(algsisu);
  const [muudetud, setMuudetud] = useState(false);
  const [valitud, setValitud] = useState(SEKTSIOONID[0].id);
  const [teade, setTeade] = useState(null);
  const [tootab, setTootab] = useState(false);

  const sektsioon =
    SEKTSIOONID.find((kirje) => kirje.id === valitud) ?? SEKTSIOONID[0];

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

  function muuda(tee, uusVaartus) {
    setSisu((eelmine) => asendaTeel(eelmine, tee, uusVaartus));
    setMuudetud(true);
    setTeade(null);
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

  async function salvesta() {
    setTootab(true);
    setTeade(null);
    try {
      const vastus = await salvestaTegevus(sisu);
      if (vastus?.ok) {
        if (vastus.sisu) setSisu(vastus.sisu);
        setMuudetud(false);
        setTeade({ liik: "ok", tekst: vastus.sonum ?? "Salvestatud." });
      } else {
        setTeade({
          liik: "viga",
          tekst: vastus?.viga ?? "Salvestamine ebaõnnestus.",
        });
      }
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
    const kinnitus = window.confirm(
      `Kas lähtestada „${silt(tee)}” vaikimisi tekstidele?\n\n` +
        "Lähtestamine salvestab kohe. Kõik salvestamata muudatused lähevad kaotsi.",
    );
    if (!kinnitus) return;

    setTootab(true);
    setTeade(null);
    try {
      const vastus = await lahtestaTegevus(tee);
      if (vastus?.ok) {
        if (vastus.sisu) setSisu(vastus.sisu);
        setMuudetud(false);
        setTeade({ liik: "ok", tekst: vastus.sonum ?? "Lähtestatud." });
      } else {
        setTeade({
          liik: "viga",
          tekst: vastus?.viga ?? "Lähtestamine ebaõnnestus.",
        });
      }
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
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
        {/* Mobiilis vormi kohal, laual vasakul ja püsiv */}
        <nav
          aria-label="Sisu sektsioonid"
          className="lg:sticky lg:top-28 lg:w-56 lg:shrink-0"
        >
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {SEKTSIOONID.map((kirje) => {
              const aktiivne = kirje.id === valitud;
              return (
                <li key={kirje.id} className="lg:border-b lg:border-sage">
                  <button
                    type="button"
                    onClick={() => setValitud(kirje.id)}
                    aria-current={aktiivne ? "true" : undefined}
                    className={`mikro w-full border px-4 py-3 text-left text-[0.7rem] transition-colors lg:border-0 lg:px-0 ${
                      aktiivne
                        ? "border-rohe text-rohe"
                        : "border-sage text-ink-faint hover:text-ink"
                    }`}
                  >
                    {kirje.nimi}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1 space-y-12">
          {sektsioon.teed.map((tee) => (
            <section key={tee} aria-labelledby={`sektsioon-${tee}`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2
                  id={`sektsioon-${tee}`}
                  className="kuva text-[clamp(1.6rem,3vw,2.25rem)] text-ink"
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

              <div className="space-y-5">
                {Array.isArray(sisu[tee]) ? (
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
                  <Valjad
                    vaartus={sisu[tee]}
                    tee={[tee]}
                    muuda={muuda}
                    sugavus={0}
                  />
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/*
        Salvestusriba on lehe all ja jääb kerimisel nähtavale. Alla, mitte
        üles: lehe oma päis on juba sticky top-0 ja kaks riba kaklekisid seal.
      */}
      <div className="sticky bottom-0 z-30 -mx-6 mt-12 border-t border-sage bg-bone/95 px-6 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {muudetud ? (
              <span className="border border-gold-deep px-3 py-1 text-[0.8rem] text-gold-deep">
                Salvestamata muudatused
              </span>
            ) : (
              <span className="text-[0.8rem] text-ink-faint">
                Kõik muudatused on salvestatud
              </span>
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
