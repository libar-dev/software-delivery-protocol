---
id: spec:carrier.sdp-import.round-trip
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.sdp-import
  verifies: spec:carrier.sdp-import
---
# A TypeScript carrier survives import as an equal Markdown graph

## Intent
- outcome: Execute the import round-trip against a TypeScript-carrier fixture.

```gwt
Given a TS-carrier spec
When importTypeScriptSpec runs
Then the emitted Markdown re-parses to an equal graph
```

## Verification — executable
- The actual returned Markdown preserves the source's Spec content and declared relations after carrier locations are normalized.
