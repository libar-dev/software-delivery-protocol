---
id: spec:decisions.roadmap-priority
kind: decision
altitude: feature
readiness: defined
relations:
  refines:
    - target: spec:decisions.planning-truths-placement
      reason: narrows the refusal of recorded work order for one case, the advisory priority of a roadmap
    - target: spec:decisions.pack-markdown-carrier
      reason: opens the closed Pack manifest envelope to one optional field, `order`
---
# A roadmap states advisory priority in the graph

Dependency order already has a graph home: `dependsOn`, which the statement queue reads to order the statements a person can make. Preference has none: which body of work the owner wants next when nothing forces one before another. It lives in prose, in each pull request's forward section and in the plan files, and the graph reads neither. The roadmap views waited for a named reader; the owner, choosing what the next pull requests take up, is that reader. A Pack already keeps its members in authored order and states no truth of its own, so a Pack whose manifest says its order is a priority holds the preference with one optional field and no new relation.

## Intent

- outcome: Decide whether and how the graph may hold an advisory priority over upcoming work, a roadmap, without dates, without a new relation, and without gating or sequencing any work.

## Decision

- context: The planning truths decision gives each planning truth a ruled graph home and keeps recorded work order out of the graph, so dependency rides `dependsOn` and everything else about order stays in plan files and pull request descriptions. The owner now reads and edits that order and asks for it in the graph: what to design next and a prioritized list of what to build, tied to the pull requests that carry it out. A Pack keeps its members in authored order and states no system truth; the Pack manifest's envelope is closed to `id`, `specs` and `modelRefs`.
- decision: A roadmap is a Pack whose manifest states `order: priority`; its members' authored order is the corpus's advisory priority, first entry first. `order` is an optional manifest field whose one lawful value is `priority`, and a Pack without it keeps the reading order every Pack has. Priority is preference among bodies of work and nothing more: it carries no date, no dependency, no status and no gate, and no check, recipe or page treats a place on a roadmap as permission, obligation or sequence. Everything a roadmap shows about an entry, what it still needs and what holds it, is read from the graph each time. A corpus may keep several roadmaps, and a Spec may be listed on any number of them.
- rationale: Hard to reverse: the manifest envelope gains a field that both manifest carriers, the graph's Pack node and the reader carry, and corpora author roadmaps against it. Surprising without context: the planning truths decision kept recorded work order out of the graph, so a reader needs to know why one order is now graph data and why it still sequences nothing. A real trade-off: a priority held in the graph is checked where membership is checked, so every entry resolves; it shows in the design diff, as an added, removed or reordered member and as a Pack that becomes or stops being a roadmap; and it reaches the Studio, the vault and a pull request's forward section with no extra input. It costs one optional field and the risk that an order reads as a schedule, which this decision bounds by giving the order no consequence.
- rationale: A Pack is the right home because a roadmap says nothing about the system. It is an authored grouping, as a Pack is, whose members already carry an authored order; the field states what that order means and leaves the rest of the Pack law unchanged.
- alternative: A Pack read as a roadmap by a naming convention, such as a reserved id: the Protocol reads no meaning from an id anywhere else, a reserved name would collide with a corpus's own Packs, and nothing in the manifest would tell its reader that the order means priority.
- alternative: Any Pack's order read as a priority, the roadmap named to each recipe and page as a parameter: the Studio takes no corpus configuration, so it could not tell a roadmap from a Pack in reading order, and a reading order would show as a priority nobody stated.
- alternative: Priority outside the graph, as corpus data a recipe reads, like a perspective's `order`: an entry that no longer resolves is caught only by a rules file the corpus writes, the design diff, the Studio, the vault and the preview workflow would each need a new input to see it, and planning would gain a second store beside the graph. A perspective suits a reader's own concern; a roadmap is one authored choice for the whole corpus.
- alternative: A new relation such as `precedes`, or a rank on each Spec: the planning truths decision refused `precedes` for its engine surface across the model, the carriers, extraction, validators and the agent surface, and a rank on the truth primitive is a status that goes stale with every edit and invites scoring.
- alternative: A boolean field such as `roadmap: true`: it names the noun but not what differs, which is the meaning of the order; `order: priority` says that directly.
- alternative: Prose, as today: the graph cannot read it, and each forward section is rewritten by hand and drifts from the Specs it names.
- consequence: The planning truths decision's refusal of recorded work order narrows for this one case: a roadmap's priority is graph structure, carried as its Pack's member order, and never workflow authority. Plan numbering, staleness and every other recorded work order stay out of the graph.
- consequence: The Pack manifest admits `order`, in the Markdown and the TypeScript manifest alike; the Pack node carries `order` when the manifest states it, after `modelRefs` in the serialized node; any other value refuses at extraction as a malformed envelope field does; and the Pack model names the priority order. These touch the Pack carrier, the Pack model and the Pack node's member-order law, each enriched in place when the field is built.
- consequence: No check reads a roadmap's content. An entry already built, an order that disagrees with dependency, an empty roadmap and several roadmaps are never findings, because a place carries no authority and staleness is never a finding.
- consequence: Where priority and dependency disagree, a roadmap view shows what an entry rests on and never reorders it; readiness statements keep the statement queue's dependency order, in a roadmap's list of what waits on a person as everywhere else.
- consequence: The design diff reports a change in what a Pack's order means apart from a change in its members' order, so a Pack that becomes or stops being a roadmap shows in a comparison even when its members stay. A base graph whose schema predates the field carries no `order` and reads as reading order, as an absent field does in every schema version; a value the head's engine does not know lies outside the common schema and is reported as a diagnostic, never compared. This touches the design diff and its Studio page when the field is built.
- consequence: A place on a roadmap confers what membership of any Pack confers, which is nothing: no readiness, no delivery fact and no gate.
- consequence: The roadmap reading, its page and its forward-section memo read a roadmap this way, under `spec:consumers.roadmap`.
