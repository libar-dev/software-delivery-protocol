# Diagram review evidence

This revision answers the review of `1d7b3c9`. It reads the Protocol at `44e62ef` and
libar-platform at `b038bd4`, both read only. These are throwaway layouts, never product code or
bindings. Find the answer commit with:

```sh
git log -1 --format=%H -- reviews/assets/plan47-prototypes/G-diagrams/README.md
```

The Protocol scope is `pack:spec-studio-v1`; the platform scope is `pack:history-view`.
`protocol-after.html` and `platform-after.html` collect the views. Standalone pages use
`<corpus>-after-<view>.html`, with views `dependency`, `capability`, `scoped-architecture`,
`maturity`, `requirement`, `architecture` and `trace`. Before pages and screenshots preserve the
base architecture, widest trace and maturity map. Every page retains the Studio rail and column
on desktop. Trace and requirement pages also reproduce the Spec panel's border and padding. `studio.css` is copied from the Studio; `prototype.css` adds only the proposed rules.

`protocol-input.json` and `platform-input.json` preserve the original reduced graph values.
`refresh-answers.mjs` additionally queries the base corpora using local copies of E's map probe
and S's slice probe. The layout reads their saved answers, not carrier files. Those copied probes
are evidence, not shipped recipes. S's probe still returns optional outside uses pairs; the
refresh script selects only pairs whose ends occur in its touched-component answer, matching
S's current `componentUse` contract. The full architecture comparison keeps the original
corpus-wide uses separately.

The Protocol base query runs its own built engine so relative builder imports remain trusted.
The engine source is the same baseline; pointing G's engine at another Protocol checkout would
lose those bindings. The platform query uses G's engine, as the lane brief requires.

## Reproduce

From `/tmp/plan47-wt/G`, with the built engines and the read-only base checkout available:

```sh
node reviews/assets/plan47-prototypes/G-diagrams/refresh-answers.mjs
node reviews/assets/plan47-prototypes/G-diagrams/prototype.mjs --snapshots
node reviews/assets/plan47-prototypes/G-diagrams/audit.mjs
node reviews/assets/plan47-prototypes/G-diagrams/capture-all.mjs
```

`--snapshots` preserves the base inputs and baseline panels. Running without it replaces the
original graph snapshots from the current worktree and platform copy, so it is not the command
for repeating this base comparison. The saved answers permit rendering without either base
checkout.

Screenshots are `<corpus>-after-<view>-<1280|1440|390>.png`. All seven views have all three widths
on both corpora. Before images retain both desktop widths. `measure.mjs` writes SVG size,
container size, effective font size, page width and rail width to `metrics-*.json`.
`baseline-live-*.json` retains the measurements of the actual generated base pages, including
Spec-panel padding. The widest trace subjects remain `spec:carrier.gherkin-authoring` and
`spec:application.first-experiment`.

The label box budget is 880 logical pixels. Trace SVGs and the Protocol architecture fit that
budget; routing gutters widen the Protocol dependency drawing, and the platform architecture
keeps its context columns with local scrolling. Desktop titles start at 14 screen pixels and
ids at 12. Below 720 CSS pixels, the existing responsive promise scales the same drawing to the
screen. No clipboard or viewport script is supplied by these evidence pages.

## What changed after review

- Dependency depth and relation selection come from S's answer, starting at 1. Examples stay in
  parent counts and the text equivalent. Boundary groups fold before member bands; holding
  targets and targets below defined remain individual boxes. Every original row remains in text.
- Capability children stay in parent groups. Repeated visits retain their refinement arrow and
  link to the first occurrence. Unreached identities remain in the text equivalent.
- The maturity map uses faint empty cells and exact counts with member marks in populated cells.
  Only populated cells need member-list disclosures.
- Routes reserve distinct ports and 8-pixel lanes. Labels reserve rectangles; homogeneous uses
  and refinement drawings name the relation once in their legend and carry no edge keys.
- Displayed ids mark elision and never attach a namespace to a shortened suffix. Component
  member counts follow the id.
- Sources use the diagram's own id qualification and the existing `sdp-copy` markup. The exact
  escaping probe preserves apostrophes and backticks and encodes quotes, hashes and angle signs.

`router-probe.mjs` contains the experimental search and bounded retries. Its weights, grid and
retry choices are deliberately absent from the Spec. `audit.mjs` checks all standalone drawings
for node and band-label collisions, shared collinear segments, duplicate ports, overlapping edge
labels, routes through labels, duplicate HTML ids and invented folded-id labels. It also checks
the escaping regression. `routing-results.json` names folds and routing failures;
`audit-results.json` records each artifact's checks. The audit fails if any intended drawing is
omitted, so an all-text fallback cannot hide a failed prototype.

Neither real base has planned component declarations. `synthetic-plans.html` and its desktop
screenshot show the labelled planned/anchored distinction and backward routes. The two real
requirement pages use a flowchart fallback and name the unsupported relation that requires it.
`synthetic-requirement.html` and its screenshot exercise the supported `requirementDiagram`
serialization and punctuation. Synthetic ids assert no fact about either corpus.

These checks establish the properties of these artifacts. Production parser checks, clipboard
success/failure, pinch/reset, print, export, fonts and adversarial routing limits remain build
verification. The engine, tests, ready Specs, Pack manifests and glossary were not edited.
