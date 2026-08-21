# F4 Scope Fidelity - Final Re-audit

## Findings

None.

## Verdict

**PASS** for `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d..c244bf06125481f4e01b1a9d197b0925c4088731` on `feature/architectural-patterns-views`.

The F2 remediation in `c244bf0` is a coherent root-fix commit for the final-review findings. It does not expand engine, graph, schema, relation, reader, readiness, anchor, component, or projection behavior. The previously authorized Cursor formatting exception remains isolated and exact.

## Independent verification

- Requested base is the merge base; landed HEAD is a linear 17-commit descendant.
- `c244bf0` is a direct child of prior audited HEAD `aa54e86` and is the sole remediation commit.
- Independent focused run: `npx vitest run test/self-hosting-graph.test.ts test/self-hosting-model.test.ts test/readiness.test.ts test/recipes.test.ts --pool=forks --maxWorkers=1` -> **4 files / 76 tests passed**.
- Live `sdp:q`: 162 Specs, 172 anchors, 335 nodes, 731 edges, 13 components, 12 inter-decision `dependsOn`, 0 `supersedes`, 0 scheduling edges.
- Recipes 17/18/19 remain byte-equal between plan and catalog. Recipe 19 is 3984 bytes, SHA-256 `9e2b1cdf2c093667ed6a7d7af8603bef9af43dd0abb2e29b673cca0e0054c50e`, with zero `abstractions` tokens and three nullable component accesses.

## Updated guardrail matrix

| Guardrail | Result | Re-audit proof |
| --- | --- | --- |
| No new relation types | PASS | Remediation touches no relation/schema implementation or Spec frontmatter; live edge vocabulary is unchanged. |
| No reader methods | PASS | No remediation delta under `src/`; base-to-HEAD `Reader` surface remains the previously audited one. |
| No component semantic change | PASS | No remediation delta under `src/`, anchor model, ids, or graph schema; component count remains 13. |
| Zero `supersedes`; no scheduling edges | PASS | Live graph reports 0 and 0; the exact 12-edge inter-decision set is unchanged. |
| No decision/idea anchors | PASS | Anchor roster and targets are unchanged; live query still returns no new anchor targeting a decision or `idea` Spec. |
| No incidental-plumbing anchors | PASS | Full base-to-HEAD forbidden-path query is empty. |
| No committed derived view rendering | PASS | No remediation or full-range delta under `generated/` or `src/projections/`. |
| No readiness change | PASS | Remediation changes no `readiness:` line. Structural-patterns and structural-self-binding remain `defined`; MD-34 remains `ready`. |
| No relation/anchor graph change | PASS | Counts remain 172 anchors / 335 nodes / 731 edges; frontmatter and API-line audit is empty. |
| No engine behavior change | PASS | `aa54e86..c244bf0 -- src` is empty. Recipe 19's documented query body changed, not engine code. |
| No new repo `plans/` file | PASS | Both remediation and full base-to-HEAD diffs under repo `plans/` are empty. |
| No unrelated user work absorbed | PASS | The only non-`.omo` remediation paths are the eight review-fix paths enumerated below; gate evidence records a clean tree before execution. |

## Original implementation scope remains exact

The original F4 proof remains unchanged: MD-34 plus Pack/oracle lockstep; two enriched Specs at `defined`; 13-component allowlist; 15 new anchors; existing `impl:protocol.sdp-import` membership; six new `uses`; nine adjudicated task-8 `dependsOn` plus six `decidedBy` fills; three rejected candidate edges absent; recipes 17-19; planned tests/oracles/on-ramps; no incidental anchors, derived renderings, engine behavior, or repo `plans/` file.

Task-5 target mismatches (`src/extract/carrier.ts`, `src/extract/reify.ts`) and `new-spec-command.ts` remain untouched. The full inter-decision graph remains the 11 branch-added edges plus the base `sdp-gherkin-extension -> sdp-ts-extension` edge.

## F2 remediation proof

Commit `c244bf06125481f4e01b1a9d197b0925c4088731` changes exactly eight non-orchestration paths:

1. `CONTEXT.md`
2. `docs/agent-surface/recipes.md`
3. `docs/concept/DECISIONS.md`
4. `specs/decisions/architectural-significance-rides-primitives.sdp.md`
5. `specs/model/structural-patterns.sdp.md`
6. `test/recipes.test.ts`
7. `test/self-hosting-oracle/decisions.ts`
8. `test/self-hosting-oracle/model.ts`

These are root fixes, not unrelated expansion:

- **Terminology:** CONTEXT records `pattern` as refused architectural vocabulary; MD-34, structural-patterns, registry, and exact oracles replace positive pattern-layer wording with existing Spec primitives. Stable ids, kinds, readiness, and relations are unchanged. `model.terms.pattern` is removed; only `architecturally significant unit` remains.
- **Validator-family claim:** the invented deferred architecture-enforcement family is removed in canonical decision prose, oracle, and plan copy. Negative constraints now remain declared intent rather than promised machine findings. No validator or engine code changes.
- **Recipe 19 contract:** catalog output uses `implementations`, not the rejected `abstractions` key; unresolved component metadata uses optional access and remains represented with null metadata instead of throwing.
- **Regression tests:** two deterministic real-CLI tests cover the implementations-only machine contract and an invalid-but-reportable dangling `memberOf` graph. No sleep, polling, retry, or production mock bypass.
- **Plan lockstep:** the embedded recipe-19 body is byte-exact with the catalog; recipes 17/18 are unchanged. Canonical Spec/decision snippets and MD-34 row are synchronized with the repaired wording.

The remediation changes recipe behavior only at the review-identified output/totality seams. It adds no engine method, reader accessor, graph relation, schema field, anchor, component, projection, or readiness transition.

## Authorized Cursor exception

Commit `77c6655ac2bf341a403da7ef7feb0bb404660475` still changes only `.cursor/plans/architectural_patterns_arc_7a1015f0.plan.md` (`1 insertion, 2 deletions`): YAML quote style and final blank-line removal. Parsed frontmatter before/after is equal, mode stays `100644`, and the blob is byte-identical from `77c6655` through `c244bf0`. No remediation touched it.

## Commit, evidence, and state boundaries

- `c244bf0` contains the eight root-fix paths plus `.omo` final-review evidence, plan synchronization/checkmarks, Boulder progress, and ledger events. No unrelated product path is present.
- The committed F1/F2/F3/F4 and remediation evidence explains the review finding -> failing test -> root fix -> independent review chain. `.omo` remains orchestration state, not shipped engine surface.
- `post-remediation-gate.md` is current untracked orchestration evidence created after the landed commit. It records a clean pre-gate tree at `c244bf0`, one `npm run check` invocation, no retry, exit 0, all 13 stages, 62+1 Vitest files with 844 passed/1 skipped plus 80 passed, expected warning classes only, and matching live graph/recipe measurements.
- Current pre-audit worktree dirt was limited to the orchestrator ledger and that post-gate evidence. Neither is unrelated user/product work, neither was absorbed into `c244bf0`, and both were left untouched.

## Residual risks

- Post-gate repository validation intentionally stripped ignored projection trees after the already-green full gate; the gate evidence records this and assigns restoration to final F3. This is ignored workspace state, not a committed projection or F4 scope violation.
- Historical committed `.omo` evidence retains pre-existing `git diff --check` whitespace diagnostics. Product paths and this owned evidence file are clean.
- Markdown LSP availability is environment-dependent; behavioral confidence comes from the focused 76-test run, live graph queries, exact body hashes, and the recorded full post-remediation gate.

## Cleanup

Only this owned F4 evidence file was updated. No other file was edited; no stage, commit, push, stash, reset, checkout, generated write, or other Git mutation was performed.
