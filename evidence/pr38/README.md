# Whole-repository review: evidence

This directory holds the evidence of a whole-repository review of the Protocol at `main`
`b5e0a8bea1e3bedd48c616f96c9928e955792753` (PR #36). It is arc evidence: the draft pull request
links it at a pinned commit, and it is removed before merge.

## Why this review

The owner asked for a deep review of the repository as one phase of the next work. Next in the
roadmap is `spec:protocol.delivery-record-cleanup`. That Spec is held at `idea` by one blocking
question: which content in `plans/`, `reviews/` and the concept documents does no Spec, test,
decision or recipe carry yet? So the review also produces that measured inventory.

PR #34 named a second input: its compact article packet (Parts 1, 2 and 5 with the generated
Studio pages) and the distinction between the seed design, the current product and the future AI
direction. Two product-lens lanes carry it. For them, the seed design in `docs/lineage/v0-design/`
is the reference lens: it is still not intended truth, so a seed capability the corpus lacks is a
question for the owner rather than a defect.

## How it runs

Eleven lanes read the tree independently: nine engineering lanes and two product-lens lanes. GPT readers run through the relay plugin on Codex; Claude
readers run natively. A verifier from the other model family then tries to refute each lane's
findings against the tree, re-measuring rather than inheriting.

| Lane                                   | Scope                                                                                                                   | Reader | Verifier |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| L1 intent-core                         | `model`, `extraction`, `validation`, `carrier`, `protocol`, `observation` Specs against the engine core                 | GPT    | Claude   |
| L2 intent-consumers                    | `consumers` Specs against the reader, projections, CLI and recipes                                                      | Claude | GPT      |
| L3 engine-core-code                    | Correctness, determinism and safety of `src/model`, `extract`, `graph`, `validate`, `reader`, `import` and related code | Claude | GPT      |
| L4 engine-surface-code                 | `src/cli`, projections, Studio elements, runner, root scripts and CI workflows                                          | GPT    | Claude   |
| L5 tests-as-evidence                   | Verifier bindings, mutation spot checks and recipe coverage across `test/`                                              | GPT    | Claude   |
| L6 agent-surface-vocabulary-governance | Skills, recipe catalog, `AGENTS.md`, `CONTEXT.md`, the concept docs and the decision registry                           | Claude | GPT      |
| L7 inventory-plans-concept             | Durable content in `plans/` and `docs/concept/` that nothing carries                                                    | Claude | GPT      |
| L8 inventory-reviews                   | Durable content in `reviews/` that nothing carries                                                                      | GPT    | Claude   |
| L9 outsider-view                       | README, worked example, JTBD stories, package metadata and the PR #34 articles                                          | Claude | GPT      |
| L10 seed-to-current                    | The seed design's human review experience against today's Specs and Studio pages, and Part 2's seven task questions     | Claude | GPT      |
| L11 current-to-future                  | Part 5's three AI roles: what exists, what the seed expected, what the future step still needs                          | GPT    | Claude   |

## Where findings go

- **Findings against Specs** become one change proposal based on `b5e0a8be`, checked with
  recipe 38 and summarized by recipe 49's memo.
- **Code, test and docs findings** are listed with their locations.
- **Open design findings** become open questions with a decider, a provisional answer and links.
- **Product-lens findings** are collected in `product-lens.md`: owner questions, capture
  candidates, and article corrections for PR #34.
- **Record findings** form the inventory that answers the cleanup Spec's blocking question.
  Nothing is deleted before the owner reviews it.

Each output file appears here when the review completes.
