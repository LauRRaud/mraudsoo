import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import Pais from "@/components/Pais";
import Jalus from "@/components/Jalus";

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

export const metadata = {
  metadataBase: new URL("https://martaraudsoo.com"),
  title: {
    default: "Marta Raudsoo | Püha Ruum, kohalolu ja stiiliselgus",
    template: "%s | Marta Raudsoo",
  },
  description:
    "Kohalolu, selgus ja stiil — et inimene võiks elada rohkem kooskõlas sellega, kelleks Jumal on ta loonud. Püha Ruum, stiiliselgus, garderoobi korrastus, teadlik ostlemine ja fotograafia.",
  openGraph: {
    title: "Marta Raudsoo | Püha Ruum, kohalolu ja stiiliselgus",
    description:
      "Kohalolu, selgus ja stiil — et inimene võiks elada rohkem kooskõlas sellega, kelleks Jumal on ta loonud.",
    locale: "et_EE",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="et"
      className={`${cormorant.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Pais />
        <main className="flex-1">{children}</main>
        <Jalus />
      </body>
    </html>
  );
}
