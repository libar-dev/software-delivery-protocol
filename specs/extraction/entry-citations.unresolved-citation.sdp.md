---
id: spec:extraction.entry-citations.unresolved-citation
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.entry-citations
  verifies:
    target: spec:extraction.entry-citations
    exercises: [readerRows, citationRecipe, unresolvedReports]
---
# A citation of an entry its Spec lacks reports through the recipe, never as a Protocol finding

## Intent
- outcome: Execute the unresolved path on an anchored test file that names a Design key its Spec does not carry.
- assumption: The world writes the probe corpus and anchored test file of the test-title example, the title naming the address below. It derives the graph and reads the Spec context's entry citations, checks that the validation report holds no finding about the citation, then runs the shipped entry-citations file as a rules file as that example does.

```gwt
Given a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}
Given a source file that {anchored: "carries a test anchor verifying the Spec"} and names the address {address: "spec:probe.one#design.typeTwo"} on line {line: 9}
When the graph is derived
Then the Spec context lists {citations: 1} entry citations
Then the citation {recorded: "does not resolve"}
Then the shipped entry-citations file named as a rules file exits {exitCode: 1}
```
