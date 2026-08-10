"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { plokiStiil, tekstiKuju } from "@/sisu/tekstikujud";

/*
  Kliendikomponent ei loe sisu ise — navi, saidiNimi ja kontakt tulevad
  propsidena juurpaigutusest (src/app/layout.js), kus sisu on failist loetud.

  Käitumine: päis peitub alla kerides ja tuleb üles kerides kohe tagasi.
  Mobiilimenüü on täisekraani tume kiht (menyy — oma värv, mitte jaluse oma,
  vt kujundus/vaikimisi.js), mille lingid ilmuvad
  astmeliselt; ESC sulgeb, taust ei keri.
*/
export default function Pais({
  navi = [],
  saidiNimi = "Marta Raudsoo",
  tekstiKujud = {},
  kontakt = {},
}) {
  const [avatud, setAvatud] = useState(false);
  const [peidus, setPeidus] = useState(false);
  const tee = usePathname();
  const menyyViide = useRef(null);

  /*
    Sulge mobiilimenüü lehe vahetumisel.
    Muudame seisundit renderdamise ajal, mitte efektis — efektis setState()
    tekitaks kaskaadrenderduse (React: „You Might Not Need an Effect”).
  */
  const [eelmineTee, setEelmineTee] = useState(tee);
  if (tee !== eelmineTee) {
    setEelmineTee(tee);
    setAvatud(false);
  }

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

  // Kui menüü on avatud, ei tohi taust kerida; ESC sulgeb
  useEffect(() => {
    document.body.style.overflow = avatud ? "hidden" : "";

    function klahv(sundmus) {
      if (sundmus.key === "Escape") setAvatud(false);
    }

    if (avatud) {
      window.addEventListener("keydown", klahv);
      menyyViide.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", klahv);
    };
  }, [avatud]);

  /* Broneerimine on esile tõstetud — menüüs seisab see nupuna */
  const tavalised = navi.filter((punkt) => punkt.tee !== "/broneerimine");
  const esile = navi.find((punkt) => punkt.tee === "/broneerimine");

  /* Adminis „Saidi nimi” alla valitud kuju rakendub päise logotekstile. */
  const saidiNimePlokiStiil = plokiStiil(tekstiKujud, "meta")(
    "saidiNimi",
    { varvMuutujaks: true },
  );
  const saidiNimeTekst = tekstiKuju(tekstiKujud, "meta");
  const saidiNimeOmaVarv = Boolean(
    tekstiKujud?.["meta.saidiNimi"]?.varv,
  );

  function aktiivne(punkt) {
    return tee === punkt.tee || tee.startsWith(`${punkt.tee}/`);
  }

  return (
    <>
    <header
      className={`sticky top-0 z-50 transition-transform duration-500 ${
        varjatud ? "-translate-y-full" : "translate-y-0"
      } ${
        avatud
          ? "border-b border-transparent bg-transparent"
          : "border-b border-gold/15 bg-bone"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
        <Link
          href="/"
          style={saidiNimePlokiStiil}
          className={`nimi text-2xl transition-colors sm:text-[1.7rem] ${
            avatud
              ? "text-luu hover:text-kuld-hele"
              : saidiNimeOmaVarv
                ? "text-[var(--oma-varv)] hover:text-gold-deep"
                : "text-ink hover:text-gold-deep"
          }`}
        >
          {saidiNimeTekst("saidiNimi", saidiNimi)}
        </Link>

        {/* Töölaua navigatsioon */}
        <nav className="hidden lg:block" aria-label="Peamenüü">
          <ul className="flex items-center gap-9">
            {tavalised.map((punkt) => (
              <li key={punkt.tee}>
                <Link
                  href={punkt.tee}
                  aria-current={aktiivne(punkt) ? "page" : undefined}
                  className={`mikro alajoon transition-colors duration-300 ${
                    aktiivne(punkt)
                      ? "text-gold-deep"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {punkt.nimi}
                </Link>
              </li>
            ))}
            {esile && (
              <li>
                <Link
                  href={esile.tee}
                  className="nupp nupp-aaris nupp-vaike mikro"
                >
                  <span>{esile.nimi}</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobiilinupp */}
        <button
          type="button"
          onClick={() => setAvatud((v) => !v)}
          aria-expanded={avatud}
          aria-controls="mobiilimenyy"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
        >
          <span className="sr-only">{avatud ? "Sulge menüü" : "Ava menüü"}</span>
          <span
            aria-hidden="true"
            className={`h-px w-6 transition-all duration-300 ${
              avatud ? "translate-y-[7px] rotate-45 bg-luu" : "bg-ink"
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-px w-6 transition-opacity duration-300 ${
              avatud ? "opacity-0" : "bg-ink"
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-px w-6 transition-all duration-300 ${
              avatud ? "-translate-y-[7px] -rotate-45 bg-luu" : "bg-ink"
            }`}
          />
        </button>
      </div>

    </header>

      {/*
        Mobiilimenüü — täisekraani tume kiht. Seisab päise KÕRVAL, mitte sees:
        päisel on translate (peitumine) ja see muudaks fixed-kihi
        paigutuse päisesuuruseks. z-40 jääb päise (z-50) alla, nii et
        logo ja sulgemisnupp püsivad nähtaval.
      */}
      {avatud && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="leht-sisenemine absolute inset-0 bg-menyy" />

          <nav
            id="mobiilimenyy"
            aria-label="Peamenüü"
            ref={menyyViide}
            tabIndex={-1}
            className="absolute inset-0 flex flex-col justify-between overflow-y-auto px-6 pb-10 pt-28 outline-none"
          >
            <ul>
              {navi.map((punkt, jrk) => (
                <li key={punkt.tee}>
                  <Link
                    href={punkt.tee}
                    aria-current={aktiivne(punkt) ? "page" : undefined}
                    className={`sisene kuva block py-3 text-[clamp(2.1rem,9vw,3.2rem)] transition-colors ${
                      aktiivne(punkt)
                        ? "text-kuld-hele"
                        : "text-luu hover:text-kuld-hele"
                    }`}
                    style={{ "--viive": `${140 + jrk * 70}ms` }}
                  >
                    {punkt.nimi}
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className="sisene mt-10"
              style={{ "--viive": `${140 + navi.length * 70 + 80}ms` }}
            >
              <div className="joon-tume" />
              <div className="mt-7 space-y-3">
                {kontakt.email && (
                  <a
                    href={`mailto:${kontakt.email}`}
                    className="block text-lg text-luu transition-colors hover:text-kuld-hele"
                  >
                    {kontakt.email}
                  </a>
                )}
                <div className="flex flex-wrap gap-x-7 gap-y-2">
                  {/* Kanalite nimed, mitte muudetav sisu */}
                  {kontakt.instagram && (
                    <a
                      href={kontakt.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="mikro text-luu/90 transition-colors hover:text-kuld-hele"
                    >
                      Instagram
                    </a>
                  )}
                  {kontakt.facebook && (
                    <a
                      href={kontakt.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="mikro text-luu/90 transition-colors hover:text-kuld-hele"
                    >
                      Facebook
                    </a>
                  )}
                  {kontakt.substack && (
                    <a
                      href={kontakt.substack}
                      target="_blank"
                      rel="noreferrer"
                      className="mikro text-luu/90 transition-colors hover:text-kuld-hele"
                    >
                      Substack
                    </a>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
