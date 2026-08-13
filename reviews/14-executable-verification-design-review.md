# 14 — Executable-verification design review

**Reviewed:** the restored v0 concept set, the gen-1 `@libar-dev/architect` production record, and the current Protocol executable-example design. The challenge is whether one native `.sdp.md` example Spec plus a separate anchored `.test.ts` verifier betrays the thesis that one language spans intent → spec → design → code.

**Verdict:** the split does not violate the intent-only reading of “one spec format,” but the current test shape makes authors repeat derivable structure. Recommend **O3 — derive the runnable test body and shrink the authored verifier toward world/handler semantics plus the existing oracle**. O3 removes the measured mechanical share without reopening the carrier ruling or weakening the binding-only anchor and claim boundaries.

**Owner decision:** O2 won at the plan-27 checkpoint. The owner selected a graph-aware Gherkin carrier option for behavior and example Specs, accepting its bounded second-parser and vocabulary-lint cost. The review recommendation remains above as the evidence-led recommendation; the ratified outcome is carried by the Gherkin carrier option (MD-27).

**Citation note:** `architect:` means the read-only sibling checkout `/Users/darkomijic/dev-libar/architect/`. Restored v0 citations name the restored-file lines, including their six-line lineage headers. All citations were re-read against the execution-time trees.

---

## 1. The challenge and the record

The strong challenge is valid: the current example appears first as Given/When/Then in a Spec and again as handler keys and parameter plumbing in a test. The example’s six authored steps are at `examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md:17-23`; the generated contract repeats them lawfully as a projection at `examples/checkout-v1/generated/contracts/orders.create-order.valid-cart.contract.ts:8-36`; the test repeats the keys a third time around authored bodies at `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:30-64`.

The historical claim needs precision. Across all five authoring/execution shapes on the record — v0 TypeScript Specs, v0 equal-canonicity Gherkin, v0 harnesses, gen-1 fused Gherkin, and current Markdown Specs — **performing execution lived in a separate code artifact**:

1. v0 TypeScript Specs named test references in a hand-authored `verification` facet; CI supplied evidence (`docs/lineage/v0-design/01-core-primitives.md:270-298`).
2. v0 Gherkin became executable only through TypeScript Cucumber step definitions (`docs/lineage/v0-design/04-authoring-surfaces.md:512-550`).
3. v0 harnesses were explicitly not test runners and not authoritative truth (`docs/lineage/v0-design/04-authoring-surfaces.md:645-655`).
4. gen-1 put intent and scenarios in a permanent `.feature`, but executed them through separate TypeScript step definitions (`architect:formal-spec/08-spec-evolution.md:352-362`; `architect:tests/features/cli/generate-docs.feature:18-33`).
5. the current design executes a generated graph contract through a framework-neutral runner and an anchored ordinary test (`src/runner/index.ts:100-140`; `src/adapters/vitest.ts:25-38`; `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:10-30`).

No version made prose self-executing. The real design question is narrower and more useful: **how much of the separate code artifact is irreducibly authored semantics, and how much can the graph derive?**

---

## 2. The v0 design as restored

### 2.1 Four surfaces, with an unresolved canonicity tension

v0 ranked four surfaces: TypeScript Spec DSL as “canonical, typed, refactorable, the source of truth”; source markers as bindings; Annotated Gherkin as equal-canonicity for `kind: "behavior"`; and harness modules for interactive review (`docs/lineage/v0-design/04-authoring-surfaces.md:11-18`). That local equal-canonicity promise conflicts with the v0 overview’s stronger “TypeScript is canonical. HTML is the lens” statement (`docs/lineage/v0-design/README.md:54-62`). The restored record therefore supports a Gherkin option, but not the claim that v0 had already resolved one globally consistent carrier policy.

Markers were deliberately one-way, read-only pointers. They could not carry readiness, behavior, intent, or verification; those remained Spec properties (`docs/lineage/v0-design/04-authoring-surfaces.md:385-413`). This is the ancestor of the current binding-only-anchor boundary, not evidence for putting executing bodies into graph bindings.

### 2.2 Gherkin vocabulary and lint

The v0 prose listed eleven prefixes: `@spec.`, `@pack.`, `@capability.`, `@readiness.`, `@component.`, `@api.`, `@layer.`, `@adr.`, `@nfr.`, `@risk.`, and `@owner.`; its example also used unlisted `@example.` (`docs/lineage/v0-design/04-authoring-surfaces.md:443-476`). This was a prose vocabulary, not a governed registry.

The cost was already visible: “Gherkin tags are strings; typos do not fail compilation.” `akg lint` checked IDs against generated `/generated/spec-ids.d.ts` and ran in pre-commit plus CI (`docs/lineage/v0-design/04-authoring-surfaces.md:572-587`). A revived richer carrier therefore needs an explicit mapping onto the ruled carrier vocabulary and existing ID grammar; it must not create a parallel tag registry.

### 2.3 Round-tripping was projection, not a lossless codec

For each ID exactly one surface was canonical, recorded by `akg.config.ts:specs.canonicalFormat`. `export-ts` or `export-gherkin` emitted the other form as a regenerable reading projection (`docs/lineage/v0-design/04-authoring-surfaces.md:552-570`; `docs/lineage/v0-design/07-spec-studio-and-projections.md:435-461`). The documents called the graph forms “equivalent,” but specified no field-level fidelity matrix. v0 is therefore evidence for per-ID carrier choice and projection, not evidence that a lossless bidirectional codec was designed.

### 2.4 Execution and evidence remained separate

Gherkin steps started as prose and acquired behavior through `features/steps/*.ts`; the extractor paired scenarios and definitions through Cucumber Messages and emitted `Test` nodes plus `verifies` edges (`docs/lineage/v0-design/04-authoring-surfaces.md:512-550`). The general discovery design likewise recognized Vitest, Cucumber step definitions, and Playwright as separate executable sources (`docs/lineage/v0-design/06-extraction-and-validation.md:586-602`).

Verification posture was hand-authored; evidence was the only facet populated from test/runtime output and was forbidden to authors (`docs/lineage/v0-design/01-core-primitives.md:270-298`). The graph kept declared, annotation, and inferred sources distinct (`docs/lineage/v0-design/03-graph-metamodel.md:364-390,395-465`). Readiness checks required resolving tests and named `executable-needs-tests` / `orphan-test` failures (`docs/lineage/v0-design/06-extraction-and-validation.md:352-385`). This was more stateful than the current delivery-fact model, but it still refused to equate authored posture with executing evidence.

### 2.5 What stayed in code

v0’s triangulation put local implementation identity and bindings in source markers, architecture-wide relationships in `/arch`, and intent/behavior/constraints plus Spec-side bindings in `/specs`. Missing or duplicate implementation identities and unknown components were validator findings (`docs/lineage/v0-design/04-authoring-surfaces.md:729-747`). That division supports deriving connection structure while leaving world construction and product calls in code.

---

## 3. The gen-1 production record

### 3.1 Value transfer: fusion after deliberate deletion

Gen-1 explicitly called design artifacts ephemeral. At implementation, a design `.feature` was deleted after its canonical name, surviving tags, and narrative moved onto the permanent executable test `.feature` (`architect:formal-spec/08-spec-evolution.md:8-16,348-401`). The mechanical process selected a primary test feature, transferred `@architect-pattern`, status and relationship tags, linked sibling tests, and deleted the design spec (`architect:formal-spec/08-spec-evolution.md:364-386`). Process/editorial specs with no executable destination were deleted outright (`architect:formal-spec/08-spec-evolution.md:434-443`).

That deletion is doctrine plus a manual five-criterion checklist, not a shipped deterministic gate (`architect:.agents/skills/architect-sessions/references/ephemeral-spec-deletion.md:101-129`). The proposed machine `deletionReady` read remains a candidate with pending deliverables (`architect:architect/specs/value-transfer-state.feature:1-21,40-62,72-83`). The production record therefore proves value transfer as a practiced authoring policy, not as a fully enforced invariant.

### 3.2 Tag system and generated-region determinism

The corrected formal registry says roughly 22 authored tags plus the `@architect` gate and three aggregation tags, about 26 total (`architect:formal-spec/04-tag-registry.md:367-370`). Its own review records that this replaced a claimed 50 (`architect:formal-spec/REVIEW-2026-05-17-FINDINGS.md:62-71`). A sibling generated taxonomy counts 32 when eight roles are included (`architect:docs-live/TAXONOMY.md:8-17`), while the formal-spec README still advertises “50+ tags” (`architect:formal-spec/README.md:77-88`). The three numbers measure different or stale surfaces; they demonstrate governance cost, not one trustworthy headline count.

Generated regions are the stronger lesson. The renderer preserves all non-managed bytes and normalizes only the marker-bounded span (`architect:packages/architect-projection/src/renderers/managed-region.ts:11-38`); CI regenerates committed `docs-live/` and requires an empty diff (`architect:.github/workflows/ci.yml:24-33`). The Protocol already obtains the same determinism more simply by keeping generated contracts wholly derived.

### 3.3 ProcessGuard is mixed, not merely advisory

`invalid-status-transition` and `session-excluded` are errors (`architect:packages/architect-guard/src/lint/process-guard/decider.ts:218-264,352-378`). `completed-protection`, `scope-creep`, `deliverable-removed`, and `session-scope` are warnings (`architect:packages/architect-guard/src/lint/process-guard/decider.ts:165-209,270-349`). Strict mode promotes warnings to errors (`architect:packages/architect-guard/src/lint/process-guard/decider.ts:130-172`), but the staged commit path invokes `architect-guard --staged` without `--strict` (`architect:.husky/pre-commit:4-14`; `architect:package.json:45-48`). Hand-authored lifecycle status is therefore partially walled and can drift on the ordinary commit path.

### 3.4 The fused artifact

A live test `.feature` carries canonical identity and completed status, intent as `Invariant` / `Rationale` / `Verified by`, and executable scenarios in one stakeholder-readable file (`architect:tests/features/cli/generate-docs.feature:1-33`). It still needs separate TypeScript step definitions. The test-pattern convention also keeps separate identities joined by `@architect-implements`, including the `*ExecutableTests` escape hatch (`architect:.agents/skills/architect-base/references/spec-pattern-relationships.md:8-40,57-75`).

### 3.5 What gen-1 did better

- One durable stakeholder-readable artifact places the invariant beside scenarios named by `Verified by` (`architect:tests/features/cli/generate-docs.feature:18-33`).
- The transfer checklist forces rich content to land before deletion, while the “transcription bloat” rule tells authors to slim the destination instead of keeping scaffolding (`architect:.agents/skills/architect-sessions/references/ephemeral-spec-deletion.md:73-99,101-129`).
- Generated regions are byte-deterministic and CI-gated (`architect:packages/architect-projection/src/renderers/managed-region.ts:20-38`; `architect:.github/workflows/ci.yml:30-33`).

### 3.6 What gen-1 did worse

- It destroys the design Spec at realization, contrary to enrich-in-place: information survives only if a manual transfer is complete (`architect:formal-spec/08-spec-evolution.md:364-386`).
- It carries lifecycle state in authored tags whose warning-class protections are not strict on the normal commit path (`architect:packages/architect-guard/src/lint/process-guard/decider.ts:130-172,180-209,280-317`; `architect:package.json:45-48`).
- Its taxonomy needed a 50→~26 correction and still exposes 26/32/“50+” drift across current documents (`architect:formal-spec/REVIEW-2026-05-17-FINDINGS.md:62-71`; `architect:docs-live/TAXONOMY.md:8-17`; `architect:formal-spec/README.md:77-88`).
- Its own review found nonexistent Pattern Graph fields and a fictional three-tool Live Documentation API (`architect:formal-spec/REVIEW-2026-05-17-FINDINGS.md:73-95`).

Gen-1 is evidence **against fusing authored lifecycle status into the spec artifact**. It is not evidence against a unified stakeholder-readable executable surface.

---

## 4. The current landed design

### 4.1 The concrete path

The valid-cart example has three per-example artifacts and one parent-scoped oracle:

| Artifact | Role | Evidence |
|---|---|---|
| native example Spec | intent and one concrete GWT point | `examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md:1-29` |
| generated step contract | typed step union, params, and authored values | `examples/checkout-v1/generated/contracts/orders.create-order.valid-cart.contract.ts:1-36` |
| anchored test | enabled-verifier binding, world, product call, assertions | `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:1-64` |
| parent oracle | typed expected outcome over the example space | `examples/checkout-v1/test/orders/create-order.oracle.ts:1-39` |

Contracts are pure projections of the extracted graph, never evaluated Spec modules (`src/codegen/contracts.ts:10-32`). The runner maps contract steps to handlers in contract order and prefixes failures with the Spec’s own words (`src/runner/index.ts:100-140`). The Vitest adapter alone owns the fresh-world lifecycle (`src/adapters/vitest.ts:25-38`).

### 4.2 Carrier and binding rulings

The carrier ruling gives each ID one canonical surface and defaults Specs to Markdown (`specs/decisions/carrier-ruling.sdp.md:14-18`); the later Pack ruling completes Markdown coverage for Packs (`specs/decisions/pack-markdown-carrier.sdp.md:14-20`). The MD-18 decision Spec itself does not mention Gherkin. The declined-contender statement lives in the concept document:

> “`.feature`-style files with graph-aware tags (`@spec.orders.create-order`, `@readiness.defined`) as an equal-canonicity surface for behaviour specs, for teams that prefer BDD. The carrier competition is ruled (the carrier ruling, MD-18): the Markdown carrier won for all eight kinds, and this surface was a contender the ruling declined. Any richer surface that ever arrives executes through the generated contracts above: **the machinery is carrier-independent by construction.**” (`docs/concept/04-authoring-and-binding.md:151-153`)

The current verifier location is load-bearing for claim separation. Anchors are one-way code→Spec bindings, distinct from declared relations (`docs/concept/04-authoring-and-binding.md:95-108`). The `specTest` shape is identity plus `verifies`, never an executing callback (`src/model/anchors.ts:21-29`). `has-verifier` requires a resolving anchored `verifies`, or a declared relation from an example that is itself anchor-enabled (`src/graph/delivery-facts.ts:9-23,35-69`). An enabled verifier means a resolvable test anchor; runner execution and pass state remain outside the graph (`specs/model/spec-sections.sdp.md:23-26`). Authored `verification.mode` states posture, not realization (`specs/decisions/verification-posture-not-realization.sdp.md:14-19`).

Therefore “put executable code inside a Spec and infer verification from its presence” is not a lawful shortcut. Any unification must retain a code-side performing trace that can earn the anchored claim.

### 4.3 Concreteness and loud degradation

A concrete example must bind every slot in every used step; unused vocabulary binds nothing (`src/validate/readiness-floor.ts:213-233`). The `defined` floor requires a structured GWT entry, full bindings, and parent-vocabulary compatibility (`src/validate/readiness-floor.ts:336-351`). Codegen mirrors that law and withholds contracts for incomplete points (`src/codegen/contracts.ts:554-577`). It names slot-level incompatibilities and withholds the entire generated tree on case-colliding output paths rather than emitting partial truth (`src/codegen/contracts.ts:21-54,896-930`). Any derived-test option must preserve those refusal boundaries.

---

## 5. Adjudication

### 5.1 The thesis question has two honest readings

**Reading A — one format for authored intent.** Under this reading, `.sdp.md` is the canonical Spec carrier; `.test.ts` is ordinary code-side evidence bound by an anchor. The thesis is intact. Every design generation kept executing behavior outside the intent carrier: v0 Gherkin used step definitions, gen-1 fused Gherkin used step definitions, and current Markdown uses handlers (`docs/lineage/v0-design/04-authoring-surfaces.md:512-550`; `architect:formal-spec/08-spec-evolution.md:352-362`; `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:30-64`).

**Reading B — one language spanning intent through code.** Under this stronger reading, the current ergonomics underperform the bet. Authors write the GWT text once, then see the same six keys plus parameter threading in the test; they also author an oracle whose `expected()` is not called by the current valid-cart test, while Then handlers encode the expected total and line preservation separately (`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:30-64`; `examples/checkout-v1/test/orders/create-order.oracle.ts:18-38`). The split is lawful but noisier than necessary.

v0 Gherkin does not settle Reading B. It moved stakeholder readability into `.feature`, but retained separate step-definition code (`docs/lineage/v0-design/04-authoring-surfaces.md:512-550`). It relocated repetition; it did not eliminate the performing artifact.

### 5.2 The useful gen-1 lessons

Import the ergonomics, not the lifecycle model:

- keep invariant and named verifying scenarios visible together (`architect:tests/features/cli/generate-docs.feature:18-33`);
- make transitional authoring furniture self-dropping, with explicit transfer criteria (`architect:.agents/skills/architect-sessions/references/ephemeral-spec-deletion.md:101-129`);
- byte-lock generated regions or, preferably, whole generated files (`architect:packages/architect-projection/src/renderers/managed-region.ts:20-38`).

### 5.3 The rejected gen-1 lessons

Do not import Spec deletion, authored completion status, or a parallel tag registry. Deletion is manual and can lose intent at the exact moment implementation should enrich the same primitive (`architect:formal-spec/08-spec-evolution.md:364-386`). The ordinary guard path does not strictly wall warning-class status drift (`architect:package.json:45-48`). The registry’s own 50→~26 correction and residual README drift demonstrate the maintenance burden (`architect:formal-spec/REVIEW-2026-05-17-FINDINGS.md:62-71`; `architect:formal-spec/README.md:77-88`).

### 5.4 Ergonomics audit

The percentages are a lexical maintenance audit, not runtime-cost measurements.

| Current artifact | Mechanical / derivable | Genuinely authored | Consequence |
|---|---:|---:|---|
| 64-line valid-cart test | about 35–40%: protocol imports, `specTest`, `bindExample` wrapper, six contract-pinned keys, `params.*` threading (`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:1-6,10-23,30-64`) | about 60–65%: World state, fixtures/data construction, product call, actual-result observation and domain assertions (`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:7-8,24-63`) | The separate file is partly load-bearing and partly generated structure. |
| 36-line step contract | 100% generated (`examples/checkout-v1/generated/contracts/orders.create-order.valid-cart.contract.ts:1-36`) | 0% | Keep it derived and disposable. |
| 39-line parent oracle | about 15 lines of imports/anchor/wiring (`examples/checkout-v1/test/orders/create-order.oracle.ts:1-21`) | about 20 lines of `expected()` domain semantics (`examples/checkout-v1/test/orders/create-order.oracle.ts:22-38`) | Parent-scoped semantics are a legitimate authored floor. |

The load-bearing split is: an anchored performing trace for `has-verifier`; static extractability; framework-neutral planning/execution; authored world construction, product invocation, actual-outcome observation, and the oracle’s expected semantics (`src/graph/delivery-facts.ts:9-23`; `src/runner/index.ts:100-140`; `examples/checkout-v1/test/orders/create-order.oracle.ts:18-38`). The incidental split is imports, wrapper registration, literal handler-key mapping, parameter dispatch, and duplicated expected-outcome comparison.

The honest question is not “Spec file or test file?” It is **“which verifier structure is graph-derivable, and where does the irreducible code-side semantics live?”**

---

## 6. Options for a unified format

### O1 — Status quo; confirm MD-18

Keep the Spec, generated contract, anchored test, and parent oracle unchanged. Claim taxonomy and extraction remain stable. Cost is continued repetition: the current test repeats all six contract keys and does not consume the parent oracle’s expected outcome (`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:30-64`; `examples/checkout-v1/test/orders/create-order.oracle.ts:22-38`). This fully satisfies Reading A and leaves Reading B unanswered.

### O2 — Gherkin-like equal-canonicity over generated contracts

Reopen only the behavior/example portion of the carrier ruling. A `.feature`-like surface becomes a lawful per-ID canonical carrier, extracts into the same graph, and executes through the existing generated contracts. v0 supplies the blueprint: equal canonicity, one canonical surface per ID, and generated projection of the alternate form (`docs/lineage/v0-design/04-authoring-surfaces.md:439-570`).

The anchored performing artifact remains; step definitions or handler modules do not disappear. Claim taxonomy is unchanged. Costs: a second parser/extractor pipeline, fidelity rules, source locations, refusal semantics, formatting, and tag/ID lint. v0 already needed `akg lint` because tags were strings (`docs/lineage/v0-design/04-authoring-surfaces.md:572-587`). Gen-1’s taxonomy drift warns against an independent registry (`architect:formal-spec/REVIEW-2026-05-17-FINDINGS.md:62-71`; `architect:docs-live/TAXONOMY.md:8-17`). Mitigation: every richer token maps onto the existing ruled envelope/section vocabulary; no new lifecycle tags.

Effect on the bet: strongest gain in stakeholder-readable BDD authoring, modest gain in unification, no reduction in the irreducible code artifact.

### O3 — Derive the runnable test body; shrink authorship toward semantics

Keep `.sdp.md` as the only default carrier. Extend codegen so each bindable example emits a runnable adapter module that owns:

- contract import and test registration;
- the literal step-text → callback mapping;
- parameter dispatch and world lifecycle;
- expected-vs-actual Outcome comparison using the parent oracle’s `expected()`;
- failure rendering in the Spec’s language.

The authored code-side module retains the binding-only `specTest` anchor and exports only irreducible semantics: world creation, fixture/data setup, product invocation, actual-outcome observation, and any domain assertion not expressible by the parent Outcome union. The parent oracle remains authored. Generated code maps these callbacks to step text, so authors no longer repeat literal handler keys. If an actual-outcome adapter is required, it is explicit authored semantics beside the handlers; codegen must never invent it.

Claim taxonomy is unchanged: the code-side `specTest` anchor still confers `has-verifier`, and generated execution still says nothing about pass state (`src/model/anchors.ts:21-29`; `src/graph/delivery-facts.ts:9-23`). The extractor need not learn a second carrier; codegen and adapter contracts grow. Existing L2/L3 refusal rules apply: no generated runnable module for an unbindable example, incompatible vocabulary, unresolved handler binding, or colliding path (`src/codegen/contracts.ts:21-54,554-577,896-930`).

Effect on the bet: removes the measured mechanical 35–40% and the oracle↔Then expected-outcome re-encoding while preserving the genuinely authored ~60% as code. No MD-18 reopen.

### O4 — Harness/projection path

Realize the already-named harness as graph + generated-space projection + one anchored oracle. Dials come from example-space dimensions; presets come from bound example children; the oracle supplies expected outcomes (`docs/concept/04-authoring-and-binding.md:145-157`). This can make one stakeholder-readable surface both explanatory and executable-looking.

It cannot invent fixtures, world construction, product invocation, or actual-outcome observation. Those semantics still need a code-side home. Therefore O4 composes with O3 — the projection drives derived runnable modules — rather than replacing it. Claim taxonomy remains anchored; projection presence alone cannot confer `has-verifier` (`specs/model/spec-sections.sdp.md:23-26`).

### O5 — Engine-executed examples

Remove per-example test modules. Introduce engine-side execution that resolves each example to anchored handler/world modules through the graph, composes the run, and reports results. This is the strongest Reading-B answer.

It is also the highest-cost option. The engine crosses a new trust boundary by loading and executing adopter code. World setup becomes a first-class anchored artifact. The enabled-verifier definition and `has-verifier` derivation must be re-specified because today they require a test anchor (`specs/model/spec-sections.sdp.md:23-26`; `src/graph/delivery-facts.ts:9-23,35-69`). Runner adapters, failure rendering, isolation, module loading, and framework integration move into the engine. R3 survives only if handler/world anchors remain binding-only and executing bodies stay beside them, never inside graph metadata (`src/model/anchors.ts:21-35`).

Effect on the bet: maximal file-count fusion, but at a disproportionate machinery and security cost.

### O6 — Gen-1-style fusion of status, spec, and test

Put intent, lifecycle status, and scenarios in one `.feature`, then execute with step definitions. Reject this package of choices. Its readable fusion is useful; its value-transfer deletion, status drift, and registry burden are not (`architect:formal-spec/08-spec-evolution.md:364-401`; `architect:packages/architect-guard/src/lint/process-guard/decider.ts:130-172`; `architect:formal-spec/REVIEW-2026-05-17-FINDINGS.md:62-95`). Import only the `Verified by` join and deterministic-generation lessons into O2/O3.

### Cost matrix

| Option | Claim taxonomy | Extractor / codegen | Honesty checks | v0 evidence | gen-1 evidence | Effect on the bet |
|---|---|---|---|---|---|---|
| O1 status quo | unchanged; anchored test earns `has-verifier` | none | none | matches separate step definitions | keeps separate step definitions | Reading A satisfied; Reading B cost remains |
| O2 equal-canonicity Gherkin | unchanged; code-side anchor remains | second carrier parser, fidelity and locations | tag/ID lint plus carrier parity/refusals | direct blueprint (`docs/lineage/v0-design/04-authoring-surfaces.md:439-587`) | readable fusion works; registry drift warns | better BDD surface, no code-artifact removal |
| O3 derived test body | unchanged; anchor stays in authored handler module | extend contracts/codegen and adapter emission | reuse concreteness/refusal laws; add handler-resolution checks | “what stays in code” supports the split (`docs/lineage/v0-design/04-authoring-surfaces.md:729-747`) | imports fusion ergonomics without lifecycle tags | removes derivable repetition; preserves authored semantics |
| O4 harness projection | unchanged; projection confers nothing | projection over space contracts; likely O3 runtime | refuse absent world/actual adapters | v0 says harness is not a runner (`docs/lineage/v0-design/04-authoring-surfaces.md:652-655`) | stakeholder readability supports it | strong review surface, incomplete execution answer alone |
| O5 engine execution | re-specify enabled verifier while preserving anchored claims | engine module loading/execution and world anchors | new trust/isolation/liveness boundaries | no self-executing precedent | step modules prove separate code still needed | strongest fusion, highest machinery/security cost |
| O6 gen-1 fusion | risks authored status contaminating delivery facts | second carrier plus step-def pipeline | ProcessGuard-like lifecycle policing | contradicts marker/intent separation | drift and deletion costs are observed | apparent unity obtained by importing rejected lifecycle coupling |

---

## 7. ADR three-part test and recommendation

| Option | Hard to reverse? | Surprising without context? | Real trade-off? | ADR result |
|---|---|---|---|---|
| O1 | no new choice | no; current rulings explain it | duplication exists but no new boundary is chosen | no new decision; review may record confirmation |
| O2 | yes; a public carrier and parser become permanent | yes; one-ID equal canonicity partially reopens MD-18 | BDD readability vs permanent dual-carrier cost | passes if selected |
| O3 | yes; generated runnable/handler contracts become adopter-facing seams | yes; generated execution still earns facts only through an authored anchor | less repetition vs tighter codegen/adapter coupling | **passes** |
| O4 | not independently yet | no; already named aspirationally | no complete execution design without O3/world semantics | defer as a composition, not a standalone ruling |
| O5 | yes; engine trust and execution boundaries are architectural | yes; the Spec engine would execute adopter code | maximal fusion vs security, isolation, and framework cost | passes, but evidence rejects it now |
| O6 | yes; carrier, lifecycle, and deletion doctrine become pervasive | yes | readability vs drift/destructive transfer | passes as a choice, rejected on production evidence |

### Recommendation: O3

1. **It attacks the measured problem.** O1 leaves the mechanical 35–40% and oracle/Then duplication; O2 improves readability but still needs step code; O3 removes the derivable structure (`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts:1-64`; `examples/checkout-v1/test/orders/create-order.oracle.ts:18-38`).
2. **It preserves the load-bearing boundary.** The authored `specTest` remains a binding-only code-side trace, so `has-verifier` and the declared/anchored claim distinction do not change (`src/model/anchors.ts:21-29`; `src/graph/delivery-facts.ts:9-23`).
3. **It preserves carrier simplicity.** No MD-18 reopen and no second parser/tag vocabulary (`specs/decisions/carrier-ruling.sdp.md:14-18`).
4. **It keeps irreducible semantics honest.** World construction, product calls, actual-outcome observation, and `expected()` remain authored code. Generation refuses rather than guessing (`src/codegen/contracts.ts:21-54,554-577`).
5. **It leaves O4 available.** A later harness can project the same space and drive the same generated runnable modules without becoming a second truth source (`docs/concept/04-authoring-and-binding.md:145-157`).

The follow-on design must prove one concrete cut: generated valid-cart runnable module + minimal authored handler module + existing oracle, with mutation evidence that changing the Spec’s total or the oracle’s result reddens the generated test. It must also state the actual-outcome adapter contract explicitly; silently deriving domain observation is forbidden.

### Owner outcome: O2

At the required checkpoint the owner selected O2 rather than the review recommendation. The resulting ruling keeps Markdown as the default, admits Gherkin only for behavior and example IDs, preserves one canonical surface per ID, and leaves execution plus `has-verifier` behind generated contracts and anchored code-side handlers. The Gherkin carrier option (MD-27) carries the durable decision; the follow-on build plan owns realization.

---

## 8. Appendix — corrections to plan 27’s premises

1. `570996c` renamed `docs/concept/ubiquitous-language.md` to root `CONTEXT.md`; it did not delete the vocabulary. `docs/concept/GLOSSARY.md` was a post-reboot intermediate removed when the ubiquitous-language document replaced it. Neither was restored; root `CONTEXT.md` is the live vocabulary and the v0 set carries its own historical words.
2. The v0 set contains ten documents, not nine: `README.md` carries the product framing and slogan (`docs/lineage/v0-design/README.md:7-19,54-62`). It was restored with the other nine.
3. Gate compliance uses a named `docs/lineage/` exclusion in `check-temporal.mjs`; `docs/**` was already outside Prettier’s formatting scope. Scrubbing temporal tokens would have broken the required byte identity.
4. R3 has no row in `docs/concept/DECISIONS.md`. Its live carriers are the test-binding section and `SpecTestAnchor` (`docs/concept/04-authoring-and-binding.md:103-108`; `src/model/anchors.ts:21-29`). This registry gap is separate drift and was not repaired in this review.
5. Every restored v0 citation includes the six-line lineage-header offset; citations above use restored-file line numbers.
