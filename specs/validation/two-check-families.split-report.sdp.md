---
id: spec:validation.two-check-families.split-report
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.two-check-families
  verifies: spec:validation.two-check-families
---
# One report carries both families and claims neither as its own

## Intent
- outcome: Execute the family split where one probe graph trips a conformance error and an informative honesty signal at once.

```gwt
Given the graph holds a spec {specId: "spec:probe.two-check-families"} at readiness {readiness: "ready"}
Given the spec declares a dependsOn relation to the absent target {targetId: "spec:probe.absent-dependency"}
When the graph is validated
Then the aggregate report states no family of its own
Then the conformance family reports {conformanceId: "conformance/referential-integrity"} at severity {conformanceSeverity: "error"}
Then the honesty family reports {honestyId: "honesty/gaps"} at severity {honestySeverity: "warning"}
```
