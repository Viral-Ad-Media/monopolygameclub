import Link from "next/link";
import { getCategories } from "@/lib/content";
import { site } from "@/lib/site";
import { Logo } from "./logo";

export async function Footer() {
  "use cache";
  const categories = await getCategories();
  return (
    <footer className="mt-20 border-t-4 border-brand bg-ink text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="inline-block rounded-xl bg-cream p-3">
            <Logo />
          </div>
          <p className="max-w-sm text-sm leading-relaxed">{site.description}</p>
        </div>
        <div>
          <h2 className="mb-3 font-display text-white">Games</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-display text-white">Club</h2>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-stone-400">
          © {new Date().getFullYear()} {site.name}. An independent fan site. Monopoly, Scrabble, Risk,
          Battleship and other game names are trademarks of their respective owners. We are not
          affiliated with or endorsed by them.
        </p>
      </div>
    </footer>
  );
}
