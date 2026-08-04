import { ImageResponse } from "next/og";

/* Ikoon iOS-i avaekraanile — sama rist, suuremas mõõdus */
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
          position: "relative",
          background: "#3c4936",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 81,
            top: 30,
            width: 18,
            height: 118,
            background: "#dcc27a",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 44,
            top: 62,
            width: 92,
            height: 18,
            background: "#dcc27a",
          }}
        />
      </div>
    ),
    size
  );
}
