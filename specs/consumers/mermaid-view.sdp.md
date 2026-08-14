---
id: spec:consumers.mermaid-view
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
---
# Mermaid renders bounded one-hop and Pack diagrams without becoming a graph browser

## Intent
- outcome: Give maintainers disposable, deterministic Mermaid diagrams of each Spec's one-hop neighborhood and each Pack's membership without ever projecting the whole graph or inventing a second truth store.

## Behavior
- rule: `renderMermaid` is a pure `Reader -> pages` projection with no filesystem or clock access; equal reader data produces byte-identical pages.
- rule: The page set is one diagram per Spec (that Spec plus its one-hop neighborhood), one diagram per Pack (the Pack and its members), and one deterministic index that links them. The projection never emits a whole-graph diagram.
- rule: Machine node tokens are injective encodings of the full graph ID. Titles and other display text never become machine tokens.
- rule: Visible labels use a dedicated Mermaid label escape (`escapeMermaidLabel`) that is parser-safe for Mermaid syntax. The Markdown/owned-prose escaper is not reused.
- rule: Every emitted record — pages, node declarations, edge declarations, index rows — is ordered by deterministic code-unit order independent of graph input order.
- rule: An unresolved relation or edge target renders as an explicit unresolved placeholder node rather than disappearing or being invented.
- rule: Cycles are retained as ordinary edges with a visited-set walk; the projection never computes transitive closure and never performs layout.
- rule: Disconnected neighborhoods and foreign edge types remain visible when they appear in the selected one-hop or Pack slice; absence of a neighbor is honest silence, not a synthetic hub.
- rule: Hard bounds are exact: `maxNodesPerDiagram = 64` and `maxEdgesPerDiagram = 128`. A token collision or an overflow of either bound refuses the affected diagram with a deterministic refusal that names the bound, while every in-bound diagram still publishes and the command exits 0. The projection never silently truncates, shards partially, drops edges to fit, or aborts the whole page set because one diagram overflowed.
- rule: Publication owns only `generated/mermaid/` and uses the explicit `sdp mermaid` surface. It is not a child of or an extra write inside Design Review's transaction, and it shares no publication bus or hidden side channel with other projections.
- rule: A Mermaid run writes its complete page set to `generated/mermaid.tmp/`, removes the prior Mermaid root, and renames the temporary root into place. Every build attempt invalidates both Mermaid roots before extraction, so failure leaves honest absence rather than stale output that looks current. A failed publish removes any live or temporary Mermaid root it cannot certify.
- rule: `sdp mermaid --check-clean` renders an independent twin, refuses divergent renders, and compares the current generated root with the new render. Missing or drifted output returns nonzero and is removed; clean output is replaced wholesale with byte-identical content.
- rule: The projection adds no Mermaid-specific Reader accessors, maintains no projection-owned taxonomy list, and confers nothing back into the graph.

## Example space
```gwt-vocabulary
Given a graph containing Specs, Packs, one-hop relations, an unresolved target, a cycle, and a neighborhood within the stated bounds
When the Mermaid projection renders and publishes through the explicit mermaid command
Then each Spec page holds only that Spec's one-hop neighborhood
Then each Pack page holds only that Pack and its members
Then the index links every diagram deterministically
Then machine tokens remain injective full-ID encodings
Then hostile label characters cannot close or break Mermaid syntax
Then an unresolved target renders as an explicit placeholder
Then a colliding token or a diagram past maxNodesPerDiagram = 64 or maxEdgesPerDiagram = 128 is refused by name while every in-bound diagram still publishes
Then generated/mermaid/ is the only current Mermaid root
Then a clean independent render is byte-identical
Then no whole-graph diagram is emitted
```
