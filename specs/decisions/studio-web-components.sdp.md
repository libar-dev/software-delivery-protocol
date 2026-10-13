---
id: spec:decisions.studio-web-components
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.spec-studio
---
# The Studio is built from custom elements, not a framework

## Intent
- outcome: Let each Studio view work in an HTML page that can load its element script and supply graph data without imposing a framework on that page.

## Decision
- context: The Studio's views must work inside the Studio and in HTML pages that can load the element script and supply its graph data, such as an exported report, and its assets should stay small and cache well.
- decision: The Studio is built from Web Components, custom elements written without React, Vue, Svelte or another framework.
- rationale: Custom elements avoid a matching framework runtime in every embedding page; the host loads the Studio's element script and supplies the graph data.
- rationale: Element names and attributes are a public embedding contract that is costly to replace; in exchange for framework-independent embedding, the Studio supplies rendering and state handling within its elements.
- alternative: Components of React, Vue or Svelte would impose that framework on every page that embeds one of them.
- consequence: The few elements that need richer state, the harness and the scenario editor, may use a small reactive primitive inside themselves, such as `@lit/reactive-element` or a signals-style atom, without imposing a framework on the page that embeds them.
- consequence: A host that strips scripts, such as a pull request description, shows a static link to a Studio page, never an element.
