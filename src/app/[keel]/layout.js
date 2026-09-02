import { cache } from "react";
import Script from "next/script";
import "../globals.css";
import Pais from "@/components/Pais";
import Jalus from "@/components/Jalus";
import { laeSisu } from "@/sisu/lae";
import { KEELEKOODID, keeleks, leiaKeel } from "@/sisu/keeled";
import { koikFondiKlassid } from "@/kujundus/fondid";
import { kujundusCss, laeKujundus } from "@/kujundus/lae";

/*
  AVALIKU LEHE JUURPAIGUTUS.

  See on JUURPAIGUTUS, mitte tavaline paigutus: <html> ja <body> sünnivad
  siin. Nii peab olema, sest `lang` sõltub keelest ja keel on selle segmendi
  parameeter — src/app/layout.js ei pääseks talle ligi (paigutus ei näe oma
  laste dünaamilisi segmente). Admin on sama põhjusel oma juurpaigutusega,
  vt src/app/admin/layout.js.

  Aadressid: eesti pool seisab ilma prefiksita (/minust) ja proxy.js kirjutab
  ta seesmiselt /et/minust peale; inglise pool on /en/minust.
*/

/*
  Sama päringu jooksul loeme sisu ainult korra: generateMetadata ja
  RootLayout renderdatakse samas päringus, React cache jagab tulemuse.
  Võti on argument, seega kaks keelt ei sega üksteist.
*/
const laeSisuKordKorras = cache(laeSisu);
const laeKujundusKordKorras = cache(laeKujundus);

export function generateStaticParams() {
  return KEELEKOODID.map((keel) => ({ keel }));
}

/*
  Pealkiri ja kirjeldus tulevad sisupuust (sisu.meta), seepärast ei saa siin
  olla staatilist metadata-eksporti — sisu loetakse päringu ajal failist.

  hreflang-paare siin EI OLE: juurpaigutuse `alternates` päriks iga leht, mis
  omi ei anna, ja siis viitaks /minust paar avalehele. Iga leht annab nad ise
  (keeleAlternatiivid failist src/sisu/keeled.js).
*/
export async function generateMetadata({ params }) {
  const { keel } = await params;
  const kood = keeleks(keel);
  const sisu = await laeSisuKordKorras(kood);
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
      locale: leiaKeel(kood).og,
      type: "website",
    },
  };
}

export const viewport = {
  themeColor: "#fbf8f1",
};

export default async function RootLayout({ children, params }) {
  const { keel } = await params;
  /*
    keeleks(), mitte notFound(): tundmatu keel ei saa siia proxy tõttu jõuda
    (kõik prefiksita teed kirjutatakse /et peale ümber) ja notFound() JUUR-
    paigutuses jätaks 404-vaate ilma <html>-ita.
  */
  const kood = keeleks(keel);

  const sisu = await laeSisuKordKorras(kood);
  const kujundus = await laeKujundusKordKorras();

  /*
    suppressHydrationWarning on <html>-il meelega: allpool olev skript lisab
    talle klassi `js` ENNE hüdratsiooni, seega serveri ja kliendi className
    erinevad alati ühe sõna võrra ja React logis iga lehe peale
    hüdratsioonivea. Klass ise on õige ja jääb alles — vale oli ainult
    hoiatus. Vaigistus kehtib ainult selle elemendi enda atribuutidele, mitte
    puule tema all, seega päris vead tulevad endiselt välja.
  */
  return (
    <html
      lang={leiaKeel(kood).html}
      suppressHydrationWarning
      className={`${koikFondiKlassid} h-full antialiased`}
    >
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
          keel={kood}
          navi={sisu.navi}
          saidiNimi={sisu.meta.saidiNimi}
          tekstiKujud={sisu.tekstiKujud}
          kontakt={sisu.kontakt}
        />
        <main className="flex-1">{children}</main>
        <Jalus
          keel={kood}
          navi={sisu.navi}
          kontakt={sisu.kontakt}
          saidiNimi={sisu.meta.saidiNimi}
          tutvustus={sisu.jalus.tutvustus}
        />
      </body>
      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        strategy="afterInteractive"
        type="module"
        data-cf-beacon='{"token":"02ea22a81b08489bbb4722c55ce824a9"}'
      />
    </html>
  );
}
