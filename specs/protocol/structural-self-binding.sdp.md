---
id: spec:protocol.structural-self-binding
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  decidedBy: spec:decisions.architectural-significance-rides-primitives
---
# The engine's structural self-binding covers its architecturally significant units

## Intent

- outcome: Every architecturally significant engine unit carries component membership and uses declarations so structural recipes and the census answer architecture questions about the engine itself.

## Behavior

- rule: The significance criterion for engine self-binding is exported public surface plus cross-component reach.
- rule: Every architecturally significant unit is covered at Spec-realization grain: it carries component membership through the anchor of the Spec it honestly realizes, or — for an implementation helper with no honest satisfies target of its own — through the nearest honest realization anchor that consumes it; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself.
- rule: A component-level uses declaration tracks real imports, value or type, from another component's source files; imports that exist only to author the anchors themselves (the stable-id and anchor-builder modules) confer no edge.
- rule: The accepted set of architecturally significant units is an owner-reviewed declaration recorded in the self-hosting oracle, never derived from imports or exports; the suite census-checks that every accepted unit carries its declared membership and that no unrostered membership edge exists.
