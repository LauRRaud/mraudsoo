import Link from "next/link";
import { kasSisseLoginud, onParoolSeatud } from "@/admin/turve";
import { Sisselogimisvorm } from "@/components/AdminToimeti";
import { loguValjaTegevus } from "./tegevused";

/*
  ADMIN — PAIGUTUS JA KAITSE.

  Serverikomponent: sessioon kontrollitakse ära enne, kui admin-sisu üldse
  renderdatakse.

  MIKS ME EI SUUNA redirect("/admin/login") PEALE:
  see paigutus katab kogu /admin/* haru, sealhulgas /admin/login. Kui me siit
  tingimusteta ümber suunaksime, tekiks login-lehel lõputu ümbersuunamise
  silmus. Next 16 paigutus ei pääse pathname'ile ligi (vt
  node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md
  — "Layouts do not re-render on navigation, so they do not access pathname"),
  seega ei saa erandit teekonna järgi teha.

  Lihtsaim toimiv variant: sisselogimata külastaja EI SAA kaitstud sisu kätte,
  sest paigutus ei renderda children'it üldse — selle asemel kuvab ta
  sisselogimisvormi. /admin/login jääb alles kui stabiilne aadress, kuhu saab
  lingi suunata; see leht kasutab sama vormikomponenti.

  Turvalisuse päris piir ei ole niikuinii siin, vaid serveritegevustes
  (tegevused.js), kus iga salvestamine kontrollib sessiooni uuesti.
*/

export const metadata = {
  title: "Sisuhaldus",
  /* Admin ei kuulu otsingumootoritesse */
  robots: { index: false, follow: false },
};

export default async function AdminPaigutus({ children }) {
  const sees = await kasSisseLoginud();

  if (!sees) {
    return (
      <div className="bg-linen">
        <Sisselogimisvorm lukus={!onParoolSeatud()} />
      </div>
    );
  }

  return (
    <div className="bg-linen">
      <div className="mx-auto w-full max-w-[1360px] px-6 pt-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-clay pb-4">
          <p className="nimi text-xl text-ink">Marta Raudsoo · sisuhaldus</p>

          <div className="flex flex-wrap items-center gap-6">
            <nav aria-label="Sisuhalduse menüü">
              <ul className="flex flex-wrap items-center gap-5">
                {[
                  { tee: "/admin", nimi: "Sisu" },
                  { tee: "/admin/broneeringud", nimi: "Broneeringud" },
                  { tee: "/admin/kalender", nimi: "Kalender" },
                ].map((punkt) => (
                  <li key={punkt.tee}>
                    <Link
                      href={punkt.tee}
                      className="mikro text-[0.7rem] text-ink-soft transition-colors hover:text-rohe"
                    >
                      {punkt.nimi}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Väljalogimine on tavaline vorm — töötab ka ilma JavaScriptita */}
            <form action={loguValjaTegevus}>
              <button
                type="submit"
                className="mikro border border-clay px-4 py-2 text-[0.7rem] text-ink-faint transition-colors hover:border-rohe hover:text-rohe"
              >
                Logi välja
              </button>
            </form>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
