---
id: spec:extraction.entry-locations
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:extraction.derive-graph
  dependsOn: spec:model.open-question-keys
  constrainedBy: spec:extraction.determinism
---
# The graph records where each addressable entry is written

An entry address names one keyed Design or UI entry, one keyed rule or flow, or one keyed open question. A reader following an address needs its recorded source line.

## Intent
- problem: The graph records the file of a Spec and the line of every anchor, but not the line of an entry inside a Spec, so a page that links an address to its text, or a review that cites one, re-reads carrier syntax the extractor already parsed.
- outcome: Record source lines for Design and UI entries, rules and flows, open questions and their optional fields, and authored relation targets beside the graph's nodes, so consumers locate text without parsing carriers.

## Behavior
- rule: The graph carries a location table beside its nodes and edges. Each row names a Spec id, carrier file, entry and 1-based source line. Entries are `design.<key>` or `ui.<key>` for keys other than `description`, `rule[<i>]` or `flow[<i>]` for entries of the primary behavior owner, `question[<i>]` for an open question, `question[<i>].decider`, `question[<i>].links`, `question[<i>].provisional` or `question[<i>].trigger` for each of those optional fields present, and `relation.<type>.<target>` for an authored relation target. Indexes count from 0 within their authored lists. A rule, flow or question row carries `key` when that entry has one.
- rule: Primitive and Pack nodes stay free of lines, so a comparison of nodes and edges is unchanged by an edit that only moves an entry, and carrier parity compares nodes and edges and never the location table, whose lines differ by carrier by nature.
- rule: Markdown and TypeScript record the entry forms their syntax carries. TypeScript questions are located at the question property or string literal. Gherkin records its Rule lines and authored or defaulted relation sites; it carries no Design or UI section, open question or question field. A missing row means not located, never absent.
- rule: An authored relation target has a location row whose entry is `relation.<type>.<target>`, at its carrier's recorded relation site. A defaulted Gherkin relation uses the Scenario identity line when no explicit relation tag locates it.
- rule: Rows sort by Spec id, then by entry, in code-unit order. The table is a deterministic function of the carriers at the extracted commit, as every other part of the graph is.
- rule: A location names where an entry is written and nothing else: it is not an identity, never an anchor target or a binding, and an edit above an entry moves its line.
- rule: The reader's Spec context carries the Spec's rows as its entry locations. Address resolution (recipe 25) adds the entry's value, file and line to each resolving row, and entry search (recipe 23) adds the line to each entry it matches.
