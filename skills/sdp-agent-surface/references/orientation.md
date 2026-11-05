# Orientation notes

One note per answer of `scripts/orient.mjs`. Each body derives a subject when given none; pass
yours with `--subjects`, keyed by answer number, as the printed calls show. A query that fails is
a finding to report. A number belongs to the commit it ran at: re-run it, never quote it.

## 1. The corpus and its surface

Readiness here is stated; answer 4 reads the floor. Kind and altitude are tallied apart, never
crossed. A missing key means none exists at that commit. `surface` lists the reader's methods,
the fields a Spec row, an edge and a `g.specContext` binding row carry, and recipe parameters
(`none`: the recipe takes none).

## 2. The capabilities

Rows overlap: a nested epic counts again in its parent, and a Spec under two epics counts under
both. The `distinct` line is the corpus count. Zero unreached, cycles and damage is healthy.
Examples and decisions need no implementation binding, so an epic made mostly of them shows few
without missing work.

## 3. The Packs

Only a priority Pack orders work, and that order is advisory (`spec:decisions.roadmap-priority`).
A Pack's verifier gaps include members below `ready`; only its ready gaps match answer 4's
`honesty/gaps` warnings, and decisions are exempt from both. `g.packContext(id).framing` holds
its prose.

## 4. Honest and built

The report `sdp validate` prints, read without removing the pages. `errors` shows at most ten,
`errorCount` counts all, and a non-empty `warningsLeftOut` says warnings were cut. Read the live
set; a handbook names any warning kept on purpose. A drift alarm is drift to resolve
deliberately, never licence to promote code behavior into intent. Only `buildBacklog` is build
work: raw ready-and-unimplemented includes examples and decisions. `belowReady` is what is left
to design; "nothing blocks" means only the author's statement waits.

## 5. Next work

The order is advisory. An entry's need (to design, to state, to build) is evidence of
unfinished realization, never of what work is allowed: "to design" means the floor is below
`ready`, so read the holding questions; "to state", a person's `ready` statement waits; "built",
every Spec states `ready` and every one outside examples and decisions is `implemented`, not live.
Build-now ids are coding work on whichever entry carries them. `waitingQuestions` counts only the
selected decider's questions (`owner` by default); "held by" lists every blocking one.

## 6. Undecided

A blocking question, hold or deferral, keeps its Spec's floor below `defined`. A hold waits on its
decider now; a deferral reopens when its trigger fires. A decider is a corpus token that
references nothing; one naming none counts as `withoutDecider`. The queue states no rung
(`spec:consumers.readiness-planner#rule.statesNothing`). The register covers the corpus, the queue
one decider, answer 5 the roadmap's share. A ruled-out topic may be a decision, not a question:
search it as a word.

## 7. Architecture and decisions

Anchored structure, not import reach: an unanchored file is absent. Recipe 40, Curation report
(`dist/recipes/40-curation-report.js`), ranks those from the imports file `sdp build --imports`
writes, and that build removes the page roots. Layer and role confer nothing; whether a crossing
is lawful is a corpus rule (recipe 42, The architecture walk). Fan-in ranks reach, not priority.
Read one decision's ruling with answer 10 and lead with its name.

## 8. Arrive with a word

Run the printed call on your word; `arrive.md` reads the answer.

## 9. Arrive with a file or a changeset

Run the printed call on your files; `arrive.md` reads the answer.

## 10. Read Specs

Pass `specs` (a list or one id) or `pack`; a large Pack floods, so pass a list. Read the outline,
then fetch exact wording by address (answer 11): rule text is clipped. Only `implementations`
confers `implemented`; a verifier through an example counts only when that example is enabled,
and names the test that runs it, with its file and line.
Recipe 3, What does this Spec guarantee, and who verifies it
(`dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js`), adds every section's
entries and floor clauses for one Spec.

## 11. Check a citation

A miss names its reason, counted in `totals`: `spec`, `section`, `entry` (with the keys that
section holds) or `malformed`. A bare Spec id is `malformed`: check it with answer 10. The grammar
is in `arrive.md`.
