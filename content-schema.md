# Portfolio content and asset schema

`src/content.js` is the editable source for both the website and generated Figma content snapshots. `src/ui-copy.js` owns translated control/status wording and the professional headline/four-area opportunity line. `src/routes.js` validates source content and generates stable routes. Run the build after content changes.

| Source | Required structure / responsibility |
| --- | --- |
| `contact` | Real public email plus supplied LinkedIn, GitHub, Instagram and WhatsApp URLs |
| `copy.en`, `copy.fr` | Matching translated sections, availability, services, experience, education, footer and accessibility labels |
| `servicesList` | Arrays of `[title, subtitle, description, toolNames[]]`; tools are labels, not false buttons |
| `experienceList` | `[yearOrNOW, organisation, role, dateLabel, description, growth?]`; optional sixth string explains learning. Ongoing comes first, dated entries descend numerically |
| `educationList` | `[dateLabel, institution, degree]` with real supplied information |
| `projects` | Unique lowercase slug `id`, real name/year, bilingual title/summary/details/role/status/category, technologies, contributions/features, cover/gallery, optional video and optional HTTPS repository |
| `skills` | Unique technology-name tuples mapped to attributed real SVGs; the old second text-mark field is retained for compatibility and is not rendered |
| `public/asset-manifest.json` | Sources, derivatives, dimensions/hashes/bytes, usage, licences and restrictions |
| `public/icons/icon-manifest.json` | Pinned upstream source, local SVG, licence, brand color and dark-fill treatment |
| `public/media/video-manifest.json` | Encoded user media, duration, size and front-loaded MP4 metadata |
| `public/routes.json` | Generated route/language/page/project manifest |

The validator checks profile name/email/HTTPS contact URLs, duplicate/invalid project slugs, required bilingual fields, a cover/technology list, HTTPS repositories, valid four-field capability rows and five/six-field experience rows. A nonempty growth string requires the translated `growthLabel`. All timeline text is escaped during rendering. Schema changes must update rendering/validation together. The build creates two home pages, two archives, ten real case studies and the not-found page.

The current narrative targets company engineering teams and recruiters. Four capabilities make full-stack, backend/integrations, DevOps/CI/CD and quality/test automation visible. There are 24 technology skills plus four social logos. Requested Kubernetes/Jenkins toolkit entries do not rewrite historical project stacks or imply production achievements. Preserve actual dates/status, academic specialization and the February 2027 PFE objective; both CVs stay unchanged.

The broader headline is Software & Systems Engineering Student, with Full-stack, QA/test automation, DevOps and Systems Management directly below. Unsupported accents/punctuation and Brogetta’s defective U+2014 em dash use explicit Georgia fallback; numeric UI stays sans. Font binaries are never edited to correct these display issues.

Source manuscripts, source recordings and the original CVs remain outside the delivery directory. The web CVs are unchanged copies. The accepted CIH naming/dates and Briquin stack decisions are preserved in the local archive’s `content-inventory.md`; no invented performance/security metrics or public staging deployments have been added.

## Asset changes

For an existing master cover or screenshot, regenerate responsive derivatives with the archived `scripts/prepare-responsive-assets.py` after restoring its source inputs to a working copy. Every referenced image needs matching 480/800/1200 WebP variants and reserved dimensions. Keep original assets separately. Do not rerun the older `prepare_assets.py` over optimized videos without reviewing it: that preparation script copies source recordings before the later optimization/fast-start stages.

Project videos remain user-triggered. New recordings must be checked for playback, silence where appropriate, aspect ratio, seeking and front-loaded metadata before replacing delivery media. Do not rename a restricted font, alter its glyphs, or subset it to hit a budget; replace a font only with a permitted package and repeat glyph/layout review.
