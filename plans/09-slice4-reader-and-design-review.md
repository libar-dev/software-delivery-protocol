# Plan 09 — Slice 4: the agent surface (the reader) and the Design Review

> **Status: ✅ EXECUTED 2026-06-10** — all five work items landed on `feature/anchors`;
> `npm run check` green end-to-end, closing with the re-pointed gate (`check:example` = the built
> CLI running `view examples/checkout-v1 --check-clean`: 0 errors · the 1 standing warning ·
> 11 pages). The consumer half of the MVP story (`06` §10) now exists: `createReader(graph)` is
> the one decode path (joins · `claim` decode · recomputed delivery facts · derived readiness ·
> findings, once at construction), `renderDesignReview(reader)` is the one human view (Markdown:
> index + per-spec + per-pack pages, golden-pinned byte-for-byte), and `sdp view` = `sdp validate`
> + render with the view directory owned wholesale (temp-then-rename; a stale page never survives;
> on extraction hard errors the stale view is removed exactly as the stale graph). The **graph
> golden is byte-identical to the Slice-3 bytes** (this slice only reads), `deriveReadiness` rides
> the same floor table (MD-13 — no second floor), and the inferred set is **decided: empty**
> (§1.4 — the consumers resolve off the curated layers; `03` §1 / `07` §2 state the settled rule).
>
> **Execution deviations, all minor:** (1) the planned separate per-spec "Impact" section
> duplicated the relations list line-for-line — merged into one **"Relations & impact (one hop)"**
> section carrying both readings (information stated once, JS-E1/JS-G1 both served); (2) only
> *incoming* `verifies` edges render under Bindings — a verifier's own page must show what it
> covers (JS-G2), so *outgoing* `verifies` stays in the relations list; (3) the example itself
> turned out to demonstrate the honest divergence direction — every spec states `defined` and
> structurally clears `ready`, rendered as header information with no banner (the dishonest
> direction is pinned by a divergent fixture); (4) `.prettierignore` gained the golden view tree
> and `generated/` (derived bytes are the renderer's, never format-policed — the
> `expected-graph.json` precedent extended); (5) `findByConcept` counts `model.terms` *keys* as
> content (the vocabulary section's keys are the terms) while structural keys never match.
>
> **Next session: Slice 5 — polish**: the CLI surface (`explain`/`search` candidates weighed
> against the second-caller bar), error-message quality, the documented example walkthrough, and
> the clean-repo determinism test; the decision-spec fold (DECISIONS durables → `kind:"decision"`
> specs) follows the slices as before.
>
> **Spec anchors:** `06` §3 (the agent surface — a typed graph the agent scripts; the reader; the
> freeze discipline: entry adapters · file-level blast-radius · irreducible joins, everything else
> a script) · `06` §2 (two surfaces; the MVP impact boundary — file-level, `coverage-unknown`,
> never claims exhaustive reach) · `06` §5 (the Design Review; the one MVP read-only view; form is
> a Representation) · `05` §3 (stated vs derived readiness — the divergence is surfaced) ·
> `03` §1/§4 (consumers read the graph and only the graph; links to recorded source locations are
> legitimate, independent re-parsing is not — R2) · `07` §6 ③ (the derived-readiness banner) ·
> ④ (`implemented` is a UI hazard — binding language in views) · ⑤ (`coverage-unknown` is a
> Slice-4 acceptance criterion) · JTBD JS-E1 (one generated view), JS-E2 (the agent surface),
> JS-E4 (conduct a Design Review), JS-G1 (impact before change), JS-G2 (trace spec ↔ test),
> JS-G4 (specs that still need a verifier).

## Context

Slice 3 closed the one validation path: `validateGraph` is the sole validation seam, the example
validates to 0 errors and exactly 1 warning (the invalid-cart example's unenabled verifier), and
CI gates on the built CLI. What exists is a producer stack — extract → graph → checks — with no
consumer: nothing joins the graph for an agent, and no human surface renders it. The inferred
layer carries zero claims, deferred to be "decided with its Slice-4 consumer."

Slice 4 delivers the consumer half of the MVP story (`06` §10): the **reader** (the component
behind the agent surface) and the **Design Review** (the one generated read-only view), both pure
functions of the one graph. No schema growth: `schemaVersion` stays `0.3.0`, the graph golden
stays byte-identical — everything this slice adds reads the graph; nothing writes it.

## §1 — Decisions this plan pins (Representation, not DECISIONS.md entries)

1. **The reader is the one decode path; the view consumes the reader.** `createReader(graph)`
   does the joins, the `claim` decode, the delivery-fact recomputation, derived readiness, and the
   validation findings **once at construction** (`06` §3); accessors return plain, composable,
   JSON-able data, deterministically sorted; the reader persists nothing and is rebuilt fresh each
   load. The Design Review renderer consumes **only** reader data — it never re-joins the graph.
   One join path, exactly as MD-14 made one validation path: a view that re-derived its own joins
   would be the consumption-side second store. The reader *calls* `validateGraph` and
   `computeDeliveryFacts` (the existing seams) — it re-implements neither; exposed delivery facts
   are the **recomputed** ones (identical on extractor output by construction, fail-closed for a
   foreign producer — the same posture `honesty/gaps` took in Slice 3, and the divergence is
   already the delivery-facts check's error, which the reader surfaces as findings).

2. **The frozen surface** — exactly the `06` §3 irreducible set, nothing more:
   - **`findByConcept(text)`** — the grep→graph bridge from a *string*: deterministic,
     case-insensitive substring match over node id, title, pack framing, and section prose
     (rules, example lines, terms, intent fields); results carry *where* they matched and sort by
     (best-matched field rank, id). No fuzzy scoring — determinism over cleverness.
   - **`byFile(path)`** — the bridge from a *file*: a root-relative POSIX path → the nodes the
     graph records at it (specs/packs authored there; anchors and code nodes bound there) and the
     specs those bindings reach. Resolves off the curated graph + anchors, no symbol index.
   - **`blastRadius(changedFiles)`** — the bridge from a *changeset* (file-level, `06` §2):
     changed files → `byFile` → directly **impacted** specs/packs → one explicit curated-graph hop
     to **at-risk** items (declared `refines`/`dependsOn` in both directions, plus the verifiers
     and implementations bound to impacted specs), each carrying *why* (the connecting edge type,
     direction, and `claim` — JS-G1 AC4/AC5). A changed file with no graph mapping is an explicit
     **`coverage-unknown`** entry, never silently dropped (⑤). One hop, reasons named: deeper
     reach is a script over the same shapes; symbol-level reach is the aspirational impact graph.
   - **`specContext(id)`** — the irreducible cross-source join: envelope + sections + relations
     out/in (resolution + target titles decoded) + bindings (implementations; verifiers with
     enabled-status) + recomputed delivery facts + stated vs derived readiness + the spec's own
     findings. This is simultaneously what the Design Review renders per spec — the second
     consumer that justifies freezing it.
   - **`packContext(id)`** — the pack reviewed as a unit (JS-E4 AC4): framing, members with their
     readiness/facts, `modelRefs`, and the pack's verifier gaps (JS-G4 — `ready` members missing
     a verifier highlighted as the priority slice).
   - Flat accessors (`specs()` · `packs()` · `findings()`) and the raw `graph`, so everything
     else — single-field traversals, group-bys, the maturity ladder — stays a script.
   - **`bySymbol` is not stubbed.** A typed method that throws "not implemented" would fake a
     capability exactly as under-typing hides one; its frozen *shape* stays prose (`06` §3) until
     the exhaustive impact graph exists. Pinned by a `@ts-expect-error` typecheck fixture.

3. **Derived readiness lands beside the floor — same table, no second floor (MD-13 preserved).**
   `deriveReadiness(node, index)` in `readiness-floor.ts`: the highest rung whose cumulative
   clauses all pass (`undefined` when even `idea`'s fail); total over unratified descriptors
   (no clauses evaluated — the conformance error owns that finding, exactly as the evaluator).
   The banner (③) is then pure rendering: *stated* from the envelope, *floor reached* derived,
   the first unmet clause named by the existing evaluator. Divergence renders loud only in the
   dishonest direction (derived < stated); derived ≥ stated is ordinary header information —
   the floor is never a quota and never nags upward.

4. **The minimal advisory `inferred` set is decided: empty.** The deferred decision meets its
   consumer and the consumer needs zero inferred edges — the MVP boundary (`06` §2) already
   resolves `findByConcept`/`byFile`/blast-radius off the curated layers with no symbol index.
   So the MVP ships the `inferred` **category** (typed in the schema, decoded by the reader,
   rendered distinguishably, marked advisory in impact answers — JS-G1 AC5) with **zero
   producers**; the first producer is the aspirational impact graph. Additive, not hard to
   reverse, and forced by the base — recorded here, not in DECISIONS.md. `03` §1 and `07` §2
   state the settled rule.

5. **The view is generated Markdown under `generated/design-review/`.** Form is a Representation
   (`06` §5); Markdown wins the MVP: byte-exact determinism is trivial, the artifact is readable
   by both remaining consumers (humans in any renderer, agents as text), and there is no asset
   pipeline. Layout: `index.md` (counts · spec table with stated/derived readiness and binding
   badges · packs · the full findings table · gaps) plus one page per `Primitive` and per `Pack`.
   The id→path mapping is the bijective namespace split (`spec:orders.create-order` →
   `spec/orders.create-order.md`) — collision-free by the id grammar (exactly one `:`, segments
   filesystem-safe). Anchor/code nodes get no pages; they render as bindings with `file:line`
   source links (links to locations *recorded in the graph* — R2). Pages carry no timestamps and
   no commit hashes: the view is `f(graph)`, nothing else.

6. **Views speak binding language; internals keep the fact names (④, MD-7).**
   `implemented`/`has-verifier` stay the internal fact names (they power the drift/backlog
   queries); the view renders *"Implementation binding: present/none · Verifier binding:
   present/none · Runtime observation: not tracked"*. The example's standing unenabled-verifier
   warning renders in context as the teaching surface it is (the Slice-3 risk note resolved).

7. **CLI: `sdp view [root] [--check-clean]` = `sdp validate` + render.** The pipeline extends one
   stage: build → checks → render; exit semantics stay validate's (extraction hard errors keep
   build semantics and short-circuit; check errors exit 1 with **both** artifacts written — the
   graph and the view are faithful projections, and a view that refused to render findings would
   hide exactly what it exists to show). The renderer owns `generated/design-review/` wholesale —
   removed and rewritten every run, so a deleted spec's page cannot survive as a stale artifact;
   `generated/graph.json` stays `build`'s. `--check-clean` extends to the view: two independent
   pipeline runs must produce byte-identical pages. `check:example` re-points to
   `view --check-clean` (it subsumes validate), and the CI step renames accordingly.

## §2 — Work items

### 1. Derived readiness (S)

- `src/validate/readiness-floor.ts`: `deriveReadiness` per §1.3; doc-comment states the
  stated-vs-derived split (`05` §3). `test/readiness.test.ts`: cleared-rung cases, the
  divergence case, the unratified-descriptor case, derived > stated.

### 2. The reader (L)

- New `src/reader/reader.ts` (barrel-exported): `createReader(graph): Reader` + the §1.2 surface
  and its plain-data result types. Construction: `buildGraphIndex` + `computeDeliveryFacts` +
  `validateGraph` + `deriveReadiness` — existing seams only. All outputs sorted (code-unit
  comparison, the established currency).
- `test/reader.test.ts`: the example graph end-to-end (entry adapters · blast radius with
  `coverage-unknown` · `specContext` joins with `claim`s decoded · `packContext` gaps ·
  findings reachable — JS-E2 AC4); synthetic foreign-producer graphs (an `inferred` edge decoded
  and marked advisory; stated-but-unearned facts exposed as recomputed + the honesty finding);
  determinism (two readers over the same graph, identical answers; input graph never mutated).
- `test/reader.typecheck.ts`: the surface's types + the `@ts-expect-error` pin that `bySymbol`
  does not exist.

### 3. The Design Review renderer (L)

- New `src/projections/design-review.ts`: `renderDesignReview(reader): readonly Page[]`
  (`{ path, content }` — pure, fs-free). Per-spec page: header (title · kind with display label ·
  altitude · stated readiness · floor reached · the ③ banner with the first unmet clause when
  derived < stated) · bindings in binding language (⑥) with source links · intent (open questions
  with `blocking` loud) · behavior/constraints/model/decision/verification rendered per their
  typed shapes (`design`/`ui` generically) · relations out/in with `claim` cues and page links ·
  the impact list (the spec's one-hop neighborhood + bindings, from `specContext`) · the spec's
  findings and gaps. Per-pack page: framing · member table · `modelRefs` · verifier gaps. Index
  per §1.5.
- Golden: `test/fixtures/checkout-v1/expected-design-review/**` — the committed expected tree for
  the example (the correctness oracle, exactly as `expected-graph.json`; legitimate because it
  lives in `fixtures/`, never `generated/`).
- `test/design-review.test.ts`: golden comparison (every page byte-identical, no extra/missing
  pages); semantic pins independent of the golden — the ④ binding language, the ③ banner on a
  divergent synthetic node, `claim` cues, the standing warning rendered in context, a blocking
  open question rendered loud.

### 4. CLI + the gate (M)

- `src/cli/sdp.ts`: `view` per §1.7; help text. `package.json`: `check:example` → built-CLI
  `view examples/checkout-v1 --check-clean`; `.github/workflows/ci.yml` step name follows.
- `test/cli.test.ts`: view writes the tree and exits 0 on the example (1 standing warning);
  a stale page is removed on re-render; delete-`generated/`-and-rerun is byte-identical;
  `--check-clean` passes; the dangling-relation corpus renders the view *and* exits 1; the
  hard-error corpus writes neither artifact; help text.

### 5. Docs reconciliation (S — settled rules, no temporal noise)

- `03` §1: the structural-facts bullet states the inferred layer ships empty (§1.4).
- `05` §3: the stated-vs-derived note settles — the banner ships in the view, enabled by the
  floor evaluator naming the failing clause.
- `06` §5: the form sentence settles on generated Markdown (HTML/Studio stays aspirational §8).
- `07` §2: the CORE map's `claim` parenthetical reflects §1.4; §4's banner-timing open question
  records as resolved (the pattern the impact-depth bullet already uses).
- Glossary: no new terms — `reader`, `Design Review`, `agent surface`, `impact graph` already
  carry the ratified definitions this slice implements.
- No new DECISIONS.md entries: every §1 pin is Representation-level or base-forced (the
  three-part test admits none).

## §3 — Verification (the done gate)

1. `npm run check` green end-to-end, closing with the re-pointed `check:example` (validate +
   view + determinism over both artifacts).
2. The graph golden is **byte-identical to the Slice-3 bytes** (no schema growth; the reader and
   view only read).
3. `sdp view examples/checkout-v1 --check-clean` exits 0 (0 errors · the 1 standing warning),
   writes `generated/design-review/` matching the committed expected tree, and the create-order
   page shows: binding language, both implementation bindings, the enabled valid-cart verifier
   distinguished from the unenabled invalid-cart one, `claim` cues, and the impact list.
4. `blastRadius` over a changed `create-order.use-case.ts` reaches the spec it satisfies and its
   one-hop neighborhood with reasons; an unanchored changed file comes back as `coverage-unknown`
   (⑤ — the Slice-4 acceptance criterion).
5. The derived-readiness banner (③) is pinned by a divergent fixture; the example (whose specs
   honestly state their floors) renders no banner.
6. Findings, gaps, and open questions are reachable through the reader (JS-E2 AC4) and visible in
   the view in context (JS-E1 AC5).
7. Done-record header written at session end (Status: executed; Next: Slice 5 — polish: CLI
   `explain`/`search` candidates, error messages, the documented example, the clean-repo
   determinism test).

## §4 — Explicit non-goals (deferred by decision, not omission)

- **Intent composition / any write affordance** — the view is read-only; the edit loop stays
  *intent → agent → git → conformance checks* (`06` §4); no patch subsystem.
- **`bySymbol`, symbol-level reach, the exhaustive impact graph** — aspirational (`06` §2/§3);
  blast-radius stays file-level and says so.
- **Token-budgeted context bundles, the MCP surface, GraphRAG** — later layers over the same
  read-only model (`06` §3/§7).
- **HTML / Spec Studio / interactive trees** — aspirational (`06` §8); one Markdown view proves
  derivation.
- **A `git diff` runner inside the reader** — `blastRadius` takes changed paths; shelling out to
  git is the caller's (CLI-polish or agent-script) concern, and keeping the reader pure keeps it
  deterministic and testable.
- **Severity configuration, `sdp explain`/`search`, error-message polish** → Slice 5.
- **The decision-spec fold** (DECISIONS durables → `kind:"decision"` specs) — after the slices,
  as before.

## §5 — Risks

- **The golden view tree churns on copy edits.** Accepted: that is what a correctness oracle is
  for — a wording change should show up as a reviewable diff; the semantic pins in
  `design-review.test.ts` keep meaning-level regressions caught independently of bytes.
- **Markdown link targets break silently** (a relation to a node with no page — anchors, code
  nodes, dangling targets). Bounded: only `Primitive`/`Pack` targets link; everything else
  renders as plain code text; dangling targets render named-but-unlinked with their referential-
  integrity finding beside them.
- **The reader's findings exposure could read as a second validation path.** It is not: the
  reader *calls* `validateGraph` (the one seam) and re-implements nothing; the doc-comment says
  so. Same shape as the CLI's own composition.
- **One-hop blast-radius can under-report transitive reach.** Named in the answer itself: the
  result is labeled one-hop, deeper walks are scripts over the same shapes, and `coverage-unknown`
  keeps the file-level blind spot loud (never claims exhaustive reach, `06` §2).
- **`packContext` gaps vs `honesty/gaps` divergence** — two surfaces could disagree about "needs
  a verifier." Bounded: both read the same recomputed facts; the pack view lists *all* members
  without a verifier and highlights the `ready` ones (JS-G4 AC3), while the validator warns only
  on `ready` — a deliberate superset, documented where rendered.
