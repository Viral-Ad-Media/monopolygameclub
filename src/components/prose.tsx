import { renderMarkdown, type TocItem } from "@/lib/markdown";

export function Prose({ markdown }: { markdown: string }) {
  const { html } = renderMarkdown(markdown);
  return (
    <div
      className="prose prose-lg prose-game max-w-none prose-a:font-semibold prose-img:mx-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;
  return (
    <nav aria-label="Contents" className="rounded-2xl border border-line bg-paper p-5">
      <p className="mb-3 font-display text-sm uppercase tracking-wider">Contents</p>
      <ol className="space-y-2 text-sm">
        {items.map((t, i) => (
          <li key={t.id} className="flex gap-2">
            <span className="font-bold text-brand">{i + 1}.</span>
            <a href={`#${t.id}`} className="text-muted hover:text-ink">{t.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
