# Session 4 — Formalization: gap strategy + pre-grill folds (re-entry context)

> **Status: §3 (folds) and §4 (grill) ✅ EXECUTED 2026-06-10 · §2 (the crippled graph) still the parked
> direction — the one genuinely open item here.** This document was the formalized residue of a long design
> arc; its executed scaffolding has been folded down (outcomes live in `DECISIONS.md`, `plans/03`'s
> resolution table, and `reviews/`). What remains: the re-entry summary, the operating frame, and the parked
> gap strategy. **Branch:** `feature/mvp-init` · **Next: Slice 1 (the extractor)** — Wave B executed
> 2026-06-10 (`plans/02` §4) — then, gated on a minimal engine, the crippled graph (§2).

---

## §0 — Re-entry in one screen

**Where the code is:** Slice 0 (the protocol as typed code) is built, green, and hardened (Waves A and
B done). No extractor, no graph, no engine yet.

**What happened this arc:** a fresh adversarial review (high-signal; archived `reviews/04`) → the gen-1
(`@libar-dev/architect`) formal-spec study (*evidence, not template*: gen-1 is proof gen-2's rejections are
correct — its FSM softened to advisory, its tag taxonomy repeatedly amputated, its artifacts
migrate-and-delete; no patterns transferred; chat-only, formalized here) → the pre-grill folds (lean
glossary, R1–R3, MD-8/MD-9) → the grill (MD-10…MD-15; base reconciled; `plans/02` Wave B execution-ready).

**What's next:** **Slice 1 — the extractor** (Wave B executed 2026-06-10; `plans/02` is its
done-record), then — on the minimal engine's substrate — the crippled graph (§2).

**The one decision still genuinely open and yours:** how far the crippled graph goes, and exactly what its
two instances are (§2). Parked deliberately — it needs substrate to grow, not more chat.

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
  inline. In prose, lead with meaning.

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
- How does this relate to the **one-validation-path rule** (MD-14) and to the self-hosting-timing rule
  ("don't move the process onto the graph too early")? Note: MD-14 already makes the *minimal* engine
  slice — extract → graph, no more — sufficient for self-validation, exactly what this strategy needs.

> This is parked at *direction altitude* on purpose. It needs the minimal engine substrate before it can
> be designed; designing it in prose would just reproduce the loop we exited.

---

## §3 — Pre-grill folds — ✅ DONE 2026-06-10

Executed as planned, in fresh scoped sessions. **Fold-A** (UL restructure): `ubiquitous-language.md` became
the lean Evans glossary; the §0–§8 model exposition rehomed into `00`–`07` (~95% measured overlap — mostly
dedup); R1/R2 applied; every pointer re-aimed. **Fold-B** (resolvable-now sweep): `04` §2 reconciled to
binding-only `specTest` (R3); MD-8/MD-9 recorded; `plans/03` slimmed to the six open decisions. **Archive:**
the five scratch artifacts moved into tracked `reviews/` (see its README); the gen-1 study was chat-only,
formalized in §0/§2 here. *(Naming note: Fold-A/Fold-B are fold sessions — **not** the review's findings
F1–F7; see §6.)*

## §4 — Sequencing — ✅ DONE through the grill

Fold-A → Fold-B → archive → **grill** all executed 2026-06-10 (grill outcome: MD-10…MD-15; base reconciled;
`plans/02` Wave B rewritten execution-ready; H7 leftovers finalized) → **Wave B executed ✅ (2026-06-10)**.
**Next: Slice 1 (the extractor)** — on its substrate the crippled graph (§2) graduates from direction
to design.

## §5 — Scoped session prompts (Fold-A · Fold-B · the grill kickoff)

This section held the copy-paste prompts that launched each cold session; all three were executed
2026-06-10 and the prompt texts removed. The fold-session prompt is archived verbatim as
`reviews/05-plan-finalization-prompt.md`; the grill's outcome is `plans/03`'s resolution table.

---

## §6 — Decoder (so historical codes resolve)

Two separate code-spaces — don't conflate them. **Open decisions D1–D8** (all resolved): the resolution table
is `plans/03`'s header; rationale in `DECISIONS.md` MD-10…MD-15. **Resolvable-now** (all folded out): R1/R2/R3
+ MD-8 (`codeAnchor`, exec Slice 2) + MD-9 (`intent.openQuestions`, exec Wave B) in `DECISIONS.md`.
**Fold-A / Fold-B** = the fold sessions (§3). **The review's F-space is unrelated to all of these:** F1 = the
kind-blind floor → D7/MD-12 · F5 = the examples duality → D2/MD-10 · F6 = the `specTest` doc → R3 ·
F2/F3/F4 = the carried backlog (`plans/02` §4) · F7 = done in Wave A.

---

## §7 — Guardrails for the next sessions (what NOT to do)

- **Don't self-host too early / don't force the engine to serve its own process.** The crippled graph is
  bounded and isolated *for this reason*.
- **Don't rebuild gen-1.** A "capable scaffold" *is* gen-1 — a 15-doc formal spec with a churning
  taxonomy and an FSM. The scaffold stays a deliberate non-system.
- **Don't perfect the markdown.** It's temporary substrate; the graph replaces it. Lean glossary, not a
  beautiful one.
