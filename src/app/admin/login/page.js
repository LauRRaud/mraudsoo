import { redirect } from "next/navigation";
import { kasSisseLoginud, onParoolSeatud } from "@/admin/turve";
import { Sisselogimisvorm } from "@/components/AdminToimeti";

/*
  ADMIN — SISSELOGIMISE LEHT.

  Stabiilne aadress, kuhu saab lingi suunata: /admin/login.
  Sisselogimata külastajale kuvab sama vormi juba paigutus (vt layout.js
  kommentaari, miks kaitse on lahendatud nii), seepärast jõuab siia sisuliselt
  ainult juba sisse logitud kasutaja — tema suuname toimetisse tagasi.
  Vorm on siin sellegipoolest olemas, et see leht oleks ka üksinda korrektne.
*/

export const metadata = {
  title: "Sisselogimine",
  robots: { index: false, follow: false },
};

export default async function SisselogimiseLeht() {
  if (await kasSisseLoginud()) redirect("/admin");

  return <Sisselogimisvorm lukus={!onParoolSeatud()} />;
}
