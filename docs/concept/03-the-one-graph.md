# 03 — The One Graph

The graph is the heart of the trust model. This document defines how it is derived, why it is deterministic, how the `claim` taxonomy stays honest, why it is regenerable, and why git — not the graph — is the event log. It realises **P1** (canonical repo), **P2** (one read model), **P3** (determinism), **P9** (the `claim` never collapsed), **P10** (inference never authoritative), and **git is the event log** from `01`.

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

- **Typed spec files** (`/specs/**/*.sdp.ts`) — the declared layer: specs, packs, relations.
- **Source-code anchors** — the anchored layer: an **anchor** binds a code location to a spec ID — identity, an optional label, and one `satisfies`/`verifies` target; richer structural facts are aspirational (`04` §2). Anchors carry *no* intent (see `04`).
- **Structural facts** — the inferred layer: machine-derived structure (imports, calls, symbol identity). Designed-in — the `claim` value and the advisory edge row exist, and every consumer decodes them — but **empty in the MVP**: the entry adapters and file-level impact resolve off the curated layers (`06` §2), so nothing yet needs an inferred edge; the first producer is the aspirational impact graph.

The graph is **flat**: arrays of nodes and arrays of edges. Hierarchy and containment are expressed as edges (`belongsTo`, `refines`), never by nesting nodes inside nodes. This is a Representation (chosen for uniform querying and cheap diffs), held as a hard rule.

```jsonc
{
  "schemaVersion": "0.1.0",
  "nodes": [
    { "id": "spec:orders.create-order", "nodeType": "Primitive", "specKind": "behavior", "altitude": "feature", "readiness": "ready", "deliveryFacts": ["implemented"], "claim": "declared", "file": "specs/orders/create-order.sdp.ts" },
    { "id": "impl:orders.create-order-use-case", "nodeType": "CodeNode", "claim": "anchored", "file": "src/orders/create-order.use-case.ts", "line": 12 }
  ],
  "edges": [
    { "from": "impl:orders.create-order-use-case", "type": "satisfies", "to": "spec:orders.create-order", "claim": "anchored" },
    { "from": "test:orders.create-order.valid-cart", "type": "verifies", "to": "spec:orders.create-order.valid-cart", "claim": "anchored" }
  ]
}
```

Node typing keeps concerns separate: every node carries `nodeType` (`Primitive` / `Pack` / `Anchor` / `CodeNode` / …), and `Primitive` nodes additionally carry `specKind` (the truth-category from `02`). This split prevents the old single `kind` field from colliding between structural class and domain truth-category. **Delivery facts** (`implemented` here) are **computed from edges** — the `satisfies` edge resolving to the spec — not authored on the node; readiness (`ready`) is the authored maturity, kept separate (`02` §2). The `satisfies` edge runs **code → spec** and is **anchored** (derived from an anchor), never hand-authored. The `verifies` edge runs **verifier → its direct target** — here the test verifies the *example* (`spec:orders.create-order.valid-cart`), not the parent; `has-verifier` is then computed per spec from the edges resolving to each, never propagated transitively up `refines` (`02` §2, *Verifier semantics*).

### The edge contract — one row per edge type

Every edge in the graph has a fixed contract: where it comes from, what `claim` it carries, which surface authors it (if any), how a validator treats a broken one, and what it feeds. This table is the single reference (the per-relation detail lives in `02` §3 and `04`):

| Edge | From → To (`nodeType`) | Authored / Derived | `claim` | Authoring surface | Validator severity | Readiness effect | Delivery-fact effect |
|---|---|---|---|---|---|---|---|
| `refines` | Primitive → Primitive | authored | declared | spec `relations[]` | **error** if target missing | `ready` floor: target ≥ `defined` | — |
| `dependsOn` | Primitive → Primitive | authored | declared | spec `relations[]` | **error** if target missing | `ready` floor: target ≥ `defined` | — |
| `constrainedBy` | Primitive → Primitive (`constraint`) | authored | declared | spec `relations[]` | **error** if target missing | — | — |
| `decidedBy` | Primitive → Primitive (`decision`) / `doc:` | authored | declared | spec `relations[]` | **error** if target missing (unless `doc:`) | — | — |
| `verifies` | Primitive (`example`) **or** Anchor (test) → Primitive | authored | `declared` (from an example) / `anchored` (from a test anchor) | spec `relations[]` **or** `specTest` anchor | **error** if target missing | — | contributes `has-verifier` to the **target** (if the verifier is *enabled*) |
| `supersedes` | Primitive (`decision`) → Primitive (`decision`) | authored | declared | spec `relations[]` | **error** if target missing | — | — |
| `satisfies` | CodeNode → Primitive | derived (from an anchor) | anchored | source **anchor** | **error** if target missing | `ready` floor: present anchors must *resolve* | contributes `implemented` to the **target** |
| `belongsTo` | Primitive → Pack | derived (from the manifest) | declared (inherited) | `Pack` manifest `specs[]` | **error** if member missing/duplicate | — | — |
| calls / imports | CodeNode → CodeNode | derived (analysis) | inferred | — (machine) | **advisory** — never errors on its own | — | feeds the impact graph only |

**Delivery facts are node facts, not edges.** `implemented` / `has-verifier` / `observed` are computed *from* the `satisfies` / `verifies` / runtime edges above and shown as badges on the node (`02` §2) — they are never authored and never themselves edges.

---

## 2. Determinism (P3)

Given the same repo at a commit, the extractor emits a **byte-identical** graph:

- nodes sorted by `id`, edges sorted by `(from, type, to)`;
- no wall-clock timestamps, no run-specific hashes in the semantically-compared output (any metadata like a build hash is contained and excluded from comparison);
- a determinism check (`sdp build --check-clean`) rebuilds and asserts the result is byte-identical to an independent rebuild from the same commit — never a comparison against a committed `generated/` artifact, which is gitignored (L8). A divergence is a detectable, failable condition.

Determinism is what makes "derived" *falsifiable*. Without it, the no-second-store rule (below) cannot be enforced, because you could not prove the graph is a function of the repo.

A consequence: the authoring surface must be statically extractable (P5). A non-static expression in a spec file would make derivation non-deterministic, so the extractor responds in two tiers (`04` §1): a non-static **envelope** field (`id` · `kind` · `altitude` · `readiness` · any relation target) is a **hard error that fails the build** — the graph cannot be keyed or typed without it — while non-static **optional section** detail is dropped with a warning (graceful partial extraction, L3) rather than guessed.

---

## 3. The `claim` taxonomy — declared / anchored / inferred (P9, P10)

Every node and edge records its **`claim`** — its epistemic status. The three are kept strictly distinct, forever, and never collapsed.

| `claim` | Means | Authority | Example |
|---|---|---|---|
| **declared** | human intent, explicit in a spec/pack file | authoritative intent | `spec:orders.create-order refines spec:checkout.complete-purchase` |
| **anchored** | a human *binding* — an **anchor** points code → a spec ID | authoritative binding (no intent) | `impl:* satisfies spec:*` via an anchor on the code |
| **inferred** | machine-derived structure | *advisory* — never authoritative | `impl:A calls impl:B` (from `ts-morph`) |

Rules that keep this honest:

- **Inferred edges are never authoritative (P10).** They carry confidence, are rendered differently in views, never trigger a validator *error* on their own, and can become "declared" only by a human editing the repo — never by silent promotion.
- **A computed-from-authored edge inherits its source's `claim`.** There is no 4th `claim`; `inferred` is the *advisory* kind, derived by analysis (calls, imports). An edge computed deterministically from an authored source is a derivation *mechanism*, not a claim category — so `belongsTo` (a re-expression of the `Pack`'s declared manifest) carries `claim:"declared"`, **not** advisory `inferred`.
- **Ambiguity is loud (L2).** A genuine conflict — two declarations that contradict, a duplicate ID, an anchor that disagrees with a declaration — is a build error, not a silent merge. A deterministic precedence (declared over anchored over inferred) resolves *layering*, but never a true contradiction.
- **Delivery facts are derived, not declared (epistemic boundary).** A spec's realization (`implemented` / `has-verifier` / `observed`) is computed from edges, never authored by a human. In the MVP, `has-verifier` is *structural* — a linked, enabled verifying spec/test exists — and test run results are **not** ingested (operational, CI's domain). The runtime path that would carry truly observed data (`observed`) is aspirational. *(See `06`, `07`.)*

> This is the difference between the Protocol and a documentation generator: a doc generator treats every edge as an equal "fact." The Protocol knows which edges are *intent a human asserted*, which are *a binding a human anchored*, and which are *structure a machine guessed*, and never lets one masquerade as another.

---

## 4. Regenerability and the no-second-store rule (P1, P2)

- `generated/` is gitignored and disposable (L8). Delete it, run `sdp build`, get the same bytes back.
- No consumer reads source directly or keeps a parallel model (P2). The view reads the graph; the trace query reads the graph; an AI agent reads the graph (as JSON). One read model, many readers. Consumers may *link to* source locations recorded in the graph (a Design Review linking to the anchored file/line is legitimate); what is forbidden is independently *re-parsing* source to derive a parallel model (DECISIONS R2).
- The MVP graph is a **single JSON file** plus an in-memory graph for queries. A property-graph database is deferred until measured traversal pain — and the schema is designed to map cleanly to one later, so the deferral has forethought.

There is no "is the graph in sync with the repo?" question, because the graph is *defined* as a function of the repo. The only thing to trust is `git` and the code.

---

## 5. Git is the event log

Founding Principle #5: **git history IS the event log; the graph and all views are projections of the repo at a commit.** Applied to the graph:

- **The graph carries only current state.** It is the projection of the repo *as it is now*. It does not carry change history, audit trails, or superseded/deprecated bookkeeping as live state.
- **History is a `git` operation.** To see what a spec used to say, check out the prior commit and regenerate the graph. `git log` / `git blame` *is* the lifecycle history. The graph never reimplements it.
- **Removed means gone.** A spec deleted from the current repo is absent from the current graph. Its past lives in git, not in a "deleted" flag on a graph node.
- **The one kept forward-pointer** — a decision spec declaring it `supersedes` another — is a *current* authored relationship between two records both present in the repo, not the graph storing a timeline. (Full rationale in `01`, the git-is-the-event-log section.)

Anything reconstructable from git is left to git.

### A graph diff is just two projections

Because the graph is a deterministic projection, comparing two commits is comparing two graphs:

```
graph(commitA)  vs  graph(commitB)   →  added / removed / changed nodes and edges
```

This gives change-impact and history reconstruction *without* a second store and without history-in-graph bookkeeping — it is git plus determinism. *(A rich impact UI is aspirational; the underlying diff is a natural consequence of the model.)*

---

## 6. Schema versioning (minimal)

The graph self-describes its `schemaVersion`. The MVP needs only that consumers can read the version and the field is present; full SemVer negotiation and a `migrate` command are aspirational. The envelope-stable / section-extensible shape (L9) means most growth is additive (MINOR), so heavyweight migration machinery is not an MVP concern.
