---
id: spec:consumers.edit-model
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
---
# Views compose scoped intent instead of patching canonical source

## Intent
- outcome: Let a view frame a requested change without giving derived surfaces a direct write path to canonical source.

## Behavior
- rule: A view composes scoped intent, bounded by a Spec, its neighbors, a Pack, or open questions, and hands that intent to an agent.
- rule: The agent edits source as a human would, git records the ordinary edit, and the same conformance and honesty checks evaluate it.
- rule: Lifecycle changes such as splitting, combining, refining, or deleting are ordinary source and git edits rather than structured patches from a derived view.
- rule: No single realizing entrypoint exists for intent composition; this defined behavior records design intent and has no code anchor or verifier.
