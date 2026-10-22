# Lane S, design: the design slice and its Studio page

Lane S finished its design pass and committed it on `p47/s-slices` as `fe1d7e5`, on top of `44e62ef`.

**What a design slice is.** It is a reading, not an artifact: a Pack read whole, the same Pack narrowed to the members a perspective selects, or an ordered list of Specs. A catalog recipe (recipe 54) composes it from the graph each time it runs. It adds no grouping, namespace, kind, stage or gate.

**Why no new grouping.** Gen 1's slice was an authored file: a members list plus a "Usage" line naming the question the members answer (Architect `formal-spec/04-tag-registry.md`, hierarchy level `slice`). A Pack already does that job. The v0 design saved its "AI slices" as files (`docs/lineage/v0-design/07-…` §5.5), and the Protocol refused saved slices when it ruled that the context bundle is never saved.

**What the reading adds that the Pack page does not have:**
- how the members rest on each other, with a depth for each member, the ones others rest on first;
- the components the slice touches, reached three ways that are never merged:
  - the members' own code;
  - the code that realizes the Specs the slice rests on. This is how a design written before its code shows the architecture it will touch, since its members have no code yet;
  - the components the members' component designs plan;
- the decisions and open questions in scope;
- each member's stated next rung and what holds it, with its design columns beside the rung and never as a score.

**The page.** `spec:consumers.spec-studio.slice-page` is a page of its own, one per Pack (`slices/<name>.html`), one link from the Pack page. The Pack page keeps its card-by-card reading.

**Prototypes and validation.** I prototyped the page on the Protocol's corpus and on the platform copy. On six Packs, including the whole-corpus self-hosting Pack and the platform's foundation Pack, a whole Pack's slice boundary matched Pack design's boundary row for row. `validate` reports 0 errors and the one expected warning. `check:temporal` passes, and lint over the prototype scripts is clean.

## 1. Specs created or changed

No new Spec ids. Recipe 9 figures were re-measured at `fe1d7e5`.

| Spec | Stated | Floor (recipe 9) | What the next rung needs |
| --- | --- | --- | --- |
| `spec:consumers.design-slice` (behavior, feature) | `defined` | `ready` | Nothing blocks; it waits for the owner's statement. |
| `spec:consumers.spec-studio.slice-page` (behavior, story) | `defined` | `defined` | `ready` is held by the typed-dependency clause, because `spec:consumers.spec-studio.diagram-kinds` states `idea` (lane G's drawings). |

**`spec:consumers.design-slice`** now holds:
- A narrative citing the gen-1 and v0 evidence and the adopter's feedback (items 11 and 12).
- 16 keyed rules.
- 13 keyed Design entries giving recipe 54's parameters and answer shape (summary and detail).
- An example space so test authors can write probe-corpus examples. It has no example children yet, and it adds one space-contract module.
- One non-blocking owner question, `#sliceTerm`.
- New relations:
  - `dependsOn`: `review-perspectives`, `context-bundle`, `readiness-planner`, `model.planned-architecture`, `model.rule-keys`, `agent-surface.design-recipes`, `model.open-question-fields`;
  - `decidedBy`: `decisions.anchor-binding-grain`, `decisions.architectural-annotation`;
  - each relation carries a reason.

**`spec:consumers.spec-studio.slice-page`** now holds:
- 15 keyed rules, 9 UI entries and a manual Verification section.
- One non-blocking delegated question, `#exportCarriesSlice`.
- New `dependsOn` relations: `design-slice`, `spec-studio.data.recipe-answers`, `spec-studio.pack-page`, `spec-studio.diagram-kinds`, `spec-studio.diagrams`, `derived-readiness-banner`, `binding-language-views`, `model.open-question-fields`.

**Pack manifest:** nothing to add. My lane made no new ids, and `pack:roadmaps-and-slices-v1` already lists both Specs in a good reading order.

## 2. Rulings I made on delegation

| Ruling | One line | Carrying entry |
| --- | --- | --- |
| A slice is a reading | Composed per invocation; never authored, saved or committed; no grouping, kind, stage or gate. | `spec:consumers.design-slice#rule.readingNotArtifact` |
| Three scopes | A Pack, a Pack narrowed by `members` (for example the perspective filter's ids), or an ordered `specs` list; the parameters mirror the context bundle's. | `#rule.scope`, `#design.sliceRecipe` |
| Rests-on inside the slice | The four typed relations, with the statement queue's rule that a `refines` answered back orders nothing, so a decision comes before the Spec it shapes. | `#rule.restsOn` |
| Depth and cycles | Depth 1 means the member rests on no other member. Cycle members share a depth and are listed with one closed path; nothing is refused. | `#rule.depth` |
| Examples fold into their parent | An example member that refines a member is counted in that member's row and drawing box, and keeps its own row in the answer. | `#rule.examplesFold`, `slice-page#rule.exampleRows` |
| Components touched three ways, never merged | Members' units, units that satisfy what the slice rests on, and members' component designs (planned). | `#rule.touchedComponents` |
| Downstream code excluded | Code of Specs that rest on the slice is design-change impact's to report, not the slice's. | `#rule.notDownstream` |
| Questions in scope | Members' questions, the in-scope decisions' questions, and the blocking questions of outside Specs that hold a member. | `#rule.questionsInScope` |
| Rule count sits beside the design columns | A rule count (as rule coverage counts it) is added next to the design columns, not inside them, so the glossary term "design columns" is unchanged. | `#rule.memberColumns`, `#design.memberRow` |
| Summary by default | `detail` works as in Pack design (`true`, or a list of member ids); a summary keeps every total and adds `leftOut`. | `#design.sliceDetail` |
| No design verdict | No over- or under-designed flag, no ratio, no finding. | `#rule.noDesignVerdict` |
| A separate slice page per Pack | Two readings in two orders (the author's narrative, and the members others rest on first); long Packs stay readable. | `slice-page` narrative, `#rule.slicePerPack` |
| What the drawing shows | Outside Specs that hold a member or state below `defined` get their own boxes; the rest fold into one box per relation. | `slice-page#rule.dependencyDrawing` |
| Member table fits a desktop column | One "Design carried" cell with one count per line, no total row. | `slice-page#ui.memberTable` |
| The Pack export is unchanged | Provisional answer to a non-blocking question. | `slice-page#question.exportCarriesSlice` |

## 3. Decisions for the owner

1. **Should `design slice` join the glossary?** (`spec:consumers.design-slice#question.sliceTerm`)
   - Options: (a) add it as a guidance-only label beside design pass, design diff and design backlog; (b) give it a full glossary row; (c) rename the reading, for example "Pack read whole".
   - Recommendation: (a). It names a recipe's answer, not a primitive. Text is in item 5.1. Confidence: high.
2. **Should the guidance on design rounds go into the skill and the on-ramp?** This is not a decision record; it is an edit the executing thread rules on. The exact text is in items 5.2 and 5.3.
   - Recommendation: adopt it. Confidence: medium-high. It writes down practice from Architect's detail-level doctrine and the platform's "detail follows the build" rule.

## 4. Prototypes

All prototype files are under `/tmp/plan47-wt/S/reviews/assets/plan47-prototypes/S-design-slice/`.

| Path | What it shows |
| --- | --- |
| `slice-recipe.mjs` | The draft body of recipe 54, written as one linted function; `sliceBody` runs it through `sdp q` unchanged. |
| `build-slice-pages.mjs` | Runs the body (full and summary) and writes the pages in the Studio's look, with stand-in drawings. |
| `README.md` | Commands, sources and what the prototype measured. |
| `studio.css` | A copy of the Studio's stylesheet. |
| `protocol/roadmaps-and-slices-v1.html` | The arc's own Pack: 14 members, 3 depths, 6 components touched, all of them through what the slice rests on. |
| `protocol/spec-studio-v1.html` | 63 members (23 examples folded), 10 depths, 11 components. Its drawing is over the Studio's bound and says so. |
| `platform/history-view.html` | 19 members (5 examples folded). The design is one deep chain from decision D9 up to the history rebuild. 9 components; 62 questions, none blocking. |
| `platform/application.html` | 54 members (33 examples folded), 11 components across four contexts, 1 blocking question. |
| `answers/*.summary.json`, `answers/protocol-roadmaps-and-slices-v1.json` | The summary answer for each Pack, plus one full answer. |
| `screenshots/*-top.png`, `*-dependencies.png`, `*-members.png`, `*-architecture.png` | Each page at 1440 wide. |
| `screenshots/protocol-roadmaps-and-slices-v1-questions.png` | The decisions and questions sections. |
| `screenshots/platform-history-view-phone-*.png` | The history-view page at 390 wide. |

Answer sizes in UTF-16 code units, full then summary. Re-run the script rather than quoting these:

| Pack | Full | Summary |
| --- | --- | --- |
| arc Pack | 29,761 | 17,639 |
| Studio Pack | 103,320 | 56,574 |
| history view | 122,496 | 41,335 |
| application | 141,605 | 62,102 |

Run time for all eight Protocol Packs is about 7 seconds. 5.3 seconds of that is the whole-corpus self-hosting Pack, because the body calls rule coverage once per member.

No corpus has a component design yet, so no page shows a planned component.

## 5. Proposed edits to files I may not edit

**5.1 `CONTEXT.md`, line 245, the "Guidance-only labels" paragraph.**

Replace `` `design pass`, `design diff`, `design backlog` and `curation report` name a design activity or a recipe's answer, `` with:

> `` `design pass`, `design diff`, `design backlog`, `design slice` and `curation report` name a design activity or a recipe's answer, ``

Then append to the paragraph:

> A design slice is the design slice recipe's reading of a set of Specs as one design, composed on each invocation; it is never the saved AI slice the context bundle replaced.

**5.2 `.agents/skills/sdp-authoring/SKILL.md`: a new subsection after "### How much to write"** (after its last bullet, before "### Key a step or a term"):

```md
### Design in rounds

A design grows in rounds over the Specs that must be reviewed together, never one Spec at a time
to completion. Open each round with the design slice (recipe 54) over the Pack, or over one
perspective's members, and spend detail where the next round or the next build needs it, first
on the members others rest on.

What a rung's design typically settles:

- `idea`: the outcome, and the parent it refines when it has one. Capture the questions you
  already see; rules and Design entries wait.
- `scoped`: the actor and the problem, the relations to what it rests on, the first rules or
  examples, and its open questions with keys, deciders and provisional readings. A decision it
  needs is a decision Spec it names through `decidedBy`.
- `defined`: every behavior stated as a rule, keyed where something outside cites it; every
  blocking question answered or moved to the decision Spec that settles it; the names, shapes and
  messages two parties share as keyed Design entries, pinned when they are declarations; a
  component design for each component the code does not hold yet; and the example space when
  examples will exercise the rules. A deferral stays a blocking question with its trigger and
  keeps the Spec below `defined`.
- `ready`: no new detail. What it rests on states `defined`, a person reads it in its slice, and
  that person states it.

What stays out, because it belongs to the build:

- a detail only the builder reads: private names, internal decomposition, file layout, the data
  structure behind a stated shape, the algorithm behind a rule that already states its outcome;
- a question only the builder can answer: leave it to the build, or record it `[non-blocking]`
  with `decider: delegated` and a provisional reading, so it holds no rung.

A detail belongs in the Spec when a second party must agree on it: a test author, a reviewer,
another Spec's author or an adopter. Otherwise the builder decides it and the code holds it.

Read the slice to see both:

- Read members in depth order, the ones others rest on first: a member others rest on needs its
  shared names settled before they can settle theirs.
- Read the design columns beside each rung. Pinned declarations on a member stated `idea` or
  `scoped` may run ahead of intent no one has settled; a member stated `defined` that others rest
  on, with no keyed entries where they need its names, may leave them guessing. Both are
  questions for the author, never findings.
- A blocking question in scope that only the builder can answer belongs to the build.
- The architecture it touches names the code the design builds on through what it rests on; that
  code's owners read the slice too.

No check reads this guidance; how much design is enough stays the author's and the reviewer's
judgment.
```

**5.3 `spec:consumers.authoring-on-ramp`, a new rule after the rule that opens "The skill teaches the least design two parties need to agree":**

> `- rule: [#designRounds] The skill teaches design in rounds over a design slice: what each rung's design typically settles, that a detail only the builder reads and a question only the builder answers belong to the build, and how a reviewer reads the design columns beside each rung; no check reads this guidance.`

`test/skills.test.ts` may need to assert the new subsection.

**5.4 `.agents/skills/sdp-sessions/SKILL.md`, line 72, the Design shape.**

Replace `For a Pack, read Pack design (recipe 29).` with:

> For a Pack, read Pack design (recipe 29) member by member and the design slice (recipe 54) as one whole: how the members rest on each other, the architecture they touch, and the decisions and questions in scope.

**5.5 `.agents/skills/sdp-agent-surface/SKILL.md`, the task sheet: a new row after "Review a Pack":**

> `| Read a Pack or a set of Specs as one design | the design slice (recipe 54) |`

**5.6 `docs/agent-surface/recipes.md`:**
- Index row: `| 54 | The design slice | pack or specs, members, detail | Read a set of Specs as one design |`
- Line 167: replace `Changed-file impact, Pack design and the design diff, recipes 4, 29 and 35, accept` with `Changed-file impact, Pack design, the design diff and the design slice, recipes 4, 29, 35 and 54, accept`.
- In the same paragraph, replace `Pack design also accepts member ids in` with `Pack design and the design slice also accept member ids in`.
- Catalog entry `## 54. The design slice`: when-you-need-it line "you are reviewing features that must be reviewed together and want the whole at once"; the body taken from `slice-recipe.mjs` (the statements of `designSlice`); and prose restating the Design entries. The law is `spec:consumers.design-slice`.

**5.7 `spec:consumers.agent-surface.answer-shapes`:**
- First rule: `Changed-file impact, Pack design and design diff, recipes 4, 29 and 35,` becomes `Changed-file impact, Pack design, design diff and the design slice, recipes 4, 29, 35 and 54,`.
- `#design.detailParameter`: `recipes 4, 29 and 35 read` becomes `recipes 4, 29, 35 and 54 read`, and `recipe 29's detail may also be` becomes `recipe 29's and recipe 54's detail may also be`.

**5.8 `spec:consumers.spec-studio#rule.staticPageSet`:** `one page per Pack and per Spec;` becomes `one page and one slice page per Pack, one page per Spec;`.

**5.9 `spec:consumers.spec-studio.publisher#rule.pageSet`:** `one \`packs/<name>.html\` per Pack,` becomes `` one `packs/<name>.html` and one `slices/<name>.html` per Pack, ``.

**5.10 `spec:consumers.spec-studio.data.recipe-answers`:**
- `#design.recipeEvaluations`: `recipe 29 with \`{ pack: id }\` for every Pack;` becomes `` recipe 29 with `{ pack: id }` and recipe 54 with `{ pack: id, detail: true }` for every Pack; ``.
- `#design.pageRecipes`: after `a Pack page renders the totals of its recipe 29 answer and, given a base graph, its own recipe 35 answer;` insert `a slice page renders its Pack's recipe 54 answer;`.

**5.11 `spec:consumers.spec-studio.pack-page`.** No Spec id goes in the text, so the edit adds no mention.
- `#rule.header`: `its id and its carrier file as text with a copy action, then the summary;` becomes `its id and its carrier file as text with a copy action, and a link to the Pack's slice page, then the summary;`.
- `#ui.headerBlock`: `the id and the carrier file, each with a copy action;` becomes ``the id and the carrier file, each with a copy action, and the link `Read this Pack as one design` to its slice page;``.

**5.12 `spec:consumers.spec-studio.data#rule.noSlices`:** append `A slice page renders the design slice's answer into its markup, as every page renders its values, and embeds no slice data.` This stops "AI slice" being misread as covering the new page.

**5.13 Self-hosting oracle (`test/self-hosting-oracle/*`), at integration:** both Specs move from `idea` to `defined`, they gain the new relations and sections, and the example space adds one space-contract module.

## 6. What the build needs, in order

1. **Recipe 54.**
   - The catalog entry and the shipped body (5.6), plus the edits in 5.7.
   - Recipe-check coverage in `test/recipes.test.ts`, and the document-realization anchor (an `impl:` code anchor on the suite) as other recipes have.
   - Probe-corpus example children of `spec:consumers.design-slice` that bind its example space: a chain, a decision that refines what it shapes, a two-member cycle, a folded example, and an outside Spec that a component's unit satisfies, that no code satisfies, or that states below `defined`.
   - Tests that:
     - a whole Pack's boundary equals Pack design's;
     - the summary, the `detail: true` answer and a `detail` list of member ids each have the documented shape;
     - every diagnostic fires;
     - `inPack` is set on a narrowed slice.
   - Performance: the body calls rule coverage once per member, which costs 5 seconds on a 421-member Pack. The build could count rules directly, or share the Studio's per-Spec recipe 34 answers.
2. **Lane G's two drawing kinds**, in `spec:consumers.spec-studio.diagram-kinds`, before the page can state `ready`.
3. **The slice page.**
   - `src/projections/studio/pages/slice-page.ts`.
   - Recipe 54 evaluated once per Pack (5.10).
   - The page set and publisher edits (5.8, 5.9).
   - The Pack page header link (5.11).
   - Tests for the sections, the folded examples, empty sections, `#bindingWords`, links that resolve, determinism, and the 390-wide layout.
   - Then `generate:self-hosting` and `check:self-hosting`.
4. **Skills and glossary:** 5.1 to 5.5 and 5.12, plus the skills test.
5. **Oracle:** 5.13.

**What I need from other lanes:**
- **Lane G:**
  - (a) A dependency drawing over a set of Specs. It reads the recipe 54 answer: members with `depth` and `exampleMembers`, `structure.edges` typed by the four relations, and `boundary.restsOn` with `holds` and the stated rung. Members sit in bands by depth, each above what it rests on. Outside Specs get their own band, where a Spec that holds a member or states below `defined` is drawn and the rest fold per relation. A cycle is named in words.
  - (b) An architecture drawing scoped to a set of components. It reads `architecture.components` (layer, context, planned, how the slice reaches each) and `architecture.uses` (counts, planned).
  - Both should be legible at desktop width. The prototype's bands of at most three 280-pixel boxes keep 12-pixel labels inside the 960-pixel column.
  - The Studio Pack and the application Pack still go past the bound (44 boxes and 145 edges; 110 edges). For the fold order I suggest: outside Specs first, then members by depth band, then text only.
  - Long one-member-per-depth chains, like the history view, draw tall. G may prefer horizontal bands for those.
  - The element ids I need are in `slice-page#ui.drawingIds`.
- **Lane E:** the capability map can link an epic's Pack to its slice page. Recipe 54's `specs` scope also reads an epic's refinement subtree when no Pack groups it.
- **Lane R:** a roadmap entry that is a Pack can link to its slice page, especially "to design" entries. The new roadmap Pack gets a slice page like every other Pack.

## 7. Changes to my brief

**Added:**
- Reaching components "through what the slice rests on". Without it, every slice designed ahead of its code shows no architecture at all: the arc's own Pack touches 6 components, all of them this way.
- The `specs` scope and the `members` narrowing, using the context bundle's parameters.
- Summary and detail.
- Excluding downstream code.
- The `inPack` marker on narrowed slices.
- Folding examples into their parents.
- Blocking questions of outside Specs that hold a member.
- An example space for the build's tests.

**Reshaped:**
- "Design columns" stay as the glossary defines them; the rule count sits beside them.
- The statement-queue order is not repeated in the slice. Depth gives the reading order, and the statement queue still orders statements across the corpus.

**Kept out of my Specs:** the rounds guidance, which the brief asked for as proposed text (5.2, 5.3).

**Dropped:** nothing.

## 8. Risks and open questions

- **Bound:** large Packs go past the drawing bound even after folding, so lane G's fold design is on the critical path for the page's `ready`.
- **Size:** a whole-corpus Pack gives a large summary (about 475 KB pretty-printed on `pack:self-hosting-v1`). The summary is not a budget; a budgeted reading is the context bundle's job.
- **`holds` on a question:** it names the members whose stated next rung the question's Spec holds. A Spec can be held below `defined` for evidence reasons too, so `holds` describes what the Spec holds, not the question alone. The Design entry says so; a reader could still over-read it.
- **Decisions sit at depth 1 below what they shape:** this follows the statement-queue rule, as intended. For example, the history view's foundation is decision D9.
- **Owner questions:** the term `#sliceTerm`, and whether the build's export follows `#exportCarriesSlice`.
- **No planned-component evidence:** neither corpus has a component design, so the planned path is tested only by the probe examples the build adds.

## 9. Commit

`fe1d7e5` on `p47/s-slices` ("design: the design slice and its Studio page, with prototypes"), on top of `44e62ef`. It changes `specs/consumers/design-slice.sdp.md` and `specs/consumers/spec-studio.slice-page.sdp.md` and adds `reviews/assets/plan47-prototypes/S-design-slice/`.
