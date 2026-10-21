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

When a session needs human-readable output, the public publishers are `view`, `census`, `mermaid`,
`gherkin`, and `studio`. Each one's build first removes all five roots, so after one publisher runs
only its own root is current. The repository's generate/check scripts preserve and publish all five roots
together. `sdp generate` publishes all five from one validated graph; it synchronizes the vault first and leaves it alone under `--check-clean`. In check mode a prior tree must exist for each root; Design Review checks repeat-render
determinism, while census, Mermaid, Gherkin and Studio also compare the prior tree's bytes with
the current render.

Use `sdp studio --watch` to rebuild after carrier edits. `--base PATH` with optional
`--base-label TEXT` adds a design comparison; repeatable `--runs PATH` adds external CTRF runs.
Follow `spec:consumers.spec-studio.publisher.watch` and `spec:consumers.spec-studio.data.inputs`.
After building, `sdp stamp` records the publishing metadata. For linked notes use
`sdp vault --out DIR`; its `--watch` also follows source anchors. Follow
`spec:consumers.spec-studio.sharing` and `spec:consumers.obsidian-vault.iteration`.

An adopter selects its root and exclusions through its installed package runner:

```sh
pnpm exec sdp q '<body>' --root PATH
pnpm exec sdp q '<body>' --root PATH --exclude PATH --exclude PATH
```

Pass a parameterized recipe its subject as JSON data with `--params` (or `--params @PATH` for a
file), never by editing the body; each recipe names its parameter, and the build ships every body
as `dist/recipes/<NN>-<slug>.js`. The recipe result informs the session; it never grants
permission or records a verdict.
Bodies receive `g`, `graph`, `report`, `params` and `recipes`; call a shipped body with
`recipes(number, parameters?)`, following `spec:consumers.agent-surface.evaluation-sink`.

For a corpus upgrade, measure capability adoption (recipe 47), then review the rule-key proposal
(recipe 48) through recipe 38 before an agent applies it, and render its review memo with recipe 49. Follow
`docs/agent-surface/upgrade-guide.md` for the upgrade steps.

## Choose an advisory work shape

### Capture / refine

Use concept search (recipe 6) to find the existing family and avoid duplicate intent, and entry
search (recipe 23) when you hold a key or a term and need the entry that already states it. Use the
lower ladder (recipe 11) to see current stated and derived readiness, then promotion preflight
(recipe 9) before a human changes a rung. Follow `sdp-authoring` for the minimal lawful `idea`
carrier, `sdp new spec`, the `validate --watch` loop, and the one-kind rule.
For stable step keys and term addresses, follow `sdp-authoring` and the carrying Specs,
`spec:carrier.step-keys` and `spec:model.term-addresses`.

### Design

Use promotion preflight (recipe 9) on the target, the planning slice (recipe 19) for neighborhood
and shaping decisions, dependency footing (recipe 21) for the stated and derived readiness of
every Spec the target rests on, and readiness divergence (recipe 7) across the corpus. Use
dependency cycles (recipe 26) to see whether the target rests on itself through `dependsOn`.
Resolve the target's blocking open questions and review the carrying Specs. The open-question
register (recipe 20) lists every open question in the corpus when the neighbors matter too. The
statement queue (recipe 46) orders waiting readiness statements and the selected decider's questions;
it states no rung. Follow `sdp-authoring` for capability-based Pack names and plan pointers. A
clear floor is evidence, not an automatic `ready` statement. Use pinned declarations (recipe 24)
to list every signature, type, validator or table the target and its neighbors pin as a code span
opening a keyed Design entry, so a test author and a builder working apart read one list. The
key-family register (recipe 41) lists every Design and UI entry whose key starts with a prefix
you give, such as `limit` or `error`, across the corpus, a Pack or a list of Specs. When the
design is a Pack, read it with Pack design (recipe 29): per member, the stated next rung and what
holds the member below it, the design columns, open questions with their lines, and the code that
answers to it. Before changing a Spec, run design-change impact (recipe 30) for every Spec that
rests on it and the units, verifiers, and Packs the change asks to follow.

A design pass over a Pack runs in a loop. Start from what changed since the last pass, the design
diff (recipe 35) given the graph `sdp build` wrote at the commit that pass read. Compose the pass's
reading material with the context bundle (recipe 36) within a stated budget; `params.part` from
1 through the returned `part.of` reads the complete scope in parts. Narrow it to one
perspective's members by the perspective filter (recipe 37) when the pass reads for one concern.
Hand findings back as a change proposal, the JSON document `spec:consumers.intent-composition.proposal`
states, and render its memo with recipe 49, then run the proposal check (recipe 38) before an agent applies it: a change whose scope
moved since the base goes to a person. The design backlog (recipe 33) lists what is designed and
unbuilt; rule coverage (recipe 34) lists keyed rules no example exercises. Example-space coverage
(recipe 44) lists slot values no example binds and slots that are not enumerable.

### Implement

Use the build backlog (recipe 1) to orient the available ready work and the target Spec context
(recipe 3) to read guarantees, relations, implementation bindings, and verifiers. Inspect the
planning slice (recipe 19) to see refinement neighbors, bound components, and entry points before
writing code. When the work lives in a declared seam, use component membership (recipe 12) and uses
fan-in/fan-out (recipe 13) to see the units and neighbors before binding. When the code answers
to a Pack's design, use references into a design (recipe 27) to see which units already reference
or realize each member and which implemented Specs each member builds on, and roles, layers and
contexts (recipe 28) to reuse a role, layer, or context value before coining one. Bind code, test, and oracle anchors in either form, with `satisfies`,
`references`, `role`, and the structural `component` and `uses` fields, and executable examples
through `sdp-authoring`, which owns the registrar-first executable transition; an `implemented`
fact names a binding, not a passing or live system, and a `references` edge confers nothing. A
reference runs one way, from code to the design it answers to; when a new design builds on
existing code, the design's own `dependsOn` or `refines` says so, never a reference from the code.

### Review

For a Pack, use the Pack review backbone (recipe 5) and warn-level signals (recipe 8). Without a
Pack, use the target Spec context (recipe 3) with warn-level signals (recipe 8). To review a
change, take the scope from changed-file blast radius (recipe 4) over the diff, then run the
mention audit (recipe 22) with that scope as `params.scope`. Use address resolution (recipe 25) on
the entry addresses a register, a test, or a page cites outside the Specs. Entry citations
(recipe 51) lists anchored source and test lines citing entries and unresolved citations. External
registers (recipe 50) checks prose tokens against a supplied register and answers as a rules file. When reviewing
component, architecture, or projection questions, use structural neighborhood (recipe 14), census
structural coverage (recipe 15), the projection-coverage upper bound (recipe 16), the architecture
map (recipe 17), and the decision map (recipe 18). For a Pack reviewed from the code side, use
references into a design (recipe 27): per member, the referencing units, the realizing units, and
whether a verifier is bound, with an empty column read as unbound. Use roles, layers and contexts
(recipe 28) to review the architecture vocabulary the anchors state and to spot two spellings of
one value. Pass the mention audit the pairs your corpus means to leave as prose as `intended`, so
they report apart from missing relations. To review a Pack's design as it stands, use Pack design (recipe 29); to review decisions,
the decision register (recipe 31), with each decision's rung, supersession, refinement both ways
with the reasons the relations state, and the Specs it shapes; to review dependency direction, architecture crossings (recipe 32), which reports the
`uses` edges that cross a context or layer and refuses nothing. For a corpus's own architecture
rules, run the architecture walk (recipe 42), which reports forbidden layer pairs and isolated
contexts, with unstated layers kept as unclassified. Planned against realized components
(recipe 43) lists component designs whose anchors are absent or differ. Run evidence (recipe 45) joins caller-supplied CTRF records at test-file grain, without changing graph facts or stating a verifier verdict. A corpus may select the
walk as a rules file under `sdp validate --rules`; follow `sdp-authoring` for per-file parameters
and the separate corpus findings. Review findings and gaps as data;
the review never becomes a workflow gate.

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
declarations of implemented, verified Specs; compare each with the bound code before removing it,
and keep every why. The curation report (recipe 40), over an imports file
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
