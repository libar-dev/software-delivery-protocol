---
id: spec:consumers.spec-studio.verification-panels.rule-coverage
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.verification-panels
  verifies:
    target: spec:consumers.spec-studio.verification-panels
    exercises: [ruleCoverage]
---
# Each keyed rule shows the examples that exercise it, or that none does

## Intent
- outcome: Execute rule coverage on a Spec page: an exercised rule lists its example in words, and an unexercised rule says so.
- assumption: The world writes a root with one behavior Spec holding the rules keyed `paid` and `refunded` and one example child that verifies it, exercising `paid`, bound by a `specTest` anchor; it builds the page set and reads the Spec page beside each keyed rule.

```gwt
Given a Spec whose keyed rule {exercisedKey: "paid"} an enabled example exercises and whose keyed rule {otherKey: "refunded"} no example exercises
When the build renders the Spec's page
Then beside the first rule the panel lists the example as {enabledWords: "enabled"}
Then beside the second rule the panel reads {unexercised: "no example exercises it"}
```
