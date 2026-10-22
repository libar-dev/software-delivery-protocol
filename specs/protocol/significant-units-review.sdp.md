---
id: spec:protocol.significant-units-review
kind: behavior
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:protocol.structural-self-binding
    reason: states what the independently reviewed accepted set must contain and exclude
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

- outcome: Keep the accepted set focused on the engine's significant contracts, decisions and stages, with meaningful roles and architectural uses, and exclude units anchored only for coverage.

## Behavior

- rule: [#significantAbstractions] Apply the structural-patterns criterion to the public contract or cross-component responsibility a unit owns. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters qualify when changing them requires a designer or builder to understand that responsibility; being exported alone is insufficient.
- rule: [#curatedBoundary] Leave forwarding barrels, empty element registrations, mechanical wrappers, formatting helpers and generated files unanchored unless they own an independent contract or architectural responsibility. A coverage target, test expectation, file count or desired impact answer never establishes significance.
- rule: [#dependencyEvidence] Declare a component uses for a value or type import the importing file itself makes from another component's file. An import made only to author anchors, and a pair the imports adapter reports only through a re-export the importer does not use, confer no edge. Before calling a declared edge stale, inspect input omissions and every file the comparison leaves unassigned. Import evidence proposes an edit and never authors an edge.
- rule: [#rosterOracle] The self-hosting suite pins the reviewed component identities, unit ownership, roles, uses and deliberate membership exceptions independently of extraction. It compares the graph with those declarations and rejects unrostered membership. It never derives its expected roster from paths, exports, imports or the graph under test.
- rule: [#acceptedChanges] The accepted set is the annotation review's change table as the owner accepted it: its additions, merges, drop, role changes and component uses, each realization claim it names kept.
- rule: [#decoderBoundary] The example-space decoder joins the reader component, leaving notation a leaf codec, only when the architecture crossings recipe and the self-binding tests show that the move adds no layer crossing; otherwise it stays in notation, its real imports are declared, and the uses cycle they form stays lawful data.
- rule: [#roleMeaning] Read role meanings from the engine's role-vocabulary Model when reviewing its anchors. The vocabulary guides authors and reviewers; the Protocol never validates membership in it.

## Design

- rosterSource: The self-hosting oracle holds the accepted roster: each row names an accepted unit's anchor, its component and its file, and its expectations for components, membership, uses, exceptions, coarse-grain coverage and roles sit beside it. A symbol suffix is a review locator, never extracted symbol identity.

## Verification — reviewed

- Compare the independently reviewed accepted roster with the source responsibilities it names, including dependencies that an imports comparison cannot assign to components.
- Check that every proposed merge or drop preserves the whole-Spec realization set it claims to preserve and that every architectural uses pair has supporting value or type imports beyond anchor authoring.
- Compare the extracted graph with the independently reviewed oracle roster after anchor changes; exercise a missing accepted member and an extra unrostered membership to show that the roster comparison detects both.
