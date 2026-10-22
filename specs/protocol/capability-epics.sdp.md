---
id: spec:protocol.capability-epics
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  decidedBy: spec:consumers.capability-map.epic-kinds
  dependsOn:
    - target: spec:consumers.capability-map
      reason: the capability map exposes the corpus's authored refinement
    - target: spec:validation.readiness-floor
      reason: reparenting preserves the floor of each existing ready child
---
# The Protocol organizes its own features in capability epics

An epic states an enduring intended outcome. Where an existing hub owns an outcome, enlarging its altitude preserves its identity, kind, evidence and bindings. Self-hosting describes the Protocol using itself; it is not the parent of every capability offered to an adopter.

## Intent

- outcome: Organize the Protocol's capabilities through explicit refinement so a reader can choose a capability and inspect its design and bindings.

## Behavior

- rule: [#epicHome] Enrich an existing hub to epic altitude when its intended outcome already names the capability. Keep its id, kind and truth; author a new epic only when no existing Spec owns that outcome. A model or rule can be an epic without becoming behavior merely to appear in the map.
- rule: [#refinement] Each feature belongs under the epic whose intended outcome it makes more precise, directly or through intermediate Specs. Existing genuine refinement remains, including a nested epic and multiple parents. A Pack, path or dependency alone does not establish that relationship.
- rule: [#selfHosting] The self-hosting epic keeps the Protocol's own use of the carrier, structural binding, roadmap and capability organization, and the decisions about that practice and the Protocol's identity. General model, derivation, validation and projection capabilities no longer refine self-hosting merely because the corpus exercises them.
- rule: [#preserveEvidence] A re-altituded hub keeps its readiness statement when its content still supports it; reparenting confers no delivery fact and adds no anchor.

## Design

- epicHome: reuse an existing outcome owner so altitude changes do not duplicate intent; add an epic only for an outcome no hub already states. Design iteration has no epic: no Spec owns that outcome, its features are views and reader recipes that refine the projection and agent capabilities, and its Pack already groups them for review.
- carrierHome: the Markdown hub names the default authoring entry, while its rule puts Markdown and TypeScript on one graph path and its carrier ruling admits Gherkin. Its existing descendants refine that shared authoring outcome, so it keeps its identity and title.
- executableHome: the runner owns step dispatch and failure rendering, and contract generation owns typed contracts. Neither owns the whole outcome of executing an example against its authored intent, so a separate executable-examples epic joins those refinements. Their other genuine refinement and dependency relations remain.
- nestedEpic: the agent capability remains a refinement of the projection capability because scripted graph access is a consumer-specific view. Its descendants belong to both epic scopes, and the map reports that overlap explicitly.
- corpusChecks: corpus-selected rules refine the agent capability because their intended operation is scripting the graph; the validation command is their host, while their findings remain outside the Protocol's conformance and honesty families. A refinement states the narrower outcome and a dependency states what must hold: both relations intentionally connect the build pipeline to derivation, corpus rules to the agent capability, and architecture and external-register checks to corpus rules.

## Verification — reviewed

- Re-measure the corpus's refinement transitions, roots, overlapping parents and epic reach from the graph.
- Every previously ready Spec still states ready and reaches the ready floor after the edits; the drift alarm stays empty.
- Compare the capability map before and after authoring the epics, and read the same projection on an adopter with one broad epic without changing its intent.
