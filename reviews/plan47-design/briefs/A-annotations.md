# Lane A: the annotation review

Read `/tmp/plan47-briefs/common.md` first; it applies in full. Worktree:
`/tmp/plan47-wt/A` on branch `p47/a-annotations`. Report step names: `design` for this pass.

## The question

Which of the engine's units and abstractions are architecturally significant, and does the graph
say so? The owner wants the most thorough lane of the arc here, and a curated result: "making sure
we cover architecturally significant patterns and abstractions and not everything. Everything would
be noise and everything would be something that would be auto-generated. The idea is to have
curated lists, which are needed for design and development of the project."

The law you review against: `spec:model.structural-patterns` (the significance criterion and the
owner-reviewed accepted set), `spec:protocol.structural-self-binding` (its rules
`#criterion`, `#membership`, `#architecturalUses`, `#componentUses`, `#acceptedSet`,
`#layerAndContext`, `#role`, `#decisionReferences`), the three annotation decisions
(`spec:decisions.anchor-comment-form`, `spec:decisions.anchor-binding-grain`,
`spec:decisions.architectural-annotation`, MD-36 to MD-38), `spec:model.planned-architecture`, and
the authoring skill's "Bind code, tests, and oracles", "Declare architecture where it is realized"
and "Curate the anchors". The accepted set is pinned in the self-hosting oracle under
`test/self-hosting-oracle/` (find the roster the "accepted component set" test reads).

Measured at the base: 219 code units (204 `impl:`, 14 `component:`, 1 `api:`), 176 with a role in
13 values, 43 without; 297 `satisfies`, 31 `references`, 167 `memberOf` and only 48 `uses` edges.
Re-measure; never inherit these.

## Do

1. **Inventory from the graph.** Recipes 12, 13, 15, 17, 27, 28, 32 and 43 on the Protocol's
   corpus, and the curation report (recipe 40) over an imports file `sdp build --imports PATH`
   writes (read its catalog entry in `docs/agent-surface/recipes.md`; keep the file outside
   `generated/`).
2. **Read the engine.** Walk `src/` component by component: the authored model and ids, the
   carriers and parsers, extraction and the graph schema, validators and the floor table, the
   reader and the evaluation sink, the recipes, the projections and the Studio (including the
   diagram layout), the vault, the runner and codegen, the CLI and publishers, import, testing.
   Name the abstractions a designer or a builder must know to change the system: ports and
   contracts, data shapes shared across components, pipeline stages, registries and catalogs,
   decision tables, entry points, layout engines, adapters. These are the candidates whether or
   not they are anchored today.
3. **Classify every existing anchor**: keep, re-role, merge into another identity, or drop, with
   a one-line reason each. Removing or merging an anchor that `satisfies` a Spec must keep the
   set reading of `satisfies` true (`spec:decisions.anchor-binding-grain`): never leave a ready
   Spec without the realization it has today unless the claim was false; say so explicitly per
   case. An identity anchored only for coverage, a test, a count or a `byFile` answer is noise.
4. **Name every missing significant abstraction** with a proposed anchor: id, file, form
   (constant or comment), role, component, `satisfies`/`references`, `uses`.
5. **Relationships.** Compare declared component-level `uses` with the imports (recipe 40); for
   each pair of components say which `uses` is architectural and should be declared, and which
   import is incidental. Rule `#componentUses` says a component `uses` tracks real imports.
6. **Roles.** Define every role value the engine uses and the ones your review proposes, one
   line each, as Model terms of `spec:protocol.role-vocabulary`; propose the merges and renames
   that make one pattern one word (for example `projection` against `renderer`, `codec` against
   `utility`). The vocabulary stays corpus data: no validator checks it.
7. **The arc's planned components.** The capability map, roadmap, slice page and new diagram
   kinds will add code. Say whether any warrants a component design (a planned component, per
   `spec:model.planned-architecture`) or whether each lands in an existing component.
8. **The platform copy.** Run recipes 17, 28, 40 and 43 on `/tmp/plan47-platform` (build imports
   on a copy). Report what is significant there and missing, as evidence for the authoring
   guidance only. The platform is never edited.
9. **The curated register.** Write `reviews/plan47-annotation-review.md`: per component, its
   significant units and abstractions with role and one line on why each matters to a designer;
   the change table (keep, add, re-role, merge, drop, `uses` to declare or remove); the role
   vocabulary; the platform findings; and the guidance lessons. This register is the curated
   list the owner asked for: it must read as a map of the engine a new contributor could use.
10. **Specs.** Take `spec:protocol.significant-units-review` (rules: what the accepted set must
    and must not hold; how the oracle roster pins it) and `spec:protocol.role-vocabulary` (its
    terms) to the honest rung. Propose the edits to the authoring skill's curation guidance and to
    `spec:model.structural-patterns` as exact text if the review shows the criterion needs
    sharpening (what counts as a significant abstraction; what never does).
11. **A view.** Propose, if the review shows one is needed, how the Studio's architecture page
    should present the curated register (for example significant units by role within each
    component). Lane G owns drawings; say what you need from it.

Do not edit any anchor or source file now: anchor edits are the build after the owner's go. Your
change table is their specification.
