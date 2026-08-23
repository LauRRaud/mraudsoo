"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import Ilmub from "@/components/Ilmub";
import { KATTE_VARV } from "@/components/ui";
import { fotograafiaPildiAadress } from "@/sisu/fotograafiaGalerii";

const AUTOMAATSE_LIIKUMISE_KIIRUS = 0.06;
const KASUTAJA_PAUS_MS = 1200;
const NOOLEVAJUTUSE_PAUS_MS = 7000;

function Pildirida({ pildid, peidetud = false }) {
  return (
    <div
      className="fotogalerii-ruhm"
      aria-hidden={peidetud ? "true" : undefined}
    >
      {pildid.map((pilt, indeks) => (
        <div
          className={`fotogalerii-kaader${pilt.lai ? " fotogalerii-kaader-lai" : ""}`}
          key={`${pilt.fail}-${indeks}-${peidetud}`}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={pilt.aadress}
              alt={peidetud ? "" : pilt.alt}
              fill
              quality={100}
              sizes={
                pilt.lai
                  ? "(max-width: 640px) 100vw, 48vw"
                  : "(max-width: 640px) 72vw, 30vw"
              }
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FotograafiaPortfoolio({ keel, taustaVoti, galerii }) {
  const pildid = (Array.isArray(galerii?.pildid) ? galerii.pildid : [])
    .map((pilt) => ({
      ...pilt,
      aadress: fotograafiaPildiAadress(pilt?.fail),
      lai: pilt?.kuvasuhe === "lai",
    }))
    .filter((pilt) => pilt.aadress);
  const galeriiRef = useRef(null);
  const radaRef = useRef(null);
  const lohistabRef = useRef(false);
  const pausKuniRef = useRef(0);
  const silmusePausKuniRef = useRef(0);
  const kerimisAsukohtRef = useRef(null);

  const peataAjutiselt = useCallback((pausMs = KASUTAJA_PAUS_MS) => {
    pausKuniRef.current = performance.now() + pausMs;
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

      peataAjutiselt(NOOLEVAJUTUSE_PAUS_MS);
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

  if (pildid.length === 0) return null;

  return (
    <section
      className="overflow-hidden bg-mets"
      data-taust={taustaVoti}
      style={{ "--kate-varv": KATTE_VARV.mets }}
      aria-labelledby="fotograafia-galerii-pealkiri"
    >
      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-14 sm:pb-12 sm:pt-16 lg:px-12 lg:pb-16 lg:pt-20">
        <Ilmub className="max-w-4xl">
          <h2
            id="fotograafia-galerii-pealkiri"
            className="kuva max-w-3xl text-[clamp(2.35rem,5vw,4.3rem)] leading-[1.08] text-luu"
          >
            {galerii.pealkiri}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-[1.75] text-luu/80">
            {galerii.kirjeldus}
          </p>
        </Ilmub>
      </div>

      <div className="fotogalerii-ümbris pb-14 sm:pb-16 lg:pb-20">
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
            <Pildirida pildid={pildid} />
            <Pildirida pildid={pildid} peidetud />
            <Pildirida pildid={pildid} peidetud />
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
