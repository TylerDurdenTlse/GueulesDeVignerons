import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Gift, LayoutList, Sparkles } from "lucide-react";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, products } from "@/db/schema";
import { getCurrentPro } from "@/lib/pro-auth";
import { ProAuthForm, ProLogoutButton } from "@/components/pro-auth-form";
import { InquiryForm } from "@/components/inquiry-form";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Espace professionnel" };

export default async function EspaceProPage() {
  const account = await getCurrentPro();

  if (!account) return <main className="pro-login-layout page-shell"><div className="pro-login-intro"><span className="eyebrow eyebrow-light">GUEULES DE VIGNERONS / LES PROFESSIONNELS</span><h1>Une relation de confiance, <em>ça se cultive.</em></h1><p>Un espace pour construire vos projets vin avec nous, retrouver nos sélections et nous faire part de vos besoins en toute simplicité.</p><div className="pro-login-benefits"><span>✳ Une sélection pensée pour votre activité</span><span>✳ Un interlocuteur à l&apos;écoute</span><span>✳ Des projets sur mesure</span></div><Link href="/professionnels" className="text-link text-link-light">Découvrir l&apos;accompagnement <ArrowRight size={17} /></Link></div><ProAuthForm /></main>;

  const [featured, recentRequests] = await Promise.all([
    db.select().from(products).where(eq(products.featured, true)).orderBy(asc(products.sortOrder)).limit(3),
    db.select().from(inquiries).where(and(eq(inquiries.email, account.email), eq(inquiries.type, "pro_quote"))).orderBy(desc(inquiries.createdAt)).limit(5),
  ]);

  return <main className="pro-dashboard page-shell">
    <div className="dashboard-header"><div><span className="eyebrow">VOTRE ESPACE GUEULES DE VIGNERONS</span><h1>Bonjour, <em>{account.contactName.split(" ")[0]}.</em></h1><p>{account.company} · Un espace pour imaginer de belles choses ensemble.</p></div><ProLogoutButton /></div>
    <div className="dashboard-welcome"><span className="dashboard-welcome-star">✳</span><div><span className="eyebrow eyebrow-light">BIENVENUE CHEZ VOUS</span><h2>De quoi avez-vous envie <em>aujourd&apos;hui ?</em></h2><p>Une carte à faire évoluer, un événement à organiser ou une attention à offrir : dites-nous ce dont vous avez besoin.</p></div></div>
    <div className="dashboard-actions"><Link href="#demande-pro"><LayoutList size={26} strokeWidth={1.2} /><span>UNE SÉLECTION SUR MESURE</span><h3>Parlons de votre carte</h3><p>Un besoin précis ou une carte à faire vivre ?</p><ArrowUpRight size={20} /></Link><Link href="/club-epicure"><Sparkles size={26} strokeWidth={1.2} /><span>UNE EXPÉRIENCE À PARTAGER</span><h3>Créer un moment</h3><p>Dégustations, équipes, clients, événements.</p><ArrowUpRight size={20} /></Link><Link href="/coffrets"><Gift size={26} strokeWidth={1.2} /><span>UNE ATTENTION À OFFRIR</span><h3>Imaginer un coffret</h3><p>Des cadeaux qui racontent quelque chose.</p><ArrowUpRight size={20} /></Link></div>
    <section id="demande-pro" className="dashboard-request"><div><span className="eyebrow">UN PROJET EN TÊTE ?</span><h2>Faites-nous signe.</h2><p>Précisez vos envies, vos volumes ou votre échéance. Votre demande sera enregistrée dans votre nom d&apos;entreprise et nous permettra de préparer une proposition adaptée.</p></div><InquiryForm type="pro_quote" showOrganization buttonLabel="Envoyer ma demande" initialName={account.contactName} initialEmail={account.email} initialOrganization={account.company} /></section>
    <section className="dashboard-history"><span className="eyebrow">VOS ÉCHANGES AVEC LA MAISON</span><h2>Mes dernières <em>demandes.</em></h2>{recentRequests.length ? <div className="history-list">{recentRequests.map((item) => <div key={item.id}><span>DEMANDE ENVOYÉE LE {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(item.createdAt).toUpperCase()}</span><p>{item.message}</p><strong>Bien reçue ✳</strong></div>)}</div> : <p className="history-empty">Vous n&apos;avez pas encore envoyé de demande depuis cet espace. Votre prochain projet peut commencer juste au-dessus.</p>}</section>
    <section className="dashboard-selection"><div className="section-heading-row"><div><span className="eyebrow">EN CE MOMENT DANS LA CAVE</span><h2>Quelques bouteilles <em>à découvrir.</em></h2></div><Link href="/la-cave" className="text-link">Voir la cave <ArrowRight size={18} /></Link></div><div className="product-grid related-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
  </main>;
}
