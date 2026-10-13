# Aymane Maali — portfolio

A bilingual portfolio for a Software & Systems Engineering Student seeking Full-stack, QA/test automation, DevOps and Systems Management opportunities. Responsive editorial layouts, Rengok/Brogetta typography, violet/pink fluid effects, scroll choreography, a custom cursor and a procedural black-hole orb. No runtime package dependencies.

## Local preview

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. The preview builds automatically before starting. On Windows, `Start Portfolio.cmd` runs the same preview. Keep the terminal open; Ctrl+C stops it.

## Checks and build

```sh
npm run check
```

This builds the site, runs the tests and verifies the generated pages, local links, images, icons, CV checksums and video byte ranges. `npm run build` alone produces **15 static pages** in `dist/`: two home pages, two project archives, ten case studies and a useful 404 page. Generated HTML, `dist/`, dependencies and verification reports are ignored by Git.

GitHub Actions runs the same checks on pushes to `main` and pull requests. DOM simulations and filesystem/HTTP checks do not establish real browser visuals, GPU performance or physical-phone behavior. Outstanding acceptance work is recorded in `remaining-tasks-review.md`.

## Deploy on Vercel

Import **https://github.com/ThisIsAYMANE/personnal-portfolio** into Vercel. The checked-in `vercel.json` supplies these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root directory | Repository root |
| Install command | `npm ci` |
| Build command | `npm run check` |
| Output directory | `dist` |
| Node.js | 24.x |
| Production branch | `main` |

Enable Vercel system environment variables. Production builds use the real production domain for canonical/share URLs and a sitemap. Preview builds include `noindex` and disallow crawlers. To choose a custom canonical domain, set **`PORTFOLIO_SITE_URL=https://your-domain.example`** in Vercel's production environment and redeploy. This variable must be an HTTPS origin without a subpath. No token or secret is needed by the website.

The deployment serves only `dist/`. Original recordings, Figma files, source notes, tests, development scripts, Git metadata and dependencies are not served. Real HTML routes are retained; there is no catch-all rewrite that turns missing pages into successful home-page responses. Unversioned assets revalidate rather than receiving immutable caching.

See `deployment-preparation.md` for the release review and hosting documentation. Vercel deployment remains a separate action; preparing and pushing this repository does not create a hosted Vercel project.

## Edit the website

| Source | Responsibility |
| --- | --- |
| `src/content.js`, `src/ui-copy.js` | Bilingual content, profile, projects and labels |
| `src/render.js`, `src/routes.js` | Templates, validation and static destinations |
| `styles.css`, `src/config.js` | Design tokens, typography, layout and effect settings |
| `src/controllers.js`, `src/header.js`, `src/cursor.js` | Section transitions, gallery, header and cursor |
| `src/effects/` | Orb renderer, lifecycle and optional video adapter |
| `src/main.js` | Boot, language, motion preferences, dialogs and media |
| `public/media/`, `public/icons/`, `public/cv/` | Optimized project assets, attributed icons and original CV copies |
| `assets/fonts/` | Original display fonts and notices |
| `scripts/`, `tests/` | Build, preview, checks and sharing-card utility |

Rebuild after source edits. `content-schema.md` documents editable data, image variants and video expectations. `motion-map.md` documents choreography. The implementation guide, requirements tracker and review checklist remain available for ongoing work.

## Cleanup archive

Original media, duplicate CVs, Figma packages, old asset generators and historical working notes were removed from this checkout and preserved in the sibling **`../portfolio-archive-2026-10-13/`** directory. Its `archived-paths.json` lists the moved items. This local archive is not part of GitHub or the Vercel build. The website's optimized images/videos, downloadable CVs and required fonts remain in this repository.

Source-code licensing is in `LICENSE`; asset-specific attribution is in `THIRD_PARTY_NOTICES.md` and the original asset notices.
