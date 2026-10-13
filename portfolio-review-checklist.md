# Remaining browser, device and editor review

Local build/filesystem/HTTP/DOM-simulation evidence is in `.analysis/local-verification.json` and `.analysis/test-results.tap`. The checks below are **pending**, because no browser or Figma editor is available in this session. No viewport or GPU result is inferred from a PNG design preview or a DOM mock.

## Viewport matrix — both English and French

| Viewport | Required review | Result |
| --- | --- | --- |
| 320 × 568 | Name, pill, French wrapping, body copy, touch targets | Pending |
| 360 × 800 | Compact phone flow and footer actions | Pending |
| 390 × 844 | Phone Figma comparison; orb/tile contrast | Pending |
| 430 × 932 | Larger phone spacing and skills | Pending |
| 768 × 1024 | Tablet structure and native projects | Pending |
| 1024 × 768 | Pin eligibility based on actual fonts/content fit | Pending |
| 1280 × 600 | Short-window vertical projects | Pending |
| 1440 × 900 | Desktop Figma comparison, first/middle/final gallery | Pending |
| 1920 × 1080 | Outer controls, reading width and atmosphere | Pending |
| 2560 × 1440 | Content cap, restrained scale and rails | Pending |

Drag-resize between samples and rotate a phone. Inspect swashes/descenders throughout reveals, service corner joins, chip wrapping, independently aligned timeline dates, neighboring-project cue, tile taper, footer fit, canvas edges and safe areas. Enlarge text to 200% and check 400% browser zoom/reflow. Record actual screenshots, browser/device/version, input mode, motion/quality mode and defects.

## Input and behavior

The employer revision is implemented locally. In addition to the original matrix, review EN/FR recruitment copy, five learning statements, four capability panels and the 24-tool grid at every affected width. New local evidence is `tests/employer-revision.test.mjs`; actual browser results remain pending.

- Chromium mouse/trackpad; Firefox; Safari desktop where available.
- Real iPhone Safari and a real midrange Android Chrome device; touch has no hover requirement.
- Keyboard-only skip/menu/service/gallery/case/language/CV/contact flow; check modal entry/return and focus in transformed cards.
- Connect/disconnect a mouse on mixed-pointer hardware; verify cursor capability updates.
- Fast/reverse scrolling: content remains revealed, timeline stays in bounds, gallery releases after its final read interval.
- Interrupt service animation repeatedly; manual reading emphasis remains respected.
- Open menu mid-scroll, use Escape, navigate to Work and below Work, restore browser back/forward.
- Move pointer rapidly between navigation, social rail, button and project; select text and enter inputs; test high-refresh hardware.
- Verify the header hides during downward reading, returns upward, ignores direction jitter/overscroll and stays available for focus/menu/navigation. Check stable anchors/gallery offsets on home/archive/case pages.
- Review cursor shape/centre together on rapid reverse hovers; use service text and local toggles, oversized buttons, nested children, social gaps, a stationary pointer while scrolling, moving/hidden header and interrupted layout changes.
- Verify supplied email, WhatsApp and both CVs in the real client/browser. LinkedIn rejected automated HEAD with 405, so its actual profile remains a browser check.

## Failure and motion

- Motion reduced before load and switched during use; explicit preference wins over OS and survives a reload.
- Denied storage, disabled JavaScript, disabled WebGL, shader failure and simulated context loss.
- Block display fonts, images and videos; test slow network and cached opening.
- Background tab/offscreen/resume: no needless drawing, time jump or duplicate listeners/renderers.
- Empty/single/few projects and few/changed skills; long owner/role/project/French text fixtures.
- Loader timeout and initialization failure always release focus, inertness and scrolling.
- Print preview/output: all service/project/experience content readable, no canvas/pin/overlays, useful links.

Each guide §23 state already has a separate tracker ID. Record browser evidence against that ID rather than merely ticking this summary.

## Measured performance and accessibility

Profile normal/reduced quality with orb on/off during service expansion, menu, gallery, cursor and skills. Record browser waterfalls, actual initial transfer, layout shifts, LCP, interaction latency and sustained device frame times/thermal responsiveness. Targets remain LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1; lab results and eventual 75th-percentile field results are separate.

Run browser accessibility checks plus manual keyboard/screen-reader review. Confirm heading order, landmarks, labels, modal behavior and full rendered contrast over bright glows. The local contrast report covers specified solid surfaces and a conservative white-underlay tile model; it does not certify every moving composition.

## Figma

Import `figma-design-v2/figma-plugin/manifest.json` in Figma Desktop using the supplied instructions. Inspect local-font substitution warnings, real text/images, Auto Layout, shared instances, component variants and prototype destinations. Compare representative states against the running site. Export a native `.fig` using Figma's Save local copy and reopen it. These editor checks remain pending; the ZIP is accurately labelled an editable importer package.

Deployment remains deferred. No domain, analytics or contact-form account is needed for this local review.
