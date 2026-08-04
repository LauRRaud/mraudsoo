import { Nupp, Sektsioon, Tekst } from "@/components/ui";
import { laeSisuSync } from "@/sisu/lae";

export const metadata = {
  title: "Lehte ei leitud",
};

/*
  not-found.js renderdatakse ka staatiliselt (kõik tundmatud aadressid), seepärast
  siin sünkroonne laadija ilma connection()-ita — connection() muudaks 404-lehe
  päringuaegseks ja katkestaks eelrenderduse.
*/
export default function EiLeitud() {
  const { eiLeitud } = laeSisuSync();

  return (
    <Sektsioon taust="bone" laius="kitsas" className="text-center">
      <p className="silt">{eiLeitud.silt}</p>
      <h1 className="kuva mx-auto mt-7 max-w-xl text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.25] text-ink">
        {eiLeitud.pealkiri}
      </h1>
      <Tekst className="mx-auto mt-7 text-center">{eiLeitud.tekst}</Tekst>
      <div className="mt-11 flex flex-wrap justify-center gap-4">
        <Nupp href="/">{eiLeitud.nuppEsmane}</Nupp>
        <Nupp href="/teenused" variant="aaris">
          {eiLeitud.nuppTeine}
        </Nupp>
      </div>
    </Sektsioon>
  );
}
