import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.DB_URL || "http://127.0.0.1:8080",
});

async function run() {
  try {
    console.log("Creating faqs table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS \`faqs\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`status\` text DEFAULT 'published',
        \`sort_order\` integer DEFAULT 0,
        \`created_at\` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
      );
    `);

    console.log("Creating faq_translations table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS \`faq_translations\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`faq_id\` text NOT NULL,
        \`language_code\` text NOT NULL,
        \`question\` text NOT NULL,
        \`answer\` text NOT NULL,
        FOREIGN KEY (\`faq_id\`) REFERENCES \`faqs\`(\`id\`) ON DELETE cascade ON UPDATE no action
      );
    `);

    console.log("Creating index idx_faq_lang...");
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS \`idx_faq_lang\` ON \`faq_translations\` (\`faq_id\`, \`language_code\`);
    `);

    console.log("Creating product_faqs table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS \`product_faqs\` (
        \`product_id\` text NOT NULL,
        \`faq_id\` text NOT NULL,
        \`sort_order\` integer DEFAULT 0,
        PRIMARY KEY (\`product_id\`, \`faq_id\`),
        FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE cascade ON UPDATE no action,
        FOREIGN KEY (\`faq_id\`) REFERENCES \`faqs\`(\`id\`) ON DELETE cascade ON UPDATE no action
      );
    `);

    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration error:", err);
  }
}

run();
