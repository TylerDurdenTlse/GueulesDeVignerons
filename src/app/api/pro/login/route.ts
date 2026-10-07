import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { proAccounts } from "@/db/schema";
import { createProSession, PRO_COOKIE, SESSION_MAX_AGE, verifyPassword } from "@/lib/pro-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!email || !password) return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });

    const [account] = await db.select().from(proAccounts).where(eq(proAccounts.email, email)).limit(1);
    if (!account || !verifyPassword(password, account.passwordHash)) return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });

    const token = await createProSession(account.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(PRO_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE });
    return response;
  } catch {
    return NextResponse.json({ error: "Connexion momentanément indisponible." }, { status: 500 });
  }
}
