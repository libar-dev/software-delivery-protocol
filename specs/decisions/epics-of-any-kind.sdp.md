---
id: spec:decisions.epics-of-any-kind
kind: decision
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:consumers.capability-map
    reason: settles which Specs the capability map reads as epics
  dependsOn:
    target: spec:decisions.one-primitive
    reason: kind and altitude are independent named coordinates on the one primitive
---
# Capability epics keep kind independent of altitude

## Intent

- outcome: Decide whether a capability map admits epics of every kind or only behavior epics.

## Decision

- context: The glossary row for capability and domain names a Capability Map over high-altitude behavior Specs, while kind and altitude are independent descriptors on the one primitive, and the hubs that already state the Protocol's capabilities include a domain model, a projection model and the rule that separates the two check families.
- decision: Any Spec stated at epic altitude is an epic, whatever its kind, and keeps its kind: the capability map reads every epic and its refinement descendants, and the glossary row broadens from high-altitude behavior Specs to epic Specs of every kind.
- rationale: Hard to reverse: corpora organize their capabilities around which Specs may be epics, and the capability map, its page and the upgrade guide read that choice. Surprising without context: the ratified glossary row limited the map to behavior Specs, so a reader needs to know why a model or a rule now heads a capability. A real trade-off: an epic of any kind keeps the Spec that already owns a capability's outcome as its head, as the one-primitive decision's named coordinates already imply, against a map whose roots differ in kind and a glossary row that changes.
- alternative: Keep behavior-only capability epics and introduce behavior wrappers over the model and rule hubs: each wrapper would restate an outcome another Spec already owns, a second owner that drifts, only so that a view can read it.
- consequence: The capability map draws epics of every kind, each labelled with its kind, and a Spec's kind never decides whether it heads a capability.
- consequence: The glossary row for capability and domain names a Capability Map over epic Specs of every kind and their refinement descendants.
