import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getLatestPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Every board game guide on Monopoly Game Club, newest first.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getLatestPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl">Blog</h1>
      <p className="mt-2 text-muted">Rules, strategy and history for every game we cover.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p.slug} post={p} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
