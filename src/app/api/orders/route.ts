import { randomBytes } from "node:crypto";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";

class OrderError extends Error {}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const postalCode = String(body.postalCode ?? "").trim();
    const city = String(body.city ?? "").trim();
    const note = String(body.note ?? "").trim();
    const lines = body.items;

    if (name.length < 2 || name.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 || phone.length < 6 || phone.length > 50 || address.length < 5 || postalCode.length < 3 || city.length < 2 || note.length > 2000 || body.ageConfirmed !== true || !Array.isArray(lines) || lines.length === 0 || lines.length > 30) {
      throw new OrderError("Vérifiez vos coordonnées et confirmez votre majorité.");
    }

    const items = lines.map((line: unknown) => {
      const value = line as { id?: unknown; quantity?: unknown };
      return { id: value?.id, quantity: value?.quantity };
    });
    if (items.some((item) => !Number.isInteger(item.id) || Number(item.id) < 1 || !Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 24) || new Set(items.map((item) => item.id)).size !== items.length) {
      throw new OrderError("Le panier contient des quantités invalides.");
    }
    const validItems = items as { id: number; quantity: number }[];

    const reference = await db.transaction(async (tx) => {
      const catalog = await tx.select().from(products).where(inArray(products.id, validItems.map((item) => item.id)));
      if (catalog.length !== validItems.length) throw new OrderError("Une bouteille de votre panier n'est plus disponible.");
      const byId = new Map(catalog.map((product) => [product.id, product]));
      const totalCents = validItems.reduce((sum, item) => sum + byId.get(item.id)!.priceCents * item.quantity, 0);

      for (const item of validItems) {
        const [updated] = await tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(and(eq(products.id, item.id), gte(products.stock, item.quantity)))
          .returning({ id: products.id });
        if (!updated) throw new OrderError(`Stock insuffisant pour ${byId.get(item.id)!.name}.`);
      }

      const orderReference = `MN-${new Date().getFullYear()}-${randomBytes(6).toString("hex").toUpperCase()}`;
      const [order] = await tx.insert(orders).values({ reference: orderReference, customerName: name, email, phone, address, postalCode, city, note, totalCents }).returning({ id: orders.id });
      await tx.insert(orderItems).values(validItems.map((item) => ({ orderId: order.id, productId: item.id, productName: byId.get(item.id)!.name, unitPriceCents: byId.get(item.id)!.priceCents, quantity: item.quantity })));
      return orderReference;
    });

    return Response.json({ reference }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ error: "La commande n'a pas pu être enregistrée. Veuillez réessayer." }, { status: 500 });
  }
}
