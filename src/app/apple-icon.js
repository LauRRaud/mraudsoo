import { ImageResponse } from "next/og";

/* Ikoon iOS-i avaekraanile — sama valge rist mustjal, suuremas mõõdus */
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
          background: "#161613",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 81,
            top: 30,
            width: 18,
            height: 118,
            background: "#ffffff",
          }}
        />
        {/* Põikpuu samas kohas mis 32 px ikoonil (top 12 / 32 ≈ 68 / 180) */}
        <div
          style={{
            position: "absolute",
            left: 44,
            top: 68,
            width: 92,
            height: 18,
            background: "#ffffff",
          }}
        />
      </div>
    ),
    size
  );
}
