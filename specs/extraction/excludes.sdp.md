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
- An exclusion is a unique, exact root-relative POSIX path prefix applied to both declared-carrier and anchor-candidate discovery surfaces.
- A prefix excludes itself and slash-delimited descendants only; it never excludes a merely similar sibling path.
- Empty, dot-relative, absolute, Windows-drive, backslash, trailing-slash, and parent-traversal paths are refused rather than normalized into a different meaning.
- The realizing entrypoints are `normalizeExcludes` and `discoverFiles` in `src/extract/discover.ts`.

## Example space
```gwt-vocabulary
Given the extraction root carries the tree {excludedTree:string} and the similar sibling {similarTree:string}
Given the consumer supplies the exclusion {exclusion:string}
When the root is discovered
Then the discovery attempt {outcome:"completes"|"is refused"}
Then the surviving spec carrier is {specCarrier:string} and the surviving anchor candidate is {anchorCandidate:string}
Then the refusal states {diagnostic:string} and names the offending path
```
