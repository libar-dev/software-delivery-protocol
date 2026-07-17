---
id: spec:carrier.prose-ownership-rule
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-authoring
---
# Every prose edge has one owner

## Intent
- outcome: Keep free prose in the graph without ambiguous attachment.

## Rule
- Narrative lives before the first H2; descriptions live only under their owning singular sections; unowned prose is refused.
