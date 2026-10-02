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
- problem: Authors need to write type parameters inside code spans without the raw-HTML guard forcing a private bracket notation that cannot be pasted into source.
- outcome: Let a code span carry any literal text, angle brackets included, while raw HTML outside code spans stays refused.

### Open questions
- [non-blocking] CommonMark lets a code span cross a line ending inside a paragraph, so a renderer and the Protocol can disagree about which text is inside a span. Should the owner keep the line-scoped rule or match spans across a paragraph?
- [non-blocking] A backslash-escaped backtick still opens a span, and a tag that starts before a backtick pair loses to the span. CommonMark decides both cases the other way. Should the owner keep these readings or follow CommonMark in these two cases?

## Rule
- A code span is literal content. The raw-HTML refusal never reads inside one, whether the span sits in a Spec's narrative, a section description, a list entry, or a Pack's framing prose.
- A code span opens at a backtick run and closes at the next run of the same length on that same line. Both runs must sit on one line. An unmatched run is ordinary text and shields nothing.
- Raw HTML outside a code span stays refused, with the same finding and message as before.
- The graph stores the line as authored, backticks included. Each projection renders it through the encoding its own Spec already requires for that field.
- The scanner in `src/extract/markdown-inline-code.ts` realizes this rule. The raw-HTML guards that call it live in `src/extract/markdown-body.ts`, `src/extract/markdown-body-content.ts`, and `src/extract/markdown-pack.ts`.

## Example space
```gwt-vocabulary
Given the code-span matrix in {location:string}
When the extractor reifies the probes
Then matched spans preserve {accepted:number} carriers and exposed HTML refuses {refused:number} carriers
```
