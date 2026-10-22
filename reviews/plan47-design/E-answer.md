Lane E's review response is complete on `p47/e-epics`. All 20 Opus findings have a disposition below. Corrections within the lane are committed; changes to shared Studio contracts, lane G and the glossary are exact integration proposals, with owner decisions kept open.

The revised design has nine epics reaching all 423 Protocol Specs. Seven existing hubs retain epic altitude, a new executable-examples epic replaces the runner as a capability owner, and self-hosting remains an epic. All 399 previously ready Specs still state and reach `ready`. Validation reports zero errors and exactly the existing `honesty/gaps` warning on `spec:model.spec-sections`. No engine or product test files changed, and no platform intent changed.

1. Specs created or changed

Recipe 35 from `44e62ef` reports two added Specs, 23 changed Specs, no removed Specs, no Pack changes and no binding changes. Recipe 9 was run for all 25 added or changed Specs, with no current-floor failure.

| Spec ID after `spec:` | Stated rung | Floor reached | Current design |
| --- | --- | --- | --- |
| `consumers.capability-map` | defined | defined | Recipe 52 defaults to a summary, accepts `detail`, separates `damage` from refusal diagnostics and preserves all refinement edges |
| `consumers.spec-studio.capability-map-page` | defined | defined | Capabilities is a lens; the page reads full detail, uses binding language, names nested epics and specifies correct question links |
| `protocol.capability-epics` | defined | defined | Records outcome ownership, the executable capability, carrier rationale and deliberate relation pairs |
| `consumers.capability-map.epic-kinds`, new | scoped | scoped | Owner decision on admitting every kind at epic altitude |
| `extraction.executable-examples`, new | defined | ready | An example executes its authored intent through graph-derived contracts and reports failures in its steps' words |
| `observation.runtime-overlay` | idea | idea | Refines graph derivation, where an observed fact would derive |

The capability map and epic-organization floors now wait on the scoped capability-kind decision. The page's ready floor waits on lane G's diagram design, which still states `idea` here. The new executable epic has no implementation or verifier binding and makes no new `ready` statement.

The following 19 changed Specs each retain stated/floor `ready/ready`. This table also identifies every existing ready coordinate change for the owner's review. IDs omit `spec:`.

| Spec | Altitude now | Direct refinement parent now |
| --- | --- | --- |
| `carrier.markdown-authoring` | epic | none |
| `consumers.agent-surface` | epic | `consumers.projections-model` |
| `consumers.authoring-on-ramp` | epic | none |
| `consumers.engine-provenance` | story | `consumers.command-line` |
| `consumers.projections-model` | epic | none |
| `extraction.build-pipeline` | feature | `extraction.derive-graph` |
| `extraction.derive-graph` | epic | none |
| `extraction.determinism` | feature | `extraction.derive-graph` |
| `extraction.example-runner` | feature | `extraction.executable-examples` |
| `extraction.executable-contracts` | feature | `extraction.build-pipeline`, `extraction.executable-examples` |
| `model.core-model` | epic | none |
| `model.planned-architecture` | feature | `model.core-model` |
| `observation.run-evidence` | feature | `consumers.projections-model` |
| `validation.architecture-constraints` | feature | `validation.corpus-rules` |
| `validation.corpus-rules` | feature | `consumers.agent-surface` |
| `validation.duplicate-ids` | feature | `validation.two-check-families` |
| `validation.external-registers` | story | `validation.corpus-rules` |
| `validation.readiness-floor` | feature | `validation.two-check-families` |
| `validation.two-check-families` | epic | none |

The existing epic owners retain their titles, kinds and outcomes. The carrier hub owns authoring into one graph; the core model owns the enrichable Spec; derivation owns the carrier-neutral graph; the check-family hub owns conformance and honesty; projections owns consumer views; the agent hub owns scripted graph access; the authoring on-ramp owns moving a Spec from intent to reviewed evidence. Their content already states those outcomes. The new behavior epic, `extraction.executable-examples`, owns execution against authored intent; the runner and contract generation each own a narrower part. Contract generation keeps its genuine build-pipeline refinement as well.

Self-hosting remains unchanged at `ready/ready`. Its ten descendants concern the Protocol's own delivery practice and identity. Design iteration remains grouped by its Pack: its views and reader recipes refine their existing capabilities, and no existing Spec owns a separate enduring outcome for it. The carrier title continues to name the default Markdown entry, while its existing rule and carrier ruling establish the shared path for the other carriers.

Every base feature with no feature parent, or with self-hosting as a catch-all parent, has the following epic home. IDs omit `spec:`; an entry matching its epic was enriched in place.

| Epic home | Base features |
| --- | --- |
| `carrier.markdown-authoring` | `carrier.markdown-authoring`, `decisions.prose-ownership` |
| `consumers.authoring-on-ramp` | `consumers.authoring-on-ramp` |
| `consumers.projections-model` | `consumers.projections-model`, `consumers.spec-studio.diagram-kinds`, `observation.run-evidence` |
| `consumers.agent-surface`, also projections | `validation.architecture-constraints`, `validation.corpus-rules` |
| `extraction.derive-graph` | `extraction.build-pipeline`, `extraction.derive-graph`, `extraction.determinism`, `observation.runtime-overlay` |
| `extraction.executable-examples` | `extraction.example-runner` |
| `model.core-model` | `carrier.markdown-pack-authoring`, `decisions.checked-mentions`, `decisions.pack-reified`, `model.core-model`, `model.planned-architecture` |
| `protocol.self-hosting` | `decisions.adopt-the-nouns`, `decisions.concept-docs-dissolve`, `decisions.executable-meta-model`, `decisions.plain-language-references`, `decisions.protocol-naming`, `protocol.capability-epics`, `protocol.roadmap-replaces-plans`, `protocol.role-vocabulary`, `protocol.significant-units-review` |
| `validation.two-check-families` | `validation.duplicate-ids`, `validation.readiness-floor`, `validation.two-check-families` |

These are close measurements, re-derived for this response. Re-run the supplied scripts rather than inheriting them.

| Measurement | Protocol base `44e62ef` | Revised lane | Platform `b038bd4` |
| --- | ---: | ---: | ---: |
| Specs | 421 | 423 | 243 |
| Epics / features / stories | 1 / 116 / 304 | 9 / 109 / 305 | 1 / 58 / 184 |
| Refinement roots | 10 | 8 | 1 |
| Maximum refinement depth, edges | 6 | 5 | 4 |
| Specs with multiple parents | 5 | 6 | 0 |
| Reached / unreached Specs | 309 / 112 | 423 / 0 | 243 / 0 |
| Examples reached / total | 137 / 209 | 209 / 209 | 122 / 122 |
| Decisions reached / total | 37 / 46 | 47 / 47 | 22 / 22 |

| Child → parent altitude | Base | Revised lane | Platform |
| --- | ---: | ---: | ---: |
| epic → epic | 0 | 1 | 0 |
| feature → epic | 16 | 60 | 51 |
| feature → feature | 90 | 47 | 7 |
| feature → story | 8 | 8 | 0 |
| story → epic | 1 | 29 | 0 |
| story → feature | 174 | 147 | 128 |
| story → story | 127 | 129 | 56 |

The revised roots are the nine epics except the agent epic, which refines projections. The five existing shared-parent decisions retain their edges; executable contracts adds the sixth multiple-parent Spec. Recipe 7 remains empty and recipe 2 reports zero alarms. Recipe 11 lists 24 Specs below ready. The sets of Specs with implementation bindings and verifier bindings remain identical to the base, at 144 and 354 respectively.

2. Rulings made on delegation

| Ruling | Reason and carrying entry |
| --- | --- |
| Keep every parent and count distinct descendants | Shared ancestry must not duplicate a Spec or inflate a rollup. `consumers.capability-map#rule.multipleParents`, `#rule.rollup` |
| Let the page own first-visit placement | The recipe has unique nodes and edges, with no drawing occurrences. `consumers.spec-studio.capability-map-page#design.disclosureOrder` |
| Include examples and decisions | Their rows, descendants and direct binding facts remain visible. `consumers.capability-map#rule.examplesAndDecisions` |
| Return a summary by default | Full rows are opt-in and omissions are explicit. `consumers.capability-map#design.mapDetail` |
| Separate graph damage from refusal | A returned map has `damage`; an invalid parameter has `diagnostics` without a map. `consumers.capability-map#design.graphDamage`, `#design.mapRecipe` |
| Add Capabilities after Packs and an Epic index filter | The lens reads refinement while Pack membership keeps its meaning. `consumers.spec-studio.capability-map-page#rule.page`, `#rule.filter` |
| Preserve the 19 ready coordinate changes listed above | Each existing statement and floor remains supported; the new coordinates await the owner's review. `protocol.capability-epics#rule.preserveEvidence` and the listed Specs' envelope/refinement entries |
| Add an executable-examples epic | The runner and contracts own narrower outcomes. `protocol.capability-epics#design.executableHome`; `extraction.executable-examples#rule.authoredSteps` |
| Keep design iteration in its Pack and retain the carrier hub | Avoid a duplicate outcome owner; explain the default-carrier title. `protocol.capability-epics#design.epicHome`, `#design.carrierHome` |
| Retain four deliberate refinement/dependency pairs | Narrowing an outcome and requiring it to hold express distinct relationships. `protocol.capability-epics#design.corpusChecks` |
| Correct runtime and version refinement | Runtime facts belong under derivation; the version flag narrows the command-line outcome. The `refines` entries on `observation.runtime-overlay` and `consumers.engine-provenance` |

All entry IDs in this table use the `spec:` namespace. Admitting every epic kind is excluded from the delegated rulings; it is the owner's decision below.

3. Decisions for the owner

| Question | Options | Recommendation and confidence |
| --- | --- | --- |
| Is a capability epic any Spec at epic altitude, or only a behavior Spec? | Admit every kind and ratify the glossary broadening; or retain behavior-only capability epics and add behavior wrappers over the core model, projections and check-family hubs | Admit every kind, high confidence. Preserve independent descriptors and existing outcome owners. The blocking question is `spec:consumers.capability-map.epic-kinds#question.epicKinds`; the decision states `scoped` |
| Should the Studio or human views become a separate epic? | Keep projections broad; enrich the Studio hub to epic; or introduce a separate human-view outcome if one is needed | Keep the present boundaries for this design checkpoint, medium confidence. Projections reaches 176 descendants, including the nested agent epic's 47; the cards now name the overlap. A smaller scope should follow an intended outcome, not a size target |
| Should corpus rules remain under the agent epic? | Keep them under scripted graph access, outside Protocol check families; or add validation refinement where the intended outcome warrants it | Keep the current home, medium confidence. `validate --rules` hosts operator-authored graph programs. Review this beside `protocol.capability-epics#design.nestedEpic` and `#design.corpusChecks` |
| Do the revised coordinates express the intended capability boundaries? | Confirm the 19 retained ready coordinates and new defined executable epic; or revise the identified boundaries | Confirm, subject to the capability-kind decision, high confidence. The table in section 1 identifies every ready change |

New `ready` statements and the build go remain outside this lane. No decision was ratified on the owner's behalf.

4. Prototypes

All paths below are under [the prototype folder](/tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/README.md).

| Artifacts | What they show |
| --- | --- |
| `prototype.mjs`, `map-recipe.mjs`, `studio.css` | Graph-driven renderer, draft recipe 52 and the existing Studio styling |
| `protocol-base.html`, `protocol-base-index.html` | Base corpus with one epic, unreached Specs and the proposed filter |
| `protocol-head.html`, `protocol-head-index.html` | Revised nine-epic design, explicit nested epic labels and complete refinement text |
| `platform.html`, `platform-index.html` | Unchanged platform corpus with one broad epic |
| `protocol-base-1440.png`, `protocol-base-390.png` | Base overview at desktop and phone widths |
| `protocol-head-1440.png`, `protocol-head-390.png` | Revised overview at both widths |
| `platform-1440.png`, `platform-390.png` | Platform overview at both widths |
| `protocol-head-branch-1440.png`, `platform-branch-1440.png` | Branch drawings with the first-six-by-id caption and route to complete text |
| `protocol-head-index-1440.png`, `protocol-head-index-390.png` | Agent epic selected, with 48 of 423 Specs shown |
| `measure.mjs`, `check-prototype.mjs`, `check-browser.mjs` | Structural measurement, recipe/preservation probes and browser checks |

All ten screenshots were refreshed and inspected. The browser checks pass at 1440 and 390 pixels, with no capability-page horizontal overflow, unique element IDs, nested-epic labels, correct binding wording and singular counts. The Epic filter shows 48 Specs, the example intersection shows 27, and reset restores 423. Invalid and repeated epic parameters keep every row visible with a message. The no-script index and native disclosures remain usable.

The draft recipe's pretty-printed default answer is 9,615 bytes; full detail is 360,281 bytes on this head. Probes cover summary/detail parity and omissions, parameter refusals, separate damage, diamonds, cycles, unresolved endpoints, no epics, empty corpora, nested epic membership, unique rollups, deterministic answers and complete node text. They also compare every previous ready statement and floor, and both binding-fact sets, with a separately derived base graph.

The drawing remains a throwaway sketch. Lane G owns the shared bound, layout and Mermaid output. Prototype Spec links require the local generated Studios or rewritten URLs before external sharing. The README now copies the unchanged built engine into the archived base checkout: running an engine from another checkout omits that archive's relative source bindings and gives a misleading evidence comparison.

5. Proposed edits to files outside lane E

The following exact text is committed in [the integration proposals](/tmp/plan47-wt/E/reviews/plan47-epics-integration-proposals.md). These changes are not applied to shared or other-lane files. The owner must settle the capability-kind decision, and integration must reconcile the navigation with lanes R and S.

**Studio lens contract**

In `specs/consumers/spec-studio.lenses.sdp.md`, replace the title, narrative, outcome,
`#rule.order` and `#ui.lensPages`, respectively, with:

```md
# Five lenses read the graph as Packs, capabilities, architecture, tests and evidence

Each lens is a page with a Spec of its own, so each builds on the graph it reads today: the Packs, capabilities, architecture and tests lenses read what the graph records, and the evidence lens reads not tracked until the graph records an observation. This Spec keeps what the five share.

- outcome: Let a person see the graph five ways, by Pack, by capability, by architecture, by verification and by evidence, from one top navigation.

- rule: [#order] The lenses are pages of the page set, reached from the top navigation in the order Packs, capabilities, architecture, tests, evidence; the index page is the Packs lens and the default landing page.

- lensPages: `index.html` for the Packs lens, `capabilities.html` for the capabilities lens, `architecture.html`, `tests.html` and `evidence.html`, each opening with its name and one sentence saying what it reads.
```

The location is UI, not Design as the review called it. If another lane adds a lens, adjust the
number and enumeration together at integration; keep Capabilities immediately after Packs.

In `specs/consumers/spec-studio.index-page.sdp.md`, replace `#rule.filters` with:

```md
- rule: [#filters] Filters narrow the Specs section by kind, altitude, stated rung, floor reached, implementation binding, verifier binding, Pack and epic; each filter takes one value or any, the epic filter also takes no epic, the filters combine, and the section says how many of its rows it shows. Without script every row shows.
```

In `specs/consumers/spec-studio.data.sdp.md`, replace `#rule.readerValues` with:

```md
- rule: [#readerValues] The build renders the index from `specs()`, `packs()`, `findings()`, each Spec's design columns and the epic memberships recipe 52 answers, a Pack page from `packContext` and the Pack totals, a Spec page from `specContext`, and the search page from the search index; every page's rail renders the rail values. A page states no value the reader did not return or a named recipe did not answer, apart from counts the build takes of those values.
```

In `specs/consumers/spec-studio.data.recipe-answers.sdp.md`, replace the two Design entries with:

```md
- recipeEvaluations: a build evaluates each of these once, with no parameter unless one is named: recipes 17, 20, 24, 31, 33, 43, 44, 46 and 51; recipe 52 with `{ detail: true }`; recipe 29 with `{ pack: id }` for every Pack; recipe 21 with `{ spec: id }` and recipe 30 with `{ specs: [id] }` for every Spec; recipe 34 with `{ spec: id }` for every Spec that is not an example, Specs in no Pack included; given a base graph, recipe 35 with `{ base, detail: true }`, and with `{ base, pack: id, detail: true }` for every Pack; given run records, recipe 45 with `{ runs }`.
- pageRecipes: the index renders reader values and each Spec's `epicIds` from recipe 52; the glossary renders reader values only; the capabilities lens renders recipe 52; the architecture lens renders recipes 17 and 43; the tests lens renders every recipe 34 answer, recipe 44, and recipe 45 given run records; a Spec page renders its recipe 21, 30 and 34 answers, its own space from recipe 44, the recipe 51 rows that cite its entries, the recipe 45 files whose `specs` hold its id, and its own row of recipe 35's whole-corpus answer; a Pack page renders the totals of its recipe 29 answer and, given a base graph, its own recipe 35 answer; the registers render recipes 20, 31, 24 beside recipe 51's rows, and 33; the owner queue renders recipe 46; the diff page renders recipe 35's whole-corpus answer; the runs page renders recipe 45; an export renders the values of the pages it holds.
```

In `specs/consumers/spec-studio.lenses.packs.sdp.md`, replace the narrative before Intent and
`#rule.packGrouping`, respectively, with:

```md
Packs collect Specs for review, while the separate Capabilities page reads authored refinement. The index remains the landing page and keeps each Pack's members in authored order.

- rule: [#packGrouping] The Packs lens groups Specs by Pack, each Pack's members in authored order. The separate Capabilities page reads refinement; selecting an epic narrows the index's Specs section without changing any Pack.
```

**Shared drawing contract, lane G**

In `specs/consumers/spec-studio.diagram-kinds.capability-tree.sdp.md`, replace the placement
sentence in `#rule.multipleParents` with:

```md
Place a node where the capability page's disclosure order first visits it (`spec:consumers.spec-studio.capability-map-page#design.disclosureOrder`).
```

Use `unreached` everywhere this drawing calls the same map section `unplaced`. If the drawing
Spec does not already declare a relation to the page, add this dependency so the checked
mention has a truthful relation:

```yaml
    - target: spec:consumers.spec-studio.capability-map-page
      reason: the drawing and complete text use the page's disclosure order
```

Keep E's first-visit depth-first walk with children in id order. The recipe returns unique
nodes and edges; it owns no drawing occurrences. The page and G's drawing own occurrence placement.

**Glossary, subject to the owner's capability-kind decision**

In `CONTEXT.md`, replace the `capability / domain` row after ratification, while the map is
still unbuilt, with:

```md
| **capability / domain** | a **`Pack` grouping** and/or a designed-for Capability Map projection over epic Specs and their declared `refines` descendants, of every kind; Pack membership and refinement remain distinct, and the Capability Map is not yet built (`spec:consumers.capability-map`, `spec:consumers.spec-studio.lenses.packs#rule.packGrouping`) | a kind or an altitude |
```

At implementation close, replace that row with:

```md
| **capability / domain** | a **`Pack` grouping** and/or a Capability Map projection over epic Specs and their declared `refines` descendants, of every kind; Pack membership and refinement remain distinct (`spec:consumers.capability-map`, `spec:consumers.spec-studio.lenses.packs#rule.packGrouping`) | a kind or an altitude |
```

`rollup`, `unreached`, `repeat` and `nested epic` remain ordinary descriptive words with their
meaning in the carrying entries. They introduce no primitive, descriptor or glossary row.
The decision child is a proposed ruling, not a ratified registry entry; no DECISIONS.md row is
proposed before the owner decides whether to ratify it.

**Upgrade guide**

In `docs/agent-surface/upgrade-guide.md`, insert before `Propose and apply rule keys` when
recipe 52 ships:

````md
## Organize features in epics

Here a capability is one of your corpus's own intended outcomes, not a Protocol capability
that capability adoption counts. Read the capability-map summary before choosing new parents:

```sh
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/52-the-capability-map.js)" --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/07-readiness-divergence.js)" --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/11-the-lower-ladder.js)" --json
```

Pass `--params '{"detail":true}'` for the complete map, or combine it with `epic` to read one
epic. Inspect `damage` and `cycles`; a refused parameter returns `diagnostics` without a map.

An epic states an enduring intended outcome. When an existing hub already owns that outcome,
change its altitude to `epic` and preserve its id, kind and intent. Author a new epic only when
no existing Spec owns the outcome. Choose parents by reading intended truth; paths, Pack
membership and dependencies do not establish refinement.

Keep genuine intermediate parents and multiple-parent relationships. A capability map can show
an epic inside another epic. Examples and decisions remain visible, and descendant counts do
not confer readiness or delivery facts on their parent.

Before reparenting a ready Spec, run promotion preflight, recipe 9, for the proposed parent.
That parent must state at least `defined` and clear its floor. Preserve existing readiness
statements that remain supported; the map never states a rung for you.

Review the carrier diff, validate, then re-run recipes 7, 11 and 52. Compare every previously
ready Spec's floor. Read the Studio's Capabilities page and use its Epic filter to inspect the
new scope. Unreached Specs are information, not a requirement to invent a parent. A single
broad epic is lawful; divide it only when the intended outcomes warrant separate identities.
````

**Recipe catalog and Studio skill**

Append to `docs/agent-surface/recipes.md` and its index when the body ships as
`dist/recipes/52-the-capability-map.js`:

```md
## 52. The capability map

Read every epic and its distinct refinement descendants, or pass `params.epic` to select one
epic and its descendants. Every kind participates. The default summary keeps every total,
each epic's title, direct epic parents and rollup, unreached ids, cycles and damage. `leftOut`
names what `detail: true` adds: node rows, edges, descendant ids and unreached roots.
A parameter refusal returns `diagnostics` without a map; unknown names return `unknownParams`
and `accepts`. Inspect `damage` and `cycles` on a returned map.
The contract is `spec:consumers.capability-map#design.mapRecipe` through its keyed answer entries.
```

Add this index row in recipe-number order:

```md
| 52 | The capability map | `epic`, `detail` | Read capability epics, distinct descendants and direct binding evidence. |
```

Insert in `.agents/skills/sdp-studio/SKILL.md`, in `Read the pages by task` after the index row:

```md
| Read the corpus capability by capability, then narrow the Specs to one epic | `capabilities.html`, the capabilities lens (recipe 52) |
```

**Arc Pack membership**

In `specs/roadmaps-and-slices.pack.sdp.md`, insert the new decision immediately after
`spec:consumers.capability-map` and the new executable epic immediately after
`spec:protocol.capability-epics`, respectively:

```yaml
  - spec:consumers.capability-map.epic-kinds
```

```yaml
  - spec:extraction.executable-examples
```

Do not insert the existing re-altituded hubs. Recipe 35 from base `44e62ef` shows their changed
coordinates without adding large ready rows to the arc's Pack design. In the PR, render the
coordinate changes and separate the delegated rulings from the capability-kind decision.


6. What the build needs

1. Settle the capability-kind question and integrate the shared Studio contracts and lane G placement rule. The page and complete text must use the same first-visit order.
2. Implement recipe 52 from its keyed Design entries. Add `52-the-capability-map.js` through the catalog/build path and execution coverage in `test/recipes.test.ts`. Carry the prototype's graph cases into product tests, including summary/detail parity, direct epic parents and distinct damage/refusal shapes.
3. Evaluate recipe 52 once with `{ detail: true }` during Studio data preparation. Add `src/projections/studio/pages/capability-map-page.ts`, publication routing, the Capabilities navigation link in `pages/frame.ts`, and epic memberships/filter handling in `pages/index-page.ts` and its filter element. Page code must not recompute readiness or binding facts.
4. Integrate lane G's drawing and test complete text, shared parents, cycles, same/skipped altitudes, nested epics, folding and readable labels. Test `section.intent` links and every keyed question link against real page IDs.
5. Test Epic filtering with every existing index filter, URL initialization, invalid/repeated parameters, reset, no-script behavior, keyboard navigation, print and narrow viewports. Preserve Pack cards and membership order.
6. Apply the guide, skill, glossary and two new Pack-member proposals at the appropriate owner/build boundary. Update the self-hosting oracle at integration, regenerate and run `npm run check` after engine edits. Re-measure the platform without authoring its epics.

7. Changes to the brief

The refinement presentation still preserves a graph, including multiple parents and mixed altitude transitions. The review changed the earlier conclusion that no new epic was needed: executable examples now has an outcome owner, and its runner is a feature again. A new scoped decision makes the glossary broadening visible to the owner. Runtime observations and engine provenance now refine their actual intended outcomes.

The report no longer proposes adding eight ready hubs to the arc Pack. It proposes only the two new Specs and uses recipe 35 for existing coordinate changes. Design iteration remains a Pack with an explicit reason. The four refinement/dependency pairs remain deliberately, with their separate meanings recorded.

8. Risks and open questions

The glossary broadening is unresolved until the owner answers the new blocking question. Shared Studio contracts still need the exact integration edits in section 5 before a page build or ready statement. Lane G still uses a different placement sentence and `unplaced` in its current tree draft; this lane supplies the replacement without editing G's worktree. R and S may change the final navigation enumeration.

Projections remains broad, and descendant scopes overlap. Cards now identify nested epics; rollups still must never be summed or read as exclusive ownership, inherited facts or completion percentages. The new executable epic leaves cross-cutting step keys, oracle eligibility and realization policy in their existing truthful homes. A Pack can collect them for review without inventing refinement.

The prototypes implement only the epic and kind filters, while the product contract requires intersection with every existing index filter. Their local links and bounded branch sketches are evidence of the design, not a shipped page or recipe. Full engine checks belong to the build; this lane ran the design and prototype checks described here.

9. Commits and verification

| Commit | Work |
| --- | --- |
| `0eb690928218f1c63e90fe479c74063766fd9c8f` | Corrected design, new executable epic, owner decision and exact integration proposals |
| `9c8589330de9e331c4e41fda8ec0d20cbb6c165f` | Refreshed prototypes, ten screenshots, graph/browser probes and corrected base reproduction |

The branch is left clean at `9c8589330de9e331c4e41fda8ec0d20cbb6c165f`, above the original design commits `cc383e6` and `33147b4`. Nothing was pushed or merged.

Validation, `check:temporal`, `git diff --check`, prototype ESLint, graph probes and browser checks passed. Validation reports zero errors and one warning, the existing `honesty/gaps` on `spec:model.spec-sections`. The full engine gate was not run for this design-only change.

From `/tmp/plan47-wt/E`, re-measure with:

```sh
node reviews/assets/plan47-prototypes/E-capability-map/measure.mjs /tmp/plan47-wt/E
node reviews/assets/plan47-prototypes/E-capability-map/measure.mjs /tmp/plan47-platform
node dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity 'return {divergence:await recipes(7),lower:await recipes(11),drift:await recipes(2)}' --json
node dist/cli/sdp.js validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

The prototype README gives the base reconstruction, snapshots, preservation check, rendering and screenshot commands. Republish the Studio after validation, which invalidates its generated page root.

10. Review findings and dispositions

`D` below is design commit `0eb6909`; `P` is prototype commit `9c85893`. An integration proposal fixes the missing design/proposal within lane E's scope; it does not claim that another lane's carrier has already changed.

| Opus finding | Disposition | Checkable result |
| --- | --- | --- |
| 1. Studio navigation, filter and data contracts conflict | Fixed in D; shared edits proposed | The page refines lenses and depends on the index. Section 5 supplies every navigation, filter, reader-value and recipe-evaluation replacement. The actual `lensPages` entry is in UI, not Design |
| 2. Binding wording | Fixed in D and P | Binding-language dependency; rows use `present` or `none` |
| 3. No recipe summary | Fixed in D and P | `epic` and `detail` accepted; summary default, explicit omissions; Studio requests full detail |
| 4. Glossary broadening treated as delegated | Fixed in D | New scoped decision and owner question; section 3 lists options, recommendation and confidence |
| 5. Runner is too narrow for an epic; carrier title unexplained | Fixed in D | New executable-examples epic; runner returns to feature; contracts adds the new parent and preserves its build parent. `#design.carrierHome` explains the existing carrier hub |
| 6. Design iteration omitted without explanation | Fixed in D | `protocol.capability-epics#design.epicHome` records why its Pack remains the review grouping |
| 7. Runtime observations under projections | Fixed in D | Runtime overlay refines derivation with the observed-fact reason |
| 8. E/G placement and terminology disagree | Fixed on E's side in D and P; G edit proposed | Traversal leaves the map rule and remains on the page. Prototype follows child-id order. Section 5 gives G the placement sentence and `unreached` wording |
| 9. Two diagnostics shapes | Fixed in D and P | Returned map has `damage`; parameter refusal alone has `diagnostics` |
| 10. "Evidence kinds" and unflagged vocabulary | Fixed in D | Rule renamed `examplesAndDecisions`; disclosure wording corrected. `rollup`, `unreached`, `repeat` and `nested epic` remain ordinary words, with no glossary rows |
| 11. Nested epic overlap invisible on cards | Fixed in D and P | `parentEpicIds`, `Inside <title>` and `Includes epic <title>` appear in design and screenshots |
| 12. Version flag under authoring | Fixed in D | Engine provenance refines command-line with its own reason |
| 13. Four refinement/dependency pairs | Fixed by rationale in D | `#design.corpusChecks` distinguishes narrowing from dependence and records all four deliberate pairs. Corpus-rules placement is listed for owner review |
| 14. Repeated law, procedure and parent inventory | Fixed in D | `preserveEvidence` narrowed; `reviewHomes` and `broadRoots` removed; Design keeps reasons, and the upgrade proposal carries review procedure |
| 15. Cyclic-root rule repeated and jargon-heavy | Fixed in D | Cyclic root selection lives only in `#design.unreachedRoots`, in plain language |
| 16. Wrong unkeyed-question fragment | Fixed in D and P | `section.intent` replaces `#intent` |
| 17. Upgrade-guide command and capability ambiguity | Fixed proposal in D | Exact shipped-file commands, summary/detail guidance and distinction from capability adoption |
| 18. Missing Studio-skill row | Fixed proposal in D | Exact task-table row in section 5 |
| 19. Missing filter screenshot, unexplained six-child drawing and plurals | Fixed in P | Desktop and phone filter screenshots; first-six-by-id caption; singular decision/question wording |
| 20. Eight existing hubs added to arc Pack | Fixed proposal in D | Existing hubs omitted; two new IDs proposed; PR should show existing coordinate changes through recipe 35 |

The review's additional owner items are also retained: projections' broad scope and the 19 ready coordinate changes are listed in sections 1 to 3, separately from defect closure.
