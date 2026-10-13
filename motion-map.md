# Implemented motion handoff

Source: `src/config.js`, `src/controllers.js`, `src/header.js`, `src/cursor.js`, `src/effects/`, `src/main.js` and `styles.css`. Updated 13 October 2026. This map describes the implemented behavior; browser appearance, physical input and GPU performance remain review items.

| Element / layer | Trigger and final state | Timing / mapping | Motion-off behavior |
| --- | --- | --- | --- |
| Opening overlay | First uncached eligible entry → preparing → exit → removed | Font readiness or 1500 ms font timeout; 400 ms exit; independent 2800 ms safety release | Immediate readable content; no compulsory delay |
| Loader decorative type | Exit fades type before overlay lifts | 200 ms type fade, 400 ms overlay opacity/translation | No transition required |
| Hero greeting/name/role/actions | Prepared reveal controller + entry into viewport | Masked short upward reveal, 600 ms; small element/line delays | Already visible |
| Decorative hero slogan/light | About approaches | Clamped native scroll progress; up to 20 px slogan shift and 45 px light drift | Identity and decoration remain static |
| About eyebrow/lead/support | First reading-zone entry | Mask wrapper + independent inner text; 600 ms, restrained delays | Already visible |
| Service panels/brackets | First entry; reading-zone proximity | Entry reveal; border/brightness emphasis | No entrance translation |
| Service content | Explicit native summary activation | Interrupt-safe 220 ms height animation, ease-out; preserves last intent | Immediate open/close |
| Service reading emphasis | Scroll or manual click/focus | Nearest reading-zone panel; manual choice wins until section leaves viewport | Explicit content still available |
| Experience rows | First entry and reading-zone progression | Short rise/opacity; separately clamped row brightness | Every row fully visible |
| Timeline line/dot | Timeline passes lower-middle viewport | Clamped local progress, sharp endpoint and halo | Completed line |
| Global header | Downward/upward movement outside top guard; focus/menu/navigation protection | 120 px top guard; accumulated down 16 px / up 8 px; reset on direction reversal; 220 ms transform; 350 ms navigation hold | Same accessible state changes, without transition |
| Work stage | Enough width, height and measured content fit | Native flow entrance; sticky hold at 96 px; linear measured translation; final read interval; natural release | Vertical projects |
| Gallery dots/focus | Activation or focus entering clipped panel | Actual panel offsets; clamped travel; focus uses instant placement | Native vertical reading |
| Project artwork/arrow | Hover, keyboard focus, touch press | Small image scale and diagonal arrow response; ordinary real anchor remains | Colors/affordances remain without movement |
| Stack heading / tile rows | First entry | Heading first; outer row wrappers with 60 ms stagger; inner tiles own hover | Immediate content |
| Skill surface/icon | Hover | At most 4 px lift; 180 ms surface/icon change; original brand SVG appears | Color change without lift |
| CSS atmosphere | Visible page + permitted motion | Independent 28/32/24-second slow gradient drifts | Static gradients |
| Orb field/mesh/particles | Near-section preparation, actual viewport visibility | Elapsed visible time; 30 fps desktop / 20 fps compact drawing cap; stable particle seeds | CSS still, or one still frame for an existing renderer |
| Orb pointer | Mouse + fine pointer + hover | At most 10 local CSS px displacement, eased return and faint mesh tilt | No tracking |
| Orb quality | Sustained frame/CPU submission samples | Resolution → particles → noise/mesh → still; 90 samples, 8-second cooldown, no automatic oscillation upward | Quality and motion remain separate |
| Cursor companion | Valid mouse movement on capable hardware | Centre and displayed width/height interpolate together with a 90 ms response constant; maximum stretch 1.15; cached bounds and invalidated hit tests; stop when settled | Native pointer only |
| Cursor morphs | Default / navigation / disclosure / social / button / project / hidden | 26 px circle, 35 px ring, local 44 px disclosure ring, shared 44×148 px social capsule, actual button bounds plus 6 px, 72 px arrow circle; selection/input/blur/dialog hides it | Hidden |
| Menu/project dialog | Explicit action, Escape, close or navigation | 220 ms entry/close scheduling; native modal focus/inert semantics; paired scroll unlock | Immediate close |
| Footer blocks | First entry | Short restrained reveal; no pin | Static readable footer |

## Ownership and cleanup

Scroll updates, pointer targets and time-driven decoration are separate. A skill row reveals on its outer wrapper; its tile hover changes the inner surface. Masked text uses `.mask > .reveal-inner`. Fixed cursor/header/dialogs are outside transformed project wrappers.

Controllers disconnect observers/listeners and cancel their owned animations on content replacement. The demand scheduler requests frames only while a job is active, cancels hidden-tab work and clamps resumed deltas. CSS ambient animation is explicitly paused while the document is hidden. Orb resources are reused and disposed; context loss removes the live-canvas state and leaves the CSS orb. Current instances resume without replacing readable content. No wheel interception or transformed document scroller is used.

Header and cursor have one global instance outside language-specific content replacement. Header focus reveals controls immediately and preserves semantic/tab access; hiding prevents pointer interception. Header transitions, gallery transforms, scroll/resize, target resize and relevant layout/transition completion invalidate cursor ownership. A stationary pointer is retested only when dirty. Social icon gaps share one group; decorative capsule layers do not receive pointer events. Large summaries and oversized buttons never capture a distant centre.

## Differences requiring real review

The Figma orb is a static target; its blur does not validate a shader. Local simulations validate control math/lifecycle but do not establish actual GPU appearance, frame rate, native focus containment or touch usability. The full browser/device/print matrix is in `portfolio-review-checklist.md`.
