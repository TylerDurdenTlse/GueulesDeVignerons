import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Heart, Leaf, Sparkles } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductCard } from "@/components/product-card";
import { BottleStory } from "@/components/bottle-story";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await db.select().from(products).where(eq(products.featured, true)).orderBy(asc(products.sortOrder)).limit(4);

  return (
    <main>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-copy-inner">
            <span className="eyebrow"><span className="eyebrow-sun">✳</span> BIENVENUE CHEZ GUEULES DE VIGNERONS PAR RVins</span>
            <h1>Le vin se vit,<br /><em>il se partage.</em></h1>
            <div className="hero-intro"><span className="short-rule" /><p>Des vignerons que l&apos;on aime, des bouteilles qui racontent quelque chose et toujours une bonne raison de se retrouver.</p></div>
            <div className="hero-actions"><Link href="/la-cave" className="button button-dark">Découvrir la cave <ArrowUpRight size={19} strokeWidth={1.5} /></Link><Link href="/la-maison" className="text-link">Notre histoire <ArrowRight size={17} /></Link></div>
          </div>
          <div className="hero-bottom"><span><ArrowDown size={15} /> PRENEZ LE TEMPS DE DÉCOUVRIR</span><span>FAIT POUR ÊTRE PARTAGÉ ✳</span></div>
        </div>
        <div className="hero-image-frame">
          <Image src="/images/hero-dinner.jpg" alt="Des amis partagent un verre de vin autour d'une table au soleil" fill priority sizes="(max-width: 800px) 100vw, 55vw" className="cover-image hero-photo" />
          <div className="hero-image-shade" />
          <div className="hero-round-stamp"><span>LES BELLES<br />RENCONTRES</span><span className="stamp-star">✳</span><span>FONT LES<br />BEAUX VINS</span></div>
          <div className="hero-image-caption"><span>01 / LA RENCONTRE</span><p>Ce qu&apos;il y a de plus beau dans une bouteille, c&apos;est avec qui on l&apos;ouvre.</p></div>
        </div>
      </section>

      <div className="values-strip"><div className="page-shell values-inner"><span><Heart size={20} strokeWidth={1.3} /> CHOISI AVEC LE CŒUR</span><i /> <span><Leaf size={20} strokeWidth={1.3} /> DES VIGNERONS, DES VISAGES</span><i /> <span><Sparkles size={20} strokeWidth={1.3} /> DES MOMENTS À PARTAGER</span></div></div>

      <section className="story-home page-shell">
        <div className="story-photo-wrap"><Image src="/images/story-vineyard.jpg" alt="Des mains tiennent une grappe de raisin fraîchement cueillie" fill sizes="(max-width: 800px) 100vw, 45vw" className="cover-image" /><div className="story-image-label"><span>01 / LE VIGNOBLE</span><span>TOUT COMMENCE QUELQUE PART.</span></div></div>
        <div className="story-home-copy"><span className="eyebrow">01 / L&apos;ESPRIT DES VIGNERONS</span><h2>Derrière chaque bouteille, <em>il y a quelqu&apos;un.</em></h2><p className="section-lead">Un geste, une terre, une envie de faire découvrir. Nous croyons aux vins qui ont une âme et aux gens qui prennent le temps de les raconter.</p><div className="story-points"><div><span>01</span><p>La curiosité avant les certitudes.</p></div><div><span>02</span><p>La sensation avant le jargon.</p></div><div><span>03</span><p>La rencontre avant l&apos;étiquette.</p></div></div><Link href="/la-maison" className="text-link">Entrer dans la maison <ArrowRight size={18} /></Link></div>
      </section>

      <BottleStory />

      <section className="selection-section page-shell">
        <div className="section-heading-row"><div><span className="eyebrow">03 / LA SÉLECTION DU MOMENT</span><h2>Des bouteilles à <em>faire circuler.</em></h2><p>Pas besoin d&apos;attendre une grande occasion pour ouvrir un bon vin.</p></div><Link href="/la-cave" className="text-link">Toute la cave <ArrowRight size={18} /></Link></div>
        <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <div className="selection-footnote"><span>✳</span> Une sélection vivante, à retrouver par région, par couleur ou simplement au gré de vos envies.</div>
      </section>

      <section className="experiences-section"><div className="page-shell"><div className="experiences-heading"><span className="eyebrow">04 / BIEN PLUS QUE DU VIN</span><h2>À chaque envie, <em>une rencontre.</em></h2></div><div className="experience-grid">
        <Link href="/club-epicure" className="experience-card"><Image src="/images/club-table.jpg" alt="Une table dressée pour une dégustation conviviale" fill sizes="(max-width: 800px) 100vw, 33vw" className="cover-image" /><span className="experience-shade" /><span className="experience-top">01 / POUR LES CURIEUX</span><span className="experience-bottom"><strong>Le Club<br />Épicure</strong><span>Des dégustations à votre image, du premier verre aux grands flacons.</span><span className="experience-arrow"><ArrowUpRight size={22} /></span></span></Link>
        <Link href="/professionnels" className="experience-card"><Image src="/images/pro-service.jpg" alt="Un professionnel sert du vin lors d'une dégustation" fill sizes="(max-width: 800px) 100vw, 33vw" className="cover-image" /><span className="experience-shade" /><span className="experience-top">02 / POUR LES PROFESSIONNELS</span><span className="experience-bottom"><strong>À vos<br />côtés</strong><span>Cartes des vins, formations et expériences pensées ensemble.</span><span className="experience-arrow"><ArrowUpRight size={22} /></span></span></Link>
        <Link href="/coffrets" className="experience-card"><Image src="/images/gift-boxes.jpg" alt="Deux bouteilles dans un coffret cadeau avec des gourmandises" fill sizes="(max-width: 800px) 100vw, 33vw" className="cover-image" /><span className="experience-shade" /><span className="experience-top">03 / POUR LES BELLES ATTENTIONS</span><span className="experience-bottom"><strong>Les cadeaux<br />qui ont du sens</strong><span>Coffrets sur mesure, accords gourmands et options sans alcool.</span><span className="experience-arrow"><ArrowUpRight size={22} /></span></span></Link>
      </div></div></section>

      <section className="club-home"><div className="club-home-image"><Image src="/images/hero-dinner.jpg" alt="Des verres de vin partagés autour d'une table" fill sizes="(max-width: 800px) 100vw, 50vw" className="cover-image" /></div><div className="club-home-copy"><span className="eyebrow eyebrow-light">LE CLUB ÉPICURE</span><h2>Le goût des choses <em>vécues ensemble.</em></h2><p>Une dégustation n&apos;est jamais seulement une dégustation. C&apos;est une découverte, une surprise, une conversation qui dure. Trois façons de vivre l&apos;expérience, une seule envie : partager.</p><div className="club-levels"><span>LES DÉCOUVREURS</span><span>LES EXPLORATEURS</span><span>LES INITIÉS</span></div><Link href="/club-epicure" className="button button-cream">Trouver mon expérience <ArrowUpRight size={18} /></Link></div></section>

      <section className="closing-quote page-shell"><span className="eyebrow">UN MOT DE LA MAISON</span><blockquote>« Le vin est meilleur quand il devient <em>un prétexte à se rencontrer.</em> »</blockquote><span className="closing-star">✳</span></section>
    </main>
  );
}
