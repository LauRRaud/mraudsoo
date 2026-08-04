"use client";

import { useMemo, useState } from "react";

const KUUD = [
  "jaanuar",
  "veebruar",
  "märts",
  "aprill",
  "mai",
  "juuni",
  "juuli",
  "august",
  "september",
  "oktoober",
  "november",
  "detsember",
];

/* Eesti nädal algab esmaspäevast */
const NADALAPAEVAD = ["E", "T", "K", "N", "R", "L", "P"];

export const MAX_KUUPAEVI = 3;

/* Mitmes veerus on kuu 1. kuupäev, kui nädal algab esmaspäevast */
function algusNihe(aasta, kuu) {
  const paev = new Date(aasta, kuu, 1).getDay(); // 0 = pühapäev
  return (paev + 6) % 7;
}

function paevadeArv(aasta, kuu) {
  return new Date(aasta, kuu + 1, 0).getDate();
}

/* Võti kujul 2026-08-14 — sorditav ja üheselt mõistetav */
export function teeVoti(aasta, kuu, paev) {
  return `${aasta}-${String(kuu + 1).padStart(2, "0")}-${String(paev).padStart(
    2,
    "0"
  )}`;
}

export function vormindaKuupaev(voti) {
  const [a, k, p] = voti.split("-").map(Number);
  return new Date(a, k - 1, p).toLocaleDateString("et-EE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/*
  suletudPaevad / suletudNadalapaevad tulevad serverilt (data/kalender.json).
  Marta märgib need admin-lehel; külastaja neid päevi valida ei saa.
  Nädalapäev on 1 = esmaspäev ... 7 = pühapäev.
*/
export default function Kalender({
  valitud,
  onMuuda,
  suletudPaevad = [],
  suletudNadalapaevad = [],
}) {
  const tana = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [aasta, setAasta] = useState(tana.getFullYear());
  const [kuu, setKuu] = useState(tana.getMonth());

  /* Varasemasse kuusse ei saa liikuda — mineviku aegu ei broneerita */
  const saabTagasi =
    aasta > tana.getFullYear() ||
    (aasta === tana.getFullYear() && kuu > tana.getMonth());

  function liigu(samm) {
    const uus = new Date(aasta, kuu + samm, 1);
    setAasta(uus.getFullYear());
    setKuu(uus.getMonth());
  }

  function lyliti(voti, keelatud) {
    if (keelatud) return;
    if (valitud.includes(voti)) {
      onMuuda(valitud.filter((v) => v !== voti));
    } else if (valitud.length < MAX_KUUPAEVI) {
      onMuuda([...valitud, voti].sort());
    }
  }

  const nihe = algusNihe(aasta, kuu);
  const paevi = paevadeArv(aasta, kuu);
  const taisArv = nihe + paevi;

  return (
    <div>
      {/* Kuu valik */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => liigu(-1)}
          disabled={!saabTagasi}
          className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft transition-colors hover:text-gold-deep disabled:cursor-not-allowed disabled:text-ink-faint/40"
        >
          <span className="sr-only">Eelmine kuu</span>
          <span aria-hidden="true">←</span>
        </button>

        <p aria-live="polite" className="kuva text-xl text-ink sm:text-2xl">
          {KUUD[kuu]} {aasta}
        </p>

        <button
          type="button"
          onClick={() => liigu(1)}
          className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft transition-colors hover:text-gold-deep"
        >
          <span className="sr-only">Järgmine kuu</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="joon mt-5" />

      {/* Nädalapäevad */}
      <div className="mt-5 grid grid-cols-7 gap-1">
        {NADALAPAEVAD.map((p) => (
          <div
            key={p}
            aria-hidden="true"
            className="py-2 text-center mikro text-ink-faint"
          >
            {p}
          </div>
        ))}
      </div>

      {/* Kuupäevad */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: taisArv }, (_, i) => {
          if (i < nihe) return <div key={`tyhi-${i}`} aria-hidden="true" />;

          const paev = i - nihe + 1;
          const kuupaev = new Date(aasta, kuu, paev);
          const voti = teeVoti(aasta, kuu, paev);
          const minevikus = kuupaev < tana;
          const onValitud = valitud.includes(voti);
          const onTana = kuupaev.getTime() === tana.getTime();
          const taisTais = valitud.length >= MAX_KUUPAEVI && !onValitud;

          /* JS annab pühapäevaks 0, meie kuju on 1–7 */
          const nadalapaev = kuupaev.getDay() === 0 ? 7 : kuupaev.getDay();
          const suletud =
            suletudPaevad.includes(voti) ||
            suletudNadalapaevad.includes(nadalapaev);

          const keelatud = minevikus || suletud || taisTais;

          return (
            <button
              key={voti}
              type="button"
              onClick={() => lyliti(voti, keelatud)}
              disabled={keelatud}
              aria-pressed={onValitud}
              aria-label={`${vormindaKuupaev(voti)}${suletud ? " — ei ole kohtumisteks avatud" : ""}`}
              className={`relative flex aspect-square items-center justify-center text-lg transition-colors ${
                onValitud
                  ? "bg-rohe text-white"
                  : minevikus
                    ? "cursor-not-allowed text-ink-faint/40"
                    : suletud
                      ? "cursor-not-allowed text-ink-faint/50"
                      : taisTais
                        ? "cursor-not-allowed text-ink-faint"
                        : "text-ink hover:bg-clay-soft"
              }`}
            >
              {paev}
              {/* Suletud päev saab kriipsu — värvist üksi ei piisa */}
              {suletud && !minevikus && (
                <span
                  aria-hidden="true"
                  className="absolute h-px w-1/2 rotate-[-20deg] bg-ink-faint/60"
                />
              )}
              {onTana && !onValitud && !suletud && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 h-1 w-1 rounded-full bg-gold"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Valitud kuupäevad */}
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-ink-faint">
          Valitud {valitud.length}/{MAX_KUUPAEVI}
        </p>
        {valitud.length > 0 && (
          <button
            type="button"
            onClick={() => onMuuda([])}
            className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-gold-deep"
          >
            Tühjenda
          </button>
        )}
      </div>

      {valitud.length > 0 && (
        <ul className="mt-4 space-y-2" aria-live="polite">
          {valitud.map((voti) => (
            <li
              key={voti}
              className="flex items-center justify-between gap-4 border-t border-gold/25 pt-3 text-lg text-ink-soft"
            >
              <span>{vormindaKuupaev(voti)}</span>
              <button
                type="button"
                onClick={() => onMuuda(valitud.filter((v) => v !== voti))}
                className="text-ink-faint transition-colors hover:text-brick"
              >
                <span className="sr-only">
                  Eemalda {vormindaKuupaev(voti)}
                </span>
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
