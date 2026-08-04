import { ImageResponse } from "next/og";

/*
  Brauseri vahekaardi ikoon — peenike kuldne rist sügavrohelisel.
  Sama joonekeel, mis lehe püstjoon-motiivil: vaikne, mitte plakatlik.

  Mõõt on täpselt 32x32, sest brauser kasutab just seda suurust (või
  poolitab selle puhtalt 16-ks) — ribade laiused on valitud nii, et ka
  pooleks vähendatuna jääksid jooned teravaks.
*/
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#3c4936",
        }}
      >
        {/* Püsttala — ülemine haru lühem, alumine pikem (ladina rist) */}
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 5,
            width: 4,
            height: 22,
            background: "#dcc27a",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 10,
            width: 16,
            height: 4,
            background: "#dcc27a",
          }}
        />
      </div>
    ),
    size
  );
}
