---
id: spec:decisions.gherkin-carrier-option
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:decisions.carrier-ruling
---
# Behavior and example Specs may use Gherkin canonically

## Intent
- outcome: Admit stakeholder-readable BDD authoring without creating a second graph truth or moving execution into authored intent.

## Decision
- context: Markdown remains a complete default carrier, but executable behavior and example Specs repeat their Given/When/Then structure in code-side handlers; the restored v0 design and gen-1 production record show that a Gherkin surface improves stakeholder readability while still requiring separate executing code.
- decision: A behavior or example Spec ID may select a graph-aware Gherkin carrier as a lawful canonical per-ID option. Markdown remains the default, each ID has exactly one canonical surface with no mixing, and Gherkin derives the existing graph shape and executes only through generated contracts plus anchored code-side handlers. Its syntax maps onto the existing envelope, sections, relations, and notation; it creates no parallel lifecycle status or tag registry.
- rationale: BDD-native readability is worth one bounded carrier pipeline when the one-graph boundary, generated-contract execution path, and binding-only verifier trace remain unchanged; restricting the option to behavior and example Specs avoids pretending Gherkin is a natural carrier for every kind.
- consequence: The Gherkin pipeline must define deterministic parsing, source locations, graph parity, vocabulary lint, and fail-loudly behavior before the option is realized.
- consequence: A Gherkin scenario does not confer `has-verifier`; only the existing resolving anchored `verifies` trace enables it, and runner pass state remains outside the graph.
- consequence: Gen-1 value-transfer deletion, authored completion status, and an independent tag taxonomy are explicitly not imported.
- consequence: The canonical discovered suffix is settled separately as `.sdp.gherkin` (MD-28); this option does not itself choose a file extension, flip the default carrier, or extend kind coverage. The carrier-universality ruling (spec:decisions.carrier-universality) reaffirms that kind bound with per-kind honesty reasons, admits Feature/Scenario description prose only on MD-19 owners while keeping DocStrings and DataTables refused, defines universal as a generated read projection, keeps Markdown as default, and places Packs outside this option.
- alternative: Keeping Markdown as the only default authoring path avoids a second parser but retains the stakeholder-readable duplication established by the executable-verification review.
- alternative: Deriving more of the test wrapper can reduce mechanical code independently, but does not provide a BDD-native canonical artifact.
