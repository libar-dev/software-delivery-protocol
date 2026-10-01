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
```gwt
Given the code-span matrix in {location: "description"}
When the extractor reifies the probes
Then matched spans preserve {accepted: 11} carriers and exposed HTML refuses {refused: 15} carriers
```
