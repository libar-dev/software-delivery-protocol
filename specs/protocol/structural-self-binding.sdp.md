---
id: spec:protocol.structural-self-binding
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  decidedBy: spec:decisions.architectural-annotation
---
# The engine's structural self-binding covers its architecturally significant units

## Intent

- outcome: Every architecturally significant engine unit carries component membership, uses declarations, and a role, every engine component declares its layer and context, and a unit references the decisions it answers to, so structural recipes and the census answer architecture questions about the engine itself.

## Behavior

- rule: The significance criterion for engine self-binding is exported public surface or cross-component reach.
- rule: Every architecturally significant unit is covered at Spec-realization grain: it carries component membership through the anchor of the Spec it honestly realizes, or — for an implementation helper with no honest satisfies target of its own — through the nearest honest realization anchor that consumes it; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself.
- rule: A component-level uses declaration tracks real imports, value or type, from another component's source files; imports that exist only to author the anchors themselves (the stable-id and anchor-builder modules) confer no edge.
- rule: The accepted set of architecturally significant units is an owner-reviewed declaration recorded in the self-hosting oracle, never derived from imports or exports; the suite census-checks that every accepted unit carries its declared membership and that no unrostered membership edge exists.
- rule: Every engine `component:` anchor declares its `layer` and its `context`.
- rule: Every architecturally significant engine unit carries a `role`.
- rule: An engine unit references the decisions and designs it answers to through `references`, never through `satisfies`; a Spec Studio design that builds on engine code states that by its own `dependsOn` or `refines` to the Spec the code satisfies, never by a reference from the unit.
