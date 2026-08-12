import Ilmub from "@/components/Ilmub";
import { KATTE_VARV, Nupp, Salm, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { keeleAlternatiivid, keeleks, tee } from "@/sisu/keeled";
import { plokiStiil, tekstiKuju, tumePlokiStiil } from "@/sisu/tekstikujud";

/*
  Pealkiri ja kirjeldus tulevad sisupuust, seepärast generateMetadata, mitte
  staatiline metadata. Pealkirjal on varuväärtus — silt võib olla tühjaks
  jäetud.
*/
export async function generateMetadata({ params }) {
  const { keel } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisu(kood);
  const { hero } = sisu.hinnakiriLeht;

  return {
    title: hero.silt || hero.pealkiri,
    description: hero.tekst,
    alternates: keeleAlternatiivid(kood, "/hinnakiri"),
  };
}

export default async function Hinnakiri({ params }) {
  const { keel } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisu(kood);
  const t = (rada) => tee(kood, rada);
  const { hinnakiriLeht, hinnakiri, teekond } = sisu;

  /* Admin-lehelt antud üksikute tekstide kuju */
  const v = plokiStiil(sisu.tekstiKujud, "hinnakiriLeht");
  const s = tekstiKuju(sisu.tekstiKujud, "hinnakiriLeht");
  const vr = plokiStiil(sisu.tekstiKujud, "hinnakiri");
  const sr = tekstiKuju(sisu.tekstiKujud, "hinnakiri");
  /*
    Stiiliteekond on lehe tume sektsioon: nii tema oma tekstid kui ka kaks
    „hinnakiriLeht” silti seisavad seal sügavrohelisel, seega värv käib läbi
    tumeda paranduse (vt tumedaPinnaVarv).
  */
  const vTume = tumePlokiStiil(sisu.tekstiKujud, "hinnakiriLeht");
  const vte = tumePlokiStiil(sisu.tekstiKujud, "teekond");
  const ste = tekstiKuju(sisu.tekstiKujud, "teekond");

  return (
    <>
      <Sektsioon taust="bone" polsterdus="ohuke" taustaVoti="hinnakiri.hero">
        <div className="max-w-3xl pt-6 sm:pt-10">
          <p className="sisene silt silt-suur" style={v("hero.silt")}>
            {s("hero.silt", hinnakiriLeht.hero.silt)}
          </p>
          <h1
            className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-ink"
            style={{ "--viive": "90ms", ...v("hero.pealkiri") }}
          >
            {s("hero.pealkiri", hinnakiriLeht.hero.pealkiri)}
          </h1>
          <div
            className="sisene joon mb-9 mt-9 max-w-28"
            style={{ "--viive": "200ms" }}
          />
          <div className="sisene" style={{ "--viive": "300ms" }}>
            <Tekst suur stiil={v("hero.tekst")} kuju={s.kuju("hero.tekst")}>
              {hinnakiriLeht.hero.tekst}
            </Tekst>
          </div>
        </div>
      </Sektsioon>

      {/* Üksikteenused */}
      <section
        className="bg-linen"
        data-taust="hinnakiri.uksikteenused"
        style={{ "--kate-varv": KATTE_VARV.linen }}
      >
        <div className="mx-auto max-w-[1400px] px-6 pb-20 sm:pb-28 lg:px-12 lg:pb-36">
          <Ilmub className="pt-16 sm:pt-20 lg:pt-24">
            <p className="silt" style={v("uksikudSilt")}>
              {s("uksikudSilt", hinnakiriLeht.uksikudSilt)}
            </p>
          </Ilmub>

          {/*
            Hinnaveerg on kindla laiusega, mitte „auto”. Iga rida on oma grid,
            nii et auto-veerg oleks igal real eri laiusega ja hinnad ei seisaks
            enam ühel joonel. 1:1 teekonna kestus („Üks kuu, kord nädalas”) on
            teistest kordades pikem — kindel laius hoiab kuue rea rütmi paigas.
          */}
          <Ilmub ruhm as="ul" className="mt-10">
            {hinnakiri.map((rida, jrk) => (
              <li
                key={rida.nimi}
                className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-gold/25 py-8 sm:grid-cols-[1fr_13rem] sm:py-10 lg:grid-cols-[1fr_16rem]"
              >
                <div>
                  <h2
                    className="kuva text-[clamp(1.45rem,2.8vw,2rem)] text-ink"
                    style={vr(`${jrk}.nimi`)}
                  >
                    {sr(`${jrk}.nimi`, rida.nimi)}
                  </h2>
                  <p
                    className="mt-2 max-w-[52ch] text-lg leading-relaxed text-ink-soft"
                    style={vr(`${jrk}.kirjeldus`)}
                  >
                    {sr(`${jrk}.kirjeldus`, rida.kirjeldus)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p
                    className="kuva text-[clamp(1.4rem,2.5vw,1.9rem)] text-gold-deep"
                    style={vr(`${jrk}.hind`)}
                  >
                    {sr(`${jrk}.hind`, rida.hind)}
                  </p>
                  <p className="mikro mt-1 text-ink-faint" style={vr(`${jrk}.kestus`)}>
                    {sr(`${jrk}.kestus`, rida.kestus)}
                  </p>
                </div>
              </li>
            ))}
          </Ilmub>
          <div className="joon" />
        </div>
      </section>

      {/* Stiiliteekond — kolm sammu koos, lehe tume esiletõst */}
      <Sektsioon taust="mets" taustaVoti="hinnakiri.teekond">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <Ilmub>
            <p className="silt silt-tume" style={vTume("teekondSilt")}>
              {s("teekondSilt", hinnakiriLeht.teekondSilt)}
            </p>
            <h2
              className="kuva mt-6 text-[clamp(2.1rem,4.2vw,3.3rem)] text-luu"
              style={vte("nimi")}
            >
              {ste("nimi", teekond.nimi)}
            </h2>
            <p
              className="mt-7 max-w-[55ch] text-lg leading-[1.8] text-luu/90"
              style={vte("kirjeldus")}
            >
              {ste("kirjeldus", teekond.kirjeldus)}
            </p>
            <p className="mt-9 flex flex-wrap items-baseline gap-4">
              <span
                className="kuva text-[clamp(1.8rem,3.4vw,2.6rem)] text-kuld-hele"
                style={vte("hind")}
              >
                {ste("hind", teekond.hind)}
              </span>
              <span className="text-lg text-luu/60 line-through">
                {teekond.vordlus}
              </span>
            </p>
          </Ilmub>

          <Ilmub viive={150}>
            <p className="silt silt-tume" style={vTume("sisaldabSilt")}>
              {s("sisaldabSilt", hinnakiriLeht.sisaldabSilt)}
            </p>
            {/* Litaania, mitte tabel: kuvakirjas read ilma joonteta */}
            <ul className="mt-8 space-y-5">
              {teekond.sisaldab.map((punkt, jrk) => (
                <li
                  key={punkt}
                  className="kuva italic text-[clamp(1.2rem,2vw,1.5rem)] leading-[1.4] text-luu"
                  style={vte(`sisaldab.${jrk}`)}
                >
                  {ste(`sisaldab.${jrk}`, punkt)}
                </li>
              ))}
            </ul>
          </Ilmub>
        </div>
      </Sektsioon>

      {/* Marta lause väärtusest — hind ei ole see, mis inimese väärtuse määrab */}
      {hinnakiriLeht.tsitaat && (
        <Sektsioon
          taust="sage"
          laius="kitsas"
          polsterdus="ohuke"
          taustaVoti="hinnakiri.tsitaat"
        >
          <Ilmub>
            <Salm
              viide={hinnakiriLeht.tsitaadiSilt}
              tekst={hinnakiriLeht.tsitaat}
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
        taustaVoti="hinnakiri.lopp"
      >
        <Ilmub>
          <div aria-hidden="true" className="pystjoon" />
          <p
            className="kuva mx-auto mt-8 max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.28] text-ink"
            style={v("lopp.pealkiri")}
          >
            {s("lopp.pealkiri", hinnakiriLeht.lopp.pealkiri)}
          </p>
          <Tekst
            className="mx-auto mt-6 text-center"
            stiil={v("lopp.tekst")}
            kuju={s.kuju("lopp.tekst")}
          >
            {hinnakiriLeht.lopp.tekst}
          </Tekst>
        </Ilmub>
        <Ilmub viive={180} className="mt-11">
          <Nupp href={t("/broneerimine")} nool>
            {hinnakiriLeht.lopp.nuppTekst}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
