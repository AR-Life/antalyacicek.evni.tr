import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.DB_URL || "http://127.0.0.1:8080",
});

async function run() {
  try {
    await client.execute("DROP INDEX IF EXISTS idx_audit_entity;");
    console.log("Index dropped");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
