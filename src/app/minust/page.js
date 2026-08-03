import Image from "next/image";
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
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-28">
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

          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/pildid/marta-lamades.jpg"
              alt="Marta Raudsoo"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
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
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                {and.kirjeldus}
              </dd>
            </div>
          ))}
        </dl>

        <blockquote className="kuva mt-16 max-w-3xl text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.4] text-gold-deep">
          „Need ei ole minu saavutused. Need on Jumala armu kingitused, mida
          soovin kasutada ustavalt teiste teenimiseks.”
        </blockquote>
      </Sektsioon>

      {/* Terviklik inimene */}
      <section className="bg-clay">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10 lg:py-32">
          <div>
            <Pealkiri silt="Terviklikkus">
              Jumal hoolib terviklikust inimesest
            </Pealkiri>
            <div className="mt-8 space-y-6">
              <p className="max-w-[62ch] text-base leading-[1.9] text-ink/75">
                Seepärast kohtuvad minu töös sisemine ja väline — kuulamine ja
                praktilised sammud, kohalolu ja korrastumine.
              </p>
              <p className="max-w-[62ch] text-base leading-[1.9] text-ink/75">
                Kui südames sünnib selgus, saab see hakata peegelduma ka
                igapäevases elus: valikutes, garderoobis, kodus, eneseväljenduses
                ja suhetes.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/pildid/marta-tutrega.jpg"
              alt="Marta Raudsoo koos tütrega"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
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
