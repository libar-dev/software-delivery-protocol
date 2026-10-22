---
id: spec:consumers.context-bundle.parts-cover-the-pack
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.context-bundle
  verifies:
    target: spec:consumers.context-bundle
    exercises: [parts, partBoundaries, partCuts, partHeader, sameParts]
---
# A Pack too large for one bundle reads whole in parts

## Intent
- outcome: Execute the parts rules on a probe Pack whose members together exceed the budget while each fits a part alone.
- assumption: The world writes a probe Pack of three story-altitude behavior Specs stating `idea`, each with an Intent outcome and a narrative of 6,000 letters, none related to a Spec outside the Pack. It runs the shipped context bundle file through `sdp q --json` with the Pack, the budget and `part: 1`, reads `part.of`, then asks for every other part in turn. It checks that each part's `used` is at most the budget, that no part's `leftOut` names a cut, that every part repeats the scope and the Pack, and that only part 1 carries a boundary.

```gwt
Given a probe Pack of three members whose bundle exceeds the budget {budget: 10000} {sizes: "while each member fits a part alone"}
When each part of its context bundle is requested in turn
Then the bundle comes in {parts: 3} parts, each within the budget
Then the members of the parts, in part order, are the Pack's members in authored order, each once: {complete: true}
```
