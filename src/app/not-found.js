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
    <Sektsioon taust="bone" laius="kitsas" polsterdus="suur" className="text-center">
      <p className="sisene kuva text-[clamp(5rem,16vw,9rem)] leading-none text-gold/40">
        {eiLeitud.silt}
      </p>
      <h1
        className="sisene kuva mx-auto mt-6 max-w-xl text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.22] text-ink"
        style={{ "--viive": "90ms" }}
      >
        {eiLeitud.pealkiri}
      </h1>
      <div className="sisene" style={{ "--viive": "200ms" }}>
        <Tekst className="mx-auto mt-7 text-center">{eiLeitud.tekst}</Tekst>
      </div>
      <div
        className="sisene mt-11 flex flex-wrap justify-center gap-4"
        style={{ "--viive": "300ms" }}
      >
        <Nupp href="/">{eiLeitud.nuppEsmane}</Nupp>
        <Nupp href="/teenused" variant="aaris">
          {eiLeitud.nuppTeine}
        </Nupp>
      </div>
    </Sektsioon>
  );
}
