# Session 4 — Formalization: gap strategy + pre-grill folds (re-entry context)

> **Status: PLAN-ONLY · §3 EXECUTED 2026-06-10 (Fold-A · Fold-B · archive) · §2 still the parked
> direction.** This document exists to bootstrap context fast after a break — it is the formalized residue
> of a long design arc that hit the ceiling of what a chat thread can resolve ("no substrate to grow the
> decision → formalize"). Read §0 first; the rest is reference.
> **Date:** 2026-06-08 · folds executed 2026-06-10 · **Branch:** `feature/mvp-init` · **Repo state:**
> green; the pre-grill folds are committed (UL → lean glossary + rehome; R1/R2/R3 applied; MD-8/MD-9
> recorded; `plans/03` slimmed to six; reviews archived in `reviews/`). **Next: the grill** (§5 kickoff
> prompt; agenda `plans/03`).

---

## §0 — Re-entry in one screen

**Where the code is:** Slice 0 (the protocol as typed code) is built, green, and hardened (Wave A
done). No extractor, no graph, no engine yet.

**What happened this arc (after Wave A landed):**
1. A fresh **adversarial review** (run from a bespoke prompt with a 3-view structure) read the whole
   concept + code + plans and came back high-signal. Its findings were absorbed into tracked docs.
2. We studied **gen-1 (`@libar-dev/architect`)'s full formal-spec** as *evidence, not template*. The
   takeaway: gen-1 is proof that gen-2's specific rejections are correct (its FSM softened to advisory,
   its tag taxonomy was repeatedly amputated, its artifacts migrate-and-delete). Lineage confirmed; no
   patterns transferred.
3. We converged on **how to manage gen-2's own delivery in the gap** before the engine exists — see §2,
   the **crippled graph**.

**What's next:** ~~two scoped **fresh** fold sessions (§3)~~ **the folds and the archive are DONE
(2026-06-10, one fresh fold session)** → now the **grill** on the lean base + the six-item agenda
(`plans/03`). The grill runs cold, in a fresh session; its kickoff prompt is in §5.

**The one decision still genuinely open and yours:** how far the crippled graph goes, and exactly what
its two instances are (§2). Parked deliberately — it needs substrate to grow, not more chat.

---

## §1 — The frame we locked (the meta-discipline)

These are the operating rules the whole arc converged on. They govern every next step.

- **Typed code is the destination; markdown is temporary scaffold.** Decisions, specs, the UL — in the
  finished Protocol these are typed instances in the graph, rendered by projections. Every markdown doc
  here is a stand-in for substrate that doesn't exist yet. Don't over-invest in perfecting it.
- **Fold in fresh, scoped sessions — never in a loaded one.** Folding is real editing work; it deserves
  the same clean-context discipline as the grill and the review. The planning lives here; the execution
  goes to fresh sessions.
- **Chat has a ceiling.** When a decision "won't converge," it's the medium signalling it needs
  substrate. Formalize onto a floor the decision can stand on, rather than talking in a circle.
- **Lineage is evidence, not template.** gen-1 taught us the problem in production; we transfer *lessons*
  (what it got wrong / walked back), never its mechanisms.
- **Communicate in meaning, not codes.** The `D-this / H-that` handles are poor-man's node IDs — noise
  without a graph/projection to give them meaning. They are tolerable only inside a doc that defines them
  inline (see the ledger, §6). In prose, lead with meaning.

---

## §2 — Gap strategy: the crippled graph (LEANING DIRECTION — not designed)

**The problem this solves.** gen-2 should manage its own delivery, but it can't yet (no engine, and
forcing the engine to serve its own navel too early warps its design). gen-1 is off-limits (its patterns
would spill — its whole *shape* is the idioms gen-2 rejected). Classic PRDs are cut until MVP maturity.
So there is a real gap with no native tool in it.

**The leaning answer (yours, this arc): a crippled graph.**
- **Two instances**, both **local in the repo** — explicitly *not* "real production."
- A **release process + state-copy ("import production")** boundary between them.
- The graph is **deliberately crippled — designed minimal**, not the full MVP engine.

**Why it threads the needle.** It captures the dogfooding benefit *early* while the
release/state-copy boundary acts as a **firewall** against the engine bending to serve its own
self-hosting need. "Both local" keeps it free of real operational/stability burden. It is a form of
self-hosting, but *bounded and isolated*, which is what makes "early" safe.

**The downside to design against.** A broken/undesigned process. gen-1's instability came not from being
*small* but from being **undesigned** — "a small doc-generation experiment local to the repo, no
stability." The discipline here is the inverse: **design the cripple.** Bounded, intentional,
stable-within-its-limits — never an experiment left to sprawl.

**Open questions to grow on substrate (named, not answered — do NOT resolve in chat):**
- What *are* the two instances? (e.g. dogfood/meta-process vs. engine-dev; or a "production" snapshot vs.
  a working copy.)
- What exactly does "release / import production / state-copy" copy, and in which direction?
- How does this relate to the **AuthoredModel-vs-one-graph seam** (a grill decision) and to the
  self-hosting-timing rule ("don't move the process onto the graph too early")?
- What is the *minimal* engine slice that makes a crippled graph possible at all (extract → graph, no
  more)?

> This is parked at *direction altitude* on purpose. It needs the minimal engine substrate before it can
> be designed; designing it in prose would just reproduce the loop we exited.

---

## §3 — Pre-grill folds (consolidated inventory)

The grill must open onto **(a) a self-consistent base** and **(b) an agenda of only genuinely-open
decisions.** Today neither holds. Two fresh fold sessions fix that. (Naming note: these fold sessions are
**Fold-A / Fold-B** to avoid colliding with the *review's* findings F1–F7, which are different things —
see the ledger, §6.)

### Fold-A — the UL restructure — ✅ DONE 2026-06-10
*Executed as planned:* `ubiquitous-language.md` is now the lean glossary (terms · relations · worked
dialogue · flagged ambiguities · term ledger, with an old-§ map in the header); the exposition was rehomed
**into `00`–`07`** (the lean option won — measured overlap was ~95%, so rehoming was mostly dedup plus a few
genuine insertions: the discipline ≈ kind/section mapping into `06` §6, UML alignment + relation-granularity
rationale into `02` §6, many-packs membership into `02` §4); R1/R2 applied; every pointer re-aimed
(AGENTS.md, concept README, DECISIONS.md). Original scope kept below for the record.
The current `docs/concept/ubiquitous-language.md` is a **design-synthesis document wearing a UL hat** — an
artifact of the 8-hour grill that had to invent *and* name the model in one breath. A true Evans UL is
lean. Split the one doc into its three real concerns:
- **Glossary** (lean): `Term · Definition · Aliases-to-avoid`, grouped by concept area, + relationships +
  a worked dialogue + flagged ambiguities. The §0–§8 *terms* distilled to one-liners.
- **Design** (the exposition): rehome the §0–§8 model/rubric/principle reasoning. *Open judgment call:*
  into the existing `00`–`07` (dedup — leaner; they're already derived from it) **or** a new dedicated
  design-synthesis doc above `00`–`07`. Lean: into `00`–`07`. Confirm the real overlap first.
- **Rationale**: already `DECISIONS.md`.
- **Re-aim every pointer** that calls `ubiquitous-language.md` "the model + terminology, read first" —
  AGENTS.md nav table, README, cross-refs, and `plans/03`'s base-first method (model → `00`–`07`, terms →
  the lean glossary).
- **Absorb the two anchor/source wording reconciliations** along the way (they live in the §2/§4 you're
  rewriting): "anchor = identity only" vs "anchored = a binding" → unify to *binding assertion only*; and
  "no consumer reads source" → *links-into-the-graph OK, independent re-parse forbidden*.
- **Discipline:** this is **distillation + rehoming, not re-deciding.** Terms and model don't change —
  only where they live. So it does *not* need a grill, but it does need fresh, careful scope and a
  pointer-integrity pass.

### Fold-B — the resolvable-now sweep — ✅ DONE 2026-06-10
*Executed as planned:* `04` §2 reconciled to the binding-only `specTest` (R3 applied); the generic-anchor
shape and the open-questions home recorded **ACCEPTED** in `DECISIONS.md` (MD-8 / MD-9); `plans/03` slimmed
to the six genuinely-open decisions. Original scope kept below for the record.
Fold the already-determined items out of the grill's path:
- **Reconcile the `04` doc's `specTest` signature to binding-only** (no executing `run` callback; the
  code already conforms — doc fidelity fix).
- **Record the generic-anchor shape as decided**: generalize `anchorImplementation` into a `codeAnchor`
  over `impl` / `api` / `component`; sibling-builders alternative noted and rejected. (Execution rides
  the Slice-2 anchor work + the example's missing api-anchor.)
- **Record the open-questions home as decided**: the honesty check must read `intent.openQuestions` (not
  `design`/`decision`). Direction is determined; *execution stays Wave B* (it's a code change).
- **Slim `plans/03`** to the **six genuinely-open** decisions (§6 ledger): type-sections,
  prose-vs-ref-incl-examples, collapse-the-floor-validator, AuthoredModel-vs-graph, kind-aware-floor,
  `.spec.ts`-collision. Collapse the "resolvable-now" section to a one-line pointer.

### Optional — archive the artifacts — ✅ DONE 2026-06-10
All five scratch artifacts (both earlier reviews, the adversarial review + its prompt, the fold-session
prompt) moved into tracked **`reviews/`** with a README mapping each to where its durable findings landed.
The gen-1 study was chat-only; its takeaway is formalized in §0/§2 here.

### Then — the grill
A fresh `grill-with-docs` session on `plans/03`, now opening onto a lean base + a tight six-item agenda.
It resolves the genuinely-open decisions against the base, ratifies inline, and rewrites `plans/02`'s
Wave B execution-ready.

---

## §4 — Sequencing & done-criteria

1. ~~**Fold-A** (UL restructure)~~ — ✅ DONE 2026-06-10: lean glossary; exposition rehomed into `00`–`07`;
   pointers re-aimed; R1/R2 applied; nothing in the model changed, only relocated; repo coherent.
2. ~~**Fold-B** (resolvable-now sweep)~~ — ✅ DONE 2026-06-10: `04` reconciled (R3); MD-8/MD-9 recorded;
   `plans/03` down to six open decisions.
3. ~~**(optional) archive**~~ — ✅ DONE 2026-06-10: `reviews/` tracked.
4. **Grill** — fresh `grill-with-docs` on `plans/03`. ← **NEXT.** *Done when:* the six decisions resolved +
   recorded; base reconciled; `plans/02` Wave B execution-ready.
5. **Then** Wave B execution, and — gated on a minimal engine — the **crippled graph** (§2) graduates
   from direction to design.

> Fold-A precedes the grill for a real reason, not tidiness: the grill *edits the base* (typed sections →
> §2/§3; kind-aware floor → §6). If the model has already moved into `00`–`07`, the grill knows its edits
> land in the design docs, not the glossary. Restructure-first tells the grill *where to write*.

---

## §5 — Scoped session prompts (copy-paste to launch cold)

> The Fold-A / Fold-B prompts below were **executed 2026-06-10** and are kept for the record; the live one
> is the **grill kickoff**.

### Fold-A prompt — executed ✅
> Scoped doc-restructure, no model changes. Read `docs/concept/ubiquitous-language.md`, `00`–`07`,
> `README.md`, `AGENTS.md`, and `plans/03` + `plans/04`. The current `ubiquitous-language.md` is a
> design-synthesis doc wearing a UL hat; split it into a **lean Evans glossary** (Term · Definition ·
> Aliases-to-avoid, grouped, + relationships + a worked dialogue + flagged ambiguities) and **rehome the
> §0–§8 exposition into `00`–`07`** (dedup against them; decide consciously vs. a new design-synthesis
> doc). Re-aim every pointer that treats the UL doc as "the model, read first." While rewriting §2/§4,
> apply the two wording reconciliations (anchor = *binding assertion only*; consumers may *link to* graph
> source but not *re-parse* it). **Constraint: distillation + rehoming only — do not re-decide the model;
> terms and meanings stay identical, only their home changes.** End green: no dangling cross-references.

### Fold-B prompt — executed ✅
> Small, decision-free sweep. Read `plans/03`, `plans/04`, `docs/concept/DECISIONS.md`, and
> `docs/concept/04-authoring-and-binding.md`. (1) Reconcile the `04` doc's `specTest` description to a
> binding-only signature (no executing `run` callback — the code in `src/model/anchors.ts` already
> conforms). (2) In `DECISIONS.md`, record two items as **decided**: the generic-anchor DSL shape
> (`codeAnchor` over `impl`/`api`/`component`; siblings rejected) and the open-questions canonical home
> (`intent.openQuestions`; note execution stays Wave B in `plans/02`). (3) Slim `plans/03` to the six
> genuinely-open decisions and collapse its "resolvable-now" (§3a) to a one-line pointer.

### Grill kickoff (the folds are done — this is the live prompt)
> `grill-with-docs` on `plans/03` — six open decisions (D1 typed-sections · D2 prose-vs-ref incl.
> `examples` · D3 floor-validator collapse · D4 AuthoredModel-vs-graph · D7 kind-aware `defined` floor ·
> D8 `.spec.ts` collision), against the now-lean base (terms: the glossary; model: `00`–`07`). Ratify
> inline; record in `DECISIONS.md`; rewrite `plans/02` Wave B execution-ready.

---

## §6 — Decision ledger in meaning (so the codes resolve)

The antidote to code-noise: every handle, decoded. Two separate code-spaces — don't conflate them.

**Open decisions (the grill agenda after Fold-B):**

| Handle | Meaning | Home |
|---|---|---|
| **D1** | How much to *type* sections now (lean: type the five floor/extractor-bearing ones — intent, behavior, constraints, model, verification; leave design/decision/ui open). The linchpin. | grill |
| **D2** | The prose-vs-ref-list duality, across **both** `behavior.rules` and `behavior.examples`. Gates typing `behavior`. | grill |
| **D3** | Collapse the readiness-floor validator (clause-ids enumerated 4×; `authoredPaths` is decorative). Lean: table = single source of truth. | grill |
| **D4** | The `AuthoredModel` seam vs. the one graph — pre-graph lint that retires, or stays a documented lint? (Interacts with the crippled graph, §2.) | grill |
| **D7** | Make the `defined` floor **kind-aware** — today it forces behavior-rules onto decision/model/constraint specs, so the example *pads*. The review's top finding; shrinks the contract; de-pads the example. | grill |
| **D8** | The `.spec.ts` file-extension collides with the JS test-runner glob — adoption landmine. Keep-with-exclusion vs. a collision-free extension. Representation-level. | grill |

**Resolvable-now (folded out — all ✅ done 2026-06-10):**

| Handle | Meaning | Disposition |
|---|---|---|
| **R1** | Anchor "identity only" vs "a binding" → unified to *binding assertion only*. | ✅ applied in Fold-A (glossary, `01`, `04` §2) |
| **R2** | "No consumer reads source" → links-into-graph OK, independent re-parse forbidden. | ✅ applied in Fold-A (`01` P2, `03` §4) |
| **R3** | `04` doc's `specTest` → binding-only (no `run`); code already conforms. | ✅ applied in Fold-B (`04` §2) |
| **D6** | Generic-anchor shape → `codeAnchor` over impl/api/component. | ✅ recorded **MD-8**; exec Slice 2 (plan 02 H10) |
| **H2-dir** | Open-questions home = `intent.openQuestions`. | ✅ recorded **MD-9**; exec Wave B (plan 02 H2) |

**Wave B (in `plans/02`, decision-gated; execute after the grill):** H2 (open-questions home fix), H3
(`constraints` → array), H4 (section-ref referential integrity), H5 (trim floor validator), H10 (api
anchor in the example). Plus the carried review backlog: the `ref`-naming note, the aggregate-`family`
mislabel, and the `modelRefs`-must-be-`kind:"model"` check.

**Fold sessions:** **Fold-A** = UL restructure · **Fold-B** = resolvable-now sweep. *(These are NOT the
review's findings F1–F7 — that F-space is unrelated: review F1 = the kind-blind floor, now **D7**; F5 =
the examples duality, folded into **D2**; F6 = the `specTest` doc, now **R3**; F2/F3/F4 = the carried
backlog above; F7 = done in Wave A.)*

---

## §7 — Guardrails for the next sessions (what NOT to do)

- **Don't self-host too early / don't force the engine to serve its own process.** The crippled graph is
  bounded and isolated *for this reason*.
- **Don't rebuild gen-1.** A "capable scaffold" *is* gen-1 — a 15-doc formal spec with a churning
  taxonomy and an FSM. The scaffold stays a deliberate non-system.
- **Don't perfect the markdown.** It's temporary substrate; the graph replaces it. Lean glossary, not a
  beautiful one.
- **Don't grill the resolvable-now items.** They need ratification, not deliberation (Fold-B handles
  them). Putting a no-op in front of a grill is workflow-gating in miniature.
- **Don't fold in a loaded session.** Fresh + scoped, always.
- **Don't re-decide the model during Fold-A.** Distillation + rehoming only.
