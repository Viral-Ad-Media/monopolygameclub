import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/db/schema";

/** A game section card styled like a Monopoly title deed. */
export function GameTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[4px_4px_0_var(--color-ink)] transition hover:-translate-y-1 hover:shadow-[6px_8px_0_var(--color-ink)]"
    >
      <div className="px-4 py-3 text-center" style={{ background: category.color }}>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/85">Title deed</p>
        <p className="font-display text-lg leading-tight text-white">{category.name}</p>
      </div>
      {category.coverImage && (
        <div className="relative aspect-[4/3] overflow-hidden border-y-2 border-ink">
          <Image
            src={category.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <p className="flex-1 px-4 py-3 text-center text-sm leading-snug text-muted">{category.tagline}</p>
    </Link>
  );
}
