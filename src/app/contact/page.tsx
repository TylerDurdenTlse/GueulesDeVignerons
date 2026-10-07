import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Wine } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = { title: "Nous contacter", description: "Parlez-nous de votre projet, d'une dégustation ou d'une envie de vin. Gueules de Vignerons par RVins vous répond." };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const value = (input: string | string[] | undefined) => typeof input === "string" ? input : "";

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const objet = value(params.objet);
  const niveau = value(params.niveau).slice(0, 80);
  const type = objet === "club" || objet === "cadeau" || objet === "pro" ? objet : "contact";
  const message = type === "club" && niveau ? `Bonjour, j'aimerais organiser une dégustation « ${niveau} ». Voici mon occasion, mon nombre de personnes et mes envies : ` : type === "cadeau" ? "Bonjour, j'aimerais composer un coffret cadeau. Voici mon occasion et mon budget : " : type === "pro" ? "Bonjour, j'aimerais échanger sur mon projet professionnel : " : "";

  return <main className="contact-page page-shell"><div className="contact-intro"><span className="eyebrow">UN MOT, UNE RENCONTRE</span><h1>Tout commence par <em>une conversation.</em></h1><p>Vous avez une question, une envie précise ou juste le début d&apos;une idée ? Écrivez-nous. Le meilleur moment pour parler de vin, c&apos;est maintenant.</p><div className="contact-details"><div><span className="contact-icon"><Wine size={23} strokeWidth={1.2} /></span><div><h3>Un conseil, sans jargon.</h3><p>Pour trouver le vin juste pour le bon moment.</p></div></div><div><span className="contact-icon"><HeartHandshake size={23} strokeWidth={1.2} /></span><div><h3>Un projet à imaginer.</h3><p>Dégustation, cadeau, carte des vins ou rencontre.</p></div></div></div><Link href="/club-epicure" className="text-link">Découvrir le Club Épicure <ArrowUpRight size={17} /></Link></div><div className="contact-form-card"><span className="eyebrow">ÉCRIVEZ-NOUS</span><h2>On vous écoute.</h2><InquiryForm type={type} message={message} showOrganization={type === "pro" || type === "cadeau"} /></div></main>;
}
