# H — Evidence

Design-time intent is half the story; the other half is whether the system meets its stated targets in the real world. The job here is to connect a spec's measurable targets to live runtime observation, so an NFR can be answered with "is this actually met in production right now?" — not just "was it specified?". This is the natural place the model grows once the core loop holds.

> Verification (does a verifying test exist and is it enabled) is a *structural* fact handled in the trace and honesty themes — the graph never ingests test run results. This theme is about **runtime observation** — the `observed` delivery fact — which is derived from observation, never declared.

---

## JS-H1
### Link runtime observations back to specs

**Phase:** Later
**References:** [00 — Vision, Scope & MVP Boundary](../docs/concept/00-vision-scope-and-mvp-boundary.md), [01 — Founding Principles & Invariants](../docs/concept/01-founding-principles-and-invariants.md)

> **When** a spec carries a measurable quality target, **I want to** link runtime observations to it, **so I can** know whether the system actually meets the target in production — not just whether it was written down.

**Essence:** The graph reaches from design intent to live behaviour. The `observed` delivery fact is derived by the pipeline from observation, never authored by hand. Observations are pointers and summaries — the graph stays small and the canonical telemetry stays in its own systems.

**Acceptance criteria:**
1. A spec's machine-readable `target` (required at `defined` already — the design-time half, in Theme D) can be associated with a source of runtime observation.
2. The system can tell whether an observed value satisfies the stated target.
3. A target being missed in production is surfacable as a finding against the relevant spec.
4. The `observed` delivery fact is extractor/pipeline-populated from observation, never hand-edited onto a spec — hand-editing it is a violation because it would drift from reality.
5. The graph stores references and summaries of observations, not raw telemetry — the bulk data stays in its own backend.
6. Observation links use the same stable IDs and carry their own `claim`, kept distinct from declared intent, anchored bindings, and inference.
7. The capability is opt-in and adds no burden to teams that don't enable it; disabling the observation source degrades gracefully, leaving the rest of the graph unaffected.
8. Observations come from whatever monitoring the team already runs, consumed at the boundary so this interoperates rather than inventing a bespoke telemetry pipeline.
