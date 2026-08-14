---
id: spec:carrier.gherkin-authoring
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  decidedBy: spec:decisions.gherkin-carrier-option
  dependsOn: spec:carrier.slot-notation
---
# Gherkin authoring enters the one graph

## Intent
- outcome: Author behavior and example Specs in Gherkin without creating a second graph or execution path.

## Behavior
- rule: One `.sdp.gherkin` file carries exactly one behavior Spec as its Feature and zero or more example Specs as ordinary Scenarios, with one canonical carrier surface per Spec ID.
- rule: Feature and ordinary Scenario tags carry exactly one identity, altitude, and readiness; kind is structural, Pack membership stays manifest-owned, and authored delivery facts, claims, lifecycle state, and workflow status are refused.
- rule: The closed relation tags map one-for-one to declared `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, and `verifies` relations, while an ordinary Scenario defaults `refines` and `verifies` to its Feature unless that relation type is explicit.
- rule: Closed keyed description bullets populate existing intent and verification fields; remaining non-heading prose belongs to narrative; unknown keys and heading-shaped lines are refused at their exact physical source line despite blanks and comments; no Gherkin form is invented for open questions.
- rule: Trailing title-only Rule blocks populate behavior rules in source order; a Rule carrying tags, description, or positionally nested children is refused.
- rule: At most one `@example-space` pseudo-scenario supplies the parent vocabulary without producing a Spec node, while each ordinary Scenario supplies exactly one bound example point.
- rule: An ordinary Scenario and an `@example-space` pseudo-scenario must each carry at least one step; a step-less Scenario is refused at its Scenario line without inventing a complete-GWT rule.
- rule: Gherkin steps reuse the Protocol-owned slot notation; conjunctions inherit the preceding phase, and outlines, backgrounds, star steps, doc strings, data tables, and leading conjunctions are refused.
- rule: Independent semantic Gherkin findings accumulate in physical source order up to a hard cap of 100; any semantic finding excludes the entire invalid carrier from the graph while healthy sibling files survive.
- rule: Gherkin is a canonical authoring carrier rather than a Cucumber execution path; generated contracts and resolving code-side anchors remain the execution and delivery-fact boundary.

## Example space
```gwt-vocabulary
Given the Gherkin fixture corpus {probe:string}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount:number} findings
Then validation reports {findingCount:number} findings
Then the first finding is {findingId:string} at line {line:number}
Then the report contains finding {findingId:string}
Then the graph contains exactly {specCount:number} Specs
Then the graph contains the Spec {specId:string} with kind {specKind:"behavior"|"example"}
Then the graph contains the child Spec {childId:string} with kind {specKind:"behavior"|"example"}
Then the child Spec {childId:string} declares {relationType:string} to {relationTarget:string}
Then the child Spec {childId:string} declares the additional relation {relationType:string} to {relationTarget:string}
Then the graph omits the Spec {absentId:string}
Then no graph edge names the absent Spec {absentId:string}
Then the parent example space contains {spaceStep:string}
Then the graph for {parityLeft:string} equals the graph for {parityRight:string}
Then the contracts for {parityLeft:string} equal the contracts for {parityRight:string}
```
