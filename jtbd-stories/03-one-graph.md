# C — One Graph

This theme *is* the founding principle expressed as jobs. There is one graph; it is derived from the repo; it is deterministic and regenerable; its `claim`s are honest; and git history is the event log. The graph is never a second source of truth — it is a projection of the repository at a commit.

---

## JS-C1
### Derive one canonical graph from the repo

**Phase:** MVP
**References:** [03 — The One Graph](../docs/concept/03-the-one-graph.md), [02 — Core Model](../docs/concept/02-core-model.md)

> **When** I have authored specs and anchored code, **I want to** build one canonical graph of nodes and edges directly from the repo, **so I can** query the whole delivery state without standing up or syncing a second store.

**Essence:** No second graph, ever. The graph is a pure function of the repo, derived by a single extractor — never separately authored.

**Acceptance criteria:**
1. A single command (`sdp build`) turns the repo's spec files, code anchors, and basic structural facts into one graph.
2. The graph is the *only* graph — there is no parallel database that could drift from the code; every consumer (view, trace, agent) reads the graph, and only the extractor reads source to build it.
3. The graph is flat — arrays of nodes and edges, with hierarchy and containment expressed as edges (`belongsTo`, `refines`) rather than nested objects.
4. Building the graph needs no running services, network calls, or external state; the extractor's only outputs are the graph and a validation report.
5. Nothing in the graph originates outside the repo (plus pinned inputs); the graph is a strict function of repo contents at the built commit.
6. The graph answers the everyday questions — what satisfies this spec, what is unverified, what is incomplete — without bespoke per-question tooling.
7. The graph file is treated as derived output (under `generated/`, gitignored), not hand-edited source.

---

## JS-C2
### Trust every edge's `claim`

**Phase:** MVP
**References:** [03 — The One Graph](../docs/concept/03-the-one-graph.md)

> **When** I look at a relationship in the graph, **I want to** know whether it was **declared** by an author, **anchored** by an in-code pointer (an anchor), or **inferred** by structural analysis, **so I can** trust intentional facts and treat guesses as guesses.

**Essence:** The `claim` is never silently collapsed or promoted. The three stay distinguishable forever; inference never becomes truth on its own.

**Acceptance criteria:**
1. Every node and edge records its `claim`: `declared`, `anchored`, or `inferred`.
2. The three are visibly distinct everywhere they appear — never merged into one undifferentiated blob.
3. An inferred edge is never automatically converted into a declared one; promotion happens only through an explicit human act that lands in the repo.
4. Inferred edges carry a confidence signal, are rendered differently, and never trigger a validator *error* on their own — they are advisory.
5. When inference and a declared fact disagree, the declared fact wins; a deterministic precedence resolves layering, but a genuine contradiction (duplicate ID, an anchor contradicting a declaration) is a loud build error, not a silent winner.
6. Delivery facts are derived, not declared: a spec's realization (`implemented` / `has-verifier` / `observed`) is computed from edges by the pipeline, never authored by hand.
7. The `claim` of any edge traces back to a specific source location (file/line) or to the extractor that produced it.

---

## JS-C3
### Regenerate the graph as a pure function of the repo

**Phase:** MVP
**References:** [03 — The One Graph](../docs/concept/03-the-one-graph.md)

> **When** I suspect the graph is stale or just want a clean slate, **I want to** delete it and rebuild it byte-identically from the repo, **so I can** treat the graph as disposable and never worry about it diverging from the code.

**Essence:** The repository is canonical; the graph is regenerable. "Drift" is impossible because the graph holds no state of its own — determinism is what makes "derived" falsifiable.

**Acceptance criteria:**
1. Deleting everything under `generated/` and rebuilding produces a byte-identical graph: nodes sorted by `id`, edges sorted by `(from, type, to)`, no wall-clock timestamps or run-specific hashes in the compared output.
2. The graph holds no authored state that would be lost on deletion — everything reconstructs from the repo.
3. "Is the graph in sync?" is a rebuild-and-compare (`sdp build --check-clean`) that asserts a fresh rebuild is byte-identical to an independent rebuild from the same commit — not a reconciliation against a committed artifact (`generated/` is gitignored, never a committed graph to diff against).
4. A non-static expression in a spec degrades locally — that one property is dropped with a warning and the rest of the spec survives — rather than making derivation non-deterministic or aborting the build.
5. A full rebuild is fast enough to run routinely (the bounded MVP context rebuilds wholesale; incremental builds are a later optimisation that must stay subordinate to determinism).
6. Generated artifacts are never hand-edited; the only way to change them is to change the repo and regenerate.
7. Because the build is deterministic and order-stable, diffs between commits reflect real change, not serialization noise.

---

## JS-C4
### Reconstruct history from git, not a second store

**Phase:** MVP
**References:** [03 — The One Graph](../docs/concept/03-the-one-graph.md), [01 — Founding Principles & Invariants](../docs/concept/01-founding-principles-and-invariants.md)

> **When** I need to know how a spec or decision evolved, **I want to** reconstruct its history from git commits, **so I can** audit and time-travel with the tools I already have instead of a separate event store.

**Essence:** Git history *is* the event log. The graph carries only current state; the commit log is the event stream, and the graph is a projection of the repo at any chosen commit.

**Acceptance criteria:**
1. The graph carries only current state — no change history, no audit trail, no superseded/deprecated bookkeeping as live nodes.
2. A spec removed from the current repo is absent from the current graph; to see what it used to say, check out the prior commit and regenerate.
3. A spec's evolution and "who changed it and why" are answered by ordinary git tooling (`git log`, `git blame`, PRs) — no separate change-log, audit table, or event database exists or needs maintaining.
4. The graph can be rebuilt at any past commit, reproducing the delivery state as it was then (a direct consequence of determinism, JS-C3).
5. Comparing the graph at two commits is comparing two projections, yielding a meaningful diff of how intent and structure changed — without any second store.
6. The one permitted forward-pointer is a decision spec declaring `supersedes` another record that *also still exists* in the repo — current authored intent, identical in kind to `refines`, not the graph storing a timeline.
7. The `claim` and authorship of any edge survive in history because they live in the committed code; a rich diff/time-travel UI over these projections is a natural follow-on, not a precondition.
