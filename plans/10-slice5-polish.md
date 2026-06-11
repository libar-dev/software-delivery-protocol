# Plan 10 — Slice 5: polish (the CLI surface resolved, one diagnostic rule, the documented example, the clean-repo determinism test)

> **Status: ✅ EXECUTED 2026-06-11** — all five work items landed on `feature/anchors`;
> `npm run check` green end-to-end (157 tests; the golden view tree re-pinned with the Where
> column — the expected three-page churn: index + the two pages carrying the standing warning;
> `check:example` = view `--check-clean`: 0 errors · the 1 standing warning · 11 pages). The MVP
> slice roadmap (`07` §1) is complete: the CLI surface is **resolved** (`build` · `validate` ·
> `view`; `explain`/`search` stayed below the second-caller bar — §1.1, settled in `00` §4 /
> `07` §1+§3 / `AGENTS.md`), diagnostics follow **one rendering rule** (location from the
> structured `file`/`line` fields, printed exactly once — the CLI prefix and the view's Where
> column; the three message-embedding sites dropped), **first contact fails clean** (a bad root
> is a one-liner + exit 1, never a stack trace; a zero-spec root builds honestly and says where
> it looked), the **clean-repo determinism test** pins location-independence (the full pipeline
> at a different absolute path, byte-identical over `graph.json` + every page), and the example
> carries its **documented walkthrough** (`examples/checkout-v1/README.md` — every command and
> break-it claim executed before being written down: referential-integrity + did-you-mean ·
> readiness-floor naming `no-blocking-open-questions` · the second verifies-linkage warning at
> exit 0 · authoring-shape + the TS2353 closed-section rejection).
>
> **Execution deviations: none material.** The help text needed no edit (nothing it states
> changed); the Where column rode the one shared findings renderer, so the index and
> per-spec/per-pack tables moved together.
>
> **Next session: the decision-spec fold** — DECISIONS durables → `kind:"decision"` specs under
> the reserved ids (the registry's "Future spec id" column), now that the slices are complete.
>
> **Spec anchors:** `07` §1 (the slice table — "Polish: CLI (`sdp build`, `sdp validate`, maybe
> `explain`/`search`), error messages, the documented example, and a 'regenerate from clean repo'
> determinism test") · `06` §3 (the agent surface; the freeze discipline — "Freeze a typed
> contract only when a **second machine consumer** appears") · `07` §6 ① (authoring ergonomics —
> "great error messages" next; `sdp new spec` / `sdp explain` later) · `03` §2 (determinism;
> `--check-clean` is a self-comparison, never a diff against a committed artifact) · `00` §4
> (the cut table's "Full CLI" row) · JTBD JS-C1 (`sdp build` / `--check-clean`), JS-D2 (a passing
> `sdp validate` is a credible statement), JS-B2 (rebuild after refactor, no manual repair).

## Context

Slices 1–4 grew the CLI incrementally: `build` · `validate` · `view`, each with `--check-clean`,
all-or-nothing artifacts, temp-then-rename writes, and the gate re-pointed at the built CLI. So
slice 5's "CLI" work is not building commands — it is **resolving the roadmap's "maybe"**
(`explain`/`search`), fixing the **first-contact failure modes** (a nonexistent root today dies
with a raw Node `ENOENT` stack trace), and applying the model's own information discipline to
**diagnostics** (location is currently stated twice: embedded in extractor messages *and* carried
in the structured `file`/`line` fields, while graph-validator findings carry the fields but the
CLI never prints them). The documented example walkthrough and the clean-repo determinism test
are the two genuinely new deliverables.

## §1 — Decisions this plan pins (Representation, not DECISIONS.md entries)

1. **The second-caller bar holds: no `explain`, no `search` — the MVP CLI is `build` · `validate`
   · `view`.** The agent scripts the typed graph through the reader (`06` §3 — in-process, the
   measured context-efficiency win); the human reads the Design Review (`sdp view`). A terminal
   verb over the same joins would be a third renderer of the same information: for the agent it
   is the raw-JSON-you-rejoin failure mode the agent surface explicitly rejects, for the human it
   duplicates the per-spec page. No JTBD acceptance criterion names either verb. The roadmap's
   "maybe" resolves to **not in the MVP**; the revisit trigger is measured pain (`07` §5), and
   `07` §6 ① already orders `sdp explain` as a *later* ergonomics lever. Base-forced by the
   freeze rule, additive to reverse — recorded here, not in DECISIONS.md (the three-part test
   admits nothing).

2. **One diagnostic rendering rule: location lives in the structured `file`/`line` fields;
   renderers print it.** Finding *messages* stop embedding `file:line` (today duplicated at the
   two extractor finding helpers and the duplicate-id site); the CLI formatter becomes the one
   text rendering — `file:line — [severity] id — message` when location is known (`file` alone
   when no line; bare `[severity] id — message` otherwise) — and the Design Review findings
   tables gain a Where column from the same fields (a location *recorded in the graph* — R2).
   Same information stated once: the discipline the model preaches, applied to its own
   diagnostics. Pre-1.0, no foreign parser of the old format exists.

3. **First contact fails clean.** A nonexistent or non-directory root is a one-line
   `sdp <command>: root "<path>" is not a directory.` on stderr, exit 1 — never a stack trace.
   An existing root with **zero spec files** still builds and exits 0 (an empty authored model is
   *conformant* — absence of specs is not a finding, so the graph and report stay pure), but the
   CLI says where it looked: a stderr note naming the resolved root and the `*.sdp.ts` discovery
   rule, so a typo'd `cwd` is never a silent success. CLI-level by design — it is feedback about
   the *invocation*, not a property of the authored model.

4. **The clean-repo determinism test pins location-independence — the property the existing
   checks cannot see.** `--check-clean` runs the pipeline twice over the *same* root;
   delete-`generated/`-and-rerun reuses the same root too. Neither can catch an absolute path
   leaking into artifact bytes. The new test copies the example's authored surfaces (`specs/` ·
   `src/` · `test/` — never `generated/`) to a temp root at a different absolute path, runs the
   full pipeline there, and byte-compares `graph.json` and every view page against the in-repo
   build. Deliberately a working-tree copy, **not** `git archive`: the test pins the projection
   property — bytes are a function of the root's *content*, never its location or leftover local
   state — and an uncommitted example edit must not fail a determinism test (commit-state fidelity
   is the golden oracle's job, `07` §6 ②).

5. **The documented example is a walkthrough README colocated with the example**
   (`examples/checkout-v1/README.md`): what the example models, the three authored surfaces
   (the spec files · the anchored implementation · the test anchor), the `build → validate →
   view` walk with what to look at — including the **standing unenabled-verifier warning read as
   the teaching surface it is** — and a break-it-on-purpose section demonstrating the trust model
   (each experiment names the check that fires, verified by actually running it before it is
   written down). It speaks the ratified language, points into `docs/concept/` instead of
   restating the model, and passes `check:temporal` and `format:check` like any other doc.

## §2 — Work items

### 1. CLI diagnostics (M)

- `src/cli/sdp.ts`: the root existence/directory guard (§1.3); `formatFinding` renders
  `file[:line] — ` from the fields (§1.2); the zero-spec-files note (§1.3); help text untouched
  except where it states behavior this item changes.
- `src/extract/reify.ts` · `src/extract/anchors.ts` · `src/extract/index.ts`: the three
  message-embedded `file:line` sites drop the embedding (fields already carried).
- `test/cli.test.ts`: nonexistent-root one-liner + exit 1; zero-spec-files note; the
  `file:line —` prefix asserted on a hard-error corpus run. `test/extract.test.ts` /
  `test/fixtures.test.ts`: message assertions follow the de-duplicated messages.

### 2. The Design Review findings location column (S)

- `src/projections/design-review.ts`: the findings tables (index + per-page) gain Where
  (`file:line` / `file` / `—`). Golden tree re-pinned; a semantic pin in
  `test/design-review.test.ts` asserts the column renders from the fields.

### 3. The clean-repo determinism test (S)

- `test/cli.test.ts`: the §1.4 copy-to-temp-root test over the full pipeline
  (`view --check-clean`), byte-comparing `graph.json` + every page against the in-repo build.

### 4. The documented example walkthrough (M)

- `examples/checkout-v1/README.md` per §1.5 — every command and every break-it claim executed
  before being written down.
- `AGENTS.md` (the symlink target): the build-path section gains the walkthrough pointer.

### 5. Docs reconciliation (S — settled rules, no temporal noise)

- `00` §4 cut table, "Full CLI" row: settles to "MVP CLI is `sdp build` · `sdp validate` ·
  `sdp view`" with `explain`/`search` recorded as below the second-caller bar (revisit on
  measured pain).
- `07` §1 slice-table row 5 and §3 cut #9: same settling; "maybe" leaves the docs.
- `AGENTS.md` slice-table row 5: follows `07`.
- Glossary: untouched — no new terms (walkthrough/diagnostics introduce no vocabulary).
- No new DECISIONS.md entries (§1.1 rationale).

## §3 — Verification (the done gate)

1. `npm run check` green end-to-end (including the re-pinned golden view tree and
   `check:example`).
2. `sdp build /no/such/root` prints the one-line root error, exits 1, no stack trace; a
   zero-spec root builds, exits 0, and prints the where-it-looked note.
3. A hard-error corpus run shows `file:line — [error] extract/…` once per finding — location
   stated exactly once.
4. The clean-repo test passes: the example pipeline at a different absolute path is
   byte-identical for `graph.json` and every view page.
5. Every command and break-it experiment in `examples/checkout-v1/README.md` was executed and
   produced the documented outcome; the README passes `check:temporal` + `format:check`.
6. `00` / `07` / `AGENTS.md` state the resolved CLI surface; no doc says "maybe" about
   `explain`/`search` anymore.
7. Done-record header written at session end (Status: executed; Next: the decision-spec fold —
   DECISIONS durables → `kind:"decision"` specs — now that the slices are complete).

## §4 — Explicit non-goals (deferred by decision, not omission)

- **`sdp explain` / `sdp search`** — resolved out (§1.1); revisit rides measured pain (`07` §5).
- **`sdp validate --watch` · `sdp new spec`** — the named *later* authoring-ergonomics levers
  (`07` §6 ①), not slice scope.
- **Severity configuration / the `--lenient` ratchet** — aspirational (`07` §2); severities stay
  the validators' own.
- **`sdp --version`, publishing, npm packaging polish** — arrives with the package, not the MVP
  loop.
- **The decision-spec fold** — the next session, after the slices (as every plan since the
  registry has recorded).

## §5 — Risks

- **Golden view churn from the Where column.** Accepted — the oracle exists to make exactly this
  reviewable as a diff; the semantic pins keep meaning-level regressions caught independently.
- **The walkthrough drifts as the example grows.** Bounded: the README documents the example it
  sits beside, so the same PR that changes the example reviews the README; counts appear only in
  illustrative command output, clearly tied to the commands that print them.
- **Message-format changes break an unseen consumer.** Pre-1.0, the CLI's text output has no
  contract (the graph and the typed reader are the machine surfaces); the format change is the
  point (§1.2).
