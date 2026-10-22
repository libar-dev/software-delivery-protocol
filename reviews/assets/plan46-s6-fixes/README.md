# S6 review-fix captures

The engine was built from the source changes committed with these captures. The embedded build
identity is the pre-commit head, `d763182`. The disposable corpus was copied from
`/tmp/plan46/accept/platform` to `/tmp/s6-fix-platform`; the real adopter was never written.
Its publishing stamp names `b038bd4a77d51690b1ac5bdc31223576193e1266`.

Rebuild from the Protocol worktree:

```sh
npm run build
node dist/cli/sdp.js studio /tmp/s6-fix-platform --base /tmp/plan46/accept/base-graph.json --base-label "Before the history-view rule-key proposal" --runs /tmp/s6-fix-platform/evidence/plan46-ctrf.json
node dist/cli/sdp.js stamp /tmp/s6-fix-platform --commit b038bd4a77d51690b1ac5bdc31223576193e1266
python3 -m http.server 8768 --bind 127.0.0.1 --directory /tmp/s6-fix-platform/generated/spec-studio
```

Chrome ran headless on DevTools port 9238 with its own profile. Every capture selected its CSS
viewport with CDP `Emulation.setDeviceMetricsOverride`, `deviceScaleFactor: 1`, `mobile: false`.
The phone viewport was 390 × 1600; desktop was 1280 × 1100. The two focused diagram captures
used 1280 × 900 and disabled page script with `Emulation.setScriptExecutionDisabled` before
navigation. A plain `--window-size` flag is insufficient for the phone check.

| Capture | What I checked |
| --- | --- |
| [Phone Pack](pack-phone.png) | Navigation and stamp wrap; the caption wraps into three visible lines; empty columns are compact; the filled column is reached by scrolling the table. |
| [Desktop Pack](pack-desktop.png) | The rail, summary, caption and counted member cells retain their layout. |
| [Desktop architecture](architecture-desktop.png), [phone architecture](architecture-phone.png) | The overview fits its column, has one use legend and no repeated edge labels. Code in the planned-components table wraps at word boundaries. |
| [Small member diagram](small-member-desktop.png) | The one-box inventory diagram remains at its own size without script. |
| [Small trace graph](small-trace-desktop.png) | The trace graph remains at its own size without script. |
| [Desktop runs](runs-desktop.png), [phone runs](runs-phone.png) | Headers stay whole and durations read `2.84 ms` and `0.46 ms`. |
| [Diff](diff-desktop.png) | Keying remains one line per rule with Base and Now addresses and no raw JSON arrays. |

[Measurements with script enabled](measure.json) record DOM sizes, diagram view boxes and the
phone overflow scan. All 269 HTML pages were loaded at a true 390 px viewport; none widened
the document or put an element outside a scroll container across the right edge. No request
left the local server. These are measurements of this capture, not inherited corpus counts.

At 1280 px the architecture overview is 928 px wide inside a 928 px column. The small member
SVG is 314 × 203, matching its view box; the trace SVG is 321 × 391, also matching its view box.
The phone maturity caption is 350 px wide, has no internal overflow and occupies three lines;
the filled column starts at x=318.22. The table itself scrolls within the reading column.
[Measurements without script](measure-no-script.json) confirm the two small diagrams keep the
same dimensions when script is disabled.

To re-measure in a browser after selecting the viewport, compare `innerWidth` with
`document.documentElement.scrollWidth`, and read each `sdp-diagram svg` element's
`getBoundingClientRect()`, `viewBox.baseVal` and parent `clientWidth`. The caption's
`getBoundingClientRect().width` must equal its `scrollWidth`. The committed parsed-CSS tests
and recipe probes carry the repeatable regression checks; these images carry the visual evidence.
