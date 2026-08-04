"use client";

import { useMemo, useState, useTransition } from "react";
import { salvestaKalendriTegevus } from "@/app/admin/tegevused";

const KUUD = [
  "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni",
  "juuli", "august", "september", "oktoober", "november", "detsember",
];

/* 1 = esmaspäev ... 7 = pühapäev */
const NADALAPAEVAD = [
  { number: 1, lyhend: "E", nimi: "esmaspäev" },
  { number: 2, lyhend: "T", nimi: "teisipäev" },
  { number: 3, lyhend: "K", nimi: "kolmapäev" },
  { number: 4, lyhend: "N", nimi: "neljapäev" },
  { number: 5, lyhend: "R", nimi: "reede" },
  { number: 6, lyhend: "L", nimi: "laupäev" },
  { number: 7, lyhend: "P", nimi: "pühapäev" },
];

function algusNihe(aasta, kuu) {
  const paev = new Date(aasta, kuu, 1).getDay();
  return (paev + 6) % 7;
}

function paevadeArv(aasta, kuu) {
  return new Date(aasta, kuu + 1, 0).getDate();
}

function teeVoti(aasta, kuu, paev) {
  return `${aasta}-${String(kuu + 1).padStart(2, "0")}-${String(paev).padStart(2, "0")}`;
}

/*
  ADMIN — KALENDRI SAADAVUS.

  Marta klõpsab päevale ja see muutub suletuks. Lisaks saab sulgeda korduvaid
  nädalapäevi. Salvestamine on selgesõnaline nupp, mitte automaatne — nii ei
  teki tunnet, et kogemata klõps läks kohe elama.
*/
export default function KalendriHaldus({ algseis }) {
  const tana = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [paevad, setPaevad] = useState(algseis.suletudPaevad ?? []);
  const [nadalapaevad, setNadalapaevad] = useState(
    algseis.suletudNadalapaevad ?? [],
  );
  const [aasta, setAasta] = useState(tana.getFullYear());
  const [kuu, setKuu] = useState(tana.getMonth());
  const [salvestab, alustaSalvestamist] = useTransition();
  const [teade, setTeade] = useState(null);

  /* Muudatused, mida ei ole veel salvestatud */
  const muutunud =
    JSON.stringify([...paevad].sort()) !==
      JSON.stringify([...(algseis.suletudPaevad ?? [])].sort()) ||
    JSON.stringify([...nadalapaevad].sort()) !==
      JSON.stringify([...(algseis.suletudNadalapaevad ?? [])].sort());

  function lylitaPaev(voti) {
    setTeade(null);
    setPaevad((eelmine) =>
      eelmine.includes(voti)
        ? eelmine.filter((p) => p !== voti)
        : [...eelmine, voti].sort(),
    );
  }

  function lylitaNadalapaev(number) {
    setTeade(null);
    setNadalapaevad((eelmine) =>
      eelmine.includes(number)
        ? eelmine.filter((n) => n !== number)
        : [...eelmine, number].sort((a, b) => a - b),
    );
  }

  function liigu(samm) {
    const uus = new Date(aasta, kuu + samm, 1);
    setAasta(uus.getFullYear());
    setKuu(uus.getMonth());
  }

  function salvesta() {
    alustaSalvestamist(async () => {
      const vastus = await salvestaKalendriTegevus({
        suletudPaevad: paevad,
        suletudNadalapaevad: nadalapaevad,
      });
      setTeade(
        vastus.ok
          ? { ok: true, tekst: "Salvestatud." }
          : { ok: false, tekst: vastus.viga },
      );
    });
  }

  const nihe = algusNihe(aasta, kuu);
  const paevi = paevadeArv(aasta, kuu);
  const saabTagasi =
    aasta > tana.getFullYear() ||
    (aasta === tana.getFullYear() && kuu > tana.getMonth());

  return (
    <div className="max-w-2xl">
      {/* Korduvad nädalapäevad */}
      <section>
        <h2 className="kuva text-2xl text-ink">Korduvalt suletud</h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          Nädalapäevad, mil sa kohtumisi üldse ei võta. Need on kalendris alati
          suletud ja neid ei pea iga kuu eraldi märkima.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {NADALAPAEVAD.map((p) => {
            const suletud = nadalapaevad.includes(p.number);
            return (
              <button
                key={p.number}
                type="button"
                onClick={() => lylitaNadalapaev(p.number)}
                aria-pressed={suletud}
                title={p.nimi}
                className={`h-12 w-12 border text-lg transition-colors ${
                  suletud
                    ? "border-ink bg-ink text-white"
                    : "border-clay text-ink-soft hover:border-rohe hover:text-rohe"
                }`}
              >
                {p.lyhend}
                <span className="sr-only">
                  {suletud ? `${p.nimi} on suletud` : `${p.nimi} on avatud`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Üksikud kuupäevad */}
      <section className="mt-12">
        <h2 className="kuva text-2xl text-ink">Üksikud päevad</h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          Klõpsa päevale, et see sulgeda. Klõpsa uuesti, et avada. Möödunud
          päevi ei ole vaja märkida — need on niikuinii suletud.
        </p>

        <div className="mt-6 border border-clay bg-bone p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => liigu(-1)}
              disabled={!saabTagasi}
              className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft transition-colors hover:text-rohe disabled:cursor-not-allowed disabled:text-ink-faint/40"
            >
              <span className="sr-only">Eelmine kuu</span>
              <span aria-hidden="true">←</span>
            </button>
            <p aria-live="polite" className="kuva text-xl text-ink">
              {KUUD[kuu]} {aasta}
            </p>
            <button
              type="button"
              onClick={() => liigu(1)}
              className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft transition-colors hover:text-rohe"
            >
              <span className="sr-only">Järgmine kuu</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1">
            {NADALAPAEVAD.map((p) => (
              <div
                key={p.number}
                aria-hidden="true"
                className="py-2 text-center mikro text-ink-faint"
              >
                {p.lyhend}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: nihe + paevi }, (_, i) => {
              if (i < nihe) return <div key={`tyhi-${i}`} aria-hidden="true" />;

              const paev = i - nihe + 1;
              const kuupaev = new Date(aasta, kuu, paev);
              const voti = teeVoti(aasta, kuu, paev);
              const minevikus = kuupaev < tana;
              const nadalapaev = kuupaev.getDay() === 0 ? 7 : kuupaev.getDay();
              const korduvaltSuletud = nadalapaevad.includes(nadalapaev);
              const suletud = paevad.includes(voti);

              return (
                <button
                  key={voti}
                  type="button"
                  onClick={() => lylitaPaev(voti)}
                  disabled={minevikus}
                  aria-pressed={suletud || korduvaltSuletud}
                  className={`relative flex aspect-square items-center justify-center text-lg transition-colors ${
                    minevikus
                      ? "cursor-not-allowed text-ink-faint/40"
                      : suletud
                        ? "bg-ink text-white"
                        : korduvaltSuletud
                          ? "cursor-pointer bg-shell text-ink-faint"
                          : "text-ink hover:bg-clay-soft"
                  }`}
                >
                  {paev}
                  {korduvaltSuletud && !suletud && !minevikus && (
                    <span
                      aria-hidden="true"
                      className="absolute h-px w-1/2 rotate-[-20deg] bg-ink-faint/60"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-faint">
            Must taust = see päev on suletud. Hall kriipsuga = suletud korduva
            nädalapäeva tõttu.
          </p>
        </div>

        {paevad.length > 0 && (
          <div className="mt-6">
            <p className="mikro text-ink-faint">Suletud päevad</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {paevad.map((voti) => (
                <button
                  key={voti}
                  type="button"
                  onClick={() => lylitaPaev(voti)}
                  className="border border-clay px-3 py-1.5 text-base text-ink-soft transition-colors hover:border-rohe hover:text-rohe"
                >
                  {voti} <span aria-hidden="true">×</span>
                  <span className="sr-only">Ava see päev</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={salvesta}
          disabled={salvestab || !muutunud}
          className="border border-rohe bg-rohe px-9 py-4 mikro text-white transition-colors hover:border-rohe-hele hover:bg-rohe-hele disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvestab ? "Salvestan …" : "Salvesta"}
        </button>
        {muutunud && !salvestab && (
          <p className="text-base text-ink-faint">Salvestamata muudatused.</p>
        )}
        {teade && (
          <p
            role="status"
            className={`text-base ${teade.ok ? "text-rohe" : "text-ink"}`}
          >
            {teade.tekst}
          </p>
        )}
      </div>
    </div>
  );
}
