---
id: spec:carrier.sdp-import.feature-adapter
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:carrier.sdp-import
---
# A bare .feature corpus can be imported

## Intent
- outcome: Convert a bare .feature source corpus into canonical Protocol carriers without adding a second extraction path.

### Open questions
- [blocking #featureAdapter] Which bare .feature constructs can an import adapter preserve honestly?
  - decider: owner
  - trigger: an adopter migrates a gen-1 `.feature` corpus into the Protocol
