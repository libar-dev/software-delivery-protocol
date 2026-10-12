---
id: spec:consumers.review-perspectives
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
  dependsOn: spec:consumers.pack-design
---
# A Pack is read from a named perspective

The original design gave every reader one reading surface, each reading from their own concern: the analyst, the domain engineer, the architect, the tester, the designer and the agent (`docs/lineage/v0-design/04-authoring-surfaces.md` §6). The first adopter iterates each capability's design through four advisor lenses, its runtime platform, the domain, operations and the product, each a written list of the questions its field asks, run over the same Pack by the same pass brief (`libar-platform/design/advisors/lenses/`, `libar-platform/design/advisors/task-pass.md`). It asks for a lens to be a filter over the same capability that reorders and emphasizes questions, entries, examples and constraints and opens the same Specs, with no new Spec kind and no compulsory sequence of stages (`libar-platform/docs/feedback/sdp-feedback-02.md`, item 28).

The owner ruled the word: perspective. The Spec Studio keeps lens for its graph views, its Packs, architecture, tests and evidence views, and discipline stays the filter by kind or section. The adopter's advisor lens is a reader's concern, not a view of the graph, so in the Protocol's terms it is a perspective.

## Intent
- actor: A reviewer or an agent who reads a Pack for one concern, such as the domain model, operations or the runtime platform.
- problem: Every reading of a Pack shows every member in the same order with the same emphasis, so a reader with one concern sorts it by hand, and an adopter keeps its perspectives as prose briefs the graph cannot apply.
- outcome: Let a reviewer read the same Pack from one perspective at a time, filtered and ordered for that perspective, without a new kind or a stage.

## Behavior
- rule: A perspective filters and orders a Pack's members and their content and never changes them; every row opens the same Spec, and the whole Pack stays one step away.
- rule: A perspective adds no kind, readiness, stage or sequence; reading a Pack from one perspective records nothing, and no perspective is required before another or before `ready` is stated.
- rule: The corpus owns its perspectives and their questions; the Protocol supplies the filter and ships no list of perspectives.
- rule: A perspective is corpus data: a JSON object the corpus keeps beside its briefs and passes to the perspective filter, a catalog recipe, through `--params`. The reader loads no perspective file, and no validator lists or checks perspectives, so no registry forms.
- rule: A perspective selects members by Spec id or id prefix, kind, section presence, Design key with an optional value, question key, and authored relation type with a stated direction; it selects component layer or context only through the member's code unit bindings, satisfying or referencing, that the perspective names; it infers nothing from prose, paths or imports.
- rule: A member selected by a Design key, including the `layer` and `context` keys a component design states, is selected on declared intent; a member selected through a binding's component is selected on anchored structure; each row names which, and the two are never merged into one architecture answer.
- rule: Values within one selector are alternatives and different selectors combine as requirements; an unsupported selector is a diagnostic in the result, and a valid selector that matches nothing is an explicit empty result.
- rule: Members keep the manifest's authored order unless the perspective gives an explicit priority order, authored order breaking ties; every selected member's blocking questions stay visible whatever else the perspective filters out.
