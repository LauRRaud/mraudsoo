import Link from "next/link";
import { kontakt, navi } from "@/sisu/sait";

export default function Jalus() {
  return (
    <footer className="mt-auto border-t border-gold/20 bg-shell">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="kuva text-2xl text-ink">Marta Raudsoo</p>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-ink-soft">
              Kohalolu, selgus ja stiil — et inimene võiks elada rohkem
              kooskõlas sellega, kelleks Jumal on ta loonud.
            </p>
          </div>

          <div>
            <p className="silt">Leht</p>
            <ul className="mt-5 space-y-3">
              {navi.map((punkt) => (
                <li key={punkt.tee}>
                  <Link
                    href={punkt.tee}
                    className="text-base text-ink-soft transition-colors hover:text-gold-deep"
                  >
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
                <a
                  href={`mailto:${kontakt.email}`}
                  className="text-base text-ink-soft transition-colors hover:text-gold-deep"
                >
                  {kontakt.email}
                </a>
              </li>
              <li>
                <a
                  href={kontakt.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base text-ink-soft transition-colors hover:text-gold-deep"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={kontakt.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base text-ink-soft transition-colors hover:text-gold-deep"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="joon mt-14" />
        <p className="mt-6 text-sm tracking-wide text-ink-faint">
          © {new Date().getFullYear()} Marta Raudsoo
        </p>
      </div>
    </footer>
  );
}
