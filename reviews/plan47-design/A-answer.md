Lane A's reviews are answered in commit `d97418f27dc4ec6b057142ad32e0bd656b71a9f1`. The revised [annotation review](/tmp/plan47-wt/A/reviews/plan47-annotation-review.md) corrects both blocking binding errors, explains the decoder boundary choice, and opens each component with a curated reading map. A [proposed-state preview](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-proposed.html) shows the changes before source anchors are edited. Both lane Specs remain `defined`. Validation reports zero errors and exactly the existing warning.

1. Specs changed and measured readiness

   | Spec | Stated rung | Recipe 9 floor | Current floor failures |
   | --- | --- | --- | --- |
   | [significant-units-review](/tmp/plan47-wt/A/specs/protocol/significant-units-review.sdp.md) | `defined` | `ready` | None |
   | [role-vocabulary](/tmp/plan47-wt/A/specs/protocol/role-vocabulary.sdp.md) | `defined` | `ready` | None |

   The accepted-set Spec now carries durable roster law. Review-document procedure stays in the annotation review, general authoring guidance stays in the proposed skill edit, and the Studio panel has an exact proposed consumer child for integration to author. The role Model uses `index` for GraphIndex, removes migration-only terms, distinguishes orchestration from publication, and defines component roles.

   No new Spec was authored in this lane. Keep the existing arc Pack order, significant-units-review then role-vocabulary. Integration should add the proposed `spec:consumers.spec-studio.lenses.architecture.unit-register` after those two and after its parent in `pack:spec-studio-v1`. Its carrier and Pack edits are proposals in section 5, outside this lane's ownership.

   Close measurements were rerun, not inherited. The current graph still has 219 CodeNodes, 176 carrying roles across 12 values, and 324 test/oracle anchors. The identity ledger accounts for every CodeNode once. It proposes 14 additions, 11 merges and one drop, plus role, target and membership corrections. The simulation would leave 221 CodeNodes and preserves all 144 currently realized Spec targets. That proves target bookkeeping; the source and promise readings remain necessary semantic evidence.

2. Rulings made on delegation

   | Ruling | Carrying entry |
   | --- | --- |
   | A significant unit owns a contract or responsibility a designer must understand; export status or import rank alone is insufficient. | `spec:protocol.significant-units-review#rule.significantAbstractions` |
   | Mechanical wrappers, forwarding barrels, empty registrations and formatting helpers stay bare unless independently significant. | `spec:protocol.significant-units-review#rule.curatedBoundary` |
   | Component uses requires a direct value or type dependency; anchor-authoring imports and unused re-export reach confer no edge. Inspect unassigned files before declaring an edge stale. | `spec:protocol.significant-units-review#rule.dependencyEvidence` |
   | The independently reviewed roster pins membership, roles and dependencies; neither imports nor the graph under test generates its expectations. | `spec:protocol.significant-units-review#rule.rosterOracle` |
   | GraphIndex builds disposable lookup maps over the one graph and uses the role `index`. | `spec:protocol.role-vocabulary#term.index` |
   | Presentation uses projection, publication uses publisher, and optional DOM controls use interaction. | `spec:protocol.role-vocabulary#design.presentationWord` |
   | A component role names its members' dominant group responsibility; an evenly split component omits it. | `spec:protocol.role-vocabulary#design.componentRole` |

   The corrected proposal keeps projections → extract, removes the false importer target from the Gherkin policy, and gives that policy satisfying targets for canonical Gherkin refusal and the Gherkin view's loss commentary. Import scanning and publication change their existing importer references to satisfies because they realize explicit promises of that already implemented Spec.

   The review now assesses all ten existing uses edges with a non-component endpoint and proposes six selected unit relationships. It retains the existing drop of the empty-registration identity and adds the missing same-file binding-language merge. Every merge retains its target promises. The small Markdown stage-result union stays bare under explicit parser coverage.

3. Decisions for the owner

   | Question | Options | Recommendation and confidence |
   | --- | --- | --- |
   | `spec:protocol.significant-units-review#question.acceptedRoster` | Accept the revised annotation review, or accept selected rows while retaining other identities or coarse-grain coverage. | Accept the revised proposal. High confidence in corrected bindings, direct-import witnesses, duplicate merges and role repairs; medium confidence in the value of separate internal Studio contract identities. |
   | `spec:protocol.significant-units-review#question.notationBoundary` | Keep the decoder in notation and declare its graph/validate dependencies, exposing a lawful component cycle; or assign its membership to reader while retaining its source file. | Assign it to reader. Medium confidence. It reads GraphSchema, emits Finding values and serves reader/codegen consumers; notation can remain a leaf slot codec. |

   Under the recommended membership, add import → notation, reader → notation and codegen → reader. Keep cli → notation absent because CLI callers import generateContracts and do not consume the re-exported notation symbol. Keep every existing component uses. The current and proposed component graphs are acyclic. If the owner retains decoder membership in notation, declare its real graph and validate imports and show that cycle as data; neither choice changes Protocol validation.

   The three proposed reversals of reviewed coarse-grain rows are explicit in the review: mergeParams, assertMarkdownEmissionFidelity and gherkinKindLieReason. Owner acceptance of the replacement roster includes these reversals. No new decision record is proposed. Readiness statements remain with the executing thread; priority and plan retirement remain with their assigned lanes and the owner.

4. Prototypes

   Assets and reproduction commands are in [A-register/README.md](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/README.md).

   | Artifact | What it shows |
   | --- | --- |
   | [register.mjs](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/register.mjs), [proposal.mjs](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/proposal.mjs) | Query both corpora and render current bindings; apply the review tables only to an in-memory copy for the proposed Protocol page. |
   | [Protocol current](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol.html), [platform current](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform.html) | Recorded roles, membership, source locations and separate realization/reference targets. |
   | [Protocol proposed](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-proposed.html) | Explicitly labelled "proposed, not applied"; shows the proposed roster bindings and provisional decoder membership. New and relocated sites have no invented source line. |
   | [Protocol desktop](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-1440.png), [phone](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-390.png); [platform desktop](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform-1440.png), [phone](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform-390.png) | Refreshed current-state captures at 1440 × 1000 and 390 × 1000. |
   | [Proposed desktop](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-proposed-1440.png), [phone](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-proposed-390.png), [reader detail](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-proposed-reader-1440.png) | The proposal caption, component roles and decoder under reader. |
   | [check.mjs](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/check.mjs), [studio.css](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/studio.css) | Reproducible browser checks and the incumbent Studio stylesheet. |

   All seven screenshots were inspected. Browser checks passed on all three pages at both widths: one source row per unit, unique identities, working in-page links, no horizontal overflow and native keyboard disclosure activation. The panel sorts component ids, role tokens and unit ids in code-unit order, with omitted roles last. It shows role tokens alone, requiring no Protocol-corpus vocabulary id in an adopter. The mechanical design detector reported no findings.

5. Exact proposed edits outside this lane

   Replace the first paragraph under Curate the anchors in `.agents/skills/sdp-authoring/SKILL.md` with:

   ```md
   Anchors are curated, never a coverage quota. Start with the public contracts and cross-component responsibilities a designer or builder must understand: ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters. Read the code before adding an identity. An export, an import ranking, a test expectation or a desired file-impact answer does not establish significance. Leave a mechanical wrapper, forwarding barrel, empty registration or formatting helper bare unless it owns an independent contract. Record the consuming responsibility without claiming a binding at the helper file.

   An identity has one file owner. Several Specs realized by one responsibility normally share an anchor with plural targets; independent contracts, entry points and semantic policies in one file may keep distinct identities when their separate design use is clear. Before merging or dropping an identity, list every promise its targets carry and name the surviving units that still realize it. Transfer targets only when that set remains true, or explicitly record a false claim being removed. Review imported value and type contracts when declaring component uses, exclude imports made only to author anchors and unused re-export reach, and inspect external-input omissions and unassigned files before deleting an edge. A realizing unit documents its local how, never a paraphrase of the Spec's what or why.
   ```

   Replace only the architecturally significant unit definition in `specs/model/structural-patterns.sdp.md` with:

   ```md
   - **architecturally significant unit** — A code unit with exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand to change a system guarantee. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters may qualify; being exported, re-exporting other units or appearing in an import ranking is insufficient by itself. Its anchor records component membership, a role and references to the designs it answers to. An architectural dependency is declared as `uses`, normally between components; a unit's own `uses` is optional.
   ```

   Replace the criterion rule in specs/protocol/structural-self-binding.sdp.md with:

   ```md
   - rule: [#criterion] The engine applies the structural-patterns model's significance criterion: exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand; being exported alone is insufficient.
   ```

   In CONTEXT.md, replace only the architecturally significant unit row's definition with the following, leaving its aliases unchanged:

   ```md
   a code unit with exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand (being exported or ranking high on imports is not enough by itself), and that warrants graph-visible structural binding, with component membership, a role, and references to the designs it answers to, with uses declared for its architectural dependencies, normally between components (a unit's own uses is optional); annotated on the anchor of the code that realizes it; the accepted set is an owner-reviewed declaration, never derived from imports (carried by `spec:model.structural-patterns`)
   ```

   This reads the architectural-annotation decision's criterion as a necessary condition, consistent with its "anchors are curated, never a coverage quota". It is drift repair, not a new decision. The decision's text changes only by the owner's hand. If the owner wants its consequence aligned, replace only "The engine significance criterion stays exported public surface or cross-component reach" with "The engine significance criterion requires exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand; being exported alone is insufficient". Keep the remainder of that consequence unchanged. No new registry row is proposed.

   Integration authors specs/consumers/spec-studio.lenses.architecture.unit-register.sdp.md with this exact text, then lists it after the two annotation Specs in the arc Pack, and after its parent in pack:spec-studio-v1:

   ```md
   ---
   id: spec:consumers.spec-studio.lenses.architecture.unit-register
   kind: behavior
   altitude: story
   readiness: defined
   relations:
     refines: spec:consumers.spec-studio.lenses.architecture
   ---
   # Find significant units by component and role

   ## Intent

   - outcome: Let a contributor find recorded units and their design bindings through their component and role, with omitted structure visible.

   ## Behavior

   - rule: [#recordedOnly] The architecture page groups recorded members by role within each recorded component, and shows a component's own source binding apart from its members. A row shows the recorded id, label, file and line and its satisfies and references targets separately. The page reads graph bindings only, never an annotation review or oracle source file.
   - rule: [#omissions] Keep a not-stated role group and a no-component section. A binding confers no review approval or execution verdict, and the page shows no inferred accepted badge.
   - rule: [#roleTokens] Show each recorded role token without interpreting it through a Protocol-corpus Spec id. An adopter's unfamiliar roles remain visible and produce no finding.
   - rule: [#stableOrder] Sort components by id, role groups by token and members by id in code-unit order, with not-stated roles last and the no-component section after the components.
   - rule: [#staticAccess] Every row is available without script through native disclosures. The component index links to the existing component section ids, and narrow screens retain readable source paths and separate realization and reference lists.

   ## Verification — reviewed

   - Render the self-hosted corpus and an adopter with unfamiliar roles, omitted roles and omitted membership. Check ordering, component source rows, target separation, keyboard disclosures and narrow-screen overflow, with no inferred approval badge.
   ```

   The child is a proposal outside lane A's edit ownership, not an authored new Spec in this branch. Its rung and Pack memberships must be re-measured when integration authors it. No recipe number, external register input or new public command is requested.

6. What the build needs

   After the owner's go, apply the accepted binding changes and independent oracle updates together. The annotation review specifies every new id, file, comment form, role, component and target list, the merge transfers and the selected uses edges. Relocate envelope-contract to markdown-frontmatter.ts using the comment form; that parser has no builder import. Preserve the existing code and invocation when dropping the empty-registration identity.

   Update `test/self-hosting-oracle/structural-edges.ts`, `test/self-hosting-oracle/anchors.ts` and the changed Spec/relation snapshots. Remove the three reversed coarseGrainCoverage rows and add the parser-result coverage rows. Update architecture recipe cases in `test/recipes.test.ts` that remove or retain agent-surface to use the surviving reader identity. The existing `impl:protocol.structural-self-binding` adds `spec:protocol.significant-units-review` to satisfies when the replacement roster lands; its oracle realizes the accepted-set law, not a review document.

   Keep missing-member and extra-member tests meaningful. Verify transferred targets, importer target corrections, policy consumers, relocated bindings, roles and decoder membership against fresh extraction. Integration authors the proposed architecture child and coordinates its placement with lane G. Page tests cover ordering, unfamiliar roles, omissions, component source rows, distinct satisfies/reference targets and the absence of an inferred approval badge.

   The capability map, roadmap, design slice and diagram kinds still fit existing reader, recipe, projections and studio-elements components. No new planned component or recipe number is requested. Lane G should reuse the diagram contract and layout responsibilities; lane S should select architecture from recorded membership, uses and design bindings. Lanes E and R need no new component from this lane.

   Apply the guidance and aligned criterion text deliberately, regenerate import evidence outside generated output, rerun architecture recipes, then run `npm run check` after source and oracle edits. Do not generate the independent accepted roster from the prototype simulation.

7. Changes to the brief and original design

   The comprehensive review remains: every existing CodeNode, every bare source file, all component pairs with import/uses evidence, roles, the platform and the arc's component placement. The component sections now start with named contracts and change consequences; complete identity ledgers are collapsed. Label-derived reasons are marked "Label stands". The repetitive test/oracle appendix is one explicit retention statement.

   I removed review-procedure promises from the accepted-set Spec and proposed the panel under the architecture consumer family. I dropped the proposed identity-only Markdown result anchor, added the binding-language merge, made coarse-grain reversals explicit, and reviewed unit relationships as well as component pairs. The proposed-state page makes the owner's roster choice visible before implementation.

8. Risks, open questions and validation

   Identity edits still require a fresh whole-Spec promise pass when built. The in-memory simulation proves target preservation and structural bookkeeping, not semantic realization. The decoder boundary and usefulness of the internal contract identities remain owner review points. The consumer child is exact proposed text awaiting integration authorship and readiness measurement.

   The platform remains read-only. Repeated recipes 17, 28, 40 and 43 still report 76 code units, 37 with roles across 11 values, and no component designs following the convention. Its selected imports input has 140 files, ten uses-without-import rows and two imports-without-uses pairs. Bare audit writers, audit schema and diagnostic policy remain useful guidance examples; missing membership still prevents a stale-edge ruling. Its application roles remain its own vocabulary.

   Repeated Protocol recipes 12, 13, 15, 17, 27, 28, 32, 40 and 43 retain the source baseline. Recipe 40 has 156 files, 36 bare files, 11 imports-without-uses pairs and one uses-without-mapped-import row. The Gherkin policy explains why that last row is not a stale edge; unused barrel reach explains cli → notation. The inputs were retained outside generated output, and their omission fields were inspected.

   Passed: the required validation command with zero errors and exactly `honesty/gaps` on `spec:model.spec-sections`; recipe 9 for both lane Specs; `check:temporal`; Prettier; ESLint for the prototype scripts; script syntax checks; diff whitespace checks; target-preservation and cycle checks; and the browser checks in section 4. The full `npm run check` remains the integration gate after source bindings and pinned oracle expectations change.

9. Commit

   `d97418f27dc4ec6b057142ad32e0bd656b71a9f1` on `p47/a-annotations`, "Correct annotation review bindings and proposed architecture preview". It follows design commit `f1581eed4dfbec3f2457830f088a3c64b6021d2a` from base `44e62ef`. The worktree is clean. No source, test, Pack, glossary, decision-registry or skill file was edited. Nothing was pushed or merged.

10. Every review finding and its disposition

   These are design corrections. Source-anchor application waits for the build. Every fixed row is in commit `d97418f`; proposed edits to protected families are carried as exact text in the annotation review and section 5.

   | Review finding | Disposition and checkable result | Commit |
   | --- | --- | --- |
   | Opus 1: projections → extract removal | Fixed. Keep the edge; the witness is gherkin-view.ts → gherkin-kind-honesty.ts, whose missing membership explains recipe 40. | `d97418f` |
   | Opus 2: false Gherkin policy importer target | Fixed. Remove sdp-import; satisfy gherkin-authoring and gherkin-view, and reference the carrier-universality decision. Both actual consumers are named. | `d97418f` |
   | Opus 3: unreported component cycle | Fixed. Add the notationBoundary owner question, explain the lawful cycle and recommend reader membership. The proposed preview applies that provisional choice and checks acyclicity. | `d97418f` |
   | Opus 4: cli → notation is unused barrel reach | Fixed. Keep absent; strengthen dependencyEvidence and use direct source witnesses. CLI callers import generateContracts from contracts.ts, not its re-exported notation symbol. | `d97418f` |
   | Opus 5: mixed Spec scope and unrealizable review promises | Fixed. Remove procedure and duplicate guidance entries; remove registerView. Integration owns the exact proposed consumer child because lane ownership forbids authoring it here. Name the roster oracle's future satisfying binding. | `d97418f` |
   | Opus 6: GraphIndex role suggests a second read model | Fixed. Use the keyed index term and utility → index proposal. | `d97418f` |
   | Opus 7: criterion wording drifts across owners | Fixed. Propose exact structural-patterns, structural-self-binding and glossary text, with an owner-only alignment of the decision consequence. No new decision is claimed. | `d97418f` |
   | Opus 8: inventory overwhelms curated map; weak witnesses | Fixed. Add component reading lists with change consequences, collapse ledgers, mark label-only reasons, remove the evidence appendix, and correct model witnesses. | `d97418f` |
   | Opus 9: inconsistent same-file merge test | Fixed. Merge binding-language-pack-table into index-table, transfer its target, and explain every source file retaining multiple identities. | `d97418f` |
   | Opus 10: silent reversal of coarse-grain rulings | Fixed the three explicit reversals. Rebutted the rule-only target requirement: the binding-grain set reading accepts a whole-Spec promise, and sdp-import carries the equal-graph outcome in its example space. It has no rule key; the review names that exact promise and source comparator. | `d97418f` |
   | Opus 11: missing unit-level relationship review | Fixed. Assess all ten current non-component-endpoint uses edges and add six source-backed collaborations. The suggested vault-sync → vault-notes edge is rebutted: sync.ts imports no note provider; CLI coordinates them. | `d97418f` |
   | Opus 12: corpus-specific role definitions and order | Fixed. Proposed child and prototype show tokens alone and use deterministic code-unit ordering, with omitted roles last. | `d97418f` |
   | Opus 13: identity-only markdown-results | Fixed. Leave it bare; propose explicit MarkdownFrontmatterResult and MarkdownBodyResult coarse-grain rows under markdown-parser. | `d97418f` |
   | Opus 14: importer publication target and role | Fixed. Retain the identity, move importer references to satisfies and use publisher. | `d97418f` |
   | Opus 15: transition prose in role Model | Fixed. Remove renderer/utility terms and migration wording; keep those renames in the review only. | `d97418f` |
   | Opus 16: undefined component role | Fixed. Add componentRole and distinct reasons for every component, including CLI orchestration and projections' dominant presentation responsibility. | `d97418f` |
   | Opus 17: roles contradict their definitions | Fixed. Studio recipes uses service, StudioData contract, help/version presentation projection, and service no longer names publication. | `d97418f` |
   | Opus 18: recipe identity and relocation build gaps | Fixed. Build instructions include test/recipes.test.ts identity cases and comment-form relocation of envelope-contract. | `d97418f` |
   | Opus 19: test-internal names in Spec design | Fixed. rosterSource states the independent row contract without pinning test paths or constant names. | `d97418f` |
   | Opus 20: current-only prototype | Fixed. Add the proposed, not applied page, in-memory table application, preservation/cycle checks and refreshed screenshots. | `d97418f` |
   | Opus 21: unflagged document vocabulary | Fixed. Use annotation review and component in authored prose; call the UI a significant-units panel. Existing source labels remain recorded verbatim. | `d97418f` |
   | Astra 1: projections → extract is real | Fixed. Retain the edge and bare-policy witness. The accompanying recommendation to keep all five additions is rebutted in part by Opus 3/4's verified direct-import and boundary evidence; the revised proposal adds three component edges. | `d97418f` |
   | Astra 2: policy does not realize TypeScript import | Fixed. Use both proposed Gherkin satisfying targets and their refusal/loss-commentary promise reading. | `d97418f` |
   | Astra 3: scan/publication references understate realization | Fixed. Both existing identities move the importer target to satisfies, leaving references absent and other realizing units intact. | `d97418f` |
   | Astra 4: recipe evaluator/publication roles | Fixed. Studio recipes uses service and importer publication uses publisher, with responsibility-specific reasons. | `d97418f` |
