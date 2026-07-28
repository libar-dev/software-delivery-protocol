---
id: spec:consumers.design-review
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
---
# Design Review renders graph context without becoming a gate

## Intent
- outcome: Give a human a regenerable, contextual view for deciding how to state readiness without recording approval as graph truth.

## Behavior
- rule: Design Review renders a Spec or Pack in context with relations, bindings, delivery badges, design questions, and findings from the graph.
- rule: The review is a pure projection that resolves through ordinary source edits, git, and conformance checks; it stores no findings and writes no canonical source.
- rule: A human may use the review context when stating readiness, while validators check only the structural readiness floor and never record or require review approval.
- rule: The MVP view is deterministic generated Markdown with an index and pages for Specs and Packs; richer visual representations remain outside this behavior.
- rule: The page set is a function of the graph alone — it carries no timestamp, no commit, and no run identity — so two renders of the same corpus are byte-identical.
- rule: Rendering encodes by Markdown syntax context: prose and table fields escape structural characters, fenced JSON preserves authored keys and values through JSON encoding, and inline code uses a delimiter that preserves literal backticks.
- rule: The realizing entrypoint is `renderDesignReview` in `src/projections/design-review.ts`, which reads the reader and returns pages; writing them is the caller's job.

## Example space
```gwt-vocabulary
Given an extraction root holding a Pack, its member Specs, and one member the checks warn about
When the Design Review renders the graph derived from that root
Then the page set holds the index page {indexPage:string}, one page per Spec, and one page per Pack
Then the page {packPage:string} renders its members in context
Then the page {specPage:string} renders the finding {findingId:string} as data
Then a second render from a freshly derived graph is byte-identical: {byteIdentical:boolean}
Then the render leaves the extraction root byte-identical: {rootUntouched:boolean}
```
