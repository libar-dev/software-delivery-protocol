# Task 2 — recipe family grouping totality

Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-recipe-totality`
Branch: `work/pr25-recipe-totality`
Base checkpoint: `3c603e3cba716fb91fed24ec75aeff50ebcc451f`

## Scope

- `test/recipes.test.ts` — production-CLI tests for recipes 1, 11, 18 with lawful hostile first path segments
- `docs/agent-surface/recipes.md` — three recipe-local accumulators → `Object.create(null)`
- this evidence file

No `src/`, Spec, package, lockfile, graph, projection, helper API, or historical embedded recipe-body edits.

## Red proof (before production edit)

Command:

```sh
npx vitest run test/recipes.test.ts -t "lawful Object.prototype path segments"
```

Result: 3 failed | 29 skipped (exit non-zero). Exact stderr from `runSdpCli`:

| Recipe | Title | stderr |
| --- | --- | --- |
| 1 | The build backlog | `sdp q: byFamily[family].push is not a function` |
| 11 | The lower ladder | `sdp q: byFamily[family].push is not a function` |
| 18 | Decision map | `sdp q: decidedSubjectsByFamily[family].push is not a function` |

Failure QA (unmodified catalog body × constructor fixture): exit 1 with the exact `.push is not a function` messages above. Failure is the prototype collision on `constructor` (and the other three lawful keys), not fixture construction.

## Implementation

Replaced only:

- recipe 1 `const byFamily = {}` → `Object.create(null)`
- recipe 11 `const byFamily = {}` → `Object.create(null)`
- recipe 18 `const decidedSubjectsByFamily = {}` → `Object.create(null)`

Output keys, sorting, live-corpus behavior, and historical embedded bodies elsewhere were left alone. Lawful IDs are not rejected or sanitized; invalid `__proto__` was not tested.

## Green focused suite (exactly once after fix)

```sh
npx vitest run test/recipes.test.ts
```

```
Test Files  1 passed (1)
     Tests  32 passed (32)
  Duration  4.25s
```

Exit 0.

## Manual QA — production `runSdpCli` seam + 12 hostile-family buckets

Same seam as the focused tests: `runSdpCli(["q", body, "--root", repoRoot, "--json"], …)` with an extraction override that clones live graph primitives and injects synthetic Specs.

Hostile first path segments: `constructor`, `toString`, `valueOf`, `hasOwnProperty`.

| # | Recipe | Fixture posture | Synthetic IDs | exit | stderr | own keys |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | backlog | ready, rule, unresolved implementation | `spec:<family>.hostile-backlog` | 0 | empty | all 4 own |
| 11 | lower ladder | stated `idea` | `spec:<family>.hostile-lower` | 0 | empty | all 4 own |
| 18 | decision map | `decidedBy` → `spec:decisions.agent-front-door` (live ready decision) | `spec:<family>.hostile-decided-subject` | 0 | empty | all 4 own under that decision's `decidedSubjectsByFamily` |

Parsed JSON own-key assertion (all 12 buckets):

```json
{
  "recipe1": {
    "exitCode": 0,
    "stderr": "",
    "buckets": {
      "constructor": { "own": true, "ids": ["spec:constructor.hostile-backlog"] },
      "toString": { "own": true, "ids": ["spec:toString.hostile-backlog"] },
      "valueOf": { "own": true, "ids": ["spec:valueOf.hostile-backlog"] },
      "hasOwnProperty": { "own": true, "ids": ["spec:hasOwnProperty.hostile-backlog"] }
    }
  },
  "recipe11": {
    "exitCode": 0,
    "stderr": "",
    "buckets": {
      "constructor": { "own": true, "ids": ["spec:constructor.hostile-lower"] },
      "toString": { "own": true, "ids": ["spec:toString.hostile-lower"] },
      "valueOf": { "own": true, "ids": ["spec:valueOf.hostile-lower"] },
      "hasOwnProperty": { "own": true, "ids": ["spec:hasOwnProperty.hostile-lower"] }
    }
  },
  "recipe18": {
    "exitCode": 0,
    "stderr": "",
    "buckets": {
      "constructor": { "own": true, "ids": ["spec:constructor.hostile-decided-subject"] },
      "toString": { "own": true, "ids": ["spec:toString.hostile-decided-subject"] },
      "valueOf": { "own": true, "ids": ["spec:valueOf.hostile-decided-subject"] },
      "hasOwnProperty": { "own": true, "ids": ["spec:hasOwnProperty.hostile-decided-subject"] }
    }
  }
}
```

## Diagnostics

- LSP diagnostics request on `test/recipes.test.ts`: **daemon unreachable** at `/home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock` (`LSP daemon did not become reachable`). No language-server findings available from the daemon.
- Focused Vitest suite is the lane gate; full `npm run typecheck` still depends on generated contract artifacts outside this lane and was not used as a substitute gate for the recipe-only change.

## Adversarial map

| Vector | Applicable? | Result |
| --- | --- | --- |
| `stale_state` | yes | Fixtures exercise current catalog bodies via `recipeByOrdinal` + live `docs/agent-surface/recipes.md` parse; red/green both hit those bodies. |
| `dirty_worktree` | yes | Diff limited to the three planned paths; commit is the single scoped message. |
| `flaky_tests` | yes | No timers/randomness/sleeps; suite passed in one run (32/32). |
| `misleading_success_output` | yes | Assertions cover exit 0, empty stderr, `Object.hasOwn` on family keys, and exact synthetic Spec IDs — not only a green summary. |
| `malformed_input` | no | Only lawful ID path segments; no parser change; `__proto__` not admitted/tested. |
| `prompt_injection` | no | No model/prompt surface in this lane. |
| `cancel_resume` | no | Single uninterrupted lane execution. |
| `hung_or_long_commands` | no | Focused suite ~4s; no long-running watchers. |
| `repeated_interruptions` | no | No interrupted commands requiring resume. |

## Cleanup

- No temporary fixture directories or files were left in the worktree.
- Manual QA used in-memory graph clones only (no disk carriers under `specs/`).
- Red/green console captures lived under `/tmp/pr25-todo2-*.txt` (outside the repo); nothing staged from `/tmp`.

## Risks / residual

- `test/recipes.test.ts` remains a large pre-existing corpus file (pure LOC ≫ 250); this lane only appended the three hostile-family tests and helpers. Split is out of scope.
- Totality is recipe-local (`Object.create(null)` in three bodies). Future recipes that group by family with plain `{}` can reintroduce the collision; no shared helper was added by design.
