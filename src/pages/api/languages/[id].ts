import { db } from "../../../db";
import { languages } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../../lib/auth-guard";

export const DELETE = async ({ request, params }: { request: Request; params: { id: string } }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Dil ID'si gerekli" }), { status: 400 });
  }

  // Varsayılan dili silmeyi engelleyebiliriz veya direkt silebiliriz.
  const lang = await db.select().from(languages).where(eq(languages.id, id)).get();
  
  if (!lang) {
    return new Response(JSON.stringify({ error: "Dil bulunamadı" }), { status: 404 });
  }
  
  if (lang.isDefault) {
     return new Response(JSON.stringify({ error: "Varsayılan dili silemezsiniz. Lütfen önce başka bir dili varsayılan yapın." }), { status: 400 });
  }

  // TODO: İleride bu dilin kullanıldığı (productTranslations vb) tabloları da temizlemek veya silmeyi engellemek gerekebilir.
  
  await db.delete(languages).where(eq(languages.id, id));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
