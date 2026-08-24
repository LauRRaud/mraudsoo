"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { laeTaustaPiltTegevus } from "@/app/admin/tegevused";
import { fotograafiaPildiAadress } from "@/sisu/fotograafiaGalerii";

const VALI =
  "w-full border border-sage bg-white px-3 py-2.5 text-base text-ink outline-none transition-colors focus:border-rohe";
const NUPP =
  "mikro border border-sage px-3 py-2 text-[0.65rem] text-ink-faint transition-colors hover:border-rohe hover:text-rohe disabled:cursor-not-allowed disabled:opacity-40";
const SUURIM_PILT = 8 * 1024 * 1024;

export default function FotograafiaGaleriiHaldus({
  galerii,
  galeriiEn,
  muuda,
  muudaEn,
  keelatud = false,
}) {
  const pildid = Array.isArray(galerii?.pildid) ? galerii.pildid : [];
  const pildidEn = Array.isArray(galeriiEn?.pildid) ? galeriiEn.pildid : [];
  const failiValija = useRef(null);
  const vahetatav = useRef(null);
  const [laeb, alustaLaadimist] = useTransition();
  const [teade, setTeade] = useState(null);

  const eiTohiMuuta = keelatud || laeb;

  function muudaValja(voti, vaartus) {
    muuda({ ...galerii, [voti]: vaartus });
  }

  function muudaValjaEn(voti, vaartus) {
    muudaEn({ ...galeriiEn, [voti]: vaartus });
  }

  function muudaPilte(uued, uuedEn = pildidEn) {
    muuda({ ...galerii, pildid: uued });
    muudaEn({ ...galeriiEn, pildid: uuedEn });
    setTeade(null);
  }

  function muudaPilti(indeks, muudatus) {
    muudaPilte(
      pildid.map((pilt, jrk) =>
        jrk === indeks ? { ...pilt, ...muudatus } : pilt,
      ),
    );
  }

  function muudaPiltiEn(indeks, muudatus) {
    muudaPilte(
      pildid,
      pildidEn.map((pilt, jrk) =>
        jrk === indeks ? { ...pilt, ...muudatus } : pilt,
      ),
    );
  }

  function liiguta(indeks, suund) {
    const siht = indeks + suund;
    if (siht < 0 || siht >= pildid.length) return;
    const koopia = pildid.slice();
    [koopia[indeks], koopia[siht]] = [koopia[siht], koopia[indeks]];
    const koopiaEn = pildidEn.slice();
    [koopiaEn[indeks], koopiaEn[siht]] = [koopiaEn[siht], koopiaEn[indeks]];
    muudaPilte(koopia, koopiaEn);
  }

  function valiFail(indeks = null) {
    vahetatav.current = indeks;
    failiValija.current?.click();
  }

  function laeFail(fail) {
    if (!fail) return;
    if (fail.size > SUURIM_PILT) {
      setTeade({
        ok: false,
        tekst: "Pilt on suurem kui 8 MB. Vali väiksem JPG-, PNG- või WEBP-fail.",
      });
      return;
    }

    const vormiAndmed = new FormData();
    vormiAndmed.append("pilt", fail);

    alustaLaadimist(async () => {
      const vastus = await laeTaustaPiltTegevus(vormiAndmed);
      if (!vastus?.ok) {
        setTeade({
          ok: false,
          tekst: vastus?.viga ?? "Pilti ei õnnestunud üles laadida.",
        });
        return;
      }

      const indeks = vahetatav.current;
      if (Number.isInteger(indeks) && pildid[indeks]) {
        muudaPilte(
          pildid.map((pilt, jrk) =>
            jrk === indeks ? { ...pilt, fail: vastus.nimi } : pilt,
          ),
          pildidEn.map((pilt, jrk) =>
            jrk === indeks ? { ...pilt, fail: vastus.nimi } : pilt,
          ),
        );
        setTeade({
          ok: true,
          tekst: "Foto on vahetatud. Avalikul lehel jõustub see pärast „Salvesta” vajutamist.",
        });
      } else {
        const uusPilt = {
          fail: vastus.nimi,
          alt: "",
          kuvasuhe: "pustine",
        };
        muudaPilte([...pildid, uusPilt], [...pildidEn, { ...uusPilt }]);
        setTeade({
          ok: true,
          tekst: "Foto on lisatud. Kirjuta sellele kirjeldus ja vajuta siis „Salvesta”.",
        });
      }
      vahetatav.current = null;
    });
  }

  return (
    <div className="space-y-8">
      <div className="border-l-2 border-gold-deep bg-linen px-5 py-4">
        <p className="text-[0.9rem] leading-relaxed text-ink-soft">
          Need on fotograafia teenuse all kuvatavad Marta fotod. Pildi lisamine
          või vahetamine laeb faili kohe üles, kuid galerii muutub avalikul lehel
          alles siis, kui vajutad lehe all „Salvesta”.
        </p>
      </div>

      <div className="space-y-5">
        {[
          { voti: "pealkiri", nimi: "Pealkiri", pikk: false },
          { voti: "kirjeldus", nimi: "Kirjeldus", pikk: true },
        ].map((vali) => (
          <div
            key={vali.voti}
            className="border-l-2 border-sage bg-linen/45 px-3 py-3 sm:px-4"
          >
            <p className="mikro text-[0.7rem] text-ink-faint">{vali.nimi}</p>
            <div className="mt-2 grid gap-3 lg:grid-cols-2">
              <div>
                <label
                  htmlFor={`fotograafia-${vali.voti}-et`}
                  className="mb-1.5 block text-[0.76rem] font-medium text-rohe"
                >
                  Eesti tekst
                </label>
                {vali.pikk ? (
                  <textarea
                    id={`fotograafia-${vali.voti}-et`}
                    rows={3}
                    value={galerii?.[vali.voti] ?? ""}
                    disabled={keelatud}
                    onChange={(sundmus) =>
                      muudaValja(vali.voti, sundmus.target.value)
                    }
                    className={`${VALI} resize-y`}
                  />
                ) : (
                  <input
                    id={`fotograafia-${vali.voti}-et`}
                    type="text"
                    value={galerii?.[vali.voti] ?? ""}
                    disabled={keelatud}
                    onChange={(sundmus) =>
                      muudaValja(vali.voti, sundmus.target.value)
                    }
                    className={VALI}
                  />
                )}
              </div>
              <div className="border-l-2 border-gold/50 pl-3 lg:border-l lg:pl-4">
                <label
                  htmlFor={`fotograafia-${vali.voti}-en`}
                  className="mb-1.5 block text-[0.76rem] font-medium text-gold-deep"
                >
                  Inglise tõlge
                </label>
                {vali.pikk ? (
                  <textarea
                    id={`fotograafia-${vali.voti}-en`}
                    rows={3}
                    value={galeriiEn?.[vali.voti] ?? ""}
                    disabled={keelatud}
                    onChange={(sundmus) =>
                      muudaValjaEn(vali.voti, sundmus.target.value)
                    }
                    className={`${VALI} resize-y`}
                  />
                ) : (
                  <input
                    id={`fotograafia-${vali.voti}-en`}
                    type="text"
                    value={galeriiEn?.[vali.voti] ?? ""}
                    disabled={keelatud}
                    onChange={(sundmus) =>
                      muudaValjaEn(vali.voti, sundmus.target.value)
                    }
                    className={VALI}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-sage p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="kuva text-xl text-ink">Fotod</h3>
            <p className="mt-1 text-[0.85rem] text-ink-faint">
              Järjekord siin on sama mis avalikus galeriis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => valiFail()}
            disabled={eiTohiMuuta}
            className="mikro border border-rohe px-4 py-2.5 text-[0.7rem] text-rohe transition-colors hover:bg-rohe hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {laeb ? "Laen fotot …" : "Lisa foto"}
          </button>
        </div>

        <input
          ref={failiValija}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(sundmus) => {
            laeFail(sundmus.target.files?.[0]);
            sundmus.target.value = "";
          }}
        />

        {pildid.length === 0 ? (
          <p className="mt-6 border border-dashed border-sage px-4 py-8 text-center text-ink-faint">
            Galeriis ei ole praegu ühtegi fotot.
          </p>
        ) : (
          <ol className="mt-6 grid gap-5 md:grid-cols-2">
            {pildid.map((pilt, indeks) => {
              const aadress = fotograafiaPildiAadress(pilt?.fail);
              return (
                <li key={`${pilt?.fail}-${indeks}`} className="border border-sage bg-linen p-4">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sage/30">
                    {aadress ? (
                      <Image
                        src={aadress}
                        alt=""
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-ink-faint">
                        Pildifaili ei leitud
                      </div>
                    )}
                    <span className="absolute left-2 top-2 bg-mets/90 px-2 py-1 text-xs text-luu">
                      {indeks + 1}
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="mikro text-[0.65rem] text-ink-faint">
                        Pildi kirjeldus
                      </p>
                      <div className="mt-2 grid gap-3">
                        <div>
                          <label
                            htmlFor={`fotograafia-alt-et-${indeks}`}
                            className="mb-1 block text-xs font-medium text-rohe"
                          >
                            Eesti tekst
                          </label>
                          <input
                            id={`fotograafia-alt-et-${indeks}`}
                            type="text"
                            value={pilt?.alt ?? ""}
                            disabled={keelatud}
                            onChange={(sundmus) =>
                              muudaPilti(indeks, { alt: sundmus.target.value })
                            }
                            className={VALI}
                          />
                        </div>
                        <div className="border-l-2 border-gold/50 pl-3">
                          <label
                            htmlFor={`fotograafia-alt-en-${indeks}`}
                            className="mb-1 block text-xs font-medium text-gold-deep"
                          >
                            Inglise tõlge
                          </label>
                          <input
                            id={`fotograafia-alt-en-${indeks}`}
                            type="text"
                            value={pildidEn[indeks]?.alt ?? ""}
                            disabled={keelatud}
                            onChange={(sundmus) =>
                              muudaPiltiEn(indeks, { alt: sundmus.target.value })
                            }
                            className={VALI}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`fotograafia-kuvasuhe-${indeks}`}
                        className="mikro block text-[0.65rem] text-ink-faint"
                      >
                        Kaadri kuju
                      </label>
                      <select
                        id={`fotograafia-kuvasuhe-${indeks}`}
                        value={pilt?.kuvasuhe === "lai" ? "lai" : "pustine"}
                        disabled={keelatud}
                        onChange={(sundmus) => {
                          const kuvasuhe = sundmus.target.value;
                          muudaPilte(
                            pildid.map((kirje, jrk) =>
                              jrk === indeks ? { ...kirje, kuvasuhe } : kirje,
                            ),
                            pildidEn.map((kirje, jrk) =>
                              jrk === indeks ? { ...kirje, kuvasuhe } : kirje,
                            ),
                          );
                        }}
                        className={`${VALI} mt-2`}
                      >
                        <option value="pustine">Püstine</option>
                        <option value="lai">Lai</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => liiguta(indeks, -1)}
                      disabled={eiTohiMuuta || indeks === 0}
                      aria-label={`Liiguta foto ${indeks + 1} varasemaks`}
                      className={NUPP}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => liiguta(indeks, 1)}
                      disabled={eiTohiMuuta || indeks === pildid.length - 1}
                      aria-label={`Liiguta foto ${indeks + 1} hilisemaks`}
                      className={NUPP}
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={() => valiFail(indeks)}
                      disabled={eiTohiMuuta}
                      className={NUPP}
                    >
                      Vaheta foto
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        muudaPilte(
                          pildid.filter((_, jrk) => jrk !== indeks),
                          pildidEn.filter((_, jrk) => jrk !== indeks),
                        )
                      }
                      disabled={eiTohiMuuta}
                      className={NUPP}
                    >
                      Eemalda
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <p
          aria-live="polite"
          className={`mt-5 min-h-6 text-[0.9rem] ${
            teade?.ok === false ? "text-gold-deep" : "text-ink-faint"
          }`}
        >
          {teade?.tekst}
        </p>
      </div>
    </div>
  );
}
