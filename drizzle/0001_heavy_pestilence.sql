PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_delivery_fee_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`delivery_zone_id` text,
	`currency` text,
	`fee` real NOT NULL,
	`valid_from` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`valid_until` integer,
	FOREIGN KEY (`delivery_zone_id`) REFERENCES `delivery_zones`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_delivery_fee_prices`("id", "delivery_zone_id", "currency", "fee", "valid_from", "valid_until") SELECT "id", "delivery_zone_id", "currency", "fee", "valid_from", "valid_until" FROM `delivery_fee_prices`;--> statement-breakpoint
DROP TABLE `delivery_fee_prices`;--> statement-breakpoint
ALTER TABLE `__new_delivery_fee_prices` RENAME TO `delivery_fee_prices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_del_fee_unique` ON `delivery_fee_prices` (`delivery_zone_id`,`currency`);--> statement-breakpoint
CREATE TABLE `__new_exchange_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`base_currency` text,
	`target_currency` text,
	`rate` real NOT NULL,
	`rate_date` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`source` text
);
--> statement-breakpoint
INSERT INTO `__new_exchange_rates`("id", "base_currency", "target_currency", "rate", "rate_date", "source") SELECT "id", "base_currency", "target_currency", "rate", "rate_date", "source" FROM `exchange_rates`;--> statement-breakpoint
DROP TABLE `exchange_rates`;--> statement-breakpoint
ALTER TABLE `__new_exchange_rates` RENAME TO `exchange_rates`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_exch_rates_unique` ON `exchange_rates` (`base_currency`,`target_currency`,`rate_date`);--> statement-breakpoint
CREATE TABLE `__new_inventory_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`variant_id` text,
	`store_location_id` text,
	`quantity` integer DEFAULT 0,
	`expiration_date` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`store_location_id`) REFERENCES `store_locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_inventory_locations`("id", "variant_id", "store_location_id", "quantity", "expiration_date", "created_at", "updated_at") SELECT "id", "variant_id", "store_location_id", "quantity", "expiration_date", "created_at", "updated_at" FROM `inventory_locations`;--> statement-breakpoint
DROP TABLE `inventory_locations`;--> statement-breakpoint
ALTER TABLE `__new_inventory_locations` RENAME TO `inventory_locations`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_inv_loc_unique` ON `inventory_locations` (`variant_id`,`store_location_id`);--> statement-breakpoint
CREATE INDEX `idx_inv_loc_variant_id` ON `inventory_locations` (`variant_id`);--> statement-breakpoint
CREATE INDEX `idx_inv_loc_store_id` ON `inventory_locations` (`store_location_id`);--> statement-breakpoint
CREATE TABLE `__new_supplier_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_id` text,
	`variant_id` text,
	`unit_price` real NOT NULL,
	`currency` text DEFAULT 'TRY',
	`min_quantity` integer DEFAULT 1,
	`valid_from` integer,
	`valid_until` integer,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_supplier_prices`("id", "supplier_id", "variant_id", "unit_price", "currency", "min_quantity", "valid_from", "valid_until") SELECT "id", "supplier_id", "variant_id", "unit_price", "currency", "min_quantity", "valid_from", "valid_until" FROM `supplier_prices`;--> statement-breakpoint
DROP TABLE `supplier_prices`;--> statement-breakpoint
ALTER TABLE `__new_supplier_prices` RENAME TO `supplier_prices`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sup_prices_unique` ON `supplier_prices` (`supplier_id`,`variant_id`);--> statement-breakpoint
CREATE TABLE `__new_variant_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`variant_id` text,
	`currency` text,
	`price` real NOT NULL,
	`old_price` real,
	`valid_from` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`valid_until` integer,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_variant_prices`("id", "variant_id", "currency", "price", "old_price", "valid_from", "valid_until") SELECT "id", "variant_id", "currency", "price", "old_price", "valid_from", "valid_until" FROM `variant_prices`;--> statement-breakpoint
DROP TABLE `variant_prices`;--> statement-breakpoint
ALTER TABLE `__new_variant_prices` RENAME TO `variant_prices`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_var_prices_unique` ON `variant_prices` (`variant_id`,`currency`);--> statement-breakpoint
CREATE INDEX `idx_prices_variant_id` ON `variant_prices` (`variant_id`);