# Diagram design evidence

The lane's design reads Protocol commit `44e62ef` and libar-platform commit `b038bd4`.
These are throwaway layouts, not product implementation or bindings. The design commit is the
commit containing this directory; find it with `git log -1 --format=%H -- reviews/assets/plan47-prototypes/G-diagrams`.

`protocol-after.html` and `platform-after.html` collect the proposed views. Individual
`<corpus>-after-<view>.html` files make screenshot review easier. Both corpora are drawn from
captured graph values, with the existing epic, not proposed epic assignments from another lane.
The Protocol scope is `pack:spec-studio-v1`; the platform scope is `pack:history-view`.

The views are dependency depth, capability refinement, scoped architecture, maturity, and
requirement traceability. Architecture and trace pages also isolate the legibility change.
`<corpus>-before-{architecture,trace,maturity}.html` preserve the existing panel markup in a
Studio-width shell. The trace subjects are `spec:carrier.gherkin-authoring` and
`spec:application.first-experiment`, tied for the widest primary trace SVGs in their corpora.
The baseline panels retain the base's four-diagram renderer and maturity cards. No new corpus
binding changes these selected panels. `studio.css` copies the base Studio's rules;
`prototype.css` supplies the experimental rules. No remote resource is needed to open a page.

The prototype snapshots are reduced reader output, never a second authored source. Protocol's
base floors were computed with the package's exported evaluateBody over the graph captured by
sdp q at the base. The platform floors were queried directly. There are no planned-component declarations in either
base. `synthetic-plans.html` is labelled synthetic and demonstrates planned versus anchored boxes,
planned versus anchored uses, and a backward edge. It asserts nothing about either corpus.

## Reproduce

From `/tmp/plan47-wt/G`, with its built `dist/`:

```sh
# Re-render the captured base inputs, byte for byte.
node /tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/prototype.mjs --snapshots

# Re-query the current worktree and the editable platform copy instead.
# This replaces snapshots and captures current baseline panels. Publish each Studio first.
node /tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/prototype.mjs

# Static SVG routes must cross no box interior; HTML ids must be unique in each standalone page.
node /tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/audit.mjs

# Google Chrome headless, both desktop widths, with exact CSS viewports.
node /tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/capture-all.mjs
```

The generator calls `node <worktree>/dist/cli/sdp.js q --root <root> '<body>' --json`, adding
Protocol's three fixture exclusions. It reads the graph and reader-derived floors, not carriers,
paths or imports. For a fresh baseline at the original commit, publish the Studio and run the
same body from a separate checkout of that commit, preserving the three exclusions.

`capture.mjs` is the supplied capture utility copied beside its caller, with an isolated browser profile and an operating-system-assigned debugging port to prevent concurrent captures from sharing a browser. Screenshots are
`<corpus>-<before|after>-<view>-<1280|1440>.png`. All new views have both widths on both corpora;
architecture, trace and maturity also have before images. The synthetic probe has one desktop
image. `measure.mjs` reads SVG, figure and viewport geometry without inferring font size from a
screenshot. `metrics-*.json` names the saved prototype geometry. `baseline-live-*.json` measures
the actual generated Studio pages, including Spec-panel padding. Scroll a live trace into view
before measuring to avoid Chrome's deferred offscreen details layout:

```sh
node /tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/measure.mjs \
  file:///tmp/plan47-wt/G/generated/spec-studio/specs/carrier.gherkin-authoring.html \
  /tmp/trace-geometry.json 1440 sdp-diagram sdp-trace-graph
```

`routing-results.json` records folds and route failures. `audit-results.json` checks every routed
segment against every node rectangle in the standalone proposed views. Zero collisions verifies
this evidence set only. Routes can still cross one another or share a free gutter. The product
contract reserves label rectangles, provides explicit bounds and fallback, and needs its own tests.
The prototype uses keyed edge legends to keep dense arrow labels out of boxes. Preferred Mermaid
source and flowchart fallbacks are selectable text; clipboard enhancement, parser integration,
print, export and the complete production fold policy remain build work.

A repeated render of the captured inputs produced identical bytes for the generated HTML, CSS
and routing answer. Screenshots are visual evidence, not a byte-determinism assertion.

## Catalog sources

The catalog was checked against Mermaid `12.2.0` on 2026-10-22. Its navigation alone misses
agent flow and the railroad variants, so the tagged registration source was also read.

- [Mermaid's current syntax navigation](https://mermaid.js.org/intro/)
- [Mermaid 12.2.0 release](https://github.com/mermaid-js/mermaid/releases/tag/mermaid@12.2.0)
- [Tagged diagram registration](https://github.com/mermaid-js/mermaid/blob/mermaid@12.2.0/packages/mermaid/src/diagram-api/diagram-orchestration.ts)
- [Requirement syntax](https://mermaid.js.org/syntax/requirementDiagram.html)
- [Tagged requirement grammar, whose fields are optional](https://github.com/mermaid-js/mermaid/blob/mermaid@12.2.0/packages/mermaid/src/diagrams/requirement/parser/requirementDiagram.jison)
- [Block syntax](https://mermaid.js.org/syntax/block.html)
- [Mindmap syntax](https://mermaid.js.org/syntax/mindmap.html)
- [TreeView syntax](https://mermaid.js.org/syntax/treeView.html)

The Protocol's decision to keep or refuse a type is design judgment about its graph, not a claim
that Mermaid itself forbids that use.
