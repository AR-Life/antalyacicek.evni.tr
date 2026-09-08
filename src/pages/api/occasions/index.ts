import { db } from "../../../db";
import { occasions, occasionTranslations, media } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../../lib/auth-guard";

export const GET = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const rows = await db
    .select({
      id: occasions.id,
      name: occasionTranslations.name,
      slug: occasionTranslations.slug,
      icon: media.url,
    })
    .from(occasions)
    .leftJoin(occasionTranslations, eq(occasions.id, occasionTranslations.occasionId))
    .leftJoin(media, eq(occasions.imageId, media.id))
    .where(eq(occasionTranslations.languageCode, "tr"));

  const data = rows.map((row) => ({
    ...row,
    icon: row.icon || "🌸",
    description: "", // schema doesn't have description for occasion
  }));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const { translations, icon, status, sortOrder } = body;

  const occId = `occ-${crypto.randomUUID()}`;
  let mediaId: string | null = null;

  if (icon) {
    mediaId = `media-${crypto.randomUUID()}`;
    await db.insert(media).values({
      id: mediaId,
      url: icon,
      type: "icon",
    });
  }

  await db.insert(occasions).values({
    id: occId,
    status: status || "published",
    sortOrder: sortOrder || 0,
    imageId: mediaId,
  });

  if (translations && Array.isArray(translations)) {
    const translationRows = translations.map(t => ({
      id: `ot-${crypto.randomUUID()}`,
      occasionId: occId,
      languageCode: t.languageCode,
      name: t.name,
      slug: t.slug,
    }));
    
    if (translationRows.length > 0) {
      await db.insert(occasionTranslations).values(translationRows);
    }
  }

  const occasion = { id: occId, translations, icon };

  return new Response(JSON.stringify(occasion), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
