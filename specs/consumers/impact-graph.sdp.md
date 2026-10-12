---
id: spec:consumers.impact-graph
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
  dependsOn: spec:extraction.derive-graph
---
# Mechanical code structure stays inferred and apart from curated intent

File-level import structure, keyed by repository-relative path, is designed in `spec:consumers.impact-graph.curation-assist`; exhaustive symbol reach is designed in `spec:consumers.impact-graph.symbol-reach`, which holds the symbol-identity question.

## Intent
- outcome: Let mechanically derived import and symbol structure inform impact and curation without ever standing in for curated intent.

## Behavior
- rule: [#inferredApart] Mechanical import and symbol structure derives under the `inferred` claim and stays apart from the sparse curated graph; no curated edge, binding or delivery fact derives from it.
