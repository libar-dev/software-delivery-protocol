# Whole-repository review: evidence dossier

This directory is the evidence of one whole-repository review of the Libar Software Delivery
Protocol. It is **arc evidence**: it is committed on the review branch only so the pull request
can link it, and it is **removed before merge**. Nothing here is intended truth. Spec findings
reach the corpus only through a change proposal and an applying commit; record findings reach it
through the cleanup arc, which lands the inventory the owner accepted in its first commit.

## The owner's rulings

The owner has ruled on the review's six questions, its two unsettled items, the proposal, the
inventory and the review's delegated choices. The sections below keep the review's recommendations,
verdicts and counts as they were measured; where a ruling differs, the ruling wins. PR #39 carries
out the rulings on code and Specs; PR #34 carries the article corrections.

| Item                                            | Ruling                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Question 1, symbolic links in discovery (L3-02) | A decision, not an open question: discovery never follows a symbolic link below the root and warns once per link outside excluded or skipped paths; an explicitly named root resolves to its real directory first, which also fixes L4-04                                                 |
| Question 2, a token budget in the panel (L9-F3) | A job-story change, not a Spec question: the panel hands off scope, and the receiving agent picks its own budget and reads the scope with the context bundle                                                                                                                              |
| Question 3, AI-written presentation (L11-01)    | An `idea` capture with four declared relations and a one-line provisional: select existing deterministic readings only; generated text stays outside the Studio and the frozen projections                                                                                                |
| Question 4, bound-file freshness (L12-02)       | An `idea` capture with the owner as decider; its trigger reworded: "a reader cannot tell whether a run at another commit still applies"                                                                                                                                                   |
| Question 5, slot-combination coverage (L12-02)  | An `idea` capture as drafted, with the owner as decider                                                                                                                                                                                                                                   |
| Question 6, a preview of the hand-off (L10-9)   | Split: the missing action label is a code defect against `#ui.gatheredIntents`, and a collapsed, read-only memo preview is ruled yes, with a UI entry and a rule                                                                                                                          |
| U1, PR #32's delegated choices                  | Ratified as the graph carries them today; where a later ruling narrowed one, the later ruling wins; no Spec edit                                                                                                                                                                          |
| U2, "the Studio build computes a join"          | PR #35's refused-list wording was wrong: the build composes every join, and what is refused is a page that recomputes one, or a second graph (`spec:consumers.spec-studio#rule.noSecondGraph`)                                                                                            |
| The change proposal                             | All seven changes accepted                                                                                                                                                                                                                                                                |
| The inventory                                   | Accepted as the answer to `#durableContent`, with row rulings (`inventory.md`, last section). The cleanup arc lands it in its first commit and closes the question there; R6, R8 and the prototypes' new location are settled within that arc or later. R12, added since, awaits a ruling |
| This review's delegated choices                 | Seven ratified, the temporal guard's `evidence/` exemption among them; "design findings stay open questions" is superseded by the rulings on questions 1, 2 and 6                                                                                                                         |
| The article corrections                         | All eight accepted (L10-4, L10-5, L10-7, L10-8, L10-11, L11-02, L9-F6 and L9-F7), as PR #34 applies them in `2dc6a1a2`                                                                                                                                                                    |

## Why this review

The owner asked for a deep review of the repository as one phase of the next work. The review
takes two inputs.

- **The cleanup's blocking question.** The roadmap's first entry,
  `spec:protocol.delivery-record-cleanup`, is held at `idea` by one blocking question,
  `#durableContent`: which content in `plans/`, `reviews/` and the concept documents does no Spec,
  test, decision or recipe carry yet? The review answers it with a measured inventory
  (`inventory.md`).
- **PR #34's product lens.** PR #34 asked that the review take its compact article packet (Parts
  1, 2 and 5 with the generated Studio pages) and its distinction between the seed design, the
  current product and the future AI direction as input. Two product-lens lanes carry it. For them,
  the seed design in `docs/lineage/v0-design/` is a **reference lens, not intended truth**: a seed
  capability the corpus lacks is a question for the owner, never a defect, and a future direction in
  an article authorizes no implementation.

Mid-run, at the owner's request, the review added the two product-lens lanes and a twelfth lane
that reads the recent pull-request descriptions, which AGENTS.md makes the durable narrative record.

## What the review was

- **Base:** `main` at `b5e0a8bea1e3bedd48c616f96c9928e955792753` (PR #36). The review branch
  (`review/whole-repository`) adds three commits on top of it:
  - `209f5553` opens the evidence scaffold, `evidence/pr38/README.md`;
  - `4e78fd14` adds the product-lens lanes to the scaffold;
  - `5f528a15` exempts `evidence/` from the temporal guard (`check-temporal.mjs` and its test),
    beside the existing `.omo/evidence/` exemption, so an inventory can cite the plan files it
    classifies. This was a delegated choice; the owner has ratified it.

  Every lane ran before `5f528a15`, and `src/`, `specs/`, `test/` and the docs the lanes read are
  identical to the base. Verifiers that reported HEAD `209f5553` or `4e78fd14` saw a difference of
  the scaffold file only.

- **Twelve lanes**, each with one reader and one verifier from the other model family:
  - GPT readers (`gpt-6-astra`, xhigh effort) ran as relay-plugin jobs on Codex; their findings
    were verified natively by Claude (`claude-opus-5-5`, high effort).
  - Claude readers (`claude-opus-5-5`, high effort) ran natively; their findings were verified by
    GPT (`gpt-6.1-sol`, high effort) as relay-plugin jobs on Codex.
- **Verdicts.** A verifier reproduced or refuted each finding against the tree, and could change its
  severity. Severities in this dossier are the verifier's. Refutations are listed with their
  reasons: the review is not a volume contest, and a refuted finding is as useful as a confirmed one.
- No reader or verifier changed the review tree. Probes ran on copies or in-memory corpora under
  the session scratchpad; mutation runs were restored with `git checkout` and ended with a clean
  `git status`.

## Lanes

| Lane                                   | Scope                                                                                                           | Reader                                 | Verifier                               | Findings | Confirmed | Refuted | Uncertain |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------- | -------: | --------: | ------: | --------: |
| L1 intent-core                         | `model`, `extraction`, `validation`, `carrier` intent against core engine and `src/testing`                     | GPT, relay job `job-mw0x05zw-b864ff67` | Claude                                 |        5 |         5 |       0 |         0 |
| L2 intent-consumers                    | `consumers` family against `sdp q`, recipes, CLI verbs, Studio and vault inputs                                 | Claude                                 | GPT, relay job `job-mw0xktxj-715d0cd3` |        8 |         5 |       3 |         0 |
| L3 engine-core-code                    | `src/extract`, `src/graph`, `src/validate`, `src/reader`, codegen edge cases                                    | Claude                                 | GPT, relay job `job-mw0xf722-6e9c3efb` |        5 |         3 |       2 |         0 |
| L4 engine-surface-code                 | `src/cli`, publication and watch paths, vault, runner/testing adapters, root scripts                            | GPT, relay job `job-mw0x070p-67d80b46` | Claude                                 |        4 |         4 |       0 |         0 |
| L5 tests-as-evidence                   | mutation testing of high-impact ready Specs against their bound verifiers                                       | GPT, relay job `job-mw0x07kt-07869705` | Claude                                 |        2 |         2 |       0 |         0 |
| L6 agent-surface-vocabulary-governance | `AGENTS.md`, `CONTEXT.md`, `DECISIONS.md`, skills, recipe catalog, concept docs                                 | Claude                                 | GPT, relay job `job-mw0xdywj-6aa5e95e` |        8 |         6 |       2 |         0 |
| L7 inventory-plans-concept             | durable-content inventory of `plans/` and `docs/concept/`                                                       | Claude                                 | GPT, relay job `job-mw0xj425-a47d130d` |       13 |        11 |       2 |         0 |
| L8 inventory-reviews                   | durable-content inventory of `reviews/`                                                                         | GPT, relay job `job-mw0x078e-5e38e0ed` | Claude                                 |        2 |         2 |       0 |         0 |
| L9 outsider-view                       | README quick start, worked example, jobs, package exports, article series                                       | Claude                                 | GPT, relay job `job-mw0xegqo-800e7c90` |        9 |         7 |       2 |         0 |
| L10 seed-to-current                    | the seed design's human review experience against today's Specs and Studio pages; Part 2's seven task questions | Claude                                 | GPT, relay job `job-mw0xwirv-368c9079` |       11 |         6 |       5 |         0 |
| L11 current-to-future                  | Part 5's three AI roles: what exists, what the seed expected, what the future step still needs                  | GPT, relay job `job-mw0xiazc-622aacab` | Claude                                 |        2 |         2 |       0 |         0 |
| L12 pr-record                          | the five most recent merged descriptions (#31, #32, #33, #35, #36) against the graph and commit objects         | GPT, relay job `job-mw0xlypz-c9ab53bc` | Claude                                 |        4 |         2 |       0 |         2 |
| **Total**                              |                                                                                                                 |                                        |                                        |   **73** |    **55** |  **16** |     **2** |

L12's two uncertain items are ledger items, U1 and U2, that the lane raised outside its findings
list and no verifier ruled on; the owner has since settled both (see the owner's rulings). The
counts here stay as the verifiers left them.

Across the twelve lanes, the 55 confirmed findings are 2 high, 26 medium and 27 low:

- L1–L9: 45 confirmed (2 high, 21 medium, 22 low), 11 refuted.
- L10–L11: 8 confirmed (3 medium, 5 low), 5 refuted.
- L12: 2 confirmed (both medium), 0 refuted, 2 unsettled.

Reader reports for GPT lanes and verifier reports for Claude lanes live under
`~/.relay-jobs/software-delivery-protocol-b281175f/<job>/report.md`; the full paths are in
`findings.json`, `product-lens.json` and `pr-record.json`.

## What each lane did not cover

- **L1:** no full test suite, publication checks, exhaustive verifier audit, or detailed Gherkin and
  import review; observation and protocol families had graph triage only. Verifier did not check
  whether the Markdown or Gherkin extractors refuse a non-ratified altitude before the graph exists,
  nor the Gherkin and TypeScript carrier forms of L1-01 and L1-02.
- **L2:** frozen Design Review, census, Mermaid and Gherkin pages rule by rule; most Studio `ui`
  entries; vault note and Bases contents and vault watch; Studio and validate watch; context-bundle
  parts; recipes 37, 38 and 49 beyond diagnostics; `src/runner`, `src/testing`, `src/adapters`;
  rule-by-rule verifier sufficiency; recipe 34 corpus-wide.
- **L3:** most of `gherkin.ts` and `reify.ts`, both `example-space.ts` modules, import emit and
  fidelity, model builders other than anchors, codegen step and space contract bodies,
  `gherkin-kind-honesty.ts`; `src/cli` only at its seams with the reader.
- **L4:** the mutating full gate, destructive filesystem reproductions, browser execution, hosted
  GitHub Actions. Verifier did not cover hard-link temporaries (L4-01), vault watch mode (L4-04) or
  the CI workflows.
- **L5:** full suite under either mutation; whether other unbound tests catch the mutants; browser
  behaviour; the proposed `specTest` anchors were not tried.
- **L6:** decision Spec bodies were not read in full; answer field names spot-checked for about 12 of
  55 recipes; `README.md` and `jtbd-stories/` not audited; no green gate or projection suite.
- **L7:** `reviews/` (L8's lane); ledgers of plans 17, 18a, 20, 21, 22, 24, 26, 29, 32 and 34 were
  spot-checked by section, not read line by line; no green gate; plan 39's TypeScript open-questions
  question not probed.
- **L8:** `plans/` and concept documents (L7's lane), external adopter checkouts, live PR bodies,
  re-running historical experiments, a fresh engine review; 51 images inventoried but not re-viewed.
- **L9:** anything needing the network (`npm ci` from a clean clone, `check:git-install`, package
  manager script-allow settings); `npm run check`, `generate:*` and `sync-evidence.mjs` were not
  run in the review tree; Node 20.0–20.18 not exercised; Studio HTML not inspected visually; vault
  not run; skills only grepped; concept documents only skimmed.
- **L10 and L11:** real-browser interaction, phone rendering, accessibility, deployed previews, CI
  run evidence, and whether the Studio's manual acceptance was ever performed. A browser pass
  against the acceptance tasks in `spec:consumers.spec-studio` would settle them.
- **L12:** live GitHub state and review comments, hosted previews, the `libar-platform` repository,
  test-suite runs, browser acceptance, and a line-by-line reading of each ledger row against its
  carrying Spec (cited addresses were checked to exist, not re-read).

## Routes and duplicates

Confirmed findings by route (ids merged as one item where they are the same finding):

- **Spec (proposal):** L2-2; L2-1 + L6-3 (merged: the reader's undocumented `resolveEntryAddress`);
  L12-01 (the owner's accepted provisional answers, recorded only in PR #36).
- **Code, test and docs (pull request comments):** high: L3-01, L4-01. Medium: L1-01, L1-02,
  L1-03 (also needs a Spec-side reservation of `kind`), L1-04, L4-02, L4-04, L2-3, L5-01, L5-02,
  L9-F2, L6-1, and L6-2 + D1 + L6-5 (merged: concept documents contradict ready, implemented
  Specs). Low: L1-05, L3-03, L4-03, L2-5, L2-6, L6-4, L6-6, C1, L9-F1, L9-F4, L9-F5, L9-F6, L9-F7.
- **Article corrections (comments on PR #34):** medium: L10-4, L10-7. Low: L10-5, L10-8, L10-11,
  L11-02 (`product-lens.md`, section 4).
- **Design (open questions):** L3-02, L9-F3, L11-01, L12-02, L10-9 (`open-questions.md`). The
  owner ruled each: L3-02 became a decision, L9-F3 a job-story change, L10-9 a code defect and a UI
  entry with a rule, and L11-01 and L12-02 `idea` captures.
- **Record (inventory):** R1, R4, R5, R6, L12-01, L12-02 (medium); R2, R7, R8, R9, R11, L8-01,
  L8-02 (low) (`inventory.md`). R12 (low) was added to the inventory after the owner's rulings, by a
  later cross-family review, and is outside the counts above.
- **Unsettled at the review, settled since by the owner:** L12's U1 and U2 (`open-questions.md`,
  last section).
- **Refuted (16):** L2-4, L2-7, L2-8, L3-04, L3-05, L6-7, L6-8, R3, R10, L9-F8, L9-F9 (reasons in
  `findings.json`, under each `verdict.reason`); L10-1, L10-2, L10-3, L10-6, L10-10 (reasons in
  `product-lens.md`, section 6).

## The change proposal

`proposal.json` is one change proposal on the base, seven changes, most severe first:

1. `spec:consumers.agent-surface.answer-shapes#design.wrapIdiom` teaches the `recipes` binding
   instead of inlining a shipped body (L2-2).
2. `spec:consumers.reader` lists `resolveEntryAddress` among the reader's methods (L2-1 + L6-3).
3. `spec:consumers.reader` gains rule `#entryAddressResolution`, the method's contract (L2-1 + L6-3).
4. `spec:protocol.delivery-record-cleanup` gains rule `#inventoryFirst`, the method the owner
   accepted for answering `#durableContent` (L12-01).
5. `spec:protocol.delivery-record-cleanup#question.durableContent` stays blocking; its provisional
   now names the owner's review of the inventory as what settles it (L12-01).
6. `spec:consumers.spec-studio.cited-line-text` records the accepted `#lineText` answer as rule
   `#lineRecorded`, and the question leaves the Spec (L12-01).
7. The same Spec records the accepted `#lineBound` answer as Design entry `lineBound`, and the
   question leaves the Spec (L12-01).

Changes 6 and 7 follow the authoring skill's form for an answered question: a settled question
leaves the Spec and its answer becomes intent. When the proposal was written, `#durableContent` was
only half settled (the owner had accepted how it is answered; the answer is the inventory, which
then awaited review), so changes 4 and 5 record the method and keep the question. The owner has
since accepted the inventory, and ruled when the question closes: when the cleanup arc lands the
inventory in its first commit. Change 5's request and provisional, written before that ruling, close
it once the owner has reviewed the inventory and each piece has moved to its home. The proposal
stays as the owner accepted it; the provisional applied from change 5 must be amended to name the
acceptance and the closing commit. Each change's request names the oracle pin
(`test/self-hosting-oracle/`) that moves with it. Changes 6 and 7 say to apply them at the start of
the cited-line arc, as PR #36 planned, or earlier at the owner's word.

**Recipe 38** (`proposal-check.json`) against the base graph: no schema problem, no diagnostic,
7 changes, 0 moved, 0 unresolved, no incomparable scope. **Recipe 49**'s memo is
`proposal-memo.md`. What the proposal does not carry, and why, is in `not-proposed.md`.

**Trial application.** All seven changes were applied, carriers and oracle pins, to a scratch copy
of the review tree. `sdp validate` stayed at 0 errors and 3 warnings (the same three
`honesty/gaps` warnings as the base), and `test/self-hosting-graph.test.ts`, `test/recipes.test.ts`,
`test/roadmap.test.ts`, `test/roadmap-examples.test.ts`, `test/check-self-hosting-gates.test.ts`,
`test/readiness.test.ts` and `test/census.test.ts` passed (522 tests). The trial found one gap in
the original change 3, now fixed: inserting the rule shifts the oracle's `ruleKeys` indexes for
`spec:consumers.reader`, and the oracle test fails unless the request says so. After the trial,
recipe 20 counted 14 open questions (9 blocking) against 16 (10 blocking) at the base, and recipe 55
moved place 2 from to design to to state, while place 1 stays to design, blocked by
`#durableContent`.

## Integration note: the base graph must come from the base's own build

The first proposal check used a base graph built by running one checkout's CLI over an archive of
`b5e0a8be`. That graph has 967 nodes and 502 anchors instead of 1072 and 607: the extractor trusts
relative builder imports only from the running CLI's own source (`src/extract/protocol-bindings.ts`,
`trustedBuilderModules`), so the anchors whose builders the Protocol's own source imports by relative
path drop out, and `sdp build` still reports 0 errors and 0 warnings (`sdp validate` reports 38 errors on that tree). Recipe 38's
answer is the same against both graphs, and `proposal-check.json` uses the faithful one. The
behaviour is a documented trust boundary; whether `build` should warn is a question no lane
verified, so it is not counted as a finding.

## How to re-measure

Every count and verdict here was measured at the base. Re-run the commands rather than inheriting
the numbers. From the repository root, after `npm run build`:

```bash
# Validation report (expect 0 errors and the retained honesty/gaps warnings)
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity

# Drift alarm, readiness divergence, orphans and gaps, the lower ladder, the build backlog
for n in 01-the-build-backlog 02-the-drift-alarm 07-readiness-divergence 08-orphans-and-gaps 11-the-lower-ladder; do
  pnpm --silent sdp:q "$(cat dist/recipes/$n.js)"; done

# What a Spec guarantees and who verifies it (L2-1/L6-3, L5-01, L5-02)
pnpm --silent sdp:q "$(cat dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js)" --params '{"spec":"spec:consumers.reader"}'

# Concept and entry search (record findings R1-R11, L8-01, L8-02, L9-F3, L11-01)
pnpm --silent sdp:q "$(cat dist/recipes/06-where-is-this-concept.js)" --params '{"term":"trust boundary"}'
pnpm --silent sdp:q "$(cat dist/recipes/06-where-is-this-concept.js)" --params '{"term":"assistant"}'
pnpm --silent sdp:q "$(cat dist/recipes/23-entry-search.js)" --params '{"term":"notebook"}'

# Open-question register and deferral triggers (R6, L11-01, L12-01, L12-02)
pnpm --silent sdp:q "$(cat dist/recipes/20-open-question-register.js)"

# Mention audit (L6-1: expect unbacked 0)
pnpm --silent sdp:q "$(cat dist/recipes/22-mention-audit.js)"

# Design-change impact used to pick mutation targets (L5)
pnpm --silent sdp:q "$(cat dist/recipes/30-design-change-impact.js)" --params '{"specs":["spec:carrier.markdown-body-grammar","spec:model.anchors"]}'

# Decision register, refinedBy pairs (L6-4)
pnpm --silent sdp:q "$(cat dist/recipes/31-decision-register.js)"

# Rule coverage (refuted L2-4)
pnpm --silent sdp:q "$(cat dist/recipes/34-rule-coverage.js)" --params '{"spec":"spec:consumers.intent-composition"}'

# Address resolution (refuted L9-F8 with --root examples/checkout-v1; the open questions' links)
pnpm --silent sdp:q "$(cat dist/recipes/25-address-resolution.js)" --params '{"addresses":["spec:orders.create-order#rule.validCart"]}'
pnpm --silent sdp:q "$(cat dist/recipes/25-address-resolution.js)" --params '{"addresses":["spec:consumers.spec-studio#rule.namedInputs","spec:consumers.context-bundle#rule.cutOrder","spec:consumers.review-perspectives#rule.contentIntact","spec:observation.run-evidence#question.freshness","spec:consumers.agent-surface.example-space-coverage#rule.perSlotOnly"]}'

# The roadmap (recipe 53), its memo (recipe 55; L12-01, L12-02), and the worked example's verifier view (recipe 10)
pnpm --silent sdp:q "$(cat dist/recipes/53-the-roadmap.js)" --params '{"pack":"pack:roadmap"}'
pnpm --silent sdp:q "$(cat dist/recipes/55-the-roadmap-memo.js)" --params '{"pack":"pack:roadmap"}'
pnpm --silent sdp:q --root examples/checkout-v1 "$(cat dist/recipes/10-declared-versus-enabled-verifiers.js)"

# The reader's public keys (L2-1/L6-3) and the raw graph's keys
pnpm --silent sdp:q 'return Object.keys(g)'
pnpm --silent sdp:q 'return Object.keys(graph)'
```

The base graph is not committed: it is 2.7 MB and derivable. Rebuild it from the base with that
tree's own build, then check the proposal and render its memo:

```bash
# Base graph at b5e0a8be (expect 456 specs · 9 packs · 607 anchors → 1072 nodes · 2978 edges)
mkdir ../sdp-base && git archive b5e0a8bea1e3bedd48c616f96c9928e955792753 | tar -x -C ../sdp-base
(cd ../sdp-base && npm ci && npm run build && \
  node dist/cli/sdp.js build . --exclude explorations --exclude examples --exclude test/fixtures/import/parity)
cp ../sdp-base/generated/graph.json ../base-graph.json

# Recipe 38, the proposal check, and recipe 49, the proposal memo
pnpm --silent sdp:q "$(cat dist/recipes/38-the-proposal-check.js)" --params proposal=@evidence/pr38/proposal.json --params base=@../base-graph.json --json
pnpm --silent sdp:q "$(cat dist/recipes/49-the-proposal-memo.js)" --params proposal=@evidence/pr38/proposal.json
```

Code findings carry their own reproduction in `findings.json` (probe shape and expected wrong
output); the mutation findings (L5-01, L5-02) carry the exact diffs and the `npx vitest run`
commands.

## Files

| File                                   | Holds                                                                                                                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                            | this dossier                                                                                                                                                                 |
| `findings.md`                          | the L1–L9 findings, rendered from `findings.json`: confirmed by route, then refuted with reasons                                                                             |
| `findings.json`                        | every L1–L9 finding with its verdict, and the lane metadata                                                                                                                  |
| `product-lens.md`, `product-lens.json` | L10 and L11: the seed-to-current map, Part 2's seven task questions, the current-to-future table, and every finding with its verdict                                         |
| `pr-record.md`, `pr-record.json`       | L12: the ledger of five merged descriptions, its two findings and two unsettled items                                                                                        |
| `inventory.md`                         | the inventory the owner accepted as the answer to `spec:protocol.delivery-record-cleanup#question.durableContent`, from L7, L8 and L12, with the owner's row rulings         |
| `open-questions.md`                    | confirmed design findings drafted as open questions (L3-02, L9-F3, L11-01, L12-02 twice, L10-9), each with the owner's ruling, then L12's two ledger items and their rulings |
| `proposal.json`                        | the change proposal: seven changes on base `b5e0a8be`                                                                                                                        |
| `proposal-check.json`                  | recipe 38's check of the proposal against the base graph                                                                                                                     |
| `proposal-memo.md`                     | recipe 49's memo of the proposal                                                                                                                                             |
| `not-proposed.md`                      | the parts of the findings the proposal does not carry, why, and where each goes                                                                                              |
