---
id: spec:consumers.shipped-protocol-corpus
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.authoring-on-ramp
  dependsOn:
    target: spec:extraction.excludes
    reason: the shipped corpus stays out of an adopter's graph under its canonical discovery rules
---
# The package ships the Specs and on-ramps its skills cite

The skills and the recipe catalog also send their reader to the glossary, and the catalog to the decision registry, so both ship beside the Specs. An installed package sits under `node_modules`, which discovery skips, so the shipped Specs never mix into an adopter's own graph.

## Intent
- problem: The shipped skills and recipes cite Specs by id. An adopter that installs the package has no Spec to read, and an adopter that runs the CLI from a source checkout has the Specs on disk and no pointer to them.
- outcome: Ship the Protocol's own corpus in the package and point at it from the CLI, so every cited Spec id leads either adopter to a readable carrier.

## Behavior
- rule: Beside the runtime and runnable recipe files in `dist/`, the package ships the Protocol's Spec and Pack carriers under `specs/`, the glossary `CONTEXT.md`, the decision registry `docs/concept/DECISIONS.md`, the reading, authoring and session skills under `.agents/skills/`, the recipe catalog and architecture walkthrough under `docs/agent-surface/`, and the change-proposal schema under `schemas/`; package metadata, README and license files also ship.
- rule: An adopter reads a cited Spec through the front door by selecting the package's `specs/` directory, installed or checked out, as the root, or by opening the carrier file. `sdp --help` names that path, as `spec:consumers.adopter-on-ramp#rule.helpNamesOnRamps` requires.
- rule: The shipped corpus stays outside an adopter's own graph under the canonical discovery rules in `spec:extraction.excludes`.
- rule: The package ships no source anchors. A graph derived from the shipped corpus answers what the Protocol intends; its delivery facts are empty, and verifier-gap and example-verifier-linkage warnings caused by the absent bindings are not evidence about the Protocol's realization.
