# sdp-skills-gen1-parity - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** A truthful graph-read skill, a shorter authoring skill, and an unchanged session router whose current design already fits the lean first version. The public README will match the sixteen executable recipes.

**Why this approach:** Gen 1 is useful for routing discipline and graph-first habits, not for its topology or workflow machinery. SDP already has the right read, write, and session split, so this plan removes duplication instead of adding another skill.

**What it will NOT do:** It will not add a base skill, reference tree, runtime feature, recipe, workflow gate, or new product law. It will not start until the active plan-37 measurement is closed.

**Effort:** Short
**Risk:** Low - the product runtime, tests, package topology, and session router stay fixed; the main risk is deleting authoring guidance that an agent still needs.
**Decisions to sanity-check:** Keep exactly three single-file skills; leave `sdp-sessions` unchanged; defer execution until plan 37 closes.

Your next move: after the required high-accuracy review passes, run `/start-work sdp-skills-gen1-parity`. Full execution detail follows below.

---

> TL;DR (machine): Short, low-risk guidance correction; five todos edit two skills and README, preserve sessions/tests/package topology, and verify the real source and installed surfaces.

## Scope
### Must have
- Keep the published three-skill topology unchanged: `sdp-agent-surface` for graph reads, `sdp-authoring` for carrier and binding work, and `sdp-sessions` for advisory work-shape routing.
- Keep all three skills as single files. `sdp-sessions` stays byte-for-byte unchanged because it already provides the lean Gen 1-inspired routing this request needs.
- `sdp-agent-surface` keeps the source-checkout and adopter invocation split, the `g` / `graph` / `report` contract, trusted-code warning, claim and delivery-fact distinctions, graph-over-anecdote rule, frozen entry adapters, and the shared recipe catalog. Correct the stdout claim without adding a section or growing the file.
- Correct the query-output guidance: `return` is the documented machine-output contract, but `sdp q` does not suppress `console.*`; machine-consumed bodies and shipped recipes must avoid console output.
- `sdp-authoring` keeps the shortest complete path: orient through the graph, create a carrier, validate while editing, state only an honest readiness rung, make examples executable, bind implementation, and review. Replace copied Gherkin grammar, editor setup, and parser-version prose with carrying-Spec ids.
- Fix both public README references from eleven to sixteen recipes while preserving the current three-skill on-ramp description.
- Preserve the existing skill, recipe, CLI, and package tests unchanged. The edits must retain every current machine-checked command form, required token, recipe cardinality, package asset, and frontmatter rule.
- Start execution only after plan 37 is closed and its K measurement verdict is recorded.
### Must NOT have (guardrails, anti-slop, scope boundaries)
- No `sdp-base`, `sdp-graph-handle`, fourth skill, renamed skill, or `references/` directory.
- No edit under `src/`, `specs/`, `docs/agent-surface/`, `generated/`, `package.json`, or `AGENTS.md`.
- No new carrying Spec, recipe, query verb, reader accessor, projection, context bundle, MCP surface, package entry, or runtime behavior.
- No Gen 1 PatternGraph vocabulary, `@architect-*` taxonomy, folder-promotion ladder, FSM, scope gate, unlock reason, design-Spec deletion rule, MCP routing, `bySymbol`, or skill-local recipe copy.
- No test that pins prose sentences, section wording, recipe-count words, prompt text, or skill-document semantics. Test only machine-consumed frontmatter, commands, links where present, executable recipe bodies, and shipped-copy equality.
- No test edits. Existing phrase pins are pre-existing constraints to preserve, not a reason to add more wording tests.
- No dense formatting used only to claim concision. Plain language and readable code fences win over squeezing content.
- No historical-plan edits and no change to plan 37 while it is closing.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none added. The changes are prose-only and the existing Vitest suites already exercise frontmatter, command forms, recipes, and packed assets. Run those suites after each edit; do not add or rewrite wording tests.
- Focused gate: `npm test -- --run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts test/package-smoke.test.ts`.
- Full gate: `npm run check`.
- Packaging gate: `npm pack --dry-run --json` must list the same three `SKILL.md` files and `docs/agent-surface/recipes.md`, with no `sdp-base` or skill reference tree.
- Manual QA: run the real source-checkout CLI through `--help`, one successful JSON query, one query with console output, and one throwing body. Use the existing package-smoke suite as the installed-tarball QA.
- Evidence: `.omo/evidence/task-<N>-sdp-skills-gen1-parity.md`; final reviewers write `.omo/evidence/final-<N>-sdp-skills-gen1-parity.md`.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.
- **Wave 0, read-only close gate:** confirm plan 37 is fully executed before any in-scope edit. This single gate is intentionally serial because every writer depends on its result.
- **Wave 1, three parallel writers:** correct `sdp-agent-surface`, slim `sdp-authoring`, and synchronize README. No task shares a file.
- **Wave 2, single integration tail:** run the focused, full, and package gates after Wave 1 merges. It is intentionally one todo because it owns no edits and all checks observe the same merged tree.
- **Final verification wave:** four fresh reviewers run in parallel after todos 1-5 and must all approve.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | - | 2, 3, 4 | - |
| 2 | 1 | 5 | 3, 4 |
| 3 | 1 | 5 | 2, 4 |
| 4 | 1 | 5 | 2, 3 |
| 5 | 2, 3, 4 | F1-F4 | - |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [ ] 1. Wait for plan 37 to close cleanly
  What to do / Must NOT do: Before editing any in-scope file, verify that plan 37 completed its remaining owner-ratification, K measurement, close record, independent review, final gate, and status flip. Require `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` and the current-plan entry in `AGENTS.md` to say `EXECUTED`, and require `node check-self-hosting-gates.mjs .` to exit 0. Record the exact status lines and command output. Must NOT advance plan 37, edit its records, infer closure from one completed todo, or start this plan while any plan-37 task still measures the current skill guidance.
  Parallelization: Wave 0 | Blocked by: - | Blocks: 2, 3, 4
  References (executor has NO interview context - be exhaustive): `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md:1-24` execution status and frozen scope; `.omo/plans/plan-37-settling-arc.md` open todos 16-20 and final verification wave; `.omo/evidence/plan-37-k-measurement/definition.md:205-213` current skill chains as corroborating evidence; `check-self-hosting-gates.mjs` current-record gate; `AGENTS.md` current-plan status block.
  Acceptance criteria (agent-executable): both plan-37 status sources contain `EXECUTED`; `node check-self-hosting-gates.mjs .` exits 0 with empty stderr; `git status --short` shows no live plan-37 edit that overlaps the three files this plan will change.
  QA scenarios (name the exact tool + invocation): happy, run `node check-self-hosting-gates.mjs .` and read both status lines before releasing Wave 1; failure, if either source still says `EXECUTING`, any plan-37 todo or final verifier is open, or the gate exits non-zero, stop with this todo pending and make no file edit. Evidence `.omo/evidence/task-1-sdp-skills-gen1-parity.md`.
  Commit: N | read-only gate
  Recommended task executor category: `quick` - a mechanical status and gate check with no edits.

- [ ] 2. Correct the graph-read skill's stdout contract
  What to do / Must NOT do: Make a surgical edit to `.agents/skills/sdp-agent-surface/SKILL.md`. Keep its frontmatter, bootstrap, exactly two adopter `pnpm exec sdp q` examples, at least one source-checkout `pnpm --silent sdp:q` example, sixteen-recipe description, five structural phrases, `g` / `graph` / `report` contract, trusted-code warning, claim/readiness/delivery-fact distinctions, anti-anecdote rule, and refused actions. Replace the false statement that `return` means nothing else prints with the observed contract: `return` is the machine output contract, but the runtime does not suppress `console.*`, so machine-consumed bodies must avoid console output. Tighten nearby prose if needed so the file does not grow. Must NOT add a section, standalone guide, third adopter example, bare `sdp`, `bySymbol`, recipe, product change, or copied carrying law.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5 | Can parallelize with: 3, 4
  References (executor has NO interview context - be exhaustive): `.agents/skills/sdp-agent-surface/SKILL.md:1-120`, especially bootstrap `:14-47`, catalog `:48-59`, output overstatement `:60-75`, anti-anecdote and refusals `:83-120`; `src/cli/q-command.ts:73-82` compilation and `:240-275` execution/rendering; `specs/consumers/agent-surface.sdp.md:13-26`; `test/skills.test.ts:116-140,218-270`; `test/recipes.test.ts:259-368`.
  Acceptance criteria (agent-executable): `npx prettier --check .agents/skills/sdp-agent-surface/SKILL.md` exits 0; `npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts` exits 0; the file no longer contains `nothing else is printed`; every existing skill and recipe contract test remains unchanged and green; `git diff --stat -- .agents/skills/sdp-agent-surface/SKILL.md` shows no net line growth.
  QA scenarios (name the exact tool + invocation): happy, run `pnpm --silent sdp:q 'return g.specs().length'` and confirm exit 0 with a number; failure/honesty, run `pnpm --silent sdp:q 'console.log("side-output"); return "value"'` and confirm stdout still contains both `side-output` and the rendered return, proving the skill now describes the unchanged runtime. Evidence `.omo/evidence/task-2-sdp-skills-gen1-parity.md`.
  Commit: N | no commit without explicit user authorization
  Recommended task executor category: `writing` - one small truth correction in a user-facing skill.

- [ ] 3. Remove duplicated carrier law from authoring guidance
  What to do / Must NOT do: Slim `.agents/skills/sdp-authoring/SKILL.md` by deleting only the duplicated Gherkin carrier grammar, editor `files.associations` example, and pinned `@cucumber/gherkin` / `@cucumber/messages` version guidance. Replace those blocks with a short operational pointer to `spec:carrier.gherkin-authoring`, while keeping the canonical `.sdp.gherkin` suffix and one-carrier-per-id warning. Preserve every behavior required by `spec:consumers.authoring-on-ramp`: backlog and drift orientation; `sdp new spec`; cheap idea shape; `constraint` no-twin exception; promotion preflight; one-kind and split-straddling-fact rule; `sdp validate --watch`; parent example space, child bound point, `sdp build`, `bindExample`, `specTest`, `contract-dependent-suites.mjs`, mutation probe; graph blind spot for unbound contracts; identity-only anchors; Design Review without a gate. Preserve current command cardinality and keep `new` / `validate` in prose rather than adding shell fences. Must NOT rewrite the whole skill, create references, remove an existing test token, mention dashed `--dry-run`, or move carrier law into another guidance file.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5 | Can parallelize with: 2, 4
  References (executor has NO interview context - be exhaustive): `.agents/skills/sdp-authoring/SKILL.md:1-197`; carrying workflow `:33-92,138-197`; duplicated Gherkin/editor/parser blocks `:93-137`; `specs/consumers/authoring-on-ramp.sdp.md:13-18`; `specs/carrier/gherkin-authoring.sdp.md:13-26`; `test/skills.test.ts:142-172,207-241`; `test/recipes.test.ts:259-356`.
  Acceptance criteria (agent-executable): `npx prettier --check .agents/skills/sdp-authoring/SKILL.md` exits 0; `npx vitest run test/skills.test.ts test/recipes.test.ts` exits 0; the final file is shorter than its 197-line baseline; it contains no `files.associations`, `@cucumber/gherkin@`, `@cucumber/messages@`, or copied eight-rule grammar; all existing authoring keep-token and command-cardinality tests pass unchanged.
  QA scenarios (name the exact tool + invocation): happy, run `pnpm --silent sdp:q 'const c = g.specContext("spec:consumers.authoring-on-ramp"); return { found: c !== undefined, readiness: c?.statedReadiness, findings: c?.findings ?? [] }' --json` and confirm ready context with no findings; failure, run `pnpm --silent sdp new spec ../forbidden.sdp.md --id spec:qa.forbidden --kind behavior --altitude story --title "Forbidden" --outcome "Must not write outside root"` and confirm non-zero exit with no outside-root file. Evidence `.omo/evidence/task-3-sdp-skills-gen1-parity.md`.
  Commit: N | no commit without explicit user authorization
  Recommended task executor category: `writing` - one deletion-focused edit whose carrying workflow is already pinned.

- [ ] 4. Correct both public recipe counts
  What to do / Must NOT do: Change only the two live README recipe-count phrases from eleven to sixteen. Preserve the nearby source-checkout commands, installed-package guidance, and the exact three on-ramp names. Derive sixteen from the numbered catalog, not from an old plan. Must NOT edit `AGENTS.md`, historical plan prose, CLI examples, package metadata, tests, or any skill.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 5 | Can parallelize with: 2, 3
  References (executor has NO interview context - be exhaustive): `README.md:26-33` source-checkout recipe pointer; `README.md:142-150` installed-package on-ramp paragraph; `docs/agent-surface/recipes.md` numbered headings 1-16; `test/recipes.test.ts` ordinal-contiguity parser.
  Acceptance criteria (agent-executable): `npx prettier --check README.md` exits 0; the two live phrases say `sixteen graph-first recipes` and `sixteen recipe bodies`; the paragraph still names only `sdp-agent-surface`, `sdp-authoring`, and `sdp-sessions`; `git diff -- README.md` contains only the two count substitutions.
  QA scenarios (name the exact tool + invocation): happy, count the catalog's numbered headings with a repository file read and confirm 16 before reviewing both README edits; failure, run `npx vitest run test/recipes.test.ts` and treat any non-contiguous or non-16 catalog result as a blocker rather than forcing README to a stale number. Evidence `.omo/evidence/task-4-sdp-skills-gen1-parity.md`.
  Commit: N | no commit without explicit user authorization
  Recommended task executor category: `quick` - two exact substitutions in one file.

- [ ] 5. Run the merged skill and package gates
  What to do / Must NOT do: After todos 2-4 merge, verify the complete three-file diff without editing tests, package metadata, sessions, or product code. Re-read both changed skills against their carrying Specs and confirm `.agents/skills/sdp-sessions/SKILL.md` is byte-for-byte unchanged from the pre-plan baseline. Run focused tests, the full repository gate, package dry-run, and the real CLI probes. Record outputs and the final changed-file list. Must NOT fix a failure outside the three planned files unless it is proven to be caused by these edits; report pre-existing failures separately.
  Parallelization: Wave 2 | Blocked by: 2, 3, 4 | Blocks: F1-F4 | Can parallelize with: -
  References (executor has NO interview context - be exhaustive): changed files from todos 2-4; `specs/consumers/agent-surface.sdp.md:13-26`; `specs/consumers/authoring-on-ramp.sdp.md:13-18`; `specs/consumers/delivery-session-on-ramp.sdp.md:13-20`; `test/skills.test.ts`; `test/recipes.test.ts`; `test/cli-q.test.ts`; `test/package-smoke.test.ts`; `package.json:11-17`; `AGENTS.md` documented green gate.
  Acceptance criteria (agent-executable): `npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts test/package-smoke.test.ts` exits 0; `npm run check` exits 0; `npm pack --dry-run --json` lists the same three skill files and recipe catalog with no new skill path; `git diff --name-only` lists exactly `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-authoring/SKILL.md`, and `README.md`; `git diff --check` exits 0.
  QA scenarios (name the exact tool + invocation): happy, run `pnpm --silent sdp --help`, `pnpm --silent sdp:q 'return { specs: g.specs().length, packs: g.packs().length }' --json`, and the focused package smoke, then read the actual outputs; failure, run `pnpm --silent sdp:q 'throw new Error("qa-sentinel")'` and confirm non-zero exit, then inspect package dry-run for any fourth skill or reference path and reject the diff if one appears. Evidence `.omo/evidence/task-5-sdp-skills-gen1-parity.md`.
  Commit: N | no commit without explicit user authorization
  Recommended task executor category: `unspecified-low` - merged verification across existing commands with no design work.

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
  Review every changed hunk against todos 1-5 and the draft decisions. Confirm the plan-37 start gate was honored, all acceptance and failure scenarios have evidence, `sdp-sessions` and package topology are unchanged, and no accepted authoring behavior was deleted. Run `git diff --check` and inspect `git diff --name-only`. APPROVE only when all plan rows are satisfied.
- [ ] F2. Code quality review
  Compare the changed skills with `CONTEXT.md` and their carrying consumer Specs. Check plain language with the unslop rules, no copied carrier law, no contradictory claim/readiness/delivery-fact wording, and no new workflow language. Confirm the unchanged tests still cover every required token and command form. Run `npm run lint`, `npm run format:check`, and the focused Vitest command. APPROVE only on clean exits and a finding-free semantic review.
- [ ] F3. Real manual QA
  Use the deliverable through the documented source surface. Run `pnpm --silent sdp --help`; a successful source query with `--json`; the console-output probe; and a throwing query body. Run the existing package-smoke suite and read its disposable-consumer install, installed CLI help/import, and installed skill checks. APPROVE only when happy, bad-input, help, and installed-package paths match the guidance.
- [ ] F4. Scope fidelity
  Require the changed-file set to be exactly `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-authoring/SKILL.md`, and `README.md`. Confirm no new file under `.agents/skills`, no protected-path change, no growth in the read skill, a net deletion in authoring, `npm run check` exit 0, and unchanged packed non-`dist` assets. APPROVE only when the implementation is the accepted small first version.

## Commit strategy
- No commits are authorized by this plan. The executor leaves a verified working-tree diff and asks separately if the user wants commits, a worktree, or a PR.
- If the user later authorizes commits, use one verified documentation commit for the complete lean skill correction. Do not split mutually dependent guidance changes into misleading commits.

## Success criteria
- The repository still exposes exactly three SDP skills with the same names and jobs.
- `sdp-sessions` and all test/package files are unchanged.
- The read skill tells the truth about console output without growing or adding a new reader method, recipe, or section.
- The authoring skill contains one complete executable workflow and delegates grammar and law to carrying Specs instead of copying them.
- The authoring skill is shorter than its 197-line baseline and retains every current behavior and command test.
- README reports the executable catalog's sixteen recipes.
- Existing focused tests, `npm run check`, package dry-run, and real CLI QA are clean.
- The diff touches exactly the two skill files and README, with no new skill or product behavior.
