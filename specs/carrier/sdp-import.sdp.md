---
id: spec:carrier.sdp-import
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
---
# TypeScript-carried Specs can become Markdown twins

## Intent
- actor: A coding agent or maintainer.
- outcome: Convert a TypeScript-carrier Spec into an idiomatic `.sdp.md` twin beside its source.
- value: The TypeScript DSL survives as an import source while Markdown becomes the authored twin.

## Behavior
- rule: Import writes the emitted Markdown sibling beside the TypeScript carrier and never deletes the source carrier.
- rule: Import refuses an existing Markdown sibling rather than overwriting it.
- rule: Refusal outcomes retain the TypeScript reifier findings and add import-local findings honestly.
- rule: Import consumes the TypeScript reifier so source acceptance follows one validation path.
- rule: `sdp import` converts Spec carriers; Pack manifests are out of scope — the TypeScript manifest stays a lawful per-ID option.
- rule: A batch scans only bounded source directories, canonicalizes physical carrier identity, and computes every refusal and target collision before publishing any sibling.
- rule: Publication prepares exclusive temporary siblings and atomically creates targets without clobbering; rollback attempts every artifact, reports survivors, and never deletes a TypeScript source.

## Example space
```gwt-vocabulary
Given a TS-carrier spec
When importTypeScriptSpec runs
Then the emitted Markdown re-parses to an equal graph
```
