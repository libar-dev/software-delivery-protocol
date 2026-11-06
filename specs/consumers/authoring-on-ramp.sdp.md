---
id: spec:consumers.authoring-on-ramp
kind: behavior
altitude: epic
readiness: ready
relations:
  dependsOn:
    - target: spec:consumers.edit-model
      reason: an author edits the canonical carrier as the edit model states, never through a derived view
    - target: spec:model.open-question-keys
      reason: the skill teaches keying an open question so its address resolves
    - target: spec:model.open-question-fields
      reason: the skill teaches a question's decider, links, provisional reading and trigger
    - target: spec:model.rule-keys
      reason: the skill teaches rule keys and the rules an example exercises
    - target: spec:model.relation-reasons
      reason: the skill teaches the one-line reason a relation may carry
    - target: spec:carrier.gherkin-authoring
      reason: the skill sends behavior and example authors to the lawful Gherkin carrier
    - target: spec:carrier.markdown-pack-authoring
      reason: the skill sends Pack authors to the manifest's routing, framing and ordered membership
    - target: spec:model.anchors
      reason: the skill teaches the anchor flavors, both forms and the document-realization binding this Spec defines
    - target: spec:validation.readiness-floor
      reason: the skill teaches stating only the rung the floor clears
    - target: spec:extraction.entry-citations
      reason: the skill teaches that a source citation records only in a file that carries an anchor
    - target: spec:validation.corpus-rules
      reason: the skill teaches a corpus rules file, its parameters and where its findings report
    - target: spec:carrier.step-keys
      reason: the skill teaches keying an example step so its binding survives rewording
    - target: spec:validation.kind-evidence
      reason: the skill teaches the evidence each kind's floor reads when an author chooses a kind
    - target: spec:model.spec-sections
      reason: the skill teaches keeping a section inline or moving it out to its kind twin
  decidedBy:
    - target: spec:decisions.content-only-sections
      reason: the skill teaches that promotion moves content out and links it, never copies it
    - target: spec:decisions.planning-truths-placement
      reason: the skill teaches the admission test this ruling applies to a decision record
    - target: spec:decisions.anchor-comment-form
      reason: the skill teaches both extracted anchor forms and their silent non-binding hazards under this ruling
    - target: spec:decisions.anchor-binding-grain
      reason: the skill teaches optional and plural targets, references and the collective promise test under this ruling
    - target: spec:decisions.architectural-annotation
      reason: the skill teaches structural binding, roles, layers and contexts under this ruling
    - target: spec:decisions.point-per-example
      reason: the executable transition binds each child example to one point of its parent's example space
    - target: spec:decisions.adopted-registrars-committed
      reason: the executable transition commits the generated registrar an authored suite adopts
---
# Authors move one Spec from intent to reviewed evidence

## Intent
- outcome: Give an agent or human one graph-first path for creating, enriching, binding, and reviewing a Spec without inventing a parallel workflow.

## Behavior
- rule: [#opensOnGraph] An author opens on the query the work needs, reads carrying Specs for law, edits the canonical carrier, and checks each edit with queries that write nothing, reading back what the edit changed against the request: each changed entry of a Spec, a Pack's members in order and its framing, and each anchor's targets and edge types.
- rule: [#capture] Cheap capture starts with `sdp new spec` in the family found through concept search; the scaffolder emits envelope, Intent outcome, and the kind's bare typed heading, never invented content, and for `constraint` emits envelope, title, and Intent only with no twin section. Every later readiness edit is preceded by the promotion-preflight recipe and remains a human statement.
- rule: [#scaffoldWriteBoundary] `sdp new spec` uses the original working directory as the boundary for parent creation and the scaffold write. It refuses an escaping or unresolvable parent with exit 1, before creating anything through a statically planted escaping link. It creates parents and the scaffold through held directories, rechecks containment before each creation and after entering each parent, and rechecks the scaffold's location before reporting success; a detected relocation removes the scaffold and refuses. This defends against planted links and detects intervening changes; Node has no openat-style operations, so re-verification does not provide race-free confinement against a concurrent writer inside the working directory.
- rule: [#kindChoice] The skill teaches choosing a kind by what a statement is, never by its size, with the evidence each kind's floor reads. It teaches the section and kind duality: detail stays inline while only its own Spec rests on it, and moves out into a Spec of its own, linked rather than copied, when another Spec rests on it or it needs its own identity, readiness or review.
- rule: [#decisionAdmission] The skill teaches admitting a decision record only for a choice that stays true after the work it shapes ships, is hard to reverse, would surprise a reader without its context and was made against a real alternative. It names what never qualifies, with the home each takes: a plan or sequence of work, a status or deliverables list, today's realization, and a why the existing design already forced. The record's first rationale says why the choice is a decision at all, and a choice only one Spec rests on stays that Spec's inline Decision section. No check reads this guidance.
- rule: [#keysAndReasons] The skill teaches question keys and their optional fields through `spec:model.open-question-keys` and `spec:model.open-question-fields`, rule keys and an example's `exercises` through `spec:model.rule-keys`, and optional relation reasons through `spec:model.relation-reasons`.
- rule: [#leastDesign] The skill teaches the least design two parties need to agree: keyed Design entries for shared names and shapes, code spans for pinned declarations, rule keys for outside citations, one prose owner for why, and no derived counts, delivery state or implementation sequence authored as design.
- rule: [#entryWriting] The skill teaches writing each entry so a reader can check it: an outcome names the change for its actor without the mechanism, a rule states one obligation, an example binds literal values, a question names one choice with its decider and the asker's lean, why is said once, and no entry carries a date, a status, a count or a work sequence.
- rule: [#designRounds] The skill teaches design in rounds over a design slice: what each rung's design typically settles, that a detail only the builder reads and a question only the builder answers belong to the build, and how a reviewer reads the design columns beside each rung; no check reads this guidance.
- rule: [#carrierPointers] The skill points behavior and example authors to `spec:carrier.gherkin-authoring` for the lawful Gherkin alternative and Pack authors to `spec:carrier.markdown-pack-authoring` for namespace routing, framing and ordered membership.
- rule: [#binding] The skill teaches code, test and oracle anchors in both forms with one worked anchor each, cites `spec:model.anchors`, `spec:decisions.anchor-comment-form` and `spec:decisions.anchor-binding-grain` for the law, and names in place the two silent non-binding hazards: an untrusted builder, and a comment that does not open with `/**`.
- rule: [#promiseTest] The skill teaches the collective promise test for `satisfies` and the one-way meaning of `references`, following `spec:decisions.anchor-binding-grain`; every promise is realized by the satisfying units together, and each satisfying unit realizes at least one promise.
- rule: [#structuralBinding] The skill teaches structural binding by citing `spec:decisions.architectural-annotation` and the roles, layers and contexts recipe, and states that structural fields confer no intent, delivery fact or readiness.
- rule: [#executableTransition] The executable transition is taught as parent example space, child bound point, generated contracts, the oracle bound by a `specOracle` anchor, and one generated-registrar activation beside the authored suite's top-level `specTest` anchor, with `bindExample` named as the low-level adapter and a mutation-probed red result required before the human states `ready`.
- rule: [#codegenRefusals] Contract-generation refusals are diagnosed through `sdp build`; query-time validation does not claim to report codegen findings.
- rule: [#verifierSource] Verifier-binding queries report graph-visible anchors; the `specTest` anchor remains the sole `has-verifier` source, and the graph cannot detect a generated contract or registrar that no authored suite activates.
- rule: An anchor carries identity, an optional label, its flavor's targets and optional structure, never intent; a code anchor with neither `satisfies` nor `references` is identity-only and lawful. A Markdown deliverable binds through the document-realization convention: the suite asserting the shipped document carries the code anchor, and blast radius stays coverage-unknown for the Markdown file.
- rule: [#designReview] Design Review supplies context for the human readiness statement without becoming a workflow gate.
