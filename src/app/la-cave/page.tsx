import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "La cave — vins & découvertes", description: "Découvrez la cave Gueules de Vignerons par RVins : des vins à choisir par région, par couleur ou par envie." };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const single = (value: string | string[] | undefined) => typeof value === "string" ? value : "";

export default async function CavePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = single(params.q).slice(0, 100);
  const region = single(params.region).slice(0, 100);
  const color = single(params.color).slice(0, 40);
  const sort = single(params.sort) || "selection";
  const top = single(params.top) === "1" && Boolean(region) && !q && !color;
  const page = Math.max(1, Math.min(1000, Number.parseInt(single(params.page) || "1", 10) || 1));
  const pageSize = 12;

  const filters = [
    q ? or(ilike(products.name, `%${q}%`), ilike(products.producer, `%${q}%`), ilike(products.appellation, `%${q}%`), ilike(products.region, `%${q}%`)) : undefined,
    region ? eq(products.region, region) : undefined,
    color ? eq(products.color, color) : undefined,
  ].filter((condition): condition is NonNullable<typeof condition> => Boolean(condition));
  const where = filters.length ? and(...filters) : undefined;
  const order = sort === "prix-asc" ? [asc(products.priceCents)] : sort === "prix-desc" ? [desc(products.priceCents)] : sort === "nom" ? [asc(products.name)] : [desc(products.featured), asc(products.sortOrder), asc(products.name)];

  const [[totalResult], regions, selection] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(where),
    db.select({ region: products.region, count: sql<number>`count(*)::int` }).from(products).groupBy(products.region).orderBy(asc(products.region)),
    db.select().from(products).where(where).orderBy(...order).limit(top ? 10 : pageSize).offset(top ? 0 : (page - 1) * pageSize),
  ]);
  const total = totalResult.count;
  const totalPages = Math.ceil(total / pageSize);
  const makePageUrl = (pageNumber: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (region) query.set("region", region);
    if (color) query.set("color", color);
    if (sort !== "selection") query.set("sort", sort);
    query.set("page", String(pageNumber));
    return `/la-cave?${query.toString()}`;
  };

  return (
    <main>
      <section className="catalog-hero"><div className="page-shell catalog-hero-inner"><div><span className="eyebrow eyebrow-light">LA CAVE GUEULES DE VIGNERONS / UNE SÉLECTION VIVANTE</span><h1>Le plaisir de <em>bien choisir.</em></h1></div><p>Des vins pour les grandes occasions. Et surtout pour toutes les autres. Parcourez la cave à votre façon.</p><span className="catalog-hero-mark" aria-hidden="true">RVins</span></div></section>
      <div className="catalog-content page-shell">
        <div className="catalog-regions"><span className="catalog-regions-title">UNE BALADE PAR RÉGION <ArrowRight size={16} /></span><div className="region-list"><Link href="/la-cave" className={!region ? "active" : ""}>Toute la cave</Link>{regions.map((item) => <Link key={item.region} href={`/la-cave?region=${encodeURIComponent(item.region)}&top=1`} className={region === item.region ? "active" : ""}>{item.region} <small>{item.count}</small></Link>)}</div></div>
        <form className="catalog-filters" action="/la-cave" method="GET"><div className="catalog-search"><Search size={18} strokeWidth={1.5} /><input type="search" name="q" aria-label="Rechercher un vin" placeholder="Un vin, un domaine, une région..." defaultValue={q} /></div><select name="region" aria-label="Filtrer par région" defaultValue={region}><option value="">Toutes les régions</option>{regions.map((item) => <option key={item.region} value={item.region}>{item.region}</option>)}</select><select name="color" aria-label="Filtrer par couleur" defaultValue={color}><option value="">Tous les styles</option><option value="rouge">Rouges</option><option value="blanc">Blancs</option><option value="rose">Rosés</option><option value="bulles">Bulles</option><option value="sans-alcool">Sans alcool</option></select><select name="sort" aria-label="Trier les vins" defaultValue={sort}><option value="selection">Notre sélection</option><option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option><option value="nom">Nom A à Z</option></select><button type="submit" aria-label="Appliquer les filtres"><SlidersHorizontal size={18} /></button></form>
        <div className="catalog-results-head"><div><span className="eyebrow">À DÉCOUVRIR MAINTENANT</span><h2>{top ? `Notre top ${Math.min(10, total)} en ${region}` : region ? `Les vins de ${region}` : "La sélection de la maison"}</h2></div><span>{top ? `${Math.min(10, total)} coups de cœur` : `${total} référence${total > 1 ? "s" : ""}`}</span></div>
        {top && <div className="top-region-note">Une sélection de coups de cœur, classée par la maison. <Link href={`/la-cave?region=${encodeURIComponent(region)}`}>Voir toutes les références de {region} <ArrowRight size={15} /></Link></div>}
        {selection.length ? <div className="product-grid catalog-product-grid">{selection.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-empty"><h3>Pas de bouteille trouvée cette fois.</h3><p>Essayez une autre région, une autre envie ou laissez-vous guider par toute la cave.</p><Link href="/la-cave" className="button button-dark">Voir toute la cave <ArrowRight size={17} /></Link></div>}
        {!top && totalPages > 1 && <nav className="catalog-pagination" aria-label="Pagination du catalogue">{page > 1 && <Link href={makePageUrl(page - 1)}>← Précédent</Link>}<span>Page {page} / {totalPages}</span>{page < totalPages && <Link href={makePageUrl(page + 1)}>Suivant →</Link>}</nav>}
        <p className="catalog-demo-note">✳ Les cuvées et tarifs visibles ici sont des exemples de présentation ; le catalogue réel sera ajouté avant l&apos;ouverture commerciale.</p>
      </div>
    </main>
  );
}
