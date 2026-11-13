/**
 * Loads the game sections and articles in src/content into the database.
 *
 *   npm run db:seed              # add anything missing, keep edits made in the admin
 *   npm run db:seed -- --overwrite  # reset seeded items to the files' content
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { sql } from "drizzle-orm";
import { closeDb, db, schema } from "./db";

const overwrite = process.argv.includes("--overwrite");
const root = path.join(process.cwd(), "src", "content");

function read(dir: string) {
  return fs
    .readdirSync(path.join(root, dir))
    .filter((f) => f.endsWith(".md"))
    .map((f) => matter(fs.readFileSync(path.join(root, dir, f), "utf8")));
}

async function main() {
  const categories = read("categories");
  for (const { data, content } of categories) {
    const values = {
      slug: String(data.slug),
      name: String(data.name),
      tagline: String(data.tagline ?? ""),
      description: String(data.description ?? ""),
      body: content.trim(),
      coverImage: data.coverImage ?? null,
      color: String(data.color ?? "#d4001a"),
      sortOrder: Number(data.sortOrder ?? 0),
    };
    const q = db.insert(schema.category).values(values);
    await (overwrite
      ? q.onConflictDoUpdate({
          target: schema.category.slug,
          set: { ...values, updatedAt: new Date() },
        })
      : q.onConflictDoNothing());
  }

  const cats = await db.select().from(schema.category);
  const idBySlug = new Map(cats.map((c) => [c.slug, c.id]));

  const posts = read("posts");
  for (const { data, content } of posts) {
    const categoryId = idBySlug.get(String(data.category));
    if (!categoryId) throw new Error(`Unknown category "${data.category}" in ${data.slug}`);
    const values = {
      slug: String(data.slug),
      title: String(data.title),
      excerpt: String(data.excerpt ?? ""),
      body: content.trim(),
      coverImage: data.coverImage ?? null,
      coverAlt: String(data.coverAlt ?? ""),
      categoryId,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      status: "published" as const,
      publishedAt: new Date(data.publishedAt),
    };
    const q = db.insert(schema.post).values(values);
    await (overwrite
      ? q.onConflictDoUpdate({
          target: schema.post.slug,
          set: { ...values, updatedAt: new Date() },
        })
      : q.onConflictDoNothing());
  }

  const [{ count }] = await db.execute<{ count: string }>(
    sql`select count(*)::text as count from post`,
  ).then((r) => ("rows" in r ? r.rows : r) as { count: string }[]);
  console.log(
    `Seeded ${categories.length} game sections and ${posts.length} articles (${count} posts in database).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(closeDb);
