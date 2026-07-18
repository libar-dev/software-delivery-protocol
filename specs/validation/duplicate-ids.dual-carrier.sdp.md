---
id: spec:validation.duplicate-ids.dual-carrier
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.duplicate-ids
  verifies: spec:validation.duplicate-ids
---
# TypeScript and Markdown duplicates are both refused

## Intent
- outcome: Execute the duplicate-ID rule across both carrier surfaces.

```gwt
Given a {firstCarrier: "TypeScript"} carrier declares {specId: "spec:fixture.duplicate"}
Given a {secondCarrier: "Markdown"} carrier declares {specId: "spec:fixture.duplicate"}
When the extraction root is read
Then both sites report {findingId: "extract/duplicate-id"}
Then no graph node is emitted for {specId: "spec:fixture.duplicate"}
```
