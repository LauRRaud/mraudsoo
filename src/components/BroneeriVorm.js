"use client";

import { useState } from "react";
import { kontakt, teenused } from "@/sisu/sait";

/*
  Vorm koostab praegu e-kirja ja avab selle kasutaja e-posti programmis.
  See töötab kohe ja ilma lisateenusteta.

  Kui Marta soovib hiljem päris broneerimissüsteemi (nt kalender või
  automaatne kirjasaatmine), tuleb välja vahetada ainult funktsioon saada() —
  ülejäänud vorm jääb samaks.
*/
export default function BroneeriVorm() {
  const [teenus, setTeenus] = useState("");

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
      sonum,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${kontakt.email}?subject=${encodeURIComponent(
      teema
    )}&body=${encodeURIComponent(sisu)}`;
  }

  const valjaStiil =
    "w-full border-b border-gold/40 bg-transparent px-1 py-3 text-base text-ink transition-colors placeholder:text-ink-faint focus:border-gold-deep focus:outline-none";
  const siltStiil =
    "block text-[0.7rem] uppercase tracking-[0.22em] text-gold-deep";

  return (
    <form onSubmit={saada} className="space-y-10">
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
            Telefon <span className="normal-case tracking-normal text-ink-faint">(vabatahtlik)</span>
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
            value={teenus}
            onChange={(e) => setTeenus(e.target.value)}
            className={`${valjaStiil} mt-3 cursor-pointer`}
          >
            <option value="">Ei tea veel / räägime</option>
            {teenused.map((t) => (
              <option key={t.slug} value={t.nimi}>
                {t.nimi}
              </option>
            ))}
          </select>
        </div>
      </div>

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
          className="inline-block border border-transparent bg-ink px-9 py-4 text-[0.7rem] uppercase tracking-[0.22em] text-bone transition-colors duration-300 hover:bg-gold-deep"
        >
          Saada soov
        </button>
        <p className="text-xs leading-relaxed text-ink-faint">
          Vorm avab sinu e-posti programmi, et saaksid kirja enne saatmist üle
          vaadata.
        </p>
      </div>
    </form>
  );
}
