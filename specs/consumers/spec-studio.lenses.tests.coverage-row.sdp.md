---
id: spec:consumers.spec-studio.lenses.tests.coverage-row
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.lenses.tests
  verifies:
    target: spec:consumers.spec-studio.lenses.tests
    exercises: [coverageRows]
---
# A Spec's row on the tests lens counts its exercised keyed rules

## Intent
- outcome: Execute a tests-lens row: the keyed rules an enabled example exercises against those it does not, and the unkeyed rules apart.
- assumption: The world writes a root with one behavior Spec whose Behavior section holds two keyed rules and one unkeyed rule, and one example child that verifies it, exercising the first key, bound by a `specTest` anchor in a test file; it builds the page set and reads the Spec's row on the tests page.

```gwt
Given a Spec with {keyed: 2} keyed rules and {unkeyed: 1} unkeyed rules
Given an example bound to a test anchor that exercises {exercised: 1} of those keyed rules
When the build renders the tests lens
Then the Spec's row reads {coverage: "1 of 2 keyed rules exercised"}
Then the Spec's row reads its verifier binding as {binding: "present"}
```
