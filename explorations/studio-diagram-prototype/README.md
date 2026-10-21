# explorations/studio-diagram-prototype: the Studio's diagrams as static SVG

> **Exploration record, illustrative, nothing ratified.** A throwaway prototype written for the
> Studio's phase-1 design pass, run against this repository's corpus and, read-only through
> `sdp q`, against the first adopter's corpus (libar-platform, branch `sdp/design-at-scale` at
> `b038bd4`). It chose the bound and the layout rules the diagram Specs pin:
> `spec:consumers.spec-studio.diagrams` and `spec:decisions.studio-diagram-renderer`. Never
> promote this code into the product: the build writes the engine's renderer.

## What it is

Two files turn graph values into script-free SVG pages:

- `dump.body.js` is an `sdp q` body. It returns the component units, their members and `uses`,
  the component designs no anchor realizes (as recipe 43 reads them), every authored relation,
  and each Spec's kind and rungs. It reads the graph only.
- `layout.mjs` lays the diagrams out from that dump with Node alone and writes three pages per
  corpus: `architecture.html` (the architecture lens), `components.html` (each component's
  members and what they use) and `trace.html` (one Spec's relations, for the three busiest Specs
  and one median Spec), plus `measurements.json`.

```sh
pnpm --silent sdp:q "$(cat explorations/studio-diagram-prototype/dump.body.js)" --json > protocol.json
node dist/cli/sdp.js q "$(cat explorations/studio-diagram-prototype/dump.body.js)" --root <platform checkout> --json > platform.json
node explorations/studio-diagram-prototype/layout.mjs protocol.json out/protocol
node explorations/studio-diagram-prototype/layout.mjs platform.json out/platform
node explorations/studio-diagram-prototype/layout.mjs platform.json out/platform-synthetic --synthetic 2
```

`--bound` and `--edge-bound` change the fold thresholds (40 nodes and 100 edges by default).
`--synthetic K` adds K planned components per layer in five synthetic contexts, so the fold can be
seen on a corpus larger than either measured one; the page says so.

## The layout it settles

- **Text has no font.** A label's width is its character count times a fixed advance, and an id
  longer than a fixed width wraps after a dot or a colon, then after a hyphen. Coordinates are
  whole pixels. Two runs over one dump wrote byte-identical files.
- **The architecture lens is a grid.** One column per recorded `context`, in code-unit order,
  then `no context stated`; one band per `layer`, in the closed set's order `edge`,
  `application`, `domain`, `adapter`, `infrastructure`, then `no layer stated`. A cell holds its
  components in id order and wraps after six. Unit-level `uses` resolve to their components, as
  recipe 32 resolves them, and aggregate into one edge per component pair, drawn thicker when it
  carries several unit edges. A planned component sits in the same grid by its planned context
  and layer, with a dashed outline and the word `planned` in its box; its planned uses are dashed.
- **A trace graph is bands of relations.** What the Spec rests on sits above it, one labelled
  band per relation type in the order `refines`, `dependsOn`, `constrainedBy`, `decidedBy`,
  `verifies`, `supersedes`; what rests on it sits below, labelled `<type> this`. Arrows always
  point from the Spec that declares a relation to the Spec it names.
- **A member diagram is bands of `uses` depth**, with the units and components outside the
  component in a last band of their own.
- **Every diagram has a text equivalent**: each box with its words, and each edge as a sentence,
  in a disclosure after the drawing that the SVG's `aria-describedby` names. Colour never carries
  a reading alone: bands and columns are labelled, planned and folded boxes say so in words.

## The bound, measured

| Corpus | Components | Units, `uses` | Largest member diagram | Spec neighbours, p95 and largest | Over 40 |
| --- | --- | --- | --- | --- | --- |
| This repository | 14, one context | 146 units, 43 `uses`; 38 component pairs | 35 nodes (`component:protocol.cli`) | 15 and 29 | none |
| libar-platform | 12, four contexts | 64 units, 36 `uses`; 36 component pairs | 13 nodes | 25 and 52 | 4 trace graphs |

Every architecture diagram either corpus has today fits in one drawing of 40 nodes and 100 edges.
Only the platform's hub Specs, the ones with 41 to 52 related Specs, fold their trace graph, and
folding there helps the reader: the folded box names the count and the relation, and the relation
table lists the Specs. The synthetic run shows the architecture fold the platform will need once
its later layers state component designs: 62 components fold to nine contexts, and each context
draws within the bound.

The chosen bound is **40 nodes and 100 edges per diagram**. Below it the busiest real diagram (the
platform's architecture, 12 nodes and 36 edges) reads at a desktop width. Drawn unfolded, the
synthetic run's 62 components and 81 edges span 4000 pixels, more than two and a half screens
(`platform-synthetic-unfolded.png`); at about 40 boxes a drawing stays within two screen widths at
the label size the pages use. The edge bound of 100 is two and a half edges per box at 40 boxes;
the densest real diagrams carry three per box at a third of that size, well inside it.

## Fold order, as prototyped

1. The architecture lens over the bound draws one box per context, with `uses` aggregated between
   contexts and counted. Each context then draws in a section of its own, with the other contexts
   it uses or is used by as folded boxes in an `other contexts` band.
2. A context still over the bound draws one box per layer, and each layer draws in its own section.
3. A layer still over the bound draws nothing: its text equivalent stands alone and says why.
4. A trace graph over the bound folds its largest relation group first, ties broken by direction
   and then by relation type, into one box that names the count and the relation, until it fits.
5. A member diagram over the bound draws nothing and keeps its text equivalent.

## What it does not settle

- **Routing.** Edges are straight lines from border to border, drawn beneath the boxes, so a long
  edge can pass behind an unrelated box (visible in `platform-architecture.png`, where an
  `inventory` edge passes behind an `orders` box). The text equivalent stays the reading of
  record; routing through the gaps between bands is the build's to improve.
- **Pan, zoom and pinch.** The pages here are script-free; the element that adds them changes only
  the SVG's `viewBox` and never lays the diagram out again.

## Files

- `out/protocol/`, `out/platform/`, `out/platform-synthetic/`: the pages and measurements above.
- `protocol-architecture.png`, `platform-architecture.png`, `platform-trace.png`,
  `platform-synthetic-architecture.png`, `platform-synthetic-unfolded.png`: screenshots of those
  pages in Chrome at 1500 pixels wide; the last is the synthetic run drawn with the bound lifted.
