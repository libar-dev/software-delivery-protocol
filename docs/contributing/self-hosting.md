# Working in the self-hosting checkout

The shipped skills speak to any project. This page holds what only this checkout needs, beyond the
runner, exclusions and green gate in `AGENTS.md`.

## Orientation

`skills/sdp-agent-surface/scripts/orientation/protocol-checkout.json` supplies the subjects
orientation uses here when you pass none. `pack:self-hosting-v1` holds every Spec; `pack:roadmap`
is the one priority Pack.

## Generate and check

`npm run generate:self-hosting` builds this corpus with its three exclusions and publishes its
contracts, registrars and all five page roots together; `npm run generate:example` does the same for
`examples/checkout-v1`. `check:self-hosting` and `check:example` need each root's prior tree: the
Design Review checks that it renders the same twice, and the census, Mermaid, Gherkin and Studio
compare the prior tree's bytes with the current render. The self-hosting oracle,
`test/self-hosting-oracle/`, pins every Spec, Pack member, anchor and retained warning, so a corpus
or anchor change updates it in the same commit.

## Binding

- A constant-form anchor in `src/` imports its builders relatively from `src/ids.ts`,
  `src/anchors.ts` or `src/model/code-anchor.ts`, trusted because the root's `package.json` names
  the package; tests import them from `@libar-dev/software-delivery-protocol`. A relative import
  of any other module, `src/index.ts` included, binds nothing and reports nothing.
- Every suite that imports a generated contract, adopted registrars included, is listed in
  `contract-dependent-suites.mjs`, which the test wrapper and lint both read.
- Each skill is a deliverable, and its Markdown files are pieces of it, never deliverables alone.
  The anchors that bind each skill to its on-ramp Spec sit in `test/skills.test.ts`, under the
  document-realization convention.
- Before naming an engine component's role, read recipe 28
  (`dist/recipes/28-roles-layers-and-contexts.js`) and `spec:protocol.role-vocabulary`; the
  accepted set of significant units is `spec:protocol.significant-units-review`.
