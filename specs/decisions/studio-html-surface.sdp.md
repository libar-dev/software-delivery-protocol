---
id: spec:decisions.studio-html-surface
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    target: spec:extraction.regenerability
    reason: disposable HTML can be regenerated from the graph instead of committed as authored source
---
# The Studio renders HTML, and the HTML stays derived

## Intent
- outcome: Give reviewers a Studio with search, filters and collapsible views while git diffs stay over canonical Spec source.

## Decision
- context: When a model writes the Specs, a person's main act is review, and review reads tables, diagrams, code, comparisons and examples across many Specs. The first adopter's reviewers need search, filters, navigation and progressive disclosure across a Pack, which the generated Markdown pages do not give: the Pack page's member table is too wide for those readers, and they open the carrier files instead.
- decision: The Studio renders generated HTML as its surface. The HTML is derived and never committed: git diffs stay over the canonical Spec source, and the Studio's files are regenerated from the graph.
- rationale: HTML conveys more per screen: collapsible sections, wide tables that scroll in place, SVG diagrams, highlighted code and side-by-side comparisons are native to it.
- rationale: HTML is shareable: a page set uploaded to any static host is a link a reviewer opens without installing anything.
- rationale: HTML is interactive: search, filters and navigation run in the page over values the build wrote, which Markdown cannot do.
- rationale: The Studio's code renders its HTML from the graph, so the original's argument from generation time and token cost, which priced a page a model writes, does not apply.
- alternative: Markdown renders in Markdown viewers and agents read it as text; the generated Markdown Design Review lacks the Studio's search, filters and collapsible views, so it stays beside the Studio.
- consequence: The principal trade-off of HTML, diffs that are noisier in git, is sidestepped because the HTML is derived and never committed.
- consequence: The Studio stands beside the Markdown Design Review. The Studio is an interactive workbench, the frozen Markdown Design Review is a generated view for agents and Markdown readers, and git review stays over canonical Spec source; neither view ranks above the other.
- consequence: The case for derived HTML holds for any canonical carrier, because it rests on the HTML being derived and never committed, not on the Specs being written in TypeScript.
- consequence: The richer interactions the original design lists, such as moving a target on a slider, running a scenario harness or reordering members by drag and drop, wait for later phases and their own Specs; the Studio's first build is read-only.
