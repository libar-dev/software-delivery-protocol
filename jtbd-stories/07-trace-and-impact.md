# G — Trace & Assess Impact

Once everything is one graph, the payoff is navigation: what does a change touch, and what proves a spec works. The job here is confident change and credible coverage.

---

## JS-G1
### See what a change impacts before making it

**Phase:** Iterate
**References:** [03 — Graph Metamodel](../docs/concept/03-graph-metamodel.md), [07 — Spec Studio & Projections](../docs/concept/07-spec-studio-and-projections.md)

> **When** I'm about to change a spec or a piece of code, **I want to** see what depends on it upstream and downstream, **so I can** refactor or re-scope with confidence instead of discovering the blast radius after the fact.

**Essence:** The one graph turns "what will this break?" into a query, not a guess.

**Acceptance criteria:**
1. For any spec or node, the system shows what it depends on and what depends on it.
2. Impact spans the chain — parent and child specs, the code that realises it, and the tests that verify it.
3. The impact answer is derived from the live graph, so it reflects the repo's current reality.
4. Each impacted item is identifiable and reachable, not just a count.
5. Inferred dependencies in the impact set are marked as such, so guesses aren't mistaken for certainties.
6. The impact view is available before committing a change, so it informs the decision.
7. The same impact answer can be handed to an AI agent as context for executing the change safely.

---

## JS-G2
### Trace a spec to its verification and back

**Phase:** MVP
**References:** [03 — Graph Metamodel](../docs/concept/03-graph-metamodel.md), [06 — Extraction & Validation](../docs/concept/06-extraction-and-validation.md)

> **When** I need to know whether a spec is actually proven, **I want to** trace from the spec to the tests that verify it and back from any test to the specs it covers, **so I can** trust coverage claims instead of assuming them.

**Essence:** Verification is an explicit, bidirectional link in the one graph — not a filename convention or an act of faith.

**Acceptance criteria:**
1. From a spec, I can see which tests claim to verify it.
2. From a test, I can see which specs it covers.
3. A test's claim to verify a spec is explicit and checkable — never inferred silently into a coverage assertion.
4. A spec that should be verified but has no verifying test is visibly surfaced as a gap.
5. A test that verifies a non-existent spec is caught as an error.
6. The trace is bidirectional and queryable without leaving the graph.
7. Coverage gaps are reportable per spec, capability, or the whole graph, so blind spots are findable.
