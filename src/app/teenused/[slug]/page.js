import Link from "next/link";
import { notFound } from "next/navigation";
import { Nupp, Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { leiaTeenus, teenused } from "@/sisu/sait";

export function generateStaticParams() {
  return teenused.map((teenus) => ({ slug: teenus.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const teenus = leiaTeenus(slug);
  if (!teenus) return {};

  return {
    title: teenus.nimi,
    description: teenus.luhike,
  };
}

export default async function TeenuseLeht({ params }) {
  const { slug } = await params;
  const teenus = leiaTeenus(slug);

  if (!teenus) notFound();

  const jargmine =
    teenused[(teenused.findIndex((t) => t.slug === slug) + 1) % teenused.length];

  /* Sügavama tooniga teenused (Püha Ruum, fotograafia) saavad rahulikuma tausta */
  const rohelineToon = teenus.toon === "sygav";

  return (
    <>
      <Sektsioon taust={rohelineToon ? "sage" : "clay"}>
        <div className="max-w-3xl">
          <p className="silt !text-ink/70">{teenus.alapealkiri}</p>
          <h1 className="kuva mt-6 text-[clamp(2.5rem,7vw,5rem)] text-ink">
            {teenus.nimi}
          </h1>
          <p className="mt-8 max-w-[55ch] text-xl leading-[1.7] text-ink/85 sm:text-2xl">
            {teenus.luhike}
          </p>
        </div>
      </Sektsioon>

      <Sektsioon taust="bone" laius="kitsas">
        <p className="kuva text-[clamp(1.5rem,3.2vw,2.3rem)] leading-[1.35] text-gold-deep">
          {teenus.sissejuhatus}
        </p>

        <div className="mt-10 space-y-6">
          {teenus.loigud.map((loik) => (
            <Tekst key={loik}>{loik}</Tekst>
          ))}
        </div>
      </Sektsioon>

      {teenus.nimekiri.length > 0 && (
        <Sektsioon taust="linen">
          <Pealkiri silt="Mida see annab" className="max-w-2xl">
            {teenus.nimekirjaPealkiri}
          </Pealkiri>

          <ul className="mt-14 max-w-4xl">
            {teenus.nimekiri.map((punkt) => (
              <li
                key={punkt}
                className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-gold/25 py-6"
              >
                <span aria-hidden="true" className="text-gold">
                  —
                </span>
                <span className="text-lg leading-relaxed text-ink-soft">
                  {punkt}
                </span>
              </li>
            ))}
          </ul>
          <div className="joon max-w-4xl" />
        </Sektsioon>
      )}

      {/* Kutse + järgmine teenus */}
      <Sektsioon taust="bone">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Pealkiri silt="Alustame">Kas see kõnetas sind?</Pealkiri>
            <Tekst className="mt-7">
              Kirjuta julgelt. Vastan ise ja leiame koos sobiva aja ning viisi.
            </Tekst>
            <div className="mt-10 flex flex-wrap gap-4">
              <Nupp href="/broneerimine">Broneeri aeg</Nupp>
              <Nupp href="/hinnakiri" variant="aaris">
                Hinnakiri
              </Nupp>
            </div>
          </div>

          <div className="lg:border-l lg:border-gold/25 lg:pl-20">
            <p className="silt">Järgmine teenus</p>
            <Link href={`/teenused/${jargmine.slug}`} className="group mt-6 block">
              <h2 className="kuva text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink transition-colors group-hover:text-gold-deep">
                {jargmine.nimi}
              </h2>
              <p className="mt-3 max-w-[42ch] text-lg leading-relaxed text-ink-soft">
                {jargmine.luhike}
              </p>
              <span className="mt-5 inline-flex items-center gap-3 mikro text-gold-deep">
                Loe lähemalt
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </Sektsioon>
    </>
  );
}
