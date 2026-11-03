# The pull-request record: five merged descriptions read against the graph

Lane L12 of the whole-repository review. Reader: gpt-6-astra (xhigh) via relay, job
`job-mw0xlypz-c9ab53bc`. Verifier: claude-opus-5-5 (high). Base:
`b5e0a8bea1e3bedd48c616f96c9928e955792753`. Both ran at `4e78fd14`; the only difference from the
base is `evidence/pr38/README.md`, so every result below holds at the base.

## 1. Why this lane exists

AGENTS.md makes pull-request descriptions the project's durable narrative record: sessions return
to them for planning as well as history. A description therefore matters in two ways. Anything the
owner ruled that lives only there is intent the graph cannot see, and anything it promised forward
must land in a graph home (the roadmap Pack, a capture Spec, or a blocking open question with a
`trigger`). The review read the five most recent merged descriptions, #36, #35, #33, #32 and #31,
and checked each ruling, delegated choice, refusal, forward item and feedback question against the
graph and the commit objects. This matters now because the delivery-record cleanup
(`spec:protocol.delivery-record-cleanup`, roadmap place 1) will delete the frozen plans, which today
hold some of that content a second time.

Plans are named by title: "Design iteration on a readable graph" (plan 43), "A whole-corpus
refresh before the next arc" (plan 44), "Design at the adopter's scale" (plan 45) and "Designs
people can read, and an adopter at full speed" (plan 46).

## 2. Per-PR ledger

The reader's ledger, condensed. The verifier found no row materially wrong; four rows were
imprecise and are corrected here (marked **Corrected**).

Method. The reader read the five saved descriptions, AGENTS.md, CONTEXT.md, the graph-reading skill
and DECISIONS.md; queried the graph with the three standard exclusions; ran recipes 1, 2, 20, 25,
26, 30, 36 and 52–55; and checked every pinned file link (blob and raw) with
`git cat-file -e SHA:path`. The verifier re-ran recipes 1, 20, 25 (with `addresses`) and 55,
resolved all 50 Spec ids the ledger cites (all exist), resolved three entry addresses the ledger
relies on, and re-checked every pinned file link with the same counts. Neither checked the
descriptions' pinned tree and commit links; see section 3.

| PR  | Pinned file links | Owner rulings                                                                                                                                     | Delegated choices                                                                                                                                                                            | Refusals                                                                                                               | Forward items                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Feedback questions                                                                                     |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| #31 | 34/34 resolve     | Carried (Studio web components and HTML surface decisions, curation assist, rule keys, enrichment lifecycle, open-question fields, answer shapes) | Settled: plan 46 confirms plans 43 and 45 with no reversal                                                                                                                                   | Carried                                                                                                                | Completed in #33 and #35; intent composition still on the build backlog (place 4)                                                                                                                                                                                                                                                                                                                                                                                                                            | Settled; dropped question lists keep their warning (`open-question-fields#rule.droppedListWarning`)    |
| #32 | 24/24             | Carried (record deletion, OmO ownership)                                                                                                          | Law carried in the anchor-binding grain decision, prose ownership, rule keys, schema versioning and others; **no explicit owner confirmation of plan 44's delegated choices found** (see U1) | Carried                                                                                                                | Completed or carried by the cleanup capture; superseded-decision signal built                                                                                                                                                                                                                                                                                                                                                                                                                                | Carried; example-readiness reservation later replaced by an explicit delegation in #35                 |
| #33 | 28/28             | Execution history (unlock the adopter)                                                                                                            | Settled through plan 46's confirmation; the "no Studio cycle on rules edit" choice was replaced in #35 by watched rules files                                                                | Carried                                                                                                                | Completed in #35; actual platform rollout lies outside this tree                                                                                                                                                                                                                                                                                                                                                                                                                                             | Settled; the ready Pack-page boundary still uses "Rests on" / "Rested on by"                           |
| #35 | 65/65             | Carried: MD-43, MD-44, MD-45, fifteen glossary terms, hosting; first release held off the roadmap by the owner                                    | Settled by explicit owner confirmation; each has a current home                                                                                                                              | Carried; the phrase "Studio build computes a join" is broader than the carrying law and should not replace it (see U2) | Six major deferrals registered. **Corrected:** the description only lists bound-file freshness and slot-combination coverage; their triggers live only in plan 46, which the cleanup will delete (L12-02). **Corrected:** plan 46 also defers build attestations, deployments and SBOMs until "a Spec designs their source"; that condition is carried as prose and rules in `spec:consumers.spec-studio.lenses.evidence#notTracked` and the verification panels, outside the deferral register but not lost | Design-column sufficiency stays open at `spec:model.design-maturity#question.designColumnsSufficiency` |
| #36 | 45/45             | Carried: MD-46, MD-47, MD-48, the significant-units review, vocabulary, release trigger, epic boundaries, cleanup priority                        | Eight settled explicitly                                                                                                                                                                     | Carried                                                                                                                | Recipe 53 returns places 1–4. **Corrected:** the owner let three provisional answers stand after the memo, and all three acceptances live only in the description: `#lineText` (decider owner), `#lineBound` (decider delegated), and `#durableContent`, whose graph provisional lacks the description's "inventory is the first commit" and "a cross-family review checks it" (L12-01)                                                                                                                      | Usability questions remain invitations, not promises                                                   |

Capability spot checks at the base (reader, re-run in part by the verifier): recipe 52 reports 9
epics and no unreached Specs; recipe 54 returns the arc's 49 members; recipe 53 returns the four
current priorities; recipe 1 returns only `spec:consumers.edit-model` and
`spec:consumers.intent-composition`; recipe 2 returns no drift alarm. Re-run the recipes rather than
inheriting these numbers.

## 3. Confirmed findings

Two findings, both confirmed at medium severity. No broken evidence link was found: all 196 distinct
pinned file links (blob and raw) resolve. That count leaves out the descriptions' 17 distinct pinned
tree and commit links (6 tree, 11 commit; 213 pinned links in all), which this lane did not check.
A later check resolved all 213 with `git cat-file`: per description, #31 holds 38, #32 25, #33 30,
#35 72 and #36 48.

### Law that lives only in a description; record content the cleanup must keep

**L12-01. The owner's acceptance of three provisional answers lives only in PR #36** (medium; the
reader rated it high, the verifier lowered it).

- **What.** After the forward memo, the owner let the provisional answers of the waiting questions
  stand. The graph still shows them as open: recipe 20 returns
  `spec:consumers.spec-studio.cited-line-text#question.lineText` as blocking with decider owner,
  recipe 55 lists it under "Waiting on the owner", and the carrier
  (`specs/consumers/spec-studio.cited-line-text.sdp.md:12`) still says "the choice is the owner's".
  The same holds for `#lineBound` (decider delegated) and, more strongly, for
  `spec:protocol.delivery-record-cleanup#question.durableContent`, whose graph provisional ("a
  measured inventory by the arc that removes them, reviewed before anything is deleted") lacks two
  accepted details: the inventory is the arc's first commit, and a cross-family review checks it.
- **Why medium, not high.** The `#lineText` policy is already in the graph word for word as its
  provisional, so nothing contradicts it; and PR #36 says on purpose that "each answer is recorded at
  the start of its own arc". The risk is an agent asking the owner again, or picking the
  named-input alternative, not a contradiction of law.
- **Evidence.** PR #36 description, lines 347–358 of the saved copy; recipes 20 and 55; a search of
  `specs/`, `docs/`, AGENTS.md, CONTEXT.md and `.agents/` for the acceptance finds nothing.
- **Proposed change.** (1) The cleanup inventory keeps PR #36's lines 347–358 as record content.
  (2) At the start of the cited-line arc, record the `#lineText` answer as carrying intent: "The
  extractor records the citing line's text, trimmed and bounded, on its citation row as inferred
  data that confers nothing; the Studio reads no source." Carry the accepted word-boundary and
  cut-marker policy into Design and settle `#lineBound` the same way. (3) At the start of the
  cleanup arc, amend `#durableContent`'s answer to name the first-commit inventory and the
  cross-family review. State no readiness and infer no implementation.

### Dropped forward items

**L12-02. Two PR #35 deferrals are missing from the deferral register and the forward memo**
(medium).

- **What.** PR #35 lists bound-file freshness and slot-combination coverage as deferred. The
  placement law (`specs/decisions/planning-truths-placement.sdp.md:18`) says a deferral carries its
  re-entry trigger in the `trigger` field of its own blocking open question. Neither does:
  `spec:observation.run-evidence#question.freshness` is non-blocking with no trigger, and
  combination coverage is deferred only inside the ready rule
  `spec:consumers.agent-surface.example-space-coverage#rule.perSlotOnly` (line 25). Recipe 55's
  "Deferred, with their triggers" lists six other items and neither of these.
- **Failure scenario.** The cleanup deletes plan 46, whose table holds both triggers ("A reader is
  misled by a run whose commit matches but whose files moved"; "A design pass asks which
  combinations no example exercises"). Future sessions take the generated memo as the deferral
  inventory, and the two re-entry conditions vanish though neither extension was built or
  withdrawn.
- **Owner questions ready to author** (separate deferred captures keep the shipped parents honestly
  ready; the owner should confirm the decider values, which the reader proposed):

| Carrying Spec address (proposed)                                                                                     | Decider | Question                                                                | Provisional                                                                          | Links                                                                  | Trigger                                                                 |
| -------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `spec:observation.run-evidence.bound-file-freshness#question.freshness` (blocking; the existing question moves here) | owner   | When should changes to bound files make recorded run evidence stale?    | Keep the current differing-commit display until a file-sensitive policy is designed. | `spec:observation.run-evidence`                                        | A reader is misled by a run whose commit matches but whose files moved. |
| `spec:consumers.agent-surface.combination-coverage#question.combinationCoverage` (blocking)                          | owner   | Which combinations of slot values should coverage enumerate and report? | Keep recipe 44 limited to individual slot values.                                    | `spec:consumers.agent-surface.example-space-coverage#rule.perSlotOnly` | A design pass asks which combinations no example exercises.             |

Each capture refines its parent. The parent rule then reads: "Coverage is reported per slot
value; the recipe reports no combination of two or more slots."

**Ruled since:** the owner took both captures with the owner as decider, and reworded the
freshness trigger to "a reader cannot tell whether a run at another commit still applies". The
table keeps the lane's draft.

### Unreviewed delegated choices; broken evidence links

No confirmed finding. One possible unreviewed delegation is listed under U1. No broken link.

## 4. Uncertain findings

These come from the reader's ledger rather than its findings list; the verifier did not rule on
them. This lane added them so they are not lost. The owner has since settled both:

- **U1:** PR #32's delegated choices are ratified as the graph carries them today; where a later
  ruling narrowed one, the later ruling wins. No Spec edit.
- **U2:** PR #35's refused-list wording was wrong. The build composes every join; what is refused
  is a page that recomputes one, or a second graph (`spec:consumers.spec-studio#rule.noSecondGraph`).

The items as the lane recorded them:

- **U1. Plan 44's delegated choices have no recorded owner confirmation.** PR #32 carried a batch of
  delegated choices (collective satisfaction, prose ownership, separate rule and question
  namespaces, additive schema increments and others). Plan 46's confirmation row names plans 43 and
  45 only (checked by this lane at plan 46, line 97), and none of the five descriptions confirms plan 44. The substantive law is carried and largely ready, and later rulings narrowed some of it (MD-43,
  MD-44, MD-47). Merging alone proves neither approval nor rejection. **Settles it:** the owner says
  whether plan 44's delegated choices were reviewed; GitHub review comments on #32 (not checked)
  may already show it. If not reviewed, the question is
  `spec:protocol.delivery-record-cleanup#question.delegatedRulingsReview` (proposed; decider owner;
  provisional "the delegated choices of the whole-corpus refresh stand as carried"; links the
  carrying Specs named in the #32 ledger row).
- **U2. "The Studio build computes a join" in PR #35 reads broader than the carrying law.** The page
  and reader boundary is the law; the sentence could mislead a reader who takes the description as
  intent. **Settles it:** read the phrase against `spec:consumers.spec-studio` and its data children;
  if they disagree, the record note in the cleanup inventory says the Spec wins. Not a Spec edit.

## 5. Refuted findings

None. The reader raised two findings and the verifier confirmed both.

## Not covered

Live GitHub state and comments, hosted previews, the libar-platform repository, full test-suite
runs, browser acceptance, and a line-by-line reading of every ledger row against its carrying Spec
(addresses were checked to exist, not re-read).
