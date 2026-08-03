import { Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import BroneeriVorm from "@/components/BroneeriVorm";
import { kontakt } from "@/sisu/sait";

export const metadata = {
  title: "Broneerimine",
  description:
    "Võta ühendust ja leiame koos sobiva aja ning viisi. Püha Ruum, stiiliselgus, garderoobi korrastus, teadlik ostlemine ja fotograafia.",
};

export default function Broneerimine() {
  return (
    <>
      <Sektsioon taust="bone">
        <div className="max-w-3xl">
          <Pealkiri silt="Broneerimine" tase="h1">
            Alustame vestlusest
          </Pealkiri>
          <div className="joon my-10 max-w-24" />
          <Tekst suur>
            Sa ei pea enne teadma, mida täpselt vajad. Kirjuta lihtsalt, mis
            sind praegu kõige rohkem puudutab — leiame koos õige koha, kust
            alustada.
          </Tekst>
        </div>
      </Sektsioon>

      <section className="bg-linen">
        <div className="mx-auto grid max-w-[1360px] gap-16 px-6 py-20 sm:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24 lg:px-10 lg:py-32">
          <div>
            <p className="silt">Saada soov</p>
            <div className="mt-10">
              <BroneeriVorm />
            </div>
          </div>

          <aside className="lg:border-l lg:border-gold/25 lg:pl-16">
            <p className="silt">Või kirjuta otse</p>

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
              Vastan ise ja võimalikult kiiresti. Kui sul on küsimus, mille
              kohta sa pole kindel, kas see üldse sobib — küsi ikkagi.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
