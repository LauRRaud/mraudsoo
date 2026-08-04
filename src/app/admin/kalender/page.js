import Link from "next/link";
import { redirect } from "next/navigation";
import { kasSisseLoginud } from "@/admin/turve";
import { laeKalender } from "@/broneering/kalender";
import KalendriHaldus from "@/components/KalendriHaldus";

/*
  ADMIN — KALENDRI SAADAVUS.
  Kaitse: paigutus kontrollib sessiooni, aga kontrollime siin uuesti, et
  kaitse ei sõltuks ühest failist.
*/

export const metadata = {
  title: "Kalender",
  robots: { index: false, follow: false },
};

export default async function KalendriLeht() {
  if (!(await kasSisseLoginud())) redirect("/admin/login");

  const seis = await laeKalender();

  return (
    <div className="mx-auto w-full max-w-[1360px] px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="kuva text-3xl text-ink">Kalender</h1>
        <Link
          href="/admin"
          className="mikro text-[0.7rem] text-ink-faint transition-colors hover:text-rohe"
        >
          ← Sisuhaldus
        </Link>
      </div>

      <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
        Siin märgid päevad, mil sa kohtumisi vastu ei võta. Suletud päevi ei saa
        külastaja broneerimisvormis valida.
      </p>

      <div className="mt-10">
        <KalendriHaldus algseis={seis} />
      </div>
    </div>
  );
}
