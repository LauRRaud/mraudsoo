import { Nupp, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
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
      <Sektsioon taust="bone">
        <div className="max-w-3xl">
          <Pealkiri silt={hinnakiriLeht.hero.silt} tase="h1">
            {hinnakiriLeht.hero.pealkiri}
          </Pealkiri>
          <div className="joon my-10 max-w-24" />
          <Tekst suur>{hinnakiriLeht.hero.tekst}</Tekst>
        </div>
      </Sektsioon>

      {/* Üksikteenused */}
      <section className="bg-linen">
        <div className="mx-auto max-w-[1360px] px-6 pb-20 sm:pb-24 lg:px-10 lg:pb-32">
          <div className="pt-20 sm:pt-24 lg:pt-32">
            <p className="silt">{hinnakiriLeht.uksikudSilt}</p>
          </div>

          {/*
            Hinnaveerg on kindla laiusega, mitte „auto”. Iga rida on oma grid,
            nii et auto-veerg oleks igal real eri laiusega ja hinnad ei seisaks
            enam ühel joonel. 1:1 teekonna kestus („Üks kuu, kord nädalas”) on
            teistest kordades pikem — kindel laius hoiab kuue rea rütmi paigas.
            16rem on selle kestuse loomulik laius ühel real; kitsamal ekraanil
            jääb veerg 13rem peale ja kestus murdub kahele reale, et kirjeldus
            ei jääks liiga kitsaks.
          */}
          <ul className="mt-12">
            {hinnakiri.map((rida) => (
              <li
                key={rida.nimi}
                className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-gold/25 py-8 sm:grid-cols-[1fr_13rem] sm:py-10 lg:grid-cols-[1fr_16rem]"
              >
                <div>
                  <h2 className="kuva text-[clamp(1.4rem,2.8vw,2rem)] text-ink">
                    {rida.nimi}
                  </h2>
                  <p className="mt-2 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
                    {rida.kirjeldus}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="kuva text-[clamp(1.3rem,2.5vw,1.75rem)] text-gold-deep">
                    {rida.hind}
                  </p>
                  <p className="mt-1 mikro text-ink-faint">
                    {rida.kestus}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="joon" />
        </div>
      </section>

      {/* Kuuajaline teekond */}
      <Sektsioon taust="clay">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="silt !text-ink/70">{hinnakiriLeht.teekondSilt}</p>
            <h2 className="kuva mt-6 text-[clamp(1.9rem,4vw,3.1rem)] text-ink">
              {teekond.nimi}
            </h2>
            <p className="mt-7 max-w-[55ch] text-lg leading-[1.75] text-ink/85">
              {teekond.kirjeldus}
            </p>
            <p className="mt-8 flex flex-wrap items-baseline gap-3">
              <span className="kuva text-[clamp(1.6rem,3vw,2.25rem)] text-ink">
                {teekond.hind}
              </span>
              <span className="text-lg text-ink/55 line-through">
                {teekond.vordlus}
              </span>
            </p>
          </div>

          <div>
            <p className="silt !text-ink/70">{hinnakiriLeht.sisaldabSilt}</p>
            <ul className="mt-6">
              {teekond.sisaldab.map((punkt) => (
                <li
                  key={punkt}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-5 border-t border-ink/15 py-5 last:border-b"
                >
                  <span aria-hidden="true" className="text-ink/40">
                    —
                  </span>
                  <span className="text-lg leading-relaxed text-ink/75">
                    {punkt}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sektsioon>

      <Sektsioon taust="bone" laius="kitsas" className="text-center">
        <p className="kuva mx-auto max-w-2xl text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.3] text-ink">
          {hinnakiriLeht.lopp.pealkiri}
        </p>
        <Tekst className="mx-auto mt-6 text-center">
          {hinnakiriLeht.lopp.tekst}
        </Tekst>
        <div className="mt-11">
          <Nupp href="/broneerimine">{hinnakiriLeht.lopp.nuppTekst}</Nupp>
        </div>
      </Sektsioon>
    </>
  );
}
