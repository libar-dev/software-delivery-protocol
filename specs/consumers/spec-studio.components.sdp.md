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
# The Studio's custom elements each render one view in pages that load their script and supply graph data

The original's harness element has no subject in the graph, which holds example spaces, bound points and oracle bindings but no harness node, so its successor takes the Spec that owns an example space. No diagram renderer is chosen yet: the design that adds the first diagram names one within the custom-elements decision.

## Intent
- outcome: Give the Studio a small set of custom elements that each render one view of the graph for a Studio page or an HTML report that can load the element script and supply its graph data.

## Contract
- Each element is self-contained and light on dependencies, and works in an HTML page that can load its script and supply its graph data.
- An element that renders a view of the graph reads the one data object its page sets, as `spec:consumers.spec-studio.data` states. An element with a graph subject takes that subject's graph id in an attribute named by its Design entry; an element over accumulated intents has no single graph subject.
- Every element's name starts with `sdp-`.
- [#diagramRenderer] A diagram is drawn by a renderer that runs as a custom element under `spec:decisions.studio-web-components`, or by a framework runtime that a decision refining it admits; the design that adds the first diagram names the renderer and the bound on what one diagram draws.

## Design
The elements in the original's order, with their attributes.
- specCard: `sdp-spec-card` with `spec-id`, `variant` and `readiness-pill`: one Spec as a card, in full or short form, with its readiness pill shown or hidden.
- traceGraph: `sdp-trace-graph` with `spec-id`, `depth` and `highlight`: the Spec's relations drawn as SVG to the given depth, highlighting what `highlight` names, such as Specs with no verifier binding.
- maturityMap: `sdp-maturity-map` with `pack-id` and `group-by`: a Pack's members by readiness, grouped by the named field of the member values, such as kind or stated rung.
- exampleSpace: `sdp-example-space` with `spec-id`, naming the Spec that owns the example space: the space's dimensions, its children's bound points and its expected-outcome oracle binding; its coverage is a report, never a verifier run or a delivery fact.
- diagramView: a diagram element whose name and subject attribute the design that adds it names, under the diagram-renderer rule.
- scenarioEditor: `sdp-scenario-editor` with `spec-id` and `mode`: a given, when and then editor for one example, which in `propose` mode composes intent for a new one.
- impactView: `sdp-impact-view` with `spec-id`: a Spec's impact panel on its own.
- intentPanel: `sdp-intent-panel` with no graph-subject attribute, rendering the gathered intents across their scopes.
- validationFindings: `sdp-validation-findings` with `filter`: the validation report's findings for the Spec or Pack id the filter names.
