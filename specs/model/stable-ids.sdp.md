---
id: spec:model.stable-ids
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:model.core-model
  decidedBy: spec:decisions.checked-mentions
---
# Stable IDs are the Protocol's durable join key

## Intent
- outcome: Keep intent, bindings, and graph nodes connected through names that survive code refactoring.

## Rule
- A Protocol ID is stable, unique, namespaced, human-readable, and the only binding between intent and code.
- [#idGrammar] An ID has a lowercase namespace followed by a colon and a dotted path whose segments admit mixed case. An optional single `#` suffix is an entry address, `<section>.<key>`, with section `design`, `ui`, `question` or `rule` and a lower-camel ASCII key; it is admitted only in the `spec:` namespace and never belongs to an identity. Referential-integrity checks reject malformed or unresolved references.
- IDs carry no history: a rename is a repository edit recorded by git rather than graph-resident bookkeeping.
- The Spec and Spec-reference builders admit `spec:`, the Pack builder `pack:`, the code-anchor builder `impl:`, `api:` and `component:`, the test-anchor builder `test:`, and the oracle-anchor builder `oracle:`. These are the namespaces of the flavored authored identities and targets; the grammar itself admits any lowercase namespace.
- `doc:` is reserved for a genuinely external document a decision Spec links to; in-system decisions are Specs. Authored relations and the Spec-reference builder accept `spec:` targets, so the `doc:` relation-target reservation is a named deferral rather than a landed relation target.

## Example space
```gwt-vocabulary
Given the authored identifier {identifier:string}
When the identifier is parsed
Then parsing {outcome:"resolves"|"is refused"}
Then reformatting the parsed parts restores {restored:string}
Then the refusal names the reason {reason:string}
```
