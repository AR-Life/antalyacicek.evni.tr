import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";

const client = createClient({ url: "file:./local.db" });
const db = drizzle(client);

async function runMigrate() {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration complete!");
  process.exit(0);
}

runMigrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
