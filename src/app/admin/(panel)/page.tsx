import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { category, post } from "@/db/schema";
import { formatDate } from "@/lib/site";

export default async function AdminHome() {
  const posts = await db
    .select({ id: post.id, title: post.title, slug: post.slug, status: post.status, publishedAt: post.publishedAt, updatedAt: post.updatedAt, categoryName: category.name })
    .from(post)
    .leftJoin(category, eq(post.categoryId, category.id))
    .orderBy(desc(post.updatedAt));
  const games = await db.select().from(category).orderBy(asc(category.sortOrder));

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl">Articles</h1>
          <Link href="/admin/posts/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white">New article</Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr><th className="p-3">Title</th><th className="p-3">Game</th><th className="p-3">Status</th><th className="p-3">Published</th></tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="p-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-semibold hover:text-brand">{p.title}</Link>
                    <div className="text-xs text-muted">/{p.slug}</div>
                  </td>
                  <td className="p-3">{p.categoryName ?? "—"}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.status === "published" ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}>{p.status}</span>
                  </td>
                  <td className="whitespace-nowrap p-3 text-muted">{formatDate(p.publishedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl">Game sections</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <Link key={g.id} href={`/admin/games/${g.id}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 hover:border-ink">
              <span className="size-4 rounded" style={{ background: g.color }} />
              <span className="font-semibold">{g.name}</span>
              <span className="ml-auto text-xs text-muted">/{g.slug}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
