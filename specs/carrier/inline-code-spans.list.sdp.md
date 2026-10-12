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
- assumption: Each probe has its own carrier. Each Spec is a story-altitude behavior stating idea with no relations and an Intent outcome. The probe sits in one Behavior rule entry.
```gwt
Given the code-span matrix in {location: "list"}
When the extractor reifies the probes
Then matched spans preserve {accepted: 12} carriers and exposed HTML refuses {refused: 18} carriers
```
