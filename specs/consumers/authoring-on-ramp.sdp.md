---
id: spec:consumers.authoring-on-ramp
kind: behavior
altitude: feature
readiness: ready
relations:
  dependsOn:
    - target: spec:consumers.edit-model
      reason: an author edits the canonical carrier as the edit model states, never through a derived view
    - spec:model.open-question-keys
    - spec:model.open-question-fields
    - spec:model.rule-keys
    - spec:model.relation-reasons
    - spec:carrier.gherkin-authoring
    - spec:carrier.markdown-pack-authoring
  decidedBy:
    - target: spec:decisions.anchor-comment-form
      reason: the skill teaches both extracted anchor forms and their silent non-binding hazards under this ruling
    - target: spec:decisions.anchor-binding-grain
      reason: the skill teaches optional and plural targets, references and the collective promise test under this ruling
    - spec:decisions.architectural-annotation
---
# Authors move one Spec from intent to reviewed evidence

## Intent
- outcome: Give an agent or human one graph-first path for creating, enriching, binding, and reviewing a Spec without inventing a parallel workflow.

## Behavior
- rule: An author starts from the build-backlog and drift-alarm recipes, reads carrying Specs for law, and edits the canonical carrier.
- rule: Cheap capture starts with `sdp new spec` (or the equivalent hand-authored idea carrier) in the family found through concept search; the scaffolder emits envelope, Intent outcome, and the kind's bare typed heading, never invented content, and for `constraint` emits envelope, title, and Intent only with no twin section. Every later readiness edit is preceded by the promotion-preflight recipe and remains a human statement.
- rule: The skill teaches question keys and their optional fields through `spec:model.open-question-keys` and `spec:model.open-question-fields`, rule keys and an example's `exercises` through `spec:model.rule-keys`, and optional relation reasons through `spec:model.relation-reasons`.
- rule: The skill teaches the least design two parties need to agree: keyed Design entries for shared names and shapes, code spans for pinned declarations, rule keys for outside citations, one prose owner for why, and no derived counts, delivery state or implementation sequence authored as design.
- rule: The skill points behavior and example authors to `spec:carrier.gherkin-authoring` for the lawful Gherkin alternative and Pack authors to `spec:carrier.markdown-pack-authoring` for namespace routing, framing and ordered membership.
- rule: Binding is taught for code, test and oracle anchors in the constant form and the comment form, following `spec:decisions.anchor-comment-form` and `spec:decisions.anchor-binding-grain`. The constant builders are `codeAnchor`, `specTest` and `specOracle`; a code anchor's `satisfies` is optional and plural, a test anchor's `verifies` is non-empty and plural, and an oracle anchor has one `models` target. The skill teaches `references` as the code-to-design binding that claims no realization, and names the two silent non-binding hazards, a constant builder without a Protocol builder binding and a comment that does not open with `/**`.
- rule: The skill teaches the collective promise test for `satisfies` and the one-way meaning of `references`, following `spec:decisions.anchor-binding-grain`; every promise is realized by the satisfying units together, and each satisfying unit realizes at least one promise.
- rule: Structural binding is taught through `component`, `uses` and optional `role` on a code anchor, and optional `layer` and `context` on a `component:` anchor, in either form, following `spec:decisions.architectural-annotation`. The skill teaches closed graph-ID targets, at most one component per source, no `implements` field, cycles as data, and no conferral of intent, delivery facts or readiness by structural fields.
- rule: The executable transition is taught as parent example space, child bound point, generated contracts, the oracle bound by a `specOracle` anchor, and one generated-registrar activation beside the authored suite's top-level `specTest` anchor, with `bindExample` named as the low-level adapter and a mutation-probed red result required before the human states `ready`.
- rule: Contract-generation refusals are diagnosed through `sdp build`; query-time validation does not claim to report codegen findings.
- rule: Verifier-binding queries report graph-visible anchors; the `specTest` anchor remains the sole `has-verifier` source, and the graph cannot detect a generated contract or registrar that no authored suite activates.
- rule: An anchor carries identity, an optional label, its flavor's targets and optional structure, never intent; a code anchor with neither `satisfies` nor `references` is identity-only and lawful. A Markdown deliverable binds through the document-realization convention: the suite asserting the shipped document carries the code anchor, and blast radius stays coverage-unknown for the Markdown file.
- rule: Design Review supplies context for the human readiness statement without becoming a workflow gate.
