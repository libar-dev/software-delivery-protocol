---
name: sdp-sessions
description: Route delivery work to an advisory work shape from current graph evidence. Use when opening, resuming, reviewing, closing or handing off delivery work, including a Pack design pass or a change proposal received from a reviewer; the shape routes to the reading or authoring skill.
---

# Route delivery work from current graph state

Use this skill when opening, resuming or handing off a delivery session. It realizes
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

Each recipe below is named by its number. Read its row in `sdp-agent-surface`'s task sheet and its
numbered catalog entry for parameters and answer fields. Pass a parameterized recipe its subject
as JSON data with `--params` (or `--params @PATH` for a file), never by editing the body; the build
ships every body as `dist/recipes/<NN>-<slug>.js`. Bodies receive `g`, `graph`, `report`, `params`
and `recipes`; call a shipped body with `recipes(number, parameters?)`, following
`spec:consumers.agent-surface.evaluation-sink`. The recipe result informs the session; it never
grants permission or records a verdict.

For human-readable pages or linked notes, follow `sdp-agent-surface`'s "Publish pages and notes":
it says which publisher to run, what each run invalidates, when to stamp a preview, and where the
vault keeps a person's notes. `sdp-studio` and `sdp-vault` turn intent a person composed there into
a checked change proposal.

For a corpus upgrade, follow the shipped upgrade guide: `docs/agent-surface/upgrade-guide.md` in
the Protocol checkout, or
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/upgrade-guide.md` in an
adopter, with `sdp-authoring`'s "Upgrade a corpus". It measures with capability adoption
(recipe 47) and proposes keys with the rule-key proposal (recipe 48).

## Choose an advisory work shape

### Capture / refine

Use concept search (recipe 6) to find the existing family and avoid duplicate intent, and entry
search (recipe 23) when you hold a key or a term and need the entry that already states it. Use the
lower ladder (recipe 11) to see current stated and derived readiness, then promotion preflight
(recipe 9) before a human changes a rung. Follow `sdp-authoring` for the minimal lawful `idea`
carrier, `sdp new spec`, the `validate --watch` loop, the one-kind rule, step keys and term
addresses.

### Design

Read the capability map (recipe 52) to choose an epic's refinement scope and inspect its direct
binding evidence; check `damage`, `cycles` and summary omissions before interpreting the answer.

Use promotion preflight (recipe 9) on the target; the planning slice (recipe 19), dependency
footing (recipe 21) and dependency cycles (recipe 26) for what it rests on; and readiness
divergence (recipe 7) across the corpus. Resolve the target's blocking open questions and review
the carrying Specs. The open-question register (recipe 20) lists the neighbors' questions, and the
statement queue (recipe 46) orders waiting readiness statements and the selected decider's
questions; it states no rung. A clear floor is evidence, not an automatic `ready` statement.
Pinned declarations (recipe 24) and the key-family register (recipe 41) list the shapes a builder
and a test author share. For a Pack, read Pack design (recipe 29). Before changing a Spec others
rest on, run design-change impact (recipe 30). Follow `sdp-authoring` for capability-based Pack
names and plan pointers.

A design pass over a Pack runs in a loop:

1. Start from what changed since the last pass: the design diff (recipe 35), given the graph
   `sdp build` wrote at the commit that pass read.
2. Compose the pass's reading with the context bundle (recipe 36) within a stated budget, reading
   a large scope in parts and handling a refusal as `sdp-agent-surface`'s "Read a large scope in
   parts" teaches. Narrow it to one perspective's members with the perspective filter (recipe 37)
   when the pass reads for one concern.
3. Hand findings back as a change proposal, the JSON document
   `spec:consumers.intent-composition.proposal` states, and render its memo with the proposal
   memo (recipe 49).
4. Run the proposal check (recipe 38) before an agent applies it, including a proposal received
   from a reviewer: a change whose scope moved since the base goes to a person.

The design backlog (recipe 33), rule coverage (recipe 34) and example-space coverage (recipe 44)
show what the next pass could take up.

### Implement

Use the build backlog (recipe 1) to orient the available ready work and the target Spec context
(recipe 3) to read guarantees, relations, implementation bindings, and verifiers. Inspect the
planning slice (recipe 19) before writing code. In a declared seam, read component membership
(recipe 12) and uses fan-in and fan-out (recipe 13). When the code answers to a Pack's design, read
references into a design (recipe 27), and reuse a value from roles, layers and contexts
(recipe 28) before coining one. Bind code, test, and oracle anchors and executable examples through
`sdp-authoring`, which owns the registrar-first executable transition. An `implemented` fact names
a binding, not a passing or live system, and a `references` edge confers nothing. A reference runs
one way, from code to the design it answers to; when a new design builds on existing code, the
design's own `dependsOn` or `refines` says so, never a reference from the code.

### Review

For a Pack, use the Pack review backbone (recipe 5) and warn-level signals (recipe 8). Without a
Pack, use the target Spec context (recipe 3) with warn-level signals (recipe 8). To review a
change, take the scope from changed-file blast radius (recipe 4) over the diff, then run the
mention audit (recipe 22) with that scope as `params.scope`, passing as `intended` the pairs your
corpus means to leave as prose. Then add what the change touches:

- Addresses and citations: address resolution (recipe 25), entry citations (recipe 51), and
  external registers (recipe 50).
- Structure and architecture: structural neighborhood (recipe 14), census structural coverage
  (recipe 15), the projection-coverage upper bound (recipe 16), the architecture map (recipe 17),
  the decision map (recipe 18), architecture crossings (recipe 32), the architecture walk
  (recipe 42), and planned against realized components (recipe 43).
- A Pack's design from the code side: references into a design (recipe 27), roles, layers and
  contexts (recipe 28), and Pack design (recipe 29).
- Decisions: the decision register (recipe 31).
- External CI results: run evidence (recipe 45), which states no verdict.

A corpus may select the rules-capable recipes as rules files under `sdp validate --rules`; follow
`sdp-authoring`'s "Write and run corpus rules". Review findings and gaps as data; the review never
becomes a workflow gate.

Report a review as a numbered list, most severe first. Each item names one entry address or Spec
section, states the gap in one sentence, and gives the exact text proposed with the address it
replaces or follows. That is the shape a change proposal's changes take, so the list becomes a
proposal without rewriting.

### Close / slim

Use the drift alarm (recipe 2) and changed-file blast radius (recipe 4) over the session diff.
Slimming is optional judgment: remove obsolete implementation-sequencing scaffolding only when
durable law and one prose owner remain. A Design entry may leave its Spec only past the
distillation boundary `spec:model.enrichment-lifecycle` states: the Spec is implemented with a
verifier, and a bound artifact carries the entry. Slimming candidates (recipe 39) lists the pinned
declarations of Specs carrying both `implemented` and `has-verifier`; compare each with the bound
code before removing it, and keep every why. The curation report (recipe 40), over an imports file
`sdp build --imports` writes, lists load-bearing files no anchor covers and `uses` edges the
imports do not back; it is advice, and an anchor you add answers to it as usual.

## Hand off for re-measurement

Name the chosen shape, target Spec ids or Pack, changed files, stated and derived readiness,
findings or blocking open questions, and the exact commands, commits, or artifact locations from
which evidence can be re-derived. An arc-scale handoff follows
`spec:consumers.delivery-session-on-ramp#rule.arcHandoff` and names the Spec ids that carry the
arc's refusals, guarantees and holds, so the next session re-measures them.
Never hand off a carried "verified" verdict: the next session re-runs the named evidence. Git
remains the event log; no session state enters the graph. A handoff fits this form:

```md
## Handoff: <shape> on <Pack or Spec ids>

- Base: <the commit the work read>; head: <the commit it left>
- Targets: <Spec ids>, each with its stated and derived readiness (recipe 9 or 29)
- Changed files: <paths>
- Open: <blocking questions by address>, <findings by validator id>
- Re-measure with: <recipe numbers and their params>, then the project's own gate (`npm run check` in the Protocol repository)
- Next: <the first thing the next session does>
```

## Tripwires

Stop and reconsider when one of these fires; each is a sign the work has slipped out of its shape.

- Capture: you are writing Design entries or rules at `idea`.
- Design: you are writing code, or stating a rung while a blocking question is still yours to
  answer.
- Implement: the target is not stated `ready`, or the drift alarm (recipe 2) is not empty after
  your change.
- Review: you are about to state a rung for the author, or to fix what you were asked to review.
- Close: you are removing a why, or slimming an entry no bound code carries.

All preflights are advisory. They never authorize, block, scope, unlock, or advance delivery work,
and they never create a process state machine.
