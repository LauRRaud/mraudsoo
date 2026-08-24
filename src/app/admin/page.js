import { redirect } from "next/navigation";
import { kasSisseLoginud } from "@/admin/turve";
import AdminToimeti from "@/components/AdminToimeti";
import { laeSisu, sisuFailid, sisuTunnus } from "@/sisu/lae";
import { viimatiMuudetud } from "@/sisu/lukk";

/*
  ADMIN — SISU MUUTMISE LEHT.

  Sisu loetakse päringu ajal (laeSisu kutsub connection()), nii näeb Marta
  alati viimast salvestatud seisu. Kaitse teeb paigutus, aga kontrollime siin
  igaks juhuks uuesti: nii ei sõltu kaitse ühest ainsast failist.

  Mõlemad keeled laetakse korraga. Admini põhikeel on eesti ning iga teksti
  kõrval on sama välja inglise tõlge. Kujunduskaart on üks ja ühine.
*/

export const metadata = {
  title: "Sisuhaldus",
  robots: { index: false, follow: false },
};

export default async function AdminLeht({ searchParams }) {
  if (!(await kasSisseLoginud())) redirect("/admin/login");

  const { keel } = await searchParams;
  /* Vana järjehoidja /admin?keel=en viib nüüd samasse ühisesse toimetisse. */
  if (keel) redirect("/admin");

  /*
    Tunnus loetakse ENNE sisu. Kui keegi jõuab vahepeal salvestada, jääb
    tunnus vanaks ja järgmine salvestus keeldub — see on ohutu suund.
    Vastupidises järjekorras oleks tunnus sisust uuem ja ülekirjutus läheks
    vaikselt läbi.
  */
  const [tunnusEt, tunnusEn] = await Promise.all([
    sisuTunnus("et"),
    sisuTunnus("en"),
  ]);
  const failid = [...new Set([...sisuFailid("et"), ...sisuFailid("en")])];
  const [salvestatud, sisuEt, sisuEn] = await Promise.all([
    viimatiMuudetud(failid),
    laeSisu("et"),
    laeSisu("en"),
  ]);

  return (
    <AdminToimeti
      algsisuEt={sisuEt}
      algsisuEn={sisuEn}
      algtunnusEt={tunnusEt}
      algtunnusEn={tunnusEn}
      algsaeg={salvestatud}
    />
  );
}
