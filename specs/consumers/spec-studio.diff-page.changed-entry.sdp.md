---
id: spec:consumers.spec-studio.diff-page.changed-entry
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diff-page
  verifies:
    target: spec:consumers.spec-studio.diff-page
    exercises: [diffSections, specMarkers]
---
# The diff page shows a changed entry's base and built values

## Intent
- outcome: Execute the diff page on one changed Design entry: both values side by side, and the marker on the Spec's page.
- assumption: The world writes a root with one Spec whose Design entry `limit` reads `ten items`, writes its graph with `sdp build` and keeps it outside the root as the base, changes the entry to `twenty items`, builds the page set with the base, and reads the Spec's row on the diff page and the line under the Spec page's header.

```gwt
Given a base graph in which the Design entry {key: "limit"} of a Spec reads {before: "ten items"}
Given the built graph in which that entry reads {after: "twenty items"}
When the build renders the diff page
Then the Spec's row shows the base value {baseShown: "ten items"} and the built value {nowShown: "twenty items"}
Then the Spec's page carries the changed-since-base line: {marker: true}
```
