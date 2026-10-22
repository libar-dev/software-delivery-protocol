---
id: spec:consumers.design-slice
kind: behavior
altitude: feature
readiness: defined
relations:
  refines:
    target: spec:consumers.pack-design
    reason: a slice reads a Pack's design as one whole, with its architecture and open decisions beside it
  dependsOn:
    - target: spec:consumers.review-perspectives
      reason: a slice read for one concern takes the members a perspective selects
    - target: spec:consumers.context-bundle
      reason: a slice takes its scope as the bundle does, and builds a Spec list's boundary the same way
    - target: spec:consumers.readiness-planner
      reason: members rest on each other as the statement queue reads the four typed relations, and a cycle reports in its shape
    - target: spec:model.planned-architecture
      reason: planned components and differing designs come from the realization comparison
    - target: spec:model.rule-keys
      reason: each member's rule count is the count rule coverage reports
    - target: spec:consumers.agent-surface.design-recipes
      reason: decisions in scope read the decision register's rows
    - target: spec:model.open-question-fields
      reason: each question in scope carries its fields
  decidedBy:
    - target: spec:decisions.anchor-binding-grain
      reason: the code a design builds on is reached through the design's own relations, never through a reference from that code
    - target: spec:decisions.architectural-annotation
      reason: a touched component carries the layer and context its anchor states
---
# A slice reads a Pack as one design, with the architecture it touches and what each member needs next

Features that must be reviewed together are already grouped as a Pack, and the Pack page shows each member in turn. A design pass also needs the whole at once: how the members rest on each other, which components they touch, realized or planned, which decisions and open questions bound them, and what each member needs for its next rung. Rounds of design add detail a little at a time; the floor sets how little a rung needs, and how much is enough stays a judgment the authoring guidance supports and no check makes.

The first generation kept a slice as an authored file: a list of members and the one question they answer together, a saved view for design and review that delivered nothing itself (`@libar-dev/architect`, `formal-spec/04-tag-registry.md`, the hierarchy level `slice`). The original design saved AI context slices per Pack, per capability and per changed Spec as files (`docs/lineage/v0-design/07-spec-studio-and-projections.md` §5.5). The Protocol holds the first as a Pack, its members in reading order and its framing saying what they answer together, and it refused the second: a context bundle is composed on each invocation and never saved. A design slice is therefore a reading and not an artifact. It is a Pack read whole, narrowed to one perspective's members when a pass reads for one concern, or an ordered list of Specs, composed from the graph each time, and it adds no grouping, kind, stage or gate. A Spec's planning slice reads one Spec's neighborhood; widening it hop by hop would pick a reach no one authored, so a design slice starts from the set a person chose.

The reading answers what a card-by-card page leaves a reviewer to assemble. A design that builds on existing code says so through its own `dependsOn` or `refines` to the Spec that code satisfies, so the architecture a design ahead of its code will touch is read from those relations and the anchors of the Specs they name. The first adopter asked for the same separation: the design under review apart from the contracts and decisions it rests on, and the outside Spec whose rung holds a member shown at the boundary with what it holds (`libar-platform/docs/feedback/sdp-feedback-02.md`, items 11 and 12).

## Intent

- actor: A person or an agent running a design pass over features that must be reviewed together.
- problem: The Pack page reads member by member, so a reviewer assembles the dependency order, the touched architecture and the open decisions by hand before judging the design as a whole.
- outcome: Read a Pack as one design slice: its members and their relations, the components they touch, realized and planned, the decisions and open questions that bound them, and what each member needs for its next rung.
- value: A design pass judges the whole before its parts, starting from the members others rest on, and sees how much design each member carries beside its rung without a score.

### Open questions

- [non-blocking #sliceTerm] Does `design slice` join the glossary's guidance-only labels beside design pass, design diff and design backlog, so the word names a recipe's answer and is never read as the refused saved AI slice?
  - decider: owner
  - provisional: yes, a guidance-only label for the recipe's answer; it names no primitive, artifact or stage

## Behavior

- rule: [#readingNotArtifact] A design slice is a reading of a set of Specs that a catalog recipe composes from the graph on each invocation; it is never authored, saved or committed, it adds no grouping, namespace, kind, stage or gate, and reading it records nothing.
- rule: [#scope] A slice takes one scope: a Pack, its resolved members read in authored order, or an ordered list of Spec ids; a Pack scope may be narrowed to an ordered subset of its members, such as the members the perspective filter selects, and then says that it is a subset.
- rule: [#restsOn] Inside the slice a member rests on each other member it names by `refines`, `dependsOn`, `constrainedBy` or `decidedBy`, except a `refines` to a member that names it back by one of the other three, as the statement queue reads them; every such relation between two members is listed with its type and its reason.
- rule: [#depth] A member that rests on no other member has depth 1, and any other member has the depth after the deepest member it rests on; members that reach each other through those links form a cycle, share the depth after the deepest member outside the cycle that any of them rests on, and are listed with one closed path, and the slice refuses nothing.
- rule: [#examplesFold] An example member that refines another member is listed as one of that member's example members, so a reading can count it in its parent; the example keeps its own row.
- rule: [#memberColumns] Each member carries its stated rung, the floor reached, its stated next rung with the clauses that hold it, its design columns, its rule count as rule coverage counts it, its verifiers and verifying examples with how many are enabled, the units that implement and reference it, and the components those units belong to; the columns are counts and lists beside the rung, never a score, a verdict or a rung.
- rule: [#boundary] The slice's boundary is built over its members as Pack design builds a Pack's, so a whole Pack's slice has the Pack's boundary; each Spec the slice rests on also carries the floor it reaches and the members whose stated next rung it holds, and a Pack member left out of a narrowed slice is marked as in the Pack.
- rule: [#touchedComponents] The components a slice touches are reached three ways, each named on the component's row and never merged: a unit that satisfies or references a member belongs to it; a unit that satisfies a Spec the slice rests on belongs to it; or a member that is a component design names it, planned while no anchor satisfies that design.
- rule: [#touchedUses] Between touched components the slice lists the anchored `uses` aggregated to components, as the architecture map counts them, a use within one component left out, and each use a member's component design plans, marked planned; a member design that differs from its realized component carries the realization comparison's differing rows.
- rule: [#unplaced] A unit that implements or references a member and belongs to no component is listed apart, so no binding drops out of the reading.
- rule: [#notDownstream] The slice does not count the code of Specs that rest on it: that code follows a change to the slice, and design-change impact reads it.
- rule: [#decisionsInScope] The decisions in scope are the decision members and every decision a member names through `decidedBy`, each with its stated rung, the floor reached, whether it is a member, the members it shapes, the decisions it refines and supersedes, and its open and blocking question counts.
- rule: [#questionsInScope] The open questions in scope are those of every member and of every decision in scope, and the blocking questions of every Spec outside the slice that holds a member's stated next rung, blocking questions first; each carries its address, its fields and the members whose stated next rung its Spec holds.
- rule: [#noDesignVerdict] The slice shows how much design each member carries and never whether it is enough: it reports no over- or under-designed member, no ratio of design to rung and no finding, because how much to write is the authoring guidance's judgment and checks police conformance and honesty, never content quality.
- rule: [#graphOnly] The slice reads declared relations, anchored bindings and component designs only; it infers no dependency, component or decision from prose, paths, imports or names.
- rule: [#orderAdvisory] Depth gives a reading order, the members others rest on first; it records, schedules and gates nothing, and a member read or designed out of that order is never a finding.

## Design

- sliceRecipe: recipe 54, the design slice, takes exactly one scope, `params.pack` or `params.specs`, an optional `params.members` beside `pack`, and an optional `params.detail`; an unknown parameter name returns `{ unknownParams, accepts }`, and a missing or doubled scope, an unknown Pack, a Spec list that is not distinct ids the graph holds, a `members` list that is not a unique ordered subset of the Pack's resolved members, or a `detail` that is neither a boolean nor a list of ids returns `{ diagnostics: [{ scope, problem }] }` and no slice.
- sliceDetail: `params.detail` is absent or `false` for the summary, `true` for every row in full, or a list of member ids for full rows of those members beside summary rows of the rest, an id that is no member adding `{ id, reason: "not-member" }` to `diagnostics`, as Pack design reads it; a summary keeps `totals` whole and adds `leftOut`, one line for each kind of detail it omits.
- sliceAnswer: `{ scope, totals, members, structure, boundary, architecture, decisions, questions }`, where `scope` is `{ pack, title, framing, subset, members, unresolved }` for a Pack, `unresolved` naming the manifest ids the graph does not hold, and `{ specs }` for a Spec list.
- sliceTotals: `{ members, exampleMembers, relations, depth, cycles, heldBelowNextRung, waitingForAuthor, restsOn, holdingOutside, restedOnBy, verifiedBy, supersededBy, components: { touched, throughMembers, throughRestsOn, planned }, componentUses, decisions, decisionsBelowReady, openQuestions, blockingQuestions }`, where `depth` is the deepest member's depth, `holdingOutside` counts the outside Specs that hold a member, `heldBelowNextRung` and `waitingForAuthor` count as Pack design counts them, and `components.touched` counts distinct components however reached.
- memberRow: `{ id, title, specKind, altitude, statedReadiness, floorReached, statedNextRung, holds, depth, restsOn, restedOnBy, exampleOf, exampleMembers, design, rules: { total, keyed }, examples: { total, enabled }, verifiers: { total, enabled }, implementedBy, referencedBy, components }` in the scope's order, where `holds` lists the stated-next-rung failures as `[{ clauseId, description, targets: [{ type, id, statedReadiness }] }]`, `restsOn` and `restedOnBy` are member ids, `exampleOf` is the member an example member refines or null, `design` is the design columns as `{ entries, declarations, openQuestions, blockingQuestions, decisions }` counts, `rules.total` is the keyed and unkeyed rule and flow entries of the primary behavior owner, `implementedBy` and `referencedBy` are unit ids, and `components` the ids of the components those units belong to.
- memberSummary: `{ id, specKind, statedReadiness, floorReached, statedNextRung, holds, depth, restsOn, exampleOf, design, rules, implementedBy, referencedBy }` is a member's summary row, with `holds` as `[{ clauseId, targets: [id] }]`, as Pack design's summary reads it, and `implementedBy` and `referencedBy` as counts.
- structureShape: `{ edges: [{ from, to, type, reason }], cycles: [{ members, cycle }] }`, one edge per declared typed relation between two members, sorted by `from`, `type` and `to`, with `reason` only when the relation states one; `cycles` in the statement queue's cycle row; a summary drops each edge's `reason`.
- boundaryRow: Pack design's boundary row `{ id, title, statedReadiness, implemented, via }` with `specKind`, `floorReached`, `holds`, the member ids whose stated-next-rung failures name it as a target, empty outside `restsOn`, and `inPack: true` on a Pack member left out of a narrowed slice, in `{ restsOn, restedOnBy, verifiedBy, supersededBy }` sorted by id; a summary keeps `{ id, statedReadiness, holds }` and `inPack`.
- componentRow: `{ id, label, layer, context, planned, designs, members: { satisfies, references }, restsOn }` sorted by id, where `planned` is true for a component a member's component design names and no anchor satisfies, `designs` lists the member component designs naming it, `members.satisfies` and `members.references` the members whose units belong to it by each binding, `restsOn` the outside Specs the slice rests on whose satisfying units belong to it, and `label`, `layer` and `context` come from the architecture map's component row, or from the design while planned; a summary replaces the three lists of Specs with their counts.
- componentUse: `{ from, to, count, planned }` sorted by `from` and `to`, between two touched components: an anchored row's `count` is the architecture map's count of unit `uses` edges for the pair, and a planned row `{ from, to, count: null, planned: true }` stands for each touched component a member's component design lists in `uses`.
- architectureShape: `{ components, uses, unplaced, differing }`, where `unplaced` lists `{ unit, member, via }`, `via` being `satisfies` or `references`, for each unit of a member that belongs to no component, and `differing` holds the realization comparison's differing rows whose design is a member.
- decisionRow: `{ id, title, statedReadiness, floorReached, member, shapes, refines, supersedes, supersededBy, openQuestions, blockingQuestions }` sorted by id, where `shapes` lists the members that name the decision through `decidedBy` and the next three lists come from its decision register row; a summary keeps `{ id, statedReadiness, member, shapes }` with `shapes` as a count.
- questionRow: `{ address, spec, origin, index, question, blocking, deferral, decider, links, provisional, trigger, holds }` with the open-question register's fields, where `origin` is `member`, `decision` or `restsOn`, `index` the question's authored position from 0, `address` null without a key, and `holds` the members whose stated next rung its Spec holds when the question blocks, its own Spec first when that Spec is a member held by the floor's blocking-question clause, empty for a non-blocking question; rows sort blocking first, then by how many members they hold, then by Spec id and position; a summary keeps a non-blocking question as `{ address, spec, index }`.

## Example space

```gwt-vocabulary
Given a probe Pack whose members {structure:"rest on each other in a chain"|"include a decision that refines the member it shapes"|"include two members that depend on each other"|"include an example that refines a member"}
Given one member depends on an outside Spec {outside:"that a component's unit satisfies"|"that no code satisfies"|"stated below defined"}
When the design slice runs over the probe Pack
Then the members read in depth order {order:string}
Then the slice reports {cycles:number} cycles and {exampleMembers:number} example members
Then the touched components are {components:string}, {throughRestsOn:number} of them reached through what the slice rests on
Then the outside Spec holds {held:string}
```
