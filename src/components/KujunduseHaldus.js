"use client";

import { useState, useTransition } from "react";
import { salvestaKujundusTegevus } from "@/app/admin/tegevused";
import {
  SUURUSE_NIMED,
  TAHEVAHE_NIMED,
  VARVI_RUHMAD,
} from "@/kujundus/vaikimisi";

/*
  ADMIN — KUJUNDUS.

  Kontrastihoiatus on siin tahtlikult HOIATUS, mitte keeld: Marta võib teha
  valiku, mis meile ei meeldi, aga ta peab teadma, kui tekst muutub raskesti
  loetavaks. Arv on WCAG kontrastisuhe.
*/

/* Suhteline heledus — WCAG valem */
function heledus(hex) {
  const t = hex.replace("#", "");
  const taielik =
    t.length === 3
      ? t
          .split("")
          .map((m) => m + m)
          .join("")
      : t;
  const kanalid = [0, 2, 4].map((i) => {
    const v = parseInt(taielik.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * kanalid[0] + 0.7152 * kanalid[1] + 0.0722 * kanalid[2];
}

function kontrast(a, b) {
  const [suur, vaike] = [heledus(a), heledus(b)].sort((x, y) => y - x);
  return (suur + 0.05) / (vaike + 0.05);
}

/*
  Paarid, mida kontrollime. Iga tekstivärv oma tavalise tausta vastu.
  `suur` tähendab, et seda kasutatakse ainult suures kirjas, kus WCAG nõue
  on 3:1, mitte 4.5:1.
*/
const KONTROLLID = [
  { tekst: "ink", taust: "bone", nimi: "Pealkirjad lehe taustal" },
  { tekst: "inkSoft", taust: "bone", nimi: "Põhitekst lehe taustal" },
  { tekst: "inkFaint", taust: "bone", nimi: "Kõrvaline tekst lehe taustal" },
  { tekst: "goldDeep", taust: "bone", nimi: "Sildid ja lingid lehe taustal" },
  { tekst: "gold", taust: "bone", nimi: "Kuldsed pealkirjad", suur: true },
  { tekst: "inkSoft", taust: "linen", nimi: "Põhitekst vahelduval paneelil" },
  { tekst: "inkSoft", taust: "sage", nimi: "Põhitekst rõhutatud paneelil" },
  { tekst: "luu", taust: "mets", nimi: "Tekst tumedal sektsioonil" },
  { tekst: "kuldHele", taust: "mets", nimi: "Kuld tumedal sektsioonil" },
  { tekst: "luu", taust: "metsSyva", nimi: "Tekst jaluses" },
];

export default function KujunduseHaldus({ algseis, kuvaFondid, tekstiFondid }) {
  const [kujundus, setKujundus] = useState(algseis);
  const [salvestab, alustaSalvestamist] = useTransition();
  const [teade, setTeade] = useState(null);

  const muutunud = JSON.stringify(kujundus) !== JSON.stringify(algseis);

  function muudaVarv(votme, vaartus) {
    setTeade(null);
    setKujundus((e) => ({ ...e, varvid: { ...e.varvid, [votme]: vaartus } }));
  }

  function muudaSuurus(votme, vaartus) {
    setTeade(null);
    setKujundus((e) => ({
      ...e,
      suurused: { ...e.suurused, [votme]: Number(vaartus) },
    }));
  }

  function muudaTahevahe(votme, vaartus) {
    setTeade(null);
    setKujundus((e) => ({
      ...e,
      tahevahed: { ...e.tahevahed, [votme]: Number(vaartus) },
    }));
  }

  function muudaFont(liik, id) {
    setTeade(null);
    setKujundus((e) => ({ ...e, fondid: { ...e.fondid, [liik]: id } }));
  }

  function salvesta() {
    alustaSalvestamist(async () => {
      const vastus = await salvestaKujundusTegevus(kujundus);
      setTeade(
        vastus.ok
          ? { ok: true, tekst: "Salvestatud. Värskenda lehte, et muudatust näha." }
          : { ok: false, tekst: vastus.viga },
      );
    });
  }

  function lahtesta() {
    setTeade(null);
    setKujundus(algseis);
  }

  const hoiatused = KONTROLLID.map((k) => {
    const suhe = kontrast(kujundus.varvid[k.tekst], kujundus.varvid[k.taust]);
    const noue = k.suur ? 3 : 4.5;
    return { ...k, suhe, korras: suhe >= noue, noue };
  }).filter((k) => !k.korras);

  const nupuStiil =
    "border px-4 py-3 text-left transition-colors";

  return (
    <div className="max-w-3xl">
      {/* Fondid */}
      <section>
        <h2 className="kuva text-2xl text-ink">Kirjatüübid</h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          Valik on ette laaditud, sest fondid pannakse serverisse kaasa — nii on
          leht kiire ja Google ei jälgi külastajaid. Uue fondi lisamine nimekirja
          on väike koodimuudatus.
        </p>

        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mikro text-ink-faint">Pealkirjad</p>
            <div className="mt-3 space-y-2">
              {kuvaFondid.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => muudaFont("kuva", f.id)}
                  aria-pressed={kujundus.fondid.kuva === f.id}
                  className={`${nupuStiil} block w-full ${
                    kujundus.fondid.kuva === f.id
                      ? "border-rohe bg-rohe/10"
                      : "border-sage hover:border-rohe"
                  }`}
                >
                  <span
                    className="block text-xl text-ink"
                    style={{ fontFamily: `var(${f.muutuja})` }}
                  >
                    {f.nimi}
                  </span>
                  <span className="text-sm text-ink-faint">{f.kirjeldus}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mikro text-ink-faint">Põhitekst</p>
            <div className="mt-3 space-y-2">
              {tekstiFondid.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => muudaFont("tekst", f.id)}
                  aria-pressed={kujundus.fondid.tekst === f.id}
                  className={`${nupuStiil} block w-full ${
                    kujundus.fondid.tekst === f.id
                      ? "border-rohe bg-rohe/10"
                      : "border-sage hover:border-rohe"
                  }`}
                >
                  <span
                    className="block text-lg text-ink"
                    style={{ fontFamily: `var(${f.muutuja})` }}
                  >
                    {f.nimi}
                  </span>
                  <span className="text-sm text-ink-faint">{f.kirjeldus}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*
        Värvid rühmadena. Rühmita oli see seitseteist ühesugust ruutu ja
        muutmine käis katse-eksituse teel — eriti heledad pinnad, mida oli
        varem kuus tükki üksteisest protsendi kaugusel.
      */}
      <section className="mt-14">
        <h2 className="kuva text-2xl text-ink">Värvid</h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          Värvid on rühmades selle järgi, mis asja nad on. Iga värvi all seisab,
          kus seda lehel näeb.
        </p>

        <div className="mt-8 space-y-12">
          {VARVI_RUHMAD.map((ruhm) => (
            <div key={ruhm.nimi}>
              <h3 className="silt">{ruhm.nimi}</h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
                {ruhm.selgitus}
              </p>

              <div className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {ruhm.varvid.map(({ votme, nimi, kus }) => (
                  <label key={votme} className="flex items-center gap-4">
                    <input
                      type="color"
                      value={kujundus.varvid[votme]}
                      onChange={(e) => muudaVarv(votme, e.target.value)}
                      className="h-11 w-14 shrink-0 cursor-pointer border border-sage bg-transparent p-1"
                    />
                    <span className="flex-1">
                      <span className="block text-base text-ink">{nimi}</span>
                      <span className="block text-sm leading-snug text-ink-faint">
                        {kus}
                      </span>
                      <span className="block text-sm text-ink-faint">
                        {kujundus.varvid[votme]}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hoiatused.length > 0 && (
          <div className="mt-8 border-l-2 border-gold-deep bg-bone px-6 py-5">
            <p className="text-base text-ink">
              Need kombinatsioonid on raskesti loetavad:
            </p>
            <ul className="mt-3 space-y-1">
              {hoiatused.map((h) => (
                <li key={h.nimi} className="text-base text-ink-soft">
                  {h.nimi} — kontrast {h.suhe.toFixed(1)}:1, vaja vähemalt{" "}
                  {h.noue}:1
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-faint">
              Saad ikkagi salvestada — see on hoiatus, mitte keeld.
            </p>
          </div>
        )}
      </section>

      {/* Suurused */}
      <section className="mt-14">
        <h2 className="kuva text-2xl text-ink">Tekstisuurused</h2>
        <div className="mt-6 space-y-6">
          {Object.entries(SUURUSE_NIMED).map(([votme, nimi]) => (
            <label key={votme} className="block">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-base text-ink">{nimi}</span>
                <span className="text-base text-ink-faint">
                  {kujundus.suurused[votme]} px
                </span>
              </span>
              <input
                type="range"
                min={10}
                max={40}
                step={1}
                value={kujundus.suurused[votme]}
                onChange={(e) => muudaSuurus(votme, e.target.value)}
                className="mt-2 w-full accent-rohe"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Tähevahed */}
      <section className="mt-14">
        <h2 className="kuva text-2xl text-ink">Tähevahed</h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          Kui hõredalt on tähed suurtähtedes kirjutatud siltidel ja nuppudel.
        </p>
        <div className="mt-6 space-y-6">
          {Object.entries(TAHEVAHE_NIMED).map(([votme, nimi]) => (
            <label key={votme} className="block">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-base text-ink">{nimi}</span>
                <span className="text-base text-ink-faint">
                  {kujundus.tahevahed[votme].toFixed(2)} em
                </span>
              </span>
              <input
                type="range"
                min={0}
                max={0.4}
                step={0.01}
                value={kujundus.tahevahed[votme]}
                onChange={(e) => muudaTahevahe(votme, e.target.value)}
                className="mt-2 w-full accent-rohe"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={salvesta}
          disabled={salvestab || !muutunud}
          className="border border-rohe bg-rohe px-9 py-4 mikro text-white transition-colors hover:border-rohe-hele hover:bg-rohe-hele disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvestab ? "Salvestan …" : "Salvesta"}
        </button>

        {muutunud && !salvestab && (
          <button
            type="button"
            onClick={lahtesta}
            className="mikro border border-sage px-4 py-3 text-[0.7rem] text-ink-faint transition-colors hover:border-rohe hover:text-rohe"
          >
            Võta muudatused tagasi
          </button>
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
