import { ImageResponse } from "next/og";

/* Ikoon iOS-i avaekraanile — sama monogramm, suuremas mõõdus */
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
          background: "#EDEAE5",
          color: "#2E2A26",
          fontSize: 82,
          fontWeight: 500,
          letterSpacing: 3,
        }}
      >
        MR
      </div>
    ),
    size
  );
}
