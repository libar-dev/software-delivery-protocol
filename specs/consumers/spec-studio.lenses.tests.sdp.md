---
id: spec:consumers.spec-studio.lenses.tests
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.lenses
  dependsOn:
    - target: spec:model.rule-keys
      reason: rule coverage counts the keyed rules examples exercise
    - target: spec:consumers.agent-surface.example-space-coverage
      reason: a row reads its example space's uncovered values from recipe 44
    - target: spec:observation.run-evidence
      reason: with run records, a row adds the results recipe 45 joins from its verifiers' files
  decidedBy:
    - spec:decisions.binding-not-liveness
    - spec:decisions.verification-posture-not-realization
---
# The tests lens shows how far each Spec's verification reaches

A verifier binding states that a verifier exists, and pass and fail stay in CI, so the lens shows bindings and coverage. It shows a run result only when the build was given run records, and then as evidence from a test file, never as a verdict on a Spec.

## Intent
- outcome: Let a person see, for every Spec, whether a verifier is bound, which keyed rules an example exercises, and which example-space values no example binds.

## Behavior
- rule: [#coverageRows] The lens lists one row per Spec that is not an example, in id order: its verifier binding as present or none, with its verifiers and how many are enabled; its keyed rules with how many an enabled example exercises, from recipe 34; its unkeyed rules, counted apart because the graph cannot tell which examples exercise a rule with no key; and, when it owns an example space, its uncovered values and the examples that leave a slot unbound, from recipe 44. Each row links to the verification panel of the Spec's page.
- rule: [#bindingsOnly] The lens shows verifier bindings and states no run result of its own; with the run records input, a row adds how many of the results recipe 45 joins from its verifiers' test files passed, failed, were skipped, pending or other, labelled as external run evidence from those files and never as a verdict on the Spec or on one verifier.
- rule: [#filters] Filters narrow the rows by verifier binding, by whether a keyed rule goes unexercised, by whether an example-space value goes uncovered, and by Pack, and the section says how many rows it shows; without script every row shows.
- rule: [#testsSummary] The page opens with sentences the build counts from the recipes' answers: the Specs with and without a verifier binding, the keyed rules exercised and unexercised, the unkeyed rules, the example spaces with an uncovered value, and, with run records, the inputs it names.

## UI
- testsPage: in order, the page title `Tests`, the summary sentences, the filter bar, and the rows, each a line that wraps on a narrow screen.
- coverageRow: the Spec's title linked to its page's verification panel, its id as code, then as plain text: verifier binding present or none with `<n> verifiers, <m> enabled`, `<e> of <k> keyed rules exercised`, `<u> unkeyed rules`, and `<v> uncovered values` when it owns an example space; with run records, `external run evidence:` and the count of each result.
- filterBar: one labelled select per filter, each listing any and the values the rows hold, and a line saying how many of all rows show.

## Example space
```gwt-vocabulary
Given a Spec with {keyed:number} keyed rules and {unkeyed:number} unkeyed rules
Given an example bound to a test anchor that exercises {exercised:number} of those keyed rules
When the build renders the tests lens
Then the Spec's row reads {coverage:string}
Then the Spec's row reads its verifier binding as {binding:"present"|"none"}
```
