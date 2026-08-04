import Link from "next/link";
import { Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";

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

  return (
    <>
      <Sektsioon taust="bone">
        <div className="max-w-3xl">
          <Pealkiri silt={blogiLeht.hero.silt} tase="h1">
            {blogiLeht.hero.pealkiri}
          </Pealkiri>
          <div className="joon my-10 max-w-24" />
          <Tekst suur>{blogiLeht.hero.tekst}</Tekst>
        </div>
      </Sektsioon>

      <Sektsioon taust="linen">
        {jarjestatud.length === 0 ? (
          /* Tühi seis — postitused lisatakse admin-lehelt */
          <div className="max-w-2xl">
            <p className="kuva text-[clamp(1.5rem,3.2vw,2.3rem)] leading-[1.35] text-gold-deep">
              {blogiLeht.tyhiPealkiri}
            </p>
            <Tekst className="mt-8">{blogiLeht.tyhiTekst}</Tekst>
            <a
              href={kontakt.substack}
              target="_blank"
              rel="noreferrer"
              className="group mt-10 inline-flex items-center gap-3 mikro text-gold-deep transition-colors hover:text-ink"
            >
              {blogiLeht.substackTekst}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        ) : (
          <ul>
            {jarjestatud.map((postitus) => (
              <li key={postitus.slug}>
                <Link
                  href={`/blogi/${postitus.slug}`}
                  className="group grid grid-cols-1 gap-x-12 gap-y-3 border-t border-gold/25 py-10 transition-colors hover:bg-bone sm:grid-cols-[auto_1fr] sm:py-12"
                >
                  <time
                    dateTime={postitus.kuupaev}
                    className="mikro text-ink-faint sm:pt-3"
                  >
                    {vormindaKuupaev(postitus.kuupaev)}
                  </time>

                  <div>
                    <h2 className="kuva text-[clamp(1.6rem,3.2vw,2.4rem)] text-ink transition-colors group-hover:text-gold-deep">
                      {postitus.pealkiri}
                    </h2>
                    <p className="mt-3 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
                      {postitus.sissejuhatus}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Sektsioon>
    </>
  );
}
