---
id: spec:consumers.agent-surface
kind: behavior
altitude: epic
readiness: ready
relations:
  refines: spec:consumers.projections-model
  decidedBy:
    - spec:decisions.agent-surface-scripts-graph
    - spec:decisions.agent-front-door
---
# Agents script a visible typed graph

Agents arrive with a question, and a command for each question would repeat the graph's semantics. The reader and the evaluation sink let a body return the conclusion its caller needs.

## Intent
- outcome: Let an agent obtain and compose graph context without rebuilding joins or navigating a fixed verb wall.

## Behavior
- rule: The agent surface exposes the typed graph through two entrances, the exported reader and the `sdp q` evaluation sink; the schema is the contract and agents script the graph directly.
- rule: The reader constructs decoded joins and claim taxonomy once, then returns plain composable data without persisting graph state.
- rule: Entry adapters bridge strings, files, and changesets to curated graph context; file-level blast radius names coverage-unknown files rather than implying exhaustive reach.
- rule: [#demandMap] An agent arrives holding a concept string, a file it is editing, or the changeset a diff touches, and not the Spec id it is looking for, so the surface is designed around those entry points rather than around lookup by id.
- rule: [#entryAdapters] The string entry is `findByConcept`, the file entry is `byFile`, and the changeset entry is `blastRadius`, whose answer names every coverage-unknown changed file rather than dropping it into silence.
- rule: [#noSymbolEntry] The surface offers no symbol entry: `bySymbol` would need the exhaustive symbol reach the impact graph defers, and the adapter is absent rather than stubbed so its absence cannot read as a landed capability.
- rule: [#growByRecipe] Past those entry adapters the surface grows by recipe and not by verb: a join is frozen into the reader only when a second machine consumer needs it and hand-rolled attempts get it wrong, and every other question stays a body an agent scripts.

## Example space
```gwt-vocabulary
Given an extraction root the front door derives in process on the invocation
Given the corpus binds the spec {specId:string} to one anchored verifier and one declared-only verifier
Given the agent holds the concept {concept:string}, the file {file:string}, and a changeset that also touches the unrecorded file {unrecordedFile:string}
When the agent scripts a body {body:"composing that spec's verifier bindings"|"reaching every entry point the demand map names"} through the front door
Then the front door exits {exitCode:number} with an empty error stream
Then the printed answer is exactly the body's pre-shaped return {printedAnswer:string}
Then the anchored verifier {anchoredVerifierId:string} decodes as enabled while the declared-only verifier {declaredVerifierId:string} does not
Then the concept entry answers with the spec {conceptSpecId:string}
Then the file entry answers with the spec {fileSpecId:string}
Then the changeset entry answers with the impacted spec {changesetSpecId:string}
Then the surface offers a symbol entry: {symbolEntry:boolean}
```
