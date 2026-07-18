---
id: spec:carrier.envelope-contract
kind: contract
altitude: feature
readiness: defined
relations:
  refines: spec:carrier.markdown-authoring
---
# The Markdown envelope is explicit and bounded

## Intent
- outcome: Make a Markdown Spec's identity and descriptors deterministic to reify.

## Contract
- A Markdown Spec declares id, kind, altitude, readiness, and relations in bounded YAML frontmatter; its first H1 declares title.
