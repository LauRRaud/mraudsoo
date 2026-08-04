import { notFound } from "next/navigation";
import { Pealkiri, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";

/*
  OMALOODUD LEHED.

  See marsruut püüab kinni kõik aadressid, millele ei vasta ükski päris kaust
  src/app all. Next.js eelistab alati staatilist segmenti dünaamilisele, seega
  /minust, /teenused ja /admin jõuavad endiselt oma lehtedeni — siia satuvad
  ainult tundmatud aadressid.

  Kui sellist lehte sisupuus ei ole, anname 404. Nii ei teki olukorda, kus
  suvaline aadress vastab tühja lehega.
*/

function leiaLeht(lehed, slug) {
  if (!Array.isArray(lehed)) return null;
  return lehed.find((leht) => leht?.slug === slug) ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { lehed } = await laeSisu();
  const leht = leiaLeht(lehed, slug);
  if (!leht) return {};

  return {
    title: leht.pealkiri,
    description: leht.sissejuhatus || undefined,
  };
}

export default async function OmaLeht({ params }) {
  const { slug } = await params;
  const { lehed } = await laeSisu();
  const leht = leiaLeht(lehed, slug);

  if (!leht || !leht.pealkiri) notFound();

  const plokid = Array.isArray(leht.plokid) ? leht.plokid : [];

  return (
    <>
      <Sektsioon taust="bone">
        <div className="max-w-3xl">
          <Pealkiri silt={leht.silt || undefined} tase="h1">
            {leht.pealkiri}
          </Pealkiri>
          {leht.sissejuhatus && (
            <>
              <div className="joon my-10 max-w-24" />
              <Tekst suur>{leht.sissejuhatus}</Tekst>
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
              <Pealkiri className="max-w-2xl">{plokk.pealkiri}</Pealkiri>
            )}
            <div className={plokk.pealkiri ? "mt-8 space-y-6" : "space-y-6"}>
              {loigud.map((loik, jrk) => (
                <Tekst key={`${leht.slug}-${indeks}-${jrk}`}>{loik}</Tekst>
              ))}
            </div>
          </Sektsioon>
        );
      })}
    </>
  );
}
