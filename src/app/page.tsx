import Image from "next/image";
import Link from "next/link";
import { GameTile } from "@/components/game-tile";
import { PostCard } from "@/components/post-card";
import { getCategories, getLatestPosts } from "@/lib/content";

export default async function HomePage() {
  const [categories, posts] = await Promise.all([getCategories(), getLatestPosts(7)]);
  const [lead, ...rest] = posts;

  return (
    <>
      <section className="relative overflow-hidden border-b-4 border-ink bg-brand text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div className="space-y-6">
            <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">
              Board game rules · strategy · history
            </p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Roll the dice. <br />
              <span className="text-gold">Play to win.</span>
            </h1>
            <p className="max-w-lg text-lg text-white/90">
              Clear rules and real strategy for Monopoly and the classic board games your family
              loves, from chess and Catan to Scrabble, Risk and Ticket to Ride.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/official-monopoly-rules-explained"
                className="rounded-lg bg-white px-5 py-3 font-bold text-brand shadow-[0_4px_0_var(--color-ink)] transition hover:-translate-y-0.5"
              >
                Official Monopoly rules
              </Link>
              <Link
                href="#games"
                className="rounded-lg border-2 border-white px-5 py-3 font-bold transition hover:bg-white/10"
              >
                Browse games
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rotate-3 rounded-3xl bg-gold" aria-hidden />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-ink">
              <Image
                src="/images/hero-board-game.jpg"
                alt="Board game pieces and dice on a game board"
                fill
                priority
                sizes="(min-width: 768px) 448px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {lead && (
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl">Latest guides</h2>
            <Link href="/blog" className="text-sm font-bold text-brand hover:underline">
              All articles →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[lead, ...rest].slice(0, 6).map((p, i) => (
              <PostCard key={p.slug} post={p} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      <section id="games" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16">
        <h2 className="font-display text-3xl">Pick your game</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every section has a full guide to the rules, plus tips to help you win.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <GameTile key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border-2 border-ink bg-board p-6 md:grid-cols-2 md:p-10">
          <div className="space-y-4">
            <h2 className="font-display text-3xl">New to Monopoly? Start here.</h2>
            <p className="text-ink/80">
              Most families play with house rules they think are official. Learn the real rules,
              then pick up the strategy that wins games.
            </p>
            <ol className="space-y-2 font-semibold">
              <li><Link className="hover:text-brand" href="/official-monopoly-rules-explained">1. Official Monopoly rules explained</Link></li>
              <li><Link className="hover:text-brand" href="/monopoly-strategy-tips-to-win">2. 10 strategy tips to win</Link></li>
              <li><Link className="hover:text-brand" href="/monopoly-trading-strategy">3. How to negotiate trades</Link></li>
              <li><Link className="hover:text-brand" href="/best-monopoly-house-rules">4. The best house rules</Link></li>
            </ol>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-ink">
            <Image src="/images/monopoly-pieces.jpg" alt="Close-up of Monopoly tokens on the board" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
