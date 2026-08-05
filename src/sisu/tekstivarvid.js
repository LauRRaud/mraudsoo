/*
  TEKSTIVÄRVID.

  Admin saab anda ÜKSIKULE tekstile oma värvi — nt teha avalehe litaania
  sissejuhatus kuldseks. Värvid elavad sisupuu kõrval eraldi kaardina:

      tekstiVarvid = { "avaleht.kutsumus.valjendusSissejuhatus": "#8a6f20" }

  Võti on tee sisupuus, punktidega ühendatud (massiivi element = number).

  MIKS REGISTER, MITTE VABA VÄLI:
  värvivalija tohib ilmuda ainult nende väljade juurde, mis on lehel PÄRISELT
  ühendatud (vt varvija() kasutused src/app all). Muidu valiks Marta värvi ja
  lehel ei juhtuks midagi. VARVITAVAD on seega lubatud teede nimekiri ja ühtlasi
  ainus koht, kus uut värvitavat välja registreerida — kui lisad siia rea,
  ühenda see ka lehel.

  Väärtus läheb inline-stiili sisse, seepärast on puhastus kohustuslik:
  lubatud on üksnes #rgb või #rrggbb.
*/

/* Sisupuu võti, mille all kaart elab. Vt src/sisu/vaikimisi.js ja lae.js. */
export const TEKSTIVARVIDE_VOTI = "tekstiVarvid";

/*
  Värvitavad teed. „*” tähistab massiivi indeksit (loigud.* = kõik lõigud).
  Nimekiri on rühmitatud lehtede kaupa, samas järjekorras nagu lehel.
*/
export const VARVITAVAD = [
  /* Avaleht */
  "avaleht.hero.silt",
  "avaleht.hero.pealkiri",
  "avaleht.hero.alapealkiri",
  "avaleht.hero.tekst",
  "avaleht.kutsumus.silt",
  "avaleht.kutsumus.tsitaat",
  "avaleht.kutsumus.loigud.*",
  "avaleht.kutsumus.valjendusSissejuhatus",
  "avaleht.kutsumus.valjendus.*",
  "avaleht.liikumine.silt",
  "avaleht.liikumine.pealkiri",
  "avaleht.liikumine.read.*.millest",
  "avaleht.liikumine.read.*.milleks",
  "avaleht.essents.pealkiri",
  "avaleht.essents.alapealkiri",
  "avaleht.essents.loigud.*",
  "avaleht.essents.tsitaat",
  "avaleht.kirjakoht.viide",
  "avaleht.kirjakoht.tekst",
  "avaleht.kirjakoht.selgitus",
  "avaleht.teenusedPlokk.pealkiri",
  "avaleht.minustPlokk.silt",
  "avaleht.minustPlokk.tsitaat",
  "avaleht.minustPlokk.loigud.*",
  "avaleht.kutse.silt",
  "avaleht.kutse.pealkiri",

  /* Minust */
  "minust.hero.silt",
  "minust.hero.pealkiri",
  "minust.hero.tekst",
  "minust.lugu.pealkiri",
  "minust.lugu.loigud.*",
  "minust.kirjakoht.viide",
  "minust.kirjakoht.tekst",
  "minust.kirjakoht.selgitus",
  "minust.pooordumine.silt",
  "minust.pooordumine.pealkiri",
  "minust.pooordumine.loigud.*",
  "minust.pooordumine.tsitaat",
  "minust.pooordumine.kirjakohad.*.viide",
  "minust.pooordumine.kirjakohad.*.tekst",
  "minust.pooordumine.kirjakohad.*.selgitus",
  "minust.annid.silt",
  "minust.annid.pealkiri",
  "minust.annid.sissejuhatus",
  "minust.annid.loend.*.nimi",
  "minust.annid.loend.*.kirjeldus",
  "minust.tsitaat.tekst",
  "minust.terviklikkus.silt",
  "minust.terviklikkus.pealkiri",
  "minust.terviklikkus.loigud.*",
  "minust.lopp.tsitaat",

  /* Teenuste koondleht */
  "teenusedLeht.hero.silt",
  "teenusedLeht.hero.pealkiri",
  "teenusedLeht.hero.tekst",
  "teenusedLeht.tsitaadiSilt",
  "teenusedLeht.tsitaat",
  "teenusedLeht.lopp.pealkiri",
  "teenusedLeht.lopp.tekst",

  /*
    Teenused. Nimi on meelega välja jäetud: registris on ta lingi sees ja
    hiirega peal muutub kuldseks — inline-värv võidaks selle ülemineku ära.
  */
  "teenused.*.alapealkiri",
  "teenused.*.luhike",
  "teenused.*.sissejuhatus",
  "teenused.*.loigud.*",
  "teenused.*.plokid.*.pealkiri",
  "teenused.*.plokid.*.loigud.*",
  "teenused.*.tsitaat.tekst",
  "teenused.*.tsitaat.selgitus",
  "teenused.*.nimekirjaPealkiri",
  "teenused.*.nimekiri.*",

  /* Teenuse alamlehe ühised tekstid */
  "teenuseLeht.nimekirjaSilt",
  "teenuseLeht.kutseSilt",
  "teenuseLeht.kutsePealkiri",
  "teenuseLeht.kutseTekst",

  /* Hinnakiri */
  "hinnakiriLeht.hero.silt",
  "hinnakiriLeht.hero.pealkiri",
  "hinnakiriLeht.hero.tekst",
  "hinnakiriLeht.uksikudSilt",
  "hinnakiriLeht.teekondSilt",
  "hinnakiriLeht.sisaldabSilt",
  "hinnakiriLeht.tsitaadiSilt",
  "hinnakiriLeht.tsitaat",
  "hinnakiriLeht.lopp.pealkiri",
  "hinnakiriLeht.lopp.tekst",
  "hinnakiri.*.nimi",
  "hinnakiri.*.kirjeldus",
  "hinnakiri.*.hind",
  "hinnakiri.*.kestus",
  "teekond.nimi",
  "teekond.kirjeldus",
  "teekond.hind",
  "teekond.sisaldab.*",

  /* Blogi */
  "blogiLeht.hero.silt",
  "blogiLeht.hero.pealkiri",
  "blogiLeht.hero.tekst",
  "blogiLeht.tyhiPealkiri",
  "blogiLeht.tyhiTekst",

  /* Broneerimine */
  "broneerimine.hero.silt",
  "broneerimine.hero.pealkiri",
  "broneerimine.hero.tekst",
  "broneerimine.vormSilt",
  "broneerimine.kontaktSilt",
  "broneerimine.markus",
  "broneerimine.kirjakoht.viide",
  "broneerimine.kirjakoht.tekst",
  "broneerimine.kirjakoht.selgitus",
];

/* Ainult #rgb või #rrggbb — muud ei tohi inline-stiili sisse pääseda */
const VARVI_MUSTER = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/* Ülempiir, et vigane või pahatahtlik fail ei kasvaks piiramatult */
const MAX_VARVE = 400;

/* Üks muster vs üks tee. „*” sobib ainult massiivi indeksiga. */
function sobib(muster, tee) {
  const musterOsad = muster.split(".");
  const teeOsad = tee.split(".");
  if (musterOsad.length !== teeOsad.length) return false;

  return musterOsad.every((osa, jrk) =>
    osa === "*" ? /^\d+$/.test(teeOsad[jrk]) : osa === teeOsad[jrk],
  );
}

/* Kas sellele teele tohib värvi anda (ja kas lehel on see ühendatud) */
export function onVarvitav(tee) {
  if (typeof tee !== "string" || tee === "") return false;
  return VARVITAVAD.some((muster) => sobib(muster, tee));
}

/*
  Kaardi puhastus. Tundmatud teed ja vigased värvid kukuvad vaikselt välja —
  sama kontroll käib nii lugemisel kui salvestamisel (vt src/sisu/lae.js).
*/
export function puhastaTekstiVarvid(kaart) {
  if (
    typeof kaart !== "object" ||
    kaart === null ||
    Array.isArray(kaart)
  ) {
    return {};
  }

  const tulemus = {};
  let arv = 0;

  for (const [tee, varv] of Object.entries(kaart)) {
    if (arv >= MAX_VARVE) break;
    if (typeof varv !== "string" || !VARVI_MUSTER.test(varv)) continue;
    if (!onVarvitav(tee)) continue;

    tulemus[tee] = varv.toLowerCase();
    arv += 1;
  }

  return tulemus;
}

/* Kõik ühe haru värvid maha — kasutab admini „Lähtesta” ühe sektsiooni peal */
export function eemaldaHaru(kaart, juur) {
  const tulemus = {};
  for (const [tee, varv] of Object.entries(kaart ?? {})) {
    if (tee === juur || tee.startsWith(`${juur}.`)) continue;
    tulemus[tee] = varv;
  }
  return tulemus;
}

/*
  Lehepoolne abiline. Annab funktsiooni, mis tagastab valmis style-objekti
  või undefined (= jäta vaikimisi värv):

      const v = varvija(sisu.tekstiVarvid, "avaleht");
      <p style={v("kutsumus.valjendusSissejuhatus")}>…</p>

  Eesliide on mugavus, et lehel ei peaks iga rida täispika teega kirjutama.
*/
export function varvija(tekstiVarvid, eesliide = "") {
  const kaart = tekstiVarvid ?? {};

  return function varv(tee) {
    const taisTee = eesliide ? `${eesliide}.${tee}` : tee;
    const vaartus = kaart[taisTee];
    return vaartus ? { color: vaartus } : undefined;
  };
}
