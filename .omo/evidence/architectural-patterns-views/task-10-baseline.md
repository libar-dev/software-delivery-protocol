# Task 10 baseline / failing Manual QA — Append recipes 17–19

Work: `architectural-patterns-views` · plan todo 10.
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
Branch: `feature/architectural-patterns-views`
HEAD: `723bf95c9975303cef5896c8b97f454e1786a3aa`
Scope of this slice: this evidence file only. Catalog, tests, plan checkboxes, Boulder, and ledger were not edited. No commit, no push.

`CONTEXT.md` (ratified glossary) was read before naming terms. Queries below speak `Spec`, `Pack`, `claim`, delivery facts, stated vs derived readiness, blast radius. Recipe 17/18/19 bodies were executed as operator-authored JavaScript against the derived graph (`g` / `graph`); they were not treated as corpus law.

## Baseline characterization (catalog + tests, pre-append)

### Recipe heading ordinals (contiguous 1–16)

Observed from `docs/agent-surface/recipes.md` (working tree and `HEAD` identical; `git hash-object` `ed65f297dce271251066f0d9e80d204c02968103`):

1. The build backlog
2. The drift alarm
3. What does this Spec guarantee, and who verifies it
4. What breaks if I change these files
5. The Pack review backbone
6. Where is this concept
7. Readiness divergence
8. Orphans and gaps
9. Promotion preflight
10. Declared versus enabled verifiers
11. The lower ladder
12. Component membership
13. Uses fan-in and fan-out
14. Structural neighborhood
15. Census structural coverage
16. Projection coverage upper bound

Current count: **16** numbered `## N. …` headings. Last heading is line 623: `## 16. Projection coverage upper bound`.

### Intro parameterized list

Line 35 is still:

`**Some recipes open with a parameter.** Recipes 3, 6, 9, and 14 take their subject on the opening`

Plan todo 10 requires this list to become `Recipes 3, 6, 9, 14, and 19`. That substitution is **absent**.

### Generic body rules (catalog prose + `test/recipes.test.ts`)

Catalog lines 54–56: a body is a plain JavaScript async function body — no `import`/`export`, no TypeScript-only syntax; `await` is allowed; `--json` is `JSON.stringify`.

`test/recipes.test.ts` generic checks (must stay green on the 16-recipe catalog):

- pairs every documented recipe with exactly one fenced body; ordinals equal `[1..N]`
- every body includes `return `; no leading `import`/`export`; **no single quotes**
- on-ramp sync: parameterized intro ordinals equal recipes whose body opens `const id|term|subject =` except recipe 4
- sessions ordinal loop still `[12,13,14,15,16]` (task 11 owns `[17,18,19]`)
- phrase pins stop at the structural/projection slice (no "architecture map" / "decision map" / "planning slice")

`it(` count in `test/recipes.test.ts`: **22**.

## Baseline suite (must be green before any catalog edit)

Command:

```bash
npx vitest run test/recipes.test.ts
```

Result (one run, as required):

```
Test Files  1 passed (1)
     Tests  22 passed (22)
  Duration  3.82s
```

Exit 0. This is the **16-recipe** corpus: pairing, body rules, and per-recipe ground truth through recipe 16. It is **not** evidence that recipes 17–19 exist in the catalog.

## Failing Manual QA channel — catalog surface

The `read` tool was invoked on `docs/agent-surface/recipes.md` (full file, intro, last heading, and line 80). Every invocation returned `Offset undefined is beyond file length (0 lines)` / empty, so it could not be the observation channel. Catalog observation was taken with Grep content mode over the same path (and confirmed with `grep -nE '^## [0-9]+\. '` / exact `grep -Fxc`).

Exact desired headings (plan todo 10):

| Heading | Working tree matches | `HEAD` matches |
|---|---|---|
| `## 17. Architecture map` | **0** | **0** |
| `## 18. Decision map` | **0** | **0** |
| `## 19. Planning slice` | **0** | **0** |

Grep for `## 1[7-9]\.|Architecture map|Decision map|Planning slice` in `docs/agent-surface/recipes.md`: **no matches**.

This observable absence **is** the failing real documentation surface. The catalog stops at 16. Task 11 must not be used to paper over this: no new test expectations were added.

## Engine can run the plan-supplied bodies (catalog unaltered)

Bodies extracted verbatim from `.omo/plans/architectural-patterns-views.md` (Recipe 17/18/19 fenced blocks, heading line stripped). Each body: `return ` present, `import`/`export` absent, single-quote count 0.

Invocations (argv body, repository wrapper, `--json`):

```bash
pnpm --silent sdp:q '<plan body 17>' --json
pnpm --silent sdp:q '<plan body 18>' --json
pnpm --silent sdp:q '<plan body 19>' --json
```

| Body | exit | stderr | JSON | Non-null shape |
|---|---|---|---|---|
| 17 Architecture map | 0 | empty | parsed object | `{ components }` length **11**; ids include `component:protocol.adapters` … `component:protocol.validate`; **no** `component:protocol.import` / `component:protocol.testing` (widening todos not this slice) |
| 18 Decision map | 0 | empty | parsed object | `{ total: 34, ranking, decisions }`; `decisions.length === 34`; ranking top `spec:decisions.binding-not-liveness` `fanIn: 1` |
| 19 Planning slice | 0 | empty | parsed object | `id: spec:consumers.agent-surface`, `found: true`, parent `spec:consumers.projections-model`, 6 children, 2 enabled example verifiers (`declared`), 1 component `component:protocol.reader`, `blastRadiusLimit` file-level only |

No genuine body defect: all three returned non-null JSON with empty stderr. This proves the **engine** can evaluate the supplied joins. It does **not** place headings 17–19 in the catalog.

## Adversarial probes

- **stale_state**: PASS as a probe, fail as the desired surface. `HEAD` heading count 16 equals working-tree 16; `git diff -- docs/agent-surface/recipes.md test/recipes.test.ts` empty. The missing 17–19 headings are the current committed catalog, not a stale editor buffer.
- **dirty_worktree**: PASS for this slice's product files. `docs/agent-surface/recipes.md` and `test/recipes.test.ts` are clean. Sibling dirty paths (not this task): `.omo/boulder.json`, `.omo/plans/architectural-patterns-views.md`, `.omo/start-work/ledger.jsonl`, `test/self-hosting-oracle/model.ts`; untracked `task-1-normal-branch.md`. This evidence file is the only new path from this slice.
- **generated-or-cached**: N/A for the failing catalog proof — headings were read from the authored Markdown, not from `generated/`. `sdp q` is a write-nothing sink (`src/cli/q-command.ts`). `generated/graph.json` is untracked/gitignored; mtime moved during the vitest/`sdp:q` window and was not used as catalog evidence. `dist/cli/sdp.js` exists (mtime 2026-08-20 20:50); queries used that built CLI.
- **flaky_tests**: N/A — suite executed **once** per the task; 22/22 pass; no retry, no intermittent failure to record.
- **misleading_success_output**: PASS (probe). Vitest "22 passed" is the **16-recipe** suite. Engine `sdp:q` exit 0 on the three plan bodies is **not** catalog presence. The failing channel is the missing exact headings, independently counted at 0.

## Cleanup

Removed `/tmp/sdp-task10-recipe-{17,18,19}.{js,out.json,err.txt}` after capturing the summaries above. No catalog/test/state leftover. No commit, no push.

## Completion gates for this baseline slice

- Baseline suite green: **yes** (`22 passed`).
- Desired catalog surface demonstrably absent: **yes** (exact headings 17–19 count 0; last heading is 16).
- All three supplied bodies execute with non-null JSON: **yes** (no body defects).
- Evidence-only diff: **yes** (this file).
