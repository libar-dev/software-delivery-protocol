---
id: spec:protocol.capability-epics
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:protocol.self-hosting
  dependsOn:
    target: spec:consumers.capability-map
    reason: the epics are what the capability map draws for the Protocol's own corpus
---
# The Protocol organizes its own features in capability epics

The Protocol's corpus states one epic, self-hosting, and every other feature refines a feature or that epic, so its capabilities read as one tree under one root. Each capability the Protocol offers, the authored model, the carriers, the one graph, the checks, the agent surface, the human views and design iteration among them, deserves an epic of its own that its features refine.

## Intent

- outcome: State each of the Protocol's capabilities as an epic that its top features refine, so the Protocol's own capability map shows its capabilities, how far each is designed, and how far each is built.

### Open questions

- [blocking #epicHome] Does a capability's epic restate the hub Spec that already carries the capability, enriched in place to `epic`, or is it a new Spec the hub refines?
  - decider: delegated
  - provisional: enrich the hub in place where its outcome already is the capability; author a new epic only where no Spec states the capability
