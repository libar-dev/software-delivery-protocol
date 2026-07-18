# Decision diary — Libar Software Delivery Protocol (meta-design)

> A why-focused log of hard-to-reverse decisions about **building the Protocol itself** — distinct from *in-system*
> decision records (a project's own `kind:"decision"` instances). Its job is to **recapture rationale** so choices
> stay visible and don't re-smooth into "false settledness." Entries are short and **status-tagged**
> (`ACCEPTED` / `PROPOSED` / `SUPERSEDED`). Companion to `CONTEXT.md` (repo root; formerly
> `docs/concept/ubiquitous-language.md` — the ratified glossary; the model exposition lives in `00`–`07`).
>
> **Decoding historical `base §n` references** (used by older entries below and the archived `reviews/`):
> the restructured base's old sections map to —
> §0 thesis · §1 meta-levels → `00` §2 · §2 primitive & boundary → `02` §1–§4 · §3 relations → `02` §6 ·
> §4 claims & the authored/derived split → `01` + `03` §3 · §4b delivery facts → `02` §2 ·
> §5 the one graph → `03` · §6 validation & honesty → `05` · §7 surfaces & projections → `06` ·
> §8 delivery-process execution → `06` §6.

## The ratified-name registry

The name is the primary handle; the ID is the breadcrumb. **In prose, lead with meaning — write "the
typing law (MD-11)," never bare "MD-n."** (Generalizes MD-8's own footnote.) *Curation* records each
entry's standing against the ADR three-part test (hard to reverse · surprising without context · a
real trade-off — see the working discipline in `AGENTS.md`); *durable* entries become `kind:"decision"`
specs at the decision-spec fold, under the future spec id reserved here. **Fold trigger re-pointed
(2026-07-11):** originally "post-Slice-1"; slices 1–5 landed with no fold, and the executable-spec
format decision (plan 12) will rule on the very authoring carrier decision specs would be written in —
so the fold now waits for that ruling, and the decision specs are authored once, in the format that
survives. **Format ruled (2026-07-12, the carrier ruling — MD-18):** the Markdown carrier; the fold
itself rides with the self-hosting session (plan 16 §7).

| ID | Ratified name | Curation | Gloss | Spec pointer or reservation |
|---|---|---|---|---|
| MD-1 | the executable meta-model | durable | Delivery intent conforms to a typed executable meta-model. | [Spec](../../specs/decisions/executable-meta-model.sdp.md) (`spec:decisions.executable-meta-model`) |
| MD-2 | adopt the nouns, reject the gates | durable | Shared delivery nouns do not imply workflow gates. | [Spec](../../specs/decisions/adopt-the-nouns.sdp.md) (`spec:decisions.adopt-the-nouns`) |
| MD-4 | one primitive, named coordinates | durable | One enrichable Spec carries independent coordinates. | [Spec](../../specs/decisions/one-primitive.sdp.md) (`spec:decisions.one-primitive`) |
| MD-5 | the protocol naming | durable | The product and protocol names remain stable. | [Spec](../../specs/decisions/protocol-naming.sdp.md) (`spec:decisions.protocol-naming`) |
| MD-7 | binding, never liveness | durable | Anchors state bindings, never runtime truth. | [Spec](../../specs/decisions/binding-not-liveness.sdp.md) (`spec:decisions.binding-not-liveness`) |
| MD-8 | the generic `codeAnchor` | **folded** (Slice 2) → doc-comment on the `codeAnchor` builder (`src/model/anchors.ts`) | One generic binding form spans code locations. | — |
| MD-9 | the open-questions home | folds at the fold (lives in `sections.ts`, the floor, `02` §3) | Unsettled durable questions live on their Spec. | — |
| MD-10 | content-only sections | durable | Sections carry content while relations carry links. | [Spec](../../specs/decisions/content-only-sections.sdp.md) (`spec:decisions.content-only-sections`) |
| MD-11 | the typing law | durable | Floor-read sections have closed typed shapes. | [Spec](../../specs/decisions/typing-law.sdp.md) (`spec:decisions.typing-law`) |
| MD-12 | the kind-conditional floor | durable | Readiness evidence varies with the Spec kind. | [Spec](../../specs/decisions/kind-conditional-floor.sdp.md) (`spec:decisions.kind-conditional-floor`) |
| MD-13 | floor-table-as-truth | folds (lives in `05` §3's Representation note + the `readiness-floor.ts` header) | The floor table is its code-level source of truth. | — |
| MD-14 | one validation path | durable | Validation runs only through the derived graph. | [Spec](../../specs/decisions/one-validation-path.sdp.md) (`spec:decisions.one-validation-path`) |
| MD-15 | the `.sdp.ts` extension | durable | The extension law is re-pointed, not repealed: carrier extensions identify Specs without test-glob collisions. | [Spec](../../specs/decisions/sdp-ts-extension.sdp.md) (`spec:decisions.sdp-ts-extension`) |
| MD-16 | carried evidence | durable | Promoted evidence must carry the evidence it represents. | [Spec](../../specs/decisions/carried-evidence.sdp.md) (`spec:decisions.carried-evidence`) |
| MD-17 | point-per-example | durable | Each example is one bound point. | [Spec](../../specs/decisions/point-per-example.sdp.md) (`spec:decisions.point-per-example`) |
| MD-18 | the carrier ruling | durable | Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option. The surviving law is one canonical surface per ID, no mixing. | [Spec](../../specs/decisions/carrier-ruling.sdp.md) (`spec:decisions.carrier-ruling`) |
| MD-19 | the prose-ownership law | durable | Prose belongs to typed graph owners. | [Spec](../../specs/decisions/prose-ownership.sdp.md) (`spec:decisions.prose-ownership`) |
| MD-20 | the strict consumer-exclusion contract | durable | Consumer exclusions are explicit root-relative paths. | `spec:decisions.exclusion-contract` |
| MD-21 | the envelope-grammar ownership posture | durable | The Protocol owns the envelope contract, not the YAML library. | [Spec](../../specs/decisions/envelope-grammar-posture.sdp.md) (`spec:decisions.envelope-grammar-posture`) |

### Current executable decision-spec pointers

- [The plain-language references decision](../../specs/decisions/plain-language-references.sdp.md)
  (`spec:decisions.plain-language-references`).
- [The concept-documents dissolution decision](../../specs/decisions/concept-docs-dissolve.sdp.md)
  (`spec:decisions.concept-docs-dissolve`).

---

## 2026-06-06 — Session: reframe + language base

> **Retired entries (2026-06-07).** **MD-3** (three meta-levels; Phase 0 = the Protocol as code) is fully absorbed
> into `ubiquitous-language.md` §1 — conclusion *and* rationale — and was deleted. **MD-6** (Spec named;
> descriptor enums locked; bounded-context → projection) is canonical in the base ledger + §2; its one unique
> nugget — the **partial reversal of MD-4** — was folded into MD-4 below, and the entry deleted.

### Base refinements (R-series)  [R1/R2 ACCEPTED & applied 2026-06-10 (Fold-A) · R3 see below]

> **[RETIRE-AT-FOLD]** — pure change-log by the three-part test (the entries' own words: "the code already
> conforms"); substance fully absorbed into the glossary, `01`, `03`, `04`. Kept until the decision-spec fold
> because `04` §2 cites "DECISIONS R1"/"R3" live.

**Context.** The post-Session-1 founding-ideation review surfaced two wording imprecisions in the ratified base.
The **code already conforms** in both cases; these are language tightenings, so per the working discipline
(terminology is ratified — *flag*, don't silently edit) they were recorded as **PROPOSED** and assessed by the
post-split adversarial review as *already determined* (ratification, not deliberation). They were ratified and
applied in the **pre-grill fold session (2026-06-10)** — R1/R2 during the Fold-A base restructure, R3 in Fold-B —
rather than spending grill time on no-op-on-code wording. They are **not** model changes.
- **R1 — harmonize "anchor carries identity only" (§2) with "anchored = a human binding" (§4).**  [ACCEPTED ·
  applied] §2 said anchors carry "identity only," while §4's `claim` table called `anchored` "a human binding" —
  and a binding (it emits a `satisfies`/`verifies` edge) is more than bare identity. Unified phrasing, now in the
  glossary's `anchor` entry, `01` (epistemic boundary), and `04` §2: *"an anchor says 'this code location is the
  implementation/test binding for this Spec ID'; binding only, never system-truth content — never behavior,
  rationale, readiness, acceptance criteria, or delivery facts."* The code already conforms (anchors hold
  only `id`/`label`/target; `@ts-expect-error` proves the rest is rejected).
- **R2 — "no consumer reads source directly" → permit source *links*, forbid independent re-parsing.**  [ACCEPTED ·
  applied] The principle (`03`/`05`/`06`) is right, but a Design Review linking to source locations *recorded in
  the graph* is legitimate. Now stated in `01` P2 and `03` §4: *"Consumers may link to source locations recorded
  in the graph; consumers must not independently parse source to derive their own model."* Matters when the
  Slice-4 Design Review lands.
- **R3 — reconcile `04`'s `specTest` signature to binding-only.**  [ACCEPTED · applied 2026-06-10 (Fold-B)]
  `04` §2 documented `specTest(id, { verifies, run })` with an executing `run` callback; the implementation
  (`src/model/anchors.ts`) is identity-only (`{ id, label?, verifies }`, **no `run`**). The code is the *more*
  faithful one: a binding anchor carrying `run` would couple the graph binding to execution, contradicting
  "the graph records that an enabled verifier *exists*, never that it ran" (§4b / MD-7). A **doc fidelity bug,
  not a code gap** — `04` §2 now shows the binding-only signature matching the code. Same pattern as R1/R2
  (the code already conforms). Surfaced by the post-Session-1 adversarial review (F6).

### Scope note — relationship to the prior plan & brief
**Adopt-the-nouns reversal (kept for the record).** An earlier brief held "the Protocol is **not** a PM tool; do **not**
adopt SAFe/PM ladder names." MD-2 **reverses** that: the commercial Studio means users must not relearn delivery
vocabulary, so the Protocol adopts the established delivery **nouns** (as projections + vocabulary) and rejects only the
process **gating** FSM. The structural decisions **D1–D6** (recorded below) **still hold**, reframed under the meta-model
(MD-1); the cleanup plan that applied the ratified language across the 18 concept/JTBD docs was **executed and
retired** (2026-06-07). The first-draft input drafts (`GLOSSARY.md`, `UBIQUITOUS_LANGUAGE_{1,2}.md`) and the language-finalization
brief have since been **deleted** (consolidated); the **sole canonical base is
`docs/concept/ubiquitous-language.md`.**

---

## 2026-06-10 — Session: pre-grill folds (Fold-A · Fold-B · archive)

> The fold session prescribed by `plans/04` §3: restructure the language base (Fold-A — the UL doc became
> the lean glossary; model exposition rehomed into `00`–`07`), ratify-and-apply the R-series (above), fold
> the already-determined items out of the grill agenda (Fold-B — the two entries below), and archive the
> review artifacts into tracked `reviews/`. The grill (`plans/03`) now opens onto a lean base and only
> genuinely-open decisions.

### MD-8 — Generic-anchor DSL shape: one `codeAnchor` over the implementation-flavored code namespaces  [ACCEPTED 2026-06-10 · FOLDED at Slice 2 — the rationale lives on the `codeAnchor` builder doc-comment (`src/model/anchors.ts`); kept as the historical record]
**Decision.** Generalize `anchorImplementation` into a **`codeAnchor`** builder (plus branded id) accepting the
implementation-flavored code namespaces — **`impl` / `api` / `component`** — so a *generic* anchor can bind any
code location (class, function, route, module) as the base requires.
**Why / alternatives rejected.** Anchors are generic *by definition* (`04` §2 — the binding is the thing,
framework- and location-neutral), and the ID grammar already parses any lowercase namespace; only the builder +
branded id are namespace-locked today. The base therefore already forces this answer — the post-split
adversarial review assessed it "resolvable now," so it is recorded here rather than spending grill time.
*Rejected:* per-namespace sibling builders (`anchorApi`, `anchorComponent`, …) — surface bloat for zero
expressive gain.
**Execution.** Rides Slice-2 anchor extraction, together with the example's missing api/route anchor
(`plans/02` H10). *(This is the item the plans' open-decision code-space called "D6" — not the legacy
structural D6 below; lead with meaning.)*

### MD-9 — Open-questions canonical home: `intent.openQuestions`  [ACCEPTED 2026-06-10]
**Decision.** Blocking open questions live in **`intent.openQuestions`** — the honesty check (no stated
`defined`/`ready` with a blocking open question) must read them there.
**Why.** The base is unambiguous (`02` §3: `intent` carries `openQuestions`, flaggable `blocking`; the `04`
worked example authors them under `intent`). The Session-1 pre-plan drifted — the implemented floor data reads
`design.openQuestions` / `decision.openQuestions`, so a doc-following author's blocking question never fires
the marquee honesty check. The fix direction is determined **regardless of how sections get typed** (the
typed-sections grill decision only shortens the predicate), so it is recorded now rather than gated on it.
**Execution.** Stays `plans/02` Wave B (H2): read from `intent.openQuestions`, update the floor data's
`authoredPaths`, flip the gated should-fail fixture active.

## 2026-06-10 — Session: the grill (decision resolution on the lean base)

> The fresh `grill-with-docs` session prescribed by `plans/04` §5, agenda `plans/03`: the six genuinely-open
> decisions (plans' open-decision handles D1–D4, D7, D8 — not the legacy structural D-space below), resolved
> against the lean base, ratified inline. Base edits land in `02`/`04`/`05`; terms in the glossary; Wave B
> (`plans/02`) rewritten execution-ready at the end.

### MD-13 — The floor table in code is the single source of truth; the evaluator is generic  [ACCEPTED 2026-06-10 · status 2026-07-11: the one-validation-path re-key (MD-14, executed) moved predicate signatures from `(spec, model)` to `(node: PrimitiveNode, index: GraphIndex)`; the table / derived clause-id union / generic evaluator all stand — `src/validate/readiness-floor.ts`]
**Decision.** `readiness-floor.ts` becomes the one home of the floor: each row carries `{ clauseId,
description, predicate }` (a named predicate from a small library, with paths as arguments where presence
*is* the check); the per-kind evidence map (MD-12) lives beside the clauses; the clause-id union is
**derived** from the table via `typeof`, never re-enumerated; the evaluator is one generic loop. Evidence
predicates take `(spec, model)` — promotion-neutrality (MD-10/MD-12) needs the authored model to see
refining children. Decorative metadata is banned: `authoredPaths` either becomes a real predicate argument
or is deleted.
**Why / alternatives rejected.** 453 lines for three checks; clause ids enumerated in four places (add a
clause → edit 3–4 spots; miss the switch and it **silently skips** — a validator that silently stops firing
is exactly what `05` §5 exists to prevent); `authoredPaths` was verified decorative. Table-as-truth also
buys doc↔code fidelity: `05` §3's tables and the data table are reviewable as mirror images. *Rejected:*
evaluator-as-truth (the doc table would mirror a switch; the sync burden survives); minimal trim (the
silent-skip failure mode survives).
**Execution.** Wave B (plan 02 H5), together with the MD-12 floor rewrite — one change, since the table
being rewritten is the table being collapsed.

## 2026-06-10 — Session: Wave B execution + post-execution adversarial pass

## 2026-07-11 — Session: plan 12 run (the universals ratified · the carrier competition opened)

> The session's full record — the seven ratified settlements, the carrier-competition restructure,
> the exhibit bar, sequencing, and the law rulings that needed no new entry (JS-B2.3 kept: A2 is the
> generated-union route the base already designed in, so the collision existed only under the dead
> A1; dual-source ruling deferred to the carrier ruling session; MD-15 untouched) — lives in
> **plan 12 §8**. Only one ruling passed the three-part test and enters here.

## 2026-07-12 — Session: plan 16 run (the carrier ruled · prose ownership ruled)

> The session's full record — the evidence table, the grounds, the re-dismissals by name, the
> doc-repair bill, and the scheduled sessions — lives in **plan 16** (the session record of
> record). The flagged terms ***carrier*** and ***notation*** ratified into `CONTEXT.md` at this
> session. Two rulings passed the three-part test and enter here.

## 2026-07-18 — Session: plan 17 execution (the self-hosting phase's pre-Gate-4 docket close)

> The phase's full record — the corpus, the executable loop, the four owner gates, and the
> docket — lives in **plan 17** and its execution branch. Plan 17 §3 flagged two rulings as
> likely diary-worthy; both passed the three-part test at the pre-Gate-4 disposition and enter
> here. The remaining §3 rulings stay in the corpus specs, the pinned tests, and the plan's
> running log by deliberate omission.

### MD-20 — The strict consumer-exclusion contract: root-relative POSIX path-prefix, never basename-anywhere  [ACCEPTED 2026-07-18]
**Context.** Self-hosting forced the configurable extraction exclude the discovery code had
deferred to external adoption: a root build must keep `explorations/` and `examples/` out of the
Protocol's own graph. The fixed tooling excludes match basename-of-directory; the consumer rule
was the open question.
**Decision.** Consumer excludes (`--exclude` on `build`/`validate`/`view`;
`ExtractOptions.exclude`) are strict, case-sensitive, root-relative POSIX path-prefixes —
rejecting empty, `.`, leading `./`, terminal `/`, absolute, `..` segments, empty internal
segments, and backslashes; deduplicated; nonexistent and file prefixes allowed; unioned with
(never replacing) the fixed tooling excludes, which stay basename-of-directory.
**Why / alternatives rejected.** *Basename-anywhere, for consistency with the tooling excludes*:
convenient, but it silently skips a future nested `src/examples/` — consumer excludes are scope
decisions, and scope deserves paths, not names. Hard to reverse: a public CLI/options surface
consumers script against. Trade-off accepted: consumers must be explicit; precision beats
convenience.

## Structural-decision shorthand (D1–D6)  [ACCEPTED · relocated here when the cleanup plan was retired, 2026-06-07]

> These six labels come from the original structural-decisions pass. Their *content* is canonical in the
> design docs (`00`–`07` — since the Fold-A restructure rehomed the base's model exposition there); this table
> is kept for permanent traceability so any historical `(Dn)` reference still resolves now that the
> single-use cleanup plan (which previously held it) is gone. **Do not confuse this legacy D-space with the
> open-decision handles D1–D8 used by `plans/02`/`plans/03`** — those name the post-Session-1 grill agenda
> (typed sections, prose-vs-ref, floor collapse, …), a different code-space; in prose, lead with meaning.
> **[KEEP for traceability]** — at the decision-spec fold, **D3** (Pack reified), **D5** (the agent surface
> scripts the graph), and **D6** (the MCP-deferred *no*) become decision specs of their own; the table
> retires when the artifacts citing `(Dn)` do.

| Label | One line | Canonical in |
|---|---|---|
| **D1** | readiness (design maturity, authored) is separate from delivery facts (derived) | `02` §2 |
| **D2** | `02` carries explicit typed **sections**, trimmed to essence (branded-ID strings; open `model` list) | `02` §3 |
| **D3** | `Pack` is a reified grouping/aggregate (not folded into `Spec`); membership single-sourced on a manifest | `02` §4 |
| **D4** | **Design Review** is the flagship curated projection — the context where a human decides to state `ready` (sharpened by MD-7; the floor is checked, the review is human practice) | `06` §5 |
| **D5** | the **agent surface** = a visible typed graph the agent *scripts* (no verb wall); `reader` = thin loader | `06` §3 |
| **D6** | the **MCP surface** = integration for user-facing apps (designed-in, deferred build, shape TBD) | `06` §7 |

## Measured evidence — figures behind the generalized doc prose  [recorded 2026-06-07]

> The concept docs deliberately carry *principle-level* wording, not point figures (figures age and read as
> false precision). The measurements that motivated those principles are preserved here as evidence.

| Figure | Context | Generalized in the docs as |
|---|---|---|
| **~⅕ tokens** | a multi-probe agent session ran at ~⅕ the tokens of a grep/verb-API equivalent (data kept in-process, only conclusions returned) | `06` §3/§10, `jtbd-05` JS-E2 → "a measured context-efficiency win" |
| **< ~50 specs** | full-rebuild-per-run is comfortable below ~50 specs | `00` / `05` / `07` → "MVP scale" |
| **~10k+ nodes** | a property-graph DB is deferred until traversal pain (~10k+ nodes) | `03` / `07` → "until measured traversal pain" |
| **single-digit to ~25%** | a curated graph is a small selection of the mechanical (impact-graph) firehose | `06` §2, `jtbd-07` JS-G3 → "a deliberately small curated selection" |
