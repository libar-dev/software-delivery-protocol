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

At an adopter's scale a bundle is mostly structure, so its shape is compact. Each member and each example row names its carrier file once. A cut entry without an entry address keeps only its line, since its row and its place in the bundle already name it. A question, a pinned value or a member example's steps appears in one place. Pinned declarations stay whole by default, because a builder and a test author hold to them. A caller whose scope still does not fit may let the bundle cut them to their entry addresses, and then reads each one in its Spec when the pass needs it. A partial bundle stays refused, because a bundle missing members would read as the whole scope.

## Intent
- actor: An agent starting one design pass over a Pack or an ordered list of Specs.
- problem: Each pass assembles the same reading material by running the same recipes and joining their answers by hand, and nothing bounds what it hands the model.
- outcome: Give an agent the reading material for one design pass in one composed slice of the graph within a stated budget, so no session hand-assembles it.

## Behavior
- rule: A bundle is a catalog recipe that takes its scope and its budget as recipe parameters; it adds no entrance and no query verb.
- rule: A bundle is composed from the graph on each invocation by the reader every recipe uses; nothing is precomputed, saved or committed, and two invocations over the same graph with the same parameters compose the same bundle.
- rule: A bundle takes one scope: `pack`, a Pack id, or `specs`, an ordered list of Spec ids. For `specs` the members are the listed Specs in the given order and the boundary is each member's one-hop neighbors through the four typed relations both ways, with `verifies` and `supersedes` apart, as the Pack boundary is built. Both scopes or neither is a diagnostic result. A changeset fills `specs` from the impacted Spec ids changed-file impact reports, and a Pack's open questions are read from the Pack bundle, not from a third scope.
- rule: With `pack`, a bundle may take `members`, an ordered subset of the Pack's member ids, which the perspective filter returns; it keeps the Pack's framing and boundary, lists only those members in that order, and states that it is a subset, so one filter implementation serves both recipes.
- rule: A bundle for a Pack carries the Pack design assembly, its members in authored order with their design columns and its boundary, then each member's open questions with their addresses and lines, its dependency footing, its pinned declarations and its examples.
- rule: The budget is a hard limit on a successful bundle, counted in UTF-16 code units, the `length` a recipe body reads, of the compact `JSON.stringify` of the value the recipe returns, its scope, budget and left-out statement included; `sdp q --json` prints a longer indented form, and the budget never measures printed text. The bundle also reports a token estimate labeled as an estimate, so no model's tokenizer binds the Protocol.
- rule: [#oneCopy] A bundle carries a member's open questions only in its `questions`, a pinned declaration's value only in its member's Design section, and an example's steps only in its own member row when the example is a member of the bundle; an example outside the bundle keeps its steps in the row of each member it refines or verifies.
- rule: [#cutOrder] When the scope exceeds the budget, the bundle cuts in a fixed order and stops at the first cut after which it fits: boundary rows down to their ids, footing rows down to their ids, member narrative, example step text, non-blocking question text, remaining section values other than pinned declarations, then, only when the caller allows it, pinned declarations down to their entry addresses. It never cuts member ids, the stated rung, the floor reached, the stated next rung, blocking questions or entry addresses, and it cuts nothing else.
- rule: [#declarationAddresses] A caller allows the last cut by passing `declarations: "addresses"`; without it, or with `declarations: "whole"`, pinned declarations stay whole, and any other value is a diagnostic result.
- rule: When the protected content alone exceeds the budget after every permitted cut, the recipe returns a budget-exceeded result as data and no partial bundle: the requested scope, the budget, and the minimum count the protected content needs in the same unit; `sdp q` exits 0, because the result is the body's return and not a refusal.
- rule: A bundle gives the file and line of an entry or a binding in place of a source excerpt, because the reader never reads source.
- rule: A bundle states its scope, its budget and what it left out to stay within the budget, so a reader knows what to read in the Specs themselves.
- rule: A bundle carries facts from the graph and no instructions of its own; the brief that tells an agent what to look for stays the corpus's own text.

## Design

- bundleRecipe: recipe 36, the context bundle, takes exactly one scope, `params.pack` or `params.specs`, an optional `params.members` beside `pack`, `params.budget`, 100,000 code units by default, and `params.declarations`, `"whole"` by default or `"addresses"`; a missing, doubled or unknown scope, or another `declarations` value, returns `{ diagnostics }` and no bundle.
- bundleShape: `{ scope, budget, declarations, used, tokenEstimate: { value, method }, leftOut, pack, members, boundary }`, where `declarations` is the mode in force, `pack` is `{ id, title, framing }` for a Pack scope and null otherwise, and `tokenEstimate.method` reads `UTF-16 code units divided by four, an estimate`.
- memberShape: `{ id, file, title, specKind, altitude, statedReadiness, floorReached, statedNextRung, holds, narrative, sections, questions, footing, declarations, examples, design, decisions, implementedBy, referencedBy, verifiers }`, with `file` the member's carrier path; `sections` as the graph holds them, without `intent.openQuestions`; `questions` one row per open question in authored order, `{ index, question, blocking, key, address, line }` with its fields, `key` absent and `address` null when it has none; `footing` as dependency footing (recipe 21) reports it; `declarations` the keys of the member's pinned declarations in Design order; `design` the counts of entries, declarations, open questions and blocking questions; `decisions` the decisions its design columns name; `implementedBy` and `referencedBy` as `{ id, claim, file, line, role, component }`; and `verifiers` as `{ id, claim, enabled, file, line }`. `holds` lists the member's stated-next-rung failures as the reader returns them, each with its `clauseId` and `description`, and with `targets` on a typed-dependency failure.
- exampleRow: `{ id, member, file, statedReadiness, enabled, steps }` lists one example that refines or verifies the member, in id order, with `member` true and `steps` null when the example is itself a member of the bundle, its steps then sitting in its own member row.
- pointer: `{ line }` replaces a cut entry that has no entry address, `line` being the line the location table records for it, or null when it records none; the entry's Spec and file are those of the row that holds it, and its place in the bundle names its path. A cut entry whose text names other entry addresses becomes a list of them, led by its own address when it has one and otherwise ended by its pointer.
- boundaryRows: a Pack scope's boundary is the Pack design's; a Spec-list scope's boundary is every Spec outside the list one authored relation away from a listed Spec, in the same row shape.
- footingCut: `{ refines, dependsOn, constrainedBy, decidedBy }` replaces a member's footing at the footing cut, each a list of target ids in code-unit order, with a type that has no target left out.
- narrativeCut: The narrative cut replaces a member's narrative with the entry addresses written in it, in order of first appearance and joined by single spaces, or with null when it holds none.
- exampleCut: The example cut replaces each entry of a member's `behavior.examples`, and its `behavior.exampleSpace`, with its pointer, and each example row's `steps` that are not null with the pointer of that example's `behavior.examples`.
- questionCut: The question cut replaces each non-blocking question in `questions` with its address, or with its pointer when it has no key, and with `{ pointer, links }` when it has links, `pointer` being that address or pointer; blocking questions stay whole.
- sectionCut: The section cut replaces each section entry other than a pinned declaration with its entry address when it has one, and otherwise with its pointer.
- declarationCut: The declaration cut, taken only under `declarations: "addresses"`, replaces each pinned declaration in its member's Design section with its entry address, or with its pointer when its key has none; the member's `declarations` keeps the keys.
- leftOutLines: One fixed line per cut taken, in cut order, makes up `leftOut`: `Boundary details; ids kept per direction.`, `Footing details; ids kept per relation type.`, `Member narrative.`, `Example step text, including member sections and example-space vocabulary.`, `Non-blocking question text; addresses and links kept.`, `Section entry values other than pinned declarations; addresses and lines kept.` and `Pinned declaration text; entry addresses kept.`
- budgetExceeded: `{ scope, budget, declarations, budgetExceeded: true, protectedLength, leftOut }` is the whole result when the protected content alone exceeds the budget after every permitted cut, with `protectedLength` in the budget's unit.
