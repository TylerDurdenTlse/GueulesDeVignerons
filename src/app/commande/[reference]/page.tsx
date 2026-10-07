import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatPrice } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Commande enregistrée" };

export default async function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return (
    <main className="confirmation-page page-shell"><div className="confirmation-icon"><CheckCircle2 size={38} strokeWidth={1.15} /></div><span className="eyebrow">VOTRE HISTOIRE COMMENCE ICI</span><h1>Merci, {order.customerName.split(" ")[0]}.<br /><em>On s&apos;occupe de la suite.</em></h1><p className="confirmation-lead">Votre demande de commande a bien été enregistrée. Nous reviendrons vers vous pour confirmer les disponibilités, les modalités de livraison et le règlement.</p><div className="confirmation-box"><div className="confirmation-reference"><span>RÉFÉRENCE DE VOTRE DEMANDE</span><strong>{order.reference}</strong></div><div className="confirmation-items">{items.map((item) => <div key={item.id}><span>{item.quantity} × {item.productName}</span><strong>{formatPrice(item.quantity * item.unitPriceCents)}</strong></div>)}</div><div className="confirmation-total"><span>Sous-total indicatif</span><strong>{formatPrice(order.totalCents)}</strong></div><p>Aucun paiement n&apos;a été effectué. Conservez cette référence pour nos échanges.</p></div><Link href="/la-cave" className="button button-dark">Continuer à découvrir <ArrowRight size={18} /></Link></main>
  );
}
