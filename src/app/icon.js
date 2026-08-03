import { ImageResponse } from "next/og";

/*
  Brauseri vahekaardi ikoon — monogramm "MR".

  Hele luuvalge taust tumeda kirjaga: nii on ikoon nähtav nii heleda kui
  tumeda vahekaardiriba peal. Kuld tekstina jääks selles suuruses liiga
  väikese kontrastiga (2.9:1) ja ähmastuks.
*/
export const size = { width: 64, height: 64 };
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
          background: "#EDEAE5",
          color: "#2E2A26",
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: 1,
        }}
      >
        MR
      </div>
    ),
    size
  );
}
