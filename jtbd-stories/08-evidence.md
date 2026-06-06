# H — Evidence

Design-time intent is half the story; the other half is what actually happened. The job here is to attach real outcomes — test results now, runtime observations later — to the specs they pertain to, so readiness reflects reality. This theme is the natural place the model grows after the MVP loop holds.

---

## JS-H1
### Attach test results to the specs they verify

**Phase:** Iterate
**References:** [06 — Extraction & Validation](../docs/concept/06-extraction-and-validation.md), [08 — Delivery Evidence & Tooling](../docs/concept/08-delivery-evidence-and-tooling.md)

> **When** tests run in CI, **I want to** have their pass/fail results attach to the specs they verify, **so I can** see real verification status rather than aspirational readiness.

**Essence:** Evidence is extractor-populated from real runs, never hand-authored. "Verified" means *actually passed*, recently.

**Acceptance criteria:**
1. Results from a test run are ingested and linked to the specs those tests verify.
2. A spec's "verified" status reflects an actual passing run, not a self-asserted label.
3. Evidence is derived from CI outputs — humans don't type it into specs.
4. A spec whose verifying test last failed is visibly not verified, regardless of its claimed readiness.
5. Stale evidence (a pass that's too old to trust) can be treated as not-yet-verified via a configurable freshness rule.
6. Evidence attaches through the same stable IDs as everything else, so it survives refactors.
7. Evidence enters the graph as its own provenance class — clearly distinct from declared intent and from inference.
8. Like all derived data, evidence is regenerable from its source artifacts and never the canonical truth itself.

---

## JS-H2
### Link runtime observations back to specs

**Phase:** Later
**References:** [08 — Delivery Evidence & Tooling](../docs/concept/08-delivery-evidence-and-tooling.md)

> **When** a spec carries a measurable quality target, **I want to** link runtime observations to it, **so I can** know whether the system actually meets the target in production — not just whether a test passed once.

**Essence:** The graph reaches from design intent all the way to live behaviour. Observations are pointers and summaries, not a telemetry dump — the graph stays small and the canonical data stays in its own systems.

**Acceptance criteria:**
1. A spec's measurable target can be associated with a source of runtime observation.
2. The system can tell whether an observed value satisfies the stated target.
3. A target that is being missed in production is surfacable as a finding against the relevant spec.
4. The graph stores references and summaries of observations, not raw telemetry — the bulk data stays in its own backend.
5. Observation links use the same stable IDs and carry their own provenance, distinct from intent and from tests.
6. This capability is opt-in and adds no burden to teams that don't enable it.
7. Removing or disabling the observation source degrades gracefully — the rest of the graph is unaffected.
8. Standards-based formats are used at the boundary so this interoperates rather than inventing a bespoke pipeline.
