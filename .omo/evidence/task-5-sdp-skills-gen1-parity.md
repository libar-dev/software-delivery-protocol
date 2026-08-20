# Task 5 parity gate evidence (recovery)

Date: 2026-08-20
Task: `sdp-skills-gen1-parity Todo 5`
Phase: recovery after preflight refused untracked plan evidence
Verdict: **pass**

HEAD: `8df0d80 chore(.omo): plan 37 F5 PR opened`

No product files were edited in this recovery. Plan 37 was not touched. Nothing was committed.

## What failed last time

`npm run check` reached `node ./preflight.mjs` and exited `1` because these paths were nonignored untracked:

```text
.omo/evidence/task-2-sdp-skills-gen1-parity.md
.omo/evidence/task-3-sdp-skills-gen1-parity.md
.omo/evidence/task-4-sdp-skills-gen1-parity.md
```

Preflight treats any `git ls-files --others --exclude-standard` path as runtime garbage. Those files are this plan's Todo 2-4 evidence, not product edits. Writing the first Task 5 evidence file added a fourth untracked path.

## Recovery action

Staged the plan evidence with `git add` (no commit):

```text
M  .omo/evidence/task-1-sdp-skills-gen1-parity.md
A  .omo/evidence/task-2-sdp-skills-gen1-parity.md
A  .omo/evidence/task-3-sdp-skills-gen1-parity.md
A  .omo/evidence/task-4-sdp-skills-gen1-parity.md
A  .omo/evidence/task-5-sdp-skills-gen1-parity.md
```

`git ls-files --others --exclude-standard` after that add was empty. This file was overwritten after the gates below, then staged again so the index holds the recovery record.

## Gate 1 `npm run check`

Started `2026-08-20T12:49:23+02:00`, ended `2026-08-20T12:51:52+02:00`. Exit `0`.

Every leg exited 0:

- `check:temporal`
- `lint`
- `format:check` (`Checking formatting... All matched files use Prettier code style!`)
- `build`
- `generate:self-hosting` (156 specs, 0 errors, 5 warnings)
- `generate:example` (11 specs, 0 errors, 1 warning)
- `typecheck`
- `typecheck:examples`
- `test` (62 files passed, 838 passed, 1 skipped; plus 1 file / 80 tests in the second vitest run)
- `check:self-hosting-gates` (`currentRecord.status` `EXECUTED`)
- `check:self-hosting`
- `check:example`
- `preflight` (`preflight: tracked/untracked status inspected`)

Preflight semantic diff summary listed the three product files, `.omo/boulder.json`, the five staged evidence files, and `.omo/evidence/ulw-20260820-081346.05dmOx.md`. No garbage list.

## Gate 2 source skill on-ramp

`pnpm exec sdp --help` started `2026-08-20T12:52:02+02:00`, exit `1`:

```text
undefined
[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command "sdp" not found
```

That is the source-checkout contract. This package does not link `sdp` into its own `node_modules/.bin`. `pnpm exec` resolves dependency binaries. The on-ramp form is `pnpm --silent sdp --help` (`package.json` script `sdp` = `node ./dist/cli/sdp.js`).

`pnpm --silent sdp --help` started `2026-08-20T12:52:51+02:00`, exit `0`. First line starts with `sdp` and names Libar Software Delivery Protocol. Usage includes `sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--json]`.

`pnpm --silent sdp:q 'return g.specs().length'` started `2026-08-20T12:52:03+02:00`, printed `156`, exit `0`.

`pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` started `2026-08-20T12:52:06+02:00`, ended `2026-08-20T12:52:09+02:00`, exit `0`. Last line: `validate: 0 errors · 5 warnings (conformance + honesty over the one graph)`. Graph: 156 specs, 1 pack, 157 anchors, 314 nodes, 660 edges.

## Gate 3 focused skill tests

`npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts`

Started `2026-08-20T12:52:51+02:00`, ended `2026-08-20T12:52:57+02:00`, exit `0`.

```text
Test Files  3 passed (3)
Tests  55 passed (55)
Duration  5.01s
```

## Gate 4 installed-package parity

`/tmp/sdp-parity-consumer` did not exist. Created it, `npm init -y`, then `npm install /home/darkomijic/dev-libar/software-delivery-protocol`. Install exit `0` (`added 1 package`, 359ms).

`npx sdp --help` from that directory started `2026-08-20T12:53:29+02:00`, exit `0`. Same first line as the source on-ramp. Bin link:

```text
node_modules/.bin/sdp -> ../@libar-dev/software-delivery-protocol/dist/cli/sdp.js
```

Bounded query, same three exclusions as `sdp:q`:

```sh
npx sdp q 'return g.specs().length' --root /home/darkomijic/dev-libar/software-delivery-protocol --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Started `2026-08-20T12:53:30+02:00`, printed `156`, exit `0`.

`npm pack --dry-run` in the source checkout started `2026-08-20T12:52:52+02:00`, exit `0`. 19 files, `libar-dev-software-delivery-protocol-0.0.0.tgz`, 278.7 kB packed, 1.3 MB unpacked. Tarball includes the three skills, `docs/agent-surface/recipes.md`, `dist/**`, `LICENSE`, `README.md`, `package.json`.

## Product scope (untouched this recovery)

`git diff --name-only` on the planned product paths is still Wave 1:

```text
.agents/skills/sdp-agent-surface/SKILL.md
.agents/skills/sdp-authoring/SKILL.md
README.md
```

`.agents/skills/sdp-sessions/SKILL.md` is byte-for-byte HEAD: both hashes `48cfa546fd93747398e8b50fb55344e6351b7fa1`.

`git diff --check` exit `0`.

`plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` has no diff vs HEAD.

Working-tree extras that were already there and were not edited here: `.omo/boulder.json`, `.omo/evidence/ulw-20260820-081346.05dmOx.md`.

## Final `npm run check` after this file was staged

Started `2026-08-20T12:55:17+02:00`, ended `2026-08-20T12:57:42+02:00`. Exit `0`.

Same legs as Gate 1, including preflight. Untracked set stayed empty. Preflight printed `preflight: tracked/untracked status inspected` and listed this recovery file in the semantic diff summary.

## DoneClaim

```json
{
  "task": "st_01a01ec9 / sdp-skills-gen1-parity Todo 5 recovery",
  "verdict": "pass",
  "changed_files": [
    ".omo/evidence/task-1-sdp-skills-gen1-parity.md",
    ".omo/evidence/task-2-sdp-skills-gen1-parity.md",
    ".omo/evidence/task-3-sdp-skills-gen1-parity.md",
    ".omo/evidence/task-4-sdp-skills-gen1-parity.md",
    ".omo/evidence/task-5-sdp-skills-gen1-parity.md"
  ],
  "tests": "npm run check exit 0 twice (12:49:23 and 12:55:17); vitest skills/recipes/cli-q 3 files 55 passed; consumer npx sdp --help and sdp q printed 156",
  "manual_qa": "git add of plan evidence only, no commit; pnpm exec sdp --help exits 1 in this checkout as designed; pnpm --silent sdp --help, sdp:q, and sdp validate exit 0",
  "cleanup": "removed /tmp/sdp-parity-consumer after the consumer gate",
  "risks": "none remaining for this todo; Plan 37 and product files were not edited"
}
```
