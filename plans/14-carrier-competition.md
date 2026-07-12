# Plan 14 — The carrier competition: four exploration PRs and the ruling session

> **Status: 🔲 DRAFTED 2026-07-12 — the standing operational plan for the competition the plan-12
> session opened (plan 12 §8) and plan 13 unblocked.** Each carrier runs as its own exploration
> PR against the same exhibit bar; a dedicated PLAN-ONLY **carrier ruling session** judges them
> evidence-vs-evidence and rules the authoring carrier. This plan records the branch/worktree
> layout, the per-PR deliverable, the per-carrier posture, and the ruling session's docket — so
> the competition is grabbable from the repo, not from a session transcript.
>
> **Spec anchors:** plan 12 §8 (the competition's terms of record: the exhibit bar, the
> TS-DSL-stays-canonical rule, settlements 3 and 5 downgraded to standing evidence) · plan 13
> (the executable machinery every exhibit must run against) · FINDINGS §4–§5
> (`explorations/executable-examples/` — the scorecard axes and the micro-exhibits each PR
> deepens) · MD-17 (point-per-example; tables are carrier sugar) · CONTEXT.md "The executable
> half" (the ratified vocabulary; *notation* and *carrier* stay flagged until the ruling).

## §1 — The four PRs, and how to start each

Branch from `feature/anchors` (the exhibits need plan 13's generated contracts, the slot
notation, and the `/runner` + `/vitest` machinery); GitHub retargets to `main` automatically
when PR #3 merges. One worktree per carrier — disjoint directories, so all four run in parallel
with zero conflicts:

```sh
git worktree add ../sdp-carrier-f2      -b explore/carrier-f2-markdown   feature/anchors
git worktree add ../sdp-carrier-c2      -b explore/carrier-c2-grammar    feature/anchors
git worktree add ../sdp-carrier-gherkin -b explore/carrier-gherkin-fork  feature/anchors
git worktree add ../sdp-carrier-tsx     -b explore/carrier-typed-markup  feature/anchors
```

All work lives under **`explorations/carrier-competition/<carrier>/`** — `explorations/` is
already exempt from every toolchain gate (tsconfig, eslint, prettier, vitest, the temporal
guard), exactly as the plan-12 exhibits were. **No PR touches `src/`, `examples/`, or the
concept docs**: exhibits are evidence, never authored model — the TS DSL stays the sole
canonical authoring surface throughout the competition, so no spec ever has two homes and the
dual-source ruling stays cleanly deferred to the ruling session.

Suggested order by information value: **F2 and C2 first** (the evidence leaders — they set the
bar the other two must beat), Gherkin-fork and typed-markup behind or beside them (each must
overturn standing evidence to survive; see §3).

## §2 — The exhibit bar (identical for every PR; plan 12 §8 is the ruling text)

A PR is judgeable only when it carries all four deliverables:

1. **The full in-place maturity arc** for `spec:orders.create-order` + `valid-cart` — one file
   per spec, enriched in place `idea → scoped → defined → ready` (staged snapshots, e.g.
   `arc/01-idea…04-ready`, or a reviewable commit sequence), **executable at `ready` through the
   real plan-13 machinery**: the exhibit's `ready` form must map onto the same graph shape the
   TS DSL produces, and its bound example must run through the generated step contract (bind
   `examples/checkout-v1/generated/contracts/…` from the exhibit's test, exactly as the in-repo
   bound test does). The arc is the competition's core question made concrete: one format
   serving every maturity rung, prose-first at `idea`, executable at `ready`.
2. **One prose-heavy kind and one structure-heavy kind:** a `decision` record (where prose is
   the content) and a `contract` or `model` spec (where structure dominates) — the axis the
   gen-1 field evidence says carriers actually differ on.
3. **The table sugar:** the carrier's syntax for a multi-point example and its static expansion
   to N sibling examples (point-per-example, MD-17) — shown, not asserted: the expansion's
   output as N exhibit files or a worked mapping document.
4. **`SCORECARD.md`:** a self-scored row against the FINDINGS §4 axes (agent emission register ·
   non-engineer authoring/review · conversation→repo verbatim · envelope typing · prose ·
   kind coverage · ownership cost · differentiation sentence · standalone wedge) plus the
   differentiation test answered in one paragraph: *what does this carrier know that Gherkin
   doesn't?* An `IMPORT-NOTES.md` sketching how `sdp import`'s emitter would target this carrier
   earns extra weight (the migration wedge is real: the waiting gen-1 corpora).

House rules that bind inside `explorations/` even though the toolchain doesn't: no references
to the gen-1 product by name (lineage is evidence, never template); the ratified vocabulary
(CONTEXT.md) end-to-end; captured transcripts (`tsc` output, CLI output) committed verbatim as
the evidence they are.

## §3 — Per-carrier posture (what each PR must prove, beyond the bar)

- **F2 — markdown carrier** (`2-document/` + `5-harness/*.sdp.md` are the seeds): the evidence
  leader. Its open questions are its own: envelope as frontmatter (the generated-JSON-Schema
  autocomplete story), whether plain `.sdp.md` (commonmark + fences) suffices at MVP, and where
  free prose lives in the graph (the MD-10 extension — *name* the proposal for the ruling
  session; do not rule it).
- **C2 — own grammar** (`1-grammar/` is the seed): the identity maximalist. Its exhibit must
  make the ownership cost concrete: the arc's `idea` rung in a grammar file (the prose-poor end
  — gen-1's truncated docstrings are the cautionary tale), plus a sketch of the grammar's error
  surface (what a typo'd envelope line reports, under the one-line diagnostic law).
- **Gherkin extension/fork:** enters against a standing source-level reduction (FINDINGS "The
  fork question": compatible fork ⇒ tags-on-Gherkin, fails the differentiation test;
  incompatible fork ⇒ C2 on a forked chassis). The PR's job is the exhibit that **escapes that
  reduction** — if it cannot, its honest deliverable is a short CLOSED.md recording that the
  reduction held, which is itself ruling-session evidence.
- **Typed-markup / HTML document** (`3-typed-markup/` is the seed): enters against settlement 5
  (interactivity derives from the graph; JSX is a poor prose medium; children-typing too weak).
  The PR's job is an authoring exhibit that **beats that finding across the maturity arc** —
  same honest CLOSED.md exit if it cannot.

## §4 — The ruling session (PLAN-ONLY, after the PRs land)

Judges the four exhibits evidence-vs-evidence on the §2 scorecards; rules the carrier; then
rules what the winner unblocks, in order: the **dual-source letter-vs-spirit** question and the
TS DSL's long-term role; the **prose-in-graph** ruling (MD-10 extension) if a document carrier
wins; ratify-or-retire the flagged terms ***notation*** and ***carrier***; the winner's
**surface-design session** (grammar or document design — the syntax rulings plan 12 deferred,
including the ambiguous single-literal vocabulary form the plan-13 boundary repair left
explicitly unruled); the **`sdp import` emitter** targeting the winner (the parser half is a
small side PR off any worktree, anytime — it is carrier-neutral); and the **decision-spec fold**
(the DECISIONS registry's re-pointed trigger: durables are authored once, in the carrier that
survives).

**Exit criteria for this plan:** four PRs (or their honest CLOSED.md exits) landed against the
bar · the ruling session run and recorded (plan 15) · the carrier ruled with its doc-repair bill
enumerated · the surface-design session and the import-emitter slice scheduled.
