# Large scopes and bodies others run

Read this before you read a Pack or a long list of Specs in one call, or write a body another caller
will run. The rest of the contract is `spec:consumers.agent-surface.evaluation-sink`.

## Read a large scope in parts

Recipe 36, The context bundle (`dist/recipes/36-the-context-bundle.js`), reads a Pack or a list of
Specs within a budget. Ask for `part: 1` with an explicit scope and check `diagnostics` and
`budgetExceeded` before using `part.of`. Then request every part with the same scope, budget and
declaration mode, and check that their members cover the scope. A refused bundle carries
`budgetExceeded: true`, `part.of: null`, `oversized` and no members: it is not partial. Raise the
budget or choose a smaller scope, and ask again.

## Entry adapters and frozen joins

You arrive holding a word, a file or a changeset, so those are the entry adapters:
`g.findByConcept`, `g.byFile` and `g.blastRadius`
(`spec:consumers.agent-surface#rule.entryAdapters`). `g.specContext`, `g.packContext` and
`g.resolveEntryAddress` are joins frozen into the reader: reach them with an id an adapter or a
recipe returned. Every other question is a body, and a durable one becomes a catalog recipe
(`spec:consumers.agent-surface#rule.growByRecipe`).

## A body others run

A body a machine, a rules file or the catalog runs returns its whole answer and never calls
`console`: `sdp q` passes console output to stdout, where it corrupts the answer. The package
exports `evaluateBody(body, { graph, report, params })` for a graph already held. A body answering
`{ findings }` runs as a rules file under `sdp validate --rules`, as `sdp-authoring` teaches.
