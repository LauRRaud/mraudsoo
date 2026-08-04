import Link from "next/link";
import { notFound } from "next/navigation";
import { Nupp, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu, laeSisuSync } from "@/sisu/lae";

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

  const jargmine =
    teenused[(teenused.findIndex((t) => t.slug === slug) + 1) % teenused.length];

  /* Massiivid kindlustatud: admin võib teenuse ilma mõne väljata salvestada */
  const loigud = Array.isArray(teenus.loigud) ? teenus.loigud : [];
  const plokid = Array.isArray(teenus.plokid) ? teenus.plokid : [];
  const nimekiri = Array.isArray(teenus.nimekiri) ? teenus.nimekiri : [];

  /* Sügavama tooniga teenused (Püha Ruum, 1:1 teekond, fotograafia) saavad rahulikuma tausta */
  const rohelineToon = teenus.toon === "sygav";

  /*
    Alapealkiri on enamasti paar sõna ("Must-valge") ja seisab hõredalt
    tähestatud sildina. 1:1 teekonna oma on terve lause — suurtähtedes ja
    0.2em tähevahega muutuks see karjuvaks kolmerealiseks plokiks, seega
    laseme lausel jääda lauseks.
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
    /teenused/fotograafia peal kaks bone-sektsiooni järjest ühte pikka
    valgesse alasse sulama.
  */
  const eelnevTaust =
    nimekiri.length > 0 ? "linen" : plokid.length > 0 ? "shell" : "bone";
  const kutseTaust = eelnevTaust === "bone" ? "linen" : "bone";

  return (
    <>
      <Sektsioon taust={rohelineToon ? "sage" : "clay"}>
        <div className="max-w-3xl">
          {/* Kaldkirja siin ei ole: Cormorant laetakse ainult püstises lõikes */}
          {alapealkiriOnLause ? (
            <p className="kuva max-w-[34ch] text-[clamp(1.15rem,2.2vw,1.5rem)] leading-[1.45] text-ink/70">
              {teenus.alapealkiri}
            </p>
          ) : (
            <p className="silt !text-ink/70">{teenus.alapealkiri}</p>
          )}
          <h1 className="kuva mt-6 text-[clamp(2.5rem,7vw,5rem)] text-ink">
            {teenus.nimi}
          </h1>
          <p className="mt-8 max-w-[55ch] text-xl leading-[1.7] text-ink/85 sm:text-2xl">
            {teenus.luhike}
          </p>
        </div>
      </Sektsioon>

      <Sektsioon taust="bone" laius="kitsas">
        <p className="kuva text-[clamp(1.5rem,3.2vw,2.3rem)] leading-[1.35] text-gold-deep">
          {teenus.sissejuhatus}
        </p>

        {loigud.length > 0 && (
          <div className="mt-10 space-y-6">
            {loigud.map((loik) => (
              <Tekst key={loik}>{loik}</Tekst>
            ))}
          </div>
        )}
      </Sektsioon>

      {/*
        Plokid — teenuse pikem sisu osadeks jaotatuna.

        Proosaplokk: pealkiri vasakule, lõigud paremale, plokid lahku üle
        veeru ulatuva kuldjoonega.

        Kirjakohaplokk: tsentreeritud, viide sildina ja salm kuvakirjas —
        sama vaikne käsitlus, mis kannab lehte "Minust". Nii ei ole Püha Ruumi
        kaksteist plokki üks pikk tekstivall, vaid proosa ja salmid vahelduvad
        ning salme piirab lühike joon, proosat pikk. Ilma plokkideta
        sektsiooni ei renderdata.
      */}
      {plokid.length > 0 && (
        <Sektsioon taust="shell" laius="kitsas">
          {plokid.map((plokk, i) => {
            const plokiLoigud = Array.isArray(plokk.loigud) ? plokk.loigud : [];
            const salm = salmid[i] ? kirjakohaOsad(plokk) : null;
            /* Salmi kõrval seisev eraldaja on lühike, proosa oma üle veeru */
            const luhikeJoon = salmid[i] || salmid[i - 1];

            return (
              <div key={`${plokk.pealkiri}-${i}`}>
                {i > 0 && (
                  <div
                    className={`joon ${plokiVahe} ${
                      luhikeJoon ? "mx-auto max-w-24" : ""
                    }`}
                  />
                )}

                {salm ? (
                  <article className="text-center">
                    <p className="silt">{salm.viide}</p>
                    <blockquote
                      className={`kuva mx-auto mt-6 max-w-2xl leading-[1.3] text-ink ${
                        salm.tekst.length > 120
                          ? "text-[clamp(1.25rem,2.6vw,1.7rem)]"
                          : "text-[clamp(1.5rem,3.4vw,2.25rem)]"
                      }`}
                    >
                      {salm.tekst}
                    </blockquote>

                    {salm.selgitus.length > 0 && (
                      <div className="mx-auto mt-9 max-w-[54ch] space-y-4">
                        {salm.selgitus.map((loik) => (
                          <p
                            key={loik}
                            className="text-lg leading-[1.75] text-ink-soft"
                          >
                            {loik}
                          </p>
                        ))}
                      </div>
                    )}
                  </article>
                ) : (
                  <article className="grid gap-5 sm:grid-cols-[1fr_1.65fr] sm:gap-12">
                    <h2 className="kuva text-[clamp(1.35rem,2.8vw,1.9rem)] leading-[1.25] text-gold-deep sm:pt-1">
                      {plokk.pealkiri}
                    </h2>

                    <div className="space-y-5">
                      {plokiLoigud.map((loik) => (
                        <Tekst key={loik}>{loik}</Tekst>
                      ))}
                    </div>
                  </article>
                )}
              </div>
            );
          })}
        </Sektsioon>
      )}

      {nimekiri.length > 0 && (
        <Sektsioon taust="linen">
          <Pealkiri silt={nimekirjaSilt} className="max-w-2xl">
            {teenus.nimekirjaPealkiri}
          </Pealkiri>

          <ul className="mt-14 max-w-4xl">
            {nimekiri.map((punkt) => (
              <li
                key={punkt}
                className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-gold/25 py-6"
              >
                <span aria-hidden="true" className="text-gold">
                  —
                </span>
                <span className="text-lg leading-relaxed text-ink-soft">
                  {punkt}
                </span>
              </li>
            ))}
          </ul>
          <div className="joon max-w-4xl" />
        </Sektsioon>
      )}

      {/* Kutse + järgmine teenus */}
      <Sektsioon taust={kutseTaust}>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Pealkiri silt={kutseSilt}>{kutsePealkiri}</Pealkiri>
            <Tekst className="mt-7">{kutseTekst}</Tekst>
            <div className="mt-10 flex flex-wrap gap-4">
              <Nupp href="/broneerimine">{nuppEsmane}</Nupp>
              <Nupp href="/hinnakiri" variant="aaris">
                {nuppTeine}
              </Nupp>
            </div>
          </div>

          {jargmine && (
            <div className="lg:border-l lg:border-gold/25 lg:pl-20">
              <p className="silt">{jargmineSilt}</p>
              <Link
                href={`/teenused/${jargmine.slug}`}
                className="group mt-6 block"
              >
                <h2 className="kuva text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink transition-colors group-hover:text-gold-deep">
                  {jargmine.nimi}
                </h2>
                <p className="mt-3 max-w-[42ch] text-lg leading-relaxed text-ink-soft">
                  {jargmine.luhike}
                </p>
                <span className="mt-5 inline-flex items-center gap-3 mikro text-gold-deep">
                  {loeLahemalt}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </Sektsioon>
    </>
  );
}
