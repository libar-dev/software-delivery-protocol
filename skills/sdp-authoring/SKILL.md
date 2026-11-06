---
name: sdp-authoring
description: Author Specs and Packs in their carriers and check each edit against the graph. Use when creating or editing `.sdp.md`, `.sdp.gherkin` or Pack manifests, stating a readiness rung, binding code or tests, making an example executable, writing corpus rules, or upgrading a corpus.
metadata:
  realizes: spec:consumers.authoring-on-ramp spec:consumers.adopter-on-ramp spec:consumers.graph-first-planning
---

# Author Specs in their carriers

The carrier is the write surface; the graph, derived on every `sdp q` call, is the read model
(`spec:consumers.edit-model`). Law lives in the Specs cited where it governs; in a project they
ship with the package (`spec:consumers.shipped-protocol-corpus`), and the runner's `--protocol`
queries them.

Run every command from the project root: bodies through
`<skill-dir>/../sdp-agent-surface/scripts/q.mjs`, `<skill-dir>` being this skill's directory, and
other verbs through the project's package runner. Recipe N ships as `dist/recipes/<NN>-<slug>.js` under the installed package root, the
catalog groups the rest by task, such as `docs/agent-surface/recipes.md#readiness-and-honesty`,
and upgrading a corpus follows `docs/agent-surface/upgrade-guide.md`.

## The loop

1. **Open on the query the work needs.** New intent: where is this concept (recipe 6,
   `dist/recipes/06-where-is-this-concept.js`); choose its kind as
   [writing.md](references/writing.md) says, then run `sdp new spec` in the family the search
   finds. Intent needing two kinds is two Specs; no corpus yet: [corpus.md](references/corpus.md).
   An edit: orientation 10 on the Spec, then the law it rests on (recipe 56,
   `dist/recipes/56-the-law-a-spec-rests-on.js`). A design round: the design slice (recipe 54,
   `dist/recipes/54-the-design-slice.js`), read as [design.md](references/design.md) says.
   Resuming after a break or compaction, first run step 3's check over every file the work
   touched: the files, not a summary, say what exists.
2. **Edit the carrier** faithfully: the person's meaning, in their terms, each entry written as
   [writing.md](references/writing.md) says. A choice their words leave open, such as a value, a
   mechanism or an output's shape, stays open: unstated, or an open question with their lean as
   its `provisional` reading; an example that needs it uses that reading. Forms and refusals:
   [carrier.md](references/carrier.md).
3. **Check** with the shipped check body, `scripts/check.js`, passing every file you touched:

```sh
node <skill-dir>/../sdp-agent-surface/scripts/q.mjs "$(cat <skill-dir>/scripts/check.js)" --params '{"files":["<each file you touched>"]}'
```

Done when each touched Spec states the rung you mean, at or below its floor; each finding is one
you expect; `errors` is 0; and the change reads back as the person asked, nothing they left open
settled and nothing added: each anchor's targets and edge types, a Pack's members in order and
its framing, and each changed Spec entry whole (recipe 3,
`dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js`).

A refused carrier stops every query in its root and names each refusal's `file:line`. The loop
runs no `sdp validate`, `sdp build` or publisher, each of which removes the five generated page
roots (`spec:consumers.wholesale-view-rewrite#rule.buildInvalidates`). Only contract generation
([examples.md](references/examples.md)) and corpus rules ([rules.md](references/rules.md))
report outside `report`.

## State the honest rung

A captured Spec states `idea`; every later readiness edit is a person's statement
(`spec:consumers.authoring-on-ramp#rule.capture`). Run promotion preflight (recipe 9,
`dist/recipes/09-promotion-preflight.js`), report `floorReached` and what holds the next rung,
and write the rung the person states, never above the floor (`spec:validation.readiness-floor`).
The Design Review informs it and gates nothing. Reviews and hand-offs: load `sdp-sessions`.

## Ruled homes

Each truth has one home the floor and recipes read; no tag, status or side table.

- Open question: Intent's `### Open questions`; `[blocking]` holds the Spec below `defined`
  (`spec:validation.readiness-floor#rule.definedFloor`), for a design that waits on the answer;
  `[non-blocking]` when the work proceeds on the provisional reading.
- Deferral: a `[blocking]` question with `trigger:`, plus `dependsOn` for a true precondition
  (`spec:decisions.planning-truths-placement`).
- Unsettled fact: a `constraint` Spec whose blocking question names the settling check; Specs it
  bounds declare `constrainedBy` (`spec:validation.typed-dependency-floor`).
- Pending ruling: a `decision` Spec below `ready`, admitted only past the test in
  [writing.md](references/writing.md), `decidedBy` from each Spec it shapes; the owner states its
  `ready` (`spec:decisions.decision-readiness-posture`).
- Checked fact: an `example` that `verifies` it, bound by `specTest`; `has-verifier` is derived,
  never authored, and says a verifier exists, not that it passed (`spec:extraction.delivery-facts`).
- Counts, registers, review scope: derived, never quoted
  (`spec:consumers.agent-surface.register-recipes`): `sdp census`, the open-question register
  (recipe 20), the mention audit (recipe 22), what breaks if I change these files (recipe 4).
- A body of work: a Pack named for its capability; membership confers nothing
  (`spec:carrier.markdown-pack-authoring`).
- Priority: a Pack stating `order: priority`, read with the roadmap (recipe 53); advisory
  (`spec:decisions.roadmap-priority`), never permission (`spec:consumers.delivery-session-on-ramp`).

## Silent hazards

Writing or reviewing an anchor: [binding.md](references/binding.md).

- A relation lives in the frontmatter; `dependsOn:` under Design or UI is plain content.
- In a project, a constant-form anchor binds only through a builder imported from the Protocol
  package or its `/anchors` subpath; a lookalike import mints nothing (`spec:model.anchors`).
- A comment anchor opens with `/**` (a `/*` block is never read) and binds by file and line:
  code moved or deleted beneath it keeps conferring, so review a block with its code.
- A promise added after the anchors reads as covered: rerun the promise test on a design change.
- An entry address cited in source is recorded only in a file that carries an anchor.
- A generated registrar no suite activates runs nowhere, and the graph cannot tell.
- The generated Gherkin root is a page: an edit there is lost at the next build.
- A `.sdp.gherkin` file renamed to `.feature` leaves the graph.
