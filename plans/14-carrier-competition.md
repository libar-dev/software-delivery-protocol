# Plan 14 — The carrier competition: four exploration PRs and the ruling session

> **Status: 🔲 DRAFTED 2026-07-12 — the standing operational plan for the competition the plan-12
> session opened (plan 12 §8) and plan 13 unblocked.** Each carrier runs as its own exploration
> PR against the same exhibit bar; a dedicated PLAN-ONLY **carrier ruling session** judges them
> evidence-vs-evidence and rules the authoring carrier. This plan records the branch/worktree
> layout, the per-PR deliverable, the per-carrier posture, and the ruling session's docket — so
> the competition is grabbable from the repo, not from a session transcript.
>
> **Amended at the pre-competition review (2026-07-12), before any carrier PR cut:** worktrees
> branch from `main` post-merge (§1); effort asymmetry made explicit (§1, §3); three scorecard
> axes and the cross-carrier CLI-feedback deliverable added to the bar (§2, starred); the
> kind-partitioned dual carrier named as a candidate ruling and the dismissed directions
> docketed by name (§4).
>
> **Amended 2026-07-12, after the F2 exhibit PR (#4) was cut:** the four carrier execution
> plans are filed as the fork **`15a`–`15d`** (one plan family, only one carrier survives the
> ruling), so the ruling session is renumbered to **plan 16**. The carriers run
> **sequentially**, one dedicated session each, merging one PR at a time; each next branch cuts
> from current `main`. Carrier PRs touch only `explorations/`, so the machinery stays the PR #3
> snapshot throughout — kept honest by a pre-cut check, not by construction (see the
> operational note in §1).
>
> **Spec anchors:** plan 12 §8 (the competition's terms of record: the exhibit bar, the
> TS-DSL-stays-canonical rule, settlements 3 and 5 downgraded to standing evidence) · plan 13
> (the executable machinery every exhibit must run against) · FINDINGS §4–§5
> (`explorations/executable-examples/` — the scorecard axes and the micro-exhibits each PR
> deepens) · MD-17 (point-per-example; tables are carrier sugar) · CONTEXT.md "The executable
> half" (the ratified vocabulary; *notation* and *carrier* stay flagged until the ruling).

## §1 — The four PRs, and how to start each

Branch from `main` **after PR #3 merges** (the exhibits need plan 13's generated contracts, the
slot notation, and the `/runner` + `/vitest` machinery — the merge delivers them at a fixed
reference, so no exhibit binds against a surface that is still moving, and each carrier PR diffs
clean against `main`). The sequencing is: update the PR body → merge PR #3 → cut the four
worktrees. One worktree per carrier — disjoint directories, so all four run in parallel with
zero conflicts:

```sh
git worktree add ../sdp-carrier-f2      -b explore/carrier-f2-markdown   main
git worktree add ../sdp-carrier-c2      -b explore/carrier-c2-grammar    main
git worktree add ../sdp-carrier-gherkin -b explore/carrier-gherkin-fork  main
git worktree add ../sdp-carrier-tsx     -b explore/carrier-typed-markup  main
```

> *Operational note (2026-07-12):* implementation runs **sequentially**, one session per
> carrier — F2 already ran on `feature/markdown-carrier` (PR #4, its plan's recorded
> deviation). Carrier PRs merge **one at a time**, and each next branch is cut from current
> `main` (`git switch main && git pull && git switch -c explore/carrier-c2-grammar`), so the
> exhibits and plans of earlier carriers ride along in the tree. Because carrier PRs touch only
> `explorations/`, the machinery every exhibit binds stays the PR #3 snapshot — a discipline,
> not a construction: **nothing under `src/` merges until the plan-16 ruling**, and every
> carrier session verifies it before writing anything
> (`git log --oneline 251736137f6baa9748abeebe0fbbfa03e4dfa300..main -- src/` must print
> nothing; otherwise stop and flag). The worktree commands above stand for anyone running
> carriers in parallel. The per-carrier execution plans are `plans/15a`–`15d`.

All work lives under **`explorations/carrier-competition/<carrier>/`** — `explorations/` is
already exempt from every toolchain gate (tsconfig, eslint, prettier, vitest, the temporal
guard), exactly as the plan-12 exhibits were. **No PR touches `src/`, `examples/`, or the
concept docs**: exhibits are evidence, never authored model — the TS DSL stays the sole
canonical authoring surface throughout the competition, so no spec ever has two homes and the
dual-source ruling stays cleanly deferred to the ruling session.

Effort is asymmetric by information value, not just order: **F2 and C2 get the full exhibit
bar** (the evidence leaders — they set the bar the other two must beat). **Gherkin-fork and
typed-markup are timeboxed to one short session each**, whose *primary* deliverable is the
honest CLOSED.md (each must overturn standing evidence to survive; see §3) — the exhibit is
attempted only if the session finds a genuine escape from the standing reduction/settlement
early, not ground out for its own sake.

## §2 — The exhibit bar (identical for every PR; plan 12 §8 is the ruling text)

A PR **competing for the ruling** is judgeable only when it carries all five deliverables (1–4
are plan 12 §8's ruling text restated; deliverable 5 and the three starred scorecard axes were
added at the pre-competition review, before any carrier PR cut — the bar never moved under a
competitor). The timeboxed carriers' honest CLOSED.md (§3) is the recorded alternative, not a
bar failure: it concedes the carrier and enters the ruling docket as evidence, judged on
whether its standing reduction held — never against these deliverables:

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
   kind coverage · ownership cost · differentiation sentence · standalone wedge ·
   *diff/merge ergonomics\** — how a step rename or an envelope change reads in a PR diff, and
   how concurrent edits to sibling examples merge · *agent read-back token cost\** — agents load
   specs into context constantly, not just emit them; the exploration's token findings cut both
   ways · *minimum-ceremony `idea` spec\** — the arc's `01-idea` snapshot judged on "how little
   ceremony does the minimum honest spec require?", because the coverage-gap draft-example
   affordance (settlement 9) makes the two-line `idea` spec the highest-volume authoring event)
   plus the differentiation test answered in one paragraph: *what does this carrier know that
   Gherkin doesn't?* An `IMPORT-NOTES.md` sketching how `sdp import`'s emitter would target this
   carrier earns extra weight (the migration wedge is real: the waiting gen-1 corpora).
5. **The CLI-feedback sketch** (every carrier, not just C2): what a typo'd envelope reports at
   `sdp validate`, verbatim, under the one-line diagnostic law — a mock transcript in the
   `1-grammar/DIAGNOSTICS.txt` style, committed as the evidence it is. Agents authoring in a
   loop live off the CLI's output, not an editor's squiggles; the scorecard's envelope-typing
   axis measures the editor, this deliverable measures the loop.

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
  incompatible fork ⇒ C2 on a forked chassis). **Timeboxed to one short session** whose primary
  deliverable is a short CLOSED.md recording that the reduction held — itself ruling-session
  evidence (it inoculates against "why didn't you just extend Gherkin?" permanently). The full
  exhibit bar is attempted only if the session finds, early, a genuine **escape from that
  reduction** — first-class metadata slots without breaking compatibility is the contradiction
  it would have to resolve.
- **Typed-markup / HTML document** (`3-typed-markup/` is the seed): enters against settlement 5
  (interactivity derives from the graph; JSX is a poor prose medium; children-typing too weak).
  **Timeboxed the same way**: primary deliverable an honest CLOSED.md; the full bar attempted
  only if an authoring exhibit that **beats that finding across the maturity arc** shows up
  early.

## §4 — The ruling session (PLAN-ONLY, after the PRs land)

Judges the four exhibits evidence-vs-evidence on the §2 scorecards; rules the carrier — with
the directions already dismissed on standing evidence dismissed **by name, never by omission**
(the FINDINGS "Directions dismissed by name" addendum: pure-data carriers, colocated specs,
alternative document dialects, notebooks, projection editing); then rules what the winner
unblocks, in order: the **dual-source letter-vs-spirit** question and the TS DSL's long-term
role — where the **kind-partitioned dual carrier is a first-class candidate ruling, not a
fallback**: the winning carrier for the prose-natured kinds, the TS DSL canonical *forever* for
`contract`/`model`, lawful via the designed-in per-ID canonical-surface config (`04` §1);
exhibit-bar deliverable 2 (the structure-heavy kind) generates exactly the evidence this
candidate needs, and pretending one carrier must win all eight kinds could force a bad fit;
the **prose-in-graph** ruling (MD-10 extension) if a document carrier
wins; ratify-or-retire the flagged terms ***notation*** and ***carrier***; the winner's
**surface-design session** (grammar or document design — the syntax rulings plan 12 deferred,
including the ambiguous single-literal vocabulary form the plan-13 boundary repair left
explicitly unruled); the **`sdp import` emitter** targeting the winner (the parser half is a
small side PR off any worktree, anytime — it is carrier-neutral); and the **decision-spec fold**
(the DECISIONS registry's re-pointed trigger: durables are authored once, in the carrier that
survives).

**Exit criteria for this plan:** four PRs landed — against the bar, or closed via the honest
CLOSED.md exit (§2) · the ruling session run and recorded (plan 16) · the carrier ruled with
its doc-repair bill enumerated · the surface-design session and the import-emitter slice
scheduled.
