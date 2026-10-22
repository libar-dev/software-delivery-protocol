---
id: spec:decisions.epics-of-any-kind
kind: decision
altitude: feature
readiness: scoped
relations:
  refines:
    target: spec:consumers.capability-map
    reason: settles which Specs the capability map reads as epics
---
# Capability epics keep kind independent of altitude

## Intent

- outcome: Decide whether a capability map admits epics of every kind or only behavior epics.

### Open questions

- [blocking #epicKinds] Is a capability epic any Spec at epic altitude, or only a behavior Spec?
  - decider: owner
  - provisional: Admit every kind, preserving the identity and truth of existing model and rule hubs.

## Decision

- context: The ratified capability glossary limits the map to high-altitude behavior Specs, while kind and altitude are independent descriptors and existing model and rule hubs state capability outcomes.
- decision: Proposed for the owner, admit every Spec at epic altitude and retain its kind; broaden the capability glossary accordingly.
- rationale: Reusing the intended outcome's owner avoids behavior wrappers that repeat a model or rule solely to enter a view.
- alternative: Keep behavior-only capability epics and introduce behavior wrappers over the model and rule hubs, preserving the glossary's current boundary.
- consequence: The proposal changes a ratified term and needs the owner's decision before the capability map or the Protocol's epic organization states ready.
