import { ImageResponse } from "next/og";

/* Ikoon iOS-i avaekraanile — sama kaar, suuremas mõõdus */
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
          alignItems: "flex-end",
          justifyContent: "center",
          background: "#3c4936",
          paddingBottom: 30,
        }}
      >
        <div
          style={{
            width: 88,
            height: 116,
            background: "#dcc27a",
            borderRadius: "999px 999px 0 0",
          }}
        />
      </div>
    ),
    size
  );
}
