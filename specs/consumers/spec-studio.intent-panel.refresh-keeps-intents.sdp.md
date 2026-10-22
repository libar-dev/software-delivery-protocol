---
id: spec:consumers.spec-studio.intent-panel.refresh-keeps-intents
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.intent-panel
  verifies:
    target: spec:consumers.spec-studio.intent-panel
    exercises: [persist]
---
# Refreshing a tab keeps every gathered intent

## Intent
- outcome: Execute the panel's persistence across a refresh of the tab.
- assumption: The world runs the composing panel's element module under Node with a storage object standing in for the browser's local storage, gathers the intents through the panel's own gather call, then creates a fresh panel over the same storage and page root, as a refreshed tab would, and counts the intents it shows.

```gwt
Given the composing panel holds {gathered: 3} gathered intents
When the person refreshes the tab
Then the composing panel holds {kept: 3} gathered intents
```
