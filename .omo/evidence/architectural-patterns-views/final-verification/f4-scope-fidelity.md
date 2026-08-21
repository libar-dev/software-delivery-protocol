# F4 Scope Fidelity - Final Audit

## Verdict

**APPROVE** for `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d..aa54e86a40943f555f03f8ce57eb32bd0036b0de` on `feature/architectural-patterns-views`.

No blocking or advisory product-scope finding. The one non-Scope-IN product-path delta is the explicitly user-authorized formatting-only recovery at `77c6655`; it is isolated and semantically neutral. `.omo` lifecycle state is classified separately below.

## Independent verification

- Base is the merge base; HEAD is a linear 16-commit descendant on the named branch.
- Focused verification: `npx vitest run test/self-hosting-graph.test.ts test/recipes.test.ts --pool=forks --maxWorkers=1` -> **2 files / 51 tests passed**.
- Live `sdp:q` found 13 components, 12 inter-decision `dependsOn`, 0 `supersedes`, no scheduling edge, and both enriched Specs at stated `defined` with no floor failures.
- Recipe bodies 17/18/19 are byte-exact against the plan bodies (2860/2475/4023 bytes).
- No delta exists under repo `plans/`, `generated/`, or `src/projections/`; no forbidden incidental-plumbing path changed.

## Guardrail matrix

| Guardrail | Result | Proof |
| --- | --- | --- |
| No new relation types | PASS | `src/model/relations.ts`, graph schema, ids, and anchor model are unchanged; base/HEAD `SPEC_RELATION_TYPES` are identical. |
| No reader methods | PASS | `Reader` interfaces are byte-equivalent; the only reader delta is the planned `reader -> model` anchor `uses`. |
| No component semantic change | PASS | Component/anchor semantic implementation files are unchanged; only declarations mint `import` and `testing`. |
| Zero `supersedes`; no scheduling edges | PASS | Live graph has 0 `supersedes`; no authored scheduling relation or scheduling edge type was added. |
| No decision/idea anchors | PASS | All 15 new anchors satisfy non-decision Specs at stated `ready`; live query returned no decision or `idea` target. |
| No incidental-plumbing anchors | PASS | Every Scope-OUT source path is unchanged, including `src/index.ts`, `src/model/code-anchor.ts`, listed extract/CLI/projection/import plumbing, and `new-spec-command.ts`. |
| No committed derived view rendering | PASS | No `generated/` or projection delta; only live-derived recipe source was committed. |
| No `ready` promotion of enriched Specs | PASS | `structural-patterns` and `structural-self-binding` are exactly `idea -> defined`; the only new `ready` line belongs to planned decision MD-34. |
| No engine behavior change | PASS | The complete `src/` diff is declaration-support imports, `codeAnchor` blocks, component/uses fields, and one import-order move; no executable body or public declaration changed. |
| No new repo `plans/` file | PASS | `git diff --name-status ... -- plans/` is empty. |

## Exact scope proof

### Ruling and Spec enrichment

- Added exactly MD-34, its decision Spec, Pack member, and decision/pack oracle entries.
- `spec:model.structural-patterns`: exact planned title/outcome/model terms, MD-34 `decidedBy`, no open questions, `defined`.
- `spec:protocol.structural-self-binding`: exact two planned rules, MD-34 `decidedBy`, no open question, `defined`.

### Relations

- MD-34 adds exactly `refines -> model.anchors` and two `dependsOn` edges to `structural-anchor-semantics` and `binding-not-liveness`.
- Task 8 adds exactly nine adjudicated `dependsOn`: agent-front-door -> agent-surface-scripts-graph; carried-evidence -> content-only-sections/kind-conditional-floor; carrier-universality -> pack-markdown-carrier/prose-ownership; decision-readiness-posture -> kind-conditional-floor; example-realization-posture, structural-anchor-semantics, and verification-posture-not-realization -> binding-not-liveness.
- Its six planned `decidedBy` fills are present on agent-surface, warn-level-signals, core-model, self-hosting, gherkin-authoring, and anchors.
- The three plan-permitted rejected candidates remain absent: carrier-universality -> carrier-ruling, mcp-deferred -> agent-surface-scripts-graph, planning-truths-placement -> shipped-projections-frozen.
- Current inter-decision set is exactly the above 11 branch-added edges plus the base sdp-gherkin-extension -> sdp-ts-extension edge = 12.

### Components, anchors, and structural edges

- Current component allowlist is exactly 13: adapters, cli, codegen, extract, graph, import, model, notation, projections, reader, runner, testing, validate.
- Exactly 15 new anchors exist: components `protocol.import` and `protocol.testing`; implementations `sdp-import-core`, `sdp-import-markdown-emit`, `example-testing-helpers`, `discover-files`, `protocol-bindings`, `delivery-facts`, `example-space`, `graph-index`, `validation-contracts`, `agent-surface-cli`, `census-page-cli`, `mermaid-view-cli`, and `gherkin-view-cli`.
- Existing `impl:protocol.sdp-import` gained only planned import membership.
- Exact new `uses`: cli -> import; import -> extract/model; reader -> model; testing -> adapters/runner.
- Planned `carrier.ts` and `reify.ts` candidates were left unchanged after the plan-authorized target-text mismatch gate; the skip and reasons are recorded in task-5 evidence. `new-spec-command.ts` was likewise intentionally untouched.

### Recipes, tests, and on-ramps

- Recipes 17-19 and recipe-19 parameter list are exact; no reader accessor was introduced.
- `test/recipes.test.ts` has exactly the phrase pins, session ordinal extension, and three live-derived ground-truth blocks requested. Oracle changes are confined to the planned descriptor/shared-roster files and frozen totals.
- On-ramps are exactly the two named skills plus `AGENTS.md` and `README.md`: count 19, literal recipe 17/18/19 routing, and the exact eight-item key-decision list.

## Authorized exception proof

Commit `77c6655ac2bf341a403da7ef7feb0bb404660475` changes only `.cursor/plans/architectural_patterns_arc_7a1015f0.plan.md` (`1 insertion, 2 deletions`): YAML quote style and removal of the final blank line. Parsed frontmatter before/after is deeply equal; file mode remains `100644`. It is a separate commit between recipe tests and `.omo` close checkpoints, matching the explicit user authorization rather than silent scope expansion.

## Orchestration-state classification

- `.omo` baseline-to-HEAD changes are orchestration only: 27 evidence files, 15 task checkbox flips, Boulder registration/progress, and ledger events.
- `1f09c39` and `aa54e86` are `.omo`-only checkpoint/close commits; neither absorbs product files.
- Before this evidence was created, the only worktree delta was three post-HEAD ledger events for close/final-verification startup. It is orchestration state, not an unrelated user/product change, and was left untouched.
- Committed `.omo` evidence contains pre-existing `git diff --check` whitespace diagnostics in several evidence records. This does not affect shipped code or the F4 scope verdict and is not cleaned under this file-only assignment.

## Commit-boundary and cleanup conclusion

All product commits have coherent task-local path sets; task 9 follows landed anchor coverage, shared oracle sync follows tasks 3-9, recipe tests follow oracle sync, and close follows implementation/tests. No unrelated product/user change was absorbed. No stage, commit, push, stash, generated rendering, or cleanup mutation was performed by this audit; the pre-existing ledger delta remains for the parent orchestrator.
