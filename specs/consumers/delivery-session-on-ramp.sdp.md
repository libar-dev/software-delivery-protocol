---
id: spec:consumers.delivery-session-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.authoring-on-ramp
    reason: each work shape is one advisory stretch of the authoring path, from capture to review
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
    - target: spec:consumers.intent-composition
      reason: the receive procedure routes and applies each change as the hand-off law states
    - target: spec:extraction.contract-declarations
      reason: a build holds its code to the pinned declarations the Spec states
  decidedBy:
    target: spec:decisions.planning-truths-placement
    reason: a handoff names the Specs that carry refusals, guarantees and holds in the homes this ruling sets
---
# Delivery sessions do the requested work on current graph evidence

A handoff names the Specs that carry the work, so the next session re-measures them from the graph instead of inheriting register state or a verification verdict from the handoff.

## Intent
- outcome: Let an agent do the requested delivery work (capture, design, implement, fix, refactor, test, review, close, hand off) on current graph evidence, without inventing workflow state or gates.

## Behavior
- rule: [#advisoryShapes] Work shapes are advisory entries over one current graph, never phases or a required sequence, and a session may enter or revisit any shape; no shape or preflight authorizes, blocks, scopes or advances delivery work.
- rule: [#taskSelectsShape] The requested task selects the work shape. The roadmap's need and a Spec's promotion preflight are evidence about unfinished realization, never permission: a fix, a refactor, an added test or a change to a built Spec is ordinary work. The skill names the recipes a shape starts from and points into the catalog's index for the rest.
- rule: [#designLoop] The skill teaches an advisory Pack design loop: read the design diff from the last pass, compose a context bundle within a stated budget, narrow by perspective when needed, and return a change proposal for a base check before an agent applies it.
- rule: [#buildFromSpec] The skill teaches building a Spec from its graph context: read the law it rests on, what it guarantees and who verifies it, the open questions on it and on each Spec it rests on, its pinned declarations, its keyed rules no enabled example exercises, and the Specs that refine it, which its brief leaves out, so work on the rest of a feature first settles which Specs it builds and reads each of them as it read the first, following their own refinements, since a brief names a rule only by its address; write the verifying tests before the code; hold the code to the pinned declarations and rules, leaving private names, decomposition and the algorithm to the build. The build proceeds on a non-blocking question's provisional reading and leaves the question open; a blocking question, or a non-blocking one with no provisional reading, goes to its decider, or to whoever gave the work when it names none, and the code that answers it waits while work that does not depend on it goes on; a choice the Spec leaves open without a question returns to the Spec as a question or a change proposal, never settled in code. Close reads the Spec's delivery facts and the drift alarm, which lists a Spec built below `ready` until its owner states the rung, so the handoff names each listed Spec and states no rung for the owner. Building below `ready` stays ordinary work.
- rule: [#findingsProposal] Findings against Specs leave as one change proposal in the shape `spec:consumers.intent-composition.proposal` states, most severe first, with its memo; findings against code or other files stay review comments on their lines, and a review proposing no Spec edit has no proposal.
- rule: [#receiveProposal] The skill carries the one procedure for applying a received change proposal: it checks the proposal against the graph at its base and routes each change from that check, as `spec:consumers.intent-composition#rule.changedScope` states, and the Studio and vault skills point into it.
- rule: [#close] Close uses the drift alarm and changed-file blast radius; slimming is optional and preserves durable law and one prose owner. For a Design entry, the skill teaches the distillation boundary stated by `spec:model.enrichment-lifecycle`, compares the entry with its bound artifact before removal, and keeps every explanation of why.
- rule: [#handoff] A handoff, or a brief to another agent, names its targets, changed files, current readiness, findings or open questions, and the exact recipe files or bodies, with their parameters, that scope the work and re-measure it; it never carries an inherited verification verdict.
- rule: [#arcHandoff] A handoff for work that spans several sessions names the Spec ids that carry that work's standing refusals, guarantees and holds in the homes ruled by `spec:decisions.planning-truths-placement`: tradeoff refusals in decision Specs, already-homed guarantees on their carrying Specs, and deferrals or holds in their blocking open questions.
- rule: [#tripwires] The skill names tripwires that ask a session to reconsider its chosen work shape; they are guidance and create no required sequence or authorization. Each matches the law it reads: an open blocking question on the target trips the code that answers it and a statement of `defined` or `ready`, the rungs the question holds, never a `scoped` statement.
