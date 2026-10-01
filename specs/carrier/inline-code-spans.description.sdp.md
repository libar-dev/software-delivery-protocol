---
id: spec:carrier.inline-code-spans.description
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.inline-code-spans
  verifies: spec:carrier.inline-code-spans
---
# Code spans in section descriptions are literal

## Intent
- outcome: Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the description probes.
- assumption: The matrix uses matched and unmatched backtick runs of one, two, and three backticks, multiple spans, literal tags and comment delimiters inside spans, exposed HTML before and after spans, closing tags, declarations, processing instructions, and ordinary angle-bracket comparisons. It includes ``Use <T title=`value>.``, ``Use </T`>.``, and ``Use <img alt="`">.`` as refused tag bodies with an unmatched backtick, and ``Use <!-`x`-> here.`` as accepted text whose matched span separates the comment delimiter.
- assumption: The paragraph probes split a single-backtick pair across two lines. One puts ``Use `Promise<T>.`` on the first line and ``Close here`.`` on the second; another puts ``Open here `.`` first and ``Use Promise<T>`.`` second. Neither pair shields HTML. A third puts ``Open here `.`` first and ``Use `Promise<T>`.`` second, so the pair on the second line shields that line despite the unmatched run on the first.
- assumption: Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in the Behavior description.
```gwt
Given the code-span matrix in {location: "description"}
When the extractor reifies the probes
Then matched spans preserve {accepted: 13} carriers and exposed HTML refuses {refused: 20} carriers
```
