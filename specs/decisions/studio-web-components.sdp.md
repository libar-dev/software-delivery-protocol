---
id: spec:decisions.studio-web-components
kind: decision
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
---
# The Studio is built from custom elements, not a framework

## Intent
- outcome: Record why the Studio's building blocks are Web Components rather than components of a framework.

## Decision
- context: The Studio's views must work inside the Studio, standalone in any HTML container, and embedded in status reports, pull request descriptions and slide exports, and its assets should stay small and cache well.
- decision: The Studio is built from Web Components, custom elements written without React, Vue, Svelte or another framework.
- rationale: Custom elements carry no framework lock-in and work standalone in any HTML container.
- rationale: The Studio's assets stay small and cache-friendly.
- alternative: Components of React, Vue or Svelte would impose that framework on every page that embeds one of them.
- consequence: The few elements that need richer state, the harness and the scenario editor, may use a small reactive primitive inside themselves, such as `@lit/reactive-element` or a signals-style atom, without imposing a framework on the page that embeds them.
