# Task 4 parity gate evidence

Date: 2026-08-20
Task: `sdp-skills-gen1-parity Todo 4`

## Source checks

`docs/agent-surface/recipes.md` contains 16 numbered recipe headings, verified with:

```text
rg -n '^## [0-9]+\.' docs/agent-surface/recipes.md | wc -l
16
```

## README diff

Changed exactly two live recipe-count phrases from `eleven` to `sixteen`:

```diff
-[eleven graph-first recipes](docs/agent-surface/recipes.md)
+[sixteen graph-first recipes](docs/agent-surface/recipes.md)
-beside the eleven recipe bodies at `docs/agent-surface/recipes.md`
+beside the sixteen recipe bodies at `docs/agent-surface/recipes.md`
```

The source-checkout commands, installed-package guidance, and the three on-ramps remain unchanged:
`sdp-agent-surface`, `sdp-authoring`, and `sdp-sessions`.

## Verification

- `npx prettier --check README.md`: exit 0
- `npx vitest run test/recipes.test.ts`: exit 0, 1 file passed, 22 tests passed
