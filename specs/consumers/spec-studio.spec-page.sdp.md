---
id: spec:consumers.spec-studio.spec-page
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.derived-readiness-banner
    - spec:consumers.binding-language-views
    - spec:model.open-question-keys
  decidedBy: spec:decisions.authored-entry-order
---
# A Spec page shows one Spec in collapsible panels, in a fixed order

## Intent
- outcome: Show everything the graph holds about one Spec on one page, in panels a reader opens and closes one at a time.
### Open questions
- [non-blocking #headerFields] The original header shows an owner, a capability, tags and a last-verified time; the envelope is closed to `id`, `kind`, `altitude`, `readiness` and `relations` with the H1 as title, a capability is a projection or a Pack, and a verifier binding never records when a test last ran. Which of the four does the header show, and from which graph value?
- [non-blocking #rungColors] The original pins one color for each of seven rungs: light grey for `sketch`, blue for `framed`, cyan for `specified`, green for `designed`, emerald for `bound`, indigo for `executable` and violet for `verified`; readiness has four rungs, idea through ready, and the floor reached renders beside the stated rung. Does the palette color the stated rung, the floor reached, or both?
- [non-blocking #questionMetadata] The original shows each open question's owner and the date it was added; an open question carries its text, whether it blocks and an optional key, and git records when its line was added. Does the panel show an owner or a date, and from where?
- [non-blocking #runtimeComposition] The original's runtime panel binds a Fastify route to the Effect program it invokes, as `api:POST:/orders` invokes an Effect program with `R = CreateOrderUseCase`; shows the Effect layer `layer:CreateOrderUseCaseLive`, which provides `port:CreateOrderUseCase`, requires `port:OrderRepository` and `port:EventBus`, has the lifetime `scoped` and the test layer `layer:CreateOrderUseCaseTest`; names the external system `external:postgres`; and, for Awilix, binds the registration `createOrderUseCase` to `impl:CreateOrderUseCase` as `asClass CreateOrderUseCase` with the lifetime `SCOPED`, depending on `impl:OrderRepository` and `impl:EventBus`. An anchor carries identity, its Spec targets and optional structure: `component`, `uses` and `role`, with an architectural `layer` and a `context` on a component anchor; none of them records what a program provides or requires, a lifetime or an external system. Does the panel show more than the structural neighborhood of the Spec's implementation anchors?
- [non-blocking #schemaBindings] The original's bindings panel lists schema bindings beside code and test bindings; anchors bind implementation code, tests and oracles, and no anchor binds a schema. Does a schema binding need a home?
- [non-blocking #uiStories] The original's page outline names a section `UI / Stories`, whose UI half the UI panel carries; the original never says what a story is. What is a story, and does the page show one?

## Behavior
- rule: Each panel collapses and expands on its own.
- rule: The header renders readiness as `spec:consumers.derived-readiness-banner` states: the stated rung beside the floor reached, with the divergence banner only in the dishonest direction.
- rule: The bindings panel speaks binding language as `spec:consumers.binding-language-views` states: each binding present or none, and the runtime observation not tracked.
- rule: Every node a panel names is a link to its page.
- rule: The design panel lists the `design` entries in authored order with their keys as code, and the UI panel lists the `ui` entries the same way, as `spec:decisions.authored-entry-order` rules for the Design Review.

## UI
The panels in page order.
- header: the Spec's id, its stated readiness beside the floor reached, its altitude and kind; its title; the Packs it belongs to; and its warning and error counts as pill badges.
- readinessColors: each rung has its own color, from a pinned palette that stays distinct under color blindness.
- intentPanel: the intent section as prose, then an open-questions panel headed with their count, each question with its text, whether it blocks, its key and the address the key gives it, and an action that composes intent scoped to that question.
- behaviorPanel: the rules, then the examples as cards, laid out as `spec:consumers.spec-studio.verification-panels` states.
- constraintsPanel: each constraint with its target, laid out as `spec:consumers.spec-studio.verification-panels` states.
- designPanel: a diagram of the components that realize the Spec, from its implementation anchors' `component` and `uses` edges, drawn as SVG whose nodes open their pages and show their source file and line on hover; below it, the `design` entries, then the decision records the Spec names by `decidedBy` with each decision's text inline.
- runtimePanel: the structural neighborhood of the Spec's implementation anchors: each anchor's component and the code units it uses, with file and line.
- bindingsPanel: the implementation, verifier and oracle bindings, each anchor's file and line as a link, with an action that opens the file at that line in the reader's editor.
- verificationPanel: the verifiers and the coverage of the example space, laid out as `spec:consumers.spec-studio.verification-panels` states.
- evidencePanel: builds, deployments, runtime observations and the SBOM, laid out as `spec:consumers.spec-studio.verification-panels` states.
- impactPanel: the upstream parents and downstream children, the Specs that depend on this one, the decision records it names, the tests that verify it, and the code its bindings reach.
- uiPanel: the `ui` entries.
