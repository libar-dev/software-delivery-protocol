# 07 - Self-hosting phase-2 adversarial code review

**Reviewed:** the full `main..HEAD` phase-2 diff through `8f5aabe`, plus this review's verified
remediation. The reviewed phase spans the TS-to-Markdown import surface, the atomic checkout
migration, the canonical-default flip, the decision fold, and the four corpus waves.

**Method:** independent adversarial passes re-read the full branch history and changed surfaces,
then reproduced import loss, batch-publication, docs-agreement, fold, corpus, and package-contract
risks against the built product. Findings below are based on probes, not on prior task receipts.

---

## Verdict

**APPROVE WITH RECORDED FOLLOW-UPS.** The phase's historical checkout migration is atomic, the
canonical-default carrier rule agrees across its operative records, the fold is now a lean pointer
registry, and the corpus floor remains honest. Two correctness blockers in the durable import
surface and three related changes requests were fixed and re-probed. No BLOCKER remains open.

The phase-close owner gates are deliberately not advanced here: this todo does not change their
ledger. Final clean-clone and installed-package final-SHA proof remain owned by todo 42; whole-phase
acceptance remains owned by todo 43.

### What held

- The checkout migration commit replaces all eleven checkout Spec carriers in one commit: each
  `.sdp.md` addition pairs with the matching `.sdp.ts` deletion. No historical dual-carrier
  checkout commit was found after the migration.
- The post-flip carrier rule is consistent in `AGENTS.md`, `CONTEXT.md`, the decision registry,
  package README, concept docs, and the checkout walkthrough. The three carrier audit scripts pass.
- Decision Specs use the `spec:decisions.*` namespace and the current-law decision slots; the lean
  registry points to each durable decision. The two empty former-diary headings were removed.
- The corpus reports 58 Specs, one Pack, 36 anchors, 95 nodes, and 180 edges with no self-hosting
  validation errors or warnings. Its readiness distribution remains 7 `ready` and 51 `defined`.
- The installed package exposes the intended import/barrel symbols and the packed dry-run path.

---

## Blocker findings (2) - remediated

### B1 - Successful import silently dropped valid TS-authored content

**Where:** `src/import/emit-markdown.ts` previously selected only the first constraint, example,
and `when` step. It also omitted string-form open questions and unsupported open-bag properties.

**Probe:** valid TS carriers with two constraints, a string open question, two `when` steps, or a
structural title each reified without findings; their emitted Markdown lost data or changed structure.

**Remediation:** `emitMarkdownSpec` now reifies its own document and requires exact authored-data
equality (normalizing only the canonical relation order and physical empty-relations spelling).
`importTypeScriptSpec` converts an unfaithful emission into `import/unsupported-construct` with no
emitted target. The public emitter throws its typed `MarkdownEmissionError` rather than returning a
silently changed document.

**Re-probe:** the focused 38-test import/CLI/package suite passed. The log is quoted in
`.omo/evidence/self-hosting-phase-2/task-41-self-hosting-phase-2.review.md`.

### B2 - A failed multi-source import could publish a partial migration

**Where:** `src/cli/sdp.ts` previously wrote each output while walking sources.

**Probe:** a directory containing a Pack carrier and an importable Spec exited nonzero but still
created the Spec's Markdown sibling.

**Remediation:** CLI import now collects and validates all sources and targets before publication,
writes temporary files first, then publishes them together; a write/publish failure removes all
temporary and newly published targets. The Pack-plus-Spec regression now proves no sibling exists.

**Re-probe:** `test/cli-import.test.ts` passed with the failed batch leaving its valid target absent.

---

## Changes requested (3) - remediated

### C1 - A requested path with no TS carrier falsely exited zero

**Remediation:** `sdp import` emits `import/no-sources` and exits one when discovery produces no
`.sdp.ts` source. The focused CLI re-probe passed.

### C2 - The public import API could return its source path as a target

**Remediation:** `importTypeScriptSpec` requires a `.sdp.ts` source path and returns
`import/invalid-source-path` otherwise. The API re-probe passed.

### C3 - Flip guidance still described checkout Markdown as typed/typechecked and MD-15 as TS-only

**Remediation:** `CONTEXT.md`, `AGENTS.md`, the checkout walkthrough, and the carrier-truth rule
now distinguish Markdown-default authoring from the lawful TS carrier. All carrier audit scripts
passed after the repair.

---

## Medium / low findings - owner-visible dispositions

- **M1 - Packed import only exercises dry-run.** Deferred to todo 42's final installed-package
  proof, which owns a final-SHA package run. The current package smoke still proves the tarball,
  bin wiring, root exports, and dry-run non-write behavior; this review did not represent that as
  a write-mode proof.
- **M2 - `npm run check` does not embed carrier-rule/truth scripts.** No code change here: the
  phase deliberately owns those scripts as explicit flip/fold audits, and this review reran all
  three. Todo 43 owns any final gate composition ruling.
- **M3 - Earlier clean-clone evidence predates the final corpus.** Deferred to todo 42 by design;
  it must produce a fresh-clone receipt at the final audited SHA. This review does not reuse it.
- **M4 - G4/G5/G6 remain pending in the process ledger.** No change: the user explicitly forbade
  ledger mutation in this todo. G7 remains accepted; todo 43 alone may record whole-phase owner
  acceptance.
- **M5 - Six validation Specs name implementation entrypoints without individual anchors.** No
  change: they are `defined`, do not author a delivery fact, and the phase's no-decorative-anchor
  policy rejects inventing bindings just to make every prose locator derive `implemented`.

---

## Verification addendum - remediation confirmed

The re-probes ran after the remediation, not from worker reports:

- `npm test -- test/import.test.ts test/cli-import.test.ts test/import-emit-markdown.test.ts test/import-round-trip.test.ts test/package-smoke.test.ts` passed: 5 files, 38 tests.
- `node ./check-carrier-rule.mjs`, `node ./check-carrier-truth.mjs`, and
  `node ./check-self-hosting-gates.mjs` all passed.
- `npm run check` passed after the final review artifacts and repairs; its self-hosting report was
  58 Specs / 1 Pack / 36 anchors -> 95 nodes / 180 edges with zero errors and warnings.

The detailed commands and captured output excerpts are in
`.omo/evidence/self-hosting-phase-2/task-41-self-hosting-phase-2.review.md`.
