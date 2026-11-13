import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Monopoly Game Club home">
      <span className="grid size-10 place-items-center rounded-lg bg-brand text-white shadow-[0_3px_0_var(--color-brand-dark)] transition group-hover:-translate-y-0.5">
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="8" cy="8" r="1.6" />
          <circle cx="16" cy="8" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="8" cy="16" r="1.6" />
          <circle cx="16" cy="16" r="1.6" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg tracking-tight text-ink">MONOPOLY</span>
        <span className="block text-[0.7rem] font-bold tracking-[0.25em] text-brand">GAME CLUB</span>
      </span>
    </Link>
  );
}
