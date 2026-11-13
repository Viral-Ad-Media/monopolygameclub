import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { category } from "@/db/schema";
import { CategoryForm } from "@/components/category-form";
import { listImages } from "@/lib/images";

export default async function EditGamePage({ params }: PageProps<"/admin/games/[id]">) {
  const { id } = await params;
  const [c] = await db.select().from(category).where(eq(category.id, Number(id) || 0));
  if (!c) notFound();
  const images = await listImages();
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">Edit {c.name}</h1>
        <Link href={`/${c.slug}`} className="text-sm font-semibold text-brand hover:underline">View on site ↗</Link>
      </div>
      <CategoryForm category={c} images={images} />
    </>
  );
}
