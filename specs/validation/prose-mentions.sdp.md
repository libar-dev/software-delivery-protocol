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

### Open questions
- [blocking] This rule is written only after `spec:decisions.checked-mentions` is ratified, because the entry-address form it must check is still open there. Until then the mention audit recipe is the whole check.

## Rule
