---
name: sdp-sessions
description: Do the delivery work a session was given on current graph evidence. Use when opening, resuming, reviewing or closing a session, handing off or briefing another agent, running a Pack design pass, or applying a change proposal from a reviewer, the Studio or a vault.
metadata:
  realizes: spec:consumers.delivery-session-on-ramp spec:consumers.graph-first-planning
---

# Delivery sessions

Do the task you were given on current graph evidence, and leave a hand-off the next session can
re-measure. Work shapes and preflights are advisory entries over one graph: the task selects the
shape, you may enter or revisit any shape, and nothing the evidence reports authorizes, blocks,
scopes or advances work (`spec:consumers.delivery-session-on-ramp`). A fix, a refactor, an added
test or a change to a built Spec is ordinary work. Load `sdp-agent-surface` first: every query here
runs through its runners, from the project root.

## Hazards

- A verdict carried from a summary, a plan or an earlier session is not evidence: re-run the
  commands behind it, first when resuming.
- A reviewer hands findings back, leaving the author's rung and the reviewed work as it found them.

## Evidence

- No target: orientation 5, the roadmap (recipe 53, `dist/recipes/53-the-roadmap.js`). An entry's
  need (`spec:consumers.roadmap#rule.specNeed`) says what realization is unfinished, never what
  work is allowed.
- Named Specs: orientation 10 with them as subjects; promotion preflight (recipe 9,
  `dist/recipes/09-promotion-preflight.js`) on each Spec whose rung you touch.
- A changeset: orientation 9 with the changed files.
- Anything else: the catalog's category for the task, such as
  `docs/agent-surface/recipes.md#design-and-review` or
  `docs/agent-surface/recipes.md#change-and-proposals`.

## Tripwires

Each asks you to rethink the shape:

- Design entries or rules written into a Spec stated `idea`.
- Code written, or a rung stated, while a blocking question on the target is open.
- A drift alarm after your change (orientation 4's `driftAlarm`).
- A Design entry slimmed before the distillation boundary of `spec:model.enrichment-lifecycle`.
  Slimming candidates (recipe 39, `dist/recipes/39-slimming-candidates.js`) are candidates:
  compare each with its bound artifact, and keep every why.

## Branches

- Building a Spec, from reading its brief in the graph to closing on its delivery facts:
  [build.md](references/build.md).
- A Pack design pass: [design-pass.md](references/design-pass.md).
- Review findings against Specs, or a change proposal to apply from a reviewer, the Studio or a
  vault: [proposals.md](references/proposals.md).
- Capture, binding, design rounds, readiness statements: `sdp-authoring`.

## Hand off

Name the targets, the changed files, each target's stated and derived readiness, the findings and
open questions, and the recipe files or bodies, with parameters, that re-measure them. An arc
hand-off also names the Spec ids carrying the arc's refusals, guarantees and holds, in the homes
`spec:decisions.planning-truths-placement` rules. A brief to another agent is a hand-off: the skill
to load, and the queries that scope the work and show it done. One run from the project root
re-measures findings, drift, the changed files' reach and the targets:
`node <skill-dir>/../sdp-agent-surface/scripts/orient.mjs --only 4,9,10 --subjects '{"9":{"files":["…"]},"10":{"specs":["spec:…"]}}'`.
