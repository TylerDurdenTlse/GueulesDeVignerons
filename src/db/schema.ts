import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  producer: varchar("producer", { length: 180 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  appellation: varchar("appellation", { length: 160 }).notNull(),
  color: varchar("color", { length: 40 }).notNull(),
  vintage: integer("vintage"),
  description: text("description").notNull(),
  story: text("story").notNull().default(""),
  tastingNotes: text("tasting_notes").notNull().default(""),
  pairing: text("pairing").notNull().default(""),
  imageUrl: text("image_url"),
  priceCents: integer("price_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  isDemo: boolean("is_demo").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: text("address").notNull(),
  postalCode: varchar("postal_code", { length: 30 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  note: text("note").notNull().default(""),
  totalCents: integer("total_cents").notNull(),
  status: varchar("status", { length: 40 }).notNull().default("a_confirmer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 180 }).notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 40 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull().default(""),
  organization: varchar("organization", { length: 180 }).notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const proAccounts = pgTable("pro_accounts", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 180 }).notNull(),
  contactName: varchar("contact_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  activity: varchar("activity", { length: 100 }).notNull().default("autre"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const proSessions = pgTable("pro_sessions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => proAccounts.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
