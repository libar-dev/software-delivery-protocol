---
id: spec:decisions.content-only-sections
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:model.spec-sections
---
# Sections carry content while relations carry links

## Intent
- outcome: Keep inline detail and promoted Specs from representing the same fact twice.

## Decision
- context: Behavior content can mature from prose to structured evidence or into a standalone matching-kind Spec.
- decision: Sections contain local content only; promotion moves content exclusively and relations state the linkage.
- rationale: Reference unions and duplicate parent lists force consumers to branch and leave double-linkage drift legal.
- consequence: Promoted children preserve readiness evidence through their own content and authored relations.
