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

## Out of scope

- **The inventory's record findings** wait for the owner's review and the delivery-record
  cleanup. Nothing in `plans/` or `reviews/` is deleted here.
- **Owner questions are authored, not answered.** The symbolic-link discovery policy (L3-02)
  stays open, so its code change waits.
- **The concept-document drift** (L6-2, D1, L6-5) belongs to the cleanup, which dissolves those
  documents.
- **The article corrections** are in PR #34.
