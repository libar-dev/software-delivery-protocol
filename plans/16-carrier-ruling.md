# Plan 16 — The carrier ruling session (PLAN-ONLY): the competition judged, the carrier ruled

> **Status: ✅ RUN 2026-07-12 — decisions recorded; this plan is the session record of record.**
> The docket is plan 14 §4; the evidence is the four carrier PRs (#4–#7), judged
> evidence-vs-evidence on the recorded scorecards and CLOSED records. Two rulings entered in
> `DECISIONS.md` — **the carrier ruling (MD-18)** and **the prose-ownership law (MD-19)**; the
> flagged terms ***carrier*** and ***notation*** ratified into `CONTEXT.md`; the plan-14/15
> ledger stamped (§8). The doc-repair bill (§6) is **enumerated here, executed by the scheduled
> sessions (§7)** — this session is PLAN-ONLY and touches no product source or concept doc.
>
> **Spec anchors:** plan 14 §4 (the docket of record) · the four exhibit/closure records under
> `explorations/carrier-competition/` · FINDINGS §4–§5 (`explorations/executable-examples/`) ·
> the canonical-surface config (`04` §1) · content-only sections (MD-10) · the typing law (MD-11).

## §1 — The evidence record judged

| PR | Entrant | Deliverable of record | Standing after this ruling |
|---|---|---|---|
| #4 | F2 Markdown | full five-deliverable exhibit + `SCORECARD.md` | **wins — the ruled carrier** |
| #5 | C2 own grammar | full five-deliverable exhibit + `SCORECARD.md` | dismissed on its own evidence (§2) |
| #6 | Gherkin extension/fork | honest `CLOSED.md` (escape test failed on all five named probes) | concession stands |
| #7 | Typed markup (TSX) | honest `CLOSED.md` (clauses i–ii failed; iii credited in principle) | concession stands; projection-layer value survives (§5) |

Both timeboxed entrants were judged on whether their standing reduction held under a current,
falsifiable probe — it did, both times — never against the five full-exhibit deliverables
(plan 14 §2's recorded alternative).

## §2 — The carrier ruling: F2 Markdown, all eight kinds (MD-18)

**Ruled: the Markdown carrier (F2) is the authoring carrier for all eight `kind` values.** An
authored `Spec` document is an `.sdp.md` file — a YAML-frontmatter **envelope**, free prose as
the body, and the Protocol-owned **notation** (typed Given/When/Then and the slot vocabulary) in
fenced blocks — statically extracted into the one graph.

**Grounds, evidence-vs-evidence.** The FINDINGS bottom line already named F2-layered and C2 the
genuine finalists; the scorecards decide between them on the axes the founding bets weight:

- F2 scores strongest exactly where the product's consumers live — agent emission register,
  conversation→repo verbatim ("the spec is the prompt"), prose, non-engineer authoring/review —
  and its exhibit proved the hostile cases mechanically: the `model`-kind port field-exact to the
  DSL-derived graph node, byte-identical generated contracts, the honest red drift demo.
- C2's decisive wound is its own scorecard's honest ownership row: parser, formatter,
  highlighting, rendering, editor integrations, and LSP are permanent owned surfaces — plus the
  agent grammar-context tax every unfamiliar agent pays until the syntax has a training
  distribution, and no rendered document anywhere without our tooling. Its genuine wins
  (differentiation, minimum ceremony by ~1 token, diff/merge) do not price out that permanent
  ecosystem obligation.

**The kind-partitioned dual carrier — considered first-class, declined.** Plan 14 §4 required
this option be ruled, not defaulted. The partition's entire evidence need was the structure-heavy
deliverable, and F2's exhibit met it: the `model` port ("the shape most hostile to prose
carriers") was field-exact and the `contract` kind parked honestly at `idea`. A permanent
two-surface partition would double authoring docs, import paths, and teaching cost to buy nothing
the exhibit shows Markdown failing at. The per-ID canonical-surface config (`04` §1) remains
designed-in as the lawful escape hatch — **retained, not exercised at MVP**.

**Obligation carried forward from the C2 parity note:** the F2 exhibit does not yet pin or refuse
every malformed-table case the hardened C2 spike does, and the two spikes made different
duplicate-relation subset choices. That asymmetry was treated here as exhibit implementation
asymmetry, never carrier evidence — and it becomes a named product-parser requirement (§7,
plan 18): a like-for-like hardening baseline before any refusal-coverage claim.

## §3 — The TS DSL's role and the dual-source ruling

The letter-vs-spirit question resolves on the spirit the base already wrote down: **the law is
one canonical surface per ID, no mixing — never TS-as-the-sole-surface.**

- The canonical default flips to the Markdown carrier **when the product parser and `sdp import`
  land and the worked example migrates** (plan 18); until then the TS DSL remains the sole
  canonical authoring surface, exactly as the competition discipline held.
- After the flip, the TS DSL survives as (a) the **import source** — existing `.sdp.ts` files
  enter through `sdp import`'s carrier-neutral parser half — and (b) a **lawful per-ID option**
  via the canonical-surface config (`04` §1): for any spec ID exactly one surface is canonical,
  the other is a generated read-only view.
- This honors the executable meta-model's refined gloss (MD-1): gen 1's disease was a binding
  invisible to the type system — dual-source plus runtime matching. The per-ID config prevents
  precisely that; retiring the TS DSL outright was declined as burning a designed-in escape hatch
  for no honesty gain.
- The `.sdp.ts` extension law (MD-15) is **re-pointed, not repealed**: the rationale (never
  `.spec.ts`; a colocated future) carries over to the carrier's `.sdp.md` sibling. The repair
  lands with the bill (§6).

The Protocol itself — Phase 0, the validators, the extractor, the generated contracts — stays
typed TypeScript. This ruling concerns the authored `Spec` document only.

## §4 — The prose-ownership ruling (MD-19)

**Ruled: free prose enters the graph as description values on typed owners — the owning typed
section, or the `Spec` itself (a spec-level narrative slot) — never a parallel heading-keyed
store, never a file-only pointer.**

Grounds:

- The one graph is the sole read model and consumers may link to source but never re-parse it
  (P2). A pointer-only representation forces every prose-needing projection — Design Review, the
  PRD-shaped views, rule catalogues, the context bundle — to either re-parse source or omit the
  prose. Dismissed on the graph law itself.
- The gen-1 delivery experience, reviewed direction-level this session, is unambiguous: the prose
  that proved durable and projection-worthy always had a typed owner (a spec's narrative, a
  rule's rationale), and prose without an owner degraded into transcription bloat that
  projections then amplified. Heading structure is also what churned hardest across readiness
  promotions — sections born, renamed, and killed as maturity advanced — so heading-path keys
  break content identity at exactly the transitions the maturity arc celebrates. (No gen-1
  artifact is cited durably; the lesson is carried as evidence, the pattern is not copied.)
- The ruling is MD-10-clean (descriptions are content, never spec refs; linkage stays on
  `relations`) and MD-11-aware: description values land inside already-closed typed shapes, and
  if a floor clause ever reads a prose slot, the typing law pulls it into the closed shape as
  designed.
- Epic-altitude navigational prose — the aggregator document humans navigate by — is served by a
  generous spec-level narrative plus `refines` relations, not by a second store.

**Delegated as first-class design, not leftover detail:** the deterministic ownership rule for
edge text (prose before the first recognized heading, between sections, under unrecognized
headings) is a named deliverable of the surface-design session (§7, plan 17). The default
posture is ambiguity-is-loud: prose the rule cannot own is refused, never silently dropped —
the spike's four counted paragraphs stay counted until then.

## §5 — Directions re-dismissed by name

Per the docket, the standing dismissals are re-affirmed by name, not by omission:

- **Pure-data carriers** (whole-spec YAML/JSON/TOML/CUE) — making the entire spec data kills
  prose; CUE is the exact C1 disease.
- **Embedded specs** (doctest-style, in-source) — the embedding dies, never the placement
  (the `.sdp.ts` extension law's colocated-future marker stands).
- **Alternative document dialects** (AsciiDoc, org-mode, Djot, Typst) — each loses Markdown's
  single decisive property: the agent emission register and render-everywhere page.
- **Notebook formats** (`.ipynb`, MyST) — diff-hostile and agent-hostile.
- **Projection/structured editing as the authored surface** — contradicts git-is-the-event-log;
  it is the aspirational Studio, not a carrier.
- **Gherkin extension/fork** — concession stands (its CLOSED record; escape test failed on all
  five named probes). `sdp import` and the Gherkin-in-Markdown token matcher survive as F2-side
  assets.
- **Typed markup (TSX) as authoring** — concession stands (its CLOSED record). The credited
  clause-(iii) capability — as-you-type envelope typing — and the typed component library remain
  a **projection-layer competency** downstream of the one graph, serving the ruled carrier
  without creating a second authored truth surface.

## §6 — The doc-repair bill (enumerated here, executed at plan 19)

The ruling makes the following places in the concept corpus stale. The bill is executed as one
coherent repair with the self-hosting session (§7), never piecemeal:

- **`README.md` (repo root)** — "MVP surfaces: the TypeScript DSL + generic source anchors,"
  "typed `Spec` DSL," "edit TypeScript + git" → the ruled carrier + the TS DSL's new role.
- **`00`** — the MVP-boundary rows naming the TS DSL as sole canonical surface; the Gherkin cut
  row and the carrier-competition framing (rewrite as ruled); the "TypeScript-canonical"
  one-breath statement.
- **`01`** — P5's "a JSON file that TypeScript happens to validate" illustration generalizes;
  the Representation table row for the authoring surface.
- **`02`** — §3's sections table gains the prose-ownership extension (spec-level narrative +
  per-section description; MD-19); the worked examples gain/become Markdown twins; the typing-law
  passage notes the prose slots' relation to the floor.
- **`03`** — spec discovery ("every `*.sdp.ts`") gains the `.sdp.md` path; the node payload
  example gains owned prose; the two-tier static-data rule gets its Markdown-parser analogue.
- **`04`** — the heaviest repair: §1 wholesale (the canonical heading, the `.sdp.ts` default,
  the static-data constraint's TS-specific wording, the canonical-surface config default flip);
  "exactly two authoring surfaces"; the carrier-competition OPEN marker → ruled; the repo-shape
  filenames.
- **`05`** — "authoring-time feedback is the type system's job" → the parser/diagnostics
  guardrail story for Markdown authors (the CLI-feedback registers both exhibits sketched).
- **`06`** — the generated view's content list gains prose rendering; note the generated-Markdown
  vs source-Markdown adjacency explicitly.
- **`07`** — Slice-1 wording ("TS Spec DSL"), the North Star ("writes specs in TypeScript"), the
  CORE map row; the ASPIRATIONAL Gherkin-surface rows → resolved-by-ruling; cut #3's rationale
  ("dual TS+Gherkin source is the biggest anti-pattern") → superseded by
  one-canonical-surface-per-ID; acceptance ①'s typed-autocomplete ergonomics lever reworked for
  the carrier.
- **`CONTEXT.md` / `DECISIONS.md`** — done this session (terms ratified; MD-18/MD-19 entered;
  the fold-trigger note updated: the fold's format question is answered, the fold itself rides
  with self-hosting).

Open questions `07` §4 carries forward: the carrier half of "when Gherkin/harnesses/evidence
become CORE" is now ruled; harnesses/evidence remain open. The prose-ownership edge-text rule is
a **new** named question, owned by plan 17.

## §7 — The scheduled sessions (plan 14's exit criteria, discharged)

1. **Plan 17 — the surface-design session (PLAN-ONLY).** The deferred syntax rulings, on the
   record before implementation pressure: the frontmatter envelope schema + the editor-association
   gap; fence names; slot sigils (settlement 6 committed the capability, "syntax owned by the
   grammar session"); the ambiguous single-literal vocabulary form the plan-13 boundary repair
   left explicitly unruled; the table-sugar syntax (point-per-example, MD-17); **the
   prose-ownership edge-text rule (§4)**; the diagnostics register agents author against.
2. **Plan 18 — the product parser + `sdp import` emitter (execution).** The carrier seam
   (`deriveGraph`) becomes public API; the parser is built tracer-bullet-style with the
   checkout-v1 worked example migrating as the forcing corpus; the like-for-like hardening
   baseline from the C2 parity note (§2) is a named requirement; the canonical default flips
   here (§3). The import parser half is carrier-neutral and may land as a side PR anytime.
3. **Plan 19 — the self-hosting pack (execution).** The Protocol's own delivery modeled as
   authored `Spec`s in the ruled carrier; **the decision-spec fold** (durable `DECISIONS.md`
   entries authored once, as `decision`-kind specs, per the re-pointed fold trigger); the
   doc-repair bill (§6) executed as one pass.

The losing exhibits and both CLOSED records stay in-tree as the ruling evidence and the permanent
record — deletable (machinery first, verdict documents last) once the ruled design is proven,
exactly as plan 14 §1 recorded.

## §8 — Ledger reconciliation

Stamped this session: plan 14 → ✅ EXECUTED (exit criteria met by this ruling); plans 15a–15d →
✅ EXECUTED with their PR numbers (#4–#7); plan 14a → a retroactive ✅ EXECUTED header (it landed
with the pre-competition review's amendments but carried no status line). Plan 16 (this record)
is stamped ✅ RUN, the PLAN-ONLY precedent plan 12 set. The highest-numbered plan header is now
honest again for "what now": the next session is plan 17.
