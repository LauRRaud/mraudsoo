import Link from "next/link";
import Foto from "@/components/Foto";
import Ilmub from "@/components/Ilmub";
import {
  KATTE_VARV,
  Nupp,
  NooleLink,
  Pealkiri,
  Salm,
  Sektsioon,
  Tekst,
} from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { keeleAlternatiivid, keeleks, tee } from "@/sisu/keeled";
import { plokiStiil, tekstiKuju, tumePlokiStiil } from "@/sisu/tekstikujud";

/*
  AVALEHT.

  Kogu tekst tuleb sisupuust (src/sisu/vaikimisi.js või vaikimisiEn.js +
  data/sisu.<keel>.json).
  Taustade kaar: bone → linen → METS (tume) → bone → sage → linen → bone →
  sage, nii et kaks kõrvutist sektsiooni ei ole kunagi sama pinnaga ja lehe
  keskel seisab üks sügav tume hetk (liikumine). Heledaid pindu on kolm —
  vt src/kujundus/vaikimisi.js.
*/

/*
  Pealkirja siin ei ole — avaleht kannab juurpaigutuse oma. Küll on vaja
  hreflang-paari: ilma selleta ei tea otsingumootor, et / ja /en on sama leht
  kahes keeles.
*/
export async function generateMetadata({ params }) {
  const { keel } = await params;
  return { alternates: keeleAlternatiivid(keeleks(keel), "/") };
}

export default async function Avaleht({ params }) {
  const { keel } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisu(kood);
  /* Sisemine aadress õiges keeles: /broneerimine või /en/broneerimine */
  const t = (rada) => tee(kood, rada);
  const {
    hero,
    kutsumus,
    liikumine,
    essents,
    kirjakoht,
    teenusedPlokk,
    minustPlokk,
    kutse,
  } = sisu.avaleht;

  /* Admin-lehelt antud üksikute tekstide kuju */
  const v = plokiStiil(sisu.tekstiKujud, "avaleht");
  /* Liikumine seisab tumedal pinnal — seal käib värv läbi tumeda paranduse */
  const vTume = tumePlokiStiil(sisu.tekstiKujud, "avaleht");
  const s = tekstiKuju(sisu.tekstiKujud, "avaleht");
  const vt = plokiStiil(sisu.tekstiKujud, "teenused");
  const st = tekstiKuju(sisu.tekstiKujud, "teenused");

  return (
    <>
      {/* Hero — usuline alus kohe ja selgelt, foto kirikuakna kaares */}
      <section
        className="overflow-hidden bg-bone"
        data-taust="avaleht.hero"
        style={{ "--kate-varv": KATTE_VARV.bone }}
      >
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 pb-16 pt-10 sm:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24 lg:px-12 lg:pb-24 lg:pt-16">
          <div>
            <p className="sisene silt silt-suur" style={v("hero.silt")}>
              {s("hero.silt", hero.silt)}
            </p>
            <h1
              className="sisene kuva mt-6 text-[clamp(2.85rem,7.6vw,5.7rem)] leading-[0.98] text-ink"
              style={{ "--viive": "90ms", ...v("hero.pealkiri") }}
            >
              {s("hero.pealkiri", hero.pealkiri)}
            </h1>
            <p
              className="sisene kuva mt-5 italic text-[clamp(1.5rem,3vw,2.25rem)] text-gold"
              style={{ "--viive": "180ms", ...v("hero.alapealkiri") }}
            >
              {s("hero.alapealkiri", hero.alapealkiri)}
            </p>

            <div
              className="sisene joon mb-9 mt-10 max-w-28"
              style={{ "--viive": "280ms" }}
            />

            <div className="sisene" style={{ "--viive": "360ms" }}>
              <Tekst suur stiil={v("hero.tekst")} kuju={s.kuju("hero.tekst")}>
                {hero.tekst}
              </Tekst>
            </div>

            <div
              className="sisene mt-10 flex flex-wrap gap-4"
              style={{ "--viive": "460ms" }}
            >
              <Nupp href={t("/broneerimine")} nool>
                {hero.nuppEsmane}
              </Nupp>
              <Nupp href={t("/teenused")} variant="aaris">
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

      {/*
        Kutsumus — miks teenused ei ole eraldi maailmad.

        Kaks veergu: Marta tsitaat jääb laial ekraanil vasakule püsima, tekst ja
        litaania voolavad kõrval. Ühes kitsas tulbas seisid tsitaat, lõigud,
        joon ja litaania kõik eri laiusega ja sektsioon luges laialivalguvana.
      */}
      <Sektsioon taust="linen" taustaVoti="avaleht.kutsumus">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Ilmub>
              <p className="silt" style={v("kutsumus.silt")}>
                {s("kutsumus.silt", kutsumus.silt)}
              </p>
              <blockquote
                className="kuva mt-6 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.3] text-ink"
                style={v("kutsumus.tsitaat")}
              >
                {s("kutsumus.tsitaat", kutsumus.tsitaat)}
              </blockquote>
              <div className="joon mt-10 max-w-28" />
            </Ilmub>
          </div>

          <div className="lg:pt-2">
            <Ilmub ruhm className="space-y-6">
              {kutsumus.loigud.map((loik, jrk) => (
                <Tekst
                  key={loik}
                  stiil={v(`kutsumus.loigud.${jrk}`)}
                  kuju={s.kuju(`kutsumus.loigud.${jrk}`)}
                >
                  {loik}
                </Tekst>
              ))}
            </Ilmub>

            {/*
              Kuidas kutsumus praktikas väljendub — mitte tabel, vaid litaania:
              read voolavad sissejuhatuse jätkuna kuvakirjas, ilma joonteta.
            */}
            <Ilmub className="mt-12">
              <Tekst
                stiil={v("kutsumus.valjendusSissejuhatus")}
                kuju={s.kuju("kutsumus.valjendusSissejuhatus")}
              >
                {kutsumus.valjendusSissejuhatus}
              </Tekst>
            </Ilmub>
            <Ilmub ruhm as="ul" className="mt-8 space-y-5">
              {kutsumus.valjendus.map((punkt, jrk) => (
                <li
                  key={punkt}
                  className="kuva font-normal italic text-[clamp(1.35rem,2.4vw,1.8rem)] leading-[1.35] text-ink"
                  style={v(`kutsumus.valjendus.${jrk}`)}
                >
                  {s(`kutsumus.valjendus.${jrk}`, punkt)}
                </li>
              ))}
            </Ilmub>
          </div>
        </div>
      </Sektsioon>

      {/*
        Liikumine — lehe tume süda. Pealkiri on Marta enda lause (tsitaadina),
        all litaania: iga rida on üks hingetõmme, väike lähtekoht ja suur
        kaldkirjas sihtkoht samal joonel.
      */}
      <Sektsioon taust="mets" taustaVoti="avaleht.liikumine">
        <Ilmub className="text-center">
          <div aria-hidden="true" className="pystjoon pystjoon-tume" />
          <p className="silt silt-tume mt-7" style={vTume("liikumine.silt")}>
            {s("liikumine.silt", liikumine.silt)}
          </p>
          <blockquote
            className="kuva mx-auto mt-6 max-w-3xl text-[clamp(1.85rem,3.7vw,3rem)] text-luu"
            style={vTume("liikumine.pealkiri")}
          >
            {s("liikumine.pealkiri", liikumine.pealkiri)}
          </blockquote>
        </Ilmub>

        {/*
          Rida peab mahtuma ÜHELE reale ka kõige kitsamal telefonil — pikim
          paar on „Killustatusest → tasakaalu”. Seepärast ei murra rida (nowrap)
          ja mõlemad kirjad kahanevad vaates koos: väike ka tähevahet kitsamaks.
        */}
        <Ilmub ruhm as="ul" className="mt-12 sm:mt-16">
          {liikumine.read.map((rida, jrk) => (
            <li
              key={rida.millest}
              className="flex flex-nowrap items-baseline justify-center gap-x-3 py-4 sm:gap-x-7 sm:py-5"
            >
              {/* Lähtekoht on loetav, mitte aimatav — suurem ja heledam kui tavaline silt */}
              <span
                className="mikro whitespace-nowrap text-[clamp(0.8rem,3.2vw,1.25rem)] tracking-[0.12em] text-luu/90 sm:tracking-[0.16em]"
                style={vTume(`liikumine.read.${jrk}.millest`)}
              >
                {s(`liikumine.read.${jrk}.millest`, rida.millest)}
              </span>
              <span
                aria-hidden="true"
                className="text-base text-kuld-hele sm:text-xl"
              >
                →
              </span>
              <span
                className="kuva whitespace-nowrap italic text-[clamp(1.7rem,7vw,3.2rem)] leading-[1.15] text-luu"
                style={vTume(`liikumine.read.${jrk}.milleks`)}
              >
                {s(`liikumine.read.${jrk}.milleks`, rida.milleks)}
              </span>
            </li>
          ))}
        </Ilmub>
      </Sektsioon>

      {/*
        Essents — Marta enda sõnad sellest, mis on inimese unikaalne olemus.
        Pealkiri jääb laial ekraanil vasakule püsima, lõigud voolavad kõrval.
      */}
      <Sektsioon taust="bone" taustaVoti="avaleht.essents">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/*
              Pealkiri algab ise sõnaga „essents” — eraldi silti pole vaja.
              Kaks osa nagu Marta pildil: suur rida ja väiksem alarida.
            */}
            <Ilmub>
              <h2
                className="kuva text-[clamp(2.2rem,4.6vw,3.5rem)] text-ink"
                style={v("essents.pealkiri")}
              >
                {s("essents.pealkiri", essents.pealkiri)}
              </h2>
              {essents.alapealkiri && (
                <p
                  className="kuva mt-3 italic text-[clamp(1.4rem,2.8vw,1.95rem)] leading-[1.3] text-gold-deep"
                  style={v("essents.alapealkiri")}
                >
                  {s("essents.alapealkiri", essents.alapealkiri)}
                </p>
              )}
              <div className="joon mt-10 max-w-28" />
            </Ilmub>
          </div>

          <Ilmub ruhm className="space-y-8 lg:pt-2">
            {essents.loigud.map((loik, jrk) => (
              <p
                key={loik}
                style={v(`essents.loigud.${jrk}`)}
                /* Esimene lõik kannab kogu sektsiooni mõtet — pisut suurem ja tumedam */
                className={
                  jrk === 0
                    ? "max-w-[58ch] text-xl leading-[1.75] text-ink sm:text-[1.4rem]"
                    : "tekst max-w-[60ch] leading-[1.85] text-ink-soft"
                }
              >
                {s(`essents.loigud.${jrk}`, loik)}
              </p>
            ))}

            {/* Marta lause, mis võtab kogu sektsiooni kokku */}
            {essents.tsitaat && (
              <blockquote
                className="kuva max-w-[52ch] pt-4 text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.35] text-gold-deep"
                style={v("essents.tsitaat")}
              >
                {s("essents.tsitaat", essents.tsitaat)}
              </blockquote>
            )}
          </Ilmub>
        </div>
      </Sektsioon>

      {/* Kirjakoht — üks vaikne hetk enne teenuseid */}
      {kirjakoht?.tekst && (
        <Sektsioon
          taust="sage"
          laius="kitsas"
          polsterdus="ohuke"
          taustaVoti="avaleht.kirjakoht"
        >
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
      )}

      {/* Teenused — register */}
      <Sektsioon taust="linen" taustaVoti="avaleht.teenused">
        {/* Pealkiri ütleb „kuus viisi” ise — eraldi silti pole vaja */}
        <Ilmub className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <Pealkiri
            className="max-w-lg"
            suuruseClassName="text-[clamp(1.95rem,3.4vw,3rem)]"
            stiil={v("teenusedPlokk.pealkiri")}
            kuju={s.kuju("teenusedPlokk.pealkiri")}
          >
            {teenusedPlokk.pealkiri}
          </Pealkiri>
          <NooleLink href={t("/teenused")}>{teenusedPlokk.linkTekst}</NooleLink>
        </Ilmub>

        {/*
          Register, mitte tabel: iga teenus on omaette plokk kahes veerus.
          Jooni ei ole — plokke lahutab õhk. Hover puudutab ainult nime,
          mitte tervet rida (reataust luges nagu tabel).
        */}
        <Ilmub
          ruhm
          as="ul"
          className="mt-10 grid gap-x-16 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-24 lg:gap-y-14"
        >
          {sisu.teenused.map((teenus, jrk) => (
            <li key={teenus.slug}>
              <Link
                href={t(`/teenused/${teenus.slug}`)}
                className="group block"
              >
                {/* Värv tuleb muutujana, et hiirekursori kuldne üleminek jääks peale */}
                <h3
                  className="kuva text-[clamp(2.15rem,7vw,2.6rem)] text-[var(--oma-varv,var(--color-ink))] transition-colors duration-300 group-hover:text-gold-deep"
                  style={vt(`${jrk}.kuva.avaleht.nimi`, {
                    varvMuutujaks: true,
                  })}
                >
                  {st(`${jrk}.kuva.avaleht.nimi`, teenus.nimi)}
                </h3>
                {/* Cormorant on väikeses kraadis peenike — kaldkirjas rida vajab suurust, eriti mobiilis */}
                <p
                  className="kuva mt-1 italic text-[clamp(1.45rem,5vw,1.6rem)] text-ink-soft"
                  style={vt(`${jrk}.kuva.avaleht.alapealkiri`)}
                >
                  {st(
                    `${jrk}.kuva.avaleht.alapealkiri`,
                    teenus.alapealkiri,
                  )}
                </p>
                {teenus.luhike && (
                  <p
                    className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink-soft"
                    style={vt(`${jrk}.kuva.avaleht.luhike`)}
                  >
                    {st(`${jrk}.kuva.avaleht.luhike`, teenus.luhike)}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </Ilmub>
      </Sektsioon>

      {/* Minust — eelnev teenuste register on linen, seega see läheb tagasi lehe taustale */}
      <section
        className="overflow-hidden bg-bone"
        data-taust="avaleht.minust"
        style={{ "--kate-varv": KATTE_VARV.bone }}
      >
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
            {/*
              Marta enda lause tervikuna — varem oli see pealkirjaks ja lõiguks
              pooleks murtud. Silti „Minust” siin EI OLE: sama sõna seisab juba
              menüüs ja ploki all lingis, kolmas kordus oli üleliigne.
            */}
            <Ilmub>
              <blockquote
                className="kuva text-[clamp(1.5rem,2.9vw,2.15rem)] leading-[1.32] text-ink"
                style={v("minustPlokk.tsitaat")}
              >
                {s("minustPlokk.tsitaat", minustPlokk.tsitaat)}
              </blockquote>
            </Ilmub>
            <Ilmub ruhm className="mt-8 space-y-6">
              {minustPlokk.loigud.map((loik, jrk) => (
                <Tekst
                  key={loik}
                  stiil={v(`minustPlokk.loigud.${jrk}`)}
                  kuju={s.kuju(`minustPlokk.loigud.${jrk}`)}
                >
                  {loik}
                </Tekst>
              ))}
            </Ilmub>
            <Ilmub viive={200}>
              {/* mt-6, mitte mt-10: link kuulub ülemise teksti juurde ja
                  40 px jättis ta omaette hõljuma */}
              <NooleLink href={t("/minust")} className="mt-6">
                {minustPlokk.linkTekst}
              </NooleLink>
            </Ilmub>
          </div>
        </div>
      </section>

      {/* Kutse — tihedam polsterdus, et vaikne hetk ei mõjuks tühja auguna */}
      <Sektsioon
        taust="sage"
        laius="kitsas"
        polsterdus="ohuke"
        className="text-center"
        taustaVoti="avaleht.kutse"
      >
        <Ilmub>
          <div aria-hidden="true" className="pystjoon" />
          <p className="silt mt-7" style={v("kutse.silt")}>
            {s("kutse.silt", kutse.silt)}
          </p>
          <blockquote
            className="kuva mx-auto mt-7 max-w-2xl text-[clamp(1.8rem,3.7vw,2.9rem)] leading-[1.22] text-ink"
            style={v("kutse.pealkiri")}
          >
            {s("kutse.pealkiri", kutse.pealkiri)}
          </blockquote>
        </Ilmub>
        <Ilmub viive={180} className="mt-12 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine" nool>
            {kutse.nuppEsmane}
          </Nupp>
          <Nupp href={t("/hinnakiri")} variant="aaris">
            {kutse.nuppTeine}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
