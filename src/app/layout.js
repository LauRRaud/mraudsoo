import { Cormorant_Garamond, Poppins } from "next/font/google";
import { cache } from "react";
import "./globals.css";
import Pais from "@/components/Pais";
import Jalus from "@/components/Jalus";
import { laeSisu } from "@/sisu/lae";

/*
  Kuvakiri — kõrge kontrastiga elegantne serif, vastab Marta olemasolevale visuaalile.
  latin-ext on eesti tähtede (õ ä ö ü š ž) jaoks kohustuslik.
*/
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/* Põhikiri — pehme geomeetriline sans, sama joon mis Marta Instagramis */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/*
  Sama päringu jooksul loeme sisu ainult korra: generateMetadata ja
  RootLayout renderdatakse samas päringus, React cache jagab tulemuse.
*/
const laeSisuKordKorras = cache(laeSisu);

/*
  Pealkiri ja kirjeldus tulevad sisupuust (sisu.meta), seepärast ei saa siin
  olla staatilist metadata-eksporti — sisu loetakse päringu ajal failist.
*/
export async function generateMetadata() {
  const sisu = await laeSisuKordKorras();
  const { saidiNimi, tunnuslause, kirjeldus } = sisu.meta;
  const taisPealkiri = `${saidiNimi} | ${tunnuslause}`;

  return {
    metadataBase: new URL("https://martaraudsoo.com"),
    title: {
      /* Alamlehed annavad oma pealkirja, mis liidetakse malli järgi */
      default: taisPealkiri,
      template: `%s | ${saidiNimi}`,
    },
    description: kirjeldus,
    openGraph: {
      title: taisPealkiri,
      description: kirjeldus,
      siteName: saidiNimi,
      locale: "et_EE",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }) {
  const sisu = await laeSisuKordKorras();

  return (
    <html
      lang="et"
      className={`${cormorant.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Pais on kliendikomponent — sisu jõuab sinna ainult propsidena */}
        <Pais navi={sisu.navi} saidiNimi={sisu.meta.saidiNimi} />
        <main className="flex-1">{children}</main>
        <Jalus
          navi={sisu.navi}
          kontakt={sisu.kontakt}
          saidiNimi={sisu.meta.saidiNimi}
          tutvustus={sisu.jalus.tutvustus}
        />
      </body>
    </html>
  );
}
