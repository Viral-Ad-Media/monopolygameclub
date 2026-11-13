"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { category, post } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { slugify } from "@/lib/markdown";
import { requireUser } from "@/lib/session";

export type FormState = { error?: string; ok?: string } | undefined;

const RESERVED = new Set(["admin", "api", "blog", "privacy-policy", "sitemap.xml", "robots.txt", "images", "_next"]);

const imagePath = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Image must be a /images/... path or an https:// URL")
  .transform((v) => v || null);

const postSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(200),
  slug: z.string().trim().max(120).optional().default(""),
  excerpt: z.string().trim().max(400).default(""),
  body: z.string().max(200_000).default(""),
  coverImage: imagePath,
  coverAlt: z.string().trim().max(200).default(""),
  categoryId: z.coerce.number().int().positive().nullable().catch(null),
  seoTitle: z.string().trim().max(200).transform((v) => v || null),
  seoDescription: z.string().trim().max(400).transform((v) => v || null),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().trim().optional(),
});

async function slugTaken(slug: string, ignorePostId?: number) {
  if (RESERVED.has(slug)) return true;
  const [p] = await db.select({ id: post.id }).from(post).where(eq(post.slug, slug));
  if (p && p.id !== ignorePostId) return true;
  const [c] = await db.select({ id: category.id }).from(category).where(eq(category.slug, slug));
  return Boolean(c);
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = Number(formData.get("id")) || undefined;
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const slug = slugify(d.slug || d.title);
  if (!slug) return { error: "Please give the post a URL slug." };
  if (await slugTaken(slug, id)) return { error: `The URL /${slug} is already used. Choose another slug.` };

  let publishedAt: Date | null = d.publishedAt ? new Date(d.publishedAt) : null;
  if (publishedAt && Number.isNaN(publishedAt.getTime())) return { error: "Invalid publish date." };
  if (d.status === "published" && !publishedAt) publishedAt = new Date();

  const values = {
    title: d.title,
    slug,
    excerpt: d.excerpt,
    body: d.body,
    coverImage: d.coverImage,
    coverAlt: d.coverAlt,
    categoryId: d.categoryId,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    status: d.status,
    publishedAt,
    updatedAt: new Date(),
  };

  let savedId = id;
  if (id) {
    await db.update(post).set(values).where(eq(post.id, id));
  } else {
    const [row] = await db.insert(post).values({ ...values, authorId: user.id }).returning({ id: post.id });
    savedId = row.id;
  }
  updateTag(CONTENT_TAG);
  if (!id) redirect(`/admin/posts/${savedId}?saved=1`);
  return { ok: "Saved." };
}

export async function deletePost(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id"));
  if (id) await db.delete(post).where(eq(post.id, id));
  updateTag(CONTENT_TAG);
  redirect("/admin");
}

const categorySchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(80),
  tagline: z.string().trim().max(200).default(""),
  description: z.string().trim().max(400).default(""),
  body: z.string().max(200_000).default(""),
  coverImage: imagePath,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Colour must look like #d4001a"),
  sortOrder: z.coerce.number().int().default(0),
});

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { id, ...values } = parsed.data;
  await db.update(category).set({ ...values, updatedAt: new Date() }).where(eq(category.id, id));
  updateTag(CONTENT_TAG);
  return { ok: "Saved." };
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
