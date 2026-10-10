---
id: spec:decisions.pack-design-page
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.design-review
  dependsOn: spec:consumers.pack-design
  supersedes: spec:decisions.shipped-projections-frozen
---
# The Design Review's Pack page presents the Pack's design

## Intent
- outcome: Let a person working in the repository read where a Pack's design stands, what holds each member below its next rung, what the Pack rests on, and which code answers to it, on the page the Protocol already generates.

## Decision
- context: The Design Review's Pack page lists the members with their readiness and bindings, and the verifier gaps. The first adopter designs whole capabilities ahead of their code as Packs and generates its own page beside the Design Review, 1,201 lines of script that walks the readiness floor one rung above the stated rung, reads what the members rest on outside the Pack, joins the open questions, and re-parses carrier files for the line of each entry. Its design passes read that page first. The shipped projections are frozen, so the Pack page cannot change without a superseding record.
- decision: The Design Review's Pack page renders the Pack design that `spec:consumers.pack-design` assembles: a member table in authored order with each member's stated rung, floor reached, the rung above the stated rung with the clause that holds it there, its design columns and its bindings; a section naming what holds each member below its next rung; the Specs outside the Pack that members rest on and that rest on members; each member's open questions with their entry addresses and source lines; and each member's realizing and referencing code units with their roles and their components' layers and contexts. The verifier gaps and findings stay. The freeze on the four shipped projections stands for everything else, the Spec page and the index included.
- rationale: The assembly already exists as graph data and reader values, and an adopter that rebuilds it by hand reads the floor a second way, which the next-rung record showed it gets wrong. One assembly in the reader, rendered on the page the Protocol ships, gives a reviewer the design as it stands and leaves the adopter's script nothing to recompute.
- alternative: Starting the Spec Studio with an HTML Pack page is closer to the original design, but the Studio's package home and its reader are blocking questions, and the Pack design data serves the Studio later unchanged.
- alternative: Shipping the assembly as data only keeps every projection frozen and leaves rendering to each adopter, which is the burden this record removes.
- consequence: The Pack page grows from a member table to a design page, and the golden Design Review Pack pages regenerate.
- consequence: Line links on the page point into carrier files through the graph's location table, so the page stays a function of the graph alone.
