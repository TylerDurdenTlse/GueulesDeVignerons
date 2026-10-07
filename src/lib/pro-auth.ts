import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { proAccounts, proSessions } from "@/db/schema";

export const PRO_COOKIE = "mensotte_pro";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, saved: string) {
  try {
    const [salt, expectedHex] = saved.split(":");
    if (!salt || !expectedHex) return false;
    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, "hex");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createProSession(accountId: number) {
  const token = randomBytes(32).toString("hex");
  await db.insert(proSessions).values({
    accountId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
  });
  return token;
}

export async function getCurrentPro() {
  const token = (await cookies()).get(PRO_COOKIE)?.value;
  if (!token) return null;
  const [result] = await db
    .select({
      id: proAccounts.id,
      company: proAccounts.company,
      contactName: proAccounts.contactName,
      email: proAccounts.email,
      activity: proAccounts.activity,
    })
    .from(proSessions)
    .innerJoin(proAccounts, eq(proSessions.accountId, proAccounts.id))
    .where(and(eq(proSessions.tokenHash, hashToken(token)), gt(proSessions.expiresAt, new Date())))
    .limit(1);
  return result ?? null;
}
