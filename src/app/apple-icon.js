import { ImageResponse } from "next/og";

/* Ikoon iOS-i avaekraanile — sama monogramm MR, suuremas mõõdus.
   Siin on ruumi, seega tähevahe on õrnalt hõre (nagu lehe .nimi). */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#161613",
          color: "#ffffff",
          fontSize: 86,
          fontWeight: 600,
          letterSpacing: 2,
        }}
      >
        MR
      </div>
    ),
    size,
  );
}
