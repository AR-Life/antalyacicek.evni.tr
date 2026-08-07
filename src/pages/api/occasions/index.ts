import { db } from "../../../db";
import { occasions, occasionTranslations, media } from "../../../db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const GET = async ({ request }: { request: Request }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

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
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const { name, slug, description, icon } = body;

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
    imageId: mediaId,
  });

  await db.insert(occasionTranslations).values({
    id: `ot-${crypto.randomUUID()}`,
    occasionId: occId,
    languageCode: "tr",
    name: name || "",
    slug: slug || "",
  });

  const occasion = { id: occId, name, slug, description, icon };

  return new Response(JSON.stringify(occasion), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
