import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set (add it to .env)");

let pool: Pool | undefined;
export const db: NodePgDatabase<typeof schema> = /neon\.tech|neon\.build/.test(url)
  ? (drizzleNeon(neon(url), { schema }) as unknown as NodePgDatabase<typeof schema>)
  : drizzlePg((pool = new Pool({ connectionString: url })), { schema });

export async function closeDb() {
  await pool?.end();
}
export { schema };
