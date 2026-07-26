---
id: spec:extraction.excludes
kind: rule
altitude: feature
readiness: defined
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
