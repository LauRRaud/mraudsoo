import Link from "next/link";
import { redirect } from "next/navigation";
import { kasSisseLoginud } from "@/admin/turve";
import { loeVarukoopiad } from "@/sisu/ajalugu";
import VarukoopiateHaldus from "@/components/VarukoopiateHaldus";

/*
  ADMIN — VARUKOOPIAD.

  Iga salvestus teeb enne ülekirjutamist koopia EELMISEST seisust
  (vt src/sisu/ajalugu.js). See leht näitab neid ja lubab ühe tagasi võtta.

  Taastamine on ise samuti tavaline salvestus, seega taastamise-eelne seis
  jääb samuti ajalukku — vale klõpsu saab kohe tagasi keerata.

  Kaitse: paigutus kontrollib sessiooni, aga kontrollime siin uuesti, et
  kaitse ei sõltuks ühest failist.
*/

export const metadata = {
  title: "Varukoopiad",
  robots: { index: false, follow: false },
};

export default async function VarukoopiateLeht() {
  if (!(await kasSisseLoginud())) redirect("/admin/login");

  const koopiad = await loeVarukoopiad();

  return (
    <div className="mx-auto w-full max-w-[1360px] px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="kuva text-3xl text-ink">
          Varukoopiad{" "}
          <span className="text-ink-faint">({koopiad.length})</span>
        </h1>
        <Link
          href="/admin"
          className="mikro text-[0.7rem] text-ink-faint transition-colors hover:text-rohe"
        >
          ← Sisuhaldus
        </Link>
      </div>

      <p className="mt-4 max-w-[70ch] text-lg leading-relaxed text-ink-soft">
        Iga salvestus teeb enne ülekirjutamist koopia sellest, mis oli enne.
        Kui midagi läks kaotsi, otsi siit sobiva ajaga rida ja taasta. Ka
        taastamine ise teeb koopia, nii et vale valiku saab tagasi võtta.
      </p>

      <div className="mt-10">
        <VarukoopiateHaldus koopiad={koopiad} />
      </div>
    </div>
  );
}
