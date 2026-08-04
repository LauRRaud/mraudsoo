import Image from "next/image";

/*
  Fotod elavad raamis: ümbris määrab kuvasuhte (vaikimisi foto loomulik suhe,
  seega midagi ei lõigata) ja pilt täidab raami. Fotod on paigal ja ilma
  tekke-efektita — nad on lehel lihtsalt olemas.

  `kaar` — ülaserv on poolkaar nagu kirikuaken (lehe kordumotiiv).
  `kuvasuhe` — nt "4 / 5", kui raam peab olema loomulikust suhtest erinev;
  siis pilt kärbitakse servadest (object-cover), nägu jääb keskele.

  Mõõdud vastavad failide tegelikele mõõtmetele. Kui lisad uue foto,
  lisa siia ka selle mõõdud — nii ei teki lehe laadimisel hüppamist.
*/
const MOODUD = {
  "marta-portree": { laius: 1462, korgus: 2047 },
  "marta-seistes": { laius: 1378, korgus: 2046 },
  "marta-diivanil": { laius: 1366, korgus: 2049 },
  "marta-tutrega": { laius: 1366, korgus: 2049 },
  "marta-lamades": { laius: 2048, korgus: 1365 },
};

export default function Foto({
  nimi,
  alt,
  sizes = "100vw",
  priority = false,
  kaar = false,
  kuvasuhe,
  className = "",
}) {
  const moot = MOODUD[nimi];

  if (!moot) {
    throw new Error(
      `Foto "${nimi}" mõõte ei ole komponendis Foto kirjas. Lisa need MOODUD hulka.`
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${kaar ? "kaar " : ""}${className}`}
      style={{ aspectRatio: kuvasuhe ?? `${moot.laius} / ${moot.korgus}` }}
    >
      <Image
        src={`/pildid/${nimi}.jpg`}
        alt={alt}
        width={moot.laius}
        height={moot.korgus}
        quality={90}
        priority={priority}
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
