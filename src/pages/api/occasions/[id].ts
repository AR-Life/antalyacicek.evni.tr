import { db } from "../../../db";
import { occasions, occasionTranslations, media } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIContext } from "astro";
import { requireAuth } from "../../../lib/auth-guard";

export const PUT = async ({ request, params }: APIContext) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  const body = await request.json();
  const { name, slug, description, icon } = body;

  const existingOcc = await db.select().from(occasions).where(eq(occasions.id, id)).get();
  if (!existingOcc) return new Response("Not found", { status: 404 });

  let mediaId = existingOcc.imageId;

  if (icon !== undefined) {
    if (mediaId) {
      await db.update(media).set({ url: icon }).where(eq(media.id, mediaId));
    } else if (icon) {
      mediaId = `media-${crypto.randomUUID()}`;
      await db.insert(media).values({
        id: mediaId,
        url: icon,
        type: "icon",
      });
      await db.update(occasions).set({ imageId: mediaId }).where(eq(occasions.id, id));
    }
  }

  const existingTrans = await db
    .select()
    .from(occasionTranslations)
    .where(eq(occasionTranslations.occasionId, id))
    .get();

  if (existingTrans) {
    await db
      .update(occasionTranslations)
      .set({
        name: name !== undefined ? name : existingTrans.name,
        slug: slug !== undefined ? slug : existingTrans.slug,
      })
      .where(eq(occasionTranslations.occasionId, id));
  } else {
    await db.insert(occasionTranslations).values({
      id: `ot-${crypto.randomUUID()}`,
      occasionId: id,
      languageCode: "tr",
      name: name || "",
      slug: slug || "",
    });
  }

  const updated = { id, name, slug, description, icon };

  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE = async ({ request, params }: APIContext) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  await db.delete(occasionTranslations).where(eq(occasionTranslations.occasionId, id));
  await db.delete(occasions).where(eq(occasions.id, id));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
