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
- The builders reserve one namespace per binding direction — `spec:` for a Spec and for every Spec reference, `pack:` for the aggregate, `impl:` · `api:` · `component:` for a code anchor, `test:` for a verifying test anchor, and `oracle:` for an expected-outcome anchor — while the grammar itself admits any lowercase namespace, so the reserved set is the builders' law rather than the parser's.
- `doc:` is reserved for a genuinely external document a decision Spec links to, never for an in-system decision: in-system decisions are Specs under the `spec:decisions.*` convention. No builder mints a `doc:` identifier and the Spec-only reference builder refuses one, so the reservation is a named deferral rather than a landed namespace.
- The realizing entrypoints are `parseId` and `formatId` in `src/ids.ts`.

## Example space
```gwt-vocabulary
Given the authored identifier {identifier:string}
When the identifier is parsed
Then parsing {outcome:"resolves"|"is refused"}
Then reformatting the parsed parts restores {restored:string}
Then the refusal names the reason {reason:string}
```
