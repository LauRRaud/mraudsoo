import Link from "next/link";
import { notFound } from "next/navigation";
import Ilmub from "@/components/Ilmub";
import { Nupp, Pealkiri, Salm, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu, laeSisuSync } from "@/sisu/lae";
import { plokiStiil, tekstiKuju } from "@/sisu/tekstikujud";

/* Teenuse otsimine slugi järgi — massiiv võib admini kaudu olla asendatud */
function leiaTeenus(teenused, slug) {
  return teenused.find((teenus) => teenus.slug === slug);
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
  Ehitusaegsed teed. Siin EI tohi kasutada laeSisu()-t: selle sees olev
  connection() ootab päringukonteksti, mida ehituse ajal veel ei ole.
*/
export function generateStaticParams() {
  const sisu = laeSisuSync();
  const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];

  return teenused.map((teenus) => ({ slug: teenus.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sisu = await laeSisu();
  const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];
  const teenus = leiaTeenus(teenused, slug);

  if (!teenus) return {};

  return {
    title: teenus.nimi,
    description: teenus.luhike,
  };
}

export default async function TeenuseLeht({ params }) {
  const { slug } = await params;
  const sisu = await laeSisu();
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
  const vj = plokiStiil(sisu.tekstiKujud, `teenused.${jargmiseJrk}`);
  const sj = tekstiKuju(sisu.tekstiKujud, `teenused.${jargmiseJrk}`);
  const vl = plokiStiil(sisu.tekstiKujud, "teenuseLeht");
  const sl = tekstiKuju(sisu.tekstiKujud, "teenuseLeht");

  /* Massiivid kindlustatud: admin võib teenuse ilma mõne väljata salvestada */
  const loigud = Array.isArray(teenus.loigud) ? teenus.loigud : [];
  const plokid = Array.isArray(teenus.plokid) ? teenus.plokid : [];
  const nimekiri = Array.isArray(teenus.nimekiri) ? teenus.nimekiri : [];

  /*
    Sügavama tooniga teenused (Püha Ruum, 1:1 teekond, fotograafia) saavad
    tumeda metsarohelise heero — lehe kõige vaiksema ja sügavama pinna.
  */
  const tume = teenus.toon === "sygav";

  /*
    Alapealkiri on enamasti paar sõna ("Must-valge") ja seisab hõredalt
    tähestatud sildina. 1:1 teekonna oma on terve lause — suurtähtedes ja
    laia tähevahega muutuks see karjuvaks plokiks, seega laseme lausel
    jääda lauseks (kaldkirjas kuvakiri).
  */
  const alapealkiriOnLause =
    typeof teenus.alapealkiri === "string" && teenus.alapealkiri.length > 34;

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
      {/* Heero — sügav toon saab tumeda pinna, soe toon rõhutatud paneeli */}
      <Sektsioon
        taust={tume ? "mets" : "sage"}
        polsterdus="ohuke"
        taustaVoti="teenuseLeht.hero"
      >
        <div className="max-w-3xl pt-6 sm:pt-10">
          {alapealkiriOnLause ? (
            <p
              className={`sisene kuva max-w-[36ch] italic text-[clamp(1.2rem,2.3vw,1.6rem)] leading-[1.4] ${
                tume ? "text-luu/90" : "text-ink/70"
              }`}
              style={v("alapealkiri")}
            >
              {s("alapealkiri", teenus.alapealkiri)}
            </p>
          ) : (
            <p
              className={`sisene silt ${tume ? "silt-tume" : "!text-ink/70"}`}
              style={v("alapealkiri")}
            >
              {s("alapealkiri", teenus.alapealkiri)}
            </p>
          )}

          {/* Heero pealkirjal hiirekursori üleminekut ei ole — värv käib tavaliselt */}
          <h1
            className={`sisene kuva mt-5 text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[1.02] ${
              tume ? "text-luu" : "text-ink"
            }`}
            style={{ "--viive": "90ms", ...v("nimi") }}
          >
            {s("nimi", teenus.nimi)}
          </h1>

          <p
            className={`sisene mt-8 max-w-[55ch] text-xl leading-[1.75] sm:text-2xl ${
              tume ? "text-luu/95" : "text-ink/85"
            }`}
            style={{ "--viive": "200ms", ...v("luhike") }}
          >
            {s("luhike", teenus.luhike)}
          </p>
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

        {loigud.length > 0 && (
          <Ilmub ruhm className="mt-10 space-y-6">
            {loigud.map((loik, loiguJrk) => (
              <Tekst
                key={loik}
                stiil={v(`loigud.${loiguJrk}`)}
                kuju={s.kuju(`loigud.${loiguJrk}`)}
              >
                {loik}
              </Tekst>
            ))}
          </Ilmub>
        )}
      </Sektsioon>

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

            return (
              <div key={`${plokk.pealkiri}-${i}`}>
                {i > 0 && !salmid[i] && <div className={`joon ${plokiVahe}`} />}
                {i > 0 && salmid[i] && <div className={plokiVahe} />}

                {salm ? (
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
          <Ilmub>
            <Pealkiri
              silt={nimekirjaSilt}
              className="max-w-2xl"
              siltStiil={vl("nimekirjaSilt")}
              stiil={v("nimekirjaPealkiri")}
              siltKuju={sl.kuju("nimekirjaSilt")}
              kuju={s.kuju("nimekirjaPealkiri")}
            >
              {teenus.nimekirjaPealkiri}
            </Pealkiri>
          </Ilmub>

          {/* Litaania, mitte tabel: kuvakirjas read ilma joonteta. Mobiilis keskel, laiemal ekraanil vasakus servas */}
          <Ilmub ruhm as="ul" className="mt-11 max-w-3xl space-y-5">
            {nimekiri.map((punkt, punktJrk) => (
              <li
                key={punkt}
                className="kuva text-center text-[clamp(1.3rem,2.3vw,1.7rem)] leading-[1.4] text-ink sm:text-left"
                style={v(`nimekiri.${punktJrk}`)}
              >
                {s(`nimekiri.${punktJrk}`, punkt)}
              </li>
            ))}
          </Ilmub>
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
              <Nupp href="/broneerimine" nool>
                {nuppEsmane}
              </Nupp>
              <Nupp href="/hinnakiri" variant="aaris">
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
                href={`/teenused/${jargmine.slug}`}
                className="group mt-6 block"
              >
                {/* Värv tuleb muutujana, et hiirekursori kuldne üleminek jääks peale */}
                <h2
                  className="kuva text-[clamp(1.75rem,3.4vw,2.5rem)] text-[var(--oma-varv,var(--color-ink))] transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-gold-deep"
                  style={vj("nimi", { varvMuutujaks: true })}
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
