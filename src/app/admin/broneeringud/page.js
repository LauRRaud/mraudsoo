import Link from "next/link";
import { redirect } from "next/navigation";
import { kasSisseLoginud } from "@/admin/turve";
import { loeBroneeringud, onPostSeadistatud } from "@/broneering/salvesta";
import { markiLoetuksTegevus } from "../tegevused";

/*
  ADMIN — BRONEERIMISSOOVID.

  Soovid salvestatakse alati faili, ka siis kui e-kirja saatmine ei ole
  seadistatud. See leht on koht, kus Marta neid näeb — ilma selleta oleks
  seadistamata e-posti korral soov nähtamatu.

  Kaitse: paigutus kontrollib sessiooni, aga kontrollime siin uuesti, et
  kaitse ei sõltuks ühest failist.
*/

export const metadata = {
  title: "Broneerimissoovid",
  robots: { index: false, follow: false },
};

function vormindaAeg(iso) {
  return new Date(iso).toLocaleString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/*
  Mitu soovi korraga näidatakse. Fail hoiab kuni 500 kirjet ja kõigi korraga
  renderdamine teeb lehe raskeks — vanemad on ühe klõpsu kaugusel.
*/
const KORRAGA = 50;

export default async function BroneeringudLeht({ searchParams }) {
  if (!(await kasSisseLoginud())) redirect("/admin/login");

  const { koik } = await searchParams;
  const naitaKoiki = koik === "1";

  const soovid = await loeBroneeringud();
  const postToimib = onPostSeadistatud();
  const lugemata = soovid.filter((s) => !s.loetud).length;
  const nahtaval = naitaKoiki ? soovid : soovid.slice(0, KORRAGA);

  return (
    <div className="mx-auto w-full max-w-[1360px] px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="kuva text-3xl text-ink">
          Broneerimissoovid{" "}
          <span className="text-ink-faint">
            ({soovid.length}
            {lugemata > 0 ? `, ${lugemata} uut` : ""})
          </span>
        </h1>
        <Link
          href="/admin"
          className="mikro text-[0.7rem] text-ink-faint transition-colors hover:text-rohe"
        >
          ← Sisuhaldus
        </Link>
      </div>

      {!postToimib && (
        <p className="mt-6 border-l-2 border-gold-deep bg-bone px-6 py-4 text-base leading-relaxed text-ink-soft">
          E-kirja saatmine ei ole seadistatud, seega teavitust e-postile ei
          tule. Soovid salvestuvad siia ja on siit loetavad. Saatmise
          sisselülitamiseks vt README jaotist „E-posti seadistus”.
        </p>
      )}

      {soovid.length === 0 ? (
        <p className="mt-10 text-lg text-ink-soft">Soove ei ole veel tulnud.</p>
      ) : (
        <ul className="mt-10 space-y-5">
          {nahtaval.map((soov) => (
            <li
              key={soov.id}
              className={`border-l-2 bg-bone px-6 py-5 ${
                soov.loetud ? "border-sage" : "border-rohe"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="kuva text-xl text-ink">
                  {soov.nimi}
                  {!soov.loetud && (
                    <span className="ml-3 align-middle mikro text-[0.65rem] text-rohe">
                      uus
                    </span>
                  )}
                  {/*
                    Keelemärk ainult siis, kui soov EI tulnud eesti lehelt:
                    siis vajab ta ingliskeelset vastust. Vanadel soovidel
                    (enne kakskeelsust) välja ei ole ja märki ei teki.
                  */}
                  {soov.keel && soov.keel !== "et" && (
                    <span className="ml-3 align-middle mikro border border-gold-deep px-2 py-0.5 text-[0.6rem] text-gold-deep">
                      {String(soov.keel).toUpperCase()}
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink-faint">{vormindaAeg(soov.saabus)}</p>
              </div>

              <dl className="mt-4 grid gap-x-8 gap-y-2 text-base text-ink-soft sm:grid-cols-2">
                <div className="flex gap-3">
                  <dt className="text-ink-faint">E-post</dt>
                  <dd>
                    <a
                      href={`mailto:${soov.epost}`}
                      className="text-rohe underline underline-offset-4"
                    >
                      {soov.epost}
                    </a>
                  </dd>
                </div>
                {soov.telefon && (
                  <div className="flex gap-3">
                    <dt className="text-ink-faint">Telefon</dt>
                    <dd>{soov.telefon}</dd>
                  </div>
                )}
                {soov.teenus && (
                  <div className="flex gap-3">
                    <dt className="text-ink-faint">Teenus</dt>
                    <dd>{soov.teenus}</dd>
                  </div>
                )}
                {soov.kellaajad?.length > 0 && (
                  <div className="flex gap-3">
                    <dt className="text-ink-faint">Kellaaeg</dt>
                    <dd>{soov.kellaajad.join(", ")}</dd>
                  </div>
                )}
              </dl>

              {soov.kuupaevad?.length > 0 && (
                <p className="mt-3 text-base text-ink-soft">
                  <span className="text-ink-faint">Sobivad päevad: </span>
                  {soov.kuupaevad.join(" · ")}
                </p>
              )}

              <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-ink">
                {soov.sonum}
              </p>

              <form action={markiLoetuksTegevus} className="mt-5">
                <input type="hidden" name="id" value={soov.id} />
                <input
                  type="hidden"
                  name="loetud"
                  value={soov.loetud ? "" : "jah"}
                />
                <button
                  type="submit"
                  className="mikro border border-sage px-4 py-2 text-[0.7rem] text-ink-faint transition-colors hover:border-rohe hover:text-rohe"
                >
                  {soov.loetud ? "Märgi uueks" : "Märgi loetuks"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {!naitaKoiki && soovid.length > KORRAGA && (
        <p className="mt-8">
          <Link
            href="/admin/broneeringud?koik=1"
            className="mikro text-[0.7rem] text-ink-faint transition-colors hover:text-rohe"
          >
            {`Näita kõiki ${soovid.length} soovi`}
          </Link>
        </p>
      )}
    </div>
  );
}
