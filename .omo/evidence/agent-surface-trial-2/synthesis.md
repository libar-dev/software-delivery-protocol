# Agent-surface trial, re-run after plan 43: synthesis

Run 2026-10-12 on `feature/design-iteration-v0` at `0ab4e3d`, after plan 43's lanes merged and the
gate went green. One agent, gpt-6.1-sol at high effort, received the first trial's brief and
thirteen tasks unchanged except the branch line (`brief.md`), read-only, with the answer key fixed
before launch (`answer-key.md`). Its report is kept verbatim (`report-gpt-6.1-sol.md`).

## Score

| Run | Correct | `sdp q` calls | Time |
| --- | --- | --- | --- |
| First trial, at `bc2c84e` | 13 of 13 | 20 | 4m 19s |
| Re-run, at `0ab4e3d` | 13 of 13 | 23 | 4m 43s |

Against plan 43's acceptance criteria:

- **13 of 13: met.** Every answer matches the key.
- **Fewer than 20 calls: not met.** 15 calls answered the thirteen tasks; 8 more went to the open
  task and to cross-checks the agent chose. The first trial's breakdown was not recorded, so the
  task-only comparison is unknown.
- **No answer over a tool's output limit: met for single recipes, not for batches.** No single
  recipe answer overflowed; the agent's own batched call of seven recipes did (F2), and it reran
  one of them compactly.
- **Recipe 31's fields read as the relation: met.** It read `refinedBy` and called those three
  decisions narrowing, which their stated reasons ("carves out …") support. It did not mislabel
  the other four refinements, now that recipe 31 no longer names them narrowings.
- **A rule's source line where asked: met.** Task 6 cites the context bundle's rule at line 31
  through entry search, and the `budgetExceeded` Design entry at line 44.

## What the arc fixed, by the first trial's friction

The design backlog (recipe 33) replaced the hand-written body every agent wrote for task 1. Recipe
20 counted deferrals and holds from the `trigger` field, which task 11 used directly. Recipe 25
explained the removed question with `reason: "section"` and `available: []` instead of a bare
`entry`. Recipe 8 named its exemption. Recipe 9 reported both next rungs. Rule lines appear in the
location table.

## Friction that remains

- **F1:** the on-ramp is long. The glossary, three skills and the catalog overlap on bootstrap
  instructions. The agent asked for one task-to-recipe sheet.
- **F2, F4:** impact answers are hard to compare. Recipe 4 reports impacted Packs in its totals but
  no impacted Pack ids, and its default summary drops binding reasons.
- **F6:** the floor allowing `ready` and a design still thin read apart. The agent asked to see
  both together, advisory only.
- **F7:** the graph carries no commit, so an answer cannot be attributed to one. This is by design
  (`spec:extraction.determinism`); `sdp --version` names the engine build, not the corpus commit.
- **F3, F5:** the agent wanted richer absence explanations, such as a pointer from a removed
  question to the text that replaced it.

## Open task

The agent recommended a bounded Studio design pass before its implementation, which is plan 42's
order.
