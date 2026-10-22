# Prototype: the design slice and its Studio page

Throwaway evidence for lane S of plan 47, never product code. It shows the reading
`spec:consumers.design-slice` designs (recipe 54, the design slice) and the page
`spec:consumers.spec-studio.slice-page` designs, on three corpora:

- the Protocol's own corpus at the lane commit that adds this folder (base `44e62ef`), for
  `pack:roadmaps-and-slices-v1` and `pack:spec-studio-v1`;
- a copy of libar-platform's branch `sdp/design-at-scale` at `b038bd4`, read and never edited, for
  `pack:history-view` and `pack:application`;
- the slice probe: a second throwaway copy of that platform corpus, written by `make-probe.mjs`,
  with one probe Pack, `pack:slice-probe`, that holds the cases neither real corpus has yet.

## Files

| File | What it is |
| --- | --- |
| `slice-recipe.mjs` | The draft body of recipe 54, written as one function so lint reads it; `sliceBody` wraps it for `sdp q` unchanged. The build copies its statements into the catalog. |
| `make-probe.mjs` | Copies the platform corpus to `/tmp/plan47-platform-S` and adds the probe: five member component designs (no anchor; an anchor that does not satisfy the design; a matching realization; a realization with a differing layer and uses; a realization with an unreadable layer), a scoped example with a blocking question that folds into its parent, and an example with an extra `dependsOn` that does not fold. It edits three component anchors of the copy to satisfy their designs. |
| `build-slice-pages.mjs` | Runs the body through `sdp q` with `detail: true` and with the summary, writes one page per Pack in the Studio's look, and checks each whole Pack's slice boundary against the Pack's own. |
| `studio.css` | A copy of the Studio's stylesheet, so the pages read like Studio pages. |
| `protocol/*.html`, `platform/*.html`, `probe/slice-probe.html` | The five slice pages. Links point where a Studio page set would hold their targets, so they resolve only inside one. |
| `answers/*.summary.json` | The summary answer for each Pack: the shape an agent reads by default. |
| `answers/protocol-roadmaps-and-slices-v1.json`, `answers/probe-slice-probe.json` | Two full answers (`detail: true`), the shape the page renders. |
| `screenshots/` | Each page at 1440 CSS pixels: its top, the dependency drawing, the member table (folded examples opened) and the architecture section; the arc's Pack also at its decisions; the probe also at its design table; three member tables at 390. |

## Run it

From the lane worktree root, with `dist/` built and the platform copy in place:

```sh
node reviews/assets/plan47-prototypes/S-design-slice/make-probe.mjs
node reviews/assets/plan47-prototypes/S-design-slice/build-slice-pages.mjs
node /tmp/plan47-tools/capture.mjs "file://$PWD/reviews/assets/plan47-prototypes/S-design-slice/probe/slice-probe.html" out.png 1440 1100 0 '[id="slice.architecture"]'
```

`PLATFORM_ROOT` and `PROBE_ROOT` override the two copies. The body also runs alone:

```sh
node -e 'import("./reviews/assets/plan47-prototypes/S-design-slice/slice-recipe.mjs").then(({ sliceBody }) => process.stdout.write(sliceBody))' > /tmp/slice-body.js
node ./dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity "$(cat /tmp/slice-body.js)" --params '{"pack":"pack:spec-studio-v1"}' --json
```

## What the prototype measured

Re-run the scripts rather than quoting these.

- On seven Packs (the five pages, `pack:self-hosting-v1` and the platform's `pack:foundation`), a
  whole Pack's slice boundary equals the Pack's own boundary, row for row.
- On the probe, the slice's design totals equal recipe 43's totals: 5 designs, 3 realized, 1
  matching, 2 unrealized, 2 differing rows, 1 unreadable row. The realized differing design keeps
  its declared `uses` and its planned uses; the design whose anchor exists without satisfying it
  reads unrealized with `anchorExists: true`.
- The probe's held example folds into its parent and stays readable in the parent's disclosure,
  with both unmet clauses; the example with an extra `dependsOn` keeps its own row and box. The
  platform's application Pack has one such example in real data, so 32 of its 33 examples fold.
- Every diagnostic of `#design.sliceDiagnostics` fires as the entry lists it, including `detail: null`.
- Answer sizes in UTF-16 code units, full then summary: the arc's Pack 36,663 and 20,375; the
  Studio Pack 109,847 and 58,755; the history view 128,633 and 43,724; the application Pack
  147,263 and 64,233; the probe 63,715 and 25,613.
- The drawings are stand-ins. They consume the answer and recompute no scope, depth or order.
  Above the Studio's bound of 40 boxes and 100 edges, the dependency drawing folds in the order
  this lane proposes to the dependency kind for a supplied order: the outside Specs that hold no
  member first, one box per relation, then whole depth bands, largest first. The Studio Pack's
  drawing folds four depth bands to fit. The scoped architecture stand-in draws layer bands with
  the outside components in a band of their own; its crossing edges are what the shared routing
  of `spec:consumers.spec-studio.diagram-kinds` replaces.
