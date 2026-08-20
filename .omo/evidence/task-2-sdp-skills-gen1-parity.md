# Task 2 parity evidence

Date: 2026-08-20
Task: `sdp-skills-gen1-parity Todo 2`
Phase: Wave 1, correct the graph-read skill's stdout contract

## Edit

Surgical change to `.agents/skills/sdp-agent-surface/SKILL.md` only.

Replaced the false claim that `return` means nothing else is printed with the observed
runtime contract: `return` is the machine output contract, but `sdp q` does not suppress
`console.*`, so machine-consumed bodies and shipped recipes must avoid console output.

Folded the `--root` / `--exclude` sentence into the same paragraph so the file did not grow.
No section, standalone guide, third adopter example, bare `sdp`, `bySymbol`, recipe, product
change, or copied carrying law.

## Diff stat

```text
 .agents/skills/sdp-agent-surface/SKILL.md | 10 +++++-----
 1 file changed, 5 insertions(+), 5 deletions(-)
```

Line count stayed 119. The file no longer contains `nothing else is printed`.

## Kept contracts

Frontmatter, bootstrap, exactly two adopter `pnpm exec sdp q` examples, two source-checkout
`pnpm --silent sdp:q` examples, sixteen-recipe description, five structural phrases,
`g` / `graph` / `report` bindings, trusted-code warning, claim / readiness / delivery-fact
distinctions, anti-anecdote rule, and refused actions are still present.

## Format and tests

`npx prettier --check .agents/skills/sdp-agent-surface/SKILL.md`

Exit `0`. Stdout: `Checking formatting... All matched files use Prettier code style!`

`npx vitest run test/skills.test.ts test/recipes.test.ts test/cli-q.test.ts`

Exit `0`.

```text
 Test Files  3 passed (3)
      Tests  55 passed (55)
   Duration  6.40s
```

Existing skill, recipe, and CLI contract tests were not edited.

## QA

Happy: `pnpm --silent sdp:q 'return g.specs().length'`

Exit `0`. Stdout:

```text
156
```

Failure / honesty: `pnpm --silent sdp:q 'console.log("side-output"); return "value"'`

Exit `0`. Stdout:

```text
side-output
'value'
```

Stdout still contains both `side-output` and the rendered return `'value'`. That matches the
unchanged runtime in `src/cli/q-command.ts`: the sink renders `return`, and it does not
suppress `console.*`.
