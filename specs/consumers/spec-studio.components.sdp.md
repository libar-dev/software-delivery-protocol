---
id: spec:consumers.spec-studio.components
kind: contract
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:consumers.spec-studio.data
  decidedBy: spec:decisions.studio-web-components
---
# The Studio's custom elements each render one view and embed anywhere

## Intent
- outcome: Give the Studio a small set of custom elements that each render one view of the graph, so one view serves a Studio page, a status report, a pull request description or a slide export.
### Open questions
- [non-blocking #embeddedDiagrams] The original embeds interactive LikeC4 diagrams through an element that wraps LikeC4's own runtime; a LikeC4 export is designed-for and deferred, and the shipped Mermaid projection draws bounded one-hop Spec and Pack diagrams and never the whole graph. Which renderer draws a Studio diagram, and does that bound hold for it?
- [non-blocking #harnessElement] The original's harness element takes a harness id and keeps its coverage current as a reader works it; the graph holds example spaces, bound points and oracle bindings, and has no harness node and no `harness:` namespace. What does the element take as its subject?

## Contract
- Each element is self-contained and light on dependencies, and works embedded in any HTML page.
- Each element reads the one graph object its page sets, as `spec:consumers.spec-studio.data` states, and takes its subject as a graph id in an attribute.
- Every element's name starts with `sdp-`.

## Design
The elements in the original's order, with their attributes.
- specCard: `sdp-spec-card` with `spec-id`, `variant` and `readiness-pill`: one Spec as a card, in full or short form, with its readiness pill shown or hidden.
- traceGraph: `sdp-trace-graph` with `spec-id`, `depth` and `highlight`: the Spec's relations drawn as SVG to the given depth, highlighting what `highlight` names, such as missing tests.
- maturityMap: `sdp-maturity-map` with `pack-id` and `group-by`: a Pack's members by readiness, grouped by the named field, such as capability.
- harness: `sdp-harness` with `harness-id` and `auto-coverage`: an interactive scenario harness that keeps its coverage current.
- diagramView: `sdp-likec4-view` with `view-id`: a LikeC4 view, wrapping LikeC4's own runtime.
- scenarioEditor: `sdp-scenario-editor` with `spec-id` and `mode`: a given, when and then editor for one example, which in `propose` mode composes intent for a new one.
- impactView: `sdp-impact-view` with `spec-id`: a Spec's impact panel on its own.
- intentPanel: `sdp-intent-panel` with `id`: the composing panel on its own, in the place of the original's patch export button.
- validationFindings: `sdp-validation-findings` with `filter`: the validation report's findings for the Spec or Pack id the filter names.
