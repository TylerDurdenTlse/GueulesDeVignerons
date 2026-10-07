"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { ProductBottle } from "@/components/product-bottle";
import { formatPrice } from "@/lib/catalog";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  producer: string;
  color: string;
  priceCents: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mensotte_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed.filter((item): item is CartItem =>
              typeof item === "object" && item !== null &&
              typeof item.id === "number" && typeof item.name === "string" &&
              typeof item.priceCents === "number" && typeof item.quantity === "number"
            ));
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (item, quantity = 1) => {
      const safeQuantity = Math.max(1, Math.min(24, quantity));
      setItems((current) => {
        const existing = current.find((line) => line.id === item.id);
        if (existing) return current.map((line) => line.id === item.id ? { ...line, quantity: Math.min(24, line.quantity + safeQuantity) } : line);
        return [...current, { ...item, quantity: safeQuantity }];
      });
      setIsOpen(true);
    },
    setQuantity: (id, quantity) => {
      if (quantity <= 0) setItems((current) => current.filter((item) => item.id !== id));
      else setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.min(24, quantity) } : item));
    },
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
  }), [items, isOpen]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, setQuantity, removeItem } = useCart();
  if (!isOpen) return null;

  return (
    <div className="drawer-root" role="presentation">
      <button className="drawer-backdrop" onClick={closeCart} aria-label="Fermer le panier" />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Votre panier">
        <div className="drawer-heading">
          <div>
            <span className="eyebrow">VOTRE SÉLECTION</span>
            <h2>Le panier <span className="drawer-count">{count}</span></h2>
          </div>
          <button className="icon-button" onClick={closeCart} aria-label="Fermer"><X size={21} strokeWidth={1.5} /></button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <ShoppingBag size={40} strokeWidth={1} />
            <h3>La cave vous attend.</h3>
            <p>Il ne manque qu&apos;une belle bouteille pour commencer l&apos;histoire.</p>
            <Link className="button button-dark" href="/la-cave" onClick={closeCart}>Explorer la cave <ArrowRight size={17} /></Link>
          </div>
        ) : (
          <>
            <div className="drawer-lines">
              {items.map((item) => (
                <div className="drawer-line" key={item.id}>
                  <Link href={`/la-cave/${item.slug}`} onClick={closeCart} className="drawer-line-image"><ProductBottle color={item.color} /></Link>
                  <div className="drawer-line-info">
                    <span className="micro-label">{item.producer}</span>
                    <Link href={`/la-cave/${item.slug}`} onClick={closeCart} className="drawer-line-name">{item.name}</Link>
                    <span className="drawer-line-price">{formatPrice(item.priceCents)}</span>
                    <div className="drawer-line-bottom">
                      <div className="quantity-control quantity-small">
                        <button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label={`Retirer une bouteille de ${item.name}`}><Minus size={13} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Ajouter une bouteille de ${item.name}`}><Plus size={13} /></button>
                      </div>
                      <button className="text-remove" onClick={() => removeItem(item.id)}>Retirer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-footer">
              <div className="drawer-subtotal"><span>Sous-total</span><strong>{formatPrice(subtotal)}</strong></div>
              <p>Frais de livraison confirmés avant règlement.</p>
              <Link className="button button-dark button-full" href="/panier" onClick={closeCart}>Voir ma commande <ArrowRight size={17} /></Link>
              <button className="drawer-continue" onClick={closeCart}>Continuer ma découverte</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
