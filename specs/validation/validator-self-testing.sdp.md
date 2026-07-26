---
id: spec:validation.validator-self-testing
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Every validator ships evidence in both directions

## Intent
- outcome: Keep a validator that has silently stopped firing from reading as a clean build.

## Rule
- Each validator ships evidence in both directions: at least one input it must refuse, and at least one it must accept.
- The should-fail half is what catches the regression that matters most — a validator that no longer fires reports nothing, and nothing is indistinguishable from a clean graph unless something asserts the refusal.
- The should-pass half bounds the first: a validator that refuses everything is as useless as one that refuses nothing, and only an accepted input separates the two.
- This is evidence discipline over the two check families, never a check of its own. No validator polices whether another validator carries tests: that would police the delivery process rather than conformance or honesty, which the standing guardrail forbids.
- The discipline is cheap by construction — a probe world per direction — and it is stated here so the two families are read as checks that are themselves checked.
