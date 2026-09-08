import { db } from "../../../db";
import { categories, categoryTranslations, media } from "../../../db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { isAdminRequest } from "../../../lib/admin-auth";

export const GET = async ({ request }: { request: Request }) => {
  if (!isAdminRequest(request)) return new Response("Unauthorized", { status: 401 });

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
  if (!isAdminRequest(request)) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const { name, slug, description, image } = body;

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
    imageId: mediaId,
  });

  await db.insert(categoryTranslations).values({
    id: `ct-${crypto.randomUUID()}`,
    categoryId: catId,
    languageCode: "tr",
    name: name || "",
    slug: slug || "",
    description: description || "",
  });

  const category = { id: catId, name, slug, description, image };

  return new Response(JSON.stringify(category), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
