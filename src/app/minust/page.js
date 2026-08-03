import Foto from "@/components/Foto";
import { Nupp, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { annid } from "@/sisu/sait";

export const metadata = {
  title: "Minust",
  description:
    "Pakun inimestele ruumi, kus on võimalik peatuda, olla kuuldud ja märgata uuesti seda, mis on elus oluline.",
};

export default function Minust() {
  return (
    <>
      <section className="bg-bone">
        <div className="mx-auto grid max-w-[1360px] items-start gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-24">
          <div>
            <Pealkiri silt="Minust" tase="h1">
              Pakun ruumi, kus on võimalik peatuda
            </Pealkiri>
            <div className="joon my-10 max-w-24" />
            <Tekst suur>
              Pakun inimestele ruumi, kus on võimalik peatuda, olla kuuldud ja
              märgata uuesti seda, mis on elus oluline.
            </Tekst>
          </div>

          {/* Piirame laiust, et lõikamata püstfoto ei kasvaks üle ekraani */}
          <div className="w-full max-w-[540px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-seistes"
              alt="Marta Raudsoo"
              priority
              mahuEkraanile
              sizes="(max-width: 1024px) 100vw, 540px"
            />
          </div>
        </div>
      </section>

      <Sektsioon taust="linen" laius="kitsas">
        <div className="space-y-6">
          <Tekst>
            Usun, et Jumal kasutab erinevaid inimesi erineval viisil. Minu
            südames on saanud oluliseks luua keskkond, kus võivad sündida
            kuulamine, selgus, korrastumine, julgustus ja järgmiste sammude
            eristamine.
          </Tekst>
          <Tekst>
            Kõik see sünnib usus, palves ja sooviga anda kogu au Jumalale.
          </Tekst>
        </div>
      </Sektsioon>

      {/* Annid */}
      <Sektsioon taust="bone">
        <Pealkiri silt="Annid" className="max-w-2xl">
          Annid, mida olen oma teekonnal ära tundnud
        </Pealkiri>
        <Tekst className="mt-8">
          Korintlastele 12 õpetab, et Püha Vaim annab oma ande ühiseks kasuks.
          Oma teekonnal olen kõige enam märganud, et Jumal kasutab minu kaudu
          eelkõige järgmist.
        </Tekst>

        <dl className="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2">
          {annid.map((and) => (
            <div key={and.nimi} className="border-t border-gold/25 pt-6">
              <dt className="kuva text-[clamp(1.35rem,2.5vw,1.75rem)] text-ink">
                {and.nimi}
              </dt>
              <dd className="mt-2 text-lg leading-relaxed text-ink-soft">
                {and.kirjeldus}
              </dd>
            </div>
          ))}
        </dl>

      </Sektsioon>

      {/* Horisontaalne foto oma loomulikus 3:2 kuvasuhtes, tsitaat selle all */}
      <div className="bg-bone px-6 pb-16 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-[1000px]">
          <Foto
            nimi="marta-lamades"
            alt="Marta Raudsoo"
            sizes="(max-width: 1000px) 100vw, 1000px"
          />

          <blockquote className="kuva mt-12 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.45] text-ink">
            „Need ei ole minu saavutused. Need on Jumala armu kingitused, mida
            soovin kasutada ustavalt teiste teenimiseks.”
          </blockquote>
        </div>
      </div>

      {/* Terviklik inimene */}
      <section className="bg-clay">
        <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-24">
          <div>
            <Pealkiri silt="Terviklikkus">
              Jumal hoolib terviklikust inimesest
            </Pealkiri>
            {/* Suurem kiri ja hõredam vahe, et tekstiveerg ei jääks pildi kõrval kokkusurutuks */}
            <div className="mt-9 space-y-7">
              <p className="max-w-[52ch] text-xl leading-[1.7] text-ink/85">
                Seepärast kohtuvad minu töös sisemine ja väline — kuulamine ja
                praktilised sammud, kohalolu ja korrastumine.
              </p>
              <p className="max-w-[52ch] text-xl leading-[1.7] text-ink/85">
                Kui südames sünnib selgus, saab see hakata peegelduma ka
                igapäevases elus: valikutes, garderoobis, kodus, eneseväljenduses
                ja suhetes.
              </p>
            </div>
          </div>

          <div className="w-full max-w-[440px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-tutrega"
              alt="Marta Raudsoo koos tütrega"
              sizes="(max-width: 1024px) 100vw, 440px"
            />
          </div>
        </div>
      </section>

      <Sektsioon taust="linen" laius="kitsas" className="text-center">
        <blockquote className="kuva mx-auto max-w-3xl text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.35] text-ink">
          „Kõik, mis minus on head, on Jumala kingitus. Minu soov ei ole juhtida
          inimesi enda juurde, vaid aidata neil kasvada oma suhtes Jumalaga.”
        </blockquote>
        <div className="mt-12">
          <Nupp href="/broneerimine">Võta ühendust</Nupp>
        </div>
      </Sektsioon>
    </>
  );
}
