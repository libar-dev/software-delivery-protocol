Review of `a1f7298` against `44e62ef`: **changes requested before implementation**. The priority proposal and the four-lane reading are useful, but the waiting order, descendant details and execution-record replacement need revision.

1. **Blocking — `spec:consumers.roadmap#design.waitingRows`: roadmap priority overrides the dependency order the waiting list promises to preserve.**

   Sorting statements by their first roadmap place before recipe 46’s position reverses five dependency pairs in the platform prototype. For example, `spec:application.history-projection` appears before `spec:context.event-envelope`, and that envelope appears before `spec:context.journal`. This contradicts both “so a Spec others rest on comes first” and the priority decision’s consequence that the statement queue keeps dependency order.

   Replace the ordering clause with:

   > Questions sort by their first roadmap place, then blocking questions first, Spec id and authored position. Statements retain their relative order from recipe 46 across the whole roadmap; their `places` identify the entries they touch and never reorder them.

   Apply the same distinction to `#rule.waiting`. Add a probe whose first roadmap entry depends on a later entry and verify the statement order independently of the board order.

2. **Blocking — `spec:consumers.roadmap#design.entryRow`: an entry can need design because of a descendant without naming that descendant or its unmet floor clauses.**

   The answer aggregates the subtree’s lane but provides readiness details only for its root. In an in-memory probe, adding an honest `idea` child beneath the existing ready `edit-model` entry produced `lane: "to design"`, `statedNextRung: null`, no blocking questions and no dependency rows. The missing child and its `kind-evidence-present` failure appeared nowhere in the entry’s actionable details.

   Add a keyed Design entry for per-Spec work rows:

   > `workRows` lists every Spec counted in `work`, once in Spec-id order, as `{ id, lane, statedReadiness, floorReached, statedNextRung, holdsNextRung, drift }`. `holdsNextRung` retains the floor evaluator’s clause ids and any named dependency targets. The page and memo identify the rows that cause the entry’s lane, while the entry’s own readiness remains separately labelled.

   Keep the aggregate counts. Extend the examples to cover a ready parent with an unfinished descendant, including a descendant whose problem is missing evidence rather than an open question.

3. **Blocking — `spec:protocol.roadmap-replaces-plans#rule.executionRecord`: making the draft PR the only execution record leaves work without a durable recovery home before the first authorized push.**

   The proposed handbook changes also move dirty-state accounting and commit-strategy records into that PR. An arc can contain substantial design and local commits before a push is authorized. Its Specs and roadmap cannot carry the execution history that the decision correctly keeps outside the graph.

   Add this provision to the decision and the execution-record rule:

   > Before a draft pull request exists, keep the arc’s execution and recovery record in a capability-named file under `reviews/`, recording its branch and base, working rules, completed and outstanding work, and re-measure commands. At the first authorized push, transfer that record into the draft pull request and replace the local record with its link. This does not authorize a push.

   Update the proposed handbook wording accordingly. Present this temporary record to the owner as part of the plan-retirement choice.

4. **Should fix — `spec:consumers.roadmap.memo#design.memoState`: “Statements first” is calculated from a different dependency set than the statement queue and consequently omits decisions and internal prerequisites.**

   The Protocol memo says the roadmap entry has “none: its own statement can be made now.” Recipe 46 lists `spec:decisions.roadmap-priority` before that Spec, then the roadmap before its memo. The plan-replacement row similarly counts two prerequisites while omitting `spec:decisions.roadmap-over-plans`. The current calculation also counts relation rows as Specs.

   Derive this column from recipe 46’s `restsOn` relationships for the waiting work rows and shaping decisions associated with the entry. Deduplicate by Spec id and distinguish prerequisites inside the entry, elsewhere on the roadmap and outside it. Replace the empty text with:

   > No preceding waiting statement in the statement queue.

   Use “Earlier waiting statements” as the column heading so the advisory ordering does not read as a new readiness requirement.

5. **Should fix — `spec:consumers.roadmap#rule.restsOn`: the boundary omits an outside refining parent of a descendant, even when that parent holds the descendant below `ready`.**

   The rule follows `refines` only from the entry itself. A lawful multi-parent descendant can also refine a Spec outside the entry’s scope. An in-memory probe reproduced this: the child’s floor named the outside parent in `typed-dependency-targets-are-defined`, while the roadmap returned `restsOn: []`. Lane E explicitly preserves multiple parents.

   Replace the selection clause with:

   > An entry rests on each resolving Spec outside its scope named by `dependsOn`, `constrainedBy` or `refines` from any Spec in its scope, while that target is to design, to state or to build. Shaping decisions remain in the decision rows.

   Add the originating in-scope Spec ids to `#design.restsOnRow`, so a reader can see which descendants the outside target holds. Verify a diamond with one parent outside the roadmap.

6. **Should fix — `spec:consumers.roadmap#rule.waiting`: the owner summary hides questions with no `decider`, making an incomplete assignment look like an empty owner workload.**

   The platform prototype reports zero owner questions, although `spec:application.history-rebuild#question.verifyPassUnderPause` explicitly leaves a choice to the owner in prose. The recipe must not infer that assignment from prose, but it should expose the missing assignment. Recipe 46 already preserves this distinction through its unassigned-question counts.

   Add `withoutDecider` and `blockingWithoutDecider` to the totals, with a separate list of those question rows over the same scope. Require the page and memo to say:

   > These questions have no named decider.

   Keep them separate from the selected person’s questions. Also make `#design.decisionRow.blockingQuestions` retain full question rows with nullable addresses, rather than dropping unkeyed blocking questions.

7. **Should fix — `spec:consumers.spec-studio.roadmap-page#ui.entryRow`: `entry-<place>` is not unique on a page containing several roadmaps.**

   The page renders every priority Pack, and each Pack starts at place 1. Two roadmaps therefore produce duplicate `entry-1` ids, sending board links, dependency links and waiting-list links to the wrong section.

   Replace the identifier contract with:

   > An entry’s element id is `roadmap-<pack-page-name>-entry-<place>`, using the Studio’s existing Pack page-name encoding. Every link to an entry uses the owning roadmap’s prefix.

   Apply it to `#ui.boardColumn` and all entry references. Add a two-roadmap prototype or probe that verifies unique ids and the destination of every internal link.

8. **Should fix — `spec:decisions.roadmap-priority`, Decision consequences: the proposed affected-contract list omits changes to the new priority marker from the design diff.**

   Recipe 35 currently compares Pack membership and relative member order. Adding only `order: "priority"` to an in-memory head graph produces zero changed Packs. A Pack can therefore become or cease to be a roadmap without appearing in the design diff, despite visibility there being part of the proposal’s rationale.

   Extend the proposed integration edits to `spec:consumers.design-diff#design.packRows`, recipe 35 and the Studio diff presentation. Specify an order-meaning change independently of member reordering, for example `orderChanged` with `orderBefore` and `orderAfter` values of `"reading"` or `"priority"`. State how comparisons across schema versions report an unsupported field. Cover enabling and removing priority without changing membership.

9. **Should fix — `spec:protocol.roadmap-replaces-plans#rule.oneRoadmap`: “an entry joins when its capture lands” turns the curated roadmap into an inventory of captures.**

   The owner explicitly asked for a selected amount of upcoming work, updated iteratively. The current rule supplies capture creation as the admission condition and omits selection.

   Replace the rule with:

   > The Protocol keeps one living roadmap Pack, edited in place. Its owner selects captured work for the upcoming pull requests; landing a capture does not add it automatically. Entries leave by an ordinary manifest edit when the selected work is complete or no longer belongs among the next work, and move on the owner’s word, with git as history.

   Align the proposed PR-description instruction, which currently says to “add the captures it opened,” with the same selection rule.

10. **Minor — `reviews/assets/plan47-prototypes/R-roadmap/build.mjs`: both page screenshots label ordinary Packs as being “in priority order,” contradicting the returned `order: "reading"` and the reading-order rule.**

    The nearby prototype note explains why the Pack was selected, but the summary still presents the proposed priority as stated graph data. The memo already uses the correct distinction.

    Derive the summary label from `roadmap.order`: use “entries in priority order” for `"priority"` and “entries in authored reading order” otherwise. Keep the proposed-priority explanation in the framing, and recapture both page prototypes.

The explicit optional Pack field is a well-argued proposal for the owner. Keep the absence of scheduling authority, the separation of stated readiness from the structural floor, the fourth “to state” lane, set-based descendant counting, and the audited example/decision exclusions. The scoped line-text and register-input captures retain honest unresolved questions. The desktop pages are readable, and the phone layout preserves the content.

I re-derived validation findings and recipe 9 at the reviewed head: no errors, the single existing `honesty/gaps` warning, and honest stated rungs for all nine changed Specs. Both saved recipe answers and both memo files reproduced exactly. I inspected all seven screenshots and checked the relevant contracts, lane E’s multi-parent design, and PR 35’s forward section. No product build or green-gate claim is made.

The report could not be saved to `/tmp/plan47-reports/R-review-astra.md` because this session permits filesystem reads only. No files were changed.
