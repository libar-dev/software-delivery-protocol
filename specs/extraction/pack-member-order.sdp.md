---
id: spec:extraction.pack-member-order
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:extraction.derive-graph
  dependsOn: spec:carrier.markdown-pack-authoring
  constrainedBy: spec:extraction.determinism
---
# A Pack node keeps its members in authored order

## Intent
- problem: A Pack manifest lists its members in the order its author chose to read them, and the graph loses that order: the serialized edges sort by from, type, and to, and the reader's Pack context sorts members by id, so an adopter reads the manifest file to recover a reading order the graph was given.
- outcome: Carry a Pack's members in the manifest's authored order through the serialized graph, the reader's Pack context, and the Design Review's Pack page, while the edges keep their global sort.

## Rule
- A Pack node carries `members`, the manifest's `specs` list in authored order, a repeat included where the carrier admits one. The `belongsTo` edges re-express the same list, one edge per entry, so the members of a Pack node and the sources of its `belongsTo` edges are one list read twice and never disagree in a derived graph.
- `members` is always present on a Pack node, and an empty manifest list derives `members: []`. The serialized Pack node writes its fields in the order `id`, `nodeType`, `claim`, `title`, `framing`, `file`, `members`, `modelRefs`, omitting an absent optional field.
- Nodes keep their sort by id and edges keep their sort by from, type, and to. Authored member order is content of the Pack node, as authored entry order is content of a Spec's open sections, so two derivations of one commit stay byte-identical and two manifests that list the same members in different orders derive different Pack nodes.
- The reader's Pack context lists one member row per entry of `members`, in that order, and its verifier gaps follow the same order. The Design Review's Pack page renders its member table and its verifier gap list in that order.
- The schema version moves from `0.6.0` to `0.7.0`, documented as a field added to the Pack node and an optional field added to an open question, with node and edge order unchanged. One bump covers both additions.
- A repeated member is kept only where the carrier admits it. The TypeScript carrier carries a repeated member into `members` and the reader's rows as the manifest wrote it, and the repetition stays the pack-coherence error it is today, counted on the `belongsTo` edges. The Markdown carrier refuses a repeated member in a Pack manifest before derivation with `extract/invalid-frontmatter` and the message `duplicate entry in specs`, as it does today.
- The realizing sites are `derivePackNode` and the membership loop in `src/extract/derive.ts`, the Pack case of `canonicalNode` in `src/extract/serialize.ts`, and `packContext` in `src/reader/reader.ts`.

## Example space
```gwt-vocabulary
Given a Markdown Pack manifest whose specs list reads {manifestOrder:string}
When the graph is derived and serialized
Then the serialized Pack node lists the members {serializedMembers:string}
Then the serialized belongsTo edges run from {edgeSources:string}
Then the reader's Pack context lists the members {readerMembers:string}
Then the payload declares the schema version {schemaVersion:string}
```
