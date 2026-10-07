import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { proAccounts } from "@/db/schema";
import { createProSession, hashPassword, PRO_COOKIE, SESSION_MAX_AGE } from "@/lib/pro-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const company = String(body.company ?? "").trim();
    const contactName = String(body.contactName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const activity = String(body.activity ?? "autre").trim();

    if (company.length < 2 || company.length > 180 || contactName.length < 2 || contactName.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 || password.length < 8 || password.length > 128 || activity.length > 100) {
      return NextResponse.json({ error: "Vérifiez vos informations. Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }
    const existing = await db.select({ id: proAccounts.id }).from(proAccounts).where(eq(proAccounts.email, email)).limit(1);
    if (existing.length) return NextResponse.json({ error: "Un compte existe déjà avec cette adresse email." }, { status: 409 });

    const [account] = await db.insert(proAccounts).values({ company, contactName, email, passwordHash: hashPassword(password), activity }).returning({ id: proAccounts.id });
    const token = await createProSession(account.id);
    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set(PRO_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE });
    return response;
  } catch {
    return NextResponse.json({ error: "Impossible de créer le compte pour le moment." }, { status: 500 });
  }
}
