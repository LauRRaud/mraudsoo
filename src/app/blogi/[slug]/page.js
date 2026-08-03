import Link from "next/link";
import { notFound } from "next/navigation";
import { Sektsioon } from "@/components/ui";
import { postitused } from "@/sisu/sait";

export function generateStaticParams() {
  return postitused.map((postitus) => ({ slug: postitus.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const postitus = postitused.find((p) => p.slug === slug);
  if (!postitus) return {};

  return {
    title: postitus.pealkiri,
    description: postitus.sissejuhatus,
  };
}

function vormindaKuupaev(iso) {
  return new Date(iso).toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Postitus({ params }) {
  const { slug } = await params;
  const postitus = postitused.find((p) => p.slug === slug);

  if (!postitus) notFound();

  return (
    <article>
      <Sektsioon taust="bone" laius="kitsas">
        <time
          dateTime={postitus.kuupaev}
          className="text-xs uppercase tracking-[0.18em] text-ink-faint"
        >
          {vormindaKuupaev(postitus.kuupaev)}
        </time>
        <h1 className="kuva mt-6 text-[clamp(2.2rem,5.5vw,4rem)] text-ink">
          {postitus.pealkiri}
        </h1>
        <p className="mt-8 text-lg leading-[1.8] text-gold-deep sm:text-xl">
          {postitus.sissejuhatus}
        </p>
      </Sektsioon>

      <Sektsioon taust="linen" laius="kitsas">
        <div className="space-y-7">
          {postitus.loigud.map((loik) => (
            <p key={loik} className="text-base leading-[1.95] text-ink-soft">
              {loik}
            </p>
          ))}
        </div>

        <div className="joon mt-16" />
        <Link
          href="/blogi"
          className="group mt-8 inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-gold-deep transition-colors hover:text-ink"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          Kõik postitused
        </Link>
      </Sektsioon>
    </article>
  );
}
