Lane A's design pass is complete and committed. The [annotation review](/tmp/plan47-wt/A/reviews/plan47-annotation-review.md) maps the engine's responsibilities, classifies every existing anchor, specifies missing abstractions and dependency changes, and records the platform findings. Both lane Specs state `defined`. Source anchors remain unchanged for the build after the owner's go.

1. Specs changed and measured readiness

   | Spec | Stated rung | Recipe 9 floor | Current floor failures |
   | --- | --- | --- | --- |
   | [significant-units-review](/tmp/plan47-wt/A/specs/protocol/significant-units-review.sdp.md) | `defined` | `ready` | None |
   | [role-vocabulary](/tmp/plan47-wt/A/specs/protocol/role-vocabulary.sdp.md) | `defined` | `ready` | None |

   No new Specs or Pack membership changes are needed. Keep the existing reading order in `pack:roadmaps-and-slices-v1`: significant-units-review, then role-vocabulary. Neither Spec was stated `ready` or given an implementation binding.

   The source walk covered all 156 TypeScript source files. The register classifies all 219 CodeNodes as 168 keep, 40 re-role, 10 merge and one drop. It separately retains all 324 test and oracle anchors as literal evidence bindings. It proposes 15 missing responsibilities, each with an id, file, form, role, component and explicit target lists. The register also accounts for every bare source file, naming either its proposed identity or the responsibility that consumes it.

   The main additions are the CLI argument and parameter codecs, corpus-rule runner, Markdown result contract and content stage, YAML policy, Gherkin kind policy, import-fidelity check, Design Review codec, Studio diagram and optional-input contracts, HTML codec, register answer shapes, page catalog and browser proposal contract.

   Re-measurement corrected the brief's role count: the base has 12 role values, with 176 labelled units and 43 unlabelled units. It has 297 satisfies, 31 references, 167 membership and 48 uses edges. Recipe 40 reports 36 bare source files, 11 component import pairs without uses and one uses pair without an import. These observations are review evidence, not acceptance quotas.

2. Rulings made on delegation

   | Ruling | Carrying entry |
   | --- | --- |
   | A significant abstraction owns a contract or responsibility a designer must understand; an export or import ranking alone is insufficient. | `spec:protocol.significant-units-review#rule.significantAbstractions` |
   | Mechanical wrappers, forwarding barrels, empty registrations and formatting helpers stay bare unless they own an independent contract. | `spec:protocol.significant-units-review#rule.curatedBoundary` |
   | One responsibility normally uses one file-owned identity with plural targets; independently useful responsibilities may retain separate identities. | `spec:protocol.significant-units-review#rule.oneOwner` |
   | Every merge or drop names the surviving realization of each target promise. No false realization claim is removed by this proposal. | `spec:protocol.significant-units-review#rule.preservePromises` |
   | Architectural value and type imports warrant uses; anchor-authoring imports do not. Missing component assignment must be inspected before an edge is called stale. | `spec:protocol.significant-units-review#rule.dependencyEvidence` |
   | The oracle roster remains an independent reviewed declaration, including deliberate exceptions, rather than a derivation from imports or the graph under test. | `spec:protocol.significant-units-review#rule.rosterOracle` |
   | Use projection for presentation, codec for representation encoding, publisher for artifact publication and interaction for optional browser controls. | `spec:protocol.role-vocabulary#design.presentationWord` |
   | Replace utility only after reading the responsibility; GraphIndex uses read-model, concept queries use reader and registrar integration uses adapter. | `spec:protocol.role-vocabulary#design.helperWord` |

   The ten merges consolidate duplicate build, carrier, schema, reader and evaluator identities. Their transfer ledger retains every satisfies target and relevant reference. A graph bookkeeping simulation retains all 144 currently implemented Spec ids; this establishes target preservation, while source review supplies the semantic justification.

   Drop only `impl:protocol.studio-view-elements`, the identity for empty element registrations. Keep its code and invocation. The existing studio-elements component entry already satisfies the same components Spec and owns the registration flow.

   Declare five component uses: cli → notation, import → notation, notation → graph, notation → validate and reader → notation. Remove projections → extract, which has no supporting source import. Keep the six builder-only model pairs absent. The register gives a disposition and import witness for every component pair present in either declared uses or inferred imports.

3. Decisions for the owner

   The remaining owner question is `spec:protocol.significant-units-review#question.acceptedRoster`: which proposed anchor and dependency changes become the replacement accepted set?

   The options are to accept the complete register, or accept the criterion and dependency repairs while retaining selected existing identities or leaving selected internal contracts bare. I recommend the complete register. Confidence is high for the dependency repairs, duplicate-identity merges and presentation-role cleanup; medium for the usefulness of separate identities for the internal Markdown and Studio result contracts. Those are the rows most worth challenging during review.

   `interaction` and `read-model` are proposed corpus role values, permitted by the existing architectural-annotation decision. They add no Protocol enum or validator. No new decision record is proposed. Priority, plan retirement and readiness statements remain with their assigned lanes and the executing thread.

4. Prototypes

   All assets are in [A-register](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/README.md).

   | Artifact | What it shows |
   | --- | --- |
   | [register.mjs](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/register.mjs) | Reads both corpora through `sdp q` and writes the static register pages. |
   | [Protocol HTML](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol.html) | Current component bindings and members grouped by recorded role, with the Protocol's Model definitions. |
   | [Platform HTML](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform.html) | The same layout with adopter roles, omitted roles and missing membership preserved. |
   | [Protocol desktop](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-1440.png), [Protocol phone](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-390.png) | Component navigation, readable source rows and responsive disclosures. |
   | [Platform desktop](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform-1440.png), [Platform phone](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform-390.png) | The same layout with longer application identities and unfamiliar role values. |
   | [studio.css](/tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/studio.css) | A local copy of the incumbent Studio stylesheet. |

   Screenshots were inspected at 1440 × 1000 and 390 × 1000. Browser checks opened every disclosure, found one source row per CodeNode, checked every in-page link target and confirmed no horizontal page overflow at either width. Native keyboard disclosure activation passed. The mechanical design detector reported no findings.

   This proposes a panel on the existing architecture page. Its rows show current graph bindings, including current omissions and spellings. They do not pretend the proposed anchor edits have landed or that an anchor records owner approval. The README names the source commits and exact rendering, capture and recipe commands.

5. Exact proposed edits to files outside this lane

   In `.agents/skills/sdp-authoring/SKILL.md`, replace the first paragraph under “Curate the anchors” with these two paragraphs:

   ```md
   Anchors are curated, never a coverage quota. Start with the public contracts and cross-component responsibilities a designer or builder must understand: ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters. Read the code before adding an identity. An export, an import ranking, a test expectation or a desired file-impact answer does not establish significance. Leave a mechanical wrapper, forwarding barrel, empty registration or formatting helper bare unless it owns an independent contract. Record the consuming responsibility without claiming a binding at the helper file.

   An identity has one file owner. Several Specs realized by one responsibility normally share an anchor with plural targets; distinct responsibilities in one file may keep distinct identities when their separate design use is clear. Before merging or dropping an identity, list every promise its targets carry and name the surviving units that still realize it. Transfer targets only when that set remains true, or explicitly record a false claim being removed. Review imported value and type contracts when declaring component uses, exclude imports made only to author anchors, and inspect external-input omissions and unassigned files before deleting an edge. A realizing unit documents its local how, never a paraphrase of the Spec's what or why.
   ```

   In `specs/model/structural-patterns.sdp.md`, replace only the architecturally significant unit definition with:

   ```md
   - **architecturally significant unit** — A code unit with exported public surface or cross-component reach whose contract or responsibility a designer or builder must understand to change a system guarantee. Ports, shared data shapes, pipeline stages, decision tables, catalogs, layout policies and adapters may qualify; being exported, re-exporting other units or appearing in an import ranking is insufficient by itself. Its anchor records component membership, a role and references to the designs it answers to. An architectural dependency is declared as `uses`, normally between components; a unit's own `uses` is optional.
   ```

   The source-anchor fields, relocation, transfers and dependency edits are specified in the register's change tables. Oracle updates follow those reviewed rows during integration. No edit is proposed to `CONTEXT.md`, `AGENTS.md`, the decision registry, existing Pack manifests or recipe contracts.

6. What the build needs

   Apply the accepted source-binding changes and update the independent expectations together. The main new sites are `src/cli/{build-args,params,corpus-rules}.ts`, the named Markdown and Gherkin policy modules, `src/import/markdown-fidelity.ts`, the Design Review codec, the Studio contract and page-catalog modules, and `src/studio-elements/proposal.ts`. Move the existing envelope-contract anchor to `src/extract/markdown-frontmatter.ts`.

   Update `test/self-hosting-oracle/structural-edges.ts`, the anchor and binding expectations in `test/self-hosting-oracle/anchors.ts`, and the changed Spec and relation snapshots. Preserve detection of both a missing accepted member and an extra unrostered membership. Check transferred targets, the relocated parser binding and role changes through the extracted graph.

   Lane G needs to settle the register panel's placement and shared consumer Spec ownership. Its page tests should cover role grouping, omitted role and membership, component source rows, separate satisfies/reference targets and the absence of an inferred approval badge. The proposed diagram-model identity names the existing contract its new drawings will use.

   Capability maps, roadmaps, slices and diagram kinds fit the existing reader, recipe, projections and studio-elements components. None currently warrants a new component design or speculative component anchor. Lane S should select architecture through recorded membership, uses and design bindings. Lanes E and R need no additional architectural component from this lane. No recipe number is requested.

   After the owner review: apply bindings and oracle rows; integrate lane G's panel; deliberately update the guidance and criterion; regenerate import input outside `generated`; rerun the requested architecture recipes; then run `npm run check` after the source and test edits.

7. Changes to the brief

   I expanded “every existing anchor” to account for the 324 test and oracle anchors as well as the 219 code units, while keeping evidence bindings outside the architecture roster. I added an explicit disposition for every bare source file so the review explains exclusions as well as additions.

   I proposed a register panel within the existing architecture page, with no new drawing or public command. It gives lane G a readable text route through the curated units without duplicating its diagram work.

   For the platform, I narrowed the final import example to authored runtime, harness and example roots with generated Convex directories excluded. A diagnostic pass including tests and generated declarations distorted the ranking. The final input's omissions remain explicit in the recipe answer.

8. Risks, questions and validation

   The platform was queried read-only; imports were built on `/tmp/plan47-platform-A`. Its graph has 76 code units, 37 with a role across 11 values. The final curation input has 140 files, 10 uses-without-import rows and two imports-without-uses pairs. Bare audit writers, audit table shapes and the diagnostic sink/codec are significant missing bindings. The high-fan-in byte-counting helper can remain bare. Missing component assignment explains several apparent mismatches, so this lane makes no stale-edge ruling for the platform. Its application roles remain its own vocabulary.

   The largest implementation risk is changing identities without transferring all promises and updating the independent roster. The transfer ledger addresses that risk, but each later implementation change still needs a fresh promise pass. The usefulness of the proposed internal contract identities and the register panel's final ownership remain review questions.

   Passed: the required validate command, with zero errors and exactly the existing `honesty/gaps` warning on `spec:model.spec-sections`; recipe 9 for both Specs; `check:temporal`; formatting and diff checks; prototype binding-exclusion checks; and the browser checks above. The full engine gate was not claimed: this is a design-only change, and integration must update the pinned self-hosting snapshots before running it.

9. Commit

   `f1581eed4dfbec3f2457830f088a3c64b6021d2a` on `p47/a-annotations`, “Design curated engine annotations and role vocabulary”. The worktree is clean. Nothing was pushed or merged, and the read-only platform copy was not edited.
