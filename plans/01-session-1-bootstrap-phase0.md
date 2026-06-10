# Session 1 — Bootstrap + Phase 0 (the protocol as typed code)

> **Status: ✅ EXECUTED (Session 1, `eb6bf2a`).** Implemented Slice 0 (`docs/concept/07` §1) — the typed
> meta-model as code (IDs · descriptors · sections · `Spec`/`Pack`/relations/anchors builders · graph
> schema · validator contracts · floor table as data · `sdp` CLI stub) — plus the repo/toolchain bootstrap
> (npm · ESM · TS strict · Vitest · tsup · ESLint/Prettier · Node ≥ 20), and authored the `checkout-v1`
> example against the DSL as the tracer bullet. Stopped before the extractor (Slice 1). The detailed
> file-by-file plan this document used to carry is in git history; the result is the repo itself
> (`src/`, `examples/`, `test/`). What followed: hardening + decisions in `plans/02`.

Two setup decisions worth remembering — they explain the repo's shape:

1. **The example imports the package by name** (`@libar-dev/software-delivery-protocol`) via a
   `tsconfig.examples.json` `paths` alias → `src/index.ts` — the *public* DX, never `../../src`. If the
   alias is wrong, the example silently typechecks against internals and the tracer bullet is defeated;
   the public barrel re-exporting everything the example needs is part of "done."
2. **The running example lives under `examples/checkout-v1/`, not `/specs/`.** `04` §5's `/specs` shape is
   a *consuming project's* root; the Protocol's own repo self-hosting is an explicit later milestone — a
   clearly-labeled fixture avoids prematurely claiming it.
