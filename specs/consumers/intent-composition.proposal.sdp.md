---
id: spec:consumers.intent-composition.proposal
kind: contract
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.intent-composition
  dependsOn:
    - spec:consumers.edit-model
    - spec:consumers.agent-surface.address-and-cycle-recipes
---
# A change proposal is addressed, based and checked before it lands

The original design's patch loop made every change from a view reviewable and checked before it touched source. A patch named its target, the graph hash it was made against, a rationale, its operations and who proposed it; a CLI checked its schema and its base, applied it to a copy of the graph, ran the validators and only then rewrote the Spec files (`docs/lineage/v0-design/02-system-architecture.md` §2; `07-spec-studio-and-projections.md` §6). The Protocol refused the patch and the codemod. A view composes scoped intent, an agent edits source as a person would, git records the edit and the same checks evaluate it. That edit model drops two things the patch loop gave: a proposed change a person can review before an agent applies it, and a guard against a proposal made against an older design.

The first adopter's agents already write proposals in that shape. A design pass returns findings that each name an entry address or a Spec section, state the gap, and propose exact text for a Spec with the entry it replaces or follows (`libar-platform/design/advisors/task-pass.md`), and its register tool applies a JSON patch only after checking all of it (`libar-platform/design/advisors/register.md`). This Spec states the reviewable half of the patch loop without the codemod. A proposal is a request that an agent applies as an ordinary edit, checked by `sdp validate` on a worktree before it merges. It also gives the Spec Studio's composing panel a shape to hand off.

## Intent
- problem: A proposed design change travels as free prose, so a reviewer cannot tell what it touches, which version of the design it read, or whether it still applies once the design has moved.
- outcome: Give a proposed design change a reviewable shape: what it touches by Spec id or entry address, the commit it was read at, the change requested and why, checked on a worktree before merge.

### Open questions
- [blocking #proposalCarrier] What carries a proposal: a JSON document a recipe takes as a parameter, a Markdown memo with one entry per change, or both from one schema?
- [blocking #staleBase] When the scope changed between the base commit and the head, is the proposal refused, flagged for a person, or compared entry by entry so that only a change touching a moved entry is held?
- [non-blocking #proposer] Does a proposal name who proposed it, as the original's `proposedBy` did, or do git authorship and co-author trailers stand in once it is applied?
- [non-blocking #batchProposals] Is a proposal one change, or may it hold several changes to several Specs that land together or not at all?

## Contract
- A proposal names its scope as one or more Spec ids or entry addresses, each resolved by address resolution before anything is applied.
- A proposal names the commit whose graph it was read against.
- A proposal states the requested change in words an agent can apply, such as the exact text for an entry with the address it replaces or follows, a new open question with its flag, or a relation to declare or remove.
- A proposal states its reason in one line.
- Applying a proposal is an ordinary source edit by an agent or a person; no tool rewrites a carrier from it, and nothing is applied to a copy of the graph first.
- An applied proposal lands only from a worktree on which `sdp validate` reports no error, and the conformance and honesty checks stay the only gate.
- A proposal carries no status, approval or verdict, and the graph records none; whether it was accepted is git history and the adopter's own record.
