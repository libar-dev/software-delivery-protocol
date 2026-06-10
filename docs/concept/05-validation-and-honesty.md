# 05 — Validation & Honesty

Validation is what makes the graph trustworthy. It is the deterministic machinery that makes the protocol **self-validating**: the meta-model defines a **conformance contract**, a project's authored instances **conform** to it (conformance *checked* — an error fails CI — but the *process* is never *workflow-gated*), and the checks verify that conformance — references resolve, ambiguity fails loudly, claims are honest, and nothing derived is faked by hand.

This document delineates the **MVP validator subset** sharply from the **aspirational** tiers, realising **P7** (shape vs completeness), **P8** (readiness is stated and checked against a floor), **L2** (ambiguity is loud), and **L3** (graceful partial extraction).

> "Conformance" here means conformance to the typed meta-model. It is distinct from a spec's own implementation tier, for which use CORE / ASPIRATIONAL. Two permanent honesty guardrails bound what these checks claim: (a) they police **conformance & honesty**, never content-quality (design goodness is human/agent judgment) and never workflow (no lifecycle gates); (b) the result is **"deterministically validated," never "provably correct"** — conformance to the typed meta-model is provable; real-world correctness of the design is not.

---

## 1. The two check families (the principle)

**Principle · CORE.** Every check belongs to one of two families. Leading with these — rather than with a count of "tiers" — is what keeps validation honest: it polices *well-formedness* and *non-pretending*, never *quality* or *workflow*.

| Family | Asks | Examples |
|---|---|---|
| **conformance checks** | "is this *well-formed* against the meta-model?" | referential integrity (every ID resolves) · `claim` separation never collapsed · node/edge typing valid · grouping **coherence** (members + `modelRefs` resolve; no duplicate members) · **ambiguity-is-loud** (duplicate IDs / true conflicts fail, never auto-resolve) |
| **honesty checks** | "is this *not pretending* to be something it isn't?" | **authoring-shape honesty** (no hand-authored `satisfies` / `anchored` / `inferred` / delivery facts) · **honest readiness** (a *stated* rung is structurally earned) |

The **honesty** family is the real differentiator: most tools do only conformance; the "not faking derived truth" layer is what makes the graph trustworthy for agents and humans alike.

An **error fails the build**; a **gap informs**. This is the one sense in which the checks "gate": a conformance **error fails CI** — a build gate on well-formedness, which is the whole point of the checks — but the delivery *process* is never **workflow-gated** (no lifecycle, phase, or readiness-progression gates). "Checked, never gated" refers to the latter. A **`validator`** is one individual deterministic check (the boring, correct industry noun); validators group into the two families above. A **`gap`** is a surfaced absence (e.g. a `ready` spec with no verifier) — informative, never a gate. An **`orphan`** is a spec with no relations and nothing pointing at it — informative.

### How it's enforced — layered by mechanism (secondary)

*Which mechanism* runs each check is a Representation, not the lead. Correctness is split across layers *by kind* — types for shape, schema for payload structure, graph validators for cross-file semantic invariants, and (aspirationally) architecture rules for boundaries — rather than contorting any one layer (notably the type system) to carry all of it. The *number* of layers and the per-layer tooling are Representation.

| Layer | Checks | Status |
|---|---|---|
| Types | structural shape of `Spec` (all sections optional, branded IDs; floor-bearing sections closed-typed — the typing law, `02` §3 / MD-11) | CORE |
| Schema | the graph JSON validates against its schema | CORE |
| Graph validators | cross-file conformance + honesty invariants (§2) | CORE |
| Architecture rules | forbidden-dependency, layer boundaries, domain purity | ASPIRATIONAL |
| Custom team rules | project-specific `defineRule` policy | ASPIRATIONAL |

Types describe **shape**; validators decide **completeness** (P7). Completeness is *never* encoded in conditional types — that is what keeps the descriptors free to move.

---

## 2. The MVP graph validators (CORE)

These are the non-negotiable core. CI fails on any error. They split across the two families.

**They run over the one graph — there is exactly one validation path** (MD-14): source → extract (static reification, P5) → graph → checks; `sdp validate` is `sdp build` + checks, and `validateGraph` is the sole validation seam. Validating any *evaluated* form (importing spec modules and checking the resulting objects) would check a phantom — a non-static expression evaluates to a value on import but is dropped by static reification, so the checks could pass a spec the graph doesn't actually hold. For the same reason there is no pre-graph validation seam of any kind: a check that reads anything but the derived graph is a second validation path, forbidden. Authoring-time feedback is the type system's job (typed sections, `02` §3) plus the `sdp/spec-static` lint — not a parallel validator path.

**Conformance checks:**

1. **Referential integrity.** Every ID referenced (in relations, `modelRefs`, anchors) resolves to a node that exists. A dangling reference is an error — with a "did you mean…?" suggestion where possible. *(This is the cost of string-ID linkage from P6, paid down at build time.)*
2. **Duplicate-ID detection.** No two nodes share an ID. A duplicate is an error, never an auto-resolved merge (L2 — ambiguity is loud).
3. **`claim` separation never collapsed.** A `declared` edge is never silently "satisfied" by an `inferred` one; node/edge typing stays valid and distinct (`03`, `04`) — `nodeType` / `claim` / the edge-contract rows, and the three descriptors (`specKind` · `altitude` · `readiness`) carry their ratified values. The floor is never evaluated over an unratified descriptor (fail closed, never a crash or a silent skip). The edge-contract rows include the kind-typed endpoints (`03` §1): `constrainedBy` → a `rule`/`constraint`-kind spec (`02` §6's "a rule / NFR / policy spec") · `decidedBy` → a `decision`-kind spec · `supersedes` only between `decision`-kind specs; the declared-`verifies`-from-an-example row stays check 4's informative warning (a wrong-kind verifier confers nothing rather than failing the build).
4. **`verifies` linkage.** The bidirectional spec↔test trace resolves: a test anchored `verifies: spec:X` must point at an existing spec.

**Honesty checks:**

5. **Authoring-shape honesty.** No spec or pack file hand-authors a derived edge or fact — `satisfies`, an `anchored` edge, an `inferred` edge, or any delivery fact (`implemented` / `has-verifier` / `observed`). Those are the machine's to derive; authoring one is a violation.
6. **Derived-facts honesty.** A `Primitive` node's stated delivery facts equal what the one derivation rule recomputes from the graph's resolving binding edges. Extractor output holds by construction; the check has teeth for any other graph producer — a stated fact no binding earns (including `observed`, which nothing derives yet) is authored derived truth, and an omitted fact corrupts the backlog/drift queries. The gap check (9) reads the recomputed facts, so a faked fact never silences it.
7. **Honest readiness (the readiness floor).** A spec that *states* a readiness rung but lacks the structure that rung requires fails. **Readiness is stated by the author; validators verify the stated rung against the floor** (P8). See §3.

**Informative (a `gap` or `orphan`, not an error by default):**

8. **Orphan detection.** A spec with no relations and nothing pointing at it is surfaced (warning or error per config) — it has fallen out of the graph's connective tissue.
9. **Readiness/delivery gaps.** A `ready` spec with no resolving verifier is a surfaced `gap` (the build backlog and drift-alarm queries, `02` §2), not an error.

Two cross-cutting honesty rules apply to all validators:

- **Ambiguity fails (L2).** Conflicts — duplicate IDs, an anchor that contradicts a declaration — are errors, never silent winners.
- **Partial failure stays local (L3).** A single bad spec produces a scoped error; it does not abort extraction or poison unrelated specs. The build reports every problem it can, rather than dying on the first.

---

## 3. Readiness floors (CORE)

A **readiness floor** is the **minimum structural requirement to *state* a readiness rung** — a floor to clear, **never a quota to fill or a score** (significance governs detail — no tier-filling; `01`, P4 corollary). The floors are the mechanism (Principle); the specific thresholds are config a team can override.

The floor has two parts: **kind-blind structural clauses** (the same for every kind) and **one evidence clause that is kind-conditional** (MD-12) — `kind` is a true subtype, and the floor is where that changes what is required, in both directions (it can *relax* as well as add).

| Readiness | Kind-blind structural clauses (every kind) |
|---|---|
| `idea` | id, title, kind, altitude; `intent.outcome` **or** a parent relation |
| `scoped` | `intent.outcome`; at least one relation; **the kind's evidence is *present*** (table below) |
| `defined` | **the kind's evidence is *complete*** (table below); no *blocking* open questions (`intent.openQuestions` — the open-questions home, MD-9) |
| `ready` | the `defined` floor **and**: no blocking open questions; all relations resolve; every `dependsOn`/`refines` target is itself **≥ `defined`**; any anchors present *resolve* (so `implemented` is *derivable*) |

**The per-kind evidence table.** Each kind names its **natural evidence**; `scoped` requires it *present* (prose acceptable), `defined` requires it *complete* where the kind defines a stronger form. There is no separate overlay mechanism — this table is the whole kind-aware story:

| `kind` | `scoped` — evidence present | `defined` — evidence complete |
|---|---|---|
| `behavior` / `workflow` | rules / examples / flows / constraints — inline, **or promoted** (a refining `rule`/`example` child, or a `constrainedBy` target) | rules and/or examples (inline or promoted children); constraints alone no longer suffice |
| `rule` | its statement in `behavior.rules` | same — a rule's content *is* its statement |
| `example` | an examples entry (prose fine) | ≥ 1 **structured** `{ given, when, then }` entry |
| `constraint` | `constraints[]` non-empty | every entry has a machine-readable `target` |
| `model` | `model.terms` non-empty | same — a vocabulary either has terms or it doesn't |
| `decision` | `decision` section present (context / alternatives may precede the choice) | `decision.decision` — the chosen option — is written |
| `contract` *(interim)* | as `behavior` (examples read naturally as sample payloads) | as `behavior` — **named deferral:** when a dedicated contract section lands, the typing law (`02` §3) pulls it in and this row repoints to it |

Three laws bound the table:

- **Monotonic by construction.** Every `defined` cell implies its `scoped` cell — clearing the higher rung always clears the lower. (The pre-MD-12 floor failed this for `constraint`: its natural evidence stopped counting between `scoped` and `defined`.)
- **Promotion-neutral.** Promoted forms count wherever one exists (`02` §3) — de-composing a spec into children never costs it its earned rung. The converse honesty bound (MD-16): a promoted form counts **only when it itself carries its kind's evidence** — promotion *moves content out* (`02` §3), so an empty stub child, or a `constrainedBy` edge that does not resolve to a `constraint`-kind spec carrying its constraints, is not evidence.
- **Convergence is honest.** Where the rungs converge (`rule`, `model`), the floor refuses to become a quota ("more terms," "more rules" — the tier-filling P4 forbids); those rungs then differ only by the author's stated confidence plus the kind-blind clauses.

> **Representation note (MD-13).** In code, the floor *table* is the single source of truth: rows carry the clause id, description, and a named predicate; the evaluator is one generic loop and the clause-id type is derived from the table. The tables above and the data in `readiness-floor.ts` are intended to be reviewable as mirror images.

**The `ready` floor is earned, not asserted** — and it is **not** a delivery fact. The floor may require that anchors *resolve* (so `implemented` is *derivable*); it **never** requires the spec to *be* `implemented`. Readiness is a *stated position* about the design; delivery facts are observations about the code (`02` §2). Higher floors degrade gracefully if their structural inputs are absent.

**`ready` is the structural floor plus a human's `declared` statement — not a record that a review occurred.** The Design Review (`06` §5) is *where* a human typically decides, but the graph stores **no** review/approval fact, and the validator never checks one — that would be the workflow-gating the honesty guardrail forbids (§1). Where approval provenance matters — a baseline — it is **git-native** (authorship + a signed tag, `03`), not an authored primitive (approval / RBAC stays outside the model, `07`).

> **Stated vs derived readiness.** The author *states* a `readiness`; the same floor table also yields a *derived* readiness — the highest rung whose cumulative clauses pass. Both ship in the MVP: the floor check fails a stated rung the structure does not earn, and the Design Review renders stated beside the floor reached, naming the first unmet clause (the evaluator reports which clause fails). The divergence banner fires only in the dishonest direction — derived *at-or-above* stated is ordinary information, because the floor is a floor, never a quota that nags upward. The principle: *the stated rung is not trusted, it is verified.* (Note the verb: readiness is **stated/asserted**, never "claimed" — "claim" is reserved for the `claim` taxonomy in `04`.)

---

## 4. Pack-level coherence (CORE-adjacent)

A `Pack` is validated for **coherence**, not member completeness, and **deterministically only**: referenced terms and `modelRefs` resolve, membership resolves, no duplicate member IDs. There is **no** "duplicated intent" check — a `Pack` states no truth of its own (only a plain `framing` note, `02` §4), so there is nothing to duplicate; semantic duplication is a human/agent judgment, not a validator's. This lets a team hold "a large coherent group of low-detail specs" without the build demanding implementation. Coherence-vs-completeness is a distinct check from the readiness floors above.

---

## 5. Validator self-testing (CORE-adjacent)

A silently-passing validator hides a problem. Each validator should ship should-fail and should-pass fixtures so a regression that stops it from firing is itself caught. Cheap insurance; recommended even in the MVP.

---

## 6. Aspirational tiers (named, deferred)

Out of the MVP, designed-for:

- **Architecture enforcement.** Forbidden-dependency rules, domain-purity, single-direction-architecture, route-has-component — as *failing* validators. A whole competency (dependency-cruiser / ts-arch style). Cut because the MVP target is a small bounded context where these are not yet load-bearing.
- **Custom team rules.** Project-specific `defineRule` policy.
- **NFR-to-`observed` checks** (`nfr-violated`: an `observed` metric vs the stated `target`). Requires the runtime-observation path that produces the `observed` delivery fact (`06`), which is aspirational. The *design-time* half — requiring a measurable `target` to state `defined` — is in the MVP (it is a floor rule); the *runtime* half is deferred.
- **`--lenient` ratchet mode** to downgrade failures to warnings during adoption. Nice-to-have; the MVP can fail hard on a single clean bounded context.
- **Incremental builds / caching.** The MVP does a full rebuild each run (fine at MVP scale). Any cache, when added, must remain regenerable and never authoritative (subordinate to P1/P3).

---

## 7. What CI guarantees at MVP

When `sdp validate` passes on a PR, the team knows:

- every ID reference resolves; no duplicate IDs;
- every spec **states a readiness floor it earns** — and nothing hand-authors a derived edge or delivery fact (authoring-shape honesty);
- every test↔spec trace is intact;
- no spec has silently fallen out of the graph;
- the graph is a clean, deterministic projection of the repo — a fresh rebuild matches (`--check-clean`).

And when it fails, it fails **loudly and specifically** — a broken link or a stated readiness the spec has not earned blocks the merge. That conformance + honesty guarantee is the honesty the whole system rests on.
