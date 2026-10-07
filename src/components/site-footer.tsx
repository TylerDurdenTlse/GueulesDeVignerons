import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-invitation page-shell">
        <div>
          <span className="eyebrow eyebrow-light">UNE BELLE HISTOIRE COMMENCE ICI</span>
          <h2>On en parle <em>autour d&apos;un verre ?</em></h2>
        </div>
        <Link href="/contact" className="footer-contact-link">Écrivons la suite ensemble <ArrowUpRight size={24} strokeWidth={1.3} /></Link>
      </div>
      <div className="footer-main page-shell">
        <div className="footer-brand-column">
          <Link href="/" className="footer-logo" aria-label="Gueules de Vignerons par RVins, accueil"><span className="footer-logo-mark">RVins</span><span className="footer-logo-type"><strong>GUEULES DE<br />VIGNERONS</strong><small>PAR RVins</small></span></Link>
          <p>Des vins choisis avec le cœur.<br />Des rencontres qui restent.</p>
        </div>
        <div className="footer-link-group"><h3>La maison</h3><Link href="/la-maison">Notre histoire</Link><Link href="/la-cave">La cave</Link><Link href="/club-epicure">Le Club Épicure</Link></div>
        <div className="footer-link-group"><h3>À vos côtés</h3><Link href="/professionnels">Pour les professionnels</Link><Link href="/coffrets">Coffrets & cadeaux</Link><Link href="/espace-pro">Espace pro</Link></div>
        <div className="footer-link-group"><h3>Un mot pour nous ?</h3><p>Une question, une idée de dégustation, une occasion à célébrer ?</p><Link className="footer-underlined" href="/contact">Nous écrire ↗</Link></div>
      </div>
      <div className="footer-bottom page-shell">
        <span>© {new Date().getFullYear()} Gueules de Vignerons par RVins</span>
        <span>L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération. Vente réservée aux personnes majeures.</span>
        <Link href="/mentions-legales">Mentions légales & confidentialité</Link>
      </div>
      <div className="footer-demo page-shell">Site de démonstration : références et prix indicatifs, à remplacer avant ouverture commerciale. Les commandes sont des demandes sans paiement en ligne.</div>
    </footer>
  );
}
