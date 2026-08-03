import { ImageResponse } from "next/og";

/*
  Brauseri vahekaardi ikoon — monogramm "MR".

  Mõõt on täpselt 32x32, sest brauser kasutab just seda suurust (või poolitab
  selle puhtalt 16-ks). Suurema pildi vähendamine tegi tähed uduseks.

  Tume taust heledate tähtedega: väikeses mõõdus loeb hele kiri tumedal
  paremini kui vastupidi, ja ruut eristub nii heleda kui tumeda
  vahekaardiriba peal.
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
          alignItems: "center",
          justifyContent: "center",
          background: "#2E2A26",
          color: "#EDEAE5",
          fontSize: 19,
          letterSpacing: -0.5,
        }}
      >
        MR
      </div>
    ),
    size
  );
}
