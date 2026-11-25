import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migrations prefer the direct (unpooled) connection when Vercel/Neon provides one.
  dbCredentials: { url: (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL)! },
});
