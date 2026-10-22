# Lane R answer: the roadmap, and plans become the roadmap, after review

**Outcome.** All ten of astra's findings are fixed in the worktree, and none is rebutted. Here is what changed:

- The roadmap's waiting list now keeps the statement queue's dependency order across the whole roadmap. Places no longer reorder statements.
- Each entry now lists its parts (`workRows`), each with what holds it, so a descendant that holds a ready entry back is named. It also lists the waiting statements the queue puts before its own (`earlierStatements`).
- An entry now rests on any outside parent of any part, not only its own parent.
- Questions with no decider are listed and counted apart.
- Entry element ids carry their roadmap's name.
- The priority decision now has the design diff report a Pack that becomes or stops being a roadmap.
- The roadmap is selected by its owner. Landing a capture no longer adds an entry.
- An arc's execution record has a home before its first authorized push: a record file under `reviews/` that hands over to the draft pull request.

A new probe script builds a small corpus with two roadmaps and checks each fix. All 17 checks pass. The reviewed recipe body fails the checks for findings 1, 2, 5 and 6 on that corpus.

Validation at the head: 0 errors and 1 warning, the existing `honesty/gaps` on `spec:model.spec-sections`. The mention audit over the lane's nine Specs reports 0 unbacked mentions. `check:temporal`, Prettier and ESLint (on the prototype scripts) pass.

## 1. Specs created or changed

Recipe 9 was re-run on each Spec at the head.

| Spec | Stated | Floor | State now (changes from this round in bold) |
| --- | --- | --- | --- |
| `spec:decisions.roadmap-priority` | defined | ready | The decision with 6 alternatives and 7 consequences. **The rationale now names the design diff's report of a Pack becoming or stopping being a roadmap. A new consequence covers that report and how schema versions compare. The dependency-order consequence now says the roadmap's waiting list keeps the queue's order.** |
| `spec:consumers.roadmap` | defined | ready | 17 keyed rules and 13 Design entries. **New rules: `#workRows`, `#withoutDecider`, `#earlier`. `#restsOn` now covers any part's `refines`, `dependsOn` or `constrainedBy` reaching outside the scope. `#waiting` sorts statements by queue order only. `#needs` keeps unkeyed decision questions. New Design entries: `workRow`, `holdsRow`, `earlierRow`. Changed Design entries: `entryRow`, `questionRow`, `decisionRow`, `restsOnRow` (gains `from`), `waitingRows` and `roadmapAnswer` (totals gain `withoutDecider` and `blockingWithoutDecider`). The Example space gains three lane states, a statement-order Given, and Thens for the parts, the rests-on origin and statement order.** |
| `spec:consumers.roadmap.memo` | defined | ready | 7 rules and 11 Design entries. **`#holds` changed. `#sections` gains the no-decider section. `memoDesign` now names the parts that set the lane, at most three, with their clauses and targets. `memoState`'s column is now `Earlier waiting statements`, with the empty text `No preceding waiting statement in the statement queue.` New `memoUndecided` lists those questions by address only.** |
| `spec:consumers.spec-studio.roadmap-page` | defined | ready | 12 rules and 5 UI entries. **New `dependsOn` `spec:consumers.spec-studio.publisher` (the page name). Entry ids are now `roadmap-<name>-entry-<place>`, and every entry link uses the owning prefix. The summary says priority order only for `order: "priority"`. Entries gain Parts and Earlier statements fields. Rests-on rows show `from`. The waiting list has a no-decider part.** |
| `spec:decisions.roadmap-over-plans` | defined | ready | The decision with 4 alternatives and 5 consequences. **The decision, rationale, record-file alternative and two consequences now carry the pre-push record file and the selection rule.** |
| `spec:protocol.roadmap-replaces-plans` | defined | ready | 7 rules and 5 Design entries. **Rewrote `#oneRoadmap` to the reviewer's selection rule, and `#executionRecord` and `#forwardSection` to match. New `recordFile` Design entry.** |
| `spec:consumers.projections-model.roadmap-views` | scoped | scoped | Unchanged this round. |
| `spec:consumers.spec-studio.cited-line-text` | scoped | scoped | Unchanged this round. |
| `spec:consumers.spec-studio.register-input` | scoped | scoped | Unchanged this round. |
| `pack:roadmap` (`specs/roadmap.pack.sdp.md`) | — | — | Nine entries. **The framing now says an entry joins when the owner selects it, and leaves by a manifest edit.** |

No Spec states `ready`. The floor allows `ready` on the six `defined` Specs. Proposing those statements belongs to the executing thread, and ratifying the decisions belongs to the owner.

## 2. Rulings I made on delegation

| Ruling | Carrying entry |
| --- | --- |
| Scope is the entry plus every Spec reaching it through `refines`, each counted once. Its work excludes examples and decisions. | `spec:consumers.roadmap#rule.scope` |
| Four lanes: to design, to state, to build and built. An entry takes the first open lane among its work. | `#rule.specLane`, `#rule.entryLane` |
| Drift keeps its lane and is counted apart. A decision or example entry is listed apart. | `#rule.drift`, `#rule.apart` |
| **Each part is listed with its rungs and its holding rows, `{ clause, targets }`. The parts in the entry's lane are the ones that set it, and the entry's own readiness is labelled apart.** | `#rule.workRows`, `#design.workRow`, `#design.holdsRow` |
| **An entry rests on whatever any part reaches outside the scope through `dependsOn`, `constrainedBy` or `refines`, with `from` naming the parts. Shaping decisions stay in the decision rows.** | `#rule.restsOn`, `#design.restsOnRow` |
| **Waiting questions sort by first place. Statements keep the statement queue's relative order across the roadmap, and places never reorder them.** | `#rule.waiting`, `#design.waitingRows` |
| **Questions with no decider are listed and counted apart. No decider is inferred from prose.** | `#rule.withoutDecider` |
| **Earlier waiting statements come from recipe 46's `restsOn` for the entry's own waiting statements, its work's and its shaping decisions' alike. Each is marked inside the entry, on the roadmap (at the first place that touches it) or outside. They are advice, never a readiness requirement.** | `#rule.earlier`, `#design.earlierRow` |
| Why now is read, never authored. The memo carries no re-entry condition, refused list or pull request split, and it does carry recipe 20's deferrals. | `spec:consumers.roadmap.memo#rule.whyNow`, `#rule.authorsOwn` |
| **The memo names at most three parts per to-design entry, its own first. It lists no-decider questions by address only, because the page carries their text.** | `#design.memoDesign`, `#design.memoUndecided` |
| **Entry ids are `roadmap-<Pack page name>-entry-<place>`, and every link uses the owning roadmap's prefix.** | `spec:consumers.spec-studio.roadmap-page#ui.entryRow` |
| **One living roadmap. The owner selects the captured work it lists. Landing a capture adds nothing, entries leave by a manifest edit, and they move on the owner's word.** | `spec:protocol.roadmap-replaces-plans#rule.oneRoadmap` |
| Gate design: the frozen ceiling constant, the handbook tokens, the manifest line and five messages. | `#rule.gateRecord`, `#design.*` |
| Register input's provisional answers. | `spec:consumers.spec-studio.register-input#question.*` |
| The first roadmap's order. This is a proposal. | `pack:roadmap` |

## 3. Decisions for the owner

1. **Where priority lives** (`spec:decisions.roadmap-priority`). The options are an optional manifest field `order: priority` (recommended, confidence 4/5), a naming convention, any Pack read as a priority by parameter, corpus data outside the graph, a `precedes` relation or a rank, a boolean `roadmap: true`, or prose.
   - The engine change is seven files: `src/model/pack.ts`, `src/extract/markdown-frontmatter.ts`, `src/extract/reify.ts`, `src/extract/derive.ts`, `src/graph/schema.ts`, `src/extract/serialize.ts` and `src/reader/reader.ts`. An invalid value refuses as `extract/invalid-frontmatter`.
   - **New this round:** recipe 35 and the Studio diff page must report the change of meaning (see section 5).
2. **Plans become the roadmap** (`spec:decisions.roadmap-over-plans`). Recommendation (a), confidence 4/5: retire `plans/` as frozen history, put the arc's record in its draft pull request, and rewrite the gate's current-record check. **New this round, for your review as part of this choice:** before an arc's first authorized push, its record lives in `reviews/<pack name>-record.md`. The file holds the branch and base, your working rules for the arc, the work done and outstanding, any uncommitted state, and the re-measure commands. At the first authorized push the record moves into the draft pull request, and the file keeps only the link. The file authorizes nothing. Confidence 4/5. The alternative is to keep the whole record in the file for the arc's life, which duplicates the description once the pull request exists. The sub-choice of a ceiling check on plan numbers stays at confidence 3/5, and you may drop it.
3. **Line text** (`spec:consumers.spec-studio.cited-line-text#question.lineText`). Recommendation: record the trimmed, bounded text on the citation row. Confidence 3/5.
4. **The roadmap itself.** Recommendation: one living `pack:roadmap`, confidence 4/5. You set the order and select the entries.
5. **Release and baseline views** (`#releaseReader`) stay deferred. Proposed trigger: the first published release.
6. **Words to ratify:** "roadmap", the roadmap "lane", and the lane name "to state". "Lane" collides with the description standard's "lanes" (parallel work streams). The alternative word is "need".

## 4. Prototypes

All prototypes are under `/tmp/plan47-wt/R/reviews/assets/plan47-prototypes/R-roadmap/`.

| Path | Shows |
| --- | --- |
| `recipe-53-the-roadmap.body`, `recipe-55-the-roadmap-memo.body` | The revised recipe bodies. Recipe 53 adds `workRows`, holding rows with targets, `from`, `earlierStatements`, `withoutDecider` and queue-order statements. |
| `build.mjs`, `README.md` | Rebuilds both corpora. It now writes one memo per roadmap, the prefixed ids and the order-derived label, and it exports `renderPage` for the probes. |
| `probes.mjs`, `probes/answer.json`, `probes/checks.json`, `probes/memo.md`, `probes/roadmap.html`, `probes/roadmap-1440-expanded.png` | **New.** The review's probes on a scratch corpus with two roadmaps: queue order against places, a ready root with an evidence-less descendant and a question-blocked descendant, a diamond with an outside parent, a question with no decider, and unique ids with in-roadmap links. 17 checks, all passing. |
| `protocol/roadmap-1440.png`, `-expanded.png`, `-390.png`, `protocol/memo.md`, `memo.html`, `memo-1440.png` | Recaptured. The label reads "in authored reading order". Entry 1's earlier statements are `spec:decisions.roadmap-priority` and `spec:consumers.roadmap`, inside the entry. Entry 6 names the decision and the roadmap at place 1. |
| `platform/roadmap-1440.png`, `-expanded.png`, `platform/memo.md`, `memo-1440.png` | Recaptured. Statements now run in queue order: the event envelope, then the journal, then the history projection. The entries' 27 questions with no decider are listed apart, among them `spec:application.history-rebuild#question.verifyPassUnderPause`. |

What the probes and prototypes showed beyond the review:
- A shaping decision of another entry has to read as on the roadmap, at the first place that touches it, not as outside. The first fix marked it outside.
- Listing no-decider questions with their full text made the platform memo 21k characters. Listing them by address keeps it at about 8.5k.
- `sdp validate` rewrites `generated/` and removes the built Studio, so the Studio must be rebuilt before `build.mjs` runs. The README says so.

## 5. Proposed edits to files I may not edit

**`pack:roadmaps-and-slices-v1`:** add `spec:consumers.projections-model.roadmap-views` after `spec:protocol.roadmap-replaces-plans`.

**`AGENTS.md`, opening block.** Replace the whole status blockquote (from `> **plan 47 is DRAFTED**` through `...also read the latest ✅ EXECUTED/RUN plan for settled ground.`) with:

```md
> **Where work stands is read from the graph.** The Protocol's next work is its roadmap,
> `pack:roadmap` (`specs/roadmap.pack.sdp.md`), a Pack whose member order is the owner's advisory
> priority. Run the roadmap, recipe 53, for each entry's lane (to design, to state, to build,
> built) and what holds it; the build backlog (recipe 1), the design backlog (recipe 33) and the
> statement queue (recipe 46) answer the rest. Each entry leads to its arc's Pack and carrying
> Specs, and an arc's lanes, rulings and acceptance are in its pull request description, or
> before its first push in its record file under `reviews/`.
> `plans/` is frozen history: the arcs through plan 47 kept their plans there, and no plan is
> added; read one only for how an earlier arc was run. Specs and Packs default to the Markdown
> carrier (the carrier ruling, MD-18, completed by the Pack syntax ruling, MD-25); the TS DSL
> survives as import source and a lawful per-ID option, and the Gherkin carrier option (MD-27)
> admits a lawful per-ID option for behavior and example Specs.
> Corpus counts, readiness, and findings are **derived, never quoted** — re-run
> `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
> (or `npm run --silent sdp --` with the same argv) and read recipes 8 and 11. Recipe 1 is the
> operational backlog, not the census. Never invoke a bare `sdp`.
```

**`AGENTS.md`, "Where to look".** Replace the `plans/` row with:

```md
| `specs/roadmap.pack.sdp.md` + recipe 53 | **the roadmap** — the next work in the owner's priority order, each entry's lane and what holds it | before choosing or opening work |
| `plans/` | **frozen history** — how each earlier arc was run, through plan 47; forward work reads from the roadmap | only for an earlier arc's record |
```

**`AGENTS.md`, "The build path".** Replace `Live work is the highest primary-numbered plan under \`plans/\` — read it before writing code.` with `Live work is the roadmap: run recipe 53 over \`pack:roadmap\` before writing code, and read the Pack of the entry you take up.`

**`AGENTS.md`, "Plan vs execution".** Replace `For a plan under \`plans/\`, don't touch its target files unless the session is execution.` with `For a roadmap entry, don't touch the files its build will change unless the session is execution.`

**`AGENTS.md`, "Commits are recovery boundaries".** Make two replacements:
- Replace `An execution plan's explicit commit strategy counts as authorization on its work branch` with `The owner's instruction for an arc, kept in the arc's record, counts as authorization on its work branch`.
- Replace `in the tracked plan/draft` with `in the arc's record (its record file under \`reviews/\` before the first push, its draft pull request after)`.

**`AGENTS.md`, PR description standard.** Make these changes:
- Replace `the plans it executes` with `the roadmap entries it designs or builds`.
- Replace `a carrying Spec, a worked example, a plan` with `a carrying Spec, a worked example, a Pack`.
- Replace `Check the description against the plan,` with `Check the description against the arc's Pack, the roadmap,`.
- Replace the "Plan the next PR" bullet with:

```md
- **Plan the next PR from the roadmap.** Every description keeps a forward section, and it is a
  proposal: render it with the roadmap memo (recipe 55) at the head, which lists the entries to
  design, to state and to build in priority order, what waits only for the owner, the questions no
  one is named to decide, and the deferred items with their triggers; write the next PR's re-entry
  condition and the durable refused list around it. Edit the roadmap Pack in the same PR: remove
  the entries whose selected work it completed, and add or reorder entries only on the owner's
  word. Rewrite the section each time rather than appending stale rows.
- **Keep one record per arc.** Before an arc's first authorized push, its record is
  `reviews/<pack name>-record.md`: branch and base, the owner's working rules for the arc, the
  work done and outstanding, uncommitted state with no clean boundary, and the commands that
  re-measure it. At that push the record moves into the arc's draft pull request, which carries
  it from then on, with the lanes and rulings as they are made, and the file keeps only the link.
  Neither authorizes a push.
```

**`.agents/skills/sdp-authoring/SKILL.md`.** Replace the bullet `- A plan file points to the Pack and carrying Specs ...` with the following. The `test/skills.test.ts` assertion for "A plan file points" moves with it.

```md
- Keep the next work's priority in a roadmap: a Pack whose manifest states `order: priority`, its members in the order you want them taken up. The order is advisory and confers nothing; each entry's lane and what holds it are read with the roadmap recipe (recipe 53), and no check reads a roadmap's content. A plan document, where a corpus keeps one, points to the Pack and carrying Specs for intended truth and derived state; plan numbering and staleness confer no graph structure or workflow authority.
```

**`.agents/skills/sdp-sessions/SKILL.md`.** Make two changes:
- Replace `capability-based Pack names and plan pointers` with `capability-based Pack names and roadmap entries`.
- In Implement, replace `Use the build backlog (recipe 1) to orient` with `Use the roadmap (recipe 53) for the owner's order and the build backlog (recipe 1) to orient`.

**`.agents/skills/sdp-agent-surface/SKILL.md`, task table.** Add this row:

`| Read what comes next, in the owner's order | the roadmap (recipe 53); the roadmap memo (recipe 55) for a description's forward section |`

**`spec:consumers.graph-first-planning`.** Add `decidedBy: spec:decisions.roadmap-priority` and replace its last rule with:

`- rule: A roadmap holds a corpus's advisory priority as the member order of a Pack whose manifest states \`order: priority\`, as \`spec:decisions.roadmap-priority\` rules; the order authorizes, blocks and sequences nothing. A plan document, where a corpus keeps one, points to the Pack and carrying Specs for intended truth and derived state, while plan numbering, staleness and any other recorded work order never become graph structure or workflow authority.`

**Pack engine Specs**, when the field is built:
- `spec:carrier.markdown-pack-authoring`, envelope rule: append `, and \`order\` (optional; its one lawful value is \`priority\`, and any other value refuses with \`extract/invalid-frontmatter\`)` to the closed key list. Add `decidedBy: spec:decisions.roadmap-priority`.
- `spec:model.pack-aggregate`, Model: add `- **priority order** — The authored member order of a Pack whose manifest states \`order: priority\`, read as its owner's advisory preference among its members; it confers nothing and sequences nothing.` Add `decidedBy: spec:decisions.roadmap-priority`.
- `spec:extraction.pack-member-order`: the field order becomes `id`, `nodeType`, `claim`, `title`, `framing`, `file`, `members`, `modelRefs`, `order`.

**Design diff (new, finding 8).**
- `spec:consumers.design-diff`: add `decidedBy: spec:decisions.roadmap-priority`. Replace `It reports changes to Pack membership and order, and to the code units` with `It reports changes to Pack membership, member order and what a Pack's order means, and to the code units`.
- `spec:consumers.design-diff#design.packRows` becomes: ``- packRows: `packs` rows are `{ id, change, membersAdded, membersRemoved, reordered, orderChanged, orderBefore, orderAfter }` for each Pack added, removed or changed in membership, member order or order meaning; `orderBefore` and `orderAfter` are `"reading"` or `"priority"`, null on a side where the Pack is absent, and `orderChanged` is true when both sides hold the Pack and the two differ. An absent `order` reads as `"reading"` in every schema version; a value the head's engine does not know is outside the common schema, listed in `diagnostics` and not compared.``
- `spec:consumers.spec-studio.diff-page#rule.diffSections`: replace `the Packs whose membership or order changed` with `the Packs whose membership, order or order meaning changed, a change of meaning read as \`now a roadmap\` or \`no longer a roadmap\``.
- `spec:consumers.spec-studio.diff-page#rule.packChangeNotes`: replace `and its own membership change` with `and its own membership change, with \`now a roadmap\` or \`no longer a roadmap\` when what its order means changed`.

**Studio Specs:**
- `spec:consumers.spec-studio.navigation#rule.topEntries`: replace `lists Queue, Questions` with `lists Roadmap, Queue, Questions`.
- `#rule.indexRoutes`: insert `See what comes next, linking the roadmap page;` before `See what the owner can state first`.
- `spec:consumers.spec-studio.pack-page`: add `- rule: [#roadmapLink] The page of a Pack whose manifest states \`order: priority\` links its section on the roadmap page under its title.`
- When register-input is designed further, `spec:consumers.spec-studio.data.inputs#rule.namedInputs` changes from "at most two inputs" to name the register.

**`CONTEXT.md`.** Add these rows to "Surfaces & projections":

```md
| **roadmap** | a Pack whose manifest states `order: priority`: its members' authored order is the corpus's advisory priority, first entry first, and each entry's lane and what holds it are read from the graph each time; never a schedule, a date or a gate (`spec:consumers.roadmap`) | "plan" · "schedule" · "backlog" (the build and design backlogs are recipes) |
| **lane** (of a roadmap entry) | what an entry needs next, read from its refinement subtree: to design, to state (only a person's `ready` statement stands before it), to build, or built; never authored (`spec:consumers.roadmap#rule.entryLane`) | "status" · "stage" · "column" |
```

Make two more edits in `CONTEXT.md`:
- In the "Delivery-process vocabulary" heading, replace `any realization is a projection, and none is built` with `any realization is a projection; the roadmap is built as a Pack's priority order, and release and baseline views wait for a reader`.
- Replace `phase / iteration / milestone** (descriptive vocabulary, optional roadmap projections, never gates)` with `phase / iteration / milestone** (descriptive words a roadmap's framing may use, never entry fields, dates or gates)`.

**`docs/concept/DECISIONS.md`.** At ratification, add rows "a roadmap states advisory priority" and "the roadmap replaces the plans" under the next free MD numbers.

**`check-self-hosting-gates.mjs`, section 4.** Replace the current-plan selection and handbook checks with:

```js
const LAST_FROZEN_PLAN = 47;
for (const entry of primaryPlans) if (entry.number > LAST_FROZEN_PLAN) failures.push(`${["plans", entry.name].join("/")} — a numbered plan above the last frozen plan; forward work reads from the roadmap`);
expectContains(agentsPath, agents, "pack:roadmap", "the handbook does not name the roadmap Pack");
expectContains(agentsPath, agents, "recipe 53", "the handbook does not name the roadmap recipe");
const roadmapPath = ["specs", "roadmap.pack.sdp.md"].join("/");
if (!existsSync(join(rootDir, roadmapPath))) failures.push(`${roadmapPath} — the roadmap Pack's manifest is missing`);
else if (!/^order: priority$/mu.test(read(roadmapPath).split(/^---$/mu)[1] ?? "")) failures.push(`${roadmapPath} — the roadmap Pack's manifest does not state order: priority`);
```

Keep the green-gate legs check and the plan-status ban on DECISIONS and CONTEXT. Update header item 4 and `report.currentRecord` to `{ lastFrozenPlan, roadmapPack, gateLegs }`. No check reads the record file.

**`test/check-self-hosting-gates.test.ts`.** Replace the current-plan cases with these:
- a numbered plan above the ceiling (padded and unpadded) fails;
- a letter-suffixed plan is ignored;
- a handbook missing `pack:roadmap` or `recipe 53` fails;
- a missing manifest fails, and a manifest without `order: priority` fails.

**`plans/47-roadmaps-capability-maps-and-slices.md`, at close.** The status header reads EXECUTED and adds `The last numbered plan: forward work reads from the roadmap, \`pack:roadmap\` (recipe 53), and each arc's record is its pull request description.`

## 6. What the build needs, in order

1. **The owner's rulings** on decisions 1 and 2, the record file included.
2. **The engine `order` field.** Make the seven source changes from decision 1. Add tests for Markdown and TypeScript parity, invalid-value refusal and serialized field order. Update the three Pack Specs, and add `order: priority` to `specs/roadmap.pack.sdp.md`. **Recipe 35 gains `orderChanged`, `orderBefore` and `orderAfter`, and the diff page renders them. Add tests for enabling and removing priority with unchanged membership, and for a base graph without the field.**
3. **Recipes 53 and 55**, from the revised bodies, under `docs/agent-surface/recipes.md` and `dist/recipes/`. Recipe 55 calls `recipes(53)` and `recipes(20)`, and recipe 53 calls `recipes(46)`. Add example children for the roadmap example space with a `specTest` suite: the eight lane states, statement order against places, the parts that set a lane, and the outside-parent origin. `probes.mjs` holds those cases' corpora and expectations. Add a memo test that pins byte determinism and escaping.
4. **The Studio page.** Add a `roadmap.html` module in the existing Studio pages component, with board CSS and the navigation and index edits. Tests: the empty state, lanes and board, unique entry ids and in-roadmap links with two roadmaps, memo bytes equal to recipe 55's for each roadmap, a byte-identical rebuild, and the Pack page link.
5. **The self-hosting switch.** Make the AGENTS.md edits, gate section 4 and its tests, the skills and their test, the graph-first-planning edit, the CONTEXT.md and DECISIONS.md rows, and the oracle updates for every Spec in section 1 and the new Pack. Plan 47 closes as the last numbered plan.
6. **Later:** cited-line-text and register-input wait for their questions, and release and baseline views wait for their trigger.

From other lanes:
- **E:** use the same set-based subtree scope. Multi-parent descendants now count toward rests-on through any part.
- **G:** nothing is required.
- **S:** nothing is required. A slice may link to its entry's place, using the prefixed id.
- **Integration:** the oracle edits in step 5.

## 7. Changes to the brief

- I added a fourth lane, "to state", and listed decision and example entries apart. Ratifications count as waiting statements.
- The memo makes no pull request split. It includes recipe 20's deferrals, as the description standard requires.
- The first roadmap lists the arc's lead features, not every member.
- `roadmap-views` keeps its id. Its remaining question is now `#releaseReader`.
- The plans part reshapes AGENTS.md wording beyond the status block.
- **New this round, from the review:**
  - Entries now carry their parts and earlier statements.
  - The memo and page show questions with no decider.
  - The design diff joins the priority field's integration.
  - The plans decision gains the pre-push record file, which the brief's "where an arc's execution record lives" did not cover before a push exists.

## 8. Risks and open questions

- **Pack membership side effects.** Every roadmap entry shows `pack:roadmap` among its Packs. This is harmless but visible.
- **Cross-lane ids.** A rename or split in another lane must update the manifest. Validation catches a broken id.
- **Long lists on adopters.** On the platform, earlier statements reach 20 to 35 per entry, mostly outside the roadmap, and 27 questions have no decider. The memo counts the outside statements and lists the undecided questions by address. The page lists them all, unfolded except rests-on.
- **"Earlier" is direct, not transitive.** It reads recipe 46's direct `restsOn`. The rounds give the full order, and the waiting list carries it.
- **The record file and drift.** Between the first push and the file's reduction to a link there are briefly two copies. The handover is one edit in the same push.
- **The interim memo note, the ceiling check and early draft pull requests**, as before. A draft pull request still needs your authorization to push.
- **`edit-model` reads "to build"** although PR 35 suggests it needs a rules edit first. The graph cannot know that, and the author decides.

## 9. Commits

On `p47/r-roadmap`, on top of `44e62ef`:
- `a1f7298` design: lane R, the roadmap and plans as history.
- `7c0fb56` design: lane R answers its review. It holds the six changed Specs, the Pack framing, the revised bodies, `build.mjs`, the new `probes.mjs` with its outputs, and the refreshed prototypes and screenshots.

## 10. Review findings and dispositions

All from astra's review of `a1f7298`.

| # | Finding | Disposition |
| --- | --- | --- |
| 1 | Roadmap places reordered waiting statements against the statement queue's dependency order (blocking). | **Fixed in `7c0fb56`.** `#rule.waiting` and `#design.waitingRows` now say statements keep the queue's relative order across the whole roadmap, and their places never reorder them. Questions sort by place, then blocking first, then Spec id and position. The probe ranks gamma first and has it rest on delta: delta is listed first, on both roadmaps. On the platform the envelope now precedes the journal and the history projection. |
| 2 | A descendant could put an entry in to design without being named (blocking). | **Fixed in `7c0fb56`.** New `#rule.workRows`, `#design.workRow` and `#design.holdsRow` (clause plus dependency targets). The page shows a Parts field, and memo `Next` names up to three parts in the lane. The Example space gains the ready-root cases. The probe has a ready root with one evidence-less part (`kind-evidence-present`) and one question-blocked part (`no-blocking-open-questions`), and both are named. |
| 3 | A draft PR as the only execution record leaves no recovery home before the first push (blocking). | **Fixed in `7c0fb56`.** The decision, `#rule.executionRecord` and a new `#design.recordFile` add `reviews/<pack name>-record.md` until the first authorized push. At that push the record moves into the draft PR and the file keeps the link, and nothing authorizes a push. The AGENTS.md wording is updated (status block, commits, "Keep one record per arc"). It goes to the owner as part of decision 2. |
| 4 | The memo's "Statements first" used a different dependency set from recipe 46. It missed decisions and counted relation rows. | **Fixed in `7c0fb56`.** New `#rule.earlier` and `#design.earlierRow`, read from recipe 46's `restsOn` for the entry's waiting work and shaping decisions, deduplicated by id and marked entry, roadmap or outside. The column is `Earlier waiting statements`, with the reviewer's empty text. The Protocol's entry 1 now names `spec:decisions.roadmap-priority` and `spec:consumers.roadmap`, and entry 6 names `spec:decisions.roadmap-over-plans`. One refinement: a shaping decision of another entry reads as on the roadmap at that entry's place. |
| 5 | Rests-on missed a descendant's outside refining parent. | **Fixed in `7c0fb56`.** `#rule.restsOn` now uses the reviewer's selection, and `restsOnRow` gains `from`. The probe diamond rests on `spec:probe.outside` through `refines` from the diamond, and the diamond's holding row names that target. |
| 6 | Questions with no decider were hidden. | **Fixed in `7c0fb56`.** New `#rule.withoutDecider`. The totals gain `withoutDecider` and `blockingWithoutDecider`, and `waiting.withoutDecider` lists the rows. The page and memo say "These questions have no named decider." Decision rows keep full question rows, keyed or not. The platform shows 27, `verifyPassUnderPause` among them. The memo lists them by address only (`#design.memoUndecided`) to stay short. |
| 7 | `entry-<place>` is not unique across several roadmaps. | **Fixed in `7c0fb56`.** The ids are `roadmap-<Pack page name>-entry-<place>`, and every link uses its roadmap's prefix, with a new `dependsOn` on the publisher for the page name. The two-roadmap probe finds no duplicate ids, and all of its links resolve within their own roadmap. |
| 8 | The design diff would not show a Pack becoming or ceasing to be a roadmap. | **Fixed in `7c0fb56`, as far as this lane can edit.** The decision's rationale and a new consequence cover it, including schema versions: an absent `order` reads as reading order, and an unknown value is a diagnostic. The exact edits to `spec:consumers.design-diff` (packRows `orderChanged`/`orderBefore`/`orderAfter`, the rule, `decidedBy`) and to the diff page are proposed in section 5, and the build tests in section 6. |
| 9 | "Joins when its capture lands" makes the roadmap an inventory. | **Fixed in `7c0fb56`.** `#rule.oneRoadmap` now uses the reviewer's text, and `#rule.forwardSection`, the decision's consequence, the Pack framing and the proposed PR-standard bullet are aligned to selection. |
| 10 | The page labelled ordinary Packs as "in priority order". | **Fixed in `7c0fb56`.** The label comes from `order` ("in authored reading order" here), and `#rule.roadmapSummary` states the rule. Both pages are recaptured, and a probe check covers it. |
