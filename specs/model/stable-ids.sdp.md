---
id: spec:model.stable-ids
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:model.core-model
---
# Stable IDs are the Protocol's durable join key

## Intent
- outcome: Keep intent, bindings, and graph nodes connected through names that survive code refactoring.

## Rule
- A Protocol ID is stable, unique, namespaced, human-readable, and the only binding between intent and code.
- An ID uses a lowercase namespace and dotted path, with an optional single `#` sub-part; referential-integrity checks reject malformed or unresolved references.
- IDs carry no history: a rename is a repository edit recorded by git rather than graph-resident bookkeeping.
