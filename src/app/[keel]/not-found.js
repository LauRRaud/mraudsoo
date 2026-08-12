import { headers } from "next/headers";
import { Nupp, Sektsioon, Tekst } from "@/components/ui";
import { laeSisu } from "@/sisu/lae";
import { KEELE_PAIS, keeleks, tee } from "@/sisu/keeled";

/*
  404 — LEHTE EI LEITUD.

  Metadata-eksporti siin EI OLE: not-found.js oma pealkiri ei jõua <title>-sse
  (kontrollitud brauseris — sinna jääb juurpaigutuse vaikimisi pealkiri).
  Surnud eksport oleks eksitav, seepärast teda ei ole.

  MIKS KEEL TULEB PÄISEST, MITTE PARAMEETRIST:
  not-found.js ei saa propse (vt Next'i dokumentatsioon,
  node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
  not-found.md — „not-found.js components do not accept any props”), seega ei
  ole tal segmenti [keel] käepärast. proxy.js paneb keele iga päringu külge
  päisena ja siin loeme selle. Päise puudumisel jääb vaikekeel.

  Pealkiri metadata's on „404”, mitte sisupuust: metadata on staatiline ja
  sisu loetakse päringu ajal. Lehel endal on Marta oma sõnastus.
*/
export default async function EiLeitud() {
  const paised = await headers();
  const kood = keeleks(paised.get(KEELE_PAIS));
  const { eiLeitud } = await laeSisu(kood);

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
        <Nupp href={tee(kood, "/")}>{eiLeitud.nuppEsmane}</Nupp>
        <Nupp href={tee(kood, "/teenused")} variant="aaris">
          {eiLeitud.nuppTeine}
        </Nupp>
      </div>
    </Sektsioon>
  );
}
