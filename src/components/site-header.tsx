"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";

const navigation = [
  { href: "/la-maison", label: "La maison" },
  { href: "/la-cave", label: "La cave" },
  { href: "/club-epicure", label: "Club Épicure" },
  { href: "/professionnels", label: "Professionnels" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <>
      <div className="announcement-bar">
        <span>UNE MAISON DE VIN, DES HISTOIRES À PARTAGER</span>
        <Link href="/club-epicure">Découvrir le Club Épicure <ArrowUpRight size={13} /></Link>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Gueules de Vignerons par RVins, accueil" onClick={() => setMobileOpen(false)}>
            <span className="brand-symbol" aria-hidden="true">RVins</span>
            <span className="brand-type"><strong>GUEULES DE<br />VIGNERONS</strong><small>PAR RVins · CAVE & RENCONTRES</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Navigation principale">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "nav-active" : ""}>{item.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/espace-pro" className="header-pro"><UserRound size={18} strokeWidth={1.5} /><span>Espace pro</span></Link>
            <span className="header-divider" />
            <button type="button" className="header-cart" onClick={openCart} aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}><ShoppingBag size={20} strokeWidth={1.5} /><span className="header-cart-count">{count}</span></button>
            <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={mobileOpen}>{mobileOpen ? <X size={25} strokeWidth={1.5} /> : <Menu size={25} strokeWidth={1.5} />}</button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-nav" aria-label="Navigation mobile">
            {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>{item.label}<ArrowUpRight size={18} /></Link>)}
            <Link href="/espace-pro" onClick={() => setMobileOpen(false)}>Espace professionnel <ArrowUpRight size={18} /></Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>Nous écrire <ArrowUpRight size={18} /></Link>
          </nav>
        )}
      </header>
    </>
  );
}
