# Deep architectural review — `feature/universal-spec` (plan 31, briefs A–D)

Reviewer: DEEP ARCHITECTURAL REVIEWER (arch-fable). Base `4ccc2e9b`, HEAD `002849f`.
Method: mandatory reads (AGENTS/CONTEXT/omo plan/plans 29+31/P1–P10/both decision Specs), full diff
walk of every engine seam, live `sdp validate` + `sdp:q` queries, targeted vitest runs (65/65 green
across `structural-anchors`, `testing`, `codegen`, `census`, `mermaid-render`, `gherkin-view`), and a
live census render. `npm run check` deliberately not run (owned by another reviewer).

Live baseline measured during review: `sdp validate . --exclude explorations --exclude examples
--exclude test/fixtures/import/parity` → **155 specs · 1 pack · 143 anchors → 299 nodes · 565 edges,
0 errors / 0 warnings**. Graph queries: `inferred` claim count **0**; `memberOf`/`uses` in the
self-hosting corpus **0** (fields exist, nothing authored yet — census renders the explicit
"No structural bindings exist." note, verified live); schema `0.5.0`; operational backlog empty;
drift alarm (`implemented ∧ ¬ready`) **11 Specs**.

---

## 1. Findings register

### F1 — major · high — The committed adopted registrar has no byte-equality gate anywhere in the pipeline

- **Evidence.** `examples/checkout-v1/test/orders/orders.create-order.valid-cart.test.generated.ts`
  is tracked (force-added past the new `.gitignore:18` rule `**/*.test.generated.ts`). The freeze
  Spec blesses committing adopted registrars (`specs/extraction/runnable-modules.sdp.md:19`). But no
  check compares the committed bytes against fresh codegen output: `runBuild` (`src/cli/build-command.ts:207-211`)
  unconditionally overwrites registrars with fresh content, `--check-clean` compares only two
  in-process generations to each other (`build-command.ts:169-176`), and `preflight.mjs` compares
  only the `generated/` roots (`preflight.mjs:104-126`) — a modified tracked registrar appears in the
  printed "semantic diff summary" (`preflight.mjs:186-188`) but is **not** in the `failures` array
  (`preflight.mjs:164-183`). CI (`.github/workflows/ci.yml`) runs `npm run check` on a fresh
  checkout and never runs `git diff --exit-code`.
- **Why it matters.** This is the repo's first tracked generated code, and the regenerability law
  (P1/P3, L8) is enforceable only because "derived" is falsifiable. Here it is not: a tampered or
  stale committed registrar (e.g. a weakened comparator) passes CI — `generate:example` silently
  repairs the working-tree copy before `npm test`, so the executed bytes are honest while the
  committed artifact reviewers read is unverified. That is exactly the "generated artifact looks
  authored/current" dishonesty vector. Locally (no build first), `vitest` executes the *stale
  committed* bytes via the authored test's relative import.
- **Fix direction.** Make preflight *fail* (not print) when any tracked `*.test.generated.ts`
  differs from fresh generation, or teach the build's `--check-clean` to byte-compare on-disk
  registrar files the way `sdp census --check-clean` compares its published root.

### F2 — major · medium-high — Dangling structural targets withhold the whole anchor (cascading), exceeding the ruling and silently stripping delivery facts

- **Evidence.** `excludeInvalidStructuralAnchors` (`src/extract/index.ts:140-172`) derives a
  candidate graph, runs `validateStructuralAnchorEdges` (referential integrity **plus** all
  structural checks, `src/validate/validators.ts:696-710`), and removes every anchor named by any
  finding, iterating to a fixed point ("Referential failures can cascade… derive and withhold to a
  fixed point"). Tested as intended behavior: `test/structural-anchors.test.ts:179-194` ("rejects a
  missing component target **and excludes the whole anchor**"). The excluded anchor's `satisfies`
  edge vanishes with it, so the Spec it satisfies loses `implemented`.
- **Why it matters against the repo's own law.**
  - The decision Spec ruled dangling as **an error**, not exclusion: "Every `component` and `uses`
    target must exist as a `CodeNode`; a dangling graph ID is an error"
    (`specs/decisions/structural-anchor-semantics.sdp.md:18`); its whole-anchor clause is scoped to
    "a **malformed** structural field" (line 25). The commissioning plan drew the same line
    explicitly: "malformed structural field excludes the WHOLE anchor … referential-integrity covers
    dangling targets (error, not warning)" and its QA scenario expects *dangling → referential
    error* vs *non-static → whole-anchor exclusion* (`.omo/plans/arc-keystone-engines.md`, todo 5).
  - It contradicts standing derive doctrine retained in the very file this branch edits: "A dangling
    target is emitted, not dropped: the unresolved id itself is the sentinel the
    referential-integrity check flags" (`src/extract/derive.ts:108-110`), and L3's
    local-degradation posture ("an unresolved reference still serializes (with a sentinel) and
    surfaces as a validation error", `docs/concept/01:96`).
  - Consequence coupling: the decision rules that structural fields "mint no delivery facts … and do
    not change readiness floors" (line 23). Exclusion doesn't *mint* facts, but a one-character typo
    in `uses` now *removes* `implemented` from the satisfied Spec — and the fixed-point cascade
    extends that: anchor B with a perfectly valid `uses: [A]` is withheld when A is withheld, taking
    B's `satisfies` with it. Structural annotations were sold as intent-free and non-load-bearing;
    this makes them able to alter the drift alarm and the build backlog at distance.
  - The amended `specs/model/anchors.sdp.md:18` now says "**Any failure** excludes the whole code
    anchor" — the intent layer was broadened in the same branch to match the code. That is a lawful
    move only if deliberate; the decision Spec's narrower wording was *not* amended, so intended
    truth now disagrees with itself in nuance (decision: dangling = error; model Spec: any failure =
    exclusion).
- **Fix direction.** Keep the anchor and emit the dangling edge + referential-integrity error (per
  the decision and the derive doctrine), reserving whole-anchor exclusion for static malformation —
  or, if fail-closed is genuinely wanted, amend the *decision Spec* to say so and record the
  delivery-fact ripple as a ruled consequence, killing the cascade (exclude only the offending
  anchor, never transitively).

### F3 — major · high — Both new decision Specs state `ready` without registry ratification, violating the decision readiness posture (MD-26)

- **Evidence.** `specs/decisions/carrier-universality.sdp.md:5` and
  `specs/decisions/structural-anchor-semantics.sdp.md:5` both state `readiness: ready`.
  `docs/concept/DECISIONS.md` has **no diff on this branch**; the registry's last row is MD-28
  (verified by grep — no `carrier-universality` / `structural-anchor` row exists). The posture is
  ratified law: "A decision Spec states `ready` when its complete record is **registry-ratified**"
  (`specs/decisions/decision-readiness-posture.sdp.md:16`).
- **Why it matters.** `ready` on a decision is defined by this repo as ratification evidence; these
  two claim it without the evidence. Validators cannot police this (checks never police content) —
  it is precisely what review must catch. It also breaks the working discipline "lead with meaning:
  'the typing law (MD-11)'" — these rulings have no ratified names or MD-n handles, so every
  document referencing them (AGENTS status line, plan 31, carrier Spec consequences) must point at
  bare Spec IDs.
- **Fix direction.** Add MD-29/MD-30 registry rows (both rationale sections already argue the
  three-part test) — or restate the two Specs at `defined` until ratified.

### F4 — minor · high — The branch grows the drift alarm from 8 to 11 without recording it

- **Evidence.** Live query: `implemented ∧ ¬ready` = 11; the three additions are this branch's own
  `spec:consumers.census-page`, `spec:consumers.mermaid-view`, `spec:consumers.gherkin-view` (all
  `defined`, all bound by `impl:protocol.*` anchors landed in the same commits). Plan 29 recorded
  the pre-existing alarm at eight Specs.
- **Why it matters.** "Don't ship code before a spec is `ready` — `implemented ∧ ¬ready` is the
  drift alarm" is a stated bet of the model. The alarm is informative, never a gate, and
  spec-plus-implementation in one session is normal self-hosting practice — but knowingly adding
  three rows to the model's own headline honesty signal deserves a sentence in the plan-31 close;
  none exists. Inverse inconsistency: `spec:extraction.runnable-modules` — the arc's keystone freeze
  — has **zero** `satisfies` edges (verified by query), so the graph cannot see brief B's realization
  at all while its three sibling projection Specs are anchored. Under-claiming is the honest
  direction, but the binding discipline across the four new Specs is inconsistent.
- **Fix direction.** Anchor the registrar emitter to `spec:extraction.runnable-modules`, then either
  mature the four Specs to `ready` via Design Review or record the deliberate sub-`ready` posture.

### F5 — minor · high — Every `sdp build/validate/view/census/mermaid/gherkin` run sprays unadopted registrars into the authored tree, including under `--check-clean`

- **Evidence.** `runBuild` writes every registrar beside its anchored test file on every invocation
  (`src/cli/build-command.ts:207-211`) — after this review's single `sdp validate .` run, ~30+
  `test/*.test.generated.ts` files exist interleaved with authored suites (observed live;
  gitignored, invisible to git). All six verbs route through `runBuild`, so nominal *check* commands
  (`validate`, `view --check-clean`) mutate the working tree outside `generated/`. Stale registrars
  are never cleaned up by the build-invalidation loop (`build-command.ts:99-109` covers only the
  four `generated/` projection roots), so a renamed or deleted example leaves its orphaned sibling
  in place indefinitely.
- **Why it matters.** L8's shape ("everything generated is disposable, delete and rebuild") is
  preserved in law but eroded in geography: generated artifacts now accumulate inside the authored
  test tree with no owner, no invalidation, and no `--check-clean` disk comparison. It also widens
  F1's surface — the more generated files live beside authored code, the cheaper it is for one to
  quietly become "authored".
- **Fix direction.** Emit registrars under `generated/` (adopters import from there), or gate
  sibling emission behind an explicit flag, and remove orphaned siblings the way stale projection
  roots are removed.

### F6 — minor · high — The Gherkin read view silently drops content its own Spec says must be marked lossy

- **Evidence.** `spec:consumers.gherkin-view` rule: "content Gherkin cannot carry honestly is marked
  the same way [lossy commentary] rather than invented as structure"
  (`specs/consumers/gherkin-view.sdp.md:18`). But `renderSpecPage`
  (`src/projections/gherkin-view.ts:269-297`) renders `design` and `ui` sections **nowhere** (no
  structure, no commentary), and for canonical kinds (behavior/example) it renders only
  intent/verification/behavior — a behavior Spec's inline `constraints`, `model`, or `decision`
  sections vanish (`renderRefusedKindContent` runs only on the lie-reason branch, line 288-290).
- **Why it matters.** The projection is disposable, so no truth is lost — but the branch's own
  freshly-authored Spec states the honesty rule and the implementation violates it on day one. Under
  the drift rule that is a defect in one side to fix deliberately, not a tolerable gap.
- **Fix direction.** Emit `# LOSSY:` commentary for every populated section the page does not
  render (design, ui, and the canonical-kind constraints/model/decision paths).

### F7 — minor · medium — Registrar placement silently picks the first of multiple anchored suites

- **Evidence.** `src/codegen/contracts.ts:1093-1116`: `anchoredTestFiles[0]` after a sort. Multiple
  `specTest` anchors verifying one example are lawful (multiple verifiers); the registrar lands
  beside the lexicographically first with no finding.
- **Why it matters.** Deterministic, but L2 prefers loud ambiguity at boundaries; the freeze Spec's
  "a second registration path for the same example is refused" clause suggests the multi-anchor case
  was thought about but the tie-break was never surfaced.
- **Fix direction.** Emit an informative finding when >1 anchored suite could host the sibling.

### F8 — nit · high — The oracle is invoked before the incomplete-point refusal, and the refusal is broader than frozen

- **Evidence.** `src/testing/index.ts:37-44`: `adapters.expected(point)` runs *before* the
  missing-conditions check, so an adopter oracle observes incomplete points (type-lawful under
  `Partial<C>`, but the freeze's "refuse oracle comparison for incomplete points" reads
  refusal-first); the throw then refuses the whole scenario, not just oracle comparison. Fail-loud
  superset — acceptable, worth tightening.

### F9 — nit · high — Evidence file misstates the vitest exclusion mechanism

- **Evidence.** `task-8-self-hosting-rationale.md:34` claims "`vitest.config.ts` excludes
  `**/*.test.generated.ts`"; no such exclude exists — the include pattern
  `["test/**/*.test.ts", "examples/**/*.test.ts"]` (`vitest.config.ts:30`) merely fails to match
  `.test.generated.ts`. The behavior is correct (generated siblings never self-run; only the
  authored import activates them); the recorded rationale is wrong about *why*. Evidence-file-only.

### F10 — nit · medium — "Committed generated code" is an architectural novelty introduced without a decision record

- **Evidence.** The adopted-registrar-is-committed posture lives only in a behavior Spec rule
  (`specs/extraction/runnable-modules.sdp.md:19`) and a `.gitignore` comment. It is the first
  tracked generated code in the repo, plausibly passes the ADR three-part test (hard to reverse
  once adopters spread; surprising without context; real trade-off vs L8's gitignore-everything
  posture), and the registry (see F3) is silent on it.
- **Fix direction.** Fold it into the runnable-modules ratification story or an explicit decision
  row, together with the F1 gate.

---

## 2. Briefs coverage assessment

### Brief A — carrier universality: **delivered as briefed** (caveat: F3 registry row)

All five commissioned rulings are answered in order in
`specs/decisions/carrier-universality.sdp.md:16`: (1) per-kind disposition with per-kind lie
reasons against the kind-evidence table (behavior/example reaffirmed canonical; six kinds refused
with the exact advisory reasons); (2) rich content only on MD-19's existing prose owners,
DocStrings/DataTables stay refused; (3) "universal" = per-ID carriers + generated read projection;
(4) default flip refused; (5) Packs explicitly out (MD-25). MD-27's rationale is named as the thing
reaffirmed, and the amendment discipline held: MD-18's and MD-27's consequence sections were updated
in the same branch (`specs/decisions/carrier-ruling.sdp.md:19`,
`specs/decisions/gherkin-carrier-option.sdp.md:21`); MD-28 untouched. Follow-through landed exactly
the ruled branches: `specs/carrier/gherkin-authoring.sdp.md` gained the per-kind honesty rule, the
no-default-flip rule, the Packs rule, and the universality-as-read-projection rule; the extractor's
`@kind.*` refusal now quotes the ruled lie reason (`src/extract/gherkin.ts:390-397`, constants
centralized in `src/extract/gherkin-kind-honesty.ts`). The generated read view is visibly generated
on every page and the index ("Disposable. Not a carrier. Not round-trippable. Never
`.sdp.gherkin`.", `src/projections/gherkin-view.ts:275,303`), uses `.feature.md` under
`generated/gherkin/`, and claims no parity. One implementation drift against its own Spec: F6.

### Brief B — derived runnable modules: **delivered as briefed** (caveats: F1, F5, F7, F8)

The freeze landed as one new Spec (`spec:extraction.runnable-modules`, the lawful section⟷kind
option) answering (a)–(g) explicitly. Verified against code:

- **Import direction** — the generated registrar imports only `/runner`, `/testing`, and generated
  contract/space modules (`src/codegen/contracts.ts:829-843`; committed exemplar lines 6-24);
  authored → generated only; registration fires on authored-file load; generated siblings never
  match the vitest include so they cannot self-run.
- **Six-step comparator** — `createRunnableExample` calls `expected(point)` (step 1); each Then
  binding matches skeleton against `oracle.kind` (step 2, `src/testing/index.ts:67-69`); Spec Then
  params vs oracle payload compared first (step 3, lines 74-78); `observe(world)` (step 4, line 80);
  observed vs oracle (step 5, lines 81-85); `assertions` run separately in the completion hook (step
  6, lines 103-108). **`actual===oracle` alone is absent**: the mutation log
  (`task-8-mutation.log`) shows the Spec-side `{total}` path reddening with the path-level diff
  `$.total: expected 100, actual 101`, oracle mutation reddening, and revert green.
- **No-matching-Then diagnostic** — scenario-level, quotes Spec ID, oracle kind, available Then
  skeletons, `cause` preserved (`src/testing/index.ts:90-101`); failure rendering reuses
  `renderContractStep`.
- **Exhaustive mapped types** — generated bindings `satisfies StepBindings<…>` (stale generated
  callback = tsc error naming the step); the authored surface's five adapters are required keys on
  `RunnableExampleAdapters` (`assertions` optional).
- **`Partial<Conditions>`** — threaded end-to-end, never cast (`src/testing/index.ts:11-17`);
  incomplete points refused (F8 nit on ordering).
- **Outlines refused; generation-time refusals reused unchanged; claim taxonomy untouched** —
  `src/runner/`, `src/graph/delivery-facts.ts` have no diff; `specTest` remains the sole
  `has-verifier` source; live `inferred` count is 0.
- **Tracer migration** — the authored valid-cart file is the frozen shape exactly: `specTest`
  anchor, five adapters, one activation call, no literal step-skeleton keys
  (`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:58`). The 31-family
  migrate-vs-defer rationale is binary and auditable (1 MIGRATE / 30 DEFER with per-row blocking
  reasons).

### Brief C — census + Mermaid projections: **delivered as briefed**

- **Census** (`src/projections/census.ts`): pure `Reader → pages`, taxonomy rows from the exported
  runtime constants (`SPEC_KINDS`/`SPEC_KIND_DISPLAY_LABELS`/`SPEC_ALTITUDES`/`SPEC_READINESS`,
  `graphNodeTypes`/`graphClaims`/`deliveryFactNames`/`graphEdgeTypes`) so zero-count rows render;
  deterministic `unrecognized:` rows for foreign values; stated vs derived readiness as separate
  dimensions including the "not structurally reached" count; anchor flavor from node type +
  namespace + outgoing edge; **findings exclusively from `reader.findings()`** — including the
  dangling-structural-references section, which filters the validator's report rather than
  re-deriving (census.ts:226-235). Publication is the ruled explicit `sdp census` verb, wholesale
  tmp→rename, and its `--check-clean` is *stronger* than Design Review's: it byte-compares the
  published root against the fresh render (`src/cli/census-command.ts:105-109`).
- **Mermaid** (`src/projections/mermaid.ts`): one-hop per Spec + membership per Pack + index, never
  whole-graph; injective hex machine tokens from full graph IDs (never titles); dedicated
  `escapeMermaidLabel` (Markdown escaper not reused); everything sorted by code units; unresolved
  targets render as explicit placeholder nodes; visited-set/no-closure/no-layout; exact bounds
  64/128 with **per-diagram** refusal naming the bound while in-bound diagrams still publish (the
  refusal-locality fix, commit `409d2b9`).
- **C∩D seam (todo 10)**: structural-bindings census section with membership rollups, fan-in/out,
  Tarjan SCC rendering of uses cycles *as data* ("Uses cycles are authored structure, not validator
  findings"), and the explicit zero-edge note — verified live against the self-hosting corpus.
- Both Specs rule the CLI/publication posture on record, including build-time invalidation of all
  projection roots so failure leaves honest absence (`src/cli/build-command.ts:81-109`).

### Brief D — structural anchor semantics: **delivered as briefed under BR1** (caveat: F2)

The decision rules satisfies-vs-implements **first** (no `implements` slot; contract realization is
`satisfies` by authoring convention), admits exactly `component`/`uses` as closed graph-ID
references, and carries the full refusal list in its own body (anchored-only edges / empty inferred;
no delivery facts or readiness effects; no free-form tags, lifecycle, or parallel registry;
`codeAnchor` only, no sibling builders; closed envelope, foreign fields stay errors; warn-level
lint). Implementation matches clause by clause: builder-only static reification
(`componentAnchorId(…)`/`codeAnchorId(…)` literals, `src/extract/anchors.ts:130-147,302-360`);
anchored `memberOf`/`uses` CodeNode→CodeNode edges (`src/extract/derive.ts:179-205`); schema
`0.5.0` with complete edge-contract rows (`requireClaim("anchored")`,
`requireEndpoints(["CodeNode"], "CodeNode")`, `src/validate/validators.ts:406-410`); the
`conformance/structural-anchors` validator covers namespaces (one-level membership impl:/api: →
component:), at-most-one component, uniqueness, self-reference, cycles-as-data; delivery-fact
ladder untouched; `isTraversableBinding` exclusion documented as a decision in reader, schema, and
derive commentary (`src/reader/reader.ts:382-383`, `src/graph/schema.ts:41-44`). Live: 0 `inferred`
claims, structural edges queryable (brief E's re-entry trigger honestly satisfied — queryable,
count 0). The one fidelity deviation is F2 (dangling handling exceeds the ruling with a
delivery-fact ripple).

Brief E untouched: no `sdp new`, no `--watch`, no MCP surface, no `bySymbol` (grep-verified; the
only hit is the pre-existing doctrine comment in `reader.ts:242`).

---

## 3. What is genuinely good (keep in synthesis)

- **The comparator is honest by construction.** The forbidden shortcut (`actual===oracle` alone) is
  structurally absent; the Spec's authored Then params sit in the comparison path, so the Spec text
  itself is load-bearing in the red/green signal — proven by the `$.total` mutation diff. The
  path-level missing/extra/changed diagnostics are exactly the readable-failure law.
- **Refusal lists live in the decision Specs' bodies**, not just the plan — the gen-1 taxonomy-drift
  lesson was actually applied, and the reaffirm-not-overturn outcome of brief A is argued against
  MD-27's own rationale rather than around it.
- **Findings-as-data discipline held.** Census renders `reader.findings()` verbatim (even its
  dangling-references section is a filter, not a re-derivation); cycles are SCC *data*; the
  zero-edge state is stated, not implied.
- **Per-diagram Mermaid refusal locality** (one oversized neighborhood withholds one diagram while
  the rest publish, refusal naming the exact bound) is the right grain and was fixed as its own
  reviewed commit.
- **Census/Mermaid/Gherkin `--check-clean` byte-compares the published root** against the fresh
  render — stronger than the pre-existing Design Review twin-render check, and worth back-porting.
- **Claim taxonomy integrity is measurable and intact**: 0 inferred claims, `specTest` still the
  sole `has-verifier` source, delivery-fact ladder file untouched, structural edges deliberately
  outside binding traversal with the exclusion documented in three places.
- **Scope discipline**: brief E fully untouched, MD-28 unopened, no free-form vocabulary, the
  single-writer hot-file assignments visibly held (runner untouched; schema/derive changes confined
  to the D todo's shape).
