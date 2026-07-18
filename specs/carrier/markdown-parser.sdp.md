---
id: spec:carrier.markdown-parser
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn: spec:carrier.envelope-contract
---
# The product parser reifies the ruled Markdown subset

## Intent
- outcome: Reify authored Markdown without a second graph or validation path.

## Behavior
- rule: The parser accepts only the ruled heading grammar and excludes one malformed carrier while continuing healthy siblings.
