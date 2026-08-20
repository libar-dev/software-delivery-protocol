---
id: spec:model.structural-patterns
kind: model
altitude: feature
readiness: idea
relations:
  refines: spec:model.anchors
---
# Structural anchors can express architecturally significant patterns

## Intent

- outcome: Architecturally significant patterns and relationships in bound code are expressible through anchor structure so the graph answers architecture questions beyond component membership and uses edges.

### Open questions

- [blocking] Does a vocabulary beyond `component` and `uses` pass the ADR three-part test at all, and which carrier would hold it without promoting mechanical structure into curated intent — new anchor fields, `component:` namespace conventions, or relations on Specs?
- [blocking] "Pattern" is not a ratified term in the language base; the concept needs a ratified name and a boundary against the anchor law's identity-only contract before any field is designed.

## Model
