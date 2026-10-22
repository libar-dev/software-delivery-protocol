# Lane R design report: the roadmap, and plans become the roadmap

**Outcome.** A roadmap is a Pack whose manifest states `order: priority`. Its member order is the owner's advisory priority. Everything else about an entry is read from the graph each time: its lane (to design, to state, to build or built, taken from the entry's whole refinement subtree), what holds it, what it rests on and what waits on it. The roadmap reading (recipe 53), its Studio page and the forward-section memo (recipe 55) are designed to `defined`, with the answer shapes as keyed Design entries. Both owner decisions are drafted to `defined` with recommendations. The first roadmap, `pack:roadmap`, is authored. A living prototype renders the page and the memo on the Protocol and on a platform copy. The engine needs one optional manifest field, which waits for the owner's ratification. Until then `pack:roadmap` is an ordinary Pack, and its framing says that its order is the proposed priority.

Validation at the head: 0 errors and 1 warning, the existing `honesty/gaps` on `spec:model.spec-sections`. The mention audit over the lane's Specs reports 0 unbacked mentions. `check:temporal` and Prettier pass. ESLint passes on the prototype folder.

## 1. Specs created or changed

Recipe 9 was re-run on each Spec at the head.

| Spec | Stated | Floor (recipe 9) | What changed |
| --- | --- | --- | --- |
| `spec:decisions.roadmap-priority` | defined | ready | Full decision: context, decision, two rationales (ADR three-part test), six alternatives, six consequences. `#priorityHome` is answered and removed. It now also `refines` `spec:decisions.pack-markdown-carrier` (the manifest gains a field). |
| `spec:consumers.roadmap` | defined | ready | 14 keyed rules covering entries, scope, Spec and entry lanes, drift, entries listed apart, needs, rests on, rested on by, the waiting list, built entries, overlap, reading order and statesNothing. 10 keyed Design entries give recipe 53's answer shape. Example space with 5 lane cases. `#lanes` is answered. It now `dependsOn` next-rung-floor, typed-dependency-floor, open-question-fields and readiness-planner. |
| `spec:consumers.roadmap.memo` | defined | ready | 7 rules and 10 Design entries (recipe 55's sections, why now, markup). It `dependsOn` the proposal memo (markup) and the register recipes (deferrals). |
| `spec:consumers.spec-studio.roadmap-page` | defined | ready | 12 rules: page, empty state, summary, board, lane lists, entry row, rests-on folding, waiting list, entries apart, memo disclosure, filter and statesNothing. 5 UI entries. |
| `spec:decisions.roadmap-over-plans` | defined | ready | Full decision. `#planCarrier` is answered. It now `dependsOn` `spec:decisions.roadmap-priority`. |
| `spec:protocol.roadmap-replaces-plans` | defined | ready | 7 rules (readsRoadmap, oneRoadmap, plansFrozen, executionRecord, forwardSection, handbookPointer, gateRecord) and 4 Design entries: the Pack, the handbook tokens, the frozen ceiling and the gate messages. |
| `spec:consumers.projections-model.roadmap-views` | scoped | scoped | `#namedRoadmapReader` is answered: the owner is the reader, served by `spec:consumers.roadmap`, which it now `dependsOn`. Release and baseline views stay deferred under `[blocking #releaseReader]` (decider owner, with a trigger). New Model terms **roadmap** and **phase / iteration / milestone** (descriptive words only). |
| `spec:consumers.spec-studio.cited-line-text` | scoped | scoped | Actor, problem, 3 rules. `#lineText` stays blocking and owner-decided, now with a provisional answer. New `[non-blocking #lineBound]` (delegated). `dependsOn` entry-citations and registers. |
| `spec:consumers.spec-studio.register-input` | scoped | scoped | Actor, problem, 3 rules. New `[blocking #registerEntry]` and `[blocking #inputForm]` and `[non-blocking #textLinks]`, all delegated with provisional answers. `dependsOn` external-registers and data.inputs. |
| `pack:roadmap` (new, `specs/roadmap.pack.sdp.md`) | — | — | The first roadmap, nine entries. Its framing states that the order is the proposed priority until the field is built. |

No Spec id is new. Nothing here states `ready`: the floor allows `ready` on the six `defined` Specs, and those statements are the executing thread's to propose after review. Ratifying the two decisions is the owner's act.

## 2. Rulings I made on delegation

| Ruling | Carrying entry |
| --- | --- |
| An entry's scope is the entry plus every Spec reaching it through `refines`, each counted once. Its work is that scope minus examples and decisions (the build backlog's exclusions). | `spec:consumers.roadmap#rule.scope` |
| There are four lanes, not three. A Spec below `ready` whose floor already reaches `ready` is **to state**: only a person's statement stands before it. An entry takes the first of to design, to state and to build that any of its work falls in, and reads built only when all of its work is ready and implemented. | `#rule.specLane`, `#rule.entryLane` |
| Drift (implemented below ready) keeps the Spec's lane and is counted apart. | `#rule.drift` |
| An entry that is itself a decision or an example has no work. It is listed apart and read through the entries it shapes or verifies. | `#rule.apart` |
| Rests on: `dependsOn` and `constrainedBy` from the scope, plus the entry's own `refines` parent, counting only targets not yet built. Decisions show separately, with their blocking questions. | `#rule.restsOn`, `#rule.needs` |
| Rested on by (what waits on the entry) is shown. It is the derived half of "why now". | `#rule.restedOnBy` |
| What waits on the owner covers questions with the owner as decider and waiting statements in any scope, and also those on decisions named by `decidedBy`. A decision's ratification counts as a waiting statement. Statements follow the statement queue's order, so decisions come first. | `#rule.waiting`, `#design.waitingRows` |
| A built entry keeps its place until someone edits the roadmap. No check reports it. | `#rule.builtStays` |
| Why now is read, never authored: the entry's `problem`, or its `outcome` when it has no problem, plus counts of what waits on it and what is ready to build. | `spec:consumers.roadmap.memo#rule.whyNow` |
| The memo carries no re-entry condition, refused list or assignment to a pull request. It does carry the corpus-wide deferrals from recipe 20, because the description standard asks for them. | `#rule.authorsOwn`, `#design.memoDeferred` |
| The page has a four-column board, then lane lists, then the waiting list, then the memo with a copy action. Rests-on rows that only wait for a statement are folded. | `spec:consumers.spec-studio.roadmap-page#rule.board`, `#rule.restsOnShown`, `#rule.forwardSection` |
| The Protocol keeps one living roadmap, `pack:roadmap`, edited in place. This is a proposal for the owner. | `spec:protocol.roadmap-replaces-plans#rule.oneRoadmap` |
| Gate design: the frozen ceiling is a constant; the gate checks for the handbook tokens `pack:roadmap` and `recipe 53` and for the manifest line `order: priority`; the five failure messages are fixed. | `#rule.gateRecord`, `#design.frozenCeiling`, `#design.handbookTokens`, `#design.gateMessages` |
| Register input: provisional answers for `#registerEntry` (optional `title`/`href` per token; a register page), `#inputForm` (`--register NAME=PATH` with `--register-pattern NAME=SOURCE`) and `#textLinks` (links inside the text, matched as recipe 50 matches). | `spec:consumers.spec-studio.register-input#question.*` |
| The first roadmap's order is the arc's lead features in the order their designs build on each other, then cited-line-text, register-input and edit-model. This is a proposal, and the owner sets priority. | `pack:roadmap` |

## 3. Decisions for the owner

1. **Where priority lives** (`spec:decisions.roadmap-priority`). Options:
   - (a) an optional manifest field, `order: priority`;
   - (b) a Pack read as a roadmap by a naming convention or reserved id;
   - (c) any Pack's order read as priority, with the Pack passed as a parameter;
   - (d) corpus data outside the graph, like a perspective's `order`;
   - (e) a `precedes` relation or a per-Spec rank;
   - (f) a boolean `roadmap: true`;
   - (g) prose, as today.

   **Recommendation: (a)**, confidence 4/5. It is the only option that is typed, checked (every entry resolves), visible in the design diff, and readable by the Studio and the vault without configuration. It keeps MD-33's refusal for everything except this one advisory order. The spelling of the field is yours.

   Engine change: `src/model/pack.ts` (the `pack()` builder takes `order?: "priority"`), `src/extract/markdown-frontmatter.ts` (envelope keys plus a value check), `src/extract/reify.ts`, `src/extract/derive.ts`, `src/graph/schema.ts` (PackNode `order?`, additive, so the schema's minor version rises), `src/extract/serialize.ts` (field after `modelRefs`) and `src/reader/reader.ts` (Pack context `order`). An invalid value refuses as `extract/invalid-frontmatter`. No validator is added.

2. **Plans become the roadmap** (`spec:decisions.roadmap-over-plans`). Options: (a) retire `plans/` as frozen history, put the execution record in the pull request description (a draft opened at the arc's first push), and rewrite the gate's current-record check; (b) keep a thin plan file per arc as the execution record only; (c) keep plans beside the roadmap; (d) record execution in the graph (refused). **Recommendation: (a)**, confidence 4/5. Sub-choice: the gate's ceiling check, which refuses any numbered plan past the last frozen one. I recommend it at confidence 3/5. You may drop it and keep only the handbook and manifest checks.
3. **Line text** (`spec:consumers.spec-studio.cited-line-text#question.lineText`). Options: record the trimmed, bounded line text on the citation row the extractor already writes; take it as a named Studio input; or keep the source link only. **Recommendation:** record it on the citation row, as inferred data that confers nothing. Confidence 3/5, because this is the first source text in the graph.
4. **The roadmap itself.** Is there one living `pack:roadmap`? What is its order, and do the arc's leads belong on it? Recommendation: one living Pack, confidence 4/5. The order is entirely yours.
5. **Release and baseline views** (`#releaseReader`) stay deferred. Proposed trigger: the package's first published release.
6. **Words to ratify:** "roadmap", the roadmap "lane", and the lane name "to state". "Lane" collides with the description standard's "lanes" (parallel work streams). The alternative word is "need".

## 4. Prototypes

All prototypes are under `/tmp/plan47-wt/R/reviews/assets/plan47-prototypes/R-roadmap/`.

| Path | Shows |
| --- | --- |
| `recipe-53-the-roadmap.body`, `recipe-55-the-roadmap-memo.body` | Drafted recipe bodies. They are `.body` files so the repository's lint does not parse a bare function body. |
| `build.mjs`, `README.md` | Runs both bodies through `sdp q` on each corpus and writes the JSON, the memo and the pages. The README has the reproduce commands. |
| `protocol/roadmap-1440.png` | The Protocol's roadmap: framing, summary and the board (6 to design, 2 to state, 1 to build). |
| `protocol/roadmap-1440-expanded.png` | Every entry opened: next rung and clauses, blocked by, decided by, rests on (with places), waited on by, and the owner's list in statement-queue order. |
| `protocol/roadmap-390.png` | Phone width: the board stacks into one column. |
| `protocol/memo.md`, `protocol/memo.html`, `protocol/memo-1440.png` | Recipe 55's forward section, raw and rendered. |
| `platform/roadmap-1440.png`, `platform/roadmap-1440-expanded.png` | The trial `pack:roadmap` on `/tmp/plan47-platform-R` (history projection, history rebuild, journal, restore). Every entry is to state, and 22 statements wait, decisions first. This matches the platform's own unit that makes `ready` the approval to build. |
| `platform/memo.md`, `platform/memo-1440.png` | The platform's memo. |

What the prototypes showed:
- Two of the Protocol's entries moved from to design to to state as soon as this lane's Specs reached `defined`, with no edit to the roadmap.
- A decision named by `decidedBy` has to count in the owner's list. The first draft missed both roadmap decisions.
- The platform copy keeps its trial manifest at `/tmp/plan47-platform-R/design/specs/roadmap.pack.sdp.md`. The platform itself was never edited.

## 5. Proposed edits to files I may not edit

**`pack:roadmaps-and-slices-v1`:** add `spec:consumers.projections-model.roadmap-views` after `spec:protocol.roadmap-replaces-plans`.

**`AGENTS.md`, opening block.** Replace the whole status blockquote (from `> **plan 47 is DRAFTED**` through `...also read the latest ✅ EXECUTED/RUN plan for settled ground.`) with:

```md
> **Where work stands is read from the graph.** The Protocol's next work is its roadmap,
> `pack:roadmap` (`specs/roadmap.pack.sdp.md`), a Pack whose member order is the owner's advisory
> priority. Run the roadmap, recipe 53, for each entry's lane (to design, to state, to build,
> built) and what holds it; the build backlog (recipe 1), the design backlog (recipe 33) and the
> statement queue (recipe 46) answer the rest. Each entry leads to its arc's Pack and carrying
> Specs, and an arc's lanes, rulings and acceptance are in its pull request description.
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

**`AGENTS.md`, "Where to look".** Replace the `plans/` row with these two rows:

```md
| `specs/roadmap.pack.sdp.md` + recipe 53 | **the roadmap** — the next work in the owner's priority order, each entry's lane and what holds it | before choosing or opening work |
| `plans/` | **frozen history** — how each earlier arc was run, through plan 47; forward work reads from the roadmap | only for an earlier arc's record |
```

**`AGENTS.md`, "The build path".** Replace `Live work is the highest primary-numbered plan under \`plans/\` — read it before writing code.` with `Live work is the roadmap: run recipe 53 over \`pack:roadmap\` before writing code, and read the Pack of the entry you take up.`

**`AGENTS.md`, "Plan vs execution".** Replace `For a plan under \`plans/\`, don't touch its target files unless the session is execution.` with `For a roadmap entry, don't touch the files its build will change unless the session is execution.`

**`AGENTS.md`, "Commits are recovery boundaries".** Make two replacements:
- Replace `An execution plan's explicit commit strategy counts as authorization on its work branch` with `The owner's instruction for an arc, recorded in its draft pull request's working rules, counts as authorization on its work branch`.
- Replace `in the tracked plan/draft` with `in the arc's draft pull request`.

**`AGENTS.md`, PR description standard.** Make these changes:
- Replace `the plans it executes` with `the roadmap entries it designs or builds`.
- Replace `a carrying Spec, a worked example, a plan` with `a carrying Spec, a worked example, a Pack`.
- Replace the "Plan the next PR" bullet with:

```md
- **Plan the next PR from the roadmap.** Every description keeps a forward section, and it is a
  proposal: render it with the roadmap memo (recipe 55) at the head, which lists the entries to
  design, to state and to build in priority order, what waits only for the owner, and the deferred
  items with their triggers; write the next PR's re-entry condition and the durable refused list
  around it. Edit the roadmap Pack in the same PR: remove the entries it built, add the captures
  it opened, and reorder on the owner's word. Rewrite the section each time rather than appending
  stale rows.
- **Open it early.** An arc's pull request opens as a draft at its first push and carries the
  arc's working record, its lanes and its rulings as they are made; it is the arc's only record.
```

- Also replace `Check the description against the plan,` with `Check the description against the arc's Pack, the roadmap,`.

**`.agents/skills/sdp-authoring/SKILL.md`.** Replace the bullet `- A plan file points to the Pack and carrying Specs ...` with:

```md
- Keep the next work's priority in a roadmap: a Pack whose manifest states `order: priority`, its members in the order you want them taken up. The order is advisory and confers nothing; each entry's lane and what holds it are read with the roadmap recipe (recipe 53), and no check reads a roadmap's content. A plan document, where a corpus keeps one, points to the Pack and carrying Specs for intended truth and derived state; plan numbering and staleness confer no graph structure or workflow authority.
```

The `test/skills.test.ts` assertion for "A plan file points" moves with this change.

**`.agents/skills/sdp-sessions/SKILL.md`.** Make two changes:
- Replace `capability-based Pack names and plan pointers` with `capability-based Pack names and roadmap entries`.
- In Implement, replace `Use the build backlog (recipe 1) to orient` with `Use the roadmap (recipe 53) for the owner's order and the build backlog (recipe 1) to orient`.

**`.agents/skills/sdp-agent-surface/SKILL.md`, task table.** Add the row:

`| Read what comes next, in the owner's order | the roadmap (recipe 53); the roadmap memo (recipe 55) for a description's forward section |`

**`spec:consumers.graph-first-planning`.** Add `decidedBy: spec:decisions.roadmap-priority` and replace its last rule with:

`- rule: A roadmap holds a corpus's advisory priority as the member order of a Pack whose manifest states \`order: priority\`, as \`spec:decisions.roadmap-priority\` rules; the order authorizes, blocks and sequences nothing. A plan document, where a corpus keeps one, points to the Pack and carrying Specs for intended truth and derived state, while plan numbering, staleness and any other recorded work order never become graph structure or workflow authority.`

**Pack engine Specs** (when the field is built):
- `spec:carrier.markdown-pack-authoring`, envelope rule: append `, and \`order\` (optional; its one lawful value is \`priority\`, and any other value refuses with \`extract/invalid-frontmatter\`)` to the closed key list. Add `decidedBy: spec:decisions.roadmap-priority`.
- `spec:model.pack-aggregate`, Model: add `- **priority order** — The authored member order of a Pack whose manifest states \`order: priority\`, read as its owner's advisory preference among its members; it confers nothing and sequences nothing.` Add `decidedBy: spec:decisions.roadmap-priority`.
- `spec:extraction.pack-member-order`: the field order becomes `id`, `nodeType`, `claim`, `title`, `framing`, `file`, `members`, `modelRefs`, `order`.

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
- In the vocabulary line, replace `phase / iteration / milestone** (descriptive vocabulary, optional roadmap projections, never gates)` with `phase / iteration / milestone** (descriptive words a roadmap's framing may use, never entry fields, dates or gates)`.

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

Keep the green-gate legs check and the plan-status ban on DECISIONS and CONTEXT. Update header item 4 and `report.currentRecord` to `{ lastFrozenPlan, roadmapPack, gateLegs }`.

**`test/check-self-hosting-gates.test.ts`.** Replace the current-plan cases with these:
- a numbered plan above the ceiling (padded and unpadded) fails;
- a letter-suffixed plan is ignored;
- a handbook missing `pack:roadmap` or `recipe 53` fails;
- a missing manifest fails, and a manifest without `order: priority` fails.

**`plans/47-roadmaps-capability-maps-and-slices.md`, at close.** The status header reads EXECUTED and adds `The last numbered plan: forward work reads from the roadmap, \`pack:roadmap\` (recipe 53), and each arc's record is its pull request description.`

## 6. What the build needs, in order

1. **The owner's rulings** on decisions 1 and 2. If priority lands outside the graph instead, steps 2 and 5 change, and the roadmap's reading stands.
2. **Engine `order` field.** Make the seven source changes listed under decision 1. Add tests for Markdown and TypeScript parity with `order`, for refusing an invalid value, and for serialized field order. Update the three Pack Specs as proposed above. Add `order: priority` to `specs/roadmap.pack.sdp.md`.
3. **Recipes 53 and 55** in `docs/agent-surface/recipes.md` (table rows, bodies from the prototype, prose). Recipe 55 calls `recipes(53)` and `recipes(20)`, and recipe 53 calls `recipes(46)`. Shipped files under `dist/recipes/`, and the recipe check. Five example children for the roadmap example space, with a `specTest` suite. A memo test that pins byte determinism and `|`/backtick escaping.
4. **Studio page.** Add a new `roadmap.html` page module in the existing Studio pages component (no new component, which answers lane A's question 7), CSS for the board, and the navigation and index edits. Tests: the empty state, lanes and board, the memo bytes equal recipe 55, a byte-identical rebuild, and the Pack page link.
5. **Self-hosting switch.** The AGENTS.md edits, gate section 4 with its tests, the skills and their test, graph-first-planning, CONTEXT.md, DECISIONS.md rows, and the oracle updates for every Spec in section 1 plus the new Pack. Then plan 47 closes as the last numbered plan.
6. **Later work:** cited-line-text and register-input wait for their open questions. Release and baseline views wait for their trigger.

What I need from other lanes:
- **E:** roll up an epic's descendants with the same set-based scope as `spec:consumers.roadmap#rule.scope`, so the roadmap and the capability map count a subtree the same way. Once epics exist, the owner may list epics on the roadmap.
- **G:** no drawing kind is required, because the board is HTML lists. A dependency drawing over a roadmap's entries would be a welcome later addition.
- **S:** nothing required. A slice might link to its entry's place on the roadmap.
- **Integration:** the oracle edits listed in step 5.

## 7. Changes to the brief

- **Added a fourth lane, "to state".** On the platform every entry waits only for a statement. On the Protocol, this lane's own Specs reached that state. Calling either "to design" would be wrong.
- **Decision and example entries are listed apart.** They have no work to place in a lane.
- **Ratifications count among waiting statements,** ordered by the statement queue.
- **The memo does not split entries by pull request.** Choosing which entries go into which pull request is the author's call, and a count limit would be pseudo-scheduling.
- **The memo includes the corpus-wide deferrals.** The description standard requires them.
- **The first roadmap lists the arc's lead features, not every member.** The pages and epics still show, under each entry's "Waited on by".
- **`roadmap-views` keeps its id and title.** The remaining question is renamed `#releaseReader`.
- **The plans part reshaped AGENTS.md wording beyond the status block** (build path, commits, the PR standard), because each line pointed at plan files.

## 8. Risks and open questions

- **Pack membership side effects.** Every Spec on the roadmap shows `pack:roadmap` among its Packs, in the rail and in the queue's Pack filter. This is harmless but visible.
- **Cross-lane ids.** The roadmap lists other lanes' Specs. A rename or split in another lane must update the manifest; validation will catch a broken id.
- **Long waiting lists.** On a corpus with no `ready` statements the list grows long (22 on the platform copy). A fold may be wanted.
- **Interim memo note.** Until the field is built, every memo prints "This Pack's order is reading order", which is honest.
- **The ceiling check may feel like workflow.** It polices the record layout the decision rules on, and it can be dropped.
- **Early draft PRs need a push.** Opening a draft pull request at an arc's first push needs your authorization to push.
- **`edit-model` reads "to build",** although PR 35 suggests it needs a rules edit first. The graph cannot know that, and the author decides.

## 9. Commit

`a1f7298` on `p47/r-roadmap` ("design: lane R, the roadmap and plans as history"), on top of `44e62ef`. It holds 9 changed Specs, the new `specs/roadmap.pack.sdp.md`, and the prototype folder.
