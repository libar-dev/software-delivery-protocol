---
id: spec:consumers.review-perspectives
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.projections-model
  dependsOn: spec:consumers.pack-design
---
# A Pack is read from a named perspective

The original design gave every reader one reading surface, each reading from their own concern: the analyst, the domain engineer, the architect, the tester, the designer and the agent (`docs/lineage/v0-design/04-authoring-surfaces.md` §6). The first adopter iterates each capability's design through four advisor lenses, its runtime platform, the domain, operations and the product, each a written list of the questions its field asks, run over the same Pack by the same pass brief (`libar-platform/design/advisors/lenses/`, `libar-platform/design/advisors/task-pass.md`). It asks for a lens to be a filter over the same capability that reorders and emphasizes questions, entries, examples and constraints and opens the same Specs, with no new Spec kind and no compulsory sequence of stages (`libar-platform/docs/feedback/sdp-feedback-02.md`, item 28).

The word needs a ruling before this Spec matures. The Spec Studio already calls its graph views lenses, its Packs, architecture, tests and evidence views, and the projections model defines a discipline as a lens or projection that filters Specs by kind or section. The adopter's lens is a reader's concern, not a view of the graph. This Spec says perspective until the owner rules.

## Intent
- actor: A reviewer or an agent who reads a Pack for one concern, such as the domain model, operations or the runtime platform.
- problem: Every reading of a Pack shows every member in the same order with the same emphasis, so a reader with one concern sorts it by hand, and an adopter keeps its perspectives as prose briefs the graph cannot apply.
- outcome: Let a reviewer read the same Pack from one perspective at a time, filtered and ordered for that perspective, without a new kind or a stage.

### Open questions
- [blocking #perspectiveTerm] Which word names this: perspective, lens or discipline? Lens already names the Studio's graph views, and discipline is defined as a lens or projection over kinds and sections; one concept takes one word.
- [blocking #perspectiveHome] Where is a perspective declared: as corpus data a recipe takes as a parameter, as a corpus file the reader loads, or only in the corpus's own brief? A perspective the Protocol lists or checks would be a registry, which the architectural annotation decision refused for roles.
- [non-blocking #perspectiveSelectors] What may a perspective select on: kind, section, Design key, question key, relation type, component layer or context, or a Spec family?

## Behavior
- rule: A perspective filters and orders a Pack's members and their content and never changes them; every row opens the same Spec, and the whole Pack stays one step away.
- rule: A perspective adds no kind, readiness, stage or sequence; reading a Pack from one perspective records nothing, and no perspective is required before another or before `ready` is stated.
- rule: The corpus owns its perspectives and their questions; the Protocol supplies the filter and ships no list of perspectives.
