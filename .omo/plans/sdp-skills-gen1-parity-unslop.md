# sdp-skills-gen1-parity-unslop - Work Plan

## TL;DR

Remove AI-generated slop from the three files delivered by `sdp-skills-gen1-parity`: `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-authoring/SKILL.md`, and `README.md`. Preserve every machine-consumed value and command form already covered by tests. Verify with focused tests, the full green gate, and package dry-run.

## Scope

### Must have
- Identify and remove obvious comments, redundant prose, over-defensive wording, needless repetition, and any AI-tells in the three target files.
- Keep every required frontmatter field, command form, recipe count, skill name, and machine-tested token intact.
- Preserve the three-skill topology (`sdp-agent-surface`, `sdp-authoring`, `sdp-sessions`).
- Keep `sdp-sessions` byte-for-byte unchanged.
- Ensure `npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts test/package-smoke.test.ts` passes.
- Ensure `npm run check` passes.
- Ensure `npm pack --dry-run --json` lists the same three skill files and recipe catalog.

### Must NOT have
- No edit under `src/`, `specs/`, `docs/agent-surface/`, `generated/`, `package.json`, or `AGENTS.md`.
- No new skill, recipe, product law, or runtime behavior.
- No prose tests; rely on existing machine-checked contracts.

## Verification strategy
- Behavior lock: existing test suites cover frontmatter, command forms, recipe cardinality, and package assets. Run them first.
- Cleanup: one parallel batch of deep agents for the three files (≤5 files).
- Quality gates: focused tests, `npm run check`, package dry-run, `git diff --check`.
- Final review: adversarial verifier checks the diff for scope fidelity and slop removal.

## Todos
- [x] 1. Lock behavior with existing tests
- [x] 2. Remove slop from sdp-agent-surface skill
- [x] 3. Remove slop from sdp-authoring skill
- [x] 4. Remove slop from README recipe count context
- [x] 5. Run merged verification gates
- [x] F1. Final scope and quality review
