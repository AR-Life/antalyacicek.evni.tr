import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
  primaryKey,
  check,
} from "drizzle-orm/sqlite-core";

// 0. Kullanıcılar, Müşteriler ve Kimlik Doğrulama
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: text("role").default("customer"), // customer, admin, courier
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  emailVerifiedAt: integer("email_verified_at", { mode: "timestamp" }),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const customerProfiles = sqliteTable("customer_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  dateOfBirth: integer("date_of_birth", { mode: "timestamp" }),
  marketingOptIn: integer("marketing_opt_in", { mode: "boolean" }).default(false),
  smsOptIn: integer("sms_opt_in", { mode: "boolean" }).default(false),
  preferredLanguage: text("preferred_language").default("tr"),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const customerAddresses = sqliteTable(
  "customer_addresses",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // billing, shipping, default
    addressLine: text("address_line").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").default("TR"),
    longitude: real("longitude"),
    latitude: real("latitude"),
    isDefault: integer("is_default", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_addresses_user_id").on(table.userId),
  }),
);

export const authSessions = sqliteTable(
  "auth_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(), // JWT hash
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_sessions_user_id").on(table.userId),
    expiresAtIdx: index("idx_sessions_expires_at").on(table.expiresAt),
  }),
);

// 0.5 Diller (Languages)
export const languages = sqliteTable("languages", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(), // tr, en, ar
  name: text("name").notNull(), // Türkçe, English
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
});

// 0.6 Para Birimleri (Aşağıda tanımlı - line 893)

// 0.7 Ülkeler / Pazarlar (Markets / Countries) - SİLİNDİ (Dil Grubu mimarisine geçildi)

// 1. Organizasyon ve Yerel İşletme
export const organization = sqliteTable("organization", {
  id: text("id").primaryKey(),
  legalName: text("legal_name").notNull(),
  brandName: text("brand_name").notNull(),
  slogan: text("slogan"),
  website: text("website"),
  taxNumber: text("tax_number"),
  email: text("email"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  currenciesAccepted: text("currencies_accepted").default("TRY,USD,EUR"),
  paymentAccepted: text("payment_accepted").default("Cash, Credit Card, EFT"),
  priceRange: text("price_range").default("$$"),
  socialProfiles: text("social_profiles", { mode: "json" }),
});

export const storeLocations = sqliteTable("store_locations", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organization.id),
  name: text("name").notNull(),
  addressLine: text("address_line").notNull(),
  addressLocality: text("address_locality"),
  addressRegion: text("address_region"),
  country: text("country").default("TR"),
  postalCode: text("postal_code").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  mapUrl: text("map_url"),
  areaServed: text("area_served"),
  acceptsReservations: integer("accepts_reservations", { mode: "boolean" }).default(false),
});

export const openingHours = sqliteTable("opening_hours", {
  id: text("id").primaryKey(),
  storeId: text("store_id").references(() => storeLocations.id),
  dayOfWeek: text("day_of_week").notNull(),
  opens: text("opens").notNull(),
  closes: text("closes").notNull(),
  validFrom: integer("valid_from", { mode: "timestamp" }),
  validThrough: integer("valid_through", { mode: "timestamp" }),
});

// 1.5 Siparişler ve Ödemeler
export const carts = sqliteTable(
  "carts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    sessionId: text("session_id"),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
  },
  (table) => ({
    userIdIdx: index("idx_carts_user_id").on(table.userId),
  }),
);

export const cartItems = sqliteTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id").references(() => carts.id, { onDelete: "cascade" }),
    // Note: To avoid circular dependency with productVariants which is defined later,
    // we use a string for the reference, or we just rely on the order of definitions.
    // Drizzle handles references by variable normally if they are in the same file.
    // We will define productVariants later in this file.
    variantId: text("variant_id"), // References productVariants.id
    quantity: integer("quantity").notNull(),
    selectedOptions: text("selected_options", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    cartIdIdx: index("idx_cart_items_cart_id").on(table.cartId),
    quantityCheck: check("quantity_check", sql`quantity > 0`),
  }),
);

// We define deliveryZones early so orders can reference it
export const deliveryZones = sqliteTable("delivery_zones", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  postalCodes: text("postal_codes"),
  minimumOrderValue: real("minimum_order_value").default(0),
  deliveryFee: real("delivery_fee").default(0),
  estimatedMinutes: integer("estimated_minutes").default(60),
  status: text("status").default("active"),
});

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    userId: text("user_id").references(() => users.id, { onDelete: "restrict" }),
    billingAddressId: text("billing_address_id").references(() => customerAddresses.id),
    shippingAddressId: text("shipping_address_id").references(() => customerAddresses.id),

    status: text("status").default("pending"),
    paymentStatus: text("payment_status").default("unpaid"),
    deliveryStatus: text("delivery_status").default("unassigned"),

    subtotal: real("subtotal").notNull(),
    deliveryFee: real("delivery_fee").default(0),
    discountAmount: real("discount_amount").default(0),
    taxAmount: real("tax_amount").default(0),
    totalAmount: real("total_amount").notNull(),
    currency: text("currency").default("TRY"),

    couponCode: text("coupon_code"),
    couponId: text("coupon_id"),

    deliveryZoneId: text("delivery_zone_id").references(() => deliveryZones.id),
    deliveryTimeSlotId: text("delivery_time_slot_id"),
    deliveryNotes: text("delivery_notes"),

    placedAt: integer("placed_at", { mode: "timestamp" }).defaultNow(),
    processedAt: integer("processed_at", { mode: "timestamp" }),
    shippedAt: integer("shipped_at", { mode: "timestamp" }),
    deliveredAt: integer("delivered_at", { mode: "timestamp" }),
    cancelledAt: integer("cancelled_at", { mode: "timestamp" }),

    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    userIdIdx: index("idx_orders_user_id").on(table.userId),
    statusIdx: index("idx_orders_status").on(table.status),
    placedAtIdx: index("idx_orders_placed_at").on(table.placedAt),
  }),
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
    variantId: text("variant_id"), // References productVariants.id
    quantity: integer("quantity").notNull(),
    unitPrice: real("unit_price").notNull(),
    subtotal: real("subtotal").notNull(),
    selectedOptions: text("selected_options", { mode: "json" }),
  },
  (table) => ({
    orderIdIdx: index("idx_order_items_order_id").on(table.orderId),
  }),
);

export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
    transactionId: text("transaction_id").unique(),
    paymentMethod: text("payment_method").notNull(),
    amount: real("amount").notNull(),
    currency: text("currency").default("TRY"),
    status: text("status").default("pending"),
    failureReason: text("failure_reason"),
    paymentGateway: text("payment_gateway"),
    gatewayResponse: text("gateway_response", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
    completedAt: integer("completed_at", { mode: "timestamp" }),
  },
  (table) => ({
    orderIdIdx: index("idx_payments_order_id").on(table.orderId),
    statusIdx: index("idx_payments_status").on(table.status),
  }),
);

export const refunds = sqliteTable(
  "refunds",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
    paymentId: text("payment_id").references(() => payments.id, { onDelete: "cascade" }),
    amount: real("amount").notNull(),
    reason: text("reason").notNull(),
    status: text("status").default("pending"),
    notes: text("notes"),
    requestedAt: integer("requested_at", { mode: "timestamp" }).defaultNow(),
    processedAt: integer("processed_at", { mode: "timestamp" }),
  },
  (table) => ({
    orderIdIdx: index("idx_refunds_order_id").on(table.orderId),
  }),
);

// 2. Medya Yönetimi
export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  mimeType: text("mime_type"),
  altText: text("alt_text"),
  width: integer("width"),
  height: integer("height"),
  caption: text("caption"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

// 3. Kategoriler, Etiketler ve Occasion
export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    parentId: text("parent_id"), // References categories.id
    imageId: text("image_id").references(() => media.id),
    status: text("status").default("published"),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
    sortOrder: integer("sort_order").default(0),
    depth: integer("depth").default(0),
  },
  (table) => ({
    parentIdCheck: check("parent_id_check", sql`parent_id IS NULL OR parent_id != id`),
  }),
);

export const categoryTranslations = sqliteTable(
  "category_translations",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id").references(() => categories.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    robots: text("robots").default("index, follow"),
  },
  (table) => ({
    slugIdx: uniqueIndex("idx_cat_trans_slug").on(table.languageCode, table.slug),
    transIdx: uniqueIndex("idx_cat_trans_lang").on(table.categoryId, table.languageCode),
  }),
);

export const occasions = sqliteTable("occasions", {
  id: text("id").primaryKey(),
  imageId: text("image_id").references(() => media.id),
  status: text("status").default("published"),
  sortOrder: integer("sort_order").default(0),
});

export const occasionTranslations = sqliteTable("occasion_translations", {
  id: text("id").primaryKey(),
  occasionId: text("occasion_id").references(() => occasions.id, { onDelete: "cascade" }),
  languageCode: text("language_code").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
});

export const tagTranslations = sqliteTable("tag_translations", {
  id: text("id").primaryKey(),
  tagId: text("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  languageCode: text("language_code").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

// 4. Ürün Kataloğu
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => categories.id),
  gtin: text("gtin").unique(),
  mpn: text("mpn"),
  condition: text("condition").default("new"),
  availability: text("availability").default("InStock"),

  status: text("status").default("published"),
  productType: text("product_type").default("physical"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),

  reviewCount: integer("review_count").default(0),
  averageRating: real("average_rating").default(0),
  rating1Count: integer("rating_1_count").default(0),
  rating2Count: integer("rating_2_count").default(0),
  rating3Count: integer("rating_3_count").default(0),
  rating4Count: integer("rating_4_count").default(0),
  rating5Count: integer("rating_5_count").default(0),

  brand: text("brand").default("Antalya Çiçek"),
  googleProductCategory: text("google_product_category"),
  countryOfOrigin: text("country_of_origin").default("TR"),
  adult: integer("adult", { mode: "boolean" }).default(false),
  isBundle: integer("is_bundle", { mode: "boolean" }).default(false),

  defaultPrice: real("default_price"),
  currency: text("currency").default("TRY"),
  identifierExists: integer("identifier_exists", { mode: "boolean" }).default(false),

  customLabel0: text("custom_label_0"),
  customLabel1: text("custom_label_1"),
  shippingLabel: text("shipping_label"),
});

export const productTranslations = sqliteTable(
  "product_translations",
  {
    id: text("id").primaryKey(),
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),

    shortDescription: text("short_description"),
    description: text("description"),
    seoDescription: text("seo_description"),
    marketingDescription: text("marketing_description"),
    aiSummary: text("ai_summary"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
  },
  (table) => ({
    slugIdx: uniqueIndex("idx_prod_trans_slug").on(table.languageCode, table.slug),
    transIdx: uniqueIndex("idx_prod_lang").on(table.productId, table.languageCode),
  }),
);

export const productMedia = sqliteTable(
  "product_media",
  {
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    mediaId: text("media_id").references(() => media.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => ({
    pk: primaryKey(table.productId, table.mediaId),
  }),
);

export const productOccasions = sqliteTable(
  "product_occasions",
  {
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    occasionId: text("occasion_id").references(() => occasions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey(table.productId, table.occasionId),
  }),
);

export const productTags = sqliteTable(
  "product_tags",
  {
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    tagId: text("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey(table.productId, table.tagId),
  }),
);

export const relatedProducts = sqliteTable(
  "related_products",
  {
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    relatedProductId: text("related_product_id").references(() => products.id, { onDelete: "cascade" }),
    relationType: text("relation_type").notNull(), // 'cross_sell', 'up_sell'
    sortOrder: integer("sort_order").default(0),
  },
  (table) => ({
    pk: primaryKey(table.productId, table.relatedProductId, table.relationType),
  }),
);

export const productStats = sqliteTable("product_stats", {
  productId: text("product_id").primaryKey().references(() => products.id, { onDelete: "cascade" }),
  viewCount: integer("view_count").default(0),
  salesCount: integer("sales_count").default(0),
  seoScore: integer("seo_score").default(0),
  missingAlt: integer("missing_alt", { mode: "boolean" }).default(false),
  missingDescription: integer("missing_description", { mode: "boolean" }).default(false),
  missingTitle: integer("missing_title", { mode: "boolean" }).default(false),
});

export const productEmbeddings = sqliteTable("product_embeddings", {
  productId: text("product_id").primaryKey().references(() => products.id, { onDelete: "cascade" }),
  embeddingStatus: text("embedding_status").default("pending"),
  embeddingUpdatedAt: integer("embedding_updated_at", { mode: "timestamp" }),
  vectorData: text("vector_data"),
});

// 5. Dinamik Nitelikler ve Varyasyonlar
export const attributes = sqliteTable("attributes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").default("select"),
});

export const attributeTranslations = sqliteTable("attribute_translations", {
  id: text("id").primaryKey(),
  attributeId: text("attribute_id").references(() => attributes.id, { onDelete: "cascade" }),
  languageCode: text("language_code").notNull(),
  name: text("name").notNull(),
});

export const attributeTerms = sqliteTable("attribute_terms", {
  id: text("id").primaryKey(),
  attributeId: text("attribute_id").references(() => attributes.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const attributeTermTranslations = sqliteTable("attribute_term_translations", {
  id: text("id").primaryKey(),
  termId: text("term_id").references(() => attributeTerms.id, { onDelete: "cascade" }),
  languageCode: text("language_code").notNull(),
  name: text("name").notNull(),
});

export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  gtin: text("gtin"),
  condition: text("condition").default("new"),
  availability: text("availability").default("InStock"),

  price: real("price").notNull(),
  oldPrice: real("old_price"),
  currency: text("currency").default("TRY"),
  salePriceEffectiveDate: integer("sale_price_effective_date", { mode: "timestamp" }),
  salePriceEffectiveEndDate: integer("sale_price_effective_end_date", { mode: "timestamp" }),

  stock: integer("stock").default(0),
  manageStock: integer("manage_stock", { mode: "boolean" }).default(true),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  expirationDate: integer("expiration_date", { mode: "timestamp" }),

  shippingWeight: real("shipping_weight"),
  shippingLength: real("shipping_length"),
  shippingWidth: real("shipping_width"),
  shippingHeight: real("shipping_height"),

  subscriptionPeriod: text("subscription_period"),
  subscriptionInterval: integer("subscription_interval").default(1),

  imageId: text("image_id").references(() => media.id),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  status: text("status").default("published"),
});

export const variantAttributeValues = sqliteTable(
  "variant_attribute_values",
  {
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    termId: text("term_id").references(() => attributeTerms.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey(table.variantId, table.termId),
  }),
);

// 6. Ürün Opsiyonları ve Eklentiler
export const productOptions = sqliteTable("product_options", {
  id: text("id").primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").default("checkbox"),
  isRequired: integer("is_required", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
});

export const productOptionValues = sqliteTable("product_option_values", {
  id: text("id").primaryKey(),
  optionId: text("option_id").references(() => productOptions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  priceModifier: real("price_modifier").default(0),
  priceType: text("price_type").default("fixed"),
  sortOrder: integer("sort_order").default(0),
});

// 7. Stok Hareketleri ve Lokasyon Bazlı Envanter
export const inventoryLocations = sqliteTable(
  "inventory_locations",
  {
    id: text("id").primaryKey(),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    storeLocationId: text("store_location_id").references(() => storeLocations.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(0),
    expirationDate: integer("expiration_date", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("idx_inv_loc_unique").on(table.variantId, table.storeLocationId),
    variantIdIdx: index("idx_inv_loc_variant_id").on(table.variantId),
    storeIdIdx: index("idx_inv_loc_store_id").on(table.storeLocationId),
  }),
);

export const inventoryTransactions = sqliteTable(
  "inventory_transactions",
  {
    id: text("id").primaryKey(),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    storeLocationId: text("store_location_id").references(() => storeLocations.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    type: text("type").notNull(),
    referenceId: text("reference_id"),
    notes: text("notes"),
    createdBy: text("created_by"),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    variantIdIdx: index("idx_inv_trans_variant_id").on(table.variantId),
    typeIdx: index("idx_inv_trans_type").on(table.type),
    createdAtIdx: index("idx_inv_trans_created_at").on(table.createdAt),
  }),
);

// 8. Teslimat Zaman Dilimleri ve Kuryeler
export const deliveryTimeSlots = sqliteTable(
  "delivery_time_slots",
  {
    id: text("id").primaryKey(),
    zoneId: text("zone_id").references(() => deliveryZones.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    timezone: text("timezone").default("Europe/Istanbul"),
    surcharge: real("surcharge").default(0),
    maxCapacity: integer("max_capacity"),
    currentCapacity: integer("current_capacity").default(0),
    isActive: integer("is_active", { mode: "boolean" }).default(true),
    validFrom: integer("valid_from", { mode: "timestamp" }),
    validUntil: integer("valid_until", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    zoneIdIdx: index("idx_time_slots_zone_id").on(table.zoneId),
  }),
);

export const couriers = sqliteTable(
  "couriers",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    storeLocationId: text("store_location_id").references(() => storeLocations.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phoneNumber: text("phone_number").notNull(),
    licenseNumber: text("license_number"),
    vehicleType: text("vehicle_type"),
    vehiclePlate: text("vehicle_plate"),
    status: text("status").default("active"),
    isAvailable: integer("is_available", { mode: "boolean" }).default(true),
    totalDeliveries: integer("total_deliveries").default(0),
    successfulDeliveries: integer("successful_deliveries").default(0),
    avgDeliveryTime: integer("avg_delivery_time"),
    rating: real("rating").default(5),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
  },
  (table) => ({
    storeIdIdx: index("idx_couriers_store_id").on(table.storeLocationId),
    statusIdx: index("idx_couriers_status").on(table.status),
  }),
);

export const deliveryAssignments = sqliteTable(
  "delivery_assignments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
    courierId: text("courier_id").references(() => couriers.id, { onDelete: "restrict" }),
    assignedAt: integer("assigned_at", { mode: "timestamp" }).defaultNow(),
    pickedUpAt: integer("picked_up_at", { mode: "timestamp" }),
    deliveredAt: integer("delivered_at", { mode: "timestamp" }),
    failedAt: integer("failed_at", { mode: "timestamp" }),
    failureReason: text("failure_reason"),
    estimatedDeliveryTime: integer("estimated_delivery_time", { mode: "timestamp" }),
    actualDeliveryTime: integer("actual_delivery_time", { mode: "timestamp" }),
    trackingNotes: text("tracking_notes"),
  },
  (table) => ({
    orderIdIdx: index("idx_delivery_assign_order_id").on(table.orderId),
    courierIdIdx: index("idx_delivery_assign_courier_id").on(table.courierId),
  }),
);

// 9. Müşteri Yorumları
export const productReviews = sqliteTable("product_reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorType: text("author_type").default("Person"),
  ratingValue: integer("rating_value").notNull(),
  reviewBody: text("review_body"),
  verifiedPurchase: integer("verified_purchase", { mode: "boolean" }).default(false),
  status: text("status").default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
}, (table) => ({
  ratingCheck: check("rating_check", sql`rating_value BETWEEN 1 AND 5`),
}));

// 10. URL Yönlendirmeleri ve Sitemap Yönetimi
export const redirects = sqliteTable("redirects", {
  id: text("id").primaryKey(),
  sourceUrl: text("source_url").notNull().unique(),
  targetUrl: text("target_url").notNull(),
  statusCode: integer("status_code").default(301),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const sitemapQueue = sqliteTable("sitemap_queue", {
  id: text("id").primaryKey(),
  url: text("url").notNull().unique(),
  priority: real("priority").default(0.8),
  changefreq: text("changefreq").default("weekly"),
  lastmod: integer("lastmod", { mode: "timestamp" }),
  needsReindex: integer("needs_reindex", { mode: "boolean" }).default(true),
});

// 11. Tedarikçi Yönetimi
export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone").notNull(),
  addressLine: text("address_line"),
  city: text("city"),
  postalCode: text("postal_code"),
  leadTimeDays: integer("lead_time_days").default(1),
  minimumOrderQuantity: integer("minimum_order_quantity").default(1),
  paymentTerms: text("payment_terms"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  rating: real("rating").default(5),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const supplierPrices = sqliteTable(
  "supplier_prices",
  {
    id: text("id").primaryKey(),
    supplierId: text("supplier_id").references(() => suppliers.id, { onDelete: "cascade" }),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    unitPrice: real("unit_price").notNull(),
    currency: text("currency").default("TRY"),
    minQuantity: integer("min_quantity").default(1),
    validFrom: integer("valid_from", { mode: "timestamp" }),
    validUntil: integer("valid_until", { mode: "timestamp" }),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("idx_sup_prices_unique").on(table.supplierId, table.variantId),
  }),
);

export const purchaseOrders = sqliteTable(
  "purchase_orders",
  {
    id: text("id").primaryKey(),
    poNumber: text("po_number").notNull().unique(),
    supplierId: text("supplier_id").references(() => suppliers.id, { onDelete: "restrict" }),
    storeLocationId: text("store_location_id").references(() => storeLocations.id, { onDelete: "restrict" }),
    status: text("status").default("draft"),
    totalAmount: real("total_amount").notNull(),
    currency: text("currency").default("TRY"),
    orderedAt: integer("ordered_at", { mode: "timestamp" }).defaultNow(),
    expectedDeliveryAt: integer("expected_delivery_at", { mode: "timestamp" }),
    receivedAt: integer("received_at", { mode: "timestamp" }),
    notes: text("notes"),
  },
  (table) => ({
    supplierIdIdx: index("idx_po_supplier_id").on(table.supplierId),
    statusIdx: index("idx_po_status").on(table.status),
  }),
);

export const purchaseOrderItems = sqliteTable(
  "purchase_order_items",
  {
    id: text("id").primaryKey(),
    purchaseOrderId: text("purchase_order_id").references(() => purchaseOrders.id, { onDelete: "cascade" }),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    unitPrice: real("unit_price").notNull(),
    subtotal: real("subtotal").notNull(),
    receivedQuantity: integer("received_quantity").default(0),
  },
  (table) => ({
    poIdIdx: index("idx_poi_po_id").on(table.purchaseOrderId),
  }),
);

// 12. Kupon ve Promosyon Sistemi
export const coupons = sqliteTable(
  "coupons",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    description: text("description"),
    discountType: text("discount_type").notNull(),
    discountValue: real("discount_value").notNull(),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").default(0),
    maxUsesPerCustomer: integer("max_uses_per_customer").default(1),
    minOrderAmount: real("min_order_amount").default(0),
    applicableTo: text("applicable_to").default("all"),
    validFrom: integer("valid_from", { mode: "timestamp" }).notNull(),
    validUntil: integer("valid_until", { mode: "timestamp" }).notNull(),
    isActive: integer("is_active", { mode: "boolean" }).default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    codeIdx: uniqueIndex("idx_coupon_code").on(table.code),
    validFromIdx: index("idx_coupon_valid_from").on(table.validFrom),
  }),
);

export const couponRedemptions = sqliteTable(
  "coupon_redemptions",
  {
    id: text("id").primaryKey(),
    couponId: text("coupon_id").references(() => coupons.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    discountAmount: real("discount_amount").notNull(),
    redeemedAt: integer("redeemed_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    couponIdIdx: index("idx_redemption_coupon_id").on(table.couponId),
    userIdIdx: index("idx_redemption_user_id").on(table.userId),
  }),
);

// 13. Denetim ve Güvenlik (Audit Logging & Security)
export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    changes: text("changes", { mode: "json" }),
    reason: text("reason"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  },
  (table) => ({
    entityIdx: index("idx_audit_entity").on(table.entityType, table.entityId),
    userIdIdx: index("idx_audit_user_id").on(table.userId),
    createdAtIdx: index("idx_audit_created_at").on(table.createdAt),
  }),
);

export const dataRetentionPolicies = sqliteTable("data_retention_policies", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  retentionDays: integer("retention_days").notNull(),
  autoDeleteSoftDeleted: integer("auto_delete_soft_deleted", { mode: "boolean" }).default(true),
});

export const erasureRequests = sqliteTable(
  "erasure_requests",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    reason: text("reason"),
    status: text("status").default("pending"),
    requestedAt: integer("requested_at", { mode: "timestamp" }).defaultNow(),
    completedAt: integer("completed_at", { mode: "timestamp" }),
  },
  (table) => ({
    userIdIdx: index("idx_erasure_user_id").on(table.userId),
  }),
);

// 14. Çoklu Döviz ve Fiyatlandırma
// currencies tablosu kaldırıldı. Dil grubu üzerinden statik veri dosyasından çekilecek.

export const exchangeRates = sqliteTable(
  "exchange_rates",
  {
    id: text("id").primaryKey(),
    // Note: To avoid circular errors if currencies is accessed early, use reference by name or ensure order
    baseCurrency: text("base_currency"), // References currencies.code
    targetCurrency: text("target_currency"), // References currencies.code
    rate: real("rate").notNull(),
    rateDate: integer("rate_date", { mode: "timestamp" }).defaultNow(),
    source: text("source"),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("idx_exch_rates_unique").on(table.baseCurrency, table.targetCurrency, table.rateDate),
  }),
);

export const variantPrices = sqliteTable(
  "variant_prices",
  {
    id: text("id").primaryKey(),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    currency: text("currency"), // References currencies.code
    price: real("price").notNull(),
    oldPrice: real("old_price"),
    validFrom: integer("valid_from", { mode: "timestamp" }).defaultNow(),
    validUntil: integer("valid_until", { mode: "timestamp" }),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("idx_var_prices_unique").on(table.variantId, table.currency),
    variantIdIdx: index("idx_prices_variant_id").on(table.variantId),
  }),
);

export const deliveryFeePrices = sqliteTable(
  "delivery_fee_prices",
  {
    id: text("id").primaryKey(),
    deliveryZoneId: text("delivery_zone_id").references(() => deliveryZones.id, { onDelete: "cascade" }),
    currency: text("currency"), // References currencies.code
    fee: real("fee").notNull(),
    validFrom: integer("valid_from", { mode: "timestamp" }).defaultNow(),
    validUntil: integer("valid_until", { mode: "timestamp" }),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("idx_del_fee_unique").on(table.deliveryZoneId, table.currency),
  }),
);

// 15. SSS (FAQ) Yönetimi
export const faqs = sqliteTable("faqs", {
  id: text("id").primaryKey(),
  status: text("status").default("published"), // published, draft
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const faqTranslations = sqliteTable(
  "faq_translations",
  {
    id: text("id").primaryKey(),
    faqId: text("faq_id").references(() => faqs.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
  },
  (table) => ({
    transIdx: uniqueIndex("idx_faq_lang").on(table.faqId, table.languageCode),
  }),
);

export const productFaqs = sqliteTable(
  "product_faqs",
  {
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    faqId: text("faq_id").references(() => faqs.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => ({
    pk: primaryKey(table.productId, table.faqId),
  }),
);
