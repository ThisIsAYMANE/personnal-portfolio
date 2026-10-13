# Cursor target and review matrix

13 October 2026. Implemented target behavior is covered by source/math/DOM regression evidence. **Actual browser appearance and the user's original glitch reproduction are still pending.**

| Target/state | Intended effect | Local evidence | Physical review |
| --- | --- | --- | --- |
| Ordinary text / plain links / footer links | 26 px white companion follows the mouse; native pointer remains | Existing cursor/selection tests, new geometry test | Pending |
| Header navigation / language links | Local 35 px ring; clears when header moves away | Header/cursor integration; nested closest-target logic | Pending |
| Compact primary/secondary buttons | Actual bounds +6 px; centre and visible dimensions interpolate together | Forward/reverse geometry and cached measurement checks | Pending |
| Oversized/wrapped buttons | Local 35 px ring instead of capture toward a distant centre | Oversized target fixture | Pending |
| Service text / summary / chevron | 44 px ring at the pointer; full summary stays clickable | Large summary + nested title fixture; disclosure suite | Pending |
| Project artwork / child image / arrow | 72 px circle with arrow | Existing project data contract and stationary-scroll retarget check | Pending |
| Project pagination / ordinary buttons | Default local companion; native clickable control | Existing pagination flow; state selector contract | Pending |
| Social icon group / nested SVG / gaps | Global companion hidden; shared local 44×148 px capsule | Child/group/capsule/gap fixtures | Pending |
| Rail separator / outside social group | Capsule clears and default companion resumes | Group-exit fixture | Pending |
| Stationary mouse while content moves | Dirty hit test uses current element; no stale previous target | Scroll/body/project fixture; header-change fixture | Pending |
| Target resize / completed hover transform | Cached dimensions refresh on invalidation | Transition completion regression; owned ResizeObserver | Pending |
| Text selection / input / editable content | Native interaction; companion hidden | Existing selection/input safeguards | Pending |
| Touch / blur / page hide / open dialog | Hidden without later stale wake-up | Existing lifecycle checks and hidden-scroll regression | Pending |
| Reduced motion / no capable mouse | Native pointer only | Existing preference/capability contract | Pending |

Review fast entry/exit/reversal, pointer leave/re-entry, 60/120/144 Hz displays, mixed-pointer devices, long French labels and keyboard-only use. Record browser/version, target, exact movement, expected/observed result and screenshot/recording evidence before closing R011, T168 or T200. PNG design previews do not close these cursor checks.
