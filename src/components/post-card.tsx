import Image from "next/image";
import Link from "next/link";
import type { PostListItem } from "@/lib/content";
import { formatDate } from "@/lib/site";

export function PostCard({ post, priority = false }: { post: PostListItem; priority?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-board">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={priority}
          />
        )}
      </Link>
      {post.categorySlug && (
        <div className="h-2" style={{ background: post.categoryColor ?? undefined }} aria-hidden />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          {post.categorySlug && (
            <Link href={`/${post.categorySlug}`} className="hover:text-brand">
              {post.categoryName}
            </Link>
          )}
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
        </div>
        <h3 className="font-display text-xl leading-tight">
          <Link href={`/${post.slug}`} className="hover:text-brand">{post.title}</Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </article>
  );
}
