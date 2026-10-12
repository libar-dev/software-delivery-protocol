---
id: spec:carrier.inline-code-spans
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-body-grammar
---
# Inline code is content, never markup

## Intent
- problem: Authors need to write type parameters inside code spans without the raw-HTML guard forcing a private bracket notation that cannot be pasted into source.
- outcome: Let a code span carry any literal text, angle brackets included, while raw HTML outside code spans stays refused.

### Open questions
- [non-blocking #spanAcrossLines] CommonMark lets a code span cross a line ending inside a paragraph, so a renderer and the Protocol can disagree about which text is inside a span. Should the owner keep the line-scoped rule or match spans across a paragraph?
  - decider: owner
  - provisional: the line-scoped reading stands
- [non-blocking #commonMarkCases] A backslash-escaped backtick still opens a span, and a tag that starts before a backtick pair loses to the span. CommonMark decides both cases the other way. Should the owner keep these readings or follow CommonMark in these two cases?
  - decider: owner

## Rule
- A code span is literal content. The raw-HTML refusal never reads inside one, whether the span sits in a Spec's narrative, a section description, a list entry, or a Pack's framing prose.
- A code span opens at a backtick run and closes at the next run of the same length on that same line. Both runs must sit on one line. An unmatched run is ordinary text and shields nothing.
- Raw HTML outside a code span is refused as `extract/invalid-markdown-structure` with the message `raw HTML is unsupported`.
- The graph stores the line as authored, backticks included. Each projection renders it through the encoding its own Spec requires for that field.

## Example space
The matrix uses matched and unmatched backtick runs of one, two, and three backticks, multiple spans, literal tags and comment delimiters inside spans, exposed HTML before and after spans, closing tags, declarations, processing instructions, and ordinary angle-bracket comparisons. It includes ``Use <T title=`value>.``, ``Use </T`>.``, and ``Use <img alt="`">.`` as refused tag bodies with an unmatched backtick, and ``Use <!-`x`-> here.`` as accepted text whose matched span separates the comment delimiter.

Paragraph probes run in narrative, section-description and Pack-framing locations; the list-entry location uses only the single-line matrix. The paragraph probes split a single-backtick pair across two lines. One puts ``Use `Promise<T>.`` on the first line and ``Close here`.`` on the second; another puts ``Open here `.`` first and ``Use Promise<T>`.`` second. Neither pair shields HTML. A third puts ``Open here `.`` first and ``Use `Promise<T>`.`` second, so the pair on the second line shields that line despite the unmatched run on the first.

```gwt-vocabulary
Given the code-span matrix in {location:string}
When the extractor reifies the probes
Then matched spans preserve {accepted:number} carriers and exposed HTML refuses {refused:number} carriers
```
