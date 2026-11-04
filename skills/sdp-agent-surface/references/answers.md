# Read an empty answer

Read this before you report that something is absent, unbuilt, untested or unaffected. An empty
list or a zero covers only what its answer looked at:

- An empty `implementations` or `verifiers` list: nothing is bound, not that nothing is built or
  tested.
- Recipe 1, The build backlog, and recipe 33, The design backlog, leave out examples and
  decisions: an empty answer is absence within that selection only.
- `coverageUnknownFiles`: the graph records nothing at those files, so their reach is unknown,
  not empty. A Markdown deliverable such as a skill or a handbook is one: its realization anchor,
  when it has one, sits in a test file.
- `found: false`: the id is not in this graph. In a project, the Protocol's own Specs answer under
  the runner's `--protocol` (`adopter.md`).
- `floorReached: "ready"`: the floor allows `ready`; `statedReadiness` says whether anyone stated
  it.
- No findings: conformance and honesty hold, not that the design is right.
- A perspective that selects no member: read its `diagnostics` first.

The graph's shape hides three things. The edge types are closed (`spec:extraction.derive-graph`)
and live data shows only those in use, so an absent type is unused, not unknown. A Pack's
authored order is its `members`; `belongsTo` edges keep the global sort. Spec and Pack nodes carry
no line: read lines from `g.specContext(id).entryLocations` or `graph.locations`.
