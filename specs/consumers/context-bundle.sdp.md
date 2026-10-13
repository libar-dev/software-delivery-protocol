---
id: spec:consumers.context-bundle
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  dependsOn: spec:consumers.agent-surface.design-recipes
  decidedBy: spec:decisions.agent-front-door
---
# A context bundle is composed per invocation within a stated budget

The original design precomputed graph slices for different reading scopes and a prompt bundle for one Spec. The Protocol keeps context bundle for the reading material of one design pass, composed on demand.

The first adopter's design passes assemble the same reading material by hand: the Pack design, member questions, dependency footing, pinned declarations and carrying Spec text where the graph answer falls short. Its perspectives read the same Pack for different concerns. The agent front door composes a bundle on each invocation; the bundle is never a committed answer in the graph's name. It builds on Pack design.

## Intent
- actor: An agent starting one design pass over a Pack or an ordered list of Specs.
- problem: Each pass assembles the same reading material by running the same recipes and joining their answers by hand, and nothing bounds what it hands the model.
- outcome: Give an agent the reading material for one design pass in one composed slice of the graph within a stated budget, so no session hand-assembles it.

### Open questions
- [non-blocking #declarationCut] No cut reduces a pinned declaration, so a Pack whose pinned declarations alone exceed the budget fits no bundle; may a caller ask the bundle to reduce pinned declarations to their entry addresses?
  - decider: owner
  - provisional: pinned declarations stay whole, and a caller narrows the scope to fewer members, such as one perspective's

## Behavior
- rule: A bundle is a catalog recipe that takes its scope and its budget as recipe parameters; it adds no entrance and no query verb.
- rule: A bundle is composed from the graph on each invocation by the reader every recipe uses; nothing is precomputed, saved or committed, and two invocations over the same graph with the same parameters compose the same bundle.
- rule: A bundle takes one scope: `pack`, a Pack id, or `specs`, an ordered list of Spec ids. For `specs` the members are the listed Specs in the given order and the boundary is each member's one-hop neighbors through the four typed relations both ways, with `verifies` and `supersedes` apart, as the Pack boundary is built. Both scopes or neither is a diagnostic result. A changeset fills `specs` from the impacted Spec ids changed-file impact reports, and a Pack's open questions are read from the Pack bundle, not from a third scope.
- rule: With `pack`, a bundle may take `members`, an ordered subset of the Pack's member ids, which the perspective filter returns; it keeps the Pack's framing and boundary, lists only those members in that order, and states that it is a subset, so one filter implementation serves both recipes.
- rule: A bundle for a Pack carries the Pack design assembly, its members in authored order with their design columns and its boundary, then each member's open questions with their addresses and lines, its dependency footing, its pinned declarations and its examples.
- rule: The budget is a hard limit on a successful bundle, counted in UTF-16 code units, the `length` a recipe body reads, of the compact `JSON.stringify` of the value the recipe returns, its scope, budget and left-out statement included; `sdp q --json` prints a longer indented form, and the budget never measures printed text. The bundle also reports a token estimate labeled as an estimate, so no model's tokenizer binds the Protocol.
- rule: [#cutOrder] When the scope exceeds the budget, the bundle cuts in a fixed order: boundary rows down to their ids, member narrative, example step text, non-blocking questions, then remaining section values other than protected content. It never cuts member ids, the stated rung, the floor reached, the stated next rung, blocking questions, pinned declarations or entry addresses.
- rule: When the protected content alone exceeds the budget after every permitted cut, the recipe returns a budget-exceeded result as data and no partial bundle: the requested scope, the budget, and the minimum count the protected content needs in the same unit; `sdp q` exits 0, because the result is the body's return and not a refusal.
- rule: A bundle gives the file and line of an entry or a binding in place of a source excerpt, because the reader never reads source.
- rule: A bundle states its scope, its budget and what it left out to stay within the budget, so a reader knows what to read in the Specs themselves.
- rule: A bundle carries facts from the graph and no instructions of its own; the brief that tells an agent what to look for stays the corpus's own text.

## Design

- bundleRecipe: recipe 36, the context bundle, takes exactly one scope, `params.pack` or `params.specs`, an optional `params.members` beside `pack`, and `params.budget`, 100,000 code units by default; a missing, doubled or unknown scope returns `{ diagnostics }` and no bundle.
- bundleShape: `{ scope, budget, used, tokenEstimate: { value, method }, leftOut, pack, members, boundary }`, where `pack` is `{ id, title, framing }` for a Pack scope and null otherwise, and `tokenEstimate.method` reads `UTF-16 code units divided by four, an estimate`.
- memberShape: `{ id, title, specKind, altitude, statedReadiness, floorReached, statedNextRung, holds, narrative, sections, questions, footing, declarations, examples }`, with questions carrying their address, blocking flag, line and fields, footing as dependency footing (recipe 21) reports it, declarations as pinned declarations (recipe 24) report them, and examples with their stated rung, whether they are enabled and their steps. `holds` lists the member's stated-next-rung failures as the reader returns them, each with its `clauseId` and `description`, and with `targets` on a typed-dependency failure.
- boundaryRows: a Pack scope's boundary is the Pack design's; a Spec-list scope's boundary is every Spec outside the list one authored relation away from a listed Spec, in the same row shape.
- fifthCut: The fifth cut reduces an addressable entry to its entry address and another entry to `{ spec, path, file, line }`, with `line` null when not located. Other entry addresses in removed text stay beside that pointer, and non-blocking questions retain their pointers and links; pinned declarations and blocking questions stay whole.
- cutEverywhere: every cut removes the affected text from each place it appears in the bundle, `sections` included, and blocking questions, pinned declarations and entry addresses stay whole in each place.
- budgetExceeded: `{ scope, budget, budgetExceeded: true, protectedLength, leftOut }` is the whole result when the protected content alone exceeds the budget, with `protectedLength` in the budget's unit.
