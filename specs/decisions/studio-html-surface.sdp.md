---
id: spec:decisions.studio-html-surface
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:extraction.regenerability
---
# The Studio renders HTML, and the HTML stays derived

## Intent
- outcome: Record why the Studio's surface is generated HTML rather than Markdown, and what keeps the HTML out of the diffs a reviewer reads.

## Decision
- context: When a model writes the Specs, a person's main act is review, and review reads tables, diagrams, code, comparisons and examples across many Specs. Markdown caps out at about a hundred lines, past which nobody reads it, its authors included; large Specs are common, and Markdown rots into a wall of text quickly.
- decision: The Studio renders generated HTML as its surface. The HTML is derived and never committed in raw form: git diffs stay over the canonical Spec source, and the Studio's files are regenerated from the graph.
- rationale: HTML conveys more per screen: tables, SVG diagrams, code blocks with syntax highlighting, embedded harnesses, interactive sliders, side-by-side comparisons and tabbed views are all native to it.
- rationale: HTML is shareable: a build uploaded to S3 or any static host is a link, with no rendering-engine mismatch between viewers.
- rationale: HTML is interactive: a reader can move an NFR target on a slider, toggle a scenario harness, or reorder a Pack's members by drag and drop, none of which Markdown can do.
- rationale: When a model writes the Specs, review is the person's main act, and HTML beats Markdown for review by a wide margin.
- rationale: The Studio's code renders its HTML from the graph, so the original's argument from generation time and token cost, which priced a page a model writes, does not apply.
- alternative: Markdown as the primary surface diffs cleanly in git, but caps out at about a hundred lines and cannot be interactive.
- consequence: The principal trade-off of HTML, diffs that are noisier in git, is sidestepped because the HTML is derived and never committed.
- consequence: The Studio stands beside the Markdown Design Review rather than above it. The Studio is the workbench a person reads, and the frozen Markdown Design Review stays the surface git diffs, GitHub renders and agents read; neither ranks above the other.
- consequence: The case for derived HTML holds for any canonical carrier, because it rests on the HTML being derived and never committed, not on the Specs being written in TypeScript.
