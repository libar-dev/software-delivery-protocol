---
id: spec:carrier.inline-code-spans
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-body-grammar
---
# Inline code is content, never markup

## Intent
- problem: A type parameter written inside a code span is refused as raw HTML, so an author who writes signatures invents a private bracket notation that cannot be pasted into source.
- outcome: Let a code span carry any literal text, angle brackets included, while raw HTML outside code spans stays refused.

## Rule
- A code span is literal content. The raw-HTML refusal never reads inside one, whether the span sits in a Spec's narrative, a section description, a list entry, or a Pack's framing prose.
- A code span opens at a backtick run and closes at the next run of the same length. An unmatched run is ordinary text and shields nothing.
- Raw HTML outside a code span stays refused, with the same finding and message as before.
- The graph stores the line as authored, backticks included. Each projection renders it through the encoding its own Spec already requires for that field.
- The realizing sites are the raw-HTML guards in `src/extract/markdown-body.ts`, `src/extract/markdown-body-content.ts`, and `src/extract/markdown-pack.ts`.

## Example space
```gwt-vocabulary
Given the code-span matrix in {location:string}
When the extractor reifies the probes
Then matched spans preserve {accepted:number} carriers and exposed HTML refuses {refused:number} carriers
```
