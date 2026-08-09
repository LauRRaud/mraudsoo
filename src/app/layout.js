import { cache } from "react";
import "./globals.css";
import Pais from "@/components/Pais";
import Jalus from "@/components/Jalus";
import { laeSisu } from "@/sisu/lae";
import { koikFondiKlassid } from "@/kujundus/fondid";
import { kujundusCss, laeKujundus } from "@/kujundus/lae";

/*
  Sama päringu jooksul loeme sisu ainult korra: generateMetadata ja
  RootLayout renderdatakse samas päringus, React cache jagab tulemuse.
*/
const laeSisuKordKorras = cache(laeSisu);
const laeKujundusKordKorras = cache(laeKujundus);

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

export const viewport = {
  themeColor: "#fbf8f1",
};

export default async function RootLayout({ children }) {
  const sisu = await laeSisuKordKorras();
  const kujundus = await laeKujundusKordKorras();

  return (
    <html lang="et" className={`${koikFondiKlassid} h-full antialiased`}>
      <head>
        {/*
          Ilmumisanimatsioonide algseis (peidus) kehtib ainult klassiga
          html.js — nii on ilma JavaScriptita kogu sisu kohe nähtav.
          Skript peab jooksma enne esimest joonistust, seepärast siin.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {/*
          Admin-lehelt salvestatud kujundus kirjutab :root muutujad üle.
          Väärtused on puhastatud (vt src/kujundus/lae.js), seega siia ei saa
          suvalist CSS-i sattuda.
        */}
        <style>{kujundusCss(kujundus)}</style>
      </head>
      <body className="flex min-h-full flex-col">
        {/* Pais on kliendikomponent — sisu jõuab sinna ainult propsidena */}
        <Pais
          navi={sisu.navi}
          saidiNimi={sisu.meta.saidiNimi}
          tekstiKujud={sisu.tekstiKujud}
          kontakt={sisu.kontakt}
        />
        <main className="flex-1">{children}</main>
        <Jalus
          navi={sisu.navi}
          kontakt={sisu.kontakt}
          saidiNimi={sisu.meta.saidiNimi}
          tutvustus={sisu.jalus.tutvustus}
          tunnuslause={sisu.meta.tunnuslause}
        />
      </body>
    </html>
  );
}
