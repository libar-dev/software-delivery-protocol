# Task 3 — recipe 19 bidirectional dependency characterization

Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-recipe-totality`
Branch: `work/pr25-recipe-totality`
Parent (Todo 2): `a6460b6acd60e24516b68ce5e8e2b6a9dbdf439a`

## Scope

- `test/recipes.test.ts` only — one characterization test
- this evidence file

No catalog (`docs/agent-surface/recipes.md`), graph, corpus, product, package, or PR edits.

## Characterization

Test: `returns non-empty bidirectional dependencies for the structural-anchor planning slice`

- Loads catalog recipe 19 body unchanged except opening id:
  - from `spec:consumers.agent-surface`
  - to `spec:decisions.structural-anchor-semantics`
- Executes through production `runSdpCli` (`runRecipe` seam)
- Asserts:

```json
{
  "dependsOn": [
    {
      "id": "spec:decisions.binding-not-liveness",
      "statedReadiness": "ready"
    }
  ],
  "dependedOnBy": [
    {
      "id": "spec:decisions.architectural-significance-rides-primitives",
      "statedReadiness": "ready"
    },
    {
      "id": "spec:decisions.jsdoc-graph-extraction-refused",
      "statedReadiness": "ready"
    }
  ]
}
```

Both arrays asserted `length > 0` and exact equality (IDs + readiness). Existing unknown-ID,
dangling-component, implementation, verifier, refinement, and entry-point tests left untouched.

## Characterization result

```sh
npx vitest run test/recipes.test.ts -t "structural-anchor planning slice"
```

```
Tests  1 passed | 32 skipped (33)
```

Exit 0. Current live-graph behavior matches the pin (characterization, not TDD-red).

## Mutation / failure probe (test-local body only; shipped files untouched)

Same production CLI seam; body mutated only in memory:

| Probe | Mutation | Assertion failures captured |
| --- | --- | --- |
| happy | opening id only | none |
| no-outgoing | `const dependsOn = [];` | `dependsOn empty`; `dependsOn mismatch got []` |
| no-incoming | `const dependedOnBy = [];` | `dependedOnBy empty`; `dependedOnBy mismatch got []` |
| reversed | swap `"to"`/`"from"` ends | dependsOn gets the two inbound IDs; dependedOnBy gets binding-not-liveness |

Therefore the characterization fails if either direction is removed, reversed, renamed, or returns a
different readiness. No shipped file was edited for the probe.

## Focused suite (exactly once after the test landed)

```sh
npx vitest run test/recipes.test.ts
```

```
Test Files  1 passed (1)
     Tests  33 passed (33)
  Duration  4.81s
```

Exit 0.

## Manual QA — `pnpm --silent sdp:q`

Recipe 19 body with only the opening id replaced to
`spec:decisions.structural-anchor-semantics`, invoked as:

```sh
pnpm --silent sdp:q '<body>' --json
```

Parsed machine values (stderr empty):

```json
{
  "id": "spec:decisions.structural-anchor-semantics",
  "found": true,
  "dependencies": {
    "dependsOn": [
      {
        "id": "spec:decisions.binding-not-liveness",
        "statedReadiness": "ready"
      }
    ],
    "dependedOnBy": [
      {
        "id": "spec:decisions.architectural-significance-rides-primitives",
        "statedReadiness": "ready"
      },
      {
        "id": "spec:decisions.jsdoc-graph-extraction-refused",
        "statedReadiness": "ready"
      }
    ]
  },
  "dependsOnNonEmpty": true,
  "dependedOnByNonEmpty": true
}
```

## Diagnostics

- LSP on `test/recipes.test.ts`: **daemon unreachable** at
  `/home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock`.
- Lane gate remains the focused Vitest suite (33/33).

## Adversarial map

| Vector | Applicable? | Result |
| --- | --- | --- |
| `stale_state` | yes | Pin is against live graph relations for structural-anchor-semantics; verified via `sdp:q` and Vitest against current extraction. |
| `dirty_worktree` | yes | Two-file commit only (`test/recipes.test.ts` + this evidence); tree clean after commit. |
| `flaky_tests` | yes | Deterministic graph data; no timers/random; one-run pass. |
| `misleading_success_output` | yes | Exact IDs, readiness, and explicit non-empty length checks — not a green summary alone. |
| `malformed_input` | no | No parser/input-boundary change; known Spec id only. |
| `prompt_injection` | no | No prompt surface. |
| `cancel_resume` | no | Uninterrupted lane. |
| `hung_or_long_commands` | no | Suite ~5s; no watchers. |
| `repeated_interruptions` | no | No interrupted commands. |

## Cleanup

- Failure probe used in-memory body copies only; no temp files left in the worktree.
- `/tmp/pr25-todo3-*` captures stayed outside the repo and were not staged.

## Risks / residual

- Characterization is corpus-coupled: if MD-34/MD-35 or binding-not-liveness edges change, the test
  correctly reddens and must be re-pinned deliberately.
- Does not prove other recipe-19 opening ids have non-empty dependency arrays (by design; one
  non-vacuous target).
