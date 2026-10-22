---
id: spec:protocol.capability-epics
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  dependsOn:
    - target: spec:consumers.capability-map
      reason: the capability map exposes the corpus's authored refinement
    - target: spec:validation.readiness-floor
      reason: reparenting preserves the floor of each existing ready child
---
# The Protocol organizes its own features in capability epics

An epic states an enduring intended outcome. The Protocol's existing hub Specs already own those outcomes, so enlarging their altitude preserves their identity, kinds, evidence and bindings. Self-hosting describes the Protocol using itself; it is not the parent of every capability offered to an adopter.

## Intent

- outcome: Organize the Protocol's capabilities through explicit refinement so a reader can choose a capability and inspect its design and bindings.

## Behavior

- rule: [#epicHome] Enrich an existing hub to epic altitude when its intended outcome already names the capability. Keep its id, kind and truth; author a new epic only when no existing Spec owns that outcome. A model or rule can be an epic without becoming behavior merely to appear in the map.
- rule: [#refinement] Each feature belongs under the epic whose intended outcome it makes more precise, directly or through intermediate Specs. Existing genuine refinement remains, including a nested epic and multiple parents. A Pack, path or dependency alone does not establish that relationship.
- rule: [#selfHosting] The self-hosting epic keeps the Protocol's own use of the carrier, structural binding, roadmap and capability organization, and the decisions about that practice and the Protocol's identity. General model, derivation, validation and projection capabilities no longer refine self-hosting merely because the corpus exercises them.
- rule: [#preserveEvidence] A re-altituded hub keeps its existing readiness statement when its content still supports it. Every new parent of a ready Spec states at least defined and clears that floor. Reparenting confers no implementation or verifier fact, and no anchor is added to make a capability appear complete.
- rule: [#reviewHomes] Review the capability map, readiness divergence, lower ladder and changed Specs' promotion preflight after changing a parent or altitude. The review reports uncovered Specs and unchanged or lower floors; it never authors a delivery fact or imposes a quota of epics.

## Design

- epicHome: the delegated ruling chooses existing outcome owners. The carrier hub owns authoring into the one graph; the core model owns the stable Spec shape; derivation owns the carrier-neutral graph; the check-family hub owns conformance and honesty; projections owns consumer views; the agent hub owns scripted graph access; the authoring on-ramp owns enrichment and review; and the example runner owns executing bound steps. Their existing titles, kinds and outcomes remain authoritative.
- nestedEpic: the agent capability remains a refinement of the projection capability because scripted graph access is a consumer-specific view. Its descendants belong to both epic scopes, and the map reports that overlap explicitly.
- corpusChecks: corpus-selected rules refine the agent capability because an operator scripts the graph. Architecture walks and external-register checks refine corpus-selected rules. They remain outside the Protocol's conformance and honesty families.
- broadRoots: component designs refine the core model; run evidence and runtime observations refine projections; the build flow and determinism refine graph derivation; duplicate identity and readiness floors refine the check-family capability. These relationships describe intended truth, not a folder taxonomy.

## Verification — reviewed

- Re-measure the corpus's refinement transitions, roots, overlapping parents and epic reach from the graph.
- Every previously ready Spec still states ready and reaches the ready floor after the edits; the drift alarm stays empty.
- Compare the capability map before and after authoring the epics, and read the same projection on an adopter with one broad epic without changing its intent.
