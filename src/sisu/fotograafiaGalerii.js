/*
  FOTOGRAAFIA GALERII PILDI AADRESS.

  Viis algset Marta fotot elavad git'i all public/pildid kaustas. Administ
  lisatud fotod elavad data/taustad kaustas ja neid serveerib /taustad marsruut.
  Sisupuust tulevat suvalist aadressi ei kasutata: lubatud on ainult tuntud
  algfail või serveri enda ohutu nimekujuga üleslaaditud fail.
*/

const ALGSED_PILDID = new Set([
  "marta-portree.jpg",
  "marta-seistes.jpg",
  "marta-diivanil.jpg",
  "marta-lamades.jpg",
  "marta-tutrega.jpg",
]);

const LAETUD_PILDI_NIMI = /^[a-z0-9][a-z0-9-]{0,63}\.(jpg|png|webp)$/;

export function fotograafiaPildiAadress(fail) {
  if (ALGSED_PILDID.has(fail)) return `/pildid/${fail}`;
  if (typeof fail === "string" && LAETUD_PILDI_NIMI.test(fail)) {
    return `/taustad/${fail}`;
  }
  return null;
}
