# pr-25-review-remediation - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** The architecture recipes will handle every lawful identifier, the self-binding census will prove that coarse helpers really exist and are consumed, and the lost orchestration history will have a durable recovery record. The existing pull request will finish with clean evidence, accurate claims, and a green gate.

**Why this approach:** It fixes the defects at their real seams without expanding the product model: safer local data structures for queries, test-only symbol auditing for authored coverage rows, and durable evidence for runtime history instead of turning runtime state into a tracked workflow.

**What it will NOT do:** It will not change the engine, authored Specs, graph contract, dependencies, projections, or accepted architecture. It will not rewrite completed plans, infer significance from imports, or re-track the runtime ledger.

**Effort:** Medium
**Risk:** Medium - exact ledger recovery and compiler-symbol auditing require byte- and identity-level correctness, but they remain outside production runtime code.
**Decisions to sanity-check:** Keep the runtime ledger ignored and archive three exact recovery segments; audit coarse helper consumption with the existing compiler; preserve historical records except for the proven whitespace bytes.

Your next move: complete the required independent plan review, then begin execution in an isolated worktree. Full execution detail follows below.

---

> TL;DR (machine): Medium effort, medium risk; eight implementation todos repair recipe totality, structural-coverage honesty, OmO recovery, evidence hygiene, and PR publication, followed by four independent final verifiers.

## Scope
### Must have
- Extend PR #25 on `feature/architectural-patterns-views`; do not open a replacement PR.
- Make the dynamic family maps in recipes 1, 11, and 18 total for every lawful Spec ID family while preserving their JSON output contracts.
- Add non-vacuous machine-value coverage for recipe 19's outgoing and incoming dependency rows.
- Strengthen the test-local `coarseGrainCoverage` census so every rostered `path#symbol` exists as a runtime export and is value-consumed by its covering anchor file.
- Preserve the accepted-set owner boundary: the audit checks authored rows and never derives significance, anchors, component membership, or `uses` edges.
- Recover the three discontinuous start-work ledger segments under durable `.omo/evidence/`, with provenance, counts, and SHA-256 receipts, while leaving the ignored runtime ledger untouched.
- Clarify the repository-local runtime-ledger/durable-evidence checkpoint rule without changing temporal validation or installed OmO tooling.
- Remove exactly the 13 proven trailing-space findings and preserve all other historical plan/evidence content.
- Track the approved remediation draft/plan and the pre-existing design-law draft as recoverable project state.
- Publish a live PR body whose scope, review history, counts, commands, expected output, and forward section are all re-measured at the final head.
- Keep all implementation in a task-owned worktree with isolated worker lanes; reserve push and PR edits for the orchestrator.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- No edits under `src/`, `specs/`, `examples/`, `explorations/`, `package.json`, `package-lock.json`, projections, generated output, or root `plans/`.
- No graph schema, reader API, relation type, validator family, projection, delivery-fact, readiness, Pack, anchor, component, or `uses` changes.
- No significance inference from imports/exports, no architecture-enforcement validator, and no manufactured helper anchors.
- No rejection or sanitization of lawful IDs; do not admit invalid `__proto__` paths.
- No new dependency, shared runtime helper, query verb, retry/fallback layer, or compatibility shim.
- Do not edit the completed architectural-patterns/design-law plan intent or substantive historical evidence. The only historical-byte edits are the 13 named trailing spaces.
- Do not restore, stage, delete, prune, rewrite, or append remediation events to `.omo/start-work/ledger.jsonl`.
- Do not edit `check-temporal.mjs`, external installed skills, user LSP configuration, or the oh-my-openagent checkout.
- No new PR, merge, force push, destructive git command, stash, or unrelated branch cleanup.
- Do not treat LSP-daemon availability as permission to change configuration; the repository's typecheck and full gate remain authoritative.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: TDD with Vitest for recipe totality and coarse coverage; tests-after characterization for recipe 19; checksum/diff/real-surface QA for ledger, prose, and PR publication.
- Baseline: `npx vitest run test/recipes.test.ts test/self-hosting-graph.test.ts test/check-temporal.test.ts` currently passes 71/71; `npm run typecheck` exits 0.
- Focused recipe gate: `npx vitest run test/recipes.test.ts`.
- Focused structural gate: `npx vitest run test/structural-coverage.test.ts test/self-hosting-graph.test.ts`.
- Type verification: request LSP diagnostics on changed TypeScript/Markdown files; if the MCP daemon still reports its startup-ownership race, record that exact failure and require `npm run typecheck` plus the full gate.
- Repository gate: run `npm run check` exactly once after all lane commits are integrated and no other worker writes generated state.
- Manual CLI QA: run `sdp --help`, an unknown verb, repository validation, recipes 17-19, recipe 19's unknown-ID path, and the lawful `constructor`-family recipe-18 probe.
- Graph invariant: re-query and require 164 Specs, 342 nodes, 760 edges, 13 components, 76 `memberOf`, 35 `uses`, 14 inter-decision `dependsOn`, 46 `decidedBy`, and an empty operational backlog unless an independently explained concurrent branch change invalidates the recorded base.
- Scope/diff gate: `git diff --check origin/main...HEAD` exits 0; no `src/`, carrier, package, lockfile, graph, or generated-file delta is introduced by this remediation.
- Ledger gate: each archived segment parses as JSONL, matches its source count/hash byte-for-byte, and the live ignored runtime ledger remains untracked and unchanged.
- PR gate: fetch the live body after push, compare it byte-for-byte with the committed publication body, and re-run every quoted command at the published head.
- Evidence: `.omo/evidence/pr-25-review-remediation/task-<N>-*.md` for implementation tasks and `.omo/evidence/pr-25-review-remediation/final-verification.md` for the integrated gate.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.
- **Startup checkpoint:** run via `/start-work pr-25-review-remediation --worktree /home/darkomijic/dev-libar/software-delivery-protocol-pr-25-review-remediation`. Todo 1 records only approved `.omo` planning state and the exact PR/base/head baseline.
- **Wave A — four isolated lanes:** todo 2 (prototype-safe recipe maps), todo 4 (coarse coverage audit), todo 5 (ledger recovery/policy), and todo 6 (review evidence/whitespace) start together in separate task-owned lane worktrees. Each lane owns disjoint changed files and one verified commit.
- **Wave B — same recipe lane:** todo 3 starts only after todo 2 because both edit `test/recipes.test.ts`; it adds the recipe-19 dependency characterization as a second atomic commit.
- **Integration tail:** todo 7 starts only after todos 2-6 are verified and cherry-picked into the task-owned integration worktree. The blocker is the complete set of lane commits; no worker may run the full gate against partial or concurrently generated state.
- **Publication tail:** todo 8 starts only after todo 7's full gate, remeasurement, evidence, and publication body commit. Push and `gh pr edit` remain orchestrator-only.
- **Final verification:** F1-F4 run in parallel against the exact published head. Any rejection reopens only its owning todo and all dependent publication evidence.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | none | 2, 4, 5, 6 | none |
| 2 | 1 | 3, 7 | 4, 5, 6 |
| 3 | 2 | 7 | 4, 5, 6 |
| 4 | 1 | 7 | 2, 3, 5, 6 |
| 5 | 1 | 7 | 2, 3, 4, 6 |
| 6 | 1 | 7 | 2, 3, 4, 5 |
| 7 | 2, 3, 4, 5, 6 | 8 | none |
| 8 | 7 | F1-F4 | none |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Checkpoint the approved remediation state and exact PR baseline
  What to do / Must NOT do:
  - In the task-owned integration worktree, preserve `.omo/drafts/design-law-transfer.md` byte-for-byte and add the approved `.omo/drafts/pr-25-review-remediation.md` plus this plan.
  - Let start-work create/update only the `pr-25-review-remediation` entry in `.omo/boulder.json`; preserve completed work entries, especially `architectural-patterns-views` and `design-law-transfer`.
  - Record `origin/main` base `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`, reviewed PR head `5584ed91cf2c3efbf31ad83c28054febd0ec62b7`, live PR URL, remote head, dirty-state inventory, and task-owned worktree path in `.omo/evidence/pr-25-review-remediation/task-1-baseline.md`.
  - Confirm `gh auth status` uses SSH and the remote is `git@github.com:libar-dev/software-delivery-protocol.git`.
  - Must not absorb unrelated untracked files, edit product files, rewrite completed Boulder entries, push, or edit the PR.
  Parallelization: Startup checkpoint | Blocked by: none | Blocks: 2, 4, 5, 6
  References (executor has NO interview context - be exhaustive):
  - `.omo/drafts/pr-25-review-remediation.md` — approved scope, findings, defaults, and worktree topology.
  - `.omo/drafts/design-law-transfer.md` — pre-existing untracked durable review state; track unchanged.
  - `.omo/boulder.json` — current completed work registry; new work owns the new pointer.
  - `AGENTS.md:203-217` — recoverable OmO state, commit boundaries, SSH transport, and user-controlled installs.
  Acceptance criteria (agent-executable):
  - `git status --short` lists only the intended `.omo` planning/Boulder/evidence paths before commit.
  - `git diff --cached --name-only` contains no product path.
  - The evidence file records the exact base/head/remote/worktree values and `gh auth status` reports SSH.
  - The commit is green under `node check-temporal.mjs`.
  QA scenarios (name the exact tool + invocation):
  - Happy: `git diff --cached --check && node check-temporal.mjs`; inspect `git show --stat --oneline HEAD`. Evidence `.omo/evidence/pr-25-review-remediation/task-1-baseline.md`.
  - Failure: introduce no mutation; verify the checkpoint script refuses if `gh pr view 25 --json headRefOid` is not `5584ed91...` or if an unrelated path is staged. Record the refusal command/output in the same evidence.
  Commit: Y | `chore(omo): checkpoint PR 25 remediation plan`
  Recommended task executor category: `git` — this is a bounded repository-state and baseline checkpoint with no implementation.

- [x] 2. Make recipe family grouping total for lawful IDs
  What to do / Must NOT do:
  - First add failing real-CLI tests in `test/recipes.test.ts` for recipes 1, 11, and 18 using cloned graph primitives whose first path segments are `constructor`, `toString`, `valueOf`, and `hasOwnProperty`.
  - Recipe 1 fixtures are stated `ready`, non-example/non-decision, and lack a resolving implementation so they appear in the operational backlog.
  - Recipe 11 fixtures are below stated `ready` so they appear in readiness-floor work.
  - Recipe 18 fixtures have declared `decidedBy` edges to an existing ready decision.
  - Prove the red state is the current `.push is not a function` failure for at least `constructor`.
  - Replace only the three recipe-local dynamic accumulators in `docs/agent-surface/recipes.md` with `Object.create(null)`.
  - Assert each hostile family is an own JSON output key with the exact synthetic Spec ID; assert exit 0 and empty stderr.
  - Must not reject/sanitize IDs, test invalid `__proto__`, add a reader/helper API, edit recipe output keys/sorting, or edit the completed plan's embedded historical recipe body.
  Parallelization: Wave A recipe lane | Blocked by: 1 | Blocks: 3, 7
  References (executor has NO interview context - be exhaustive):
  - `docs/agent-surface/recipes.md:99-114` — recipe 1 `byFamily`.
  - `docs/agent-surface/recipes.md:447-463` — recipe 11 `byFamily`.
  - `docs/agent-surface/recipes.md:798-805` — recipe 18 `decidedSubjectsByFamily`.
  - `src/ids.ts:9,46-57,161-163` — public path grammar and `specId` builder; the four named keys are lawful, `__proto__` is not.
  - `test/recipes.test.ts:157-174` — `runSdpCli` production seam.
  - `test/recipes.test.ts:1095-1144` — recipe 18 live-graph assertions.
  - `test/helpers/fixture-graph.ts` — deterministic extraction fixture pattern.
  Acceptance criteria (agent-executable):
  - Before the implementation edit, the new test fails for the documented prototype collision, not fixture construction.
  - After the edit, all four lawful keys survive as own properties in recipes 1, 11, and 18 with exact expected rows.
  - Existing recipe outputs and ordering remain unchanged for the live corpus.
  - `npx vitest run test/recipes.test.ts` passes once.
  QA scenarios (name the exact tool + invocation):
  - Happy: run the focused suite and parse the returned JSON to assert exact hostile-family buckets. Evidence `.omo/evidence/pr-25-review-remediation/task-2-recipe-totality.md`.
  - Failure: run the unmodified catalog body against the `constructor` fixture before implementation; capture exit 1 and `byFamily[family].push` / `decidedSubjectsByFamily[family].push`. Evidence in the same file.
  Commit: Y | `fix(agent-surface): make recipe family maps prototype-safe`
  Recommended task executor category: `unspecified-low` — two-file behavior fix with precise production-CLI tests and no engine change.

- [x] 3. Exercise both recipe 19 dependency directions non-vacuously
  What to do / Must NOT do:
  - Add a characterization test in `test/recipes.test.ts` that changes recipe 19's opening ID only to `spec:decisions.structural-anchor-semantics`.
  - Execute the unchanged catalog body through the production `runSdpCli` seam.
  - Assert `dependencies.dependsOn` contains exactly `spec:decisions.binding-not-liveness` with stated readiness `ready`.
  - Assert `dependencies.dependedOnBy` contains the MD-34 and MD-35 decision Specs, both stated `ready`; both arrays must be non-empty.
  - Preserve existing unknown-ID, dangling-component, implementation, verifier, refinement, and entry-point assertions.
  - Must not add synthetic production data, alter recipe 19, or pin prose/labels.
  Parallelization: Wave B recipe lane | Blocked by: 2 | Blocks: 7
  References (executor has NO interview context - be exhaustive):
  - `docs/agent-surface/recipes.md:888-1017` — recipe 19 body and dependency-neighbor output.
  - `test/recipes.test.ts:1217-1272` — current recipe 19 coverage.
  - `specs/decisions/structural-anchor-semantics.sdp.md` — real target decision.
  - Live graph proof: one outgoing `dependsOn` to binding-not-liveness; inbound `dependsOn` from architectural-significance-rides-primitives and jsdoc-graph-extraction-refused.
  Acceptance criteria (agent-executable):
  - The test fails if either dependency direction is removed, reversed, renamed, or returns the wrong readiness.
  - `npx vitest run test/recipes.test.ts` passes with both arrays demonstrably non-empty.
  - No catalog or graph file changes in this commit.
  QA scenarios (name the exact tool + invocation):
  - Happy: focused Vitest test plus the same recipe body through `pnpm --silent sdp:q '<body>' --json`. Evidence `.omo/evidence/pr-25-review-remediation/task-3-recipe19-dependencies.md`.
  - Failure: use a test-local copy with the outgoing or incoming edge filter removed and capture the assertion failure; do not modify shipped files for the probe. Evidence in the same file.
  Commit: Y | `test(agent-surface): exercise planning-slice dependencies`
  Recommended task executor category: `quick` — one contained characterization test on an existing CLI seam.

- [x] 4. Give coarse-grain self-binding referential and consumption teeth
  What to do / Must NOT do:
  - Add `test/helpers/structural-coverage.ts`, a test-only helper using the repository's existing TypeScript compiler API.
  - Its input contract is a `ts.Program`, repository-relative `<path>#<symbol>`, and covering source path. Its result is `ok`, `exported unit missing`, or `covering source does not value-consume unit`.
  - Parse exactly one non-empty `#`; locate the helper source in the Program; require the named symbol to resolve as a runtime/value function export.
  - Resolve direct named imports, aliases, and barrel re-exports with the type checker; require a non-type local reference used as a call expression outside the import declaration. Reject missing/unused imports and `import type`.
  - Add `test/structural-coverage.test.ts` with deterministic temporary TypeScript projects for missing export, removed/unused import, aliased call, barrel call, and type-only use. Subscribe to no timers and clean temporary paths in `afterEach`.
  - In `test/self-hosting-graph.test.ts`, build the Program once and apply the helper to every `coarseGrainCoverage` row in addition to the existing covering-anchor/memberOf checks; preserve sorted aggregate failure output.
  - Update the six rationales in `test/self-hosting-oracle/structural-edges.ts` to stable file/symbol statements and remove line-number promises, including the stale `emit-markdown.ts:197-205` pointer.
  - Must not inspect imports to derive graph edges/significance, alter `expectedUsesEdges`, add product validation, or add anchors for marginal helpers.
  Parallelization: Wave A structural lane | Blocked by: 1 | Blocks: 7
  References (executor has NO interview context - be exhaustive):
  - `specs/protocol/structural-self-binding.sdp.md` rule 2 — nearest honest realization anchor that consumes the helper.
  - `test/self-hosting-graph.test.ts:306-329` — accepted-set file-level identity checks.
  - `test/self-hosting-graph.test.ts:372-397` — current coarse coverage loop missing unit/consumption checks.
  - `test/self-hosting-oracle/structural-edges.ts:390-447` — six coarse rows and rationales.
  - `src/import/emit-markdown.ts:6-7,277` — imported and called `assertMarkdownEmissionFidelity`.
  - `src/cli/sdp.ts:198-201` — `runValidateWatch` dispatch.
  - `src/import/data-access.ts` and `src/import/emit-markdown.ts` — four data-access exports and their consumers.
  - `tsconfig.json` — compiler options/program root.
  Acceptance criteria (agent-executable):
  - The new helper tests fail before implementation and distinguish missing export from missing runtime consumption.
  - Alias and barrel runtime calls pass; type-only and unused imports fail.
  - All six live coarse rows pass the stronger audit.
  - Removing one rostered export or its consuming call in a test-local fixture yields the exact aggregate mismatch reason.
  - `npx vitest run test/structural-coverage.test.ts test/self-hosting-graph.test.ts` and `npm run typecheck` pass.
  QA scenarios (name the exact tool + invocation):
  - Happy: run both focused suites against the real repository and temporary alias/barrel fixtures. Evidence `.omo/evidence/pr-25-review-remediation/task-4-structural-coverage.md`.
  - Failure: execute the missing-export, removed-import, unused-import, and type-only fixture cases; assert exact `exported unit missing` / `covering source does not value-consume unit` rows. Evidence in the same file.
  Commit: Y | `test(structure): audit coarse helper consumption`
  Recommended task executor category: `deep` — symbol identity, module resolution, and mutation-proof diagnostics require careful cross-file reasoning.

- [x] 5. Archive every lost ledger segment and clarify the checkpoint rule
  What to do / Must NOT do:
  - Add `.omo/evidence/pr-25-review-remediation/ledger/architecture-and-prior.jsonl` from `git show 5c15962584f5d21f9a2be0cb0f7a325c21a9267f:.omo/start-work/ledger.jsonl` byte-for-byte: 135 records, SHA-256 `6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719`.
  - Add `design-law-transfer-pre-delete.jsonl` from `git show d8d4e5f50b2802ea9127819c6953578cfe9618f5:.omo/start-work/ledger.jsonl`: 20 records, SHA-256 `df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90`.
  - Add `design-law-transfer-post-delete.jsonl` by selecting only records whose `plan` is `.omo/plans/design-law-transfer.md` from the current ignored runtime ledger before any mutation: 12 records, SHA-256 `5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1`.
  - Use `read` plus `apply_patch` for repository files; do not create them through shell redirection, checkout, or scripts.
  - Add `manifest.md` with source commits/paths, counts, hashes, segment order, the proven fact that main's 24 records are the prefix of the 135-record snapshot, and a warning not to infer chronology across the overwrite boundary.
  - Add one lean `AGENTS.md` rule: `.omo/start-work/ledger.jsonl` is ignored runtime state; before replacement/deletion, preserve required recovery records under `.omo/evidence/<work-id>/` with provenance and hashes.
  - Refine the `.gitignore` OmO comment to name the runtime ledger/durable evidence boundary; keep the ignore/allow patterns unchanged.
  - Must not re-track the runtime path, add `.omo/start-work/` to temporal exclusions, deduplicate/reorder/synthesize events, change the installed start-work skill, or lose the 12 post-delete records.
  Parallelization: Wave A OmO lane | Blocked by: 1 | Blocks: 7
  References (executor has NO interview context - be exhaustive):
  - `AGENTS.md:203-207` — recoverable project state and no destructive cleanup.
  - `.gitignore:20-29` — `.omo/*` ignored; only Boulder/drafts/plans/evidence tracked.
  - `check-temporal.mjs:10-28` — tracked `.omo/evidence/` exempt; runtime ledger not exempt.
  - `.omo/start-work/ledger.jsonl` — ignored current runtime input; do not edit.
  - Commits `5c15962`, `726eb9d`, `d8d4e5f`, and `315a0d8` — close, overwrite, pre-delete, and delete boundaries.
  - `.omo/evidence/task-9-design-law-transfer.md` — historical temporal collision; preserve unchanged.
  Acceptance criteria (agent-executable):
  - Each archive file parses one JSON object per line and matches its pinned count/hash.
  - `cmp` against the two `git show` streams and the filtered current-ledger stream exits 0.
  - Concatenated segment count is 167; no claim of globally unique or chronological events is added.
  - `git check-ignore -v .omo/start-work/ledger.jsonl` still points to `.gitignore`; `git ls-files .omo/start-work/ledger.jsonl` remains empty.
  - `git diff -- .omo/start-work/ledger.jsonl check-temporal.mjs` is empty.
  - `node check-temporal.mjs` passes.
  QA scenarios (name the exact tool + invocation):
  - Happy: JSONL parse/count/hash/cmp checks and temporal gate. Evidence `.omo/evidence/pr-25-review-remediation/task-5-ledger-recovery.md`.
  - Failure: compare each archive with one byte removed in a temporary copy and prove hash/cmp failure; prove a tracked runtime ledger would remain outside the chosen policy without staging or modifying it. Evidence in the same file.
  Commit: Y | `chore(omo): preserve PR 25 ledger recovery history`
  Recommended task executor category: `deep` — exact git-object recovery and policy reconciliation are data-integrity work.

- [x] 6. Record the failed review and clear only its proven whitespace debt
  What to do / Must NOT do:
  - Add `.omo/evidence/pr-25-review-remediation/review-findings.md` summarizing the exact reviewed base/head, six review lanes, blockers, verified strengths, isolated gate result, and this plan's remediation mapping.
  - Use evidence-backed role names, verdicts, commands, and artifact paths; do not claim unavailable transcripts or model-specific review history.
  - Remove exactly 13 trailing-space occurrences from:
    - `.omo/evidence/architectural-patterns-views/task-3-implementation.md`
    - `.omo/evidence/architectural-patterns-views/task-8-baseline.md`
    - `.omo/evidence/architectural-patterns-views/task-9-implementation.md`
  - Preserve every visible word, code block, intermediate failure, measurement, and completed plan/evidence file otherwise.
  - Must not run a repository-wide formatter or rewrite stale historical recipe bodies/claims.
  Parallelization: Wave A evidence lane | Blocked by: 1 | Blocks: 7
  References (executor has NO interview context - be exhaustive):
  - `git diff --check origin/main...5584ed91` — exact 13-line docket.
  - `.omo/evidence/final-verification-design-law-transfer.md` — prior close receipt, historical and unchanged.
  - `.omo/evidence/pr-25-design-law-transfer-body.md` — prior prepared body, historical and not the live publication base.
  - `.omo/drafts/pr-25-review-remediation.md` — approved review findings and scope mapping.
  Acceptance criteria (agent-executable):
  - `git diff --check origin/main...HEAD` has no whitespace finding after this commit and later lane integration.
  - The three historical files differ only by removed trailing bytes.
  - `review-findings.md` maps every failed-review item to todos 2-8 and does not assert unsupported review artifacts.
  - No completed plan is edited.
  QA scenarios (name the exact tool + invocation):
  - Happy: byte-level diff of the three files plus `git diff --check`. Evidence `.omo/evidence/pr-25-review-remediation/task-6-review-evidence.md`.
  - Failure: run a scoped trailing-space detector on the pre-edit blobs from `HEAD^`; capture all 13 original findings, then prove none remain in current blobs. Evidence in the same file.
  Commit: Y | `style(evidence): clear PR 25 review whitespace`
  Recommended task executor category: `writing` — the work is evidence accuracy plus byte-exact prose hygiene.

- [x] 7. Integrate verified lanes, run the full gate, and prepare the final PR record
  What to do / Must NOT do:
  - Confirm every lane commit is based on todo 1 and carries its focused green evidence; cherry-pick in dependency order: todo 2, todo 3, todo 4, todo 5, todo 6.
  - Resolve no conflict by dropping another lane's assertion or evidence; stop and return to the owning lane if file ownership differs from this plan.
  - Request LSP diagnostics for every changed TypeScript/Markdown file. If the MCP daemon is unreachable, record the exact daemon error and continue only if `npm run typecheck` and the full gate pass.
  - Run `npm run check` once with no concurrent worker or generated-state writer.
  - Manually use the CLI: help, unknown command, validation, recipes 17-19, recipe 19 unknown ID, recipe 19 structural-anchor dependencies, and the lawful constructor-family recipe-18 probe.
  - Re-derive graph/count/readiness/backlog outputs; verify the 35 declared `uses` still exactly match real cross-component imports using the already-reviewed audit method, without adding an inference feature.
  - Re-run the ledger archive integrity and diff-scope checks.
  - Write `.omo/evidence/pr-25-review-remediation/final-verification.md` with exact commands, outputs, test totals, expected warnings, graph values, LSP status, and reviewed commit.
  - Fetch the live PR body and write a complete replacement to `.omo/evidence/pr-25-review-remediation/pr-body.md`. Preserve the two-wave story, decisions table, try-it block, feedback questions, upcoming work, and refused list; correct the whole-branch `src/` sentence to a Wave-2 statement; remove unsupported model-name history; add the remediation review/evidence; remeasure every number at this head.
  - Update only the new `pr-25-review-remediation` Boulder work to completed/current at the verified integration commit. Preserve prior completed work pointers as history.
  - Must not push, edit the live PR, regenerate/freeze architecture projections, or change product/corpus scope.
  Parallelization: Integration tail | Blocked by: 2, 3, 4, 5, 6 | Blocks: 8
  References (executor has NO interview context - be exhaustive):
  - `package.json` `check` script — authoritative gate ordering.
  - `docs/agent-surface/recipes.md` recipes 1, 11, 17-19 — manual query bodies.
  - `.agents/skills/sdp-agent-surface/SKILL.md` and `docs/agent-surface/recipes.md` — graph-first invocation contract.
  - `.omo/evidence/pr-25-design-law-transfer-body.md` — historical narrative input only.
  - Live PR #25 body fetched through `gh pr view 25`.
  - `AGENTS.md` PR-description requirements — story, surfaces, decision table, try-it output, feedback, upcoming work, refused list, remeasured numbers.
  - Review baseline: 164 Specs, 342 nodes, 760 edges, 13 components, 76 `memberOf`, 35 `uses`, 35 decisions, 14 inter-decision `dependsOn`, 0 `supersedes`, 46 `decidedBy`, readiness 148/11/4/1, empty backlog, five expected honesty warnings.
  Acceptance criteria (agent-executable):
  - All five lane commits are present exactly once and their scoped evidence remains green.
  - `npm run check` exits 0; focused tests and full totals are recorded without inheriting prior numbers.
  - Manual CLI happy/error paths produce expected exits and machine values.
  - Graph totals/import parity remain unchanged unless a concurrent authorized branch change is documented and the plan is re-approved.
  - Ledger archives match all three pinned sources; runtime ledger remains ignored/untracked.
  - `git diff --check origin/main...HEAD` exits 0.
  - `git diff --name-only 5584ed91...HEAD` contains only planned docs/tests/OmO paths; no `src/`, Specs, packages, lockfile, generated output, or completed plan.
  - The publication body contains no false whole-branch one-file claim or unsupported named-review claim and includes verbatim expected output captured at the named verified head.
  QA scenarios (name the exact tool + invocation):
  - Happy: full gate plus all listed CLI invocations in a clean task-owned worktree. Evidence `.omo/evidence/pr-25-review-remediation/final-verification.md`.
  - Failure: run one stale-checkout diagnostic from the PR try-it block against `origin/main` and capture the named mismatch signal; run the constructor probe against the pre-fix recipe body and preserve its exit 1. Evidence in the same file.
  Commit: Y | `chore: remeasure PR 25 remediation close`
  Recommended task executor category: `unspecified-high` — cross-lane integration, full-system verification, and durable PR narrative require broad repository context.

- [x] 8. Fast-forward the existing PR branch, publish the verified body, and clean lanes
  What to do / Must NOT do:
  - Re-fetch `origin/feature/architectural-patterns-views`; require its head to be the recorded todo-1 ancestor of the verified integration head. Stop on divergence.
  - Confirm `gh auth status` still reports SSH and the remote remains the expected SSH URL.
  - Push the integration head to `origin/feature/architectural-patterns-views` without force.
  - Apply `.omo/evidence/pr-25-review-remediation/pr-body.md` to PR #25 with `gh pr edit`.
  - Re-fetch PR state and require head OID, body, title/base branch, and open state to match the prepared evidence.
  - Watch the PR checks through an observable command; require all required checks green. Do not sleep/poll in the agent turn.
  - Remove only task-owned lane/integration worktrees after clean-status proof; preserve local branch refs and the user's main checkout.
  - Append publication/cleanup receipts to the ignored runtime ledger as start-work normally does, but do not stage it; sync durable final receipts into the new evidence/Boulder state if the execution harness requires a close commit, then re-run the same fast-forward/no-force checks before a second push.
  - Must not merge, force push, edit another PR, alter remotes/credentials, delete unfamiliar OmO state, or clean unrelated worktrees.
  Parallelization: Publication tail | Blocked by: 7 | Blocks: F1-F4
  References (executor has NO interview context - be exhaustive):
  - PR #25 `https://github.com/libar-dev/software-delivery-protocol/pull/25`.
  - `AGENTS.md` GitHub transport, commit boundary, OmO state, and PR-description rules.
  - `.omo/evidence/pr-25-review-remediation/pr-body.md` — exact publication body.
  - `.omo/evidence/pr-25-review-remediation/final-verification.md` — exact verified integration head.
  Acceptance criteria (agent-executable):
  - Remote branch is a non-forced fast-forward to the exact verified head.
  - `gh pr view 25 --json headRefOid,baseRefOid,state,body,url` matches the evidence body and expected base.
  - Required PR checks pass at that exact OID.
  - `git worktree list --porcelain` contains no task-owned remediation lane; every removed worktree was clean.
  - Main checkout content and unrelated branch refs remain untouched.
  QA scenarios (name the exact tool + invocation):
  - Happy: compare remote/local ancestry, PR JSON, body bytes, and check results. Evidence `.omo/evidence/pr-25-review-remediation/task-8-publication.md`.
  - Failure: use read-only ancestry checks to demonstrate that a divergent remote head would abort before push; do not create divergence. Record expected refusal conditions in the same evidence.
  Commit: N | external publication/cleanup only; any harness-required close-state commit must be atomic, re-gated, and fast-forwarded without force.
  Recommended task executor category: `git` — external publication and worktree cleanup are orchestrator-reserved transport operations.

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit
  Verify every todo, dependency, file boundary, evidence receipt, commit, and publication step against this exact plan; reject missing ledger segments, unreviewed commits, skipped failure QA, or incomplete PR/body receipts.
  Evidence: `.omo/evidence/pr-25-review-remediation/f1-plan-compliance.md`.
- [x] F2. Code quality review
  Review prototype-safe recipe behavior, TypeScript symbol-resolution helper correctness, deterministic tests, error messages, no hidden graph inference, no source/corpus/contract drift, and no unnecessary abstraction/dependency.
  Re-run focused recipe/structural tests and typecheck.
  Evidence: `.omo/evidence/pr-25-review-remediation/f2-code-quality.md`.
- [x] F3. Real manual QA
  In a fresh clean worktree at the published PR head, run help, bad input, validation, recipes 17-19, hostile-family recipe probes, non-empty dependency output, ledger hashes/counts, and the PR try-it block; compare actual output with the published body.
  Evidence: `.omo/evidence/pr-25-review-remediation/f3-manual-qa.md`.
- [x] F4. Scope fidelity
  Diff exact base-to-published-head and verify no `src/`, Spec, graph, package, generated, projection, validator, completed-plan, or unrelated cleanup changes; verify the runtime ledger is ignored/untracked, the three archives are lossless, the PR claims are supported, and security attack surface/dependencies remain unchanged.
  Evidence: `.omo/evidence/pr-25-review-remediation/f4-scope-fidelity.md`.

## Commit strategy
- The plan itself authorizes commits on the existing PR work line only.
- Commit 1: approved `.omo` planning/Boulder/baseline checkpoint.
- Parallel lane commits: recipe totality; coarse structural audit; ledger recovery/policy; review evidence/whitespace.
- Serial recipe commit: recipe 19 dependency characterization after recipe totality.
- Integration close commit: full-gate evidence, remeasured publication body, and new-work Boulder close.
- Do not create omnibus, empty, fixup, or unrelated cleanup commits.
- Cherry-pick only a lane commit whose focused tests and evidence are green; preserve lane commits as recovery boundaries.
- Push only after the integrated full gate. Push the verified head as a fast-forward to the existing PR branch; never force.
- If a post-publication close-state commit is required, make it a separate atomic `.omo` commit, rerun temporal/diff checks, and fast-forward once more before final reviewers.

## Success criteria
- Recipes 1, 11, and 18 return correct JSON for `constructor`, `toString`, `valueOf`, and `hasOwnProperty` families; no valid-input `.push` crash remains.
- Recipe 19 has a real, non-empty, bidirectional dependency assertion at the production CLI seam.
- Every coarse helper row resolves to a runtime function export and a value-consuming call in its covering source; alias/barrel calls pass, missing/unused/type-only cases fail deterministically.
- The accepted architecture graph and all review baseline metrics remain unchanged.
- Three durable ledger archives preserve 135 + 20 + 12 records with exact source hashes; the runtime ledger stays ignored, untracked, and unmodified.
- Repository guidance makes the runtime-to-durable checkpoint rule explicit without changing temporal validation or external tooling.
- The 13 trailing spaces are gone and no other historical plan/evidence content is rewritten.
- No remediation diff touches `src/`, carriers, packages, lockfiles, generated files, projections, graph contracts, or completed plans.
- Focused tests, typecheck, `npm run check`, manual CLI QA, ledger integrity, import parity, and `git diff --check` all pass.
- PR #25 points to the exact verified head, required checks are green, and the live body is byte-equal to committed evidence with remeasured outputs and no unsupported claims.
- All four final verifiers approve; any unavailable high-accuracy plan review is explicitly recorded before execution rather than implied.
