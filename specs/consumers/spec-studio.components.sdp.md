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
- outcome: Give the Studio a small set of custom elements that each render one view of the graph for a Studio page or an HTML report that can load the element script and supply its graph data.
### Open questions
- [non-blocking #embeddedDiagrams] The original embeds interactive LikeC4 diagrams through an element that wraps LikeC4's own runtime; a LikeC4 export is designed-for and deferred, and the shipped Mermaid projection draws bounded one-hop Spec and Pack diagrams and never the whole graph. Which renderer draws a Studio diagram, and does that bound hold for it?
  - decider: owner
  - provisional: a later phase picks a renderer compatible with `spec:decisions.studio-web-components`, or a decision that refines it admits a framework runtime
- [non-blocking #harnessElement] The original's harness element takes a harness id and keeps its coverage current as a person works it; the graph holds example spaces, bound points and oracle bindings, and has no harness node and no `harness:` namespace. What does the element take as its subject?
  - decider: owner
  - provisional: a later-phase element takes `spec-id` naming the Spec that owns the example space and renders that space's dimensions, its children's bound points and its expected-outcome oracle; coverage stays a report, never a verifier run or a delivery fact

## Contract
- Each element is self-contained and light on dependencies, and works in an HTML page that can load its script and supply its graph data.
- Each element reads the one data object its page sets, as `spec:consumers.spec-studio.data` states. An element with a graph subject takes that subject's graph id in an attribute named by its Design entry; an element over accumulated intents has no single graph subject, and a renderer-specific subject waits for its named design question.
- Every element's name starts with `sdp-`.

## Design
The elements in the original's order, with their attributes.
- specCard: `sdp-spec-card` with `spec-id`, `variant` and `readiness-pill`: one Spec as a card, in full or short form, with its readiness pill shown or hidden.
- traceGraph: `sdp-trace-graph` with `spec-id`, `depth` and `highlight`: the Spec's relations drawn as SVG to the given depth, highlighting what `highlight` names, such as Specs with no verifier binding.
- maturityMap: `sdp-maturity-map` with `pack-id` and `group-by`: a Pack's members by readiness, grouped by the named field of the member values, such as kind or stated rung.
- harness: an interactive element over an example space; its name, subject attribute and coverage behavior await `spec:consumers.spec-studio.components#question.harnessElement`.
- diagramView: a diagram element whose renderer, name and subject attribute await `spec:consumers.spec-studio.components#question.embeddedDiagrams`.
- scenarioEditor: `sdp-scenario-editor` with `spec-id` and `mode`: a given, when and then editor for one example, which in `propose` mode composes intent for a new one.
- impactView: `sdp-impact-view` with `spec-id`: a Spec's impact panel on its own.
- intentPanel: `sdp-intent-panel` with no graph-subject attribute, rendering the gathered intents across their scopes.
- validationFindings: `sdp-validation-findings` with `filter`: the validation report's findings for the Spec or Pack id the filter names.
