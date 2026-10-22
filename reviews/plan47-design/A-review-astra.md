Reviewed `f1581eed4dfbec3f2457830f088a3c64b6021d2a` against `44e62ef`. Changes are required before accepting lane A’s proposed anchor edits. Two recommendations would make the graph less accurate; two further corrections are needed to make the register follow its own binding and role rules.

1. **Blocking. [Component dependency table](/tmp/plan47-wt/A/reviews/plan47-annotation-review.md:442): the proposal removes `component:protocol.projections → component:protocol.extract` despite a real architectural value import.**

   [gherkin-view.ts](/tmp/plan47-wt/A/src/projections/gherkin-view.ts:1) imports `GHERKIN_KIND_LIE_REASONS` from `extract/gherkin-kind-honesty.ts` and uses it to render the required loss explanations. The supplied imports file records this file pair. Recipe 40 reports no mapped component import because the policy file currently lacks membership, precisely the omission the proposed `impl:protocol.gherkin-kind-policy` anchor would repair.

   Replace the table’s witness with `src/projections/gherkin-view.ts → src/extract/gherkin-kind-honesty.ts` and its action with:

   > Keep. The Gherkin read projection consumes the shared kind-refusal policy to render loss explanations. Recipe 40 cannot currently map the imported policy file to extract because it has no component binding; the proposed policy anchor supplies that membership.

   Remove the instruction to delete this edge from the following paragraph and correct the corresponding claims in “What the review found” and the designer’s report. Keep the five proposed dependency additions. This follows `spec:protocol.significant-units-review#rule.dependencyEvidence` and the existing `#componentUses` law.

2. **Blocking. [Missing-responsibilities row for `impl:protocol.gherkin-kind-policy`](/tmp/plan47-wt/A/reviews/plan47-annotation-review.md:375): the proposed anchor claims to realize the TypeScript importer, which does not consume this policy.**

   The graph says `spec:carrier.sdp-import` promises TypeScript-to-Markdown conversion. The policy’s source consumers are the canonical Gherkin reifier and the Gherkin read projection, as shown by `src/extract/gherkin.ts` and `src/projections/gherkin-view.ts`. No import implementation calls it. The proposed `satisfies` target therefore violates the requirement that each satisfying unit realize at least one promise of its target.

   Replace the row’s `Satisfies` cell with:

   > `spec:carrier.gherkin-authoring`, `spec:consumers.gherkin-view`

   Replace its reason, also repeated in the bare-file table, with:

   > The kind-refusal policy is shared by canonical Gherkin reification and the Gherkin read projection. It supplies canonical refusal explanations and the projection’s per-kind loss explanations.

   Keep the proposed identity, file, role and component. `spec:consumers.gherkin-view` explicitly promises the loss commentary this table supplies.

3. **Should fix. [Importer dispositions](/tmp/plan47-wt/A/reviews/plan47-annotation-review.md:293): keeping the scan and publication bindings unchanged preserves `references` where the units realize explicit Spec promises, and the publication row incorrectly calls its binding identity-only.**

   The current graph records `references: spec:carrier.sdp-import` on both units. [scanImportPaths](/tmp/plan47-wt/A/src/cli/import-scan.ts:69) implements the ordinary-directory traversal, exclusions, `.sdp.ts` selection and physical-identity deduplication promised by that Spec. [publishImports](/tmp/plan47-wt/A/src/cli/import-publish.ts:30) implements its exclusive temporary siblings, atomic no-clobber publication and rollback promise.

   Add these binding corrections to the proposed change table for both identities:

   - Retain the identity, file and component.
   - Set `satisfies` to `[spec:carrier.sdp-import]`.
   - Remove that target from `references`, leaving the list absent.
   - Retain the other units already satisfying the Spec.

   Replace the publication row’s reason with:

   > Retain the identity and change its binding from references to satisfies. It realizes the importer’s exclusive staging, atomic no-clobber publication and rollback promise.

   Replace the scan row’s reason with:

   > Retain the identity and change its binding from references to satisfies. It realizes the importer’s source-selection, exclusion and physical-identity deduplication promise.

   These are corrections under the binding-grain decision’s set reading, not new delivery claims for an unfinished feature. The Spec already states `ready` and has satisfying units.

4. **Should fix. [Role dispositions in the register](/tmp/plan47-wt/A/reviews/plan47-annotation-review.md:231): two retained roles contradict the new vocabulary’s distinction between presentation, orchestration and publication.**

   `impl:protocol.studio-recipes` remains `projection`, although [studioRecipeAnswers](/tmp/plan47-wt/A/src/projections/studio/recipes.ts:40) orchestrates recipe evaluation and stores answers for renderers; it produces neither presentation nor generated contract content. `impl:protocol.sdp-import-publish` remains `service`, although it owns the filesystem publication and recovery responsibility defined by `spec:protocol.role-vocabulary#term.publisher`.

   Change the proposed dispositions to:

   > `impl:protocol.studio-recipes`: projection → service. Coordinates shipped recipe evaluations once per build and shares their answers with page renderers.

   > `impl:protocol.sdp-import-publish`: service → publisher. Owns exclusive staging, atomic no-clobber publication and cleanup of imported Markdown siblings.

   Keep the vocabulary definitions. These corrections apply `#design.roleChoice` and `#design.presentationWord` consistently to the reviewed code.

What is good and should remain:

- The two Specs honestly state `defined`; recipe 9 reaches `ready` for both without floor failures. Read-only graph validation reports only the existing `honesty/gaps` warning on `spec:model.spec-sections`. Owner acceptance remains explicit and separate from delegated rulings.
- The register accounts for all 219 current CodeNodes exactly once and all 324 test/oracle anchors. The component map, explicit helper exclusions, target-transfer ledger and independently authored oracle expectations provide a useful basis for the build.
- The five proposed component dependency additions are supported by source. The treatment of builder-only imports and the platform’s unmapped files is sound; apply that same caution to the Protocol’s Gherkin policy.
- All four screenshots are readable at their recorded widths. The prototypes preserve omitted roles and membership, separate realization from reference, and avoid implying owner approval. Their HTML contains one source row per CodeNode and no broken in-page links.

I could not save `/tmp/plan47-reports/A-review-astra.md` because this session grants read-only filesystem access. The complete report is above.
