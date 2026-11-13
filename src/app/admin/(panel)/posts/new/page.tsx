import { asc } from "drizzle-orm";
import { db } from "@/db";
import { category } from "@/db/schema";
import { PostForm } from "@/components/post-form";
import { listImages } from "@/lib/images";

export default async function NewPostPage() {
  const [categories, images] = await Promise.all([
    db.select().from(category).orderBy(asc(category.sortOrder)),
    listImages(),
  ]);
  return (
    <>
      <h1 className="mb-6 font-display text-2xl">New article</h1>
      <PostForm categories={categories} images={images} />
    </>
  );
}
