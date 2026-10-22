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

A capability is read as a Pack, or as a projection over high-altitude behavior Specs that no view draws yet, so the lens groups by Pack and draws no capability tree. The index page holds it, because the Packs are where a reader of a design starts.

## Intent
- outcome: Let a person reach every Spec through the Packs that hold it, each Pack's members in the order its manifest gives.

## Behavior
- rule: [#landing] The Packs lens is the index page, the page a person lands on.
- rule: [#packGrouping] The Packs lens groups Specs by Pack, each Pack's members in authored order, and draws no capability tree.
- rule: [#everySpec] A Spec in no Pack is still listed, in the index's Specs section, so the lens hides no Spec.

## UI
- packsLens: the index page's Packs section, one closed disclosure per Pack in id order, its summary line the Pack's title, id and member count, its body the members in authored order with their rung badges.
