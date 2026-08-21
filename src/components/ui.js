import Link from "next/link";
import { rakendaKuju } from "@/sisu/tekstikujud";

/*
  Sektsiooni ümbris — ühtne laius ja vertikaalne rütm kogu lehel.

  Tumedad taustad (mets, metsSyva) on osa kujunduskeelest: lehe kõige
  isiklikumad hetked seisavad sügavrohelisel. Tekstivärvid EI vahetu siin
  automaatselt — iga leht annab oma komponentidele `tume` propsi, nii on
  värvivalik alati koodist näha.
*/
export function Sektsioon({
  children,
  taust = "bone",
  laius = "lai",
  polsterdus = "tavaline",
  className = "",
  id,
  /*
    Taustapildi võti registrist (src/kujundus/sektsioonid.js). Pilt ise
    tuleb admin-lehelt CSS-i kaudu — komponent ei pea kujundust laadima,
    ainult ütlema, KES ta on.
  */
  taustaVoti,
}) {
  /*
    Heledaid pindu on kolm ja neid EI TOHI kõrvuti korrata — kaks ühesugust
    sektsiooni järjest sulavad üheks pikaks alaks. Kui sektsioon on
    tingimuslik, arvuta taust lehel (vt teenused/[slug] kutseTaust).
  */
  const taustad = {
    bone: "bg-bone",
    linen: "bg-linen",
    sage: "bg-sage",
    mets: "bg-mets",
    metsSyva: "bg-mets-syva",
  };
  const laiused = {
    lai: "max-w-[1400px]",
    kitsas: "max-w-4xl",
  };
  const polsterdused = {
    tavaline: "py-20 sm:py-28 lg:py-36",
    ohuke: "py-14 sm:py-16 lg:py-24",
    suur: "py-24 sm:py-32 lg:py-44",
  };

  return (
    <section
      id={id}
      data-taust={taustaVoti}
      style={taustaVoti ? { "--kate-varv": KATTE_VARV[taust] } : undefined}
      className={`${taustad[taust]} ${className}`}
    >
      <div
        className={`mx-auto ${laiused[laius]} px-6 ${polsterdused[polsterdus]} lg:px-12`}
      >
        {children}
      </div>
    </section>
  );
}

/*
  Katte värv taustapildi peal — sama, mis sektsiooni pind. Peab olema
  var(), mitte kõva väärtus, sest admin-lehelt saab pinnavärvi muuta ja
  kate peab kaasa tulema. Kasutavad nii Sektsioon kui ka need lehed, kus
  sektsioon on käsitsi <section> (fotoplokid).
*/
export const KATTE_VARV = {
  bone: "var(--color-bone)",
  linen: "var(--color-linen)",
  sage: "var(--color-sage)",
  mets: "var(--color-mets)",
  metsSyva: "var(--color-mets-syva)",
};

/* Sektsiooni pealkirjaplokk: väike silt + suur kuvakiri */
export function Pealkiri({
  silt,
  children,
  tase: Tase = "h2",
  tume = false,
  className = "",
  /* Admin-lehelt antud tekstikuju (vt src/sisu/tekstikujud.js) */
  stiil,
  siltStiil,
  kuju,
  siltKuju,
}) {
  return (
    <div className={className}>
      {silt && (
        <p className={`silt${tume ? " silt-tume" : ""}`} style={siltStiil}>
          {rakendaKuju(silt, siltKuju)}
        </p>
      )}
      <Tase
        style={stiil}
        className={`kuva ${tume ? "text-luu" : "text-ink"} ${
          Tase === "h1"
            ? "text-[clamp(2.5rem,5.5vw,4.25rem)]"
            : "text-[clamp(2.1rem,4vw,3.4rem)]"
        } ${silt ? "mt-5" : ""}`}
      >
        {rakendaKuju(children, kuju)}
      </Tase>
    </div>
  );
}

/*
  Nupp — arhitektuurne, aeglase täitumisega (vt globals.css „NUPP”).
  href-iga on link, ilma on päris <button> (nt vormi saatmiseks).
  Tumedal taustal: variant „hele” või „heleAaris”.
*/
export function Nupp({
  href,
  children,
  variant = "taidetud",
  nool = false,
  className = "",
  ...muu
}) {
  const variandid = {
    taidetud: "nupp-taidetud",
    aaris: "nupp-aaris",
    hele: "nupp-hele",
    heleAaris: "nupp-hele-aaris",
  };
  const klassid = `nupp ${variandid[variant]} mikro ${className}`;
  const sisu = (
    <>
      <span>{children}</span>
      {nool && (
        <span aria-hidden="true" className="nool">
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={klassid} {...muu}>
        {sisu}
      </Link>
    );
  }

  return (
    <button className={klassid} {...muu}>
      {sisu}
    </button>
  );
}

/*
  Tekstilink noolega — kasutame loendite ja edasiviidete juures.

  SUURUS ON MIKROST SUUREM. Nupu- ja menüümõõt (16 px) on õige seal, kus
  silte on rühmas mitu; üksik noolelink seisab aga pika tekstiploki all
  omaette ja kadus seal ära. Kordaja, mitte kindel piksliarv — nii jääb
  admin-lehe „Nupud ja menüü” liugur ka siia mõjuma.
*/
export function NooleLink({ href, children, tume = false, className = "" }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 mikro text-[calc(var(--mikro-suurus)*1.15)] transition-colors duration-300 ${
        tume
          ? "text-kuld-hele hover:text-luu"
          : "text-gold-deep hover:text-ink"
      } ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
      >
        →
      </span>
    </Link>
  );
}

/* Pikem tekstiplokk — loetav rea pikkus ja hingav reavahe */
export function Tekst({
  children,
  suur = false,
  tume = false,
  className = "",
  /* Admin-lehelt antud tekstikuju (vt src/sisu/tekstikujud.js) */
  stiil,
  kuju,
}) {
  return (
    <p
      style={stiil}
      /* .tekst / .tekst-suur loevad suuruse CSS-muutujast, mille admin saab muuta */
      className={`max-w-[60ch] ${suur ? "tekst-suur" : "tekst"} leading-[1.85] ${
        tume ? "text-luu/90" : "text-ink-soft"
      } ${className}`}
    >
      {rakendaKuju(children, kuju)}
    </p>
  );
}

/*
  Salm — kirjakoht oma vaikse hetkena: püstjoon, viide sildina,
  salm kuvakirjas, Marta selgitus all. Kasutusel lehel „Minust” ja
  teenuselehtede plokkides.

  Selgitus seisab ALATI salmi all lahti. Varem oli ta lehel „Minust”
  <details> sees ja avanes „Loe tõlgendust” klõpsust — siis jäi lühiselgitus
  märkamatuks, seepärast on ta nüüd kohe näha nagu kõigil teistel lehtedel.
*/
export function Salm({
  viide,
  tekst,
  selgitus = [],
  tume = false,
  className = "",
  /* Admin-lehelt antud tekstikujud (vt src/sisu/tekstikujud.js) */
  viiteStiil,
  stiil,
  selgituseStiil,
  viiteKuju,
  kuju,
  selgituseKuju,
}) {
  const selgitused = (Array.isArray(selgitus) ? selgitus : [selgitus]).filter(
    Boolean
  );
  const pikk = typeof tekst === "string" && tekst.length > 120;

  /*
    selgituseStiil võib olla üks stiil (kõigile lõikudele) või funktsioon
    (jrk) => stiil, kui igal lõigul on sisupuus oma värv.
  */
  const selgituseStiilil =
    typeof selgituseStiil === "function"
      ? selgituseStiil
      : () => selgituseStiil;

  const selgituseKujul =
    typeof selgituseKuju === "function" ? selgituseKuju : () => selgituseKuju;

  const selgituseRead = selgitused.map((loik, jrk) => (
    <p
      key={loik}
      style={selgituseStiilil(jrk)}
      className={`text-lg leading-[1.8] ${
        tume ? "text-luu/85" : "text-ink-soft"
      }`}
    >
      {rakendaKuju(loik, selgituseKujul(jrk))}
    </p>
  ));

  return (
    <figure className={`text-center ${className}`}>
      <div aria-hidden="true" className={`pystjoon${tume ? " pystjoon-tume" : ""}`} />
      {viide && (
        <figcaption
          style={viiteStiil}
          className={`silt mt-7${tume ? " silt-tume" : ""}`}
        >
          {rakendaKuju(viide, viiteKuju)}
        </figcaption>
      )}
      <blockquote
        style={stiil}
        className={`kuva mx-auto max-w-2xl leading-[1.3] ${viide ? "mt-6" : "mt-8"} ${
          tume ? "text-luu" : "text-ink"
        } ${
          pikk
            ? "text-[clamp(1.3rem,2.6vw,1.75rem)]"
            : "text-[clamp(1.55rem,3.4vw,2.3rem)]"
        }`}
      >
        {rakendaKuju(tekst, kuju)}
      </blockquote>

      {selgitused.length > 0 && (
        <div className="mx-auto mt-8 max-w-[54ch] space-y-4">
          {selgituseRead}
        </div>
      )}
    </figure>
  );
}
