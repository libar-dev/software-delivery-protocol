# G — Trace & Assess Impact

Once everything is one graph, the payoff is navigation: what does a change touch, what proves a spec works, and where might the curation be falling behind the code. The job here is confident change, credible coverage, and honest curation — keeping the two graph surfaces (curated graph vs impact graph) doing their separate jobs.

---

## JS-G1
### See what a change impacts before making it

**Phase:** MVP
**References:** [06 — Consumers & Projections](../docs/concept/06-consumers-and-projections.md), [03 — The One Graph](../docs/concept/03-the-one-graph.md)

> **When** I'm about to change a spec or a piece of code, **I want to** see what depends on it upstream and downstream, **so I can** refactor or re-scope with confidence instead of discovering the blast radius after the fact.

**Essence:** The one graph turns "what will this break?" into a query, not a guess. **File-level** blast-radius over a changeset is one of the frozen **`reader`** methods on the agent surface (MVP), and an impact list rides along with every spec in the view; exhaustive symbol-level reach is the aspirational impact graph. File-level reach is **honest about its gaps** — a changed file with no anchor is reported as `coverage-unknown`, never silently dropped.

**Acceptance criteria:**
1. For any spec or node, the system shows what it depends on and what depends on it, derived from the live graph so it reflects the repo's current reality.
2. Impact spans the chain — parent and child specs, the code that satisfies it, and the tests that verify it.
3. **File-level** blast-radius can be taken over a changeset (e.g. a `git diff`) — mapping changed files to anchored specs (`byFile`) and walking the curated graph — returning the impacted specs and at-risk items, exposed as a frozen method on the agent surface (the `reader`, Theme E) and surfaced as the per-spec impact list in the view. This needs no symbol index and is MVP.
4. Each impacted item is identifiable and reachable, not just a count.
5. Inferred dependencies in the impact set are marked as such, so machine-derived reach is not mistaken for declared certainty.
6. The impact answer is available before committing, so it informs the decision, and the same answer can be handed to an agent as context for executing the change safely.
7. At MVP, impact rides the **curated graph** (declared + anchored edges) at file granularity; **exhaustive** symbol-level reach uses the **impact graph** (the inferred import/symbol layer) and is aspirational — the curated graph stays editorially sparse, and a richer interactive impact UI is a later enhancement over the same query shape.
8. **Coverage is honest about its own blind spots.** Because file-level reach maps changed files to *anchored* specs through *curated* edges, a changed file with no anchor — or shared code whose true reach lives in the deferred symbol layer — can fall outside the set; any such file is surfaced as an explicit `coverage-unknown` item rather than silently dropped, and the MVP answer never *claims* exhaustive reach (that is the aspirational symbol-level impact graph, AC#7).

---

## JS-G2
### Trace a spec to its verification and back

**Phase:** MVP
**References:** [03 — The One Graph](../docs/concept/03-the-one-graph.md), [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md)

> **When** I need to know whether a spec is actually backed by a test, **I want to** trace from the spec to the tests that verify it and back from any test to the specs it covers, **so I can** trust coverage as a structural fact instead of a filename convention or an act of faith.

**Essence:** Verification is an explicit, bidirectional `verifies` link in the one graph. The `has-verifier` delivery fact means a linked verifying test *exists and is enabled* — a structural fact, never a pass/fail verdict.

**Acceptance criteria:**
1. From a spec, I can see which tests are linked to it via `verifies`; from a test, I can see which specs it covers.
2. A test's verifying link to a spec is explicit (an **anchor**) and checkable — never silently inferred into a coverage assertion.
3. A spec that is `ready` but lacks `has-verifier` (no resolving verifying test) is surfaced as a `gap`, and a test that verifies a non-existent spec is a build error.
4. `has-verifier` is structural — a linked, enabled verifying spec/test is present (a **resolvable test binding**, not a runner verdict) — and the build never ingests or stores the run verdict **or runner status** (pass/fail, skipped, quarantined, glob-excluded all stay CI's, operational concern).
5. The trace is bidirectional and queryable directly from the graph, without leaving it.
6. Coverage gaps are reportable per spec, per capability, and across the whole graph, so blind spots are findable.
7. The trace survives refactors because it is keyed on stable IDs, not on test file locations.

---

## JS-G3
### Get curation assistance from the impact graph

**Phase:** Iterate
**References:** [06 — Consumers & Projections](../docs/concept/06-consumers-and-projections.md), [01 — Founding Principles & Invariants](../docs/concept/01-founding-principles-and-invariants.md)

> **When** the code has grown faster than the curated graph, **I want to** get narrow, honest signals from the impact graph about what might be missing or stale, **so I can** keep the curated architecture current without letting an import graph dictate it.

**Essence:** The curated graph answers "what *is* the architecture" (editorial, sparse); the impact graph answers "what could break / where is this used at all" (derived, exhaustive). The impact graph assists curation but never *becomes* it — divergence from the import graph is curation, not drift.

**Acceptance criteria:**
1. The impact graph is a derived import/symbol/call structure, regenerated on demand from code, never authored and never authoritative — so it does not constitute a second source of truth.
2. It offers exactly two assist roles beyond impact: **propose candidates** (e.g. a high-fan-in module with no curated node) and **flag unambiguous drift** (e.g. a `satisfies` target whose source file was deleted).
3. Proposals are suggestions a human accepts by editing the repo — they never auto-create declared or anchored edges.
4. The impact graph is never used to "densify" the curated graph by inferring architecture edges from imports.
5. A curated graph that is a deliberately small curated selection of the mechanical firehose is treated as correct by design, not as a coverage deficiency.
6. Any signal it raises carries the `inferred` `claim` and confidence, kept visibly distinct from declared/anchored facts.
7. Disabling the impact graph degrades gracefully — the curated graph, view, and validators are unaffected.

---

## JS-G4
### Find the specs that still need a verifier

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md) (§2 delivery facts), [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md)

> **When** I'm planning verification coverage for a `Pack` or release, **I want to** list the specs that lack an enabled verifier (the `has-verifier` `gap`s), **so I can** target exactly what needs a test instead of guessing or auditing files by hand.

**Essence:** Coverage is a structural fact in the one graph, not a spreadsheet. `has-verifier` is derived per spec (`02` §2); its absence on specs that warrant one is a surfaced `gap` — so "what is unverified" is a query, and a common QA situation is served without a second tool.

**Acceptance criteria:**
1. The graph answers "which specs in this `Pack` (or across the graph) have no resolving `has-verifier`" directly, as a list, not a count.
2. The answer reflects the structural fact only — a verifier *exists and is enabled* — never a pass/fail verdict, which stays CI's (`02` §2, JS-G2).
3. `ready` specs missing a verifier are highlighted as the priority slice (the honest "designed, stated done, unverified" gap), distinct from low-readiness specs that are not expected to have one yet.
4. Each gap is reachable to its spec in context (the Design Review, JS-E1/JS-E4), so planning a test starts from the spec, not a bare ID.
5. The result is stable across refactors because it is keyed on stable IDs and `verifies` edges, not test file locations.
6. The same query is available to an agent through the agent surface, so coverage planning can be handed to an agent as structured context.

---

## JS-G5
### Trace a decision to what it shaped, for an audit trail

**Phase:** Iterate
**References:** [02 — Core Model](../docs/concept/02-core-model.md), [03 — The One Graph](../docs/concept/03-the-one-graph.md) (§5 git is the event log)

> **When** I need to justify why the system is built the way it is, **I want to** trace a Decision Record to the specs and code it shaped — and back — **so I can** produce an audit trail from the graph and git instead of maintaining a separate compliance document.

**Essence:** `decidedBy` is an explicit, queryable edge, and git is the event log (`03` §5). Together they answer "what decision shaped this, and what did that decision touch" without a bespoke audit store — an auditor/compliance situation served by the same one graph.

**Acceptance criteria:**
1. From a `kind:"decision"` spec, I can list every spec that declares `decidedBy` it; from any spec, I can see the decisions that shaped it — both directions, from the graph.
2. The trace continues into code through the shaped specs' `satisfies` anchors, so a decision reaches the implementation it influenced.
3. The `supersedes` forward-pointer between decisions is followable, so the *current* decision and the ones it replaced (both still in the repo) are both visible, with history left to git.
4. Every step carries its `claim`, so an auditor can tell asserted intent (`declared`) from a binding (`anchored`) from machine-derived structure (`inferred`).
5. The trail is reconstructable at any commit — `git` plus a deterministic rebuild — so "what did this look like when the decision was made" needs no second store (`03` §5).
6. The trace is a pure projection: producing it never authors truth and never gives a write path to canonical source.
