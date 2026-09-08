import { db } from "../../db";
import { products, productTranslations, productVariants, media } from "../../db/schema";
import { eq, inArray } from "drizzle-orm";
import type { APIContext } from "astro";

export const GET = async (context: APIContext) => {
  const request = context.request;
  const env = context.locals.runtime?.env;

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  if (!q) {
    return new Response(JSON.stringify({ error: "Arama terimi (q) gerekli" }), { status: 400 });
  }

  if (!env?.AI || !env?.VECTOR_INDEX) {
    return new Response(JSON.stringify({ error: "Yapay zeka (Vectorize) yapılandırması bulunamadı. Lütfen Wrangler ile çalıştırın." }), { status: 500 });
  }

  try {
    // 1. Arama sorgusunu (q) yapay zeka ile vektöre çevir
    const aiResult = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [q] });
    const vector = aiResult.data[0];

    // 2. Vectorize veritabanında en yakın eşleşmeleri bul (Anlamsal arama)
    const searchResult = await env.VECTOR_INDEX.query(vector, { topK: 10 });
    
    if (!searchResult.matches || searchResult.matches.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Eşleşen ürünlerin ID'lerini çıkart
    const matchedIds = searchResult.matches.map((match: any) => match.id);

    // 3. Bulunan ID'lere göre gerçek ürün verilerini veritabanından çek
    const rows = await db
      .select({
        id: products.id,
        name: productTranslations.name,
        slug: productTranslations.slug,
        description: productTranslations.description,
        price: productVariants.price,
        image: media.url,
      })
      .from(products)
      .leftJoin(productTranslations, eq(products.id, productTranslations.productId))
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(media, eq(productVariants.imageId, media.id))
      .where(inArray(products.id, matchedIds));

    // Aynı ürünleri tekilleştir (Farklı dillerden vs. dönerse)
    const productMap = new Map();
    for (const row of rows) {
       if (!productMap.has(row.id)) {
           // Arama sonuçlarında genellikle o anki dile göre sonuç dönmek isteriz.
           // Basitlik adına ilk bulduğumuz çeviriyi alıyoruz (Şu an gelişmiş dil filtrelemesi yok).
           if (row.name) { 
              productMap.set(row.id, row);
           }
       }
    }

    const data = Array.from(productMap.values());

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("[Vectorize Search Error]:", error);
    return new Response(JSON.stringify({ error: "Arama sırasında bir hata oluştu", details: error.message }), { status: 500 });
  }
};
