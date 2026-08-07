import { db } from "../../../../db";
import { categories, categoryTranslations, media } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIContext } from "astro";
import crypto from "node:crypto";

export const PUT = async ({ request, params }: APIContext) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  const body = await request.json();
  const { name, slug, description, image } = body;

  // Find existing category to get imageId
  const existingCat = await db.select().from(categories).where(eq(categories.id, id)).get();
  if (!existingCat) return new Response("Not found", { status: 404 });

  let mediaId = existingCat.imageId;

  if (image !== undefined) {
    if (mediaId) {
      await db.update(media).set({ url: image }).where(eq(media.id, mediaId));
    } else if (image) {
      mediaId = `media-${crypto.randomUUID()}`;
      await db.insert(media).values({
        id: mediaId,
        url: image,
        type: "image",
      });
      await db.update(categories).set({ imageId: mediaId }).where(eq(categories.id, id));
    }
  }

  // Check if translation exists
  const existingTrans = await db
    .select()
    .from(categoryTranslations)
    .where(eq(categoryTranslations.categoryId, id))
    .get();

  if (existingTrans) {
    await db
      .update(categoryTranslations)
      .set({
        name: name !== undefined ? name : existingTrans.name,
        slug: slug !== undefined ? slug : existingTrans.slug,
        description: description !== undefined ? description : existingTrans.description,
      })
      .where(eq(categoryTranslations.categoryId, id));
  } else {
    await db.insert(categoryTranslations).values({
      id: `ct-${crypto.randomUUID()}`,
      categoryId: id,
      languageCode: "tr",
      name: name || "",
      slug: slug || "",
      description: description || "",
    });
  }

  const updated = { id, name, slug, description, image };

  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE = async ({ request, params }: APIContext) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  // Delete translations first if foreign key cascade is disabled
  await db.delete(categoryTranslations).where(eq(categoryTranslations.categoryId, id));
  
  // Then delete category
  await db.delete(categories).where(eq(categories.id, id));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
