---
id: spec:carrier.markdown-parser.bounded-parity
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-parser
  verifies: spec:carrier.markdown-parser
---
# One finding class is shared while the carriers' outcomes stay their own

## Intent
- outcome: Execute one same-class row of the parity matrix, including the outcomes it never claims.

```gwt
Given the paired carrier probes named {probe: "unrecognized-property"}
When both carriers reify their probe
Then both carriers report the finding class {findingId: "extract/unrecognized-property"}
Then the TypeScript carrier reports severity {typeScriptSeverity: "warning"} and extracts {typeScriptSpecs: 1} specs
Then the Markdown carrier reports severity {markdownSeverity: "error"} and extracts {markdownSpecs: 0} specs
```
