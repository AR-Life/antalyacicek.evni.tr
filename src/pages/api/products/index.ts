import { db } from "../../../db";
import {
  products,
  productTranslations,
  productVariants,
  productMedia,
  media,
} from "../../../db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const GET = async ({ request }: { request: Request }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  // Get products with translations and their default variant for price
  const rows = await db
    .select({
      id: products.id,
      categoryId: products.categoryId,
      name: productTranslations.name,
      slug: productTranslations.slug,
      description: productTranslations.description,
      price: productVariants.price,
      oldPrice: productVariants.oldPrice,
      imageId: productVariants.imageId,
    })
    .from(products)
    .leftJoin(productTranslations, eq(products.id, productTranslations.productId))
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .where(eq(productTranslations.languageCode, "tr"));

  // Fetch all media
  const allMedia = await db.select().from(media);
  const mediaMap = new Map(allMedia.map((m) => [m.id, m.url]));

  // Deduplicate and format
  const productMap = new Map();
  
  for (const row of rows) {
    if (!productMap.has(row.id)) {
      productMap.set(row.id, {
        id: row.id,
        name: row.name || "",
        slug: row.slug || "",
        description: row.description || "",
        price: row.price || 0,
        oldPrice: row.oldPrice || 0,
        categoryId: row.categoryId || "",
        image: row.imageId ? mediaMap.get(row.imageId) || "" : "",
        tags: [], // Tags and occasions can be fetched if needed
        occasions: [],
        delivery: "Aynı gün teslimat",
      });
    }
  }

  const data = Array.from(productMap.values());

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST = async ({ request }: { request: Request }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const { name, slug, description, price, oldPrice, categoryId, image } = body;

  const prodId = `p-${crypto.randomUUID()}`;
  let mediaId: string | null = null;

  if (image) {
    mediaId = `media-${crypto.randomUUID()}`;
    await db.insert(media).values({
      id: mediaId,
      url: image,
      type: "image",
    });
    await db.insert(productMedia).values({
      productId: prodId,
      mediaId: mediaId,
      sortOrder: 0,
    });
  }

  await db.insert(products).values({
    id: prodId,
    categoryId: categoryId || null,
  });

  await db.insert(productTranslations).values({
    id: `pt-${crypto.randomUUID()}`,
    productId: prodId,
    languageCode: "tr",
    name: name || "",
    slug: slug || "",
    description: description || "",
  });

  await db.insert(productVariants).values({
    id: `v-${crypto.randomUUID()}`,
    productId: prodId,
    sku: `SKU-${Date.now()}`,
    price: price || 0,
    oldPrice: oldPrice || null,
    imageId: mediaId,
    isDefault: true,
  });

  const product = { id: prodId, name, slug, description, price, oldPrice, categoryId, image };

  return new Response(JSON.stringify(product), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
