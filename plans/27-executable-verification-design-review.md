# Plan 27 — Executable-verification design review, with the v0 design restored

> **Status:** ✅ EXECUTED 2026-08-13 — restored the ten-file v0 concept set as lineage
> evidence, reviewed it against gen-1 and the current executable path, and costed six
> unification options. The review recommended derived runnable tests (O3); at the owner
> checkpoint O2 won. The Gherkin carrier option (MD-27) is born-ready and the realization
> work is drafted in plan 28.

## Context

A challenge was raised against the landed verification shape: executable examples require a
native `.sdp.md` example Spec **plus** a plain anchored `.test.ts` verifier — does that betray
the "one spec format for everything" thesis, and was it the initial design?

The investigation (session of 2026-08-13, this branch's ancestry) established the record:

- **v0 design** (`docs/concept/04-authoring-surfaces.md` and siblings, deleted in the 2026-06-06
  reboot `ed5f6ad`): four authoring surfaces; Annotated Gherkin **equal-canonicity** with the TS
  DSL for `kind: behavior`; execution via Cucumber step definitions in `features/steps/`.
- **The reboot** demoted Gherkin to ASPIRATIONAL ("a second authoring pipeline").
- **Plan 13** (2026-07-11) landed the carrier-neutral executable machinery: generated step/space
  contracts, `/runner` core + `/vitest` adapter, `specOracle`, concreteness law.
- **MD-18 / MD-25** ruled the carrier competition: Markdown won all eight kinds; Gherkin is the
  formally **declined contender** (`docs/concept/04-authoring-and-binding.md` §4).
- **Constants across every version:** execution always lived in a separate code artifact (step
  definitions then, anchored tests now); the spec file was never self-executing.

What has **not** happened: a strong, evidence-led review of whether the decline was right, with
the v0 design actually on the table and gen-1's production record digested. The v0 documents are
currently readable only through `git show` — not reviewable. Gen-1 (`/Users/darkomijic/dev-libar/architect`)
holds both the formal spec and its own critical review (`formal-spec/REVIEW-2026-05-17-FINDINGS.md`).

Owner decisions at planning: this is a review-and-decide plan, not a build plan. Gen-1 material
is **evidence, never template** (the standing lineage rule) — the review lays out options; it
does not presume the answer. Any outcome that changes the design reopens MD-18 deliberately,
with a decision Spec, never by drift.

## Approach

Ordered; each phase produces reviewable artifacts. Nothing ships until the decision in Phase C.

### Phase 0 — restore the v0 design for review

0.1. Restore the nine v0 documents verbatim from `ed5f6ad^` into **`docs/lineage/v0-design/`**:
     `00-vision-and-product` · `01-core-primitives` · `02-system-architecture` ·
     `03-graph-metamodel` · `04-authoring-surfaces` · `05-runtime-anchors` ·
     `06-extraction-and-validation` · `07-spec-studio-and-projections` ·
     `08-delivery-evidence-and-tooling`. Verbatim bodies; prepend a short lineage header to each
     (superseded 2026-06-06 by the reboot; restored for the plan-27 review; evidence, never
     current truth — the drift rule applies to any disagreement with `specs/` and `src/`).
0.2. Also restore `docs/concept/ubiquitous-language.md` (deleted in `570996c`) and
     `docs/concept/GLOSSARY.md` (deleted in `1e5b506`) **only if** the review needs the
     pre-ratification vocabulary; otherwise record the skip.
0.3. Gate compliance, decided explicitly: restored history must not trip `check:temporal`,
     `format:check`, or preflight. Choose one: (a) a named genre/exclusion for
     `docs/lineage/` in `check-temporal.mjs` and `.prettierignore`, or (b) reformat and carry
     the lineage header as the temporal marker. Record the choice; never smuggle past a gate.
0.4. `docs/lineage/README.md`: one paragraph — what this folder is, why it exists, the rule
     that it is lineage evidence and never intended truth. Add the row to the `AGENTS.md`
     "Where to look" table in the same commit.
0.5. `npm run check` green. Blessed commit: `docs(lineage): restore the v0 concept set for review`.

### Phase 1 — evidence digest

1.1. **v0 design digest** — from the restored folder: the four-surface model, the Gherkin tag
     vocabulary and lint story, round-tripping (`export-ts` / `export-gherkin`), the harness
     modules, and `04-authoring-surfaces` §7 "what stays in code".
1.2. **Gen-1 production digest** — from the sibling `architect` checkout (evidence only; do not
     edit): `formal-spec/` (esp. `02` artifact types, `03`/`04` tag system and registry, `05`
     feature format, `08` spec evolution, `09` delivery lifecycle), `CLAUDE.md`,
     `.agents/skills/architect-base` and `architect-sessions`, and their own
     `REVIEW-2026-05-17-FINDINGS.md`. Known headline findings to verify, not inherit:
     value-transfer linkage (the design spec is **deleted** at implementation; canonical name
     and status move to the test file); ~22–26 authored tags post-pruning with generated-region
     determinism gates; hand-authored `@architect-status` with ProcessGuard FSM gates (mostly
     advisory WARN); pervasive spec↔implementation drift in their own review.
1.3. **Current-design digest** — `04` §2/§4, `spec:decisions.carrier-ruling` (MD-18),
     `pack-markdown-carrier` (MD-25), `verification-posture-not-realization` (MD-23),
     `example-realization-posture` (MD-24), DECISIONS R3 (binding-only anchors), plan 13's
     commit record, and the landed machinery (`src/notation`, contracts codegen, `/runner`,
     `/vitest` adapter). Query the graph first per the standing discipline.

### Phase 2 — the strong review

Adjudicate, with citations, in a review document under `reviews/` (numbered next in sequence):

2.1. **The thesis question.** Does "one spec format" cover verifiers? Current answer: the one
     format covers authored intent; verifiers are code-side evidence bound by anchors (P9/P10,
     R3). Test that answer against v0's four-surface model and gen-1's fused `.feature`.
2.2. **What gen-1 did better.** Stakeholder-readable executable artifact; N:1
     test→pattern realization; advisory-gate ergonomics; anything the digest confirms.
2.3. **What gen-1 did worse.** Tag-registry sprawl and drift; hand-authored delivery status;
     spec deletion at implementation (intent destroyed at the moment of realization — the exact
     failure the Protocol's enrich-in-place primitive exists to prevent); unverifiable claims.
2.4. **Ergonomics audit.** The real cost of the current shape: three artifacts per executable
     example (Spec + contract + test). Where is boilerplate derivable? Where is the split
     load-bearing (claim taxonomy, honesty checks) versus incidental?
2.5. **Options table**, each costed against the founding principles (P1–P10) and the two
     permanent guardrails:
     - **O1 — status quo.** Confirm MD-18; the review closes as drift repair of expectations.
     - **O2 — Gherkin-like equal-canonicity surface** over the existing generated contracts
       (the accommodation `04` §4 already names; machinery is carrier-independent). Reopens
       MD-18 partially, for behavior/example kinds only.
     - **O3 — richer runner authoring sugar.** Keep one carrier; derive more of the test body
       from contracts; reduce the hand-written half toward the oracle-only ideal.
     - **O4 — harness path.** Interactive projection + anchored oracle as the executable
       surface (ASPIRATIONAL today).
     - **O5 — hybrid / other** the review surfaces.
2.6. Each option states: what it does to the claim taxonomy, what it costs the extractor and
     the honesty checks, what gen-1 evidence says, and what it does to the "spec is the prompt
     is the design" bet.

### Phase 3 — decision and close

3.1. Apply the ADR three-part test (hard to reverse · surprising without context · real
     trade-off). If a change wins: author the decision Spec born-ready, amend or supersede
     MD-18's Gherkin clause honestly (MD-15 re-pointing is the precedent — never rewrite
     history), and write the follow-on build plan. If O1 wins: the review document is the
     record; no DECISIONS entry (the base already forced it).
3.2. Stamp this plan EXECUTED with the outcome; `AGENTS.md` pointer stays on the highest
     primary-numbered plan.

## Verification

1. Phase 0: the ten restored files are byte-identical to `ed5f6ad^` below their lineage
   headers; `npm run check` green; the graph is untouched (corpus counts unchanged).
2. Phase 2: every load-bearing claim in the review carries a file:line citation into the
   restored folder, the gen-1 checkout, or this repo's Specs.
3. Phase 3: the outcome is either a born-ready decision Spec plus follow-on plan, or a review
   record explaining why the standing design held.

## Done record

### Restoration

- `docs/lineage/v0-design/` contains all ten v0 concept documents from `ed5f6ad^`, each with
  the six-line lineage header. Every body was compared byte-for-byte after the header.
- `docs/lineage/README.md` records why the live `CONTEXT.md` and the superseded intermediate
  `GLOSSARY.md` were not restored.
- `check-temporal.mjs` excludes the lineage genre explicitly; `.prettierignore` already
  excludes `docs/**`. The corpus stayed at 133 Specs before and after restoration.
- Restoration commit: `778ce2a` (`docs(lineage): restore the v0 concept set for review`).

### Review and decision

- `reviews/14-executable-verification-design-review.md` carries the v0, gen-1, and current
  digests; both thesis readings; the executable-example ergonomics audit; six fully costed
  options; and the ADR three-part test. Its 117 machine-detected file:line citation tokens
  resolved at execution, and the load-bearing source ranges were re-read.
- The review recommendation was O3: derive the runnable wrapper while preserving code-side
  semantics. The owner selected O2 at the required checkpoint: a Gherkin-like canonical
  carrier option for behavior and example Specs over the existing generated-contract path.
- The Gherkin carrier option (MD-27) is carried by
  `spec:decisions.gherkin-carrier-option`, stated and derived `ready`, in the self-hosting
  Pack with zero floor failures or findings. The carrier ruling remains historical; the
  concept clause and MD-18 registry gloss re-point to MD-27.
- `plans/28-gherkin-carrier-option.md` owns the bounded parser, parity, refusal,
  executable-contract tracer bullet, and guidance work. No Gherkin engine behavior is
  claimed landed by this review plan.

### Premise corrections

1. `570996c` renamed `docs/concept/ubiquitous-language.md` to root `CONTEXT.md`; it did not
   delete it. `GLOSSARY.md` was a post-reboot intermediate superseded by that vocabulary.
2. The v0 set is ten files because its `README.md` carries the original product framing.
3. The lawful gate treatment is a named `docs/lineage/` temporal-genre exclusion; scrubbing
   the verbatim bodies would violate byte identity.
4. R3 has no registry row. Its live carriers remain `docs/concept/04-authoring-and-binding.md`
   and `src/model/anchors.ts`; repairing that separate registry gap stayed out of scope.
5. Restored-file citations include the six-line lineage-header offset.

### Verification

- Phase 0: ten of ten bodies byte-identical; `npm run check` green with the restored files
  staged; the Spec count remained 133.
- Review: 117 citation tokens resolved to existing files and in-range lines;
  `npm run check:temporal && npm run format:check` passed with the lineage and review present.
- Decision: `sdp q` returned the new decision at stated/derived `ready`, in
  `pack:self-hosting-v1`, with its declared `refines` edge resolved and zero findings.
- Close: final `npm run check` evidence is recorded by the closeout commit carrying this
  done record.
