/*
  Lehe sisenemine — template.js paigaldatakse igal marsruudivahetusel uuesti,
  seega käivitub CSS-animatsioon (leht-sisenemine) igal navigeerimisel.
  Päis ja jalus on paigutuses väljaspool ega vilgu kaasa.
*/
export default function Template({ children }) {
  return <div className="leht-sisenemine">{children}</div>;
}
