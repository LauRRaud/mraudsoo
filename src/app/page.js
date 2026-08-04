import Link from "next/link";
import Foto from "@/components/Foto";
import { Nupp, NooleLink, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";

/*
  AVALEHT.

  Kogu tekst tuleb sisupuust (src/sisu/vaikimisi.js + data/sisu.json).
  Rütm taustadega: bone → linen → clay → sage → bone → shell → linen,
  nii et kaks kõrvutist sektsiooni ei ole kunagi sama tausta.
*/
export default async function Avaleht() {
  const sisu = await laeSisu();
  const { hero, kutsumus, liikumine, essents, teenusedPlokk, minustPlokk, kutse } =
    sisu.avaleht;

  return (
    <>
      {/* Hero — usuline alus kohe ja selgelt */}
      <section className="bg-bone">
        {/* Tihe vertikaalne rütm, et kogu hero koos nuppudega mahuks esimesse ekraanitäide */}
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 px-6 py-12 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 lg:py-14">
          <div>
            <p className="silt">{hero.silt}</p>
            <h1 className="kuva mt-5 text-[clamp(2.75rem,6vw,4.5rem)] text-ink">
              {hero.pealkiri}
            </h1>
            <p className="kuva mt-3 text-[clamp(1.3rem,2.6vw,1.9rem)] text-gold">
              {hero.alapealkiri}
            </p>

            <div className="joon my-8 max-w-24" />

            <Tekst suur>{hero.tekst}</Tekst>

            <div className="mt-9 flex flex-wrap gap-4">
              <Nupp href="/broneerimine">{hero.nuppEsmane}</Nupp>
              <Nupp href="/teenused" variant="aaris">
                {hero.nuppTeine}
              </Nupp>
            </div>
          </div>

          {/* Piirame laiust, et lõikamata püstfoto ei kasvaks üle ekraani */}
          <div className="w-full max-w-[620px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-portree"
              alt={sisu.meta.saidiNimi}
              priority
              mahuEkraanile
              sizes="(max-width: 1024px) 100vw, 620px"
            />
          </div>
        </div>
      </section>

      {/* Kutsumus — miks teenused ei ole eraldi maailmad */}
      <Sektsioon taust="linen" laius="kitsas">
        <p className="silt">{kutsumus.silt}</p>
        <blockquote className="kuva mt-8 text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.35] text-ink">
          {kutsumus.tsitaat}
        </blockquote>
        <div className="mt-10 space-y-6">
          {kutsumus.loigud.map((loik, i) => (
            <Tekst key={i}>{loik}</Tekst>
          ))}
        </div>

        {/* Kuidas kutsumus praktikas väljendub */}
        <div className="joon my-10 max-w-24" />
        <Tekst>{kutsumus.valjendusSissejuhatus}</Tekst>
        <ul className="mt-6 space-y-3">
          {kutsumus.valjendus.map((punkt) => (
            <li
              key={punkt}
              className="grid grid-cols-[auto_1fr] items-baseline gap-4 text-lg text-ink-soft sm:text-xl"
            >
              <span aria-hidden="true" className="text-gold">
                —
              </span>
              <span>{punkt}</span>
            </li>
          ))}
        </ul>
      </Sektsioon>

      {/* Liikumine — Marta enda tugevaim sõnastus */}
      <Sektsioon taust="clay">
        <Pealkiri silt={liikumine.silt} className="max-w-2xl">
          {liikumine.pealkiri}
        </Pealkiri>

        {/*
          Read on mobiilis ühes veerus: kolm veergu ei mahu 375 px ekraanile,
          sest 1fr ei kahane sisu min-content'ist kitsamaks ja „Killustatusest”
          üksi on ligi 190 px. Nool on mõttekas ainult kõrvutiasetuses.
        */}
        <ul className="mt-16">
          {liikumine.read.map((rida) => (
            <li
              key={rida.millest}
              className="grid grid-cols-1 gap-1 border-t border-ink/15 py-6 last:border-b sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:gap-10"
            >
              <span className="mikro text-left text-ink/60 sm:text-right sm:text-lg">
                {rida.millest}
              </span>
              <span aria-hidden="true" className="hidden text-lg text-ink/40 sm:inline">
                →
              </span>
              <span className="kuva text-[clamp(1.5rem,3.5vw,2.5rem)] text-ink">
                {rida.milleks}
              </span>
            </li>
          ))}
        </ul>
      </Sektsioon>

      {/*
        Essents — Marta enda sõnad sellest, mis on inimese unikaalne olemus.
        Kahes veerus: vasakul kuvakiri, paremal lõigud. Esimene lõik on suurem,
        sest see kannab kogu sektsiooni mõtet.
      */}
      <Sektsioon taust="sage">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <p className="silt">{essents.silt}</p>
            <h2 className="kuva mt-5 text-[clamp(2rem,4.4vw,3.25rem)] text-ink">
              {essents.pealkiri}
            </h2>
            <div className="joon mt-10 max-w-24" />
          </div>

          <div className="space-y-7 lg:pt-2">
            {essents.loigud.map((loik, i) => (
              <Tekst key={i} suur={i === 0}>
                {loik}
              </Tekst>
            ))}
          </div>
        </div>
      </Sektsioon>

      {/* Teenused */}
      <Sektsioon taust="bone">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Pealkiri silt={teenusedPlokk.silt} className="max-w-xl">
            {teenusedPlokk.pealkiri}
          </Pealkiri>
          <NooleLink href="/teenused">{teenusedPlokk.linkTekst}</NooleLink>
        </div>

        <ul className="mt-16">
          {sisu.teenused.map((teenus) => (
            <li key={teenus.slug}>
              <Link
                href={`/teenused/${teenus.slug}`}
                /* Negatiivne veeris + sama polsterdus: hover-taust ulatub
                   sektsiooni servani, muidu jääb mulje äralõigatud kastist */
                className="group -mx-6 grid grid-cols-1 items-baseline gap-x-12 gap-y-3 border-t border-gold/25 px-6 py-8 transition-colors hover:bg-linen sm:grid-cols-[1fr_1.2fr] sm:py-10 lg:-mx-10 lg:px-10"
              >
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
          <div className="w-full max-w-[500px] justify-self-center lg:justify-self-start">
            <Foto
              nimi="marta-diivanil"
              alt={sisu.meta.saidiNimi}
              sizes="(max-width: 1024px) 100vw, 500px"
            />
          </div>

          <div>
            <Pealkiri silt={minustPlokk.silt}>{minustPlokk.pealkiri}</Pealkiri>
            <div className="mt-8 space-y-6">
              {minustPlokk.loigud.map((loik, i) => (
                <Tekst key={i}>{loik}</Tekst>
              ))}
            </div>
            <NooleLink href="/minust" className="mt-10">
              {minustPlokk.linkTekst}
            </NooleLink>
          </div>
        </div>
      </section>

      {/* Kutse */}
      <Sektsioon taust="linen" laius="kitsas" className="text-center">
        <p className="silt">{kutse.silt}</p>
        <p className="kuva mx-auto mt-7 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.25] text-ink">
          {kutse.pealkiri}
        </p>
        <div className="mt-11 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine">{kutse.nuppEsmane}</Nupp>
          <Nupp href="/hinnakiri" variant="aaris">
            {kutse.nuppTeine}
          </Nupp>
        </div>
      </Sektsioon>
    </>
  );
}
