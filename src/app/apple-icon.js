import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/* Ikoon iOS-i avaekraanile — sama Cormorant'i monogramm, suuremas mõõdus */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const cormorant = readFileSync(
  path.join(process.cwd(), "src", "app", "cormorant-500.ttf")
);

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
          background: "#3c4936",
          color: "#dcc27a",
          fontFamily: "Cormorant",
          fontSize: 148,
          paddingBottom: 16,
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
