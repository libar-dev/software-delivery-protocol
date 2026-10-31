# Upgrade a corpus

This guide follows `spec:consumers.upgrade-kit`. Start from a clean worktree so you can review
and record the edits separately. Choose the Protocol commit you want to adopt, re-pin
`@libar-dev/software-delivery-protocol` to it with your package manager, and check the installed
build:

```sh
pnpm exec sdp --version
```

## Measure the corpus

Run capability adoption, recipe 47. It reports the corpus totals, each Pack's counts, and the
places each capability could apply. A count does not ask you to fill every place.
Follow `spec:consumers.upgrade-kit.capability-adoption` for the report's contract.

```sh
pnpm exec sdp q 'return await recipes(47, params)' --params '{"detail":true}' --json
```

Keep the result as your starting measurement. Add your project's `--root` and `--exclude`
arguments where needed. The catalog is
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md`.

## Organize features in epics

Here a capability is one of your corpus's own intended outcomes, not a Protocol capability
that capability adoption counts. Follow `spec:consumers.capability-map` for its law. Read the capability-map summary, recipe 52, before choosing new parents:

```sh
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/52-the-capability-map.js)" --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/07-readiness-divergence.js)" --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/11-the-lower-ladder.js)" --json
```

Pass `--params '{"detail":true}'` for the complete map, or combine it with `epic` to read one
epic. Inspect `damage` and `cycles`; a refused parameter returns `diagnostics` without a map.

An epic states an enduring intended outcome. When an existing hub already owns that outcome,
change its altitude to `epic` and preserve its id, kind and intent. Author a new epic only when
no existing Spec owns the outcome. Choose parents by reading intended truth; paths, Pack
membership and dependencies do not establish refinement.

Keep genuine intermediate parents and multiple-parent relationships. A capability map can show
an epic inside another epic. Examples and decisions remain visible, and descendant counts do
not confer readiness or delivery facts on their parent.

Before reparenting a ready Spec, run promotion preflight, recipe 9, for the proposed parent.
That parent must state at least `defined` and clear its floor. Preserve existing readiness
statements that remain supported; the map never states a rung for you.

Review the carrier diff, validate, then re-run recipes 7, 11 and 52. Compare every previously ready Spec's floor. Read the Studio's Capabilities page and use its Epic filter to inspect the
new scope. Unreached Specs are information, not a requirement to invent a parent. A single
broad epic is lawful; divide it only when the intended outcomes warrant separate identities.

## Model upcoming work in the graph; keep review history in git and pull requests

Author your next bodies of work as Specs and group each in a Pack named for its capability. Make one Pack your roadmap by stating `order: priority` in its manifest and listing the next few entries, first entry first; recipe 53 places each by what it needs, and recipe 55 renders the forward section of a pull request description. Turn each open review finding about a Spec into an open question with `decider`, `provisional` and `links`, or into a change proposal checked by recipe 38. Unresolved intended design lives in open questions. Review disposition and acceptance remain in git and the pull request; neither becomes a graph field. Keep your plan and state documents if you want them; they confer nothing, so point them at Packs and recipes instead of copying counts.

The roadmap law is `spec:consumers.roadmap`; the Protocol's own record convention is
`spec:protocol.roadmap-replaces-plans` and imposes none on an adopter. A defect against settled
intent remains a code finding rather than an invented design question.

## Propose and apply rule keys

Choose one Pack first. Write its base graph with `pnpm exec sdp build .` and save
`generated/graph.json` outside the generated roots before another build. Record the commit
whose corpus it contains. Pass that commit and your Pack id to the rule-key proposal, recipe 48.
Follow `spec:consumers.upgrade-kit.rule-key-proposal` for the proposal's contract:

```sh
pnpm exec sdp q 'return await recipes(48, params)' --params @key-scope.json --json
```

`key-scope.json` contains `commit` and `pack`. Save the answer's `proposal` object as
`proposal.json`. Review the proposed keys and the entries listed as unkeyable. Check the proposal
against the saved base graph with recipe 38:

```sh
pnpm exec sdp q 'return await recipes(38, params)' --params proposal=@proposal.json --params base=@base-graph.json --json
```

Resolve schema problems and unresolved scopes. Send each change whose scope moved since the base to a person, and ask an agent to apply the remaining changes. Inspect the diff, run `pnpm exec sdp validate .`, and record the edits in git. The recipes write no carriers and grant no approval.
The proposal contract is `spec:consumers.intent-composition.proposal`.

## Choose capabilities to adopt

### ruleKeys

Recipe 47 measures this row. Use the rule-key proposal, recipe 48, as shown above to add keys.
The law is `spec:model.rule-keys`.

### questionKeys

Recipe 47 measures this row. Give a question a key when a review or another Spec needs to cite
it. Follow `spec:model.open-question-keys` for the marker and address form.

### questionFields

Recipe 47 measures this row. Add the decider, links, provisional answer or deferral trigger you
know. Read the open-question register, recipe 20, to choose the questions to enrich.
The law is `spec:model.open-question-fields`.

### relationReasons

Recipe 47 measures this row. Explain a relation where its target alone leaves the reader asking
why it holds. Follow `spec:model.relation-reasons` for the carrier form.

### exercises

Recipe 47 measures this row. Read rule coverage, recipe 34, and name the rules an example
actually exercises on its `verifies` relation. The law is `spec:model.rule-keys`.

### pinnedDeclarations

Recipe 47 measures this row. Use pinned declarations, recipe 24, to review the signatures and
shapes a builder and test author share. Follow `spec:extraction.contract-declarations` when
pinning another declaration.

### componentDesigns

Recipe 47 measures this row. Describe a planned component under `spec:model.planned-architecture`.
Use planned against realized components, recipe 43, to compare its design with the code anchors.

### stepKeys

Recipe 47 measures this row. Key a step you expect to reword, then regenerate its contracts and
check the bound examples. Follow `spec:carrier.step-keys` for the vocabulary and binding rules.

### termKeys

Recipe 47 measures this row. Give a Model term a key when another entry needs to cite it.
Follow `spec:model.term-addresses` for the definition marker and address form.

### entryCitations

Recipe 47 measures this row. Cite an entry address in the anchored source that implements or
checks it. Use entry citations, recipe 51, to resolve those citations and find the test lines.
The law is `spec:extraction.entry-citations`.

### perspectives

Recipe 47 measures this row only when you pass your perspective objects as `perspectives`.
Use the perspective filter, recipe 37, to select one concern's Pack members.
The law is `spec:consumers.review-perspectives`.

## Move rules files onto shipped recipes

Replace local copies of recipe bodies with calls through `recipes(number, parameters)`.
Select address resolution, recipe 25, dependency cycles, recipe 26, the architecture walk,
recipe 42, external registers, recipe 50, or entry citations, recipe 51, where they answer your
corpus's policy. Pass each call its own parameters. A rules file can combine their findings:

```js
const addresses = await recipes(25, { addresses: params.addresses ?? [] });
const citations = await recipes(51);
return { findings: [...addresses.findings, ...citations.findings] };
```

Run the file with `sdp validate --rules PATH`, with each `--params` after the rules file it
belongs to. Follow `spec:validation.corpus-rules` and
`spec:consumers.agent-surface.evaluation-sink` for that execution contract.

## Read large Packs and waiting statements

Use the context bundle, recipe 36, with `part: 1`, then request every part through `part.of`.
Follow `spec:consumers.context-bundle`. Use the statement queue, recipe 46, to order waiting
readiness statements and the selected decider's questions. The queue states no rung;
`spec:consumers.readiness-planner` carries its law.

## Publish the roots

After validation, run `pnpm exec sdp generate .` to publish every projection root from one build.
Follow `spec:consumers.command-line` for publishing and checking the generated output.

## Pass subjects as data

Pass a recipe's subject through `--params`, as the README's recipe-caller guidance teaches
under `spec:consumers.adopter-on-ramp`.
Keep the shipped body unchanged. You can run a shipped file directly:

```sh
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/47-capability-adoption.js)" --params @adoption.json --json
```

`adoption.json` might contain `{"detail":true}`. Use `--params KEY=@PATH` for an external JSON
value such as a base graph or proposal. Run recipe 47 again after your edits to compare adoption
with the starting measurement.
