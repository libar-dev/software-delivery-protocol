---
id: spec:consumers.shipped-protocol-corpus
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.authoring-on-ramp
---
# The package ships the Specs its skills cite

## Intent
- problem: The shipped skills and recipes cite Specs by id. An adopter that installs the package has no Spec to read, and an adopter that runs the CLI from a source checkout has the Specs on disk and no pointer to them.
- outcome: Ship the Protocol's own corpus in the package and point at it from the CLI, so every cited Spec id leads either adopter to a readable carrier.

## Behavior
- rule: The published package includes the Protocol's Spec and Pack carriers under `specs/`.
- rule: An adopter reads a cited Spec through the front door by selecting the package directory, installed or checked out, as the root, or by opening the carrier file. `sdp --help` names that path, as `spec:consumers.adopter-on-ramp` requires.
- rule: Discovery never descends into `node_modules`, so the shipped corpus never enters an adopter's own graph.
- rule: The package ships no source anchors. A graph derived from the shipped corpus answers what the Protocol intends and never what it has realized, so its delivery facts and gap warnings are not evidence about the Protocol.
