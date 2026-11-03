# A second review pass over PRs #34, #38 and #39

The previous session left three pull requests green and waiting for the owner: #34 (the
articles and their evidence check), #38 (the whole-repository review) and #39 (executing that
review). This pass reviews all three again, as one cross-family review, and fixes what it
confirms. This directory is arc evidence and is removed before merge.

## How the review ran

- **Find.** Fifteen lanes, each read independently by a Claude and a GPT reviewer in its own
  experiment worktree: 120 findings.
- **Verify.** Merged within each lane, grouped across lanes into 76 distinct defects, and every
  defect verified by the model family that did not find it: 70 confirmed, 6 refuted.
- **Sweep.** Two sweeps re-read every raw report, verifier report and critic gap for anything
  said but not recorded: 35 more confirmed in the first, 9 in the second. A conflation audit
  checked every merge.
- **Rulings.** The owner ruled on nine questions the review raised (listed in the pull
  request).

## Lanes

This pull request carries the engine and corpus lanes, on top of PR #39's branch. Each lane is
implemented by one model family on its own branch and reviewed adversarially by the other,
until the reviewer approves.

| Lane                                    | Findings                                                                                                                               | Implements | Reviews |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| X1 writes stay inside the root          | A-c-1, A-c-2, A-g-1, A-c-3, A-g-5, A-g-6, A-c-4, A-c-5, A-c-6, GAP1-1, S-A-5, GAP8-1, claude-side-T-5                                  | GPT        | Claude  |
| X2 discovery and watch links            | B-c-1, B-g-2, B-c-2, claude-side-T-4                                                                                                   | Claude     | GPT     |
| X3 carrier honesty and block shapes     | C-g-1, S-C-2, S-C-8, C-c-4, C-g-2, C-g-3, S-C-1, VR2-T-2                                                                               | GPT        | Claude  |
| X4 linear scans and line terminators    | C-c-1, C-c-2, C-c-3, GAP6-1, GAP6-2, GAP6-3, GAP6-4, GAP6-5, GAP6-6                                                                    | Claude     | GPT     |
| X5 runtime and contract generation      | D-c-2, D-c-4, D-g-2, D-c-3, GAP7-1, GAP7-2, F-c-1                                                                                      | GPT        | Claude  |
| X6 readiness not evaluated              | C-c-5, XG-T-1                                                                                                                          | Claude     | GPT     |
| X7 CLI, package and test infrastructure | E-c-1, E-c-2, E-g-3, E-c-3, E-c-4, E-c-5, S-E-1, E-c-6, GAP5-1, M38-c-7, S-I2-3, S-N-2, S-N-1, S-J-1, claude-side-T-2, claude-side-T-3 | Claude     | GPT     |
| X8 builder trust and determinism        | GAP9-1, GAP9-2                                                                                                                         | GPT        | Claude  |
| X9 docs and vocabulary                  | G-c-2, G-c-3, H-c-1, H-c-3, H-c-4, S-H-1, J-c-3, S-M38-3                                                                               | Claude     | GPT     |

The other three lanes land on their own pull requests' branches:

| Lane                               | Findings                                                                                                                    | Implements | Reviews |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| Y1 article evidence check (PR #34) | K34-c-1, K34-c-2, K34-c-3, K34-c-4, K34-c-5, K34-c-6, S-K34-1, GAP12-1, S-L34-3, L34-c-6, L34-c-7, L34-c-2, claude-side-T-6 | GPT        | Claude  |
| Y2 article prose (PR #34)          | L34-c-1, L34-c-3, L34-c-4, L34-c-5, L34-g-2, GAP4-1, N-c-7, VR2-T-1                                                         | Claude     | GPT     |
| Z review evidence (PR #38)         | M38-c-2, M38-c-3, M38-c-6, M38-c-8, M38-c-9, GAP13-1                                                                        | Claude     | GPT     |

Description-only corrections to PRs #34, #38 and #39 are made by the coordinating session.
