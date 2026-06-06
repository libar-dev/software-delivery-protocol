# C — One Graph

This theme *is* the founding principle expressed as jobs. There is one graph, it is derived from the repo, it is regenerable, and its provenance is honest. Git history is the event log.

---

## JS-C1
### Derive one canonical graph from the repo

**Phase:** MVP
**References:** [02 — System Architecture](../docs/concept/02-system-architecture.md), [03 — Graph Metamodel](../docs/concept/03-graph-metamodel.md)

> **When** I've authored specs and marked code, **I want to** have the system build one canonical graph of nodes and relationships directly from the repo, **so I can** query the whole delivery state without standing up or syncing a second store.

**Essence:** No second graph, ever. The graph is a projection of the repository — derived, never separately authored.

**Acceptance criteria:**
1. A single command turns the repo's specs, markers, and structural facts into one graph.
2. The graph is the *only* graph — there is no parallel database that could drift from the code.
3. The graph is a strict function of repo contents: nothing in it originates outside the repo (and pinned inputs).
4. Building the graph requires no running services, network calls, or external state.
5. The graph is queryable for the everyday questions — what implements this spec, what's unverified, what's incomplete — without bespoke tooling.
6. If two builds run on the same commit, they produce the same graph.
7. The graph file is treated as derived output, not hand-edited source.

---

## JS-C2
### Trust every edge's provenance

**Phase:** MVP
**References:** [03 — Graph Metamodel](../docs/concept/03-graph-metamodel.md)

> **When** I look at a relationship in the graph, **I want to** know whether it was *declared* by an author, *annotated* on code, or *inferred* by analysis, **so I can** trust intentional facts and treat guesses as guesses.

**Essence:** Provenance is never silently collapsed or promoted. The three sources stay distinguishable forever; inference never becomes truth on its own.

**Acceptance criteria:**
1. Every edge records its source: declared, annotation-derived, or inferred.
2. Declared and inferred edges are visibly distinct everywhere they appear — never merged into one undifferentiated blob.
3. An inferred edge is never automatically converted into a declared one; promotion is always an explicit human act that lands in code.
4. Inferred edges can carry a confidence signal so low-certainty guesses are obviously weaker.
5. Validation gates treat inferred edges as advisory by default — they don't fail a build on their own.
6. When inference and a declared fact disagree, the declared fact wins and the conflict is surfaced, not hidden.
7. The provenance of any edge traces back to a specific source location (file/line) or extractor.

---

## JS-C3
### Regenerate the graph as a pure function of the repo

**Phase:** MVP
**References:** [02 — System Architecture](../docs/concept/02-system-architecture.md)

> **When** I suspect the graph is stale or just want a clean slate, **I want to** delete it and rebuild it identically from the repo, **so I can** treat the graph as disposable and never worry about it diverging from the code.

**Essence:** The repository is canonical; the graph is regenerable. "Drift" becomes impossible because the graph holds no state of its own.

**Acceptance criteria:**
1. Deleting all generated output and rebuilding produces the same graph as before.
2. The graph holds no authored state that would be lost on deletion — everything reconstructs from the repo.
3. A "is the graph in sync?" check is a rebuild-and-compare, not a reconciliation process.
4. Regeneration is fast enough to run routinely (incrementally on change; fully in CI).
5. Any divergence between a checked-in graph and a fresh rebuild is a detectable, failable condition.
6. Generated artifacts are never hand-edited; the only way to change them is to change the repo and regenerate.
7. The build is deterministic and order-stable, so diffs between commits reflect real change, not noise.

---

## JS-C4
### Reconstruct history from git, not a second store

**Phase:** Iterate
**References:** [02 — System Architecture](../docs/concept/02-system-architecture.md), [08 — Delivery Evidence & Tooling](../docs/concept/08-delivery-evidence-and-tooling.md)

> **When** I need to know how a spec or decision evolved, **I want to** reconstruct its history from git commits, **so I can** audit and time-travel using the tools I already have instead of a separate event store.

**Essence:** Event store + projections = code and git commits. The commit log *is* the event stream; the graph is a projection of it at any point.

**Acceptance criteria:**
1. A spec's evolution is fully recoverable from the commit history of its files.
2. The graph can be rebuilt at any past commit to see the delivery state as it was then.
3. No separate change-log, audit table, or event database exists or needs maintaining.
4. "Who changed this and why" is answered by ordinary git tooling (blame, log, PRs).
5. Comparing the graph at two commits yields a meaningful diff of how intent and structure changed.
6. Restoring a previous state is a git operation, after which regeneration reproduces that state's graph exactly.
7. Provenance and authorship survive in history because they live in the committed code, not in a derived store.
