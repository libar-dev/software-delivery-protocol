# Libar Software Delivery Protocol

```markdown
## Skills arc: run these first (temporary, mandatory and temporary, while we work on `feat/agent-plugin-1`, added by user)

Before reading any file, load the `sdp-agent-surface` skill and run these three queries from the
repository root. Read 1 and 2 with their notes in `skills/sdp-agent-surface/references/orientation.md`.
They show, in a few hundred lines, what grep would assemble from dozens of carriers and test files:
the graph's surface, the two on-ramp roots read through the frozen join, and every on-ramp's law,
reasons and bindings. Pair them with your own tools: the graph says where truth lives, grep and
file reads open the exact lines.

1. The corpus and its surface (`g`, `graph`, what a row carries and does not, recipe parameters):

   node skills/sdp-agent-surface/scripts/orient.mjs --only 1

2. The two on-ramp roots through `g.specContext` (rules with lines, relations with claims, bindings):

   node skills/sdp-agent-surface/scripts/orient.mjs --only 10 --subjects '{"10":{"specs":["spec:consumers.reading-on-ramp","spec:consumers.authoring-on-ramp"]}}'

3. Every on-ramp Spec: the law its skill teaches (with the authored reasons), what refines it, and
   the anchors that bind it (all from `test/skills.test.ts`; the `SKILL.md` files themselves are
   outside the graph):

   pnpm --silent sdp:q 'const ids = g.specs().filter((s) => /on-ramp|graph-first-planning|shipped-protocol-corpus/.test(s.id)).map((s) => s.id); const short = (id) => id.replace(/^spec:/, ""); return Object.fromEntries(ids.map((id) => { const c = g.specContext(id); const out = graph.edges.filter((e) => e.from === id && e.type !== "belongsTo"); const inn = graph.edges.filter((e) => e.to === id); return [short(id), { readiness: `stated ${c.statedReadiness}, derived ${c.derivedReadiness}`, teaches: out.map((e) => `${e.type} ${short(e.to)}${e.reason ? ` — ${e.reason}` : ""}`), refinedBy: inn.filter((e) => e.type === "refines").map((e) => short(e.from)), boundBy: inn.filter((e) => e.claim === "anchored").map((e) => `${e.from} ${e.type}`) }]; }))'

Notice the compression: queries return in a few lines what grep would assemble from several
carriers and a test file, already joined, with reasons and claims kept apart. That compression,
pairs nicely with your own tools, since `sdp:q` is intended to be used with grep and other ad hoc
tools and common methods for exploration; AI-friendly by design.

```

The Libar Software Delivery Protocol ("the Protocol") keeps software delivery as typed Specs in the
repository, derives one graph from them and generates every other artifact from that graph. This
repository self-hosts: its own Specs under `specs/` are the Protocol's first production corpus,
derived and checked in CI. It is a second take on `@libar-dev/architect`, with zero back-compat:
change a shape outright, with no shim or deprecation path.

Specs and ratified decisions say what the Protocol claims; `src/` and tests are evidence of what it
realizes. A disagreement between them is drift: fix the stale side deliberately, never promote code
behavior into intent and never invent a third behavior.

## Start

Load the `sdp-agent-surface` skill and run orientation from the repository root, passing what you
arrived with (a word, a file, a Spec) as `--subjects`; read each answer with its notes in the skill:

```bash
node skills/sdp-agent-surface/scripts/orient.mjs
```

Skip answers 1 and 5 only when a session-start hook's output, the plugin's or this
repository's, is already in your context; then run the others.

Answer 5 is the next work: recipe 53, `dist/recipes/53-the-roadmap.js`, over `pack:roadmap`. Follow
each entry to its Packs and carrying Specs; the open arc's record is its draft pull request. A
question whose decider is `delegated` is one an agent may answer provisionally, pending the owner's
review. `plans/` and `reviews/` are frozen history: nothing is added to either.

The graph says where truth lives; grep and file reads open the lines it names. Load the matching
`sdp-*` skill before the work it covers. Work is specified in queries: a brief, delegation, hand-off
or pull request description names the skill and carries the exact `sdp:q` bodies or recipe files
that scope the work and show it done.

## Words

`CONTEXT.md` is the vocabulary. At session start read it from the top through its "Delivery facts"
section; read its Term ledger before writing Spec, doc or pull request prose; open the rest by
section. Use its terms exactly and flag a new word under its Flagged ambiguities.

The model, as an index (the exposition is `spec:model.core-model` and `docs/concept/`): one authored
primitive, the Spec, placed by kind × altitude × readiness; Packs group and anchors bind, and
neither states system truth; delivery facts are derived, never authored; claims are never
collapsed; one graph is the read model; git is the event log.

Checks police conformance and honesty, never content quality or workflow
(`spec:decisions.executable-meta-model`): claim "deterministically validated", never "provably
correct". Lead with a decision's name, its code in parentheses: "the typing law (MD-11)"
(`spec:decisions.plain-language-references`). Names: product Libar Software Delivery Protocol, CLI
`sdp`, package `@libar-dev/software-delivery-protocol`; `@libar-dev/` is open source, `@libar-ai/`
commercial.

## Hazards

- Run `sdp q` as `pnpm --silent sdp:q`, and a verb that derives the graph as
  `pnpm --silent sdp <verb> . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`.
  A bare `sdp` is macOS's unrelated binary, `pnpm exec` cannot resolve the package's own bin here,
  and without the exclusions the fixtures join the graph.
- Read findings through `sdp q`'s `report` (orientation answer 4). `sdp validate`, `sdp build`,
  `sdp vault` and every publisher remove the five generated page roots first
  (`spec:consumers.wholesale-view-rewrite#rule.buildInvalidates`); `npm run generate:self-hosting`
  publishes all five again.
- Re-measure: a count, a rung, a finding or a "verified" row belongs to the commit it was measured
  at. Re-run it at yours rather than inherit it.
- Implemented and not `ready` is the drift alarm (recipe 2, `dist/recipes/02-the-drift-alarm.js`).
- `explorations/` and a sibling `architect` clone are evidence, never template:
  rebuild from the ruled Spec.
- The skills and this file sit outside the graph, so their reach reads as unknown. Scope a skill
  change with recipe 56, `dist/recipes/56-the-law-a-spec-rests-on.js`, over each Spec its
  `metadata.realizes` names, and recipe 4, `dist/recipes/04-what-breaks-if-i-change-these-files.js`,
  over `test/skills.test.ts`.
- Record graph friction as a row in the Log of `docs/design/07-graph-needs.md`.
- `CLAUDE.md` is a link to this file: edit `AGENTS.md`.

## Owner's working rules

- Write lean, for outsiders: plain technical language a wider open-source audience can follow. The
  ratified terms are the shared vocabulary, never a licence for dense insider prose.
- A design session edits carriers and leaves the code its Specs will change alone.
- A change proves itself with a test that fails without it.
- Commits are recovery boundaries, not workflow gates. The owner's instruction that opens an arc
  authorizes its commits and push; without one, ask before committing. Commit each coherent unit
  after its gate, from a safe baseline, with only its own changes: never an empty or per-todo
  commit, never unrelated or pre-existing changes. Before stopping without a clean boundary, commit
  the work in progress saying what is incomplete; git cannot recover uncommitted work. Push only on
  the user's explicit request; never use `git stash`.
- Reviews travel as change proposals (`sdp-sessions`). Briefs and prompts stay in the session.
- `docs/concept/DECISIONS.md` admits an entry only past the ADR three-part test: hard to reverse,
  surprising without context, a real trade-off. A Why the base already forced is drift repair, kept
  in git and the pull request description. This is authoring guidance, never a validator.
- `.omo/` belongs to OmO: only OmO sessions read or write it. Every other agent adds no plan, draft
  or evidence there and never deletes, prunes or overwrites what is there; keep your working
  material in your own scratchpad.
- The `~/dev-admin/oh-my-openagent` clone and `~/.omo/omo.jsonc` are the user's: inspect and report
  their state, and check out, pull, build, install globally or edit only when the user asks.

Before opening or resuming an arc, committing evidence, posting a review or writing a pull request
description, read `docs/contributing/arc-record.md`.

## Develop the engine

`npm run check` is the green gate: `check:temporal` → `lint` → `format:check` → `build` → `generate:self-hosting` → `generate:example` → `typecheck` → `typecheck:examples` → `test` → `check:self-hosting-gates` → `check:self-hosting` → `check:example` → `preflight`

The `check:self-hosting` step emits one intentional warning kind, `honesty/gaps`, one per
owner-ratified `ready` Spec, decisions aside, without a resolving verifier binding. `check:example`
reports 0 errors and 0 warnings; its unbound `defined` example is deliberate. Any other warning,
`conformance/prose-mentions` included, is a regression. `npm test` reaches the npm registry.

Tracer bullets: author an example's Specs and anchored code before the carrier or extractor work
they exercise is finished, and when `examples/checkout-v1` stops extracting or validating, fix the
carrier or the extractor, not the example.

Where to look: `docs/concept/` (principle-led design and its reading conventions),
`docs/concept/DECISIONS.md` (decision names), `jtbd-stories/` (the jobs) and `examples/checkout-v1`
(the worked example). Checkout-only practice: `docs/contributing/self-hosting.md`.

## Lineage

`docs/lineage/` is the initial, carefully crafted specification made before implementation
started. It carries the system's functionality, architecture and design in a relatively compact
form, so it is still very good for reference; the ruled Specs say what holds now.
