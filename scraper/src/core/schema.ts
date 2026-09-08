import { z } from "zod";

export const ProductExtractionSchema = z.object({
  source_url: z.string().describe("Ürünün çekildiği asıl URL"),
  sku: z.string().optional().describe("Karşı sitenin ürün kodu"),
  name: z.string().describe("Ürünün tam adı (Örn: Lilya Esintisi Buketi)"),
  slug: z.string().describe("Ürün için seo uyumlu slug (Örn: lilya-esintisi-buketi)"),
  description: z.string().describe("Ürünün detaylı açıklaması"),
  price: z.number().describe("Ürünün sayısal fiyatı (Örn: 5290.00)"),
  currency: z.enum(["TRY", "USD", "EUR"]).describe("Para birimi"),
  images: z.array(z.string()).describe("Ürün görsel URL'lerinin listesi"),
  
  suggested_category_id: z.enum([
    "cat_flowers", "cat_plants", "cat_gifts", "cat_arrangements"
  ]).describe("Ürünün en uygun olduğu kategori"),
  
  suggested_occasion_ids: z.array(z.enum([
    "occ_birthday", "occ_anniversary", "occ_new_job", "occ_funeral", "occ_romance", "occ_get_well", "occ_new_baby"
  ])).describe("Bu çiçeğin gönderim amaçları nelerdir?"),
  
  suggested_tag_ids: z.array(z.enum([
    "tag_rose", "tag_daisy", "tag_orchid", "tag_lily", "tag_succulent", "tag_carnation", "tag_tulip", "tag_chrysanthemum"
  ])).describe("Ürün içerisindeki ana çiçek türleri neler?")
});

export type ExtractedProduct = z.infer<typeof ProductExtractionSchema>;
