# Task 3 parity evidence

Date: 2026-08-20
Task: `sdp-skills-gen1-parity Todo 3`
File: `.agents/skills/sdp-authoring/SKILL.md`

## Edit

Deleted the duplicated Gherkin carrier grammar, the editor `files.associations` example, and the
pinned `@cucumber/gherkin` / `@cucumber/messages` version guidance. Replaced those blocks with a
short pointer to `spec:carrier.gherkin-authoring`. Kept the canonical `.sdp.gherkin` suffix and the
one-carrier-per-id warning. Left `sdp new spec` and `sdp validate --watch` in prose.

Line count (`wc -l`): 196 before, 162 after. Plan baseline is 197.

```text
 .agents/skills/sdp-authoring/SKILL.md | 38 ++---------------------------------
 1 file changed, 2 insertions(+), 36 deletions(-)
```

Forbidden remnants absent: `files.associations`, `@cucumber/gherkin@`, `@cucumber/messages@`,
copied eight-rule grammar, dashed `--dry-run`.

## Verification

`npx prettier --check .agents/skills/sdp-authoring/SKILL.md`

Exit `0`. stdout: `Checking formatting...` / `All matched files use Prettier code style!`

`npx vitest run test/skills.test.ts test/recipes.test.ts`

Exit `0`.

```text
 Test Files  2 passed (2)
      Tests  30 passed (30)
   Duration  5.75s
```

## QA happy

Command:

```text
pnpm --silent sdp:q 'const c = g.specContext("spec:consumers.authoring-on-ramp"); return { found: c !== undefined, readiness: c?.statedReadiness, findings: c?.findings ?? [] }' --json
```

Exit `0`. stdout:

```json
{
  "found": true,
  "readiness": "ready",
  "findings": []
}
```

Ready context with no findings.

## QA failure

Precondition: `/home/darkomijic/dev-libar/forbidden.sdp.md` did not exist.

Command:

```text
pnpm --silent sdp new spec ../forbidden.sdp.md --id spec:qa.forbidden --kind behavior --altitude story --title "Forbidden" --outcome "Must not write outside root"
```

Exit `1`. stdout:

```text
sdp new spec: PATH must stay cwd-relative and must not contain .. segments.
```

After the probe, `/home/darkomijic/dev-libar/forbidden.sdp.md` still did not exist.
