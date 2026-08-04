"use client";

import { useEffect, useRef } from "react";

/*
  ILMUB — element tõuseb nähtavale, kui ta keritakse vaatevälja.

  Komponent lisab ainult klassi „nahtav”; kogu liikumine on CSS-is
  (globals.css, otsi „ILMUMINE”). Algseis on peidus AINULT siis, kui
  <html> kannab klassi „js” (vt src/app/layout.js) — ilma skriptita
  on kõik kohe nähtav ja midagi ei jää varju.

  Kasutus:
    <Ilmub>…</Ilmub>                     — üks element tõuseb tervikuna
    <Ilmub ruhm as="ul">…</Ilmub>        — lapsed ilmuvad astmeliselt
    <Ilmub viive={150}>…</Ilmub>         — lisaviive millisekundites

  Fotodele seda ümbrist EI panda — fotod on lehel ilma tekke-efektita.
*/
export default function Ilmub({
  as: Silt = "div",
  ruhm = false,
  viive = 0,
  className = "",
  children,
  ...muu
}) {
  const viide = useRef(null);

  useEffect(() => {
    const element = viide.current;
    if (!element) return undefined;

    /* Väga vana brauser: näita kohe, ära jää ootama */
    if (typeof IntersectionObserver === "undefined") {
      element.classList.add("nahtav");
      return undefined;
    }

    const vaatleja = new IntersectionObserver(
      (kirjed) => {
        if (kirjed.some((kirje) => kirje.isIntersecting)) {
          element.classList.add("nahtav");
          vaatleja.disconnect();
        }
      },
      /* Käivitu, kui element on jõudnud vaatevälja alumisest servast kõrgemale */
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    vaatleja.observe(element);
    return () => vaatleja.disconnect();
  }, []);

  const liik = ruhm ? "ilmub-ruhm" : "ilmub";

  return (
    <Silt
      ref={viide}
      className={`${liik}${className ? ` ${className}` : ""}`}
      style={viive ? { "--ilmub-viide": `${viive}ms` } : undefined}
      {...muu}
    >
      {children}
    </Silt>
  );
}
