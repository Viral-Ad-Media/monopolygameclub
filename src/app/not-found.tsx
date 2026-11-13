import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-7xl text-brand">404</p>
      <h1 className="mt-4 font-display text-2xl">Go directly to jail. Do not pass GO.</h1>
      <p className="mt-3 text-muted">We couldn&apos;t find that page. It may have moved when we rebuilt the site.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-lg bg-brand px-5 py-3 font-bold text-white">Home</Link>
        <Link href="/blog" className="rounded-lg border-2 border-ink px-5 py-3 font-bold">All articles</Link>
      </div>
    </div>
  );
}
