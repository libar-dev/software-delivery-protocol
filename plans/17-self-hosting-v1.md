# Plan 17 — Self-hosting, first slice: the repo's own specs in the ruled Markdown carrier

> **Status: ✅ LANDED — phase-1 implementation complete; final audit pending**
>
> Work happened on a dedicated branch named for the effort
> (e.g. `self-hosting/v1`) — never on `main`. Revised after an architecture review of the draft
> (findings folded in; the review's largest find — the extraction-root policy, §1.0 — is
> load-bearing for every verification claim). Further revised for **execution-readiness**:
> operative-record propagation for the carrier amendment, a full clean-clone `check` sequence,
> and pinned public contracts for exclude + reifier surfaces.
>
> **Spec anchors:** the carrier ruling and prose-ownership law (plan 16 §2, §4; DECISIONS
> MD-18/MD-19) · the F2 Markdown exhibit (`explorations/carrier-competition/f2-markdown/`) · the
> scheduled-session docket (plan 16 §7) · the ratified glossary (`CONTEXT.md`).

## Context — why this plan exists

The carrier competition is ruled: an authored `Spec` document is an `.sdp.md` file (YAML-frontmatter
envelope, free prose, the owned notation in fenced blocks). The ruling scheduled three follow-up
sessions — surface-design rulings (17), the product parser + import (18), the self-hosting pack (19).

This plan **deliberately reorders that schedule**: instead of ruling syntax on paper first, we start
**self-hosting now** — authoring the Protocol's own delivery as `.sdp.md` specs — and pull forward
from the scheduled sessions exactly what that corpus forces (a product parser, specific syntax
rulings), progressively, adjusting direction along the way. The corpus is the tracer bullet: if a
spec can't be authored cleanly, we fix the carrier design — never the spec. The §6 **docket ledger**
tracks which scheduled items each session discharges, so future sessions know what remains.

**The north star (recorded as a durable decision in this phase):** the concept corpus
(`docs/concept/00–07`, `docs/concept/DECISIONS.md`, `docs/concept/README.md`) is scaffolding. As
the authored model matures, its information dissolves into specs of appropriate maturity — mostly
executable specs — and each concept doc is deleted per-doc once specs fully carry its content.
Likewise the existing `test/` suite gradually becomes executable specifications. Phase 1 starts
that dissolution; it does not finish it.

**The interim canonical story (one sentence, kept honest everywhere):** *new spec IDs may be born
Markdown-canonical once the product parser lands; the default for pre-existing IDs and the worked
example remains the TS DSL until the ruled flip (product parser + `sdp import` + checkout-v1
migration).* This sentence lands in `AGENTS.md` in session 1 so no agent treats `.sdp.md` as fully
canonical everywhere mid-phase.

**This is a recorded amendment, not drift.** The carrier ruling's transition clause (plan 16 §3)
keeps the TS DSL *sole*-canonical until parser + import + migration all land; this plan amends
that clause's letter — new IDs may be Markdown-canonical once the product parser alone lands —
on the ruling's own recorded spirit: *"the law is one canonical surface per ID, no mixing — never
TS-as-the-sole-surface."* Markdown-born IDs with no TS twin satisfy the law exactly; only the
interim default changes.

**Operative-record gate (Session 1, before the first Markdown-canonical ID):** amending a
ratified decision is never a note-only gesture. Session 1 must land **all three** current-rule
surfaces in one commit (or a tight series with no intermediate green claim that contradicts them):

1. **`docs/concept/DECISIONS.md` MD-18** — rewrite the **Decision** paragraph itself (dated
   amendment line, e.g. amended by plan 17): new IDs may be Markdown-canonical once the product
   parser lands; pre-existing IDs and checkout-v1 remain TS-canonical until parser + `sdp import`
   + migration; surviving law unchanged (one canonical surface per ID, no mixing).
2. **`CONTEXT.md` resolved entry (MD-18)** — the same interim rule; no sole-canonical-TS claim
   left as "current."
3. **`AGENTS.md`** — the interim canonical sentence plus any status touch so agents do not read
   three conflicting current rules.

Until those three land, do not author the first Markdown-canonical ID.

**Standing style directives (from the planning session, to be recorded durably):**

- Most design decisions are recorded **in specs**; decision records (`DECISIONS.md`) are only for
  static, durable, hard-or-expensive-to-reverse choices — and they stay lean (1–3 sentences unless
  alternatives/consequences genuinely earn their space). Group related decisions; plain language.
- **No cryptic codes in human-facing prose** ("MD-18", "F2"): lead with the plain description; give
  the code after, in parentheses, only where cross-referencing needs it. Recorded as a
  `decision`-kind spec and referenced from `AGENTS.md`.
- The effort is called **self-hosting** (the ratified term) — never "dogfooding".

## Scope

**In:** extraction-root/exclusion policy (§1.0) · the product Markdown parser (corpus-scoped, on a
public two-seam carrier API) · `.sdp.md` as a first-class discovery path · the self-hosting corpus
(~15 specs; every readiness rung honest; each kind authored only where real content forces it) +
its `Pack` · prose-in-graph (narrative + section descriptions) per the prose-ownership law ·
executable tracer (md → graph → generated contracts → green test against the real machinery) ·
anchor retrofit on existing src/tests · Design Review rendering of prose · the anti-misleading doc
pass + the authoring-surface status note · syntax rulings as the corpus forces them, each recorded.

**Out (deferred, tracked in §6):** `sdp import` · checkout-v1 migration and the canonical-default
flip · the full like-for-like parser-hardening baseline (named follow-up; the parser specs must
pin "no claim of full refusal parity" so the corpus-scoped parser never masquerades as hardened) ·
markdown `Pack` syntax (the pack manifest stays a `.pack.sdp.ts` file — lawful, since the
one-canonical-surface law is per-ID) · table-sugar syntax and the single-literal vocabulary form
(**watch items**: rule only if a corpus spec forces them) · frontmatter editor association (named
gap stands) · the full back-catalog decision fold · cosmetic concept-doc repair.

## §1 — The product parser and the carrier seam

New extraction path, product-quality (no exploration shortcuts), reusing the exhibit spike
(`explorations/carrier-competition/f2-markdown/spike/`) as *evidence of the mapping*, never as code
to promote verbatim:

0. **Extraction root & exclusion policy — load-bearing, decided first.** Discovery today walks the
   whole root minus `node_modules`/`dist`/`generated`/`coverage`/dot-dirs
   (`src/extract/discover.ts`). Under this repo, a root-level build would sweep
   `examples/checkout-v1` and ~29 exploration `.sdp.md` files (seven of which share
   `spec:orders.create-order` across arc stages) — duplicate-id hard findings and exploration
   content in the Protocol's own graph. Self-hosting therefore forces the **configurable exclude**
   the discovery comment already defers to "external adoption."

   **Default ruling (executable contract; overturnable at review #1):**

   | Aspect | Ruling |
   |---|---|
   | CLI | Repeatable `--exclude <path>` on `build` / `validate` / `view` (every leg that extracts) |
   | Options object | `ExtractOptions.exclude?: readonly string[]` — identical inputs for build and `--check-clean` |
   | Union rule | Configurable excludes **union with** (never replace) the fixed tooling excludes (`node_modules`, `dist`, `generated`, `coverage`, dot-dirs) |
   | Match rule | **Root-relative path-prefix** (POSIX, no leading `./`): exclude `E` skips path `P` when `P === E` or `P.startsWith(E + "/")`. Consumer excludes are scope decisions — path-prefix, not basename-anywhere — so a future nested `src/examples/` is not silently skipped. (Fixed tooling dirs stay basename-of-directory as today.) |
   | Repo recipe | Root build: `--exclude explorations --exclude examples` (checkout-v1 keeps its own separate root) |
   | Recording | Documented `package.json` scripts only — a config file only if consumers outgrow flags |

   Review #1 may flip match rule to basename-anywhere for consistency with
   `EXCLUDED_DIRECTORY_NAMES` — record either way; the quality bar is documented, tested
   semantics, not the specific choice.

   Repo-root `generated/` follows the checkout-v1 pattern exactly: **untracked** (`.gitignore`
   already ignores every `generated/`; checkout's artifacts are documented as untracked and
   regenerated in-pipeline), already discovery-excluded by name, and produced by its own
   check-script legs without double-counting checkout's. Because the tracer test imports a
   generated contract from repo-root `generated/`, the check pipeline pins a **full
   clean-clone-safe sequence** (Session 4 lands it in `package.json` and refreshes the
   `AGENTS.md` gate row):

   ```text
   check:temporal
   → lint
   → format:check
   → build                          # dist CLI required for all generate legs
   → generate:self-hosting          # sdp build . --exclude explorations --exclude examples
   → generate:example               # checkout-v1 (unchanged)
   → typecheck                      # after generate: tracer tests may import generated/
   → typecheck:examples
   → test
   → check:self-hosting             # sdp view . --exclude … --check-clean
   → check:example
   ```

   **Why reorder typecheck after build+generate:** today `typecheck` is early because no
   main-package test imports `generated/`. The tracer (`test/` importing
   `generated/contracts/…`) breaks that. Session 4 adopts the sequence above (default) so the
   main suite hosts the tracer honestly — alternative is isolating generated imports the way
   checkout does (`tsconfig.examples.json` + post-generate typecheck only); prefer reorder.
   Determinism stays the checkout semantics: regenerate and compare (`--check-clean`), never
   compare against a committed tree.
1. **Public carrier seam — two seams, not one.** (a) A **carrier reifier** interface: file text →
   reified spec/pack input + findings, never throws — the TS-DSL reifier and the Markdown parser
   are its two implementations; (b) **`deriveGraph`** (`src/extract/derive.ts`): reified inputs →
   graph, promoted from deep-import to public API. Orchestration (discovery, routing by suffix,
   cross-file duplicate exclusion) stays inside `extract()`.

   **Default ruling (executable contract; overturnable at review #1):** publish `deriveGraph`
   plus a narrow purpose-named reifier result — never the internal TS reify machinery
   (**do not over-publish**):

   ```ts
   /** Public carrier reification result — file text → reified carriers + findings; never throws. */
   export interface CarrierReification {
     readonly specs: readonly ReifiedSpec[];
     readonly packs: readonly ReifiedPack[];
     readonly findings: readonly Finding[];
   }

   // Existing signature stays — anchors are a third surface, not a carrier:
   export function deriveGraph(
     specs: readonly ReifiedSpec[],
     packs: readonly ReifiedPack[],
     anchors: readonly ReifiedAnchor[],
   ): GraphSchema;
   ```

   - Name: **`CarrierReification`** (internal `FileReification` may alias or be renamed in-session
     — one public name).
   - Re-export `deriveGraph` + `CarrierReification` (+ `ReifiedSpec` / `ReifiedPack` as needed)
     from the package extract surface.
   - Both carrier implementations: `(sourceText, relativePath) → CarrierReification`.
   - Anchors remain outside the carrier seam (current `reifyAnchorSourceFile` path).
2. **Discovery.** `src/extract/discover.ts` learns `*.sdp.md` beside `*.sdp.ts`. A spec ID authored
   on both surfaces fails as the existing duplicate-id finding at extract time (the cross-file
   exclusion already strips duplicates before graph derivation). Default ruling, overturnable at
   review #1: **reuse the existing duplicate-id validator id with a carrier-aware message** (a new
   id only if the register proves confusing), pinned with a test either way. The
   one-canonical-surface-per-ID law thereby becomes machine-checked.
3. **Envelope.** Frontmatter parsed with the `yaml` package (one new runtime dependency), then
   gated by a **strict acceptance contract**: only the envelope fields (`id`, `kind`, `altitude`,
   `readiness`, `relations`); only spec-id targets; scalar-or-list relation targets (this rules the
   **relation-array form** the exhibit left unbuilt), repeated relation types pinned; a **concrete
   refuse list** for YAML constructs outside the subset (aliases, anchors, multi-document, tags,
   non-scalar keys, …); descriptor enums validated with the existing envelope finding ids
   (`extract/non-static-envelope`, `extract/unrecognized-property`); and **reserved derived
   vocabulary refused** exactly as the TS reifier's reserved-property set does — Markdown must
   never be an honesty bypass. The accepted subset is pinned by tests and authored as a
   `contract`-kind spec (§2) — the Protocol owns the grammar contract; the parsing library is a
   swappable representation. *Flagged for design review #1.*
4. **Body.** Our own small line-based reader — recognized structures only: first H1 = title,
   recognized `##` headings, list-item section fields, `gwt` / `gwt-vocabulary` fences (names and
   `{slot:type}` sigils adopted as-is from the exhibit; any deviation is a recorded ruling).
   The **heading → section map is a ruled, pinned, tested artifact**, not informal exhibit
   knowledge — it is *not* 1:1 with section names (e.g. "Example space" → the behavior section's
   example space via the vocabulary fence; "Verification — executable" → verification + mode from
   the em-dash convention), and near-miss headings get a did-you-mean diagnostic. Fence placement
   relative to section headings is part of the map (it decides prose and fence ownership). Reuses
   `src/notation/slots.ts` — never a second notation parser.
5. **Prose ownership (implements the prose-ownership law, MD-19).** Deterministic rules, ruled
   here under fire: prose between the H1 and the first recognized `##` heading → the **spec-level
   narrative**; prose directly under a recognized **object-shaped** section heading → that
   section's **description**. Prose under **array-shaped** sections (e.g. `constraints`, which is
   a list of constraint entries with no single owner) **refuses loudly** until a sub-owner rule is
   ruled — a named watch item, expected to be forced when the constraint/rule corpus specs land.
   All other prose (under unrecognized headings, trailing) refuses loudly with a named finding.
   **Schema consequences, decided and recorded in session 1:** the narrative slot lands on the
   authored `Spec` shape and the graph node payload (and flows through the reader's summaries and
   the Design Review); absent prose fields are **omitted on serialize** so prose-less graphs do
   not change shape; the **graph `schemaVersion` policy** (hold `0.3.0` vs bump) is ruled
   explicitly — default ruling, overturnable at review #1: **bump to `0.4.0`**, regenerate
   checkout-v1 once, and record that the only checkout diff is the version-driven lines (the
   Design Review index embeds the version too).
   Serialization pins **fixed key positions** for the new fields (narrative on the canonical node,
   description within section objects) so determinism never rides on authoring order. Terminology:
   the narrative is a **content slot on the primitive**, never an "envelope field" — the envelope
   stays stable by design, and the decision/carrier specs must not re-teach otherwise.
6. **Diagnostics.** The parser never throws on authored content: every refusal is a finding in the
   existing one-line diagnostic shape with pinned validator ids (the register agents author
   against). The exhibit's `DIAGNOSTICS.txt` is the register's seed.

## §2 — The self-hosting corpus (provisional list — session 1 refines it)

Lives in **`specs/` at repo root** (peer of `src/`), subdirs by domain. Pack manifest
`specs/self-hosting.pack.sdp.ts` (`pack:self-hosting-v1`, mirroring `checkout-v1`; membership
discipline mirrors the checkout pack — exploration IDs never packed). All new IDs are born
Markdown-canonical (no TS twin ever exists for them — no flip needed). **ID namespaces stay off
`spec:orders.*`** so self-hosting and checkout can never collide even under a temporarily
mis-scoped discovery sweep.

Kind coverage is a pressure gauge, never a checklist: a kind is authored only where the corpus has
honest content for it; a kind not yet forced goes on a named gap list instead of getting a thin
filler spec. Readiness is stated only where the floor genuinely clears — `ready` specs need their
relation targets resolvable and mature enough (design parent/child readiness together, not per row).

| Spec (provisional id) | kind | altitude | readiness | Delivery facts via |
|---|---|---|---|---|
| `spec:protocol.self-hosting` | behavior | epic | scoped | — (narrative-rich parent; exercises the narrative slot + `refines`) |
| `spec:extraction.derive-graph` | behavior | feature | ready | precise `satisfies` anchors at the real entrypoints (`extract`, `deriveGraph`), `verifies` on `test/extract.test.ts` |
| `spec:extraction.determinism` | constraint | feature | ready | anchor on the existing clean-repo byte-identical test (measurable target NFR) |
| `spec:extraction.build-pipeline` | workflow | feature | defined | — (discover → reify → derive → validate → emit) |
| `spec:validation.readiness-floor` | rule | feature | ready | anchors on the floor evaluator + `test/readiness.test.ts` |
| `spec:validation.duplicate-ids` | behavior | feature | ready | **the executable tracer** (§4) |
| `spec:validation.duplicate-ids.dual-carrier` | example | story | ready | generated step contract + new binding test |
| `spec:model.protocol-domain` | model | feature | defined | — (the core terms map; content sourced from `CONTEXT.md`) |
| `spec:carrier.markdown-authoring` | behavior | feature | defined | this phase's own work |
| `spec:carrier.envelope-contract` | contract | feature | defined | pinned by the parser's acceptance tests |
| `spec:carrier.markdown-parser` | behavior | feature | scoped→defined | enriched in place as this phase progresses |
| `spec:carrier.sdp-import` | behavior | feature | idea | honest two-line idea spec (deferred work) |
| `spec:carrier.prose-ownership-rule` | rule | story | defined | the §1.5 ruling, authored as a spec |
| `spec:decisions.plain-language-references` | decision | feature | defined | the no-cryptic-codes rule; referenced from `AGENTS.md` |
| `spec:decisions.concept-docs-dissolve` | decision | feature | defined | the north-star decision; a lean `DECISIONS.md` registry pointer likely still required (it passes the three-part test) |

Anchor granularity: prefer a few **precise anchors near real entrypoints** over coarse whole-file
claims; where a coarse file-level anchor is used for a phase-1 honesty demo, its label says so.

## §3 — Rulings made under fire (each recorded when made)

Forced immediately by the corpus, ruled during sessions and recorded in this plan's running log +
as corpus specs; only static/durable/hard-to-reverse ones also get a lean `DECISIONS.md` entry:

1. The **extraction-root & exclusion policy** (§1.0) — likely `DECISIONS.md`-worthy (product
   surface, hard to reverse once consumers script it).
2. The **frontmatter relation-array form** (scalar-or-list) — part of the envelope contract spec.
3. The **prose edge-text ownership rules** (§1.5), including the array-section refusal.
4. The **heading → section map** (§1.4) — a pinned contract with tests.
5. The **graph schema-version policy** for the prose fields (§1.5).
6. **Fence names + slot sigils** — ratified as-is from the exhibit unless authoring pain forces a
   change (then: recorded ruling).
7. The **diagnostics register** for parser findings, including the dual-carrier duplicate
   rendering (§1.2).
8. The **envelope grammar ownership posture** (contract ours, library swappable) — likely
   `DECISIONS.md`-worthy (dependency + posture, hard to reverse once authored corpus exists).

Watch items (rule only if forced): table sugar syntax · single-literal vocabulary form ·
array-section prose sub-owner · anything the corpus's `model`/`contract` kinds strain against.

## §4 — The executable tracer

Proves md → graph → contract → test on the Protocol itself: `spec:validation.duplicate-ids`
declares an example space (`gwt-vocabulary`; slots the handler can genuinely assert on — e.g. the
two carrier surfaces and the expected finding id), its `example` child binds one point, `sdp build`
generates the step + space contracts under the repo's own `generated/`, and a **new test** binds
the contract via `bindExample` (exactly as
`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts` does) with handlers driving the
**real extractor on a fixture** — fixture-only dual carriers, never live dual-authoring of
production IDs. The spec's language keeps the two duplicate lines distinct: the extract-time
duplicate exclusion (what the fixture exercises) vs the graph-level referential checks behind it.
The binding test carries a **test anchor exactly as checkout's does**, so `has-verifier` is earned
in the graph — a green Vitest run alone earns no delivery fact. The `ready` statements are honest
only as a pair: the parent's own floor (complete behavior evidence, resolvable relations, no
blocking open questions) must clear before the child states `ready` — the §2 "design parent/child
readiness together" line is load-bearing here.
Spec-side edits redden the test — the drift alarm works for the Protocol's own specs. Wider
`implemented`/`has-verifier` facts come from the anchor retrofit (§2) — additive comments, no
behavior change.

## §5 — Sessions (progressive; a detailed design review closes each)

Session 1 is serial and ends with a **schema freeze** (envelope contract, heading map, narrative/
description shapes, extraction-root policy). The dependency graph after the freeze: **2 → 3 → 4's
integration tail**, serial (the tracer needs session 2's `ready` parent; check wiring, ledger, the
anti-misleading pass, and the whole-phase review depend on everything before them). The only
lawful concurrency is session 4's **renderer portion** (Design Review prose rendering — derived
code only, no pack membership edits), which may run beside 2/3 once the schema is frozen; both 2
and 4 add specs to the one pack manifest, so spec-and-pack edits stay in the serial line. Each
session ends with a **design review over the generated Design Review view**
wherever it can (self-hosting the review practice), findings folded back before the next session
hardens them.

1. **Session 1 — the root policy, the seam, the parser core, the first specs.** **First durable
   work (operative-record gate — before any Markdown-canonical ID):** rewrite MD-18's Decision
   paragraph in `docs/concept/DECISIONS.md`, update the `CONTEXT.md` resolved (MD-18) entry, and
   land the interim canonical sentence in `AGENTS.md` (see Context). Then: extraction
   root/exclude mechanism (path-prefix contract in §1.0); the two-seam public API
   (`CarrierReification` + `deriveGraph`); discovery; envelope (strict gate + reserved-
   property parity) + body (heading map) + prose rules + diagnostics; author the in-flight
   `carrier.*` specs (the forcing mini-corpus) + the pack; the repo self-build and validate green
   over them. **Internal order matters**: operative records → exclude mechanism + seams + a
   minimal fixture green first; freeze the schema shapes before authoring beyond the first couple
   of documents; the later session-1 specs are the first real pressure on the freeze — a needed
   change is a recorded ruling, never a silent map edit. *Review #1 agenda: root/exclude policy
   (path-prefix default) · public API shape (`CarrierReification` + `deriveGraph`, what stays
   internal) · envelope posture incl. the yaml dependency · narrative placement + schema-version
   ruling · array-section prose rule · heading map · dual-carrier diagnostic · the first authored
   documents read cold · MD-18 / CONTEXT / AGENTS interim rule consistent. Code-grounded checks:
   exclude threading end-to-end (extraction options → discovery → both CLI legs incl.
   `--check-clean`; path-prefix semantics pinned by test) · `CarrierReification` + `deriveGraph`
   on the package public surface · a Markdown fixture authoring `implemented`/`claim` is refused
   (reserved-property parity) · the self-build graph contains zero exploration/checkout nodes ·
   checkout goldens differ only on the recorded version-driven lines.*
2. **Session 2 — the corpus body + anchors.** The built-subsystem specs (extraction/validation
   domains, `model` kind, determinism constraint); anchor retrofit (precise entrypoint anchors);
   `implemented`/`has-verifier` derive; the dual-carrier duplicate test lands. **Budget the
   array-section prose ruling**: authoring constraint/rule content will likely fire the §1.5
   refusal — either author without free prose under array-shaped headings, or rule the minimal
   sub-owner then (the watch item firing under real pressure, as designed) — never stall
   mid-corpus on unruled prose policy. *Review #2: the corpus read as specs — is the carrier
   pleasant at `ready`? Parent/child readiness honesty.*
3. **Session 3 — the executable tracer (§4).** Example space, generated contracts, binding test
   green; optional one-line drift demo transcript. *Review #3: the executable loop.*
4. **Session 4 — decisions, rendering, repair.** The decision specs (incl. plain-language rule →
   `AGENTS.md` pointer; dissolution north star + its lean registry pointer); Design Review renders
   narrative + descriptions; the **anti-misleading doc pass** (fix only passages that actively
   mislead — the "TS DSL is the sole canonical authoring surface" claims in `docs/concept/00`,
   `04`, `07`, `docs/concept/README.md`, and any other concept files that still state sole-
   canonical TS, get the interim canonical sentence; cosmetic repair skipped, per the shrunk
   repair bill); `npm run check` gains the self-hosting build/validate/determinism legs in the
   **full clean-clone sequence** from §1.0 (reorder typecheck after build+generate; refresh the
   `AGENTS.md` gate row to match); refresh `AGENTS.md` **status** so it no longer says plan 17 is
   DRAFTED (stamp landed / EXECUTED); ledger (§6) updated. *Review #4: whole-phase review; decide
   phase 2.*

## §6 — Docket ledger (the tracking mechanism — update as sessions close)

Every item from the scheduled sessions (plan 16 §7) plus items this phase itself forced, tracked so
nothing silently drops. **Planned disposition** is what this plan intends; **execution state**
starts `pending` everywhere and is stamped (`done <session>` / `deferred <why>` / `dropped <why>`)
as sessions close — a disposition is never evidence of completion:

| Docket item (origin) | Planned disposition | Execution state |
|---|---|---|
| Frontmatter envelope schema (17) | Address — envelope contract spec + strict gate (§1.3) | done s1 — the bounded envelope and strict gate landed (todos 4–5, `5c33d2e`, `cf87a6b`); `spec:carrier.envelope-contract` authored and verified (todo 8, `aca7909`); the ownership posture dispositioned against the three-part test → the envelope-grammar ownership posture (MD-21) |
| Editor-association gap (17) | Defer — named gap stands | deferred — the named gap stands; nothing in this phase forced it |
| Fence names (17) | Address — ratify as-is unless forced (§3.6) | done s1–s3 — `gwt`/`gwt-vocabulary` ratified as-is from the exhibit; no authoring pain forced a change (three no-new-syntax gate dispositions; the tracer uses them verbatim, todo 15, `cfe1f67`) |
| Slot sigils (17) | Address — same | done s1–s3 — `{slot:type}` sigils adopted as-is; bound string values use quoted carrier syntax (todo 15); no ruling fired |
| Single-literal vocabulary form (17) | Watch — rule only if forced | dropped s1–s3 — the corpus never forced it; the watch item stands as a deferred syntax question |
| Table-sugar syntax (17) | Watch — rule only if forced | dropped s1–s3 — one example point bound without sugar (todo 15); the watch item stands |
| Prose edge-text ownership rule (17) | Address — §1.5 rulings (array-section sub-owner stays a watch item) | done s1 — the ownership rules landed with the parser and the graph prose slots (todos 5–6, `1a74fa8`); `spec:carrier.prose-ownership-rule` authored; the array-section sub-owner watch item never fired (the corpus/readiness gate's friction report) |
| Diagnostics register (17) | Address — §1.6 | done s1 — the four hard finding IDs and the exact diagnostic matrix landed, pinned by tests (todos 4–5); near-miss headings are intentionally hard (`extract/unrecognized-heading`) |
| Carrier seam public API (18) | Address — two-seam shape (§1.1) | done s1 — `CarrierReification`, both concrete reifiers, and the unchanged `deriveGraph` published at the package root (todo 3, `37e2845`) |
| Product parser (18) | Partially address — corpus-scoped; hardening baseline deferred and pinned as a non-claim | done s1 (corpus-scoped) — the bounded parser landed (todos 4–7); the like-for-like hardening baseline stays deferred and pinned as a non-claim |
| `sdp import` emitter (18) | Defer | deferred — `spec:carrier.sdp-import` honestly authored at `idea`; no emitter exists |
| checkout-v1 migration + canonical flip (18) | Defer — checkout-v1 stays TS-canonical; interim sentence + recorded amendment | deferred — the interim amendment landed first (todo 1, `af7bd38`); checkout stays TS-canonical; the migration and the default flip are unstarted |
| Self-hosting pack (19) | Start — first ~15 specs; grows next phases | done s1–s4 — exactly the frozen 15 specs plus `pack:self-hosting-v1` (todos 8 `aca7909`, 9 `d70f91e`, 11 `99bc103`, 15 `cfe1f67`, 19 `ba9f1f0`); growth rides later phases |
| Decision-spec fold (19) | Start — new decisions born as specs; back-catalog fold deferred | done s4 (started) — the two phase-1 decisions born as `decision`-kind specs (todo 19, `ba9f1f0`); the back-catalog fold stays deferred |
| Doc-repair bill (19) | Re-scope — anti-misleading pass + status note; per-doc deletion later phases | done s4 (re-scoped) — the anti-misleading pass repaired 30 active claims (todo 21, `82bf870`); the plan-16 §6 bill items dispositioned REPAIRED vs SUPERSEDED; per-doc deletion stays later-phase. The durable audit `check-carrier-truth.mjs` runs on demand — a deliberate non-wiring decision: consistency audits are not `npm run check` legs (the interim-check precedent) |
| Extraction-root & exclusion policy (new — forced by self-hosting) | Address — §1.0 ruling | done s1 — the strict path-prefix contract landed end to end (todo 2, `f6644de`); dispositioned against the three-part test → the strict consumer-exclusion contract (MD-20) |
| Graph schema-version policy for prose fields (new) | Address — §1.5 ruling | done s1 — schema `0.4.0` with fixed key positions (todo 6, `1a74fa8`); the checkout diff proved version-only lines |
| Carrier-ruling transition-clause amendment (new — forced by the interim story) | Address — MD-18 Decision text + CONTEXT resolved entry + AGENTS interim sentence (Session 1, before first MD-canonical ID) | done s1 — all three operative surfaces landed before the first Markdown-canonical ID (todo 1, `af7bd38`), pinned by `check-carrier-interim.mjs` |
| Public/package API proof (new — forced by grounded review) | Address — installed-tarball declaration + runtime smoke beside the source and built-entry tests | done s4 — installed-tarball declarations and runtime smoke passed (todo 23 Phase A, `6685a97`) |
| Temporal-scan coverage (new — forced by grounded review) | Address — the temporal guard covers tracked plus nonignored untracked durable files, genre exclusions retained | done s4 — fail-closed enumeration of tracked plus nonignored untracked durable files (todo 22, `897fb64`) |
| Root generated-state isolation (new — forced by grounded review) | Address — isolate repo-root generated state from parallel tests; a dependency-aware preflight lands before the tracer | done s2 — root generated state isolated from parallel tests; the dependency-aware preflight landed before the tracer (todo 14, `35620bf`; anchor-environment repair `cdb68fc`) |
| Clean-clone proof (new — forced by grounded review) | Address — clean-snapshot and authorized clean-clone runs of the full gate | done s4 — clean snapshot and `git clone --no-local` full-gate runs passed; dirty-worktree preservation proved (todo 23 Phase B, `6685a97`) |
| JTBD carrier repair (new — drift found by grounded review) | Address — the logical/physical relations distinction lands in JS-A1 with the interim-rule records; the remaining `.sdp.ts`-era carrier claims ride Session 4's anti-misleading pass | done s1+s4 — the JS-A1 logical/physical relations distinction landed with the interim records (todo 1, `af7bd38`); the remaining `.sdp.ts`-era JTBD claims repaired (todo 21, `82bf870`) |
| MD-15 wording repair (new — forced by the carrier ruling) | Address — the extension law's wording re-points to the `.sdp.md` sibling beside the carrier-ruling amendment (Session 1) | done s1 — the `.sdp.ts` extension law (MD-15) re-pointed to the `.sdp.md` sibling beside the carrier-ruling amendment (todo 1, `af7bd38`) |
| Four-gate review ledger (new — forced by the owner-gate design) | Address — a durable ledger of the four owner Design Review gates, filled as each gate accepts | done s4 — owner accepted Gate 4; the completed ledger below records the phase-2 disposition |

### The four-gate review ledger

Git process evidence, never a graph fact: the four owner Design Review gates are product
practice, not validators, and nothing in this ledger enters `graph.json`. The local owner
packets under the ignored evidence root remain the richer optional aids; this ledger is the
durable plan-level record, filled as each gate accepts. Gate 4 now records the owner's acceptance
and phase-2 disposition.

| Gate | Meaning | Owner disposition | Date | Accepted SHA | Corrections | Rulings |
|---|---|---|---|---|---|---|
| 1 | Session 1 — the schema freeze: the frozen initial Markdown carrier corpus (five `spec:carrier.*` documents and the five-member Pack) | accepted | 2026-07-18 (~03:35 local) | `aca79090529c2f6625ceafc78f33e16da81bfcb1` | none | No recorded ruling fired — the frozen grammar stood. The effort-branch designation (`feature/protocol-self-application-phase-1`) stood confirmed: the owner was directly offered the `self-hosting/v1` rename and did not request it. |
| 2 | Session 2 — corpus/readiness: the floor-honest 12-spec corpus and the 14 precise entrypoint anchors | accepted | 2026-07-18 (~05:30 local) | `cdb68fc1564c9167ebc0372ba8f8599a97df4393` | none | No-new-syntax disposition confirmed; no recorded ruling fired. |
| 3 | Session 3 — the executable loop: Markdown → graph → generated contracts → the bound real-extractor test | accepted | 2026-07-18 (~06:40 local) | `1687885df7b1898c56e154ce2dbe4fa3c6c6c425` | none | No-new-syntax disposition confirmed. Owner directive carried to the final verification wave (F2): assess the 5 npm audit advisories, separating runtime-dependency risk (`yaml@2.9.0`) from dev-chain risk (`vitest`/`vite-node`). |
| 4 | Session 4 — the whole-phase review and the phase-2 disposition | accepted | 2026-07-18 | `1d9f38c7a993f9cdc27cc4e178e211e33286758b` | 24f9978: docs(concept): record the landed prose projection in 06 | **Owner's phase-2 decision:** schedule the `sdp import` emitter, checkout-v1 migration, and canonical flip as one phase-2 effort, including the like-for-like parser-hardening baseline / C2-parity obligation; the table-sugar ruling is expected to fire under it. The editor-association gap stays deferred; revisit it after the flip. |

### Review-06 remediation reconciliation

The Gate-4 correction records the post-acceptance prose-projection repair at `24f9978`; it does
not alter the accepted SHA or owner disposition. The corresponding review artifact is tracked in
`reviews/06-self-hosting-phase-1-code-review.md` so the F1-F4 wave can inspect the same record on
a clean clone.

**Execution learning, todo 14 default-root substitution.** The shipped test retains a default-root
regeneration case and now guards it with a post-suite sentinel, rather than moving that case to a
disposable root as originally prescribed. `0ad4f44` restores regeneration and the sentinel, and
extends the dedicated single-fork split to filtered runs. `4ee6136` restores the build-prefixed
recovery commands and matching Vitest substring filters. This still meets the intended no-race and
idempotence contract. The substitution is recorded here as an execution learning, not as a silent
rewrite of the original design.

**F2 npm-audit disposition.** `npm audit` reports five development-chain advisories in Vitest and
Vite, with zero production vulnerabilities. `yaml@2.9.0` is not among the advisories.

**Sanctioned row-3 enrichment delta.** `spec:carrier.markdown-parser` gained `problem` and `value`
Intent bullets during todo-9 enrichment. It was born `scoped` and matured to `defined`; this is the
only non-byte-exact corpus row relative to the frozen table, intentionally retained because the
added evidence satisfies the `defined` floor.

**Back-catalog notes.** Authored decision specs use `spec:decisions.*`, while the DECISIONS registry
reserves `spec:protocol.decisions.*`; resolve that namespace divergence in the back-catalog fold,
not in phase 1. The `npm run check` chain now has a twelfth `preflight` leg beyond todo-22's frozen
eleven-leg order. This is a benign additive deviation, and `AGENTS.md` documents the current chain.

**Low and information observation dispositions.** The review labels this tail as 24 observations;
the compact grouping below retains every listed concern and its durable disposition.

| Observation group | Disposition | Record |
|---|---|---|
| Markdown reifier catch-all totality | deferred | Totality remains by construction; retain the TypeScript reifier's wrapper as the cross-carrier backstop. |
| YAML 1.2 scalar spellings | deferred | The current refusal-message classification is not phase-1 scope. |
| YAML parser line-number mismatch | deferred | Rebased finding lines are correct; native message wording is follow-up polish. |
| Frontmatter `...` document end | deferred | Acceptance before a later closer remains unpinned follow-up behavior. |
| Non-mapping-root accumulated findings | deferred | Preserve as parser diagnostic aggregation debt. |
| Depth and node cap finding flood | deferred | One-finding-per-offending-node behavior remains bounded by the cap. |
| GWT fence placement in Intent | deferred | Exact immediate-placement enforcement is future grammar hardening. |
| Heading trailing whitespace and trailing `#` titles | deferred | Preserve the current strict heading recognition pending grammar hardening. |
| Duplicate `When` reporting and dead `mapOwner` branch | deferred | Small parser cleanup belongs with a later grammar pass. |
| Windows absolute excludes and `--exclude --foo` diagnostics | pre-existing/phase-2 | Exclude UX refinements are outside phase-1 acceptance. |
| Path-prefix matcher coverage | deferred | Add a focused regression when exclusion handling is next changed. |
| Library-seam exclusion wording | deferred | Public library diagnostics can be separated from CLI wording later. |
| Indirect assembly of the `then` graph key | fixed-by-remediation | `cd735ae` names the key directly. |
| Design Review dynamic-key ordering | deferred | Re-parsed graph rendering determinism is a projection follow-up. |
| Design Review escaping outside prose slots | pre-existing/phase-2 | TS-carrier authored HTML policy needs a scoped rendering decision. |
| GWT, examples, flows, and example-space permutation coverage | fixed-by-remediation | `f8b26f5` adds byte-equality permutation coverage. |
| Model term named `description` | fixed-by-remediation | `fb6b973` refuses the collision rather than dropping it silently. |
| Row-3 enrichment delta | deferred | Sanctioned above as the intentional `scoped` to `defined` maturity record. |
| Bound example reports only a count | fixed-by-remediation | `4ee6136` asserts the distinct TypeScript and Markdown carrier files. |
| Fixture-to-live byte identity for rows 1, 2, 4, and 5 | fixed-by-remediation | `f8b26f5` pins the identities. |
| No-reparse spy coverage | deferred | Named-import interception remains weaker than an injected read seam. |
| Carrier-truth comment and temporal token assembly | deferred | The comment can be narrowed later; token assembly remains the sanctioned temporal-guard pattern. |
| Stale provenance wording and plan-16 evidence-only dispositions | pre-existing/phase-2 | The glossary wording and archived per-item evidence are back-catalog work. |
| Twelfth preflight leg and decision-spec namespace divergence | pre-existing/phase-2 | Both are recorded above: the chain delta is benign, and the namespace fold awaits phase 2. |

### Owner's phase-2 decision

This is a pointer for later planning, not phase-1 work. The owner scheduled the `sdp import`
emitter, checkout-v1 migration, and canonical flip as **one phase-2 effort**. That effort includes
the like-for-like parser-hardening baseline and C2-parity obligation; the table-sugar ruling is
expected to fire under it. The editor-association gap remains deferred and is revisited after the
flip.

### The §3 three-part-test dispositions

§3 flagged two rulings as likely `DECISIONS.md`-worthy. Each is dispositioned here against the
ADR three-part test (hard to reverse · surprising without context · a real trade-off); the
remaining §3 rulings stay in the corpus specs, the pinned tests, and this plan's running log
by deliberate omission — an omission recorded as a decision, never a default:

1. **The extraction-root & exclusion policy** (§1.0; landed in todo 2, `f6644de`) — **passes**:
   a public CLI/options surface consumers script against (hard to reverse); the consumer
   path-prefix rule beside the fixed basename tooling excludes reads as inconsistency without
   the scope-decision rationale (surprising without context); basename-anywhere was the live
   alternative, rejected so a future nested `src/examples/` is never silently skipped (a real
   trade-off). Entered the diary as **the strict consumer-exclusion contract (MD-20)**.
2. **The envelope-grammar ownership posture, including the exact `yaml@2.9.0` pin** (§1.3/§3.8;
   landed in todo 4, `5c33d2e`) — **passes**: the corpus is authored against the owned contract
   and consumers see its finding IDs (hard to reverse); owning the grammar while pinning one
   exact library version and mapping the AST/CST by hand is stricter than common practice
   (surprising without context); permissive parsing plus a semver range was rejected for
   bounded, deterministic, adversary-safe behavior (a real trade-off). Entered the diary as
   **the envelope-grammar ownership posture (MD-21)**.

## §7 — Verification

- `npm run check` green on the full clean-clone sequence from §1.0:
  `check:temporal` → lint → format:check → build → `generate:self-hosting` (repo root with
  `--exclude explorations --exclude examples`) → `generate:example` → typecheck →
  `typecheck:examples` → test → `check:self-hosting` (`--check-clean`) → `check:example` —
  self-hosting legs alongside, not replacing, checkout-v1 (no double counting). `generated/`
  stays untracked; determinism is regenerate-and-compare, never committed goldens.
- The executable tracer test green via the generated contract; the dual-carrier duplicate covered
  by a fixture test; the prose-ownership and envelope refusals covered by tests (the exhibit's
  subset-honesty posture, product-grade).
- Delivery facts derive (never authored): the anchored specs show `implemented`/`has-verifier` in
  the graph; the graph shows the honest mix of rungs.
- Existing test suite **green** — "untouched" is not claimed: goldens update only where the ruled
  schema/prose changes require (e.g. the schema-version line), each updated golden recorded in the
  session log. checkout-v1 regenerates deterministically; its content diff is empty except the
  recorded version-driven lines.
- House rules swept: ratified vocabulary only; no cryptic codes leading prose; every ruling made
  under fire is recorded, none silent.
