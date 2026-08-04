import { Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import BroneeriVorm from "@/components/BroneeriVorm";
import { laeSisu } from "@/sisu/lae";

/* Pealkiri ja kirjeldus tulevad sisupuust, seepärast generateMetadata, mitte staatiline metadata */
export async function generateMetadata() {
  const sisu = await laeSisu();

  return {
    title: sisu.broneerimine.hero.silt,
    description: sisu.broneerimine.hero.tekst,
  };
}

export default async function Broneerimine() {
  const sisu = await laeSisu();
  const { broneerimine, kontakt, teenused, teekond } = sisu;

  return (
    <>
      <Sektsioon taust="bone">
        <div className="max-w-3xl">
          <Pealkiri silt={broneerimine.hero.silt} tase="h1">
            {broneerimine.hero.pealkiri}
          </Pealkiri>
          <div className="joon my-10 max-w-24" />
          <Tekst suur>{broneerimine.hero.tekst}</Tekst>
        </div>
      </Sektsioon>

      <section className="bg-linen">
        <div className="mx-auto grid max-w-[1360px] gap-16 px-6 py-20 sm:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24 lg:px-10 lg:py-32">
          <div>
            <p className="silt">{broneerimine.vormSilt}</p>
            <div className="mt-10">
              <BroneeriVorm
                email={kontakt.email}
                teenused={teenused}
                teekonnaNimi={teekond.nimi}
              />
            </div>
          </div>

          <aside className="lg:border-l lg:border-gold/25 lg:pl-16">
            <p className="silt">{broneerimine.kontaktSilt}</p>

            <ul className="mt-8 space-y-6">
              <li>
                <a
                  href={`mailto:${kontakt.email}`}
                  className="kuva text-xl text-ink transition-colors hover:text-gold-deep"
                >
                  {kontakt.email}
                </a>
              </li>
              <li>
                {/* „Instagram” ja „Facebook” on kanalite nimed, mitte muudetav sisu */}
                <a
                  href={kontakt.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-ink-soft transition-colors hover:text-gold-deep"
                >
                  Instagram {kontakt.instagramNimi}
                </a>
              </li>
              <li>
                <a
                  href={kontakt.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-ink-soft transition-colors hover:text-gold-deep"
                >
                  Facebook
                </a>
              </li>
            </ul>

            <div className="joon my-10" />

            <p className="text-lg leading-relaxed text-ink-soft">
              {broneerimine.markus}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
