"use client";

import { useState, useTransition } from "react";
import { taastaTegevus } from "@/app/admin/tegevused";

/*
  VARUKOOPIATE LOEND JA TAASTAMINE.

  Kliendikomponent ainult kinnitusdialoogi ja teate pärast — koopiate loend
  tuleb serverilt propsina.

  Koopiad on rühmitatud alusnime järgi („sisu.et”, „kujundus”), sest muidu
  seisaks kolme eri asja ajalugu läbisegi ühes pikas reas ja õige rea leidmine
  oleks otsimine, mitte valimine.
*/

/* Alusnimi inimkeeles. Tundmatu nimi jääb nii, nagu ta on. */
const NIMED = {
  "sisu.et": "Sisu · eesti keeles",
  "sisu.en": "Sisu · inglise keeles",
  tekstikujud: "Tekstide kuju (mõlemale keelele ühine)",
  kujundus: "Kujundus — fondid, värvid, suurused",
  kalender: "Kalendri suletud päevad",
  sisu: "Sisu (enne kakskeelsust)",
};

/* 20260812-181530 -> 12.08.2026 18:15:30 */
function vormindaTempel(tempel) {
  const [paev, kell] = tempel.split("-");
  const a = paev.slice(0, 4);
  const k = paev.slice(4, 6);
  const p = paev.slice(6, 8);
  return `${p}.${k}.${a} ${kell.slice(0, 2)}:${kell.slice(2, 4)}:${kell.slice(4, 6)}`;
}

function vormindaSuurus(baite) {
  if (baite < 1024) return `${baite} B`;
  return `${(baite / 1024).toFixed(1)} kB`;
}

const NUPP_AARIS =
  "mikro inline-flex items-center justify-center border border-rohe px-5 py-2.5 text-[0.75rem] text-rohe transition-colors hover:bg-rohe hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

export default function VarukoopiateHaldus({ koopiad = [] }) {
  const [tootab, alustaTood] = useTransition();
  const [teade, setTeade] = useState(null);

  /* Rühmad alusnime järgi, iga rühma sees uuemad ees (loend tuleb sorditult) */
  const ruhmad = new Map();
  for (const koopia of koopiad) {
    if (!ruhmad.has(koopia.alus)) ruhmad.set(koopia.alus, []);
    ruhmad.get(koopia.alus).push(koopia);
  }

  function taasta(koopia) {
    const kinnitus = window.confirm(
      `Kas taastada „${NIMED[koopia.alus] ?? koopia.alus}” seisuga ` +
        `${vormindaTempel(koopia.tempel)}?\n\n` +
        "Praegune seis kirjutatakse üle, aga sellest tehakse enne koopia — " +
        "vale valiku saad kohe tagasi keerata.",
    );
    if (!kinnitus) return;

    setTeade(null);
    alustaTood(async () => {
      try {
        const vastus = await taastaTegevus(koopia.nimi);
        setTeade(
          vastus?.ok
            ? { ok: true, tekst: vastus.sonum ?? "Taastatud." }
            : { ok: false, tekst: vastus?.viga ?? "Taastamine ebaõnnestus." },
        );
      } catch {
        setTeade({
          ok: false,
          tekst: "Taastamine ebaõnnestus — ühendus serveriga katkes.",
        });
      }
    });
  }

  if (koopiad.length === 0) {
    return (
      <p className="text-lg text-ink-soft">
        Koopiaid veel ei ole. Esimene tekib kohe, kui midagi salvestada.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {teade && (
        <p
          role="status"
          className={`border-l-2 bg-bone px-6 py-4 text-base ${
            teade.ok ? "border-rohe text-ink" : "border-gold-deep text-ink"
          }`}
        >
          {teade.tekst}
        </p>
      )}

      {[...ruhmad.entries()].map(([alus, read]) => (
        <section key={alus}>
          <h2 className="kuva text-xl text-ink">{NIMED[alus] ?? alus}</h2>
          <div className="joon mt-3" />

          <ul className="mt-5 space-y-2">
            {read.map((koopia, jrk) => (
              <li
                key={koopia.nimi}
                className="flex flex-wrap items-center justify-between gap-4 border border-sage bg-bone px-5 py-3"
              >
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="text-base text-ink">
                    {vormindaTempel(koopia.tempel)}
                  </span>
                  <span className="text-sm text-ink-faint">
                    {vormindaSuurus(koopia.baite)}
                  </span>
                  {/* Uuem koopia on see, mis oli enne VIIMAST salvestust */}
                  {jrk === 0 && (
                    <span className="mikro text-[0.65rem] text-rohe">
                      viimane
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => taasta(koopia)}
                  disabled={tootab}
                  className={NUPP_AARIS}
                >
                  Taasta
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
