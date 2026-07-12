---
# A `decision`-kind spec in the SAME document family — the point: under the
# document route, all eight kinds share one home, so the per-kind partition law
# (grammar-for-examples / TS-for-the-rest) never needs to exist.
id: spec:decisions.order-lifecycle
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:orders.order-management
---

# Orders are immutable after creation

## Context

Cancellation/editing flows multiply state machines across every downstream
consumer. The MVP models order creation only.

## Choice

An order, once created, is never mutated; corrective flows (cancel, amend) are
modeled as new specs with their own lifecycle when they earn their way in.

## Consequences

- Downstream projections read a write-once shape — no temporal state.
- The cut is recorded here, not silently absent: amendment is a named deferral.
