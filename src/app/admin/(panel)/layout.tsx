import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/lib/session";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "Editor", robots: { index: false } };

async function Guard({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <nav className="flex gap-4 text-sm font-semibold">
          <Link href="/admin" className="hover:text-brand">Articles &amp; games</Link>
          <Link href="/admin/posts/new" className="hover:text-brand">New article</Link>
          <Link href="/" className="text-muted hover:text-brand">View site ↗</Link>
        </nav>
        <form action={signOut} className="flex items-center gap-3 text-sm text-muted">
          <span>{user.email}</span>
          <button className="rounded-md border border-line bg-white px-3 py-1.5 font-semibold text-ink hover:border-ink">Sign out</button>
        </form>
      </div>
      <div className="pt-8">{children}</div>
    </>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Guard>{children}</Guard>
      </Suspense>
    </div>
  );
}
