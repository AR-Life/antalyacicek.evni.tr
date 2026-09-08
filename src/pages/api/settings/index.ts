import { db } from "../../../db";
import { organization } from "../../../db/schema";
import { requireAuth } from "../../../lib/auth-guard";

export const GET = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const rows = await db.select().from(organization).limit(1);
  const data = rows.length > 0 ? rows[0] : null;

  return new Response(JSON.stringify(data || {}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const { brandName, legalName, phone, whatsapp, email, website } = body;

  const rows = await db.select().from(organization).limit(1);
  
  if (rows.length > 0) {
    const existingId = rows[0].id;
    await db.update(organization).set({
      brandName: brandName || "",
      legalName: legalName || "",
      phone: phone || "",
      whatsapp: whatsapp || "",
      email: email || "",
      website: website || "",
    });
  } else {
    await db.insert(organization).values({
      id: `org-${crypto.randomUUID()}`,
      brandName: brandName || "",
      legalName: legalName || "",
      phone: phone || "",
      whatsapp: whatsapp || "",
      email: email || "",
      website: website || "",
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
