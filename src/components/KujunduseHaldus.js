"use client";

import { useRef, useState, useTransition } from "react";
import {
  kustutaTaustaPiltTegevus,
  laeTaustaPiltTegevus,
  salvestaKujundusTegevus,
} from "@/app/admin/tegevused";
import {
  SUURUSE_NIMED,
  TAHEVAHE_NIMED,
  VARVI_RUHMAD,
} from "@/kujundus/vaikimisi";
import { ASETUSE_NIMED, TAUSTA_SEKTSIOONID } from "@/kujundus/sektsioonid";

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

export default function KujunduseHaldus({
  algseis,
  kuvaFondid,
  tekstiFondid,
  algsedPildid,
}) {
  const [kujundus, setKujundus] = useState(algseis);
  const [salvestab, alustaSalvestamist] = useTransition();
  const [teade, setTeade] = useState(null);

  /* Pildid elavad serveris, mitte kujunduses — üleslaadimine jõustub kohe */
  const [pildid, setPildid] = useState(algsedPildid);
  const [laebPilti, alustaLaadimist] = useTransition();
  const [avatud, setAvatud] = useState(null);
  const pildiValija = useRef(null);

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

  /*
    TAUSTAPILDID. Kirje tekib alles pildi valimisel ja kaob eemaldamisel —
    nii ei kogune kujundusse ridu sektsioonide kohta, millel tausta ei ole.
  */
  function muudaTaust(votme, muudatus) {
    setTeade(null);
    setKujundus((e) => {
      /* Uus taust algab katteta — valitud pilt paistab kohe täies tugevuses */
      const praegune = e.taustad[votme] ?? {
        pilt: "",
        kate: 0,
        asetus: "keskel",
      };

      return { ...e, taustad: { ...e.taustad, [votme]: { ...praegune, ...muudatus } } };
    });
  }

  function eemaldaTaust(votme) {
    setTeade(null);
    setKujundus((e) => {
      const taustad = { ...e.taustad };
      delete taustad[votme];
      return { ...e, taustad };
    });
  }

  function laeUusPilt(fail) {
    if (!fail) return;

    const vormiAndmed = new FormData();
    vormiAndmed.append("pilt", fail);

    alustaLaadimist(async () => {
      const vastus = await laeTaustaPiltTegevus(vormiAndmed);

      if (!vastus.ok) {
        setTeade({ ok: false, tekst: vastus.viga });
        return;
      }

      setPildid(vastus.pildid);
      setTeade({
        ok: true,
        tekst: "Pilt on üleval. Vali see nüüd mõnele sektsioonile.",
      });
    });
  }

  function kustutaPilt(nimi) {
    alustaLaadimist(async () => {
      const vastus = await kustutaTaustaPiltTegevus(nimi);

      if (!vastus.ok) {
        setTeade({ ok: false, tekst: vastus.viga });
        return;
      }

      setPildid(vastus.pildid);
      setTeade({ ok: true, tekst: "Pilt on kustutatud." });
    });
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

      {/*
        TAUSTAPILDID.

        Kaks osa: ülal pildikogu (üleslaadimine jõustub kohe, sest fail läheb
        serverisse), all sektsioonide nimekiri lehtede kaupa. Sektsioonile
        antud pilt salvestub alles „Salvesta” nupuga nagu kogu muu kujundus.
      */}
      <section className="mt-14">
        <h2 className="kuva text-2xl text-ink">Taustapildid</h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft">
          Sektsiooni taustaks võib värvi asemel olla pilt. Valitud pilt paistab
          täies tugevuses; liuguriga saab sektsiooni oma värvi pildi peale
          tagasi tuua, kui tekst muidu ei loe.
        </p>

        {/* Pildikogu */}
        <div className="mt-8 border border-sage p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="silt">Pildid</h3>
            <button
              type="button"
              onClick={() => pildiValija.current?.click()}
              disabled={laebPilti}
              className="mikro border border-rohe px-4 py-2 text-[0.7rem] text-rohe transition-colors hover:bg-rohe hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {laebPilti ? "Laen …" : "Lae pilt üles"}
            </button>
          </div>

          <input
            ref={pildiValija}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              laeUusPilt(e.target.files?.[0]);
              /* Sama faili teistkordne valik peab ka sündmuse tekitama */
              e.target.value = "";
            }}
          />

          {pildid.length === 0 ? (
            <p className="mt-4 text-base text-ink-faint">
              Ühtegi pilti ei ole veel üleval. JPG, PNG või WEBP, kuni 8 MB.
            </p>
          ) : (
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {pildid.map((nimi) => (
                <li key={nimi} className="group relative">
                  {/* Pisipilt on taustana, et kuvasuhe ei nõuaks mõõtude teadmist */}
                  <div
                    className="aspect-[4/3] w-full border border-sage bg-cover bg-center"
                    style={{ backgroundImage: `url("/taustad/${nimi}")` }}
                  />
                  <button
                    type="button"
                    onClick={() => kustutaPilt(nimi)}
                    disabled={laebPilti}
                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-bone/90 text-ink-faint opacity-0 transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <span className="sr-only">Kustuta pilt</span>
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sektsioonid lehtede kaupa */}
        <div className="mt-8 space-y-3">
          {TAUSTA_SEKTSIOONID.map((ruhm) => {
            const piltidega = ruhm.sektsioonid.filter(
              (s) => kujundus.taustad[s.votme],
            ).length;

            return (
              <details
                key={ruhm.leht}
                open={piltidega > 0}
                className="border border-sage"
              >
                <summary className="flex cursor-pointer items-baseline justify-between gap-4 px-5 py-4">
                  <span className="text-base text-ink">{ruhm.leht}</span>
                  <span className="text-sm text-ink-faint">
                    {piltidega > 0
                      ? `${piltidega} pildiga`
                      : `${ruhm.sektsioonid.length} sektsiooni`}
                  </span>
                </summary>

                <div className="border-t border-sage px-5 py-4">
                  {ruhm.sektsioonid.map((sektsioon) => {
                    const taust = kujundus.taustad[sektsioon.votme];
                    const lahti = avatud === sektsioon.votme;

                    return (
                      <div
                        key={sektsioon.votme}
                        className="border-b border-sage/60 py-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="h-12 w-16 shrink-0 border border-sage bg-cover bg-center"
                            style={
                              taust
                                ? { backgroundImage: `url("/taustad/${taust.pilt}")` }
                                : undefined
                            }
                          />
                          <div className="flex-1">
                            <p className="text-base text-ink">{sektsioon.nimi}</p>
                            <p className="text-sm text-ink-faint">
                              {taust
                                ? `Värvi pildi peal ${Math.round(taust.kate * 100)}% · ${ASETUSE_NIMED[taust.asetus]}`
                                : "Taustaks on värv"}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setAvatud(lahti ? null : sektsioon.votme)
                              }
                              disabled={pildid.length === 0}
                              className="mikro border border-sage px-3 py-2 text-[0.7rem] text-ink-faint transition-colors hover:border-rohe hover:text-rohe disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {lahti ? "Sulge" : taust ? "Muuda" : "Vali pilt"}
                            </button>
                            {taust && (
                              <button
                                type="button"
                                onClick={() => {
                                  eemaldaTaust(sektsioon.votme);
                                  setAvatud(null);
                                }}
                                className="mikro border border-sage px-3 py-2 text-[0.7rem] text-ink-faint transition-colors hover:border-rohe hover:text-rohe"
                              >
                                Võta maha
                              </button>
                            )}
                          </div>
                        </div>

                        {lahti && (
                          <div className="mt-4 bg-linen p-4">
                            <p className="silt">Pilt</p>
                            <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                              {pildid.map((nimi) => (
                                <li key={nimi}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      muudaTaust(sektsioon.votme, { pilt: nimi })
                                    }
                                    aria-pressed={taust?.pilt === nimi}
                                    className={`aspect-[4/3] w-full border-2 bg-cover bg-center transition-colors ${
                                      taust?.pilt === nimi
                                        ? "border-rohe"
                                        : "border-transparent hover:border-rohe/40"
                                    }`}
                                    style={{
                                      backgroundImage: `url("/taustad/${nimi}")`,
                                    }}
                                  >
                                    <span className="sr-only">Vali see pilt</span>
                                  </button>
                                </li>
                              ))}
                            </ul>

                            {taust && (
                              <>
                                <label className="mt-6 block">
                                  <span className="flex items-baseline justify-between gap-4">
                                    <span className="text-base text-ink">
                                      Kui palju värvi pildi peale
                                    </span>
                                    <span className="text-base text-ink-faint">
                                      {Math.round(taust.kate * 100)} %
                                    </span>
                                  </span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={Math.round(taust.kate * 100)}
                                    onChange={(e) =>
                                      muudaTaust(sektsioon.votme, {
                                        kate: Number(e.target.value) / 100,
                                      })
                                    }
                                    className="mt-2 w-full accent-rohe"
                                  />
                                  <span className="mt-1 block text-sm text-ink-faint">
                                    0% on pilt täies tugevuses, 100% toob
                                    paneeli värvi täiesti tagasi. Kui tekst
                                    pildi peal ei loe, keera seda ülespoole.
                                  </span>
                                </label>

                                <div className="mt-5">
                                  <p className="text-base text-ink">
                                    Mis osa pildist paistab
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {Object.entries(ASETUSE_NIMED).map(
                                      ([id, nimi]) => (
                                        <button
                                          key={id}
                                          type="button"
                                          onClick={() =>
                                            muudaTaust(sektsioon.votme, {
                                              asetus: id,
                                            })
                                          }
                                          aria-pressed={taust.asetus === id}
                                          className={`mikro border px-4 py-2 text-[0.7rem] transition-colors ${
                                            taust.asetus === id
                                              ? "border-rohe bg-rohe text-white"
                                              : "border-sage text-ink-faint hover:border-rohe hover:text-rohe"
                                          }`}
                                        >
                                          {nimi}
                                        </button>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
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
