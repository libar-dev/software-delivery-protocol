---
id: spec:consumers.spec-studio.components
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - target: spec:consumers.spec-studio.intent-panel
      reason: the panel element renders the gathered intents that Spec designs
  decidedBy:
    - spec:decisions.studio-web-components
    - spec:decisions.studio-build-renders
    - spec:decisions.studio-diagram-renderer
---
# The Studio's custom elements each hold one view the build renders

The original's harness element has no subject in the graph, which holds example spaces, bound points and oracle bindings but no harness node, so its successor takes the Spec that owns an example space. The build renders every view into the page's markup and an element adds only the interaction its view needs, as `spec:decisions.studio-build-renders` rules, so a trace graph draws one hop, a maturity map places members by stated rung and floor, a card always shows its rung, and the attributes the original used to choose another setting are gone.

## Intent
- outcome: Give the Studio a small set of custom elements that each hold one view of the graph, rendered by the build, in a Studio page or in any HTML page that holds that markup and loads the element script.

## Contract
- [#selfContained] Each element is self-contained and light on dependencies, and works in any HTML page that holds the markup the build wrote for it and loads the Studio's script.
- [#buildRenders] The build renders every element's view into its markup, from reader values and the recipe answers the page names, so the view reads without script; the element adds only interaction, and an element whose view needs none is defined with no behavior.
- [#subjectAttribute] An element with a graph subject takes that subject's graph id in the attribute its Design entry names; an element over gathered intents has no single graph subject.
- Every element's name starts with `sdp-`.
- [#diagramRenderer] A diagram is laid out by the engine when the page set is built and written as inline SVG, and its element adds only pan, zoom and pinch, as `spec:decisions.studio-diagram-renderer` rules; one diagram draws within the bound `spec:consumers.spec-studio.diagrams#design.bound` names.
- [#oneScript] Every element ships in the one classic script the page elements ship in, and none loads anything at run time.

## Design
The elements in the original's order, with their attributes.
- specCard: `sdp-spec-card` with `spec-id` and `variant`: one Spec as a card; `full` is a Pack page's member card, `short` one line with the title linked, the id, the rung badge and the floor in words; no behavior.
- traceGraph: `sdp-trace-graph` with `spec-id`: the Spec's relations one hop each way, drawn in relation bands inside an `sdp-diagram`, then its text equivalent; no behavior of its own.
- maturityMap: `sdp-maturity-map` with `pack-id`: the Pack's members placed by stated rung and floor reached, drawn as a static SVG grid of counts, then its count table and each populated cell's member list; no behavior.
- exampleSpace: `sdp-example-space` with `spec-id`, naming the Spec that owns the example space: the space's slots with their types and the step that declares each, its children's bound points as a table with one row per example and one column per slot, an unbound slot written `unbound`, its expected-outcome oracle binding as present or none, and recipe 44's coverage; its coverage is a report, never a verifier run or a delivery fact; no behavior beyond the composing actions inside it.
- diagramView: `sdp-diagram` with `subject`, the element `spec:consumers.spec-studio.diagrams#design.diagramElement` states.
- scenarioEditor: `sdp-scenario-editor` with `spec-id` and `mode`: in `edit` mode a form holding the example's given, when and then steps, in `propose` mode the parent's step vocabulary as a starting point; submitting gathers an intent scoped to the example or to the parent, with the steps as its exact text; without script it shows the steps as text and says that composing needs the script.
- impactView: `sdp-impact-view` with `spec-id`: a Spec's impact panel on its own, its trace graph, what it rests on and what rests on it; no behavior.
- intentPanel: `sdp-intent-panel` with `page-root` and no graph-subject attribute, rendering the gathered intents across their scopes as `spec:consumers.spec-studio.intent-panel` states.
- composeAction: `sdp-compose` with `scope` and `action`: a button labelled with what it composes that opens the compose dialog and gathers the intent in the composing panel; `scope` is a Spec id, entry address or Pack id, with a Pack's space-separated resolved member ids in `members`, `members-complete` set to `true` only when every manifest member resolves, and a `Change applies to` choice between member Specs and Pack membership or framing; `action` is one of `resolve-question`, `promote-question`, `edit-example`, `propose-example`, `change-target`, `propose-target`, `propose-values` and `change-entry`; hidden without script.
- validationFindings: `sdp-validation-findings` with `filter`: the validation report's findings for the Spec or Pack id the filter names; no behavior.
