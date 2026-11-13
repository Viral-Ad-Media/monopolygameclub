import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // Neon in production; plain Postgres (e.g. localhost) for local development.
  if (/neon\.tech|neon\.build/.test(url)) {
    // Both drivers expose the same query API; transactions are not used.
    return drizzleNeon(neon(url), { schema }) as unknown as Db;
  }
  return drizzlePg(new Pool({ connectionString: url }), { schema });
}

const globalForDb = globalThis as unknown as { __db?: Db };

export const db: Db = globalForDb.__db ?? (globalForDb.__db = createDb());
