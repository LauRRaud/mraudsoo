import { ImageResponse } from "next/og";

/*
  Brauseri vahekaardi ikoon — monogramm MR valgelt mustjal taustal.

  Rist oli siin varem ja ta luges vahekaardiribal usulise sümbolina, mitte
  Marta märgina — kümne kaardi seas ei olnud võimalik aru saada, kelle leht
  see on. Initsiaalid teevad täpselt selle töö, mida ikoon peab tegema.

  Mõõt on täpselt 32x32, sest brauser kasutab just seda suurust (või poolitab
  selle 16-ks). Kaks tähte 32 pikslile on tihe: kirjakraad on valitud nii, et
  16 px juures jääks veel kahe tähe siluett alles, ja tähevahe on null —
  hõrendus lükkaks tähed servast välja.

  FONT ON SATORI OMA VAIKEFONT, mitte lehe Cormorant. Cormorant tuleks siia
  ttf-failina kaasa panna (ImageResponse ei loe CSS-i ega veebifonte) ja
  32 px juures ei ole tema peenikestest seriifidest niikuinii midagi näha.
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
          background: "#161613",
          color: "#ffffff",
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: -0.5,
        }}
      >
        MR
      </div>
    ),
    size,
  );
}
