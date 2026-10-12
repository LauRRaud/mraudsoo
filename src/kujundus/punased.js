/* Kolm võrreldavat varianti; muud kujunduse valikud jäävad puutumata. */
export const PUNASED = [
  {
    nimi: "Soe punane",
    varvid: {
      rohe: "#b83a2d",
      roheHele: "#a02e23",
      mets: "#912f26",
      metsSyva: "#842d26",
    },
  },
  {
    nimi: "Jaapani punane",
    varvid: {
      rohe: "#8f1d21",
      roheHele: "#76181b",
      mets: "#8f1d21",
      metsSyva: "#8f1d21",
    },
  },
  {
    nimi: "Jaapani punane — BC002D",
    varvid: {
      rohe: "#bc002d",
      roheHele: "#9e0026",
      mets: "#bc002d",
      metsSyva: "#bc002d",
    },
  },
];

export function punaseIndeks(varvid) {
  return PUNASED.findIndex((variant) =>
    Object.entries(variant.varvid).every(
      ([voti, varv]) => varvid[voti]?.toLowerCase() === varv,
    ),
  );
}
