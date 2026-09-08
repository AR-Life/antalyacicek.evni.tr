import { db } from "../../../db";
import { categories, categoryTranslations, media } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../../lib/auth-guard";

export const GET = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  // Fetch from DB
  const rows = await db
    .select({
      id: categories.id,
      name: categoryTranslations.name,
      slug: categoryTranslations.slug,
      description: categoryTranslations.description,
      image: media.url,
    })
    .from(categories)
    .leftJoin(categoryTranslations, eq(categories.id, categoryTranslations.categoryId))
    .leftJoin(media, eq(categories.imageId, media.id))
    .where(eq(categoryTranslations.languageCode, "tr"));

  // Map null image to empty string to match previous Category interface
  const data = rows.map((row) => ({
    ...row,
    image: row.image || "",
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
  const { translations, image, parentId, status, sortOrder } = body;

  const catId = `cat-${crypto.randomUUID()}`;
  let mediaId: string | null = null;

  if (image) {
    mediaId = `media-${crypto.randomUUID()}`;
    await db.insert(media).values({
      id: mediaId,
      url: image,
      type: "image",
    });
  }

  await db.insert(categories).values({
    id: catId,
    parentId: parentId || null,
    status: status || "published",
    sortOrder: sortOrder || 0,
    imageId: mediaId,
  });

  if (translations && Array.isArray(translations)) {
    const translationRows = translations.map(t => ({
      id: `ct-${crypto.randomUUID()}`,
      categoryId: catId,
      languageCode: t.languageCode,
      name: t.name,
      slug: t.slug,
      description: t.description || null,
      metaTitle: t.seoTitle || null,
      metaDescription: t.seoDescription || null,
    }));
    
    if (translationRows.length > 0) {
      await db.insert(categoryTranslations).values(translationRows);
    }
  }

  const category = { id: catId, image, translations };

  return new Response(JSON.stringify(category), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
