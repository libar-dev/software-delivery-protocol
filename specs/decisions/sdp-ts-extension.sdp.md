---
id: spec:decisions.sdp-ts-extension
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
---
# Spec extensions identify the carrier without colliding with tests

## Intent
- outcome: Keep authored Spec files recognizable to tools and safe beside ordinary test conventions.

## Decision
- context: A carrier filename must distinguish authored Specs from test files and remain useful when files are colocated.
- decision: Markdown Specs use `.sdp.md`; `.sdp.ts` names the surviving TypeScript DSL import source and lawful per-ID option.
- rationale: Test-glob extensions and path-only conventions either misclassify Specs or hide their identity.
- consequence: Carrier-specific tooling can target the compound extension without changing the `Spec` model name.
