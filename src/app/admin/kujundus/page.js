import Link from "next/link";
import { redirect } from "next/navigation";
import { kasSisseLoginud } from "@/admin/turve";
import { KUVA_FONDID, TEKSTI_FONDID } from "@/kujundus/fondid";
import { laeKujundus } from "@/kujundus/lae";
import { laeTaustaPildid } from "@/kujundus/taustaPildid";
import KujunduseHaldus from "@/components/KujunduseHaldus";

export const metadata = {
  title: "Kujundus",
  robots: { index: false, follow: false },
};

export default async function KujunduseLeht() {
  if (!(await kasSisseLoginud())) redirect("/admin/login");

  const kujundus = await laeKujundus();
  const pildid = await laeTaustaPildid();

  return (
    <div className="mx-auto w-full max-w-[1360px] px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="kuva text-3xl text-ink">Kujundus</h1>
        <Link
          href="/admin"
          className="mikro text-[0.7rem] text-ink-faint transition-colors hover:text-rohe"
        >
          ← Sisuhaldus
        </Link>
      </div>

      <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
        Siin muudad kogu lehe kirjatüüpe, värve ja tekstisuurusi. Muudatus
        kehtib kohe kõigil lehtedel.
      </p>

      <div className="mt-10">
        {/* Fondinimekirjad tulevad serverilt — komponent ei tohi next/font-i importida */}
        <KujunduseHaldus
          algseis={kujundus}
          algsedPildid={pildid}
          kuvaFondid={KUVA_FONDID.map(({ id, nimi, muutuja, kirjeldus }) => ({
            id,
            nimi,
            muutuja,
            kirjeldus,
          }))}
          tekstiFondid={TEKSTI_FONDID.map(({ id, nimi, muutuja, kirjeldus }) => ({
            id,
            nimi,
            muutuja,
            kirjeldus,
          }))}
        />
      </div>
    </div>
  );
}
