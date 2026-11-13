# Monopoly Game Club

The rebuilt [monopolygameclub.com](https://monopolygameclub.com): board game rules, strategy and history, rebuilt from the old WordPress site.

**Stack:** Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Neon Postgres with Drizzle ORM · Better Auth (email and password).

## What's here

- **Public site:** home page, 10 game sections (`/monopoly`, `/chess`, `/catan`, ...) and articles at the same URLs the WordPress site used, plus `/blog`, `/privacy-policy`, `sitemap.xml` and `robots.txt`. Redirects for old WordPress paths are in `next.config.ts`.
- **Editor at `/admin`:** sign in to write, edit, schedule and delete articles and edit the game section guides (Markdown). Public sign-up is off.
- **Content seed:** the starting articles and game guides live in `src/content/` as Markdown and are loaded into the database by `npm run db:seed`. After that, the database is the source of truth.

## Setup

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, BETTER_AUTH_SECRET, URLs
npm run db:migrate        # create tables
npm run db:seed           # load the game sections and articles
npm run create-admin -- you@example.com "Your Name"   # asks for a password
npm run dev
```

`DATABASE_URL` can be a Neon connection string (uses the Neon serverless driver) or a local Postgres URL for development.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:generate` | Create a migration after changing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Add missing seed content (`-- --overwrite` resets seeded items) |
| `npm run create-admin -- email "Name"` | Create an editor or reset their password |

## Deploying (Vercel)

1. Import the repo, set `DATABASE_URL`, `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the production URL.
2. Run `npm run db:migrate` and `npm run db:seed` against the Neon database once before the first build, because pages are prerendered from the database.

## Notes

- Images are in `public/images`. The editor takes an image path or an `https://` URL. Uploading images from the editor would need file storage (for example Vercel Blob) and isn't wired up yet.
- None of the old WordPress PHP was carried over. The backup contained malware in `wp-content/mu-plugins` and fake `index.php` files in several folders.
