---
id: spec:validation.pack-coherence
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Packs are coherent aggregates

## Intent
- outcome: Keep review aggregates coherent without treating them as truth-bearing delivery artifacts.

## Rule
- Pack membership must not repeat a Spec, and every modelRef must resolve to a model-kind Spec.
- The realizing validator entrypoint is `checkPackCoherence` in `src/validate/validators.ts`.
