import Link from "next/link";
import { notFound } from "next/navigation";
import Ilmub from "@/components/Ilmub";
import { Sektsioon } from "@/components/ui";
import { laeSisu, laeSisuSync } from "@/sisu/lae";

/*
  generateStaticParams jookseb enne päringukonteksti, seepärast sünkroonne
  laadija ilma connection()-ita.
*/
export function generateStaticParams() {
  const { postitused } = laeSisuSync();

  return postitused.map((postitus) => ({ slug: postitus.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { postitused } = await laeSisu();
  const postitus = postitused.find((p) => p.slug === slug);
  if (!postitus) return {};

  return {
    title: postitus.pealkiri,
    description: postitus.sissejuhatus,
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

export default async function Postitus({ params }) {
  const { slug } = await params;
  const { postitused } = await laeSisu();
  const postitus = postitused.find((p) => p.slug === slug);

  if (!postitus) notFound();

  /* Sisulaadija tagab kuju, aga lõikude puudumine ei tohi lehte maha võtta */
  const loigud = Array.isArray(postitus.loigud) ? postitus.loigud : [];

  return (
    <article>
      <Sektsioon
        taust="bone"
        laius="kitsas"
        polsterdus="ohuke"
        taustaVoti="blogiPostitus.hero"
      >
        <div className="pt-6 sm:pt-10">
          <time
            dateTime={postitus.kuupaev}
            className="sisene mikro block text-ink-faint"
          >
            {vormindaKuupaev(postitus.kuupaev)}
          </time>
          <h1
            className="sisene kuva mt-6 text-[clamp(2.2rem,5.5vw,4rem)] text-ink"
            style={{ "--viive": "90ms" }}
          >
            {postitus.pealkiri}
          </h1>
          <p
            className="sisene mt-8 text-lg leading-[1.8] text-gold-deep sm:text-xl"
            style={{ "--viive": "200ms" }}
          >
            {postitus.sissejuhatus}
          </p>
        </div>
      </Sektsioon>

      <Sektsioon taust="linen" laius="kitsas" taustaVoti="blogiPostitus.sisu">
        <Ilmub ruhm className="space-y-7">
          {loigud.map((loik, indeks) => (
            <p
              key={`${postitus.slug}-${indeks}`}
              className="text-lg leading-[1.95] text-ink-soft"
            >
              {loik}
            </p>
          ))}
        </Ilmub>

        <div className="joon mt-16" />
        {/* Sisupuus ei ole tagasilingi jaoks välja — jääb vaikimisi sõnastus */}
        <Link
          href="/blogi"
          className="group mikro mt-8 inline-flex items-center gap-3 text-gold-deep transition-colors hover:text-ink"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:-translate-x-1.5"
          >
            ←
          </span>
          Kõik postitused
        </Link>
      </Sektsioon>
    </article>
  );
}
