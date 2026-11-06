---
id: spec:consumers.adopter-on-ramp.mini-example
kind: behavior
altitude: story
readiness: idea
relations:
  refines:
    target: spec:consumers.adopter-on-ramp
    reason: a newcomer learns the homes and grammar the on-ramps teach from a corpus small enough to read whole
  dependsOn:
    - target: spec:consumers.spec-studio.publisher
      reason: the walkthrough reads the page set the publisher writes from the example's own root
    - target: spec:extraction.delivery-facts
      reason: the example's one code anchor and one bound test show the facts this law derives from bindings
---
# A newcomer learns the Protocol from one small worked corpus

The worked example beside the engine, checkout-v1, covers all eight kinds so the carriers could be designed and tested against it, which makes it a lab rather than a first read. This example specifies one small, real part of this repository, the temporal guard that keeps session handles and calendar dates out of files meant to stay true. A newcomer then learns the method on a subject that needs no invented business domain, and sees why git, not a durable file, records when something happened. Each rung is shown by a different Spec in its final state, read at one commit, because a series of commits replaying one Spec's growth would need rewriting each time the Protocol changes a shape, which it does outright, with no compatibility path.

## Intent

- actor: A newcomer to the Protocol who has read none of its Specs and opens this example first.
- problem: A newcomer who opens the Protocol meets either its own corpus of several hundred Specs or a lab example built to cover every kind, and neither can be read whole before the method makes sense.
- outcome: A newcomer reads one small corpus whole, from intent to a bound test, and on one screen sees a Spec at each readiness rung, the relations between them and the facts the graph derives.

### Open questions

- [blocking #realTool] Does this repository's gate run the example's temporal guard, or does the example keep a smaller copy beside the root script?
  - decider: owner
  - provisional: the gate runs the example's guard, so one implementation exists and the example is a small package this repository uses the way an adopter would
- [non-blocking #placement] What is the example called, and where does its corpus live?
  - decider: owner
  - provisional: `examples/temporal-guard/`, with its Spec ids in a `temporal` family
- [blocking #datedInputs] The guard refuses an ISO date or a session handle in every file it sweeps outside the folders it exempts at the repository's root, so how do the example's Specs and test state the tokens it bans without tripping it?
  - decider: owner
  - links: spec:consumers.adopter-on-ramp.mini-example#question.realTool, spec:consumers.adopter-on-ramp.mini-example#question.placement
  - provisional: the test builds each banned token from parts at run time, as the guard's own test does, and the example Specs describe the token rather than write it, so the guard sweeps the example with no new exemption
- [non-blocking #expectedFindings] Which warnings does this repository's gate expect when it checks the example's corpus?
  - decider: owner
  - provisional: none, as for checkout-v1: every `ready` Spec of the example outside its decisions has a verifier

## Behavior

- rule: [#realSubject] The example specifies this repository's temporal guard, which keeps session handles and calendar dates out of files meant to stay true, and invents no business domain.
- rule: [#oneSpecification] The example's Specs are the temporal guard's only specification: no Spec in this repository's own corpus specifies the guard.
- rule: [#everyRung] Each of the four readiness rungs, `idea`, `scoped`, `defined` and `ready`, is stated by at least one of the example's Specs.
- rule: [#composition] The example holds one feature with two examples, one rule, one Pack and two decision records, one of which shows the alternative it refused.
- rule: [#bindings] The example's code carries one code anchor and its test one test anchor, so the graph derives `implemented` and `has-verifier` from them.
- rule: [#sizeBound] The example's tree holds fewer than 15 authored files, so a newcomer sees it whole on one screen.
- rule: [#walkthrough] The walkthrough is the example's own Studio pages plus a short guided path, and it moves across the example's Specs as they stand at one commit, never through a series of commits.
- rule: [#pagesPublished] The example's Studio pages are published from its Specs and never committed.
- rule: [#inGate] This repository's gate derives and validates the example's corpus beside checkout-v1, which stays the lab, and fails on any error finding the example reports.
