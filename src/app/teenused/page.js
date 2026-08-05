import Link from "next/link";
import Ilmub from "@/components/Ilmub";
import { KATTE_VARV, Nupp, Salm, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { plokiStiil, tekstiKuju } from "@/sisu/tekstikujud";

export async function generateMetadata() {
  const sisu = await laeSisu();
  const { hero } = sisu.teenusedLeht;

  return {
    title: hero.silt,
    description: hero.tekst,
  };
}

/* TEENUSED — nummerdatud register, iga rida on uks omaette maailma. */
export default async function Teenused() {
  const sisu = await laeSisu();
  const { hero, tsitaat, tsitaadiSilt, lopp } = sisu.teenusedLeht;
  /* Admin võib teenuste massiivi tervikuna asendada — kindlustame kuju */
  const teenused = Array.isArray(sisu.teenused) ? sisu.teenused : [];

  /* Admin-lehelt antud üksikute tekstide kuju */
  const v = plokiStiil(sisu.tekstiKujud, "teenusedLeht");
  const s = tekstiKuju(sisu.tekstiKujud, "teenusedLeht");
  const vt = plokiStiil(sisu.tekstiKujud, "teenused");
  const st = tekstiKuju(sisu.tekstiKujud, "teenused");

  return (
    <>
      <Sektsioon taust="bone" polsterdus="ohuke" taustaVoti="teenused.hero">
        <div className="max-w-3xl pt-6 sm:pt-10">
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
        </div>
      </Sektsioon>

      <section
        className="bg-linen"
        data-taust="teenused.register"
        style={{ "--kate-varv": KATTE_VARV.linen }}
      >
        <div className="mx-auto max-w-[1400px] px-6 pb-20 sm:pb-28 lg:px-12 lg:pb-36">
          {/*
            Register, mitte tabel: iga teenus on omaette plokk kahes veerus,
            jooni ei ole — plokke lahutab õhk. Sama vorm mis avalehel, ainult
            suurema kirjaga, sest siin on teenused lehe peasisu.
          */}
          <Ilmub
            ruhm
            as="ul"
            className="grid gap-x-20 gap-y-16 pt-16 sm:grid-cols-2 sm:pt-20 lg:gap-x-28 lg:gap-y-20 lg:pt-24"
          >
            {teenused.map((teenus, jrk) => (
              <li key={teenus.slug}>
                <Link href={`/teenused/${teenus.slug}`} className="group block">
                  {/* Värv tuleb muutujana, et hiirekursori kuldne üleminek jääks peale */}
                  <h2
                    className="kuva text-[clamp(2.15rem,7vw,2.6rem)] text-[var(--oma-varv,var(--color-ink))] transition-colors duration-300 group-hover:text-gold-deep"
                    style={vt(`${jrk}.nimi`, { varvMuutujaks: true })}
                  >
                    {st(`${jrk}.nimi`, teenus.nimi)}
                  </h2>
                  {/* Cormorant on väikeses kraadis peenike — kaldkirjas rida vajab suurust, eriti mobiilis */}
                  <p
                    className="kuva mt-1 italic text-[clamp(1.5rem,5.2vw,1.75rem)] text-ink-soft"
                    style={vt(`${jrk}.alapealkiri`)}
                  >
                    {st(`${jrk}.alapealkiri`, teenus.alapealkiri)}
                  </p>
                  {/* „Loe lähemalt” siin ei ole — kogu plokk on juba link, sama mis avalehel */}
                  <p
                    className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft"
                    style={vt(`${jrk}.luhike`)}
                  >
                    {st(`${jrk}.luhike`, teenus.luhike)}
                  </p>
                </Link>
              </li>
            ))}
          </Ilmub>
        </div>
      </section>

      {/* Marta lause, mis kehtib kõigi teenuste kohta — mitte ainult ühe kohta */}
      {tsitaat && (
        <Sektsioon
          taust="sage"
          laius="kitsas"
          polsterdus="ohuke"
          taustaVoti="teenused.tsitaat"
        >
          <Ilmub>
            <Salm
              viide={tsitaadiSilt}
              tekst={tsitaat}
              viiteStiil={v("tsitaadiSilt")}
              stiil={v("tsitaat")}
              viiteKuju={s.kuju("tsitaadiSilt")}
              kuju={s.kuju("tsitaat")}
            />
          </Ilmub>
        </Sektsioon>
      )}

      <Sektsioon
        taust="bone"
        laius="kitsas"
        polsterdus="ohuke"
        className="text-center"
        taustaVoti="teenused.lopp"
      >
        <Ilmub>
          <p
            className="kuva mx-auto max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.28] text-ink"
            style={v("lopp.pealkiri")}
          >
            {s("lopp.pealkiri", lopp.pealkiri)}
          </p>
          <Tekst
            className="mx-auto mt-6 text-center"
            stiil={v("lopp.tekst")}
            kuju={s.kuju("lopp.tekst")}
          >
            {lopp.tekst}
          </Tekst>
        </Ilmub>
        <Ilmub viive={180} className="mt-11 flex flex-wrap justify-center gap-4">
          <Nupp href="/broneerimine" nool>
            {lopp.nuppEsmane}
          </Nupp>
          <Nupp href="/hinnakiri" variant="aaris">
            {lopp.nuppTeine}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
