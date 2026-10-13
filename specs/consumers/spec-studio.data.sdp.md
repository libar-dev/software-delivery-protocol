---
id: spec:consumers.spec-studio.data
kind: contract
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.reader
    - spec:extraction.pack-member-order
    - spec:validation.next-rung-floor
    - spec:consumers.pack-design
    - spec:extraction.entry-locations
  constrainedBy: spec:extraction.determinism
---
# The Studio renders from the reader's values and embeds only what its script reads

The build writes each value into the page's markup, so a page reads in full as HTML. Search is the exception: a browser refuses a fetch from a page opened through `file://`, so the search page carries its index inside it. On the first adopter's corpus that index is too large to repeat on every page, which is why search runs on a page of its own.

## Intent
- outcome: Render every Studio page from the values the reader returns for the graph the agent surface reads, so a page derives nothing of its own and carries only the data its script needs.

## Contract
- [#readerValues] The build renders the index from `specs()`, `packs()`, `findings()` and each Spec's design columns, a Pack page from `packContext` and the Pack totals, a Spec page from `specContext`, and the search page from the search index; every page's rail renders the rail values. A page states no value the reader did not return, apart from counts the build takes of those values.
- [#embeddedData] A page whose script reads data embeds it in one `script` element of type `application/json` with the id `sdp-data`, serialized as JSON with every `<` then written as the six characters `\u003c`, so no text can close the element. The search page embeds the search index there; every other page embeds no data, because its values are in its markup.
- [#noDataFiles] The page set writes no data file of its own: an agent reads the graph through `sdp q`, and `sdp build` writes the serialized graph.
- [#noSlices] The Studio's data holds no context bundle or other AI slice: the context bundle is composed on each invocation and never saved, and a design pass composes one with its recipe when it needs it.

## Design
- packTotals: `{ members: number; unresolved: number; heldBelowNextRung: number; waitingForAuthor: number; entries: number; declarations: number; openQuestions: number; blockingQuestions: number; withImplementations: number; withReferences: number; restsOn: number; restedOnBy: number; verifiedBy: number; supersededBy: number }`, the totals recipe 29 returns for the Pack, each counted as that recipe counts it.
- railValues: `{ packs: { id: string; title?: string; members: { id: string; title?: string; statedReadiness?: string; ownsExampleSpace: boolean }[] }[]; findings: { errors: number; warnings: number } }`, the values every page's rail renders: each Pack in id order with its members in authored order, a member owning an example space when its Spec context carries one, and the validation report's findings counted by severity.
- searchIndex: `{ records: SearchRecord[] }`, one record per graph node, in id order.
- searchRecord: `{ id: string; nodeType: "Primitive" | "Pack" | "Anchor" | "CodeNode"; page: string | null; title?: string; label?: string; framing?: string; narrative?: string; sections?: Record<string, unknown>; file?: string; line?: number; specKind?: string; statedReadiness?: string; floorReached?: string | null; bindings: { edge: string; specId: string }[]; entries: SearchEntry[] }`: `title`, `label`, `framing`, `narrative` and `sections` exactly as the graph node holds them, the fields `findByConcept` reads; `page` the node's page path in the page set, null for an Anchor or a CodeNode; `file` and `line` as recorded; the kind and the two rungs on a Spec only, `floorReached` null when no rung derives; `bindings` the Specs an Anchor's or CodeNode's outgoing edges reach, with the edge type, and empty for any other node.
- searchEntry: `{ section: string; entry: string | null; key: string | null; address: string | null; line: number | null; text: string }`, one per value recipe 23's walk reaches in a Spec's narrative and sections, taken with no term: each string, and each value that is not a string under a key the author coins, as its JSON text; in that walk's order, with that recipe's entry path, coined key, address and line. A term matches an entry as that recipe matches it, a string by its key or text and any other value by its key only, so the entries a term matches are the rows recipe 23 returns for it.
