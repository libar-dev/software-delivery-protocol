---
id: spec:decisions.exclusion-contract
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.excludes
---
# Consumer exclusions stay exact

## Intent
- outcome: Keep consumer-selected omissions precise and unsurprising.

## Decision
- context: Exclusion input crosses from a consumer into canonical source discovery.
- decision: Consumers declare exclusions as exact root-relative POSIX path prefixes.
- rationale: Semantic globbing and path normalization are rejected because they make an omission broader or different from the path the consumer supplied.
- consequence: A prefix excludes only itself and slash-delimited descendants; malformed paths, including Windows-drive absolutes, are refused.
