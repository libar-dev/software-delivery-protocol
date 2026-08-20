# F2 code quality review: sdp-skills-gen1-parity

Reviewer: omo senpi-task child `st_01a01ed4`, read-only.
Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol`
Branch: `feature/sdp-skills`
HEAD: `8df0d80 chore(.omo): plan 37 F5 PR opened`

## Verdict

`APPROVE`

No severity findings. The three product hunks are small, honest, and token-preserving. I would ship this as guidance quality.

## Scope I actually read

`git diff HEAD` on product paths is exactly:

```text
.agents/skills/sdp-agent-surface/SKILL.md
.agents/skills/sdp-authoring/SKILL.md
README.md
```

```text
 .agents/skills/sdp-agent-surface/SKILL.md | 10 +++++-----
 .agents/skills/sdp-authoring/SKILL.md     | 38 ++---------------------------------
 README.md                                 |  4 ++--
```

`git diff --check` on those paths is empty. Tests, `src/`, `docs/agent-surface/`, `package.json`, `AGENTS.md`, and `.agents/skills/sdp-sessions/` have no diff vs HEAD.

Working-tree extras (`.omo/boulder.json`, plan evidence, the ultrawork note) are orchestration, unread for this verdict.

## Findings

None.

## The three hunks

**Read skill.** One paragraph. It drops the false "nothing else is printed" claim, including the em dash that carried it, and states the runtime `src/cli/q-command.ts` actually implements: `return` is what the sink renders, `console.*` is not intercepted, so machine-consumed bodies and shipped recipes must stay quiet. `--root` / `--exclude` moved into that same paragraph. Line count stays 119. No new section, no third adopter example, no bare `sdp`.

That is the only sentence in the file that was wrong. They did not take the edit as an excuse to rewrite the rest. Good.

**Authoring skill.** 196 lines to 162. The deleted block is the copied eight-rule Gherkin grammar, the `files.associations` JSON, and the `@cucumber/gherkin@` / `@cucumber/messages@` pins. What remains is the `.sdp.gherkin` suffix rule, the one-carrier-per-id warning, and a pointer to `spec:carrier.gherkin-authoring` for the closed grammar. README already owns editor association and parser pins, so this is deletion of a second copy, not a move of law into another guidance file.

The carrying workflow is still in the file: backlog and drift orientation, `sdp new spec`, cheap-idea shape, `constraint` no-twin exception, promotion preflight, one-kind split, `sdp validate --watch`, parent example space, child bound point, `sdp build`, `bindExample`, `specTest`, `contract-dependent-suites.mjs`, mutation probe, unbound-contract blind spot, identity-only anchors, Design Review without a gate.

**README.** Two substitutions, eleven to sixteen, derived from the live catalog (`## 1.` through `## 16.` in `docs/agent-surface/recipes.md`). The three on-ramp names are untouched.

## Structural tokens and tests

Shell-fenced command cardinality is identical to HEAD:

- `sdp-agent-surface`: 2 `pnpm exec sdp q`, 2 `pnpm --silent sdp:q`
- `sdp-authoring`: 2 `pnpm --silent sdp:q`, 2 `pnpm exec sdp q`
- `sdp-sessions`: 1 `pnpm --silent sdp:q`, 2 `pnpm exec sdp q`

Frontmatter is still `name` + `description` only. Required authoring keep-tokens from `test/skills.test.ts` are all present. Forbidden remnants (`files.associations`, `@cucumber/gherkin@`, `@cucumber/messages@`, `--dry-run`, `nothing else is printed`) are absent from both skills. Recipe-count pins still match: `catalog contains sixteen ready-made bodies`, `Recipes 1-16`, and the five structural phrases (component membership through projection-coverage upper bound).

`git diff HEAD -- test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts` is empty. The suites were not weakened. They still pin machine-consumed commands, frontmatter, keep-tokens, and recipe cardinality, not the new stdout sentence.

Claim / readiness / delivery-fact wording in the unchanged "What not to do" list still matches `CONTEXT.md`: `declared` / `anchored` / `inferred` stay uncollapsed, `statedReadiness` vs `derivedReadiness`, `has-verifier` is existence not pass, `implemented` is a binding not liveness, delivery facts are not authored. No new workflow language. `bySymbol` was not introduced.

## `sdp-sessions`

Byte-for-byte HEAD. Both hashes `48cfa546fd93747398e8b50fb55344e6351b7fa1`.

It still names recipes 1 through 16 in the five advisory shapes, points at `sdp-authoring` for `sdp new spec` and `validate --watch`, and keeps the negative contract ("never authorize, block, scope, unlock", "never create a process state machine"). After the README count fix and the authoring slim, that file is still the lean router the other two skills assume. No drift against `spec:consumers.delivery-session-on-ramp`.

## Unslop

Added lines only: no em dash, no AI vocabulary, no "not just X but Y", no copied carrier law, no fourth skill, no workflow-gate invention. New prose names `return`, `console.*`, `util.inspect`, `--json`, `--root`, `--exclude`, and `spec:carrier.gherkin-authoring`. Plain speech.

## Gates

```text
npx prettier --check .agents/skills/sdp-agent-surface/SKILL.md \
  .agents/skills/sdp-authoring/SKILL.md README.md
```

Exit 0. `Checking formatting... All matched files use Prettier code style!`

```text
npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts
```

Exit 0. 3 files passed, 55 tests passed, 5.36s.

```text
npm run lint
```

Exit 0 (`eslint .`). Extra against the F2 command list, run because the plan row also asked for lint.

## Carrying Specs

`spec:consumers.agent-surface` still wants a pre-shaped return as the printed answer. The skill now admits `console.*` can share stdout. That is not a contradiction: the Spec describes a well-behaved body, the skill tells authors not to pollute the stream. `spec:consumers.authoring-on-ramp` still has a complete path in the slimmer file. `spec:consumers.delivery-session-on-ramp` is untouched because sessions is untouched.

## DoneClaim

```json
{
  "task": "st_01a01ed4 / sdp-skills-gen1-parity F2",
  "verdict": "APPROVE",
  "changed_files": [
    ".omo/evidence/f2-sdp-skills-gen1-parity.md"
  ],
  "tests": "npx prettier --check on the three product files exit 0; npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts 3 files 55 passed; npm run lint exit 0",
  "manual_qa": "read-only diff review vs HEAD 8df0d80; sdp-sessions hash 48cfa546 identical; command fences identical to HEAD; no test diffs",
  "cleanup": "none, no product edits",
  "risks": "none for this review"
}
```
