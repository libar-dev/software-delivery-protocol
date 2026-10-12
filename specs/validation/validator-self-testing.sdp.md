---
id: spec:validation.validator-self-testing
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Every validator ships evidence in both directions

A validator that stops firing reports nothing, and an empty report looks like a clean graph unless a test asserts the refusal. A validator that refuses every input is just as useless. Refusing and accepting inputs, one probe world per direction, tell the two failures apart, so the check families are themselves checked. No validator checks this discipline, because the Protocol's checks concern conformance and honesty, never the delivery process.

## Intent
- outcome: Keep a validator that has silently stopped firing from reading as a clean build.

### Open questions
- [non-blocking #evidenceAudit] Does every shipped validator, and every extraction refusal if those count as validators, carry both a refusing and an accepting test, and which suite binds this Spec as its verifier?
  - decider: owner
  - provisional: enumerate graphValidatorIds against accepting and refusing tests, then bind the suite

## Rule
- [#bothDirections] Each validator ships evidence in both directions: at least one input it must refuse and at least one it must accept.
- The discipline is evidence over the two check families, never a check of its own; no validator checks whether another validator carries tests.
