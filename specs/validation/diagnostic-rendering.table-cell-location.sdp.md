---
id: spec:validation.diagnostic-rendering.table-cell-location
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.diagnostic-rendering
  verifies: spec:validation.diagnostic-rendering
---
# The same three location shapes, rendered as table cells

## Intent
- outcome: Execute the one composition rule on the Design Review's findings table, where a cell cannot be absent and a message pipe would otherwise split the row.

```gwt
Given a finding naming the validator {validatorId: "honesty/readiness-floor"} at severity {severity: "error"} carrying the message {message: "The stated rung is not earned | its floor refused it."}
When the {renderer: "Design Review"} renderer formats that finding once per location shape
Then the findings row carrying the file {file: "specs/probe.sdp.md"} and the line {line: 7} renders {locationRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \| its floor refused it. | `specs/probe.sdp.md:7` |"}
Then the same row carrying the file alone renders {fileOnlyRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \| its floor refused it. | `specs/probe.sdp.md` |"}
Then the same row carrying neither renders {absentRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \| its floor refused it. | — |"}
```
