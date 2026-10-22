---
id: spec:consumers.obsidian-vault.bases.views-match-sources
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault.bases
  verifies:
    target: spec:consumers.obsidian-vault.bases
    exercises: [corpusBase, packBase, viewsMirrorSources, closedClauses]
---
# Each standing view selects what its source selects

## Intent
- outcome: Execute the corpus Base, a Pack's Base and the closed clause grammar against the sources the views mirror, over one graph.

```gwt
Given a corpus holding a Pack of {members: 6} Specs, with a Spec in every standing view
When the vault command writes the vault
Then each standing view of the corpus Base selects the Specs its source selects: {viewsMatch: true}
Then the Pack's Base selects every member and nothing else: {packMatches: true}
Then every filter clause belongs to the closed grammar: {closedClauses: true}
```
