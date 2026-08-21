# Post-remediation repository gate

Owned deliverable: this file only. No product, plan, Boulder, or ledger edit. No stage, commit, push, or stash. Prior F1–F4 / F2-remediation evidence was not treated as covering commit `c244bf06125481f4e01b1a9d197b0925c4088731`.

## Pre-gate

| Check | Result |
|---|---|
| Branch | `feature/architectural-patterns-views` |
| HEAD | `c244bf06125481f4e01b1a9d197b0925c4088731` (`c244bf0 fix: resolve architecture views final review findings`) |
| `git status --porcelain=v1` | empty |
| Index (`git diff --cached`) | empty |
| Worktree | clean |

Clock at gate start: `2026-08-21T07:41:16+02:00`.

## `npm run check` — once, no retry

| Field | Value |
|---|---|
| Command | `npm run check` |
| Invocations | **1** |
| Retries | **0** |
| Exit | **0** |
| Start | `2026-08-21T07:41:16+02:00` |
| End | `2026-08-21T07:43:10+02:00` |
| Log | 463 lines captured then deleted |

Documented green-gate stages from `AGENTS.md` / `package.json` (`check:temporal` → `lint` → `format:check` → `build` → `generate:self-hosting` → `generate:example` → `typecheck` → `typecheck:examples` → `test` → `check:self-hosting-gates` → `check:self-hosting` → `check:example` → `preflight`): **all 13 reached** (each printed its npm script banner and completed before the next `&&` leg). `check:self-hosting-gates` currentRecord.gateLegs lists the same 13 names. Preflight ended `semantic diff summary` / `clean`.

No-retry proof: a single shell invocation wrote `/tmp/post-remediation-gate-check.log` and `/tmp/post-remediation-gate-check.exit`; exit file contained `0`; the command was not re-run after that.

### Test totals (visible)

Two vitest runs inside `npm test` (`node ./vitest-test.mjs`), vitest **4.1.10**:

| Run | Files | Tests | Duration |
|---|---|---|---|
| 1 | 62 passed (62) | **844 passed \| 1 skipped (845)** | 32.53s, start 07:42:07 |
| 2 | 1 passed (1) | **80 passed (80)** | 5.31s, start 07:42:40 |

### Non-validator warnings (not suppressed, not a validation class)

- `tsup` CJS `empty-import-meta` on `src/extract/protocol-bindings.ts:56` (`import.meta` empty under CJS). Appeared during `build` and again during the first vitest run. Gate still exit 0.
- Incidental `npm notice` tarball listing during tests. Not a graph finding.

## Validation-class classification

Exactly two validator finding classes appeared. No other validation class.

### Five self-hosting `honesty/gaps` findings

Emitted by `generate:self-hosting` and `check:self-hosting` (four projection verbs each; same five subjects every time). Banner extraction counts: `162 specs · 1 packs · 172 anchors → 335 nodes · 731 edges (0 errors, 0 warnings)`. Then `validate: 0 errors · 5 warnings (conformance + honesty over the one graph)`.

| File | Validator | Subject |
|---|---|---|
| `specs/carrier/markdown-authoring.sdp.md` | `honesty/gaps` | `spec:carrier.markdown-authoring` |
| `specs/extraction/claim-taxonomy.sdp.md` | `honesty/gaps` | `spec:extraction.claim-taxonomy` |
| `specs/model/pack-aggregate.sdp.md` | `honesty/gaps` | `spec:model.pack-aggregate` |
| `specs/model/relations.sdp.md` | `honesty/gaps` | `spec:model.relations` |
| `specs/model/spec-sections.sdp.md` | `honesty/gaps` | `spec:model.spec-sections` |

Each message: Spec states readiness `"ready"` with no resolving verifier — a gap, informative only (ready never requires delivery facts). Owner-ratified; expected per `AGENTS.md`.

### One example `verifies-linkage` finding

Emitted by `generate:example` and `check:example` (four projection verbs each; same subject). Banner: `11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)`. Then `validate: 0 errors · 1 warnings`.

| File | Validator | Subject |
|---|---|---|
| `specs/orders/create-order-invalid-cart.sdp.md` | `conformance/verifies-linkage` | `spec:orders.create-order.invalid-cart` |

Message: Example declares `verifies` → `spec:orders.create-order` but is not an enabled verifier — no test anchor binds it. Expected per `AGENTS.md`.

No `conformance/referential-integrity`, no honesty class other than `honesty/gaps`, no extra verifies-linkage subject.

## Fresh graph remeasurement (`pnpm --silent sdp:q --json`)

After the green gate, one measurement body plus catalog recipes 17, 18, 19 and recipe-19 unknown-id. Parser: the `test/recipes.test.ts` `## N.` / fenced ` ```js ` rule against `docs/agent-surface/recipes.md`. Each call was `pnpm --silent sdp:q <body> --json` (sdp:q already excludes `explorations`, `examples`, `test/fixtures/import/parity`). All five exit **0**, stderr empty, no retry.

### Counts

| Metric | Live |
|---|---|
| specs | **162** |
| packs | **1** |
| anchors (`Anchor` + `CodeNode`) | **172** (83 Anchor + 89 CodeNode) |
| nodes | **335** (Primitive 162, Pack 1, CodeNode 89, Anchor 83) |
| edges | **731** |
| stated readiness | `{ ready: 146, defined: 11, idea: 4, scoped: 1 }` |
| decisions | **34** |
| inter-decision `dependsOn` | **12** (all `declared`) |
| inter-decision `supersedes` | **0** |
| components | **13** |
| `memberOf` | **73** |
| `uses` | **25** |
| live report findings | **5**, class `honesty/gaps` only |

Inter-decision `dependsOn` (from → to): agent-front-door → agent-surface-scripts-graph; architectural-significance-rides-primitives → binding-not-liveness and structural-anchor-semantics; carried-evidence → content-only-sections and kind-conditional-floor; carrier-universality → pack-markdown-carrier and prose-ownership; decision-readiness-posture → kind-conditional-floor; example-realization-posture → binding-not-liveness; sdp-gherkin-extension → sdp-ts-extension; structural-anchor-semantics → binding-not-liveness; verification-posture-not-realization → binding-not-liveness.

Component ids: `protocol.{adapters,cli,codegen,extract,graph,import,model,notation,projections,reader,runner,testing,validate}`.

### Recipe 17 — Architecture map

Exit 0. `components.length === 13`. Member counts sum to **73** (equals live `memberOf`). Every row has `fanIn` / `fanOut` / `usesOut` / `usedBy` / `satisfiedSpecs` / `shapingDecisions`. No `abstractions` substring.

Fan-in: model 6, graph 5, validate 3, extract/reader/runner 2, adapters/codegen/import/notation/projections 1, cli/testing 0.

Fan-out: cli 6, extract/reader 3, codegen/import/projections/testing 2, adapters/graph/notation/runner/validate 1, model 0.

### Recipe 18 — Decision map

Exit 0. `total === 34`, `ranking.length === 34`, `decisions.length === 34`. Ranking fanIn sum **12**; outgoing `dependsOn` **12**; incoming `dependedOnBy` **12**; outgoing `supersedes` **0**; incoming `supersededBy` **0**; `fanInByType.supersedes` sum **0**. Top fanIn: `binding-not-liveness` 4, `kind-conditional-floor` 2, then six at 1, remaining 26 at 0.

### Recipe 19 — Planning slice (known + unknown)

Catalog JS body: `implementations` tokens **11**, `abstractions` tokens **0**. Whole `docs/agent-surface/recipes.md` `abstractions` count **0**. Body uses `component?.label/file/line ?? null` and top-level `implementations`.

Known (`const id = "spec:consumers.agent-surface"`): exit 0, `found: true`. Top-level keys: `id`, `found`, `refinementNeighborhood`, `constrainingDecisions`, `implementations`, `components`, `verifiers`, `blastRadiusEntryPoints`, `blastRadiusLimit`. **`implementations` present; `abstractions` absent** on the object and as a JSON substring. Implementation ids: `impl:protocol.agent-surface`, `impl:protocol.agent-surface-cli`. Component rows use `implementations` only (`component:protocol.cli` → `impl:protocol.agent-surface-cli`; `component:protocol.reader` → `impl:protocol.agent-surface`). Parents: `[spec:consumers.projections-model]`. Children: authoring-recipes, demand-map-entries, scripted-context-body, reader, agent-front-door, agent-surface-scripts-graph. Constraining decisions: agent-front-door, agent-surface-scripts-graph, mcp-deferred. `blastRadiusEntryPoints.length === 7`; `blastRadiusLimit` file-level.

Unknown (only the opening id substituted to `spec:does-not-exist.unknown`): exit 0. Exact JSON:

```json
{"id":"spec:does-not-exist.unknown","found":false}
```

Live known/unknown semantics hold. Recipe 19 uses implementations only; no abstractions.

## Repository validate (after already-green gate)

Exact `AGENTS.md` command:

```bash
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

| Field | Value |
|---|---|
| Exit | **0** |
| Start / end | `2026-08-21T07:44:41+02:00` / `2026-08-21T07:44:43+02:00` |
| Banner | `162 specs · 1 packs · 172 anchors → 335 nodes · 731 edges (0 errors, 0 warnings)` |
| Wrote | `generated/graph.json`, `generated/contracts` (102 modules) |
| Validate line | `0 errors · 5 warnings (conformance + honesty over the one graph)` |
| Stderr findings | the same five `honesty/gaps` subjects; no other class |

**Projection-tree strip:** before this validate, `generated/` held `census/`, `contracts/`, `design-review/`, `gherkin/`, `mermaid/`, `graph.json`, `registrars.json` (restored by the green `generate:self-hosting` / `check:self-hosting` legs). After exit, `generated/` held only `graph.json`, `contracts/`, `registrars.json`. Ignored projection trees `design-review`, `census`, `mermaid`, and `gherkin` were removed.

This strip is expected after an already-green gate. It is not a gate failure. **Final F3 re-audit will restore them** (`npm run generate:self-hosting`). This gate did not regenerate those trees after validate.

Post-validate: HEAD still `c244bf06125481f4e01b1a9d197b0925c4088731`, branch unchanged, porcelain empty (generated trees are gitignored).

## Cleanup

- Removed `/tmp/post-remediation-gate-check.log`, `/tmp/post-remediation-gate-check.exit`.
- Removed `/tmp/prgate-run-q.mjs`, `/tmp/prgate-q/` (recipe bodies, stdout/stderr, meta), `/tmp/prgate-validate.stdout`, `/tmp/prgate-validate.stderr`, `/tmp/prgate-validate.exit`.
- No leftover gate processes.
- Did not stage, commit, push, or stash.
- Did not edit product, plan, Boulder, ledger, configs, or tests.
- Did not rerun `npm run check`.
- Did not suppress warnings.

## Verdict

Post-remediation repository gate **green** on `c244bf06125481f4e01b1a9d197b0925c4088731`: check exit 0 once, all 13 stages, exactly five self-hosting `honesty/gaps` plus one example `conformance/verifies-linkage`, graph 162/1/172 → 335/731, recipes 17–19 live with recipe 19 implementations-only known/unknown semantics, repository validate exit 0 with expected ignored-projection strip.
