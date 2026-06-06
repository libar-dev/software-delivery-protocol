# D — Keep It Honest

A graph nobody trusts is worthless. The job here is to make the delivery state *self-policing*: broken links and inflated readiness claims fail the build, so what the graph says is always true. Validation is the gate that keeps the single source of truth honest.

---

## JS-D1
### Fail CI on broken links and false readiness claims

**Phase:** MVP
**References:** [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md)

> **When** I open a pull request, **I want to** have CI reject dangling references, duplicate IDs, orphaned specs, broken `verifies` links, and readiness claims the spec doesn't back up, **so I can** trust that a green build means the delivery state is actually coherent.

**Essence:** The graph earns trust by failing loudly and specifically. Ambiguity is rejected, not tie-broken.

**Acceptance criteria:**
1. A reference to a non-existent spec, component, or test (in relations, bindings, or markers) fails the build with a precise file/line and a "did you mean…?" suggestion where possible.
2. Two nodes claiming the same ID is an error, not a last-write-wins silent merge.
3. A spec that claims `bound`/`executable`/`verified` but lacks a resolvable binding or verifying test fails.
4. Code marked as satisfying a spec that does not exist is caught.
5. A spec with no relations and nothing pointing at it is surfaced (orphan detection) so it cannot silently fall out of the graph's connective tissue.
6. A genuine conflict — a marker that contradicts a declaration — is a loud error; a deterministic precedence resolves only *layering* (declared over annotation over inferred), never a true contradiction.
7. The same validators run locally and in CI with identical results, and a single bad spec produces a scoped error rather than aborting extraction — the build reports every problem it can find.
8. A passing `akg validate` is a credible statement that every reference resolves, no IDs collide, and every readiness claim is earned.

---

## JS-D2
### Enforce completeness rules per readiness level

**Phase:** MVP
**References:** [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md), [02 — Core Model](../docs/concept/02-core-model.md)

> **When** a spec claims a readiness level, **I want to** have the system require the facets and links that level's profile demands, **so I can** rely on readiness as a real signal rather than a self-asserted label.

**Essence:** Readiness is a claim; validators verify the claim. A spec cannot say `verified` while it lacks an enabled verifying test.

**Acceptance criteria:**
1. Each readiness level has an explicit profile of required facets/relations: `sketch` (id/title/kind/abstraction + outcome-or-parent) → `framed` → `specified` → `designed` → `bound` → `executable` → `verified`.
2. A spec claiming a level it does not satisfy is flagged, with the specific missing pieces named.
3. Low readiness is permissive — sketches and framed ideas are not punished for being incomplete; an open question only blocks promotion when it is explicitly marked `blocking`.
4. High readiness is strict and **structural**: `bound` requires resolvable bindings, `executable` requires resolvable verifying tests, and `verified` requires that a linked verifying spec/test **exists and is enabled** — never an ingested pass/fail verdict.
5. A quality constraint must carry a machine-readable `target` (e.g. `p95 < 300ms`, not "fast enough") before its spec can claim `specified` or higher.
6. The author's *claimed* readiness and a *derived* readiness (computed from what the spec actually contains) can be compared, and a divergence (claimed `bound`, derived `framed`) is itself surfacable.
7. The profile thresholds are config a team can override, and the MVP fails hard on a clean bounded context (a `--lenient` ratchet for gradual adoption is a later addition, not required here).
8. The system can show, per spec, exactly what is missing to reach the next level.
