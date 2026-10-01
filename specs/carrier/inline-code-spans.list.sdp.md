---
id: spec:carrier.inline-code-spans.list
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.inline-code-spans
  verifies: spec:carrier.inline-code-spans
---
# Code spans in list entries are literal

## Intent
- outcome: Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the list probes.
- assumption: The matrix uses matched and unmatched backtick runs of one, two, and three backticks, multiple spans, literal tags and comment delimiters inside spans, exposed HTML before and after spans, closing tags, declarations, processing instructions, and ordinary angle-bracket comparisons. It includes ``Use <T title=`value>.``, ``Use </T`>.``, and ``Use <img alt="`">.`` as refused tag bodies with an unmatched backtick, and ``Use <!-`x`-> here.`` as accepted text whose matched span separates the comment delimiter.
- assumption: Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in one Behavior rule entry.
```gwt
Given the code-span matrix in {location: "list"}
When the extractor reifies the probes
Then matched spans preserve {accepted: 12} carriers and exposed HTML refuses {refused: 18} carriers
```
