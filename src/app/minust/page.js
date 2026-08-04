import Foto from "@/components/Foto";
import { Nupp, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";

/* Metaandmed tulevad samast sisupuust, mis leht ise */
export async function generateMetadata() {
  const sisu = await laeSisu();

  return {
    title: sisu.minust.hero.silt,
    description: sisu.minust.hero.tekst,
  };
}

export default async function Minust() {
  const sisu = await laeSisu();
  const {
    hero,
    lugu,
    kirjakoht,
    pooordumine,
    annid,
    tsitaat,
    terviklikkus,
    lopp,
  } = sisu.minust;

  return (
    <>
      {/* Sissejuhatus — items-center nagu avalehel, tekst tsentreeritakse pildi suhtes */}
      <section className="bg-bone">
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 px-6 py-12 sm:py-14 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-14">
          <div>
            <Pealkiri silt={hero.silt} tase="h1">
              {hero.pealkiri}
            </Pealkiri>
            <div className="joon my-8 max-w-24" />
            <Tekst suur>{hero.tekst}</Tekst>
          </div>

          {/* Piirame laiust, et lõikamata püstfoto ei kasvaks üle ekraani */}
          <div className="w-full max-w-[620px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-seistes"
              alt="Marta Raudsoo"
              priority
              mahuEkraanile
              sizes="(max-width: 1024px) 100vw, 620px"
            />
          </div>
        </div>
      </section>

      {/*
        Minu lugu — lehe kõige isiklikum osa.
        Pealkiri jääb laial ekraanil vasakule püsima, lugu voolab kõrval
        ühes kitsas veerus, et lõikude vahel oleks õhku ja lugemisrütmi.
      */}
      <Sektsioon taust="linen">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Pealkiri silt={lugu.silt}>{lugu.pealkiri}</Pealkiri>
            <div className="joon mt-8 max-w-24" />
          </div>

          <div className="max-w-[62ch] space-y-8">
            {lugu.loigud.map((loik, jrk) => (
              <p
                key={loik}
                /* Esimene lõik on loo sissejuhatus — pisut suurem ja tumedam */
                className={
                  jrk === 0
                    ? "text-xl leading-[1.7] text-ink sm:text-[1.375rem]"
                    : "text-lg leading-[1.8] text-ink-soft sm:text-xl"
                }
              >
                {loik}
              </p>
            ))}
          </div>
        </div>
      </Sektsioon>

      {/*
        Kirjakoht — kogu lehe vaikseim hetk.
        Viide sildina, salm suure kuvakirjaga, Marta selgitus joone all.
      */}
      <Sektsioon taust="sage" laius="kitsas" className="text-center">
        <p className="silt">{kirjakoht.viide}</p>
        <blockquote className="kuva mx-auto mt-8 max-w-3xl text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.25] text-ink">
          {kirjakoht.tekst}
        </blockquote>
        <div className="joon mx-auto my-12 max-w-24" />
        <Tekst className="mx-auto">{kirjakoht.selgitus}</Tekst>
      </Sektsioon>

      {/*
        Pöördumine — Marta usu- ja pöördumislugu.
        Lehe kõige isiklikum osa, seepärast on pealkiri keskel ja lugu voolab
        ühes kitsas veerus hõreda rütmiga. Viimane lõik on kutsumuse kokkuvõte
        ja seisab kuvakirjas kullas, et lugu lõppeks kõlaga, mitte poolel sõnal.
      */}
      <Sektsioon taust="shell">
        <div className="mx-auto max-w-3xl text-center">
          <Pealkiri silt={pooordumine.silt}>{pooordumine.pealkiri}</Pealkiri>
          <div className="joon mx-auto mt-10 max-w-24" />
        </div>

        <div className="mx-auto mt-14 max-w-[60ch] space-y-9 sm:mt-16">
          {pooordumine.loigud.map((loik, jrk) => {
            const viimane = jrk === pooordumine.loigud.length - 1;

            return (
              <p
                key={loik}
                className={
                  viimane
                    ? "kuva pt-4 text-[clamp(1.3rem,2.6vw,1.85rem)] leading-[1.45] text-gold-deep"
                    : jrk === 0
                      ? "text-xl leading-[1.7] text-ink sm:text-[1.375rem]"
                      : "text-lg leading-[1.8] text-ink-soft sm:text-xl"
                }
              >
                {loik}
              </p>
            );
          })}
        </div>
      </Sektsioon>

      {/*
        Loo juurde kuuluvad kirjakohad — sama käsitlus mis üleval üksiku
        kirjakoha juures: viide sildina, salm kuvakirjaga, Marta selgitus all.
        Mõne salmi juures pildil selgitust ei olnud, siis jääb see lihtsalt ära.
      */}
      <Sektsioon taust="linen">
        <div className="mx-auto max-w-[62ch] space-y-14">
          {pooordumine.kirjakohad.map((koht) => (
            <div key={koht.viide} className="border-t border-gold/25 pt-8">
              <p className="silt">{koht.viide}</p>
              <blockquote className="kuva mt-6 text-[clamp(1.3rem,2.8vw,1.9rem)] leading-[1.35] text-ink">
                {koht.tekst}
              </blockquote>
              {koht.selgitus && (
                <p className="mt-6 text-lg leading-[1.8] text-ink-soft">
                  {koht.selgitus}
                </p>
              )}
            </div>
          ))}
        </div>
      </Sektsioon>

      {/* Annid */}
      <Sektsioon taust="bone">
        <Pealkiri silt={annid.silt} className="max-w-2xl">
          {annid.pealkiri}
        </Pealkiri>
        <Tekst className="mt-8">{annid.sissejuhatus}</Tekst>

        <dl className="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2">
          {annid.loend.map((and) => (
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

          <blockquote className="kuva mt-12 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.45] text-gold-deep">
            {tsitaat.tekst}
          </blockquote>
        </div>
      </div>

      {/* Terviklik inimene */}
      <section className="bg-clay">
        <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-24">
          <div>
            <Pealkiri silt={terviklikkus.silt}>
              {terviklikkus.pealkiri}
            </Pealkiri>
            {/* Suurem kiri ja hõredam vahe, et tekstiveerg ei jääks pildi kõrval kokkusurutuks */}
            <div className="mt-9 space-y-7">
              {terviklikkus.loigud.map((loik) => (
                <p
                  key={loik}
                  className="max-w-[52ch] text-xl leading-[1.7] text-ink/85"
                >
                  {loik}
                </p>
              ))}
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

      {/* Lõpetuseks */}
      <Sektsioon taust="linen" laius="kitsas" className="text-center">
        <blockquote className="kuva mx-auto max-w-3xl text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.35] text-ink">
          {lopp.tsitaat}
        </blockquote>
        <div className="mt-12">
          <Nupp href="/broneerimine">{lopp.nuppTekst}</Nupp>
        </div>
      </Sektsioon>
    </>
  );
}
