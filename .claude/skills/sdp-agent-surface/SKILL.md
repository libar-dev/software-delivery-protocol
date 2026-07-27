---
name: sdp-agent-surface
description: Query this repository's Spec graph through `sdp q` instead of reading spec files by hand. Use whenever a question is about the authored corpus — what a Spec says or guarantees, who verifies it, what is ready but unimplemented, what a change touches, where a concept lives, which Specs are in a Pack, or what the validation report says. Also use before editing `.sdp.md` files, before writing a Spec citation, and before answering "is this implemented / verified / ready".
---

# The agent surface

This repository models its own delivery lifecycle as typed `Spec` documents and derives **one
graph** from them. The graph — not the files — is the read model. The surface you read it through
is `spec:consumers.agent-surface`, realized by the front door
`spec:decisions.agent-front-door` (MD-22): the package exports the reader, and the CLI carries one
evaluation sink. There is no verb wall — you script the graph.

## Bootstrap discipline

For any corpus question, **query the graph before reading spec files**.

```sh
sdp q 'return g.specs().length' --exclude explorations --exclude examples --exclude test/fixtures/import/parity
sdp q 'return g.specContext("spec:consumers.reader")' --exclude explorations --exclude examples --exclude test/fixtures/import/parity --json
```

Those three exclusions are this repository's own and they are **required here**: the corpus carries
deliberate duplicate-id and carrier-parity fixtures, so without them the graph does not derive and
the sink refuses to run the body. They are the same list `npm run generate:self-hosting` passes.

The catalog of ready-made bodies is `docs/agent-surface/recipes.md` — build backlog, drift alarm,
per-Spec guarantees and verifiers, blast radius, Pack review backbone, concept search, readiness
divergence, warn-level signals. Every body there runs verbatim and a test proves it. Start from a
recipe; adapt it in place.

Reach for the files only when you need the authored prose itself — the exact words to edit.

## The contract

`sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--json]`

Three bindings are injected:

- `g` — the reader over the derived graph (the same `createReader` the package exports)
- `graph` — the raw graph schema (nodes, edges, claims)
- `report` — the validation report, so findings are queryable data, never a gate

Body rules: a plain JavaScript **async function body**. No `import`/`export`, no TypeScript-only
syntax; `await` is fine. `return` is the output contract — nothing else is printed. **Pre-shape the
return**: return counts, ids, and decoded reasons, not whole nodes. Default output is bounded
`util.inspect`; `--json` is the machine form.

`--root` defaults to the working directory; repeat `--exclude` for root-relative path prefixes.

The graph is derived on every invocation, so a Spec you just authored is queryable immediately and
no committed artifact answers in the graph's name. The sink writes nothing. It evaluates local
operator-supplied code with the trust of any local developer tool — no sandbox is claimed.

## The anti-anecdote rule

**The derived graph outranks this skill.** It also outranks any summary you cached earlier in a
session and any paraphrase in any document. If the graph and this file disagree, the graph is right
and this file is the bug — report it rather than reconciling in your head.

The same rule governs law: this skill cites Specs, it never restates them. When you need the law,
read the carrying Spec.

## What not to do

- **Do not parse `.sdp.md` files to answer graph questions.** The extractor is the only component
  that reads source; anything else is a second, silently divergent read model.
- **Do not propose new query verbs.** Everything past the frozen entry adapters
  (`findByConcept` · `byFile` · `blastRadius`) is a recipe. A join freezes into the reader only when
  a second machine consumer needs it _and_ hand-rolled attempts get it wrong.
- **Do not read `has-verifier` as "the tests pass."** It says a resolving verifier binding _exists_.
  Pass, fail, skip, and quarantine are CI's.
- **Do not read `implemented` as "it is live."** It says a code anchor binds to the Spec. Runtime
  evidence would be `observed`, which is not tracked.
- **Do not collapse the claim taxonomy.** `declared` is authored intent, `anchored` is a human
  binding from source, `inferred` is machine-derived structure. Carry the claim into your answer.
- **Do not treat stated readiness as derived readiness.** `statedReadiness` is the author's
  statement; `derivedReadiness` is the highest rung whose floor clauses pass. Report both when they
  disagree.
- **Do not author a delivery fact or a derived edge.** They are computed; writing one by hand is an
  honesty violation the checks will refuse.

## Vocabulary

The ratified glossary is `CONTEXT.md` — read it before inventing a term. The terms these queries
speak: `Spec` · `Pack` · `anchor` · `claim` · delivery facts · readiness floor · derived readiness ·
blast radius · at-risk · coverage-unknown · gap · orphan.
