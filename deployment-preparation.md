# Vercel deployment preparation

Prepared on 13 October 2026 for the user's GitHub repository:
https://github.com/ThisIsAYMANE/personnal-portfolio

## Import settings

Import the repository into a Vercel project, using main as the production branch and the repository root as the root directory. vercel.json defines Other / npm ci / npm run check / dist. package.json selects Node.js 24.x.

Only dist is published. The build emits 15 static pages, required CSS/modules, original fonts and notices, attributed icons, optimized images/videos and unchanged CV copies. Vercel serves the emitted 404.html for missing routes; no SPA fallback is required.

## Domains and previews

Enable access to Vercel's system environment variables. Production builds use VERCEL_PROJECT_PRODUCTION_URL, falling back to VERCEL_URL. Set PORTFOLIO_SITE_URL to an actual HTTPS origin to override the canonical domain. Local builds invent no public URL or placeholder sitemap.

Preview/development builds on Vercel emit noindex metadata, Disallow: / in robots.txt and no sitemap. Production builds with a real domain generate absolute canonical, bilingual alternate and sharing-image URLs plus a 14-page sitemap. Preview noindex also applies if a production origin override is set.

## Verification before release

npm run check runs the static build, automated tests and 15-page verification; Vercel runs it before accepting the build. Check the actual deployment's EN/FR navigation, case studies, home anchors, project videos and seeking, CV downloads, social links and 404 status. Review the orb, cursor and scrolling on real desktop and phone browsers. Existing manual acceptance tasks remain in remaining-tasks-review.md; no simulation is recorded as a browser/device pass.

All unversioned files use revalidation rather than long immutable caching. The site needs no runtime service, database or secret. Contact uses the real email/social links; no form or analytics service is selected.

Repository preparation and GitHub push do not provision a Vercel project. A hosted URL is confirmed only after an actual successful Vercel deployment.

## Provider references

- [Build configuration](https://vercel.com/docs/builds/configure-a-build)
- [vercel.json](https://vercel.com/docs/project-configuration/vercel-json)
- [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [System environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)
- [Static custom 404 page](https://vercel.com/kb/guide/custom-404-page)
