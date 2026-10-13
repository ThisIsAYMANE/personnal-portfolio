# Portfolio design and implementation guide

Version 1.5 · 13 October 2026 · Uploaded display typography: Rengok + Brogetta Regular

User confirmation: the complete current design is approved. Shape the background glow as an orb or black hole with a dark centre, violet/pink halos, slow swirling light and subtle particles. Adapt the effect for phones and reduced-motion settings. Content for requirements 1–6 is present in the workspace; see `content-inventory.md` for sources and reconciliation notes. Deployment decisions are deferred.

**Employer-focused revision:** The portfolio is intended to help Aymane join a company’s engineering team. Present his contribution, collaboration and growth through each year’s experience; the PFE objective remains February 2027. Historical freelance roles remain factual experience, while current copy invites team opportunities. What I do has four capabilities: Full-stack development; Backend & integrations; DevOps & CI/CD; Quality & test automation. The toolkit includes Kubernetes and Jenkins, for 24 technologies, without inventing production achievements or proficiency scores. See `portfolio-employer-revision-plan.md` for source evidence and acceptance checks.

**Professional headline:** “Software & Systems Engineering Student” / “Élève ingénieur — logiciel & systèmes”. Show the four opportunity areas directly below it: Full-stack; QA & test automation; DevOps; Systems management. Use the broader identity in the hero, metadata and loader; retain the exact ENSIASD Information Systems Management & Governance specialization and historical role names. About and contact copy should explicitly invite opportunities in any of the four areas. This does not change the original CV PDFs or claim a completed engineering degree.

**Revised interaction contract:** Hide the header during meaningful downward scrolling and reveal it during upward scrolling; keep it visible near the top, with keyboard focus and during menu use. Preserve stable anchor/gallery offsets and an immediate reduced-motion alternative. Cursor centre and shape dimensions share one animation owner; disclosures use a local ring, social icons share a stable capsule, and scroll/layout/header movement invalidates stale hover state. The original guide blocks below remain traceable; this revision batch is tracked separately in `portfolio-requirements-tracker.json`.

## 0. Scope and how to use this guide

Create a personal portfolio inspired by the user's reference recording of https://www.redoyanulhaque.me/ and its loading-screen screenshot. Preserve the expressive typography, near-black setting, purple/pink luminous atmosphere, fluid-looking color fields, glowing pointer, scroll reveals, bracketed services, growing career timeline, horizontal featured-work presentation, translucent technology tiles, galaxy-like orb and structured footer.

Remove the character completely. No avatar, face, eye tracking, chair, desk, character rig or character animation is required. The tech-stack orb remains. The hero and services are deliberately recomposed rather than leaving a character-shaped empty gap.

This is a complete proposed specification, not a claim to have extracted the original source code. All measurements, color values, timings, breakpoints, budgets and implementation choices below are proposed starting values. Adjust them through actual desktop/mobile review. The reference's exact typeface, shader, loader exit and mobile behavior were not established by the recording.

Every section below defines a visual choice, interaction rule, implementation responsibility or review criterion. The detail is intended for practical design and development handoff.

Read this document in three ways:

1. For visual design, read sections 1–13 and the section-specific states.
2. For effects and interaction, read sections 14–19.
3. For implementation and review, read sections 20 onward.

The earlier three-pass observations remain preserved in `reference-analysis.md`. The older `website-blueprint.md` is historical and must not override this character-free specification.

### Contents

- [1. Creative direction](#1-creative-direction)
- [2. Information architecture](#2-information-architecture)
- [3. Design tokens](#3-design-tokens)
- [4. Responsive layout](#4-layout-system-and-responsive-rules)
- [5. Atmosphere and layers](#5-global-atmosphere-and-layer-order)
- [6. Loading screen](#6-loading-screen)
- [7. Navigation](#7-navigation-and-persistent-controls)
- [8. Hero without a character](#8-hero-without-a-character)
- [9. About](#9-about)
- [10. Services](#10-services)
- [11. Experience](#11-experience-timeline)
- [12. Featured projects](#12-featured-projects)
- [13. Technology stack](#13-technology-stack)
- [14. JavaScript/WebGL orb](#14-galaxy-orb-recommended-javascriptwebgl-implementation)
- [15. AI-video alternative](#15-alternative-orb-ai-generated-video)
- [16. Cursor](#16-glowing-cursor-and-hover-morphing)
- [17. Motion](#17-motion-system)
- [18. Controls and feedback](#18-buttons-links-panels-and-feedback)
- [19. Contact/footer](#19-contact-and-footer)
- [20. Accessibility](#20-accessibility-and-content-resilience)
- [21. Performance](#21-performance-budgets-and-measurement)
- [22. Architecture](#22-implementation-architecture)
- [23. Edge cases](#23-state-and-edge-case-catalogue)
- [24. Assets](#24-asset-requirements-after-removing-the-character)
- [25. Design handoff](#25-design-deliverables-and-figma-handoff)
- [26. Build order](#26-implementation-order)
- [27. Verification](#27-verification-matrix)
- [28. Metadata/publication](#28-seo-metadata-and-publication-details)
- [29. Print](#29-print-and-export-behavior)
- [30. Decision summary](#30-final-design-decisions)
- [31. Compact implementation brief](#31-compact-implementation-brief)
- [32. Sources](#32-reference-and-source-notes)

### Requirement labels

- **Reference retained:** an observed pattern from the recording or loading screenshot.
- **Proposed adaptation:** a decision that translates that pattern into our character-free, responsive site.
- **Optional:** an enhancement that can be omitted without losing the main direction.
- **Unverified:** something the reference did not establish. Implement our own deliberate behavior instead of inventing a claim about the reference.

### What “optimal” means here

The goal is an impressive site that remains readable, quick to interact with, navigable by touch and keyboard, resilient when effects fail, and economical with network and GPU work. No architecture can guarantee identical performance on every device. Define budgets, measure real behavior and scale decoration to the device while preserving content.

## 1. Creative direction

### 1.1 The overall impression

The page should feel like a calm, luminous digital environment. Most of the screen is nearly black. Light exists in pockets: a lavender cursor, a pink/violet edge wash, a bright timeline endpoint and an atmospheric volume behind the technology grid. Typography is the main subject. Projects and skills provide concrete proof beneath the visual treatment.

The atmosphere should be sophisticated rather than relentlessly animated. Give each section one dominant motion idea. Background movement is slower and lower contrast than interactive movement. Avoid turning every element into an independent floating object.

### 1.2 Preserve these contrasts

| Contrast | Treatment |
| --- | --- |
| Light loader / dark portfolio | Pale opening screen gives way to near-black content |
| Large headings / small labels | Scale difference makes hierarchy visible immediately |
| Soft light / sharp borders | Glows create atmosphere; fine lines organize information |
| Monochrome skills / colorful hover | Brand color becomes a focused interaction reward |
| Freeform background / strict content alignment | Fluid light never substitutes for a layout grid |
| Ambient motion / direct controls | The environment drifts; buttons respond promptly |
| Generous section space / dense project panels | A varied rhythm prevents visual monotony |

### 1.3 Visual mistakes to prevent

- A purple background covering the entire page at full brightness.
- Strong cyan, pink and violet glows competing equally everywhere.
- Generic frosted cards in every section, replacing the reference's varied treatments.
- Role text cropped so severely that a visitor cannot read the profession.
- Body copy too dim to read because the reference used muted text.
- An enormous blank hero where the character used to be.
- An orb placed in front of the technology labels.
- A preloader that intentionally delays an otherwise ready site.
- A desktop screenshot squeezed into a phone screen.
- A cursor effect that intercepts clicks or follows a touch gesture.

## 2. Information architecture

### 2.1 Main page order

1. Optional first-entry loading overlay.
2. Persistent navigation and atmosphere layers.
3. Hero: identity, role and primary contact/work actions.
4. About: a concise professional introduction.
5. Services: what the owner can do and the relevant tools.
6. Experience: reverse chronological career/learning milestones.
7. Featured work: a curated project sequence.
8. Technology stack: the skill grid over the orb.
9. Contact actions.
10. Footer: identity, email/location, social links and credit.

### 2.2 Routes and destinations

- `/`: the complete portfolio experience.
- `/#about`, `/#services`, `/#experience`, `/#work`, `/#stack`, `/#contact`: stable deep links.
- `/works`: optional expanded project archive, included only if there are enough projects to justify it.
- `/works/[slug]`: optional case studies, each with a problem, contribution, outcome and links.
- Résumé: a real PDF download or document URL, not a dead button.
- Contact: a real email link and/or a form that actually works.
- Secondary playful CTA: include only if there is a real destination. Until then, substitute “View projects” or another truthful action.

The visible navigation can stay compact: About, Work, Contact. Services, experience and skills are still reachable by document scrolling and optional footer links. Never create an empty route solely to imitate a reference button.

### 2.3 Content rules

The user's actual name, roles, location, experience, skills and project achievements must replace the reference author's content. Do not inherit claims such as project rankings, first-of-their-kind status or measured results without evidence.

Use one H1 in the hero. Section titles are H2; card and project titles are H3. Decorative oversized role text may duplicate a visible phrase visually, but mark the duplicate as hidden from assistive technology.

## 3. Design tokens

These values define a coherent starting palette. They are not sampled or certified original values.

### 3.1 Color system

| Token | Starting value | Role |
| --- | --- | --- |
| `--bg` | `#09070D` | Main page base |
| `--bg-deep` | `#050408` | Orb/canvas edge and deepest shadows |
| `--surface` | `#141019` | Opaque panel fallback |
| `--surface-hover` | `#21172D` | Elevated/hover state |
| `--text` | `#F2EDF6` | Primary text |
| `--text-secondary` | `#BDB3C8` | Readable description text |
| `--text-muted` | `#9D90AD` | Supporting labels, subject to contrast checking |
| `--lavender` | `#BE91F5` | Buttons, categories, accents |
| `--violet` | `#8643EA` | Orb, timeline, atmosphere |
| `--pink` | `#E384CD` | Occasional light blending |
| `--ice` | `#DCD0FF` | Cursor center and high-energy light |
| `--loader-bg` | `#EBE6EE` | Pale preloader surface |
| `--loader-text` | `#0A080D` | Preloader name and role text |
| `--border` | `rgba(239, 223, 255, .13)` | Fine dividers |
| `--border-strong` | `rgba(239, 223, 255, .34)` | Selected/hovered outlines |

Verify contrast after compositing glows and translucent surfaces. Hex values alone do not establish contrast over a moving background. Labels can be subdued, but essential information cannot be nearly invisible.

### 3.2 Glow hierarchy

| Level | Use | Starting treatment |
| --- | --- | --- |
| Ambient | Broad edge color fields | Large soft gradient, low opacity |
| Local | Skill grid and selected card | Smaller halo, medium opacity |
| Interactive | Cursor, focus-adjacent hover | Bright small center, restrained outer halo |
| Progress | Timeline endpoint | Sharp dot plus two soft rings |

Do not apply all four levels to every object. A button needs a clear surface before it needs a glow. Focus outlines must remain recognizable if the glow is disabled.

### 3.3 Typography

The user's chosen display families are now **Rengok** and **Brogetta Regular**, replacing Dirtyline and Baunk. The actual supplied files were extracted and rendered for visual inspection. Both are high-contrast serif display faces; this gives the portfolio a more editorial direction while retaining the original dark/light, luminous and motion systems.

Keep **Inter or a system sans serif** for body copy, navigation, buttons, forms, technology labels and numerical information. This supporting family is essential for phone readability and the limitations of the supplied Brogetta file.

| Family | Primary assignments | Avoid |
| --- | --- | --- |
| Rengok | Hero name/primary statement, oversized loader role words, principal editorial headings, large footer name | Small paragraph text, dense tool chips, long email addresses |
| Brogetta Regular | Short accent/section headings such as “My Work”, “About” or “Tech Stack”, selected short service titles | Digits in this supplied demo file, percentages, dates, numbered projects, small labels and long paragraphs |
| Inter/system sans | Biography, descriptions, navigation, buttons, chips, full skill labels, dates, project numbers, loading percentage and contact information | Replacing every large display heading and erasing the chosen identity |

Rengok is the primary display voice. Brogetta is the decorative accent. Avoid repeatedly switching fonts within one short heading. Large headings should have a single coherent family; colored emphasis can create variation without adding another face to every word.

#### Verified files and package limitations

- `assets/fonts/Rengok.ttf`: internal family **Rengok**, style **Regular**.
- `assets/fonts/BROGETTA-Regular.otf`: internal family **BROGETTA-Regular**, style **Regular**.
- Neither uploaded archive includes WOFF/WOFF2 files. Do not pretend those files exist.
- In the visual sample, Brogetta's `0123456789` renders as repeated Hanzel Space personal-use warning artwork. Treat that uploaded file as restricted for numeric use. A character can be present in the font and still be a warning glyph; ordinary CSS fallback will not replace it automatically.
- Use a separate sans-serif element/family for the loading percentage, years, copyright date, project numbering and other digits.
- Rengok's digits rendered normally in the inspected sample, but the shared numeric system should remain sans serif for consistency.
- Some letters in Brogetta have decorative star-like details. Let those details read at a large size rather than adding glow directly to every thin stroke.

#### Type scale and spacing

| Style | Desktop starting range | Phone starting range | Family / leading |
| --- | --- | --- | --- |
| Hero display | 80–128 px | 44–64 px | Rengok Regular / 1.06–1.15 |
| Principal section title | 48–76 px | 32–44 px | Rengok Regular / 1.15–1.25 |
| Accent section title | 44–68 px | 30–42 px | Brogetta Regular / 1.15–1.3 |
| Service title | 28–38 px | 24–30 px | Rengok/Brogetta Regular if short / 1.2 |
| Project number | 46–64 px | 32–40 px | Supporting sans 600 / 1 |
| Project title | 22–30 px | 20–24 px | Supporting sans 600 / 1.2 |
| About statement | 24–34 px | 18–22 px | Supporting sans 550–650 / 1.4–1.55 |
| Standard body | 16–18 px | 16–17 px | Supporting sans 400 / 1.55–1.7 |
| Small labels | 12–14 px | 12–14 px | Supporting sans 400–550 / 1.4 |
| Navigation | 13–15 px | 16–20 px in menu | Supporting sans 600 / 1.2 |
| Eyebrow | 12–14 px | 11–13 px | Supporting sans 500 / 1.4 |

Use the actual Regular display weights, approximately CSS `400`, without synthetic bold or italic. Weight ranges in the table apply only to a supporting font that actually supplies those weights.

Begin display tracking around `0` to `-.015em`, then review actual phrases. Do not use the earlier technical-face tracking assumptions for these serif fonts. Supporting uppercase eyebrows can still use `.18em` to `.26em`, and the sans-serif résumé control can use `.20em`.

These are CSS-pixel starting sizes, not measured original sizes. Inspect thin strokes at real phone resolution. Keep display text crisp and primarily off-white; put glow behind the text composition rather than blurring the text itself.

Increase reveal-wrapper padding around capitals, descenders and decorative extents. The earlier tight `.98` leading can clip these faces and should not be copied into the final display rules.

#### Supplied licences and publication status

Both supplied packages include **personal-use-only** notices. They are retained with the fonts rather than replaced by assumptions about the source site's “free” label.

- Rengok's `rengok-license.txt` permits personal-use embedding and format conversion without other font modification. Commercial use requires prior written permission from the author; its examples include promotional/business websites and indirect income. Keep the original name/glyphs, and do not subset or modify without appropriate permission.
- Brogetta's `brogetta-license.pdf` states personal use only and no commercial use, and points to the author's commercial product page. Its package also demonstrates digit restrictions in the actual rendered font.
- For local personal design exploration, retain these files as the chosen visual references. Do not treat them as cleared for a public hiring/client-facing portfolio until applicable permission or commercial/webfont packages are supplied.
- A production font package may differ from these uploaded files. Re-test glyphs, spacing and masks if a full licensed version is substituted.
- Brogetta's notice provides this acquisition link: https://hanzelspace.com/product/brogetta-modern-serif-font/ . The price and current embedding terms have not been checked in this package-inspection step.

This is a record of the supplied notices, not independent legal advice or a purchased licence. No publishing is being performed by this guide update.

#### Local integration example

The following uses the actual prepared file paths. It is intended for a permitted local preview; publication remains subject to the package terms above.

```css
@font-face {
  font-family: "Rengok Display";
  src: url("/assets/fonts/Rengok.ttf") format("truetype");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Brogetta Display";
  src: url("/assets/fonts/BROGETTA-Regular.otf") format("opentype");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
:root {
  --font-display: "Rengok Display", Georgia, "Times New Roman", serif;
  --font-accent: "Brogetta Display", Georgia, "Times New Roman", serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
}
.hero-name, .editorial-title, .loader-role, .footer-name {
  font-family: var(--font-display);
  font-weight: 400;
  font-synthesis: none;
  line-height: 1.12;
}
.accent-title, .stack-title {
  font-family: var(--font-accent);
  font-weight: 400;
  font-synthesis: none;
  line-height: 1.22;
}
.loader-percent, .project-number, .experience-date, .copyright {
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
}
```

These family names are deliberate CSS aliases; they do not rename the actual font file. Match deployment paths to the final asset pipeline. Prefer authorised WOFF2 delivery when available, but do not convert/subset a package unless its permission covers that operation.

#### Desktop and phone verification

1. Review the actual owner's name at 320, 390, 768 and 1440 px.
2. Review the longest accent/service title and let it wrap naturally.
3. Keep large serif titles above their body copy; do not compress text with `scaleX()`.
4. Add mask padding so swashes, descenders and punctuation remain visible throughout reveals.
5. Keep percentages/dates/numbers in the sans-serif family, explicitly avoiding Brogetta warning glyphs.
6. Check required accented characters and punctuation in the actual files. If any character is missing or replaced, use a suitable supporting family for that content.
7. Do not assume Arabic glyph support; choose a compatible Arabic family if that language is required.
8. Re-measure gallery and reveal geometry after fonts settle, and after replacing a demo with a full authorised package.
9. Preload only a critical above-the-fold font. Defer the accent face if its first use is farther down the page.
10. Test failure/fallback fonts, text enlargement and reduced-motion mode before release.


### 3.4 Spacing and shape

Use a shared spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160 px.

- Major section padding: typically 96–160 px desktop, 64–88 px phone.
- Heading-to-content gap: 40–64 px desktop, 24–32 px phone.
- Body paragraph gap: 16–24 px.
- Card interior: 28–40 px desktop, 20–24 px phone.
- Tile radius: 10–14 px.
- Standard button radius: 8–12 px.
- Pill button/chip radius: 999 px.
- Thin divider: 1 CSS px.
- Service corner brackets: 2–3 px strokes, 10–14 px arms.
- Focus outline: at least 2 px, with an offset around 4 px.

### 3.5 Suggested CSS foundation

```css
:root {
  color-scheme: dark;
  --bg: #09070d;
  --text: #f2edf6;
  --text-secondary: #bdb3c8;
  --accent: #be91f5;
  --border: rgb(239 223 255 / 13%);
  --outer-gutter: clamp(20px, 3vw, 56px);
  --content-width: 1280px;
  --header-height: 80px;
  --section-space: clamp(64px, 8vw, 144px);
  --font-display: "Rengok Display", Georgia, "Times New Roman", serif;
  --font-accent: "Brogetta Display", Georgia, "Times New Roman", serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
}
* { box-sizing: border-box; }
html { scroll-padding-top: calc(var(--header-height) + 24px); }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
}
img, video { display: block; max-width: 100%; }
button, input, textarea { font: inherit; }
.container {
  width: min(calc(100% - 2 * var(--outer-gutter)), var(--content-width));
  margin-inline: auto;
}
section[id] { scroll-margin-top: calc(var(--header-height) + 24px); }
:focus-visible { outline: 2px solid #dcd0ff; outline-offset: 4px; }
```

This is a foundation example, not the complete production stylesheet. Use targeted overflow clipping on decorative wrappers. Do not hide all page overflow as a substitute for fixing a layout bug.

## 4. Layout system and responsive rules

### 4.1 Breakpoints

| Mode | Width | Main behavior |
| --- | --- | --- |
| Small phone | 320–479 px | One column, compact menu, vertical projects |
| Large phone | 480–767 px | One column, wider skill grid if labels fit |
| Tablet | 768–1023 px | Select two-column areas, mostly native vertical flow |
| Desktop | 1024–1439 px | Desktop shell; pin gallery only if height permits |
| Wide desktop | 1440 px and above | Capped inner content, generous edges |

Breakpoints are layout decisions, not reliable device classifiers. A large touch device can still need touch-first interaction. Detect hover/pointer capabilities separately.

Use width plus height for elaborate pinning: start with `(min-width: 1024px) and (min-height: 700px)`. A short landscape window should not trap content in a viewport-height stage that cannot fit it.

### 4.2 Outer shell versus inner content

The outer shell holds navigation, side links and edge light. The inner container holds readable content. Keep these systems separate.

At desktop, the social rail sits near the left outer gutter. Main content must leave enough room to avoid passing under its links. The résumé sits near the right outer gutter and lower edge. Reserve real space where necessary; z-index does not solve an overlap.

At phone, move social links and résumé into the menu/footer. Remove fixed edge rails. Keeping them on the sides would consume too much reading width and overlap touch targets.

### 4.3 Height and safe areas

Use `min-height` rather than fixed height for sections containing real text. Let content grow when text wraps, the user zooms or the language changes.

For the opening stage, use a stable small viewport height (`svh`) where supported rather than continuously chasing mobile browser chrome. Use `dvh` selectively for the menu overlay that should fill the currently visible viewport. Account for `env(safe-area-inset-*)` around phone menus and bottom controls. The CSS viewport units differ in their response to browser UI; see [MDN length units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length).

### 4.4 Mobile composition rules

- Preserve the color, type hierarchy, bracket details, orb and hover-equivalent focus states.
- Recompose the gallery and timeline instead of scaling them down.
- Preserve all meaningful content across breakpoints.
- Keep decorative detail quieter around long paragraphs.
- Maintain at least 16 px body text and generous paragraph leading.
- Target 44–48 px interactive hit areas as a project design choice. This is stricter than WCAG 2.2's minimum target rule, which has a 24 CSS-pixel requirement with exceptions; see [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Do not depend on hover for finding a destination, reading a title or seeing a control.

## 5. Global atmosphere and layer order

### 5.1 Composition

Build the atmosphere from two or three overlapping color fields. One is violet, one is soft pink, and an optional third is muted blue-violet. Their movement is slow and slightly different so the mixture changes without appearing to bounce.

The dark center of the page remains usable for copy. Fields can gather near the top-left and right edge, matching the reference's pockets of light. Behind long text, reduce the brightness and preserve a dark reading surface.

### 5.2 Starting light-field values

- Largest field: 45–65vw wide, opacity around .12–.22.
- Secondary field: 25–40vw wide, opacity around .08–.16.
- Phone fields: cap at roughly 420–600 CSS px and reduce overlap.
- Drift: 3–6% of each field's width over 18–30 seconds.
- Scale modulation: roughly .97–1.04 over 22–34 seconds.
- Rotation: unnecessary for ordinary radial fields; useful only for an asymmetric generated texture.
- Use pre-softened radial gradients when possible. A huge animated CSS blur can become expensive.

These are starting values. Inspect over the actual background and do not stack opacities until text becomes washed out.

### 5.3 Proposed layer hierarchy

| Layer | Relative z-index | Notes |
| --- | --- | --- |
| Page background | 0 | Base color |
| Ambient decoration | 1 | Noninteractive, `aria-hidden`, pointer events disabled |
| Section decoration / orb | 2 | Local to its section |
| Editorial content | 10 | Actual readable page |
| Contextual arrows / effects | 15 | Local hover details |
| Header and edge controls | 40 | Above content, readable scrim if needed |
| Cursor companion | 50 | Never intercepts clicks |
| Mobile navigation | 70 | Focus-contained overlay |
| Loading overlay | 90 | Temporary, removable |

Create intentional stacking contexts. A transformed ancestor can change how fixed elements behave. Place the fixed header/cursor near the page root rather than inside an animated gallery wrapper.

## 6. Loading screen

### 6.1 Visual design retained

Full-screen pale lavender surface. Owner name at upper left. Minimal four-bar/dot mark at upper right. Oversized uppercase profession text across the middle, extending beyond the decorative wrapper's edges. Centered black pill overlays this typography.

The pill contains “LOADING”, a numeric percentage and a small white caret/block. A violet edge appears around part of the pill, with a soft shadow beneath. The loader has its own light color scheme; do not let the dark site's text tokens make its identity unreadable.

### 6.2 Desktop specification

- Name inset matches the outer shell gutter.
- Decorative role text: approximately 120–200 px depending on viewport width.
- Pill: approximately 340–440 px wide, 88–116 px high.
- Pill interior uses a flex row with balanced gaps and vertically centered text.
- Percentage column has a reserved width so changing digits do not move the label.
- Numeric text uses tabular numerals.
- Purple edge is a gradient border/pseudo-element, not a full bright rectangular outline.
- Shadow falls downward softly, matching the screenshot's floating focal point.

### 6.3 Phone specification

- Name: 16–20 px, single line if it fits; allow controlled wrapping for a long name.
- Decorative role: 56–92 px; crop only the decorative copy.
- Pill width: `min(320px, calc(100vw - 40px))`.
- Pill height: 72–88 px.
- Loader label/percentage: roughly 18–22 px.
- Keep the pill clear of safe-area insets and browser controls.

### 6.4 State machine

`boot → preparing → ready → exiting → removed`, with a separate `degraded-ready` path for optional asset failure.

- The HTML content must exist independently of the loader.
- Add the loader only when JavaScript is present and decides it is useful.
- Essential readiness should cover the page shell, required font/fallback and first visible composition—not the entire project archive or tech orb.
- Prefer determinate progress only where actual work can be measured. Otherwise use an honest “Preparing” state instead of simulated percentages.
- A fast cached visit can bypass the overlay.
- Provide a graceful timeout: after approximately 2.5–3 seconds without essential readiness, show the readable page with fallbacks. The timeout is a proposed policy, not a measured reference behavior.
- Do not wait for a below-the-fold video or optional shader compilation to unlock the page.
- No artificial minimum wait is required. A brief exit transition may last 300–500 ms if motion is enabled.
- Reduced motion: switch cleanly to the page without large wipe or zoom effects.
- The overlay must not hold a keyboard user in an invisible page or leave scroll locked after an error.

### 6.5 Proposed exit

Fade the oversized decorative typography slightly, then move/fade the pale overlay upward while the hero's name and role enter. Keep the duration short and avoid a bright flash. This transition is newly designed because it was absent from the recording.

## 7. Navigation and persistent controls

### 7.1 Desktop header

Use three independently aligned zones: initials/name mark left, email centered, About/Work/Contact right. Center the email against the viewport, not the leftover width of a flex row.

- Header height: approximately 80–96 px.
- Top/side breathing room follows the outer shell gutter.
- Links: uppercase, medium-bold, compact horizontal spacing.
- Hover: lavender text and optional short underline growth.
- Active section: subtle persistent lavender emphasis, not a large colored tab.
- Add a dark-to-transparent scrim when scrolling content could interfere with legibility.
- The scrim should not look like an opaque heavy navbar unless the background demands it.
- The email is a real email link with a clear accessible name.

### 7.2 Desktop social rail

Reference retained: vertical GitHub/LinkedIn/X/Instagram-style links at the left edge. Use only accounts the owner actually wants to publish.

- Icon size: approximately 18–22 px.
- Hit area: 44×44 px minimum project target.
- Space icons evenly, with a compact continuous group.
- The luminous cursor can expand into a capsule matching the group or individual target.
- On a bright hover fill, icon color switches to dark for contrast.
- Keyboard focus gets a visible outline even if the companion cursor is absent.

### 7.3 Résumé control

Reference retained: dim uppercase “RESUME” with broad tracking and a small document glyph, near the lower right.

- Use readable contrast despite the quieter styling.
- Increase brightness on hover/focus.
- State the actual action: “Download résumé (PDF)” in the accessible name.
- If the PDF opens in a new tab, make that behavior clear.
- Hide the fixed version on smaller widths; place the same destination in the menu/footer.

### 7.4 Phone navigation

Keep initials/name on the left, menu button on the right. Optional compact Contact action can remain if it fits at 320 px.

The opened menu uses a dark surface with restrained edge light, large vertically arranged links, email, résumé and social links. It is a navigation overlay, not a decorative animation playground.

- Menu button exposes expanded state and controls the menu.
- Escape closes it.
- Focus enters the menu and returns to the opener when closed.
- Background interaction is disabled while open.
- Body scroll locking is paired with reliable restoration.
- Link selection closes the menu, then navigates to the section without leaving the page locked.
- If implemented with a dialog, use a correct dialog pattern and verify focus behavior.

## 8. Hero without a character

### 8.1 New composition

Keep the reference's identity-left/role-right relationship, but make typography the focal subject. Place a quiet central violet/pink light field behind the gap between columns. It should hint at depth without becoming a second tech-stack orb.

The central space can contain a thin orbital arc, a subtle luminous vertical accent, or simply a composed gradient. Default to the simpler gradient and typography. Do not add an unrelated 3D object merely to fill space.

### 8.2 Desktop layout

- Min-height around one stable viewport, with at least 680 px where available; content can grow.
- Inner layout: a 12-column grid.
- Identity occupies columns 1–5.
- A modest visual breathing zone occupies columns 6–7.
- Role statement occupies columns 8–12.
- Align both text groups near a shared vertical center rather than at unrelated heights.
- Small introductory line: “Hello, I'm” or a suitable personal greeting in lavender.
- Owner name: bold, readable, potentially two lines for long names.
- Role eyebrow: a short “An”/“A” or better wording suited to the actual profession.
- Primary role: bright large text.
- Secondary role: slightly smaller or lavender; can overlap decorative role copy, but not obscure its readable counterpart.
- Primary CTA: “View my work”. Secondary CTA: “Contact me”.
- A small “Scroll to explore” cue near the bottom, with a restrained line/arrow.

### 8.3 Phone layout

- One column; greeting, name, role, supporting sentence, actions and scroll cue in that order.
- Keep large name and role distinct, with enough gap for legibility.
- Ambient center light shifts behind the lower part of the role rather than behind every paragraph.
- Actions wrap or stack at narrow widths; each retains a large hit area.
- Avoid a forced viewport height if it pushes the primary actions below the fold on short phones.
- No custom cursor and no hover-dependent text.

### 8.4 Entry and exit

Entry with motion enabled: greeting fades first, name follows through a small vertical mask, role follows, actions settle last. Starting durations: 450–700 ms, stagger around 70–100 ms, translation no more than 20–28 px.

Exit on desktop: fade/translate decorative role copy as About approaches; actual identity should not become unreadable before the user has passed it. Ambient light can drift left to create continuity into About. On phone, use native flow with a short reveal and no prolonged hero pin.

### 8.5 Long-content safeguards

- A long name wraps naturally; it is not horizontally scrolled.
- Role phrases can wrap onto two or three lines.
- Avoid auto-rotating profession text if it distracts or hides essential information.
- Any decorative repeated role words are nonessential and can crop; the H1 remains complete.

## 9. About

### 9.1 Composition

The original placed the avatar left and biography right. Our adaptation uses a large quiet title/keyword composition on the left and the biography on the right. The left can show “ABOUT” in a restrained oversized outline or a short positioning statement. It should not compete with the actual paragraph.

- Desktop split: roughly 40/60 or 45/55.
- About eyebrow: lavender uppercase, tracked.
- Intro paragraph: one strong 60–110-word statement, rather than a dense life history.
- Follow with at most two shorter paragraphs or a small fact row if needed.
- Keep the copy measure around 45–65 characters for ordinary paragraphs; a bold statement may be narrower.
- Optional facts: location, focus, availability. Only include accurate information.

### 9.2 Reveal

Use a wrapper that masks a small upward text movement while opacity rises. The final state must expose the entire paragraph. Avoid per-word animations on long paragraphs; they increase complexity and make reading harder.

Proposed sequence: eyebrow, lead paragraph, supporting copy/facts. Use 60–90 ms staggering between blocks rather than between every word.

Phone: left decoration becomes a small heading above the paragraph. No two-column mask that clips the text in a narrow viewport. Reduced motion and no-JavaScript modes show all copy normally.

## 10. Services

### 10.1 Composition without a desk

Keep the large uppercase “WHAT I DO” heading and the bracketed panel language. Use a desktop two-column layout: oversized heading/short statement on the left, service panels on the right. Place a quiet pink/violet light field behind the left heading to preserve depth.

The heading may sit partially behind a decorative ring or light edge, but actual letters remain readable. Do not recreate the desk silhouette with a meaningless blank object.

### 10.2 Panel anatomy

Each service contains:

1. Number or small category label, optional.
2. Service title.
3. One-line subtitle.
4. A short description of what the owner delivers.
5. “Skillset & tools” caption.
6. Tool chips.
7. Expand/collapse control with square outline and chevron.

The panel uses a 1 px dashed border, with solid corner brackets. Adjacent panels can share a visual divider but must retain separate semantic controls.

### 10.3 Active and compact states

| Property | Expanded | Compact |
| --- | --- | --- |
| Title | Full brightness | Still readable |
| Subtitle | Visible, muted | Visible |
| Description | Fully shown | Hidden from layout and interaction |
| Tools | Visible and wrapping | Hidden |
| Chevron | Points upward | Points downward |
| Border | Slightly brighter | Quieter |

Use a real button for the expandable title/control. `aria-expanded` and `aria-controls` identify the relationship. Collapsed links must not remain focusable behind clipping.

### 10.4 Scroll behavior and interaction priority

The reference changes service emphasis while scrolling. Preserve that visual rhythm by highlighting the panel nearest the reading zone. Manual expansion must take priority over automatic behavior.

Default proposal: all content remains available through explicit accordions; scroll updates emphasis, not forcibly closes a panel someone is reading. If desktop auto-expansion is added, stop auto-switching after the user clicks or focuses a panel until they leave the section. Never fight keyboard or touch input.

Use short 180–260 ms expansion transitions. Height animations are limited to this user-triggered area, with careful measurement; avoid large scroll-scrubbed layout-height changes that destabilize section positions.

### 10.5 Phone version

- Heading above panels.
- One full-width panel per row.
- Title/button target spans the width.
- Description uses 16–17 px body text.
- Chips wrap with 6–8 px gaps.
- Never make chips into buttons unless they perform an action.
- Keep first panel expanded initially if it helps communicate substance.
- Do not add sticky multi-screen service stages on phones.

## 11. Experience timeline

### 11.1 Content structure

Use actual reverse chronological milestones. The top may be “Now”, followed by years or date ranges. Each row has role/title, context/category, date and a concise description.

Group related roles when necessary; a long career should not become dozens of animated screens. Initial target: four to six meaningful milestones.

### 11.2 Desktop geometry

Use one shared grid across all rows, not independent flex layouts:

- Role/category column: about 30%.
- Date column: about 15%.
- Divider/progress gutter: about 8–10%.
- Description column: remaining width.

The date aligns independently from a role that wraps. Row spacing is generous, approximately 56–88 px. A two-line title must not push its date out of alignment.

Heading uses a softer/lighter weight and can wrap into “My career &” / “experience”, with the second phrase violet. This is one of the reference's quieter title treatments.

### 11.3 Progress effect

Two layers create the line: a dim full-length baseline and a bright foreground line revealing downward. The foreground ends with a small violet dot and soft halo.

Compute progress relative to the timeline content bounds and the viewport reading zone, not the entire document. Clamp to 0–1. The dot stays inside the line's bounds. Revealed rows reach full readable brightness; upcoming rows may appear dimmer but should not be inaccessible or permanently unreadable.

Avoid using color alone to indicate chronological position. Dates and document order already communicate it.

### 11.4 Phone geometry

Move the line to the left. Give each row a date/role block followed by the description. The content uses the remaining width, with about 24–32 px between the line and text.

Year text becomes 24–32 px rather than a desktop-sized 60 px. Keep the category below the role. Use a local dot or short marker if a long glowing endpoint would collide with text.

Reduced motion: show the completed line and all rows normally, without progress-dependent dimming.

## 12. Featured projects

### 12.1 Reference treatment

Retain the mixed white/purple “My Work” heading, leading-zero numbering, thin horizontal/vertical dividers, alternating artwork placement, title/category alignment, small tool descriptions and diagonal link indicators.

Use original project artwork. Do not reuse the reference author's project covers or claims.

### 12.2 Project information

Each project has title, category, one or two sentences about the problem/result, tools, cover image and one clear primary destination. Optional separate source/demo links can appear beneath the summary.

The original's “Tools and features” label can be retained, but actual project value should be clearer than a bare technology list. Explain what was built and what the owner contributed.

### 12.3 Desktop pinned track

- Heading is inside a stable gallery stage above the track.
- The track is a horizontal flex/grid row with no wrapping.
- Panel starting width: `clamp(380px, 39vw, 620px)`.
- Artwork uses a consistent approximately 16:9 ratio.
- Panel interior padding: 32–40 px.
- Fine vertical rules separate panels.
- Odd panels: metadata first, artwork later.
- Even panels: artwork first, metadata later.
- The final panel is a centered archive CTA with real destination.
- The clipped neighboring panel suggests continuation.
- All text must fit the available stage height. If it does not, use the ordinary vertical layout instead of hiding content.

### 12.4 Three phases

1. **Entrance:** stage scrolls into view in normal document flow.
2. **Hold:** stage pins and vertical scrolling translates the track left.
3. **Exit:** after the track reaches its end and final action is visible, pin releases; skills appear below.

Horizontal distance is `max(0, track.scrollWidth - viewport.clientWidth)`. Compute after fonts/images and on relevant size changes. Do not hard-code distance from the reference's video timestamps.

Use a linear mapping from normalized scroll progress to track translation. Optional scrub settling can be around .2–.35 seconds, but stop overshoot at the endpoints. Avoid forced snapping as the default; it can fight touchpad/keyboard intent.

### 12.5 Phone and short-window version

Default to a vertical list of project cards. This preserves native scrolling, readable descriptions and discoverable links. Keep the alternation as small visual variety if useful, but do not reorder the semantic reading sequence unpredictably.

An optional touch carousel is acceptable only if it exposes controls and position, supports swiping/keyboard and does not steal vertical gestures. The vertical list is the preferred first implementation.

### 12.6 Hover, focus and links

- Artwork can scale subtly to 1.025–1.04 inside its clipped wrapper.
- Diagonal-arrow badge fades/moves in by at most 6–8 px.
- Keyboard focus makes the badge visible too.
- On touch, keep the link affordance visible without hover.
- Avoid nesting links inside a panel-wide anchor. Choose either one whole-card link or separate clearly marked links.
- A blank project cover has an attractive neutral placeholder without a broken-image icon.
- Set image dimensions/aspect ratio before loading to avoid layout shifts.

## 13. Technology stack

### 13.1 Composition

The skill grid sits in front of the luminous orb, not beside it. The center glow is broad and transparent enough that icons and labels remain the subject.

Retain the inverted-pyramid desktop composition when the content fits. The reference uses rows of 12, 10, 8, 6, 4 and 2. That does not require the owner to claim 42 skills. Use actual skills and a suitable taper, such as 8/6/4/2 for 20 items.

### 13.2 Tile specification

- Desktop tile: approximately 72–88 px wide and 82–100 px tall.
- Tablet tile: 68–80 px wide, with flexible grid layout.
- Phone tile: use a responsive grid with minimum useful label width rather than shrinking to tiny squares.
- Gap: 8–12 px desktop, 8–10 px phone.
- Surface: dark violet translucent fill; subtle border.
- Radius: 10–14 px.
- Icon: 24–32 px, consistently centered.
- Label: 11–13 px, readable, with complete name where possible.
- Background orb must not wash out the label.
- Idle icon: muted by opacity/desaturation, without erasing recognizable silhouettes.
- Hover/focus: original icon color, brighter border and modest local glow.
- Lift: no more than 3–4 px; no dramatic tilt required.

### 13.3 Phone grid

Use three or four columns according to usable width and label lengths. Keep DOM order logical by category or relevance. The orb sits behind the central portion of the grid; it can be cropped softly at the sides.

Do not force the full desktop triangle onto a phone. The preserved elements are the luminous volume, translucent tiles, icons, labels and interaction polish.

### 13.4 Links and labels

Skills do not have to link anywhere. A decorative skill tile can be plain content. If it links to documentation or a related project, use a real link and communicate its destination. Do not make 42 decorative tiles keyboard stops without purpose.

Supply text names independently of icons. Avoid relying on tooltips for the full label on a touch device. If the skill inventory is long, group it by Languages, Frameworks, Data/AI, Tools/Platforms; use a visually quiet category legend rather than an elaborate filter interface unless filtering is useful.

### 13.5 Section reveal

Heading fades/slides in first; grid rows reveal in a short upward stagger. Suggested row stagger: 40–70 ms, total entrance under about 600–800 ms. The orb is visible as atmosphere before/during the reveal but never blocks it.

The orb continues to animate when the user holds the scroll position. When reduced motion is active, show a still luminous background and fully visible tiles.

## 14. Galaxy orb: recommended JavaScript/WebGL implementation

### 14.1 Feasibility and choice

Yes, the orb can be made procedurally in the browser. JavaScript controls the canvas, parameters, timing and lifecycle; a small GLSL shader performs the pixel rendering through WebGL. No downloaded character, sphere model or video is required.

The recommended version creates the impression of a luminous volume using a low-cost projected sphere, noise, haze, lines and particles. It does not require a physical fluid simulation, complex ray marching, a physics engine or a large 3D asset. The optical impression matters more than simulating real water.

Start with one local canvas for the tech-stack section and CSS gradients for the rest of the page. Avoid a full-screen renderer running throughout the entire scroll if it only contributes to one section.

### 14.2 Orb anatomy

| Layer | Visual job | Relative prominence |
| --- | --- | --- |
| Outer haze | Blends into page; establishes broad violet volume | Wide, faint |
| Nebula body | Soft uneven purple/pink clouds | Medium |
| Core | Pale lavender concentration behind upper/middle tiles | Small, controlled |
| Surface structure | Faint latitude/longitude or distorted curved lines | Very low contrast |
| Orbit traces | A few curved arcs giving rotational depth | Intermittent |
| Particles | Sparse dots/streaks outside and within the orb | Tiny and quiet |
| Edge vignette | Removes any rectangular canvas boundary | Invisible transition |

The core must not look like a white spotlight shining through labels. Its maximum intensity should be constrained by the tile readability review. Most pixels stay dark.

### 14.3 Placement and sizing

- Local section wrapper is positioned relative and isolated from neighboring stacking contexts.
- Canvas is absolutely positioned behind the grid, with `pointer-events: none` and `aria-hidden="true"`.
- Desktop visible light field width: roughly 850–1150 CSS px, capped by the section container.
- Orb's structural sphere: around 55–70% of that field width.
- Light center: horizontally centered; vertically around the upper-middle of the skill grid.
- Phone: field width around 110–135% of the grid width, softly clipped by its decorative wrapper.
- The grid controls section height. The canvas must not set the document's content height.
- Reserve the final canvas aspect ratio immediately to prevent a size jump after initialization.
- The bottom two skill rows can sit beyond the brightest core, as in the reference.

### 14.4 Starting parameters

| Parameter | Desktop | Phone / reduced quality |
| --- | --- | --- |
| Core radius | 0.16–0.24 of normalized field | 0.18–0.25 |
| Structural sphere radius | 0.52–0.62 | 0.52–0.62 |
| Noise octaves | 4 | 2–3 |
| Domain-warp strength | .10–.18 | .06–.12 |
| Cloud drift speed | .018–.035 units/sec | .012–.024 |
| Structure rotation | One slow cycle / 35–60 sec | Slower or still |
| Visible particles | 24–48 | 8–16 or none |
| Mesh emphasis | Low, around .035–.075 | .025–.05 |
| Pointer displacement | 6–12 CSS px max | Disabled on touch |
| Color-shift cycle | 18–30 sec | 24–40 sec or still |
| Resolution scale | 0.7–1.0 | 0.55–0.8 |
| Effective DPR cap | 1.5 initially | 1.0 initially |

These are independent controls, not one global “intensity” slider. They are proposed tuning ranges and must be validated on actual devices.

### 14.5 Color field recipe

1. Begin with the exact local page background, or transparent output over that background.
2. Evaluate a broad radial envelope centered behind the skill grid.
3. Use low-frequency smooth noise to break the envelope's symmetry.
4. Mix deep violet toward softer lavender inside brighter patches.
5. Add pink as a minority color in a second drifting field.
6. Keep any blue-violet contribution subdued and localized.
7. Add a small soft core using a second tighter radial falloff.
8. Apply the outer envelope again so noise cannot light up the canvas corners.
9. Keep the result bounded; additive layers must not exceed the intended brightness.
10. Review through the actual tile surfaces, not on a blank canvas alone.

### 14.6 Fluid-looking motion recipe

Domain warping creates the visual suggestion of colors flowing into one another:

```text
uv = aspect-corrected coordinates centered on the orb
q.x = smoothNoise(uv * lowFrequency + slowTimeVectorA)
q.y = smoothNoise(uv * lowFrequency + slowTimeVectorB)
warped = uv + warpStrength * (q - 0.5)
cloud = fractalNoise(warped * mediumFrequency + slowTimeVectorC)
color = mix(violet, lavender, remap(cloud))
color = mix(color, pink, smallSecondaryCloudAmount)
color *= radialEnvelope(uv)
```

This is rendering pseudocode, not a complete shader. Use smooth noise with stable derivatives. Avoid high-frequency noise crawling rapidly across the screen; it reads as static interference rather than fluid light.

The time vectors should have different directions and small speeds. If every layer rotates identically, the result looks like a spinning texture. If every layer changes rapidly, it looks unstable. Give the image a coherent slow flow.

### 14.7 Projected sphere and mesh

A simple sphere illusion can be built from screen coordinates without a 3D mesh:

```text
p = centered coordinates / sphereRadius
inside = dot(p, p) <= 1
z = sqrt(max(0, 1 - dot(p, p)))
normal = vec3(p.x, p.y, z)
rotatedNormal = slowRotationMatrix * normal
longitude = atan(rotatedNormal.x, rotatedNormal.z)
latitude = asin(clamp(rotatedNormal.y, -1, 1))
grid = softenedPeriodicLines(longitude, latitude)
```

Render only the visible front surface and soften the sphere edge. Use the mesh at very low opacity. The grid should become discoverable on closer inspection rather than appearing like a neon cage.

Anti-alias lines using appropriate smoothing/derivative support for the chosen WebGL context. Test shader compatibility; do not assume every optional extension is present. A mesh-less haze fallback still preserves the main visual identity.

### 14.8 Particle and streak recipe

Use a small precomputed set of particles with stable seeds. Particle positions should not be randomly rebuilt each frame.

- Distribute more near the orb and fewer at the outer edges.
- Fade particles in/out over their cycle rather than popping into existence.
- Most particles are tiny dots. Only a few become short streaks.
- Streak direction varies slightly, suggesting orbital/diagonal movement.
- Avoid stars behind small text labels at high brightness.
- Use pale lavender/gray rather than fully saturated pink for most particles.
- Reuse buffers and batch drawing where practical.
- Remove particles first when lowering quality; keep the broad light field.

### 14.9 Pointer response

On hover-capable devices, normalize pointer position within the tech-stack wrapper to -1…1. Smooth this input and move the light center by a small amount. Optional mesh tilt can be a few degrees.

The orb never follows the pointer around the whole screen. Its location stays anchored to the grid. Leaving the section gently returns the offset to zero. When the pointer enters a skill tile, the tile response should dominate over background movement.

On touch, disable tracking. Do not map page swipes to orb dragging. A slowly animated background already provides the intended atmosphere.

### 14.10 Rendering lifecycle

`uninitialized → static-ready → preparing → animated → paused`, with `failed → static-ready` as an error path.

- Render a CSS/static poster first so the section is already visually complete.
- Initialize the renderer near the viewport, not during the opening loader.
- Compile once; create reusable geometry/buffers once.
- Start animation only while the section is near/inside view and page visibility allows it.
- Pause when offscreen, the document is hidden, the user disables motion or reduced motion is selected.
- Resize only when the local container actually changes size.
- On context loss, keep the poster visible; recreate if appropriate, or remain static.
- Dispose buffers, programs and observers when the component is removed.

Intersection Observer is useful for visibility-triggered work, while ResizeObserver tracks local size changes. Use them rather than doing every check on every pointer/scroll event. [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

### 14.11 Quality adaptation

Estimate actual render cost over sustained samples, not a single delayed frame. Document visibility changes, shader initialization and scroll-trigger refreshes can distort measurements.

Suggested policy:

1. Start on a conservative quality tier.
2. After a warm-up, observe renderer frame-time distributions while the orb is visible.
3. If sustained renderer work is too expensive, reduce render resolution first.
4. Then remove streaks/particles.
5. Then reduce noise octaves and mesh detail.
6. If animation still interferes with interaction, use the static fallback.
7. Do not oscillate between tiers; add a cooldown and preferably only downgrade within a session.

Rendering fewer pixels and respecting client hardware limits are practical WebGL optimization strategies. Treat device-pixel ratio as a quality choice, not a requirement to render every decoration at full physical resolution. [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

### 14.12 Orb acceptance criteria

- No visible canvas rectangle at any supported viewport width.
- The sphere stays round rather than stretching with aspect ratio.
- The central glow never destroys label contrast.
- Motion feels continuous when scrolling stops.
- No obvious noise jumps or particle popping.
- Pointer response is subtle and limited to appropriate devices.
- Tab hiding/offscreen motion does not continue unnecessarily.
- Failure produces an attractive still section, not a blank patch.
- Low-quality rendering keeps the same palette and composition.

## 15. Alternative orb: AI-generated video

### 15.1 When to use video

Choose video if a generated/rendered nebula provides a significantly better visual result than the procedural shader and the compressed asset fits the loading budget. Video can be art-directed precisely, but it adds network weight, codec choices, cropping work and autoplay/fallback behavior. It cannot react to the pointer internally unless additional transformations are applied to the whole video.

Do not assume video always performs better or worse than WebGL. Decode cost, file size, resolution, hardware and shader complexity matter. Compare both on the same target phones before choosing.

### 15.2 Production brief

Create an ambient decorative loop only. It must contain no text, icons, UI, human, desk, watermark or audio. Use the portfolio's dark/violet/lavender/pink palette. Keep the brightest light in the center, leave edges almost black and preserve a broad soft silhouette suitable for the skill grid.

Starting production targets:

- Duration: 8–12 seconds.
- Frame rate: 24–30 fps.
- Source aspect ratio: 16:10 or 16:9, with generous crop margins.
- Desktop delivery: around 960–1280 px wide initially.
- Phone delivery: around 480–720 px wide if testing supports it.
- Fixed camera, no zoom, no large translation.
- Smooth loop; first/last frame composition and motion must match.
- No abrupt flash, burst, hard cut or high-frequency flicker.
- Fine lines are subtle enough to survive compression.
- Background near `#09070D`; actual encoding may shift blacks, so use edge masking rather than relying on a perfect color match.

### 15.3 Generator prompt

> A seamless looping ambient nebula orb for the background of an elegant dark developer portfolio. Fixed camera. A broad, softly glowing spherical volume centered in frame, deep violet haze blending fluidly with lavender and restrained rose-pink light. Pale lavender core with controlled brightness, delicate curved spherical mesh lines barely visible within the haze, sparse tiny drifting particles and occasional faint orbital light streaks. Very slow coherent motion, colors mixing like smooth translucent liquid, refined and understated. The orb occupies the central two-thirds of the composition with wide nearly black margins matching a near-black violet website background. Soft edges dissolve completely into darkness. No text, no symbols, no interface, no person, no character, no furniture, no watermark, no sound, no camera movement, no explosion, no flashing. Preserve the same centered composition throughout and make the ending flow naturally into the beginning.

This prompt is a creative specification, not a guarantee that a generator will produce a seamless loop. Inspect the generated result, trim or loop-edit if needed, and reject artifacts that compete with labels.

### 15.4 Video integration

Use a local decorative wrapper behind the grid, with no pointer events. Provide an optimized poster derived from a good frame. Keep the poster visible until playback has genuinely started.

Use `muted`, `loop` and `playsinline`; remove audio from the file itself. Treat `play()` as fallible and handle its rejected promise. Do not force fullscreen or show default controls for this decorative background. A separate site motion control can pause it.

Delay attaching video sources until near the section, with the selected resolution determined before loading where possible. `preload="none"` is not a guarantee of zero fetching in every autoplay configuration, so lifecycle control should explicitly decide when sources are attached. See [MDN video element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video).

Offer appropriate supported formats, such as MP4 and WebM, without requiring both versions to download. Do not replace the video with an animated GIF. Video is generally a more efficient delivery format than animated GIF for this kind of loop. [web.dev video guidance](https://web.dev/articles/replace-gifs-with-videos)

### 15.5 Edge blending

- Place a dark radial/elliptical mask over the outer edge.
- Add a gentle vertical fade if the video reaches another section.
- Test a black mismatch on OLED/bright LCD displays; compressed blacks can create a visible rectangle.
- Do not apply heavy blur to the entire full-resolution video if an already softened source will work.
- `object-fit: cover` is suitable only after checking that the orb remains centered at narrow ratios.
- For a phone, consider `contain` within a larger masked decorative layer instead of cropping away the whole sphere.

### 15.6 Loop review

Play at least five consecutive loops. Watch for a jump in core position, a particle teleport, color discontinuity, fading to black or a brightness pulse at the boundary. Compare the first and last frames and also the apparent direction/velocity of movement.

A crossfade can hide a small seam, but two overlapping decoded videos can increase cost. Prefer editing a true loop before adding runtime complexity.

### 15.7 Decision table

| Criterion | Procedural orb | Video orb |
| --- | --- | --- |
| Initial network weight | Code/shader only; no mandatory media | Poster and eventually video bytes |
| Art direction | Parameter-driven, requires shader tuning | Highly detailed source possible |
| Pointer response | Direct and controllable | Whole-layer movement only by default |
| Responsive shape | Adapts to local canvas | Requires crop/size variants |
| Sustained cost | GPU shader work | Video decode/compositing |
| Failure fallback | CSS/static poster | Poster/CSS |
| Repeat seam | Procedural time can be continuous | Must produce a good loop |
| Preferred first choice | Yes | Alternative after measured comparison |

Do not initialize both live versions simultaneously. Choose one renderer mode through configuration and keep the same poster/section layout around it.

## 16. Glowing cursor and hover morphing

### 16.1 Enablement

Enable only when hover and a fine pointer are present, motion is permitted and the user has not disabled effects. Width alone is not enough. A touchscreen laptop and a mouse-connected tablet may expose mixed input capabilities.

Keep the native pointer visible by default, matching the recording. The companion effect provides atmosphere; it is not required to operate the site.

### 16.2 Default appearance

- Core: pale lavender/white fill.
- Diameter: roughly 22–30 CSS px, selected by visual review.
- Outer halo: about 16–28 px around the core, low opacity.
- Position: fixed at root level; translate from its center.
- Pointer events: disabled.
- Hidden from accessibility APIs.
- Fade in after the first valid pointer movement.
- Fade out when pointer leaves the document or the window loses focus.
- Return to its default state when an active target is removed.

### 16.3 Motion math

Use frame-rate-independent smoothing:

```text
alpha = 1 - exp(-deltaSeconds / responseTime)
current = current + (target - current) * alpha
```

Starting response time: .07–.12 seconds. Clamp large delta time after tab resume. Pointer events update targets; the animation loop updates transforms. Do not create a new animation tween for every pointer event.

Cache hover-target geometry while stable. Re-measure on scroll/resize or target change, not by reading layout repeatedly on every animation frame.

### 16.4 State table

| State | Shape | Surface / behavior |
| --- | --- | --- |
| Default | Small circle | Pale core, violet halo |
| Navigation | Small ring or softer circle | Lower opacity so text stays readable |
| Social group | Rounded vertical capsule | Bright lavender fill, dark icons above it |
| Project image | Ring/circle with arrow affordance nearby | Does not cover project title |
| Button | Soft capsule related to target bounds | Limited halo, label remains above effect |
| Text selection/input | Hidden or very faint | Native interaction stays clear |
| Menu open | Disabled by default | Menu focus and contrast take priority |
| Reduced motion | Hidden | Native pointer only |

The social capsule should be implemented as a shared hover surface behind the icon group where needed. A root-level cursor painted above icons cannot also paint behind them without careful coordination. Use a local rail background and let the companion circle fade/morph into that state.

### 16.5 Watery movement

Use a subtle stretch based on pointer velocity, with limits such as 1.0–1.15 scale along the movement axis and a compensated smaller cross-axis scale. Rotate the stretch toward movement direction and settle back when speed drops.

This can suggest viscosity without simulating fluid. Excessive wobble or permanent lag makes the effect feel imprecise. Keep the glow soft and the visible center compact.

### 16.6 Interaction safety

- Never attach click handlers to the cursor layer.
- Do not hide native pointer over inputs, selection or browser controls.
- No follower on touch; no simulated ball chasing the user's finger.
- Hover exit reverses cleanly even when the pointer moves quickly across many targets.
- Labels stay readable under every state.
- The cursor stops drawing when inactive; an invisible perpetual loop is unnecessary.

## 17. Motion system

### 17.1 Separate clocks

Use three inputs: scroll progress, pointer state and elapsed visible time. They must not overwrite one another's transforms or state.

Example: a skill tile has a reveal wrapper controlled by scroll and an inner tile controlled by hover. The orb is a separate layer controlled by time/pointer. Do not use three unrelated libraries to write `transform` on the same element.

### 17.2 Timing tokens

| Token | Starting duration | Use |
| --- | --- | --- |
| Immediate color response | 100–160 ms | Hover/focus color |
| Small control movement | 160–220 ms | Arrow/chevron |
| Accordion | 180–260 ms | User-triggered expansion |
| Reveal | 400–650 ms | Heading/paragraph entry |
| Loader exit | 300–500 ms | Brief scene handoff |
| Row stagger | 40–90 ms | Tiles/small content groups |
| Cursor smoothing | 70–120 ms time constant | Pointer companion |
| Ambient drift | 18–34 sec | Background color fields |

Use ease-out for entering content, ease-in-out for slow ambient motion, and linear mapping for scroll-scrubbed travel. Do not apply easing twice to the gallery's scroll progress unless the resulting lag is deliberate.

### 17.3 Suggested scroll/reveal map

| Element | Trigger idea | Motion |
| --- | --- | --- |
| Hero decorative role | About approaches | Dim, move a short distance |
| About eyebrow/copy | Section enters reading zone | Mask reveal and small upward translation |
| Service brackets | Panel enters | Fade/stroke emphasis |
| Active service | Reading position or user action | Border/opacity emphasis; explicit expansion |
| Experience row | Row approaches lower-middle viewport | Rise 12–20 px, reach readable opacity |
| Timeline | Timeline passes reading zone | Extend line and move endpoint |
| Work stage | Fits below header | Pin and translate track |
| Stack heading | Section enters | Short reveal |
| Stack rows | Grid enters | Small stagger |
| Footer blocks | Footer approaches | Subtle reveal, no long pin |

Do not make every reveal replay whenever one pixel crosses a threshold. For ordinary reading content, reveal once per visit or maintain a stable progress state. Reverse scrolling should not make already-read paragraphs disappear unpredictably.

### 17.4 Native scrolling

Use the browser's native document scrolling. Do not replace the whole page with wheel interception or a transformed scroll container. The reference's smooth presentation can be achieved through controlled animations without forcing a custom scroll engine.

If GSAP is used, keep it focused on the pinned gallery and coordinated sequences. Its ScrollTrigger supports pinning and scroll-linked animation; use current `gsap.matchMedia()` for responsive setup/cleanup rather than the deprecated ScrollTrigger-specific method. [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [gsap.matchMedia documentation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/)

### 17.5 Layout measurement and resizing

- Build natural layout before creating scroll triggers.
- Reserve image dimensions before images load.
- Refresh gallery distances after fonts become ready and images affect layout.
- Debounce/coalesce resize work, but never leave a stale orientation layout.
- Destroy old responsive pinning before creating a different layout mode.
- Avoid `content-visibility: auto` on pinned sections whose dimensions the animation system needs to measure; this can interfere with ScrollTrigger measurement. [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- Keep anchor navigation offsets aware of the fixed header and pinned gallery stages.

### 17.6 Reduced motion and an effects control

Provide a quiet “Motion on/off” control in the menu/footer. Default respects the operating system preference. User selection can be remembered locally.

With motion off:

- No cursor follower.
- No continuous color drift or orb animation.
- No video autoplay.
- No pinned horizontal gallery; show vertical projects.
- No large mask/translation reveals; content is already visible.
- Timeline line is complete.
- Hover/focus colors remain useful without movement.
- Loader uses a simple appearance/disappearance.

Respecting reduced-motion preferences and offering control is supported by accessibility guidance. [web.dev motion guidance](https://web.dev/learn/accessibility/motion)

For continuously moving decoration presented alongside content, provide a pause/stop mechanism rather than assuming reduced-motion detection alone covers every visitor's needs. See [W3C Pause, Stop, Hide guidance](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

## 18. Buttons, links, panels and feedback

### 18.1 Primary button

Lavender fill, dark text, modest radius, rightward arrow. Starting height 48–54 px, horizontal padding 20–28 px. The label uses medium weight. Hover slightly brightens the fill; the arrow can shift 3–4 px. Focus outline remains separate from its fill.

Disabled only when an action is genuinely unavailable. A disabled contact button is worse than showing a working email link.

### 18.2 Secondary button

Dark translucent surface, fine outline, off-white text. Hover gains a subtle purple edge/glow, not the same full lavender fill as primary. Keep the hierarchy distinct.

### 18.3 Text links

Footer links have a fine underline and diagonal arrow. Header links can omit the underline until hover/focus. In paragraphs, links should be identifiable without relying on a tiny color difference.

External links opening in new tabs use appropriate relationship attributes and communicate the behavior where needed. Avoid a visual arrow that falsely suggests a new tab if the link simply jumps within the page.

### 18.4 Focus and press states

Every interactive component has idle, hover where applicable, focus-visible, active/pressed and disabled/loading states where relevant. Touch press feedback is brief and does not require movement. Do not remove focus outlines to imitate a screenshot.

### 18.5 Loading/error feedback

If contact submission exists, show an actual sending state, success message and recoverable error message. Do not reset the user's entered text on failure. A background orb error does not require a alarming message to the visitor; show the static fallback silently.

## 19. Contact and footer

### 19.1 Closing actions

Retain the side-by-side dark secondary and lavender primary actions above the footer. Primary should be a real hiring/contact action. Secondary can be a real project/archive or playful destination.

- Desktop centered row, 16–24 px gap.
- Phone: two equal flexible buttons if labels fit; stack below approximately 360 px or with longer labels.
- Generous space above separates skills from contact.
- A small contact sentence may explain availability without adding unnecessary UI.

### 19.2 Footer layout

Large uppercase owner name, then three columns:

1. Public email and location.
2. Actual social profile links.
3. Credit and copyright.

Use a fine top/bottom rule only where it helps define the end of the page. The footer is calmer than the tech stack. Edge glow can persist, but the orb fades away above it.

Phone columns become vertically stacked groups with consistent 24–32 px gaps. Owner name wraps naturally. Résumé appears as an ordinary footer link. Add motion control here if not already visible in the menu.

### 19.3 Contact method

For a first release, a reliable email link may be sufficient. If adding a form, provide visible labels, email field, message field, validation and an actual sending service. Do not create a form that only simulates success. No authentication page is required by the reference.

### 19.4 Credit and privacy

Use truthful attribution for code/design and third-party assets. Do not automatically claim the owner personally designed/developed everything if that is inaccurate. Public contact details must be supplied deliberately. Analytics are optional; avoid adding scripts without a purpose.

## 20. Accessibility and content resilience

### 20.1 Readability

Target WCAG AA text contrast: generally 4.5:1 for normal text and 3:1 for qualifying large text. Test over the brightest background state, not only the idle dark surface. See [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

The muted reference style is inspiration, not permission to dim essential text beyond readability. If a halo reduces contrast, darken the tile/reading surface instead of simply making its text glow harder.

### 20.2 Semantic structure

- Landmarks: header/navigation, main, footer.
- One H1; logical heading order.
- Skip link at the start.
- Real anchors for navigation, real buttons for actions.
- Decorative orb, cursor, particles and duplicate typography hidden from accessibility APIs.
- Meaningful project images have useful alt descriptions; redundant decorative art can have empty alt.
- Skill names exist as text even if icon SVGs fail.
- No essential information contained only in canvas/video.

### 20.3 Keyboard use

- Tab order follows the meaningful document order.
- Focused project links must be visible even in the desktop gallery. On keyboard focus entering an offscreen panel, either reveal the panel correctly or switch/reveal an accessible vertical presentation. Test this explicitly; do not assume transforms make focus usable.
- Service expansion uses Enter/Space on buttons.
- Menu can be opened/closed and navigated without a mouse.
- Focus indicators never disappear beneath the cursor effect.
- Escape closes only dismissible overlays, not arbitrary site content.

### 20.4 Zoom and text growth

Check 200% text enlargement and 400% browser zoom/reflow in an appropriate desktop viewport. Use the mobile/vertical layout when effective width/height cannot fit pinned stages. Avoid fixed card heights containing arbitrary text.

Descriptions and labels must tolerate longer content and localized wording. Test a long name, long role and wrapped buttons before declaring the design complete.

### 20.5 Motion and failure modes

The complete content must be visible with motion disabled, WebGL unavailable and video blocked. With JavaScript disabled, use a plain but polished page without a loader, hidden text or blank gallery.

Accessibility is part of the composition: focus, readability and touch behavior should look intentional rather than like an unrelated emergency mode.

## 21. Performance budgets and measurement

### 21.1 Experience targets

Use Core Web Vitals as outcome targets: LCP no more than 2.5 seconds, INP no more than 200 ms and CLS no more than .1 at the 75th percentile, evaluated separately for phone and desktop traffic. These are published thresholds, not guaranteed results for this proposed site. [web.dev Core Web Vitals](https://web.dev/articles/vitals)

A beautiful loader is not an excuse for making meaningful content appear late. A high Lighthouse score alone does not prove smooth scrolling on a real phone. Lab measurements cannot substitute for actual interaction and field behavior.

### 21.2 Proposed transfer budgets

| Resource | Initial target | Strategy |
| --- | --- | --- |
| Critical HTML + CSS | Around 80–140 KB compressed combined | Static/pre-rendered content, restrained CSS |
| Initial application JavaScript | Prefer around 100–150 KB compressed or less | Split effects; avoid whole-app hydration if unnecessary |
| Initial fonts | Prefer around 60–120 KB total | Necessary subsets and weights only |
| Above-the-fold decorative media | None required | CSS fields, typography |
| Project cover | Often 80–180 KB each | Responsive optimized images, measured quality |
| Orb poster | Prefer 30–80 KB | Smooth gradients compress well; inspect banding |
| Optional desktop orb video | Aim around 1–3 MB for the loop | Deferred; choose quality by visual review |
| Optional phone orb video | Aim under roughly 1–1.5 MB | Smaller variant, never mandatory for content |

These are project budgets, not standards. A justified exception needs measured benefit and review. Do not force a quality-destroying encode simply to meet a number, and do not load every image/video on entry.

### 21.3 Runtime budget

- Aim for smooth 60 Hz interaction where the device supports it; do not assume every display is 60 Hz.
- Keep cursor and scroll calculations lightweight.
- Use transform and opacity for common movement.
- Avoid repeated layout reads followed by writes in the same frame.
- Avoid an animated large blur on every tile.
- Keep WebGL drawing to the local section bounds and a conservative resolution.
- Pause offscreen effects and background-tab work.
- Allow lower-quality ambient animation rather than slowing controls.
- When motion must be reduced for performance, preserve the palette and composition in the static state.

### 21.4 Loading order

1. HTML, critical CSS and readable fallback typography.
2. Navigation and semantic sections.
3. Required font files, without unnecessarily hiding text.
4. Small interactive controls.
5. Scroll enhancements for supported layouts.
6. Project imagery as it approaches view.
7. Orb implementation/poster/video near the tech-stack section.
8. Optional archive/case-study resources only when needed.

Do not preload a decorative orb video at the expense of the main content. Optimize the main content's loading path before optional decoration. [web.dev LCP guidance](https://web.dev/articles/optimize-lcp)

### 21.5 Image handling

Create responsive widths for project art, for example 480, 800 and 1200 px where useful. Supply `srcset`/`sizes` consistent with the actual card widths. Set dimensions/aspect ratio. Lazy-load images outside the initial viewport; do not lazy-load a true above-the-fold LCP image if one is later introduced. [MDN image element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img)

Use a solid color or lightweight placeholder with the correct aspect ratio. Avoid a large blurred placeholder that is almost as heavy as the final image. Confirm text inside cover art remains readable if that text is important; preferably do not rely on tiny text embedded in an image.

### 21.6 Measuring effects

Record performance while using the menu, expanding services, scrolling the gallery and hovering the skill grid. Measure with the orb on and off. A static page-load score can miss sustained GPU cost.

Inspect at least one midrange Android phone and one iPhone, including sustained scrolling for several minutes. Emulation helps layout review but cannot faithfully represent battery, thermal limits or hardware decoding.

Check background behavior: switching tabs should pause decorative work. Use the Page Visibility API to coordinate this. `requestAnimationFrame()` provides display-synchronized callbacks, but explicit lifecycle cleanup remains necessary. [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

## 22. Implementation architecture

### 22.1 Recommended foundation

A portfolio with mostly static content does not require a large client-side application. Prefer statically generated or server-rendered HTML with CSS and small JavaScript modules. Use a framework only if it helps the actual project; do not make all paragraphs and images depend on hydration.

Suggested responsibilities:

- HTML/templates: semantic content and usable links.
- CSS: layout, tokens, surfaces, gradients, ordinary hover/focus and static fallback.
- Small JavaScript modules: menu, accordions, motion preference, cursor.
- Optional GSAP/ScrollTrigger module: desktop pinning and coordinated scroll sequences.
- Dedicated orb module: raw WebGL or a small renderer chosen for the actual visual requirements.
- Optional video renderer: interchangeable with the procedural orb through one interface.

No character/3D-model library is needed. A full 3D scene engine is optional, not a prerequisite for the orb. Choose the smallest approach that remains maintainable; raw WebGL has more setup responsibility, while a renderer library can simplify lifecycle work at some bundle cost.

### 22.2 Proposed project organization

```text
src/
  content/
    profile.json
    services.json
    experience.json
    projects.json
    technologies.json
  components/
    Header.*
    MobileMenu.*
    SocialRail.*
    ResumeLink.*
    Loader.*
    Hero.*
    About.*
    ServicePanel.*
    ExperienceTimeline.*
    ProjectGallery.*
    ProjectCard.*
    TechnologyGrid.*
    OrbBackground.*
    ContactActions.*
    Footer.*
  styles/
    tokens.css
    base.css
    layout.css
    components.css
    motion.css
    reduced-motion.css
  effects/
    motion-preference.js
    cursor.js
    reveal.js
    gallery.js
    timeline.js
    atmosphere.js
    orb/
      controller.js
      renderer-webgl.js
      renderer-video.js
      quality.js
      shaders/
        orb.vert.glsl
        orb.frag.glsl
  utilities/
    observers.js
    lifecycle.js
    math.js
public/
  images/projects/
  images/orb/
  videos/orb/
  icons/
  fonts/
  resume.pdf
```

The extension `.*` means the component format depends on the selected build system. This is an organization proposal, not a requirement to create dozens of empty files before implementation.

### 22.3 Shared configuration

Use one explicit configuration for animation thresholds and renderer choice. Avoid scattering unexplained constants throughout components.

```js
export const effectsConfig = {
  orbMode: "webgl", // "webgl", "video", or "static"
  cursor: { enabled: true, responseSeconds: 0.09, diameter: 26 },
  gallery: { minWidth: 1024, minHeight: 700, scrubSeconds: 0.25 },
  orb: {
    desktopDprCap: 1.5,
    compactDprCap: 1,
    desktopNoiseOctaves: 4,
    compactNoiseOctaves: 2,
    maxPointerOffset: 10,
  },
};
```

Configuration still passes through device capability, viewport and motion preference checks. A true `enabled` flag never overrides a user's motion-off setting.

### 22.4 Content schemas

Profile fields: display name, initials, primary role, secondary role, introduction, about paragraphs, location, public email, résumé URL, social destinations and availability text.

Service fields: stable ID, title, subtitle, description, tools and initial expanded state. Optional service number is generated from order.

Experience fields: stable ID, title, category, start/end dates or display year, description and ordering metadata. Do not sort human strings like “NOW” as if they were years.

Project fields:

```json
{
  "id": "project-one",
  "slug": "project-one",
  "title": "Project title",
  "category": "Web application",
  "summary": "The problem solved and your contribution.",
  "technologies": ["Technology A", "Technology B"],
  "cover": "/images/projects/project-one.webp",
  "coverAlt": "A useful description of the project's interface",
  "href": "/works/project-one",
  "demoUrl": null,
  "sourceUrl": null,
  "featured": true
}
```

Technology fields: stable ID, full label, icon path, original brand color, category and optional destination. Do not infer a skill solely because an icon is available.

Keep content separate from visual order calculations. This lets projects be added without breaking numbering or alternation.

### 22.5 Orb interface

Every renderer mode should expose the same conceptual lifecycle:

```text
prepare(container, config)
resize(width, height, quality)
setPointer(normalizedX, normalizedY)
setMotionAllowed(boolean)
setVisible(boolean)
renderStill()
start()
pause()
dispose()
```

The static mode can make most methods no-ops while maintaining layout. The surrounding section should not know whether a shader or video provides the light.

### 22.6 Motion preference resolution

Proposed precedence:

1. User's explicit choice for this site.
2. Operating system reduced-motion preference.
3. Default motion-enabled mode with conservative quality.

Separate motion preference from performance quality. A low-end device may show a slowly moving low-resolution orb; a high-end device with reduced motion should show a still orb.

Listen for OS preference changes during the session. Local preference storage can fail or be unavailable; default gracefully. No login or account is needed for a motion preference.

### 22.7 Progressive enhancement

Default CSS must show readable content. Only hide/reposition a reveal element after its controller has been successfully prepared. If initialization throws, clear the enhancement marker and show the final state.

For the gallery, the base layout is vertical. Desktop enhancement introduces the horizontal track and pinning only after measurements and capability checks succeed. Teardown returns to the base layout.

For services, use accessible disclosure markup or reliable button behavior; if JavaScript is unavailable, show service content rather than locking it closed forever.

### 22.8 Cleanup rules

- Every event listener has an owner and teardown.
- Every observer is disconnected when no longer needed.
- Every animation loop has a cancellable handle.
- Every media-query setup restores the previous layout before rebuilding.
- Every initialized shader/buffer has a disposal path.
- Every scroll lock has a paired unlock, including error paths.
- Re-entering a section must not create duplicate renderers or observers.
- Returning through browser back/forward navigation must not leave a stuck loader.

## 23. State and edge-case catalogue

| Situation | Required result |
| --- | --- |
| Fast cached opening | Page can skip loader; hero remains complete |
| Slow network | Text usable quickly; optional effects arrive later |
| Font fails | Fallback font fits without major overflow |
| WebGL unavailable | Static orb and normal skills |
| WebGL context lost | Poster stays visible; no broken content |
| Video autoplay denied | Poster stays visible; no repeated rejection loop |
| Missing project image | Correct-sized attractive placeholder |
| Empty project list | Omit gallery and corresponding dead navigation |
| One project | Normal project section, no long horizontal pin |
| Few skills | Smaller balanced grid; no invented filler skills |
| Long project summary | Content fits; choose vertical layout if pin height fails |
| Very short desktop window | Vertical gallery and readable sections |
| Rotate phone | Menu/layout remain usable; no stale fixed dimensions |
| Mouse connects/disconnects | Cursor capability reevaluated sensibly |
| User switches motion off | All continuous effects stop; content remains visible |
| User switches motion on | Effects prepare once and resume appropriately |
| Menu opened mid-scroll | Stable overlay; background does not move unexpectedly |
| Anchor points to Work | Heading/content reached below header |
| Anchor points below pinned Work | Destination reached without an incorrect offset |
| Browser back restores scroll | No unsolicited jump to hero |
| Keyboard enters hidden gallery panel | Focused panel becomes visible or vertical mode is used |
| Contact send fails | Message preserved; clear retry/email alternative |
| JavaScript disabled | Complete readable page; no blocking loader |
| Printing | Static content; no pinning/canvas needed |

Do not treat these as hypothetical warning screens. Most should be handled quietly through good defaults and fallbacks.

## 24. Asset requirements after removing the character

### 24.1 Required from the owner before personalization

- Name, initials and actual role titles.
- Preferred language and palette confirmation.
- Short introduction/about text or CV from which to draft it.
- Real services and skill list.
- Experience milestones and dates.
- Project descriptions and destinations.
- Public email/social links.
- Résumé PDF if the download action is included.

Placeholders can start the design while content is prepared. No 3D character, rig, seated animation, furniture model or portrait is required.

### 24.2 Visual assets

| Asset | Recommended delivery | Needed for |
| --- | --- | --- |
| Project covers | Landscape PNG/JPG/WebP/AVIF masters, preferably 1200 px+ wide | Actual work showcase |
| Brand mark | SVG if available; initials can be generated | Header/favicon |
| Technology icons | Optimized SVGs with source/license record | Skill tiles |
| Display fonts | Rengok and Brogetta authorised production files; supplied demo originals retained for permitted preview | Main and technical display typography |
| Supporting font | Inter or system sans; limited licensed WOFF2 weights if self-hosted | Body and functional text |
| Orb poster | Optimized still image, or CSS fallback | Renderer failure/reduced motion |
| Orb video | Only if video route is selected | Alternative atmosphere |
| Social preview | 1200×630 image with readable title | Link sharing |

Do not source generic stock “projects” as if they were the owner's work. A decorative project cover can be generated, but the actual project description and outcome remain truthful.

### 24.3 Naming and provenance

Use descriptive names such as `project-dashboard-cover-1200.webp`, not `final-final-new2.png`. Store source links, licenses and attribution requirements in an asset manifest. Keep unoptimized masters separately from delivery files.

### 24.4 No media required for these effects

The cursor, background color fields, border brackets, timeline line, tile glow, scroll reveals and loader can all be built with CSS/JavaScript. The procedural orb requires only code and optional fallback art.

## 25. Design deliverables and Figma handoff

### 25.1 Frames to design

Create representative frames at widths 1440, 1024, 768, 390 and 320 px. Use content-driven heights for full-page designs. Add a short-landscape view to expose pinning problems.

For each primary width, show at least:

- Loader.
- Hero.
- About.
- Services with one expanded/one compact panel.
- Experience.
- Projects in the relevant desktop/phone mode.
- Skills with orb.
- Contact/footer.
- Open mobile menu where applicable.

### 25.2 Component variants

Buttons: primary/secondary, idle/hover/focus/pressed/loading where needed.

Navigation links: idle/hover/active/focus.

Service panels: expanded/compact/focus.

Project panels: image-first/text-first, hovered, focused, missing image.

Skill tiles: idle, colored hover/focus, noninteractive.

Cursor: circle, ring, social capsule, button target, hidden.

Orb: animated visual target, static fallback, reduced-quality target.

Menu: closed/open/focus state.

### 25.3 Motion annotations

Static mockups cannot prove the full interaction. Annotate entry/hold/exit states, trigger rules, duration ranges, layer order and responsive differences. For the gallery, show first, middle and final track positions rather than only one attractive card arrangement.

For the orb, use a visual still in the design tool and link to a browser prototype for actual motion. Do not claim that a Figma blur is the production renderer.

### 25.4 Handoff packet

Deliver tokens, component states, screen frames, content schema, asset manifest, motion map, responsive rules and review checklist. This guide already defines those categories; actual frames/prototypes are a later deliverable.

## 26. Implementation order

### Phase 1: readable structure

Build semantic sections, content data, navigation, real destinations, responsive grids and footer. Use no continuous animation yet. Verify phone reading order and long content.

Exit criteria: complete readable page at 320, 390, 768, 1024 and 1440 px; links work; no unintended horizontal page overflow.

### Phase 2: shared visual system

Apply palette, typography, spacing, borders, bracket details, button hierarchy and static light fields. Add project art and skill icons.

Exit criteria: the static page already looks intentional and close to the reference's visual language without an orb/cursor doing all the work.

### Phase 3: controls and responsive behavior

Implement menu, service expansion, motion preference, focus states and real contact behavior. Check input modes and scroll restoration.

Exit criteria: mouse, keyboard and touch complete all primary actions.

### Phase 4: scroll choreography

Add reveal wrappers, experience line progress and desktop gallery pinning. Keep native/vertical fallbacks. Recheck anchors, resizing and reverse scroll.

Exit criteria: entrance/hold/exit works without jumps; hidden content never traps focus.

### Phase 5: atmosphere and cursor

Add local orb renderer, conservative quality, visible-time lifecycle, cursor states and subtle ambient flow. Compare with effects disabled.

Exit criteria: effects improve appearance without undermining readability or interaction; offscreen work stops.

### Phase 6: loader and final polish

Add the optional loader only after readiness is understood. Tune microinteractions, card proportions, heading line breaks, orb colors and responsive spacing.

Exit criteria: loading is honest and short; no incomplete content is hidden behind a permanent overlay.

### Phase 7: performance/accessibility/release review

Measure real-device behavior, compress assets, verify metadata and all destinations, and complete the checklist below.

Exit criteria: documented measurements, resolved important defects and a publishable site with reliable fallbacks.

## 27. Verification matrix

### 27.1 Viewports

| Test size | Key purpose |
| --- | --- |
| 320×568 | Small-screen wrapping and touch targets |
| 360×800 | Common compact phone composition |
| 390×844 | Main phone design review |
| 430×932 | Larger phone spacing |
| 768×1024 | Tablet portrait |
| 1024×768 | Desktop threshold and tablet landscape |
| 1280×600 | Short window; pinning must fall back |
| 1440×900 | Main desktop design review |
| 1920×1080 | Wide layout and outer controls |
| 2560×1440 | Capped content and restrained visual scale |

These are sample test sizes, not a list of every device supported. Also drag-resize between them to discover intermediate failures.

### 27.2 Browser/input review

- Chromium desktop with mouse and trackpad.
- Firefox desktop.
- Safari desktop when available.
- Safari on a real iPhone.
- Chrome on a real midrange Android phone.
- Keyboard-only flow.
- Touch without hover.
- Reduced motion enabled before load and toggled during use.
- JavaScript disabled.
- WebGL disabled/unavailable or simulated context loss.
- Video blocked or playback rejected.

### 27.3 Visual checks

- Palette coherent from loader to footer.
- Heading hierarchy varied but consistent.
- Content margins and fixed controls align deliberately.
- No visible rectangle around orb/video.
- No glow makes labels unreadable.
- No key heading/role text is unintentionally clipped.
- Service corners/dashed borders align at joins.
- Tool chips wrap without overlap.
- Experience years line up independently of wrapped roles.
- Gallery artwork ratios and panel padding are consistent.
- Partial next panel appears in desktop hold state.
- Tech rows are balanced for the actual skill count.
- Footer name, columns and actions fit at every mode.

### 27.4 Motion checks

- Reveal reaches final state even with fast scrolling.
- Reverse scroll does not hide necessary content abruptly.
- Pin does not begin before the stage fits below the header.
- Gallery final panel can be read before release.
- Resizing after gallery entry updates its travel distance.
- Timeline dot remains in bounds.
- Cursor transitions exit correctly on fast pointer movement.
- Cursor does not obscure text selection or controls.
- Orb movement continues at held scroll position.
- Orb and ambient layers stop when motion is off.
- Menu opening pauses distracting pointer behavior.
- Tab resume does not produce an enormous delta-time jump.
- Loader cleanup always unlocks the page.

### 27.5 Content/action checks

- Owner identity and roles correct.
- Experience dates accurate.
- Project claims and contributions accurate.
- Every project/demo/source link valid.
- No placeholder destination survives launch.
- Résumé is current and downloads/opens as intended.
- Email link uses the intended public address.
- Footer profiles match header/menu profiles.
- Contact form success corresponds to actual delivery if a form exists.
- Asset licenses/attribution tracked.
- Motion preference is remembered without requiring an account.

## 28. SEO, metadata and publication details

- Descriptive page title using the owner's name and actual role.
- Concise meta description explaining the work offered.
- Canonical URL once the domain is known.
- Social preview title/description/image with readable text.
- Favicon/initials mark that remains recognizable at small sizes.
- Main content available in HTML, not only after running a shader or animation.
- Meaningful project URLs if case studies exist.
- Sitemap for actual public routes.
- Correct language attribute.
- No copy of the reference author's identity in metadata.
- A useful not-found page if extra routes exist.
- No analytics, font or icon requests that are unnecessary for the chosen design.

Use HTTPS hosting, proper MIME types for fonts/video and reasonable static-asset caching. Keep content updates possible without editing shader code. Do not share secrets in front-end code if a contact service is added.

## 29. Print and export behavior

Add a print stylesheet that removes cursor, loader, animated backgrounds, pinned track transforms and fixed rails. Show project cards and experience in normal document flow. Use dark text on a light page for economical readable printing. Preserve important destinations as links where the print workflow supports them.

Printing is not the primary experience, but it is a useful check that the content has a coherent structure independent of decoration.

## 30. Final design decisions

| Decision | Default chosen for this guide |
| --- | --- |
| Character | Removed entirely |
| Display typography | Rengok primary + Brogetta Regular accent; supplied files personal-use-only |
| Body/functional typography | Inter or system sans for readability |
| Hero replacement | Editorial typography plus ambient light |
| Main atmosphere | CSS gradient fields |
| Tech-stack orb | Procedural JavaScript/WebGL, local canvas |
| Orb alternative | Deferred AI-generated/rendered video with poster |
| Orb fallback | Static gradient/poster with the same palette |
| Scrolling | Native document scrolling |
| Desktop projects | Pinned horizontal track where width/height permit |
| Phone projects | Vertical list |
| Custom cursor | Hover/fine-pointer devices only |
| Service interaction | Explicit accessible disclosure; scroll emphasis secondary |
| Motion preference | OS-aware, user override available |
| Loader | Optional, readiness-driven, never blocks optional effects |
| Content rendering | Static/pre-rendered HTML wherever practical |
| Visual fidelity | Preserve composition/effects; improve readability and mobile flow |

## 31. Compact implementation brief

Build a premium, character-free personal portfolio with a near-black violet base, off-white typography, lavender accents and restrained pink/violet light. Start with a pale optional loading overlay containing oversized decorative role typography and a black percentage pill. Use fixed desktop navigation with left initials, centered email, right section links, a left social rail and lower-right résumé. On phones, use a compact menu and move edge controls into menu/footer.

Use Rengok for primary serif display typography and Brogetta Regular for short decorative accent headings. Use Inter/system sans for body copy, controls and all numbers. The supplied Brogetta file renders warning artwork in place of digits. Match real weights, verify mobile masks and glyph coverage, and follow the supplied personal-use notices and production-permission requirements in section 3.3.

The hero uses large identity/role typography and ambient light instead of an avatar. About copy reveals through a subtle mask. Services use oversized “WHAT I DO” typography and dashed panels with corner brackets, tool chips and accessible expanded states. Experience uses reverse chronological aligned rows and a purple progress line with luminous endpoint. Featured projects form a bordered alternating image/text horizontal track that enters, pins, translates and releases on suitable desktops; phones use vertical cards. Skills use translucent labeled tiles, muted idle icons and brand-color hover/focus states, arranged in a tapered desktop grid and readable mobile grid.

Behind skills, render a local galaxy-like orb: soft violet haze, restrained pink/lavender mixing, a controlled core, faint spherical mesh and sparse drifting streaks. Use JavaScript/WebGL with conservative adaptive quality, or a deferred muted seamless video if measured/art-directed results justify it. Always provide a static fallback. Add a luminous pointer companion that eases and morphs over social/button targets only on fine-pointer devices. Keep time-driven ambient animation, scroll-driven movement and pointer-driven feedback separate.

Finish with a real primary contact action, secondary work/play action only if its destination exists, large owner name and a three-column footer. Preserve content and actions with reduced motion, blocked media, missing WebGL or no JavaScript. Tune real-device performance, keyboard use, touch targets, contrast and responsive layout before release.

## 32. Reference and source notes

Visual evidence is the user-supplied recording and loading screenshot, with findings retained in `reference-analysis.md`. The public reference is [Redoyanul Haque's portfolio](https://www.redoyanulhaque.me/).

Technical recommendations were checked against the official documentation linked next to the relevant claims. Numerical palette, sizing, timing, shader parameters and transfer budgets are our proposed defaults and remain subject to implementation review. The guide is a design/build specification; it is not a completed website, an executed performance test or a guarantee of matching an unknown original renderer.
