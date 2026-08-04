import Link from "next/link";

/*
  Jalus on serverikomponent, aga ei loe sisu ise — kõik tuleb propsidena
  juurpaigutusest (src/app/layout.js), et allikas oleks üks.

  Jalus on lehe kõige tumedam pind (metsSyva) — iga leht lõpeb sama
  vaikse, sügava akordiga.
*/
export default function Jalus({
  navi = [],
  kontakt = {},
  saidiNimi = "Marta Raudsoo",
  tutvustus = "",
  tunnuslause = "",
}) {
  /* Täisheledad lingid — jalus peab olema loetav, mitte vaid aimatav */
  const link =
    "text-lg text-luu transition-colors duration-300 hover:text-kuld-hele";

  /* Kanalite nimed on kanalite nimed, mitte muudetav sisu */
  const kanalid = [
    { nimi: "Instagram", aadress: kontakt.instagram },
    { nimi: "Facebook", aadress: kontakt.facebook },
    { nimi: "Substack", aadress: kontakt.substack },
  ].filter((kanal) => kanal.aadress);

  return (
    <footer className="mt-auto bg-mets-syva">
      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-20 lg:px-12 lg:pb-12 lg:pt-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-20">
          <div>
            {/* Suures kirjas kahaneb tähevahe — laotus muutuks muidu hõredaks */}
            <p className="nimi text-[clamp(2.1rem,4vw,3.3rem)] leading-[1.2] tracking-[0.02em] text-luu">
              {saidiNimi}
            </p>
            <p className="mt-6 max-w-sm text-lg leading-[1.85] text-luu/85">
              {tutvustus}
            </p>
          </div>

          {/* Menüü ei vaja silti — lingid kõnelevad ise */}
          <nav aria-label="Jaluse menüü" className="md:pt-3">
            <ul className="space-y-4">
              {navi.map((punkt) => (
                <li key={punkt.tee}>
                  <Link href={punkt.tee} className={`alajoon ${link}`}>
                    {punkt.nimi}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:pt-3">
            <p className="silt silt-tume">Kontakt</p>
            <ul className="mt-6 space-y-4">
              {kontakt.email && (
                <li>
                  <a href={`mailto:${kontakt.email}`} className={`alajoon ${link}`}>
                    {kontakt.email}
                  </a>
                </li>
              )}
              {kanalid.map((kanal) => (
                <li key={kanal.nimi}>
                  <a
                    href={kanal.aadress}
                    target="_blank"
                    rel="noreferrer"
                    className={`alajoon ${link}`}
                  >
                    {kanal.nimi}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="joon-tume mt-16" />
        <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
          <p className="text-[0.9375rem] text-luu/75">
            © {new Date().getFullYear()} {saidiNimi}
          </p>
          {tunnuslause && (
            <p className="text-[0.9375rem] text-luu/75">{tunnuslause}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
