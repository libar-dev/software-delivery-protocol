# D — Keep It Honest

A graph nobody trusts is worthless. The job here is to make the delivery state *self-policing*: broken links and inflated readiness claims fail the build, so what the graph says is always true.

---

## JS-D1
### Fail CI on broken links and false readiness claims

**Phase:** MVP
**References:** [06 — Extraction & Validation](../docs/concept/06-extraction-and-validation.md)

> **When** I open a pull request, **I want to** have CI reject broken spec references, orphaned bindings, duplicate IDs, and readiness claims the code doesn't back up, **so I can** trust that a green build means the delivery state is actually coherent.

**Essence:** The graph earns trust by failing loudly. Validation is the gate that keeps the single source of truth honest.

**Acceptance criteria:**
1. A reference to a non-existent spec, component, or test fails the build with a precise location.
2. Two things claiming the same ID is an error, not a last-write-wins silent merge.
3. A spec that claims to be implemented or verified but has no resolvable binding fails.
4. Code marked as satisfying a spec that doesn't exist is caught.
5. Every finding points to a file and line so it's fixable without a hunt.
6. Findings have severities, so teams can ratchet strictness over time instead of facing all-or-nothing adoption.
7. The same gate runs locally and in CI, giving identical results, so surprises don't appear only at merge time.
8. A passing validation run is a credible statement that the graph is internally consistent.

---

## JS-D2
### Enforce completeness rules per readiness level

**Phase:** MVP
**References:** [06 — Extraction & Validation](../docs/concept/06-extraction-and-validation.md), [01 — Core Primitives](../docs/concept/01-core-primitives.md)

> **When** a spec claims a readiness level, **I want to** have the system require the facets and links that level demands, **so I can** rely on readiness as a real signal rather than a self-asserted label.

**Essence:** Readiness is a claim; validators verify the claim. A spec cannot say "verified" while sitting unverified.

**Acceptance criteria:**
1. Each readiness level has an explicit set of things a spec must have to legitimately claim it.
2. A spec claiming a level it doesn't satisfy is flagged, with the specific missing pieces named.
3. Low readiness is permissive — sketches and framed ideas are not punished for being incomplete.
4. High readiness is strict — "executable" requires resolvable tests, "verified" requires actual passing evidence.
5. Quality targets (e.g. an NFR) must be stated in measurable terms before a spec can claim the level that needs them.
6. Blocking open questions prevent a spec from claiming maturity beyond a defined point.
7. The completeness rules are configurable so a team can start lenient and tighten as confidence grows — without reshaping any spec.
8. The system can show, per spec, exactly what's missing to reach the next level.
