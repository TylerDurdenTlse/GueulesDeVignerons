import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { proSessions } from "@/db/schema";
import { hashToken, PRO_COOKIE } from "@/lib/pro-auth";

export async function POST() {
  const token = (await cookies()).get(PRO_COOKIE)?.value;
  if (token) await db.delete(proSessions).where(eq(proSessions.tokenHash, hashToken(token)));
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PRO_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "lax" });
  return response;
}
