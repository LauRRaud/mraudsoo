import Link from "next/link";
import "../globals.css";
import { kasSisseLoginud, onParoolSeatud } from "@/admin/turve";
import { Sisselogimisvorm } from "@/components/AdminToimeti";
import { koikFondiKlassid } from "@/kujundus/fondid";
import { kujundusCss, laeKujundus } from "@/kujundus/lae";
import { loguValjaTegevus } from "./tegevused";

/*
  ADMIN — JUURPAIGUTUS JA KAITSE.

  MIKS SEE ON JUURPAIGUTUS (<html> ja <body> siin):
  avaliku lehe juurpaigutus elab src/app/[keel]/layout.js all, sest <html lang>
  sõltub keelest. Kaks juurpaigutust tähendab, et admin peab oma <html>-i ise
  tegema — kolmandat kohta, mis mõlemat kataks, ei ole. Admin on ainult eesti
  keeles, seega lang="et" on siin kõva väärtus.

  Mis sellega muutus: admini kohal ei ole enam avaliku lehe päist ega jalust.
  Nende asemel on päises link „Vaata lehte”. Varem tulid nad juurpaigutusest
  kaasa ja seisid admini oma riba kohal.

  Ilmumisanimatsioonide skripti (html.js) siin EI OLE — admin ei kasuta
  ühtki `.ilmub` elementi ja ilma klassita on kõik kohe nähtav.

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

const ADMINI_MENYY = [
  { tee: "/admin", nimi: "Sisu" },
  { tee: "/admin/broneeringud", nimi: "Broneeringud" },
  { tee: "/admin/kalender", nimi: "Kalender" },
  { tee: "/admin/kujundus", nimi: "Kujundus" },
  { tee: "/admin/varukoopiad", nimi: "Varukoopiad" },
];

/*
  Ümbris, mis annab <html>-i ja <body> — sama nii lukus kui avatud admini all.

  Linen-pind on ümbrisel, mitte <body>-l: globals.css annab body'le bone-tausta
  ja utiliidiklass sellest siin üle ei kirjuta. Sama kuju oli ka varem, kui
  admin elas veel avaliku lehe juurpaigutuses.
*/
function AdminiRaam({ kujundus, children }) {
  return (
    <html lang="et" className={`${koikFondiKlassid} h-full antialiased`}>
      <head>
        <style>{kujundusCss(kujundus)}</style>
      </head>
      <body className="flex min-h-full flex-col">
        <div className="flex-1 bg-linen">{children}</div>
      </body>
    </html>
  );
}

export default async function AdminPaigutus({ children }) {
  const kujundus = await laeKujundus();
  const sees = await kasSisseLoginud();

  if (!sees) {
    return (
      <AdminiRaam kujundus={kujundus}>
        <Sisselogimisvorm lukus={!onParoolSeatud()} />
      </AdminiRaam>
    );
  }

  return (
    <AdminiRaam kujundus={kujundus}>
      <div className="mx-auto w-full max-w-[1360px] px-6 pt-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sage pb-4">
          <p className="nimi text-xl text-ink">Marta Raudsoo · sisuhaldus</p>

          <div className="flex flex-wrap items-center gap-6">
            <nav aria-label="Sisuhalduse menüü">
              <ul className="flex flex-wrap items-center gap-5">
                {ADMINI_MENYY.map((punkt) => (
                  <li key={punkt.tee}>
                    <Link
                      href={punkt.tee}
                      className="mikro text-[0.7rem] text-ink-soft transition-colors hover:text-rohe"
                    >
                      {punkt.nimi}
                    </Link>
                  </li>
                ))}
                {/*
                  Avalik leht on nüüd oma juurpaigutuses, seega tema päis siia
                  ei ulatu — link asendab selle.
                */}
                <li>
                  <Link
                    href="/"
                    className="mikro text-[0.7rem] text-ink-faint transition-colors hover:text-rohe"
                  >
                    Vaata lehte ↗
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Väljalogimine on tavaline vorm — töötab ka ilma JavaScriptita */}
            <form action={loguValjaTegevus}>
              <button
                type="submit"
                className="mikro border border-sage px-4 py-2 text-[0.7rem] text-ink-faint transition-colors hover:border-rohe hover:text-rohe"
              >
                Logi välja
              </button>
            </form>
          </div>
        </div>
      </div>

      {children}
    </AdminiRaam>
  );
}
