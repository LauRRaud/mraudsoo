"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navi } from "@/sisu/sait";

export default function Pais() {
  const [avatud, setAvatud] = useState(false);
  const [peidus, setPeidus] = useState(false);
  const tee = usePathname();

  // Sulge mobiilimenüü lehe vahetumisel
  useEffect(() => {
    setAvatud(false);
  }, [tee]);

  /*
    Päis peitub alla kerides ja tuleb kohe tagasi üles kerides.
    Väike lävi hoiab ära värisemise, kui keritakse edasi-tagasi.
  */
  useEffect(() => {
    let eelmineY = window.scrollY;

    function keridesse() {
      const y = window.scrollY;
      const vahe = y - eelmineY;

      // Lehe ülaosas on päis alati nähtav
      if (y < 80) {
        setPeidus(false);
      } else if (vahe > 6) {
        setPeidus(true);
      } else if (vahe < -6) {
        setPeidus(false);
      }

      eelmineY = y;
    }

    window.addEventListener("scroll", keridesse, { passive: true });
    return () => window.removeEventListener("scroll", keridesse);
  }, []);

  // Avatud mobiilimenüüga ei tohi päis ära peituda
  const varjatud = peidus && !avatud;

  // Kui menüü on avatud, ei tohi taust kerida
  useEffect(() => {
    document.body.style.overflow = avatud ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [avatud]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gold/20 bg-bone/95 backdrop-blur-sm transition-transform duration-300 ${
        varjatud ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="kuva text-2xl text-ink transition-colors hover:text-gold-deep sm:text-3xl"
        >
          Marta Raudsoo
        </Link>

        {/* Töölaua navigatsioon */}
        <nav className="hidden lg:block" aria-label="Peamenüü">
          <ul className="flex items-center gap-8">
            {navi.map((punkt) => {
              const aktiivne =
                tee === punkt.tee || tee.startsWith(`${punkt.tee}/`);
              return (
                <li key={punkt.tee}>
                  <Link
                    href={punkt.tee}
                    aria-current={aktiivne ? "page" : undefined}
                    className={`mikro tracking-[0.12em] transition-colors hover:text-gold-deep ${
                      aktiivne ? "text-gold-deep" : "text-ink-soft"
                    }`}
                  >
                    {punkt.nimi}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobiilinupp */}
        <button
          type="button"
          onClick={() => setAvatud((v) => !v)}
          aria-expanded={avatud}
          aria-controls="mobiilimenyy"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span className="sr-only">{avatud ? "Sulge menüü" : "Ava menüü"}</span>
          <span
            aria-hidden="true"
            className={`h-px w-6 bg-ink transition-transform duration-300 ${
              avatud ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-px w-6 bg-ink transition-opacity duration-300 ${
              avatud ? "opacity-0" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-px w-6 bg-ink transition-transform duration-300 ${
              avatud ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobiilimenüü */}
      {avatud && (
        <nav
          id="mobiilimenyy"
          aria-label="Peamenüü"
          className="border-t border-gold/20 bg-bone lg:hidden"
        >
          <ul className="mx-auto max-w-[1360px] px-6 py-4">
            {navi.map((punkt) => (
              <li key={punkt.tee} className="border-b border-gold/10 last:border-0">
                <Link
                  href={punkt.tee}
                  className="kuva block py-4 text-2xl text-ink transition-colors hover:text-gold-deep"
                >
                  {punkt.nimi}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
