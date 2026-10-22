# Lane R: the roadmap, and plans become the roadmap

Read `/tmp/plan47-briefs/common.md` first; it applies in full. Worktree: `/tmp/plan47-wt/R` on
branch `p47/r-roadmap`. Report step name: `design`.

## The questions

The owner: "Prioritize upcoming features, like a roadmap, tied directly to our PR descriptions:
things to design, and a prioritized list of things to implement." And: "Can we replace plans with
actual Specs: no prose in the plan, but designed, grouped, prioritized roadmaps and sets of
features or epics?" And for this arc: the roadmap is an example, "enough work for some amount of
upcoming PRs", updated as work lands, never every feature.

What exists: dependency order (the statement queue, recipe 46), ready and unbuilt (the build
backlog, recipe 1), defined and unbuilt (the design backlog, recipe 33). What is missing is
priority. The planning truths decision (MD-33) places every planning truth in a graph home and
refuses "recorded work order" as graph structure; `spec:consumers.graph-first-planning` says plan
numbering, recorded work order and staleness never become graph structure or workflow authority;
`spec:consumers.projections-model.roadmap-views` waits on `#namedRoadmapReader`, which the owner,
asking for roadmaps, now answers.

The coordinating session's recommendation, at confidence 4 of 5: a roadmap is a Pack whose member
order is an advisory priority; no new relation, no dates, never a gate; the roadmap page reads the
ordered epics and features and splits them into to design and to build; a decision refines MD-33.
Weigh it; do not inherit it. The owner decides priority in the graph and retiring the plans.

Evidence of what an adopter's roadmap holds: the platform keeps `design/ROADMAP.md`,
`design/PLAN.md`, `design/STATE.md` and `design/SESSIONS.md` in prose (units, rounds, lanes, a kind
per unit of decide, design, build or mixed, sizes, what each needs first) in the platform copy.
The Protocol keeps `plans/` (read plan 46 as an executed arc), and its gate
`check-self-hosting-gates.mjs` section 4 requires the highest numbered plan to carry a status
header the handbook names. `AGENTS.md`'s "PR descriptions as durable context" asks every PR
description for a forward section: the next PR's lanes as a table with why now, the re-entry
condition, the arc after, the owner's waiting statements, deferred items with triggers from
recipe 20, and the refused list.

## Do

1. **Priority** (`spec:decisions.roadmap-priority`, answer `#priorityHome`): draft the decision to
   `defined` for the owner with its context, the decision you recommend, the rationale under the
   ADR three-part test, the alternatives with why each loses (at least: a manifest field that
   marks a Pack's order as priority; a Pack the corpus names by convention; priority outside the
   graph as corpus data a recipe reads, like a perspective's `order`; prose as today), and its
   consequences, including what it narrows in MD-33 and in `spec:consumers.graph-first-planning`.
   State your confidence. If your recommendation needs an engine change (a manifest field), name
   the Specs and the validator it touches.
2. **The roadmap reading** (`spec:consumers.roadmap`, answer `#lanes`): what an entry is (an epic,
   a feature, a story), how its lane is derived (to design, to build, built) from stated
   readiness, delivery facts and its descendants, with the build backlog's exclusions; what the
   view shows an entry still needs (its stated next rung and what holds it, its blocking
   questions, what it rests on outside the roadmap); how a built entry reads until someone edits
   the roadmap; recipe 53's answer shape as keyed Design entries.
3. **The page and the memo**: `spec:consumers.spec-studio.roadmap-page`, and
   `spec:consumers.roadmap.memo` with recipe 55, which renders the roadmap's next entries as the
   Markdown forward section a PR description carries; say where "why now" comes from (an
   entry's own intent, the Pack's framing, a relation reason) without authoring status.
4. **The first roadmap.** Author a roadmap Pack (name it; propose whether it is one living Pack)
   in your worktree as the example: this arc's items first, then the next few PRs' work, never
   every feature. Candidates beyond this arc: `spec:consumers.edit-model` and
   `spec:consumers.intent-composition` (ready and unbuilt, the build backlog),
   `spec:consumers.spec-studio.cited-line-text` and `spec:consumers.spec-studio.register-input`
   (PR 35's forward lanes, captures), and what the platform's mass update is expected to ask
   (PR 35's forward section). Take the two captures to their honest rung with their questions.
   If your recommended priority home needs an engine change the build has not made, author the
   Pack as an ordinary Pack whose framing says its order is the proposed priority.
5. **Plans become the roadmap** (`spec:decisions.roadmap-over-plans`, answer `#planCarrier`, and
   `spec:protocol.roadmap-replaces-plans`): draft the decision to `defined` for the owner, and
   design the replacement exactly: the handbook's text that points an agent at the roadmap recipe
   instead of "the highest primary-numbered plan" (propose the `AGENTS.md` edits as exact text),
   what replaces the current-record check in `check-self-hosting-gates.mjs` section 4 while its
   frozen historical checks stay, the edits to `spec:consumers.graph-first-planning`, the
   authoring skill's plan-pointer lines and the PR description standard, where an arc's execution
   record and ruling tables live once plan files stop growing, and the light cleanup this needs
   (name each file and what changes). The heavy cleanup of superseded material is a later arc.
6. **Roadmap views**: answer `#namedRoadmapReader` in `spec:consumers.projections-model.roadmap-views`
   and reshape it (release and baseline views may stay deferred with their own trigger).
7. **Prototype** the roadmap page and the memo on the Protocol's corpus with your roadmap Pack,
   and on the platform copy with a trial roadmap Pack you author in a copy of it from the next
   units its `design/ROADMAP.md` names, with screenshots, and the memo as rendered Markdown.
