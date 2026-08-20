# Todo 19 independent review register

## Review boundary

- Commission baseline: parent of the Todo 1 commission commit, `a8d5898f549778d5841653dc81730a0c5810e446`.
- Commission commit: `1dae853a6f51bdcb8c4bde16d84dafda611e0fca`.
- Reviewed head: `8e6a86bf946dd28958a01d5034ce849d97d88731`.
- Range: every ancestry-path commit in `a8d5898f..8e6a86bf`, including the PR #21 merge and the post-merge Todo 16 and Todo 18 commits.
- Reviewer: Todo 19 child `st_01a01e27`, with no Plan 37 authorship stake.

I read Plans 32, 35, 36, and 37, the operational Plan 37, every task and wave evidence record, the owner ratification bundle, the Todo 16 scope amendment and independent verifier, the Todo 17 inventory, arithmetic, and verifier, and the Todo 18 close record and verifier. I inspected every commit manifest and the full arc delta. Current-tree commands, not earlier verdicts, decide this register.

## Finding register

| ID | Severity | Exact claim | Current-tree repro | Disposition | Reason | Owner | Closure evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P37-R1 | MEDIUM | Commit `4851740b3cab0f5f6ed9de58b1bda1ee7742016b`, `fix(checks): cover plan-37 registrars in clean clones`, changed check configuration without a Plan 37 authorization. It added all later-tranche generated suites to `contract-dependent-suites.mjs` and disabled `@typescript-eslint/no-redundant-type-constituents` for the contract-dependent-suite lint override. The operational plan originally said, without a Brief-I exception, `No validator, floor, or check changes`. | The owner statement is `Approve Brief-I exception` (2026-08-20). The bounded amendment in `.omo/plans/plan-37-settling-arc.md` authorizes only two things: enumerate the exact 56 tracked generated registrar siblings in `contract-dependent-suites.mjs`, and disable `@typescript-eslint/no-redundant-type-constituents` only inside the existing contract-dependent-suite ESLint override for pre-generation clean-clone discovery. It preserves later typecheck enforcement and authorizes no other check/config change. | **ACCEPT** | The owner resolved the authorization gap without widening Brief I. Current bytes meet every bound: the inventory's 56 generated paths equal `git ls-files -- 'test/*.test.generated.ts'` as sets, with no duplicate, omission, untracked entry, generated file lacking a contract import, or non-contract suite leak. ESLint has one base `error` rule and one `off` occurrence whose 71-file scope exactly equals `rootContractDependentSuite.testPaths`. The complete arc has no other check/config implementation change; the only additional check-named diff is Todo 1's commissioned plan-36-to-plan-37 discovery-pin update in `test/check-self-hosting-gates.test.ts`. | Plan 37 owner, closed by this independent reviewer. | Fresh closure: `npm run lint` exit 0; `npm test -- test/self-hosting-carrier.test.ts` 3/3; the same selected wrapper from `/tmp` refused missing contracts with the exact recovery command and exit 1; `npm run generate:self-hosting` exit 0; `npm run check:self-hosting` exit 0; `npm run typecheck` exit 0. Preflight exited 1 only for disclosed `.omo` orchestration/review/parity files and reported no registrar drift, product garbage, or generated drift. Scoped Markdown format and diff checks passed. | **CLOSED** |

Finding counts: 1 total, 1 ACCEPT, 0 DO NOT ACCEPT, 0 open, 1 closed.

## Re-measured review rows

These rows reproduced and did not become findings.

| Challenge | Current-tree result |
| --- | --- |
| ADOPT: `carrier.markdown-parser.bounded-parity` | `registerBoundedParity` is live beside its `specTest`; the sibling is tracked, appears in `generated/registrars.json`, and the fresh generated/check-clean pass accepted its bytes. Its split severity/count Thens remain contract-derived assertions. |
| REFUSE: `consumers.binding-language-views.bound-spec-page` | Current sibling point has `specId` and `bindings`; `requiredConditions` is `specId, bindings, packId`. A fresh runtime probe refused before the oracle with missing Condition `packId` and `expectedCalled: false`. The authored suite still uses `bindExample`. |
| REFUSE: all other ten completeness rows | Current untracked siblings retain the quoted parent-space requirements and partial points. The exact owed-minus-tracked set is the same 12 files as the 12 live `bindExample` activations. |
| REFUSE: Gherkin `contract-parity` and `unbound-ready-refused` | Both remain on `bindExample`. Current bindings still perform later extraction/serialization/contract-generation calls for parity and `extract` plus `validateGraph` for the readiness finding. |
| READY: `spec:carrier.markdown-authoring` | Live graph says stated/derived `ready`, one implementation, no verifier, and one `honesty/gaps` warning. Carrier, family oracle, owner bundle, recipe 2 absence, and recipe 8 membership agree. |
| DEFINED: `spec:extraction.regenerability` | Live graph says stated `defined`, derived `ready`, one implementation, no warning, and recipe 2 membership. The owner bundle retains the missing threshold-measurement artifact as the reason. |
| K inventory and episode arithmetic | Fresh census stdout hash is `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66`, identical to both stored runs. Definition, script, and catalog hashes match the verdict. Corpus remains 12 eligible sessions, 8 I and 4 J, with zero qualifying episodes and an empty shared core. `STAND-DOWN (unmet)` follows because adequacy passes and every later conjunct fails. |
| Close measurements | Validate reports `156 / 1 / 157 -> 314 / 660`, 0 errors and five `honesty/gaps` warnings. Recipes 1, 2, and 8 return 0 backlog, exactly three DEFINED alarms, and exactly five warning subjects. Bind census is 12. Tracked/owed is 56/68, so `10 + 46 + 12 = 68`. |

## Axis review

### Brief I

- Live activation accounting is 56 `register*` calls and 12 `bindExample` calls.
- Every tracked generated sibling exports a registrar called by an authored self-hosting suite. No tracked sibling lacks activation.
- `generated/registrars.json` owes 68 files. It has no tracked-not-owed path. Its 12 owed-not-tracked paths are exactly the refusal set.
- The ten tranche-one siblings have no arc diff.
- The frozen interface, runner, codegen seam, shared helpers, recipes, and runnable-modules Spec have no arc diff.
- Fresh focused execution passed all eight changed authored suites: 8 files, 63 tests.
- Fresh generation followed by `npm run check:self-hosting` passed. The first check-clean attempt after canonical validate failed because validate invalidates the published projection roots; generation restored the required order and the rerun passed.
- P37-R1 was the only Brief-I finding. Owner statement `Approve Brief-I exception` and the exact bounded amendment now authorize the current inventory/config bytes; fresh lint, wrapper, generation, check-clean, and typecheck evidence closes it.

### Brief J

- The owner statement is `Ratify proposed set`, dated 2026-08-20.
- Exact READY set: markdown-authoring, claim-taxonomy, pack-aggregate, relations, spec-sections.
- Exact DEFINED set: projections-model, regenerability, core-model.
- Carrier frontmatter, family descriptors, exact readiness histogram, exact warning oracle, live graph, recipe 2, and recipe 8 agree.
- Five warnings are honest `honesty/gaps`, not errors and not invented verifier evidence.
- No Spec was demoted. The arc adds no content to manufacture a rung.
- The owner-amended test changes keep exact `toEqual` assertions and leave structural pins unchanged.

### Brief K

- The definition precedes verdict-corpus results. A1-A3 are named pre-gather amendments or script bugfixes, each recorded before Wave 3; no result-driven threshold change reproduced.
- All candidate paths are present and deduplicated. Todo 16 remains visible in the census input and is manually excluded as QA-only rather than silently removed.
- The current script self-check matches all 16 recipes and 18 closer cases.
- Fresh census bytes match both captured runs. Inventory arithmetic and manual disqualifiers reproduce.
- No later plan number, bundle, projection, query verb, reader accessor, `src/` change, or `package.json` change exists in the arc delta.

### Close and scope

- Plan 37, Plan 36, and `AGENTS.md` remain EXECUTING/DRAFTED lineage as commissioned. `node check-self-hosting-gates.mjs .` reports current plan 37 and status EXECUTING.
- No Todo 20 full-gate or green-twice claim appears in the close record.
- No arc diff exists under `src/`, `package.json`, `docs/agent-surface/recipes.md`, `test/helpers/`, the frozen interface Spec, or decision Specs.
- Test activation counts are unchanged per authored suite; no skip, todo, or only marker was introduced. The focused suites and graph suite pass.
- P37-R1 is closed. No ACCEPT finding remains open, so the authorized Todo 19 review commit may proceed without changing status or the Todo 19 checkbox.

## Fresh command register

| Command | Result |
| --- | --- |
| Canonical `sdp validate` | exit 0; 156 Specs, 1 Pack, 157 anchors, 314 nodes, 660 edges; 0 errors, 5 warnings |
| Exact recipes 1, 2, 8 | exit 0 each; backlog 0; alarms 3; warnings 5 |
| Eight-Spec current-state query | exit 0; exact five READY / three DEFINED and five warnings |
| Bind and tracked/owed reconciliation | 12 bind, 56 register, 56 tracked, 68 owed, exact 12 owed-not-tracked |
| Refusal runtime probe | expected refusal, missing `packId`; oracle not called |
| `census.mjs --self-check` | exit 0; 16 recipe identities and 18 closer cases |
| Fresh K census piped to sha256 | exact stored hash |
| `npx vitest run test/self-hosting-graph.test.ts` | exit 0; 26/26 |
| Eight changed self-hosting suites | exit 0; 63/63 |
| `npm run lint` | exit 0 |
| Contract inventory equality probe | 56 tracked generated siblings = 56 listed; no omissions, extras, duplicates, missing contract imports, or non-contract suite leaks |
| ESLint override probe | base rule remains `error`; the sole `off` scope exactly equals the 71-path contract-dependent-suite override |
| `npm test -- test/self-hosting-carrier.test.ts` | exit 0; wrapper path passed 3/3 |
| Auxiliary direct `node ./vitest-test.mjs ...` | exit 1 with `spawnSync vitest ENOENT` because direct Node lacked npm's `node_modules/.bin` PATH; corrected with the repository's `npm test --` entrypoint above |
| Wrapper missing-dependency probe from `/tmp` | expected exit 1; named `npm run build && npm run generate:self-hosting` |
| `npm run generate:self-hosting` | exit 0 |
| `npm run check:self-hosting` after generation | exit 0 |
| `npm run typecheck` | exit 0; later generated-contract type enforcement remains active |
| `node check-self-hosting-gates.mjs .` | exit 0; EXECUTING |
| Plan-37 Markdown Prettier and scoped diff checks | exit 0 |
| `npm run preflight` | exit 1 only on disclosed `.omo` runtime garbage: Boulder, the operational amendment, review records, parity state, and the ultrawork note. It reported no tracked registrar drift, product garbage, or generated drift. |

## Adversarial classes

| Class | Result |
| --- | --- |
| `stale_state` | Full ancestry range, current files, fresh graph queries, fresh generation, tests, and K census were used. |
| `dirty_worktree` | Opening and final status attribute Boulder, parity, ultrawork, and the required Todo 18 verifier separately. None is attributed to the reviewed arc finding or staged. |
| `misleading_success_output` | Exit codes were cross-checked against exact recipe membership, warning subjects, registry sets, and arithmetic. The initial check-clean ordering failure and dirty-tree preflight failure are disclosed. |
| `verified_row_regression` | ADOPT, REFUSE, READY, DEFINED, K, and close rows were each challenged from current bytes. |
| `generated_cached_artifacts` | Canonical validate, fresh generation, registry reconciliation, and check-clean were run; generated status stayed clean. |
| `test_weakening` | Full test diff scan found no introduced skip/todo/only; per-suite activation counts stayed constant; focused suites and exact graph assertions pass. |
| `scope_creep` | P37-R1 closed under the exact owner amendment. Current inventory/config bytes fit its two permissions, and the full arc has no other check/config implementation change. Forbidden product, bundle, reader, recipe, helper, interface, and old-registrar surfaces otherwise have no diff. |
| `malformed_input` | K's existing missing-record and truncated-JSONL probes remain recorded and independently verified by Todo 17; no new parser boundary is part of Todo 19. |
| `prompt_injection` | Not applicable. Query bodies were operator-authored from the catalog; transcript text was never executed. |
| `cancel_resume` | Todo 16's resume remains one task/session in K arithmetic; no Todo 19 command was cancelled or resumed. |
| `hung_or_long_commands` | No command hung. Every long command had a bounded timeout. |
| `flaky_tests` | Focused suites passed once without retry, sleeps, polling, or timing assumptions. |
| `repeated_interruptions` | No Todo 19 interruption occurred. K counts resumed tasks once. |

## Closure summary

`complete`. P37-R1 remains ACCEPT and is CLOSED under owner statement `Approve Brief-I exception` and the bounded operational-plan amendment. No ACCEPT finding remains open. Todo 19 stays unchecked for orchestrator verification. Todo 20 remains separate and no status or gate-green-twice claim is made here.

No process or scratch resource remains. Generated roots are clean. This review changed only its evidence, the primary close summary, and the owner-approved operational amendment; the required Todo 18 independent verifier rides the coherent review commit.
