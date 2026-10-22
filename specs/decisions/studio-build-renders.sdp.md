---
id: spec:decisions.studio-build-renders
kind: decision
altitude: story
readiness: ready
relations:
  refines:
    target: spec:decisions.studio-web-components
    reason: narrows where a view's values come from; the build writes them into the markup, so a host carries that markup and supplies no graph data
---
# The build renders every Studio view, and an element only enhances it

## Intent
- outcome: Let every Studio view read in full without script, print, and travel inside a Pack export, while its custom element adds only the interaction the view needs.

## Decision
- context: The custom-elements decision frames an element as a view that renders from graph data its host page supplies. The Studio's pages read in full without script and open from `file://`, a Pack export carries no script, two builds of one graph write the same bytes, and the page computes no join, claim, fact or floor; the page elements the Studio ships already add behavior to markup the build wrote.
- decision: The build renders every Studio view into the page's markup from reader values and the recipe answers its page names, and a custom element adds only the interaction its view needs; a host page that embeds a view carries the markup the build wrote and loads the element script, and supplies no graph data.
- rationale: A view rendered at build time reads without script, prints, survives the Pack export, and keeps one graph to one set of bytes.
- rationale: An element that holds no graph data cannot compute a join, claim, fact or floor in the browser, which the Studio refuses.
- alternative: Elements that render their views from graph data a host supplies, as the custom-elements decision first framed them, show nothing without script and put a second rendering path in the browser.
- consequence: An element's attributes name its subject and its interaction, never a setting the build did not render, so the original's `readiness-pill`, `depth`, `highlight` and `group-by` attributes are gone.
- consequence: The custom-elements decision still rules how the elements are written: as custom elements without a framework.
