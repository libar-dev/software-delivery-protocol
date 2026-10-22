---
id: spec:consumers.spec-studio.lenses.packs
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.lenses
  dependsOn:
    target: spec:extraction.pack-member-order
    reason: the lens lists each Pack's members in the order its manifest gives
---
# The Packs lens groups every Spec by the Packs that hold it

Packs collect Specs for review, while the separate Capabilities page reads authored refinement. The index remains the landing page and keeps each Pack's members in authored order.

## Intent
- outcome: Let a person reach every Spec through the Packs that hold it, each Pack's members in the order its manifest gives.

## Behavior
- rule: [#landing] The Packs lens is the index page, the page a person lands on.
- rule: [#packGrouping] The Packs lens groups Specs by Pack, each Pack's members in authored order. The separate Capabilities page reads refinement; selecting an epic narrows the index's Specs section without changing any Pack.
- rule: [#everySpec] A Spec in no Pack is still listed, in the index's Specs section, so the lens hides no Spec.

## UI
- packsLens: the index page's Packs section, one closed disclosure per Pack in id order, its summary line the Pack's title, id and member count, its body the members in authored order with their rung badges.
