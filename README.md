# Auto team profile website

Bilingual team profile for **Auto team**. Persian is the default locale; English is at `/en`.

Three visual templates are available in admin: `editorial`, `studio`, and `signal`.

## Run locally

```bash
npm install
npm run dev
```

Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) for correct SEO canonical, Open Graph, sitemap, and robots URLs.

Admin credentials (optional):

```bash
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
```

Then open `/admin`.

## Content model

The public page covers mission, products, projects, team departments (sales / engineering / research / support), capabilities, milestones, and contact.

Synthetic placeholder data (member names, product samples) ships in `data/content.json` and the seed. Replace them in the admin studio before production.

## Fill contact, socials, products, and team

After the site is running, use the admin studio (or edit `data/content.json`):

1. **Identity** — team name (`nav.home` / hero name). Defaults to Auto team.
2. **Contact → ایمیل** — enables the mailto button.
3. **Links** — set each social URL and turn **نمایش** on.
4. **Products / Team / Projects** — replace synthetic names, bios, images, and optional URLs.
5. **پیش‌نمایش** — after **ذخیره**, preview `/` or `/en` in the iframe panel.

Images can be pasted as paths (`/templates/...`) or uploaded into `public/uploads/` from the image fields.

Public GitHub fallback on the site: `parsa2500`.
