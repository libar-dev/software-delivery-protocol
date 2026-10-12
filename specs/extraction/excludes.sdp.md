---
id: spec:extraction.excludes
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.derive-graph
  decidedBy: spec:decisions.exclusion-contract
---
# Extraction exclusions are strict consumer input

## Intent
- outcome: Keep consumer-selected omissions precise without changing the extractor's canonical discovery rules.

## Rule
- [#canonicalDiscovery] Discovery reads Spec and Pack carriers by the suffixes `.sdp.md`, `.sdp.gherkin` and `.sdp.ts`. Other `.ts` and `.tsx` files are anchor candidates, except `.d.ts` files. Discovery never descends into `node_modules`, `dist`, `generated`, `coverage` or a dot-directory, and configured exclusions apply to both lists.
- An exclusion is an exact root-relative POSIX path prefix applied to Spec-carrier and anchor-candidate discovery; a repeated exclusion counts once.
- [#segmentBoundary] A prefix excludes itself and slash-delimited descendants only; it never excludes a merely similar sibling path.
- [#refusedPaths] Empty, absolute, Windows-drive, backslash and trailing-slash paths, and paths with an empty, `.` or `..` segment, are refused rather than normalized into a different meaning.

## Example space
```gwt-vocabulary
Given the extraction root carries the tree {excludedTree:string} and the similar sibling {similarTree:string}
Given the consumer supplies the exclusion {exclusion:string}
When the root is discovered
Then the discovery attempt {outcome:"completes"|"is refused"}
Then the surviving spec carrier is {specCarrier:string} and the surviving anchor candidate is {anchorCandidate:string}
Then the refusal states {diagnostic:string} and names the offending path
```
