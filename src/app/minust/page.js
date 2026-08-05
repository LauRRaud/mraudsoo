import Foto from "@/components/Foto";
import Ilmub from "@/components/Ilmub";
import { NooleLink, Nupp, Pealkiri, Salm, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { plokiStiil, tekstiKuju } from "@/sisu/tekstikujud";

/* Metaandmed tulevad samast sisupuust, mis leht ise */
export async function generateMetadata() {
  const sisu = await laeSisu();

  return {
    title: sisu.minust.hero.silt,
    description: sisu.minust.hero.tekst,
  };
}

/*
  MINUST.

  Lehe kaar: hele algus (kes ma olen) → vaikne salm → TUME pöördumislugu
  (lehe kõige isiklikum osa metsarohelisel) → salmid loo juurde → annid →
  foto ja tsitaat → terviklikkus → lõpetus.
*/
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

  /* Admin-lehelt antud üksikute tekstide kuju */
  const v = plokiStiil(sisu.tekstiKujud, "minust");
  const s = tekstiKuju(sisu.tekstiKujud, "minust");

  return (
    <>
      {/*
        Sissejuhatus. Tekstiveerg algab ülevalt nagu avalehelgi (mitte foto
        keskkohast) ja lõpeb viitega loo juurde — nii on veerg fotoga
        tasakaalus ega jää „alla rippuma”.
      */}
      <section className="overflow-hidden bg-bone">
        <div className="mx-auto grid max-w-[1400px] items-start gap-14 px-6 pb-16 pt-10 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:px-12 lg:pb-24 lg:pt-16">
          <div className="lg:pt-14">
            <p className="sisene silt" style={v("hero.silt")}>
              {s("hero.silt", hero.silt)}
            </p>
            <h1
              className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-ink"
              style={{ "--viive": "90ms", ...v("hero.pealkiri") }}
            >
              {s("hero.pealkiri", hero.pealkiri)}
            </h1>
            <div
              className="sisene joon mb-9 mt-9 max-w-28"
              style={{ "--viive": "200ms" }}
            />
            <div className="sisene" style={{ "--viive": "300ms" }}>
              <Tekst suur stiil={v("hero.tekst")} kuju={s.kuju("hero.tekst")}>
                {hero.tekst}
              </Tekst>
            </div>
            <div className="sisene" style={{ "--viive": "400ms" }}>
              {/* Sõnastus on loo sektsiooni enda silt (lugu.silt) */}
              <NooleLink href="#lugu" className="mt-10">
                {lugu.silt}
              </NooleLink>
            </div>
          </div>

          {/* Foto on paigal ja ilma tekke-efektita */}
          <div className="w-full max-w-[460px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-seistes"
              alt="Marta Raudsoo"
              priority
              kaar
              sizes="(max-width: 1024px) 92vw, 460px"
            />
          </div>
        </div>
      </section>

      {/*
        Minu lugu — pealkiri jääb laial ekraanil vasakule püsima, lugu voolab
        kõrval ühes kitsas veerus, et lõikude vahel oleks õhku ja lugemisrütmi.
      */}
      <Sektsioon taust="linen" id="lugu">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-28">
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Silti pealkirja kohal ei ole — see oleks sama sõna kaks korda */}
            <Ilmub>
              <Pealkiri
                stiil={v("lugu.pealkiri")}
                kuju={s.kuju("lugu.pealkiri")}
              >
                {lugu.pealkiri}
              </Pealkiri>
              <div className="joon mt-9 max-w-28" />
            </Ilmub>
          </div>

          <Ilmub ruhm className="max-w-[62ch] space-y-8">
            {lugu.loigud.map((loik, jrk) => (
              <p
                key={loik}
                style={v(`lugu.loigud.${jrk}`)}
                /* Esimene lõik on loo sissejuhatus — pisut suurem ja tumedam */
                className={
                  jrk === 0
                    ? "text-xl leading-[1.75] text-ink sm:text-[1.4rem]"
                    : "text-lg leading-[1.85] text-ink-soft sm:text-xl"
                }
              >
                {s(`lugu.loigud.${jrk}`, loik)}
              </p>
            ))}
          </Ilmub>
        </div>
      </Sektsioon>

      {/* Kirjakoht — kogu lehe vaikseim hetk */}
      <Sektsioon taust="sage" laius="kitsas">
        <Ilmub>
          <Salm
            viide={kirjakoht.viide}
            tekst={kirjakoht.tekst}
            selgitus={kirjakoht.selgitus}
            viiteStiil={v("kirjakoht.viide")}
            stiil={v("kirjakoht.tekst")}
            selgituseStiil={v("kirjakoht.selgitus")}
            viiteKuju={s.kuju("kirjakoht.viide")}
            kuju={s.kuju("kirjakoht.tekst")}
            selgituseKuju={s.kuju("kirjakoht.selgitus")}
          />
        </Ilmub>
      </Sektsioon>

      {/*
        Pöördumine — Marta usu- ja pöördumislugu. Lehe kõige isiklikum osa
        seisab lehe kõige sügavamal pinnal: metsarohelisel, kuldse valgusega.
        Viimane lõik on kutsumuse kokkuvõte ja seisab kuvakirjas heledas
        kullas, et lugu lõppeks kõlaga, mitte poolel sõnal.
      */}
      <Sektsioon taust="mets">
        <Ilmub className="mx-auto max-w-3xl text-center">
          <div aria-hidden="true" className="pystjoon pystjoon-tume" />
          <p className="silt silt-tume mt-7" style={v("pooordumine.silt")}>
            {s("pooordumine.silt", pooordumine.silt)}
          </p>
          <h2
            className="kuva mt-6 text-[clamp(2rem,4.2vw,3.2rem)] text-luu"
            style={v("pooordumine.pealkiri")}
          >
            {s("pooordumine.pealkiri", pooordumine.pealkiri)}
          </h2>
        </Ilmub>

        <Ilmub ruhm className="mx-auto mt-14 max-w-[60ch] space-y-9 sm:mt-16">
          {pooordumine.loigud.map((loik, jrk) => (
            <p
              key={loik}
              style={v(`pooordumine.loigud.${jrk}`)}
              /* whitespace-pre-line: Marta reavahetused pildilt jäävad alles */
              className={`whitespace-pre-line ${
                jrk === 0
                  ? "text-xl leading-[1.75] text-luu sm:text-[1.4rem]"
                  : "text-lg leading-[1.85] text-luu/95 sm:text-xl"
              }`}
            >
              {s(`pooordumine.loigud.${jrk}`, loik)}
            </p>
          ))}
        </Ilmub>

        {/*
          Loo lõpetus omaette tsitaadina — lugu algab ja lõpeb sama kuldse
          püstjoonega, vahepeal on Marta jutustus.
        */}
        {pooordumine.tsitaat && (
          <Ilmub className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
            <div aria-hidden="true" className="pystjoon pystjoon-tume" />
            <blockquote
              className="kuva mt-8 text-[clamp(1.35rem,2.7vw,1.9rem)] leading-[1.45] text-kuld-hele"
              style={v("pooordumine.tsitaat")}
            >
              {s("pooordumine.tsitaat", pooordumine.tsitaat)}
            </blockquote>
          </Ilmub>
        )}
      </Sektsioon>

      {/*
        Loo juurde kuuluvad kirjakohad — iga salm oma vaikse hetkena.
        Mõne salmi juures pildil selgitust ei olnud, siis jääb see lihtsalt ära.
      */}
      <Sektsioon taust="linen" laius="kitsas">
        <div className="space-y-20 sm:space-y-24">
          {pooordumine.kirjakohad.map((koht, jrk) => (
            <Ilmub key={koht.viide}>
              <Salm
                viide={koht.viide}
                tekst={koht.tekst}
                selgitus={koht.selgitus}
                viiteStiil={v(`pooordumine.kirjakohad.${jrk}.viide`)}
                stiil={v(`pooordumine.kirjakohad.${jrk}.tekst`)}
                selgituseStiil={v(`pooordumine.kirjakohad.${jrk}.selgitus`)}
                viiteKuju={s.kuju(`pooordumine.kirjakohad.${jrk}.viide`)}
                kuju={s.kuju(`pooordumine.kirjakohad.${jrk}.tekst`)}
                selgituseKuju={s.kuju(`pooordumine.kirjakohad.${jrk}.selgitus`)}
              />
            </Ilmub>
          ))}
        </div>
      </Sektsioon>

      {/* Annid */}
      <Sektsioon taust="bone">
        <Ilmub>
          <Pealkiri
            silt={annid.silt}
            className="max-w-2xl"
            siltStiil={v("annid.silt")}
            stiil={v("annid.pealkiri")}
            siltKuju={s.kuju("annid.silt")}
            kuju={s.kuju("annid.pealkiri")}
          >
            {annid.pealkiri}
          </Pealkiri>
          <Tekst
            className="mt-8"
            stiil={v("annid.sissejuhatus")}
            kuju={s.kuju("annid.sissejuhatus")}
          >
            {annid.sissejuhatus}
          </Tekst>
        </Ilmub>

        {/* Ilma ülajoonteta — kuvakirjas nimed kannavad plokke ise */}
        <Ilmub ruhm as="dl" className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {annid.loend.map((and, jrk) => (
            <div key={and.nimi}>
              <dt
                className="kuva text-[clamp(1.4rem,2.6vw,1.85rem)] text-ink"
                style={v(`annid.loend.${jrk}.nimi`)}
              >
                {s(`annid.loend.${jrk}.nimi`, and.nimi)}
              </dt>
              <dd
                className="mt-3 text-lg leading-relaxed text-ink-soft"
                style={v(`annid.loend.${jrk}.kirjeldus`)}
              >
                {s(`annid.loend.${jrk}.kirjeldus`, and.kirjeldus)}
              </dd>
            </div>
          ))}
        </Ilmub>
      </Sektsioon>

      {/* Horisontaalne foto oma loomulikus kuvasuhtes, tsitaat selle all */}
      <section className="overflow-hidden bg-linen">
        <div className="mx-auto max-w-[1400px] px-6 py-20 sm:py-28 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-[1000px]">
            <Foto
              nimi="marta-lamades"
              alt="Marta Raudsoo"
              sizes="(max-width: 1024px) 100vw, 1000px"
            />

            <Ilmub viive={150}>
              <blockquote
                className="kuva mt-12 max-w-4xl text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.4] text-gold-deep"
                style={v("tsitaat.tekst")}
              >
                {s("tsitaat.tekst", tsitaat.tekst)}
              </blockquote>
            </Ilmub>
          </div>
        </div>
      </section>

      {/* Terviklik inimene */}
      <section className="overflow-hidden bg-sage">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:px-12 lg:py-36">
          <div>
            <Ilmub>
              <Pealkiri
                silt={terviklikkus.silt}
                siltStiil={v("terviklikkus.silt")}
                stiil={v("terviklikkus.pealkiri")}
                siltKuju={s.kuju("terviklikkus.silt")}
                kuju={s.kuju("terviklikkus.pealkiri")}
              >
                {terviklikkus.pealkiri}
              </Pealkiri>
            </Ilmub>
            {/* Suurem kiri ja hõredam vahe, et tekstiveerg ei jääks pildi kõrval kokkusurutuks */}
            <Ilmub ruhm className="mt-9 space-y-7">
              {terviklikkus.loigud.map((loik, jrk) => (
                <p
                  key={loik}
                  style={v(`terviklikkus.loigud.${jrk}`)}
                  /* whitespace-pre-line: Marta reavahetused pildilt jäävad alles */
                  className="max-w-[52ch] whitespace-pre-line text-xl leading-[1.75] text-ink/85"
                >
                  {s(`terviklikkus.loigud.${jrk}`, loik)}
                </p>
              ))}
            </Ilmub>
          </div>

          <div className="w-full max-w-[420px] justify-self-center lg:justify-self-end">
            <Foto
              nimi="marta-tutrega"
              alt="Marta Raudsoo koos tütrega"
              kaar
              sizes="(max-width: 1024px) 92vw, 420px"
            />
          </div>
        </div>
      </section>

      {/* Lõpetuseks */}
      <Sektsioon taust="linen" laius="kitsas" polsterdus="ohuke" className="text-center">
        <Ilmub>
          <div aria-hidden="true" className="pystjoon" />
          <blockquote
            className="kuva mx-auto mt-8 max-w-3xl text-[clamp(1.55rem,3.2vw,2.4rem)] leading-[1.35] text-ink"
            style={v("lopp.tsitaat")}
          >
            {s("lopp.tsitaat", lopp.tsitaat)}
          </blockquote>
        </Ilmub>
        <Ilmub viive={180} className="mt-12">
          <Nupp href="/broneerimine" nool>
            {lopp.nuppTekst}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
