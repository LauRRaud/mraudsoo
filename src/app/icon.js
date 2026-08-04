import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/*
  Brauseri vahekaardi ikoon — Cormorant'i „M” sügavrohelisel, kuldsena.
  Sama kirjatüüp, millega on laotud lehe pealkirjad: monogramm on päriselt
  kaubamärgi nägu, mitte üldine süsteemikiri.

  Kirjafail elab siinsamas kaustas (cormorant-500.ttf) ja loetakse ehituse
  ajal — ikoon genereeritakse staatiliselt, võrgupäringuid ei tehta.

  Mõõt on täpselt 32x32, sest brauser kasutab just seda suurust (või poolitab
  selle puhtalt 16-ks). Suurema pildi vähendamine muudab kuju uduseks.
*/
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const cormorant = readFileSync(
  path.join(process.cwd(), "src", "app", "cormorant-500.ttf")
);

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3c4936",
          color: "#dcc27a",
          fontFamily: "Cormorant",
          fontSize: 27,
          /* Cormorant istub joonel madalal — tõstame optiliselt keskele */
          paddingBottom: 3,
        }}
      >
        M
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: cormorant, weight: 500, style: "normal" },
      ],
    }
  );
}
