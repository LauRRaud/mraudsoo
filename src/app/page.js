import Link from "next/link";
import Foto from "@/components/Foto";
import { Nupp, NooleLink, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { liikumine, teenused } from "@/sisu/sait";

export default function Avaleht() {
  return (
    <>
      {/* Hero — usuline alus kohe ja selgelt */}
      <section className="bg-bone">
        <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 lg:py-24">
          <div>
            <p className="silt">Püha Kohalolu Kristuses</p>
            <h1 className="kuva mt-6 text-[clamp(3rem,8vw,6rem)] text-ink">
              Püha Ruum
            </h1>
            <p className="kuva mt-4 text-[clamp(1.4rem,3vw,2.1rem)] text-gold">
              Inimese terviklik korrastumine
            </p>

            <div className="joon my-10 max-w-24" />

            <Tekst suur>
              Usun, et Jumal on loonud iga inimese ainulaadseks. Minu kutsumus
              on aidata inimesel taas märgata oma väärtust, tuua ellu selgust ja
              luua kooskõla sisemise olemuse ning välise väljenduse vahel.
            </Tekst>

            <div className="mt-11 flex flex-wrap gap-4">
              <Nupp href="/broneerimine">Broneeri aeg</Nupp>
              <Nupp href="/teenused" variant="aaris">
                Vaata teenuseid
              </Nupp>
            </div>
          </div>

          {/* Piirame laiust, et lõikamata püstfoto ei kasvaks üle ekraani */}
          <div className="w-full max-w-[540px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-portree"
              alt="Marta Raudsoo"
              priority
              mahuEkraanile
              sizes="(max-width: 1024px) 100vw, 540px"
            />
          </div>
        </div>
      </section>

      {/* Kutsumus — miks teenused ei ole eraldi maailmad */}
      <Sektsioon taust="linen" laius="kitsas">
        <p className="silt">Kutsumus</p>
        <blockquote className="kuva mt-8 text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.35] text-ink">
          „Usun, et Jumal on kutsunud mind looma ruumi, kus inimene võib
          peatuda, olla kuuldud ning kogeda selgust.”
        </blockquote>
        <div className="mt-10 space-y-6">
          <Tekst>
            Mõnikord sünnib see vestluses ja palves. Mõnikord garderoobi
            korrastades, teadlikke valikuid tehes või fotosessioonil. Välised
            sammud saavad sageli peegeldada seda, mida Jumal teeb inimese
            südames.
          </Tekst>
          <Tekst>
            Minu teenused ei ole eraldi maailmad. Need on kõik ühe ja sama
            kutsumuse erinevad väljendusviisid. Väline ja sisemine ei ole lahus
            — riided, kodu, välimus ja valikud kannavad sageli inimese sisemist
            seisundit.
          </Tekst>
        </div>
      </Sektsioon>

      {/* Liikumine — Marta enda tugevaim sõnastus */}
      <Sektsioon taust="clay">
        <Pealkiri silt="Liikumine" className="max-w-2xl">
          Ma ei aita sul valida riideid. Ma aitan sul liikuda.
        </Pealkiri>

        <ul className="mt-16">
          {liikumine.map((rida) => (
            <li
              key={rida.millest}
              className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4 border-t border-ink/15 py-6 last:border-b sm:gap-10"
            >
              <span className="text-right mikro text-ink/60 sm:text-lg">
                {rida.millest}
              </span>
              <span aria-hidden="true" className="text-lg text-ink/40">
                →
              </span>
              <span className="kuva text-[clamp(1.5rem,3.5vw,2.5rem)] text-ink">
                {rida.milleks}
              </span>
            </li>
          ))}
        </ul>
      </Sektsioon>

      {/* Teenused */}
      <Sektsioon taust="bone">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Pealkiri silt="Teenused" className="max-w-xl">
            Viis viisi, kuidas sama kutsumus praktikas väljendub
          </Pealkiri>
          <NooleLink href="/teenused">Kõik teenused</NooleLink>
        </div>

        <ul className="mt-16">
          {teenused.map((teenus, i) => (
            <li key={teenus.slug}>
              <Link
                href={`/teenused/${teenus.slug}`}
                className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-3 border-t border-gold/25 py-8 transition-colors hover:bg-linen sm:grid-cols-[auto_1fr_1.2fr] sm:py-10"
              >
                <span className="silt !text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="kuva text-[clamp(1.5rem,3vw,2.15rem)] text-ink transition-colors group-hover:text-gold-deep">
                    {teenus.nimi}
                  </h3>
                  <p className="mt-1 text-lg italic text-ink-faint">
                    {teenus.alapealkiri}
                  </p>
                </div>
                <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft">
                  {teenus.luhike}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="joon" />
      </Sektsioon>

      {/* Minust */}
      <section className="bg-shell">
        <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:py-24">
          <div className="w-full max-w-[540px] justify-self-center lg:justify-self-start">
            <Foto
              nimi="marta-diivanil"
              alt="Marta Raudsoo"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
          </div>

          <div>
            <Pealkiri silt="Minust">
              Kõik, mis minus on head, on Jumala kingitus
            </Pealkiri>
            <div className="mt-8 space-y-6">
              <Tekst>
                Pakun inimestele ruumi, kus on võimalik peatuda, olla kuuldud ja
                märgata uuesti seda, mis on elus oluline.
              </Tekst>
              <Tekst>
                Minu soov ei ole juhtida inimesi enda juurde, vaid aidata neil
                kasvada oma suhtes Jumalaga.
              </Tekst>
            </div>
            <NooleLink href="/minust" className="mt-10">
              Loe minust
            </NooleLink>
          </div>
        </div>
      </section>

      {/* Kutse */}
      <Sektsioon taust="linen" laius="kitsas" className="text-center">
        <p className="silt">Alustame</p>
        <p className="kuva mx-auto mt-7 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.25] text-ink">
          Kui miski siin kõnetas, siis on see hea koht, kust alustada.
        </p>
        <div className="mt-11 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine">Broneeri aeg</Nupp>
          <Nupp href="/hinnakiri" variant="aaris">
            Vaata hinnakirja
          </Nupp>
        </div>
      </Sektsioon>
    </>
  );
}
