import Link from "next/link";
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

export default async function Teenused() {
  const sisu = await laeSisu();
  const { hero, loeLahemalt, lopp } = sisu.teenusedLeht;
  /* Admin võib teenuste massiivi tervikuna asendada — kindlustame kuju */
  const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];

  return (
    <>
      <Sektsioon taust="bone">
        <div className="max-w-3xl">
          <Pealkiri silt={hero.silt} tase="h1">
            {hero.pealkiri}
          </Pealkiri>
          <div className="joon my-10 max-w-24" />
          <Tekst suur>{hero.tekst}</Tekst>
        </div>
      </Sektsioon>

      <section className="bg-linen">
        <div className="mx-auto max-w-[1360px] px-6 pb-20 sm:pb-24 lg:px-10 lg:pb-32">
          <ul className="pt-20 sm:pt-24 lg:pt-32">
            {teenused.map((teenus) => (
              <li key={teenus.slug}>
                <Link
                  href={`/teenused/${teenus.slug}`}
                  /* Vt kommentaari avalehel: hover-taust ulatub sektsiooni servani */
                  className="group -mx-6 grid grid-cols-1 gap-x-14 gap-y-4 border-t border-gold/25 px-6 py-10 transition-colors hover:bg-bone sm:grid-cols-[1fr_1.1fr] sm:py-12 lg:-mx-10 lg:px-10"
                >
                  <div>
                    <h2 className="kuva text-[clamp(1.7rem,3.4vw,2.6rem)] text-ink transition-colors group-hover:text-gold-deep">
                      {teenus.nimi}
                    </h2>
                    <p className="mt-1 text-lg italic text-ink-faint">
                      {teenus.alapealkiri}
                    </p>
                  </div>

                  <div>
                    <p className="max-w-[48ch] text-lg leading-relaxed text-ink-soft">
                      {teenus.luhike}
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
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="joon" />
        </div>
      </section>

      <Sektsioon taust="bone" laius="kitsas" className="text-center">
        <p className="kuva mx-auto max-w-2xl text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.3] text-ink">
          {lopp.pealkiri}
        </p>
        <Tekst className="mx-auto mt-6 text-center">{lopp.tekst}</Tekst>
        <div className="mt-11 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine">{lopp.nuppEsmane}</Nupp>
          <Nupp href="/hinnakiri" variant="aaris">
            {lopp.nuppTeine}
          </Nupp>
        </div>
      </Sektsioon>
    </>
  );
}
