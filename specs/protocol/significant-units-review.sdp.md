---
id: spec:protocol.significant-units-review
kind: behavior
altitude: feature
readiness: defined
relations:
  refines:
    target: spec:protocol.structural-self-binding
    reason: re-measures the accepted set against the significance criterion and the code as it stands
  dependsOn:
    - spec:model.structural-patterns
    - spec:protocol.role-vocabulary
  decidedBy:
    - spec:decisions.anchor-binding-grain
    - spec:decisions.architectural-annotation
---
# The engine's accepted set covers its significant abstractions and only those

A designer needs to find the contracts, decisions and stages a change must preserve. The accepted set records those units on the code that owns them. Exporting a helper, appearing in an import ranking or giving a file an impact answer does not by itself earn an identity.

## Intent

- outcome: Review every engine anchor and every unanchored abstraction against the significance criterion, so the accepted set names the engine's ports, contracts, pipeline stages and shared shapes with their roles and architectural uses, and drops units anchored for coverage.

### Open questions

- [non-blocking #acceptedRoster] Which proposed anchor and dependency changes does the owner accept after reading the curation record?
  - decider: owner
  - provisional: The record proposes the changes; the existing oracle roster remains the accepted declaration until the owner reviews its replacement.

## Behavior

- rule: [#significantAbstractions] Apply the structural-patterns criterion to the public contract or cross-component responsibility a unit owns. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters qualify when changing them requires a designer or builder to understand that responsibility; being exported alone is insufficient.
- rule: [#curatedBoundary] Leave forwarding barrels, empty element registrations, mechanical wrappers, formatting helpers and generated files unanchored unless they own an independent contract or architectural responsibility. A coverage target, test expectation, file count or desired impact answer never establishes significance.
- rule: [#completeReview] The curation record accounts for every existing code anchor and every source file considered, records a reason for keeping, re-roling, merging or dropping each identity, and names the significant abstractions missing from the graph. Test and oracle bindings remain evidence bindings, outside the engine's architectural roster.
- rule: [#oneOwner] Keep one file owner for each identity. Several promises realized by the same responsibility normally share an anchor with plural targets; distinct responsibilities in one file may keep distinct identities when the record explains their separate design use.
- rule: [#preservePromises] A merge transfers every realization target to a surviving unit that realizes the same promises, and checks the resulting set of satisfying units against the whole Spec. A drop states which surviving units retain each promise, or identifies the false claim being removed; a cleanup never silently removes a realization claim.
- rule: [#dependencyEvidence] Review every directed component pair present in anchored uses or inferred imports. Declare architectural value and type dependencies, exclude imports used only to author anchors, and inspect input omissions and unassigned files before calling an edge stale. Import evidence proposes an edit and never authors an edge.
- rule: [#rosterOracle] The self-hosting suite pins the reviewed component identities, unit ownership, roles, uses and deliberate membership exceptions independently of extraction. It compares the graph with those declarations and rejects unrostered membership. It never derives its expected roster from paths, exports, imports or the graph under test.
- rule: [#helperCoverage] The record names the consuming responsibility for a bare helper without pretending the helper's file has a binding. A type or port with an independent contract may qualify without a separate realization target; identity-only anchors remain lawful.
- rule: [#roleMeaning] Read role meanings from the engine's role-vocabulary Model when reviewing its anchors. The vocabulary guides authors and reviewers; the Protocol never validates membership in it.

## Design

- rosterSource: `acceptedArchitecturalUnits` in `test/self-hosting-oracle/structural-edges.ts` names each accepted unit, its anchor and its component. The unit's file is checked against the extracted anchor; a symbol suffix is a review locator, never extracted symbol identity.
- rosterExpectations: `expectedComponentIds`, `expectedMemberOfEdges`, `expectedUsesEdges`, `structuralMembershipExceptions` and `coarseGrainCoverage` remain the independent expectations beside the unit roster. Roles, layers and contexts are pinned with the anchor expectations. Updating a total without reviewing these rows is insufficient.
- reviewColumns: Each proposed anchor names its id, file, form, role, component, satisfies targets, references targets and uses targets. An omitted target list is recorded as empty. Each existing identity has a disposition and a reason, and each removed realization target has a named destination or a false-claim explanation.
- componentMap: The record opens with each component's responsibility and its significant contracts, stages and decisions, followed by the complete change tables. The map explains why a contributor would open a unit, rather than listing every declaration in its file.
- dependencyColumns: Each pair records the anchored declaration, the source files supporting the value or type import, the proposed action and its reason. The record distinguishes anchor-authoring imports, external-input omissions and a dependency a bare helper hides from the recipe.
- reviewEvidence: Component membership, uses reach, structural coverage, architecture, design references, role taxonomy, architecture crossings, curation and planned-component comparison are re-derived when the record is reviewed. Source reading settles significance; a recipe's ranking is advice.
- registerView: A proposed architecture-page register groups the graph's recorded members by role within their recorded component, retains a not-stated group, and shows labels, file locations and realization and reference targets separately. Components and units without membership remain visible. A row carries no accepted or reviewed badge because an anchor records neither verdict. The page reads no review Markdown as graph truth.

## Verification — reviewed

- Review the component map and every disposition against the source at the commit under review, including the source files the curation report cannot assign to components.
- Check that every proposed merge or drop preserves the whole-Spec realization set it claims to preserve and that every architectural uses pair has supporting value or type imports beyond anchor authoring.
- Compare the extracted graph with the independently reviewed oracle roster after anchor changes; exercise a missing accepted member and an extra unrostered membership to show that the roster comparison detects both.
- Render the proposed register on the self-hosted corpus and an adopter corpus, with omitted roles and memberships visible and without reading the review record as graph data.
