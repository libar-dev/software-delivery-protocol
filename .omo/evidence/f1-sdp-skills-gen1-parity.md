# F1 parity plan compliance audit

Date: 2026-08-20
Task: `sdp-skills-gen1-parity F1`
Verdict: **APPROVE**

## Material reviewed

I read the parity plan, Todo 1 through Todo 5 evidence, the earlier independent Todo 1 verification, `README.md`, both changed skills, and `.agents/skills/sdp-sessions/SKILL.md`.

I queried the graph before assessing carrying law. These four contexts exist, have stated and derived readiness `ready`, and have no findings:

- `spec:consumers.agent-surface`
- `spec:consumers.authoring-on-ramp`
- `spec:consumers.delivery-session-on-ramp`
- `spec:carrier.gherkin-authoring`

## Todo compliance

### Todo 1 passed before Wave 1

The earlier `task-1-sdp-skills-gen1-parity-verification.md` records a real blocked state while plan 37 was still `EXECUTING`. It also records that all three future product paths were clean and that writers were forbidden. The later Todo 1 evidence records the release after closure.

Fresh checks confirm the release conditions:

- The plan-37 record says `Status: ... EXECUTED`.
- The `AGENTS.md` current-plan block says `plan 37 is EXECUTED`.
- `.omo/plans/plan-37-settling-arc.md` has no open top-level checkbox.
- `node check-self-hosting-gates.mjs .` exited 0, printed `currentRecord.status` as `EXECUTED` with no pending docket item, and wrote 0 bytes to stderr.

The two Todo 1 artifacts describe successive states, not conflicting final claims. The first correctly blocked work. The rerun released it only after plan 37 closed.

### Todos 2 through 4 stayed in their assigned files

The final product diff maps one-to-one to the plan:

- Todo 2: `.agents/skills/sdp-agent-surface/SKILL.md`, 5 insertions and 5 deletions.
- Todo 3: `.agents/skills/sdp-authoring/SKILL.md`, 2 insertions and 36 deletions.
- Todo 4: `README.md`, exactly two word substitutions.

`git diff --name-only HEAD -- README.md .agents/skills` lists only:

```text
.agents/skills/sdp-agent-surface/SKILL.md
.agents/skills/sdp-authoring/SKILL.md
README.md
```

The extra `.omo` status entries are plan and reviewer evidence, plus pre-existing orchestration files. They are not product changes.

### Todo 5 passed

Todo 5 evidence records `npm run check` passing twice:

- 12:49:23 to 12:51:52, exit 0
- 12:55:17 to 12:57:42, exit 0

Both runs completed every listed leg, including the full tests, self-hosting checks, and preflight. The second run occurred after the recovery evidence was staged.

Fresh read-only QA also passed:

```text
npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts test/package-smoke.test.ts
Test Files  4 passed (4)
Tests       56 passed (56)
```

The real CLI probes produced:

```text
pnpm --silent sdp --help
exit 0; first line: sdp - Libar Software Delivery Protocol

pnpm --silent sdp:q 'return { specs: g.specs().length, packs: g.packs().length }' --json
{"specs":156,"packs":1}

pnpm --silent sdp:q 'console.log("side-output"); return "value"'
side-output
'value'

pnpm --silent sdp:q 'throw new Error("qa-sentinel")'
exit 1; stderr contains qa-sentinel; stdout is empty
```

`npm pack --dry-run --json` lists exactly the three existing skill files and `docs/agent-surface/recipes.md`. It contains no `sdp-base` or `references/` path.

## Exact requirement checks

### Graph-read stdout contract

The read skill now says that `return` is the machine output contract and that `sdp q` does not suppress `console.*`. It tells machine-consumed bodies and shipped recipes to avoid console output. The console probe above confirms the unchanged runtime behavior.

The file remains 119 lines, the same as HEAD. It still has five level-two sections, exactly two adopter `pnpm exec sdp q` examples, two source-checkout `pnpm --silent sdp:q` examples, the `g` / `graph` / `report` bindings, trusted-code warning, graph-over-anecdote rule, and claim, readiness, and delivery-fact distinctions.

### Authoring skill deletion

The authoring skill fell from 196 lines at HEAD to 162 lines. It no longer contains:

- `files.associations`
- pinned `@cucumber/gherkin@...` or `@cucumber/messages@...` versions
- the copied eight-rule Gherkin grammar

It keeps `.sdp.gherkin` as the canonical suffix, the one-carrier-per-ID rule, and points to `spec:carrier.gherkin-authoring` for the closed grammar.

The retained workflow still covers backlog and drift orientation, `sdp new spec`, the constraint exception, honest readiness and promotion preflight, one-kind splitting, `sdp validate --watch`, parent vocabulary and child points, contract generation, `bindExample`, `specTest`, `contract-dependent-suites.mjs`, mutation probing, the unbound-contract graph blind spot, identity-only `codeAnchor` binding, and human Design Review without an automatic gate.

### README counts

`docs/agent-surface/recipes.md` has 16 contiguous numbered recipe headings. The README diff changes only:

```text
eleven graph-first recipes -> sixteen graph-first recipes
eleven recipe bodies -> sixteen recipe bodies
```

The same paragraph still names only `sdp-agent-surface`, `sdp-authoring`, and `sdp-sessions`.

## Guardrails and unchanged surfaces

- No new section was added to the read skill.
- No standalone guide, fourth skill, `references/` directory, third adopter example, new executable invocation through a bare global `sdp`, `bySymbol`, recipe, or runtime/product change was added.
- No path under `src/`, `specs/`, `docs/agent-surface/`, `generated/`, `test/`, `package.json`, or `AGENTS.md` differs from HEAD.
- The installed topology remains exactly `sdp-agent-surface`, `sdp-authoring`, and `sdp-sessions`.
- `.agents/skills/sdp-sessions/SKILL.md` is byte-for-byte HEAD. Both SHA-256 values are `5fafa9c8cd309362b82fa1f42a78a6afc4386f366a6bbd283d4eb2cf7cbb328e`.
- `git diff --check` exits 0.

## Commit check

No parity commit was made. HEAD remains `8df0d8096b476408ec364b884155537d74c7603e`, the plan-37 F5 commit recorded by Todo 5, and equals `origin/feature/sdp-skills`. The parity product edits remain uncommitted working-tree changes.

## Verdict

**APPROVE**
