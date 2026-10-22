---
id: pack:corpus-checks-v1
specs:
  - spec:validation.corpus-rules
  - spec:validation.corpus-rules.error-finding-fails
  - spec:validation.corpus-rules.warning-finding-informs
  - spec:validation.corpus-rules.malformed-finding-fails
  - spec:validation.corpus-rules.copies-contain-changes
  - spec:validation.corpus-rules.rules-edit-starts-a-cycle
  - spec:validation.corpus-rules.params-edit-starts-a-cycle
  - spec:validation.corpus-rules.unreadable-params-fail-one-file
  - spec:validation.architecture-constraints
  - spec:validation.architecture-constraints.forbidden-layer-pair
  - spec:validation.architecture-constraints.isolated-context-as-rule
  - spec:validation.architecture-constraints.unstated-layer-unclassified
  - spec:model.planned-architecture
  - spec:model.planned-architecture.unrealized-design
  - spec:model.planned-architecture.differing-layer-and-uses
  - spec:model.planned-architecture.matching-design
---
# Corpus checks

This Pack groups what a corpus needs to check its own policy on the one validation path, in reading order. Corpus rules are the corpus's own graph bodies that `sdp validate --rules` runs and reports apart from the Protocol's findings. The architecture walk is a catalog recipe a corpus runs as one of those rules, over the layers, contexts and uses its anchors state. Component designs state the components a design adds before their code exists, and a catalog recipe compares them with the components the anchors later realize. Each Spec is followed by the examples that will verify it.
