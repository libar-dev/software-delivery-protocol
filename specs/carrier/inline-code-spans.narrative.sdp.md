---
id: spec:carrier.inline-code-spans.narrative
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.inline-code-spans
  verifies: spec:carrier.inline-code-spans
---
# Code spans in a Spec narrative are literal

## Intent
- outcome: Check matched and unmatched runs, literal HTML, exposed HTML on the same line, and authored text in the narrative probes.
- assumption: Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in narrative before Intent.
```gwt
Given the code-span matrix in {location: "narrative"}
When the extractor reifies the probes
Then matched spans preserve {accepted: 13} carriers and exposed HTML refuses {refused: 20} carriers
```
