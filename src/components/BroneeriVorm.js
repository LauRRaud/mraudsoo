"use client";

import { useState, useTransition } from "react";
import Kalender, { vormindaKuupaev } from "@/components/Kalender";
import { saadaBroneering } from "@/app/broneerimine/tegevused";

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

  Sisu (e-post, teenuste nimekiri, teekonna nimi) tuleb propsidena serverilt —
  see on kliendikomponent ja ei tohi sisulaadijat ise importida.
*/
export default function BroneeriVorm({ email, teenused = [], teekonnaNimi }) {
  const [kuupaevad, setKuupaevad] = useState([]);
  const [kellaajad, setKellaajad] = useState([]);

  function lylitaKellaaeg(vaartus) {
    setKellaajad((eelmine) =>
      eelmine.includes(vaartus)
        ? eelmine.filter((k) => k !== vaartus)
        : [...eelmine, vaartus]
    );
  }

  const [saadab, alustaSaatmist] = useTransition();
  const [seis, setSeis] = useState(null);

  function saada(sundmus) {
    sundmus.preventDefault();
    const vorm = new FormData(sundmus.currentTarget);

    const andmed = {
      nimi: vorm.get("nimi"),
      epost: vorm.get("epost"),
      telefon: vorm.get("telefon"),
      teenus: vorm.get("teenus"),
      sonum: vorm.get("sonum"),
      /* Peidetud peibutusväli — inimene jätab tühjaks, bot täidab */
      veebileht: vorm.get("veebileht"),
      kuupaevad: kuupaevad.map((k) => vormindaKuupaev(k)),
      kellaajad,
    };

    alustaSaatmist(async () => {
      setSeis(null);
      try {
        const vastus = await saadaBroneering(andmed);
        if (vastus.ok) {
          setSeis({ ok: true });
          setKuupaevad([]);
          setKellaajad([]);
          sundmus.target.reset();
        } else {
          setSeis({ ok: false, viga: vastus.viga });
        }
      } catch {
        setSeis({
          ok: false,
          viga: `Saatmine ebaõnnestus. Palun kirjuta otse aadressile ${email}.`,
        });
      }
    });
  }

  const valjaStiil =
    "w-full border-b border-gold/40 bg-transparent px-1 py-3 text-lg text-ink transition-colors placeholder:text-ink-faint focus:border-gold-deep focus:outline-none";
  const siltStiil =
    "block mikro text-gold-deep";

  return (
    <form onSubmit={saada} className="space-y-14">
      <p className="text-lg leading-relaxed text-ink-soft">
        Täida ainult nimi, e-post ja sõnum — ülejäänu on abiks, aga pole
        vajalik.
      </p>

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
            Telefon
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            autoComplete="tel"
            className={`${valjaStiil} mt-3`}
            placeholder="Kui eelistad, et helistan"
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
            {teekonnaNimi ? (
              <option value={teekonnaNimi}>{teekonnaNimi} (kolm sammu)</option>
            ) : null}
          </select>
        </div>
      </div>

      {/* Kalender */}
      <fieldset>
        <legend className={siltStiil}>Millal sulle sobiks?</legend>
        <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          Kui sul on mõni päev juba mõttes, vali kuni kolm. Kui ei ole, jäta
          vahele — lepime aja kokku kirja teel. Valitud päevad ei ole
          kinnitatud ajad; Marta vaatab need üle ja kinnitab sulle sobiva.
        </p>

        <div className="mt-8 max-w-md border border-gold/25 bg-bone p-5 sm:p-7">
          <Kalender valitud={kuupaevad} onMuuda={setKuupaevad} />
        </div>
      </fieldset>

      {/* Kellaaeg */}
      <fieldset>
        <legend className={siltStiil}>Mis kellaaeg sulle sobib?</legend>
        <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          Võid valida mitu või jätta valimata.
        </p>
        {/* Valikunupud on nupud, seega rohelised — kuld jääb joonteks ja siltideks */}
        <div className="mt-6 flex flex-wrap gap-3">
          {KELLAAJAD.map((aeg) => {
            const onValitud = kellaajad.includes(aeg.vaartus);
            return (
              <button
                key={aeg.vaartus}
                type="button"
                onClick={() => lylitaKellaaeg(aeg.vaartus)}
                aria-pressed={onValitud}
                className={`border px-6 py-3 text-lg transition-colors ${
                  onValitud
                    ? "border-rohe bg-rohe text-white"
                    : "border-rohe/40 text-ink-soft hover:border-rohe hover:text-ink"
                }`}
              >
                {aeg.vaartus}{" "}
                <span
                  className={onValitud ? "text-white/70" : "text-ink-faint"}
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

      {/*
        Peibutusväli. Inimene ei näe seda ega saa sinna kursoriga sattuda;
        automaatne täitja täidab ära ja reedab end sellega.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="veebileht">Jäta see väli tühjaks</label>
        <input id="veebileht" name="veebileht" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={saadab}
          className="inline-block border border-rohe bg-rohe px-9 py-4 mikro text-white transition-colors duration-300 hover:border-rohe-hele hover:bg-rohe-hele disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saadab ? "Saadan …" : "Saada soov"}
        </button>
      </div>

      {/* Tagasiside pärast saatmist */}
      {seis?.ok && (
        <p
          role="status"
          className="border-l-2 border-rohe bg-linen px-6 py-5 text-lg leading-relaxed text-ink"
        >
          Aitäh — sinu soov on Martani jõudnud. Ta vastab ise ja võimalikult
          kiiresti.
        </p>
      )}
      {seis && !seis.ok && (
        <p
          role="alert"
          className="border-l-2 border-gold-deep bg-linen px-6 py-5 text-lg leading-relaxed text-ink"
        >
          {seis.viga}
        </p>
      )}
    </form>
  );
}
