---
id: spec:consumers.spec-studio.slice-page
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    target: spec:consumers.design-slice
    reason: the page renders the slice's answer
---
# A slice page shows a Pack's design as one whole

## Intent

- outcome: Give the Studio a page per Pack that shows its design slice: the members' dependency drawing, the components they touch, the decisions and open questions in scope, and each member's next rung.
