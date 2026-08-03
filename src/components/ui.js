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
    lai: "max-w-6xl",
    kitsas: "max-w-3xl",
  };

  return (
    <section className={`${taustad[taust]} ${className}`}>
      <div
        className={`mx-auto ${laiused[laius]} px-6 py-20 sm:py-24 lg:px-10 lg:py-32`}
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
      <Tase
        className={`kuva text-ink ${
          Tase === "h1"
            ? "text-[clamp(2.5rem,6.5vw,5rem)]"
            : "text-[clamp(1.9rem,4vw,3.1rem)]"
        } ${silt ? "mt-5" : ""}`}
      >
        {children}
      </Tase>
    </div>
  );
}

/* Peamine tegevusnupp */
export function Nupp({ href, children, variant = "taidetud", className = "" }) {
  const stiilid = {
    taidetud:
      "bg-ink text-bone hover:bg-gold-deep border border-transparent",
    aaris:
      "border border-gold-deep/50 text-gold-deep hover:border-gold-deep hover:bg-gold-deep hover:text-bone",
  };

  return (
    <Link
      href={href}
      className={`inline-block px-9 py-4 text-[0.7rem] uppercase tracking-[0.22em] transition-colors duration-300 ${stiilid[variant]} ${className}`}
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
      className={`group inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-gold-deep transition-colors hover:text-ink ${className}`}
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
      className={`max-w-[62ch] ${
        suur ? "text-lg sm:text-xl" : "text-base"
      } leading-[1.9] text-ink-soft ${className}`}
    >
      {children}
    </p>
  );
}
