# Executing the whole-repository review

This arc carries out the confirmed findings of the whole-repository review in PR #38, at `main`
`b5e0a8bea1e3bedd48c616f96c9928e955792753`. Each finding there was verified by a second model
family. This directory is arc evidence and is removed before merge.

## Lanes

Each lane runs on its own branch and worktree. One model family implements it; the other reviews
the diff adversarially. A fix proves itself with a test that fails without it. After review, the
lane is merged into this branch, and the full gate runs once over the merged result.

| Lane                     | Findings                                                                 | Implements | Reviews |
| ------------------------ | ------------------------------------------------------------------------ | ---------- | ------- |
| C corpus                 | The seven-change proposal; six owner questions; three capture candidates | Claude     | GPT     |
| W writes inside the root | L4-01 (high), L4-04, L4-02                                               | GPT        | Claude  |
| H1 honesty and carriers  | L3-01 (high), L1-03, L1-04, L1-05                                        | GPT        | Claude  |
| H2 verification runtime  | L1-01, L1-02, L5-01, L5-02                                               | GPT        | Claude  |
| P CLI and package polish | L2-3, L2-5, L3-03, L4-03, L9-F2, C1                                      | Claude     | GPT     |
| D docs and vocabulary    | L6-1, L6-4, L6-6, L2-6, L9-F1, L9-F4, L9-F5                              | Claude     | GPT     |
| S Studio rulings         | Q6a, Q6b, the slice-page rule                                            | Claude     | GPT     |
| L link-warning scope     | Q1n, narrowing Q1's link warning                                         | GPT        | Claude  |

## Results

The owner ruled on all six questions the review raised (see PR #38), and this arc carries the
rulings out. Lanes S and L form a second pass that carries out the rulings the first six lanes
left: Q6's code half, the slice-page rule, and a narrowing of Q1's link warning.

| Lane | Items                                       | Outcome                                                           |
| ---- | ------------------------------------------- | ----------------------------------------------------------------- |
| C    | P1–P7, Q1–Q6, K1–K3                         | applied or adapted; Q6's code half moved to lane S                |
| W    | L4-01, L4-04, L4-02, Q1                     | fixed; L4-04 adapted to the watch root                            |
| H1   | L3-01, L1-03, L1-04, L1-05                  | fixed, except L1-03 (open, below)                                 |
| H2   | L1-01, L1-02, L5-01, L5-02                  | fixed                                                             |
| P    | L2-3, L2-5, L3-03, L4-03, L9-F2, C1         | fixed                                                             |
| D    | L6-1, L6-4, L6-6, L2-6, L9-F1, L9-F4, L9-F5 | fixed                                                             |
| S    | Q6a, Q6b, SP1                               | fixed (Q6a, Q6b); applied (SP1, a rule with a new test)           |
| L    | Q1n                                         | fixed; a delegated narrowing of Q1 that awaits the owner's review |

## Still open

- **L1-03**, a `kind` slot in a Then step. The choice is between reserving `kind` in Then slots
  and changing the Outcome payload representation. The owner's third ruling chose the
  reservation; no lane carries it out yet.
- **R6** (its re-entry conditions, or dropping it), **R8** (its home), and **the plan-46
  prototypes** (their new location) belong to the cleanup arc.

## Out of scope

- **The inventory's record findings** wait for the owner's review and the delivery-record
  cleanup. Nothing in `plans/` or `reviews/` is deleted here.
- **The concept-document drift** (L6-2, D1, L6-5) belongs to the cleanup, which dissolves those
  documents.
- **The article corrections** are in PR #34.
