# Language-finalization brief — prep for the grill-with-docs session

> **Purpose:** prepare the *next* session, which runs **`grill-with-docs`** to finalize the ubiquitous language
> (step **2** of the `2 → 1` sequence: ratify language, then execute the cleanup). This brief is the agenda,
> the recommended answers, and the do/don't list — so the grill starts from a position, not a blank page.
> **Inputs to have open:** `plans/please-do-a-pedantic-tidy-dove.md` (locked decisions D1–D6, tensions A–F),
> `docs/concept/GLOSSARY.md` (the first-pass glossary), the concept docs, and this brief.
>
> **Three glossary drafts now seed the grill** — `docs/concept/GLOSSARY.md` (ours, mid), `UBIQUITOUS_LANGUAGE.md`
> (Codex, the fuller/richer draft), `UBIQUITOUS_LANGUAGE_GEMINI.md` (Gemini, the leanest). **Triangulate:** where
> all three agree, a term is high-confidence; where they diverge sits the real decision. The grill converges them
> into the single canonical `GLOSSARY.md`, then the other two are retired.

## How the session works (grill-with-docs)

- Relentless **one question at a time**; each comes with a *recommended answer*; wait for the call before moving on.
- Prefer **exploring the docs** to answer a question over asking it.
- **The glossary it maintains is `docs/concept/GLOSSARY.md`** — update it inline as terms resolve. Do **not**
  spin up a second `CONTEXT.md`; GLOSSARY.md *is* the context glossary. (One nuance: the skill says a glossary is
  "devoid of implementation detail." Here the domain *is* the system, so the glossary legitimately names typed
  mechanisms — don't strip those.)
- **Meta-design decisions** (about how *we* built Libar Omni — the event-sourcing framing, the `model→graph`
  reservation, naming "Spec") go to a **decision diary** (`docs/adr/` markdown or a `DECISIONS.md` — the plan's
  Follow-up). Offer an ADR only when it is **hard to reverse · surprising-without-context · a real trade-off.**
  Keep this separate from *in-system* decisions, which are `kind:"decision"` Specs — two different levels.

## What is settled vs open

- **Settled — do not reopen:** the structural decisions **D1–D6** and tensions **A–F** in the plan, and the
  canonical term choices already in GLOSSARY.md. The grill is **language, not redesign.** If a term change would
  force a structural change, *flag it as a new decision* — don't silently redo the model.
- **Open — the grill's job:** (1) the core-principle / event-sourcing framing; (2) mapping coined terms onto
  established software-delivery terminology where a precise standard term genuinely fits; (3) confirming the
  provisional terms; (4) the project name (likely deferred).

## The decision tree (resolve in this order — later items depend on earlier)

**1. Name the spine first (event-sourcing / CQRS framing).** Most other terms hang off this.
   - *Is "the graph" a projection / read model?* → **Yes.** Adopt CQRS "projection / read model" as the frame.
   - *Is git the "event store"? Are commits "domain events"?* → **Recommend: git is the event _log_ (history /
     audit), the repo-at-a-commit is _current state_, the graph is a _projection_.** It is the **snapshot**
     flavor, not fold-events-to-state — so prefer "git is the event log" over "event sourcing," which overclaims.
   - *Name the write side.* → **"canonical source / source of truth"** = the typed specs + code + markers.
   - Likely the first ADR: "Event-log, not event-sourcing — git is the log, the repo is the state."

**2. The primitive & its positioning.**
   - *"Spec" vs "Specification" vs a DDD term?* → **Keep "Spec"** (coined but unambiguous; DDD "aggregate" misleads).
   - *"abstraction" for intent-altitude — best word?* → **Keep `abstraction`; say "altitude" in prose; never
     "level."** Map values loosely to capability-based planning but **do not** adopt SAFe/PM ladder names.
   - *"readiness" for design maturity?* → **Keep `readiness`**; frame as a *Definition-of-Ready*-style authored claim.

**3. Delivery facts.** *Is "delivery fact" the right umbrella for `implemented`/`has-verifier`/`observed`?* →
   **Yes**; frame as derived *Definition-of-Done*-style signals. Confirm `has-verifier` (deliberately awkward so
   it can't be misread as "passing" — see GLOSSARY).

**4. Domain-model vocabulary.** Confirm the **`model` → only domain vocabulary; the read source is "the graph"**
   reservation (GLOSSARY). *Is a `pack` a "bounded context"?* → **No, not necessarily**: a **domain-abstraction
   Spec ≈ bounded context**; a **pack is a review/grouping aggregate** (may span or sub-slice a context).

**5. Relations, provenance, rules.**
   - Confirm `refines/dependsOn/constrainedBy/decidedBy/verifies/supersedes`; `belongsTo` derived; `satisfies`
     annotation; provenance `declared/annotation/inferred`; **marker** = the in-code thing, **annotation** = the
     edge class.
   - *Adopt "invariant"?* → **Yes** — use **invariant** for must-always-hold rules/constraints (precise, and
     aligns with established usage).

**6. Consumers & surfaces.**
   - *Adopt "context bundle" for the pushed design-review slice (D4)?* → **Yes** — "context bundle" is a good term.
   - *Name the interop ingest boundary (the "membrane")?* → **Adopt "anti-corruption layer" (ACL)** as the precise
     term; keep "membrane" as the friendly metaphor.
   - Confirm: projection · view · design-review projection · agent surface (D5) · MCP surface (D6) · handle ·
     curated graph vs mechanical substrate.

**7. Project name.** → **Likely defer** ("too early to take *architect*"). Record *criteria* (evokes the
   event-log/projection spine; not PM-flavored; room for the apps/Studio layer) and park it.

## Architect language harvest — adopt the nouns, reject the process verbs

**Adopt / align (good language):**

| Concept here | Established / Architect term | Call |
| --- | --- | --- |
| derived views | **projection / read model** (CQRS) | adopt — already used |
| typed source of truth | **canonical source of truth** (write model) | adopt |
| git history | **event log** | adopt (snapshot flavor — not "event sourcing") |
| domain grouping | **bounded context** (DDD) | map: domain-Spec ≈ bounded context |
| must-hold rule | **invariant** | adopt |
| pushed agent context | **context bundle** | adopt |
| interop ingest boundary | **anti-corruption layer** | adopt (membrane = metaphor) |
| realization signals | Definition of Ready / Definition of Done framing | borrow framing, keep `readiness` / delivery facts |

**Reject — imprint hazards (and *why*, so the grill doesn't drift back):**

| Architect term | Reject because | Use instead |
| --- | --- | --- |
| **pattern / pattern graph** | a different, organically-grown primitive; "pattern" is overloaded; prime imprint vector | **Spec** / **the graph** |
| **tag / gate tag** | the non-typesafe Gherkin/JSDoc mechanism | typed TS + **markers** (Gherkin is a *layer on top*) |
| **FSM status** (`candidate→roadmap→active→completed→deferred`) | PM/process state — Libar Omni is *not a PM tool* | **readiness** (authored maturity) + **derived delivery facts** |
| **ProcessGuard / scope-creep / session-FSM** | process gating | honesty/completeness **validators** (no process gate) |
| **spec evolution = delete-after-transfer** (ephemeral specs) | the migration-then-delete model Libar Omni inverts | **enrich-in-place**, persistent Spec, no migration |
| **design stub** (ephemeral scaffold) | ephemeral/promote semantics | if "stub" is reused for the phase-3 representation layer, **redefine as persistent representation** |
| **dual canonical source** (Gherkin + TS/AST) | two sources, one untyped | **TS-first, fully typesafe**; Gherkin/HTML/etc. are layers |
| **annotations-primary** state | not type-safe | typed TS specs primary; markers/decorators a **typed extension** |

*Further mining (only if a term needs grounding):* `08-spec-evolution` (the bad-pattern source), `10-pattern-graph`
(graph vocabulary), `12-live-documentation-api` (projection/API vocabulary), `03`/`04` (tag system — reject).

## Watch-outs

- **Over-jargon:** don't force a DDD/CQRS term where a coined word is clearer. *Proper > fancy.* The test is
  "does the standard term carry the exact meaning?" — if not, keep the coined one and say why.
- **Imprint creep:** if an Architect term feels "obviously right," check the reject table first.
- **Two levels:** keep *in-system* vocabulary (Spec, kind, readiness…) separate from *meta-design* decisions
  (how we built this). The grill is mostly about the former; the decision diary captures the latter.
- **Language ≠ redesign:** D1–D6 / A–F are closed. A term that implies a model change is a *new decision* to
  surface, not a quiet edit.

## Outputs of the session

- **`docs/concept/GLOSSARY.md`** — ratified and extended inline (the canonical term source the cleanup applies).
- **Decision diary** (`docs/adr/` or `DECISIONS.md`) — the few hard-to-reverse calls (event-log framing,
  `model→graph`, "Spec", anti-corruption-layer), each recapturing the *why*.
- A short **rename map** (old term → ratified term) is a useful by-product — it becomes the execution checklist
  for step **1** (the cleanup), and the verification greps key off it.
