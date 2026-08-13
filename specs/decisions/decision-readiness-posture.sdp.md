---
id: spec:decisions.decision-readiness-posture
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:validation.warn-level-signals
---
# Decision records state readiness from ratification evidence

## Intent
- outcome: Let ratified decision records state their honest maturity without manufacturing implementation or verifier work.

## Decision
- context: A complete decision record with a ratified registry row carries settled intended truth, but treating its missing implementation and verifier bindings like a behavior gap turns the decision kind into definitional backlog noise.
- decision: A decision Spec states `ready` when its complete record is registry-ratified. Decision records never require implementation or verifier bindings; the operational build backlog and verifier-gap signal exclude kind `decision`, while recipe 1 reports the excluded ready-decision count.
- rationale: Readiness describes maturity of authored intent, not delivery. Registry ratification is the decision kind's natural evidence, just as executable examples carry verifier evidence rather than implementation work. Reporting the exclusion preserves census visibility without pretending decisions are code to build.
- consequence: Ratified, floor-clear decision Specs can state `ready` without creating backlog rows or verifier-gap warnings.
- consequence: The raw `ready ∧ ¬implemented` expression remains true for decision records; operational recipes must name their kind exclusions explicitly.
- alternative: Keeping ratified decisions at `defined` would hide their settled maturity to avoid a consumer query defect.
- alternative: Adding ceremonial anchors or verifiers would collapse authored decision evidence into unrelated delivery facts.
