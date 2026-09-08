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
import type { APIContext } from "astro";
import { requireAuth } from "../../../lib/auth-guard";

export const GET = async ({ request, params }: APIContext) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  const row = await db
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
    .where(eq(products.id, id))
    .get();

  if (!row) return new Response("Not found", { status: 404 });

  let image = "";
  if (row.imageId) {
    const mediaRow = await db.select().from(media).where(eq(media.id, row.imageId)).get();
    if (mediaRow) image = mediaRow.url;
  }

  const product = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    oldPrice: row.oldPrice,
    categoryId: row.categoryId,
    image,
    tags: [],
    occasions: [],
    delivery: "Aynı gün teslimat",
  };

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT = async ({ request, params }: APIContext) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  const body = await request.json();
  const { name, slug, description, price, oldPrice, categoryId, image, faqs: faqList } = body;

  const existingProd = await db.select().from(products).where(eq(products.id, id)).get();
  if (!existingProd) return new Response("Not found", { status: 404 });

  if (categoryId !== undefined) {
    await db.update(products).set({ categoryId }).where(eq(products.id, id));
  }

  const existingTrans = await db
    .select()
    .from(productTranslations)
    .where(eq(productTranslations.productId, id))
    .get();

  if (existingTrans) {
    await db
      .update(productTranslations)
      .set({
        name: name !== undefined ? name : existingTrans.name,
        slug: slug !== undefined ? slug : existingTrans.slug,
        description: description !== undefined ? description : existingTrans.description,
      })
      .where(eq(productTranslations.productId, id));
  } else {
    await db.insert(productTranslations).values({
      id: `pt-${crypto.randomUUID()}`,
      productId: id,
      languageCode: "tr",
      name: name || "",
      slug: slug || "",
      description: description || "",
    });
  }

  const existingVariant = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id))
    .get();

  let mediaId = existingVariant?.imageId || null;

  if (image !== undefined) {
    if (mediaId) {
      await db.update(media).set({ url: image }).where(eq(media.id, mediaId));
    } else if (image) {
      mediaId = `media-${crypto.randomUUID()}`;
      await db.insert(media).values({ id: mediaId, url: image, type: "image" });
      await db.insert(productMedia).values({ productId: id, mediaId, sortOrder: 0 });
    }
  }

  if (existingVariant) {
    await db
      .update(productVariants)
      .set({
        price: price !== undefined ? price : existingVariant.price,
        oldPrice: oldPrice !== undefined ? oldPrice : existingVariant.oldPrice,
        imageId: mediaId,
      })
      .where(eq(productVariants.id, existingVariant.id));
  } else {
    await db.insert(productVariants).values({
      id: `v-${crypto.randomUUID()}`,
      productId: id,
      sku: `SKU-${Date.now()}`,
      price: price || 0,
      oldPrice: oldPrice || null,
      imageId: mediaId,
      isDefault: true,
    });
  }

  if (faqList && Array.isArray(faqList)) {
    await db.delete(productFaqs).where(eq(productFaqs.productId, id));
    const faqRows = faqList.map((fId: string, idx: number) => ({
      productId: id,
      faqId: fId,
      sortOrder: idx,
    }));
    if (faqRows.length > 0) {
      await db.insert(productFaqs).values(faqRows);
    }
  } else if (faqList && faqList.length === 0) {
    await db.delete(productFaqs).where(eq(productFaqs.productId, id));
  }

  const updated = { id, name, slug, description, price, oldPrice, categoryId, image };

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

  await db.delete(productFaqs).where(eq(productFaqs.productId, id));
  await db.delete(productVariants).where(eq(productVariants.productId, id));
  await db.delete(productTranslations).where(eq(productTranslations.productId, id));
  await db.delete(productMedia).where(eq(productMedia.productId, id));
  await db.delete(products).where(eq(products.id, id));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
