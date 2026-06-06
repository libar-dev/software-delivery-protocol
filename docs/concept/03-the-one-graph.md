# 03 — The One Graph

The graph is the heart of the trust model. This document defines how it is derived, why it is deterministic, how provenance stays honest, why it is regenerable, and why git — not the graph — is the event log. It realises **P1** (canonical repo), **P2** (one read model), **P3** (determinism), **P9** (provenance never collapsed), **P10** (inference never authoritative), and **git is the event log** from `01`.

> The graph is a *projection of the repository at a commit*. It is never a second source of truth.

---

## 1. Derivation

```
repo (specs + source + structural facts)
        │   ts-morph extractor  (pure: reads source, writes graph + report)
        ▼
graph.json   (the single read model — P2)
        │   generators (pure: graph → output)
        ▼
generated/   (views, exports, slices — all disposable, L8)
```

Two pure steps: `graph = f(repo)` and `output = f(graph)`. The extractor is the *only* thing that reads source to build the graph; everything else reads the graph and only the graph (P2). The extractor has no database, no remote calls, and no side effects beyond emitting the graph and the validation report.

### What the extractor reads

- **Typed spec files** (`/specs/**/*.spec.ts`) — the declared layer: specs, packs, relations.
- **Source-code markers** — the annotation layer: a marker binds a code location to a spec ID and minimal structural facts (component, satisfies, implements). Markers carry *no* intent (see `04`).
- **Structural facts** — the inferred layer: `ts-morph`-derived structure (which file defines which `impl`, basic test discovery linking `test:*` to the specs they `verify`). In the MVP this layer is kept minimal and advisory.

The graph is **flat**: arrays of nodes and arrays of edges. Hierarchy and containment are expressed as edges (`belongsTo`, `contains`), never by nesting nodes inside nodes. This is a Representation (chosen for uniform querying and cheap diffs), held as a hard rule.

```jsonc
{
  "schemaVersion": "0.1.0",
  "nodes": [
    { "id": "spec:orders.create-order", "kind": "Spec", "abstraction": "feature", "readiness": "bound", "provenance": { "source": "declared", "file": "specs/orders/create-order.spec.ts" } },
    { "id": "impl:CreateOrderUseCase", "kind": "Implementation", "provenance": { "source": "annotation", "file": "src/orders/create-order.use-case.ts", "line": 12 } }
  ],
  "edges": [
    { "from": "spec:orders.create-order", "type": "satisfiedBy", "to": "impl:CreateOrderUseCase", "provenance": { "source": "annotation" } },
    { "from": "test:orders.create-order.valid-cart", "type": "verifies", "to": "spec:orders.create-order", "provenance": { "source": "annotation" } }
  ]
}
```

---

## 2. Determinism (P3)

Given the same repo at a commit, the extractor emits a **byte-identical** graph:

- nodes sorted by `id`, edges sorted by `(from, type, to)`;
- no wall-clock timestamps, no run-specific hashes in the semantically-compared output (any metadata like a build hash is contained and excluded from comparison);
- a drift check (`akg build --check-clean`) rebuilds and asserts the committed/generated output matches.

Determinism is what makes "derived" *falsifiable*. Without it, the no-second-store rule (below) cannot be enforced, because you could not prove the graph is a function of the repo.

A consequence: the authoring surface must be statically extractable (P5). A non-static expression in a spec file would make derivation non-deterministic; the extractor instead drops that one property and surfaces a warning (graceful partial extraction, L3) rather than guessing.

---

## 3. Provenance — declared / annotation / inferred (P9, P10)

Every node and edge records *where it came from*. The three sources are kept strictly distinct, forever, and never collapsed.

| Source | Means | Authority | Example |
|---|---|---|---|
| **declared** | explicit in a spec/arch file | human-asserted intent, authoritative | `spec:orders.create-order refines spec:checkout.complete-purchase` |
| **annotation** | bound by an in-code marker | human-asserted binding, authoritative | `test:* verifies spec:*` via a marker on the test |
| **inferred** | structurally derived by the extractor | machine fact, *advisory* | `impl:A calls impl:B` (from `ts-morph`) |

Rules that keep this honest:

- **Inferred edges are never authoritative (P10).** They carry confidence, are rendered differently in views, never trigger a validator *error* on their own, and can become "declared" only by a human editing the repo — never by silent promotion.
- **Ambiguity is loud (L2).** A genuine conflict — two declarations that contradict, a duplicate ID, a marker that disagrees with a declaration — is a build error, not a silent merge. A deterministic precedence (declared over annotation over inferred) resolves *layering*, but never a true contradiction.
- **Evidence is observed, not declared (epistemic boundary).** Where evidence exists, the pipeline writes it from observation, never a human. In the MVP, "verification" is *structural* — a linked, enabled verifying spec/test exists — and test run results are **not** ingested (operational, CI's domain). The runtime-evidence overlay that would carry truly observed data is aspirational. *(See `06`, `07`.)*

> This is the difference between Libar Omni and a documentation generator: a doc generator treats every edge as an equal "fact." Libar Omni knows which edges are *intent a human asserted* and which are *structure a machine guessed*, and never lets the second masquerade as the first.

---

## 4. Regenerability and the no-second-store rule (P1, P2)

- `generated/` is gitignored and disposable (L8). Delete it, run `akg build`, get the same bytes back.
- No consumer reads source directly or keeps a parallel model (P2). The view reads the graph; the trace query reads the graph; an AI agent reads the graph (as JSON). One read model, many readers.
- The MVP graph is a **single JSON file** plus an in-memory graph for queries. A property-graph database is deferred until measured traversal pain (~10k+ nodes) — and the schema is designed to map cleanly to one later, so the deferral has forethought.

There is no "is the graph in sync with the repo?" question, because the graph is *defined* as a function of the repo. The only thing to trust is `git` and the code.

---

## 5. Git is the event log

Founding Principle #5: **git history IS the event log; the graph and all views are projections of the repo at a commit.** Applied to the graph:

- **The graph carries only current state.** It is the projection of the repo *as it is now*. It does not carry change history, audit trails, or superseded/deprecated bookkeeping as live state.
- **History is a `git` operation.** To see what a spec used to say, check out the prior commit and regenerate the graph. `git log` / `git blame` *is* the lifecycle history. The graph never reimplements it.
- **Removed means gone.** A spec deleted from the current repo is absent from the current graph. Its past lives in git, not in a "deleted" flag on a graph node.
- **The one kept forward-pointer** — an ADR/decision declaring it `supersedes` another — is a *current* authored relationship between two records both present in the repo, not the graph storing a timeline. (Full rationale in `01`, the git-is-the-event-log section.)

Anything reconstructable from git is left to git.

### A graph diff is just two projections

Because the graph is a deterministic projection, comparing two commits is comparing two graphs:

```
graph(commitA)  vs  graph(commitB)   →  added / removed / changed nodes and edges
```

This gives change-impact and history reconstruction *without* a second store and without history-in-graph bookkeeping — it is git plus determinism. *(A rich impact UI is aspirational; the underlying diff is a natural consequence of the model.)*

---

## 6. Schema versioning (minimal)

The graph self-describes its `schemaVersion`. The MVP needs only that consumers can read the version and the field is present; full SemVer negotiation and a `migrate` command are aspirational. The envelope-stable / facet-extensible shape (L9) means most growth is additive (MINOR), so heavyweight migration machinery is not an MVP concern.
</content>
