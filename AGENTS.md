# Libar Software Delivery Protocol

The Libar Software Delivery Protocol (SDP, "the Protocol") keeps software delivery as typed Specs in the
repository, derives one graph from them and generates every other artifact from that graph. This
repository self-hosts: its own Specs under `specs/` are the Protocol's first production corpus,
derived and checked in CI. It is a second take on `@libar-dev/architect`, with zero back-compat:
change a shape outright, with no shim or deprecation path.

Specs and ratified decisions say what the Protocol claims; `src/` and tests are evidence of what it
realizes. A disagreement between them is drift: fix the stale side deliberately, never promote code
behavior into intent and never invent a third behavior.

## Active development

Enable full **transition to spec-driven development** and completely eliminate planning in Markdown
files and prose. This will require some adjustments because plain Markdown will be completely eliminated
and the effort should not be duplicated. Specs are much closer to actual code and tests and will require
less "translation" from prose to code. A properly prepared and designed spec will almost
completely replace standard prompts in plain English.

The Markdown written to bootstrap the Protocol (`plans/`, `reviews/`, `docs/concept/`,
`docs/design/`, `docs/lineage/`, `jtbd-stories/`, `docs/articles/`) has no meaning in the Protocol
and sits outside the SDP state: a Spec states its own reasons, and a Spec you write or change
cites none of these files. Leaving the state is not a bulk deletion. The files stay in the
repository while their value moves into Specs, over months:

- **Transfer the value, then delete.** Before a file goes, list what it holds that no Spec, test,
  decision or recipe carries, give each piece its home, and have a reviewer from another model
  family check the list. Delete the file in its own change, after the carrying work lands.
- **Most files go; publishing material stays.** Most of these files are deleted once their value
  is in Specs. Articles for publishing and README files stay in the repository, still outside the
  state.
- **Documentation moves toward projections:** the important documentation-like artifacts become
  pages generated from the graph, live, or generated documentation where that fits.
- `docs/concept/DECISIONS.md` admits an entry only past the ADR three-part test: hard to reverse,
  surprising without context, a real trade-off. A Why the base already forced is drift repair, kept
  in git and the pull request description. This is authoring guidance, never a validator.
    - Technical debt: **Decisions will move to SDP specs** in a planned and controlled fashion.
- Technical debt: `docs/design/` is Markdown design material that consolidates into Specs once
  spec-driven development is enabled.

## Focus / Owner's words

**The Spec is the prompt** and detailed design — once we enable spec-driven development,
wrappers are gone: "context", or "session-prep" document or "design-brief" documents.
Finalized specs go through numerous spec/design review iterations before a person states `ready`.

SDP is an **event-sourced system**: Git is the **event log.** **The graph is the truth; everything else is a projection.**

### Native skills

| Skill | When to use it |
|---|---|
| `sdp-agent-surface` | Start here to query the graph and find the exact Specs, files and lines to read. |
| `sdp-authoring` | Create or change a Spec or Pack, bind code and tests, or make an example executable. |
| `sdp-sessions` | Carry out, review, resume or hand off delivery work using current graph evidence. |
| `sdp-studio` | Publish or read the Studio and handle a change someone requests from a page. |
| `sdp-vault` | Keep an Obsidian vault in sync and turn a person's intent notes into checked edits. |

## Start - query the SDP state, transform and manipulate 

**When exploring, start with `sdp:q`, and combine with grep and other commont tools you use.**

Load the `sdp-agent-surface` skill and run orientation from the repository root, passing what you
arrived with (a word, a file, a Spec) as `--subjects`, keyed by answer number
(`'{"8":{"terms":["vault"]}}'`); read each answer with its notes in the skill:

```bash
node skills/sdp-agent-surface/scripts/orient.mjs
```

Next work, recipe 53 over `pack:roadmap`:

```bash
pnpm --silent sdp:q "$(cat dist/recipes/53-the-roadmap.js)" --params '{"pack":"pack:roadmap"}'
```

### The Graph and `sdp:q` - Dense/rich and AI friendly delivery process state data

Notice the compression: queries return in a few lines what grep would assemble from several
carriers and a test file, already joined, with reasons and claims kept apart. That compression,
pairs nicely with your own tools, since `sdp:q` is intended to be used with grep and other ad hoc
tools and common methods for exploration; **AI/grep-friendly by design.** 

**Explore catalog of recipes:** Query`sdp:q`  without arguments. 

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
- Re-measure: a count, a rung, a finding, a "verified" row or a summary's word on what exists
  belongs to the commit it was measured at. Re-run it at yours (`git rev-parse --short HEAD`),
  first on resuming after a break or compaction, rather than inherit it.
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
- A design pass edits carriers and leaves the code its Specs will change alone.
- A change proves itself with a test that fails without it.
- Commits are recovery boundaries, not workflow gates. The owner's instruction that opens an arc
  authorizes its commits and push; without one, ask before committing. With it, commit each
  coherent unit after its gate, from a safe baseline, with only its own changes: never an empty or
  per-todo commit, never unrelated or pre-existing changes; and before stopping without a clean
  boundary, commit the work in progress saying what is incomplete, since git cannot recover
  uncommitted work. Push only on the user's explicit request; never use `git stash`.
- Reviews travel as change proposals (`sdp-sessions`). Briefs and prompts stay in the session.

## Develop the engine

`npm run check` is the green gate: `check:temporal` → `lint` → `format:check` → `build` → `generate:self-hosting` → `generate:example` → `typecheck` → `typecheck:examples` → `test` → `check:self-hosting-gates` → `check:self-hosting` → `check:example` → `preflight`

The `check:self-hosting` step emits one intentional warning kind, `honesty/gaps`, one per
owner-ratified `ready` Spec, decisions aside, without a resolving verifier binding. `check:example`
reports 0 errors and 0 warnings; its unbound `defined` example is deliberate. Any other warning,
`conformance/prose-mentions` included, is a regression; for a prose mention, declare the relation
that holds or name the Spec in words instead of by id. `npm test` reaches the npm registry.

Tracer bullets: author an example's Specs and anchored code before the carrier or extractor work
they exercise is finished, and when `examples/checkout-v1` stops extracting or validating, fix the
carrier or the extractor, not the example.

Where to look: `docs/concept/` (principle-led design and its reading conventions),
`docs/concept/DECISIONS.md` (decision names), `jtbd-stories/` (the jobs) and `examples/checkout-v1`
(the worked example). Checkout-only practice: `docs/contributing/self-hosting.md`. Read it before
an edit to anything the self-hosting oracle pins, a Spec, Pack member, anchor or retained warning,
existing ones included: the oracle changes in the same commit.

## Lineage (temporary: Specs and queries replace it)

`docs/lineage/` is the initial, carefully crafted specification made before implementation
started. It carries the system's functionality, architecture and design in a relatively compact
form, so it is still very good for reference; the ruled Specs say what holds now. It is prose, and
like all planning prose here (Active development) it gives way to Specs and queries. Before
reading a lineage document, read [the lineage README](docs/lineage/README.md): the why the
[v0 vision](docs/lineage/v0-design/00-vision-and-product.md) still carries, its terms translated,
and the queries that already answer most of what lineage holds.
