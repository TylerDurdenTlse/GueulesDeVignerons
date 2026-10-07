import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { getCurrentPro } from "@/lib/pro-auth";

const allowedTypes = new Set(["contact", "club", "cadeau", "pro", "pro_quote"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const type = String(body.type ?? "contact");
    let name = String(body.name ?? "").trim();
    let email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    let organization = String(body.organization ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (type === "pro_quote") {
      const account = await getCurrentPro();
      if (!account) return Response.json({ error: "Connectez-vous à votre espace professionnel." }, { status: 401 });
      name = account.contactName;
      email = account.email;
      organization = account.company;
    }

    if (!allowedTypes.has(type) || name.length < 2 || name.length > 160 || !emailPattern.test(email) || email.length > 255 || message.length < 10 || message.length > 4000 || phone.length > 50 || organization.length > 180) {
      return Response.json({ error: "Vérifiez les informations saisies puis réessayez." }, { status: 400 });
    }

    await db.insert(inquiries).values({ type, name, email, phone, organization, message });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Impossible d'enregistrer votre message pour le moment." }, { status: 500 });
  }
}
