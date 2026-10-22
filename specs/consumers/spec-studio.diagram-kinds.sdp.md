---
id: spec:consumers.spec-studio.diagram-kinds
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.spec-studio.diagrams
  decidedBy:
    target: spec:decisions.studio-diagram-renderer
    reason: every new kind is laid out by the engine at build time as the renderer decision rules
---
# The Studio chooses diagram kinds from graph values

Dependency chains across a Pack, capability refinement, the components a design touches, and differences between stated readiness and the floor need different pictures. A diagram kind earns its place through the question it answers and the graph values that answer it. Mermaid supplies a useful catalog of visual forms, not the Studio's layout runtime or an instruction to draw every form.

## Intent

- outcome: Choose useful drawings from graph values, keep their labels readable on first view, and offer source a reader can copy without changing the shipped Mermaid projection.

## Behavior

- rule: [#graphData] A drawing reads the graph through the page's reader values and recipe answers. A visual form never supplies missing intent, order, cardinality, scores, dates or runtime evidence from prose, paths or imports.
- rule: [#kindCatalog] The catalog names each visual family, whether the graph holds its data, its subject, the question it answers, and a refusal or deferral's re-entry trigger. Renderer aliases share their family's row; diagnostic renderers are named apart.
- rule: [#drawnKinds] The Studio adds dependency depth, capability refinement, scoped architecture and the maturity map as a grid of counts, and a component uses table beside the architecture lens's drawing; requirement traceability replaces the realization drawing on a Spec page. Equivalent Mermaid forms share one Studio drawing.
- rule: [#honestScope] A Pack, slice or roadmap passes an explicit ordered set of Spec ids to a drawing. A grouping or a diagram never authors a delivery fact, ranks work, grants permission or sets a workflow gate.
- rule: [#sharedContract] Every new drawing keeps the diagram contract's bound, deterministic static SVG, links, words beside style, text equivalent and unique element ids. Layout and copying add no browser layout dependency.

## Design

- kindCatalog: `draw`, `equivalent`, `defer` and `refuse` describe catalog choices only. They are not graph fields or delivery states. A deferred form has honest inputs but adds no needed reading beyond the selected views; a refused form lacks typed inputs.
- legibleLabels: The figure keeps the Studio's navigation rail. Title-first labels and width-based cell wrapping reduce width; natural-size SVG with local horizontal scrolling preserves readable labels on desktop. Below the responsive breakpoint the same drawing fits the screen. The legibility child pins these measurements and behavior.
- flowchart: Draw for a Spec set, Pack, slice or roadmap from declared relations; dependency depth reveals chains and cycles the one-hop trace cannot show. Arrows retain their exact relation and direction, never execution order. The existing trace, members and realization remain equivalent flowchart subjects.
- mindmap: Draw capability refinement from declared refines for an epic or capability map. The tree shows nesting absent from a flat list; repeated parents and cycles stay explicit rather than becoming an invented hierarchy.
- treeView: Equivalent to the capability tree for a strict refinement tree. Folder icons and file paths would invent meaning; use plain labels. Repeated parents use the capability view's cross-links or its flowchart source.
- block: Draw scoped architecture and the discrete maturity matrix. Components and anchored uses answer which seams a Spec set touches; stated and reached rungs answer where statements lag or overreach. Cell position is categorical, never a score.
- architecture: Equivalent to the scoped architecture drawing for a component or Spec set, from component, memberOf and uses plus planned-component declarations. Generic boxes keep optional context and layer; cloud, service, network and deployment icons need explicit typed declarations before they can mean anything.
- usesTable: Draw a component uses table, a design structure matrix, beside the architecture lens's drawing: one row per realized component as the user and one column per realized component as the used, in one order, a cell for each pair. A table stays legible at any number of uses, where routed edges between a dozen components run in parallel bundles. It is an HTML table read from anchored uses, needs no layout, bound or fold, and offers no Mermaid source because Mermaid has no matrix form.
- requirement: Draw a Spec's or bounded Spec set's refinement, satisfying units and declared versus anchored verifiers together. This shows the distinction between intent and binding in one picture; it supplies no risk, test method or passing result.
- class: Defer a role view for a component or slice: units as classes stereotyped by their recorded role, with anchored uses as dependency arrows and no fields, methods or inheritance. Role, memberOf and uses are honest inputs, but the role vocabulary is under review and the architecture page lists roles as text. Re-enter when the role vocabulary settles and a reader needs pattern relationships drawn. Refuse fields, methods, inheritance and multiplicities; Model prose is not a schema.
- entityRelationship: Refuse for a Spec, component or corpus. Terms and relations are not entity attributes, keys or cardinalities. Re-enter with an explicit typed entity and cardinality contract.
- sequence: Refuse for a Spec or slice. Uses and dependsOn hold no messages, participants or temporal order. Re-enter with typed ordered interactions or a separately admitted runtime input.
- zenUml: Refuse for the same missing interaction data as sequence; the optional external renderer adds no graph evidence. Re-enter when ordered interactions have a lawful graph home.
- state: Refuse for a Spec or roadmap. Readiness is a position, not a transition machine, and the graph holds no domain states, events or guards. Re-enter with a typed domain state contract unrelated to delivery gating.
- journey: Refuse for a Spec, Pack or corpus. Intent actors do not define ordered journey tasks or satisfaction scores. Re-enter with typed journey steps and a reader who needs them.
- gantt: Refuse for a roadmap or corpus. No durations, start dates or schedules are held, and dependency depth is not time. Re-enter only with a separately ruled temporal input that never gates work.
- pie: Defer for a Pack or corpus. Counts by kind or readiness are honest, but slices repeat the census while hiding exact comparisons. Re-enter when a reader needs part-to-whole comparison that the census cannot answer.
- quadrant: Refuse normalized quadrant coordinates for a Pack or roadmap. Readiness rungs have no numeric distances and priority is not a score. The maturity map uses a discrete matrix instead. Re-enter with explicitly typed independent numeric measures.
- gitGraph: Refuse for a Spec, Pack or corpus. Git is the event log, but commits and branch ancestry are not nodes in the current graph. Re-enter with a ruled history input and a history reader.
- c4: Refuse C4 semantics for a component or slice. Component anchors do not state people, software systems, containers, trust boundaries or deployment. Re-enter with typed C4 meanings; generic component structure remains in the architecture drawing.
- timeline: Refuse for a roadmap or corpus. A dependency chain and authored Pack order are neither dated events nor time periods. Re-enter with a lawful history input.
- sankey: Refuse for a component, slice or corpus. Uses counts are discrete bindings, not a conserved flow or its magnitude. Re-enter with typed flow units and weights.
- xyChart: Defer categorical count bars for a Pack or corpus because the census already gives the exact counts; refuse a trend without time-series input. Re-enter when a reader needs a count comparison or a separately ruled time series.
- packet: Refuse for a Spec or component. Contract prose contains no typed bit offsets, field widths or packet layout. Re-enter with a typed wire-format layout.
- kanban: Defer a separate readiness board because the maturity map shows both stated and reached rungs; refuse workflow states or inferred work order. The roadmap page's HTML lists by need already provide the categorical board over explicit graph values. Re-enter for Mermaid kanban export when a reader needs to copy that board.
- radar: Refuse for a Spec, Pack or corpus. There are no comparable numeric quality scores or justified common scales; cardinalities cannot manufacture them. Re-enter with typed independent measures and their units.
- treemap: Defer for a Pack or corpus. Spec counts and membership are honest, but area repeats the census and a multi-parent refinement graph cannot be partitioned without duplication. Re-enter with a named size-comparison reader and an explicit partition and measure.
- swimlanes: Refuse process swimlanes for a slice or component. Context and layer do not define actors, tasks or control flow. The architecture grid remains an equivalent grouping only. Re-enter with typed process participants and flow.
- useCase: Refuse UML use-case associations for an epic or Spec. Intent.actor is prose, not an actor identity or an include, extend or association edge. Re-enter with explicit typed actor associations; behavior altitude alone supplies none.
- eventModeling: Refuse for a component or slice. The graph holds no ordered commands, events, screens or event streams. Re-enter with typed event-modeling declarations.
- venn: Defer Pack-overlap sets for the corpus. Membership allows honest intersections, but no current task needs a bounded overlap picture. Re-enter with named Packs and an overlap question whose intersections remain legible.
- ishikawa: Refuse for a Spec or corpus. A dependency is not a causal explanation and the graph holds no typed cause categories. Re-enter with authored causal relations admitted by the Protocol.
- wardley: Refuse for a capability map or roadmap. Refinement and dependencies hold no value-chain visibility or evolution coordinates. Re-enter with a ruled typed strategy input; never map readiness to evolution.
- cynefin: Refuse for a Spec or roadmap. Kind and readiness are not complexity classifications. Re-enter with explicitly authored complexity assessments in an admitted contract.
- agentFlow: Refuse agent-flow semantics for a component or slice. Anchored uses do not identify agents, tools, prompts or routing decisions. Re-enter with typed agent and routing declarations.
- railroad: Refuse railroad, EBNF, ABNF and PEG forms for a Spec or corpus. A vocabulary's step strings and parameter slots do not state a complete grammar production graph. Re-enter with typed productions and a grammar reader; never parse prose into a grammar.
- diagnostics: Mermaid's info and error renderers are diagnostics, not corpus diagram kinds. Keep them outside the Studio catalog of graph drawings; renderer variants such as flowchart ELK, class and state versions share their semantic family's row.
