---
id: spec:decisions.jsdoc-graph-extraction-refused
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.anchors
  dependsOn:
    - spec:decisions.one-validation-path
    - spec:decisions.structural-anchor-semantics
---
# Source commentary never enters the graph

## Intent
- outcome: Rule that JSDoc, doc comments, and other source commentary never author graph nodes, relations, membership, or Spec intent, so the statically reified anchor constant remains the only write path from code into the graph.

## Decision
- context: The v0 lineage supported three marker styles — decorators, JSDoc tags, and marker constants — all extracted (docs/lineage/v0-design/04-authoring-surfaces.md §2, 06-extraction-and-validation.md). The landed corpus keeps only the statically reified anchor constant; decorator and JSDoc forms remain unextracted representations (`spec:model.anchors`). Law-grade prose now sits in some engine file headers (for example `src/graph/delivery-facts.ts`), which raises whether the extractor should parse that prose into the graph. The ratified base rules which binding syntaxes extract (`spec:model.anchors`, MD-30); whether comment prose may author graph content is unruled until this decision, and the PR #25 review session genuinely deliberated that fork — this rules an open question, it does not repair drift.
- decision: Ordinary JSDoc and local commentary never author graph content — no nodes, no relations, no component membership, no delivery facts, no Spec intent. The only write path from source into the graph is the statically reified anchor constant under `spec:model.anchors`, and it is identity only. When a comment states rules other surfaces depend on, those rules promote into a Spec under the promotion law (`spec:model.spec-sections`) and the comment demotes to local commentary plus a Spec pointer.
- rationale: Hard to reverse — a comment-parsing write path would become a contract for source, extractor, and validators. Surprising without context — the lineage tool extracted identity tags from JSDoc, so the obvious parity move looks like extracting prose too; this refusal is about prose, not identity. Real trade-off — comment-prose extraction would make implementation files authoritative for intent (lineage 04 §2.4: markers are read-only pointers from code to spec, never the reverse) and would create a second, silently divergent read model beside the one extraction path (MD-14); giving that up keeps one graph language.
- consequence: The extractor never reads comment content; a comment's presence, absence, or wording produces no graph finding.
- consequence: A comment may explain the implementation and point at a Spec id; it confers nothing, and restating promoted law in the comment violates exclusive promotion (MD-10).
- alternative: Extracting identity tags from JSDoc (the v0 JSDoc marker style) stays refused with the decorator form — both are unextracted representations, and the anchor constant is the single binding syntax.
- alternative: Parsing law-grade prose comments into Spec sections was refused — it inverts the separation of intent from binding and recreates a shadow intent carrier beside the Specs.
