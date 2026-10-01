---
id: spec:validation.prose-mentions
kind: rule
altitude: story
readiness: idea
relations:
  refines: spec:validation.referential-integrity
  decidedBy: spec:decisions.checked-mentions
---
# Every Spec id written in prose resolves

## Intent
- outcome: Refuse a prose reference to an absent Spec or entry, and report a prose reference that no declared relation backs.

## Rule
