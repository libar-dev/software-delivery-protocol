---
id: spec:decisions.pack-design-page
kind: decision
altitude: feature
readiness: ready
relations:
  refines:
    - spec:consumers.design-review.pack-design-page
    - target: spec:decisions.shipped-projections-frozen
      reason: carves out the Pack page, which renders the Pack design
  dependsOn: spec:consumers.pack-design
---
# The Design Review's Pack page presents the Pack's design

## Intent
- outcome: Let a person working in the repository read where a Pack's design stands, what holds each member below its stated next rung, what the Pack rests on, and which code answers to it, on the page the Protocol already generates.

## Decision
- context: The Design Review's Pack page lists the members with their readiness and bindings, and the verifier gaps. The first adopter designs whole capabilities ahead of their code as Packs and generates its own page beside the Design Review, walking the readiness floor one rung above the stated rung, reading what the members rest on outside the Pack, joining the open questions, and re-parsing carrier files for entry lines. Its design passes read that page first. The shipped projections are frozen, so the Pack page cannot change until a decision narrows the freeze for it.
- decision: The Design Review's Pack page renders the Pack design that `spec:consumers.pack-design` assembles: a member table in authored order with each member's stated rung, floor reached, the rung above the stated rung with the clause that holds it there, its design columns and its bindings; a section naming what holds each member below its stated next rung; the Specs outside the Pack that members rest on and that rest on members; each member's open questions with their entry addresses and source lines; and each member's realizing and referencing code units with their roles and their components' layers and contexts. The verifier gaps and findings stay. The freeze on the four shipped projections stands for everything else, the Spec page and the index included.
- rationale: The assembly already exists as graph data and reader values, and an adopter that rebuilds it by hand evaluates the floor a second way, which can disagree with the reader's. One assembly in the reader, rendered on the page the Protocol ships, gives a reviewer the design as it stands and leaves the adopter's script nothing to recompute.
- alternative: Starting the Spec Studio with an HTML Pack page is closer to the original design, but the Studio is a later arc, and the Pack design data serves it unchanged.
- alternative: Shipping the assembly as data only keeps every projection frozen and leaves rendering to each adopter, which is the burden this record removes.
- consequence: Line links on the page point into carrier files through the graph's location table, so the page stays a function of the graph alone.
