---
id: spec:extraction.entry-locations
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:extraction.derive-graph
  dependsOn: spec:model.open-question-keys
  constrainedBy: spec:extraction.determinism
---
# The graph records where each addressable entry is written

An entry address names one keyed Design or UI entry, or one keyed open question. A reader that follows an address to the text needs the line it sits on, and today only the carrier file knows it, so the first adopter's page parses every member's carrier a second time to find them.

## Intent
- problem: The graph records the file of a Spec and the line of every anchor, but not the line of an entry inside a Spec, so a page that links an address to its text, or a review that cites one, re-reads carrier syntax the extractor already parsed.
- outcome: Record the source line of every keyed Design and UI entry and every open question in the graph, apart from the nodes, so any consumer links an entry to its text without parsing a carrier.

## Behavior
- rule: The graph carries a location table beside its nodes and edges. Each row names a Spec id, the carrier file, the entry, and the 1-based line the entry starts on in that file. An entry is a `design` or `ui` key other than `description`, written as `design.<key>` or `ui.<key>`, or an open question, written as `question[<index>]` by its position in the Spec's open questions counted from 0, with its key beside it when the question carries one.
- rule: Primitive and Pack nodes stay free of lines, so a comparison of nodes and edges is unchanged by an edit that only moves an entry, and carrier parity compares nodes and edges and never the location table, whose lines differ by carrier by nature.
- rule: Every carrier the extractor reads records the lines it can locate: the Markdown carrier records each entry it reifies; the TypeScript carrier records the line of each entry's property; the Gherkin carrier records the open questions it carries. An entry with no row has no recorded line, which a consumer reads as not located and never as absent.
- rule: Rows sort by Spec id, then by entry, in code-unit order. The table is a deterministic function of the carriers at the extracted commit, as every other part of the graph is.
- rule: A location names where an entry is written and nothing else: it is not an identity, never an anchor target or a binding, and an edit above an entry moves its line.
- rule: The reader's Spec context carries the Spec's rows as its entry locations. Address resolution (recipe 25) adds the entry's value, file and line to each resolving row, and entry search (recipe 23) adds the line to each entry it matches.
- rule: The graph schema version moves to `0.9.0`. The realizing sites are the Markdown, TypeScript and Gherkin extractors in `src/extract/`, the graph schema in `src/graph/schema.ts`, and `specContext` in `src/reader/reader.ts`.
