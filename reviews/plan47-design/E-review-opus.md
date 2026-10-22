# Lane E review (epics and the capability map), Claude Opus

Reviewed `p47/e-epics` at `33147b4` (design `cc383e6`) against base `44e62ef`, with the lane's graph
queried through `sdp q`. Validation shows only the existing `honesty/gaps` warning on
`spec:model.spec-sections`. Readiness divergence (recipe 7) and the drift alarm (recipe 2) are both
empty. All 399 Specs that state `ready` still reach a `ready` floor. The three lane Specs state
`defined`, with floors at ready, defined and ready (recipe 9). I found no blocking defect in the
lane's commit.

The main gaps:

- The page design contradicts five ready Studio Specs and proposes no edit to them.
- The binding wording drifts from the ratified wording.
- Recipe 52 returns no summary.
- Two epic choices fail the lane's own `#epicHome` test.
- A glossary broadening is filed as a delegated ruling when it is the owner's decision.

## Findings, most severe first

1. **`spec:consumers.spec-studio.capability-map-page` (`#rule.page`, `#rule.filter`, `#rule.recipeData`)**
   - **Problem:** The page contradicts ready Studio Specs that the lane never proposes to edit:
     - `spec:consumers.spec-studio.lenses#rule.order` fixes the navigation order as Packs, architecture, tests, evidence.
     - `spec:consumers.spec-studio.index-page#rule.filters` closes the filter list.
     - `spec:consumers.spec-studio.data#rule.readerValues` says the index renders from `specs()`, `packs()`, `findings()` only.
     - `spec:consumers.spec-studio.data.recipe-answers#design.recipeEvaluations` names every evaluation a build runs, and recipe 52 is not on it.
     - `#design.pageRecipes` says "the index and the glossary render reader values only".
   - **Severity:** Should fix. It blocks the build and the page's `ready` statement.
   - **Change:** Make the page the fifth lens, add the dependency, and propose these edits:
     - In the page frontmatter, replace `refines: spec:consumers.spec-studio` with:
       ```yaml
       refines:
         target: spec:consumers.spec-studio.lenses
         reason: the Capabilities page is a lens that reads refinement
       ```
       Also add `dependsOn` on `spec:consumers.spec-studio.index-page`, with reason `the Epic filter extends the index's Specs filters`.
     - `lenses#rule.order`: `- rule: [#order] The lenses are pages of the page set, reached from the top navigation in the order Packs, capabilities, architecture, tests, evidence; the index page is the Packs lens and the default landing page.`
     - `lenses#design.lensPages`: add `capabilities.html for the capabilities lens`.
     - Change the title, narrative and outcome of `lenses` from "four" to "five", and add "by capability".
     - `index-page#rule.filters`: `- rule: [#filters] Filters narrow the Specs section by kind, altitude, stated rung, floor reached, implementation binding, verifier binding, Pack and epic; each filter takes one value or any, the epic filter also takes no epic, the filters combine, and the section says how many of its rows it shows. Without script every row shows.`
     - `data#rule.readerValues`: change "renders the index from `specs()`, `packs()`, `findings()` and each Spec's design columns" to "renders the index from `specs()`, `packs()`, `findings()`, each Spec's design columns and the epic memberships recipe 52 answers".
     - `recipe-answers#design.recipeEvaluations`: add "recipe 52 with `{ detail: true }`", which follows from finding 3.
     - `recipe-answers#design.pageRecipes`: replace "the index and the glossary render reader values only;" with "the index renders reader values and each Spec's `epicIds` from recipe 52; the glossary renders reader values only; the capabilities lens renders recipe 52;".
   - **Coordination:** Lanes R and S also add pages. Settle one top-navigation order at integration.

2. **`spec:consumers.spec-studio.capability-map-page#design.rowEvidence`**
   - **Problem:** It writes `present/absent`. The ready `spec:consumers.binding-language-views` says the binding lines "read present or none, and nothing else", and `#rule.aggregateColumns` extends that rule to the aggregate tables. The prototype also prints "absent".
   - **Severity:** Should fix.
   - **Change:** Add `dependsOn: spec:consumers.binding-language-views` and replace the entry with: `- rowEvidence: each row names kind and altitude, `stated <rung>`, `floor <rung>`, the implementation binding and the verifier binding as `present` or `none`, and open and blocking question counts with their text available. Facts that are absent stay absent; a folded branch's counts never become the parent's badges.`

3. **`spec:consumers.capability-map#design.mapRecipe` / `#design.mapAnswer`**
   - **Problem:** Without a parameter, recipe 52 returns every node row in full. On this corpus that is about 350 KB of JSON (`/tmp/plan47-E/protocol-head-map.json`). Yet the proposed upgrade-guide text tells adopters to run `recipes(52)` bare. The answer-shapes convention (`spec:consumers.agent-surface.answer-shapes`, `detailParameter`) returns a summary by default for answers this size.
   - **Severity:** Should fix.
   - **Change:**
     - Accept `["epic", "detail"]`.
     - Add this entry: `- mapDetail: recipe 52 reads `params.detail`, absent or `false` for the summary and `true` for the full answer; the summary keeps `input`, `totals`, `epics` as `{ id, title, parentEpicIds, rollup }`, `unreached.ids`, `cycles` and `damage`, and adds `leftOut`; `detail: true` adds `nodes`, `edges`, each epic's `descendantIds` and `unreached.roots`.`
     - The Studio evaluates `{ detail: true }`.

4. **Report section 3, decisions for the owner (glossary row `capability / domain`; `spec:consumers.capability-map#rule.epics`)**
   - **Problem:** The ratified glossary defines the Capability Map as a projection "over high-altitude `behavior` Specs". The design reads epics of every kind and promotes two `model` hubs and one `rule` hub to epic. The report files this as delegated and says "no owner-only decision was introduced". Broadening a ratified term is the owner's call.
   - **Severity:** Should fix, in the report and in the PR's rulings tables.
   - **Change:** List it as an owner decision. Question: "Is a capability epic any Spec at epic altitude, or only a behavior Spec?" Options:
     - (a) Any kind: ratify the proposed glossary row and the packs-lens narrative edit.
     - (b) Behavior only: wrap the core model, projections and check-family hubs in new behavior epics.

     Recommend (a), high confidence.

5. **`spec:extraction.example-runner` (now `altitude: epic`)**
   - **Problem:** It fails the lane's own `spec:protocol.capability-epics#rule.epicHome` test. Its outcome, "Run a generated contract's steps in authored order and make a red step name itself", names a feature, not a capability. Its epic reaches 4 Specs.
   - **The capability it should head is scattered:**
     - executable contracts sit under derivation;
     - step keys sit under the Markdown hub;
     - oracle eligibility and the unbound-example posture sit under the check families;
     - the example-realization posture sits under the core model.
   - **Severity:** Should fix. This is the weakest part of the example the owner asked for.
   - **Change:**
     - Recommended: no Spec owns "a bound example executes its Spec's own steps". So `#epicHome` admits a new epic, for example `spec:extraction.executable-examples` (behavior, epic, `defined`). Both the runner and `spec:extraction.executable-contracts` would refine it, the runner returning to `feature`.
     - Minimal alternative: return the runner to `altitude: feature` under `spec:extraction.derive-graph`, with reason `running a bound example executes the contracts the derivation emits`.
   - **Same issue, minor:** `spec:carrier.markdown-authoring` heads Gherkin and the TS import under a Markdown-only title. Either record in `#design.epicHome` why that hub stands for all carriers, or propose a title edit for the owner.

6. **`spec:protocol.capability-epics#design.epicHome`**
   - **Problem:** The base capture named design iteration as a capability. The lane authored no epic for it and gives no reason. Its features are split across projections (`design-diff`, `review-perspectives`), the agent surface (`context-bundle`, `pack-design`) and authoring (`readiness-planner`).
   - **Severity:** Should fix.
   - **Change:** Append to `#design.epicHome`: `Design iteration has no epic: no Spec owns that outcome, its features are views and reader recipes that refine the projection and agent capabilities, and its Pack already groups them for review.` Alternatively, author the epic under the `#epicHome` rule.

7. **`spec:observation.runtime-overlay` (new `refines: spec:consumers.projections-model`)**
   - **Problem:** The reason given ("a consumer view") contradicts the Spec's own intent and blocking question. Those are about an honest `observed` delivery fact, which `spec:model.core-model` defines and `spec:extraction.delivery-facts` withholds.
   - **Severity:** Should fix.
   - **Change:** Use:
     ```yaml
     refines:
       target: spec:extraction.derive-graph
       reason: an observed fact would be derived beside implemented and has-verifier
     ```
     In `#design.broadRoots`, change "run evidence and runtime observations refine projections" to "run evidence refines projections; runtime observations refine graph derivation, where delivery facts derive".

8. **Cross-lane, `spec:consumers.spec-studio.capability-map-page#design.disclosureOrder` and lane G's draft `spec:consumers.spec-studio.diagram-kinds.capability-tree#rule.multipleParents`**
   - **Problem:** The two lanes place a shared node by different rules, so the drawing and the complete text can put the same Spec under different parents:
     - E: first visit of a depth-first walk with children in id order.
     - G: "the first parent in supplied map order".
   - **Terms disagree too:** E says "unreached", G says "unplaced".
   - **Severity:** Should fix at integration.
   - **Change:** Keep E's first-visit walk, which ends on cycles and needs no extra answer field. Ask G to replace its placement sentence with "Place a node where the capability page's disclosure order first visits it (`spec:consumers.spec-studio.capability-map-page#design.disclosureOrder`)" and to use "unreached". Remove the traversal sentence from `spec:consumers.capability-map#rule.multipleParents`. The recipe answer has no occurrences, so traversal belongs to the page. Keep: `- rule: [#multipleParents] Every refining parent remains in the answer; a Spec appears once in nodes with all its parents, and a page decides where it expands.`

9. **`spec:consumers.capability-map#design.graphDiagnostics` / `#design.mapAnswer`**
   - **Problem:** `diagnostics` carries two shapes: `{ parameter, problem }` when a parameter is refused and no map is returned, and `{ code, from, to }` on a damaged but returned map. A consumer must test for `nodes` to tell a refusal from damage.
   - **Severity:** Should fix, for buildability.
   - **Change:** Rename the graph list to `damage` in `mapAnswer` and in the entry: `- graphDamage: `damage` lists `{ code: "unresolved-refinement", from, to }` for a missing or non-Spec endpoint touching the selected scope, or every such edge in whole-corpus scope.` Keep `{ diagnostics }` for parameter refusals only, as recipes 46 and 53 do.

10. **`spec:consumers.capability-map#rule.evidenceKinds` and `capability-map-page#design.disclosureOrder` ("Evidence kinds fold")**
    - **Problem:** "Evidence kinds" calls decisions evidence, and it collides with the Evidence lens and run evidence.
    - **Severity:** Minor.
    - **Change:** Rename the key to `#examplesAndDecisions`, and in `disclosureOrder` write "Examples and decisions fold through native disclosures".
    - **New terms to flag:** "rollup", "unreached", "repeat" and "nested epic". Add them to the report's vocabulary list, or keep them as plain words with no glossary row.

11. **`spec:consumers.spec-studio.capability-map-page` (overview cards)**
    - **Problem:** The overview gives no sign that the agent epic sits inside projections. The prototype shows a card with 47 descendants beside a card with 175 that already includes those 47. One generic sentence ("Epic scopes can overlap") does not prevent a reader from adding them.
    - **Severity:** Minor.
    - **Change:** Add `- nestedEpics: a card for an epic that refines another epic says `Inside <title>`, and a card whose descendants include an epic names it, so overlapping counts read as overlap.` This uses `parentEpicIds` from finding 3.

12. **`spec:consumers.engine-provenance` (new `refines: spec:consumers.authoring-on-ramp`)**
    - **Problem:** `sdp --version` is a command-line answer, not part of moving a Spec from intent to evidence. Its title starts "The CLI names…".
    - **Severity:** Minor.
    - **Change:** Use `refines: { target: spec:consumers.command-line, reason: the version flag is one more answer the command line gives an adopter }`.

13. **Four new `refines` plus `dependsOn` pairs to one target**
    - **The pairs:** `build-pipeline → derive-graph`, `corpus-rules → agent-surface`, `architecture-constraints → corpus-rules` and `external-registers → corpus-rules`.
    - **Problem:** The corpus had no such pair before. Three of these new parents were chosen from an existing dependency, which `capability-epics#rule.refinement` says is not enough on its own.
    - **Severity:** Minor.
    - **Change:** Either drop the now-redundant `dependsOn` (moving its reason onto the `refines`), or note in `#design.corpusChecks` that both relations hold on purpose.
    - **Owner review:** Placing corpus rules under the agent epic also leaves `validate --rules` out of the validation epic. List that with `#design.nestedEpic` for the owner's review.

14. **`spec:protocol.capability-epics` (`#rule.preserveEvidence`, `#rule.reviewHomes`, `#design.epicHome`, `#design.broadRoots`)**
    - **Problem:** Three overlaps:
      - `preserveEvidence` restates the readiness floor's law.
      - `reviewHomes` is a review procedure, which belongs in the upgrade guide.
      - The two Design entries re-describe, without ids, the parents the `refines` edges and their reasons already state. That is a second owner that will drift.
    - **Severity:** Minor.
    - **Change:**
      - `preserveEvidence` becomes `- rule: [#preserveEvidence] A re-altituded hub keeps its readiness statement when its content still supports it; reparenting confers no delivery fact and adds no anchor.`
      - Drop `reviewHomes` and `broadRoots`.
      - Cut `epicHome` to the ruling and its reason.

15. **`spec:consumers.capability-map#rule.damagedGraph` and `#design.unreachedRoots`**
    - **Problem:** Both entries state the cyclic-root rule. "Source strongly connected components" is jargon for outsiders.
    - **Severity:** Minor.
    - **Change:** Keep the rule in `unreachedRoots` only, worded: `- unreachedRoots: a root is an unreached Spec with no unreached parent; a group of unreached Specs that refine one another in a cycle, with no unreached parent outside the group, uses its smallest id as its root. Reach may overlap between roots; unreached.ids stays unique and complete. In an epic selection both lists are empty.`

16. **`spec:consumers.spec-studio.capability-map-page#rule.links`**
    - **Problem:** "Its Intent section" is not an element id. The Spec page's id is `section.intent` (`spec:consumers.spec-studio.spec-page.core#rule.sections`), and the prototype links to `#intent`, which does not exist.
    - **Severity:** Minor.
    - **Change:** Write "unkeyed questions link to the Spec page's `section.intent`".

17. **Proposed upgrade-guide text**
    - **Problem:** Three issues:
      - The text runs `recipes(52)` bare (see finding 3).
      - The guide's other sections run shipped files.
      - The section sits beside "Choose capabilities to adopt", which uses "capability" in another sense, a Protocol capability.
    - **Severity:** Minor.
    - **Change:**
      - Use the form `pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/52-<slug>.js)" --json`, which returns the summary.
      - Open the section with "Here a capability is one of your corpus's own intended outcomes, not a Protocol capability that capability adoption counts."

18. **Missing proposal for `.agents/skills/sdp-studio/SKILL.md`**
    - **Problem:** The skill's page table gains no row for the new page.
    - **Severity:** Minor.
    - **Change:** Add `| Read the corpus capability by capability, then narrow the Specs to one epic | `capabilities.html`, the capabilities lens (recipe 52) |`.

19. **Prototypes**
    - **Problems:**
      - No screenshot shows the index's Epic filter. Only the HTML and the browser check exercise it.
      - On the platform, the branch drawing shows the first 6 of 51 children by id, with nothing saying which 6 or why.
      - The cards print "1 decisions" and "Read 1 questions".
    - **Severity:** Minor.
    - **Change:** Add an index screenshot with one epic selected. Caption the drawing with "first six children by id; the rest are folded".

20. **Proposed Pack insertion of eight ready hubs into `pack:roadmaps-and-slices-v1`**
    - **Problem:** Their only change is altitude and parentage, which the design diff (recipe 35) from the arc's base already shows. As members they would add eight large ready rows to the arc's Pack design.
    - **Severity:** Minor.
    - **Change:** Leave them out, and cite recipe 35's answer in the PR instead.

## Owner review items the report should list apart from defects

- The projections epic reaches 175 of 421 Specs, including the nested agent epic. "Filtering only shows one epic" partly returns as "one epic holds four Specs in ten". The owner should decide whether the Spec Studio (57 descendants) or the human views become their own epic.
- 19 ready Specs had their altitude or parent changed while keeping the owner's earlier `ready` statements. List them in the delegated rulings table so the owner reviews the new coordinates.

## Good, and should not change

- `#graphOnly`, `#nodeEvidence` and `#rollup` read only declared `refines`. Each Spec keeps its own stated rung, floor and facts. No value rises from a child to its parent, and the map gives no percent, inherited fact or work order. Binding counts are worded as existence, not as passing tests.
- Multiple parents, nested epics, skipped altitudes and cycles are kept rather than flattened into a tree. The answer holds each Spec once. The unreached section is always present, including on a corpus with no epics or an empty corpus.
- Enriching hubs in place preserves ids, kinds, bindings and every ready floor. Every new `refines` carries a reason, and the run added no warning and changed no delivery fact.
- Recipe 52's contract is in keyed Design entries with stable ordering and an explicit selection scope, and its probes cover a diamond, a cycle, an unresolved endpoint, an empty corpus and invalid parameters.
- The prototypes were run on the base, the head and the platform at both widths. The phone layout uses the complete text instead of shrinking labels, and the platform's intent was left untouched.
