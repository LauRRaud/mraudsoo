import { Nupp, Sektsioon, Tekst } from "@/components/ui";

export const metadata = {
  title: "Lehte ei leitud",
};

export default function EiLeitud() {
  return (
    <Sektsioon taust="bone" laius="kitsas" className="text-center">
      <p className="silt">404</p>
      <h1 className="kuva mx-auto mt-7 max-w-xl text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.25] text-ink">
        Seda lehte ei õnnestunud leida
      </h1>
      <Tekst className="mx-auto mt-7 text-center">
        Võib-olla on aadress muutunud. Alusta avalehelt või vaata teenuseid.
      </Tekst>
      <div className="mt-11 flex flex-wrap justify-center gap-4">
        <Nupp href="/">Avalehele</Nupp>
        <Nupp href="/teenused" variant="aaris">
          Teenused
        </Nupp>
      </div>
    </Sektsioon>
  );
}
