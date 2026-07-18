---
id: spec:carrier.markdown-authoring
kind: behavior
altitude: feature
readiness: defined
relations:
  dependsOn: spec:carrier.markdown-parser
---
# Markdown authoring enters the one graph

## Intent
- outcome: Author new Protocol Specs in Markdown without creating a second truth path.

## Behavior
- rule: Markdown and TypeScript carriers feed the same reification and graph-derivation path.
