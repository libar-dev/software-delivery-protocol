---
id: spec:consumers.impact-graph.curation-assist
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.impact-graph
  dependsOn: spec:model.planned-architecture
  decidedBy: spec:decisions.architectural-annotation
---
# File-level imports show where curation is missing

Gen 1 of this tool, `@libar-dev/architect`, derived a mechanical import graph beside its curated one and used it to show authors where curation was missing: load-bearing modules no annotation covered, coverage by package, and designed modules no code realized yet (`architect/packages/architect-core/src/graph/analysis-views.ts`). The idea held; the build did not. It hard-coded the repository's layout into the engine, read TypeScript only, and mixed both graphs in one query handle. A review of gen 1 for this arc found that this file-level layer gave most of its curation value, and that only its symbol queries needed the symbol identity `spec:consumers.impact-graph` still holds open. The owner ruled to ship the file-level layer first, as the first adopter's large redesign is the test it serves.

## Intent

- actor: An author curating anchors across a codebase, or a design pass over a large redesign.
- problem: Nothing tells an author which load-bearing files no anchor covers, where anchored `uses` and the code's imports disagree, or which component designs no code realizes yet, so curation gaps surface only when someone reads the code.
- outcome: Report from file-level imports where anchors and component designs are missing or drifting, as advice that never authors intent.

## Behavior

- rule: The layer reads file-level import edges from a per-language adapter and identifies each file by its repository-relative path, so it needs no symbol identity.
- rule: Every import edge it derives carries the `inferred` claim and stays apart from the curated graph: no `uses`, `memberOf`, `satisfies` or delivery fact derives from it, and a query of the curated graph never reads it unless the caller asks.
- rule: It reports the files with the highest import fan-in that no anchor covers, the anchored `uses` edges between two components whose files share no import, the imports between two anchored components that no `uses` states, and the component designs no `component:` anchor realizes yet.
- rule: Every report is advice: it refuses nothing, fails no validation and authors no anchor, and an author who agrees edits an anchor or a Spec as usual.
- rule: The engine reads no repository layout convention. Source roots and package boundaries come from the adapter's configuration, never from a path pattern in the engine.
- rule: A TypeScript adapter ships first, through the compiler library extraction already depends on; another language arrives as another adapter.
- rule: The adapter runs outside extraction and outside `sdp q`: `sdp build`, given the adapter's configuration, writes the import edges to `generated/imports.json`, sorted and without a timestamp, and the curation recipe reads that file through `--params`, so no query derives imports and no validator sees an inferred edge.
- rule: The recipe labels the file as external inferred input and reports a file present on one side only; it states nothing in the graph's name.
- rule: The adapter follows re-exports through barrel files, so a `uses` that reaches a component through an index file counts as backed by an import.
- rule: Load-bearing is a ranked list, not a threshold: the recipe reports each uncovered file's import fan-in and fan-out, takes a `limit`, and leaves the cut to the caller.
