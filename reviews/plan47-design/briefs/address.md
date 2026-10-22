# Plan 47 design wave: answering a review

You continue one design lane of plan 47 of the Libar Software Delivery Protocol. Read
`/tmp/plan47-briefs/common.md` (it applies in full), the lane's brief, the designer's report and
every review named in your task, then the lane's work in its worktree
(`git -C <worktree> log --oneline <base>..HEAD`).

For each review finding, either fix it in the worktree or rebut it with a reason a reader can
check. Do not fix by weakening what the owner asked for. Re-run validation (0 errors, exactly the
one existing warning), refresh any prototype and screenshot the fix changes, and commit on the lane
branch.

Write your report to the path named in your task and return the same text. It keeps the design
report's nine sections, updated to the lane's state now, and adds a tenth: a table of every review
finding with its disposition (fixed, with the commit, or rebutted, with the reason).
