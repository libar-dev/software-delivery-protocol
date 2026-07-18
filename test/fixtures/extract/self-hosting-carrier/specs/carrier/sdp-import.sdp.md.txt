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

## Example space
```gwt-vocabulary
Given a TS-carrier spec
When importTypeScriptSpec runs
Then the emitted Markdown re-parses to an equal graph
```
