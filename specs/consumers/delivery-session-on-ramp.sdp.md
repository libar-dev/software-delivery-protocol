---
id: spec:consumers.delivery-session-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.authoring-on-ramp
    reason: a work shape routes an agent into one stretch of the authoring path, from capture to review
  dependsOn:
    - target: spec:model.enrichment-lifecycle
      reason: the close guidance reads its distillation boundary for Design entries
    - target: spec:consumers.design-diff
      reason: the design loop starts from what changed since the last pass
    - target: spec:consumers.context-bundle
      reason: the design loop composes each pass's reading material as a context bundle
    - target: spec:consumers.review-perspectives
      reason: the design loop narrows a Pack to one perspective's members
    - target: spec:consumers.intent-composition.proposal
      reason: the design loop hands its findings back as a change proposal checked against its base
  decidedBy: spec:decisions.planning-truths-placement
---
# Delivery sessions route work from current graph state

A handoff names the Specs that carry the work, so the next session re-measures them from the graph instead of inheriting register state or a verification verdict from the handoff.

## Intent
- outcome: Let an agent enter capture, design, implementation, review, or close work from current graph evidence without inventing workflow state or gates.

## Behavior
- rule: Work shapes are advisory entries over the same current graph; they are neither phases nor a required sequence, and a session may enter or revisit any shape.
- rule: Capture or refinement uses concept search, the lower ladder, and promotion preflight; design uses promotion preflight and readiness divergence. The listed recipes are starting points, not exhaustive recipe sets.
- rule: The skill teaches an advisory Pack design loop: read the design diff from the last pass, compose a context bundle within a stated budget, narrow by perspective when needed, and return a change proposal for a base check before an agent applies it.
- rule: Implementation uses the build backlog and the target Spec context; review uses the Pack backbone and warn-level signals, or the target Spec context and warn-level signals when no Pack exists. The listed recipes are starting points, not exhaustive recipe sets.
- rule: The skill teaches a Spec proposal report as a numbered list ordered by severity, with each item naming one entry address or Spec section, stating the gap in one sentence, and proposing exact text with the address it replaces or follows. Findings against code or other files stay review comments on their lines; a review proposing no Spec edit has no proposal.
- rule: Close uses the drift alarm and changed-file blast radius; slimming is optional and preserves durable law and one prose owner. For a Design entry, the skill teaches the distillation boundary stated by `spec:model.enrichment-lifecycle`, compares the entry with its bound artifact before removal, and keeps every explanation of why.
- rule: A handoff names targets, changed files, current readiness, findings or open questions, and commands or evidence locations to re-run; it never carries an inherited verification verdict.
- rule: [#arcHandoff] An arc-scale handoff names the Spec ids that carry the arc's standing refusals, guarantees and holds in the homes ruled by `spec:decisions.planning-truths-placement`: tradeoff refusals in decision Specs, already-homed guarantees on their carrying Specs, and deferrals or holds in their blocking open questions.
- rule: The skill names tripwires that ask a session to reconsider its chosen work shape; they are guidance and create no required sequence or authorization.
- rule: Every preflight informs human or agent judgment and never authorizes, blocks, scopes, or advances delivery work.
