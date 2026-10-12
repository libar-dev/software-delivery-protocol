This PR carries [plan 43](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/plans/43-design-iteration-on-a-readable-graph.md): one arc that lets a design be iterated pass after pass on a graph an agent reads in one call. It answers a usability trial of the agent surface, adds the authoring grammar iteration needs, builds the iteration loop, and takes two structural lessons from gen 1. The design pass, the build and the acceptance all landed on this branch.

**Read this first.** The owner delegated the design pass's rulings and the `ready` statements to the main thread while away, with Fable 5.1 advising. Every delegated ruling is listed below and in the plan's "design pass, as run" section; each is a candidate for the owner to overturn before merge.

## Why

After PR #30, three agents of two model families (gpt-6.1-sol, Opus 5.5, gpt-6-astra) answered thirteen delivery questions from the skills and `sdp q` alone. All three answered every question correctly, and all three stumbled in the same places: answers too large for a tool's output, misses that named no reason, two meanings of "next rung", rules with no address or line, no recipe for designed-but-unbuilt work, and a recipe label (recipe 31's "narrows") each repeated as fact. A review of gen 1 (`@libar-dev/architect`) added curation help from file-level imports, proof per rule, a rule for slimming design detail, and skill doctrine. The owner ruled those into one arc ([evidence](https://github.com/libar-dev/software-delivery-protocol/tree/feature/design-iteration-v0/.omo/evidence/agent-surface-trial)).

## What it introduces

The arc's intent is [`pack:design-iteration-v1`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/design-iteration.pack.sdp.md). Every member now carries keyed Design entries naming its fields: 69 entries, 23 of them pinned declarations, and no open question.

**Answers that fit.** Recipes 4 and 29 return a summary by default and the full rows with `detail`; recipe 3 returns the guarantees themselves; recipe 9 reports the rung above the stated rung and the rung above the floor; recipe 25 keeps what it parsed when an address misses and lists the keys that exist; recipe 31 names its fields `refines` and `refinedBy`; recipe 33 is the design backlog. `--params` repeats, and `--params base=@graph.json` binds a file to one key. A body that does not parse names its line and column. → [`spec:consumers.agent-surface.answer-shapes`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/agent-surface.answer-shapes.sdp.md)

**An authoring grammar for iteration.** Three additions, in all three carriers where the carrier can express them:

- A rule or flow may carry a key, `- rule: [#graphOnly] …`, addressed `spec:<id>#rule.graphOnly`. Every rule and flow entry now has a line in the location table, and an example names the rules it exercises on its `verifies` target. Recipe 34 reports rule coverage. → [`spec:model.rule-keys`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/model/rule-keys.sdp.md)
- An open question may carry `decider`, `links`, `provisional` and `trigger` fields, so the register (recipe 20) counts deferrals apart from design holds. → [`spec:model.open-question-fields`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/model/open-question-fields.sdp.md)
- A relation may say why it holds: `{ target, reason }`. → [`spec:model.relation-reasons`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/model/relation-reasons.sdp.md)

The Protocol's own corpus uses all three: its four deferrals carry their triggers as fields, and its seven decision-to-decision refinements state what they carve out, bound, admit, extend or fix.

**The iteration loop.** Each piece is a recipe or a schema; none adds a verb:

- The design diff (recipe 35) compares a base graph with the head by Spec, section and entry key. → [`spec:consumers.design-diff`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/design-diff.sdp.md)
- The context bundle (recipe 36) composes one pass's reading material within a budget counted in UTF-16 code units, with a fixed cut order. → [`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/context-bundle.sdp.md)
- The perspective filter (recipe 37) reads a Pack from one concern the corpus keeps as JSON. → [`spec:consumers.review-perspectives`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/review-perspectives.sdp.md)
- The change proposal is a JSON document with a shipped schema, and its check (recipe 38) reports which scopes moved since the base. → [`spec:consumers.intent-composition.proposal`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/intent-composition.proposal.sdp.md)

**Gen 1's structural lessons.**

- `sdp build --imports` writes file-level imports as external inferred input through a TypeScript adapter, and the curation report (recipe 40) ranks load-bearing files no anchor covers and the `uses` edges imports disagree with. → [`spec:consumers.impact-graph.curation-assist`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/impact-graph.curation-assist.sdp.md)
- Slimming candidates (recipe 39) lists pinned declarations an implemented, verified Spec may drop. → [`spec:model.enrichment-lifecycle`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/model/enrichment-lifecycle.sdp.md)

**Skill doctrine.** [`sdp-authoring`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/.agents/skills/sdp-authoring/SKILL.md) teaches how much to write and the new grammar. [`sdp-sessions`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/.agents/skills/sdp-sessions/SKILL.md) adds the design loop, review as a numbered gap list, a handoff form and tripwires. [`sdp-agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/.agents/skills/sdp-agent-surface/SKILL.md) adds summaries, the wrap idiom, empty answers that mislead, and where to log friction.

## Rulings

Rulings the owner made before the arc are in plan 43's "Why". These the owner delegated during the design pass, decided on Fable 5.1's advice:

| Ruling | Carried by |
| --- | --- |
| Exhaustive symbol reach moves into its own `idea` Spec; the impact graph keeps the inferred-and-apart law and states `defined` | [`spec:consumers.impact-graph.symbol-reach`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/impact-graph.symbol-reach.sdp.md) |
| Every composing surface hands off on the one proposal contract | [`spec:consumers.intent-composition`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/intent-composition.sdp.md) |
| An example names exercised rules as `exercises` on its `verifies` target; a rule carries no rationale | [`spec:model.rule-keys`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/model/rule-keys.sdp.md) |
| A link is a Spec id or an entry address, checked as a mention; a worked lean is a decision Spec | [`spec:model.open-question-fields`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/model/open-question-fields.sdp.md) |
| One free reason for every relation type; intended prose mentions stay corpus data the mention audit takes | [`spec:model.relation-reasons`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/model/relation-reasons.sdp.md) |
| The design diff owns comparison, and the caller always names the base | [`spec:consumers.design-diff`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/design-diff.sdp.md) |
| A bundle takes a Pack or a list of Specs; a perspective's members narrow a Pack; a fifth cut reduces entries to addresses | [`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/context-bundle.sdp.md) |
| A proposal names no proposer | [`spec:consumers.intent-composition.proposal`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/intent-composition.proposal.sdp.md) |
| `--params` is repeatable, with `KEY=@PATH` | [`spec:consumers.agent-surface.recipe-parameters`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/consumers/agent-surface.recipe-parameters.sdp.md) |
| Rule addresses join the address law | [`spec:decisions.checked-mentions`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/specs/decisions/checked-mentions.sdp.md) |
| `ready` on the ten members the lanes build | the Pack |

## Try it

From the repository root after `npm ci && npm run build`. Measured at close; re-run rather than inherit.

Where the arc stands, as a summary (`detail: true` for full rows):

```sh
pnpm --silent sdp:q "$(cat dist/recipes/29-pack-design.js)" --params '{"pack":"pack:design-iteration-v1"}' --json
```

```json
{ "totals": { "members": 11, "waitingForAuthor": 1, "entries": 69, "declarations": 23, "openQuestions": 0, "withImplementations": 10, … } }
```

What is designed and unbuilt, and which blocking questions are deferrals:

```sh
pnpm --silent sdp:q "$(cat dist/recipes/33-the-design-backlog.js)" --json
pnpm --silent sdp:q "$(cat dist/recipes/20-open-question-register.js)" --json
```

One design pass's reading material, then what changed since the arc began (the base builds with its own engine; recipe 35's catalog text has the full procedure):

```sh
pnpm --silent sdp:q "$(cat dist/recipes/36-the-context-bundle.js)" --params '{"pack":"pack:design-iteration-v1"}' --json
git worktree add --detach .sdp-base 258df34 && ln -s "$PWD/node_modules" .sdp-base/node_modules
npm --prefix .sdp-base run build
node .sdp-base/dist/cli/sdp.js build .sdp-base --exclude explorations --exclude examples --exclude test/fixtures/import/parity
pnpm --silent sdp:q "$(cat dist/recipes/35-the-design-diff.js)" --params base=@.sdp-base/generated/graph.json --params '{"pack":"pack:design-iteration-v1"}' --json
git worktree remove --force .sdp-base
```

The bundle returns the whole Pack in about 77,000 code units, roughly 19,000 tokens, with nothing cut. The diff reports all 11 members changed, part by part, and 10 binding rows.

At close: `npm run check` exits 0 with 1,750 pooled tests in 81 files and 93 CLI tests. Validate reports 253 Specs, 287 anchors, 0 errors and 4 warnings (the spec-sections gap the owner keeps, three prose mentions). Recipes 1 and 2 are empty.

**Acceptance.** The trial re-run on gpt-6.1-sol answered 13 of 13, read recipe 31's fields as the relation, and found the rule line it was asked for. It took 23 calls against the first trial's 20, eight of them on the open task, and its own batched call overflowed once. Evidence: [`agent-surface-trial-2/`](https://github.com/libar-dev/software-delivery-protocol/tree/feature/design-iteration-v0/.omo/evidence/agent-surface-trial-2). The adopter's read-only pass is in [`plan-43-adopter-pass.md`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/.omo/evidence/plan-43-adopter-pass.md). The design diff of `pack:history-view` came back in one call. The curation report found an uncovered file 44 others import, and two cross-context imports no `uses` states. The whole Pack needs about 300,000 code units for one bundle.

**Review.** gpt-6-astra (xhigh) found no blocker, four majors and five minors, all fixed with regression tests; the plan's "Review" section has the table.

## Feedback wanted

- **The delegated rulings above.** Which would you rule differently?
- **The bundle in a declaration-heavy Pack.** The adopter's `pack:history-view` protects 190 pinned declarations, about 300k code units after every cut. Should a caller be able to reduce pinned declarations to their addresses, which the protected list refuses today?
- **Curation exclusions.** The imports adapter takes no exclusion, so generated files rank as load-bearing. Add an `exclude` list to its configuration?

## Upcoming

1. The owner reviews the delegated rulings; then merge with a merge commit, as #28 to #30.
2. The adopter re-pins once, moves its register's deciders, sources and leans onto question fields, and adds the two associations plan 42's acceptance needs (OD-157 in its question's text; a test anchor on `tests/types/pinned.test-d.ts`).
3. [Plan 42](https://github.com/libar-dev/software-delivery-protocol/blob/feature/design-iteration-v0/plans/42-spec-studio-phase-zero.md), the Spec Studio's phase 0, renders the rule addresses, question fields and design columns this arc adds.
4. A later arc led by corpus rules and architecture constraints, with the adopter's check-script rewrite as its test.

Refused, and staying refused:

- Symbol identity in this arc; curation output that authors intent, gates, or reads a layout convention in the engine.
- An entry address in an id slot; rule-grain proof is a checked field, never a `verifies` target.
- Reshaping the frozen Design Review to show question fields or rule anchors.
- A new reader method or query verb.
- A status, date or verdict on a question or a proposal.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
