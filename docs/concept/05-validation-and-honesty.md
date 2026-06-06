# 05 — Validation & Honesty

Validation is what makes the graph trustworthy. It enforces the trust model from `01` and `03`: claims are checked, references resolve, ambiguity fails loudly, and inference never gets promoted by accident.

This document delineates the **MVP validator subset** sharply from the **aspirational** tiers, realising **P7** (shape vs completeness), **P8** (readiness is a checked claim), **L2** (ambiguity is loud), and **L3** (graceful partial extraction).

---

## 1. Layered enforcement by kind (the principle)

**Principle · partly CORE.** Correctness is split across layers *by kind* — types for shape, schema for payload structure, graph validators for cross-file semantic invariants, and (aspirationally) architecture rules for boundaries — rather than contorting any one layer (notably the type system) to carry all of it.

The *principle* is "don't make one mechanism do all the checking." The *number* of tiers and the per-tier tooling are Representation. The MVP uses the first three; the rest are aspirational.

| Tier | Checks | Status |
|---|---|---|
| 1 — Types | structural shape of `Spec` (all facets optional, branded IDs) | CORE |
| 2 — Schema | the graph JSON validates against its schema | CORE |
| 3 — Graph validators | cross-file semantic invariants (see §2) | CORE |
| 4 — Architecture rules | forbidden-dependency, layer boundaries, domain purity | ASPIRATIONAL |
| 5 — Custom team rules | project-specific `defineRule` policy | ASPIRATIONAL |

Types describe **shape**; validators decide **completeness** (P7). Completeness is *never* encoded in conditional types — that is what keeps the two axes free to move.

---

## 2. The MVP graph validators (CORE)

These are the non-negotiable core. CI fails on any error.

1. **Referential integrity.** Every ID referenced (in relations, bindings, markers) resolves to a node that exists. A dangling reference is an error — with a "did you mean…?" suggestion where possible. *(This is the cost of string-ID linkage from P6, paid down at build time.)*
2. **Duplicate-ID detection.** No two nodes share an ID. A duplicate is an error, never an auto-resolved merge (L2 — ambiguity is loud).
3. **Readiness-profile completeness.** Each readiness level has a profile of required facets/relations; a spec that *claims* a level but lacks what the level requires fails. **Readiness is a claim; validators verify the claim** (P8). See §3.
4. **Orphan detection.** A spec with no relations and nothing pointing at it is surfaced (warning or error per config) — it has fallen out of the graph's connective tissue.
5. **`verifies` linkage.** The bidirectional spec↔test trace resolves: a test marked `verifies: spec:X` must point at an existing spec, and an `executable`/`verified` spec must have at least one resolving test.

Two cross-cutting honesty rules apply to all validators:

- **Ambiguity fails (L2).** Conflicts — duplicate IDs, a marker that contradicts a declaration — are errors, never silent winners.
- **Partial failure stays local (L3).** A single bad spec produces a scoped error; it does not abort extraction or poison unrelated specs. The build reports every problem it can, rather than dying on the first.

---

## 3. Readiness profiles (CORE)

A profile says what completeness each readiness level demands. Profiles are the mechanism (Principle); the specific thresholds are config a team can override.

| Readiness | Profile (must have) |
|---|---|
| `sketch` | id, title, kind, abstraction; intent.outcome **or** a parent relation |
| `framed` | intent.outcome; at least one relation; one of behavior.rules / behavior.examples / constraints |
| `specified` | rules and/or examples; any quality constraint has a machine-readable `target`; no *blocking* open questions |
| `designed` | design.components and design.decisions; all relations resolve |
| `bound` | runtime or code bindings present; all binding IDs resolve |
| `executable` | verification mode is executable; verification.tests present and resolve |
| `verified` | a linked verifying spec/test exists and is enabled (structural); run verdict is CI-side, not ingested |

The MVP must enforce profiles **at least through `bound`** (and `executable`/`verified` where spec↔test discovery supports it; `verified` is *structural* — a verifying spec is present and enabled — never run-result ingestion). Higher levels degrade gracefully if their structural inputs are absent.

> **Claimed vs derived readiness.** The author *claims* a `readiness`; validators can also compute a *derived* readiness from what the spec actually contains. When they diverge (claimed `bound`, derived `framed`), that divergence is itself surfaced. The MVP can ship the claim-check (profile enforcement) and add the explicit derived-readiness banner as a small follow-up; the principle — *the claim is not trusted, it is verified* — holds either way.

---

## 4. Pack-level coherence (CORE-adjacent)

A `SpecPack` is validated for **coherence**, not member completeness: shared terms are defined, membership resolves, no member duplicates another's intent without a relation, no member depends on an undefined concept. This lets a team hold "a large coherent group of low-detail specs" without the build demanding implementation. Coherence-vs-completeness is a distinct check from the readiness profiles above.

---

## 5. Validator self-testing (CORE-adjacent)

A silently-passing validator hides a problem. Each validator should ship should-fail and should-pass fixtures so a regression that stops it from firing is itself caught. Cheap insurance; recommended even in the MVP.

---

## 6. Aspirational tiers (named, deferred)

Out of the MVP, designed-for:

- **Architecture enforcement (Tier 4).** Forbidden-dependency rules, domain-purity, single-direction-architecture, route-has-component — as *failing* validators. A whole competency (dependency-cruiser / ts-arch style). Cut because the MVP target is a small bounded context where these are not yet load-bearing.
- **Custom team rules (Tier 5).** Project-specific `defineRule` policy.
- **NFR-to-evidence checks** (`nfr-violated`: observed metric vs target). Requires the evidence overlay (`06`), which is aspirational. The *design-time* half — requiring a measurable `target` to claim `specified` — is in the MVP (it is a profile rule); the *runtime* half is deferred.
- **`--lenient` ratchet mode** to downgrade failures to warnings during adoption. Nice-to-have; the MVP can fail hard on a single clean bounded context.
- **Incremental builds / caching.** The MVP does a full rebuild each run (fine for <~50 specs). Any cache, when added, must remain regenerable and never authoritative (subordinate to P1/P3).

---

## 7. What CI guarantees at MVP

When `akg validate` passes on a PR, the team knows:

- every ID reference resolves; no duplicate IDs;
- every spec that *claims* a readiness *earns* it;
- every test↔spec trace is intact;
- no spec has silently fallen out of the graph;
- the graph is a clean, deterministic projection of the repo (`--check-clean`).

And when it fails, it fails **loudly and specifically** — a broken link or a false readiness claim blocks the merge. That is the honesty guarantee the whole system rests on.
</content>
