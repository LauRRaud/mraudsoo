"use client";

import { useState, useTransition } from "react";
import Kalender, { vormindaKuupaev } from "@/components/Kalender";
import { Nupp } from "@/components/ui";
import { saadaBroneering } from "@/app/[keel]/broneerimine/tegevused";
import { liides } from "@/sisu/liides";

/*
  Vorm koostab e-kirja ja avab selle kasutaja e-posti programmis.
  See töötab kohe ja ilma lisateenusteta.

  Kalender ei näita Marta tegelikke vabu aegu — külastaja pakub omalt poolt
  sobivad ajad ja Marta kinnitab. Kui hiljem tuleb päris broneerimissüsteem,
  tuleb välja vahetada ainult funktsioon saada().

  Sisu (e-post, teenuste nimekiri, teekonna nimi) tuleb propsidena serverilt —
  see on kliendikomponent ja ei tohi sisulaadijat ise importida. Vormi enda
  sildid tulevad liidese sõnastikust (src/sisu/liides.js): need ei ole Marta
  sisu ja neid ei kujundata admin-lehel.

  Keel läheb ka serveritegevusele kaasa, et veateade tuleks samas keeles,
  mida külastaja loeb.
*/
export default function BroneeriVorm({
  keel = "et",
  email,
  teenused = [],
  teekonnaNimi,
  suletudPaevad = [],
  suletudNadalapaevad = [],
}) {
  const sonad = liides(keel);
  const kellaajaValikud = [
    { vaartus: sonad.hommik, vihje: "9–12" },
    { vaartus: sonad.parastlouna, vihje: "12–17" },
    { vaartus: sonad.ohtu, vihje: "17–20" },
  ];

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
      kuupaevad: kuupaevad.map((k) => vormindaKuupaev(k, keel)),
      kellaajad,
      keel,
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
          viga: sonad.saatmineEbaonnestus(email),
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
      <p className="text-lg leading-relaxed text-ink-soft">{sonad.vormiJuhis}</p>

      {/* Kontaktandmed */}
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor="nimi" className={siltStiil}>
            {sonad.nimi}
          </label>
          <input
            id="nimi"
            name="nimi"
            type="text"
            required
            autoComplete="name"
            className={`${valjaStiil} mt-3`}
            placeholder={sonad.nimeVihje}
          />
        </div>

        <div>
          <label htmlFor="epost" className={siltStiil}>
            {sonad.epost}
          </label>
          <input
            id="epost"
            name="epost"
            type="email"
            required
            autoComplete="email"
            className={`${valjaStiil} mt-3`}
            placeholder={sonad.epostiVihje}
          />
        </div>

        <div>
          <label htmlFor="telefon" className={siltStiil}>
            {sonad.telefon}
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            autoComplete="tel"
            className={`${valjaStiil} mt-3`}
            placeholder={sonad.telefoniVihje}
          />
        </div>

        <div>
          <label htmlFor="teenus" className={siltStiil}>
            {sonad.teenus}
          </label>
          <select
            id="teenus"
            name="teenus"
            defaultValue=""
            className={`${valjaStiil} mt-3 cursor-pointer`}
          >
            <option value="">{sonad.teenustEiTeaVeel}</option>
            {teenused.map((t) => (
              <option key={t.slug} value={t.nimi}>
                {t.nimi}
              </option>
            ))}
            {teekonnaNimi ? (
              <option value={teekonnaNimi}>
                {teekonnaNimi} ({sonad.kolmSammu})
              </option>
            ) : null}
          </select>
        </div>
      </div>

      {/* Kalender */}
      <fieldset>
        <legend className={siltStiil}>{sonad.millalSobiks}</legend>
        {/* Selgitus jääb lühikeseks: kuidas valida. Ülejäänu lepitakse kirjas kokku. */}
        <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          {sonad.kalendriJuhis}
        </p>

        <div className="mt-8 max-w-md border border-gold/25 bg-bone p-5 sm:p-7">
          <Kalender
            keel={keel}
            valitud={kuupaevad}
            onMuuda={setKuupaevad}
            suletudPaevad={suletudPaevad}
            suletudNadalapaevad={suletudNadalapaevad}
          />
        </div>
      </fieldset>

      {/* Kellaaeg */}
      <fieldset>
        <legend className={siltStiil}>{sonad.misKellaaeg}</legend>
        <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          {sonad.kellaajaJuhis}
        </p>
        {/* Valikunupud on nupud, seega rohelised — kuld jääb joonteks ja siltideks */}
        <div className="mt-6 flex flex-wrap gap-3">
          {kellaajaValikud.map((aeg) => {
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
          {sonad.misPuudutab}
        </label>
        <textarea
          id="sonum"
          name="sonum"
          rows={5}
          required
          className={`${valjaStiil} mt-3 resize-y`}
          placeholder={sonad.sonumiVihje}
        />
      </div>

      {/*
        Peibutusväli. Inimene ei näe seda ega saa sinna kursoriga sattuda;
        automaatne täitja täidab ära ja reedab end sellega.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="veebileht">{sonad.peibutuseSilt}</label>
        <input id="veebileht" name="veebileht" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Nupp type="submit" disabled={saadab} nool={!saadab}>
          {saadab ? sonad.saadab : sonad.saada}
        </Nupp>
      </div>

      {/* Tagasiside pärast saatmist */}
      {seis?.ok && (
        <p
          role="status"
          className="border-l-2 border-rohe bg-linen px-6 py-5 text-lg leading-relaxed text-ink"
        >
          {sonad.aitah}
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
