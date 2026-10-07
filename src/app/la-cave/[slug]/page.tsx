import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Grape, HeartHandshake, Truck } from "lucide-react";
import { and, asc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductBottle } from "@/components/product-bottle";
import { ProductCard, AddToCart } from "@/components/product-card";
import { colorLabel, formatPrice } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [product] = await db.select({ name: products.name, description: products.description }).from(products).where(eq(products.slug, slug)).limit(1);
  return { title: product?.name ?? "Cuvée introuvable", description: product?.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) notFound();
  let related = await db.select().from(products).where(and(eq(products.region, product.region), ne(products.id, product.id))).orderBy(asc(products.sortOrder)).limit(3);
  if (related.length < 3) related = await db.select().from(products).where(ne(products.id, product.id)).orderBy(asc(products.sortOrder)).limit(3);
  const notes = product.tastingNotes.split(",").map((note) => note.trim()).filter(Boolean);

  return (
    <main><div className="product-breadcrumb page-shell"><Link href="/la-cave"><ArrowLeft size={15} /> La cave</Link><span>/</span><Link href={`/la-cave?region=${encodeURIComponent(product.region)}`}>{product.region}</Link><span>/</span><span>{product.name}</span></div><section className="product-detail page-shell"><div className={`product-detail-visual tone-${product.color}`}><span className="product-detail-visual-label">GUEULES DE VIGNERONS / LA CAVE</span>{product.imageUrl ? <img src={product.imageUrl} alt={`Bouteille ${product.name}`} className="catalog-photo" /> : <ProductBottle color={product.color} />}<span className="product-detail-visual-index">UNE BOUTEILLE, UNE HISTOIRE ✳</span></div><div className="product-detail-info"><span className="eyebrow">{product.region} / {product.appellation}</span><h1>{product.name}</h1><div className="product-detail-producer">{product.producer} {product.vintage ? <span>· Millésime {product.vintage}</span> : null}</div><div className="product-detail-type"><span>{colorLabel(product.color)}</span><span>75 cl</span></div><p className="product-detail-description">{product.description}</p><div className="product-detail-price">{formatPrice(product.priceCents)} <span>/ bouteille</span></div><AddToCart product={product} /><p className="detail-demo-note">Référence et tarif de démonstration à confirmer avec la maison.</p><div className="product-detail-services"><div><HeartHandshake size={20} strokeWidth={1.3} /><span>Un conseil humain,<br />jamais automatique</span></div><div><Truck size={20} strokeWidth={1.3} /><span>Livraison à confirmer<br />avant règlement</span></div></div></div></section>
      <section className="product-story-section"><div className="page-shell product-story-inner"><div><span className="eyebrow">CE QUI FAIT LA DIFFÉRENCE</span><h2>Un vin qui a <em>quelque chose à dire.</em></h2><p>{product.story || product.description}</p></div><div className="product-tasting"><div className="tasting-symbol"><Grape size={28} strokeWidth={1} /></div><h3>Dans le verre</h3><div className="tasting-notes">{notes.map((note) => <span key={note}>{note}</span>)}</div><h3>À partager avec</h3><p>{product.pairing}</p></div></div></section>
      <section className="related-section page-shell"><div className="section-heading-row"><div><span className="eyebrow">POUR CONTINUER LA DÉCOUVERTE</span><h2>Et si on ouvrait <em>la suite ?</em></h2></div><Link href="/la-cave" className="text-link">Toute la cave <ArrowRight size={18} /></Link></div><div className="product-grid related-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
    </main>
  );
}
