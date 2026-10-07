import "dotenv/config";
import { db, pool } from "../src/db";
import { products } from "../src/db/schema";
import { demoProducts } from "../src/data/demo-products";

async function main() {
  for (const product of demoProducts) {
    await db.insert(products).values(product).onConflictDoNothing({ target: products.slug });
  }
  console.log(`${demoProducts.length} références de démonstration vérifiées.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
