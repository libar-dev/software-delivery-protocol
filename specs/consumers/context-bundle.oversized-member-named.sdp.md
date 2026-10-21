---
id: spec:consumers.context-bundle.oversized-member-named
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.context-bundle
  verifies:
    target: spec:consumers.context-bundle
    exercises: [oversizedItem]
---
# A member larger than the budget is named, and no part is returned

## Intent
- outcome: Execute the oversized-item rule on a probe Pack whose second member carries a blocking question longer than the budget, which no cut reduces.
- assumption: The world writes the probe Pack of the parts example, with short narratives, and gives its second member a blocking open question of 12,000 letters. It runs the shipped context bundle file through `sdp q --json` with the Pack, the budget and `part: 1`, and reads the budget-exceeded result's `oversized` items, joined by a comma and a space.

```gwt
Given a probe Pack of three members whose bundle exceeds the budget {budget: 10000} {sizes: "and one member carries a blocking question longer than the budget"}
When each part of its context bundle is requested in turn
Then the answer names the oversized items {oversizedItems: "spec:probe.two"}
```
