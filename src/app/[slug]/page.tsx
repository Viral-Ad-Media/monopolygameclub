import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { Prose, Toc } from "@/components/prose";
import { getAllSlugs, getBySlug, getLatestPosts, getPostsInCategory } from "@/lib/content";
import { readingTime, renderMarkdown } from "@/lib/markdown";
import { formatDate, site } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBySlug(slug);
  if (!item) return {};
  if (item.kind === "post") {
    const p = item.post;
    return {
      title: { absolute: p.seoTitle || `${p.title} | ${site.name}` },
      description: p.seoDescription || p.excerpt,
      alternates: { canonical: `/${p.slug}` },
      openGraph: {
        type: "article",
        title: p.seoTitle || p.title,
        description: p.seoDescription || p.excerpt,
        publishedTime: p.publishedAt?.toISOString(),
        images: p.coverImage ? [p.coverImage] : undefined,
      },
    };
  }
  const c = item.category;
  return {
    title: `${c.name}: Rules, Strategy and Tips`,
    description: c.description,
    alternates: { canonical: `/${c.slug}` },
    openGraph: { images: c.coverImage ? [c.coverImage] : undefined },
  };
}

// Posts published from the admin after a build render on first visit, then get
// cached. Blocking (instead of streaming) also gives unknown slugs a real 404.
export const instant = false;

export default async function SlugPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const item = await getBySlug(slug);
  if (!item) notFound();
  return item.kind === "post" ? (
    <PostView post={item.post} category={item.category} />
  ) : (
    <CategoryView category={item.category} />
  );
}

type Item = NonNullable<Awaited<ReturnType<typeof getBySlug>>>;
type PostItem = Extract<Item, { kind: "post" }>;

async function PostView({ post, category }: Pick<PostItem, "post" | "category">) {
  const { toc } = renderMarkdown(post.body);
  const related = (await getLatestPosts(20))
    .filter((p) => p.slug !== post.slug && p.categorySlug === category?.slug)
    .slice(0, 3);
  const more =
    related.length >= 3
      ? related
      : [...related, ...(await getLatestPosts(10)).filter((p) => p.slug !== post.slug && !related.includes(p))].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `${site.url}${post.coverImage}` : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-10 text-center">
          {category && (
            <Link
              href={`/${category.slug}`}
              className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
              style={{ background: category.color }}
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-4 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{post.excerpt}</p>
          <p className="mt-4 text-sm text-muted">
            <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
            {" · "}
            {readingTime(post.body)} min read
          </p>
        </div>
        {post.coverImage && (
          <div className="mx-auto max-w-4xl px-4 pb-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border-2 border-ink">
              <Image src={post.coverImage} alt={post.coverAlt || post.title} fill priority sizes="(min-width: 896px) 864px, 100vw" className="object-cover" />
            </div>
          </div>
        )}
      </header>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_minmax(0,46rem)_1fr]">
        <aside className="lg:col-start-3 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <Toc items={toc} />
          </div>
        </aside>
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <Prose markdown={post.body} />
        </div>
      </div>
      {more.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 font-display text-2xl">Keep reading</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </article>
  );
}

async function CategoryView({ category }: { category: Extract<Item, { kind: "category" }>["category"] }) {
  const posts = await getPostsInCategory(category.id);
  return (
    <div>
      <header className="border-b-4 border-ink text-white" style={{ background: category.color }}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">Game guide</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{category.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-white/90">{category.tagline}</p>
          </div>
          {category.coverImage && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-ink">
              <Image src={category.coverImage} alt={`${category.name} board game`} fill priority sizes="(min-width: 768px) 460px, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Prose markdown={category.body} />
      </div>
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 font-display text-2xl">{category.name} articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
