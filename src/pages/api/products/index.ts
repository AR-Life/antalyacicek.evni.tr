import { db } from "../../../db";
import {
  products,
  productTranslations,
  productVariants,
  productMedia,
  media,
  productFaqs,
} from "../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../../lib/auth-guard";

export const GET = async (context: import("astro").APIContext) => {
  const request = context.request;
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

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

export const POST = async (context: import("astro").APIContext) => {
  const request = context.request;
  const env = context.locals.runtime?.env;

  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const { 
    translations, price, oldPrice, categoryId, image,
    sku, stock, status, occasions: occList, faqs: faqList
  } = body;

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
    status: status || "published",
  });

  if (translations && Array.isArray(translations)) {
    const translationRows = translations.map(t => ({
      id: `pt-${crypto.randomUUID()}`,
      productId: prodId,
      languageCode: t.languageCode,
      name: t.name,
      slug: t.slug,
      description: t.description || null,
      metaTitle: t.seoTitle || null,
      metaDescription: t.seoDescription || null,
    }));
    
    if (translationRows.length > 0) {
      await db.insert(productTranslations).values(translationRows);
    }
  }

  await db.insert(productVariants).values({
    id: `v-${crypto.randomUUID()}`,
    productId: prodId,
    sku: sku || `SKU-${Date.now()}`,
    price: price || 0,
    oldPrice: oldPrice || null,
    stock: stock || 0,
    manageStock: true,
    imageId: mediaId,
    isDefault: true,
  });

  if (occList && Array.isArray(occList)) {
    // In a full implementation, we'd insert into productOccasions mapping table
  }

  if (faqList && Array.isArray(faqList)) {
    const faqRows = faqList.map((fId: string, idx: number) => ({
      productId: prodId,
      faqId: fId,
      sortOrder: idx,
    }));
    if (faqRows.length > 0) {
      await db.insert(productFaqs).values(faqRows);
    }
  }

  // --- AI VECTORIZE INTEGRATION ---
  if (env?.AI && env?.VECTOR_INDEX && translations && translations.length > 0) {
    try {
      // Metinleri birleştirip anlamsal bir blok oluşturuyoruz
      const mainText = translations.map((t: any) => `${t.name} ${t.description || ''}`).join(" ");
      
      const aiResult = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [mainText] });
      const vector = aiResult.data[0];

      await env.VECTOR_INDEX.upsert([{
        id: prodId,
        values: vector,
      }]);
      console.log(`[Vectorize] Product ${prodId} successfully vectorized.`);
    } catch (err) {
      console.error("[Vectorize] Failed to generate/upsert embedding:", err);
    }
  }
  // --------------------------------

  const product = { id: prodId, price, oldPrice, categoryId, image, translations };

  return new Response(JSON.stringify(product), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
