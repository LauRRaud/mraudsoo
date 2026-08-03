"use client";

import { useState } from "react";
import Kalender, { vormindaKuupaev } from "@/components/Kalender";
import { kontakt, teenused } from "@/sisu/sait";

const KELLAAJAD = [
  { vaartus: "Hommik", vihje: "9–12" },
  { vaartus: "Pärastlõuna", vihje: "12–17" },
  { vaartus: "Õhtu", vihje: "17–20" },
];

/*
  Vorm koostab e-kirja ja avab selle kasutaja e-posti programmis.
  See töötab kohe ja ilma lisateenusteta.

  Kalender ei näita Marta tegelikke vabu aegu — külastaja pakub omalt poolt
  sobivad ajad ja Marta kinnitab. Kui hiljem tuleb päris broneerimissüsteem,
  tuleb välja vahetada ainult funktsioon saada().
*/
export default function BroneeriVorm() {
  const [kuupaevad, setKuupaevad] = useState([]);
  const [kellaajad, setKellaajad] = useState([]);

  function lylitaKellaaeg(vaartus) {
    setKellaajad((eelmine) =>
      eelmine.includes(vaartus)
        ? eelmine.filter((k) => k !== vaartus)
        : [...eelmine, vaartus]
    );
  }

  function saada(sundmus) {
    sundmus.preventDefault();
    const vorm = new FormData(sundmus.currentTarget);

    const nimi = vorm.get("nimi");
    const epost = vorm.get("epost");
    const telefon = vorm.get("telefon");
    const valitud = vorm.get("teenus");
    const sonum = vorm.get("sonum");

    const teema = valitud ? `Broneerimissoov: ${valitud}` : "Broneerimissoov";
    const sisu = [
      `Nimi: ${nimi}`,
      `E-post: ${epost}`,
      telefon ? `Telefon: ${telefon}` : null,
      valitud ? `Teenus: ${valitud}` : null,
      "",
      kuupaevad.length
        ? `Sobivad kuupäevad:\n${kuupaevad
            .map((k) => `  - ${vormindaKuupaev(k)}`)
            .join("\n")}`
        : null,
      kellaajad.length ? `Sobiv kellaaeg: ${kellaajad.join(", ")}` : null,
      kuupaevad.length || kellaajad.length ? "" : null,
      sonum,
    ]
      .filter((rida) => rida !== null)
      .join("\n");

    window.location.href = `mailto:${kontakt.email}?subject=${encodeURIComponent(
      teema
    )}&body=${encodeURIComponent(sisu)}`;
  }

  const valjaStiil =
    "w-full border-b border-gold/40 bg-transparent px-1 py-3 text-base text-ink transition-colors placeholder:text-ink-faint focus:border-gold-deep focus:outline-none";
  const siltStiil =
    "block mikro text-gold-deep";

  return (
    <form onSubmit={saada} className="space-y-14">
      {/* Kontaktandmed */}
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor="nimi" className={siltStiil}>
            Nimi
          </label>
          <input
            id="nimi"
            name="nimi"
            type="text"
            required
            autoComplete="name"
            className={`${valjaStiil} mt-3`}
            placeholder="Sinu nimi"
          />
        </div>

        <div>
          <label htmlFor="epost" className={siltStiil}>
            E-post
          </label>
          <input
            id="epost"
            name="epost"
            type="email"
            required
            autoComplete="email"
            className={`${valjaStiil} mt-3`}
            placeholder="sinu@epost.ee"
          />
        </div>

        <div>
          <label htmlFor="telefon" className={siltStiil}>
            Telefon{" "}
            <span className="normal-case tracking-normal text-ink-faint">
              (vabatahtlik)
            </span>
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            autoComplete="tel"
            className={`${valjaStiil} mt-3`}
            placeholder="+372"
          />
        </div>

        <div>
          <label htmlFor="teenus" className={siltStiil}>
            Teenus
          </label>
          <select
            id="teenus"
            name="teenus"
            defaultValue=""
            className={`${valjaStiil} mt-3 cursor-pointer`}
          >
            <option value="">Ei tea veel / räägime</option>
            {teenused.map((t) => (
              <option key={t.slug} value={t.nimi}>
                {t.nimi}
              </option>
            ))}
            <option value="Stiiliteekond">Stiiliteekond (kolm sammu)</option>
          </select>
        </div>
      </div>

      {/* Kalender */}
      <fieldset>
        <legend className={siltStiil}>
          Millal sulle sobiks?{" "}
          <span className="normal-case tracking-normal text-ink-faint">
            (vabatahtlik)
          </span>
        </legend>
        <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-ink-soft">
          Vali kuni kolm sobivat kuupäeva. Need ei ole kinnitatud ajad — Marta
          vaatab need üle ja kinnitab sulle sobiva.
        </p>

        <div className="mt-8 max-w-md border border-gold/25 bg-bone p-5 sm:p-7">
          <Kalender valitud={kuupaevad} onMuuda={setKuupaevad} />
        </div>
      </fieldset>

      {/* Kellaaeg */}
      <fieldset>
        <legend className={siltStiil}>
          Sobiv kellaaeg{" "}
          <span className="normal-case tracking-normal text-ink-faint">
            (vabatahtlik)
          </span>
        </legend>
        <div className="mt-5 flex flex-wrap gap-3">
          {KELLAAJAD.map((aeg) => {
            const onValitud = kellaajad.includes(aeg.vaartus);
            return (
              <button
                key={aeg.vaartus}
                type="button"
                onClick={() => lylitaKellaaeg(aeg.vaartus)}
                aria-pressed={onValitud}
                className={`border px-6 py-3 text-base transition-colors ${
                  onValitud
                    ? "border-ink bg-ink text-bone"
                    : "border-gold/40 text-ink-soft hover:border-gold-deep hover:text-ink"
                }`}
              >
                {aeg.vaartus}{" "}
                <span
                  className={onValitud ? "text-bone/60" : "text-ink-faint"}
                >
                  {aeg.vihje}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Sõnum */}
      <div>
        <label htmlFor="sonum" className={siltStiil}>
          Mis sind praegu kõige rohkem puudutab?
        </label>
        <textarea
          id="sonum"
          name="sonum"
          rows={5}
          required
          className={`${valjaStiil} mt-3 resize-y`}
          placeholder="Kirjuta julgelt oma sõnadega."
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="inline-block border border-transparent bg-ink px-9 py-4 mikro text-bone transition-colors duration-300 hover:bg-gold-deep"
        >
          Saada soov
        </button>
        <p className="text-sm leading-relaxed text-ink-faint">
          Vorm avab sinu e-posti programmi, et saaksid kirja enne saatmist üle
          vaadata.
        </p>
      </div>
    </form>
  );
}
