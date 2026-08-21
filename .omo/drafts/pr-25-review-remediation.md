---
slug: pr-25-review-remediation
status: plan-complete-review-unavailable
intent: clear
review_required: true
plan_path: .omo/plans/pr-25-review-remediation.md
plan_sha256: 21998130f2539d49cd4f316e2537c67416338040626351fa68174189aa15f0c8
review_round_id: pr-25-review-remediation-r1-21998130
review_round_limit: 5
pending-action: In a fresh session, invoke ULW-plan high-accuracy review for .omo/plans/pr-25-review-remediation.md. Do not execute the plan until Momus approves the pinned artifact or reviewed corrections produce a new pinned digest.
review:
  metis:
    status: unavailable
    result: plan-gated reviewer refused because start-work was already invoked in this session
  momus:
    status: unavailable
    workspace_root: /home/darkomijic/dev-libar/software-delivery-protocol
    runtime_home: null
    target: .omo/plans/pr-25-review-remediation.md
    round_id: pr-25-review-remediation-r1-21998130
    plan_sha256: 21998130f2539d49cd4f316e2537c67416338040626351fa68174189aa15f0c8
    launch_id: pr25-remediation-momus-r1
    session: null
    result: plan-gated reviewer refused before launch because start-work was already invoked in this session; no Momus session or verdict exists
approach: Repair the PR in four isolated implementation lanes (recipe totality, self-binding audit, OmO recovery policy/evidence, PR hygiene), integrate only verified commits into a task-owned worktree, run one contention-free full gate, then fast-forward the existing PR branch and publish a re-measured PR body.
---

# Draft: pr-25-review-remediation

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
- C1 recipe totality | recipes 1, 11, and 18 group every lawful Spec family without Object-prototype collisions; recipe 19 has a non-empty dependency proof | active | docs/agent-surface/recipes.md, test/recipes.test.ts
- C2 self-binding audit | coarse-grain helper rows verify declaration, direct named import, and executable consumption without deriving architecture edges | active | test/self-hosting-graph.test.ts, test/self-hosting-oracle/structural-edges.ts
- C3 OmO recovery | the 135-event architecture/prior snapshot, 20-event design-law snapshot, and 12-event post-delete close segment are losslessly archived under durable evidence; runtime ledger stays ignored and untouched | active | .omo/evidence/pr-25-review-remediation/, AGENTS.md, .gitignore
- C4 durable state and hygiene | current planning artifacts are tracked, the new Boulder work owns the latest commit pointer, and only the 13 proven trailing-space findings are removed | active | .omo/drafts/, .omo/plans/, .omo/boulder.json, three named evidence files
- C5 PR publication | the live two-wave PR body loses the false whole-branch source claim and unsupported model-history claim, gains the remediation evidence, and re-measures every number at final HEAD | active | PR #25, .omo/evidence/pr-25-review-remediation/
- C6 verification | focused red/green tests, graph queries, type checks, full gate, manual CLI QA, diff hygiene, and independent final reviews all pass without concurrent writers | active | test/, npm run check, pnpm sdp:q, .omo/evidence/pr-25-review-remediation/

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
- Delivery target | extend PR #25 and `feature/architectural-patterns-views`; no new PR or product branch | user explicitly scoped the work to the current PR/branch | no
- Recipe accumulator | use `Object.create(null)` in the three catalog bodies, preserving the existing JSON object shape | smallest fix; `Map` would require a conversion step and offers no consumer benefit | yes
- Lawful regression keys | cover `constructor`, `toString`, `valueOf`, and `hasOwnProperty`; do not test or admit `__proto__`, which `specId` rejects | public ID grammar is the boundary, not JavaScript folklore | yes
- Coarse audit | AST-check the helper declaration, direct named value import (including alias), and non-import identifier use in the covering anchor file | audits an authored row without deriving graph edges from imports, preserving MD-30/MD-34 | yes
- Ledger recovery | archive three immutable source segments under `.omo/evidence/pr-25-review-remediation/ledger/`; never restore or stage `.omo/start-work/ledger.jsonl` | `.omo/start-work` is intentionally ignored and fails temporal checks when tracked; durable evidence is the lawful tracked home | yes
- Historical records | completed plans and substantive historical evidence remain byte-historical; only the 13 exact trailing-space bytes are normalized | fixes diff hygiene without rewriting prior claims or failures | yes
- PR review history | remove unverifiable model-name claims rather than reconstructing missing transcripts | the durable PR must be supportable from committed/GitHub evidence | yes
- LSP | plan no setup/config edits; request live diagnostics first, then rely on clean `tsc`/`npm run check` if the current MCP daemon ownership race persists | user reports binaries/config verified; this session's proxy log shows `owner_pid_live_unreachable` / ownership races | yes
- Extrinsic constraints | no paid services, new dependencies, packaging changes, migrations, capacity targets, or compliance expansion | internal repository remediation on the existing Node/TypeScript toolchain | yes

## Findings (cited - path:lines)
- `docs/agent-surface/recipes.md:99-114,447-463,798-805` uses prototype-bearing `{}` dictionaries for lawful dynamic Spec families. `specId("spec:constructor.demo")` is accepted; recipe 18 exits 1 at `.push`.
- `test/recipes.test.ts` executes all catalog bodies but has no reserved-object-key family fixture; recipe 19's dependency fields are exercised only as empty arrays.
- `spec:decisions.structural-anchor-semantics` is a live non-empty recipe-19 fixture: one outgoing `dependsOn` to binding-not-liveness and two inbound relations from the MD-34/MD-35 decisions, all stated ready.
- `test/self-hosting-graph.test.ts:372-397` validates only the covering anchor's component for coarse rows; it does not check the `row.unit` declaration, import, or use.
- `test/self-hosting-oracle/structural-edges.ts:433` cites `emit-markdown.ts:197-205`; the live `assertMarkdownEmissionFidelity` call is at `src/import/emit-markdown.ts:277`.
- `git diff --check origin/main...HEAD` reports 13 trailing-space findings in exactly `.omo/evidence/architectural-patterns-views/task-3-implementation.md`, `task-8-baseline.md`, and `task-9-implementation.md`.
- Ledger provenance is discontinuous: `5c15962:.omo/start-work/ledger.jsonl` has 135 events (including main's 24-event prefix), `726eb9d` overwrites it to 4, `d8d4e5f` has 20 design-law events, and the current ignored ledger has 12 post-delete close events.
- Immutable ledger source hashes: architecture/prior `6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719`; pre-delete design-law `df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90`; current 12-event design-law close segment `5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1`.
- `.gitignore:25` intentionally ignores `.omo/start-work/ledger.jsonl`; `check-temporal.mjs` exempts tracked `.omo/evidence/` but not runtime state. Re-tracking the runtime path is not a valid repair.
- `AGENTS.md:203-207` requires recoverable OmO state and forbids deleting/overwriting unfamiliar recovery state; the repo guidance does not yet name the runtime-ledger-to-durable-evidence checkpoint.
- The live PR body already contains both waves and final graph counts, but falsely says the whole branch's only `src/` edit is the delivery-facts retarget/comment; the accurate boundary is Wave 2 from `ed77ee7`.
- The live PR body names Grok/Fable hostile reviews without a committed or GitHub review artifact. The security conclusion is independently supportable; the named review history is not.
- `.omo/boulder.json` still points the completed design-law work at `315a0d8`; a new remediation work entry must own the current/final pointer rather than rewriting completed history.
- Current graph is otherwise healthy and unchanged by the planned remediation: 164 Specs, 342 nodes, 760 edges, 13 components, 76 memberOf, 35 uses, 14 inter-decision dependsOn, 46 decidedBy, empty operational backlog.
- TypeScript/Markdown LSP tools remain unavailable in this session because the MCP daemon startup lease is racing; the daemon log confirms a harness ownership problem, not missing language servers.

## Decisions (with rationale)
- Intent is CLEAR. "All fixes and improvements" means every failed-review blocker plus the bounded non-blocking correctness/hygiene improvements named above; unrelated dependency audits and general cleanup stay out.
- High-accuracy review remains required (default-on). One Momus review runs only after explicit approval creates the complete plan.
- Recipe fix is data-structure totality, not ID validation. Lawful IDs are never rejected to accommodate JavaScript object inheritance.
- The valid hostile-key matrix is `constructor`, `toString`, `valueOf`, and `hasOwnProperty`; `__proto__` is excluded because the public `specId` builder rejects it.
- Recipes 1 and 11 join recipe 18 in scope even though their defect predates this PR: the review found the same executable catalog bug and a partial recipe-18-only fix would knowingly ship two identical crashes.
- Recipe 19 gets a live decision-Spec fixture (`spec:decisions.structural-anchor-semantics`) with both inbound and outbound dependency rows; no synthetic graph is needed for that contract.
- Recipe totality and coarse coverage change behavior under test and use failing-first tests. Recipe 19's non-empty dependency assertion is characterization coverage. Ledger/PR/prose changes use checksum, diff, and real-surface QA rather than prose-pinning tests.
- Coarse coverage remains test-local owner state. A test helper uses the existing TypeScript compiler/checker to verify a runtime export, resolved named-import identity (direct, aliased, or barrel), and a non-import value reference; it never infers significance, creates anchors, or emits graph findings.
- Ledger repair is a one-time lossless archive plus repo-local checkpoint guidance. It does not restore the tracked runtime path, change temporal validation, or edit the user-controlled installed start-work skill.
- The alternative advisory proposal to restore a 155-line tracked runtime ledger is rejected: it contradicts the current ignore/temporal boundary and omits the 12 post-delete close events, so it is neither the smallest policy repair nor lossless.
- The durable archive is 167 events in three provenance-preserving segments (135 + 20 + 12), with a manifest that pins source commits, line counts, SHA-256 values, and concatenation order. The segments remain separate or are concatenated only with the manifest's explicit boundaries; no deduplication or chronology inference.
- The current ignored ledger is read-only input. Execution filters its 12 design-law close events by plan id before the new remediation session appends unrelated events.
- Existing completed plans and close evidence remain historical. New remediation evidence carries corrections; the live PR body carries current truth.
- The completed architectural-patterns plan's embedded pre-remediation recipe copy is not edited. The shipped catalog plus the new remediation plan/evidence is current truth; silently rewriting a completed execution record would erase the very review lineage being repaired.
- The approved plan/drafts checkpoint is the only allowed first commit in the current checkout; all product/test/doc remediation then runs in isolated lane worktrees and integrates into a task-owned worktree.
- Execution topology is fixed: the orchestrator commits only approved `.omo` planning artifacts in the current checkout, creates a task-owned integration worktree from that checkpoint, dispatches at least three isolated lanes (recipes, coarse audit, OmO recovery/hygiene), cherry-picks only independently verified commits, runs the serial full-gate/publication tail, then fast-forwards `origin/feature/architectural-patterns-views` without force and updates PR #25. The main checkout receives no product edits.
- The OmO archive paths are `.omo/evidence/pr-25-review-remediation/ledger/architecture-and-prior.jsonl`, `design-law-transfer-pre-delete.jsonl`, `design-law-transfer-post-delete.jsonl`, and `manifest.md`. Source segments are 135, 20, and 12 records, respectively.
- The coarse audit implementation is test-only: a focused helper under `test/helpers/` resolves runtime function exports/import aliases/barrels with the existing TypeScript checker; self-hosting keeps graph membership checks and aggregates helper-audit failures. Focused unit coverage owns missing export, unused/removed import, alias, barrel, and type-only cases.
- The live PR body, not `.omo/evidence/pr-25-design-law-transfer-body.md`, is the publication base. That older prepared body remains historical; execution patches the fetched live body after final remeasurement and stores the exact published replacement under the new remediation evidence directory.
- The big-picture `architect` advisory lane was unavailable because its configured provider returned a billing error. The prior dedicated architecture review, graph evidence, repository explorers, and completed `ultrabrain` detail lane cover the design; no provider/config change enters scope.
- After approval, the harness refused the mandatory Metis gap-analysis spawn because start-work had already been invoked in this session. The complete plan therefore carries root structural/semantic self-review and must not be represented as Metis-reviewed.
- Momus round 1 was also refused by the same session gate before a child session launched. High-accuracy review remains required; the plan is complete but must receive a fresh-session Momus review before `/start-work` execution.

## Scope IN
- `docs/agent-surface/recipes.md` recipes 1, 11, 18 and only the recipe-19 default-id substitution used for tests.
- `test/recipes.test.ts` lawful-family and non-empty dependency regressions.
- `test/self-hosting-graph.test.ts` plus the minimum test helper/import changes needed for AST-backed coarse coverage auditing.
- `test/self-hosting-oracle/structural-edges.ts` stable file/symbol rationales with no line-number promises.
- New durable ledger archive/manifest and remediation evidence under `.omo/evidence/pr-25-review-remediation/`.
- Lean clarifications in `AGENTS.md` and `.gitignore` distinguishing ignored runtime ledger state from durable close evidence.
- Tracking the approved remediation draft/plan and the pre-existing design-law draft without rewriting their content.
- Exact trailing-space cleanup in the three reported evidence files.
- New Boulder work state and final verified commit pointer for this remediation.
- Re-measured PR #25 body update, branch fast-forward push, and current-head evidence.

## Scope OUT (Must NOT have)
- No `src/` engine changes, graph schema changes, reader methods, relation types, validators, projections, dependencies, or package/lockfile changes.
- No Spec carrier, readiness, Pack, anchor, component, uses, or decision-relation changes; no self-hosting oracle total churn.
- No significance inference/classifier from imports or exports, architecture-enforcement validator, or manufactured anchors.
- No rejection/sanitization of lawful IDs and no `__proto__` grammar expansion.
- No restoration, staging, deletion, pruning, or overwrite of `.omo/start-work/ledger.jsonl`.
- No changes to `check-temporal.mjs`, external installed OmO/start-work skills, user LSP configuration, or oh-my-openagent checkout.
- No rewrite of completed plan intent, fail-first evidence, intermediate measurements, or historical reviewer receipts.
- No new PR, no force push, no merge, and no main-branch work.
- No unrelated whitespace, formatting, audit, dependency-vulnerability, or documentation cleanup.

## Open questions
- None currently. The ledger archive/guidance choice is a reversible internal default announced above; the user may veto it at approval.

## Approval gate
status: awaiting-approval
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->

Plan construction is complete and structurally self-checked. The required Momus-only review could not launch because this session's plan gate is closed after an earlier start-work invocation. Open a fresh ULW-plan session, review `.omo/plans/pr-25-review-remediation.md`, and do not implement until that review approves.
