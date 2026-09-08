import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Load environment variables for local DB path or D1 connection
const dbPath = import.meta.env.DB_URL || "file:./local.db";

const client = createClient({
  url: dbPath,
  authToken: import.meta.env.DB_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
