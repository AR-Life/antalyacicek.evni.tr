import { db } from "../../../db";
import { faqs, faqTranslations } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIContext } from "astro";
import { requireAuth } from "../../../lib/auth-guard";

export const PUT = async ({ request, params }: APIContext) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  const body = await request.json();
  const { status, sortOrder, translations } = body;

  await db.update(faqs).set({
    status: status !== undefined ? status : "published",
    sortOrder: sortOrder !== undefined ? sortOrder : 0,
  }).where(eq(faqs.id, id));

  if (translations && Array.isArray(translations)) {
    // Delete old translations and insert new ones
    await db.delete(faqTranslations).where(eq(faqTranslations.faqId, id));
    
    const transRows = translations.map(t => ({
      id: `faqt-${crypto.randomUUID()}`,
      faqId: id,
      languageCode: t.languageCode,
      question: t.question,
      answer: t.answer,
    }));
    if (transRows.length > 0) {
      await db.insert(faqTranslations).values(transRows);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE = async ({ request, params }: APIContext) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  await db.delete(faqTranslations).where(eq(faqTranslations.faqId, id));
  await db.delete(faqs).where(eq(faqs.id, id));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
