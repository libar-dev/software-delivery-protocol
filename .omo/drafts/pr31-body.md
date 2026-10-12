This PR carries [plan 43](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/plans/43-design-iteration-on-a-readable-graph.md): one arc that lets a design be iterated pass after pass on a graph an agent reads in one call. It answers a usability trial of the agent surface, adds the authoring grammar iteration needs, builds the iteration loop on that grammar, and takes two structural lessons from gen 1. The design pass, the build and the acceptance all landed on this branch, and so did a prototype that renders the graph as an Obsidian vault, captured at `idea` (see [Upcoming](#upcoming)). The arc's intent is [`pack:design-iteration-v1`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/design-iteration.pack.sdp.md).

**Read this first.** The owner delegated the design pass's rulings and the `ready` statements to the main thread while away, with Fable 5.1 advising. They are the second table under [Decisions and rulings](#decisions-and-rulings), and each is a candidate for the owner to overturn before merge.

## Why

After PR #30, three agents of two model families (gpt-6.1-sol, Opus 5.5, gpt-6-astra) answered thirteen delivery questions from the skills and `sdp q` alone. All three answered every question correctly, and all three stumbled in the same places: answers too large for a tool's output, misses that named no reason, two meanings of "next rung", rules with no address or line, no recipe for designed-but-unbuilt work, and a recipe label (recipe 31's "narrows") that each repeated as fact. A review of gen 1 (`@libar-dev/architect`) added curation help from file-level imports, proof per rule, a rule for slimming design detail, and skill doctrine. The owner ruled both into one arc on a nine-card sheet, with one direction: fewer, larger PRs, tested against the first adopter's Application Platform redesign. Evidence: [the trial](https://github.com/libar-dev/software-delivery-protocol/tree/0fe675adb87edd466d4284f43c6d53861f6013d5/.omo/evidence/agent-surface-trial).

## What it introduces

**Answers that fit.** Recipes 4 and 29 return a summary by default and the full rows with `detail: true`. Recipe 3 returns the guarantees themselves, recipe 8 names what it exempts, and recipe 9 reports the rung above the stated rung and the rung above the floor. Recipe 25 keeps what it parsed when an address misses and lists the keys that exist. Recipe 31 names its fields `refines` and `refinedBy`, with the reasons the relations state, and recipe 32 also counts same-layer edges. Recipe 33 is the design backlog, and the catalog opens with an index. `--params` repeats, and `--params base=@graph.json` binds a file to one key. A body that does not parse names its line and column. → [`spec:consumers.agent-surface.answer-shapes`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/agent-surface.answer-shapes.sdp.md)

**An authoring grammar for iteration.** Three additions, in every carrier that can express them:

- A rule or flow may carry a key, `- rule: [#graphOnly] …`, addressed `spec:<id>#rule.graphOnly`. Every rule and flow entry now has a line in the location table, an example names the rules it exercises on its `verifies` target, and recipe 34 reports rule coverage. → [`spec:model.rule-keys`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/rule-keys.sdp.md)
- An open question may carry `decider`, `links`, `provisional` and `trigger` fields, so the register (recipe 20) counts deferrals apart from design holds. → [`spec:model.open-question-fields`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/open-question-fields.sdp.md)
- A relation may say why it holds: `{ target, reason }`. → [`spec:model.relation-reasons`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/relation-reasons.sdp.md)

The Protocol's own corpus uses two of the three. Its four deferrals carry their triggers as fields, and its seven decision-to-decision refinements say what they carve out, bound, admit, extend or fix. No Protocol Spec keys a rule yet, so recipe 34 reports nothing on this corpus; keying is proposed for the next PR.

**The iteration loop.** Each piece is a recipe or a schema; none adds a verb.

- The design diff (recipe 35) compares a base graph with the head by Spec, section and entry key. → [`spec:consumers.design-diff`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/design-diff.sdp.md)
- The context bundle (recipe 36) composes one pass's reading material within a budget counted in UTF-16 code units, with a fixed cut order. → [`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/context-bundle.sdp.md)
- The perspective filter (recipe 37) reads a Pack from one concern the corpus keeps as JSON. → [`spec:consumers.review-perspectives`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/review-perspectives.sdp.md)
- A change proposal is a JSON document on a shipped schema, [`schemas/sdp-proposal-1.schema.json`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/schemas/sdp-proposal-1.schema.json), and its check (recipe 38) reports which scopes moved since the base. → [`spec:consumers.intent-composition.proposal`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/intent-composition.proposal.sdp.md)

**Gen 1's structural lessons.**

- `sdp build --imports` writes file-level imports as external, inferred input through a TypeScript adapter. The curation report (recipe 40) ranks load-bearing files no anchor covers and the `uses` edges the imports disagree with. Exhaustive symbol reach stays deferred in its own `idea` Spec. → [`spec:consumers.impact-graph.curation-assist`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/impact-graph.curation-assist.sdp.md)
- Slimming candidates (recipe 39) lists pinned declarations an implemented, verified Spec may drop. It reports and never deletes. → [`spec:model.enrichment-lifecycle`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/enrichment-lifecycle.sdp.md)

**Corpus and vocabulary.**

- `supersedes` stays in the relation list but is parked. Before the first release a replaced decision is deleted, and the signal stays unbuilt until a corpus keeps one. → [`spec:validation.superseded-decision-signal`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/validation/superseded-decision-signal.sdp.md)
- A component is realized only through `satisfies`, and the Protocol's own whole-realization anchors now use it.
- In [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/CONTEXT.md), an entry address gains the `rule` section, and the context bundle and impact graph entries describe what was built.
- The [decision registry](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/docs/concept/DECISIONS.md) gains rows for the Studio's two decisions, MD-41 and MD-42.
- Example-space coverage and run evidence move to [plan 42](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/plans/42-spec-studio-phase-zero.md), where their consumer, the Studio's tests lens, lives.
- The proposal Spec carries the memo recipe as a non-blocking question (`#memoRecipe`), since no recipe renders a proposal for a person yet.

**Skill doctrine.** [`sdp-authoring`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/.agents/skills/sdp-authoring/SKILL.md) teaches how much to write and the new grammar. [`sdp-sessions`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/.agents/skills/sdp-sessions/SKILL.md) adds the design loop, review as a numbered gap list, a handoff form and tripwires. [`sdp-agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/.agents/skills/sdp-agent-surface/SKILL.md) adds summaries, the wrap idiom, empty answers that mislead, and where to log friction. [`AGENTS.md`](https://github.com/libar-dev/software-delivery-protocol/blob/123559ddcdc259e1569d0cf07f53a49d2e49a98d/AGENTS.md#pr-descriptions-as-durable-context)'s PR description standard now asks for what this description does: human views at base and head, the owner's and the delegated rulings apart, and a forward section that proposes the next PR.

## See it

This arc is agent-first. The one human view it moves is the Design Review's Pack page, which is generated and never committed, so here it is where the arc began and at the head. [How these were made](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/.omo/evidence/plan-43-demo/README.md).

**At `258df34`**, ten members stated `defined` and one `idea`, with no design entries and nothing bound:

![The Pack page's Members table at 258df34](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/0fe675adb87edd466d4284f43c6d53861f6013d5/.omo/evidence/plan-43-demo/pack-before.png)

**At the head**, ten members stated `ready`, each with design entries, an implementation and a verifier; the impact graph states `defined` and waits for its author:

![The Pack page's Members table at the head of PR 31](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/0fe675adb87edd466d4284f43c6d53861f6013d5/.omo/evidence/plan-43-demo/pack-after.png)

What changed, member by member, from the design diff (recipe 35) between the two commits:

| Member | Rung | Design entries | Questions closed | Also changed | Units · tests bound |
| --- | --- | --- | --- | --- | --- |
| `consumers.agent-surface.answer-shapes` | defined → ready | +15 | — | — | 2 · 2 |
| `model.rule-keys` | defined → ready | +9 | `#exercisesCarrier`, `#ruleRationale` | rules | 1 · 2 |
| `model.open-question-fields` | defined → ready | +7 | `#leanHome`, `#linkTargets` | rules | 1 · 2 |
| `model.relation-reasons` | defined → ready | +5 | `#mentionReasons`, `#typedAttributes` | rules | 1 · 2 |
| `consumers.design-diff` | defined → ready | +8 | `#comparingRuleHome`, `#passBase` | rules, narrative | 1 · 1 |
| `consumers.context-bundle` | defined → ready | +7 | `#bundleScopes`, `#perspectiveFilter` | rules, intent, narrative, title | 1 · 1 |
| `consumers.review-perspectives` | defined → ready | +4 | — | rules | 1 · 1 |
| `consumers.intent-composition.proposal` | defined → ready | +6 | `#proposer` (opened `#memoRecipe`) | rules | 1 · 1 |
| `model.enrichment-lifecycle` | defined → ready | +2 | — | — | 1 · 1 |
| `consumers.impact-graph.curation-assist` | defined → ready | +6 | — | — | 3 · 2 |
| `consumers.impact-graph` | idea → defined | — | `#symbolIdentity`, moved to `symbol-reach` | rules, intent, title | — |

The grammar as authored, in two of the Protocol's own Specs. A deferral with its trigger, from [`spec:consumers.reference-projection`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/reference-projection.sdp.md?plain=1#L17-L19):

```md
- [blocking #namedOutsideReader] Does a human reader outside the repository need a reference projection the four shipped roots do not serve? …
  - decider: owner
  - trigger: a named consumer outside the repository, with a way to measure that demand inside the arc that builds the projection
```

A decision refinement with its reason, from [`spec:decisions.pack-design-page`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/decisions/pack-design-page.sdp.md?plain=1#L6-L10):

```yaml
relations:
  refines:
    - spec:consumers.design-review
    - target: spec:decisions.shipped-projections-frozen
      reason: carves out the Pack page, which renders the Pack design
```

**What no human view shows yet.** The Design Review is frozen, so its pages leave out question fields, triggers, relation reasons and rule keys, and this PR declined to reshape it. A person reads them today in the carriers on GitHub, or in "Files changed", which renders `.sdp.md` diffs as prose. Plan 42's Studio will show them.

**Regenerate the page yourself.**

```sh
npm ci && npm run build && npm run generate:self-hosting
# open generated/design-review/pack/design-iteration-v1.md in a Markdown preview
```

`generate:self-hosting` writes all four views at once. Every `sdp` command that builds clears `generated/` first, so running `sdp mermaid` after `sdp view` deletes the Design Review.

## Decisions and rulings

Ruled by the owner on the sheet that set the arc's scope:

| Ruling | Carried by |
| --- | --- |
| MD-42, the Studio is built from custom elements without a framework; its registry row enters here, beside MD-41's (HTML stands beside the Markdown Design Review, ratified in PR #30's fold) | [`spec:decisions.studio-web-components`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/decisions/studio-web-components.sdp.md) |
| A file-grain curation layer now, inferred and advisory; symbol identity stays open | [`spec:consumers.impact-graph.curation-assist`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/impact-graph.curation-assist.sdp.md) |
| Proof per rule is a checked field on `verifies`, never an edge | [`spec:model.rule-keys`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/rule-keys.sdp.md) |
| `supersedes` is kept and parked; a replaced decision is deleted by default before the first release | [`spec:validation.superseded-decision-signal`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/validation/superseded-decision-signal.sdp.md) |
| Design detail may leave a Spec once a bound artifact carries it; the rationale stays | [`spec:model.enrichment-lifecycle`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/enrichment-lifecycle.sdp.md) |
| A deferral names its re-entry trigger in a `trigger` field | [`spec:model.open-question-fields`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/open-question-fields.sdp.md) |
| Recipe 31 names its fields after the relation it reads | [`spec:consumers.agent-surface.answer-shapes`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/agent-surface.answer-shapes.sdp.md) |
| Plan 43 as one follow-up PR, then plan 42; fewer, larger PRs | [plan 43](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/plans/43-design-iteration-on-a-readable-graph.md) |

Delegated during the design pass and decided on Fable 5.1's advice. These await the owner's review:

| Ruling | Carried by |
| --- | --- |
| Exhaustive symbol reach moves into its own `idea` Spec; the impact graph keeps the inferred-and-apart law and states `defined` | [`spec:consumers.impact-graph.symbol-reach`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/impact-graph.symbol-reach.sdp.md) |
| Every composing surface hands off on the one proposal contract | [`spec:consumers.intent-composition`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/intent-composition.sdp.md) |
| An example names exercised rules as `exercises` on its `verifies` target; a rule carries no rationale | [`spec:model.rule-keys`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/rule-keys.sdp.md) |
| A link is a Spec id or an entry address, checked as a mention; a worked lean is a decision Spec | [`spec:model.open-question-fields`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/open-question-fields.sdp.md) |
| One free reason for every relation type; intended prose mentions stay corpus data the mention audit takes | [`spec:model.relation-reasons`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/model/relation-reasons.sdp.md) |
| The design diff owns comparison, and the caller always names the base | [`spec:consumers.design-diff`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/design-diff.sdp.md) |
| A bundle takes a Pack or a list of Specs; a perspective's members narrow a Pack; a fifth cut reduces entries to addresses | [`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/context-bundle.sdp.md) |
| A proposal names no proposer | [`spec:consumers.intent-composition.proposal`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/intent-composition.proposal.sdp.md) |
| `--params` is repeatable, with `KEY=@PATH` | [`spec:consumers.agent-surface.recipe-parameters`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/consumers/agent-surface.recipe-parameters.sdp.md) |
| Rule addresses join the address law | [`spec:decisions.checked-mentions`](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/specs/decisions/checked-mentions.sdp.md) |
| `ready` on the ten members the lanes build | the Pack |

## Try it

From the repository root after `npm ci && npm run build`. Measured at close; re-run rather than inherit.

Where the arc stands, as a summary (`detail: true` for full rows):

```sh
pnpm --silent sdp:q "$(cat dist/recipes/29-pack-design.js)" --params '{"pack":"pack:design-iteration-v1"}' --json
```

```json
{ "totals": { "members": 11, "waitingForAuthor": 1, "entries": 69, "declarations": 23, "openQuestions": 1, "blockingQuestions": 0, "withImplementations": 10, … } }
```

What is designed and unbuilt, and which blocking questions are deferrals:

```sh
pnpm --silent sdp:q "$(cat dist/recipes/33-the-design-backlog.js)" --json
pnpm --silent sdp:q "$(cat dist/recipes/20-open-question-register.js)" --json
```

One design pass's reading material, then what changed since the arc began. The base builds with its own engine; recipe 35's catalog text has the full procedure.

```sh
pnpm --silent sdp:q "$(cat dist/recipes/36-the-context-bundle.js)" --params '{"pack":"pack:design-iteration-v1"}' --json
git worktree add --detach .sdp-base 258df34 && ln -s "$PWD/node_modules" .sdp-base/node_modules
npm --prefix .sdp-base run build
node .sdp-base/dist/cli/sdp.js build .sdp-base --exclude explorations --exclude examples --exclude test/fixtures/import/parity
pnpm --silent sdp:q "$(cat dist/recipes/35-the-design-diff.js)" --params base=@.sdp-base/generated/graph.json --params '{"pack":"pack:design-iteration-v1"}' --json
git worktree remove --force .sdp-base
```

The bundle returns the whole Pack in 78,130 code units, about 19,500 tokens, with nothing cut. The diff reports all 11 members changed, part by part, and 10 binding rows.

## Measured at close

Re-measured at `1b014d0`; re-run the recipes rather than inheriting these.

- `npm run check` exits 0: 1,760 pooled tests in 81 files and 93 CLI tests. At `51a3225` it also passed in a depth-1 clone like CI's.
- Validate reports 258 Specs, 5 Packs, 287 anchors, 550 nodes and 1,304 edges, with 0 errors and 4 warnings: the spec-sections gap the owner keeps, and three prose mentions.
- Recipes 1 and 2 are empty. Recipe 20 counts four deferrals and eight holds, seven of them the vault captures' questions for the owner; recipe 33 lists 19 designed, unbuilt Specs.

**Acceptance.** The trial re-run on gpt-6.1-sol answered 13 of 13, read recipe 31's fields as the relation, and found the rule line it was asked for. It missed two criteria: it took 23 calls against the first trial's 20, eight of them on the open task, and its own batched call overflowed once. Evidence: [the re-run](https://github.com/libar-dev/software-delivery-protocol/tree/0fe675adb87edd466d4284f43c6d53861f6013d5/.omo/evidence/agent-surface-trial-2). The first trial keeps the two relay reports verbatim, and the Opus 5.5 report and the gen 1 review as summaries in its synthesis. In [the adopter's read-only pass](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/.omo/evidence/plan-43-adopter-pass.md), the design diff of `pack:history-view` came back in one call. The curation report found an uncovered file 44 others import, and two cross-context imports no `uses` states. That whole Pack needs about 300,000 code units for one bundle.

**Review.** Before the push, gpt-6-astra (xhigh) found no blocker, four majors and five minors. After it, a second gpt-6-astra review and Greptile found two P1 and five P2 defects. Each fix landed with a regression test, the first round's in `0e6674f` to `029fcae` and the second's in `51a3225`. A read-only check of the second fix found three gaps, closed in `be35578`. The ones worth knowing:

- A non-literal value in a question field dropped blocking questions with only a warning, so a Spec could read `ready` falsely. It is now an error.
- Against a base engine that kept no order between rules and flows, the design diff and the proposal check invented moves. They now compare order within each list.
- `--params` read `=@` inside inline JSON as a key binding, and the bundle's fifth cut reduced a pinned declaration whose key contains a dot.

CodeRabbit then posted four minor findings on `759b911`, all valid and fixed in `703f09c`: a missing imports root reported as a raw `ENOENT`, a rule-key sort with no consistent order when only some entries carry a line, a rule-exercises finding whose path changed with edge order, and the schema test's reliance on ESLint's hoisted `ajv`. Plan 43's "Review" section has the tables and this round.

## Feedback wanted

- **The delegated rulings above.** Which would you rule differently?
- **Bundles in a declaration-heavy Pack.** The adopter's `pack:history-view` protects 190 pinned declarations, about 300k code units after every cut. Should a caller be able to reduce pinned declarations to their addresses, which the protected list refuses today?
- **Curation exclusions.** The imports adapter takes no exclusion, so generated files rank as load-bearing. Add an `exclude` list to its configuration?
- **Dropped question lists.** A non-literal `blocking` flag or question text in a TypeScript question still drops the whole list with a warning, so a blocking question can vanish without an error. Should any dropped question list be an error, as a dropped question field now is?
- **The on-ramp.** The trial's extra calls went to finding the right recipe and to impact answers. Would a one-page task-to-recipe sheet and the impacted Pack ids in recipe 4's summary close that?

## Upcoming

**1. Merge.** The owner reviews the delegated rulings; then merge with a merge commit, as #28 to #30. The adopter then re-pins once, moves its register's deciders, sources and leans onto question fields, and adds the two associations plan 42's acceptance needs: OD-157 in its question's text, and a test anchor on `tests/types/pinned.test-d.ts`.

**2. Next PR: [plan 42](https://github.com/libar-dev/software-delivery-protocol/blob/0fe675adb87edd466d4284f43c6d53861f6013d5/plans/42-spec-studio-phase-zero.md), widened.** The Spec Studio's phase 0 is drafted: `sdp studio` writes a read-only static page set with an index, Pack and Spec pages, and search. Following the fewer-PRs direction, it could take five more lanes:

| Lane | What | Why now |
| --- | --- | --- |
| Studio phase 0 | As drafted, plus `#rule.<key>` anchors, question fields, relation reasons and design columns on the pages | The new grammar has no human view until then |
| PR previews | CI builds the Studio for each PR and publishes it with the stamp file; the description links it | Replaces screenshots like the ones above; moved up from a later phase |
| The tests lens's data | Example-space coverage and run evidence, both `defined` and already joined to plan 42 | The adopter's fifth reader task asks for run evidence; its records need a CTRF mapping first |
| Plan 43's open questions | The four under "Feedback wanted", once ruled, and the memo recipe the Studio's copy action would share | Each is small, and the adopter's bundle needs the first |
| Rule keys at home | Key the Protocol rules that reviews and examples cite, and name them in `exercises` | Recipe 34 and the Studio's rule anchors get real data |
| Obsidian vault | The vault captures' rulings, then the vault as a projection, standing alone or as the Studio's local half | It is the designer's view for iterating on a Pack, and the prototype already runs |

Re-entry: PR 31 merged and the owner's statements on the Studio's phase 0 Specs after plan 42's design pass.

**Captured on this branch: the graph as an Obsidian vault.** A prototype generated an Obsidian vault from the reader's values alone: a note per Spec, Pack, code unit and Model term, relations and checked mentions as wikilinks, entry addresses as block links, and a Base per Pack. Every link resolved, and a Pack's members read as one sortable, filterable table, the view a person needs while iterating on a design. [`pack:obsidian-vault-v1`](https://github.com/libar-dev/software-delivery-protocol/blob/1b014d0132dbb1ec69414b5a2c5731686ef83539/specs/obsidian-vault.pack.sdp.md) holds five `idea` Specs whose blocking questions are the owner's: whether the vault stands alone or is the Studio's local half, note names and properties, the standing views, where a person composes intent, and what regenerates the vault during a pass. The generator and its findings: [`explorations/obsidian-vault/`](https://github.com/libar-dev/software-delivery-protocol/tree/1b014d0132dbb1ec69414b5a2c5731686ef83539/explorations/obsidian-vault).

![The design-iteration Pack's members as an Obsidian Base](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/1b014d0132dbb1ec69414b5a2c5731686ef83539/explorations/obsidian-vault/pack-base-in-obsidian.png)

**3. Then: corpus rules and architecture constraints.** `spec:validation.corpus-rules` and `spec:validation.architecture-constraints` are both `defined`, with their questions ruled in PR #30: `sdp validate --rules PATH`, findings in a labelled corpus section, and forbidden layer pairs as data walked by a recipe over recipe 32. The realization comparison from `spec:model.planned-architecture` fits the same arc. Acceptance: the adopter's check script loses its graph half, about 145 of 363 lines, on the Application Platform redesign.

**4. Statements waiting for the owner, no code needed.** `spec:consumers.impact-graph` and `spec:consumers.intent-composition` state `defined`, and the floor already holds `ready` for both.

**Still deferred, with triggers not yet met** (recipe 20): exhaustive symbol reach; roadmap views; the reference projection; structural Mermaid, whose trigger the Studio's architecture lens may meet; and the runtime overlay, held on observation identity until run evidence exists. The superseded-decision signal stays parked until a corpus keeps a replaced decision. Recipe 33 lists the other designed, unbuilt Specs.

Refused, and staying refused:

- Symbol identity in this arc; curation output that authors intent, gates, or reads a layout convention in the engine.
- An entry address in an id slot; rule-grain proof is a checked field, never a `verifies` target.
- Reshaping the frozen Design Review to show question fields or rule anchors.
- A new reader method or query verb.
- A status, date or verdict on a question or a proposal.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
