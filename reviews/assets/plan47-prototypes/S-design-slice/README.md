# Prototype: the design slice and its Studio page

Throwaway evidence for lane S of plan 47, never product code. It shows the reading
`spec:consumers.design-slice` designs (recipe 54, the design slice) and the page
`spec:consumers.spec-studio.slice-page` designs, on two corpora:

- the Protocol's own corpus at the lane commit that adds this folder (base `44e62ef`), for
  `pack:roadmaps-and-slices-v1` and `pack:spec-studio-v1`;
- a copy of libar-platform's branch `sdp/design-at-scale` at `b038bd4`, read and never edited, for
  `pack:history-view` and `pack:application`.

## Files

| File | What it is |
| --- | --- |
| `slice-recipe.mjs` | The draft body of recipe 54, written as one function so lint reads it; `sliceBody` wraps it for `sdp q` unchanged. The build copies its statements into the catalog. |
| `build-slice-pages.mjs` | Runs the body through `sdp q` with `detail: true` and with the summary, and writes one page per Pack in the Studio's look. |
| `studio.css` | A copy of the Studio's stylesheet, so the pages read like Studio pages. |
| `protocol/*.html`, `platform/*.html` | The four slice pages. Links point where a Studio page set would hold their targets, so they resolve only inside one. |
| `answers/*.summary.json` | The summary answer for each Pack: the shape an agent reads by default. |
| `answers/protocol-roadmaps-and-slices-v1.json` | One full answer (`detail: true`), the shape the page renders. |
| `screenshots/` | Each page at 1440 CSS pixels: its top, the dependency drawing, the member table and the architecture section; the arc's Pack also at its decisions and questions; the history view also at 390. |

## Run it

From the lane worktree root, with `dist/` built and the platform copy in place:

```sh
node reviews/assets/plan47-prototypes/S-design-slice/build-slice-pages.mjs
PLATFORM_ROOT=/path/to/platform-copy node reviews/assets/plan47-prototypes/S-design-slice/build-slice-pages.mjs
node /tmp/plan47-tools/capture.mjs "file://$PWD/reviews/assets/plan47-prototypes/S-design-slice/platform/history-view.html" out.png 1440 1100 0 '#slice\.members'
```

The body also runs alone:

```sh
node -e 'import("./reviews/assets/plan47-prototypes/S-design-slice/slice-recipe.mjs").then(({ sliceBody }) => process.stdout.write(sliceBody))' > /tmp/slice-body.js
node ./dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity "$(cat /tmp/slice-body.js)" --params '{"pack":"pack:spec-studio-v1"}' --json
```

## What the prototype measured

- On all six Packs tried (four here, `pack:self-hosting-v1` and the platform's `pack:foundation`),
  a whole Pack's slice boundary equals the boundary Pack design reports, row for row.
- Answer sizes in UTF-16 code units, full then summary: the arc's Pack 29,761 and 17,639; the
  Studio Pack 103,320 and 56,574; the history view 122,496 and 41,335; the application Pack
  141,605 and 62,102. Re-run the script rather than quoting these.
- The drawings are stand-ins for the kinds `spec:consumers.spec-studio.diagram-kinds` will
  design: bands at most three boxes wide keep every label at 12 pixels inside a desktop column.
  Outside Specs that hold no member and state `defined` or `ready` fold into one box per relation.
  The Studio Pack's drawing still holds 44 boxes and 145 edges, and the application Pack's 110
  edges, past the Studio's bound of 40 boxes and 100 edges; the page says so, and the fold that
  ships is lane G's.
- No corpus holds a component design yet, so no page shows a planned component; each architecture
  section reads its components through the members' code and through the code that realizes
  what the slice rests on.
