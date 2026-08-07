import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // For LibSQL or Cloudflare D1
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL || "file:./local.db",
  },
});
