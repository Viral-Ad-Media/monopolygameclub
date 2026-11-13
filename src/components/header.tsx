import Link from "next/link";
import { getCategories } from "@/lib/content";
import { Logo } from "./logo";

export async function Header() {
  const categories = await getCategories();
  const featured = categories.filter((c) => ["monopoly", "chess", "catan", "scrabble"].includes(c.slug));
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm font-semibold md:flex" aria-label="Main">
          {featured.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="rounded-md px-3 py-2 hover:bg-white">
              {c.name}
            </Link>
          ))}
          <Link href="/#games" className="rounded-md px-3 py-2 hover:bg-white">All games</Link>
          <Link href="/blog" className="ml-2 rounded-md bg-ink px-4 py-2 text-white hover:bg-brand">
            Blog
          </Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            className="absolute right-0 mt-2 grid w-56 gap-1 rounded-xl border border-line bg-white p-2 text-sm font-semibold shadow-lg"
            aria-label="Mobile"
          >
            <Link href="/blog" className="rounded-md px-3 py-2 hover:bg-cream">Blog</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="rounded-md px-3 py-2 hover:bg-cream">
                {c.name}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
