---
id: spec:consumers.intent-composition.proposal
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.intent-composition
  dependsOn:
    - spec:consumers.edit-model
    - target: spec:consumers.agent-surface.address-and-cycle-recipes
      reason: the check resolves entry-address scopes through address resolution
    - spec:consumers.design-diff
---
# A change proposal is addressed, based and checked before it lands

The original design's patch loop made every change from a view reviewable and checked before it touched source. A patch named its target, the graph hash it was made against, a rationale, its operations and who proposed it; a CLI checked its schema and its base, applied it to a copy of the graph, ran the validators and only then rewrote the Spec files (`docs/lineage/v0-design/02-system-architecture.md` §2; `07-spec-studio-and-projections.md` §6). The Protocol refused the patch and the codemod. A view composes scoped intent, an agent edits source as a person would, git records the edit and the same checks evaluate it. That edit model drops two things the patch loop gave: a proposed change a person can review before an agent applies it, and a guard against a proposal made against an older design.

The first adopter's agents already write proposals in that shape. A design pass returns findings that each name an entry address or a Spec section, state the gap, and propose exact text for a Spec with the entry it replaces or follows (`libar-platform/design/advisors/task-pass.md`), and its register tool applies a JSON patch only after checking all of it (`libar-platform/design/advisors/register.md`). This Spec states the reviewable half of the patch loop without the codemod. A proposal is a request that an agent applies as an ordinary edit, checked by `sdp validate` on a worktree before it merges. It also gives the Spec Studio's composing panel a shape to hand off.

## Intent
- problem: A proposed design change travels as free prose, so a reviewer cannot tell what it touches, which version of the design it read, or whether it still applies once the design has moved.
- outcome: Give a proposed design change a reviewable shape: what it touches by Spec id or entry address, the commit it was read at, the change requested and why, checked on a worktree before merge.

### Open questions
- [non-blocking #memoRecipe] Which catalog recipe renders a proposal as the Markdown memo a person reviews, so the Studio's composing panel and an agent hand off the same text?
  - decider: owner
  - links: spec:consumers.spec-studio.intent-panel
  - provisional: a person reviews the proposal's JSON beside the proposal check's rows

## Contract
- A proposal is one JSON document on one schema, which a recipe takes as a parameter; a Markdown memo is a rendering of that document and never a second source of it.
- A proposal names its scope as one or more Spec ids or entry addresses, each resolved before anything is applied: a Spec id through the reader's Spec context, an entry address through address resolution.
- A proposal names the commit whose graph it was read against.
- A proposal states the requested change in words an agent can apply, such as the exact text for an entry with the address it replaces or follows, a new open question with its flag, or a relation to declare or remove.
- A proposal states its reason in one line.
- The proposal check compares each change's scope between the proposal's base commit and the working tree through the design diff, entry by entry, and reports each change on its own row, so one changed scope never hides the state of another change; the check applies nothing and routes nothing.
- Applying a proposal is an ordinary source edit by an agent or a person; no tool rewrites a carrier from it, and nothing is applied to a copy of the graph first.
- A proposal carries no status, approval or verdict, and the graph records none; whether it was accepted is git history and the adopter's own record.
- A proposal carries no proposer. Whoever hands it over is its author until it is applied, and then git authorship and co-author trailers are the record; the schema refuses the field.

## Design

- proposalDocument: `{ "schema": "sdp-proposal/1", "base": "<commit>", "reason": "<one line>", "changes": [change] }`, with `schema`, `base`, `reason` and a non-empty `changes` required and no other field.
- proposalChange: `{ "scope": ["<spec id or entry address>"], "request": "<words an agent can apply>", "text": "<exact entry text>", "replaces": "<entry address>", "follows": "<entry address>", "relation": { "action": "declare", "from": "<spec id>", "type": "dependsOn", "target": "<spec id>" }, "reason": "<one line>" }`, with `scope` non-empty and `request` required, `replaces` and `follows` exclusive, `action` either `declare` or `remove`, `from` naming the relation's source Spec, and no other field.
- proposalSchemaFile: the package ships the document's JSON Schema as `schemas/sdp-proposal-1.schema.json`, so an agent can use it as a structured-output schema; the check recipe validates the same shape itself, and a test holds the two to the same accepted and refused samples.
- checkRecipe: recipe 38, the proposal check, takes `params.proposal` and `params.base`, the base graph, and returns `{ schemaProblems: [{ path, problem }], base, diagnostics, totals: { changes, moved, unresolved }, changes }`, with the design diff's `diagnostics` for the Specs it compares; when the document breaks the schema or the base graph is missing it returns the problems and no change rows.
- checkedScope: the check resolves and compares the deduplicated union of `scope`, `replaces`, `follows` and `relation.from`, and a change row's `scope` reports that union, so an entry a change replaces or follows cannot move unseen.
- checkRows: each change row is `{ index, scope: [{ ref, resolvesAtHead, resolvesAtBase, moved }], moved, relationTarget }`; an item's `moved` is true when its Spec is added or removed between the two graphs, and otherwise, for an entry address, when the entry's value is added, removed or changed, an order-only move leaving it false, or, for a whole Spec, when any of its parts changed or moved in order; the row's `moved` is true when any item's is; `relationTarget` is `{ ref, resolvesAtHead }` for a declared relation and null otherwise.
- incomparableScope: an item outside the common schema, or an otherwise unmoved whole-Spec item whose order across rules and flows one graph does not keep, carries `comparable: false` and a `reason` in place of `moved`; its row carries `comparable: false` and a null `moved` unless another item moved.
