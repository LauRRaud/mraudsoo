import { ImageResponse } from "next/og";

/*
  Brauseri vahekaardi ikoon — kaar, lehe kordumotiiv (kirikuaken, mille
  raamis elavad kõik fotod). Kuldne kaar sügavrohelisel: eristub nii heleda
  kui tumeda vahekaardiriba peal ja kannab kaubamärki paremini kui tähed.

  Mõõt on täpselt 32x32, sest brauser kasutab just seda suurust (või poolitab
  selle puhtalt 16-ks). Suurema pildi vähendamine muutis kuju uduseks.
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
          alignItems: "flex-end",
          justifyContent: "center",
          background: "#3c4936",
          paddingBottom: 5,
        }}
      >
        <div
          style={{
            width: 16,
            height: 21,
            background: "#dcc27a",
            borderRadius: "999px 999px 0 0",
          }}
        />
      </div>
    ),
    size
  );
}
