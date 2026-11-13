import "server-only";
import { and, asc, desc, eq, lte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { category, post } from "@/db/schema";

export const CONTENT_TAG = "content";

const publishedNow = () =>
  and(eq(post.status, "published"), lte(post.publishedAt, new Date()));

const listFields = {
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  coverImage: post.coverImage,
  coverAlt: post.coverAlt,
  publishedAt: post.publishedAt,
  categorySlug: category.slug,
  categoryName: category.name,
  categoryColor: category.color,
};

export type PostListItem = Awaited<ReturnType<typeof getLatestPosts>>[number];

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db.select().from(category).orderBy(asc(category.sortOrder), asc(category.name));
}

export async function getLatestPosts(limit = 100) {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db
    .select(listFields)
    .from(post)
    .leftJoin(category, eq(post.categoryId, category.id))
    .where(publishedNow())
    .orderBy(desc(post.publishedAt))
    .limit(limit);
}

export async function getPostsInCategory(categoryId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db
    .select(listFields)
    .from(post)
    .leftJoin(category, eq(post.categoryId, category.id))
    .where(and(publishedNow(), eq(post.categoryId, categoryId)))
    .orderBy(desc(post.publishedAt));
}

/** Resolves a top-level slug to either a published post or a game category. */
export async function getBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  const [p] = await db
    .select({ post, category })
    .from(post)
    .leftJoin(category, eq(post.categoryId, category.id))
    .where(and(eq(post.slug, slug), publishedNow()))
    .limit(1);
  if (p) return { kind: "post" as const, post: p.post, category: p.category };
  const [c] = await db.select().from(category).where(eq(category.slug, slug)).limit(1);
  if (c) return { kind: "category" as const, category: c };
  return null;
}

export async function getAllSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  const posts = await db
    .select({ slug: post.slug, updatedAt: post.updatedAt })
    .from(post)
    .where(publishedNow());
  const cats = await db
    .select({ slug: category.slug, updatedAt: category.updatedAt })
    .from(category);
  return [...cats, ...posts];
}
