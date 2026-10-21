---
id: spec:consumers.spec-studio.data
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.reader
    - spec:extraction.pack-member-order
    - spec:validation.next-rung-floor
    - spec:consumers.pack-design
    - spec:extraction.entry-locations
    - target: spec:consumers.agent-surface.evaluation-sink
      reason: the build composes recipe answers through the same body evaluation `sdp q` runs
    - target: spec:consumers.design-diff
      reason: the base graph input is the design diff's base
    - target: spec:observation.run-evidence
      reason: the run records input is read only as run evidence
  constrainedBy: spec:extraction.determinism
---
# The Studio renders from the reader's values and embeds only what its script reads

The build writes each value into the page's markup, so a page reads in full as HTML. Search is the exception: a browser refuses a fetch from a page opened through `file://`, so the search page carries its index inside it. On the first adopter's corpus that index is too large to repeat on every page, which is why search runs on a page of its own. A page that shows a recipe's answer takes it from the recipe's own shipped body, so the page and `sdp q` cannot disagree. Two inputs may ride beside the graph, a base graph and run records; each is named where it shows, and without them the page set is what the graph alone writes.

## Intent
- outcome: Render every Studio page from the values the reader returns and the recipe answers composed over the same graph, so a page derives nothing of its own and carries only the data its script needs.

## Contract
- [#readerValues] The build renders the index from `specs()`, `packs()`, `findings()` and each Spec's design columns, a Pack page from `packContext` and the Pack totals, a Spec page from `specContext`, and the search page from the search index; every page's rail renders the rail values. A page states no value the reader did not return or a named recipe did not answer, apart from counts the build takes of those values.
- [#recipeEvaluation] The build composes each recipe answer a page shows by evaluating that recipe's shipped body, the one `dist/recipes/` holds, over the graph, reader and validation report it derived, with the parameters the page's design names, through the body evaluation `sdp q` runs; it re-implements no recipe, so a page and `sdp q` give one answer.
- [#embeddedData] A page whose script reads data embeds it in one `script` element of type `application/json` with the id `sdp-data`, serialized as JSON with every `<` then written as the six characters `\u003c`, so no text can close the element. The search page embeds the search index there; every other page embeds no data, because its values are in its markup.
- [#noDataFiles] The page set writes no data file of its own: an agent reads the graph through `sdp q`, and `sdp build` writes the serialized graph. An input adds pages and page sections, never a data file.
- [#noSlices] The Studio's data holds no context bundle or other AI slice: the context bundle is composed on each invocation and never saved, and a design pass composes one with its recipe when it needs it.
- [#namedInputs] Beside the graph the build reads at most two inputs, each named on the command line: a base graph, the graph object `sdp build` wrote at an earlier commit, which reaches recipe 35 as `params.base`; and run records, each one Common Test Report Format document, which reach recipe 45 as `params.runs`. The build reads neither in any other way.
- [#inputNaming] A page that shows an input names it in words, the base graph by its label when it was given one, its schema version and its Spec count, and a run as `spec:consumers.spec-studio.runs-page` names it; no page holds an input's path.
- [#inputsNeverGraph] An input never becomes graph data, a delivery fact, a finding, a rung or a verdict: no page counts a run toward a binding, and no difference from the base moves a rung.
- [#sameInputsSameBytes] Without inputs the page set is the one the graph alone writes; with them, the same graph and the same input bytes and labels write the same page set, byte for byte.

## Design
- packTotals: `{ members: number; unresolved: number; heldBelowNextRung: number; waitingForAuthor: number; entries: number; declarations: number; openQuestions: number; blockingQuestions: number; withImplementations: number; withReferences: number; restsOn: number; restedOnBy: number; verifiedBy: number; supersededBy: number }`, the totals recipe 29 returns for the Pack, each counted as that recipe counts it.
- railValues: `{ packs: { id: string; title?: string; members: { id: string; title?: string; statedReadiness?: string; ownsExampleSpace: boolean }[] }[]; findings: { errors: number; warnings: number } }`, the values every page's rail renders: each Pack in id order with its members in authored order, a member owning an example space when its Spec context carries one, and the validation report's findings counted by severity.
- searchIndex: `{ records: SearchRecord[] }`, one record per graph node, in id order.
- searchRecord: `{ id: string; nodeType: "Primitive" | "Pack" | "Anchor" | "CodeNode"; page: string | null; title?: string; label?: string; framing?: string; narrative?: string; sections?: Record<string, unknown>; file?: string; line?: number; specKind?: string; statedReadiness?: string; floorReached?: string | null; bindings: { edge: string; specId: string }[]; entries: SearchEntry[] }`: `title`, `label`, `framing`, `narrative` and `sections` exactly as the graph node holds them, the fields `findByConcept` reads; `page` the node's page path in the page set, null for an Anchor or a CodeNode; `file` and `line` as recorded; the kind and the two rungs on a Spec only, `floorReached` null when no rung derives; `bindings` the Specs an Anchor's or CodeNode's outgoing edges reach, with the edge type, and empty for any other node.
- searchEntry: `{ section: string; entry: string | null; key: string | null; address: string | null; line: number | null; text: string }`, one per value recipe 23's walk reaches in a Spec's narrative and sections, taken with no term: each string, and each value that is not a string under a key the author coins, as its JSON text; in that walk's order, with that recipe's entry path, coined key, address and line. A term matches an entry as that recipe matches it, a string by its key or text and any other value by its key only, so the entries a term matches are the rows recipe 23 returns for it.
- studioInputs: `{ base?: { graph: unknown; label: string | null }; runs: unknown[] }`, the inputs the command hands the build: `base` absent without a base graph, `runs` the run records in the order the command names them and empty without any.
- baseName: `{ label: string | null; schemaVersion: string; specs: number }`, how a page names the base graph: the label the command gave or null, the base graph's `schemaVersion`, and its count of Spec nodes.
- pageRecipes: the index and the glossary render reader values only; a Pack page adds recipe 35 with `pack` given a base graph; a Spec page adds recipes 21 and 34 with its id as `spec`, recipe 30 with its id in `specs`, recipe 44 with its id as `spec` when it owns an example space, recipe 51's rows for its entries, recipe 45's rows for its verifiers' files given run records, and recipe 35's parts given a base graph; the architecture lens renders recipes 17 and 43; the tests lens recipes 34 and 44, and 45 given run records; the registers recipes 20, 31, 24 with 51, and 33; the owner queue recipe 46; the diff page recipe 35 with `detail: true`; the runs page recipe 45; an export the values of the pages it holds.

## Example space
```gwt-vocabulary
Given an extraction root holding a Pack and its member Specs
Given the studio command is given the base graph {base:"none"|"an earlier graph of the root"} and the run records {runs:"none"|"one CTRF report"}
When the studio command runs twice with those inputs
Then the two runs wrote byte-identical files: {byteIdentical:boolean}
Then the page set holds the diff page: {diffPage:boolean}
Then the page set holds the runs page: {runsPage:boolean}
Then every page that shows an input names it and holds no input path: {inputsNamed:boolean}
```
