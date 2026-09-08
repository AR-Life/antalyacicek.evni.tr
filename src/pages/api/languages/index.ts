import { db } from "../../../db";
import { languages } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../../lib/auth-guard";

export const POST = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const { name, code, isDefault } = body;

  if (!name || !code) {
    return new Response(JSON.stringify({ error: "Name and Code are required" }), { status: 400 });
  }

  // If this one is set as default, remove default from others
  if (isDefault) {
    await db.update(languages).set({ isDefault: false }).where(eq(languages.isDefault, true));
  }

  await db.insert(languages).values({
    id: `lang-${crypto.randomUUID()}`,
    code: code.toLowerCase(),
    name,
    isActive: true,
    isDefault: isDefault || false,
    sortOrder: 0
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
