import { redirect } from "next/navigation";
import { kasSisseLoginud } from "@/admin/turve";
import AdminToimeti from "@/components/AdminToimeti";
import { laeSisu } from "@/sisu/lae";

/*
  ADMIN — SISU MUUTMISE LEHT.

  Sisu loetakse päringu ajal (laeSisu kutsub connection()), nii näeb Marta
  alati viimast salvestatud seisu. Kaitse teeb paigutus, aga kontrollime siin
  igaks juhuks uuesti: nii ei sõltu kaitse ühest ainsast failist.
*/

export const metadata = {
  title: "Sisuhaldus",
  robots: { index: false, follow: false },
};

export default async function AdminLeht() {
  if (!(await kasSisseLoginud())) redirect("/admin/login");

  const sisu = await laeSisu();

  return <AdminToimeti algsisu={sisu} />;
}
