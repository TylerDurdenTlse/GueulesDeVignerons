"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import type { Product } from "@/db/schema";
import { ProductBottle } from "@/components/product-bottle";
import { useCart } from "@/components/cart-provider";
import { colorLabel, formatPrice } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const add = () => addItem({ id: product.id, slug: product.slug, name: product.name, producer: product.producer, color: product.color, priceCents: product.priceCents });

  return (
    <article className="product-card">
      <div className={`product-card-visual tone-${product.color}`}>
        <span className="product-card-tag">{colorLabel(product.color)}</span>
        <Link href={`/la-cave/${product.slug}`} className="product-card-image" aria-label={`Découvrir ${product.name}`}>{product.imageUrl ? <img src={product.imageUrl} alt={`Bouteille ${product.name}`} loading="lazy" className="catalog-photo" /> : <ProductBottle color={product.color} />}</Link>
        <button className="product-quick-add" onClick={add} disabled={product.stock < 1} aria-label={`Ajouter ${product.name} au panier`} title="Ajouter au panier"><Plus size={19} strokeWidth={1.5} /></button>
      </div>
      <div className="product-card-details">
        <span className="product-card-region">{product.region} <span>·</span> {product.appellation}</span>
        <Link href={`/la-cave/${product.slug}`} className="product-card-title">{product.name} <ArrowUpRight size={17} strokeWidth={1.3} /></Link>
        <div className="product-card-bottom"><span>{product.producer}{product.vintage ? ` · ${product.vintage}` : ""}</span><strong>{formatPrice(product.priceCents)}</strong></div>
      </div>
    </article>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const available = product.stock > 0;

  return (
    <div className="product-purchase">
      <div className="quantity-control">
        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité"><Minus size={16} /></button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((q) => Math.min(24, product.stock, q + 1))} aria-label="Augmenter la quantité"><Plus size={16} /></button>
      </div>
      <button className="button button-dark purchase-button" disabled={!available} onClick={() => addItem({ id: product.id, slug: product.slug, name: product.name, producer: product.producer, color: product.color, priceCents: product.priceCents }, quantity)}>
        {available ? "Ajouter au panier" : "Indisponible"} <ArrowUpRight size={18} />
      </button>
    </div>
  );
}
