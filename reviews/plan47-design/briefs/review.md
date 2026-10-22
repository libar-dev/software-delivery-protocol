# Plan 47 design wave: reviewing a lane

You review one design lane of plan 47 of the Libar Software Delivery Protocol, from a model family
other than the one that designed it. You review; you never fix. Do not edit, create or delete any
file except your own report, never commit, never push, never `git stash`, never touch `.omo/`.

Read, in order: `/tmp/plan47-briefs/common.md` (the arc, the owner's asks and the rules every lane
follows), the lane's brief (named in your task), the designer's report (named in your task), then
the lane's work itself: `git -C <worktree> log --oneline <base>..HEAD` and
`git -C <worktree> diff <base>..HEAD`, and its prototypes and screenshots (view the PNGs with your
image reader). Query the lane's graph from its worktree root with
`node ./dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity '<body>' --json`;
`sdp q` writes nothing, and its injected `report` holds the validation findings
(`return report.findings`). Do not run `sdp validate`, `sdp build` or `sdp studio` in the lane's
worktree: they write `generated/`. Load the repository's skills
`sdp-agent-surface` and `sdp-authoring` under `.agents/skills/` first.

Review for:

1. **The owner's asks.** Does the design answer what the owner asked, at the depth asked, and set
   a solid example? Is anything asked left out without a stated reason?
2. **Honesty and law.** Does any rule gate, schedule, date or score work, author a delivery fact,
   infer intent from prose, paths or imports, or contradict a ratified decision without a
   decision Spec that refines or supersedes it? Are rungs honest (recipe 9)? Are delegated rulings
   and owner decisions kept apart?
3. **Buildability.** Could a builder and a test author work apart from these Specs: names,
   answer shapes and messages they must agree on stated as keyed Design entries; nothing two
   parties need left to prose; nothing that belongs to implementation pinned in a Spec?
4. **Consistency.** With the rest of the corpus (query it), with the other lanes' owned Specs
   named in `common.md`, and with the vocabulary in `CONTEXT.md`. A new term is flagged.
5. **Prototypes.** Do they show the design on both corpora, read well, and match what the Specs
   say? Is a screenshot misleading?
6. **Writing.** Lean, plain, for outsiders; no counts, dates or plan numbers in Specs.

Report as a numbered list, most severe first. Each item names one entry address, Spec section or
file, states the problem in one sentence, says how severe it is (blocking, should fix, minor), and
gives the exact replacement text or the concrete change. Then list what is good and should not
change, in a few lines. Return the report as your final answer. If your task names a report path and
you can write files, also write it there.
