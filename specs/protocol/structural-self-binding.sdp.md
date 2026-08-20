---
id: spec:protocol.structural-self-binding
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:protocol.self-hosting
---
# The engine's structural self-binding covers its architecturally significant units

## Intent

- outcome: Every architecturally significant engine unit carries component membership and uses declarations so structural recipes and the census answer architecture questions about the engine itself.

### Open questions

- [blocking] Which anchors outside the current component memberships are architecturally significant, and by what criterion — public surface, cross-component reach, or another boundary the owner ratifies?

## Behavior

- rule: Structural edges stay identity-only under the structural anchor semantics ruling; wider coverage confers no intent, delivery fact, or readiness effect.
