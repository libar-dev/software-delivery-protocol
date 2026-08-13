---
id: spec:decisions.pack-markdown-carrier
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:decisions.carrier-ruling
---
# Packs gain a Markdown manifest carrier

## Intent
- outcome: Give every Pack one readable canonical authoring surface without losing the TypeScript manifest as a lawful per-ID option.

## Decision
- context: The carrier ruling left Packs on TypeScript until a real need forced a syntax ruling; the two remaining authored Pack manifests are that need, and a second suffix or a body-list membership would invent a second discovery walk or a second membership owner.
- decision: A Pack's Markdown carrier is a `.sdp.md` file routed by the `pack:` envelope id namespace, closed to `id` · `specs` · `modelRefs`, with the H1 as title and remaining prose as framing; the TypeScript `pack()` builder stays a lawful per-ID option and the import source.
- rationale: Discovery already walks `.sdp.md`, so routing by namespace reuses the one walk instead of minting a `.pack.md` suffix. Closing the envelope to the same fields the TypeScript manifest already owns keeps one Pack node shape. Refusing `##` headings preserves the no-section-tier law. Membership as a YAML list keeps the manifest the sole owner of `belongsTo` rather than promoting body prose into identity.
- consequence: Markdown and TypeScript manifests of the same Pack derive the identical Pack node, the `file` field aside, and identical `belongsTo` edges.
- consequence: The same Pack id authored in both carriers remains the standing duplicate-id refusal.
- consequence: `sdp import` stays Spec-only and does not convert Pack manifests.
- alternative: A distinct `.pack.md` suffix would split discovery and pretend the carrier ruling had already chosen a Pack surface.
- alternative: Membership as a body list would give Packs a section tier the TypeScript shape does not have and would split identity between envelope and prose.
