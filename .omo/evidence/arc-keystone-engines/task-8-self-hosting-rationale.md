# Task 8 — self-hosting rationale (Brief B / derived runnable modules)

Status: complete (implementation-aligned rationale)
Plan: `.omo/plans/arc-keystone-engines.md` Todo 8
Frozen law: Todo 4 / `specs/extraction/runnable-modules.sdp.md`
Worktree surveyed: `/home/darkomijic/dev-libar/software-delivery-protocol-arc-keystone-engines`
Date: 2026-08-14

## Purpose

Binary, exhaustive, auditable migrate-vs-defer record for every repository runnable example family found under the live worktree. Todo 8 requires this file always, even when most families defer. The only required migration is `examples/checkout-v1` valid-cart.

## Coverage method

1. Read Todo 8 and the Todo 4 freeze (`specs/extraction/runnable-modules.sdp.md`): registrar `register<Example>({ createWorld, invoke, observe, expected, assertions? })`, authored→generated import only, three-way comparator, skeleton-text identity, `./vitest` remains the low-level `bindExample` adapter.
2. Enumerate parent example spaces from generated siblings:
   - self-hosting: `generated/contracts/*.space.ts` (33 spaces)
   - checkout pack: `examples/checkout-v1/generated/contracts/*.space.ts` (1 space)
3. Keep a space only when it owns at least one generated `*.contract.ts` child (bindable example). Drop spaces with a space file and no child contract (`consumers.census-page`, `consumers.mermaid-view`, `extraction.runnable-modules`). Those are not runnable families.
4. Confirm each kept family has a live adopter by locating `bindExample(` call sites under `test/**` and `examples/**` (vitest include: `test/**/*.test.ts`, `examples/**/*.test.ts`). Ignore string mentions inside `test/self-hosting-oracle/anchors.ts` (metadata, not runners).
5. Exclude non-families by path and role:
   - `explorations/**` (carrier spikes; excluded from self-hosting generate/validate)
   - `examples/checkout-v1/test/orders/drift-pins.ts` (compile-time drift pins; not a `*.test.ts` runner)
   - `examples/checkout-v1` `orders.create-order.invalid-cart` (generated contract exists; no `specTest` / `bindExample` adopter; standing unenabled-verifier warning is deliberate)
6. Family unit = parent example space id (one row per space that owns runnable bound children). Checkout valid-cart is listed as its own required-migration row per Todo 8, even though it sits under space `orders.create-order`.
7. Verdict rule (binary):
   - **MIGRATE** only if the family already has (or is the required tracer that must gain) the five-adapter shape under the freeze: product `invoke`, `observe` Outcome, parent `expected()`, and can drop authored step-skeleton keys into one registrar activation without inventing new semantics.
   - **DEFER** when the live adopter is the pre-freeze `bindExample(contract, world, StepBindings)` map, or when a lawful three-way comparator cannot run because no parent `expected()` oracle exists for the space, or when reshape would exceed the valid-cart tracer bullet.

Result: **31 families**, each with exactly one verdict. **1 MIGRATE**, **30 DEFER**.

## Emission versus adoption

The frozen interface says codegen emits one registrar for every bindable anchored example; migration verdicts do not narrow that producer. Registrar filenames are keyed by full Spec ID inside the authored test's directory, so consolidated suites cannot overwrite one another. The checkout valid-cart registrar is the sole adopted/committed sibling because authored code imports it. Registrars for the 30 deferred families are ignored disposable build output: self-hosting generation may materialize them, but they remain outside authored test discovery because Vitest's include pattern selects `*.test.ts` and generated siblings end in `*.test.generated.ts`; they are not committed and confer no migration or delivery claim. This resolves the prior ten suite-filename collisions/residue files without falsely claiming those families migrated.

## Verdict table

| # | Family (space / point) | Verdict | Authored adopter | Anchor / runner / adapter evidence | Tracer-bullet justification | Dependency blocking lawful MIGRATE under Todo 4 |
|---|---|---|---|---|---|---|
| 1 | `examples/checkout-v1` · `spec:orders.create-order.valid-cart` (space `orders.create-order`) | **MIGRATE** | `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts` | `specTest` `test:orders.create-order.valid-cart` + `bindExample(validCartContract, …)` via `@libar-dev/software-delivery-protocol/vitest`; contract `examples/checkout-v1/generated/contracts/orders.create-order.valid-cart.contract.ts`; parent oracle `examples/checkout-v1/test/orders/create-order.oracle.ts` `expected()`; product `examples/checkout-v1/src/orders/create-order.use-case.ts` | Required Todo 8 tracer. Already has product call, observable order Outcome, and parent-space `expected()`. Shrinks to `specTest` + one registrar activation with `createWorld` / `invoke` / `observe` / `expected` / optional `assertions`, and drops authored skeleton keys such as `"a customer has a cart with {n} line items"`. | None for migration of this point. Sibling `invalid-cart` stays unbound on purpose (not part of this row). |
| 2 | `spec:carrier.gherkin-authoring` | **DEFER** | `test/self-hosting-carrier-gherkin.test.ts` (13 `bindExample` sites) | Per-point `specTest` + shared inline step map; contracts under `generated/contracts/carrier.gherkin-authoring.*.contract.ts` | Multi-scenario carrier suite still owns skeleton→callback maps and fixture graph construction inside Given/When steps. Not the product-oracle tracer. | No parent-space `expected()` oracle for three-way comparator steps (1)–(3). Reshape would invent invoke/observe/expected semantics the freeze does not supply. |
| 3 | `spec:carrier.markdown-pack-authoring` | **DEFER** | `test/self-hosting-pack-markdown.test.ts` (2 sites) | `specTest` + `packBindings` + `bindExample` | Pack-markdown parity/refusal points share one step map; mechanical registration is not the Brief B bullet. | No space-level `expected()`; adopter is StepBindings, not five adapters. |
| 4 | `spec:carrier.markdown-parser` | **DEFER** | `test/self-hosting-carrier.test.ts` (`boundedParityContract`) | `specTest` + `parityBindings` + `bindExample` | Single bound point; still skeleton-keyed handlers over a parse world. | No `expected()` oracle; no clean product `invoke` boundary separate from step handlers. |
| 5 | `spec:carrier.sdp-import` | **DEFER** | `test/self-hosting-sdp-import.test.ts` | `specTest` + inline `bindExample(roundTripContract, …)` | Round-trip uses file fixture + `importTypeScriptSpec` inside When; asserts graph equality in Then. | No parent `expected()` Outcome oracle; Then is procedural equality, not comparator-ready Outcome union consumption by generated code. |
| 6 | `spec:carrier.slot-notation` | **DEFER** | `test/self-hosting-carrier.test.ts` (2 sites) | `specTest` + `slotNotationBindings` + `bindExample` | Slot typed-declaration / refused-guess points share bindings. | No space `expected()`; StepBindings shape only. |
| 7 | `spec:consumers.agent-surface` | **DEFER** | `test/self-hosting-consumers.test.ts` (2 sites) | `specTest` + `frontDoorBindings` + `bindExample` | Front-door scripted-context / demand-map points. | No five-adapter split; no parent `expected()` wired into the runner. |
| 8 | `spec:consumers.binding-language-views` | **DEFER** | `test/self-hosting-projections.test.ts` (2 sites) | `specTest` + `bindingLanguageBindings` + `bindExample` | Projection string assertions live in Then skeleton handlers. | No space `expected()`; observe would have to re-encode page text already asserted step-wise. |
| 9 | `spec:consumers.derived-readiness-banner` | **DEFER** | `test/self-hosting-projections.test.ts` (2 sites) | `specTest` + `bannerBindings` + `bindExample` | Banner honesty points share bindings. | Same StepBindings gap; no parent oracle `expected()`. |
| 10 | `spec:consumers.design-review` | **DEFER** | `test/self-hosting-projections.test.ts` (`pureProjectionContract`) | `specTest` + `pureProjectionBindings` + `bindExample` | Pure-projection point is engine self-check, not checkout-shaped product flow. | No `expected()` oracle for three-way compare; migration would rewrite the binding surface without tracer value. |
| 11 | `spec:consumers.reader` | **DEFER** | `test/self-hosting-consumers.test.ts` (3 sites) + separate `test/self-hosting-consumers.oracle.ts` / `test/self-hosting-consumers-oracle.test.ts` | Bound points use `readerBindings` + `bindExample`. Oracle `expectedReaderOutcome` is exercised only by the manual Then-matching suite, not by `bindExample`. | Closest self-hosting cousin to the freeze (has `expected()`), yet the runnable adopter is still skeleton StepBindings. Tracer stays checkout valid-cart. | Lawful registrar needs one activation that consumes `expected` inside generated compare. Wiring it requires rewriting three bound points into createWorld/invoke/observe and retiring the parallel oracle suite shape. Out of tracer scope. |
| 12 | `spec:consumers.wholesale-view-rewrite` | **DEFER** | `test/self-hosting-projections.test.ts` (4 sites) | `specTest` + `wholesaleRewriteBindings` + `bindExample` | Four stale/failed/build-invalidation points share one map. | No parent `expected()`; multi-point shared bindings are not five-adapter per example. |
| 13 | `spec:extraction.build-pipeline` | **DEFER** | `test/self-hosting-extraction.test.ts` (`sameInvocationContract`) | `specTest` + `sameInvocationBindings` + `bindExample` | Pipeline same-invocation point. | StepBindings only; no space oracle. |
| 14 | `spec:extraction.example-runner` | **DEFER** | `test/self-hosting-extraction.test.ts` (2 sites) | `specTest` + `runnerBindings` + `bindExample` | Runner red-step / step-order points test the low-level runner itself. | Migrating the runner's own examples onto the registrar would couple the subject under test to the new surface mid-landing. No parent `expected()` oracle. Keep `./vitest` `bindExample` path. |
| 15 | `spec:extraction.excludes` | **DEFER** | `test/self-hosting-extraction.test.ts` (2 sites) | `specTest` + `excludeBindings` + `bindExample` | Segment-boundary / refused-path points. | No `expected()`; fixture path worlds live in step handlers. |
| 16 | `spec:extraction.executable-contracts` | **DEFER** | `test/self-hosting-extraction.test.ts` (3 sites) | `specTest` + `contractsBindings` + `bindExample` | Concreteness / multi-entry / colliding-path points gate codegen refusals. | These examples police generation-time refusals the freeze reuses unchanged. Registrar migration is not required to keep those refusals honest. No space `expected()`. |
| 17 | `spec:extraction.schema-versioning` | **DEFER** | `test/self-hosting-extraction.test.ts` (`declaredVersionContract`) | `specTest` + `schemaVersionBindings` + `bindExample` | Declared-version point. | StepBindings only; no oracle. |
| 18 | `spec:model.anchors` | **DEFER** | `test/self-hosting-model.test.ts` (2 sites) | `specTest` + `anchorTrustBindings` + `bindExample` | Lookalike-refusal / physical-identity points. Freeze forbids anchor-layer changes. | No `expected()`; anchor trust is not a product invoke/observe flow. |
| 19 | `spec:model.stable-ids` | **DEFER** | `test/self-hosting-model.test.ts` (2 sites) | `specTest` + `stableIdBindings` + `bindExample` | Namespaced round-trip / malformed refusal. | StepBindings only; no parent oracle. |
| 20 | `spec:validation.authored-honesty` | **DEFER** | `test/self-hosting-validators.test.ts` (2 sites) | `specTest` + `authoredHonestyBindings` + `bindExample` | Section-authored-fact / unearned-stated-fact. | Shared validator world + step map; no space `expected()`. |
| 21 | `spec:validation.claim-separation` | **DEFER** | `test/self-hosting-validators.test.ts` (2 sites) | `specTest` + `claimSeparationBindings` + `bindExample` | Collapsed-edge / unratified-descriptor. | Same validator StepBindings pattern. |
| 22 | `spec:validation.diagnostic-rendering` | **DEFER** | `test/self-hosting-projections.test.ts` (2 sites) | `specTest` + `diagnosticRenderingBindings` + `bindExample` | Composed-location / table-cell-location. | No `expected()`; rendering assertions are Then handlers. |
| 23 | `spec:validation.duplicate-ids` | **DEFER** | `test/self-hosting-duplicate-ids.test.ts` (1 site) | `specTest` + `bindExample(dualCarrierContract, …)` | Dual-carrier duplicate-id point. | Single StepBindings adopter; no oracle. |
| 24 | `spec:validation.kind-evidence` | **DEFER** | `test/self-hosting-validators.test.ts` (3 sites) | `specTest` + `kindEvidenceBindings` + `bindExample` | Constraints-alone / untargeted / empty-promoted-child. | Shared bindings; no five-adapter oracle path. |
| 25 | `spec:validation.oracle-target-eligibility` | **DEFER** | `test/self-hosting-validators.test.ts` (2 sites) + `test/self-hosting-validators.oracle.ts` / `test/self-hosting-validators-oracle.test.ts` | Bound points use `oracleTargetEligibilityBindings` + `bindExample`. `expectedOracleTargetEligibilityOutcome` is checked only in the manual Then-matching suite (Todo 8 reference precedent), not via registrar. | Has a real `expected()` and is the in-repo Then-matching precedent, but the runnable family still registers through skeleton StepBindings. Valid-cart remains the migration bullet. | Connecting `expected` into generated compare means replacing shared bindings and the separate oracle test with per-point registrar activations. Lawful, but not the Todo 8 tracer and not required for freeze landing. |
| 26 | `spec:validation.pack-coherence` | **DEFER** | `test/self-hosting-validators.test.ts` (1 site) | `specTest` + `packCoherenceBindings` + `bindExample` | Incoherent-aggregate point. | StepBindings only. |
| 27 | `spec:validation.readiness-floor` | **DEFER** | `test/self-hosting-validators.test.ts` (2 sites) | `specTest` + `readinessFloorBindings` + `bindExample` | Unrelated-scoped-spec / blocking-open-question. | Shared validator map; no space oracle. |
| 28 | `spec:validation.referential-integrity` | **DEFER** | `test/self-hosting-validators.test.ts` (2 sites) | `specTest` + `referentialIntegrityBindings` + `bindExample` | Dangling-target / did-you-mean. | StepBindings only. |
| 29 | `spec:validation.two-check-families` | **DEFER** | `test/self-hosting-validators.test.ts` (1 site) | `specTest` + `twoCheckFamilyBindings` + `bindExample` | Split-report point. | StepBindings only. |
| 30 | `spec:validation.verification-linkage` | **DEFER** | `test/self-hosting-validators.test.ts` (2 sites) | `specTest` + `verificationLinkageBindings` + `bindExample` | Unbound-example / unresolved-oracle. | StepBindings only; claim taxonomy stays untouched per freeze. |
| 31 | `spec:validation.warn-level-signals` | **DEFER** | `test/self-hosting-validators.test.ts` (2 sites) | `specTest` + `warnLevelSignalBindings` + `bindExample` | Orphan-signal / ready-gap-signal. | StepBindings only. |

## Explicit non-families (not counted)

| Path / id | Why excluded |
|---|---|
| `generated/contracts/consumers.census-page.space.ts` | Space only; zero child contracts; zero `bindExample`. |
| `generated/contracts/consumers.mermaid-view.space.ts` | Space only; zero child contracts; zero `bindExample`. |
| `generated/contracts/extraction.runnable-modules.space.ts` | Freeze Spec space; no bindable child contract yet (Todo 8 implements the surface). |
| `examples/checkout-v1` `spec:orders.create-order.invalid-cart` | Contract on disk; no authored test adopter; deliberate unenabled verifier. |
| `examples/checkout-v1/test/orders/drift-pins.ts` | Not a vitest `*.test.ts` family runner; type-level drift pins against `validCartContract`. |
| `explorations/**` | Spike trees; excluded from self-hosting pack generate/validate. |

## Audit checks

- Family count: **31**
- Verdicts: **MIGRATE = 1**, **DEFER = 30**
- Every table row has exactly one of {MIGRATE, DEFER}
- Required migration row present: `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts`
- Generated registrar filenames carry Spec identity; no map or output-path overwrite occurs when one suite verifies multiple examples
- Unadopted generated siblings are ignored disposable output; the one imported valid-cart registrar is force-added and reviewed
- `./vitest` `bindExample` remains the lawful pre-migration adapter for all DEFER rows under the Todo 4 export freeze

## Summary for Todo 8 implementers

Adopt the generated registrar only on checkout valid-cart in this todo. Leave all thirty self-hosting spaces on `bindExample` until a later todo rewrites them with real `expected()` oracles and five-adapter boundaries. Two spaces already have oracle helpers (`consumers.reader`, `validation.oracle-target-eligibility`); both still DEFER because their runnable path is not registrar-shaped and is not the tracer bullet.
