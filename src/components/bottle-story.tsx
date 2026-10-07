"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { ProductBottle } from "@/components/product-bottle";

export function BottleStory() {
  const [side, setSide] = useState<"passionnes" | "professionnels">("passionnes");
  const isPro = side === "professionnels";
  const toggle = () => setSide(isPro ? "passionnes" : "professionnels");

  return (
    <section className="bottle-world" aria-labelledby="bottle-world-title">
      <div className="page-shell">
        <div className="bottle-world-top"><span className="eyebrow eyebrow-light">02 / LA MÊME PASSION, DEUX REGARDS</span><span className="bottle-world-rule" /><span className="eyebrow eyebrow-light">FAITES TOURNER LA BOUTEILLE ↘</span></div>
        <div className="bottle-world-grid">
          <div className="bottle-world-copy" key={side}>
            <span className="bottle-index">{isPro ? "02 — CÔTÉ PROFESSIONNELS" : "01 — CÔTÉ PASSIONNÉS"}</span>
            <h2 id="bottle-world-title">Une bouteille.<br /><em>Deux façons<br />de la vivre.</em></h2>
            <p>{isPro
              ? "Une carte des vins pensée ensemble, un conseil juste au bon moment, des bouteilles qui racontent votre table. Nous avançons à vos côtés."
              : "La surprise d'une belle découverte, le plaisir de choisir, et surtout le bonheur de partager. Ici, chaque bouteille a quelque chose à raconter."}</p>
            <Link href={isPro ? "/professionnels" : "/la-cave"} className="text-link text-link-light">{isPro ? "Imaginer notre collaboration" : "Découvrir la sélection"}<ArrowRight size={18} /></Link>
          </div>
          <div className="bottle-display">
            <div className="bottle-orbit bottle-orbit-one" /><div className="bottle-orbit bottle-orbit-two" />
            <button className="flip-trigger" onClick={toggle} aria-label={isPro ? "Tourner vers le côté passionnés" : "Tourner vers le côté professionnels"}>
              <span className={`flip-bottle ${isPro ? "flipped" : ""}`}>
                <span className="flip-face flip-front"><ProductBottle color="rouge" label="CÔTÉ PASSIONNÉS" /></span>
                <span className="flip-face flip-back"><ProductBottle color="blanc" label="CÔTÉ PROFESSIONNELS" /></span>
              </span>
            </button>
            <span className="bottle-rotate-hint"><RotateCcw size={15} /> CLIQUEZ POUR TOURNER</span>
          </div>
          <div className="bottle-world-options">
            <span className="options-caption">CHOISISSEZ VOTRE CÔTÉ</span>
            <button className={`bottle-option ${!isPro ? "selected" : ""}`} onClick={() => setSide("passionnes")} aria-pressed={!isPro}><span>01</span><strong>Pour les<br />passionnés</strong><ArrowRight size={20} /></button>
            <button className={`bottle-option ${isPro ? "selected" : ""}`} onClick={() => setSide("professionnels")} aria-pressed={isPro}><span>02</span><strong>Pour les<br />professionnels</strong><ArrowRight size={20} /></button>
            <p>Le bon vin, c&apos;est celui qui crée un lien. Peu importe de quel côté de la bouteille on se trouve.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
