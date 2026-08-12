import { notFound } from "next/navigation";
import Ilmub from "@/components/Ilmub";
import { Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { keeleAlternatiivid, keeleks } from "@/sisu/keeled";

/*
  OMALOODUD LEHED — JA ÜHTLASI KOGU LEHE 404.

  See marsruut püüab kinni kõik aadressid, millele ei vasta ükski päris kaust
  src/app/[keel] all. Next.js eelistab alati staatilist segmenti dünaamilisele,
  seega /minust, /teenused ja /admin jõuavad endiselt oma lehtedeni — siia
  satuvad ainult tundmatud aadressid.

  MIKS KÕIKEHÕLMAV [...slug], MITTE [slug]:
  ühe segmendiga muster jättis pikemad tundmatud aadressid (/mingi/asi) hoopis
  marsruudita ja siis vastas Next'i oma paljas 404-leht, ilma meie kujunduseta.
  Kõikehõlmav muster võtab nad vastu ja annab notFound() kaudu meie enda
  404-vaate (src/app/[keel]/not-found.js).

  Omaloodud leht saab olla ainult ÜHE segmendi sügavusel (/minu-leht) — nii on
  ka admin-lehel lubatud kuju.
*/

/* Ainult üks segment loeb lehe aadressiks; sügavam tee on tundmatu aadress */
function ainusSegment(slug) {
  return Array.isArray(slug) && slug.length === 1 ? slug[0] : null;
}

function leiaLeht(lehed, slug) {
  if (!Array.isArray(lehed) || !slug) return null;
  return lehed.find((leht) => leht?.slug === slug) ?? null;
}

export async function generateMetadata({ params }) {
  const { keel, slug } = await params;
  const kood = keeleks(keel);
  const tee = ainusSegment(slug);
  const { lehed } = await laeSisu(kood);
  const leht = leiaLeht(lehed, tee);
  if (!leht) return {};

  return {
    title: leht.pealkiri,
    description: leht.sissejuhatus || undefined,
    alternates: keeleAlternatiivid(kood, `/${tee}`),
  };
}

export default async function OmaLeht({ params }) {
  const { keel, slug } = await params;
  const kood = keeleks(keel);
  const { lehed } = await laeSisu(kood);
  const leht = leiaLeht(lehed, ainusSegment(slug));

  if (!leht || !leht.pealkiri) notFound();

  const plokid = Array.isArray(leht.plokid) ? leht.plokid : [];

  return (
    <>
      <Sektsioon taust="bone" polsterdus="ohuke" taustaVoti="vabaLeht.hero">
        <div className="max-w-3xl pt-6 sm:pt-10">
          {leht.silt && <p className="sisene silt silt-suur">{leht.silt}</p>}
          <h1
            className="sisene kuva mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-ink"
            style={{ "--viive": "90ms" }}
          >
            {leht.pealkiri}
          </h1>
          {leht.sissejuhatus && (
            <>
              <div
                className="sisene joon mb-9 mt-9 max-w-28"
                style={{ "--viive": "200ms" }}
              />
              <div className="sisene" style={{ "--viive": "300ms" }}>
                <Tekst suur>{leht.sissejuhatus}</Tekst>
              </div>
            </>
          )}
        </div>
      </Sektsioon>

      {/* Plokid vahelduva taustaga, et pikk leht ei muutuks üheks pinnaks */}
      {plokid.map((plokk, indeks) => {
        const loigud = Array.isArray(plokk?.loigud)
          ? plokk.loigud.filter((l) => typeof l === "string" && l.trim())
          : [];

        /* Tühja ploki vahelejätmine — pooleli rida ei tohi jätta tühja sektsiooni */
        if (!plokk?.pealkiri && loigud.length === 0) return null;

        return (
          <Sektsioon
            key={`${leht.slug}-${indeks}`}
            taust={indeks % 2 === 0 ? "linen" : "bone"}
            laius="kitsas"
          >
            {plokk.pealkiri && (
              <Ilmub>
                <Pealkiri className="max-w-2xl">{plokk.pealkiri}</Pealkiri>
              </Ilmub>
            )}
            <Ilmub
              ruhm
              className={plokk.pealkiri ? "mt-8 space-y-6" : "space-y-6"}
            >
              {loigud.map((loik, jrk) => (
                <Tekst key={`${leht.slug}-${indeks}-${jrk}`}>{loik}</Tekst>
              ))}
            </Ilmub>
          </Sektsioon>
        );
      })}
    </>
  );
}
