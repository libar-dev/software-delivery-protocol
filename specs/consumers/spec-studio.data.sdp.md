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
  constrainedBy: spec:extraction.determinism
---
# The Studio hydrates from the serialized graph and the reader's values

## Intent
- outcome: Give every Studio page its data as files the build writes beside it, so the page reads the graph the agent surface reads and derives nothing of its own.
### Open questions
- [non-blocking #aiSlices] The original hydrates the Studio from AI slices beside the graph and the validation report; the context bundle is designed-in and deferred, and no Spec states the shape of a slice. Does the Studio's data hold a slice, and which Spec would state it?

## Contract
- The Studio hydrates from data files under `generated/spec-studio/data/`, written by the build that writes its pages.
- Each data file holds values the graph serializes or the reader returns and nothing a page computes; a page derives no join, claim, delivery fact, readiness or floor failure from them.
- One graph writes byte-identical data files.
- A page embeds the data it reads in one `script` element of type `application/json` with the id `sdp-graph`, parses it once into `window.__sdp__.graph`, and every element on the page reads from that one object.

## Design
- graphFile: the serialized graph exactly as `sdp build` writes `generated/graph.json`, with its `schemaVersion`.
- reportFile: the validation report, the findings the reader returns from `findings()`.
- specContexts: for each Spec, the reader's `specContext` value: descriptors, narrative, sections, stated and derived readiness, `floorFailures` and `nextRungFailures`, relations both ways, implementation and verifier bindings, the oracle binding and the findings.
- packContexts: for each Pack, the reader's `packContext` value: framing, model references, the members in the manifest's authored order, verifier gaps and findings.
- searchIndex: for each node, the fields the reader's `findByConcept` matches: id, title, anchor label, Pack framing, narrative and section content, so a search on the page matches what the concept entry matches.
