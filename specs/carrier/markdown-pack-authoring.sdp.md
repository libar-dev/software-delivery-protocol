---
id: spec:carrier.markdown-pack-authoring
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:model.pack-aggregate
  dependsOn:
    - spec:carrier.markdown-parser
    - spec:decisions.carrier-ruling
  decidedBy: spec:decisions.pack-markdown-carrier
---
# A Pack has a Markdown manifest carrier

## Intent
- outcome: Let a Markdown Pack manifest carry the same grouping identity, framing, membership, and model references as the TypeScript form.

## Behavior
- rule: Routing is by envelope id namespace: `pack:` reifies as a Pack manifest; `spec:` keeps the Spec path; any other namespace is refused as `extract/invalid-id`.
- rule: The pack envelope is closed to exactly `id` (required, `pack:` namespace), `specs` (required YAML list of `spec:` ids, manifest order; may be empty), and `modelRefs` (optional YAML list of `spec:` ids). A derived-name key is refused as `extract/reserved-property`. Any other key — including the Spec envelope keys `kind`, `altitude`, `readiness` and `relations`, and `title` — refuses with `extract/unrecognized-property`. Symmetrically, `specs` or `modelRefs` on a `spec:` carrier refuse the same way.
- rule: The body H1 is the Pack title. All remaining body prose is the framing, owned by the Pack node. Any `##` section heading refuses with `extract/unrecognized-heading` — a Pack has no section tier.
- rule: A Markdown manifest and a TypeScript manifest of the same Pack derive the identical Pack node (the `file` field aside) and identical `belongsTo` edges. The same id authored in both carriers is the standing duplicate-id refusal.
- rule: The TypeScript `pack()` builder stays a lawful per-ID option and the import source; `sdp import` remains Spec-only and does not convert pack manifests.

## Example space
```gwt-vocabulary
Given an extraction root holding the pack carrier {carrierSource:string}
When the extractor derives the graph
Then the graph holds the pack {packId:string} whose membership names {memberId:string}
Then the report names the refusal {findingId:string} and the graph holds no pack node
Then the Markdown and TypeScript Pack nodes are equal apart from carrier file paths, and their membership edges are equal: {equal:boolean}
```
