import Link from "next/link";
import Ilmub from "@/components/Ilmub";
import { Nupp, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";

export async function generateMetadata() {
  const sisu = await laeSisu();
  const { hero } = sisu.teenusedLeht;

  return {
    title: hero.silt,
    description: hero.tekst,
  };
}

/* TEENUSED — nummerdatud register, iga rida on uks omaette maailma. */
export default async function Teenused() {
  const sisu = await laeSisu();
  const { hero, loeLahemalt, lopp } = sisu.teenusedLeht;
  /* Admin võib teenuste massiivi tervikuna asendada — kindlustame kuju */
  const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];

  return (
    <>
      <Sektsioon taust="bone" polsterdus="ohuke">
        <div className="max-w-3xl pt-6 sm:pt-10">
          <p className="sisene silt">{hero.silt}</p>
          <h1
            className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-ink"
            style={{ "--viive": "90ms" }}
          >
            {hero.pealkiri}
          </h1>
          <div
            className="sisene joon mb-9 mt-9 max-w-28"
            style={{ "--viive": "200ms" }}
          />
          <div className="sisene" style={{ "--viive": "300ms" }}>
            <Tekst suur>{hero.tekst}</Tekst>
          </div>
        </div>
      </Sektsioon>

      <section className="bg-linen">
        <div className="mx-auto max-w-[1400px] px-6 pb-20 sm:pb-28 lg:px-12 lg:pb-36">
          <Ilmub ruhm as="ul" className="pt-16 sm:pt-20 lg:pt-24">
            {teenused.map((teenus) => (
              <li key={teenus.slug}>
                <Link
                  href={`/teenused/${teenus.slug}`}
                  /* Negatiivne veeris: hover-taust ulatub sektsiooni servani */
                  /* Kirjeldus algab kohe nime veeru järel, mitte lehe paremast
                     servast — kaks veergu peavad lugema ühe reana */
                  className="group -mx-6 grid grid-cols-1 gap-x-14 gap-y-4 border-t border-gold/25 px-6 py-10 transition-colors duration-300 hover:bg-bone sm:grid-cols-[minmax(0,28rem)_1fr] sm:py-12 lg:-mx-12 lg:px-12"
                >
                  <div>
                    <h2 className="kuva text-[clamp(1.75rem,3.6vw,2.8rem)] text-ink transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-gold-deep">
                      {teenus.nimi}
                    </h2>
                    {/* Cormorant on väikeses kraadis peenike — kaldkirjas rida vajab suurust */}
                    <p className="kuva mt-1 italic text-xl text-ink-faint sm:text-2xl">
                      {teenus.alapealkiri}
                    </p>
                  </div>

                  <div className="sm:self-center">
                    <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft">
                      {teenus.luhike}
                    </p>
                    <span className="mikro mt-5 inline-flex items-center gap-3 text-gold-deep">
                      {loeLahemalt}
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </Ilmub>
          <div className="joon" />
        </div>
      </section>

      <Sektsioon taust="bone" laius="kitsas" polsterdus="ohuke" className="text-center">
        <Ilmub>
          <p className="kuva mx-auto max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.28] text-ink">
            {lopp.pealkiri}
          </p>
          <Tekst className="mx-auto mt-6 text-center">{lopp.tekst}</Tekst>
        </Ilmub>
        <Ilmub viive={180} className="mt-11 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine" nool>
            {lopp.nuppEsmane}
          </Nupp>
          <Nupp href="/hinnakiri" variant="aaris">
            {lopp.nuppTeine}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
