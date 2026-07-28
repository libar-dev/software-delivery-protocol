---
id: spec:consumers.reader
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.agent-surface
---
# The reader bridges agent entry points to composable graph context

## Intent
- outcome: Let agents enter the curated graph from the strings, files, and changesets they already have without rebuilding its joins or taxonomy.

## Behavior
- rule: `createReader` constructs a fresh thin typed loader that decodes graph joins, claims, delivery facts, derived readiness, and validation findings once, then returns plain composable data without persisting state.
- rule: `findByConcept` and `byFile` bridge strings and extraction-root-relative files to the graph's recorded context.
- rule: `findByConcept` matches a string against every field the graph records — ids, titles, anchor labels, Pack framing, narrative, and reified section content — and names the fields a node matched on rather than returning a bare hit.
- rule: `byFile` answers with the nodes the graph records at the path and with the Specs those nodes reach, so a source file carrying a binding names the Spec it binds and a carrier file names the Spec authored in it.
- rule: The reader's `blastRadius` surface maps changed files to directly impacted Specs and Packs, their explicit one-hop at-risk neighbors, and every coverage-unknown file.
- rule: Every impact and at-risk answer carries its reason as data — the changed file, the binding it travelled through, the connecting edge, and that edge's claim — so nothing about the reach is left to the caller's inference.
- rule: File-level blast radius reports curated graph reach without claiming exhaustive symbol-level usage reach.
- rule: The realizing entrypoint is `createReader` in `src/reader/reader.ts`.

## Example space
```gwt-vocabulary
Given a reader built over the graph a real extraction derives from the probe root
Given the concept {concept:string} appears in the corpus only inside the recorded context of {conceptSpecId:string}
Given the source file {boundFile:string} carries the binding {bindingId:string}
Given the changeset also holds the file {unrecordedFile:string} the graph records nothing at
When the reader answers the {entry:"concept"|"file"|"changeset"} entry
Then the reader names {matchedId:string} as a match on the field {matchedField:string}
Then the reader names {matchCount:number} matches in all
Then the file entry names the node {nodeId:string} the graph records at that path
Then the file entry reaches the spec {reachedSpecId:string} that binding names
Then the spec carrier {carrierFile:string} answers with its own spec {carrierSpecId:string}
Then the impacted specs name {impactedSpecId:string} through the binding {impactBindingId:string} at claim {impactClaim:string}
Then the one-hop at-risk neighbors name {atRiskId:string} through the edge {atRiskEdge:string} at claim {atRiskClaim:string}
Then the at-risk neighbors number {atRiskCount:number}
Then the coverage-unknown files name {coverageUnknownFile:string}
Then the coverage-unknown files number {coverageUnknownCount:number}
```
