import { loeTaustaPilt, mimeTuup } from "@/kujundus/taustaPildid";

/*
  TAUSTAPILDI SERVEERIMINE.

  Pildid elavad kaustas data/taustad, mis ei ole avalik kaust — seega tuleb
  need ise välja anda. Nimi kontrollitakse mustri vastu (vt onPildiNimi)
  enne, kui sellest failitee saab.

  Vahemälu on pikk ja immutable: failinimi on ainulaadne ja faili sisu ei
  muutu kunagi — uus pilt tähendab alati uut nime.
*/
export async function GET(paring, { params }) {
  const { fail } = await params;
  const sisu = await loeTaustaPilt(fail);

  if (!sisu) return new Response("Pilti ei leitud", { status: 404 });

  return new Response(sisu, {
    headers: {
      "Content-Type": mimeTuup(fail),
      "Content-Length": String(sisu.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
