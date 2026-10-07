"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { ProductBottle } from "@/components/product-bottle";
import { formatPrice } from "@/lib/catalog";

export function CheckoutPage() {
  const { items, subtotal, setQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const fields = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"), email: fields.get("email"), phone: fields.get("phone"),
          address: fields.get("address"), postalCode: fields.get("postalCode"), city: fields.get("city"),
          note: fields.get("note"), ageConfirmed: fields.get("ageConfirmed") === "on",
          items: items.map(({ id, quantity }) => ({ id, quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Impossible d'enregistrer la commande.");
      clearCart();
      router.push(`/commande/${result.reference}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Veuillez réessayer.");
      setSending(false);
    }
  }

  if (items.length === 0 && !sending) return <main className="empty-cart-page page-shell"><ShoppingBag size={48} strokeWidth={1} /><span className="eyebrow">VOTRE PANIER</span><h1>Il y a de la place pour <em>une belle découverte.</em></h1><p>Votre panier est encore vide. La cave n&apos;attend que vous.</p><Link className="button button-dark" href="/la-cave">Explorer la cave <ArrowRight size={18} /></Link></main>;

  return (
    <main className="checkout-page page-shell">
      <Link href="/la-cave" className="back-link"><ArrowLeft size={16} /> Continuer ma découverte</Link>
      <div className="checkout-title"><span className="eyebrow">VOTRE SÉLECTION, VOTRE MOMENT</span><h1>Ma <em>commande.</em></h1><p>Encore quelques informations et nous pourrons préparer la suite ensemble.</p></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form-section"><span className="step-number">01</span><h2>Vos coordonnées</h2><p>Pour vous confirmer votre sélection et échanger sur la livraison.</p><div className="form-row"><label>Nom et prénom <span>*</span><input name="name" required minLength={2} autoComplete="name" placeholder="Votre nom" /></label><label>Email <span>*</span><input name="email" required type="email" autoComplete="email" placeholder="vous@exemple.fr" /></label></div><div className="form-row"><label>Téléphone <span>*</span><input name="phone" required type="tel" minLength={6} autoComplete="tel" placeholder="06 00 00 00 00" /></label></div></div>
          <div className="checkout-form-section"><span className="step-number">02</span><h2>Adresse de livraison</h2><p>Les modalités et frais de livraison seront confirmés avant tout règlement.</p><label>Adresse complète <span>*</span><input name="address" required minLength={5} autoComplete="street-address" placeholder="Numéro, rue, complément..." /></label><div className="form-row"><label>Code postal <span>*</span><input name="postalCode" required minLength={3} autoComplete="postal-code" placeholder="Code postal" /></label><label>Ville <span>*</span><input name="city" required minLength={2} autoComplete="address-level2" placeholder="Votre ville" /></label></div></div>
          <div className="checkout-form-section"><span className="step-number">03</span><h2>Un mot en plus ?</h2><label>Note pour la maison <textarea name="note" rows={3} placeholder="Une occasion particulière, une question, une attention à prévoir..." /></label></div>
          <label className="age-confirmation"><input type="checkbox" name="ageConfirmed" required /><span>Je certifie avoir au moins 18 ans et comprends que cette demande sera confirmée par la maison avant tout règlement.</span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark checkout-submit" type="submit" disabled={sending}>{sending ? "Enregistrement en cours..." : "Envoyer ma commande"} <ArrowRight size={18} /></button>
          <p className="checkout-reassurance"><ShieldCheck size={15} /> Aucun paiement n&apos;est prélevé à cette étape.</p>
        </form>
        <aside className="checkout-summary"><div className="summary-heading"><span className="eyebrow">LE RÉCAPITULATIF</span><h2>Vos bouteilles</h2></div><div className="summary-lines">{items.map((item) => <div className="summary-line" key={item.id}><div className="summary-bottle"><ProductBottle color={item.color} /></div><div className="summary-line-info"><Link href={`/la-cave/${item.slug}`}>{item.name}</Link><span>{item.producer}</span><div className="quantity-control quantity-small"><button type="button" onClick={() => item.quantity === 1 ? removeItem(item.id) : setQuantity(item.id, item.quantity - 1)} aria-label="Diminuer"><Minus size={12} /></button><span>{item.quantity}</span><button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Augmenter"><Plus size={12} /></button></div></div><strong>{formatPrice(item.priceCents * item.quantity)}</strong></div>)}</div><div className="summary-total"><span>Sous-total</span><strong>{formatPrice(subtotal)}</strong></div><div className="summary-note"><Check size={15} /><p>Votre demande est enregistrée. Disponibilités et frais de livraison sont confirmés avant paiement.</p></div></aside>
      </div>
    </main>
  );
}
