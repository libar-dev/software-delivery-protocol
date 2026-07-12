# Plan 08 — Slice 3: the graph-validator gate

> **Status: ✅ EXECUTED 2026-06-10** — all nine work items landed on `feature/anchors`;
> `npm run check` green end-to-end, now closing with the CI gate itself
> (`check:example` = the built CLI running `validate examples/checkout-v1 --check-clean`).
> One validation path is complete (MD-14 executed): `validateGraph` is the sole validation seam,
> the nine `05` §2 validators run over the one graph, the three `ready` floor clauses are active
> predicates, and `AuthoredModel` is deleted (the extractor now returns `counts` beside the graph
> and the report). The example validates to **0 errors and exactly 1 warning** — the invalid-cart
> example's unenabled verifier, the surfaced absence §1.6 planned — and the **golden is
> byte-identical to the Slice-2 bytes** (no schema growth; findings stay CLI output, never graph
> bytes). The two reserved fixtures are active corpora (the target-below-defined corpus reproduces
> the glossary's worked dialogue: create-order not ready because `spec:payments.authorize-payment`
> is still scoped); six more corpora pin the new validators; synthetic-graph tests pin the
> backstops (`duplicate-ids` · `claim-separation` · `anchors-resolve` · edge-`from` resolution ·
> the unique-or-silent did-you-mean). The §3.5 gate split holds: the dangling-relation corpus
> builds clean (exit 0, sentinel edge emitted) and fails `sdp validate` (exit 1, artifact kept —
> the graph is the faithful projection; the errors describe the repo).
>
> **Execution deviations, all minor:** (1) `valid-minimal-idea-spec` gained a pack carrier — under
> orphan surfacing a lone spec is honestly an orphan, so the clean-minimal pin is now "one spec in
> one pack" and the lone-spec shape moved to the `orphan-spec` corpus; (2) the old composed-model
> validators test had `modelRefs` pointing at a behavior-kind spec — the new pack-coherence check
> (F4) caught the pre-F4 sloppiness, and the test was re-authored around a real `model`-kind spec;
> (3) the gaps validator's should-pass pin rides a synthetic node carrying
> `deliveryFacts: ["has-verifier"]` (silencing the gap) rather than a full anchored ladder — the
> ladder itself is already pinned by `anchored-binding`.
>
> **Post-execution adversarial pass (Codex, 2026-06-10) — two valid findings, both landed as
> drift repair forced by the base (delivery facts are derived, never authored — `02` §2; fail
> closed on the public seam), no DECISIONS entries:** (1) *the graph seam trusted stated
> `deliveryFacts`* — `honesty/gaps` read the node's array, so a foreign producer could state a
> `has-verifier` no binding earns and silence the gap; the derivation rule moved to the shared
> `src/graph/delivery-facts.ts` (one derivation path — the extractor and the checks call the same
> function, now hardened to resolving edge-contract rows: identical on extractor output by
> construction, fail-closed for any other producer), the new **`honesty/delivery-facts`** check
> (`05` §2 check 6 — the validators are now ten, and the `05` §2 honesty/informative items
> renumbered) compares stated facts against recomputation (unknown names · unearned facts
> including `observed` · omissions), and `honesty/gaps` reads the recomputed facts, so a faked
> fact never silences it. (2) *unratified descriptors crashed or silently skipped the floor* — a
> foreign `specKind` threw in the evidence-table dereference and an unknown `readiness` evaluated
> no clauses silently; claim-separation now checks the three descriptors (`specKind` · `altitude`
> · `readiness`) against their ratified values (conformance errors), and `evaluateReadinessFloor`
> is total — over an unratified kind or readiness it evaluates no clauses, the conformance error
> owning the finding. Both pinned by synthetic-graph tests; the gaps should-pass pin (execution
> deviation 3 above) re-authored onto a real resolving test binding. A second pass (same
> session, post-commit) pressed one more row of the same seam: the `03` §1 **kind-typed
> endpoints** were stated but unenforced (§1.2 scoped endpoint checks to `nodeType`) — landed as
> claim-separation conformance errors: `constrainedBy` → a `rule`/`constraint`-kind spec (per
> `02` §6's "a rule / NFR / policy spec" — `constraint`-only would contradict MD-16's
> contemplated rule-kind targets), `decidedBy` → a `decision`-kind spec, `supersedes` only
> between `decision`-kind specs; evaluated only on resolving, ratified-kind endpoints (dangling
> is referential integrity's finding, unratified the descriptor check's), and the
> declared-`verifies`-from-an-example row deliberately stays the informative `verifies`-linkage
> warning (§1.2's pinned severity). Pinned by DSL-fixture should-fail/should-pass tests.
>
> **Next session: Slice 4 — the agent surface**: the `reader` (thin typed loader; entry adapters +
> file-level impact with `coverage-unknown`), the Design Review / one generated read-only view
> (fully derived; renders binding language for `implemented`, `07` §6 ④), the derived-readiness
> banner (`07` §6 ③ — the floor evaluator already names the failing clause), and the minimal
> advisory `inferred` set, decided with its consumer.
>
> **Spec anchors:** `05` §1 (the two check families; an error fails the build, a `gap` informs) ·
> `05` §2 (the MVP graph validators 1–8; one validation path, MD-14 — `sdp validate` is
> `sdp build` + checks) · `05` §3 (the readiness floor; the graph-shaped `ready` clauses;
> floor-table-as-truth, MD-13) · `05` §4 (pack coherence) · `05` §5 (validator self-testing —
> should-fail / should-pass fixtures per validator) · `03` §1 (the edge contract — the
> claim-separation and `verifies`-linkage rows) · `02` §4 (pack coherence reads the manifest's
> derived `belongsTo` + `modelRefs`) · `07` §1 Slice 3 + "what done looks like" (CI rejects a PR
> that breaks links or states readiness the spec has not earned) · JTBD theme D (keep it honest),
> JS-C2 (trust every claim).

## Context

Slice 2 finished the anchored layer: the example extracts 13 nodes · 25 edges with zero findings,
delivery facts derive honestly, and the golden + determinism checks pin the bytes. Validation,
however, still runs over the pre-graph `AuthoredModel` bridge (`extract(…).model`) — the Slice-1
stand-in MD-14 explicitly scheduled for demotion — and the graph-shaped `ready` clauses sit inert
in the floor table (`evaluatedOver: "graph"`, no predicate). `sdp validate` is a stub that exits 1.

Slice 3 completes the one validation path: the conformance + honesty checks re-key to **the one
graph** (the sole public validation seam), the `ready` clauses activate, `sdp validate` wires up as
`sdp build` + checks, the `AuthoredModel` seam retires wholesale, and CI gains the gate. No schema
growth: `schemaVersion` stays `0.3.0`, the golden stays byte-identical — findings are per-run
diagnosis (CLI output), never graph bytes.

## §1 — Decisions this plan pins (Representation, not DECISIONS.md entries)

1. **One public validation seam: `validateGraph(graph: GraphSchema): ValidationReport`.** The
   individual graph validators are module-internal; the aggregate's `validatorId` is `graph` and —
   the established aggregate rule — it carries no single `family` of its own (each finding does).
   A `graphValidatorIds` map mirrors `extractFindingIds` (tests reference ids typo-safely).
   Findings sort `(file ?? "", line ?? 0, validatorId, subjectId, relatedId)` — the extractor's
   currency, one diagnostic shape. Findings carry the subject node's `file` where known.

2. **The validator set** — `05` §2's eight checks, keyed one-to-one, each in exactly one family:

   | id | family | severity | checks |
   |---|---|---|---|
   | `conformance/referential-integrity` | conformance | error | every edge endpoint (`from` **and** `to`) resolves to a node; every `PackNode.modelRefs` entry resolves; a dangling reference carries a "did you mean …?" suggestion when a unique nearest id exists (edit distance ≤ 2) |
   | `conformance/duplicate-ids` | conformance | error | no two graph nodes share an id (L2 — the graph backstop; the extractor's `extract/duplicate-id` stays the loud per-site error and excludes the carriers, so this fires only for a non-extractor producer) |
   | `conformance/claim-separation` | conformance | error | node/edge typing valid and distinct per the `03` §1 edge contract: node claims by `nodeType` (`Primitive`/`Pack` → `declared`, `Anchor`/`CodeNode` → `anchored`); edge `(type, claim, endpoint nodeType)` rows (`satisfies` anchored CodeNode→Primitive · `belongsTo` declared Primitive→Pack · authored relations declared Primitive→Primitive · `verifies` declared Primitive→Primitive or anchored Anchor→Primitive); endpoint rows evaluate only where the endpoint resolves (dangling is referential integrity's) |
   | `conformance/verifies-linkage` | conformance | warning | the bidirectional trace surfaced: (a) an `example`-kind spec with a declared `verifies` that is **not an enabled verifier** (no resolving anchored `verifies` targets it) — the spec↔test trace is incomplete; (b) a declared `verifies` from a non-`example` kind — confers nothing (MD-7 names the example/scenario as the enabled-verifier shape). The *missing-target* half of `05` §2 check 4 is owned by referential integrity (it is reference resolution) |
   | `conformance/pack-coherence` | conformance | error | no duplicate member ids per pack (duplicate `belongsTo`); every **resolving** `modelRefs` target is a `model`-kind Primitive (F4 — the carried Phase-0 finding; resolution itself is referential integrity's) |
   | `conformance/orphans` | conformance | warning | a Primitive with no incident edges at all — fallen out of the graph's connective tissue; informative, never a gate |
   | `honesty/authoring-shape` | honesty | error | a delivery-fact name (`implemented` / `has-verifier` / `observed`) as a key anywhere inside a Primitive's **section content** — the layer split: extraction owns the top level (`extract/reserved-property` hard-errors before derivation), the graph check owns section interiors (the path `tsc` never sees: defused corpora, non-fresh literals, foreign producers) |
   | `honesty/readiness-floor` | honesty | error | the floor over the graph, **all clauses active** (§1.3) |
   | `honesty/gaps` | honesty | warning | the `05` §2 check-8 gap: a spec stating `ready` with no `has-verifier` delivery fact — a surfaced absence, informative only |

   Family assignment for the two informative checks (the base lists them outside the family
   headings but the two-family law admits no third): orphans read as *structural connectivity* →
   conformance; the verifier gap rides the readiness/delivery-fact seam → honesty. Severity
   `warning` is the "informative" rendering — it never fails the build; per-config escalation
   stays deferred with `--lenient`.

3. **The floor re-key (MD-13 preserved).** Predicates become
   `(node: PrimitiveNode, index: GraphIndex) => boolean`; the table stays the single source, the
   evaluator stays one generic loop, the clause-id union stays derived. The
   `GraphReadinessClause` marker shape retires — every clause now carries a predicate. Relations
   read from declared authored-type edges (`belongsTo` is derived and never counts); promotion
   neutrality walks `refines` edges into child nodes' sections. The three `ready` clauses land:

   - **`all-relations-resolve`** — every declared authored edge from the spec has a resolving
     target.
   - **`depends-on-and-refines-targets-are-defined`** — every *resolving* `dependsOn`/`refines`
     target is a Primitive stating ≥ `defined` (an unresolved target is `all-relations-resolve`'s
     failure — no double-fire inside the floor).
   - **`anchors-resolve`** — every binding edge (`satisfies`, anchored `verifies`) naming the spec
     originates from a binding node present in the graph. On extractor output this holds by
     construction (anchors and their edges derive together); the clause has teeth for any other
     graph producer and polices exactly the promise in its name: `implemented` stays *derivable
     from a real binding* (the delivery-fact computation trusts edges). Pinned by a
     synthetic-graph fixture, never decorative.

   **Cross-family double-fire accepted and named:** a `ready`-stating spec with a dangling
   relation earns both the conformance error (the reference is broken) and the floor failure (the
   stated rung is not earned) — two different statements, two families.

   **Evidence predicates become total.** Section content on a graph node is statically-reified
   value data, never a typechecked instance — a malformed GWT entry must read as *absent
   evidence*, never throw. (Typed sections remain the authoring-time guardrail; the floor reads
   defensively.)

4. **`AuthoredModel` retires wholesale** — the file, the type, the barrel export, and the four
   pre-graph validators. `ExtractionResult.model` is replaced by
   `counts: { specs, packs, anchors }` — the authored-carrier counts (duplicate-id carriers
   included: the truthful record of what was authored even when ambiguity excludes it from the
   graph), which is all the CLI summary ever consumed. Everything else the tests read off the
   model re-keys to the graph — which is the point of MD-14.

5. **`sdp validate [root] [--check-clean]` = the build pipeline + `validateGraph`.** Extraction
   hard errors keep build semantics (exit 1, artifact withheld, stale artifact removed) and
   short-circuit the checks — checking a partial graph would validate a phantom, the exact MD-14
   failure mode. With extraction clean, `graph.json` is written even when checks fail: the graph
   *is* the faithful projection — check errors describe the **repo's** conformance, not the
   artifact's — and the on-disk graph is what a human debugs the failure with. Check errors exit
   1; warnings inform. `--check-clean` rides the build half unchanged.

6. **The CI gate.** `package.json` gains
   `check:example` = built-CLI `validate examples/checkout-v1 --check-clean`, appended to `check`
   after `build`; the CI workflow gains the matching step. The expected example outcome: **0
   errors, exactly 1 warning** — the invalid-cart example's unenabled verifier. That standing
   warning is deliberate: the example keeps its "declared `verifies` without a test binding"
   specimen (the Slice-2 honesty showcase), and Slice 3's surfacing of it *is* the demonstration.

7. **Fixture strategy (`05` §5: every validator ships should-fail and should-pass pins).**
   - `test/fixtures/authored-model.fixtures.ts` →
     `test/fixtures/graph-validator.fixtures.ts`: fixtures keep their DSL builders and meaning;
     a new `test/helpers/fixture-graph.ts` wraps the built values as reified carriers and runs
     them through the **real `deriveGraph`** — no parallel derivation logic in tests (the
     no-second-path discipline applied to fixtures). `fixtures.test.ts` drives `validateGraph`.
   - The two reserved corpora activate on disk:
     `invalid-ready-with-unresolved-dependency` (floor: `all-relations-resolve`, plus the
     referential-integrity error — the named double-fire) ·
     `invalid-ready-with-target-below-defined` (floor:
     `depends-on-and-refines-targets-are-defined`; extraction + referential integrity clean).
   - New corpora, one pinned outcome each:
     `invalid-hand-authored-delivery-fact-in-section` (the end-to-end MD-16 smuggle: defused
     corpus → reified section → graph → `honesty/authoring-shape`; the strongest pin of the
     bypass, beside the existing DSL-level fixture) · `invalid-duplicate-pack-member` ·
     `invalid-non-model-modelref` (F4) · `non-example-verifier` (warn) · `orphan-spec` (warn) ·
     `ready-without-verifier` (the gap, warn). The existing `unenabled-verifier` corpus gains the
     `verifies-linkage` warning assertion.
   - **Synthetic-graph fixtures** (hand-built `GraphSchema` values) pin the validators whose teeth
     only show on non-extractor graphs: `duplicate-ids`, `claim-separation`, `anchors-resolve`,
     edge-`from` resolution, and the did-you-mean suggestion. Legitimate inputs: the graph is the
     public seam, and a foreign producer is a real input class.

8. **Doc reconciliation, no temporal noise.** `05` §2's stand-in paragraph settles ("the pre-graph
   `AuthoredModel` stand-in retired into the extractor when the one path closed" → state the
   settled rule, drop the journey); the glossary's **pre-graph** locked-usage entry loses its
   "fences stand-in checks" present tense; DECISIONS MD-14's header annotation marks execution
   complete; `src` doc-comments that point forward at "Slice 3" state the settled behavior
   instead. The roadmap (`07`) needs no edit — slice names are roadmap-relative and stay.

## §2 — Work items

### 1. The graph index (S)

- New `src/validate/graph-index.ts`: `GraphIndex { nodesById, primitivesById, edgesByFrom,
  edgesByTo }` + `buildGraphIndex(graph)`. Built once per `validateGraph` run; the floor
  signature uses it. Exported via the barrel.

### 2. The floor re-key (M)

- `src/validate/readiness-floor.ts`: predicate signature `(node, index)`; envelope clauses read
  node fields; intent/evidence clauses read `node.sections` defensively; relation clauses read
  declared authored edges; promotion clauses walk `refines`/`constrainedBy` edges into child/target
  nodes; the three `ready` clauses (§1.3) gain predicates; `GraphReadinessClause` retires.

### 3. The graph validators (M)

- `src/validate/validators.ts` rewritten: the nine validators of §1.2, `validateGraph`,
  `graphValidatorIds`. The did-you-mean helper is a small bounded edit-distance scan over node
  ids (unique best candidate at distance ≤ 2, else no suggestion — determinism over cleverness).
- `src/validate/contracts.ts`: `Validator<TInput = GraphSchema>` (the noun keeps its contract;
  the default re-points to the one seam). Severities and `Finding` unchanged.

### 4. The extractor demotion (S)

- `src/validate/authored-model.ts` deleted; `src/index.ts` barrel updated.
- `src/extract/index.ts`: `ExtractionResult.model` → `counts`; doc-comments state the settled
  one-path shape.
- `src/extract/derive.ts` / `src/graph/schema.ts`: forward-pointing comments settle (the
  referential-integrity check flags dangling sentinels; pack coherence reads `modelRefs`).

### 5. CLI: `sdp validate` (M)

- `src/cli/sdp.ts`: the build flow refactors to return its graph; `validate` runs it, then
  `validateGraph`, prints check findings in the one finding format, then
  `validate: N errors · M warnings (conformance + honesty over the one graph)`; exit per §1.5.
  Help text updated for both commands.

### 6. The CI gate (S)

- `package.json`: `check:example` (built CLI over the example, `--check-clean`); `check` appends
  it after `build`. `.github/workflows/ci.yml`: the matching step.

### 7. Fixtures + corpora (L)

- Per §1.7: the fixture-graph helper, the renamed fixture module, the two activations, the six
  new corpora, the synthetic-graph fixtures, the `unenabled-verifier` extension.

### 8. Test re-keys (M)

- `test/checkout-v1.test.ts`: model assertions → graph assertions; the clean-validation test pins
  0 errors + exactly the one unenabled-verifier warning.
- `test/extract.test.ts`: `result.model` → `result.counts`/graph; `validateAuthoredModel` →
  `validateGraph`; dangling corpora expect `conformance/referential-integrity`.
- `test/cli.test.ts`: validate wired (example passes; a failing corpus exits 1 listing graph
  findings; the not-wired stub test retires); help-text expectations.
- `test/readiness.test.ts` / `test/validators.test.ts` / `test/fixtures.test.ts`: re-keyed to
  nodes + index / `validateGraph`.
- `test/readiness.typecheck.ts`: `AuthoredModel` block retires; `Validator` defaults to
  `GraphSchema`.

### 9. Docs + done-record (S)

- Per §1.8; `npm run check` green end-to-end; this header becomes the done-record.

## §3 — Verification (the done gate)

1. `npm run check` green end-to-end (temporal guard · typecheck ×2 · lint · format · tests ·
   build · **the example validate gate**).
2. The golden is **byte-identical to before this slice** (no schema growth, no derivation change)
   and the determinism self-check still passes.
3. `sdp validate examples/checkout-v1 --check-clean` exits 0 with 0 errors and exactly 1 warning
   (the invalid-cart unenabled verifier), and writes the same `graph.json` as `sdp build`.
4. The two reserved fixtures are active corpora pinning their floor clauses; every §1.2 validator
   has at least one should-fail and one should-pass pin (`05` §5).
5. A corpus with a dangling reference fails `sdp validate` (exit 1) while still building (exit 0)
   — the gate is the checks, the build is the projection.
6. No `AuthoredModel` symbol survives in `src/` or the barrel; the only validation entry point is
   `validateGraph` (plus the floor evaluator it composes).
7. Done-record header written at session end (Status: executed; Next: Slice 4 — the reader /
   agent surface + the Design Review view, both fully derived; the minimal advisory inferred set
   decides there with its consumer).

## §4 — Explicit non-goals (deferred by decision, not omission)

- **The derived-readiness banner** ("stated `defined`, derived `scoped`") → Slice 4 with the view;
  the floor evaluator already reports which clause fails, which is the enabling half (`07` §6 ③).
- **The reader / agent surface / Design Review / impact** → Slice 4; **`coverage-unknown`** is a
  Slice-4 acceptance criterion on blast-radius, not a graph validator.
- **The inferred layer** — still zero `inferred` claims; decided with its Slice-4 consumer.
- **Severity configuration / `--lenient`** — orphans and gaps default to warnings; per-config
  escalation stays aspirational (`05` §6).
- **Error-message polish beyond did-you-mean, `sdp explain`/`search`** → Slice 5.
- **An informative id-shaped-prose surfacing** (the Slice-2 boundary note): assessed here as
  *not* earning its way in — it polices prose by construction (MD-1 guardrail 1: checks never
  judge content), and the `ref(…)` guard + corpus already pin the typed affordance. Recorded as
  the standing answer unless real usage reopens it.
- **The decision-spec fold** (DECISIONS durables → `kind:"decision"` specs) — after this slice as
  before; the validators land first so the fold's corpus is born checked.

## §5 — Risks

- **The example's standing warning** breeds warning-blindness if it multiplies. Accepted at one:
  it is the differentiator made visible (a surfaced absence on the canonical example), CI gates on
  errors only, and the Slice-4 view will render it as the teaching surface it is.
- **Defensive evidence predicates** can read a malformed-but-intended evidence shape as absent —
  a floor failure with a confusing cause. Bounded: typed sections catch the shape at `tsc` for
  real adopters; the corpus pins the no-throw behavior; the failure message names the clause.
- **`anchors-resolve` never fires on extractor output** and could read as decorative. Its
  doc-comment names the producer class it polices and the synthetic fixture proves it fires;
  MD-13's no-decorative-metadata rule is satisfied by a real predicate.
- **Validator-id rename** (`conformance/dangling-references` → `conformance/referential-integrity`)
  changes finding output. Zero adopters; the ratified noun wins now or never.
- **Double-fire noise** (conformance error + floor failure on the same dangling relation of a
  `ready` spec). Accepted and bounded: two families, two statements; only `ready`-stating specs
  ever see both.
