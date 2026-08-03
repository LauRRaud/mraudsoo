import Image from "next/image";

/*
  Fotod kuvatakse alati oma loomulikus kuvasuhtes — midagi ei lõigata ära.

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
  /*
    Esimese ekraanitäie pildid: lisaks laiusele piirame ka kõrgust, muidu
    kasvab lõikamata püstfoto vaateaknast pikemaks ja "jääb liiga alla".
    Kuvasuhe säilib — pilt lihtsalt kahaneb, midagi ei lõigata.
  */
  mahuEkraanile = false,
  className = "",
}) {
  const moot = MOODUD[nimi];

  if (!moot) {
    throw new Error(
      `Foto "${nimi}" mõõte ei ole komponendis Foto kirjas. Lisa need MOODUD hulka.`
    );
  }

  return (
    <Image
      src={`/pildid/${nimi}.jpg`}
      alt={alt}
      width={moot.laius}
      height={moot.korgus}
      quality={90}
      priority={priority}
      sizes={sizes}
      className={`${
        mahuEkraanile
          ? // Lahutame päise ja sektsiooni vahed, et pilt mahuks tervikuna ekraanile
            "mx-auto h-auto max-h-[calc(100vh-10rem)] w-auto max-w-full"
          : "h-auto w-full"
      } ${className}`}
    />
  );
}
