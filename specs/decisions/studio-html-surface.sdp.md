---
id: spec:decisions.studio-html-surface
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:extraction.regenerability
---
# The Studio renders HTML, and the HTML stays derived

## Intent
- outcome: Record why the Studio's surface is generated HTML rather than Markdown, and what keeps the HTML out of the diffs a reviewer reads.

## Decision
- context: When a model writes the Specs, a person's main act is review, and review reads tables, diagrams, code, comparisons and examples across many Specs. The first adopter's reviewers need search, filters, navigation and progressive disclosure across a Pack, which the generated Markdown pages do not give: the Pack page's member table runs thirteen columns wide, and those readers open the carrier files instead.
- decision: The Studio renders generated HTML as its surface. The HTML is derived and never committed in raw form: git diffs stay over the canonical Spec source, and the Studio's files are regenerated from the graph.
- rationale: HTML conveys more per screen: collapsible sections, wide tables that scroll in place, SVG diagrams, highlighted code and side-by-side comparisons are native to it.
- rationale: HTML is shareable: a page set uploaded to any static host is a link a reviewer opens without installing anything.
- rationale: HTML is interactive: search, filters and navigation run in the page over values the build wrote, which Markdown cannot do.
- rationale: The Studio's code renders its HTML from the graph, so the original's argument from generation time and token cost, which priced a page a model writes, does not apply.
- alternative: Markdown as the only human surface diffs cleanly in git and renders on GitHub, but it cannot search, filter or collapse, which is why the Markdown Design Review stays beside the Studio rather than in its place.
- consequence: The principal trade-off of HTML, diffs that are noisier in git, is sidestepped because the HTML is derived and never committed.
- consequence: The Studio stands beside the Markdown Design Review rather than above it. The Studio is the workbench a person reads, and the frozen Markdown Design Review stays the surface git diffs, GitHub renders and agents read; neither ranks above the other.
- consequence: The case for derived HTML holds for any canonical carrier, because it rests on the HTML being derived and never committed, not on the Specs being written in TypeScript.
- consequence: The richer interactions the original design lists, such as moving a target on a slider, running a scenario harness or reordering members by drag and drop, wait for later phases and their own Specs; the Studio's first build is read-only.
