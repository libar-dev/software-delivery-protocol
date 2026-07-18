## Todo 13 — checkout-v1 migration

- The live migration exposed an emitter authoring-surface defect: populated Intent lists ran
  directly into owned `### Open questions` headings and `gwt` fences. The emitter now separates
  those blocks with blank lines; the focused suite pins both structures, and all eleven Specs were
  re-imported rather than hand-edited.
- No checkout shape fired a grammar watch item or required an under-fire ruling.
- The first post-commit full suite exposed migration-owned `.sdp.ts` path pins in the checkout graph
  golden, Design Review goldens, and reader assertions. They were updated to `.sdp.md`; the Pack
  path remains `.pack.sdp.ts`. These fixtures are outside the initial edit boundary because the
  carrier suffix is observable graph/reader data and the required `npm run check` exercises them.
- `npm run check` also encounters an unrelated pre-existing Prettier warning in
  `check-self-hosting-gates.mjs`; the migration commit does not touch that file. The task-specific
  files pass Prettier, and this blocker is retained rather than contaminating the atomic migration
  with an unrelated formatter-only change.

## Todo 15 — Design Review ordering and escaping ruling

- The owner ruled Option 1: model/open-bag dynamic keys sort lexicographically at render time, and
  one escaping policy covers every rendered field rather than only narrative/description prose.
- The permutation RED isolated both insertion-order leaks (model terms and open-bag JSON); the
  escaping RED showed raw title, rule, term, criterion, and open-bag values before the shared
  boundary was applied.
- Uniform special-character escaping also affects typed example-space union separators: existing
  `|` characters now render as `\|`. The reviewed checkout golden records that escaping-only delta;
  authored information is unchanged.

## Todo 14 — checkout README Markdown walkthrough

- An unrecognized Markdown heading is refused as `extract/unrecognized-heading`, not
  `extract/invalid-markdown-structure`. The finding offers a close heading suggestion when the
  edit distance permits it, so `## Rul` is a precise README example.
- The refreshed checkout walk produced 17 graph nodes, 32 edges, three contract modules, and one
  deliberate `conformance/verifies-linkage` warning for the unbound invalid-cart example.
- The task's README and evidence files pass Prettier. The full `npm run check` is currently blocked
  at `format:check` by concurrent, out-of-scope edits in `src/projections/design-review.ts`,
  `src/projections/owned-prose.ts`, and `test/design-review.test.ts`.

## Todo 16: watch-item dispositions and rulings log

- All five checkout watch items are unfired. The migration used only ruled grammar forms, and no
  Pack caller required Markdown authoring.
- The Design Review Option 1 ruling remains the only session-2 ruling under fire. It is a reversible
  projection representation fix, so it does not enter the durable decision-spec registry.

## Todo 17 — session-2 G2 close

- The owner accepted the two-layer fidelity verdict at `df444f2`: the pre-declared catalog records
  semantic graph equality separately from the reviewed Markdown authoring-surface exhibit.

## Todo 18 — grammar-hardening cluster

- YAML failsafe parsing deliberately keeps scalar values as strings, so string-scalar honesty must
  classify plain-token spellings against the YAML 1.2 core forms while preserving quoted strings.
- YAML-native diagnostics needed a seeded `LineCounter` so embedded line text and structured
  carrier-relative finding lines agree; non-mapping roots now retain those accumulated diagnostics.
- The stricter envelope/body behavior restores frozen 17b law: exact `...` refuses, example `gwt`
  is terminal in Intent, Open questions H3 text trims ASCII whitespace, and terminal `#` is literal.
- Resource-limit diagnostics now emit one summary per breached limit per document while traversal
  continues; duplicate `When` emits once, and the unreachable `mapOwner` fallback was removed.
- The public Markdown reifier now mirrors the TS carrier's total catch-all boundary, converting an
  injected unexpected body-parser throw into one `extract/invalid-frontmatter` finding.

## Todo 19 — refusal-parity matrix

- `test/cli.test.ts` needed `--exclude test/fixtures/import/parity` on both repo-root view calls because malformed probe carriers otherwise entered self-hosting extraction. No unresolved issues remain.
- The post-write size audit found `markdown.ts` already above the module ceiling. Frontmatter
  parsing moved to `markdown-frontmatter.ts`; a thin public wrapper stays beside the envelope
  anchor so self-hosting binding proximity and the public export remain unchanged.

## Todo 20 — parser hardening claim

- The Markdown body grammar accepts only `rule` or `flow` Behavior entries, so the claim and each bounded non-claim are recorded as rules. No unresolved issues remain.

## Todo 20 verification — temporal guard blocker

- The tracked `.omo/plans/self-hosting-phase-2.md` done-record contains numbered `plans/` references and is temporal-by-genre. `check-temporal.mjs` now exempts `.omo/plans/` narrowly, restoring the temporal guard and self-hosting gate without broadening the `.omo/` exclusion.

## Todo 21 — G3 close blocked

- Todo 21 is marked `- [~]` in the plan. G3 (hardening baseline) requires owner disposition.
- Evidence pack is ready at `.omo/evidence/self-hosting-phase-2/task-21-self-hosting-phase-2.g3.md`.
- Proposed acceptance SHA: `0bb200a` (includes the temporal fix needed for the green gate).
- Cannot proceed to todo 22 (the flip) until the owner accepts or rejects G3.

## Todo 24 — G4 rejection and re-presentation

- The owner rejected the pre-written G4 acceptance because `04` §1 still made the per-ID canonical-surface config a live claim and the stamp preceded owner disposition.
- The amended flip is `0a06882`; it makes the config designed-for and deferred (**ASPIRATIONAL**) and names file-existence-only as the current realization. G4 remains pending until owner acceptance.

## Todo 41 - adversarial review follow-ups

- The final clean-clone and write-mode installed-package proof remain pending evidence work; they
  are explicitly owned by the next final-proof todo and must run at the final audited SHA.
- Gate-ledger disposition remains owner-controlled. This review records the scaffold result but
  does not alter pending owner rows.
