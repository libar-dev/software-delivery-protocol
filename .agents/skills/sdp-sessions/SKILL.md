---
name: sdp-sessions
description: Route delivery work through graph-first capture, design, implementation, review, and close shapes without workflow gates.
---

# Route delivery work from current graph state

Use this skill when opening or handing off a delivery session. It realizes
`spec:consumers.delivery-session-on-ramp`: one current graph serves every work shape, and the shape
only selects the advisory preflight and the carrying reference to open. Shapes are not phases,
statuses, or a required sequence.

## Bootstrap the graph

The runnable bodies live in `docs/agent-surface/recipes.md` in the Protocol repository and in
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md` in an adopter.
In this source checkout use the repository wrapper, which supplies the required exclusions:

```sh
pnpm --silent sdp:q 'return g.specs().length'
```

If the active pnpm binary cannot run this package-lock-based checkout, the equivalent source
wrapper is `npm run --silent sdp:q -- '<body>'`. Never fall through to a global `sdp`.

An adopter selects its root and exclusions through its installed package runner:

```sh
pnpm exec sdp q '<body>' --root PATH
pnpm exec sdp q '<body>' --root PATH --exclude PATH --exclude PATH
```

Open the catalog and substitute only the parameter line of a parameterized recipe. The recipe
result informs the session; it never grants permission or records a verdict.

## Choose an advisory work shape

### Capture / refine

Use concept search (recipe 6) to find the existing family and avoid duplicate intent. Use the
lower ladder (recipe 11) to see current stated and derived readiness, then promotion preflight
(recipe 9) before a human changes a rung. Follow `sdp-authoring` for the minimal lawful `idea`
carrier and the one-kind rule.

### Design

Use promotion preflight (recipe 9) on the target and readiness divergence (recipe 7) across the
corpus. Resolve blocking open questions and review the carrying Specs. A clear floor is evidence,
not an automatic `ready` statement.

### Implement

Use the build backlog (recipe 1) to orient the available ready work and the target Spec context
(recipe 3) to read guarantees, relations, implementation bindings, and verifiers. Bind anchors
and executable examples through `sdp-authoring`; an `implemented` fact names a binding, not a
passing or live system.

### Review

For a Pack, use the Pack review backbone (recipe 5) and warn-level signals (recipe 8). Without a
Pack, use the target Spec context (recipe 3) with warn-level signals (recipe 8). Review findings
and gaps as data; the review never becomes a workflow gate.

### Close / slim

Use the drift alarm (recipe 2) and changed-file blast radius (recipe 4) over the session diff.
Slimming is optional judgment: remove obsolete implementation-sequencing scaffolding only when
durable law and one prose owner remain. `spec:model.enrichment-lifecycle` deliberately leaves the
universal distillation boundary unresolved.

## Hand off for re-measurement

Name the chosen shape, target Spec ids or Pack, changed files, stated and derived readiness,
findings or blocking open questions, and the exact commands, commits, or artifact locations from
which evidence can be re-derived. Never hand off a carried "verified" verdict: the next session
re-runs the named evidence. Git remains the event log; no session state enters the graph.

All preflights are advisory. They never authorize, block, scope, unlock, or advance delivery work,
and they never create a process state machine.
