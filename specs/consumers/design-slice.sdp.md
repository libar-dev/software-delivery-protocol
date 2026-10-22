---
id: spec:consumers.design-slice
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:consumers.pack-design
    reason: a slice reads a Pack's design as one whole, with its architecture and open decisions beside it
---
# A slice reads a Pack as one design, with the architecture it touches and what each member needs next

Features that must be reviewed together are already grouped as a Pack, and the Pack page shows each member in turn. A design pass also needs the whole at once: how the members depend on each other, which components they touch, realized or planned, which decisions and open questions bound them, and what each member needs for its next rung. Rounds of design add detail a little at a time; the floor sets how little a rung needs, and how much is enough stays a judgment the authoring guidance supports and no check makes.

## Intent

- actor: A person or an agent running a design pass over features that must be reviewed together.
- problem: The Pack page reads member by member, so a reviewer assembles the dependency order, the touched architecture and the open decisions by hand before judging the design as a whole.
- outcome: Read a Pack as one design slice: its members and their relations, the components they touch, realized and planned, the decisions and open questions that bound them, and what each member needs for its next rung.
