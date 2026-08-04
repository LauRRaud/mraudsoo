import Link from "next/link";
import Foto from "@/components/Foto";
import Ilmub from "@/components/Ilmub";
import { Nupp, NooleLink, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";

/*
  AVALEHT.

  Kogu tekst tuleb sisupuust (src/sisu/vaikimisi.js + data/sisu.json).
  Taustade kaar: bone → linen → METS (tume) → bone → linen → shell → clay,
  nii et kaks kõrvutist sektsiooni ei ole kunagi sama pinnaga ja lehe
  keskel seisab üks sügav tume hetk (liikumine).
*/
export default async function Avaleht() {
  const sisu = await laeSisu();
  const { hero, kutsumus, liikumine, essents, teenusedPlokk, minustPlokk, kutse } =
    sisu.avaleht;

  return (
    <>
      {/* Hero — usuline alus kohe ja selgelt, foto kirikuakna kaares */}
      <section className="overflow-hidden bg-bone">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 pb-16 pt-10 sm:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24 lg:px-12 lg:pb-24 lg:pt-16">
          <div>
            <p className="sisene silt">{hero.silt}</p>
            <h1
              className="sisene kuva mt-6 text-[clamp(3.25rem,9vw,6.5rem)] leading-[0.98] text-ink"
              style={{ "--viive": "90ms" }}
            >
              {hero.pealkiri}
            </h1>
            <p
              className="sisene kuva mt-5 italic text-[clamp(1.5rem,3vw,2.25rem)] text-gold"
              style={{ "--viive": "180ms" }}
            >
              {hero.alapealkiri}
            </p>

            <div
              className="sisene joon mb-9 mt-10 max-w-28"
              style={{ "--viive": "280ms" }}
            />

            <div className="sisene" style={{ "--viive": "360ms" }}>
              <Tekst suur>{hero.tekst}</Tekst>
            </div>

            <div
              className="sisene mt-10 flex flex-wrap gap-4"
              style={{ "--viive": "460ms" }}
            >
              <Nupp href="/broneerimine" nool>
                {hero.nuppEsmane}
              </Nupp>
              <Nupp href="/teenused" variant="aaris">
                {hero.nuppTeine}
              </Nupp>
            </div>
          </div>

          {/* Foto on paigal ja ilma tekke-efektita — lihtsalt olemas */}
          <div className="w-full max-w-[500px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-portree"
              alt={sisu.meta.saidiNimi}
              priority
              kaar
              sizes="(max-width: 1024px) 92vw, 500px"
            />
          </div>
        </div>
      </section>

      {/* Kutsumus — miks teenused ei ole eraldi maailmad */}
      <Sektsioon taust="linen" laius="kitsas">
        <Ilmub>
          <p className="silt">{kutsumus.silt}</p>
          <blockquote className="kuva mt-8 text-[clamp(1.7rem,3.6vw,2.75rem)] leading-[1.3] text-ink">
            {kutsumus.tsitaat}
          </blockquote>
        </Ilmub>

        <Ilmub ruhm className="mt-11 space-y-6">
          {kutsumus.loigud.map((loik) => (
            <Tekst key={loik}>{loik}</Tekst>
          ))}
        </Ilmub>

        {/* Kuidas kutsumus praktikas väljendub */}
        <Ilmub className="joon my-12 max-w-28" />
        <Ilmub>
          <Tekst>{kutsumus.valjendusSissejuhatus}</Tekst>
        </Ilmub>
        <Ilmub ruhm as="ul" className="mt-8">
          {kutsumus.valjendus.map((punkt) => (
            <li
              key={punkt}
              className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-gold/25 py-5 text-lg text-ink-soft last:border-b sm:text-xl"
            >
              <span aria-hidden="true" className="text-gold">
                —
              </span>
              <span>{punkt}</span>
            </li>
          ))}
        </Ilmub>
      </Sektsioon>

      {/*
        Liikumine — Marta enda tugevaim sõnastus, lehe tume süda.
        Tsentreeritud nagu litaania: iga rida on üks hingetõmme, väike
        lähtekoht ja suur kaldkirjas sihtkoht samal joonel.
      */}
      <Sektsioon taust="mets">
        <Ilmub className="text-center">
          <div aria-hidden="true" className="pystjoon pystjoon-tume" />
          <p className="silt silt-tume mt-7">{liikumine.silt}</p>
          <h2 className="kuva mx-auto mt-6 max-w-3xl text-[clamp(2rem,4.2vw,3.3rem)] text-luu">
            {liikumine.pealkiri}
          </h2>
        </Ilmub>

        <Ilmub ruhm as="ul" className="mt-12 sm:mt-16">
          {liikumine.read.map((rida) => (
            <li
              key={rida.millest}
              className="flex flex-wrap items-baseline justify-center gap-x-5 py-4 sm:gap-x-7 sm:py-5"
            >
              {/* Lähtekoht on loetav, mitte aimatav — suurem ja heledam kui tavaline silt */}
              <span className="mikro text-lg text-luu/90 sm:text-xl">
                {rida.millest}
              </span>
              <span aria-hidden="true" className="text-xl text-kuld-hele">
                →
              </span>
              <span className="kuva italic text-[clamp(2rem,4.6vw,3.2rem)] leading-[1.15] text-luu">
                {rida.milleks}
              </span>
            </li>
          ))}
        </Ilmub>
      </Sektsioon>

      {/*
        Essents — Marta enda sõnad sellest, mis on inimese unikaalne olemus.
        Pealkiri jääb laial ekraanil vasakule püsima, lõigud voolavad kõrval.
      */}
      <Sektsioon taust="bone">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Ilmub>
              <p className="silt">{essents.silt}</p>
              <h2 className="kuva mt-6 text-[clamp(2rem,4.4vw,3.3rem)] text-ink">
                {essents.pealkiri}
              </h2>
              <div className="joon mt-10 max-w-28" />
            </Ilmub>
          </div>

          <Ilmub ruhm className="space-y-8 lg:pt-2">
            {essents.loigud.map((loik, jrk) => (
              <p
                key={loik}
                /* Esimene lõik kannab kogu sektsiooni mõtet — pisut suurem ja tumedam */
                className={
                  jrk === 0
                    ? "max-w-[58ch] text-xl leading-[1.75] text-ink sm:text-[1.4rem]"
                    : "tekst max-w-[60ch] leading-[1.85] text-ink-soft"
                }
              >
                {loik}
              </p>
            ))}
          </Ilmub>
        </div>
      </Sektsioon>

      {/* Teenused — nummerdatud register */}
      <Sektsioon taust="linen">
        <Ilmub className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <Pealkiri silt={teenusedPlokk.silt} className="max-w-xl">
            {teenusedPlokk.pealkiri}
          </Pealkiri>
          <NooleLink href="/teenused">{teenusedPlokk.linkTekst}</NooleLink>
        </Ilmub>

        <Ilmub ruhm as="ul" className="mt-14">
          {sisu.teenused.map((teenus) => (
            <li key={teenus.slug}>
              <Link
                href={`/teenused/${teenus.slug}`}
                /* Negatiivne veeris + sama polsterdus: hover-taust ulatub
                   sektsiooni servani, muidu jääb mulje äralõigatud kastist */
                className="group -mx-6 grid grid-cols-1 items-center gap-x-10 gap-y-4 border-t border-gold/25 px-6 py-8 transition-colors duration-300 hover:bg-bone sm:grid-cols-[1.1fr_1fr] sm:py-10 lg:-mx-12 lg:px-12"
              >
                <div>
                  <h3 className="kuva text-[clamp(1.55rem,3.1vw,2.4rem)] text-ink transition-colors duration-300 group-hover:text-gold-deep">
                    {teenus.nimi}
                  </h3>
                  <p className="kuva mt-1 italic text-lg text-ink-faint sm:text-xl">
                    {teenus.alapealkiri}
                  </p>
                </div>
                <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:justify-self-end">
                  {teenus.luhike}
                </p>
              </Link>
            </li>
          ))}
        </Ilmub>
        <div className="joon" />
      </Sektsioon>

      {/* Minust */}
      <section className="overflow-hidden bg-shell">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-12 lg:py-36">
          <div className="w-full max-w-[440px] justify-self-center lg:justify-self-start">
            <Foto
              nimi="marta-diivanil"
              alt={sisu.meta.saidiNimi}
              kaar
              sizes="(max-width: 1024px) 92vw, 440px"
            />
          </div>

          <div>
            <Ilmub>
              <Pealkiri silt={minustPlokk.silt}>{minustPlokk.pealkiri}</Pealkiri>
            </Ilmub>
            <Ilmub ruhm className="mt-8 space-y-6">
              {minustPlokk.loigud.map((loik) => (
                <Tekst key={loik}>{loik}</Tekst>
              ))}
            </Ilmub>
            <Ilmub viive={200}>
              <NooleLink href="/minust" className="mt-10">
                {minustPlokk.linkTekst}
              </NooleLink>
            </Ilmub>
          </div>
        </div>
      </section>

      {/* Kutse — tihedam polsterdus, et vaikne hetk ei mõjuks tühja auguna */}
      <Sektsioon taust="clay" laius="kitsas" polsterdus="ohuke" className="text-center">
        <Ilmub>
          <div aria-hidden="true" className="pystjoon" />
          <p className="silt mt-7">{kutse.silt}</p>
          <p className="kuva mx-auto mt-7 max-w-2xl text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.22] text-ink">
            {kutse.pealkiri}
          </p>
        </Ilmub>
        <Ilmub viive={180} className="mt-12 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine" nool>
            {kutse.nuppEsmane}
          </Nupp>
          <Nupp href="/hinnakiri" variant="aaris">
            {kutse.nuppTeine}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
