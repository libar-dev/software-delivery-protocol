---
id: spec:model.stable-ids
kind: rule
altitude: story
readiness: ready
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
- The realizing entrypoints are `parseId` and `formatId` in `src/ids.ts`.

## Example space
```gwt-vocabulary
Given the authored identifier {identifier:string}
When the identifier is parsed
Then parsing {outcome:"resolves"|"is refused"}
Then reformatting the parsed parts restores {restored:string}
Then the refusal names the reason {reason:string}
```
