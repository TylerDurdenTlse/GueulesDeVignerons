import { and, asc, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const entries = await db.select().from(products)
    .where(and(eq(products.isDemo, false), gt(products.stock, 0)))
    .orderBy(desc(products.featured), asc(products.sortOrder))
    .limit(10);
  const origin = new URL(request.url).origin;

  return Response.json({
    generatedAt: new Date().toISOString(),
    editorialReviewRequired: true,
    items: entries.map((product) => ({
      id: product.id,
      title: product.name,
      region: product.region,
      category: product.color,
      imageUrl: product.imageUrl,
      url: `${origin}/la-cave/${product.slug}`,
      caption: `Dans la cave Gueules de Vignerons par RVins : ${product.name}, ${product.appellation} (${product.region}). ${product.description}\n\nUne bouteille, une histoire à partager. #GueulesDeVignerons #RVins #Vin #Rencontres${product.color === "sans-alcool" ? "" : "\n\nL'abus d'alcool est dangereux pour la santé, à consommer avec modération."}`,
    })),
  });
}
