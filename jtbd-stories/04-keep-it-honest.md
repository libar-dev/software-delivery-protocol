# D — Keep It Honest

A graph nobody trusts is worthless. The job here is to make the delivery state *self-policing*: broken links and inflated stated readiness fail the build, so what the graph says is always true. Conformance + honesty checks are the gate that keeps the single source of truth honest.

---

## JS-D1
### Fail CI on broken links and false stated readiness

**Phase:** MVP
**References:** [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md)

> **When** I open a pull request, **I want to** have CI reject dangling references, duplicate IDs, orphaned specs, broken `verifies` links, and a stated readiness the spec doesn't back up, **so I can** trust that a green build means the delivery state is actually coherent.

**Essence:** The graph earns trust by failing loudly and specifically. Ambiguity is rejected, not tie-broken.

**Acceptance criteria:**
1. A reference to a non-existent spec, component, or test (in relations, `modelRefs`, or anchors) fails the build with a precise file/line and a "did you mean…?" suggestion where possible.
2. Two nodes sharing the same ID is an error, not a last-write-wins silent merge.
3. A spec that **states** `ready` but lacks its floor — unresolved relations, a `dependsOn`/`refines` target below `defined`, or a blocking open question — fails.
4. Code **anchored** as satisfying a spec that does not exist is caught.
5. A spec with no relations and nothing pointing at it is surfaced (orphan detection) so it cannot silently fall out of the graph's connective tissue.
6. A genuine conflict — an **anchor** that contradicts a declaration — is a loud error; a deterministic precedence resolves only *layering* (declared over anchored over inferred), never a true contradiction.
7. The same validators run locally and in CI with identical results, and a single bad spec produces a scoped error rather than aborting extraction — the build reports every problem it can find.
8. A passing `sdp validate` is a credible statement that every reference resolves, no IDs collide, every readiness floor is earned, and nothing hand-authors a derived edge or delivery fact (authoring-shape honesty).

---

## JS-D2
### Enforce completeness rules per readiness level

**Phase:** MVP
**References:** [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md), [02 — Core Model](../docs/concept/02-core-model.md)

> **When** a spec states a readiness level, **I want to** have the system require the sections and links that level's floor demands, **so I can** rely on readiness as a real signal rather than a self-asserted label.

**Essence:** Readiness is **stated** by the author; validators verify it. A spec cannot say `ready` while it fails the `ready` floor.

**Acceptance criteria:**
1. Each readiness level has an explicit floor of required sections/relations: `idea` (id/title/kind/altitude + outcome-or-parent) → `scoped` → `defined` → `ready`.
2. A spec stating a level it does not satisfy is flagged, with the specific missing pieces named.
3. Low readiness is permissive — ideas and scoped specs are not punished for being incomplete; an open question only blocks promotion when it is explicitly marked `blocking`.
4. High readiness is strict and **structural**: the `ready` floor requires resolved relations, every `dependsOn`/`refines` target at least `defined`, no blocking open questions, and any anchors present resolving. **Delivery facts** (`implemented`, `has-verifier`) are *derived* from edges — never required by the floor, never an ingested pass/fail verdict.
5. A quality constraint must carry a machine-readable `target` (e.g. `p95 < 300ms`, not "fast enough") before its spec can state `defined` or higher.
6. The author's *stated* readiness and a *derived* readiness (computed from what the spec actually contains) can be compared, and a divergence (stated `defined`, derived `scoped`) is itself surfacable.
7. The floor thresholds are config a team can override, and the MVP fails hard on a clean bounded context (a `--lenient` ratchet for gradual adoption is a later addition, not required here).
8. The system can show, per spec, exactly what is missing to reach the next level.
