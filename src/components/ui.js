import Link from "next/link";

/* Sektsiooni ümbris — ühtne laius ja vertikaalne rütm kogu lehel */
export function Sektsioon({ children, taust = "bone", laius = "lai", className = "" }) {
  const taustad = {
    bone: "bg-bone",
    linen: "bg-linen",
    shell: "bg-shell",
    clay: "bg-clay",
    sage: "bg-sage",
  };
  const laiused = {
    lai: "max-w-[1360px]",
    kitsas: "max-w-4xl",
  };

  return (
    <section className={`${taustad[taust]} ${className}`}>
      <div
        className={`mx-auto ${laiused[laius]} px-6 py-16 sm:py-20 lg:px-10 lg:py-24`}
      >
        {children}
      </div>
    </section>
  );
}

/* Sektsiooni pealkirjaplokk: väike silt + suur kuvakiri */
export function Pealkiri({ silt, children, tase: Tase = "h2", className = "" }) {
  return (
    <div className={className}>
      {silt && <p className="silt">{silt}</p>}
      {/*
        Alamlehtede h1 on terve lause, mitte paar sõna — 80px lükkas
        ülejäänud sisu ekraanilt välja. 54px on endiselt tugev, aga mahub.
      */}
      <Tase
        className={`kuva text-ink ${
          Tase === "h1"
            ? "text-[clamp(2.1rem,4.2vw,3.375rem)]"
            : "text-[clamp(1.8rem,3.4vw,2.75rem)]"
        } ${silt ? "mt-4" : ""}`}
      >
        {children}
      </Tase>
    </div>
  );
}

/* Peamine tegevusnupp */
export function Nupp({ href, children, variant = "taidetud", className = "" }) {
  /* Roheline täidis valge tekstiga — kontrast 7.3:1 */
  const stiilid = {
    taidetud:
      "border border-rohe bg-rohe text-white hover:border-rohe-hele hover:bg-rohe-hele",
    aaris:
      "border border-rohe text-rohe hover:bg-rohe hover:text-white",
  };

  return (
    <Link
      href={href}
      className={`inline-block px-9 py-4 mikro transition-colors duration-300 ${stiilid[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* Tekstilink noolega — kasutame kaartide ja teenuste juures */
export function NooleLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 mikro text-gold-deep transition-colors hover:text-ink ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

/* Pikem tekstiplokk — loetav rea pikkus ja hingav reavahe */
export function Tekst({ children, suur = false, className = "" }) {
  return (
    <p
      /* .tekst / .tekst-suur loevad suuruse CSS-muutujast, mille admin saab muuta */
      className={`max-w-[60ch] ${
        suur ? "tekst-suur" : "tekst"
      } leading-[1.75] text-ink-soft ${className}`}
    >
      {children}
    </p>
  );
}
