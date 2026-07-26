---
id: spec:carrier.envelope-contract
kind: contract
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  decidedBy: spec:decisions.envelope-grammar-posture
---
# The Markdown envelope is explicit and bounded

## Intent
- outcome: Make a Markdown Spec's identity and descriptors deterministic to reify.

## Contract
- A Markdown Spec declares id, kind, altitude, readiness, and relations in bounded YAML frontmatter; its first H1 declares title.
- The envelope key set is closed and every one of its five keys is required: a key outside the set is refused rather than absorbed, and a missing key refuses the document rather than being defaulted.
- `relations: {}` is written explicitly when the logical relation set is empty — honest carrier syntax, not a new logical requirement: the physical key catches a truncated envelope at reification while the model itself stays relation-optional.
- A derived name is never authorable in the envelope: a delivery-fact or graph-shape key is refused under its own finding class, because delivery facts are derived and never authored.
- The Protocol owns the envelope grammar and the parser policy while the pinned YAML library stays a swappable representation behind that contract, so an unsupported YAML construct is refused within explicit byte bounds on the carrier and its frontmatter rather than silently becoming carrier semantics.
- The realizing entrypoints are `readMarkdownEnvelope` in `src/extract/markdown-envelope.ts` and `parseMarkdownFrontmatter` in `src/extract/markdown-frontmatter.ts`.
