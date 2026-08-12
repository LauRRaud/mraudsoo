"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { plokiStiil, tekstiKuju } from "@/sisu/tekstikujud";
import { KEELED, ilmaKeeleta, tee as keeleTee } from "@/sisu/keeled";
import { liides } from "@/sisu/liides";

/*
  Kliendikomponent ei loe sisu ise — navi, saidiNimi ja kontakt tulevad
  propsidena juurpaigutusest (src/app/[keel]/layout.js), kus sisu on failist
  loetud.

  Käitumine: päis peitub alla kerides ja tuleb üles kerides kohe tagasi.

  PÄISERIBA SEISAB LEHE PÕHITAUSTAL (bone), MITTE MENÜÜ TOONIL. Soe elevandiluu
  sai siin korra proovitud: riba muutus omaette paneeliks ja tema alla tekkis
  lehe valge kohal nähtav aste, mis tõmbas silma rohkem kui menüü ise. Päis
  peab kaduma lehe sisse, mitte istuma tema peal. `menyy` jääb ainult avatud
  mobiilimenüü paneelile, kus terve ekraan ongi menüü.

  Mobiilimenüü on täisekraani HELE kiht (menyy — oma värv, vaikimisi sama soe
  elevandiluu, mis salmisektsioonil, vt kujundus/vaikimisi.js), mille lingid
  ilmuvad astmeliselt; ESC sulgeb, taust ei keri.

  MENÜÜ SISU VÄRVID KÄIVAD HELEDA PINNA JÄRGI. Paneel oli varem tumeroheline
  ja kandis heledat kirja (text-luu, kuld-hele, .joon-tume). Kui siia satub
  tagasi mõni „tume pinna” värv, jääb ta peaaegu valgele paneelile nähtamatuks
  — luu annab menüüpinnal 1,03:1 ja kuld-hele 1,59:1.
*/

/*
  KEELEVAHETUS — „EST · ENG”, aktiivne kuldne.

  Ikooni ei ole: peale noole ja hamburgeri ei ole lehel ühtki ikooni ja
  gloobus tooks sisse võõra joonekeele. Praeguse keele silt EI OLE link —
  iseendale viitav link on ainult müra.

  Link viib SAMALE lehele teises keeles, seepärast käib praegune tee läbi
  ilmaKeeleta(). Kui lehte teises keeles ei ole (nt omaloodud leht või
  blogipostitus ainult ühes keeles), jõuab külastaja 404-le — see on aus
  vastus, mitte vaikne hüpe avalehele.

  Tumeda pinna varianti siin ei ole: mõlemad kasutuskohad (päiserida ja
  mobiilimenüü) seisavad nüüd heledal pinnal.
*/
function Keelevahetus({ keel, praeguneTee, className = "" }) {
  const rada = ilmaKeeleta(praeguneTee);

  return (
    <div
      role="group"
      aria-label={liides(keel).keelevahetus}
      className={`mikro flex items-center gap-2 ${className}`}
    >
      {KEELED.map((k, jrk) => (
        <Fragment key={k.kood}>
          {jrk > 0 && (
            <span aria-hidden="true" className="text-ink-faint/60">
              ·
            </span>
          )}
          {k.kood === keel ? (
            <span aria-current="true" className="text-gold-deep">
              {k.silt}
            </span>
          ) : (
            <Link
              href={keeleTee(k.kood, rada)}
              hrefLang={k.html}
              className="alajoon text-ink-faint transition-colors duration-300 hover:text-ink"
            >
              {k.silt}
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default function Pais({
  keel = "et",
  navi = [],
  saidiNimi = "Marta Raudsoo",
  tekstiKujud = {},
  kontakt = {},
}) {
  const [avatud, setAvatud] = useState(false);
  const [peidus, setPeidus] = useState(false);
  const tee = usePathname();
  const menyyViide = useRef(null);
  const sonad = liides(keel);

  /*
    Sulge mobiilimenüü lehe vahetumisel.
    Muudame seisundit renderdamise ajal, mitte efektis — efektis setState()
    tekitaks kaskaadrenderduse (React: „You Might Not Need an Effect”).
  */
  const [eelmineTee, setEelmineTee] = useState(tee);
  if (tee !== eelmineTee) {
    setEelmineTee(tee);
    setAvatud(false);
  }

  /*
    Päis peitub alla kerides ja tuleb kohe tagasi üles kerides.
    Väike lävi hoiab ära värisemise, kui keritakse edasi-tagasi.
  */
  useEffect(() => {
    let eelmineY = window.scrollY;

    function keridesse() {
      const y = window.scrollY;
      const vahe = y - eelmineY;

      // Lehe ülaosas on päis alati nähtav
      if (y < 80) {
        setPeidus(false);
      } else if (vahe > 6) {
        setPeidus(true);
      } else if (vahe < -6) {
        setPeidus(false);
      }

      eelmineY = y;
    }

    window.addEventListener("scroll", keridesse, { passive: true });
    return () => window.removeEventListener("scroll", keridesse);
  }, []);

  // Avatud mobiilimenüüga ei tohi päis ära peituda
  const varjatud = peidus && !avatud;

  // Kui menüü on avatud, ei tohi taust kerida; ESC sulgeb
  useEffect(() => {
    document.body.style.overflow = avatud ? "hidden" : "";

    function klahv(sundmus) {
      if (sundmus.key === "Escape") setAvatud(false);
    }

    if (avatud) {
      window.addEventListener("keydown", klahv);
      menyyViide.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", klahv);
    };
  }, [avatud]);

  /* Adminis „Saidi nimi” alla valitud kuju rakendub päise logotekstile. */
  const saidiNimePlokiStiil = plokiStiil(tekstiKujud, "meta")(
    "saidiNimi",
    { varvMuutujaks: true },
  );
  const saidiNimeTekst = tekstiKuju(tekstiKujud, "meta");
  const saidiNimeOmaVarv = Boolean(
    tekstiKujud?.["meta.saidiNimi"]?.varv,
  );

  /*
    Aktiivsust võrdleme KEELETA rajaga: navi teed seisavad sisupuus ilma
    prefiksita ("/minust") ja inglise pool on aadressis "/en/minust".
  */
  const rada = ilmaKeeleta(tee);

  function aktiivne(punkt) {
    return rada === punkt.tee || rada.startsWith(`${punkt.tee}/`);
  }

  return (
    <>
    <header
      className={`sticky top-0 z-50 transition-transform duration-500 ${
        varjatud ? "-translate-y-full" : "translate-y-0"
      } ${
        /*
          ÄÄRT EI OLE. Päise all oli peenike kuldjoon, mis tõmbas riba lehest
          lahti omaette ribaks — sama viga, mis menüü oma toonil (vt ülal).
          Päis kannab lehe põhitausta ja kaob lehe sisse; kerides tuleb ta
          nähtavale liikumisega, mitte jooneta.
        */
        avatud ? "bg-transparent" : "bg-bone"
      }`}
    >
      {/*
        PÄIS ON KAKS OTSA: nimi vasakus servas, menüü paremas.

        Menüü oli korra nime külge kleebitud (üks rühm vasakul, keelevahetus
        üksi nurgas) — lingid tulid siis liiga vasakule ja päise keskele jäi
        pikk tühi väli. Nimi ja menüü seisavad servades, nagu enne; uus on
        ainult see, et keelevahetus on menüüst lahti — omaette nurgas, laiema
        vahega, sest ta ei ole menüüpunkt vaid sama lehe teine versioon.

        MENÜÜRIDA JOONDUB NIME ALUSJOONELE, mitte kastide keskele. items-center
        tsentreeriks kastid ja 36 px nimi jääks 16 px menüü suhtes nihkesse —
        päis luges kahe eri asjana. items-baseline paneb tähed ühele joonele.
        Alla xl on see items-center: seal on nime kõrval ainult hamburger,
        millel ei ole kirjarida, mille järgi joonduda.

        PÄISE KAKS SERVA KÄIVAD ERI ASJA JÄRGI — ja peavadki.

        Vasak serv järgib tekstiveergu: nimi seisab 40 px vasakul sellest
        joonest, kust lehe tekst algab. Piisavalt, et päis loeks nurgas oleva
        märgina, aga nii vähe, et ta ei tundu sisust lahti rebituna.

        Parem serv järgib AKNA serva, mitte veergu: keelevalik kuulub nurka.

        Seepärast ei ole siin `mx-auto max-w-[…]` — keskele tõmmatud veerg
        nihutab paratamatult MÕLEMAT otsa ühepalju sissepoole, ja nii kaugenes
        keelevalik nurgast täpselt sama palju, kui nimi paremale tuli. Vasak
        polsterdus arvutab veeru serva ise: (100vw - 1480px) / 2 + 3rem annab
        sama joone, mille annaks 1480 px veerg, ja max() hoiab kitsal ekraanil
        tavalise 3rem polstri. 1480 = sisuveeru 1400 + kaks korda 40 px.
      */}
      <div className="flex items-center justify-between py-5 pl-6 pr-6 lg:pr-12 lg:pl-[max(3rem,calc((100vw-1480px)/2+3rem))] xl:items-baseline">
        <Link
          href={keeleTee(keel, "/")}
          style={saidiNimePlokiStiil}
          /*
            Nimi on lehe märk, mitte menüüpunkt — ta peab päises kandma.
            Suurus on koodis (mitte --silt-suurus vms admini muutuja kaudu),
            seega admini salvestused teda ei puuduta. Marta saab talle küll
            admin-lehelt oma kuju anda („Saidi nimi”), ja siis võidab tema oma.

            Avatud menüül ei ole enam oma värvi: paneel on sama heleda pere
            pind mis päis, seega töötab siin sama tint ja sama kuldne hiire
            all. Ühtlasi jääb Marta valitud värv nüüd ka avatud menüüs alles —
            varem lõikas tumeda paneeli erand selle ära.

            shrink-0: nimi on üks sõnapaar ja teda ei tohi kitsamal ekraanil
            kahele reale suruda — kaherealine logo kasvatab päise kõrguse
            järsku poolteistkordseks.
          */
          className={`nimi shrink-0 text-[1.65rem] transition-colors sm:text-[2.25rem] ${
            saidiNimeOmaVarv
              ? "text-[var(--oma-varv)] hover:text-gold-deep"
              : "text-ink hover:text-gold-deep"
          }`}
        >
          {saidiNimeTekst("saidiNimi", saidiNimi)}
        </Link>

        {/*
          Päise parem ots ühe rühmana: menüü, keelevahetus ja (kitsal ekraanil)
          hamburger. Rühm hoiab keelevahetuse menüüst kindla vahe kaugusel —
          justify-between kolme õe-venna vahel jagaks tühja ruumi võrdselt ja
          keelevahetus hulbiks ekraani laiuse järgi menüüst eemale.
        */}
        <div className="flex items-center gap-10 xl:items-baseline xl:gap-14">
        {/*
          Töölaua navigatsioon — alles xl (1280 px), mitte lg (1024).

          MÕÕDETUD, MITTE VALITUD: kuus menüüpunkti, nupp ja keelevahetus
          võtavad ligi 930 px. 1024 px ekraanil jääb päisesse pärast äärist
          928 px, seega nimele jäi 0 px ja ta murdus kahele reale — päis kasvas
          93-lt 124 pikslile ja rida jooksis üle serva. 1280 px juures on ruumi
          parasjagu; kitsamal ekraanil on hamburger, mis mahub alati.
        */}
        <nav className="hidden xl:block" aria-label={sonad.peamenyy}>
          <ul className="flex items-center gap-7 2xl:gap-9">
            {navi.map((punkt) => (
              <li key={punkt.tee}>
                <Link
                  href={keeleTee(keel, punkt.tee)}
                  aria-current={aktiivne(punkt) ? "page" : undefined}
                  /*
                    font-normal, mitte .mikro oma 500: suurtähed hõreda
                    tähevahega seisavad päises pika reana ja keskmine kaal
                    luges seal paksuna. Kaal peab olema siin, elemendi enda
                    peal — .mikro määrab ta otse, seega ul-ilt päritud kaal
                    ei jõuaks kohale. Utiliit võidab, sest Tailwindi utilities
                    on hilisem kiht kui components, kus .mikro elab.
                  */
                  className={`mikro alajoon font-normal transition-colors duration-300 ${
                    aktiivne(punkt)
                      ? "text-gold-deep"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {punkt.nimi}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/*
          Keelevahetus seisab omaette päise nurgas, mitte menüürea lõpus ühe
          lingina teiste seas. Ta ei ole menüüpunkt vaid sama lehe teine
          versioon, ja nurgas on ta alati samas kohas ka siis, kui
          menüüpunktide arv muutub.
        */}
        <div className="hidden xl:block">
          <Keelevahetus keel={keel} praeguneTee={tee} className="font-normal" />
        </div>

        {/* Mobiilinupp */}
        <button
          type="button"
          onClick={() => setAvatud((v) => !v)}
          aria-expanded={avatud}
          aria-controls="mobiilimenyy"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] xl:hidden"
        >
          <span className="sr-only">
            {avatud ? sonad.sulgeMenyy : sonad.avaMenyy}
          </span>
          {/*
            Kolm kriipsu on mõlemas seisus tinti: hamburger seisab lehe
            heledal taustal ja rist avatud menüü heledal paneelil. Seisund
            muudab ainult asendit, mitte värvi — nii ei jää üleminekus
            hetkeks nähtamatuks kriipsuks.
          */}
          <span
            aria-hidden="true"
            className={`h-px w-6 bg-ink transition-all duration-300 ${
              avatud ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-px w-6 bg-ink transition-opacity duration-300 ${
              avatud ? "opacity-0" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`h-px w-6 bg-ink transition-all duration-300 ${
              avatud ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
        </div>
      </div>

    </header>

      {/*
        Mobiilimenüü — täisekraani hele kiht. Seisab päise KÕRVAL, mitte sees:
        päisel on translate (peitumine) ja see muudaks fixed-kihi
        paigutuse päisesuuruseks. z-40 jääb päise (z-50) alla, nii et
        logo ja sulgemisnupp püsivad nähtaval.
      */}
      {avatud && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div className="leht-sisenemine absolute inset-0 bg-menyy" />

          <nav
            id="mobiilimenyy"
            aria-label={sonad.peamenyy}
            ref={menyyViide}
            tabIndex={-1}
            className="absolute inset-0 flex flex-col justify-between overflow-y-auto px-6 pb-10 pt-28 outline-none"
          >
            <div>
              {/* Keelevahetus paneeli ülaservas, menüüridade kohal */}
              <Keelevahetus
                keel={keel}
                praeguneTee={tee}
                className="sisene mb-8"
              />
              <ul>
                {navi.map((punkt, jrk) => (
                  <li key={punkt.tee}>
                    <Link
                      href={keeleTee(keel, punkt.tee)}
                      aria-current={aktiivne(punkt) ? "page" : undefined}
                      /*
                        Kuld on siin tume kuld, mitte hele: read on küll
                        kuvakirjas, aga hele kuld annab sellel paneelil
                        1,59:1 ja kaoks ära. Tume kuld on 4,37:1 — suures
                        kirjas nõutud 3:1 on tublisti täis.
                      */
                      className={`sisene kuva block py-3 text-[clamp(2.1rem,9vw,3.2rem)] transition-colors ${
                        aktiivne(punkt)
                          ? "text-gold-deep"
                          : "text-ink hover:text-gold-deep"
                      }`}
                      style={{ "--viive": `${140 + jrk * 70}ms` }}
                    >
                      {punkt.nimi}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="sisene mt-10"
              style={{ "--viive": `${140 + navi.length * 70 + 80}ms` }}
            >
              <div className="joon" />
              <div className="mt-7 space-y-3">
                {kontakt.email && (
                  <a
                    href={`mailto:${kontakt.email}`}
                    /*
                      Kontaktiread on tekstisuuruses, seega hiire all ei sobi
                      kuld (4,37:1 jääb 4,5:1 alla) — sama tint, mis mujal
                      heledal pinnal linke tumendab.
                    */
                    className="block text-lg text-ink-soft transition-colors hover:text-ink"
                  >
                    {kontakt.email}
                  </a>
                )}
                <div className="flex flex-wrap gap-x-7 gap-y-2">
                  {/* Kanalite nimed, mitte muudetav sisu */}
                  {kontakt.instagram && (
                    <a
                      href={kontakt.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="mikro text-ink-faint transition-colors hover:text-ink"
                    >
                      Instagram
                    </a>
                  )}
                  {kontakt.facebook && (
                    <a
                      href={kontakt.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="mikro text-ink-faint transition-colors hover:text-ink"
                    >
                      Facebook
                    </a>
                  )}
                  {kontakt.substack && (
                    <a
                      href={kontakt.substack}
                      target="_blank"
                      rel="noreferrer"
                      className="mikro text-ink-faint transition-colors hover:text-ink"
                    >
                      Substack
                    </a>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
