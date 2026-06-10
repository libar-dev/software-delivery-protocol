# Plan 05 — De-temporalization + the DECISIONS.md ratified-name registry

> **Status: ✅ EXECUTED 2026-06-10** — all six work items landed as one commit per item on
> `feature/mvp-init`; `npm run check` green end-to-end including the new `check:temporal` guard.
> Two small execution deviations, both deliberate: `04` §1's MD-15 citation was left as-is (compliant —
> the sentence already states the `.sdp.ts` extension and the `.stories.tsx` pattern, so prefixing the
> registry name would restate the sentence's own subject), and the readiness test's assertion was
> simplified to the `in`-check (ESLint `no-unnecessary-condition`: the `evaluatedOver: "graph"` literal
> type already guarantees the value — the type system carries what the runtime comparison restated).
>
> **Post-execution adversarial pass (Codex)** — two valid findings, both fixed: (1) CI never ran the
> guard (the workflow fans out into discrete steps and skips `npm run check`) → a dedicated
> "Temporal guard" CI step now runs first; (2) the `!`-negated shell form was fail-open (a git-grep
> usage error also inverted to a pass) → replaced by the `check-temporal.mjs` Node wrapper, which
> passes **only** on git-grep exit 1 and fails closed on everything else. All three paths verified:
> clean tree passes, a seeded banned token fails listing the match, and a forced git-grep error
> fails closed. A second pass then caught the guard's own blind spot: the sweep listed subtrees
> instead of subtracting exemptions, so root/tooling files — including the guard itself, whose
> header cited a numbered plan — escaped scanning. The sweep now covers **all tracked files minus
> the genre exemptions**; re-verified on all three paths, including a seeded token in the
> previously-unscanned `ci.yml`. A third pass narrowed the guard's self-exemption from file-level
> to **line-level use–mention** (only the line that *is* the pattern literal is allowed; any other
> line in the guard is swept like any file's) and un-capped the numbered-plan pattern
> (`plans/[0-9]+` — the zero-padded form would have stopped guarding at plan 10). Verified: a
> banned token seeded into the guard's own comments fails the check.
>
> **Next session: Slice 1 — the `ts-morph` extractor** (deterministic rebuild P3 + graceful partial
> extraction L3; reads `*.sdp.ts` from day one — the `.sdp.ts` extension, MD-15); the hardened example
> becomes its first real input.

## Context

Two external reports found the same disease with two symptoms: **temporal information leaking into
timeless artifacts** (calendar-named identifiers like `deferredInSession1`, history-narration comments,
AGENTS.md restating build status three times) and **unreadable bare `MD-n` decision references**. Both
were validated against the repo — every file:line claim confirmed (with current line numbers; a few
extra instances found that the reports missed). The unifying principle is the repo's own ratified law
applied to itself: **git is the event log** — durable artifacts carry current truth; `plans/`,
`reviews/`, DECISIONS.md, and git carry history. Names bind to capabilities, not calendars, so they
expire themselves.

**Validation verdicts worth recording:**

- Report 1: all code/doc claims CONFIRMED. Refinement: the proposed rename `requiresGraph: true` is
  imprecise — the clauses don't need a graph *object*, their truth is *graph-shaped* (relation
  resolution, transitive target readiness, anchor resolution). Use `evaluatedOver: "graph"` instead.
- Report 2: the ADR three-part-test classification holds, with one gap — **MD-16 was never
  classified**. It is durable (same family as MD-7: adversarial honesty sharpenings with real rejected
  alternatives).
- The §-map move is *better* justified than Report 1 argued: DECISIONS.md entries cite bare `§4b`,
  `§6`, `§0 guardrail 1` (MD-7, R1) — its only live readers are inside DECISIONS.md itself (plus 2
  archived refs in `reviews/`).
- "Organic naming" is only partial: "the typing law (MD-11)" is real, but ~22 bare references remain
  in `docs/concept` + AGENTS.md.

**Ratified choices (asked & answered):** the temporal guard IS wired into `npm run check`; R1–R3 are
annotated `[RETIRE-AT-FOLD]`, not deleted (04 §2 cites them live); the glossary's "ratified
2026-06-07" date is dropped (zero guard exemptions).

## Standing rules (apply throughout; encode in the guard)

- **Rule 1 — name by capability, not calendar.** `deferredInSession1` → `evaluatedOver: "graph"`;
  "Session-1 evaluator" → "pre-graph evaluator".
- **Rule 2 — state the invariant, not the event.** Comments say what holds and why (cite the
  decision); the event lives in git/plans/reviews.
- **Rule 3 — status lives in exactly one place:** `plans/` (the highest-numbered plan's status
  header). AGENTS.md points, never restates.
- **Rule 4 — migration scaffolding lives with the artifact that needs it:** the `base §n` map moves
  into DECISIONS.md's header.
- **Allowed forward-pointers:** `Slice N` / `Phase 0` (roadmap-relative capability names, defined in
  `07` + the AGENTS.md slice table) and meaning-led `MD-n` citations. **Banned** in the swept set:
  `Session N`, `Wave X`, `Fold-X`, ISO dates, numbered plan-file refs (`plans/0N`). `plans/` as a
  directory pointer is fine.
- **Exempt by genre (never scrubbed):** `docs/concept/DECISIONS.md` (dated diary), `plans/`,
  `reviews/`, git history, the measured-evidence table.

---

## 1. Code de-temporalization (M)

### 1a. The rename — `src/validate/readiness-floor.ts`

Only graph-shaped clauses carry a marker; active clauses get **no** `evaluatedOver: "authored"` field
(under one-validation-path MD-14 *every* clause eventually evaluates over the graph, so labeling the
structural clauses "authored" would itself rot at Slice 1/3).

- Lines 24–29: `DeferredReadinessClause` → `GraphReadinessClause`; field
  `readonly deferredInSession1: true` → `readonly evaluatedOver: "graph"`. Doc comment →
  *"Graph-shaped clauses — they resolve across the one graph (one validation path, MD-14; executes
  Slice 1/3) and carry no pre-graph predicate, so the pre-graph evaluator skips them."*
- Line 31: union member renames with it (`ActiveReadinessClause | GraphReadinessClause`).
- Lines 344/349/354: `deferredInSession1: true,` → `evaluatedOver: "graph",` (three clause literals).
- Line 381: guard `if ("deferredInSession1" in clause)` → `if ("evaluatedOver" in clause)` (same
  `in`-narrowing pattern).
- Lines 369–370 evaluator comment: "deferred (graph-shaped) clauses are skipped until the extractor
  lands" → "graph-shaped clauses carry no pre-graph predicate and are skipped until the extractor
  lands (Slice 1/3)".
- `ReadinessClauseId` (derived via `typeof`, MD-13) is unaffected — clause ids don't change. The type
  is exported via `export *` from `src/index.ts` but referenced nowhere else in src/ — blast radius is
  this file + two tests. Renaming is free at v0.0.0 with zero adopters; doing it before Slice 1 is
  the point.

### 1b. Tests tracking the rename

- `test/readiness.test.ts:55–59` — name → *"marks the ready clauses graph-shaped — evaluated over the
  one graph, never the pre-graph harness (one validation path, MD-14)"*; assertion →
  `clauses.every((clause) => "evaluatedOver" in clause && clause.evaluatedOver === "graph")`.
- `test/validators.test.ts:199` — name → *"skips graph-shaped ready clauses pre-graph (target
  readiness and anchor resolution wait for the extractor)"*. Body unchanged. (No snapshot/name-keyed
  tooling — renames are safe; the old `in`-assertions fail loudly until updated, so the rename can't
  land half-done.)

### 1c. Comment sweep (Rule 2 rewrites)

- `src/validate/authored-model.ts:5–7` → *"Pre-graph authored-layer DTO — the stand-in harness until
  the extractor lands (one validation path, MD-14): not persisted, not a graph, and never a second
  public validation seam (not the Slice 3 gate)."*
- `src/validate/validators.ts:221–225` → *"Pre-graph authored-layer validation only. This composes
  the pre-graph authored-model checks and is not the Slice 3 graph validator gate (MD-14). …"* (rest
  unchanged).
- `test/readiness.typecheck.ts:69` → *"the pre-graph authored model is an in-memory DTO — it carries
  no source-file bookkeeping."*
- `test/fixtures/authored-model.fixtures.ts:5` → *"fixtures for the pre-graph authored-layer
  validators"*; line 13: drop the `(plans/02 §3 H8)` ref — the fixture list is the durable content.
- `test/fixtures.test.ts:27–31` — **delete the comment block.** Its durable content (the bypass
  pinned twice: compile-time MD-11 twin + runtime MD-16 twin) already lives in
  `authored-model.fixtures.ts`'s module doc-comment; the rest is Wave-B activation narration.
- **Unchanged by decision:** `src/cli/sdp.ts:10,44` ("Not implemented yet (Slice 1: extractor)" —
  allowed forward-pointer, pinned by `test/cli.test.ts`); `test/builders.typecheck.ts:101–108`
  (meaning-led MD refs + Slice-1 pointer); the remaining ~42 src/test MD refs (already meaning-led —
  a mechanical sweep is churn without payoff).

**Proof:** `npm run typecheck && npm test` green;
`grep -rn "Session\|deferredInSession\|Wave\|plans/0" src test examples` → nothing.

## 2. Docs de-temporalization (M)

### 2a. Four concept-doc rewrites (cite the decision, drop the event)

- `02-core-model.md:152`: "(ratified with the 2026-06-10 grill, DECISIONS MD-10)" →
  "(content-only sections — DECISIONS MD-10)".
- `04-authoring-and-binding.md:84`: "— ratified MD-8, lands with Slice-2 anchor extraction;
  `anchorImplementation` is the Session-1 name." → "— the generic `codeAnchor` decision (MD-8),
  landing with Slice-2 anchor extraction; until then the DSL ships the narrower
  `anchorImplementation`."
- `05-validation-and-honesty.md:44`: "The Session-1 pre-graph `AuthoredModel` is a stand-in…" →
  "The pre-graph `AuthoredModel` is a stand-in that retires into (at most) an extractor-internal
  shape when the extractor lands (Slice 1)…".
- `07-mvp-roadmap-and-open-questions.md:91`: heading "(seeded by the post-Session-1 full-MVP
  review)" → "(seeded by the Phase-0 full-MVP review)" — matches the section body's existing
  "Phase-0 hardening" usage.

### 2b. AGENTS.md — status lives in one place

- **Status blockquote (lines 12–16)** becomes, in full: *"**Status:** concept ratified and locked.
  Build state and 'what now' live in **`plans/`** — read the highest-numbered plan's status header;
  the slice roadmap is **`docs/concept/07`**."*
- **"Where we are now" paragraph (lines 75–79): delete entirely.** The latest plan's status header
  carries "next session" (existing convention); keep the tracer-bullet blockquote that follows.
- **"Where to look" glossary row (line 47):** drop the Fold-A/date parenthetical and the §-map
  mention → "…sole source of truth for terminology; the model exposition lives in `00`–`07`".
- **DECISIONS row (line 50):** "the MD-series MD-1…MD-16" (rots at MD-17) → "the ratified-name
  registry + the MD-series, the R-series, the legacy D1–D6 shorthand, measured evidence".

### 2c. Glossary header — shrink, relocate the §-map

`docs/concept/ubiquitous-language.md:1–14`:

- Status line: drop "Built section-by-section in the language grill; ratified 2026-06-07."
  (`Status: RATIFIED` stays; provenance lives in git + DECISIONS.md's dated headings).
- The "Restructured 2026-06-10 (Fold-A)" paragraph + §-map → one timeless sentence: *"This document
  carries terms only; the model exposition lives in the design docs (`00`–`07`), rationale in
  `DECISIONS.md`."*
- The §-map relocates **verbatim** into the DECISIONS.md header (item 3a) — where its live readers
  are (MD-7's §4b/§6/§7/§8, R1's §2/§4; it still decodes the 2 archived refs in `reviews/`).

## 3. DECISIONS.md — registry + reference convention (M)

### 3a. The ratified-name registry (new table under the header blockquote)

Header blockquote absorbs the §-map (from 2c). Registry columns: **ID · Ratified name · Curation ·
Future spec id**:

| ID | Ratified name | Curation | Future spec id |
|---|---|---|---|
| MD-1 | the executable meta-model | durable | `spec:protocol.decisions.executable-meta-model` |
| MD-2 | adopt the nouns, reject the gates | durable | `spec:protocol.decisions.adopt-the-nouns` |
| MD-4 | one primitive, named coordinates | durable | `spec:protocol.decisions.one-primitive` |
| MD-5 | the protocol naming | durable | `spec:protocol.decisions.protocol-naming` |
| MD-7 | binding, never liveness | durable | `spec:protocol.decisions.binding-not-liveness` |
| MD-8 | the generic `codeAnchor` | folds at Slice 2 → doc-comment on the builder | — |
| MD-9 | the open-questions home | folds at fold time (lives in `sections.ts`, the floor, `02` §3) | — |
| MD-10 | content-only sections | durable | `spec:protocol.decisions.content-only-sections` |
| MD-11 | the typing law | durable | `spec:protocol.decisions.typing-law` |
| MD-12 | the kind-conditional floor | durable | `spec:protocol.decisions.kind-conditional-floor` |
| MD-13 | floor-table-as-truth | folds (lives in `05` §3 Representation note + `readiness-floor.ts` header) | — |
| MD-14 | one validation path | durable | `spec:protocol.decisions.one-validation-path` |
| MD-15 | the `.sdp.ts` extension | durable | `spec:protocol.decisions.sdp-ts-extension` |
| MD-16 | carried evidence | durable (classification added here — Report 2's gap) | `spec:protocol.decisions.carried-evidence` |

Below the table, the convention line: *"In prose, lead with meaning — write 'the typing law
(MD-11),' never bare 'MD-n.' (Generalizes MD-8's own footnote.)"*

### 3b. The bare-reference sweep (~22 sites, docs/concept + AGENTS.md)

Compliance rule: a citation whose sentence already states the decision's content is compliant (many
are — the registry names were lifted from the docs' own phrasing). Mandatory rewrites, the genuinely
bare ones:

- `02:130` "(MD-9)" → "(the open-questions home, MD-9)"; `02:139` "(MD-11)" → "(rejected by the
  typing law, MD-11)".
- `05:80` → "(`intent.openQuestions` — the open-questions home, MD-9)".
- `04:11` → "(the `.sdp.ts`-extension decision, MD-15 — the `.stories.tsx` pattern)".
- glossary `:206` "(resolved — MD-5)" → "(the protocol naming, MD-5)"; check `:65/:182/:199/:203`
  against the rule (most carry meaning inline already).
- `07:101/:114/:115/:119` — align to "name (MD-n)" form (`:115` already complies).
- AGENTS.md bare refs disappear with the 2b deletions/rewrites.
- **No src/test sweep** (already meaning-led).

## 4. Curation annotations + the admission bar + "pre-graph" (S)

- **Annotate, don't delete.** R-series intro gets `[RETIRE-AT-FOLD — substance absorbed into
  glossary/01/03/04; cited live from 04 §2]`. The D1–D6 table intro gets `[KEEP for traceability; at
  fold time D3, D5, D6 become decision specs]`. No entry text is deleted this session.
- **AGENTS.md working discipline** gains one bullet (after "Terminology is ratified…"):
  *"**DECISIONS.md admits sparingly, and reads by name.** An entry must pass the ADR three-part test —
  hard to reverse · surprising without context · a real trade-off. Authoring guidance only, never a
  validator (checks police conformance and honesty, never content-quality). In prose, lead with
  meaning: 'the typing law (MD-11),' never bare MD-n."*
- **Ratify "pre-graph"** in the glossary's **"Locked usage"** ledger line: *"pre-graph = upstream of
  graph derivation in the one validation path (the authored layer before the extractor runs) — fences
  stand-in checks, never a second validation path (one validation path, MD-14)"*. Glossary, not
  AGENTS.md: it names a *pipeline position* (like `extractor`/`validator`), not a build era — and a
  second terminology ledger would violate the repo's own discipline.

## 5. The guard — `check:temporal` in `npm run check` (S)

As built (revised by the post-execution adversarial pass): the guard is the root-level
`check-temporal.mjs` Node wrapper (the `vitest-test.mjs` idiom), invoked as
`"check:temporal": "node ./check-temporal.mjs"` — first in `npm run check` **and** as a dedicated
"Temporal guard" step in `.github/workflows/ci.yml` (the workflow fans out into discrete steps and
never runs `npm run check`, so the script-level wiring alone never reached the merge gate). The
wrapper passes **only** on git-grep exit 1 (searched, found nothing); exit 0 fails listing the
matches; any other exit fails closed.

- **File set (as built, final):** **all tracked files**, minus the genre exemptions —
  `docs/concept/DECISIONS.md` (dated diary), `plans/` (done-records), `reviews/` (archive), and
  `package-lock.json` (machine-generated, not authored prose). The guard sweeps its own file too;
  its single allowance is line-level use–mention (only the pattern-literal line, which must name
  the tokens it bans). Subtractive, never additive — new files are guarded by default.
- **Patterns:** session/wave/fold tokens, the old flag name (regression tripwire for 1a), numbered
  plan-file refs, ISO dates. **Deliberately absent:** `Slice [0-9]`/`Phase 0` (allowed
  forward-pointers) and `MD-n` (citations encouraged).
- Runs **first** in `check` (fastest step, fail fast). After items 1–3 land this produces zero hits
  (verified against the current tree: the only date in `docs/concept/0*` is `02:152`, fixed in 2a;
  the glossary date is dropped in 2c).
- ~~Known accepted limitation: `!`-negation inverts a git-grep usage error into a pass.~~ Rejected
  by the adversarial pass — a guard that errors must never pass (the MD-13 silent-skip lesson,
  applied to the guard itself); the Node wrapper fails closed.
- Future false-positive path: if a Slice-1 fixture legitimately needs an ISO date (an order
  timestamp), narrow the date pattern or add a targeted pathspec exclude *in the same commit*, never
  by widening the genre exemptions.

## 6. Verification (S)

1. `npm run check` — full gate green (now including `check:temporal`).
2. `npm run check:temporal` standalone — zero hits.
3. Cross-ref spot checks: (a) the DECISIONS.md header §-map decodes MD-7's §4b/§6/§7/§8 and R1's
   §2/§4 without leaving the file; (b) `04` §2's "DECISIONS R1"/"R3" citations still resolve; (c)
   AGENTS.md no longer mentions the glossary-header map; (d) the glossary header carries no `base §n`
   machinery; (e) every `(MD-n)` in `docs/concept/0*` + glossary has a name to its left (eyeball —
   not machine-enforced, to keep the guard purely temporal-token-shaped).
4. Write this plan's done-record header at session end (Status: executed; **Next: Slice 1 — the
   `ts-morph` extractor**) — now the *only* place carrying "what next" (Rule 3).

## 7. Explicit non-goals

- **The decision-spec fold** (DECISIONS entries → `kind:"decision"` `.sdp.ts` specs) — deferred until
  after Slice 1, as both reports recommend: it becomes the extractor's second corpus (~10 durable
  MD specs + D3/D5/D6; Execution lines and status tags dissolve into derived facts and `readiness`
  per the model's own rules). This session only prepares the ground (the registry's future-spec-id
  column).
- **No DECISIONS.md entry deletion** (incl. R1–R3 — annotated instead; see item 4).
- **No scrubbing of `plans/`, `reviews/`, git history, or the measured-evidence table** — temporal by
  genre.
- **No src/test MD-reference sweep** beyond comments already being edited.
- **`jtbd-stories/`** — validated clean; untouched.
- **CLI strings and Slice-N forward-pointers** — untouched by decision, not omission.

## Risks

- **§-map relocation:** AGENTS.md's glossary row and DECISIONS.md's header both currently point at
  the glossary-header map — both are rewritten this session (2b, 3a); verification 3 covers the
  dangling-pointer risk.
- **Glossary date drop:** mildly lossy on the artifact itself; accepted (provenance in git +
  DECISIONS.md).
- **`GraphReadinessClause` is exported API surface** (`export *` from `src/index.ts`) — free to
  rename at v0.0.0 with zero adopters.
- **Test renames:** safe (no snapshot/name-keyed tooling); stale assertions fail loudly until
  updated.
