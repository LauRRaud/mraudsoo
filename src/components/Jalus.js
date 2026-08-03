import Link from "next/link";
import { kontakt, navi } from "@/sisu/sait";

export default function Jalus() {
  const link =
    "text-lg text-ink-soft transition-colors hover:text-gold-deep";

  return (
    <footer className="mt-auto border-t border-gold/20 bg-shell">
      <div className="mx-auto max-w-[1360px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="nimi text-3xl text-ink">Marta Raudsoo</p>
            <p className="mt-4 max-w-xs text-lg leading-relaxed text-ink-soft">
              Kohalolu, selgus ja stiil — et inimene võiks elada rohkem
              kooskõlas sellega, kelleks Jumal on ta loonud.
            </p>
          </div>

          {/* Menüü ei vaja silti — lingid kõnelevad ise */}
          <div>
            <ul className="space-y-3">
              {navi.map((punkt) => (
                <li key={punkt.tee}>
                  <Link href={punkt.tee} className={link}>
                    {punkt.nimi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="silt">Kontakt</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`mailto:${kontakt.email}`} className={link}>
                  {kontakt.email}
                </a>
              </li>
              <li>
                <a
                  href={kontakt.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className={link}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={kontakt.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className={link}
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="joon mt-14" />
        <p className="mt-6 text-[0.9375rem] text-ink-faint">
          © {new Date().getFullYear()} Marta Raudsoo
        </p>
      </div>
    </footer>
  );
}
