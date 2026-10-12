---
id: spec:carrier.sdp-import
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  decidedBy: spec:decisions.carrier-ruling
---
# A TypeScript-carried Spec can be converted to Markdown

## Intent
- actor: A coding agent or maintainer.
- outcome: Convert a TypeScript-carrier Spec into an idiomatic Markdown carrier beside its source.
- value: The TypeScript DSL remains an import source and a lawful per-ID option; the author chooses which carrier remains canonical.

## Behavior
- rule: Import writes the emitted Markdown sibling beside the TypeScript carrier and never deletes the source carrier.
- rule: A written Markdown sibling and its retained TypeScript source carry the same Spec id; before extracting both paths in one root, the author keeps one canonical surface by moving, renaming, excluding or removing the source, and the import success message explains this hand-off.
- rule: Import refuses an existing Markdown sibling rather than overwriting it.
- rule: Refusal outcomes retain the TypeScript reifier findings and add import-local findings honestly.
- rule: Import consumes the TypeScript reifier so source acceptance follows one validation path.
- rule: Import accepts only carriers whose builders come from the public package or its `/anchors` subpath; a relative builder import that a source checkout trusts during extraction is refused here.
- rule: `sdp import` converts Spec carriers; Pack manifests are out of scope — the TypeScript manifest stays a lawful per-ID option.
- rule: A batch walks only ordinary directory entries in requested source directories, skips dot-directories and `node_modules`, `dist`, `generated` and `coverage`, selects `.sdp.ts` files, canonicalizes physical carrier identity, and computes refusals and target collisions before publishing.
- rule: Publication prepares exclusive temporary siblings and atomically creates targets without clobbering; rollback attempts every artifact, reports survivors, and never deletes a TypeScript source.

## Design
- findingIds: `import/refusal`, `import/pack-unsupported`, `import/target-exists`, `import/unsupported-construct`, `import/invalid-source-path`, `import/no-sources` and `import/empty` name the importer's findings; retained TypeScript reifier findings keep their own ids.
- dryRun: `sdp import <path...> --dry-run` computes refusals and target collisions, prints the planned Markdown siblings and writes none.

## Example space
```gwt-vocabulary
Given a TS-carrier spec
When importTypeScriptSpec runs
Then the emitted Markdown re-parses to an equal graph
```
