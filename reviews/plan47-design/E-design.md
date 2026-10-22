Lane E's design pass is complete on `p47/e-epics`. The capability map and its Studio page are designed, eight existing hubs now state epic altitude, and all 421 Protocol Specs are reached by nine epics. All 399 previously ready Specs still state `ready` and reach that floor. No product engine or test files changed, and no platform intent was edited.

The design commit is `cc383e6cc8598f591b3fa62b844acdafffd475a4`, from base `44e62ef`. The final evidence commit is `33147b46f320dbbb42dd7bae4b0565a64810341e`.

These are close measurements; re-run the supplied scripts and recipes instead of inheriting them.

| Measurement | Protocol base | Protocol design | Platform at `b038bd4` |
| --- | ---: | ---: | ---: |
| Specs | 421 | 421 | 243 |
| Epics / features / stories | 1 / 116 / 304 | 9 / 108 / 304 | 1 / 58 / 184 |
| Refinement roots | 10 | 8 | 1 |
| Maximum refinement depth, in edges | 6 | 5 | 4 |
| Specs with multiple refining parents | 5 | 5 | 0 |
| Specs reached by an epic | 309 | 421 | 243 |
| Unreached Specs | 112 | 0 | 0 |
| Examples reached / total | 137 / 209 | 209 / 209 | 122 / 122 |
| Decisions reached / total | 37 / 46 | 46 / 46 | 22 / 22 |

The base includes the arc's captures, which accounts for its difference from the brief's earlier census. Refinement transitions, child to parent, are:

| Transition | Protocol base | Protocol design | Platform |
| --- | ---: | ---: | ---: |
| epic → epic | 0 | 1 | 0 |
| feature → epic | 16 | 59 | 51 |
| feature → feature | 90 | 46 | 7 |
| feature → story | 8 | 8 | 0 |
| story → epic | 1 | 32 | 0 |
| story → feature | 174 | 145 | 128 |
| story → story | 127 | 127 | 56 |

The Protocol's base roots were `carrier.markdown-authoring`, `consumers.authoring-on-ramp`, `consumers.engine-provenance`, `extraction.example-runner`, `model.planned-architecture`, `observation.run-evidence`, `protocol.self-hosting`, `validation.architecture-constraints`, `validation.corpus-rules`, and `validation.external-registers`, each in the `spec:` namespace. At the design head, the roots are the epics below except `consumers.agent-surface`, which still refines projections. The platform's sole root remains `spec:platform.transactional-domain-platform`.

The five multiple-parent Specs are the decisions `anchor-binding-grain`, `architectural-annotation`, `authored-entry-order`, `pack-design-page`, and `question-key-rendering`. Their edges remain intact. Examples and decisions stay in the map and its rollups; a disclosure may fold their rows but cannot remove them or their descendants.

The lane changed 22 Specs and created no new Spec IDs. Recipe 9 reports the following for the three lane-owned designs:

| Spec | Stated rung | Floor reached | Result |
| --- | --- | --- | --- |
| [`consumers.capability-map`](/tmp/plan47-wt/E/specs/consumers/capability-map.sdp.md) | defined | ready | Recipe 52's parameters, normalized answer, distinct rollups, multiple-parent handling, unreached roots and damaged-graph behavior |
| [`consumers.spec-studio.capability-map-page`](/tmp/plan47-wt/E/specs/consumers/spec-studio.capability-map-page.sdp.md) | defined | defined | `capabilities.html`, navigation, links, complete refinement text, responsive behavior and the index's Epic filter |
| [`protocol.capability-epics`](/tmp/plan47-wt/E/specs/protocol/capability-epics.sdp.md) | defined | ready | Existing hubs own epic outcomes; self-hosting keeps the Protocol's own delivery practice |

The page's ready floor waits on `spec:consumers.spec-studio.diagram-kinds`, which still states `idea` in this lane. No new `ready` statement was made.

The following existing hubs were enriched to epic altitude. Each keeps its title, kind, outcome and existing `ready` statement; recipe 9 reports `ready` for every floor. Their content already owns the capability, so a new wrapper Spec would duplicate it.

| Epic ID, after `spec:` | Existing title | Kind | Outcome already owned |
| --- | --- | --- | --- |
| `carrier.markdown-authoring` | Markdown authoring enters the one graph | behavior | Author Specs in Markdown without another truth path |
| `consumers.agent-surface` | Agents script a visible typed graph | behavior | Compose graph context through the reader and evaluation sink |
| `consumers.authoring-on-ramp` | Authors move one Spec from intent to reviewed evidence | behavior | Create, enrich, bind and review a Spec through graph-first authoring |
| `consumers.projections-model` | Projections fan out from one graph without becoming truth stores | model | Give humans and agents views while preserving canonical intent |
| `extraction.derive-graph` | Carrier reification derives the one graph | behavior | Expose the carrier-neutral graph derivation seam |
| `extraction.example-runner` | A bound example runs its contract steps against a fresh world | behavior | Execute bound steps and name a failing step in the Spec's words |
| `model.core-model` | The Protocol models delivery with one enrichable Spec | model | Give delivery statements a stable shape and independent coordinates |
| `validation.two-check-families` | Validation separates well-formedness from non-pretending | rule | Check conformance and honesty without judging content or enforcing workflow |

The existing `spec:protocol.self-hosting` epic is unchanged, `behavior`, stated `ready`, floor `ready`. It owns the outcome of carrying the Protocol's intended truth through its own extractor, checks and projections. It now reaches ten descendants: its delivery-practice Specs and five identity or practice decisions. The agent epic remains nested under projections because its outcome is a consumer view; the map exposes that overlap.

The remaining eleven changed Specs have these direct refinement homes. Recipe 9 reports stated/floor `ready/ready` for every row except runtime observations, which remains `idea/idea`.

| Changed Spec, after `spec:` | Direct parent, after `spec:` |
| --- | --- |
| `consumers.engine-provenance` | `consumers.authoring-on-ramp` |
| `extraction.build-pipeline` | `extraction.derive-graph` |
| `extraction.determinism` | `extraction.derive-graph` |
| `model.planned-architecture` | `model.core-model` |
| `observation.run-evidence` | `consumers.projections-model` |
| `observation.runtime-overlay` | `consumers.projections-model` |
| `validation.architecture-constraints` | `validation.corpus-rules` |
| `validation.corpus-rules` | `consumers.agent-surface` |
| `validation.duplicate-ids` | `validation.two-check-families` |
| `validation.external-registers` | `validation.corpus-rules` |
| `validation.readiness-floor` | `validation.two-check-families` |

For completeness, every base feature that had no feature parent, or used self-hosting as its parent, has the following epic home. IDs in both columns omit `spec:`. An epic listed as its own home was promoted in place; other rows may retain intermediate parents.

| Epic home | Base features covered |
| --- | --- |
| `carrier.markdown-authoring` | `carrier.markdown-authoring`, `decisions.prose-ownership` |
| `consumers.authoring-on-ramp` | `consumers.authoring-on-ramp` |
| `consumers.projections-model` | `consumers.projections-model`, `consumers.spec-studio.diagram-kinds`, `observation.run-evidence`, `observation.runtime-overlay` |
| `consumers.agent-surface`, also projections | `validation.architecture-constraints`, `validation.corpus-rules` |
| `extraction.derive-graph` | `extraction.build-pipeline`, `extraction.derive-graph`, `extraction.determinism` |
| `extraction.example-runner` | `extraction.example-runner` |
| `model.core-model` | `carrier.markdown-pack-authoring`, `decisions.checked-mentions`, `decisions.pack-reified`, `model.core-model`, `model.planned-architecture` |
| `protocol.self-hosting` | `decisions.adopt-the-nouns`, `decisions.concept-docs-dissolve`, `decisions.executable-meta-model`, `decisions.plain-language-references`, `decisions.protocol-naming`, `protocol.capability-epics`, `protocol.roadmap-replaces-plans`, `protocol.role-vocabulary`, `protocol.significant-units-review` |
| `validation.two-check-families` | `validation.duplicate-ids`, `validation.readiness-floor`, `validation.two-check-families` |

Recipes 7 and 11 were run before and after. Readiness divergence is empty in both readings; the lower ladder has 22 Specs in both, with the three designed captures moving from `idea` to `defined`. Recipe 2 remains empty. All 399 old ready IDs were compared individually with the new reader result. Implementation bindings still confer facts on 144 Specs, and verifier bindings on 354; reparenting changed neither set.

The delegated rulings are carried in these entries:

| Ruling | Carrying entry |
| --- | --- |
| Expand a shared descendant once per epic section, retain every parent edge, and link later occurrences as repeats | `spec:consumers.capability-map#rule.multipleParents` |
| Count distinct descendants, exclude the epic itself, and never sum overlapping epic totals | `spec:consumers.capability-map#rule.rollup` |
| Include examples and decisions, with binding existence labelled separately from passing tests | `spec:consumers.capability-map#rule.evidenceKinds` |
| List unreached Specs as their own subgraph, including roots for cyclic components | `spec:consumers.capability-map#rule.unreached`, `#design.unreachedRoots` |
| Read all epic kinds and preserve same-altitude, skipped-altitude and nested refinement | `spec:consumers.capability-map#rule.graphOnly`, `#rule.epics` |
| Add Capabilities after Packs; an Epic filter narrows index Spec rows and preserves Pack membership | `spec:consumers.spec-studio.capability-map-page#rule.page`, `#rule.filter` |
| Enrich existing outcome owners instead of adding duplicate wrapper epics | `spec:protocol.capability-epics#rule.epicHome` |
| Keep self-hosting about the Protocol's own practice; put corpus-selected checks under scripted graph access | `spec:protocol.capability-epics#rule.selfHosting`, `#design.corpusChecks` |

The open questions `multipleParents`, `unreached` and `epicHome` were resolved into those rules and removed from the question register. Their history remains in git.

No new ADR or owner-only decision was introduced. The owner can review the delegated epic boundaries and glossary wording below. The alternatives are to keep the existing outcome owners or introduce separate behavior epics. I recommend keeping the existing owners, with high confidence: kind and altitude are independent, and new wrappers would repeat existing intent. New readiness statements and the build go remain outside this lane.

All prototype artifacts are under [`reviews/assets/plan47-prototypes/E-capability-map/`](/tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/README.md):

| Artifact | What it shows |
| --- | --- |
| `prototype.mjs`, `map-recipe.mjs`, `studio.css` | Graph/reader-driven static renderer, draft recipe 52, and the Studio's existing CSS |
| `protocol-base.html`, `protocol-base-index.html` | The base's broad epic, 112 unreached Specs, and the proposed index filter |
| `protocol-head.html`, `protocol-head-index.html` | Nine authored epic scopes, complete refinement text and overlapping membership |
| `platform.html`, `platform-index.html` | The unchanged platform corpus under its one broad epic |
| `protocol-base-1440.png`, `protocol-base-390.png` | Base page at desktop and phone widths |
| `protocol-head-1440.png`, `protocol-head-390.png` | Revised overview at desktop and phone widths |
| `platform-1440.png`, `platform-390.png` | Platform page at desktop and phone widths |
| `protocol-head-branch-1440.png`, `platform-branch-1440.png` | Readable branch drawings and the route to complete refinement text |
| `measure.mjs`, `check-prototype.mjs`, `check-browser.mjs` | Re-measurement, graph probes and browser checks |

I inspected all eight screenshots. The phone layout now begins with the content rather than the navigation rail. Browser checks found no horizontal overflow on either corpus or the base at either width. Selecting the agent epic shows 48 Specs; intersecting it with examples shows 27; reset restores 421. Invalid or repeated epic parameters preserve all rows with an explicit message. With script disabled, all index rows and native disclosures remain available.

The drawing is a throwaway sketch of one epic and up to six direct non-evidence children. Deeper branches and evidence kinds remain in complete text. It does not settle lane G's shared bounds, Mermaid output or zoom behavior. Spec links use the local generated Studios, so these artifacts need their URLs rewritten or their Studios regenerated before sharing outside this workspace.

The following are exact proposed edits to files this lane could not edit.

In `specs/consumers/spec-studio.lenses.packs.sdp.md`, replace the narrative before Intent with:

> Packs collect Specs for review, while the separate Capabilities page reads authored refinement. The index remains the landing page and keeps each Pack's members in authored order.

Replace `#rule.packGrouping` with:

```md
- rule: [#packGrouping] The Packs lens groups Specs by Pack, each Pack's members in authored order. The separate Capabilities page reads refinement; selecting an epic narrows the index's Specs section without changing any Pack.
```

At implementation close, replace the `capability / domain` glossary row in `CONTEXT.md` with:

```md
| **capability / domain** | a **`Pack` grouping** and/or a Capability Map projection over epic Specs and their declared `refines` descendants, of every kind; Pack membership and refinement remain distinct (`spec:consumers.capability-map`, `spec:consumers.spec-studio.lenses.packs#rule.packGrouping`) | a kind or an altitude |
```

This explicitly broadens the old wording about high-altitude behavior Specs. Until implementation, retain the glossary's honest statement that the projection is unbuilt.

In `docs/agent-surface/upgrade-guide.md`, insert the following before “Propose and apply rule keys”, when recipe 52 ships:

```md
## Organize features in epics

Read the capability map before choosing new parents:

~~~sh
pnpm exec sdp q 'return await recipes(52)' --json
pnpm exec sdp q 'return await recipes(7)' --json
pnpm exec sdp q 'return await recipes(11)' --json
~~~

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
```

There are no new Spec IDs to add to either Pack. For the arc's review context, I propose inserting these existing changed hubs immediately after `spec:protocol.capability-epics` in `specs/roadmaps-and-slices.pack.sdp.md`, in this reading order:

```yaml
  - spec:model.core-model
  - spec:carrier.markdown-authoring
  - spec:extraction.derive-graph
  - spec:validation.two-check-families
  - spec:consumers.projections-model
  - spec:consumers.agent-surface
  - spec:consumers.authoring-on-ramp
  - spec:extraction.example-runner
```

For `docs/agent-surface/recipes.md`, add this catalog introduction with the shipped body at build time:

```md
## 52. The capability map

Read every epic and its distinct refinement descendants, or pass `params.epic` to select one
epic and its descendants. Every kind participates. The answer keeps each Spec's stated rung,
floor reached, direct delivery facts and questions separate from descendant rollups, and lists
Specs no epic reaches. Inspect `diagnostics` and `cycles` before interpreting the map.
The contract is `spec:consumers.capability-map#design.mapRecipe` through its keyed answer entries.
```

The draft body's exact source is `map-recipe.mjs`; it is design evidence, not a request to ship that file unchanged. No decision-registry, AGENTS, skill or engine edit is proposed by this lane.

The build should proceed in this order:

1. Implement recipe 52 from the keyed Design contract, add its catalog body and catalog execution coverage in `test/recipes.test.ts`. Test diamonds, multiple epics, nested epics, no epic, isolated Specs, cyclic refinement, unresolved endpoints, invalid parameters, and evidence kinds. Assert unique counts and direct facts independently of presentation.
2. Feed the answer into Studio data preparation. Add `src/projections/studio/pages/capability-map-page.ts`, publication routing, the Capabilities navigation link in `pages/frame.ts`, and epic membership values in `pages/index-page.ts` and the filter element. The renderer must not recompute floors or binding facts.
3. Integrate lane G's drawing through `spec:consumers.spec-studio.diagram-kinds`. It must handle repeated and skipped altitudes, multiple parents, nested epics, cycles, readable labels, bounded branches and complete text. The prototype supplies examples; it does not own the shared layout algorithm.
4. Add page and browser tests for filtered URLs, all existing filter intersections, invalid parameters, resets, no-script behavior, keyboard links, print and narrow viewports. Verify that every Spec and refinement edge remains reachable in text when a drawing folds.
5. Apply the integration prose and Pack proposals, update affected self-hosting expectations, regenerate, and run the full green gate after engine edits. Re-measure the platform without authoring its epics.

The brief was reshaped in three places. The proposed tree became a graph-preserving tree presentation because the corpus already has shared parents and mixed altitude transitions. No new epic Specs were needed because existing hubs owned the outcomes. I also homed the isolated engine-provenance story under authoring so the remaining unreached set did not hide a small disconnected branch. These changes preserve authored identity and add no delivery fact.

The remaining risks are explicit. Projections still spans a broad capability and overlaps the agent epic; rollups must never imply exclusive ownership or percent completion. Lane G still owns the final drawing contract. The glossary and Packs-lens text remain unchanged in this lane and need the proposed integration edits. Prototype links depend on local Studios. The platform's existing twelve warnings remain its own baseline; this lane added none and changed no platform carriers.

Final verification passed: `sdp validate` reports zero errors and exactly the existing `honesty/gaps` warning on `spec:model.spec-sections`; `check:temporal`, `git diff --check`, prototype graph probes, prototype ESLint and browser checks passed. The full engine gate was not run for this design-only change; the integration build must run it after updating the engine and self-hosting expectations.

Re-measure from `/tmp/plan47-wt/E` with:

```sh
node reviews/assets/plan47-prototypes/E-capability-map/measure.mjs /tmp/plan47-wt/E
node reviews/assets/plan47-prototypes/E-capability-map/measure.mjs /tmp/plan47-platform
node dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity 'return {divergence:await recipes(7),lower:await recipes(11),drift:await recipes(2)}' --json
node dist/cli/sdp.js validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

The prototype README records base reconstruction, rendering, screenshots and browser-check commands. The branch is left at `33147b46f320dbbb42dd7bae4b0565a64810341e`, with the design in its parent `cc383e6`. Nothing was pushed or merged.
