---
id: spec:carrier.markdown-parser
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn: spec:carrier.envelope-contract
---
# The product parser reifies the ruled Markdown subset

## Intent
- problem: Prevent carrier-specific graph and validation paths from diverging.
- outcome: Reify authored Markdown without a second graph or validation path.
- value: Markdown-carried intent remains subject to the Protocol's deterministic checks.

## Behavior
- rule: The parser accepts only the ruled heading grammar and excludes one malformed carrier while continuing healthy siblings.
