---
id: spec:consumers.capability-map
kind: behavior
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:consumers.projections-model
    reason: the capability map projects authored refinement without introducing a grouping
  decidedBy: spec:decisions.epics-of-any-kind
  dependsOn:
    - target: spec:validation.readiness-floor
      reason: each node reads the existing floor beside the author's statement
    - target: spec:extraction.delivery-facts
      reason: rollups count direct bindings without conferring facts on ancestors
---
# The capability map reads every epic and its refinement descendants

The map answers what a corpus intends to do before a reader chooses a Pack. Refinement can skip an altitude, repeat an altitude, or give a Spec several parents. The map keeps that structure. An epic's descendants are a set of Specs, not a measure of completion.

## Intent

- actor: A person or agent choosing which capability's design to read.
- problem: An altitude filter gives a flat list and Pack membership does not explain refinement.
- outcome: Read every epic with its refinement descendants, its design maturity and direct binding evidence, and expose every Spec no epic reaches.

## Behavior

- rule: [#graphOnly] The map follows only declared `refines` edges between resolving Specs, from parent to child for reading. It reads every kind at every altitude, preserves intermediate Specs, and derives no parent from a title, path, Pack, dependency or binding.
- rule: [#epics] Every Spec at epic altitude is an entry, whatever its kind. An epic may itself refine another epic; both remain selectable, and a parent's descendant set includes the nested epic and its descendants.
- rule: [#nodeEvidence] Each Spec carries its own stated readiness, structural floor reached, delivery facts, and open questions with their blocking flags. A missing floor reads `none`. No value propagates from a child to its parent.
- rule: [#multipleParents] Every refining parent remains in the answer; a Spec appears once in nodes with all its parents, and a page decides where it expands.
- rule: [#rollup] An epic's rollup counts distinct descendants, excluding the epic itself, by stated rung, floor reached, kind and altitude; it counts those with implementation bindings and those with verifier bindings separately. Open and blocking question totals count the questions on those distinct descendants. Rollups for overlapping epics are never added to form a corpus total.
- rule: [#examplesAndDecisions] Examples and decisions participate in reach, counts and edges like every other kind. The page may fold them into labelled disclosures, but exposes their rows and any descendants they parent. A verifier count means a binding exists, never that a test passed; the map states no percent complete, inherited fact or work order.
- rule: [#unreached] A Spec is unreached when no epic reaches it, counting an epic as reaching itself. The answer lists every unreached id, including examples and decisions, and groups the unreached subgraph by its roots. A branch that is also reached remains outside that subgraph, with its cross-edge retained in the full answer.
- rule: [#damagedGraph] Unresolved or non-Spec refinement endpoints are reported in damage and excluded from traversal. Cyclic refinement is reported as sorted groups whose members all reach one another, including self-links. Traversal visits each id once per root. The map displays the damage without inventing ancestry or withholding the rest.
- rule: [#scope] With an epic selected, the answer contains that epic and its distinct descendants. Node parent and epic memberships still name their full-corpus memberships so narrowing never claims exclusive ownership. Without an epic the answer includes every Spec, including an empty corpus or a corpus with no epics.

## Design

- mapRecipe: recipe 52 takes optional `params.epic`, a resolving epic Spec id, and `params.detail`, a boolean. Omitted epic means the whole corpus. An unknown parameter returns `{ unknownParams, accepts: ["epic", "detail"] }`; a wrong type, absent id or non-epic returns `{ diagnostics: [{ parameter, problem }] }` without a map, naming `epic` or `detail` as appropriate. There is no sample epic and no filtering by kind.
- mapAnswer: the full answer is `{ input: { epic }, totals, nodes, edges, epics, unreached: { ids, roots }, cycles, damage }`; `epic` is the selected id or null. The selected node set defines all totals; unselected nodes are never counted. Full-corpus memberships on a selected node are context, not extra selected nodes.
- mapDetail: recipe 52 reads `params.detail`, absent or `false` for the summary and `true` for the full answer; the summary keeps `input`, `totals`, `epics` as `{ id, title, parentEpicIds, rollup }`, `unreached.ids`, `cycles` and `damage`, and adds `leftOut`, one line for each omitted field. `detail: true` adds `nodes`, `edges`, each epic's `descendantIds` and `unreached.roots`, and omits `leftOut`.
- nodeRow: `{ id, title, specKind, altitude, statedReadiness, floorReached, deliveryFacts, questions, parents, children, epicIds }`; parents and children are all resolving direct refinement neighbors in the corpus, and epicIds lists all epics that reach this node, including itself when epic. Questions preserve authored order as `{ index, address, question, blocking }`, with a keyed question's entry address or null.
- edgeRow: `{ from, to, claim: "declared", reason }`, child to parent, for each resolving refinement whose ends are selected. An absent reason is null. Other relation types never enter this list.
- epicRow: `{ id, title, parentEpicIds, descendantIds, rollup }` for every selected epic, with its distinct descendants in the selected set. `parentEpicIds` lists resolving direct refinement parents at epic altitude in the full corpus, in id order. Selection by one epic includes every descendant of a nested epic, so its rollup stays complete.
- countShape: totals and each rollup carry `{ specs, byStatedReadiness, byFloorReached, byKind, byAltitude, withImplementationBinding, withVerifierBinding, openQuestions, blockingQuestions }`; every descriptor value has a key including zero, floor counts add `none`, and totals additionally carry `{ epics, reached, unreached }`. Reached and unreached partition selected nodes, using their full-corpus epic membership. The epic's own evidence stays on its node row, outside its rollup.
- unreachedRoots: a root is an unreached Spec with no unreached parent; a group of unreached Specs that refine one another in a cycle, with no unreached parent outside the group, uses its smallest id as its root. Reach may overlap between roots; unreached.ids stays unique and complete. In an epic selection both lists are empty.
- graphDamage: `damage` lists `{ code: "unresolved-refinement", from, to }` for a missing or non-Spec endpoint touching the selected scope, or every such edge in whole-corpus scope. Cycles are separate `{ members }` rows for cyclic groups in the selected graph, members sorted by id; they are graph damage, not parameter failures or a new validator.
- stableOrder: ids, nodes, epic rows, descendant ids, memberships and unreached roots use code-unit id order; edges and damage sort by from then to; cycles sort by first member. Question order stays authored. The answer has no clock, recorded work order or mutable state.

## Verification — reviewed

- A diamond retains both parent edges, lists the shared child once in nodes, and counts it once in that epic's descendants.
- A corpus with no epics still exposes every Spec; a cyclic unreached component has a root and finite traversal.
- An epic with a bound example and a ratified decision counts both descendants while retaining its own empty delivery facts.
- Summary and full answers have identical totals, epic rollups, cycles and damage; the summary names every omitted field.
- An epic selection includes its whole reachable set and no unrelated roots; invalid parameters return diagnostics without a plausible empty map.
