---
id: spec:decisions.studio-html-surface
kind: decision
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:extraction.regenerability
---
# The Studio renders HTML, and the HTML stays derived

## Intent
- outcome: Record why the Studio's surface is generated HTML rather than Markdown, and what keeps the HTML out of the diffs a reviewer reads.
### Open questions
- [blocking #primarySurface] Is the Studio's HTML the primary surface for a person reviewing a design, with Markdown as the fallback, as the original states, or one human projection beside the generated Markdown Design Review, which the consumers concept keeps as the MVP view after agents, the first sink?
- [non-blocking #generationCost] The original accepts HTML at about two to four times Markdown's generation time, with a negligible token cost under prompt caching and million-token windows, which prices a page a model writes; a projection is rendered by code from the graph, so does the argument become a bound on page weight or build time, or fall away?
- [non-blocking #canonicalCarrier] The original keeps git diffs over canonical TypeScript Specs; the carrier ruling makes Markdown the default carrier and the TypeScript DSL a lawful per-ID option. Does any part of the case for derived HTML depend on the carrier being TypeScript?

## Decision
- context: When a model writes the Specs, a person's main act is review, and review reads tables, diagrams, code, comparisons and examples across many Specs. Markdown caps out at about a hundred lines, past which nobody reads it, its authors included; large Specs are common, and Markdown rots into a wall of text quickly.
- decision: The Studio renders generated HTML as its surface. The HTML is derived and never committed in raw form: git diffs stay over the canonical Spec source, and the Studio's files are regenerated from the graph.
- rationale: HTML conveys more per screen: tables, SVG diagrams, code blocks with syntax highlighting, embedded harnesses, interactive sliders, side-by-side comparisons and tabbed views are all native to it.
- rationale: HTML is shareable: a build uploaded to S3 or any static host is a link, with no rendering-engine mismatch between viewers.
- rationale: HTML is interactive: a reader can move an NFR target on a slider, toggle a scenario harness, or reorder a Pack's members by drag and drop, none of which Markdown can do.
- rationale: When a model writes the Specs, review is the person's main act, and HTML beats Markdown for review by a wide margin.
- rationale: The download is acceptable: HTML takes about two to four times Markdown's generation time, and with prompt caching and million-token windows the token cost is negligible for the value gained.
- alternative: Markdown as the primary surface diffs cleanly in git, but caps out at about a hundred lines and cannot be interactive.
- consequence: The principal trade-off of HTML, diffs that are noisier in git, is sidestepped because the HTML is derived and never committed.
- consequence: Markdown remains a fallback surface.
