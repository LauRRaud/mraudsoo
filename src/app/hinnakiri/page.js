import Ilmub from "@/components/Ilmub";
import { Nupp, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";

/* Pealkiri ja kirjeldus tulevad sisupuust, seepärast generateMetadata, mitte staatiline metadata */
export async function generateMetadata() {
  const sisu = await laeSisu();

  return {
    title: sisu.hinnakiriLeht.hero.silt,
    description: sisu.hinnakiriLeht.hero.tekst,
  };
}

export default async function Hinnakiri() {
  const sisu = await laeSisu();
  const { hinnakiriLeht, hinnakiri, teekond } = sisu;

  return (
    <>
      <Sektsioon taust="bone" polsterdus="ohuke">
        <div className="max-w-3xl pt-6 sm:pt-10">
          <p className="sisene silt">{hinnakiriLeht.hero.silt}</p>
          <h1
            className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-ink"
            style={{ "--viive": "90ms" }}
          >
            {hinnakiriLeht.hero.pealkiri}
          </h1>
          <div
            className="sisene joon mb-9 mt-9 max-w-28"
            style={{ "--viive": "200ms" }}
          />
          <div className="sisene" style={{ "--viive": "300ms" }}>
            <Tekst suur>{hinnakiriLeht.hero.tekst}</Tekst>
          </div>
        </div>
      </Sektsioon>

      {/* Üksikteenused */}
      <section className="bg-linen">
        <div className="mx-auto max-w-[1400px] px-6 pb-20 sm:pb-28 lg:px-12 lg:pb-36">
          <Ilmub className="pt-16 sm:pt-20 lg:pt-24">
            <p className="silt">{hinnakiriLeht.uksikudSilt}</p>
          </Ilmub>

          {/*
            Hinnaveerg on kindla laiusega, mitte „auto”. Iga rida on oma grid,
            nii et auto-veerg oleks igal real eri laiusega ja hinnad ei seisaks
            enam ühel joonel. 1:1 teekonna kestus („Üks kuu, kord nädalas”) on
            teistest kordades pikem — kindel laius hoiab kuue rea rütmi paigas.
          */}
          <Ilmub ruhm as="ul" className="mt-10">
            {hinnakiri.map((rida) => (
              <li
                key={rida.nimi}
                className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-gold/25 py-8 sm:grid-cols-[1fr_13rem] sm:py-10 lg:grid-cols-[1fr_16rem]"
              >
                <div>
                  <h2 className="kuva text-[clamp(1.45rem,2.8vw,2rem)] text-ink">
                    {rida.nimi}
                  </h2>
                  <p className="mt-2 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
                    {rida.kirjeldus}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="kuva text-[clamp(1.4rem,2.5vw,1.9rem)] text-gold-deep">
                    {rida.hind}
                  </p>
                  <p className="mikro mt-1 text-ink-faint">{rida.kestus}</p>
                </div>
              </li>
            ))}
          </Ilmub>
          <div className="joon" />
        </div>
      </section>

      {/* Stiiliteekond — kolm sammu koos, lehe tume esiletõst */}
      <Sektsioon taust="mets">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <Ilmub>
            <p className="silt silt-tume">{hinnakiriLeht.teekondSilt}</p>
            <h2 className="kuva mt-6 text-[clamp(2.1rem,4.2vw,3.3rem)] text-luu">
              {teekond.nimi}
            </h2>
            <p className="mt-7 max-w-[55ch] text-lg leading-[1.8] text-luu/90">
              {teekond.kirjeldus}
            </p>
            <p className="mt-9 flex flex-wrap items-baseline gap-4">
              <span className="kuva text-[clamp(1.8rem,3.4vw,2.6rem)] text-kuld-hele">
                {teekond.hind}
              </span>
              <span className="text-lg text-luu/60 line-through">
                {teekond.vordlus}
              </span>
            </p>
          </Ilmub>

          <Ilmub viive={150}>
            <p className="silt silt-tume">{hinnakiriLeht.sisaldabSilt}</p>
            <ul className="mt-6">
              {teekond.sisaldab.map((punkt) => (
                <li
                  key={punkt}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-kuld-hele/25 py-5 last:border-b"
                >
                  <span aria-hidden="true" className="text-kuld-hele">
                    —
                  </span>
                  <span className="text-lg leading-relaxed text-luu">
                    {punkt}
                  </span>
                </li>
              ))}
            </ul>
          </Ilmub>
        </div>
      </Sektsioon>

      <Sektsioon taust="bone" laius="kitsas" polsterdus="ohuke" className="text-center">
        <Ilmub>
          <div aria-hidden="true" className="pystjoon" />
          <p className="kuva mx-auto mt-8 max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.28] text-ink">
            {hinnakiriLeht.lopp.pealkiri}
          </p>
          <Tekst className="mx-auto mt-6 text-center">
            {hinnakiriLeht.lopp.tekst}
          </Tekst>
        </Ilmub>
        <Ilmub viive={180} className="mt-11">
          <Nupp href="/broneerimine" nool>
            {hinnakiriLeht.lopp.nuppTekst}
          </Nupp>
        </Ilmub>
      </Sektsioon>
    </>
  );
}
