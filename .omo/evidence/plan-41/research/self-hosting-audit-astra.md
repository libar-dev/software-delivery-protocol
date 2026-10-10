The Protocol self-hosts its extraction and validation well. Its weaker area is **using the corpus as the working environment for iterative design**. Much of the necessary representation already exists, but the repository uses it unevenly: one enormous review Pack, incomplete question addressing, little declaration-level design, and live guidance that still points to superseded decisions.

The first adopter’s strongest contribution is a repeatable review practice around capability Packs. Copying that practice would deliver more immediate value than adding another primitive.

This audit changed no files and ran neither `sdp build` nor `sdp validate`. Counts below were measured through read-only `q` calls on 2026-10-10. They are not a full-green-gate claim.

## 1. Where the Protocol’s design lives today

### The graph

I extracted and executed recipes **1, 2, 7, 8, 9, 11, 20, 22 and 26 verbatim** from their fenced JavaScript blocks. Recipe 9 used its catalog sample, `spec:model.enrichment-lifecycle`. I also ran recipes 24 and 27.

References to “R1”, “R20”, etc. below mean those executions of the [recipe catalog](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/agent-surface/recipes.md:81).

The graph contains **228 Specs, 2 Packs, 465 nodes and 1,076 edges**.

| Spec family | idea | scoped | defined | ready | Total |
|---|---:|---:|---:|---:|---:|
| carrier | 0 | 0 | 22 | 25 | 47 |
| consumers | 3 | 10 | 6 | 26 | 45 |
| decisions | 0 | 2 | 1 | 40 | 43 |
| extraction | 0 | 0 | 5 | 19 | 24 |
| model | 0 | 1 | 8 | 9 | 18 |
| observation | 1 | 0 | 0 | 0 | 1 |
| protocol | 0 | 0 | 2 | 0 | 2 |
| validation | 0 | 0 | 14 | 34 | 48 |
| **Total** | **4** | **13** | **58** | **153** | **228** |

The family count was derived with this query body:

```js
const families = {};
for (const s of g.specs()) {
  const family = s.id.slice(5).split(".")[0];
  families[family] ??= { idea: 0, scoped: 0, defined: 0, ready: 0 };
  families[family][s.statedReadiness]++;
}
return {
  specs: g.specs().length,
  nodes: graph.nodes.length,
  edges: graph.edges.length,
  families,
};
```

| Measurement | Current result |
|---|---|
| R1 operational build backlog | **0**; excludes 66 ready examples and 40 ready decisions; no excluded example lacks a verifier |
| R2 implemented below ready | **16**, all stated `defined`, all derive `ready`, all have no unmet floor clause |
| R7 stated readiness above the floor | **0** |
| R8 findings | **0 errors, 14 warnings**: 5 `honesty/gaps`, 9 `conformance/prose-mentions` |
| R9 sample | Enrichment lifecycle is `scoped`; `defined` is held by a blocking open question |
| R11 lower ladder | **75 Specs**: 4 idea, 13 scoped, 58 defined |
| R20 open questions | **44 on 25 Specs**; 9 blocking across 8 Specs; no malformed questions |
| Question keys, counted from `sections.intent.openQuestions` | **27 keyed, 17 unkeyed**; 4 of the unkeyed questions block |
| R22 mention audit | 48 occurrences, 42 pairs: 25 forward-backed, 8 reverse-only, 9 unbacked, 0 unresolved |
| R26 dependency cycles | **0** cyclic sets and **0** self-dependent Specs |
| R24 pinned declarations | **9 entries on one Spec**, all custom-element names on `spec:consumers.spec-studio.components` |

Only **7 Specs have a Design section**, and **7 have a UI section**. That is not a quality score, but it explains why self-hosting exercises the adopter’s design-heavy usage poorly.

The two Packs are:

| Pack | Membership and purpose |
|---|---|
| [`pack:self-hosting-v1`](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/self-hosting.pack.sdp.md:1) | 225 members: 150 ready, 58 defined, 13 scoped, 4 idea. A corpus-wide aggregate, with `protocol-domain` and `core-model` as model references. |
| [`pack:spec-studio-v1`](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/consumers/spec-studio.pack.sdp.md:1) | 12 members, all scoped, in reading order. All 12 also belong to the self-hosting Pack. R27 finds no implementation, reference or verifier bindings on them; 9 members relate to implemented Specs they build on. |

The Studio Pack is already a useful example of design ahead of code. Its absence of bindings is honest.

### The other homes

| Home | What it carries today | What belongs in a ruled graph home |
|---|---|---|
| `plans/` | Commissioning context, execution evidence, historical dispositions and re-entry conditions. Plans 35, 37 and 40 are EXECUTED; 36 is DRAFTED lineage with its commissioned work closed; 38 and 39 are DRAFTED pointers. | Current dependencies, refusals, deferred intent and blocking questions. Plan 38 largely follows this split, but some deferral conditions remain only in older plan prose. |
| Surviving `docs/concept/` documents | Product ambition, principles, old implementation descriptions, deferred representations and roadmap rationale. | Durable intended behavior, constraints, decisions and open questions. Exposition may remain after those truths have carrying Specs. |
| `DECISIONS.md` | Ratified names, concise glosses, curation and canonical pointers. | Decision substance already belongs in decision Specs. The registry should remain an index, but must expose amendments and point to current carriers. |
| `CONTEXT.md` | Ratified terms, aliases, candidate terms and some model exposition. | Keep the vocabulary here. Behavioral guarantees and representation detail belong in Specs rather than accumulating in the glossary. |
| `docs/lineage/` | Historical v0 design and annotation research. | Selected forward intent belongs in sub-ready Specs; the historical text remains evidence. The Studio Pack and plan-40 decisions demonstrate this transfer. |
| `reviews/` | Review prompts, findings and closure evidence. | Accepted changes belong in carrying Specs; unresolved durable questions belong on their subjects. Review occurrences and historical verdicts remain git-backed evidence. |
| `.agents/skills/` and recipes | Operational instructions for reading, authoring and routing work. | Their product guarantees already have consumer Specs. They should cite law, not become a competing owner of it. |
| `AGENTS.md` | Repository instructions and a current-state summary. | Repository operations can remain here. Live readiness and design disposition should resolve through graph queries instead of a growing status digest. |

The placement rule is explicit in the ready [planning-truths decision](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/decisions/planning-truths-placement.sdp.md). [Plan 38](/Users/darkomijic/dev-libar/software-delivery-protocol/plans/38-graph-first-planning-arc.md:15) correctly distinguishes decisions, existing guarantees, blocking holds and lawful non-decisions. Historical plans are not automatically misplaced intent.

### Design truth that has not fully dissolved

I searched these concepts through `g.findByConcept(term)` and inspected the returned owners. “No owner found” below means no carrying Spec emerged from those searches; it is not a claim that no related word occurs anywhere.

| Remaining truth | Evidence and graph position |
|---|---|
| Interoperability with design tools, visual-regression and accessibility artifacts; tenant variants, federation and per-language extraction | [Vision, lines 35–38](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/00-vision-scope-and-mvp-boundary.md:35). Searches for `accessibility`, `visual-regression`, `design-tool`, `tenant`, `federation`, `per-language`, `multi-repo` and `polyglot` returned no Specs. |
| OpenAPI/AsyncAPI and JSON-LD/PROV-O/SHACL export intent | [Consumers, export table](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/06-consumers-and-projections.md:196). `OpenAPI` returned no match. LikeC4 is mentioned by the Studio components Spec, but that is not an export contract. |
| Token-budgeted bundles and GraphRAG retrieval | [Consumers, deferred agent capabilities](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/06-consumers-and-projections.md:100). `budget` and `GraphRAG` returned no Specs. The Studio data question mentions a context bundle without defining it. |
| “One runtime truth” and framework-composition adapter intent | [Authoring, runtime bindings](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/04-authoring-and-binding.md:132). Studio’s `runtimeComposition` question preserves the v0 problem, but searches for `one runtime truth` and `runtime composition` found no carrying law. |
| Harness as a projection of the example space plus an anchored oracle | [Authoring, harnesses](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/04-authoring-and-binding.md:157). Studio captures a harness element and questions about its subject and coverage, but not this complete contract. |
| Optional static-authoring lint, per-ID carrier configuration and generated Spec-ID union | [Authoring, lines 50 and 63](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/04-authoring-and-binding.md:50), [principles, L8](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/01-founding-principles-and-invariants.md:99). `spec-static` and `spec-ids` returned no Specs. Canonical-surface search found existing carrier rulings, not the deferred configuration. |
| Architecture enforcement, incremental extraction, caching and sharding | [Roadmap cut list](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/07-mvp-roadmap-and-open-questions.md:51). Searches found no owners for enforcement, incremental extraction or sharding; the caching hit concerned HTML generation cost. |
| Confidence on inferred edges | [Principle P10](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/01-founding-principles-and-invariants.md:48) says inferred edges carry confidence. The graph edge shape has no confidence field; the Studio responsive Spec records that mismatch as an open question. |

These need capture or deliberate retirement, not immediate implementation. The ready [concept-dissolution decision](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/decisions/concept-docs-dissolve.sdp.md) requires semantic transfer before deletion, with deletion separate from the carrying change.

## 2. Self-hosting gaps

### 2.1 Review scope is missing where it matters

There is no annotations Pack, adopter-hardening Pack or graph-first-planning Pack. A 225-member aggregate cannot provide the same review focus as a capability Pack.

More concretely, these three Specs belong to **no Pack at all**:

- `spec:decisions.anchor-binding-grain`
- `spec:decisions.anchor-comment-form`
- `spec:decisions.architectural-annotation`

Evidence:

```js
return g.specs()
  .filter(s => s.packs.length === 0)
  .map(s => s.id);
```

Pack membership is optional, so this is a review omission, not a conformance error. Existing Packs are sufficient to repair it; no `inArc` relation is needed.

### 2.2 Plan 38’s deferral transfer is incomplete

The graph-first-planning Spec says deferred work carries its own blocking questions, but its [re-entry rule](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/consumers/graph-first-planning.sdp.md:27) merely names three candidates.

The actual conditions for the **reference projection** and **structural-edge Mermaid** remain in [plan 35’s H table](/Users/darkomijic/dev-libar/software-delivery-protocol/plans/35-agent-surface-adoption-and-self-binding.md:78). Concept searches find each phrase only on graph-first-planning. Neither has its own deferred Spec carrying that condition.

Studio’s package-home and unserved-reader conditions did transfer into keyed questions. The context-bundle condition remains in plans 35/37 and concept prose without a dedicated owner.

Smallest repair: capture each surviving deliverable at `idea`, with its actual re-entry condition as a keyed blocking question.

### 2.3 Seventeen questions cannot be addressed stably

R20 plus a key count finds **17 unkeyed questions**, including these four blockers:

| Spec | Blocking question |
|---|---|
| `consumers.graph-first-planning` | How an arc boundary is represented |
| `consumers.impact-graph` | Language-neutral identity and extraction boundary |
| `model.enrichment-lifecycle` | What design detail survives implementation |
| `observation.runtime-overlay` | Observation identity and freshness boundary |

All IDs in this table have the `spec:` prefix.

Keys are optional by law. The defect is practical: the Protocol does not consistently use the addressing mechanism it built for the adopter. Keying these questions changes neither their meaning nor readiness.

### 2.4 The 16-Spec drift queue needs individual dispositions

R2 identifies:

| Family | Defined Specs carrying `implemented` |
|---|---|
| carrier | `inline-code-spans`, `markdown-body-grammar` |
| consumers | `adopter-on-ramp`, `agent-surface.address-and-cycle-recipes`, `agent-surface.register-recipes`, `projections-model`, `shipped-protocol-corpus` |
| extraction | `open-section-order`, `pack-member-order`, `regenerability` |
| model | `core-model`, `open-question-keys` |
| validation | `next-rung-floor`, `prose-mentions`, `typed-dependency-floor`, `unbound-example-posture` |

Every row derives `ready`; none has an unmet floor clause. That does **not** justify bulk promotion.

Three recurring rows have substantive recorded reasons: unfinished projection/measurement work, unsupported measurement thresholds, and the enrichment-lifecycle question. Those reasons appear in [plan 37’s disposition table](/Users/darkomijic/dev-libar/software-delivery-protocol/plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md:109). In particular, `regenerability` still asserts “measured evidence” thresholds in its current Spec.

The useful repair is to separate:

- complete intent waiting for an owner statement;
- mixed realized and deferred scope needing enrichment or promotion;
- unsupported claims needing evidence or correction.

Changing `satisfies` to `references` merely to clear the alarm would be equally misleading.

### 2.5 Five ready Specs have no resolving verifier

R8 names:

- `spec:carrier.markdown-authoring`
- `spec:extraction.claim-taxonomy`
- `spec:model.pack-aggregate`
- `spec:model.relations`
- `spec:model.spec-sections`

These are intentional, oracle-pinned warnings, not newly discovered regressions. See [expected warnings](/Users/darkomijic/dev-libar/software-delivery-protocol/test/self-hosting-oracle/index.ts:52).

The omission is a direct, reviewable verification story for these broad contracts. A child’s verifier does not automatically verify its parent. Bind a verifier only where the test actually checks the parent’s promise; otherwise retain the honest gap.

### 2.6 Nine prose pairs lack relations, but not all need one

R22 reports the following unbacked pairs. IDs omit `spec:`.

| Mentioning Spec | Target |
|---|---|
| `carrier.markdown-body-grammar` | `validation.authored-honesty` |
| `carrier.markdown-parser` | `carrier.inline-code-spans` |
| `consumers.adopter-on-ramp` | `carrier.markdown-body-grammar` |
| `consumers.delivery-session-on-ramp` | `decisions.planning-truths-placement` |
| `consumers.delivery-session-on-ramp` | `decisions.shipped-projections-frozen` |
| `decisions.architectural-significance-rides-primitives` | `model.structural-patterns` |
| `decisions.carrier-ruling` | `decisions.carrier-universality` |
| `decisions.jsdoc-graph-extraction-refused` | `model.spec-sections` |
| `decisions.planning-truths-placement` | `consumers.impact-graph` |

The oracle pins the pairs, but supplies no pair-specific reason for leaving them as prose. The adopter’s “relation or recorded reason” practice would make review clearer. Do not invent a dependency merely to silence a warning, especially inside superseded decision records.

### 2.7 Current prose still teaches superseded intent

Concrete examples:

- [Authoring and binding, lines 87–97](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/04-authoring-and-binding.md:87) describes constant-only extraction, one target per anchor and structural fields as aspirational. Plan 40’s ready decisions supersede those descriptions.
- [Roadmap, line 73](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/07-mvp-roadmap-and-open-questions.md:73) still treats richer anchor structure as unresolved; line 102 calls watch/scaffolding forward-looking despite plan 35.
- [Studio lenses](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/consumers/spec-studio.lenses.sdp.md:12) still declares `decidedBy` to superseded MD-34 and asks its architecture question against the old vocabulary.
- [Studio Spec page, line 23](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/consumers/spec-studio.spec-page.sdp.md:23) says component and uses are the only structural fields.
- [AGENTS.md, line 30](/Users/darkomijic/dev-libar/software-delivery-protocol/AGENTS.md:24) says one first-adopter Spec remains held by an owner question. Plan 39 records that authored-entry-order was ratified and built in round 2; the graph states it `ready`.
- AGENTS.md’s “capture-rung” summary also obscures that `structural-patterns` and `structural-self-binding` now state `defined`.

These are repairable drift, not reasons to reverse the ready decisions.

### 2.8 The registry does not expose its important exceptions

[DECISIONS.md’s MD-32 row](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/concept/DECISIONS.md:43) describes the freeze without pointing to the two ready, narrowly superseding decisions:

- `spec:decisions.authored-entry-order`
- `spec:decisions.question-key-rendering`

Neither appears in its auxiliary pointer list. D4 still points to concept chapter 06 rather than `spec:consumers.design-review`.

The graph contains the amendments. The human entry point should reveal them.

### 2.9 Vocabulary debt needs classification

A case-insensitive scan of `CONTEXT.md` found no occurrence of:

> question key; next rung; target rung; dependency cycle; Spec Studio; panel; shell; custom element; gathered intent; hand-off; build stamp; hosted preview; harness; pinned declaration; capability Pack; Pack page; ahead; not compared; anchor site; register row.

However:

- **Mention and entry address already have candidate definitions**, explicitly awaiting the checked-mentions record’s `ready` statement. They are not missing. See [CONTEXT.md:232](/Users/darkomijic/dev-libar/software-delivery-protocol/CONTEXT.md:232).
- **Readiness floor and derived readiness are defined**; “stated rung” is already used.
- “Bound” occurs in other ratified senses, but the adopter’s **bound/ahead/not-compared pair** does not.
- “Lens” occurs descriptively; an advisor **pass** is not defined by occurrences of tests passing.

Prioritize semantic distinctions such as question key, pinned declaration, pass and pair. Ordinary UI nouns can remain local to Studio Specs. The adopter’s work vocabulary should not become new Protocol states.

## 3. Patterns the adopter uses that the Protocol’s own corpus does not

A fresh query of the adopter found **243 Specs, 6 Packs, 60 Specs with Design sections, and 166 open questions, all keyed**. Its history-view Pack has **19 members and 53 open questions**. The decision-register JSON contains **175 rows**: 45 decided, 82 sorted, 21 waiting, 12 unsorted and 15 folded. These are local register states, not Protocol readiness.

| Adopter practice | Evidence | Smallest useful Protocol adoption |
|---|---|---|
| Capability review across package boundaries | [PLAN §6.7](/Users/darkomijic/dev-libar/libar-platform/design/PLAN.md:596); history-view’s 19 members | Add a small ordered Pack for the current design-management work, with shared laws referenced rather than copied. |
| One page combining design and realization | [History-view page](/Users/darkomijic/dev-libar/libar-platform/design/pages/history-view.md:9) combines rungs, outside dependencies, questions, register rows, bindings and pairs | First compose a Pack-scoped recipe from existing reader data. Use it for a real review before choosing a shipped projection change. |
| Pinned declarations compared with implementation | [Emitter](/Users/darkomijic/dev-libar/libar-platform/scripts/pinned.mjs:1), [type comparisons](/Users/darkomijic/dev-libar/libar-platform/tests/types/pinned.test-d.ts:43) | Pin one important Protocol contract, derive it locally, and prove that changing the pin breaks a comparison against implementation. |
| Explicit design ahead of code | [PLAN §6.7, items 1, 3 and 7](/Users/darkomijic/dev-libar/libar-platform/design/PLAN.md:600) | Use `references` for incomplete realization; promote a coherent independently realized part to its own Spec. Keep pair comparisons separate from delivery facts. |
| Repeated review from named perspectives | [Pass task](/Users/darkomijic/dev-libar/libar-platform/design/advisors/task-pass.md:1) | Write an advisory review recipe for one Pack, with Protocol-relevant lenses and findings addressed to entries or sections. Fold accepted changes into Specs; keep pass evidence in git. |
| Questions joined to decisions and proposed rulings | [Register contract](/Users/darkomijic/dev-libar/libar-platform/design/advisors/register.md), [register data](/Users/darkomijic/dev-libar/libar-platform/design/decisions/register.json) | Key the questions and link them from a review docket. Put durable rulings in decision Specs and subject-level `decidedBy` relations. |
| Address integrity outside Specs | [check.py](/Users/darkomijic/dev-libar/libar-platform/design/tools/check.py:67) sends addresses in code, tests and work records to recipe 25 | Add a repository-local check over explicitly selected files, using the existing resolver. |
| Explicit dispositions for unbacked mentions | [check.py:156](/Users/darkomijic/dev-libar/libar-platform/design/tools/check.py:156) | Record a short reason for each intentionally unbacked self-hosting pair and remove stale dispositions when the warning disappears. |
| Review feedback improves the review page | Pass task requires a sentence on what the page could not answer | Capture those reports as evidence on the relevant consumer Spec instead of designing the entire Studio in advance. |

Two cautions matter. The adopter’s page is **generated by a hand-built script**, not manually maintained Markdown. And its script still reparses carrier text for entry lines and “other Design entries” through [`specLines`](/Users/darkomijic/dev-libar/libar-platform/scripts/pack-page.mjs:291). That is evidence of a Protocol limitation, not a pattern to copy unchanged.

## 4. Design-management capability gaps in the engine

| Need | What is lawful today | Missing capability or ruling boundary |
|---|---|---|
| Show a Pack’s internal shape and outside dependencies | Ordered members, typed relations and Spec contexts already support the query. | A composed review view is missing. No new primitive is needed. Reshaping a frozen shipped projection requires a narrow superseding decision; a local recipe does not. |
| Identify which entries are realized | Split independently tracked content into Specs; use whole-Spec bindings and non-conferring references. | **Departed**, explicitly ruled by ready `spec:decisions.anchor-binding-grain`, MD-37. Entry-address bindings and partial-realization facts were refused. Restoring them requires superseding that decision. |
| Compare a pinned declaration with code | Recipe 24 supplies declarations; adopter-owned generation and tests are expressly allowed. | No generic emitter or comparison model ships. This is a deliberate second-adopter threshold, stated in [contract-declarations](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/extraction/contract-declarations.sdp.md:24), not missing carrier support. |
| Record design passes and findings | Git-backed memos; accepted truth in Specs; remaining uncertainty in keyed questions. | The graph has no pass, reviewer, approval or persisted human-finding type. Add advisory practice first. A new graph model would need a ruling preserving the no-workflow boundary. |
| Join a decision to the exact question it settles | A decision can cite a question address in prose; its subject can declare `decidedBy`. | There is no typed question-resolution edge or persistent closed-question entity. Removing the question also removes its live address. Semantic resolution/history in the graph needs a new ruling; git evidence does not. |
| Link a reader directly to a Design or question entry’s source line | Stable addresses resolve; anchors expose file and line. | Primitive and Pack nodes intentionally lack lines. [Schema comments](/Users/darkomijic/dev-libar/software-delivery-protocol/src/graph/schema.ts:129) explain this, and [regenerability](/Users/darkomijic/dev-libar/software-delivery-protocol/specs/extraction/regenerability.sdp.md:16) forbids consumers reparsing source. A producer-owned entry-location map needs authored design and compatibility decisions. |
| Compare design between review passes | Git provides prior versions; graphs can be derived for chosen revisions. | No shipped semantic design-diff view joins changed entries, decisions, questions and affected Packs. Start as a comparison recipe; do not add a mutable history store. |
| Draw architecture before code exists | Model/contract Specs, Design entries, Packs and typed Spec relations. | **Departed** from v0’s independent declared Component: ready `spec:decisions.architectural-annotation`, MD-38, places the component on realizing code. Inventing pre-code CodeNodes would violate that ruling. |
| Distinguish “next author rung” from “next unmet structural rung” | Stated and derived readiness are both present. | Recipe 9’s `nextRung` is above **derived** readiness. The adopter page describes the rung above **stated** readiness. A combined review must name these separately; they diverge when the floor is already ahead. |

The last distinction is observable in the code: [recipe 9](/Users/darkomijic/dev-libar/software-delivery-protocol/docs/agent-surface/recipes.md:370) indexes from `derivedReadiness`, while the adopter’s [reading guide](/Users/darkomijic/dev-libar/libar-platform/design/pages/history-view.md:15) describes the next stated rung. An empty failure list must not be presented as owner approval.

Other v0 differences should remain classified as **departed**, rather than missing features:

- Named coordinates on one Spec: `spec:decisions.one-primitive`.
- Content-only sections and exclusive promotion: `spec:decisions.content-only-sections`.
- Markdown default: `spec:decisions.carrier-ruling`.
- Rejection of lifecycle gating: `spec:decisions.adopt-the-nouns`.
- Bindings rather than test-result or approval facts: `spec:decisions.binding-not-liveness`.

The edit-model departure is also explicit current intent, but its carrier is the **defined behavior Spec** `spec:consumers.edit-model`; it should not be misrepresented as a separately ready decision.

## 5. Top 12 self-hosting improvements, ranked

| Rank | Improvement | Smallest lawful shape |
|---:|---|---|
| **1** | Repair current guidance that contradicts settled law | Update the stale anchor descriptions, Studio architecture questions and relations, and AGENTS.md’s held-Spec summary. Preserve historical decision records. |
| **2** | Give the active work a reviewable Pack | Add one ordered design-management Pack. Include the three plan-40 decisions in the self-hosting aggregate. No arc primitive or scheduling relation. |
| **3** | Finish question addressing | Add stable keys to the 17 unkeyed questions, starting with the four blockers. Preserve wording and blocking flags. |
| **4** | Complete the plan-to-graph transfer | Capture reference projection, structural-edge diagrams and context bundles at honest lower rungs, carrying the actual re-entry conditions from plans 35/37. |
| **5** | Review the 16 drift rows individually | Prepare owner-review packets from current contexts. Correct unsupported claims and separate mixed scope where warranted; promote only on an owner statement. |
| **6** | Use one Pack review query for actual design work | Compose members, stated/derived readiness, next unmet floor, external dependencies, decisions, questions and R27 bindings. Measure what reviewers still have to assemble manually. |
| **7** | Establish repeatable design passes | Extend the session practice with advisory lenses such as model integrity, authoring/adopter ergonomics, realization/verification and consumer usability. Findings cite entries; durable outcomes enter Specs. |
| **8** | Exercise pinned declarations on the Protocol itself | Select one meaningful public contract. Author the pin, derive a local module and compare it against the implementation. Require a changed pin to fail the comparison before expanding the practice. |
| **9** | Make the decision index reveal current rulings | Add pointers to authored-entry-order and question-key-rendering, annotate MD-32’s narrow amendments, and point D4 to its carrying Spec. Use keyed-question citations in review records. |
| **10** | Disposition the five gaps and nine mention pairs | Bind only meaningful parent verifiers. For each unbacked mention, declare the relation that fits or record why none does. Keep these informative rather than introducing new Protocol gates. |
| **11** | Capture remaining concept-only intent before dissolution | Transfer one coherent topic at a time into existing owners or new idea Specs. Reconcile contradictions first; delete exposition only in a later change after checking the transfer. |
| **12** | Address the demonstrated source-location limitation | Author an entry-location contract and compare representations that keep semantic graph equality stable. Use the adopter’s carrier reparse as the concrete demand; do not broaden this into entry-level delivery facts. |
