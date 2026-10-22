---
id: spec:carrier.inline-code-spans.description
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.inline-code-spans
  verifies: { target: spec:carrier.inline-code-spans, exercises: [literalSpan, lineScoped, noEscape, spanBeforeTag, rawHtmlRefused] }
---
# Code spans in section descriptions are literal

## Intent
- outcome: Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the description probes.
- assumption: Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in the Behavior description.
```gwt
Given the code-span matrix in {location: "description"}
When the extractor reifies the probes
Then matched spans preserve {accepted: 15} carriers and exposed HTML refuses {refused: 20} carriers
```
