Lane S needs changes before integration. The reading is useful, but two contracts conflict with lane G, and the prototypes miss important planned-component and folded-example cases.

Reviewed `fe1d7e5` against base `44e62ef`, including the four prototype pages and all 19 screenshots. Read-only graph queries report no errors and only the expected `honesty/gaps` warning on `spec:model.spec-sections`. Recipe 9 confirms the reported floors. All six independently re-run Pack boundary comparisons match Pack design.

1. **Blocking — `spec:consumers.spec-studio.slice-page#rule.dependencyDrawing`.** Lane S and lane G define incompatible dependency drawings, so independent builders would disagree about edges, depths, folding and element ids.

   At lane G’s `1d7b3c9`, the dependency kind excludes `refines`, computes depth from zero, folds depth bands before the boundary, and uses `.dependency.text`. Lane S includes refinement in its ordering, applies the statement queue’s reciprocal-refinement exception, starts at one, specifies boundary folding, and uses `.dependencies.text`. This changes the design being read, beyond its appearance.

   **Concrete change:** retain recipe 54 as the owner of the slice’s ordering semantics. Replace the drawing rule’s duplicated layout prescription with:

   > The dependency drawing consumes recipe 54’s members, depths, rests-on links, structure edges, cycles and boundary rows without recomputing their scope or order. It retains every supplied relation’s type and direction. The shared dependency drawing owns layout, bounded folding and the complete text equivalent; a fold changes no recipe value.

   Coordinate with G to admit this supplied-order mode, including `refines` and the distinction between an ordering link and an original relation. In `#ui.drawingIds`, use G’s `.dependency.text` and `.dependency.arrow` names. Resolve this contract before treating the current stand-in drawings as acceptance evidence.

2. **Blocking — `spec:consumers.design-slice#design.architectureShape`.** Recipe 54 cannot supply the architecture drawing lane G specifies.

   G’s scoped-architecture contract requires separate planned and anchored identities, immediate `uses` neighbors outside the touched set, original unit edges behind aggregated counts, and unreadable declarations. S supplies merged component rows, aggregated uses only between touched components, and neither outside-use context nor unreadable rows. The page also promises to render its recipe answer rather than assemble additional architectural facts.

   **Concrete change:** extend the keyed architecture contract to carry:

   - Every member component design, including matching realized designs, with its planned attributes and realization correspondence.
   - Immediate outside `uses` neighbors, explicitly marked outside scope and excluded from touched-component totals.
   - The original anchored unit `uses` edges behind each aggregate.
   - Recipe 43’s unreadable rows for member designs, alongside its differing rows.

   Give each addition a keyed row shape, ordering rule and summary form. Keep planned values apart from anchored values. Coordinate these fields with G’s scoped-architecture input, and change `#ui.drawingIds` from `.architecture.*` to the agreed `.scoped-architecture.*` names.

3. **Should fix — [slice-recipe.mjs](/tmp/plan47-wt/S/reviews/assets/plan47-prototypes/S-design-slice/slice-recipe.mjs).** The prototype loses or mislabels component designs as anchors appear.

   Read-only, in-memory probes reproduce three failures:

   - A component anchor that exists without satisfying its design produces `planned: false`, although recipe 43 correctly reports the design as unrealized with `anchorExists: true`.
   - A matching realized design disappears from the component’s `designs` list.
   - Planned uses disappear once the design is realized, including when another planned attribute still differs.

   The prototype selects designs from `comparison.unrealized` and `comparison.differing`; those are exception lists, not the inventory of component designs.

   **Concrete change:** enumerate every member component design using the planned-architecture convention. Derive realization from the corresponding anchored `satisfies` binding, preserve all design ids and declared uses, and attach recipe 43’s comparison results separately. Prototype absent anchors, anchors without satisfying bindings, matching realization, differing realization and unreadable declarations. Include at least one planned-component page capture, since neither real corpus exercises that branch.

4. **Should fix — `spec:consumers.spec-studio.slice-page#rule.exampleRows`.** Unconditional example folding hides a member’s individual readiness and dependencies, contrary to the page’s promise to show what each member needs next.

   A probe with a ready parent and a scoped example carrying a blocking question leaves only the parent in the member table. The example’s unmet clause disappears from that reading. The drawing similarly drops relations whose endpoint is a folded example. A parent’s verifier count cannot communicate those facts, and it may count verifying examples outside the slice.

   **Replace the rule with:**

   > An example member counted in its parent remains readable in a disclosure within that parent’s row. The disclosure names each example and shows its own stated rung, floor reached, stated next rung and unmet clauses, with a link to its Pack card. Folding never transfers readiness or bindings to the parent. The drawing’s complete text equivalent retains every folded example and its original relations.

   Keep the compact parent boxes, but show the folded-member count separately from the count of examples that verify the parent. Add a probe where a folded example has a blocking question and a dependency its parent does not have.

5. **Should fix — `spec:consumers.design-slice#design.sliceRecipe`.** The refusal contract leaves the diagnostic values and precedence to prototype code, so a builder and test author still need to agree outside the Specs.

   The entry pins `{ scope, problem }` but does not define the `scope` values, messages, ordering or whether failures accumulate. The prototype also accepts `detail: null` as the summary through `?? false`, although the Spec admits only absence, a boolean or a list of ids.

   **Concrete change:** add keyed diagnostic entries covering invalid detail, missing or doubled scope, unknown Pack, malformed Spec list, unresolved Spec id, malformed member subset, non-member subset id, and `members` beside a Spec-list scope. State accumulation and ordering explicitly. The prototype’s existing strings can become the contract.

   For example, pin:

   > `detail` outside the admitted forms, including null, returns `{ scope: "detail", problem: "Expected true, false or a list of member ids." }`.

   Also add an explicit `componentSummary` shape. `#design.componentRow` currently refers to replacing “three lists” with counts, while the prototype replaces `designs`, both member-binding lists and `restsOn`, and drops `label`.

6. **Should fix — `spec:consumers.spec-studio.slice-page#ui.memberTable`.** At phone width, the table hides the next-rung answer without a visible cue that more columns exist.

   In `platform-history-view-phone-members.png`, “What each member needs next” shows Member, Depth and part of Rung. Next rung, Design carried and Code are beyond the viewport. Horizontal scrolling exists, but the tall rows make it difficult to retain the member identity while inspecting the right side.

   **Append this text to the UI entry:**

   > At narrow widths, each member reads as a stacked row whose title, stated rung, floor and stated next rung remain together. Design counts and binding counts follow in a disclosure. If a table remains horizontally scrollable, a visible instruction names that action and the member identity remains available while reading its other cells.

   Re-capture the phone view with a member whose next rung has an unmet clause, so the evidence shows the page’s main answer.

Keep these parts:

- The slice as a reading of existing Specs, with Pack, perspective-selected and explicit-list scopes. It adds no grouping type or workflow state.
- The separate Pack and slice pages, and the route through outside Specs to architecture before member code exists. The unbuilt roadmap Pack demonstrates why that route matters.
- The distinctions between stated readiness, floor reached, waiting statements and binding evidence. The advisory ordering and absence of a design score are sound.

Both Specs’ stated rungs are honest: `defined`, with floors of `ready` for the recipe and `defined` for the page. The glossary question is flagged for the owner, and delegated choices are listed separately. The design-round guidance supplies the requested distinction between shared contracts and details left to implementation.

I could not save `/tmp/plan47-reports/S-review-sol.md` because this session’s filesystem is read-only. No repository files were changed.
