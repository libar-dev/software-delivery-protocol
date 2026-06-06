# Plan — Rewrite JTBD stories (and purge context impurities) to match the consolidated concept

## Context

The concept docs (`docs/concept/00`–`07` + README) were reviewed, consolidated, and had
significant scope/complexity removed. The JTBD stories (`jtbd-stories/*`) were written against
the *previous* concept and are now stale and, in places, **contradict** the current model.

These documents are not throwaway: per the user, **the stories + the concept are the direct
inputs to implementing the MVP — there will be no traditional PRDs**, in keeping with the
spec-driven philosophy the product itself embodies. So the stories must be faithful, complete,
implementation-grade, and free of "context impurities" (historical / resolution / v1-comparison
meta that pollutes an AI agent's context). History is tracked in git, not in these docs.

The user authorized: (a) full reorganization of the story set (no need to preserve the current
shape), (b) updates to the concept docs to remove the same impurities, and (c) complete removal
of test-result-ingestion and temporal/superseded bookkeeping as concepts.

## Decisions locked (from clarifying Q&A)

- **Reorganize freely.** No obligation to keep the current story structure or count.
- **Test-result ingestion: gone.** Not deferred, not reframed — removed as a concept. Verification
  is **structural** (a linked verifying test *exists and is enabled*), never pass/fail. Do **not**
  leave "D3 / resolved / cut" archaeology behind.
- **No temporal/superseded data as context.** History lives in git. Drop "v1 said X", "resolved",
  "dropped not deferred", "the analysis flagged", playground-experiment citations, etc.
- **Retag to match the consolidated MVP:** impact/blast-radius is MVP (frozen handle method +
  impact list in the view); git-history reconstruction is an MVP invariant (free from determinism),
  with rich diff/time-travel UI noted as a natural follow.
- **Phasing is reviewable.** Tags are a proposal; the user will finalize MVP sequencing.

## Part 1 — Rewrite the JTBD stories (PRIMARY)

Rewrite all 9 files. Every story: clean current-state truth, correct `References:` to the new
concept filenames, JTBD format (`When … I want to … so I can …`), 6–8 outcome-focused acceptance
criteria anchored in the real concept vocabulary (readiness levels, namespaces, relations, frozen
handle methods, validators) so they are directly actionable. **No** v1/resolution/decision-ID
meta anywhere.

### Final story set (proposed)

| Theme / file | Stories | Phase |
|---|---|---|
| **A — Capture & evolve intent** (`01`) | A1 Capture a rough idea with zero ceremony · A2 Enrich a spec in place · A3 Refine into child specs without losing the parent · A4 Position on two axes (abstraction × readiness) · **A5 Group related specs into a coherent pack** *(new)* | MVP |
| **B — Bind code to intent** (`02`) | B1 Mark significant code with its spec ID · B2 Link by stable ID so specs & code survive refactors | MVP |
| **C — One graph** (`03`) | C1 Derive one canonical graph · C2 Trust every edge's provenance · C3 Regenerate as a pure function of the repo · C4 Reconstruct history from git, not a second store *(retag→MVP)* | MVP |
| **D — Keep it honest** (`04`) | D1 Fail CI on broken links & false readiness claims · D2 Enforce completeness per readiness level | MVP |
| **E — See & share** (`05`) | E1 Read a spec through one generated view · E2 Give an agent structured context via a typed handle · E3 Share an interactive view with stakeholders | MVP, MVP, Iterate |
| **F — Edit through the lens** (`06`) | F1 Drive a change as scoped intent, not a patch | MVP model / Iterate UI |
| **G — Trace & assess impact** (`07`) | G1 See what a change impacts before making it *(retag→MVP)* · G2 Trace a spec to its verification and back · **G3 Get curation assistance from the mechanical substrate** *(new)* | MVP, MVP, Iterate |
| **H — Evidence** (`08`) | H1 Link runtime observations back to specs *(former H2; the test-result story is deleted)* | Later |

### Key substantive fixes (the contradictions)

- **F1 — full rewrite.** No patch format, no validated/transactional patch, no stale-graph refusal.
  Job: compose scoped intent in the view → an agent edits source → git records → CI validates (the
  same gate as any edit). Essence: the view never writes; the editor is an agent editing source,
  identical to a human edit. The richer in-view "bundler" is the Iterate part; the underlying
  intent→agent→git→CI model is MVP-true. (`06` §4)
- **H — delete test-result story.** Replace the theme with the single aspirational runtime-evidence
  overlay (NFR-met-in-prod via observations; pointers/summaries, standards at the boundary). (`00` §4)
- **D2 — `verified` is structural.** "a linked verifying test exists and is enabled," not "actual
  passing evidence." Reference the readiness-profile table (`05` §3). Drop "ratchet/start lenient"
  as an MVP AC (`--lenient` is aspirational, `05` §6); MVP fails hard on a clean context.
- **B2 — drop supersession-on-rename.** Renaming an ID is an ordinary git edit; referential
  integrity catches now-dangling refs. `supersedes` is ADR-only current intent, not rename
  machinery. (`01` git-as-event-log, `02` §6)
- **E2 — typed handle, not "slice".** MVP AI surface = one typed read handle (method list = docs)
  + raw `graph.json`; frozen: entry adapters (string/file/changeset→graph), blast-radius,
  irreducible joins; agents script the rest; read-only gate; ~⅕ token cost vs grep. Token-budgeted
  slices + MCP are aspirational. (`06` §3)
- **E1 — one generated view; form is a Representation.** Drop "rich HTML primary, Markdown
  fallback." Per-spec: header (incl. claimed-vs-derived readiness divergence), intent/behaviour,
  relations, bindings w/ source links, **structural** verification presence, impact list,
  provenance cues. (`06` §5)
- **A4 — both axes are MVP from day one** (not "readiness first, abstraction later"); include
  `kind` as a third independent field. (`02` §2, P8)
- **A5 (new) — packs.** `specPack` groups related specs for group-level ideation; validated for
  **coherence** (shared terms defined, membership resolves, no duplicated intent without a
  relation, no dependency on undefined concepts), **not** member completeness. (`02` §4, `05` §4)
- **G1 — impact is MVP.** Backed by the frozen blast-radius handle method + the view's impact list;
  inferred items marked as such. Rich impact UI is Iterate. (`06` §3, `07` slice 4)
- **G3 (new) — curation assist.** The mechanical substrate (inferred import/symbol graph) offers
  exactly: impact/blast-radius (firehose) + two assist roles — **propose candidates** and **flag
  unambiguous drift** — and **never** densifies the curated architecture. "Divergence is curation,
  not drift." (`06` §2)
- **C4 — git history, MVP invariant.** No second store/audit table; rebuild at any commit; a graph
  diff between two commits is two projections compared. Rich diff/time-travel tooling is Iterate.

### References remap (all current links are broken)

`01-core-primitives` → `02-core-model`; `02-system-architecture` & `03-graph-metamodel` →
`03-the-one-graph` (+ `02` for the model); `04-authoring-surfaces` → `04-authoring-and-binding`;
`06-extraction-and-validation` → `05-validation-and-honesty`; `07-spec-studio-and-projections` →
`06-consumers-and-projections`; `08-delivery-evidence-and-tooling` → removed (evidence is folded
into `00`/`01`); add `00`/`07` where vision/roadmap is the right anchor.

### README rewrite

Index table with the new set + proposed phases; founding-principle block aligned to "projection
of the repo at a commit"; phase legend; "How each story is written"; an **out-of-scope** section
that states current non-goals plainly (no test-result ingestion, no patch subsystem, no second
store, runtime-anchor depth out, graph-DB later) **without** "resolved/cut/dropped/v1" narration.

## Part 2 — Full purge of context impurities from the concept docs (opted-in, this session)

**Depth: full purge** — confirmed. Lower priority than the stories, but done in the same session
so requirements (stories) and design (concept) stay coherent under one context. The heavy,
mechanical sweep of the larger files may be delegated to a subagent for a final round while the
main context keeps editorial oversight and guarantees cross-document consistency.

Pattern to remove across `00`–`07` + README:

- **v1 comparisons** — "the earlier v1 concept set oversold…", "the single biggest flaw in the v1
  docs…", "History note (L4): the v1 model added…".
- **Resolution/decision tracking** — "Resolved (decision):", "The tension / The resolution",
  decision IDs used as archaeology (D1/D2/D3), "the judgment-call cuts are now resolved".
- **Analysis archaeology** — "the analysis (View 1, E2) flagged", "latent invariant L1 … promoted
  here", "assumed-but-unstated in v1", architect-playground citations, "Mirrors architect ADR-006".
- **"Dropped, not deferred"** historical framing → state plainly "there is no patch subsystem; the
  edit path is intent → agent → git → CI".
- **Test-result narration** → state verification as structural; remove the D3 "cut entirely +
  rationale" passages.
- **Temporal/superseded narration** in the git-as-event-log sections → keep the *principle* and its
  current consequences; drop "the sharpest tension / v1 contradicted / resolved as a decision".

**Preserve** (current doctrine, not impurity): the model itself (primitives, axes, facets, IDs,
relations, validators, readiness profiles); Principle-vs-Representation framing; CORE/MVP vs
ASPIRATIONAL scoping; git-as-event-log as a principle; the two-surface (curated vs substrate)
model; the typed-handle AI surface; the intent-composition edit model; namespaces; the Order
Management running example.

Heaviest rewrites land on **`01`** (strip P/R "v1 oversold" framing and the L4 "tension/resolution"
narration to plain laws) and **`07`** (whose §4 "Resolved decisions" and §5 "Resolved tensions" are
almost entirely archaeology — the surviving *content* (no test ingestion, no patch loop, enum set,
git-history) is restated as plain current truth where it lives, leaving `07` = vertical slice +
CORE/ASPIRATIONAL map + cut list + residual open questions).

## Execution approach & sequencing

1. **Stories first (main context).** Rewrite all 9 `jtbd-stories/*` files for full fidelity to the
   concept and zero impurities. This is the priority deliverable and stays in the main context so
   the story↔concept mapping is internally coherent.
2. **Concept purge (main context + optional subagent final round).** Apply the full purge to
   `docs/concept/00`–`07` + README. I will drive the editorial restructuring of the heaviest files
   (`01`, `07`) directly; the mechanical impurity sweep across the remaining files may be delegated
   to a subagent, after which I review for consistency. Both halves ship this session.
3. **Coherence pass.** Re-read story `References:` against the purged concept headings/anchors so no
   link points at a section that was renamed during the purge.

## Verification

- Grep the final `jtbd-stories/**` and `docs/concept/**` for impurity markers — `v1`, `resolved`,
  `dropped, not deferred`, `D1`/`D2`/`D3`, `E2`, `L4`, `playground`, `View 1`, `test result` — and
  confirm none remain (outside legitimate current usage).
- Grep `jtbd-stories/**` for stale concept filenames (`core-primitives`, `system-architecture`,
  `graph-metamodel`, `authoring-surfaces`, `extraction-and-validation`, `spec-studio`,
  `delivery-evidence`) — expect zero.
- Confirm every `References:` link resolves to an existing `docs/concept/*.md`.
- Read-through: each story's ACs are consistent with the concept (esp. structural verification,
  typed handle, no patch loop, impact=MVP) and contain no removed concepts.

## Out of scope

- No code; these are documentation artifacts only.
- No new MVP scope beyond what the concept already states.
