import Link from "next/link";
import { notFound } from "next/navigation";
import FotograafiaPortfoolio from "@/components/FotograafiaPortfoolio";
import Ilmub from "@/components/Ilmub";
import { Nupp, Pealkiri, Salm, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu, laeSisuSync } from "@/sisu/lae";
import {
  KEELEKOODID,
  keeleAlternatiivid,
  keeleks,
  tee,
} from "@/sisu/keeled";
import { plokiStiil, tekstiKuju, tumePlokiStiil } from "@/sisu/tekstikujud";

/* Teenuse otsimine slugi järgi — massiiv võib admini kaudu olla asendatud */
function leiaTeenus(teenused, slug) {
  return teenused.find((teenus) => teenus.slug === slug);
}

/* Järgmise teenuse nimi on hierarhias tume; muud admini fondi- ja mõõduvalikud säilivad. */
function ilmaVarvita(stiil) {
  if (!stiil) return undefined;
  const tulemus = { ...stiil };
  delete tulemus.color;
  delete tulemus["--oma-varv"];
  return tulemus;
}

/*
  KIRJAKOHT PLOKINA.
  Teenuse plokkidel ei ole sisupuus eraldi { viide, tekst } välju: Marta
  piiblisalmid seisavad seal nii, et ploki PEALKIRI on viide ("Psalm 62:1",
  "Luuka 10:41–42") ja esimene lõik on salm ise. Tunneme selle kuju ära, et
  salm saaks lehel oma vaikse hetke, mitte ei kaoks tavalise lõiguna teksti
  sisse. Kui sisupuusse peaks kunagi tekkima selgesõnaline { viide, tekst },
  töötab ka see.
*/
const VIITE_MUSTER = /^(\d+\.\s)?\p{Lu}[\p{L}.\s]*\s\d+(:\d+([–-]\d+)?)?$/u;

function onKirjakoht(plokk) {
  if (plokk?.viide && plokk?.tekst) return true;

  return (
    typeof plokk?.pealkiri === "string" && VIITE_MUSTER.test(plokk.pealkiri.trim())
  );
}

/* Salm lahku selgitusest — mõlemast kujust tuleb sama kolmik */
function kirjakohaOsad(plokk) {
  const loigud = Array.isArray(plokk.loigud) ? plokk.loigud : [];

  if (plokk.viide && plokk.tekst) {
    return {
      viide: plokk.viide,
      tekst: plokk.tekst,
      selgitus: [plokk.selgitus, ...loigud].filter(Boolean),
    };
  }

  return {
    viide: plokk.pealkiri,
    tekst: loigud[0] ?? "",
    selgitus: loigud.slice(1),
  };
}

/*
  KIRJAKOHT SISSEJUHATUSE LÕIGUNA.

  Adminis on Stiiliselguse salm praegu ühe lõiguna:
      „Ma tänan sind ...”\nPsalm 139:14

  Sisu kuju ei ole vaja selle pärast muuta ega serveri uuemaid tekste
  vaikeväärtustega asendada. Kui viimane rida on kirjakoha viide, tõstame
  selle lõigu lihtsalt Salm-komponendi abil oma rõhupinnale.
*/
function loiguKirjakoht(loik) {
  if (typeof loik !== "string") return null;

  const read = loik
    .split(/\r?\n/)
    .map((rida) => rida.trim())
    .filter(Boolean);
  if (read.length < 2) return null;

  const viide = read.at(-1);
  if (!VIITE_MUSTER.test(viide)) return null;

  const tekst = read.slice(0, -1).join("\n").replace(/^—\s*/, "").trim();
  return tekst ? { viide, tekst } : null;
}

/* Vähemalt kolm noolega seotud mõtet moodustavad eraldi vertikaalse ahela. */
function loiguNooleAhel(loik) {
  if (typeof loik !== "string" || !loik.includes("→")) return null;

  const sammud = loik
    .split("→")
    .map((samm) => samm.trim())
    .filter(Boolean);

  return sammud.length >= 3 ? sammud : null;
}

/*
  Ehitusaegsed teed. Siin EI tohi kasutada laeSisu()-t: selle sees olev
  connection() ootab päringukonteksti, mida ehituse ajal veel ei ole.

  Ülemine segment [keel] oma generateStaticParams'i ei anna, seega tuleb
  siit tagastada MÕLEMA parameetri paarid. Slugid on keeltes samad, aga
  loeme mõlemad puud üle: admin võib teenuse ühes keeles ümber nimetada.
*/
export function generateStaticParams() {
  return KEELEKOODID.flatMap((keel) => {
    const sisu = laeSisuSync(keel);
    const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];
    return teenused.map((teenus) => ({ keel, slug: teenus.slug }));
  });
}

export async function generateMetadata({ params }) {
  const { keel, slug } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisu(kood);
  const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];
  const teenus = leiaTeenus(teenused, slug);

  if (!teenus) return {};

  return {
    title: teenus.nimi,
    description: teenus.luhike,
    alternates: keeleAlternatiivid(kood, `/teenused/${slug}`),
  };
}

export default async function TeenuseLeht({ params }) {
  const { keel, slug } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisu(kood);
  const t = (rada) => tee(kood, rada);
  const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];
  const teenus = leiaTeenus(teenused, slug);

  if (!teenus) notFound();

  const {
    nimekirjaSilt,
    kutseSilt,
    kutsePealkiri,
    kutseTekst,
    nuppEsmane,
    nuppTeine,
    jargmineSilt,
    loeLahemalt,
  } = sisu.teenuseLeht;

  const jrk = teenused.findIndex((t) => t.slug === slug);
  const jargmiseJrk = (jrk + 1) % teenused.length;
  const jargmine = teenused[jargmiseJrk];

  /*
    Admin-lehelt antud üksikute tekstide kuju. Teenuse omad käivad läbi
    massiivi indeksi (teenused.2.sissejuhatus), ühised tekstid teenuseLeht'i alt.
  */
  const v = plokiStiil(sisu.tekstiKujud, `teenused.${jrk}`);
  const s = tekstiKuju(sisu.tekstiKujud, `teenused.${jrk}`);
  /*
    Teenuste koondleht on kõigi teenuse alamlehtede päise source of truth.
    Nii ei saa üksiku teenuse vana värvi- või fondiseade päist teistsuguseks
    muuta: taust, tüpograafia ja mõõdustik tulevad alati samast kolmest väljast.
  */
  /*
    Päis seisab siin tumedal pinnal, koondlehel heledal. Kuju on sama, seega
    värv käib läbi tumeda paranduse — Marta valitud tume kuld kaoks muidu
    sügavrohelisele ära (2,6:1). Vt tumedaPinnaVarv().
  */
  const vp = tumePlokiStiil(sisu.tekstiKujud, "teenusedLeht");
  const sp = tekstiKuju(sisu.tekstiKujud, "teenusedLeht");
  const vj = plokiStiil(
    sisu.tekstiKujud,
    `teenused.${jargmiseJrk}.kuva.jargmineTeenus`,
  );
  const sj = tekstiKuju(
    sisu.tekstiKujud,
    `teenused.${jargmiseJrk}.kuva.jargmineTeenus`,
  );
  const vl = plokiStiil(sisu.tekstiKujud, "teenuseLeht");
  const sl = tekstiKuju(sisu.tekstiKujud, "teenuseLeht");

  /* Massiivid kindlustatud: admin võib teenuse ilma mõne väljata salvestada */
  const loigud = Array.isArray(teenus.loigud) ? teenus.loigud : [];
  const plokid = Array.isArray(teenus.plokid) ? teenus.plokid : [];
  const nimekiri = Array.isArray(teenus.nimekiri) ? teenus.nimekiri : [];
  const onTeadlikOstlemine = teenus.slug?.toLowerCase() === "teadlik-ostlemine";
  const onFotograafia = teenus.slug?.toLowerCase() === "fotograafia";
  const onPuhaRuum = teenus.slug?.toLowerCase() === "puha-ruum";
  const onStiiliselgus = teenus.slug?.toLowerCase() === "stiiliselgus";
  const onGarderoobiInventuur =
    teenus.slug?.toLowerCase() === "garderoobi-korrastus";
  const onJoontegaNimekiri = onStiiliselgus || onGarderoobiInventuur;
  const onUksUheleTeekond = teenus.slug?.toLowerCase() === "uks-uhele-teekond";

  /*
    Salm ja mõtteahel võivad olla adminis endiselt tavalised lõigud. Hoiame
    algse järjekorranumbri alles, et Marta valitud tekstikuju jõuaks ka uude
    kuvamiskohta. Ülejäänud sissejuhatuse tekstid jäävad täpselt samaks.
  */
  const loiguKirjed = loigud.map((tekst, indeks) => ({ tekst, indeks }));
  const kirjakohaKirje = loiguKirjed
    .map((kirje) => ({ ...kirje, kirjakoht: loiguKirjakoht(kirje.tekst) }))
    .find((kirje) => kirje.kirjakoht);
  const ahelaKirje = loiguKirjed
    .map((kirje) => ({ ...kirje, sammud: loiguNooleAhel(kirje.tekst) }))
    .find((kirje) => kirje.sammud);
  const sissejuhatavadLoigud = loiguKirjed.filter(
    (kirje) =>
      kirje.indeks !== kirjakohaKirje?.indeks &&
      kirje.indeks !== ahelaKirje?.indeks,
  );

  /* Kirjakohaplokid ette ära märgitud: eraldajad sõltuvad naabritest */
  const salmid = plokid.map(onKirjakoht);

  /*
    Püha Ruumil on üle kümne ploki. Pikas reas peab iga plokk selgelt lõppema,
    muidu sulab kõik ühte tekstivalli — seepärast kasvab plokkide vahe koos
    nende arvuga.
  */
  const plokiVahe = plokid.length >= 8 ? "my-16 sm:my-20" : "my-12 sm:my-14";

  /*
    Kutseploki taust sõltub sellest, mis tegelikult eelnes: plokkide ja
    nimekirja sektsioonid on tingimuslikud. Ilma selleta jääks nt
    /teenused/fotograafia peal kaks ühesugust sektsiooni järjest ühte
    pikka alasse sulama.
  */
  const tsitaat = teenus.tsitaat?.tekst ? teenus.tsitaat : null;

  /*
    Heledaid pindu on kolm ja kaks ühesugust järjest ei tohi kohtuda.
    Nimekirja ees on kas tsitaat (sage), plokid (linen) või sissejuhatus
    (bone) — seega piisab tsitaadi vaatamisest.
  */
  const nimekirjaTaust = tsitaat ? "linen" : "sage";

  const eelnevTaust =
    nimekiri.length > 0
      ? nimekirjaTaust
      : tsitaat
        ? "sage"
        : plokid.length > 0
          ? "linen"
          : "bone";
  const kutseTaust = eelnevTaust === "bone" ? "linen" : "bone";

  return (
    <>
      {/*
        Teenuse päis seisab jaluse sügavrohelisel (metsSyva) — iga alamleht
        algab ja lõpeb sama tumeda akordiga. Koondlehe „Teenused” päis jääb
        heledaks, seepärast on siin ka OMA taustapildivõti (teenuseLeht.hero):
        ühine võti tähendaks sama pilti heledal ja tumedal pinnal.
      */}
      <Sektsioon taust="metsSyva" polsterdus="ohuke" taustaVoti="teenuseLeht.hero">
        <div className="max-w-3xl pt-6 sm:pt-10">
          <p className="sisene silt silt-suur silt-tume" style={vp("hero.silt")}>
            {sp("hero.silt", teenus.alapealkiri)}
          </p>
          <h1
            className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-luu"
            style={{ "--viive": "90ms", ...vp("hero.pealkiri") }}
          >
            {sp("hero.pealkiri", teenus.nimi)}
          </h1>
          <div
            className="sisene joon-tume mb-9 mt-9 max-w-28"
            style={{ "--viive": "200ms" }}
          />
          <div className="sisene" style={{ "--viive": "300ms" }}>
            <Tekst
              suur
              tume
              stiil={vp("hero.tekst")}
              kuju={sp.kuju("hero.tekst")}
            >
              {teenus.luhike}
            </Tekst>
          </div>
        </div>
      </Sektsioon>

      {/* Sissejuhatus — kuldne juhtmõte ja lõigud */}
      <Sektsioon taust="bone" laius="kitsas" taustaVoti="teenuseLeht.sissejuhatus">
        <Ilmub>
          <p
            className="kuva text-[clamp(1.55rem,3.2vw,2.3rem)] leading-[1.35] text-gold-deep"
            style={v("sissejuhatus")}
          >
            {s("sissejuhatus", teenus.sissejuhatus)}
          </p>
        </Ilmub>

        {sissejuhatavadLoigud.length > 0 && (
          <Ilmub ruhm className="mt-10 space-y-6">
            {sissejuhatavadLoigud.map(({ tekst, indeks }) => (
              <Tekst
                key={`${indeks}-${tekst}`}
                stiil={v(`loigud.${indeks}`)}
                kuju={s.kuju(`loigud.${indeks}`)}
              >
                {tekst}
              </Tekst>
            ))}
          </Ilmub>
        )}
      </Sektsioon>

      {/* Sissejuhatusse kirjutatud salm saab Püha Ruumi kirjakohtade kuju. */}
      {kirjakohaKirje && (
        <Sektsioon
          taust="sage"
          laius="kitsas"
          polsterdus="ohuke"
          taustaVoti="teenuseLeht.kirjakoht"
        >
          <Ilmub>
            <Salm
              viide={kirjakohaKirje.kirjakoht.viide}
              tekst={kirjakohaKirje.kirjakoht.tekst}
              stiil={v(`loigud.${kirjakohaKirje.indeks}`)}
              kuju={s.kuju(`loigud.${kirjakohaKirje.indeks}`)}
            />
          </Ilmub>
        </Sektsioon>
      )}

      {/*
        Stiiliselguse mõtteahel — üks mõte korraga, kuldsed nooled allapoole.
        See tume vaheakord lahutab ka sissejuhatuse ja plokid selgelt ära.
      */}
      {ahelaKirje && (
        <Sektsioon
          taust="mets"
          laius="kitsas"
          polsterdus="ohuke"
          taustaVoti="teenuseLeht.ahel"
        >
          <Ilmub ruhm as="ol" className="mx-auto max-w-3xl text-center">
            {ahelaKirje.sammud.map((samm, indeks) => (
              <li key={`${indeks}-${samm}`}>
                <p className="kuva mx-auto max-w-2xl text-[clamp(1.65rem,5.4vw,3.2rem)] italic leading-[1.18] text-luu">
                  {samm}
                </p>
                {indeks < ahelaKirje.sammud.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="my-6 block font-serif text-2xl leading-none text-kuld-hele sm:my-8 sm:text-3xl"
                  >
                    ↓
                  </span>
                )}
              </li>
            ))}
          </Ilmub>
        </Sektsioon>
      )}

      {/*
        Plokid — teenuse pikem sisu osadeks jaotatuna.

        Proosaplokk: pealkiri vasakule, lõigud paremale, ees üle veeru ulatuv
        kuldjoon. Kirjakohaplokk: Salm oma püstjoonega — salm toob eraldaja
        ise kaasa, seega tema ette joont ei panda. Nii vahelduvad proosa ja
        salmid ning Püha Ruumi kaksteist plokki ei ole üks pikk tekstivall.
      */}
      {plokid.length > 0 && (
        <Sektsioon taust="linen" laius="kitsas" taustaVoti="teenuseLeht.plokid">
          {plokid.map((plokk, i) => {
            const plokiLoigud = Array.isArray(plokk.loigud) ? plokk.loigud : [];
            const salm = salmid[i] ? kirjakohaOsad(plokk) : null;
            const onTeekonnaLopuPealkiri =
              onUksUheleTeekond && plokiLoigud.length === 0;

            return (
              <div key={`${plokk.pealkiri}-${i}`}>
                {i > 0 && !salmid[i] && <div className={`joon ${plokiVahe}`} />}
                {i > 0 && salmid[i] && <div className={plokiVahe} />}

                {onTeekonnaLopuPealkiri ? (
                  <Ilmub className="text-center">
                    <h2
                      className="kuva whitespace-nowrap text-[clamp(1.55rem,3vw,2rem)] leading-[1.25] text-gold-deep"
                      style={v(`plokid.${i}.pealkiri`)}
                    >
                      {s(`plokid.${i}.pealkiri`, plokk.pealkiri)}
                    </h2>
                  </Ilmub>
                ) : salm ? (
                  <Ilmub>
                    {/*
                      Kirjakohaploki viide on ploki PEALKIRI ja salm on esimene
                      lõik (vt kirjakohaOsad) — värvitee järgib sama loogikat.
                    */}
                    <Salm
                      viide={salm.viide}
                      tekst={salm.tekst}
                      selgitus={salm.selgitus}
                      viiteStiil={v(`plokid.${i}.pealkiri`)}
                      stiil={v(`plokid.${i}.loigud.0`)}
                      /* Selgitus = loigud alates teisest, seepärast jrk + 1 */
                      selgituseStiil={(jrk) => v(`plokid.${i}.loigud.${jrk + 1}`)}
                      viiteKuju={s.kuju(`plokid.${i}.pealkiri`)}
                      kuju={s.kuju(`plokid.${i}.loigud.0`)}
                      selgituseKuju={(jrk) =>
                        s.kuju(`plokid.${i}.loigud.${jrk + 1}`)
                      }
                    />
                  </Ilmub>
                ) : (
                  <Ilmub
                    as="article"
                    className="grid gap-5 sm:grid-cols-[1fr_1.65fr] sm:gap-12"
                  >
                    <h2
                      className="kuva text-[clamp(1.35rem,2.8vw,1.9rem)] leading-[1.25] text-gold-deep sm:pt-1"
                      style={v(`plokid.${i}.pealkiri`)}
                    >
                      {s(`plokid.${i}.pealkiri`, plokk.pealkiri)}
                    </h2>

                    <div className="space-y-5">
                      {plokiLoigud.map((loik, loiguJrk) => (
                        <Tekst
                          key={loik}
                          stiil={v(`plokid.${i}.loigud.${loiguJrk}`)}
                          kuju={s.kuju(`plokid.${i}.loigud.${loiguJrk}`)}
                        >
                          {loik}
                        </Tekst>
                      ))}
                    </div>
                  </Ilmub>
                )}
              </div>
            );
          })}
        </Sektsioon>
      )}

      {onFotograafia && (
        <FotograafiaPortfoolio
          keel={kood}
          taustaVoti="teenuseLeht.portfoolio"
        />
      )}

      {/*
        Teenuse tsitaat — üks Marta lause, mis kannab kogu teenuse mõtet.
        Ilma viiteta salm: püstjoon, lause kuvakirjas, vajadusel järelmõte all.
      */}
      {tsitaat && (
        <Sektsioon
          taust="sage"
          laius="kitsas"
          polsterdus="ohuke"
          taustaVoti="teenuseLeht.tsitaat"
        >
          <Ilmub>
            <Salm
              tekst={tsitaat.tekst}
              selgitus={tsitaat.selgitus}
              stiil={v("tsitaat.tekst")}
              selgituseStiil={v("tsitaat.selgitus")}
              kuju={s.kuju("tsitaat.tekst")}
              selgituseKuju={s.kuju("tsitaat.selgitus")}
            />
          </Ilmub>
        </Sektsioon>
      )}

      {nimekiri.length > 0 && (
        <Sektsioon taust={nimekirjaTaust} taustaVoti="teenuseLeht.nimekiri">
          {onTeadlikOstlemine ? (
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
              <Ilmub className="lg:sticky lg:top-32 lg:self-start">
                <h2
                  className="kuva max-w-md text-[clamp(2.4rem,5vw,4.15rem)] leading-[1.05] text-gold-deep"
                  style={v("nimekirjaPealkiri")}
                >
                  {s("nimekirjaPealkiri", teenus.nimekirjaPealkiri)}
                </h2>
              </Ilmub>

              <Ilmub ruhm as="ul" className="border-t border-gold/35">
                {nimekiri.map((punkt, punktJrk) => {
                  const puhasPunkt = punkt.replace(/^\s*•\s*/, "").trim();

                  return (
                    <li
                      key={punkt}
                      className="border-b border-gold/25 py-6 sm:py-8"
                    >
                      <p
                        className="kuva max-w-[32ch] text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.35] text-ink"
                        style={v(`nimekiri.${punktJrk}`)}
                      >
                        {s(`nimekiri.${punktJrk}`, puhasPunkt)}
                      </p>
                    </li>
                  );
                })}
              </Ilmub>
            </div>
          ) : (
            <>
              <Ilmub>
                <Pealkiri
                  silt={nimekirjaSilt}
                  className={`max-w-2xl ${onPuhaRuum ? "mx-auto text-center" : ""}`}
                  siltStiil={vl("nimekirjaSilt")}
                  stiil={v("nimekirjaPealkiri")}
                  siltKuju={sl.kuju("nimekirjaSilt")}
                  kuju={s.kuju("nimekirjaPealkiri")}
                >
                  {teenus.nimekirjaPealkiri}
                </Pealkiri>
              </Ilmub>

              {/* Püha Ruumi litaania on keskne palvehetk; teised loendid jäävad laial ekraanil vasakule. */}
              <Ilmub
                ruhm
                as="ul"
                className={`mt-11 max-w-3xl ${
                  onJoontegaNimekiri
                    ? "border-t border-gold/35"
                    : `space-y-5 ${onPuhaRuum ? "mx-auto" : ""}`
                }`}
              >
                {nimekiri.map((punkt, punktJrk) => {
                  const puhasPunkt = punkt.replace(/^\s*•\s*/, "").trim();

                  return (
                    <li
                      key={punkt}
                      className={
                        onJoontegaNimekiri
                          ? "border-b border-gold/25 py-6 sm:py-8"
                          : ""
                      }
                    >
                      <p
                        className={`kuva text-[clamp(1.3rem,2.3vw,1.7rem)] leading-[1.4] text-ink ${
                          onFotograafia
                            ? "text-left"
                            : onJoontegaNimekiri
                              ? "max-w-[40ch] text-left"
                              : `text-center ${onPuhaRuum ? "" : "sm:text-left"}`
                        }`}
                        style={v(`nimekiri.${punktJrk}`)}
                      >
                        {s(
                          `nimekiri.${punktJrk}`,
                          onJoontegaNimekiri ? puhasPunkt : punkt,
                        )}
                      </p>
                    </li>
                  );
                })}
              </Ilmub>
            </>
          )}
        </Sektsioon>
      )}

      {/* Kutse + järgmine teenus */}
      <Sektsioon taust={kutseTaust} taustaVoti="teenuseLeht.kutse">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <Ilmub>
            <Pealkiri
              silt={kutseSilt}
              siltStiil={vl("kutseSilt")}
              stiil={vl("kutsePealkiri")}
              siltKuju={sl.kuju("kutseSilt")}
              kuju={sl.kuju("kutsePealkiri")}
            >
              {kutsePealkiri}
            </Pealkiri>
            <Tekst
              className="mt-7"
              stiil={vl("kutseTekst")}
              kuju={sl.kuju("kutseTekst")}
            >
              {kutseTekst}
            </Tekst>
            <div className="mt-10 flex flex-wrap gap-4">
              <Nupp href={t("/broneerimine")} nool>
                {nuppEsmane}
              </Nupp>
              <Nupp href={t("/hinnakiri")} variant="aaris">
                {nuppTeine}
              </Nupp>
            </div>
          </Ilmub>

          {jargmine && (
            <Ilmub
              viive={150}
              className="lg:border-l lg:border-gold/25 lg:pl-24"
            >
              <p className="silt">{jargmineSilt}</p>
              <Link
                href={t(`/teenused/${jargmine.slug}`)}
                className="group mt-6 block"
              >
                <h2
                  className="kuva text-[clamp(1.75rem,3.4vw,2.5rem)] text-ink transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-gold-deep"
                  style={ilmaVarvita(vj("nimi"))}
                >
                  {sj("nimi", jargmine.nimi)}
                </h2>
                <p
                  className="mt-3 max-w-[42ch] text-lg leading-relaxed text-ink-soft"
                  style={vj("luhike")}
                >
                  {sj("luhike", jargmine.luhike)}
                </p>
                <span className="mikro mt-6 inline-flex items-center gap-3 text-gold-deep">
                  {loeLahemalt}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            </Ilmub>
          )}
        </div>
      </Sektsioon>
    </>
  );
}
