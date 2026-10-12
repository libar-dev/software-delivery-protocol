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
# A context bundle is composed per invocation within a character budget

The original design cut the graph into slices for language models ahead of time. It wrote one slice per Pack, per capability, around a changed Spec, per readiness level and for failing tests, each under 32k tokens with its nodes, edges, source files, findings, open questions and a summary, and a prompt bundle for one Spec (`docs/lineage/v0-design/07-spec-studio-and-projections.md` §5.5, §13.2). The ratified vocabulary keeps the term for the reading material of one design pass.

Plan 35 deferred the bundle until evidence showed agent sessions still hand-assembling the same token-budgeted slice after the catalog recipes (plan 35, "H leftover projections"). The first adopter's evidence meets that trigger. Every design pass there starts from the same hand-written brief, which tells the agent to read the Pack's page, run recipes 5, 20, 21 and 24 over the Pack and its members, read the member Specs where the page falls short, and end the memo with what the page did not give (`libar-platform/design/advisors/task-pass.md`). Four advisor lenses run that brief over each Pack, and the adopter asks for the reading material to be generated from a Pack and a lens (`libar-platform/docs/feedback/sdp-feedback-02.md`, item 29). The agent front door refuses a committed artifact that answers in the graph's name, so a bundle is composed on each invocation and never saved as slices. It builds on the Pack design recipe, recipe 29.

## Intent
- actor: An agent starting one design pass over a Pack, a Spec's neighborhood or a set of open questions.
- problem: Each pass assembles the same reading material by running the same recipes and joining their answers by hand, and nothing bounds what it hands the model.
- outcome: Give an agent the reading material for one design pass in one composed slice of the graph within a stated budget, so no session hand-assembles it.


## Behavior
- rule: A bundle is a catalog recipe that takes its scope and its budget as recipe parameters; it adds no entrance and no query verb.
- rule: A bundle is composed from the graph on each invocation by the reader every recipe uses; nothing is precomputed, saved or committed, and two invocations over the same graph with the same parameters compose the same bundle.
- rule: A bundle takes one scope: `pack`, a Pack id, or `specs`, an ordered list of Spec ids. For `specs` the members are the listed Specs in the given order and the boundary is each member's one-hop neighbours through the four typed relations both ways, with `verifies` and `supersedes` apart, as the Pack boundary is built. Both scopes or neither is a diagnostic result. A changeset fills `specs` from the impacted Spec ids changed-file impact reports, and a Pack's open questions are read from the Pack bundle, not from a third scope.
- rule: With `pack`, a bundle may take `members`, an ordered subset of the Pack's member ids, which the perspective filter returns; it keeps the Pack's framing and boundary, lists only those members in that order, and states that it is a subset, so one filter implementation serves both recipes.
- rule: A bundle for a Pack carries the Pack design assembly, its members in authored order with their design columns and its boundary, then each member's open questions with their addresses and lines, its dependency footing, its pinned declarations and its examples.
- rule: The budget is a hard limit on a successful bundle, counted in UTF-16 code units, the `length` a recipe body reads, of the compact `JSON.stringify` of the value the recipe returns, its scope, budget and left-out statement included; `sdp q --json` prints a longer indented form, and the budget never measures printed text. The bundle also reports a token estimate labelled as an estimate, so no model's tokenizer binds the Protocol.
- rule: When the scope exceeds the budget, the bundle cuts in a fixed order: boundary rows down to their ids first, then member narrative, then example step text, then non-blocking questions. It never cuts member ids, stated and next rungs, blocking questions, pinned declarations or entry addresses.
- rule: When the protected content alone exceeds the budget after every permitted cut, the recipe returns a budget-exceeded result as data and no partial bundle: the requested scope, the budget, and the minimum count the protected content needs in the same unit; `sdp q` exits 0, because the result is the body's return and not a refusal.
- rule: A bundle gives the file and line of an entry or a binding in place of a source excerpt, because the reader never reads source.
- rule: A bundle states its scope, its budget and what it left out to stay within the budget, so a reader knows what to read in the Specs themselves.
- rule: A bundle carries facts from the graph and no instructions of its own; the brief that tells an agent what to look for stays the corpus's own text.

## Design

- bundleRecipe: recipe 36, the context bundle, takes exactly one scope, `params.pack` or `params.specs`, an optional `params.members` beside `pack`, and `params.budget`, 100,000 code units by default; a missing, doubled or unknown scope returns `{ diagnostics }` and no bundle.
- bundleShape: `{ scope, budget, used, tokenEstimate: { value, method }, leftOut, pack, members, boundary }`, where `pack` is `{ id, title, framing }` for a Pack scope and null otherwise, and `tokenEstimate.method` reads `UTF-16 code units divided by four, an estimate`.
- memberShape: `{ id, title, specKind, altitude, statedReadiness, floorReached, statedNextRung, holds, narrative, sections, questions, footing, declarations, examples }`, with questions carrying their address, blocking flag, line and fields, footing as dependency footing (recipe 21) reports it, declarations as pinned declarations (recipe 24) report them, and examples with their stated rung, whether they are enabled and their steps.
- boundaryRows: a Pack scope's boundary is the Pack design's; a Spec-list scope's boundary is every Spec outside the list one authored relation away from a listed Spec, in the same row shape.
- fifthCut: after non-blocking questions, the bundle reduces the remaining section entries other than pinned declarations to their entry address, or to `{ spec, path, file, line }` with `line` null when the entry is not located; the four cuts before it keep the ruled order.
- cutEverywhere: every cut removes the affected text from each place it appears in the bundle, `sections` included, and blocking questions, pinned declarations and entry addresses stay whole in each place.
- budgetExceeded: `{ scope, budget, budgetExceeded: true, protectedLength, leftOut }` is the whole result when the protected content alone exceeds the budget, with `protectedLength` in the budget's unit.
