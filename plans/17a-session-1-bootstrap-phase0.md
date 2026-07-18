# Session 1 — Bootstrap + Phase 0 First Code

## TL;DR
> **Summary**: Bootstrap the docs-only repo into the first executable `@libar-dev/software-delivery-protocol` TypeScript package, then implement the Phase 0 typed protocol foundation, authored-layer-only validator runtime, minimal `sdp` CLI stub, and `examples/checkout-v1` tracer bullet.
> **Deliverables**:
> - npm/ESM/strict TypeScript package with build, lint, format, test, CI, and CLI entrypoint
> - Domain-agnostic protocol model in `src/` for `Spec`, descriptors, sections, relations, `Pack`, anchors, graph schema, validation contracts, readiness-floor data, and tiny authored-layer validators
> - Valid `examples/checkout-v1` authored model importing only from `@libar-dev/software-delivery-protocol`
> - TDD validator tests for duplicate IDs, dangling relations, readiness-floor violations, and valid example pass
> **Effort**: Large
> **Parallel**: LIMITED - 7 waves after bootstrap
> **Critical Path**: Task 1 → Task 2 → Task 3 → Tasks 4-5 → Task 6 → Task 7 → Task 9 → Final Verification

## Context

### Original Request
Plan implementation of the very first lines of code in this repo, using `plans/01-session-1-bootstrap-phase0.md` as the prepared pre-plan. `AGENTS.md`, `docs/concept/ubiquitous-language.md`, `docs/concept/`, and `jtbd-stories/` are required context.

### Interview Summary
- User selected **TDD for validators**.
- User selected **contracts + tiny validators** for Session 1, overriding the pre-plan's stricter “contracts/data only” wording while preserving the no-extractor/no-graph-gate boundary.
- Tiny validators are pure functions over in-memory authored-layer objects only: duplicate IDs, dangling authored references, single-spec readiness-floor violations, and valid example pass.

### Metis Review (gaps addressed)
- Locked CLI behavior to help/build/validate stubs only; no file walking.
- Locked package scripts and public exports.
- Locked invalid fixtures to tests only; `examples/checkout-v1` remains valid.
- Added explicit relation directionality.
- Added exact negative validator fixtures and no-extractor acceptance checks.
- Incorporated follow-up review: Session 1 validators are explicitly authored-layer checks, not the Slice 3 graph gate; Vitest resolves the package alias at runtime; example has an explicit `checkoutV1Model` aggregator; example relations must resolve internally; `@ts-expect-error` fixtures are included in typecheck; tsup has separate index/CLI entries and CLI shebang; readiness-floor runtime is trimmed to single-spec structural checks.

## Work Objectives

### Core Objective
Create the first implementation foundation for the Libar Software Delivery Protocol: a buildable, strict TypeScript package whose public DSL is usable enough for the Order Management checkout tracer bullet to author against and typecheck.

### Deliverables
- Root toolchain files: `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.examples.json`, `tsup.config.ts`, `vitest.config.ts`, `eslint.config.js`, Prettier config, `.github/workflows/ci.yml`, updated `.gitignore`.
- Source package under `src/`:
  - `src/index.ts`
  - `src/ids.ts`
  - `src/model/descriptors.ts`
  - `src/model/sections.ts`
  - `src/model/spec.ts`
  - `src/model/pack.ts`
  - `src/model/relations.ts`
  - `src/model/anchors.ts`
  - `src/graph/schema.ts`
  - `src/validate/contracts.ts`
  - `src/validate/readiness-floor.ts`
  - `src/validate/authored-model.ts`
  - `src/validate/validators.ts`
  - `src/cli/sdp.ts`
- Tests under `test/**/*.test.ts` and `test/**/*.typecheck.ts` for IDs, builders, validators, compile-time guardrails, and CLI stub behavior.
- Example under `examples/checkout-v1/` with valid specs, anchored code, and spec-linked test.
- Example aggregator `examples/checkout-v1/model.ts` exporting `checkoutV1Model: AuthoredModel`.

### Definition of Done (verifiable conditions with commands)
- `npm install` creates `package-lock.json` and installs dependencies without engine warnings on Node >=20.
- `npm run typecheck` exits 0.
- `tsc --noEmit -p tsconfig.examples.json` exits 0 and proves the example imports from `@libar-dev/software-delivery-protocol` via the public barrel.
- `npm test` exits 0 with duplicate ID, dangling authored relation, single-spec readiness-floor violation, builders, IDs, CLI stub, and valid example validator tests passing.
- `npm run lint` exits 0.
- `npm run format:check` exits 0.
- `npm run build` exits 0 and emits ESM JS plus `.d.ts` under `dist/`.
- `node dist/cli/sdp.js --help` exits 0 and prints the exact minimal usage text defined in Task 8.
- No `ts-morph`, no `graph.json`, no source-reading implementation, no generated graph output, no reader/view/Design Review files.

### Must Have
- TypeScript strictness: `strict`, `isolatedModules`, `noUncheckedIndexedAccess`, ES2022, ESM, `moduleResolution: "bundler"`.
- Public barrel exports everything the example needs; example must not import `../../src`.
- Core `src/` must remain domain-agnostic; all Order Management/checkout names live only under `examples/checkout-v1/` or test fixtures.
- Relation direction is fixed:
  - `refines`: child → parent
  - `dependsOn`: dependent → dependency
  - `constrainedBy`: bounded spec → constraint spec
  - `decidedBy`: shaped spec → decision spec
  - `verifies`: verifier/example/test → target spec
  - `supersedes`: new decision → old decision
- `claim` values are exactly `declared`, `anchored`, `inferred`.
- Delivery facts (`implemented`, `has-verifier`, `observed`) are typed as derived graph facts only and cannot be authored in `Spec`, `Pack`, anchor, or example fixtures.
- `AuthoredModel` is a concrete TypeScript DTO for Session 1 authored-layer checks; it is not a second graph/store, not persisted, and not the Slice 3 graph validation gate.
- Session 1 readiness-floor validator checks only single-spec structural floors. Graph-level/cross-spec floor clauses are represented as deferred metadata, not enforced until extractor/graph validation exists.

### Must NOT Have
- No `ts-morph`, source scanning, filesystem traversal, extractor, or graph emission.
- No `graph.json`, graph database, generated projections, reader, agent surface, Design Review, or `--check-clean`.
- No self-hosting claim: this repo's own authored model is not being built yet.
- No Gherkin/harnesses, runtime observation, patch-loop editing, rich exports, or MCP surface.
- No conditional-type completeness machinery for readiness floors; types describe shape, validators check completeness.
- No CLI validation/build behavior beyond stub messages.
- No graph-level validator claims from `validateAuthoredModel`; it is an authored-layer pre-graph seam only.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: **TDD for validators** with Vitest. Write failing tests first for duplicate IDs, dangling authored refs, single-spec readiness-floor violations, and valid checkout model pass.
- QA policy: Every task has agent-executed command/file-inspection scenarios.
- Evidence: save command logs or summaries to `.sisyphus/evidence/task-{N}-{slug}.txt`.

## Execution Strategy

### Parallel Execution Waves
Wave 1: Task 1 (root bootstrap; shared dependency)
Wave 2: Task 2 (IDs + public barrel foundation)
Wave 3: Task 3 (descriptors + sections)
Wave 4: Tasks 4 and 5 (builders and graph schema contracts)
Wave 5: Tasks 6 and 8 (validation contracts/authored-layer seam and CLI stub)
Wave 6: Task 7 (tiny authored-layer validators by TDD)
Wave 7: Task 9 (checkout example + integration)
Wave 8: Final Verification Wave

### Dependency Matrix (full, all tasks)
| Task | Blocks | Blocked By |
|---|---|---|
| 1. Bootstrap package/toolchain | 2,3,4,5,6,7,8,9 | none |
| 2. IDs + public barrel foundation | 3,4,5,6,7,9 | 1 |
| 3. Descriptors + sections | 4,5,7,9 | 1,2 |
| 4. Spec/Pack/relations/anchors builders | 6,7,9 | 1,2,3 |
| 5. Graph schema contracts | 7 | 1,2,3 |
| 6. Validation contracts + authored model seam | 7,9 | 1,2,4,5 |
| 7. Tiny authored-layer validators by TDD | 9 | 1,2,3,4,5,6 |
| 8. Minimal CLI stub | 9 | 1,2 |
| 9. Checkout-v1 tracer bullet | Final verification | 1-8 |

### Agent Dispatch Summary
| Wave | Task Count | Categories |
|---|---:|---|
| 1 | 1 | quick |
| 2 | 1 | quick |
| 3 | 1 | quick |
| 4 | 2 | deep, quick |
| 5 | 2 | deep, quick |
| 6 | 1 | deep |
| 7 | 1 | deep |
| 8 | 4 review agents | oracle, unspecified-high, unspecified-high, deep |

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Bootstrap package, TypeScript toolchain, scripts, ignore rules, and CI

  **What to do**:
  - Create `package.json` with:
    - `name: "@libar-dev/software-delivery-protocol"`
    - `type: "module"`
    - `bin: { "sdp": "./dist/cli/sdp.js" }`
    - `exports` for `.` with `types: "./dist/index.d.ts"` and `import: "./dist/index.js"`
    - `engines.node: ">=20"`
    - scripts: `build`, `typecheck`, `typecheck:examples`, `test`, `test:watch`, `lint`, `format`, `format:check`, `check`
  - Use these script commands exactly:
    - `build`: `tsup`
    - `typecheck`: `tsc --noEmit -p tsconfig.json`
    - `typecheck:examples`: `tsc --noEmit -p tsconfig.examples.json`
    - `test`: `vitest --run`
    - `test:watch`: `vitest`
    - `lint`: `eslint .`
    - `format`: `prettier --write .`
    - `format:check`: `prettier --check .`
    - `check`: `npm run typecheck && npm run typecheck:examples && npm run lint && npm run format:check && npm test && npm run build`
  - Install runtime/dev dependencies needed for strict TS, Vitest, tsup, ESLint flat config, Prettier, and TypeScript ESLint.
  - Create `tsconfig.json`, `tsconfig.examples.json`, `tsup.config.ts`, `vitest.config.ts`, `eslint.config.js`, `.prettierrc.json`, and `.github/workflows/ci.yml`.
  - `tsconfig.json` must include `src/**/*.ts` and `test/**/*.ts` so `@ts-expect-error` type fixtures are checked by `npm run typecheck`; it must exclude `dist`, `generated`, and `examples`.
  - `tsconfig.examples.json` must map `@libar-dev/software-delivery-protocol` → `src/index.ts` and include `examples/**/*.ts`.
  - `vitest.config.ts` must also resolve `@libar-dev/software-delivery-protocol` → `src/index.ts` at runtime, either with an explicit `resolve.alias` or an installed/configured `vite-tsconfig-paths` plugin. Prefer explicit alias to avoid another moving part.
  - `tsup.config.ts` must have exactly two entries, `src/index.ts` and `src/cli/sdp.ts`, emit ESM and `.d.ts`, and add `#!/usr/bin/env node` as the CLI output shebang banner.
  - Update `.gitignore` to include `node_modules/`, `dist/`, `generated/`, `.sisyphus/evidence/`, and keep existing `plans/` ignore.
  - CI must run: `npm ci`, `npm run typecheck`, `npm run typecheck:examples`, `npm run lint`, `npm run format:check`, `npm test`, `npm run build`.

  **Must NOT do**:
  - Do not add source-reading dependencies (`ts-morph`) or graph/database dependencies.
  - Do not add pre-commit hooks unless separately requested.

  **Recommended Agent Profile**:
  - Category: `quick` - Root project bootstrap with exact file list.
  - Skills: [] - No specialized skill required.
  - Omitted: [`setup-pre-commit`] - Pre-commit hooks are not in scope.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2,3,4,5,6,7,8,9 | Blocked By: none

  **References**:
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:34-79` - locked toolchain, package, config, CI, and done gates.
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:148-159` - suggested commit/file ordering.
  - Guardrail: `AGENTS.md:72-78` - Session 1 stops before extractor and proves public DSL via example typecheck.

  **Acceptance Criteria**:
  - [ ] `npm install` exits 0 and creates `package-lock.json`.
  - [ ] `npm run typecheck` exits 0 after source scaffolds exist.
  - [ ] `npm run lint` exits 0.
  - [ ] `npm run format:check` exits 0.
  - [ ] `.github/workflows/ci.yml` contains the exact CI sequence listed above.
  - [ ] `vitest.config.ts` contains a runtime alias for `@libar-dev/software-delivery-protocol` to `src/index.ts`.
  - [ ] `tsup.config.ts` contains two entries (`src/index.ts`, `src/cli/sdp.ts`) and a CLI shebang banner.

  **QA Scenarios**:
  ```
  Scenario: Bootstrap commands are available
    Tool: Bash
    Steps: run `npm install`, then `npm run lint`, `npm run format:check`
    Expected: all commands exit 0; package-lock exists
    Evidence: .sisyphus/evidence/task-1-bootstrap.txt

  Scenario: Runtime alias and CLI build config exist
    Tool: Read
    Steps: inspect `vitest.config.ts` and `tsup.config.ts`
    Expected: Vitest resolves package name to `src/index.ts`; tsup has two entries and CLI shebang banner
    Evidence: .sisyphus/evidence/task-1-bootstrap-runtime-alias.txt

  Scenario: Forbidden dependency is absent
    Tool: Bash
    Steps: run `npm ls ts-morph --depth=0`
    Expected: command exits non-zero or reports empty; `package.json` has no `ts-morph`
    Evidence: .sisyphus/evidence/task-1-bootstrap-forbidden-deps.txt
  ```

  **Commit**: NO | Message: `chore: bootstrap package toolchain` | Files: root config files and `.github/workflows/ci.yml`

- [x] 2. Implement stable ID primitives and the initial public barrel

  **What to do**:
  - Create `src/ids.ts` with branded string types for `SpecId`, `PackId`, `AnchorId`, `ImplAnchorId`, and `TestAnchorId` where useful.
  - Implement pure parse/format helpers for IDs using grammar `<namespace>:<dotted.path>` with optional `#<sub>` suffix.
  - ID parser validates grammar and lowercase namespace shape only. Branded helpers validate their own required namespace (`spec:`, `pack:`, `impl:`, `test:`). Broader known-namespace enforcement (`api:`, `component:`, `doc:`) is deferred to later validators/graph schema use.
  - Required valid examples: `spec:orders.create-order`, `spec:orders.create-order#valid-cart`, `pack:checkout-v1`, `impl:orders.create-order-use-case`, `test:orders.create-order.valid-cart`.
  - Required invalid examples: missing namespace, empty path segment, whitespace, uppercase namespace, malformed `#` suffix.
  - Create `src/index.ts` as a public barrel that exports Phase 0 public API only.
  - Public exports after this task: ID types, ID parser/formatter helpers, `ref()`/ID branding helpers.

  **Must NOT do**:
  - Do not make IDs classes with hidden state.
  - Do not validate domain meaning inside IDs; only grammar/branding.

  **Recommended Agent Profile**:
  - Category: `quick` - Focused pure utility module with tests.
  - Skills: []
  - Omitted: [`tdd`] - TDD is mandatory later for validators; ID tests can be tests-after.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 3,4,5,6,7,9 | Blocked By: 1

  **References**:
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:85-89` - `src/index.ts` and `src/ids.ts` purpose.
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:134-135` - ID tests expected.
  - Concept: `docs/concept/02-core-model.md:247-270` - stable IDs are source-of-truth bindings.

  **Acceptance Criteria**:
  - [ ] `npm test -- --run ids` exits 0.
  - [ ] `npm run typecheck` exits 0.
  - [ ] `src/index.ts` exports ID helpers from `src/ids.ts`.

  **QA Scenarios**:
  ```
  Scenario: ID parse/format round trip
    Tool: Bash
    Steps: run `npm test -- --run ids`
    Expected: valid IDs round-trip and branded refs retain original string values
    Evidence: .sisyphus/evidence/task-2-ids.txt

  Scenario: Malformed IDs fail loudly
    Tool: Bash
    Steps: run `npm test -- --run ids`
    Expected: invalid IDs include the rejected input in the Finding/Error assertion
    Evidence: .sisyphus/evidence/task-2-ids-invalid.txt
  ```

  **Commit**: NO | Message: `feat: add stable id primitives` | Files: `src/ids.ts`, `src/index.ts`, ID tests

- [x] 3. Implement descriptor literals, display labels, and optional section types

  **What to do**:
  - Create `src/model/descriptors.ts` with exact literal unions and readonly arrays:
    - `SpecKind = "behavior" | "workflow" | "example" | "rule" | "constraint" | "model" | "decision" | "contract"`
    - `SpecAltitude = "epic" | "feature" | "story"`
    - `SpecReadiness = "idea" | "scoped" | "defined" | "ready"`
  - Include display labels for the 8 `kind` values using the canonical language: Use Case / Behavior, Workflow, Example / Scenario, Business Rule, Constraint (NFR), Domain Model, Decision Record, Contract.
  - Create `src/model/sections.ts` with optional section types: `intent`, `behavior`, `constraints`, `model`, `design`, `decision`, `verification`, `ui`.
  - Ensure `constraints`, `model`, and `decision` sections can coexist with standalone same-kind specs without forcing promotion.

  **Must NOT do**:
  - Do not add `capability`, `NFR`, or `Scenario` as descriptors.
  - Do not require sections based on readiness in TypeScript types.

  **Recommended Agent Profile**:
  - Category: `quick` - Literal type and shape definitions.
  - Skills: []
  - Omitted: []

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 4,7,9 | Blocked By: 1,2

  **References**:
  - Concept: `docs/concept/ubiquitous-language.md:66-105` - descriptors, values, sections.
  - Concept: `docs/concept/ubiquitous-language.md:107-113` - inline vs standalone concern rule.
  - Guardrail: `plans/01-session-1-bootstrap-phase0.md:109-111` - all sections optional; validators decide completeness.

  **Acceptance Criteria**:
  - [ ] `npm run typecheck` exits 0.
  - [ ] Tests assert the descriptor arrays exactly equal the canonical literal sets.
  - [ ] No exported descriptor includes `capability`, `nfr`, or `scenario` as a separate value.

  **QA Scenarios**:
  ```
  Scenario: Descriptor literal sets match canonical terms
    Tool: Bash
    Steps: run `npm test -- --run descriptors`
    Expected: arrays contain exactly 8 kinds, 3 altitudes, 4 readiness values
    Evidence: .sisyphus/evidence/task-3-descriptors.txt

  Scenario: Optional sections remain optional
    Tool: Bash
    Steps: run `npm run typecheck`
    Expected: a minimal `idea` spec fixture typechecks without non-envelope sections
    Evidence: .sisyphus/evidence/task-3-sections-optional.txt
  ```

  **Commit**: NO | Message: `feat: add descriptors and section types` | Files: `src/model/descriptors.ts`, `src/model/sections.ts`, tests

- [x] 4. Implement Spec, Pack, relation, and anchor DSL builders

  **What to do**:
  - Create `src/model/spec.ts` with `Spec` envelope type and `spec()` builder returning a plain serializable object.
  - Create `src/model/pack.ts` with `Pack` and `pack()` builder. Pack fields: `id`, `title`, optional `framing` plain note, `specs`, optional `modelRefs`. Pack states no system truth.
  - Create `src/model/relations.ts` with relation builders: `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, `supersedes`.
  - Relation objects must include `type`, `target`, and `claim: "declared"` for authored spec relations.
  - Direction is source spec containing relation → target ID, with the exact directionality listed in Must Have.
  - Create `src/model/anchors.ts` with identity-only helpers: `anchorImplementation()` and `specTest()`.
  - Anchor helpers may contain IDs, labels, and target `SpecId`; they must not accept `readiness`, sections, delivery facts, or authored relations.
  - Export all public builders through `src/index.ts`.

  **Must NOT do**:
  - Do not create subclasses like `BehaviorSpec`, `ReadySpec`, or `ExecutableSpec`.
  - Do not allow anchors to carry intent.
  - Do not make `Pack` own vocabulary or truth.

  **Recommended Agent Profile**:
  - Category: `deep` - Load-bearing domain model API with directionality guardrails.
  - Skills: []
  - Omitted: []

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 6,7,9 | Blocked By: 1,2,3

  **References**:
  - Concept: `docs/concept/ubiquitous-language.md:119-155` - Pack, anchor, relation definitions.
  - Concept: `docs/concept/ubiquitous-language.md:160-183` - claim taxonomy and anchor identity-only.
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:92-95` - target files and builder names.

  **Acceptance Criteria**:
  - [ ] `npm test -- --run builders` exits 0.
  - [ ] Builder outputs are plain objects with no class instances or methods.
  - [ ] Relation builder tests assert direction and `claim: "declared"`.
  - [ ] Anchor tests assert intent fields are not accepted at compile time using `// @ts-expect-error` fixtures.

  **QA Scenarios**:
  ```
  Scenario: Builders produce serializable authored objects
    Tool: Bash
    Steps: run `npm test -- --run builders`
    Expected: `JSON.stringify` works for Spec, Pack, relation, and anchor fixtures
    Evidence: .sisyphus/evidence/task-4-builders.txt

  Scenario: Anchor intent is rejected
    Tool: Bash
    Steps: run `npm run typecheck`
    Expected: `@ts-expect-error` fixtures for anchor `readiness`/delivery facts are consumed by compiler
    Evidence: .sisyphus/evidence/task-4-anchor-intent-rejected.txt
  ```

  **Commit**: NO | Message: `feat: add spec pack relation anchor builders` | Files: `src/model/*.ts`, tests

- [x] 5. Define graph schema types without implementing extraction

  **What to do**:
  - Create `src/graph/schema.ts` with `schemaVersion: "0.1.0"`.
  - Define graph node union types for at least: `Primitive`, `Pack`, `Anchor`, `CodeNode`.
  - Define `GraphEdge` with `from`, `type`, `to`, and `claim`.
  - Define delivery fact names exactly: `implemented`, `has-verifier`, `observed`.
  - Define derived edge type names at least `belongsTo` and `satisfies`; keep authored relation names available for graph edges.
  - Export schema types through `src/index.ts`.

  **Must NOT do**:
  - Do not implement graph construction, graph writing, or graph reading.
  - Do not create `generated/graph.json`.

  **Recommended Agent Profile**:
  - Category: `quick` - Pure type boundary.
  - Skills: []
  - Omitted: []

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 6,7 | Blocked By: 1,2,3

  **References**:
  - Concept: `docs/concept/ubiquitous-language.md:218-239` - one graph as flat node/edge read model.
  - Concept: `docs/concept/03-the-one-graph.md:11-63` - graph derivation and no second store.
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:96-107` - graph schema ships now, inert.

  **Acceptance Criteria**:
  - [ ] `npm run typecheck` exits 0.
  - [ ] No source file imports `fs`, `path`, `ts-morph`, or writes graph artifacts.
  - [ ] Delivery facts are represented only in graph schema types, not as authored model fields.

  **QA Scenarios**:
  ```
  Scenario: Graph schema typecheck
    Tool: Bash
    Steps: run `npm run typecheck`
    Expected: graph schema exports compile without requiring extractor code
    Evidence: .sisyphus/evidence/task-5-graph-schema.txt

  Scenario: No graph emission exists
    Tool: Bash
    Steps: run `test ! -f graph.json && test ! -f generated/graph.json`
    Expected: command exits 0
    Evidence: .sisyphus/evidence/task-5-no-graph-json.txt
  ```

  **Commit**: NO | Message: `feat: add graph schema contracts` | Files: `src/graph/schema.ts`, `src/index.ts`

- [x] 6. Define validation contracts, authored model seam, and readiness-floor data

  **What to do**:
  - Create `src/validate/contracts.ts` with `Validator`, `ValidatorFamily = "conformance" | "honesty"`, `Severity`, `Finding`, and `ValidationReport`.
  - Findings must include stable fields: `validatorId`, `family`, `severity`, `message`, and optional `subjectId`, `relatedId`, `path`.
  - Create `src/validate/authored-model.ts` with `AuthoredModel` as in-memory collections of `specs`, `packs`, and `anchors`; no filesystem or source-reading fields.
  - Include a comment/docstring on `AuthoredModel`: “Session 1 authored-layer DTO for pre-graph checks; not persisted, not a graph, and not the Slice 3 validation gate.”
  - Create `src/validate/readiness-floor.ts` with data for the canonical floors:
    - `idea`: id, title, kind, altitude, and `intent.outcome` or parent relation.
    - `scoped`: `intent.outcome`, at least one relation, and one of `behavior.rules` / `behavior.examples` / `constraints`.
    - `defined`: rules and/or examples; constraints have machine-readable `target`; no blocking open questions.
    - `ready`: defined floor; no blocking open questions; all relations resolve; every `dependsOn`/`refines` target is at least `defined`; any anchors present resolve.
    - kind-aware overlays: `constraint` needs parseable machine-readable `target` before `defined`+; `example` needs structured `given`/`when`/`then` before `defined`+; `model` needs term definitions.
  - Mark cross-spec/graph-shaped `ready` clauses as `deferredInSession1: true` in the readiness-floor data: “all relations resolve,” “every `dependsOn`/`refines` target is at least `defined`,” and “anchors present resolve.” Session 1 may test dangling authored refs separately, but must not implement target-readiness or anchor-resolution floor logic.
  - Export validation contracts and readiness data through `src/index.ts`.

  **Must NOT do**:
  - Do not implement source extraction or CI graph gate here.
  - Do not make readiness floors configurable yet.

  **Recommended Agent Profile**:
  - Category: `deep` - Validation seam affects future extractor and CI.
  - Skills: []
  - Omitted: []

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 7,9 | Blocked By: 1,2,4,5

  **References**:
  - Concept: `docs/concept/05-validation-and-honesty.md:68-85` - exact readiness floors and kind overlays.
  - Concept: `docs/concept/05-validation-and-honesty.md:61-64` - ambiguity fails and partial failure stays local.
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:98-107` - validation contracts and readiness data target files.

  **Acceptance Criteria**:
  - [ ] `npm run typecheck` exits 0.
  - [ ] Readiness-floor data contains all four readiness rungs and three kind overlays.
  - [ ] Readiness-floor data marks graph-level/cross-spec `ready` clauses as deferred for Session 1.
  - [ ] `AuthoredModel` has no path/filesystem/extractor fields.

  **QA Scenarios**:
  ```
  Scenario: Readiness-floor data is complete
    Tool: Bash
    Steps: run `npm test -- --run readiness`
    Expected: tests assert all canonical floors and overlays are present
    Evidence: .sisyphus/evidence/task-6-readiness-data.txt

  Scenario: AuthoredModel remains in-memory only
    Tool: Bash + Grep
    Steps: run `npm run typecheck`, then search `src/validate` for `from "fs"`, `from "path"`, and `ts-morph`
    Expected: no filesystem/source-reading imports under `src/validate`
    Evidence: .sisyphus/evidence/task-6-authored-model-no-io.txt
  ```

  **Commit**: NO | Message: `feat: add validation contracts and readiness floors` | Files: `src/validate/*.ts`, tests

- [x] 7. Implement tiny pure authored-layer validators with TDD

  **What to do**:
  - Start RED: add Vitest tests that fail for missing validator behavior before implementation.
  - Create `src/validate/validators.ts` with pure validators over `AuthoredModel`:
    - `validateDuplicateIds(model)`
    - `validateDanglingReferences(model)`
    - `validateReadinessFloors(model)`
    - `validateAuthoredModel(model)` composing the three and returning `ValidationReport`
  - Duplicate IDs check must cover IDs across `specs`, `packs`, and anchors, because ambiguity fails globally for authored IDs.
  - Dangling references check must cover authored-layer references only: spec relations, pack `specs`, pack `modelRefs`, and anchor/specTest target IDs.
  - Readiness-floor check must implement only Session 1 single-spec structural floors from Task 6. It may check required local sections/details and blocking open questions, but must not check target readiness or anchor resolution.
  - `validateAuthoredModel` must be documented as a pre-graph authored-layer check. It is not the Slice 3 graph validator gate.
  - Valid example model must pass all Session 1 validators after Task 9.
  - Invalid fixtures must live in test files or `test/fixtures`, not in `examples/checkout-v1`.

  **Must NOT do**:
  - Do not wire validators into CLI, CI graph gate, source extraction, or graph-level validation.
  - Do not infer code liveness or delivery facts.

  **Recommended Agent Profile**:
  - Category: `deep` - TDD plus correctness-critical authored-layer validators.
  - Skills: [`tdd`] - Required red-green-refactor discipline.
  - Omitted: []

  **Parallelization**: Can Parallel: NO | Wave 6 | Blocks: 9 | Blocked By: 1,2,3,4,5,6

  **References**:
  - Concept: `docs/concept/05-validation-and-honesty.md:61-64` - duplicate ambiguity fails and partial failure stays local.
  - Concept: `docs/concept/05-validation-and-honesty.md:68-95` - readiness floors and pack coherence.
  - User decision: TDD for validators; contracts + tiny authored-layer validators in Session 1.
  - Review guardrail: graph-level checks land with extractor/graph validation; Session 1 is authored-layer only.

  **Acceptance Criteria**:
  - [ ] `npm test -- --run validators` exits 0.
  - [ ] Duplicate fixture with duplicate `spec:orders.create-order` returns an error finding containing that exact ID.
  - [ ] Dangling relation fixture with `spec:orders.create-order` → `spec:orders.missing-target` returns source ID and missing target ID.
  - [ ] Readiness-floor fixture with an under-specified single-spec `ready` spec returns spec ID and `ready`.
  - [ ] No readiness-floor test expects target-readiness checking or anchor-resolution checking in Session 1.
  - [ ] Empty authored model returns a valid report with no thrown exception.
  - [ ] Valid checkout model passes after Task 9.

  **QA Scenarios**:
  ```
  Scenario: Validator happy path
    Tool: Bash
    Steps: run `npm test -- --run validators`
    Expected: valid authored-layer fixtures and empty authored model pass without thrown errors
    Evidence: .sisyphus/evidence/task-7-validators-happy.txt

  Scenario: Validator failure path
    Tool: Bash
    Steps: run `npm test -- --run validators`
    Expected: duplicate ID, dangling authored ref, and single-spec readiness-floor tests assert exact IDs/messages
    Evidence: .sisyphus/evidence/task-7-validators-error.txt
  ```

  **Commit**: NO | Message: `feat: add tiny authored-layer validators` | Files: `src/validate/validators.ts`, validator tests

- [x] 8. Implement minimal deterministic `sdp` CLI stub

  **What to do**:
  - Create `src/cli/sdp.ts` as the package bin entry.
  - Do not add CLI dependencies unless necessary; manual `process.argv` parsing is enough.
  - `sdp --help` and `sdp` with no args must print exactly:
    ```text
    sdp — Libar Software Delivery Protocol
    Usage:
      sdp --help
      sdp build
      sdp validate
    
    Commands:
      build      Not implemented yet (Slice 1: extractor)
      validate   Validation gate not wired yet (Slice 3: graph validator gate)
    ```
  - `sdp build` must print `sdp build is not implemented yet (Slice 1: extractor).` and exit 1.
  - `sdp validate` must print `sdp validate gate is not wired yet (Slice 3: graph validator gate).` and exit 1.
  - Unknown command must print help plus `Unknown command: <command>` and exit 1.
  - Keep CLI separate from validator runtime; it must not import validator execution or read files.

  **Must NOT do**:
  - Do not implement `sdp build`, `sdp validate`, file walking, graph generation, or command config.

  **Recommended Agent Profile**:
  - Category: `quick` - Small deterministic CLI stub.
  - Skills: []
  - Omitted: []

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 9 | Blocked By: 1,2

  **References**:
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:64` - CLI runs and build/validate are not implemented.
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:101-102` - `src/cli/sdp.ts` target.
  - Metis guardrail: avoid CLI overbuild and source-reading behavior.

  **Acceptance Criteria**:
  - [ ] `npm run build` exits 0 and emits `dist/cli/sdp.js`.
  - [ ] `node dist/cli/sdp.js --help` exits 0 and prints the exact usage text.
  - [ ] `node dist/cli/sdp.js build` exits 1 with exact not-implemented message.
  - [ ] First line of `dist/cli/sdp.js` is `#!/usr/bin/env node`.
  - [ ] CLI source imports no `fs`, `path`, `ts-morph`, or validator execution.

  **QA Scenarios**:
  ```
  Scenario: CLI help path
    Tool: Bash
    Steps: run `npm run build` then `node dist/cli/sdp.js --help`
    Expected: exit 0 and exact help text shown
    Evidence: .sisyphus/evidence/task-8-cli-help.txt

  Scenario: CLI output has executable shebang
    Tool: Bash
    Steps: run `npm run build`, then verify the first line of `dist/cli/sdp.js` is `#!/usr/bin/env node`
    Expected: shebang is present even though QA invokes the file through `node`
    Evidence: .sisyphus/evidence/task-8-cli-shebang.txt

  Scenario: CLI rejects unimplemented build
    Tool: Bash
    Steps: run `node dist/cli/sdp.js build`
    Expected: exit 1 and `sdp build is not implemented yet (Slice 1: extractor).`
    Evidence: .sisyphus/evidence/task-8-cli-build-not-implemented.txt
  ```

  **Commit**: NO | Message: `feat: add sdp cli stub` | Files: `src/cli/sdp.ts`, CLI tests

- [x] 9. Author valid `examples/checkout-v1` tracer bullet and integration gates

  **What to do**:
  - Create the example structure:
    - `examples/checkout-v1/specs/checkout.pack.ts`
    - `examples/checkout-v1/specs/orders/order-management.spec.ts`
    - `examples/checkout-v1/specs/orders/create-order.spec.ts`
    - `examples/checkout-v1/specs/orders/create-order-valid-cart.spec.ts`
    - `examples/checkout-v1/specs/orders/create-order-invalid-cart.spec.ts`
    - `examples/checkout-v1/specs/orders/order-total-rule.spec.ts`
    - `examples/checkout-v1/specs/orders/order-inventory-rule.spec.ts`
    - `examples/checkout-v1/specs/orders/order-latency-constraint.spec.ts`
    - `examples/checkout-v1/specs/orders/order-model.spec.ts`
    - `examples/checkout-v1/specs/decisions/order-lifecycle.spec.ts`
    - `examples/checkout-v1/model.ts`
    - `examples/checkout-v1/src/orders/create-order.use-case.ts`
    - `examples/checkout-v1/test/orders/create-order.valid-cart.test.ts`
  - Use only imports from `@libar-dev/software-delivery-protocol` in the example.
  - `examples/checkout-v1/model.ts` must import sibling specs, pack, anchors, and specTest declarations, assemble them into `checkoutV1Model: AuthoredModel`, and export it for integration tests. It must not import from `../../src`.
  - `checkout.pack.ts` must define `pack:checkout-v1`, include the spec IDs, and reference the model spec via `modelRefs`.
  - Parent Order Management behavior must be `spec:orders.order-management`, `kind: "behavior"`, `altitude: "epic"`, readiness at least `defined`; create-order must refine it.
  - Main use case must be `spec:orders.create-order`, `kind: "behavior"`, `altitude: "feature"`, readiness at least `defined`.
  - Scenario specs must be `kind: "example"`, altitude `story`, and use `verifies(spec:orders.create-order)` and structured given/when/then data sufficient for `defined`.
  - Include 1-2 rules, 1 constraint with machine-readable `target`, 1 model spec with term definitions, and 1 decision spec.
  - Every relation target in `examples/checkout-v1` must resolve within the example set. Do not copy the docs' illustrative `dependsOn("spec:payments.authorize-payment")` unless a matching payments spec is also added inside the example; preferred choice is to omit payment dependency in Session 1.
  - Anchored source file must use `anchorImplementation()` for `impl:orders.create-order-use-case` targeting `spec:orders.create-order`.
  - Test file must use `specTest()` for `test:orders.create-order.valid-cart` targeting the valid-cart scenario or main use case as appropriate.
  - Add an integration test that imports the example authored model and asserts `validateAuthoredModel` returns no errors.
  - Tie-break: if the example fails `validateAuthoredModel`, fix the example to genuinely clear the Session 1 floor; change validators only when the validator contradicts `docs/concept/05-validation-and-honesty.md` or this plan's authored-layer scope.

  **Must NOT do**:
  - Do not put invalid fixtures under `examples/checkout-v1`.
  - Do not import from `../../src`.
  - Do not claim this is self-hosting.

  **Recommended Agent Profile**:
  - Category: `deep` - End-to-end tracer bullet across DSL, validators, package alias, and example.
  - Skills: []
  - Omitted: []

  **Parallelization**: Can Parallel: NO | Wave 7 | Blocks: Final verification | Blocked By: 1-8

  **References**:
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:41-49` - example imports package by name and lives under `examples/checkout-v1`.
  - Pattern: `plans/01-session-1-bootstrap-phase0.md:115-128` - exact tracer-bullet shape.
  - Concept: `docs/concept/README.md` - running domain examples and ID names.
  - Guardrail: `AGENTS.md:77-78` - if example does not typecheck, fix DSL, not example.

  **Acceptance Criteria**:
  - [ ] `tsc --noEmit -p tsconfig.examples.json` exits 0.
  - [ ] `npm test -- --run checkout` exits 0, including valid example validator pass.
  - [ ] A search for `../../src` under `examples/checkout-v1` returns no matches.
  - [ ] `validateAuthoredModel(checkoutV1Model)` reports zero error findings.
  - [ ] `checkoutV1Model` includes all example specs, the pack, the implementation anchor, and the spec-linked test anchor/declaration.
  - [ ] No example relation points outside the example spec set.

  **QA Scenarios**:
  ```
  Scenario: Example public import typechecks
    Tool: Bash
    Steps: run `tsc --noEmit -p tsconfig.examples.json`
    Expected: exit 0; all example imports resolve through package alias
    Evidence: .sisyphus/evidence/task-9-example-typecheck.txt

  Scenario: Example remains a valid authored model
    Tool: Bash
    Steps: run `npm test -- --run checkout`
    Expected: validator report for `pack:checkout-v1` contains zero error findings
    Evidence: .sisyphus/evidence/task-9-example-validator.txt

  Scenario: Example relations resolve internally
    Tool: Bash
    Steps: run `npm test -- --run checkout`
    Expected: checkout integration test asserts every relation target in `checkoutV1Model.specs` resolves to another example spec ID
    Evidence: .sisyphus/evidence/task-9-example-internal-relations.txt
  ```

  **Commit**: NO | Message: `feat(examples): add checkout v1 tracer bullet` | Files: `examples/checkout-v1/**`, integration tests

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [x] F1. Plan Compliance Audit — oracle
  - Verify every Session 1 scope item from `plans/01-session-1-bootstrap-phase0.md` is satisfied or explicitly superseded by user's validator-runtime decision.
  - Verify all deferred items remain absent: extractor, graph emission, graph-level validator gate, reader/view, `--check-clean`, self-hosting.
  - Verify `validateAuthoredModel` is framed and implemented as authored-layer-only, not as the Slice 3 graph validation gate.
- [x] F2. Code Quality Review — unspecified-high
  - Verify TypeScript strictness, public exports, module boundaries, plain serializable builder outputs, and domain-neutral core.
- [x] F3. Real Manual QA — unspecified-high
  - Execute: `npm install`, `npm run typecheck`, `npm run typecheck:examples`, `npm run lint`, `npm run format:check`, `npm test`, `npm run build`, `node dist/cli/sdp.js --help`.
  - Save logs to `.sisyphus/evidence/final-qa.txt`.
- [x] F4. Scope Fidelity Check — deep
  - Verify concept terminology exactly matches `docs/concept/ubiquitous-language.md` and no rejected terms/descriptors are introduced.
  - Verify checkout is an example only, not self-hosting.
  - Verify example relation targets resolve internally and no payments dependency is copied without a matching example spec.

## Commit Strategy
- Do not commit automatically unless the user explicitly asks.
- If the user asks for commits, use the suggested messages per task and inspect `git status`, `git diff`, and recent log before committing.
- Keep `package-lock.json` committed once `npm install` creates it.

## Success Criteria
- Repo is no longer docs-only: it has a strict, buildable TypeScript package and valid tracer-bullet example.
- The first code respects the ratified language: one `Spec` primitive, three descriptors, optional sections, exact relations, `Pack`, identity-only anchors, exact claims, derived-only delivery facts.
- Validator TDD proves the minimum authored-layer honesty/conformance seam without implementing the future extractor, graph-level checks, or graph gate.
- The implementation agent can execute this plan without asking architectural questions.
