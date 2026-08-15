# Deep architectural review — `feature/universal-spec` (reviewer: kimi, independent)

- Branch: `feature/universal-spec`, base `main`, merge-base `4ccc2e9b3845a288f5426e2d6dc52d05e2ea416b` (89 files, ~+5467/−156).
- Operative law read first: `AGENTS.md`, `CONTEXT.md`, `specs/decisions/carrier-universality.sdp.md`, `specs/decisions/structural-anchor-semantics.sdp.md`, then `.omo/plans/arc-keystone-engines.md`, `plans/29-…briefs.md`, `plans/31-…durable-record.md`.
- Method: clause-by-clause fidelity against the two decision Specs; schema/edge-contract inspection; codegen hazard hunt; projection determinism/honesty checks; Must-NOT scan of the full diff; targeted vitest runs only (no `npm run check`).
- Verification runs: `npx vitest --run test/testing.test.ts test/codegen.test.ts test/structural-anchors.test.ts test/census.test.ts test/mermaid-render.test.ts test/gherkin-view.test.ts test/validators.test.ts test/mermaid-cli.test.ts` → **8 files, 100 tests, all pass**. `npx vitest --run examples/checkout-v1/test` → migrated valid-cart registrar path **passes**. Graph query confirms **zero** corpus examples with more than one `When` step.

## 1. Findings register

### K1 — major · high — Multi-`When` scenarios silently double-invoke the product call in a frozen interface

- **Evidence:** `src/codegen/contracts.ts:914-915` emits `await invokeRunnableExample(execution);` for **every distinct `when` skeleton**; the generated sibling shows the shape (`examples/checkout-v1/test/orders/orders.create-order.valid-cart.test.generated.ts:40-42`). `invokeRunnableExample` calls `adapters.invoke(world, point)` unconditionally (`src/testing/index.ts:57-61`). The runner core runs every step occurrence (`src/runner/index.ts:100-120,132-140`), so a scenario with two `When` steps — a lawful shape in both carriers (`when: string[]`) — executes the side-effecting product call twice. For a non-idempotent invoke (the checkout example *creates an order*) that is wrong behavior, baked into generated code.
- **Why it matters:** `specs/extraction/runnable-modules.sdp.md` freezes the registrar's dispatch semantics; the ruled 6-step comparator assumes one invocation ("(4) call authored `observe(world)` for the actual Outcome"). The old authored-test shape let the author control invocation per step; the registrar hard-codes invoke-per-`When` and narrows expressivity silently. Currently latent — `sdp:q` over the corpus returns zero multi-`When` examples — but once adopters build on the freeze, correcting this is a breaking change to a frozen contract.
- **Fix direction:** Emit the invoke once (first `When`, subsequent `When` handlers become no-ops or composition points), or name multi-`When` as refused/unsupported in the runnable-modules freeze.

### K2 — minor · high — Comparator failures print the `at step:` prefix twice

- **Evidence:** `.omo/evidence/arc-keystone-engines/task-8-mutation.log:24-25` shows the emitted failure: `Error: at step: Then an order is created with total 101` followed immediately by `at step: Then an order is created with total 101` again. Cause: `assertDeepEqual`'s context string already starts with `at step: ${renderContractStep(step)}` (`src/testing/index.ts:77,84`), and `runExamplePlan` wraps every step failure with `prefixStepFailure(step.label, …)` where `label` is the same rendered step (`src/runner/index.ts:137,142-148`).
- **Why it matters:** The failure law — "a red step names itself in the spec's own language" — is honored, but the doubled line reads as a rendering bug in the one place honesty is most visible (a red test). Cosmetic, not semantic.
- **Fix direction:** Drop the `at step:` prefix from the comparator's context strings; let the runner core own the one prefix.

### K3 — minor · high — `unspecified` oracle outcome contradicts the runner's documented law

- **Evidence:** `src/runner/index.ts:157-160` documents `unspecified` as "names a coverage gap, **never an error**." In the runnable-module runtime, an oracle returning `unspecified` matches no `Then` skeleton (`compareContractOutcome` early-returns unless `step.text === oracle.kind`, `src/testing/index.ts:67-69`), so `completeRunnableExample` throws (`src/testing/index.ts:93-101`) — a hard test failure. The migrated oracle was amended to return `unspecified` for incomplete points (`examples/checkout-v1/test/orders/create-order.oracle.ts`), which is precisely the path that would redden if it ever fired on a bound example.
- **Why it matters:** Two engine surfaces now state opposite semantics for the same outcome kind. For a *bound* example, reddening on `unspecified` is arguably the honest choice (the example claims an outcome the oracle won't name) — but then the runner doc comment is stale, and an adopter reading it will design oracles against the wrong law.
- **Fix direction:** Qualify the runner comment ("never an extraction/validation error; a bound example reddens when no `Then` names it") or carve the exception in `completeRunnableExample`.

### K4 — minor · high — The three new CLI verbs disagree on publishing over an invalid graph

- **Evidence:** `runValidate` returns `{ exitCode: 1, graph }` when validation errors exist — graph defined, exit nonzero (`src/cli/validate-view-command.ts:49`). `runMermaid` refuses to publish and removes artifacts (`src/cli/mermaid-command.ts:98`: gates on `validate.exitCode !== 0 || validate.graph === undefined`). `runCensus` (`src/cli/census-command.ts:82`) and `runGherkinView` (`src/cli/gherkin-command.ts:89`) gate only on `validate.graph === undefined` — they publish the projection over a graph with validation errors, then return 1 (the pre-existing `runView` posture, `validate-view-command.ts:70`).
- **Why it matters:** Three commands added in one arc implement near-identical wholesale-rewrite spec sentences ("A failed publish removes any live or temporary root it cannot certify") with two different gating policies. Either mermaid over-refuses (withholding a pure, correctly-labeled projection of an existing graph) or census/gherkin under-refuse (publishing output derived from a graph the checks just condemned). The specs don't settle it; the tree should.
- **Fix direction:** Pick one posture for all projection verbs (the view/census/gherkin one is defensible — exit code already signals, and the projection honestly renders findings) or name the divergence in the carrying Specs.

### K5 — minor · medium — "Second registration path refused" is implemented as silent first-file selection

- **Evidence:** `src/codegen/contracts.ts:1093-1102` collects all anchored `verifies` test files for an example, sorts them, and takes `anchoredTestFiles[0]` — no finding, no warning. `specs/extraction/runnable-modules.sdp.md:19` rules "a second registration path for the same example is refused."
- **Why it matters:** Structurally the freeze holds (the registrar map is keyed by Spec ID, so a second path cannot exist), but an author who binds a second suite to the same example gets no sibling registrar there and no message explaining why — silence where the spec language implies loudness. Deterministic, but not honest-loud.
- **Fix direction:** Emit a codegen warning naming the unselected suites, or amend the spec sentence to say the registrar is deterministically attributed to the alphabetically-first anchored suite.

### K6 — nit · high — Census "Dangling structural references" section is unreachable on the standard pipeline

- **Evidence:** Extraction withholds invalid structural anchors to a fixed point before the final derive (`src/extract/index.ts:139-149`, running `validateStructuralAnchorEdges` which includes referential integrity, `src/validate/validators.ts:695-705`), so no dangling `memberOf`/`uses` edge reaches the final graph. The census filter additionally requires the finding's ids to be endpoints of structural edges **in the final graph** (`src/projections/census.ts:225-235`) — withheld anchors never are. The section always renders "No dangling structural references reported by the validator."
- **Why it matters:** Dead rendering path; harmless and honest, but it implies a live channel that the pipeline architecture forecloses. (Note `derive.ts:109`'s "a dangling target is emitted, not dropped" remains true of `deriveGraph` the function for authored edges — the withholding wrapper is what forecloses it for structural ones.)
- **Fix direction:** Drop the section, or source it from the extraction report (which does carry the withholding findings) instead of `reader.findings()`.

### K7 — nit · high — Stale unadopted registrars accumulate silently in the source tree

- **Evidence:** `sdp build` writes registrars file-by-file with no stale-file removal (`src/cli/build-command.ts:207-211`), unlike `graph.json`/contracts which get wholesale tmp-rename replacement (`build-command.ts:179-198`). This working tree currently holds 14 ignored, untracked `test/*.test.generated.ts` files (unadopted self-hosting output; `git ls-files` empty, `git status` clean under the new `**/*.test.generated.ts` ignore rule).
- **Why it matters:** By design these are inert — vitest's default include (`*.test.ts`) does not match `*.test.generated.ts`, and registrars don't self-register — and the spec's "ignored, regenerable output" posture covers them. But the tree accumulates disposable output with no cleanup path, and a stale **adopted** registrar is only caught indirectly (via its contract import reddening). `--check-clean` compares regenerated registrar bytes (`build-command.ts:170-171`) but never reconciles the on-disk set.
- **Fix direction:** Have build remove registrar siblings it did not emit this run (tracked manifest), or document the accumulation as accepted.

### K8 — nit · high — The checkout-v1 walkthrough is stale against the registrar shape it headlines

- **Evidence:** `examples/checkout-v1/README.md:73-74` still claims "Changing a Markdown value or step can fail the test or **reject a stale handler key** without changing the test" — but the freeze's acceptance criterion is zero literal step-skeleton keys in the authored test; a step rename now reddens the generated registrar's exhaustive mapped type (and the oracle kind string), not an authored "handler key". The walkthrough never mentions the committed registrar sibling `orders.create-order.valid-cart.test.generated.ts`, nor that `generated/` is no longer the whole derived story (the adopted registrar is tracked, outside `generated/`).
- **Why it matters:** The repo's own tracer-bullet discipline makes this README the proof-of-loop document; brief B is the arc's headline deliverable and the walkthrough describes the pre-registrar shape.
- **Fix direction:** Update the executable-half paragraphs to name the registrar, the authored→generated import direction, and the new drift-redness paths.

### K9 — nit · medium — Oracle is invoked on incomplete points before the refusal fires

- **Evidence:** `createRunnableExample` calls `adapters.expected(point)` at `src/testing/index.ts:37` and only then checks `requiredConditions` for missing keys and refuses (lines 38-44). An adopter oracle that dereferences a missing condition throws its own error, masking the honest "oracle comparison refused for incomplete point; missing Conditions: …" message. The in-repo oracle had to be amended to tolerate partial points by returning `unspecified` — evidence the ordering bites in practice.
- **Why it matters:** The freeze's literal step order is "(1) call `expected(point)`" with a separate "refuse oracle comparison for incomplete points" clause, so the implementation is arguably faithful — but the refusal exists to protect against exactly this hazard, and calling the oracle first defeats it. `Partial<Conditions>` typing is otherwise honored end-to-end (no casts observed).
- **Fix direction:** Evaluate `missing` before invoking `expected` (a reorder that preserves the freeze's intent); or note in the freeze that oracles must tolerate partial points.

## 2. Briefs coverage assessment

### Brief A — carrier universality + Gherkin read view: **delivered as briefed**

- `specs/decisions/carrier-universality.sdp.md` exists, kind `decision`, readiness `ready`; the five ruled branches are all honored in code:
  - Kind bound (behavior/example only): enforced by the existing reifier plus the new `GHERKIN_KIND_LIE_REASONS` (`src/extract/gherkin-kind-honesty.ts`); a refused-kind tag now produces "Feature structure cannot distinguish…" (new reifier test row, `test/gherkin-reifier.test.ts` +5).
  - Prose only on MD-19 owners; DocStrings/DataTables stay refused: grammar untouched (no reifier grammar diff).
  - "Universal" = generated read projection: `src/projections/gherkin-view.ts` renders any Spec with a visibly-generated header ("disposable; not a carrier; not round-trippable", line 275), per-kind lie-reason LOSSY commentary (lines 271-281), dedicated escaper (lines 34-42), deterministic ordering (lines 323-335), `.feature.md` output only (line 50) — never `.sdp.gherkin` in an authored tree, never a round-trip claim.
  - Markdown default not flipped: `specs/carrier/gherkin-authoring.sdp.md` amendment reaffirms it; no default-changing code.
  - Packs out of scope: no Gherkin Pack surface added.
- Follow-through amendments landed (`gherkin-authoring`, `carrier-ruling`, `gherkin-carrier-option` consequences). MD-28 untouched: no suffix/grammar/dual-recognition diffs. CLI verb `sdp gherkin` with wholesale tmp-rename publish and check-clean twin-render + published-tree comparison (`src/cli/gherkin-command.ts`). Tests green (`test/gherkin-view.test.ts`).
- Caveats: K4 (publish posture), and the projection's dead-simple `encodeURIComponent` path fallback is fine but injective-only-by-construction (no test seen for hostile-ID path fallback — low concern).

### Brief B — derived runnable modules: **delivered as briefed**

- Frozen interface Spec `specs/extraction/runnable-modules.sdp.md` carries the ruled surface; implementation matches clause by clause:
  - Registrar owns describe/it registration, dispatch, comparator, failure rendering; authored test shrinks to the five adapters + one activation call (`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts` → `registerValidCart`).
  - Import direction authored→generated only; generated module imports the contract projection and `@libar-dev/software-delivery-protocol/{runner,testing}` — no cycle, no export-identity problem (registrar exports a function; the graph stays binding-only per MD-7).
  - Sibling path keyed by Spec ID; one authored suite can verify many examples without collision (test/codegen.test.ts multi-example case).
  - `./testing` subpath export wired consistently: `package.json` exports, `tsup.config.ts` entry, `vitest.config.ts` alias ordered before the root alias, `tsconfig.examples.json` path.
  - Skeleton-text identity with exhaustive mapped types on both sides (generated `StepBindings` satisfies + required authored adapters) — wording edits redden types by design; failure message honesty caveat in K2.
  - Three-way comparator implements the ruled 6 steps (`src/testing/index.ts:37,63-88,103-108`); `Actual===oracle` alone forbidden (step params vs oracle payload compared first); deep-structural equality with path-named missing/extra/changed diagnostics (`firstDifference`, lines 141-188); scenario-level diagnostic with `cause` when no `Then` matches (lines 93-101); additive assertions run after, never replacing steps 3/5.
  - Non-empty `verifies`, anchor remains sole `has-verifier` source: `src/graph/delivery-facts.ts` untouched by the diff (empty diff), reads only `satisfies`/`verifies`.
  - Refusals held: no env/global/module side channels, no self-running modules (registrar exports only), no O5 (engine never loads adopter code; vitest does), no Scenario Outlines.
  - Determinism: registrars included in `--check-clean` byte comparison (`src/cli/build-command.ts:170-171`); codegen determinism test extended.
  - Mutation evidence: `.omo/evidence/arc-keystone-engines/task-8-mutation.log` shows red/red/green with the spec's own language in failures.
- Caveats: K1 (multi-`When` double-invoke — the one finding with real architectural weight), K2, K3, K5, K9.

### Brief C — census + bounded Mermaid + CLI verbs: **delivered as briefed**

- Census (`src/projections/census.ts`): taxonomy rows derive from runtime constants (`SPEC_KINDS`, `SPEC_ALTITUDES`, `SPEC_READINESS`, `graphClaims`, `graphEdgeTypes`, `graphNodeTypes`, `deliveryFactNames`); zero-count categories render (`counts.get(value) ?? 0`, line 52); foreign values render as `unrecognized:` rows (lines 55-63); structural-bindings section renders membership, fan-in/fan-out, and cycles as data; findings section sorted deterministically; explicit empty states. Pure reader-function, no fs/clock (lines 386-390).
- Mermaid (`src/projections/mermaid.ts`): injective machine tokens (hex per UTF-16 code unit, lines 54-60 — collision detection is therefore defensive dead code, harmless); dedicated escaper with per-character entity map, no double-escape (lines 27-51); sorted nodes/edges/pages (lines 147,153,264); dangling endpoints render as `unresolved` placeholders (line 179); per-diagram refusal naming the bound with explicit REFUSED page, in-bound diagrams still publish, no silent truncation (lines 156-172,191-200); bounds 64/128 match the Spec (`specs/consumers/mermaid-view.sdp.md:23`).
- CLI verbs: wholesale tmp-rename publication, failure removes both roots (honest absence), `--check-clean` twin-render + published-tree comparison (`src/cli/census-command.ts`, `mermaid-command.ts`, `gherkin-command.ts`); `sdp build` invalidates all four projection roots before extraction (`src/cli/build-command.ts:81-108`).
- Caveats: K4 (posture inconsistency), K6 (dead census section).

### Brief D — structural anchor semantics: **delivered as briefed**

Every consequence clause of `specs/decisions/structural-anchor-semantics.sdp.md` verified against the tree:

- `component`/`uses` extend `codeAnchor` only (`src/model/anchors.ts`); **no per-namespace sibling anchor builders** — `componentAnchorId` (`src/ids.ts`) is an ID constructor sibling to `codeAnchorId`, not an anchor builder; no `componentAnchor()` exists.
- No `implements` field admitted (no matches in carrier or anchor extraction; foreign-field envelope error covers smugglers, `src/extract/anchors.ts:388-392`).
- Closed graph-ID value forms: `component` reified via `componentAnchorId` only, `uses` via `codeAnchorId`/`componentAnchorId` array literal, statically reifiable (anchors.ts:302-360).
- Anchored claims only: `derive.ts:186-204` emits `claim: "anchored"` for both edge types; zero `inferred` growth; no fourth claim.
- Target existence is an error: enforced fail-closed at the extraction boundary via fixed-point withholding (`src/extract/index.ts:139-149` + `validateStructuralAnchorEdges` incl. referential integrity, `validators.ts:695-705`); graph-level referential integrity also runs over the final edge set.
- Endpoint/namespace rules: `memberOf` impl:/api: → component:, one component per source, `uses` across impl:/api:/component: (`validators.ts:566-689`); edge-contract rows require `anchored` + CodeNode endpoints (`validators.ts:406-410`).
- Non-empty-when-present, unique targets, self-reference refusal at extraction (anchors.ts:400-440); uniqueness of structural edges and self-reference again at graph validation (validators.ts:574-586,650-667).
- One-level membership holds structurally: component→component membership is refused because `memberOf` sources must be impl:/api:.
- Cycles are data, not findings: no cycle check in validators; census renders cycles (`renderUsesCycles`).
- No intent/readiness/status/delivery fact on anchors: envelope closed; `delivery-facts.ts` untouched; schema comment states the exclusion (`src/graph/schema.ts:41-45`); reader's `isTraversableBinding` exclusion is explicit and documented with the right rationale (`src/reader/reader.ts:382-387`).
- No free-form tag vocabulary / parallel registry: none added.
- Malformed structural field refuses the whole anchor (`envelopeOk = false`), per the decision — with the honest side effect that the anchor's `satisfies` binding also vanishes, loudly reddening `implemented` rather than silently partial-declaring.
- Anchor-required lint stays unpromoted: no such lint exists in the engine and none was added; no validator severity changes (validators diff is purely additive).
- Schema bump: `schemaVersion = "0.5.0"` (`src/graph/schema.ts:6`), propagated to `check-prose-schema.mjs`, `docs/concept/06`, the schema-versioning example Spec, and `test/graph-schema.test.ts`.
- Caveat: K6 (census dangling-section dead code), K7 (registrar hygiene, tangential).

### Must-NOT list (plan 31 / briefs): **all held**

- Brief E untouched: no `sdp new`, no `--watch`, no MCP surface, no `bySymbol` anywhere in the diff (one spec-edge mention of the pre-existing `mcp-deferred` decision only); `spec:consumers.impact-graph` remains `idea`.
- MD-28 not reopened: no suffix, grammar, dual-recognition, or diagnostics-cap diffs.
- No self-executing prose: Gherkin prose posture unchanged; decision reaffirms MD-19 owners only.
- `specTest` remains the sole `has-verifier` source: delivery-facts derivation untouched; runnable-modules Spec states it; generated execution confers no delivery fact.
- No O5: the engine never loads or executes adopter code; registrars run under vitest only.
- No anchor-required lint promotion; no authored delivery status anywhere.

## 3. What is genuinely good

- **Fail-closed structural extraction done right.** The fixed-point withholding (`excludeInvalidStructuralAnchors`) handles cascading refusal (one refused anchor was another's target) and keeps unrelated anchors alive; the side effect that a malformed structural field also reddens `implemented` is exactly the loudness the honesty guardrails want.
- **The registrar design dodges both predicted codegen hazards by construction.** Import direction is authored→generated only (no cycle possible), and export-identity never arises because the registrar exports a function the authored test calls — the graph stays binding-only. The exhaustive mapped types on *both* sides (generated bindings, authored adapters) make skeleton-text drift a compile error naming the step, which is the honest failure the freeze promised.
- **Projections are disciplined pure functions.** No fs, no clock, deterministic ordering everywhere, wholesale tmp-rename publication with honest absence on failure, and `--check-clean` that compares both a twin render and the previously published tree. The Mermaid token encoding is injective by construction (the collision refusal is cheap belt-and-braces), and refusal pages name the bound instead of truncating.
- **The Gherkin read-view is scrupulously non-aspirational.** "Disposable; not a carrier; not round-trippable" in the header of every page, per-kind lie-reasons as LOSSY commentary, `.feature.md` naming so it can never be mistaken for an authored carrier — a projection that knows exactly what it is.
- **Test posture improved while adding surface.** 100 targeted tests green across the new runtime, codegen, validators, and all three projections; the cli suite now isolates the self-hosting corpus copy instead of racing writes to the live root (a real parallelism fix, not a workaround).

## Verdict

No blockers. One finding with genuine architectural weight (**K1**, the multi-`When` double-invoke baked into a frozen registrar contract — latent today, breaking to fix later) and a cluster of honesty/consistency nits (K2–K5) that the synthesis should weigh against the arc's otherwise strong clause-by-clause fidelity. All four briefs delivered as briefed; every Must-NOT held.
