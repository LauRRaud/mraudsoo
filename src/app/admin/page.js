import { redirect } from "next/navigation";
import { kasSisseLoginud } from "@/admin/turve";
import AdminToimeti from "@/components/AdminToimeti";
import { laeSisu, sisuFailid, sisuTunnus } from "@/sisu/lae";
import { keeleks } from "@/sisu/keeled";
import { viimatiMuudetud } from "@/sisu/lukk";

/*
  ADMIN — SISU MUUTMISE LEHT.

  Sisu loetakse päringu ajal (laeSisu kutsub connection()), nii näeb Marta
  alati viimast salvestatud seisu. Kaitse teeb paigutus, aga kontrollime siin
  igaks juhuks uuesti: nii ei sõltu kaitse ühest ainsast failist.

  KEEL tuleb aadressist: /admin on eesti sisu, /admin?keel=en inglise oma.
  Aadressis, mitte seisundis — nii saab Marta lingi järjehoidjasse panna ja
  lehe värskendamine ei viska teda tagasi teise keelde.
*/

export const metadata = {
  title: "Sisuhaldus",
  robots: { index: false, follow: false },
};

export default async function AdminLeht({ searchParams }) {
  if (!(await kasSisseLoginud())) redirect("/admin/login");

  const { keel } = await searchParams;
  const kood = keeleks(keel);

  /*
    Tunnus loetakse ENNE sisu. Kui keegi jõuab vahepeal salvestada, jääb
    tunnus vanaks ja järgmine salvestus keeldub — see on ohutu suund.
    Vastupidises järjekorras oleks tunnus sisust uuem ja ülekirjutus läheks
    vaikselt läbi.
  */
  const tunnus = await sisuTunnus(kood);
  const salvestatud = await viimatiMuudetud(sisuFailid(kood));
  const sisu = await laeSisu(kood);

  /*
    key sunnib toimeti keele vahetumisel uuesti looma. Ilma selleta jääks
    tema seisundisse (useState(algsisu)) eelmise keele tekst — komponent ei
    võta uut algväärtust ainult propsi muutumise peale.
  */
  return (
    <AdminToimeti
      key={kood}
      keel={kood}
      algsisu={sisu}
      algtunnus={tunnus}
      algsaeg={salvestatud}
    />
  );
}
