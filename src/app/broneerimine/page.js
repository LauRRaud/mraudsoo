import { Salm, Sektsioon, Tekst } from "@/components/ui";
import BroneeriVorm from "@/components/BroneeriVorm";
import Ilmub from "@/components/Ilmub";
import { laeSisu } from "@/sisu/lae";
import { varvija } from "@/sisu/tekstivarvid";
import { laeKalender } from "@/broneering/kalender";

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
  const kalender = await laeKalender();
  const { broneerimine, kontakt, teenused, teekond } = sisu;

  /* Admin-lehelt antud üksikute tekstide värvid */
  const v = varvija(sisu.tekstiVarvid, "broneerimine");

  return (
    <>
      <Sektsioon taust="bone" polsterdus="ohuke">
        <div className="max-w-3xl pt-6 sm:pt-10">
          <p className="sisene silt" style={v("hero.silt")}>
            {broneerimine.hero.silt}
          </p>
          <h1
            className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-ink"
            style={{ "--viive": "90ms", ...v("hero.pealkiri") }}
          >
            {broneerimine.hero.pealkiri}
          </h1>
          <div
            className="sisene joon mb-9 mt-9 max-w-28"
            style={{ "--viive": "200ms" }}
          />
          <div className="sisene" style={{ "--viive": "300ms" }}>
            <Tekst suur stiil={v("hero.tekst")}>
              {broneerimine.hero.tekst}
            </Tekst>
          </div>
        </div>
      </Sektsioon>

      <section className="bg-linen">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-20 sm:py-28 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24 lg:px-12 lg:py-36">
          <Ilmub>
            <p className="silt" style={v("vormSilt")}>
              {broneerimine.vormSilt}
            </p>
            <div className="mt-10">
              <BroneeriVorm
                email={kontakt.email}
                teenused={teenused}
                teekonnaNimi={teekond.nimi}
                suletudPaevad={kalender.suletudPaevad}
                suletudNadalapaevad={kalender.suletudNadalapaevad}
              />
            </div>
          </Ilmub>

          <Ilmub
            as="aside"
            viive={150}
            className="lg:border-l lg:border-gold/25 lg:pl-16"
          >
            <p className="silt" style={v("kontaktSilt")}>
              {broneerimine.kontaktSilt}
            </p>

            <ul className="mt-8 space-y-6">
              <li>
                <a
                  href={`mailto:${kontakt.email}`}
                  className="kuva text-xl text-ink transition-colors hover:text-gold-deep sm:text-2xl"
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
                  className="alajoon text-lg text-ink-soft transition-colors hover:text-gold-deep"
                >
                  Instagram {kontakt.instagramNimi}
                </a>
              </li>
              <li>
                <a
                  href={kontakt.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="alajoon text-lg text-ink-soft transition-colors hover:text-gold-deep"
                >
                  Facebook
                </a>
              </li>
            </ul>

            <div className="joon my-10" />

            <p
              className="max-w-[44ch] text-lg leading-[1.85] text-ink-soft"
              style={v("markus")}
            >
              {broneerimine.markus}
            </p>
          </Ilmub>
        </div>
      </section>

      {/* Kirjakoht lõpetuseks — kutse peatuda enne, kui kirjutad */}
      {broneerimine.kirjakoht?.tekst && (
        <Sektsioon taust="sage" laius="kitsas" polsterdus="ohuke">
          <Ilmub>
            <Salm
              viide={broneerimine.kirjakoht.viide}
              tekst={broneerimine.kirjakoht.tekst}
              selgitus={broneerimine.kirjakoht.selgitus}
              viiteStiil={v("kirjakoht.viide")}
              stiil={v("kirjakoht.tekst")}
              selgituseStiil={v("kirjakoht.selgitus")}
            />
          </Ilmub>
        </Sektsioon>
      )}
    </>
  );
}
