---
id: spec:carrier.markdown-pack-authoring.markdown-ts-parity
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-pack-authoring
  verifies: spec:carrier.markdown-pack-authoring
---
# A Markdown Pack twin matches its TypeScript manifest

## Intent
- outcome: Execute Markdown↔TypeScript Pack parity on one probe pack, the `file` field aside.

```gwt
Given an extraction root holding the pack carrier {carrierSource: "the Markdown twin of a TS manifest"}
When the extractor derives the graph
Then the graph holds the pack {packId: "pack:probe.parity"} whose membership names {memberId: "spec:probe.member"}
```
