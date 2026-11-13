import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { category, post } from "@/db/schema";
import { PostForm } from "@/components/post-form";
import { listImages } from "@/lib/images";
import { deletePost } from "../../../actions";

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const [p] = await db.select().from(post).where(eq(post.id, Number(id) || 0));
  if (!p) notFound();
  const [categories, images] = await Promise.all([
    db.select().from(category).orderBy(asc(category.sortOrder)),
    listImages(),
  ]);
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Edit article</h1>
        {p.status === "published" && (
          <Link href={`/${p.slug}`} className="text-sm font-semibold text-brand hover:underline">View on site ↗</Link>
        )}
      </div>
      <PostForm post={p} categories={categories} images={images} />
      <form action={deletePost} className="mt-12 border-t border-line pt-6">
        <input type="hidden" name="id" value={p.id} />
        <button className="text-sm font-semibold text-brand-dark hover:underline">Delete this article</button>
      </form>
    </>
  );
}
