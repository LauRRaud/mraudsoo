import Link from "next/link";
import { Nupp, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { teenused } from "@/sisu/sait";

export const metadata = {
  title: "Teenused",
  description:
    "Püha Ruum, stiiliselgus, garderoobi korrastus, teadlik ostlemine ja fotograafia — ühe ja sama kutsumuse erinevad väljendusviisid.",
};

export default function Teenused() {
  return (
    <>
      <Sektsioon taust="bone">
        <div className="max-w-3xl">
          <Pealkiri silt="Teenused" tase="h1">
            Ühe kutsumuse erinevad väljendusviisid
          </Pealkiri>
          <div className="joon my-10 max-w-24" />
          <Tekst suur>
            Minu teenused ei ole eraldi maailmad. Püha Ruum ei ole üks teenus
            ning stiiliselgus, garderoobi korrastus, teadlik ostlemine ja
            fotograafia teised. Need on kõik ühe ja sama kutsumuse erinevad
            väljendusviisid.
          </Tekst>
        </div>
      </Sektsioon>

      <section className="bg-linen">
        <div className="mx-auto max-w-6xl px-6 pb-20 sm:pb-24 lg:px-10 lg:pb-32">
          <ul className="pt-20 sm:pt-24 lg:pt-32">
            {teenused.map((teenus, i) => (
              <li key={teenus.slug}>
                <Link
                  href={`/teenused/${teenus.slug}`}
                  className="group grid grid-cols-1 gap-x-10 gap-y-4 border-t border-gold/25 py-10 transition-colors hover:bg-bone sm:grid-cols-[auto_1fr_1.1fr] sm:py-12"
                >
                  <span className="silt !text-ink-faint sm:pt-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h2 className="kuva text-[clamp(1.7rem,3.4vw,2.6rem)] text-ink transition-colors group-hover:text-gold-deep">
                      {teenus.nimi}
                    </h2>
                    <p className="mt-1 text-base italic text-ink-faint">
                      {teenus.alapealkiri}
                    </p>
                  </div>

                  <div>
                    <p className="max-w-[48ch] text-base leading-relaxed text-ink-soft">
                      {teenus.luhike}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-3 mikro text-gold-deep">
                      Loe lähemalt
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
          Ei tea, kust alustada?
        </p>
        <Tekst className="mx-auto mt-6 text-center">
          Kirjuta lihtsalt, mis sind praegu kõige rohkem puudutab. Leiame koos
          õige koha, kust alustada.
        </Tekst>
        <div className="mt-11 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine">Võta ühendust</Nupp>
          <Nupp href="/hinnakiri" variant="aaris">
            Hinnakiri
          </Nupp>
        </div>
      </Sektsioon>
    </>
  );
}
