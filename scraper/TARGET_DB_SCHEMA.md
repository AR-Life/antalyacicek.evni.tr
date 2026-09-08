# Target Database Schema Reference for Scraper AI

This document contains the core Drizzle ORM database schema of the main application. 
**Context:** You are an AI-powered universal scraper operating in the `scraper/` directory. Your goal is to crawl external floral e-commerce websites and extract product data. The data you extract MUST BE formatted as a structured JSON object that exactly maps to the tables defined below.

## 1. Categories, Occasions, and Tags

When extracting a product, you must analyze its context (e.g. "Doğum Günü", "Anneler Günü", "Gül", "Papatya") and map it to these concepts.

### Categories (Kategoriler)
```typescript
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(), // e.g. "cat_flowers", "cat_plants", "cat_gifts"
  parentId: text("parent_id"), 
  status: text("status").default("published"),
});

export const categoryTranslations = sqliteTable("category_translations", {
  categoryId: text("category_id"),
  languageCode: text("language_code"), // "tr"
  name: text("name"), // e.g. "Çiçekler", "Bitkiler"
  slug: text("slug"),
});
```

### Occasions (Gönderim Amacı / Etkinlik)
These denote *why* the flower is sent. Map external site tags like "Doğum Günü", "Sevgililer Günü" to occasions.
```typescript
export const occasions = sqliteTable("occasions", {
  id: text("id").primaryKey(), // e.g. "occ_birthday", "occ_anniversary", "occ_new_job", "occ_funeral"
});

export const occasionTranslations = sqliteTable("occasion_translations", {
  occasionId: text("occasion_id"),
  languageCode: text("language_code"),
  name: text("name"), // "Doğum Günü", "Yıl Dönümü"
});
```

### Tags (Etiketler / Çiçek Türü vb.)
Used for flower types (Gül, Papatya, Orkide) or minor descriptors.
```typescript
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(), // e.g. "tag_rose", "tag_daisy", "tag_orchid"
});

export const tagTranslations = sqliteTable("tag_translations", {
  tagId: text("tag_id"),
  languageCode: text("language_code"),
  name: text("name"), // "Gül", "Papatya"
});
```

## 2. Products and Translations

When extracting a product, your JSON must populate the `products` and `productTranslations` entities.

```typescript
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  categoryId: text("category_id"), // Mapped category ID
  gtin: text("gtin").unique(), // Optional: Global Trade Item Number
  status: text("status").default("published"),
  productType: text("product_type").default("physical"), // physical, digital
  
  // Merchant Center & Schema.org Core
  brand: text("brand").default("Antalya Çiçek"),
  defaultPrice: real("default_price"), // The base price extracted from the site
  currency: text("currency").default("TRY"),
});

export const productTranslations = sqliteTable("product_translations", {
  productId: text("product_id"),
  languageCode: text("language_code").default("tr"),
  name: text("name").notNull(), // Exact product name (e.g., "Lilya Esintisi Buketi")
  slug: text("slug").notNull(), // e.g. "lilya-esintisi-buketi"
  shortDescription: text("short_description"), 
  description: text("description"), // Full HTML or text description
});
```

## 3. Product Relationships (M2M)

To associate products with tags, occasions, and images, the following junction tables are used. Your AI extraction output must provide arrays of tag IDs and occasion IDs to populate these.

```typescript
// Images
export const productMedia = sqliteTable("product_media", {
  productId: text("product_id"),
  mediaUrl: text("media_url"), // The scraped image URL (which we will download later)
  sortOrder: integer("sort_order").default(0),
});

// Occasion Mapping
export const productOccasions = sqliteTable("product_occasions", {
  productId: text("product_id"),
  occasionId: text("occasion_id"), // e.g. "occ_birthday"
});

// Tag Mapping
export const productTags = sqliteTable("product_tags", {
  productId: text("product_id"),
  tagId: text("tag_id"), // e.g. "tag_rose"
});
```

## AI Extraction Rules

When you (the LLM) are asked to extract data from crawled HTML/Markdown, you MUST return a structured JSON matching this interface.
To prevent foreign key constraints and hallucinations, you must ONLY use IDs from the predefined Enums below.

```typescript
type AllowedCategoryId = "cat_flowers" | "cat_plants" | "cat_arrangements" | "cat_gifts" | "cat_chocolates";
type AllowedOccasionId = "occ_birthday" | "occ_anniversary" | "occ_new_job" | "occ_funeral" | "occ_new_baby" | "occ_get_well" | "occ_apology" | "occ_just_because";
type AllowedTagId = "tag_rose" | "tag_red_rose" | "tag_white_rose" | "tag_daisy" | "tag_orchid" | "tag_lily" | "tag_succulent" | "tag_carnation";

interface ExtractedProduct {
  source_url: string;
  name: string;
  slug: string;
  short_description?: string;
  description: string; // Plain text or semantic HTML only (no external inline styles/classes)
  price: number;
  original_price?: number; // Üzeri çizili eski fiyat varsa (Compare at price)
  currency: "TRY" | "USD" | "EUR";
  in_stock: boolean; // Ürün stokta var mı / satışı açık mı?
  images: string[]; // High-res direct image URLs
  
  // Sadece tanımlı enum listesinden seçilmelidir:
  suggested_category_id: AllowedCategoryId;
  suggested_occasion_ids: AllowedOccasionId[];
  suggested_tag_ids: AllowedTagId[];
}
```

This ensures zero manual mapping during the insertion phase and guarantees pristine data quality.
