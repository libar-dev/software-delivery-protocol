---
id: spec:model.spec-sections
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:model.core-model
  decidedBy:
    - spec:decisions.point-per-example
    - spec:decisions.content-only-sections
    - spec:decisions.typing-law
---
# Spec sections carry typed detail and direct verifier semantics

## Intent
- outcome: Extend Specs with local detail without weakening their envelope or confusing binding evidence with intent.

## Model
- **section** — An optional detail slice of a Spec: intent, behavior, constraints, model, design, decision, verification, or ui.
- **typing law** — Every section read by a readiness-floor clause has a closed typed shape; unsettled design and ui surfaces remain open bags.
- **content-only section** — A section carries local content, while relations carry links to promoted standalone Specs.
- **promotion** — Moving shared or independently reviewed content into a standalone Spec of the matching kind, exclusively rather than alongside inline content.
- **verifies** — A direct verifier-to-target relation whose enabled test binding can derive has-verifier only for that stated target.
- **enabled verifier** — An example or direct test with a linked, resolvable test anchor; runner execution and pass state remain outside the graph.
