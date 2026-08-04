import Link from "next/link";

/*
  Sektsiooni ümbris — ühtne laius ja vertikaalne rütm kogu lehel.

  Tumedad taustad (mets, metsSyva) on osa kujunduskeelest: lehe kõige
  isiklikumad hetked seisavad sügavrohelisel. Tekstivärvid EI vahetu siin
  automaatselt — iga leht annab oma komponentidele `tume` propsi, nii on
  värvivalik alati koodist näha.
*/
export function Sektsioon({
  children,
  taust = "bone",
  laius = "lai",
  polsterdus = "tavaline",
  className = "",
  id,
}) {
  const taustad = {
    bone: "bg-bone",
    linen: "bg-linen",
    shell: "bg-shell",
    clay: "bg-clay",
    sage: "bg-sage",
    mets: "bg-mets",
    metsSyva: "bg-mets-syva",
  };
  const laiused = {
    lai: "max-w-[1400px]",
    kitsas: "max-w-4xl",
  };
  const polsterdused = {
    tavaline: "py-20 sm:py-28 lg:py-36",
    ohuke: "py-14 sm:py-16 lg:py-24",
    suur: "py-24 sm:py-32 lg:py-44",
  };

  return (
    <section id={id} className={`${taustad[taust]} ${className}`}>
      <div
        className={`mx-auto ${laiused[laius]} px-6 ${polsterdused[polsterdus]} lg:px-12`}
      >
        {children}
      </div>
    </section>
  );
}

/* Sektsiooni pealkirjaplokk: väike silt + suur kuvakiri */
export function Pealkiri({
  silt,
  children,
  tase: Tase = "h2",
  tume = false,
  className = "",
}) {
  return (
    <div className={className}>
      {silt && <p className={`silt${tume ? " silt-tume" : ""}`}>{silt}</p>}
      <Tase
        className={`kuva ${tume ? "text-luu" : "text-ink"} ${
          Tase === "h1"
            ? "text-[clamp(2.5rem,5.5vw,4.25rem)]"
            : "text-[clamp(2.1rem,4vw,3.4rem)]"
        } ${silt ? "mt-5" : ""}`}
      >
        {children}
      </Tase>
    </div>
  );
}

/*
  Nupp — arhitektuurne, aeglase täitumisega (vt globals.css „NUPP”).
  href-iga on link, ilma on päris <button> (nt vormi saatmiseks).
  Tumedal taustal: variant „hele” või „heleAaris”.
*/
export function Nupp({
  href,
  children,
  variant = "taidetud",
  nool = false,
  className = "",
  ...muu
}) {
  const variandid = {
    taidetud: "nupp-taidetud",
    aaris: "nupp-aaris",
    hele: "nupp-hele",
    heleAaris: "nupp-hele-aaris",
  };
  const klassid = `nupp ${variandid[variant]} mikro ${className}`;
  const sisu = (
    <>
      <span>{children}</span>
      {nool && (
        <span aria-hidden="true" className="nool">
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={klassid} {...muu}>
        {sisu}
      </Link>
    );
  }

  return (
    <button className={klassid} {...muu}>
      {sisu}
    </button>
  );
}

/* Tekstilink noolega — kasutame loendite ja edasiviidete juures */
export function NooleLink({ href, children, tume = false, className = "" }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 mikro transition-colors duration-300 ${
        tume
          ? "text-kuld-hele hover:text-luu"
          : "text-gold-deep hover:text-ink"
      } ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
      >
        →
      </span>
    </Link>
  );
}

/* Pikem tekstiplokk — loetav rea pikkus ja hingav reavahe */
export function Tekst({ children, suur = false, tume = false, className = "" }) {
  return (
    <p
      /* .tekst / .tekst-suur loevad suuruse CSS-muutujast, mille admin saab muuta */
      className={`max-w-[60ch] ${suur ? "tekst-suur" : "tekst"} leading-[1.85] ${
        tume ? "text-luu/90" : "text-ink-soft"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/*
  Salm — kirjakoht oma vaikse hetkena: püstjoon, viide sildina,
  salm kuvakirjas, Marta selgitus all. Kasutusel lehel „Minust” ja
  teenuselehtede plokkides.
*/
export function Salm({ viide, tekst, selgitus = [], tume = false, className = "" }) {
  const selgitused = (Array.isArray(selgitus) ? selgitus : [selgitus]).filter(
    Boolean
  );
  const pikk = typeof tekst === "string" && tekst.length > 120;

  return (
    <figure className={`text-center ${className}`}>
      <div aria-hidden="true" className={`pystjoon${tume ? " pystjoon-tume" : ""}`} />
      {viide && (
        <figcaption className={`silt mt-7${tume ? " silt-tume" : ""}`}>
          {viide}
        </figcaption>
      )}
      <blockquote
        className={`kuva mx-auto max-w-2xl leading-[1.3] ${viide ? "mt-6" : "mt-8"} ${
          tume ? "text-luu" : "text-ink"
        } ${
          pikk
            ? "text-[clamp(1.3rem,2.6vw,1.75rem)]"
            : "text-[clamp(1.55rem,3.4vw,2.3rem)]"
        }`}
      >
        {tekst}
      </blockquote>

      {selgitused.length > 0 && (
        <div className="mx-auto mt-8 max-w-[54ch] space-y-4">
          {selgitused.map((loik) => (
            <p
              key={loik}
              className={`text-lg leading-[1.8] ${
                tume ? "text-luu/85" : "text-ink-soft"
              }`}
            >
              {loik}
            </p>
          ))}
        </div>
      )}
    </figure>
  );
}
