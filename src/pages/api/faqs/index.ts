import { db } from "../../../db";
import { faqs, faqTranslations } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../../lib/auth-guard";

export const GET = async (context: import("astro").APIContext) => {
  const request = context.request;
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const rows = await db
    .select({
      id: faqs.id,
      status: faqs.status,
      sortOrder: faqs.sortOrder,
      question: faqTranslations.question,
      answer: faqTranslations.answer,
    })
    .from(faqs)
    .leftJoin(faqTranslations, eq(faqs.id, faqTranslations.faqId))
    .where(eq(faqTranslations.languageCode, "tr"))
    .orderBy(faqs.sortOrder);

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST = async (context: import("astro").APIContext) => {
  const request = context.request;
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const { status, sortOrder, translations } = body;

  const faqId = `faq-${crypto.randomUUID()}`;

  await db.insert(faqs).values({
    id: faqId,
    status: status || "published",
    sortOrder: sortOrder || 0,
  });

  if (translations && Array.isArray(translations)) {
    const transRows = translations.map(t => ({
      id: `faqt-${crypto.randomUUID()}`,
      faqId: faqId,
      languageCode: t.languageCode,
      question: t.question,
      answer: t.answer,
    }));
    if (transRows.length > 0) {
      await db.insert(faqTranslations).values(transRows);
    }
  }

  return new Response(JSON.stringify({ id: faqId, success: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
