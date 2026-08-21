"use client";

import { useCallback, useEffect, useRef } from "react";
import Foto from "@/components/Foto";
import Ilmub from "@/components/Ilmub";
import { KATTE_VARV } from "@/components/ui";

const PILDID = [
  { nimi: "marta-portree", altEt: "Portree loomulikus valguses", altEn: "Portrait in natural light" },
  { nimi: "marta-seistes", altEt: "Seisev portree stuudios", altEn: "Standing studio portrait" },
  { nimi: "marta-diivanil", altEt: "Rahulik portree diivanil", altEn: "Quiet portrait on a sofa" },
  {
    nimi: "marta-lamades",
    altEt: "Ajatu portree heledas stuudios",
    altEn: "Timeless portrait in a light studio",
    lai: true,
  },
  { nimi: "marta-tutrega", altEt: "Kahe inimese portree stuudios", altEn: "Portrait of two people in a studio" },
];

const TEKST = {
  et: {
    silt: "Portfoolio",
    pealkiri: "Ehe, ajatu kohalolu",
    kirjeldus:
      "Valgus, liikumine ja päris hetk — portreed, milles saad olla sina ise.",
  },
  en: {
    silt: "Portfolio",
    pealkiri: "Genuine, timeless presence",
    kirjeldus:
      "Light, movement and a real moment — portraits in which you can be yourself.",
  },
};

const AUTOMAATSE_LIIKUMISE_KIIRUS = 0.075;
const KASUTAJA_PAUS_MS = 1200;

function Pildirida({ keel, peidetud = false }) {
  return (
    <div
      className="fotogalerii-ruhm"
      aria-hidden={peidetud ? "true" : undefined}
    >
      {PILDID.map((pilt) => (
        <div
          className={`fotogalerii-kaader${pilt.lai ? " fotogalerii-kaader-lai" : ""}`}
          key={`${pilt.nimi}-${peidetud}`}
        >
          <Foto
            nimi={pilt.nimi}
            alt={peidetud ? "" : keel === "en" ? pilt.altEn : pilt.altEt}
            kuvasuhe={pilt.lai ? "3 / 2" : "4 / 5"}
            sizes={
              pilt.lai
                ? "(max-width: 640px) 100vw, 48vw"
                : "(max-width: 640px) 72vw, 30vw"
            }
            className="h-full w-full"
          />
        </div>
      ))}
    </div>
  );
}

export default function FotograafiaPortfoolio({ keel, taustaVoti }) {
  const tekst = TEKST[keel] ?? TEKST.et;
  const galeriiRef = useRef(null);
  const radaRef = useRef(null);
  const lohistabRef = useRef(false);
  const pausKuniRef = useRef(0);
  const silmusePausKuniRef = useRef(0);
  const kerimisAsukohtRef = useRef(null);

  const peataAjutiselt = useCallback(() => {
    pausKuniRef.current = performance.now() + KASUTAJA_PAUS_MS;
  }, []);

  const keriFoto = useCallback(
    (suund) => {
      const galerii = galeriiRef.current;
      const kaadrid = Array.from(
        radaRef.current?.querySelectorAll(".fotogalerii-kaader") ?? [],
      );
      if (!galerii || kaadrid.length === 0) return;

      const galeriiMoot = galerii.getBoundingClientRect();
      const galeriiKesk = galeriiMoot.left + galeriiMoot.width / 2;
      const lahinIndeks = kaadrid.reduce(
        (parim, kaader, indeks) => {
          const moot = kaader.getBoundingClientRect();
          const kaugus = Math.abs(moot.left + moot.width / 2 - galeriiKesk);
          return kaugus < parim.kaugus ? { indeks, kaugus } : parim;
        },
        { indeks: 0, kaugus: Number.POSITIVE_INFINITY },
      ).indeks;
      const sihtIndeks = Math.max(
        0,
        Math.min(kaadrid.length - 1, lahinIndeks + suund),
      );
      const sihtMoot = kaadrid[sihtIndeks].getBoundingClientRect();
      const liikumine = sihtMoot.left + sihtMoot.width / 2 - galeriiKesk;
      const vahendatudLiikumine = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      peataAjutiselt();
      silmusePausKuniRef.current = performance.now() + 900;

      galerii.scrollBy({
        left: suund * liikumine,
        behavior: vahendatudLiikumine ? "auto" : "smooth",
      });
    },
    [peataAjutiselt],
  );

  useEffect(() => {
    const galerii = galeriiRef.current;
    const rada = radaRef.current;
    const esimeneRuhm = rada?.firstElementChild;
    if (!galerii || !rada || !esimeneRuhm) return undefined;

    const vahendatudLiikumine = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let kaadriId;
    let eelmineAeg = performance.now();
    let ruhmaLaius = 0;

    const mootmed = () => {
      const eelmineLaius = ruhmaLaius;
      ruhmaLaius = esimeneRuhm.getBoundingClientRect().width;

      if (vahendatudLiikumine.matches) {
        galerii.scrollLeft = 0;
        kerimisAsukohtRef.current = 0;
      } else if (!eelmineLaius && ruhmaLaius) {
        galerii.scrollLeft = ruhmaLaius;
        kerimisAsukohtRef.current = ruhmaLaius;
      }
    };

    const siluAsukoht = () => {
      if (
        !ruhmaLaius ||
        vahendatudLiikumine.matches ||
        performance.now() < silmusePausKuniRef.current
      ) {
        return;
      }
      if (galerii.scrollLeft < ruhmaLaius * 0.5) {
        galerii.scrollLeft += ruhmaLaius;
        kerimisAsukohtRef.current = galerii.scrollLeft;
      } else if (galerii.scrollLeft > ruhmaLaius * 1.5) {
        galerii.scrollLeft -= ruhmaLaius;
        kerimisAsukohtRef.current = galerii.scrollLeft;
      }
    };

    const liiguta = (aeg) => {
      const vahe = Math.min(aeg - eelmineAeg, 48);
      eelmineAeg = aeg;

      if (
        !vahendatudLiikumine.matches &&
        !lohistabRef.current &&
        aeg > pausKuniRef.current
      ) {
        if (
          kerimisAsukohtRef.current === null ||
          Math.abs(galerii.scrollLeft - kerimisAsukohtRef.current) > 2
        ) {
          kerimisAsukohtRef.current = galerii.scrollLeft;
        }
        kerimisAsukohtRef.current -= vahe * AUTOMAATSE_LIIKUMISE_KIIRUS;
        galerii.scrollLeft = kerimisAsukohtRef.current;
      } else {
        kerimisAsukohtRef.current = galerii.scrollLeft;
      }

      siluAsukoht();
      kaadriId = requestAnimationFrame(liiguta);
    };

    const suuruseVaatleja = new ResizeObserver(mootmed);
    suuruseVaatleja.observe(esimeneRuhm);
    mootmed();
    kaadriId = requestAnimationFrame(liiguta);

    return () => {
      cancelAnimationFrame(kaadriId);
      suuruseVaatleja.disconnect();
    };
  }, []);

  const alustaLohistamist = () => {
    lohistabRef.current = true;
  };

  const lopetaLohistamine = () => {
    if (!lohistabRef.current) return;
    lohistabRef.current = false;
    peataAjutiselt();
  };

  const peataHorisontaalselKerimisel = (sundmus) => {
    if (Math.abs(sundmus.deltaX) > Math.abs(sundmus.deltaY)) {
      peataAjutiselt();
    }
  };

  return (
    <section
      className="overflow-hidden bg-mets"
      data-taust={taustaVoti}
      style={{ "--kate-varv": KATTE_VARV.mets }}
      aria-labelledby="fotograafia-portfoolio-pealkiri"
    >
      <div className="mx-auto max-w-[1400px] px-6 pb-12 pt-16 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-20 lg:pt-24">
        <Ilmub className="grid gap-5 md:grid-cols-[0.65fr_1.35fr] md:items-end md:gap-16">
          <p className="silt silt-tume">{tekst.silt}</p>
          <div>
            <h2
              id="fotograafia-portfoolio-pealkiri"
              className="kuva max-w-3xl text-[clamp(2.35rem,5vw,4.3rem)] leading-[1.08] text-luu"
            >
              {tekst.pealkiri}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-[1.75] text-luu/80">
              {tekst.kirjeldus}
            </p>
          </div>
        </Ilmub>
      </div>

      <div className="fotogalerii-ümbris pb-16 sm:pb-20 lg:pb-24">
        <button
          type="button"
          className="fotogalerii-nool fotogalerii-nool-vasak"
          aria-label={keel === "en" ? "Previous photograph" : "Eelmine foto"}
          onClick={() => keriFoto(-1)}
        >
          <svg
            aria-hidden="true"
            className="fotogalerii-kolmnurk"
            viewBox="0 0 24 24"
          >
            <path d="m15 4-8 8 8 8" />
          </svg>
        </button>

        <div
          ref={galeriiRef}
          className="fotogalerii"
          onPointerDown={alustaLohistamist}
          onPointerUp={lopetaLohistamine}
          onPointerCancel={lopetaLohistamine}
          onPointerLeave={lopetaLohistamine}
          onWheel={peataHorisontaalselKerimisel}
        >
          <div ref={radaRef} className="fotogalerii-rada">
            <Pildirida keel={keel} />
            <Pildirida keel={keel} peidetud />
            <Pildirida keel={keel} peidetud />
          </div>
        </div>

        <button
          type="button"
          className="fotogalerii-nool fotogalerii-nool-parem"
          aria-label={keel === "en" ? "Next photograph" : "Järgmine foto"}
          onClick={() => keriFoto(1)}
        >
          <svg
            aria-hidden="true"
            className="fotogalerii-kolmnurk"
            viewBox="0 0 24 24"
          >
            <path d="m9 4 8 8-8 8" />
          </svg>
        </button>
      </div>
    </section>
  );
}
