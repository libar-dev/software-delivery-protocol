---
id: spec:extraction.claim-taxonomy
kind: model
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.derive-graph
---
# Graph claims retain their epistemic source

## Intent
- outcome: Let every graph reader distinguish authored intent, human bindings, and machine-derived structure.

## Model
- **declared** — Human intent explicitly authored in a Spec or Pack; it is authoritative intent.
- **anchored** — A human binding from a code, test, or oracle location to one Spec ID; it is authoritative binding and carries no intent.
- **inferred** — Machine-derived structural information; it is advisory and never authoritative.
- **claim inheritance** — An edge computed from an authored source retains that source's declared claim; derivation is a mechanism, not a fourth claim.
- **delivery fact** — A realization signal computed from resolving edges, never an authored claim or edge.
