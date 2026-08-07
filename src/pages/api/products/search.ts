import { db } from "../../../db";
import {
  products,
  productTranslations,
  productVariants,
  productMedia,
  media,
} from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GET = async () => {
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

  const allMedia = await db.select().from(media);
  const mediaMap = new Map(allMedia.map((m) => [m.id, m.url]));

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
        tags: [],
        images: [],
      });
    }
  }

  const searchProducts = Array.from(productMap.values());

  return new Response(JSON.stringify(searchProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
};
