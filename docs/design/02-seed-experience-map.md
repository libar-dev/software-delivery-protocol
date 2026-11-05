# 02 — The seed's experience, mapped to now

The seed design ([`docs/lineage/v0-design/`](../lineage/v0-design/README.md)) was written before
any code. Its human experience was more ambitious than what the Studio delivers today, and several
of its mechanisms have since been ruled out. This map takes each experience idea, states what became
of it, and names the design opportunity that remains.

**Reading rule.** The seed is evidence and direction, never law. Where it conflicts with a carrying
Spec, the Spec wins, and a retired mechanism stays retired. What survives a retirement is usually
the **job** the mechanism served; the opportunity column is about that job. The opportunities are a
research backlog for design cycles that run over many months, not decisions to settle now.

**Citations.** Section references such as (07 §2.3) point into the seed's documents, not into this
folder. In the tables, a short address such as `shell#rule.stamp` stands for
`spec:consumers.spec-studio.shell#rule.stamp`; every other Spec is cited in full.

**Outcome words.** Each row says what became of the seed idea:

- **shipped**: the carrying Spec states `ready` and is `implemented` (the condition the roadmap's
  `built` need checks for each Spec, `spec:consumers.roadmap#rule.entryNeed`), and the Studio shows it.
- **reshaped**: the job survives under a different mechanism, named with its carrying Spec.
- **retired**: ruled out, by the Spec or decision the row names.
- **deferred**: designed in and held, with the Spec or decision that holds it.
- **not carried**: no Spec carries it yet.

Re-derive the Studio's side rather than trusting this page:

```sh
pnpm --silent sdp:q 'return g.specs().filter((s) => s.id.startsWith("spec:consumers.spec-studio") && s.specKind !== "example").map((s) => [s.id, s.statedReadiness, s.deliveryFacts.join(" ")])' --json
pnpm --silent sdp:q 'return g.resolveEntryAddress("spec:consumers.spec-studio.sharing#rule.sourceLinks")' --json
```

## The loop

The seed's closing line was *Generate → Explore → Refine → Export → Validate → Apply → Regenerate*
([07 §14](../lineage/v0-design/07-spec-studio-and-projections.md)). Today the loop is *derive →
read → compose scoped intent → hand off → agent edits source → git → checks → regenerate*. The
seed's patch loop, with its codemods and its trial apply against a copy of the graph, is
**retired**: `spec:consumers.intent-composition.proposal` records the refusal and
`spec:consumers.edit-model` holds the law. A view writes no source. It composes scoped intent, or a
change proposal, that an agent applies as an ordinary edit.

**Opportunity.** The seed imagined the loop as one continuous experience. Today it crosses several
artifacts: the composing panel, the memo (recipe 49), the change proposal and its check (recipe 38),
the agent's edit, the pull request, the checks and a newly stamped preview. No reading follows a
change across them, and the basis can drop out on the way: a page opened through `file://` has no
stamp, so the person must supply the proposal's base or the intents leave as scoped-intent text
(`intent-panel#rule.proposalBase`). Designing that journey end to end is a first-class UX problem.
Desktop, web and CI surfaces could each add something there; those surfaces are exploratory (see
[04](04-reading-model-and-ia.md)).

## Studio structure

| Seed idea | What became of it | Design opportunity |
|---|---|---|
| Four lenses (Packs, Architecture, Tests, Evidence), with Capabilities and Search in the top navigation (07 §2.1–2.2) | **shipped** as the Packs, capabilities, architecture, tests and evidence lenses (`lenses#rule.order`), plus a search page (`spec:consumers.spec-studio.search`) | Lenses are graph views. Today the index is the Packs lens and the landing page, with task routes under `Start here` (`lenses.packs#rule.landing`, `navigation#rule.indexRoutes`). A role's own entry reading (provisional: "role home") could sit above the lenses and decide which one a role meets first; that revises the landing rules |
| Left rail with Pack tree, recent edits and a validation count (07 §2.1) | **reshaped**: a shell with navigation, rail and canvas (`spec:consumers.spec-studio.shell`); recent edits are **retired**, since the shell "shows no recent edits and no other history: git holds it" (`shell#rule.noRecentEdits`) | A recent-change rail would revise that rule and take its history as a named input. Today the diff page, over a supplied base graph, is the lawful place for change since a base |
| Spec page with ten collapsible sections A–J (07 §2.3) | **shipped**: the core's sections, then the Verification, Design view, Runtime, Evidence and Impact panels in a fixed order, each open by default (`spec-page#rule.panelOrder`) | A role may want a different first panel. Changing the order needs a Spec change; a role's entry reading can link deep into a panel instead, since each panel has an element id such as `panel.impact` |
| Readiness colour ramp over seven rungs (07 §2.3 A) | **reshaped**: the seven-rung ramp is retired. The stated rung is a badge carrying its word, coloured from a palette of four that stays distinct under colour blindness; the floor reached sits beside it in words with no colour; only the divergence banner adds a warning colour (`shell#rule.rungBadge`, `shell#rule.wordsBesideColor`) | Stated readiness, the derived floor and delivery facts are three independent coordinates and need three encodings; the badge already keeps the first two apart. One ramp would merge them into a progress score |
| The seed's readiness banner: "claimed `bound`, derived `framed` because runtime bindings missing" (06 §8) | **shipped**: every Spec page's header shows the stated rung beside the floor reached, raises the banner only when the floor stands below the stated rung, and shows the stated next rung with `nothing blocks` or each unmet clause and its targets (`spec-page.core#rule.header`; the banner law is `spec:consumers.derived-readiness-banner`) | The "because" is the valuable part, and both directions are already on the page; promotion preflight (recipe 9) is the agent's form of the upward answer. What is open is how a decider reads many next-rung answers together, beyond the owner queue page (recipe 46) |
| Maturity heatmap of readiness counts (00 §9), and the seed's picture of its `abstraction` axis, now altitude, against readiness (01 §5) | **shipped** as a maturity map on each Pack page, a grid of stated rung against floor reached (`spec:consumers.spec-studio.pack-page.maturity-map`) | Altitude against readiness, the seed's actual picture, is not drawn. It is a strong first reading for a technical product manager |
| Web components embeddable in pull-request bodies, status reports and slides (07 §3) | **reshaped**: `sdp-` custom elements enhance the markup the build wrote, the search results element aside (`page-elements#rule.enhanceOnly`) and work in any HTML page that holds that markup and loads the Studio's script (`components#rule.selfContained`); a Pack exports as one self-contained file with no script (`export#rule.selfContained`) | Hosts that run no script stay open. For a pull-request description the custom-elements decision (MD-42) already rules a static link to a Studio page, never an element; chat and documents are unexplored |
| Mobile: single column, pinch-zoom diagrams, staging that survives a refresh, and a summary mode that hides low-confidence inferred edges (07 §11) | **shipped**, except the summary mode: the same pages serve a desktop and a phone, with one column on a narrow screen and pinch zoom on diagrams (`spec:consumers.spec-studio.responsive`), and gathered intents survive a refresh (`intent-panel#rule.persist`). The summary mode is **retired**: a diagram never drops an edge for a low score, and a narrow screen scales the drawing rather than cutting it (the responsive Spec's narrative) | The nearest surviving idea is "fold, keep the words": an oversized diagram folds by context and layer at every width and keeps its text equivalent (`diagrams#rule.foldByContext`). Phone review as its own task design stays a candidate; readings that differ by width would revise the rule that the same pages serve both |
| Stamped previews per pull request at `/preview/<pr>/` (07 §12) | **shipped**: `sdp stamp` writes `stamp.json` after the build, and the preview workflow stamps each pull request's merge commit (`spec:consumers.spec-studio.sharing`). Every page served over http or https shows, once its stamp loads, a stamp line with the corpus commit, engine and build time (`shell#rule.stamp`, `shell#ui.stampLine`); the stamp also sets the composing panel's proposal base (`intent-panel#design.baseSource`) and, through an optional source template, turns recorded files and lines into links (`sharing#rule.sourceLinks`) | The stamp is already a trust element on every served page; the open questions are its weight on a reading, and a basis for a page opened through `file://` and for a Pack export, which carry none (`shell#rule.stamp`, `export#rule.exportContent`) |

## Reading a Spec

| Seed idea | What became of it | Design opportunity |
|---|---|---|
| Open questions panel with `Mark resolved` and `Promote to ADR` (07 §2.3 B) | **reshaped**: questions carry `decider`, `links`, `provisional` and `trigger` (`spec:model.open-question-fields`). The questions page lists the Specs with a blocking question first, each Spec's questions in authored order (`registers#rule.questionsPage`), and the owner queue page lists the questions the owner decides (`owner-queue#rule.ownerQuestions`). Resolving a question and promoting it to a decision record are composing actions that become scoped intent (`intent-panel#ui.composingActions`) | A keyed question already has an entry address (`spec:<id>#question.<key>`) and an element id on its Spec page, which both pages link to (`spec-page.core#rule.entryIds`). A page of its own would be new and would need a carrying Spec; an unkeyed question has no address |
| Example cards with `View test`, `Run again`, `Edit example` (07 §2.3 C) | **reshaped**: examples are Specs with step contracts; running is CI's; run records supplied with `--runs` show beside the binding, labelled as external evidence (`spec:consumers.spec-studio.runs-page`); proposing or editing an example is a composing action | A card can state the bound point, the witness, the verifier binding and any supplied run, each with its own words |
| NFR sliders, "Adjust target", "last measured: 287 ms" (07 §2.3 D) | **reshaped**: constraints carry targets, and changing one is a composing action. **Deferred**: a slider waits for a design of its own (the decision that the Studio renders derived HTML, MD-41), and "last measured" waits on `observed` | Changing a target is a scoped intent. "Last measured" must not appear until a measurement exists |
| Embedded component diagram with source on hover (07 §2.3 E) | **shipped** as Studio diagrams with text equivalents, including scoped architecture and requirement traces (`spec:consumers.spec-studio.diagrams`) | Diagram-first readings for architects, with the text equivalent as the phone form |
| Runtime section: Fastify routes, Effect layers, Awilix registrations (07 §2.3 F, 05) | **reshaped**: the Runtime panel shows the structural neighbourhood of the Spec's implementation anchors (component, layer, context, and the units they use with file and line) and reads runtime observation as not tracked (`spec-page#rule.runtime`). The framework-specific content is **retired**; anchors carry a generic `role`, `layer` and `context` | Architecture by context, layer and role; the seed's "interface as the unit of reasoning" (05 §5) is a reading choice, not a model one |
| Bindings with "open in IDE" (07 §2.3 G; click-through to source, 06 §8) | **shipped** for the code host: bindings list each unit, test anchor, example or oracle with its file and line as text and a copy action (`spec-page.core#rule.bindings`). When a stamp names a source template, each recorded file and line links to the code host (`sharing#rule.sourceLinks`); this repository's preview workflow stamps a template at the merge commit (`sharing#design.workflowSource`). Editor links are refused: the page set "writes no editor URI" (`spec-page#rule.sourceText`) | Editor deep links, the seed's "open in IDE", would need a Spec of their own; a desktop surface over the working tree (exploratory) is where they would fit. Pages opened through `file://` and Pack exports show file and line as text only |
| Verification panel with harness coverage and `MISSING TEST` rows (07 §2.3 H) | **reshaped**: `has-verifier` says a verifier binding exists, never that it passed. For a Spec that owns an example space, the verification panel shows recipe 44's coverage grid, slot by slot, with `no example` for a value no example binds (`verification-panels#rule.coverageGrid`), and the tests lens counts keyed rules an enabled example exercises (recipe 34) | Coverage over combinations of slot values, the seed's matrix, is held by the blocking question `spec:consumers.agent-surface.combination-coverage#question.combinationCoverage` on a Spec stated at `idea`. A matrix reading must stay honest about what "covered" means |
| Evidence: SLSA, SBOM, OTel, deployments (07 §2.3 I, 08) | Runtime observation is **deferred** behind `observed` (`spec:observation.runtime-overlay`, stated at `idea`). Build attestations, deployments and bills of materials are **not carried**: the evidence lens reads each source as not tracked, because "no Spec designs a source for the other three" (`lenses.evidence#rule.notTracked`) | Honest empty states now; the evidence readings wait for `observed` and for a Spec that designs a source for supply-chain inputs |
| Impact panel, upstream and downstream; `impactOf` "one of the most-used queries" (07 §2.3 J, 03 §8) | **reshaped** and **shipped**: the Spec page's Impact panel draws the trace graph one hop each way and lists what the Spec rests on (recipe 21) and every Spec that rests on it, by distance (recipe 30) (`spec-page#rule.impact`); `sdp-impact-view` shows it on its own (`components#design.impactView`). File-level blast radius (recipe 4) and the planning slice (recipe 19) stay recipes | Impact is the most important verb for architects and engineers. No reading yet starts from a changeset or a file |

## Working with the Studio

| Seed idea | What became of it | Design opportunity |
|---|---|---|
| Patch panel, always visible: pending changes, Discard, Export, Open as PR (07 §2.4) | **reshaped** as the composing panel, on every page (`intent-panel#rule.everyPage`): gathered intents persist in the browser's local storage under the page set's own key (`intent-panel#rule.persist`); a `Preview memo` disclosure shows the text that `Copy memo` and `Save memo` hand off (`intent-panel#ui.memoPreview`); the panel requests nothing over the network (`intent-panel#rule.noRequest`) | Within one page set the panel already follows a person across pages and refreshes. Carrying gathered intent across page sets, devices, people and surfaces is the open part. A commercial surface could carry the memo onward; that is exploratory, and the Studio Spec names hosted review, shared comments and hosted previews only as possible later `@libar-ai/` work |
| "Propose via AI" emits a prompt rather than running AI; "the browser never has API keys" (07 §4) | **kept** as a posture: the memo is the hand-off and the agent does the work; the page opens no pull request, because a static page holds no credentials (`intent-panel#rule.handOff`) | Keep this as the boundary for every AI option in [05](05-specialised-and-ai-readings.md) |
| Harnesses: controls, expected result, coverage, "Propose scenarios" (04 §4, 07 §7) | **reshaped**: example spaces, space contracts and an implementation-side oracle; witnesses mark covered outcome classes; proposing examples for values no example binds is a composing action. **Deferred**: running a scenario harness waits for its own Spec (the decision that the Studio renders derived HTML, MD-41) | Stakeholders playing with inputs to confirm expectations was a real job. A static reading can show the space and its witnesses; evaluating the oracle live needs a surface that can run code |
| Architecture lens subpages: capability map, container and component maps, forbidden dependencies, a force-directed dependency graph (07 §8) | **shipped** in part: the capability map page (`spec:consumers.spec-studio.capability-map-page`), the architecture lens by context and layer, and the architecture walk as a rules file (recipe 42). The lens draws planned components apart from realized ones (`lenses.architecture#rule.plannedApart`) and draws no import the impact graph infers (`lenses.architecture#rule.membershipAndUses`); inferred imports reach a reader only through the curation report (recipe 40) | Inferred structure must stay visibly separate from curated intent; the seed's 03 §4.3 already said dotted, faded, never authoritative. Today the lens keeps it out entirely |
| Tests lens: coverage by capability, flaky tests, slow tests, orphans (07 §9) | **shipped** in part: one row per Spec that is not an example, with its verifier binding, enabled verifiers, rule coverage and example-space coverage (`lenses.tests#rule.coverageRows`); with run records supplied, labelled external pass and fail counts that are never a verdict on the Spec (`lenses.tests#rule.bindingsOnly`, recipe 45). Flaky and slow tests need a series of runs over time, which no input supplies | Run history over time is outside the graph; a CI surface (exploratory) could supply it as named evidence |
| Status report for leadership, generated, "nobody had to write it" (00 §9) | **not carried**. The closest readings are the roadmap page, recipe 53's board with recipe 55's memo for each roadmap (`roadmap-page#rule.roadmapPage`), and the owner queue page (`owner-queue#rule.queuePage`) | A leader reading that is honest by construction is a strong tier-1 candidate |
| `akg watch`: the same generated Studio served locally with live reload (02 §10) | **reshaped**: `sdp studio --watch` republishes after carrier changes; it serves no page and injects no script, so a reader reloads (`publisher.watch#rule.watch`) | The natural base for a desktop surface over the working tree (exploratory) |
| Stale open question after a time limit (06 §6.3.6) | **retired**: staleness never becomes graph structure or workflow authority (the planning-truths decision, MD-33); an open question carries no status or date (`spec:model.open-question-fields`), and the Spec page shows none (`spec-page.core#rule.questions`) | A neutral reading of question age, derived from git history supplied as a named input, stays a candidate. It must never become a flag or a gate, and it would revise the no-date and no-history rules (`spec-page.core#rule.questions`, `shell#rule.noRecentEdits`) |

## Things the seed got right about adoption

Seed 08 §9.10 is product advice, not mechanism, and it still holds:

- Start with one bounded context.
- **Make the Studio the first visible win**; the checks come second.
- **Pair adoption with an existing pain** (a refactor, an audit, onboarding) so the cost is tied to a
  visible benefit.

Each of those pains is a reading: an impact reading for the refactor, a trace reading for the
audit, a tour for onboarding. They are good candidates for the first role-specific readings.

## What the seed modelled that the graph does not

Some seed concepts have no home in today's graph: the seed's optional `owner` on a Spec (its
open-question owner survives as `decider`), `tags`, decision statuses, run results and timestamps.
Design must not assume them. [03 — What the graph does not hold](03-reading-material.md#what-the-graph-does-not-hold)
keeps the one absence list and says what would supply each; new gaps go to the
[graph needs log](07-graph-needs.md).
