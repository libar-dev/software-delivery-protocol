---
id: spec:consumers.design-review
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
  decidedBy:
    - spec:decisions.shipped-projections-frozen
    - target: spec:decisions.authored-entry-order
      reason: open-section entries render as a list in authored order
    - target: spec:decisions.question-key-rendering
      reason: a keyed open question shows its key before its text
    - target: spec:decisions.anchor-binding-grain
      reason: a Spec page lists the units that reference it apart from the units that realize it
    - target: spec:decisions.architectural-annotation
      reason: binding rows show a unit's role and a component's layer and context
---
# Design Review renders graph context without becoming a gate

## Intent
- outcome: Give a human a regenerable, contextual view for deciding how to state readiness without recording approval as graph truth.

## Behavior
- rule: The Design Review renders a Spec or a Pack in context with its readiness, relations, bindings, authored open questions, verifier coverage gaps on Pack pages, and findings, all read from the graph.
- rule: The review is a pure projection that resolves through ordinary source edits, git, and conformance checks; it stores no findings and writes no canonical source.
- rule: A human may use the review context when stating readiness, while validators check only the structural readiness floor and never record or require review approval.
- rule: The view is deterministic generated Markdown with an index and pages for Specs and Packs; richer visual representations remain outside this behavior.
- rule: The page set is a function of the graph alone — it carries no timestamp, no commit, and no run identity — so two renders of the same corpus are byte-identical.
- rule: [#linkTargets] A link target percent-encodes each path segment and keeps directory separators and line fragments.
- rule: [#fieldEscaping] Prose and table fields escape Markdown's structural characters.
- rule: [#openSectionList] Each entry of a `design` or `ui` section renders as a list item in authored order with its key as inline code; a structured value renders as fenced JSON under its item.
- rule: [#inlineCode] Inline code uses a backtick delimiter longer than any backtick run inside the value.
- rule: An open question that carries a key opens with the key as inline code, `#<key>`, before its text.
- rule: A Spec page lists the code units that realize the Spec and, apart, the units that reference it, each with its file and line, its role and, for a component, its layer and context; a reference confers no implementation binding.
- rule: The renderer reads the reader and returns pages; writing them is the caller's job.

## UI
The generated Design Review exposes three page anatomies from the same graph.

- specPage: A Spec page presents descriptors, the narrative, readiness, bindings, the authored sections, relations and findings in one context.
- packPage: A Pack page presents the Pack's design as its child `spec:consumers.design-review.pack-design-page` states.
- indexPage: The index holds one Markdown table of Specs, a linked list of Packs and the findings table, with stable links into each page.

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
