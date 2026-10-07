import "dotenv/config";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { db, pool } from "../src/db";
import { products } from "../src/db/schema";

const path = process.argv[2];

async function main() {
  if (!path) throw new Error("Usage : npx tsx scripts/import-catalogue.ts catalogue.csv");

  const content = readFileSync(path, "utf8");
  const delimiter = content.split(/\r?\n/, 1)[0].includes(";") ? ";" : ",";
  const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true, bom: true, delimiter }) as Record<string, string>[];
  if (rows.length === 0) throw new Error("Le fichier CSV est vide.");

  const entries = rows.map((row, index) => {
    const required = ["slug", "name", "producer", "region", "appellation", "color", "description", "price"];
    const missing = required.find((key) => !row[key]);
    if (missing) throw new Error(`Ligne ${index + 2} : colonne ${missing} manquante.`);

    const priceCents = Math.round(Number(row.price.replace(",", ".")) * 100);
    const stock = row.stock ? Number(row.stock) : 0;
    const vintage = row.vintage ? Number(row.vintage) : null;
    const imageUrl = row.imageUrl?.trim() || null;
    if (!Number.isInteger(priceCents) || priceCents < 0 || !Number.isInteger(stock) || stock < 0 || (vintage !== null && !Number.isInteger(vintage))) {
      throw new Error(`Ligne ${index + 2} : prix, stock ou millésime invalide.`);
    }
    if (imageUrl && (!/^(https?:\/\/|\/)/.test(imageUrl) || imageUrl.length > 2000)) {
      throw new Error(`Ligne ${index + 2} : URL de photo invalide.`);
    }

    return {
      slug: row.slug,
      name: row.name,
      producer: row.producer,
      region: row.region,
      appellation: row.appellation,
      color: row.color.toLowerCase(),
      vintage,
      description: row.description,
      story: row.story ?? "",
      tastingNotes: row.tastingNotes ?? "",
      pairing: row.pairing ?? "",
      imageUrl,
      priceCents,
      stock,
      featured: ["oui", "true", "1"].includes((row.featured ?? "").toLowerCase()),
      isDemo: false,
      sortOrder: row.sortOrder ? Number(row.sortOrder) || 0 : 0,
    };
  });

  await db.transaction(async (tx) => {
    for (const values of entries) {
      await tx.insert(products).values(values).onConflictDoUpdate({
        target: products.slug,
        set: {
          name: values.name,
          producer: values.producer,
          region: values.region,
          appellation: values.appellation,
          color: values.color,
          vintage: values.vintage,
          description: values.description,
          story: values.story,
          tastingNotes: values.tastingNotes,
          pairing: values.pairing,
          imageUrl: values.imageUrl,
          priceCents: values.priceCents,
          stock: values.stock,
          featured: values.featured,
          isDemo: false,
          sortOrder: values.sortOrder,
        },
      });
    }
  });

  console.log(`${entries.length} références importées ou mises à jour.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
