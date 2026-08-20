# Plan 37 Brief J owner ratification bundle

Orchestration evidence only. The eight packets stay the evidence. This file doesn't ratify, recommend, or apply any prepared patch.

Every Spec below is still authored `defined`. Recipe 9 on each packet records floor `ready`, empty floor failures, `firstUnmetClause: null`, and `promotionRequiresHumanStatement: true`. Promotion is a human statement.

Pick `READY` or `DEFINED` per Spec. Leave the unused reading visible in the packet. Fill the decision table and the eight-line reply. Quote claims below are copied from the packets, not re-derived here.

## Provenance

Independent confirmation is taken from the senpi-task ledger's AdversarialVerify records. Task evidence paths are cited beside them. No verifier id is invented.

| Spec id | Packet | Independent verifier (ledger) | Confirmed status | Task evidence |
| --- | --- | --- | --- | --- |
| `spec:model.core-model` | `.omo/evidence/plan-37-j-packets/model/core-model.md` | `st_01a01afd` (`v1-t10-verify`) | `AdversarialVerify.verdict: confirmed` | `.omo/evidence/task-10-plan-37-settling-arc.md` |
| `spec:model.pack-aggregate` | `.omo/evidence/plan-37-j-packets/model/pack-aggregate.md` | `st_01a01afd` (`v1-t10-verify`) | `AdversarialVerify.verdict: confirmed` | `.omo/evidence/task-10-plan-37-settling-arc.md` |
| `spec:model.relations` | `.omo/evidence/plan-37-j-packets/model/relations.md` | `st_01a01afd` (`v1-t10-verify`) | `AdversarialVerify.verdict: confirmed` | `.omo/evidence/task-10-plan-37-settling-arc.md` |
| `spec:model.spec-sections` | `.omo/evidence/plan-37-j-packets/model/spec-sections.md` | `st_01a01afd` (`v1-t10-verify`) | `AdversarialVerify.verdict: confirmed` | `.omo/evidence/task-10-plan-37-settling-arc.md` |
| `spec:extraction.claim-taxonomy` | `.omo/evidence/plan-37-j-packets/extraction/claim-taxonomy.md` | `st_01a01afe` (`v1-t11-verify`) | `AdversarialVerify.verdict: confirmed` | `.omo/evidence/task-11-plan-37-settling-arc.md` |
| `spec:extraction.regenerability` | `.omo/evidence/plan-37-j-packets/extraction/regenerability.md` | `st_01a01afe` (`v1-t11-verify`) | `AdversarialVerify.verdict: confirmed` | `.omo/evidence/task-11-plan-37-settling-arc.md` |
| `spec:consumers.projections-model` | `.omo/evidence/plan-37-j-packets/consumers/projections-model.md` | `st_01a01b25` (`v2-t14-verify`) | `AdversarialVerify.confirmed: true` | `.omo/evidence/task-14-plan-37-settling-arc.md` |
| `spec:carrier.markdown-authoring` | `.omo/evidence/plan-37-j-packets/carrier/markdown-authoring.md` | `st_01a01b26` (`v2-t15-verify`) | `AdversarialVerify.confirmed: true` | `.omo/evidence/task-15-plan-37-settling-arc.md` |

## Decision table

Owner fills only the last two columns. Prepared-candidate text is the packet checkbox state as authored.

| Spec id | Packet | Stated / floor / human | Prepared candidate (as authored) | Owner decision | Reason / reference |
| --- | --- | --- | --- | --- | --- |
| `spec:model.core-model` | `model/core-model.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | Ready unchecked; Defined checked. Ready patch still shown. Owner fields pending; both readings remain visible. | `DEFINED` | Blocking enrichment-lifecycle question remains open. |
| `spec:model.pack-aggregate` | `model/pack-aggregate.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | Ready checked; Defined unchecked. Owner fields pending; proposed Ready reading is not a human promotion. | `READY` | No blocking Pack contract found. |
| `spec:model.relations` | `model/relations.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | Ready checked; Defined unchecked. Owner fields pending; proposed Ready reading is not a human promotion. | `READY` | Complete typed relation vocabulary; no blocker found. |
| `spec:model.spec-sections` | `model/spec-sections.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | Ready checked; Defined unchecked. Owner fields pending; proposed Ready reading is not a human promotion. | `READY` | Strongest packet; no blocker found. |
| `spec:extraction.claim-taxonomy` | `extraction/claim-taxonomy.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | Ready candidate checked; Defined unchecked. Owner decision pending; prepared candidate, not a ratification. | `READY` | Complete bounded claims glossary; no blocker found. |
| `spec:extraction.regenerability` | `extraction/regenerability.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | Ready unchecked (no primary patch). Defined candidate checked. Owner decision pending; blocking-reason candidate, not a ratification. | `DEFINED` | Quoted thresholds lack their measurement artifact. |
| `spec:consumers.projections-model` | `consumers/projections-model.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | No disposition selected. Both Ready and Defined alternatives prepared and marked UNAPPLIED. Owner decision pending; both readings remain live. | `DEFINED` | Impact-graph and measurement work remain unlanded; plan 35 explicitly retained `defined`. |
| `spec:carrier.markdown-authoring` | `carrier/markdown-authoring.md` | stated `defined`, floor `ready`, `promotionRequiresHumanStatement: true` | Ready candidate checked; Defined alternative unchecked. Owner fields pending; proposed Ready reading is not a human promotion. | `READY` | Complete invariant with carrier surface refined by children; no blocker found. |

## 1. `spec:model.core-model`

Packet: `.omo/evidence/plan-37-j-packets/model/core-model.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case**

- Packet: the authored model gives a complete core vocabulary (one enrichable Spec, envelope, kind, one-kind rule, altitude, readiness, delivery fact, direct realization) with three anchored implementation bindings.
- `specs/model/core-model.sdp.md:16`: `- **Spec** — The one authored truth-primitive, enriched in place without changing artifact type.`
- `specs/model/core-model.sdp.md:21-23`: readiness is the author-stated rung; delivery fact is never authored readiness; `implemented` follows a resolving implementation binding and never propagates through refinement.

**DEFINED / settle-first**

- Recorded blocker is the sibling enrichment-lifecycle open question, not this Spec's floor.
- `specs/model/enrichment-lifecycle.sdp.md:14-15`: `### Open questions` / `- [blocking] After implementation, which design-time detail stays in the Spec and which detail may be removed while preserving one durable home for each explanation?`
- Packet reopen: owner resolves that blocking question, or records why core-model can be ratified independently, then makes the human statement.

**Prepared candidate (as authored):** Ready unchecked, with the unapplied one-rung carrier/oracle diff still shown. Defined checked: keep `readiness: defined` because of the quoted blocking OQ. Owner/rater, decision, date, and ratification reference are pending.

**Owner decision:** `DEFINED`

**Reason / reference:** Blocking enrichment-lifecycle question remains open.

## 2. `spec:model.pack-aggregate`

Packet: `.omo/evidence/plan-37-j-packets/model/pack-aggregate.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case**

- Packet: one bounded purpose (group Specs for review without a second truth-bearing artifact) and a five-term glossary (aggregate, framing, membership, model references, refinement). Altitude is `story`.
- `specs/model/pack-aggregate.sdp.md:16`: `- **Pack** — An authored aggregate that groups related Specs for ideation and review while stating no system truth of its own.`
- `specs/model/pack-aggregate.sdp.md:18-20`: membership derives a belongsTo edge; modelRefs point at standalone model Specs; refinement is distinct from the Pack aggregate.

**DEFINED / settle-first**

- `none found` in the current Pack carrier or the cited plan evidence.
- Story altitude and empty verifier bindings are named as context, not blocking reasons.
- Packet leaves reopen to the checkpoint if the owner names a missing Pack contract and records its carrier or plan evidence.

**Prepared candidate (as authored):** Ready checked (unapplied one-rung carrier/oracle diff). Defined unchecked; alternative stays available if the owner identifies a concrete missing contract. Owner fields pending; the proposed Ready reading is not a human promotion.

**Owner decision:** `READY`

**Reason / reference:** No blocking Pack contract found.

## 3. `spec:model.relations`

Packet: `.omo/evidence/plan-37-j-packets/model/relations.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case**

- Packet: typed directed relation vocabulary (authored relation, refinement, dependency, constraint, decision, typed-dependency distinction, verification, supersession), anchored at `impl:protocol.spec-relations`.
- `specs/model/relations.sdp.md:15-19`: authored relation, `refines`, `dependsOn`, `constrainedBy`, `decidedBy`.
- `specs/model/relations.sdp.md:20-22`: `constrainedBy` and `decidedBy` stay separately queryable; `verifies` and `supersedes` are defined.

**DEFINED / settle-first**

- `none found` in the current carrier or cited plan evidence.
- Recipe-3 inbound rows are empty and this carrier has no `decidedBy`. Packet treats both as graph context, not an explicit unresolved question.
- Packet says reopen a Defined reading only with a newly recorded, quote-backed design question, missing worked example, or requested review.

**Prepared candidate (as authored):** Ready checked (unapplied one-rung carrier/oracle diff). Defined unchecked; alternative stays available if the owner identifies explicit blocking evidence. Owner fields pending; the proposed Ready reading is not a human promotion.

**Owner decision:** `READY`

**Reason / reference:** Complete typed relation vocabulary; no blocker found.

## 4. `spec:model.spec-sections`

Packet: `.omo/evidence/plan-37-j-packets/model/spec-sections.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case**

- Packet calls this the strongest of the four model packets: seven terms, four outbound `decidedBy` relations, two implementation bindings (sections and verifier semantics).
- `specs/model/spec-sections.sdp.md:20-23`: section, typing law, content-only section, promotion.
- `specs/model/spec-sections.sdp.md:24-26`: `verifies`, enabled verifier, verification mode (authored posture, never a stand-in for derived realization).

**DEFINED / settle-first**

- `none found` in the current carrier or cited plan evidence.
- Phrase `unsettled design and ui surfaces remain open bags` is recorded as the intentional typing law, not an unresolved question about this Spec.
- Packet says reopen Defined only with explicit, quote-backed blocking evidence from the owner or the carrier/plan record.

**Prepared candidate (as authored):** Ready checked (unapplied one-rung carrier/oracle diff). Defined unchecked; alternative stays available if the owner identifies explicit blocking evidence. Owner fields pending; the proposed Ready reading is not a human promotion.

**Owner decision:** `READY`

**Reason / reference:** Strongest packet; no blocker found.

## 5. `spec:extraction.claim-taxonomy`

Packet: `.omo/evidence/plan-37-j-packets/extraction/claim-taxonomy.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case**

- Packet: five-term claims glossary is complete enough for a human `ready` statement. `relationsIn: []` is used here as a bounded foundational glossary (no inbound Spec to reconcile).
- `specs/extraction/claim-taxonomy.sdp.md:15-17`: `declared` is authoritative intent; `anchored` is authoritative binding and carries no intent; `inferred` is advisory and never authoritative.
- `specs/extraction/claim-taxonomy.sdp.md:18-19`: claim inheritance retains the authored source's claim; delivery fact is a realization signal, never an authored claim or edge.

**DEFINED / settle-first**

- `none found` in this carrier and the supplied plan findings. Packet doesn't invent a blocking question.
- Same leaf fact is weaker as settle-first evidence: `relationsIn: []` shows no inbound refiner or downstream worked-example/consumer obligation, so it doesn't demonstrate usage breadth.
- Packet keeps that limitation visible and still records no settle-first carrier or plan line, because none was found.

**Prepared candidate (as authored):** Ready candidate checked (unapplied one-rung carrier/oracle diff). Defined unchecked: "no blocking reason found for this candidate; owner may instead retain `defined` deliberately." Owner decision pending; this is a prepared candidate, not a ratification.

**Owner decision:** `READY`

**Reason / reference:** Complete bounded claims glossary; no blocker found.

## 6. `spec:extraction.regenerability`

Packet: `.omo/evidence/plan-37-j-packets/extraction/regenerability.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case**

- Packet: disposable-rebuild invariant and consumer boundary are finished-design evidence for those rules.
- `specs/extraction/regenerability.sdp.md:15`: `- Generated artifacts are disposable: deleting them and rebuilding from the same committed repository produces the same bytes.`
- `specs/extraction/regenerability.sdp.md:16-17`: consumers read the graph or source links; the graph is a single JSON projection, with a graph database deferred until measured traversal pain.

**DEFINED / settle-first**

- Recorded blocker: approximate thresholds are conditional on measured evidence, and no measurement artifact is present in the supplied task-3 outputs or referenced corpus.
- `specs/extraction/regenerability.sdp.md:18`: `- Measured evidence from the self-hosting corpus keeps full rebuilds comfortable below roughly 50 Specs.`
- `specs/extraction/regenerability.sdp.md:19`: `- Measured evidence defers a graph database until the graph reaches roughly 10k+ nodes or traversal pain establishes a real need.` Packet reopen is that measurement artifact. The packet must not invent it.

**Prepared candidate (as authored):** Ready unchecked: no carrier/oracle patch is proposed as the primary candidate because the threshold evidence is not measured. Defined candidate checked, with the missing measurement artifact as the blocking reason for the approximate thresholds only. Owner decision pending; this is a blocking-reason candidate, not a ratification.

**Owner decision:** `DEFINED`

**Reason / reference:** Quoted thresholds lack their measurement artifact.

## 7. `spec:consumers.projections-model`

Packet: `.omo/evidence/plan-37-j-packets/consumers/projections-model.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case**

- Packet: two authored sections, an eleven-term model glossary, two anchored implementation bindings, seven consumer-child incoming `refines` relations. Evidence that the model is stated and connected, not a readiness decision.
- `specs/consumers/projections-model.sdp.md:16`: `- **projection** — A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.`
- `specs/consumers/projections-model.sdp.md:17` and `:20`: diagnostic publication posture publishes the honestly labelled view and returns the validation exit code; reader is the thin typed front door that persists nothing.

**DEFINED / settle-first**

- Recorded blockers in the packet: unlanded impact-graph substrate, measured-curation claim as prior comparison rather than runtime law, `verifiers: []`, and the sole outgoing decision `spec:decisions.mcp-deferred`.
- Plan-14 absence vs plan-35 deferral, kept distinct: `plans/14-carrier-competition.md` doesn't mention `spec:consumers.projections-model`, so plan 14 supplies no Spec-specific deferral quote. Actual Spec-specific history is plan 35. `.omo/evidence/task-14-plan-35-agent-surface-arc.md:107`: `` `spec:consumers.projections-model` stays at `defined` and untouched. This arc's own work did not make a maturity bump true. ``
- `specs/consumers/projections-model.sdp.md:19` and `:22`: impact graph is a separately derived code-structure surface never promoted into architecture; measured curation is "in a measured comparison." Past deferral is evidence to weigh, not a verdict.

**Prepared candidate (as authored):** No disposition is selected. Prepared Ready alternative is UNAPPLIED (`readiness: defined` to `readiness: ready`, plus matching oracle row). The Defined alternative is also UNAPPLIED (keep both current lines; recorded reason is the partially evidenced roadmap/process and measured vocabulary). Owner/rater pending; both `ready` and `defined` remain live readings.

**Owner decision:** `DEFINED`

**Reason / reference:** Impact-graph and measurement work remain unlanded; plan 35 explicitly retained `defined`.

## 8. `spec:carrier.markdown-authoring`

Packet: `.omo/evidence/plan-37-j-packets/carrier/markdown-authoring.md`

Stated `defined`. Floor `ready`. Promotion requires a human statement.

**READY case (law-lives-in-the-tree)**

- Packet: the parent states one complete invariant. Markdown and TypeScript use the same reification and graph-derivation path. Broader carrier surface is carried by refining children.
- `specs/carrier/markdown-authoring.sdp.md:15`: `- outcome: Author new Protocol Specs in Markdown without creating a second truth path.`
- `specs/carrier/markdown-authoring.sdp.md:18`: `- rule: Markdown and TypeScript carriers feed the same reification and graph-derivation path.` Anchored implementation: `impl:protocol.markdown-authoring` at `src/extract/markdown.ts:50`.

**DEFINED / settle-first, plus stub-parent reading**

- `None found:` neither the Markdown carrier nor the cited plan-37 evidence names an unresolved question, missing worked example, or requested review for this Spec.
- Stub-parent reading is kept as a judgment aid, not an invented blocker. Child `specs/carrier/gherkin-authoring.sdp.md:19` states one Feature per `.sdp.gherkin` file and a canonical carrier surface per Spec ID; the parent doesn't enumerate Markdown syntax, examples, or parity cases.
- Packet says reopen Defined only if the owner records a quote-backed missing Markdown contract/example or an unresolved carrier decision.

**Prepared candidate (as authored):** Ready candidate checked (unapplied one-rung carrier/oracle diff; oracle target named as the real row at `test/self-hosting-oracle/carrier.ts:7-12`). Defined alternative unchecked: retain `defined` only if the checkpoint records explicit blocking evidence; none is present in this packet. Owner fields pending; the proposed Ready reading is not a human promotion.

**Owner decision:** `READY`

**Reason / reference:** Complete invariant with carrier surface refined by children; no blocker found.

## Owner response template

Exactly eight lines. Replace `READY|DEFINED` and fill `<reason/reference>`.

```
spec:model.core-model: DEFINED — blocking enrichment-lifecycle question remains open
spec:model.pack-aggregate: READY — no blocking Pack contract found
spec:model.relations: READY — complete typed relation vocabulary; no blocker found
spec:model.spec-sections: READY — strongest packet; no blocker found
spec:extraction.claim-taxonomy: READY — complete bounded claims glossary; no blocker found
spec:extraction.regenerability: DEFINED — quoted thresholds lack their measurement artifact
spec:consumers.projections-model: DEFINED — impact-graph and measurement work remain unlanded; plan 35 explicitly retained defined
spec:carrier.markdown-authoring: READY — complete invariant with carrier surface refined by children; no blocker found
```

Ratified by the repository owner on 2026-08-20 with the statement `Ratify proposed set`.
