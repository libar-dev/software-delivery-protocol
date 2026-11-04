# Bind code, tests and oracles

For writing or reviewing an anchor: identity, a label, targets and structure, never intent
(`spec:model.anchors`). A code anchor (`impl:`, `api:`, `component:`) `satisfies` Specs,
conferring `implemented`, `references` them, conferring nothing, or neither; a test anchor
(`test:`) `verifies`, the sole source of `has-verifier`; an oracle (`oracle:`) `models` one.

Code that may import the package writes a top-level constant; a runtime that must not load
`node:` modules imports the same builders from the `/anchors` subpath.

```ts
import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

const createOrderAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.create-order"),
  label: "creates an order from a cart",
  satisfies: ref("spec:orders.create-order"),
  references: [ref("spec:orders.checkout")],
});
void createOrderAnchor;
```

Code that imports nothing from the Protocol writes a top-level block in a `.ts` or `.tsx` file:
prose first, then one tag per line, lists comma-separated (`spec:decisions.anchor-comment-form`).

```ts
/**
 * Rebuilds the read model, one stream at a time.
 * @sdpAnchor impl:orders.read-model-rebuild
 * @sdpSatisfies spec:orders.create-order
 * @sdpReferences spec:orders.checkout
 * @sdpRole service
 */
export const rebuild = (stream: string) => replay(stream);
```

## The promise test

`satisfies` is a claim the satisfying units make together (`spec:decisions.anchor-binding-grain`).
List every promise the Spec carries, rules, flows, contract, Design and UI entries and
constraints alike (`g.specContext(id)`), then:

- the satisfying units together realize every promise, each realizing one at least: `satisfies`;
- a coherent part has its own trigger or step: split it into a child Spec, then test the parent
  again;
- otherwise `references`. A stub references; code never satisfies a decision.

A component and its members are one set. A reference runs one way, code to design: a new design
on existing code declares `dependsOn` or `refines` to the Spec that code satisfies. After a
design change, read the design diff (recipe 35, `dist/recipes/35-the-design-diff.js`) and test
again. Before merging or dropping an identity, list each promise its targets carry and the units
that still realize it.

## Architecture

`component` names a unit's one `component:` anchor, `uses` what it depends on, `role` its
pattern; `layer` (`edge`, `application`, `domain`, `adapter`, `infrastructure`) and `context`
go on a `component:` anchor only. None confers intent, a fact or a rung
(`spec:decisions.architectural-annotation`). Reuse values from roles, layers and contexts
(recipe 28, `dist/recipes/28-roles-layers-and-contexts.js`). A component no code realizes yet is
a Spec, never an invented anchor.

## Citations and documents

Entry citations (recipe 51, `dist/recipes/51-entry-citations.js`) lists addresses cited in
anchored files, and as a rules file reports unresolved ones (`spec:extraction.entry-citations`).
A Markdown deliverable cannot carry an anchor: the suite asserting that it ships carries one
labelled for it, and the document stays coverage-unknown in blast radius.
