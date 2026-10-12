---
id: spec:consumers.spec-studio.data
kind: contract
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.reader
    - spec:extraction.pack-member-order
    - spec:validation.next-rung-floor
    - spec:consumers.pack-design
    - spec:extraction.entry-locations
  constrainedBy: spec:extraction.determinism
---
# The Studio hydrates from the serialized graph and the reader's values

## Intent
- outcome: Give every Studio page its data as files the build writes beside it, so the page reads the graph the agent surface reads and derives nothing of its own.
### Open questions
- [non-blocking #aiSlices] The original hydrates the Studio from AI slices beside the graph and the validation report; the context bundle is a catalog recipe composed on each invocation and never saved, so no Spec states a saved slice. Does the Studio's data hold a slice, and which Spec would state it?
  - decider: owner

## Contract
- The Studio hydrates from data files under `generated/spec-studio/data/`, written by the build that writes its pages.
- Each data file holds values the graph serializes or the reader returns, and the page follows `spec:consumers.spec-studio`'s rule against recomputing graph joins, claims, delivery facts, readiness and floor failures.
- A page embeds the data it reads in one `script` element of type `application/json` with the id `sdp-graph`, parses it once into `window.__sdp__.graph`, and every element on the page reads from that one object.

## Design
- graphFile: the serialized graph exactly as `sdp build` writes `generated/graph.json`, with its `schemaVersion`.
- reportFile: the validation report, the findings the reader returns from `findings()`.
- specContexts: for each Spec, the reader's `specContext` value whole: descriptors, narrative, sections, `designColumns`, stated and derived readiness, `floorFailures`, the stated next rung with `statedNextRungFailures`, the floor's `nextRungFailures`, relations both ways with their reason and exercises when present, implementations, references, verifiers, the oracle binding when present, `entryLocations` and findings.
- packContexts: for each Pack, the reader's `packContext` value whole: framing, model references, members in authored order with each member's stated next rung, design columns and bindings, verifier gaps, boundary and findings.
- searchIndex: for each node, the fields the reader's `findByConcept` matches: id, title, anchor label, Pack framing, narrative and section content, so a search on the page matches what the concept entry matches.
