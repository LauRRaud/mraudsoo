import Link from "next/link";
import Ilmub from "@/components/Ilmub";
import { Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { varvija } from "@/sisu/tekstivarvid";

/* Pealkiri ja kirjeldus tulevad sisupuust, seepärast generateMetadata, mitte staatiline metadata */
export async function generateMetadata() {
  const sisu = await laeSisu();

  return {
    title: sisu.blogiLeht.hero.silt,
    description: sisu.blogiLeht.hero.tekst,
  };
}

/* Kuupäev eesti keeles: 3. august 2026 */
function vormindaKuupaev(iso) {
  return new Date(iso).toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Blogi() {
  const sisu = await laeSisu();
  const { blogiLeht, kontakt, postitused } = sisu;

  const jarjestatud = [...postitused].sort(
    (a, b) => new Date(b.kuupaev) - new Date(a.kuupaev)
  );

  /* Admin-lehelt antud üksikute tekstide värvid */
  const v = varvija(sisu.tekstiVarvid, "blogiLeht");

  return (
    <>
      <Sektsioon taust="bone" polsterdus="ohuke">
        <div className="max-w-3xl pt-6 sm:pt-10">
          <p className="sisene silt" style={v("hero.silt")}>
            {blogiLeht.hero.silt}
          </p>
          <h1
            className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-ink"
            style={{ "--viive": "90ms", ...v("hero.pealkiri") }}
          >
            {blogiLeht.hero.pealkiri}
          </h1>
          <div
            className="sisene joon mb-9 mt-9 max-w-28"
            style={{ "--viive": "200ms" }}
          />
          <div className="sisene" style={{ "--viive": "300ms" }}>
            <Tekst suur stiil={v("hero.tekst")}>
              {blogiLeht.hero.tekst}
            </Tekst>
          </div>
        </div>
      </Sektsioon>

      <Sektsioon taust="linen">
        {jarjestatud.length === 0 ? (
          /* Tühi seis — postitused lisatakse admin-lehelt */
          <Ilmub className="mx-auto max-w-2xl text-center">
            <div aria-hidden="true" className="pystjoon" />
            <p
              className="kuva mx-auto mt-8 text-[clamp(1.55rem,3.2vw,2.3rem)] leading-[1.3] text-ink"
              style={v("tyhiPealkiri")}
            >
              {blogiLeht.tyhiPealkiri}
            </p>
            <Tekst className="mx-auto mt-7 text-center" stiil={v("tyhiTekst")}>
              {blogiLeht.tyhiTekst}
            </Tekst>
            <a
              href={kontakt.substack}
              target="_blank"
              rel="noreferrer"
              className="group mikro mt-10 inline-flex items-center gap-3 text-gold-deep transition-colors hover:text-ink"
            >
              {blogiLeht.substackTekst}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </a>
          </Ilmub>
        ) : (
          <Ilmub ruhm as="ul">
            {jarjestatud.map((postitus) => (
              <li key={postitus.slug}>
                <Link
                  href={`/blogi/${postitus.slug}`}
                  className="group -mx-6 grid grid-cols-1 gap-x-12 gap-y-3 border-t border-gold/25 px-6 py-10 transition-colors duration-300 hover:bg-bone sm:grid-cols-[11rem_1fr] sm:py-12 lg:-mx-12 lg:px-12"
                >
                  <time
                    dateTime={postitus.kuupaev}
                    className="mikro text-ink-faint sm:pt-3"
                  >
                    {vormindaKuupaev(postitus.kuupaev)}
                  </time>

                  <div>
                    <h2 className="kuva text-[clamp(1.6rem,3.2vw,2.4rem)] text-ink transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-gold-deep">
                      {postitus.pealkiri}
                    </h2>
                    <p className="mt-3 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
                      {postitus.sissejuhatus}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </Ilmub>
        )}
      </Sektsioon>
    </>
  );
}
