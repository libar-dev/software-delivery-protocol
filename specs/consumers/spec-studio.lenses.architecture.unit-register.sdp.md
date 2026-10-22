---
id: spec:consumers.spec-studio.lenses.architecture.unit-register
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.lenses.architecture
---
# The architecture page lists each component's significant units by role

A contributor about to change the engine needs the curated register of its significant units: the ports, contracts, pipeline stages and catalogs each component owns, and the designs each unit realizes or answers to. The graph already records them on the anchors. This panel reads them there, grouped by component and role, and shows what no anchor states rather than guessing it.

## Intent

- outcome: Let a contributor find recorded units and their design bindings through their component and role, with omitted structure visible.

## Behavior

- rule: [#recordedOnly] The architecture page groups recorded members by role within each recorded component, and shows a component's own source binding apart from its members. A row shows the recorded id, label, file and line and its satisfies and references targets separately. The page reads graph bindings only, never an annotation review or oracle source file.
- rule: [#omissions] Keep a not-stated role group and a no-component section. A binding confers no review approval or execution verdict, and the page shows no inferred accepted badge.
- rule: [#roleTokens] Show each recorded role token without interpreting it through a Protocol-corpus Spec id. An adopter's unfamiliar roles remain visible and produce no finding.
- rule: [#stableOrder] Sort components by id, role groups by token and members by id in code-unit order, with not-stated roles last and the no-component section after the components.
- rule: [#staticAccess] Every row is available without script through native disclosures. The component index links to the existing component section ids, and narrow screens retain readable source paths and separate realization and reference lists.

## Verification — reviewed

- Render the self-hosted corpus and an adopter with unfamiliar roles, omitted roles and omitted membership. Check ordering, component source rows, target separation, keyboard disclosures and narrow-screen overflow, with no inferred approval badge.
