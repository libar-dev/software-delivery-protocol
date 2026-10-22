# Lane S, answer: the review of the design slice and its page

I fixed all six of sol's findings, with two deliberate departures that I explain and argue for in section 10. The fixes are commit `753494f` on `p47/s-slices`, on top of `fe1d7e5`, based on `44e62ef`.

**What changed in the design:**
- **Recipe 54 still decides the order and the drawings only read it.** The slice keeps its ordering rules. Each relation between two members now says whether it orders. The slice page draws both pictures from the answer and computes no depth or scope of its own. It uses lane G's element ids. I propose to G, as exact text, a mode of its dependency drawing that takes the order from the page.
- **The architecture part of the answer now gives G's scoped drawing everything it asks for:**
  - every member component design as its own row, separate from the component that realizes it;
  - the unit edges behind each `uses` count;
  - planned uses;
  - the components one step outside the slice;
  - unreadable declarations.
- **An example member folds into its parent only when nothing is lost.** That means its `refines` to the parent is its only relation of the four types. A folded example stays readable in a disclosure inside its parent's row, and folding gives the parent none of its rung, holds or bindings.
- **The refused inputs are written down.** A keyed Design entry gives each one's message, the order the checks run in, and how failures add up. `detail: null` is refused.
- **On a phone, each member's row stacks.** The title, rung, floor and next rung stay together at the top.

**A test corpus, the slice probe.** `make-probe.mjs` writes a throwaway copy of the platform corpus with a probe Pack that covers each case above. On it, the slice's design totals equal recipe 43's: 5 designs, 3 realized, 1 matching, 2 unrealized, 2 differing rows and 1 unreadable row.

**Checks.**
- On seven Packs, the slice's boundary for a whole Pack equals the Pack's own boundary.
- `validate` reports 0 errors and the one expected warning (`honesty/gaps` on `spec:model.spec-sections`).
- `check:temporal`, lint over the prototype scripts, `git diff --check` and recipe 2 (no drift alarms) are clean.

## 1. Specs created or changed

No new Spec ids. I re-ran recipe 9 at `753494f`.

| Spec | Stated | Floor (recipe 9) | What the next rung needs |
| --- | --- | --- | --- |
| `spec:consumers.design-slice` (behavior, feature) | `defined` | `ready` | Nothing blocks; it waits for the owner's statement. |
| `spec:consumers.spec-studio.slice-page` (behavior, story) | `defined` | `defined` | `ready` is held by the typed-dependency clause. In this worktree `spec:consumers.spec-studio.diagram-kinds` states `idea`; G's branch states it `defined`. |

**What `spec:consumers.design-slice` gained in this round:**
- Rules:
  - `#restsOn` now says whether each relation orders.
  - `#depth` gives its reason for starting at 1.
  - `#examplesFold` adds the fold condition and says folding lends nothing.
  - `#touchedComponents` counts anchored components only.
  - New `#componentDesigns`.
  - `#touchedUses` adds the unit edges and keeps planned uses separate.
  - New `#outsideNeighbors`.
  - `#notDownstream` adds a clause about outside neighbors.
- Design entries:
  - New `sliceDiagnostics`, `componentSummary`, `designRow`, `plannedUse` and `outsideRow`.
  - Reshaped `sliceRecipe`, `sliceTotals`, `memberRow`, `structureShape`, `componentRow`, `componentUse` and `architectureShape`.
- Example space: new slots for the component-design cases, the example that does not fold, and the outside components.

**What `spec:consumers.spec-studio.slice-page` gained in this round:**
- Rules:
  - `#dependencyDrawing` is replaced: the page consumes the answer, and the drawing kind owns layout, folding and the text.
  - `#exampleRows` is replaced: folded examples go in a disclosure, and folding lends nothing.
  - `#architecture` is reshaped.
  - New `#designs` and `#outside`.
  - `#unplacedAndDiffering` becomes `#unplaced`.
  - `#noArchitecture` now also requires that the slice hold no component design.
  - `#summary` adds the sentences on designs and outside components.
- UI entries:
  - `drawingIds` now uses `.dependency.*` and `.scoped-architecture.*`.
  - `memberTable` says "verifying examples" and adds the phone layout.
  - New `foldedExamples`, `designTable` and `outsideList`.
  - `componentTable` loses its "Anchored or planned" column.
- Two new manual verification items: reading the design rows, and reading the page on a phone.

**Pack manifest:** nothing to add.

## 2. Rulings I made on delegation

| Ruling | One line | Carrying entry |
| --- | --- | --- |
| A slice is a reading | It is composed on each run and never authored, saved or committed. It adds no grouping, kind, stage or gate. | `spec:consumers.design-slice#rule.readingNotArtifact` |
| Three scopes | A Pack, a Pack narrowed by `members`, or an ordered `specs` list. The parameters mirror the context bundle's. | `#rule.scope`, `#design.sliceRecipe` |
| Rests-on inside the slice | The four typed relations, with the statement queue's exception. Every relation carries `orders`, so a drawing can tell an ordering link from a relation that orders nothing. | `#rule.restsOn`, `#design.structureShape` |
| Depth starts at 1 | It matches the statement queue's rounds. Members in a cycle share one depth. Nothing is refused. | `#rule.depth` |
| Examples fold only losslessly | An example folds only when its `refines` to the parent is its only relation of the four types, in either direction, inside the slice or across its boundary. Folding lends the parent nothing. | `#rule.examplesFold`, `slice-page#rule.exampleRows` |
| Touched means anchored | Touched components are anchored ones, reached three ways and never merged: the members' code, the code of what the slice rests on, or a member design that names the component. | `#rule.touchedComponents` |
| Designs are their own rows | Each row carries the values the design declares, whether an anchor exists, and whether the design is realized. Recipe 43's differing and unreadable rows are attached. A declared value never stands in for an anchored one, or the reverse. | `#rule.componentDesigns`, `#design.designRow` |
| Uses keep their evidence | Each anchored pair carries its unit edges. Planned uses are listed apart and never added to an anchored count. | `#rule.touchedUses`, `#design.componentUse`, `#design.plannedUse` |
| One step outside | A component reached in one step is listed as outside: one that uses a touched component, one a touched component uses, or one a member design plans to use. It is counted separately and reaches no further. | `#rule.outsideNeighbors`, `#design.outsideRow` |
| Downstream code excluded | Code of Specs that rest on the slice belongs to design-change impact. | `#rule.notDownstream` |
| Diagnostics pinned | Checks run in a fixed order and every failure is kept. A check that needs a value that failed earlier is skipped. Lists must be non-empty. An unresolved id is its own `scope`, as in the context bundle. | `#design.sliceDiagnostics` |
| Questions in scope | The members' questions, those of the decisions in scope, and the blocking questions of outside Specs that hold a member. | `#rule.questionsInScope` |
| Rule count beside the design columns | Kept outside the design columns, so the glossary term keeps its meaning. | `#rule.memberColumns`, `#design.memberRow` |
| Summary by default | `detail` works as it does for Pack design. A summary keeps every total and adds `leftOut`. | `#design.sliceDetail` |
| No design verdict | No over- or under-designed flag, no ratio and no finding. | `#rule.noDesignVerdict` |
| A separate slice page per Pack | Two readings in two orders. | `slice-page#rule.slicePerPack` |
| The drawings consume the answer | Layout, folding and the full text version belong to G's drawing kinds. | `slice-page#rule.dependencyDrawing`, `#rule.architecture` |
| Phone rows stack | Title, rung, floor and next rung stay together. The counts follow as labelled runs that wrap, not in a disclosure. | `slice-page#ui.memberTable` |
| The Pack export is unchanged | A provisional answer to a non-blocking question. | `slice-page#question.exportCarriesSlice` |

## 3. Decisions for the owner

Unchanged from the design report.

1. **Should `design slice` join the glossary?** (`spec:consumers.design-slice#question.sliceTerm`)
   - Options:
     - (a) a guidance-only label beside design pass, design diff and design backlog;
     - (b) a full glossary row;
     - (c) rename the reading.
   - I recommend (a). The text is in 5.1. Confidence: high.
2. **Should the guidance on design rounds go into the skill and the on-ramp?** The text is in 5.2 and 5.3. I recommend adopting it. Confidence: medium-high.

## 4. Prototypes

All files are under `/tmp/plan47-wt/S/reviews/assets/plan47-prototypes/S-design-slice/`. The README there has the commands. Re-run the scripts rather than quoting these numbers.

| Path | What it shows |
| --- | --- |
| `slice-recipe.mjs` | The draft body of recipe 54, including the diagnostics, the fold condition, the design rows, the unit edges, planned uses and outside components. |
| `make-probe.mjs` | Writes the slice probe to `/tmp/plan47-platform-S`. It never edits `/tmp/plan47-platform`. |
| `build-slice-pages.mjs` | Writes five pages and checks seven Packs' boundaries against their own. The drawings consume the answer; the dependency drawing folds in the order proposed in 5.14. |
| `protocol/roadmaps-and-slices-v1.html` | 14 members and 6 components touched, all through what the slice rests on, plus 6 outside components. |
| `protocol/spec-studio-v1.html` | 63 members with 23 examples folded. The drawing folds the boundary and four depth bands to fit the bound. |
| `platform/history-view.html` | 19 members with 5 examples folded, and 9 components. |
| `platform/application.html` | 54 members. 32 of its 33 examples fold; one has its own `dependsOn` and keeps its own row and box. |
| `probe/slice-probe.html` | Five member designs, one held example folded into its parent, and one example that does not fold. |
| `answers/*.summary.json`; `answers/protocol-roadmaps-and-slices-v1.json`, `answers/probe-slice-probe.json` | The summary answer for each Pack, plus two full answers. |
| `screenshots/*-top.png`, `*-dependencies.png`, `*-members.png`, `*-architecture.png` | Each page at 1440 wide; the member tables have their folded examples opened. |
| `screenshots/probe-slice-probe-architecture.png`, `probe-slice-probe-designs.png` | Planned components, realization links, the design table and the outside list. |
| `screenshots/protocol-roadmaps-and-slices-v1-phone-members.png`, `probe-slice-probe-phone-members.png`, `platform-history-view-phone-*.png` | Phone width (390): members with unmet clauses, and a held folded example. |

Answer sizes in UTF-16 code units:

| Pack | Full | Summary |
| --- | --- | --- |
| Arc Pack | 36,663 | 20,375 |
| Studio Pack | 109,847 | 58,755 |
| History view | 128,633 | 43,724 |
| Application | 147,263 | 64,233 |
| Probe | 63,715 | 25,613 |

## 5. Proposed edits to files I may not edit

Items 5.1 to 5.5 and 5.7 to 5.12 are unchanged from the design report. I repeat them here so this report stands alone.

**5.1 `CONTEXT.md`, line 245, the "Guidance-only labels" paragraph.**

Replace `` `design pass`, `design diff`, `design backlog` and `curation report` name a design activity or a recipe's answer, `` with:

> `` `design pass`, `design diff`, `design backlog`, `design slice` and `curation report` name a design activity or a recipe's answer, ``

Then append:

> A design slice is the design slice recipe's reading of a set of Specs as one design, composed on each invocation; it is never the saved AI slice the context bundle replaced.

**5.2 `.agents/skills/sdp-authoring/SKILL.md`: a new subsection after "### How much to write"** (before "### Key a step or a term"):

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

**5.4 `.agents/skills/sdp-sessions/SKILL.md`, line 72.** Replace `For a Pack, read Pack design (recipe 29).` with:

> For a Pack, read Pack design (recipe 29) member by member and the design slice (recipe 54) as one whole: how the members rest on each other, the architecture they touch, and the decisions and questions in scope.

**5.5 `.agents/skills/sdp-agent-surface/SKILL.md`, the task sheet: a new row after "Review a Pack":**

> `| Read a Pack or a set of Specs as one design | the design slice (recipe 54) |`

**5.6 `docs/agent-surface/recipes.md`:**
- Index row: `| 54 | The design slice | pack or specs, members, detail | Read a set of Specs as one design |`.
- Line 167: replace `Changed-file impact, Pack design and the design diff, recipes 4, 29 and 35, accept` with `Changed-file impact, Pack design, the design diff and the design slice, recipes 4, 29, 35 and 54, accept`.
- In the same paragraph, replace `Pack design also accepts member ids in` with `Pack design and the design slice also accept member ids in`.
- Catalog entry `## 54. The design slice`:
  - when-you-need-it line: "you are reviewing features that must be reviewed together and want the whole at once";
  - body: the statements of `designSlice` in `slice-recipe.mjs` at `753494f`;
  - prose restating the Design entries, including the diagnostics table;
  - the law is `spec:consumers.design-slice`.

**5.7 `spec:consumers.agent-surface.answer-shapes`:**
- First rule: `Changed-file impact, Pack design and design diff, recipes 4, 29 and 35,` becomes `Changed-file impact, Pack design, design diff and the design slice, recipes 4, 29, 35 and 54,`.
- `#design.detailParameter`: `recipes 4, 29 and 35 read` becomes `recipes 4, 29, 35 and 54 read`, and `recipe 29's detail may also be` becomes `recipe 29's and recipe 54's detail may also be`.

**5.8 `spec:consumers.spec-studio#rule.staticPageSet`:** `one page per Pack and per Spec;` becomes `one page and one slice page per Pack, one page per Spec;`.

**5.9 `spec:consumers.spec-studio.publisher#rule.pageSet`:** `one \`packs/<name>.html\` per Pack,` becomes `` one `packs/<name>.html` and one `slices/<name>.html` per Pack, ``.

**5.10 `spec:consumers.spec-studio.data.recipe-answers`:**
- `#design.recipeEvaluations`: `recipe 29 with \`{ pack: id }\` for every Pack;` becomes `` recipe 29 with `{ pack: id }` and recipe 54 with `{ pack: id, detail: true }` for every Pack; ``.
- `#design.pageRecipes`: after `a Pack page renders the totals of its recipe 29 answer and, given a base graph, its own recipe 35 answer;` insert `a slice page renders its Pack's recipe 54 answer;`.

**5.11 `spec:consumers.spec-studio.pack-page`:**
- `#rule.header`: `its id and its carrier file as text with a copy action, then the summary;` becomes `its id and its carrier file as text with a copy action, and a link to the Pack's slice page, then the summary;`.
- `#ui.headerBlock`: `the id and the carrier file, each with a copy action;` becomes ``the id and the carrier file, each with a copy action, and the link `Read this Pack as one design` to its slice page;``.

**5.12 `spec:consumers.spec-studio.data#rule.noSlices`:** append `A slice page renders the design slice's answer into its markup, as every page renders its values, and embeds no slice data.`

**5.13 Self-hosting oracle, at integration (changed):**
- Both Specs move from `idea` to `defined`, with the relations, sections and keys above, including the new rule and Design keys of this round.
- The example space adds one space-contract module. Its vocabulary now has three `Given` lines and six `Then` lines.

**5.14 For lane G, `spec:consumers.spec-studio.diagram-kinds.dependency` (new): the order a page supplies.**

- `#rule.declaredOnly`: after `Refinement belongs to the capability tree,` insert `unless the page supplies the order under #suppliedOrder,`.
- A new rule after `#declaredOnly`:

  > `- rule: [#suppliedOrder] A page may supply the order with its scope, as the design slice's answer gives it: each Spec's depth and the members folded into it, the edges between Specs with their type, reason and whether each orders, the cycles, and the boundary rows with the members each holds. The drawing then draws every supplied edge, refinement included, keeps each edge's type and direction, draws an edge that orders nothing apart from one that orders, shows on each box the count of members folded into it, and labels the bands with the supplied depths; it recomputes no scope, depth or cycle. Above the shared bound it folds the boundary first, keeping as its own box each boundary Spec that holds a member, then whole depth bands as #fold orders them, then keeps only the text, which lists every folded member and its edges.`

- `#design.inputs`: append `; a page may also supply \`order\` as #rule.suppliedOrder reads it`.
- Suggested, not required: in `#rule.depth`, `has depth zero` becomes `has depth one`. Both the statement queue's rounds and the slice start at 1, so every depth label in the Studio would read the same way.

**5.15 For lane G, `spec:consumers.spec-studio.diagram-kinds.scoped-architecture#rule.scopeInput` (new).** Replace its first sentence with:

> `Read the design slice's \`architecture\` answer: \`components\` with how the slice reaches each, \`designs\` with their declared values, realization and comparison rows, \`uses\` with the unit edges behind each count and its outside mark, \`plannedUses\`, \`outside\` and \`unplaced\`; recompute none of them.`

The rest of that rule and the kind's other rules already match the answer. If another page needs the drawing for a set of Specs, it runs recipe 54 with `specs`.

**5.16 My own Specs, once G's children merge (new):**
- In `spec:consumers.spec-studio.slice-page`, retarget the `dependsOn` on `spec:consumers.spec-studio.diagram-kinds` to `spec:consumers.spec-studio.diagram-kinds.dependency` and `spec:consumers.spec-studio.diagram-kinds.scoped-architecture`, keeping the same reason.
- In `#rule.dependencyDrawing`, change the prose mention to the `.dependency` child.

## 6. What the build needs, in order

1. **Recipe 54.**
   - The catalog entry and shipped body (5.6), plus the edits in 5.7.
   - Recipe-check coverage in `test/recipes.test.ts`, and the document-realization anchor.
   - Probe-corpus example children that bind the example space. `make-probe.mjs` is a working template for the five design cases and both example cases.
   - Tests that:
     - a whole Pack's boundary equals the Pack's own;
     - the design totals equal recipe 43's;
     - each `#design.sliceDiagnostics` row fires in the stated order, with failures accumulating;
     - the summary, `detail: true` and a `detail` list each have their documented shape;
     - `orders` is false only for a `refines` the target names back;
     - an example with any other typed relation does not fold;
     - `inPack` appears on a narrowed slice.
   - Two choices for the build:
     - Read the Design keys through recipe 43's grammar, as the prototype does, or extend recipe 43 with a full list of designs. The second would change a `ready` Spec.
     - Count rules directly, rather than calling rule coverage once per member, which costs about 5 seconds on a 421-member Pack.
2. **Lane G's drawing kinds, with 5.14 and 5.15 applied**, before the page can state `ready`.
3. **The slice page.**
   - `src/projections/studio/pages/slice-page.ts`, with recipe 54 run once per Pack (5.10), the page-set edits (5.8, 5.9) and the Pack page link (5.11).
   - Tests for: the sections; the folded-example disclosure; the design table's wording; the outside list; empty sections; `#bindingWords`; links that resolve; determinism; and the stacked layout at 390 wide.
   - Then 5.16, `generate:self-hosting` and `check:self-hosting`.
4. **Skills and glossary:** 5.1 to 5.5 and 5.12, plus the skills test.
5. **Oracle:** 5.13.

**What I need from other lanes:**
- **Lane G:** 5.14 and 5.15. Without the supplied order, the dependency drawing would compute its own depths and leave out refinement. The slice page would then show two different orders for the same members.
- **Lane E and lane R:** unchanged. A capability-map epic and a roadmap entry that is a Pack link to the slice page. Recipe 54's `specs` scope also reads an epic's refinement subtree or a roadmap's selected set.

## 7. Changes to my brief

**Added in this round:**
- The `orders` mark on relations.
- The lossless fold condition for examples.
- Design rows kept separate from component rows.
- Unit edges behind each `uses` count.
- Planned uses and outside components.
- Pinned diagnostics.
- A probe corpus, so planned components have evidence before any corpus holds one.

**Reshaped:**
- "Planned" is no longer a flag on a component row. A planned component is a design row whose `realized` is false.
- The slice page no longer prescribes how its drawings are laid out or folded. That belongs to G's kinds, and my proposal to G is in 5.14.

**Kept and dropped:** as in the design report.

## 8. Risks and open questions

- **G must agree.** The page's `ready` waits on G accepting 5.14 and 5.15, or on an equivalent. If G keeps depth starting at zero for its own mode, the same word will read one apart on different Studio pages.
- **Size:** this round's additions, mostly the unit edges, add about 23 percent to full answers (the arc's Pack went from 29,761 to 36,663 units). Summaries drop the unit edges.
- **Duplicated grammar:** the body repeats recipe 43's Design-key grammar. If the build keeps it that way, a test should pin the two together.
- **The architecture stand-in is cluttered:** edges cross boxes. G's obstacle routing is the fix, so the stand-in is not evidence about legibility.
- **`holds` on a question** still describes what the question's Spec holds, not the question alone. The Design entry says so.
- **Owner questions:** `#sliceTerm`, and whether the build's export follows `#exportCarriesSlice`.
- **A slip I made, now reverted:** one `validate` run wrote a `generated/` folder into the shared platform copy at `/tmp/plan47-platform`, which had none before. I removed it at once; that copy is back to its original state. All later runs use the probe copy.

## 9. Commit

`753494f` on `p47/s-slices`: "design: answer the slice review: supplied order, separate designs, folded examples". It sits on top of `fe1d7e5`, based on `44e62ef`. It changes `specs/consumers/design-slice.sdp.md` and `specs/consumers/spec-studio.slice-page.sdp.md`, and refreshes `reviews/assets/plan47-prototypes/S-design-slice/`: the scripts, the pages and every screenshot, plus the new probe page, answers and captures.

## 10. Review findings and their dispositions

Reviewer: sol (relay job `mvj6f9dg-d9e7ce8c`). All six findings were fixed in `753494f`.

| # | Finding | Disposition |
| --- | --- | --- |
| 1 | **Blocking.** Lanes S and G define dependency drawings that conflict on edges, depths, folding and element ids. | **Fixed.** `#rule.dependencyDrawing` now consumes the answer. Recipe 54 keeps the ordering rules, and each structure edge carries `orders`. `#ui.drawingIds` uses `.dependency.text` and `.dependency.arrow`. The mode G needs to take a supplied order, with `refines` and the ordering mark, is proposed in 5.14. **Partly kept as it was:** depth still starts at 1. The reviewer agrees recipe 54 should own the ordering rules, and 1 matches the statement queue's rounds. I suggest G start at 1 too (5.14). |
| 2 | **Blocking.** Recipe 54 cannot supply G's scoped architecture: designs and components are merged, there are no outside neighbors or unit edges, and unreadable rows are missing. | **Fixed.** New `#rule.componentDesigns` and `#rule.outsideNeighbors`. `#rule.touchedUses` now carries unit edges. Each addition has a keyed row shape, an ordering rule and a summary form: `designRow`, `componentUse.units`, `plannedUse` and `outsideRow`. Planned values are kept apart from anchored ones. The ids use `.scoped-architecture.*`. G's input text is proposed in 5.15. |
| 3 | **Should fix.** The prototype loses component designs or labels them wrongly: an anchor that does not satisfy its design, a matching design dropped, planned uses dropped. | **Fixed.** The body lists every member design under the planned-architecture convention, takes realization from the anchored `satisfies`, keeps declared uses, and attaches recipe 43's rows separately. The probe covers all five cases, and its totals equal recipe 43's. Planned-component captures: `probe-slice-probe-architecture.png` and `probe-slice-probe-designs.png`. |
| 4 | **Should fix.** Folding examples unconditionally hides an example's readiness and its relations. | **Fixed, with one change** that I argue is better than the proposed text. I adopted the disclosure and its text, the rule that folding lends nothing, separate folded and verifying counts, and a text version that lists every folded example. I also fold an example only when its `refines` to the parent is its only relation of the four types. An example with its own dependency therefore keeps its own row and box, and the picture drops no relation, not just the text. The probe covers both cases, and the platform's application Pack shows the second in real data. |
| 5 | **Should fix.** The refusals are left to prototype code, `detail: null` is accepted, and there is no component summary shape. | **Fixed.** `#design.sliceDiagnostics` gives every check with its scope value, message, order and skip rule, and says failures accumulate. `detail: null` is refused. `#design.componentSummary` is now explicit. An unresolved id is reported as its own `scope`, as the context bundle does, because the slice mirrors the bundle's parameters. |
| 6 | **Should fix.** At phone width the table hides the next-rung answer, with no cue. | **Fixed, partly in another form.** Below the phone breakpoint, each member is a stacked block: title, id, kind, rung, floor and next rung with each unmet clause stay together, and nothing scrolls sideways. **Not adopted:** a disclosure for the counts. It would hide the counts the reading note promises beside each rung, and it would need either a second copy of the cells or a script. The counts follow instead as labelled runs that wrap. New phone captures show unmet clauses: the arc's Pack, and the probe with a held folded example. |
