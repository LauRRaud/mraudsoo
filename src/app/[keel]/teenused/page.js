import Link from "next/link";
import Ilmub from "@/components/Ilmub";
import { KATTE_VARV, Nupp, Salm, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { keeleAlternatiivid, keeleks, tee } from "@/sisu/keeled";
import { plokiStiil, tekstiKuju } from "@/sisu/tekstikujud";

/* Pealkirja varuväärtus: silt võib olla admin-lehel tühjaks jäetud */
export async function generateMetadata({ params }) {
  const { keel } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisu(kood);
  const { hero } = sisu.teenusedLeht;

  return {
    title: hero.silt || hero.pealkiri,
    description: hero.tekst,
    alternates: keeleAlternatiivid(kood, "/teenused"),
  };
}

/* TEENUSED — nummerdatud register, iga rida on uks omaette maailma. */
export default async function Teenused({ params }) {
  const { keel } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisu(kood);
  const t = (rada) => tee(kood, rada);
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
          <p className="sisene silt silt-suur" style={v("hero.silt")}>
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
        <div className="mx-auto max-w-[1400px] px-6 pb-16 sm:pb-20 lg:px-12 lg:pb-24">
          {/*
            Register, mitte tabel: iga teenus on omaette plokk kahes veerus,
            jooni ei ole — plokke lahutab õhk. Sama vorm mis avalehel, ainult
            suurema kirjaga, sest siin on teenused lehe peasisu.
          */}
          <Ilmub
            ruhm
            as="ul"
            className="grid gap-x-16 gap-y-10 pt-12 sm:grid-cols-2 sm:gap-y-12 sm:pt-14 lg:gap-x-24 lg:gap-y-14 lg:pt-16"
          >
            {teenused.map((teenus, jrk) => (
              <li key={teenus.slug}>
                <Link
                  href={t(`/teenused/${teenus.slug}`)}
                  className="group block"
                >
                  {/* Värv tuleb muutujana, et hiirekursori kuldne üleminek jääks peale */}
                  <h2
                    className="kuva text-[clamp(1.75rem,6vw,2.6rem)] text-[var(--oma-varv,var(--color-ink))] transition-colors duration-300 group-hover:text-gold-deep"
                    style={vt(`${jrk}.kuva.teenusteLeht.nimi`, {
                      varvMuutujaks: true,
                    })}
                  >
                    {st(`${jrk}.kuva.teenusteLeht.nimi`, teenus.nimi)}
                  </h2>
                  {/* Cormorant on väikeses kraadis peenike — kaldkirjas rida vajab suurust, eriti mobiilis */}
                  <p
                    className="kuva mt-1 italic text-[clamp(1.5rem,5.2vw,1.75rem)] text-ink-soft"
                    style={vt(`${jrk}.kuva.teenusteLeht.alapealkiri`)}
                  >
                    {st(
                      `${jrk}.kuva.teenusteLeht.alapealkiri`,
                      teenus.alapealkiri,
                    )}
                  </p>
                  {/* „Loe lähemalt” siin ei ole — kogu plokk on juba link, sama mis avalehel */}
                  {teenus.luhike && (
                    <p
                      className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft"
                      style={vt(`${jrk}.kuva.teenusteLeht.luhike`)}
                    >
                      {st(`${jrk}.kuva.teenusteLeht.luhike`, teenus.luhike)}
                    </p>
                  )}
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
          <Nupp href={t("/broneerimine")} nool>
            {lopp.nuppEsmane}
          </Nupp>
          <Nupp href={t("/hinnakiri")} variant="aaris">
            {lopp.nuppTeine}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
