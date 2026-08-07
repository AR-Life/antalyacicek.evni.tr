CREATE TABLE `attribute_term_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`term_id` text,
	`language_code` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`term_id`) REFERENCES `attribute_terms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `attribute_terms` (
	`id` text PRIMARY KEY NOT NULL,
	`attribute_id` text,
	`value` text NOT NULL,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `attribute_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`attribute_id` text,
	`language_code` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `attributes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'select'
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`action` text NOT NULL,
	`changes` text,
	`reason` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_audit_entity` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_user_id` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_created_at` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `auth_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_sessions_token_hash_unique` ON `auth_sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `auth_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_expires_at` ON `auth_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` text PRIMARY KEY NOT NULL,
	`cart_id` text,
	`variant_id` text,
	`quantity` integer NOT NULL,
	`selected_options` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quantity_check" CHECK(quantity > 0)
);
--> statement-breakpoint
CREATE INDEX `idx_cart_items_cart_id` ON `cart_items` (`cart_id`);--> statement-breakpoint
CREATE TABLE `carts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`session_id` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_carts_user_id` ON `carts` (`user_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`image_id` text,
	`status` text DEFAULT 'published',
	`deleted_at` integer,
	`sort_order` integer DEFAULT 0,
	`depth` integer DEFAULT 0,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "parent_id_check" CHECK(parent_id IS NULL OR parent_id != id)
);
--> statement-breakpoint
CREATE TABLE `category_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`language_code` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`meta_title` text,
	`meta_description` text,
	`robots` text DEFAULT 'index, follow',
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cat_trans_slug` ON `category_translations` (`language_code`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cat_trans_lang` ON `category_translations` (`category_id`,`language_code`);--> statement-breakpoint
CREATE TABLE `coupon_redemptions` (
	`id` text PRIMARY KEY NOT NULL,
	`coupon_id` text,
	`order_id` text,
	`user_id` text,
	`discount_amount` real NOT NULL,
	`redeemed_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_redemption_coupon_id` ON `coupon_redemptions` (`coupon_id`);--> statement-breakpoint
CREATE INDEX `idx_redemption_user_id` ON `coupon_redemptions` (`user_id`);--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`discount_type` text NOT NULL,
	`discount_value` real NOT NULL,
	`max_uses` integer,
	`used_count` integer DEFAULT 0,
	`max_uses_per_customer` integer DEFAULT 1,
	`min_order_amount` real DEFAULT 0,
	`applicable_to` text DEFAULT 'all',
	`valid_from` integer NOT NULL,
	`valid_until` integer NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_coupon_code` ON `coupons` (`code`);--> statement-breakpoint
CREATE INDEX `idx_coupon_valid_from` ON `coupons` (`valid_from`);--> statement-breakpoint
CREATE TABLE `couriers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`store_location_id` text,
	`full_name` text NOT NULL,
	`phone_number` text NOT NULL,
	`license_number` text,
	`vehicle_type` text,
	`vehicle_plate` text,
	`status` text DEFAULT 'active',
	`is_available` integer DEFAULT true,
	`total_deliveries` integer DEFAULT 0,
	`successful_deliveries` integer DEFAULT 0,
	`avg_delivery_time` integer,
	`rating` real DEFAULT 5,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`store_location_id`) REFERENCES `store_locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_couriers_store_id` ON `couriers` (`store_location_id`);--> statement-breakpoint
CREATE INDEX `idx_couriers_status` ON `couriers` (`status`);--> statement-breakpoint
CREATE TABLE `currencies` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`symbol` text NOT NULL,
	`decimal_places` integer DEFAULT 2,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `customer_addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`address_line` text NOT NULL,
	`address_line2` text,
	`city` text NOT NULL,
	`postal_code` text NOT NULL,
	`country` text DEFAULT 'TR',
	`longitude` real,
	`latitude` real,
	`is_default` integer DEFAULT false,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_addresses_user_id` ON `customer_addresses` (`user_id`);--> statement-breakpoint
CREATE TABLE `customer_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`date_of_birth` integer,
	`marketing_opt_in` integer DEFAULT false,
	`sms_opt_in` integer DEFAULT false,
	`preferred_language` text DEFAULT 'tr',
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `data_retention_policies` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`retention_days` integer NOT NULL,
	`auto_delete_soft_deleted` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `delivery_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text,
	`courier_id` text,
	`assigned_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`picked_up_at` integer,
	`delivered_at` integer,
	`failed_at` integer,
	`failure_reason` text,
	`estimated_delivery_time` integer,
	`actual_delivery_time` integer,
	`tracking_notes` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`courier_id`) REFERENCES `couriers`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_delivery_assign_order_id` ON `delivery_assignments` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_delivery_assign_courier_id` ON `delivery_assignments` (`courier_id`);--> statement-breakpoint
CREATE TABLE `delivery_fee_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`delivery_zone_id` text,
	`currency` text,
	`fee` real NOT NULL,
	`valid_from` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`valid_until` integer,
	PRIMARY KEY(`delivery_zone_id`, `currency`),
	FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `delivery_time_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`zone_id` text,
	`name` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`timezone` text DEFAULT 'Europe/Istanbul',
	`surcharge` real DEFAULT 0,
	`max_capacity` integer,
	`current_capacity` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`valid_from` integer,
	`valid_until` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`zone_id`) REFERENCES `delivery_zones`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_time_slots_zone_id` ON `delivery_time_slots` (`zone_id`);--> statement-breakpoint
CREATE TABLE `delivery_zones` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`postal_codes` text,
	`minimum_order_value` real DEFAULT 0,
	`delivery_fee` real DEFAULT 0,
	`estimated_minutes` integer DEFAULT 60,
	`status` text DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE `erasure_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`reason` text,
	`status` text DEFAULT 'pending',
	`requested_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_erasure_user_id` ON `erasure_requests` (`user_id`);--> statement-breakpoint
CREATE TABLE `exchange_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`base_currency` text,
	`target_currency` text,
	`rate` real NOT NULL,
	`rate_date` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`source` text,
	PRIMARY KEY(`base_currency`, `target_currency`, `rate_date`)
);
--> statement-breakpoint
CREATE TABLE `inventory_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`variant_id` text,
	`store_location_id` text,
	`quantity` integer DEFAULT 0,
	`expiration_date` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer,
	PRIMARY KEY(`variant_id`, `store_location_id`),
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`store_location_id`) REFERENCES `store_locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_inv_loc_variant_id` ON `inventory_locations` (`variant_id`);--> statement-breakpoint
CREATE INDEX `idx_inv_loc_store_id` ON `inventory_locations` (`store_location_id`);--> statement-breakpoint
CREATE TABLE `inventory_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`variant_id` text,
	`store_location_id` text,
	`quantity` integer NOT NULL,
	`type` text NOT NULL,
	`reference_id` text,
	`notes` text,
	`created_by` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`store_location_id`) REFERENCES `store_locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_inv_trans_variant_id` ON `inventory_transactions` (`variant_id`);--> statement-breakpoint
CREATE INDEX `idx_inv_trans_type` ON `inventory_transactions` (`type`);--> statement-breakpoint
CREATE INDEX `idx_inv_trans_created_at` ON `inventory_transactions` (`created_at`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`mime_type` text,
	`alt_text` text,
	`width` integer,
	`height` integer,
	`caption` text,
	`thumbnail_url` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE TABLE `occasion_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`occasion_id` text,
	`language_code` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`occasion_id`) REFERENCES `occasions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `occasions` (
	`id` text PRIMARY KEY NOT NULL,
	`image_id` text,
	`status` text DEFAULT 'published',
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`id` text PRIMARY KEY NOT NULL,
	`store_id` text,
	`day_of_week` text NOT NULL,
	`opens` text NOT NULL,
	`closes` text NOT NULL,
	`valid_from` integer,
	`valid_through` integer,
	FOREIGN KEY (`store_id`) REFERENCES `store_locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text,
	`variant_id` text,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`subtotal` real NOT NULL,
	`selected_options` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_order_items_order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`user_id` text,
	`billing_address_id` text,
	`shipping_address_id` text,
	`status` text DEFAULT 'pending',
	`payment_status` text DEFAULT 'unpaid',
	`delivery_status` text DEFAULT 'unassigned',
	`subtotal` real NOT NULL,
	`delivery_fee` real DEFAULT 0,
	`discount_amount` real DEFAULT 0,
	`tax_amount` real DEFAULT 0,
	`total_amount` real NOT NULL,
	`currency` text DEFAULT 'TRY',
	`coupon_code` text,
	`coupon_id` text,
	`delivery_zone_id` text,
	`delivery_time_slot_id` text,
	`delivery_notes` text,
	`placed_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`processed_at` integer,
	`shipped_at` integer,
	`delivered_at` integer,
	`cancelled_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`billing_address_id`) REFERENCES `customer_addresses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipping_address_id`) REFERENCES `customer_addresses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE INDEX `idx_orders_user_id` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_orders_placed_at` ON `orders` (`placed_at`);--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`legal_name` text NOT NULL,
	`brand_name` text NOT NULL,
	`slogan` text,
	`website` text,
	`tax_number` text,
	`email` text,
	`phone` text,
	`whatsapp` text,
	`currencies_accepted` text DEFAULT 'TRY,USD,EUR',
	`payment_accepted` text DEFAULT 'Cash, Credit Card, EFT',
	`price_range` text DEFAULT '$$',
	`social_profiles` text
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text,
	`transaction_id` text,
	`payment_method` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'TRY',
	`status` text DEFAULT 'pending',
	`failure_reason` text,
	`payment_gateway` text,
	`gateway_response` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`completed_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_transaction_id_unique` ON `payments` (`transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_payments_order_id` ON `payments` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_payments_status` ON `payments` (`status`);--> statement-breakpoint
CREATE TABLE `product_embeddings` (
	`product_id` text PRIMARY KEY NOT NULL,
	`embedding_status` text DEFAULT 'pending',
	`embedding_updated_at` integer,
	`vector_data` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_media` (
	`product_id` text,
	`media_id` text,
	`sort_order` integer DEFAULT 0,
	PRIMARY KEY(`product_id`, `media_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_occasions` (
	`product_id` text,
	`occasion_id` text,
	PRIMARY KEY(`product_id`, `occasion_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`occasion_id`) REFERENCES `occasions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_option_values` (
	`id` text PRIMARY KEY NOT NULL,
	`option_id` text,
	`name` text NOT NULL,
	`price_modifier` real DEFAULT 0,
	`price_type` text DEFAULT 'fixed',
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`option_id`) REFERENCES `product_options`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_options` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`name` text NOT NULL,
	`type` text DEFAULT 'checkbox',
	`is_required` integer DEFAULT false,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`author_name` text NOT NULL,
	`author_type` text DEFAULT 'Person',
	`rating_value` integer NOT NULL,
	`review_body` text,
	`verified_purchase` integer DEFAULT false,
	`status` text DEFAULT 'pending',
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "rating_check" CHECK(rating_value BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE `product_stats` (
	`product_id` text PRIMARY KEY NOT NULL,
	`view_count` integer DEFAULT 0,
	`sales_count` integer DEFAULT 0,
	`seo_score` integer DEFAULT 0,
	`missing_alt` integer DEFAULT false,
	`missing_description` integer DEFAULT false,
	`missing_title` integer DEFAULT false,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_tags` (
	`product_id` text,
	`tag_id` text,
	PRIMARY KEY(`product_id`, `tag_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`language_code` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text,
	`description` text,
	`seo_description` text,
	`marketing_description` text,
	`ai_summary` text,
	`meta_title` text,
	`meta_description` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_prod_trans_slug` ON `product_translations` (`language_code`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_prod_lang` ON `product_translations` (`product_id`,`language_code`);--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`sku` text NOT NULL,
	`gtin` text,
	`condition` text DEFAULT 'new',
	`availability` text DEFAULT 'InStock',
	`price` real NOT NULL,
	`old_price` real,
	`currency` text DEFAULT 'TRY',
	`sale_price_effective_date` integer,
	`sale_price_effective_end_date` integer,
	`stock` integer DEFAULT 0,
	`manage_stock` integer DEFAULT true,
	`low_stock_threshold` integer DEFAULT 5,
	`expiration_date` integer,
	`shipping_weight` real,
	`shipping_length` real,
	`shipping_width` real,
	`shipping_height` real,
	`subscription_period` text,
	`subscription_interval` integer DEFAULT 1,
	`image_id` text,
	`is_default` integer DEFAULT false,
	`status` text DEFAULT 'published',
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_variants_sku_unique` ON `product_variants` (`sku`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`gtin` text,
	`mpn` text,
	`condition` text DEFAULT 'new',
	`availability` text DEFAULT 'InStock',
	`status` text DEFAULT 'published',
	`product_type` text DEFAULT 'physical',
	`published_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer,
	`deleted_at` integer,
	`review_count` integer DEFAULT 0,
	`average_rating` real DEFAULT 0,
	`rating_1_count` integer DEFAULT 0,
	`rating_2_count` integer DEFAULT 0,
	`rating_3_count` integer DEFAULT 0,
	`rating_4_count` integer DEFAULT 0,
	`rating_5_count` integer DEFAULT 0,
	`brand` text DEFAULT 'Antalya Çiçek',
	`google_product_category` text,
	`country_of_origin` text DEFAULT 'TR',
	`adult` integer DEFAULT false,
	`is_bundle` integer DEFAULT false,
	`default_price` real,
	`currency` text DEFAULT 'TRY',
	`identifier_exists` integer DEFAULT false,
	`custom_label_0` text,
	`custom_label_1` text,
	`shipping_label` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_gtin_unique` ON `products` (`gtin`);--> statement-breakpoint
CREATE TABLE `purchase_order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_order_id` text,
	`variant_id` text,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`subtotal` real NOT NULL,
	`received_quantity` integer DEFAULT 0,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_poi_po_id` ON `purchase_order_items` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`po_number` text NOT NULL,
	`supplier_id` text,
	`store_location_id` text,
	`status` text DEFAULT 'draft',
	`total_amount` real NOT NULL,
	`currency` text DEFAULT 'TRY',
	`ordered_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`expected_delivery_at` integer,
	`received_at` integer,
	`notes` text,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`store_location_id`) REFERENCES `store_locations`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchase_orders_po_number_unique` ON `purchase_orders` (`po_number`);--> statement-breakpoint
CREATE INDEX `idx_po_supplier_id` ON `purchase_orders` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `idx_po_status` ON `purchase_orders` (`status`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`source_url` text NOT NULL,
	`target_url` text NOT NULL,
	`status_code` integer DEFAULT 301,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_source_url_unique` ON `redirects` (`source_url`);--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text,
	`payment_id` text,
	`amount` real NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'pending',
	`notes` text,
	`requested_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`processed_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_refunds_order_id` ON `refunds` (`order_id`);--> statement-breakpoint
CREATE TABLE `related_products` (
	`product_id` text,
	`related_product_id` text,
	`relation_type` text NOT NULL,
	`sort_order` integer DEFAULT 0,
	PRIMARY KEY(`product_id`, `related_product_id`, `relation_type`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sitemap_queue` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`priority` real DEFAULT 0.8,
	`changefreq` text DEFAULT 'weekly',
	`lastmod` integer,
	`needs_reindex` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sitemap_queue_url_unique` ON `sitemap_queue` (`url`);--> statement-breakpoint
CREATE TABLE `store_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text,
	`name` text NOT NULL,
	`address_line` text NOT NULL,
	`address_locality` text,
	`address_region` text,
	`country` text DEFAULT 'TR',
	`postal_code` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`map_url` text,
	`area_served` text,
	`accepts_reservations` integer DEFAULT false,
	FOREIGN KEY (`org_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `supplier_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_id` text,
	`variant_id` text,
	`unit_price` real NOT NULL,
	`currency` text DEFAULT 'TRY',
	`min_quantity` integer DEFAULT 1,
	`valid_from` integer,
	`valid_until` integer,
	PRIMARY KEY(`supplier_id`, `variant_id`),
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_person` text,
	`email` text,
	`phone` text NOT NULL,
	`address_line` text,
	`city` text,
	`postal_code` text,
	`lead_time_days` integer DEFAULT 1,
	`minimum_order_quantity` integer DEFAULT 1,
	`payment_terms` text,
	`is_active` integer DEFAULT true,
	`rating` real DEFAULT 5,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE TABLE `tag_translations` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_id` text,
	`language_code` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`phone` text,
	`role` text DEFAULT 'customer',
	`email_verified` integer DEFAULT false,
	`email_verified_at` integer,
	`last_login_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `variant_attribute_values` (
	`variant_id` text,
	`term_id` text,
	PRIMARY KEY(`variant_id`, `term_id`),
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`term_id`) REFERENCES `attribute_terms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `variant_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`variant_id` text,
	`currency` text,
	`price` real NOT NULL,
	`old_price` real,
	`valid_from` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`valid_until` integer,
	PRIMARY KEY(`variant_id`, `currency`),
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_prices_variant_id` ON `variant_prices` (`variant_id`);