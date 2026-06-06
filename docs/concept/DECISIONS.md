# Decision diary — Libar Omni (meta-design)

> A why-focused log of hard-to-reverse decisions about **building Omni itself** — distinct from *in-system*
> decision records (a project's own `kind:"decision"` instances). Its job is to **recapture rationale** so choices
> stay visible and don't re-smooth into "false settledness." Entries are short and **status-tagged**
> (`ACCEPTED` / `PROPOSED` / `SUPERSEDED`). Companion to `docs/concept/ubiquitous-language.md` (the language base).

---

## 2026-06-06 — Session: reframe + language base

### MD-1 — Omni is an executable, self-validating software-delivery meta-model  [ACCEPTED]
**Decision.** We are building a *typed, executable meta-model of the software-delivery process*: teams author
delivery intent as **instances** of process primitives; the meta-model (code in the repo) deterministically
validates their **conformance and honesty** and derives **one graph**; every other artifact is a **projection**.
The headline is an **executable, self-validating delivery process — not just executable specs.**
**Two permanent honesty guardrails** (these are what keep it from re-becoming the gating we rejected):
1. It governs **conformance & honesty**, never **content-quality** (design goodness = human/agent judgment) and
   never **workflow** (no lifecycle gates — the RUP/FSM trap).
2. We claim **"deterministically validated,"** never **"provably correct."**
**Why / alternatives rejected.** "Executable specs" alone (BDD) is unremarkable; RUP modeled the process but only
*descriptively*; PM tools (Jira/Linear) have process *state* but no *meta-model*. The executable, governing
meta-model is the differentiator. Hard to reverse (everything builds on it); confirmed by the user this session.

### MD-2 — Governing language rubric: adopt the nouns, reject the process state-machine  [ACCEPTED]
**Decision.** Use the established delivery **noun** for any concept Omni shares with the industry; coin/keep a
distinct word only for a real differentiator (and then it must *name the difference*). Reject process
**state-machine / lifecycle gating** vocabulary. Every term faces two tests: carries epistemic status where it
matters (authored vs derived), and is unambiguous to all three readers (typed code/CLI · coding agent · Studio
user).
**Why.** The system spans a **commercial** user-facing product (Libar Studio: Desktop/Web/CI-CD) *and* the
AI-native engine; users must not relearn delivery vocabulary. This **reverses** the prior brief's "not a PM tool /
don't adopt PM ladder names" stance (see scope note).

### MD-3 — Three meta-levels; Phase 0 of the MVP = the process primitives as code  [ACCEPTED]
**Decision.** Keep three clean levels: **process meta-model** (code, *governs*) → **authored model** (a project's
instances, *governed*) → **derived facts** (machine truth, never authored). **Phase 0 of the MVP is building the
process primitives as code.** Self-hosting (Omni's repo governed by its own meta-model) is a later milestone.
**Why.** Not a detour: the extractor, the graph schema, and every validator already presuppose the meta-model
exists as code. Formalizing it first *is* the foundation. (RUP/UMA/MOF lineage, made executable.)

### MD-4 — One authored primitive; familiar delivery nouns are named coordinates  [ACCEPTED · names parked]
**Decision.** One **authored** primitive (enrich-in-place; never migrated to another artifact type), positioned by
**three descriptors**: **category of truth** (`kind`) is a *true subtype* (changes required detail + validation);
**altitude/size** and **maturity** are *positions*. Familiar nouns are **named coordinates, not separate authored
types**: Decision Record / Use Case / NFR / Contract / Model = `kind`; Epic / Feature / Story = altitude;
"Executable Spec" = an example-kind instance with a verifier. They are first-class in the **language and Studio
surfaces**, never separate primitives.
**Why.** Preserves "one primitive" (the differentiation) while honoring "adopt the nouns" — and avoids the
combinatorial explosion of a subclass per (category × size × maturity) cell. Names deferred per method.

### MD-5 — Candidate framing: "(executable) software delivery protocol" for the meta layer  [PROPOSED]
**Proposal.** Frame/name the meta layer as a **software delivery protocol** — *"not any kind of protocol, it is
software"* (executable, a reference implementation that *is* the contract).
**Why it's attractive.** A *protocol* is a **conformance contract, not a workflow** — precisely what MD-1
guardrail 1 governs; arguably **more honest than "process,"** which carries the workflow connotation we reject.
**Open tensions.** "Protocol" also connotes comms/wire formats (HTTP); "process" is the *recognized* industry noun
(MD-2 bias). May also feed the **system name**. **Status: under review — recorded to be reviewable.**

### MD-6 — `Spec` named; descriptor values locked; bounded-context becomes a projection (reverses part of MD-4)  [ACCEPTED]
**Decision.** The primitive is named **`Spec`**. Its three descriptors lock to (lowercase literals + recognized
display labels): **`kind`** — 8-value discriminated union {`behavior`, `workflow`, `example`, `rule`,
`constraint`, `model`, `decision`, `contract`} (NFR = a *flavor* of `constraint`; Scenario = an `example`);
**`altitude`** *(field renamed from `abstraction`)* — `epic → feature → story`; **`readiness`** —
`idea → scoped → defined → ready` (`ready` carries a **readiness floor**; `scoped` echoes locked `scoped intent`).
**Reversal of MD-4.** A **bounded-context / domain** and a **`capability`** are **no longer altitudes** — `epic`
is the altitude ceiling; both are realized as **groupings (packs) + a Capability Map projection**. Above-Epic
(initiative / theme) defers, additive later.
**Why.** Keeps the altitude ladder to the universally-recognized agile trio; removes the `Scenario` (altitude vs
kind) and `capability` double-uses; gives one lowercase-literal convention across all three descriptors; drops
`candidate` (an FSM-status imprint) from readiness.

### Scope note — relationship to the prior plan & brief
The reframe **partially supersedes** `plans/language-finalization-brief.md`: its "Omni is **not** a PM tool; do
**not** adopt SAFe/PM ladder names" stance is **reversed** by MD-2 (commercial Studio + adopt-the-nouns). The
structural decisions **D1–D6** and the cleanup plan (`plans/please-do-a-pedantic-tidy-dove.md`) **largely still
hold**, now reframed under the meta-model (MD-1/MD-3). The first-draft `docs/concept/GLOSSARY.md` and the two
`UBIQUITOUS_LANGUAGE_*.md` are **inputs**, not authority; the canonical base is now
`docs/concept/ubiquitous-language.md`.
