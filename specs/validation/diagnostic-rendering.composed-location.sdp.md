---
id: spec:validation.diagnostic-rendering.composed-location
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.diagnostic-rendering
  verifies: spec:validation.diagnostic-rendering
---
# One finding, three location shapes, one composition rule

## Intent
- outcome: Execute the composition and both degradations on one finding, so the rule is read as one law rather than three renderings.

```gwt
Given a finding naming the validator {validatorId: "honesty/readiness-floor"} at severity {severity: "error"} carrying the message {message: "The stated rung is not earned."}
When the {renderer: "command-line"} renderer formats that finding once per location shape
Then the finding carrying the file {file: "specs/probe.sdp.md"} and the line {line: 7} renders {withLocation: "specs/probe.sdp.md:7 — [error] honesty/readiness-floor — The stated rung is not earned."}
Then the same finding carrying the file alone renders {fileOnly: "specs/probe.sdp.md — [error] honesty/readiness-floor — The stated rung is not earned."}
Then the same finding carrying neither renders {bare: "[error] honesty/readiness-floor — The stated rung is not earned."}
```
