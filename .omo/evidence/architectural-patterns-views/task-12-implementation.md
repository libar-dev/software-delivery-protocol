# Task 12 implementation: highlight architecture recipes in skills

Work: `architectural-patterns-views` · plan todo 12.
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
Branch: `feature/architectural-patterns-views`
Scope of this slice: `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-sessions/SKILL.md`, and this evidence file. No other product file, test file, or plan file edited. No commit, no push.

## Summary of skill updates

### 1. `.agents/skills/sdp-agent-surface/SKILL.md`
- Changed count word from `sixteen` to `nineteen`.
- Updated range from `Recipes 1-16` to `Recipes 1-19`.
- Appended `architecture map`, `decision map`, and `the planning slice` to the catalog recipe list.
- Added a dedicated architecture-questions guidance paragraph containing the exact required phrases:
  - `architecture map`
  - `decision map`
  - `planning slice`

### 2. `.agents/skills/sdp-sessions/SKILL.md`
- Updated `### Design` to point to `planning slice (recipe 19)` for neighborhood and constraining decisions.
- Updated `### Implement` to point to `recipe 19` to inspect neighbors, bound components, and entry points before editing code.
- Updated `### Review` to point to `architecture map (recipe 17)` and `decision map (recipe 18)`.
- Verified the literal phrases `recipe 17`, `recipe 18`, and `recipe 19` appear in their respective sections.

## Verification

### Automated tests

1. Command:
```bash
npx vitest run test/skills.test.ts
```

Output:
- 8 of 9 tests pass.
- The 1 failing test is `keeps recipe-count prose synchronized with the executable catalog` on line 333:
  - It checks `AGENTS.md` for `nineteen runnable \`sdp q\` bodies`.
  - `AGENTS.md` update is scoped to task 13.
  - Line 334 (`skill` contains `catalog contains nineteen ready-made bodies`) passes cleanly.

2. Command:
```bash
npx vitest run test/recipes.test.ts
```

Output:
- 20 of 22 tests pass.
- 2 failing tests are structural oracle assertions (`returns every committed structural component with non-empty membership`, `returns exact component uses fan-in and fan-out from the structural oracle`).
- These structural oracle roster updates belong to task 15.

### Formatting and diff checks

1. Prettier check:
```bash
npx prettier --check .agents/skills/sdp-agent-surface/SKILL.md .agents/skills/sdp-sessions/SKILL.md
```
Result: exit 0 (all matched files use Prettier code style).

2. Git diff whitespace check:
```bash
git diff --check -- .agents/skills/
```
Result: exit 0 (no whitespace errors).

## Manual QA (exact edited passages read)

### `.agents/skills/sdp-agent-surface/SKILL.md` (lines 88-102)

```markdown
The catalog contains nineteen ready-made bodies in `docs/agent-surface/recipes.md` in the Protocol
repository and
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md` in an adopter.
Recipes 1-19 cover the existing read path plus the structural and projection slice: build backlog,
drift alarm, per-Spec guarantees and verifiers, blast radius, Pack review backbone, concept search,
readiness divergence, warn-level signals, promotion preflight, declared-versus-enabled verifiers,
the lower ladder, component membership, uses fan-in and fan-out, structural neighborhood, census
structural coverage, the projection-coverage upper bound, architecture map, decision map, and
the planning slice. Every body there runs verbatim and a test proves it. Start from a recipe; adapt
it in place.

For architecture questions, use the architecture map to see components and their shaping decisions
together, the decision map to rank inter-decision relationships by inbound fan-in, or the planning
slice to see refinement neighbors, bound components, and entry points before editing.
```

### `.agents/skills/sdp-sessions/SKILL.md` (lines 48-74)

```markdown
### Design

Use promotion preflight (recipe 9) on the target, the planning slice (recipe 19) for neighborhood
and constraining decisions, and readiness divergence (recipe 7) across the corpus. Resolve blocking
open questions and review the carrying Specs. A clear floor is evidence, not an automatic `ready`
statement.

### Implement

Use the build backlog (recipe 1) to orient the available ready work and the target Spec context
(recipe 3) to read guarantees, relations, implementation bindings, and verifiers. Inspect the
planning slice (recipe 19) to see refinement neighbors, bound components, and entry points before
writing code. When the work lives in a declared seam, use component membership (recipe 12) and uses
fan-in/fan-out (recipe 13) to see the units and neighbors before binding. Bind code, test, and oracle
anchors, the structural `component` and `uses` fields included, and executable examples through
`sdp-authoring`, which owns the registrar-first executable transition; an `implemented` fact names
a binding, not a passing or live system.

### Review

For a Pack, use the Pack review backbone (recipe 5) and warn-level signals (recipe 8). Without a
Pack, use the target Spec context (recipe 3) with warn-level signals (recipe 8). When reviewing
component, architecture, or projection questions, use structural neighborhood (recipe 14), census
structural coverage (recipe 15), the projection-coverage upper bound (recipe 16), the architecture
map (recipe 17), and the decision map (recipe 18). Review findings and gaps as data; the review
never becomes a workflow gate.
```

## Adversarial probes

- **stale_state**: Working tree files were read directly via the Read tool.
- **dirty_worktree**: Only the two designated skill files and this evidence file were created or edited in this task.
- **flaky_tests**: Test failures in `test/skills.test.ts` (AGENTS count sync) and `test/recipes.test.ts` (structural oracle) are deterministic and classified under task 13 and task 15.
- **misleading_success_output**: Checked exact assertion failure lines to confirm the skill assertions pass.
