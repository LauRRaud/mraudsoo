"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navi } from "@/sisu/sait";

export default function Pais() {
  const [avatud, setAvatud] = useState(false);
  const tee = usePathname();

  // Sulge mobiilimenüü lehe vahetumisel
  useEffect(() => {
    setAvatud(false);
  }, [tee]);

  // Kui menüü on avatud, ei tohi taust kerida
  useEffect(() => {
    document.body.style.overflow = avatud ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [avatud]);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-bone/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="kuva text-xl text-ink transition-colors hover:text-gold-deep sm:text-2xl"
        >
          Marta Raudsoo
        </Link>

        {/* Töölaua navigatsioon */}
        <nav className="hidden lg:block" aria-label="Peamenüü">
          <ul className="flex items-center gap-9">
            {navi.map((punkt) => {
              const aktiivne =
                tee === punkt.tee || tee.startsWith(`${punkt.tee}/`);
              return (
                <li key={punkt.tee}>
                  <Link
                    href={punkt.tee}
                    aria-current={aktiivne ? "page" : undefined}
                    className={`text-[0.7rem] uppercase tracking-[0.22em] transition-colors hover:text-gold-deep ${
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
          <ul className="mx-auto max-w-6xl px-6 py-4">
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
