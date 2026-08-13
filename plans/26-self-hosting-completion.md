# Plan 26 — Self-hosting completion: the native carrier everywhere

> **Status:** ✅ EXECUTED 2026-08-13 — the Pack syntax ruling (MD-25) made Markdown the native
> carrier for Specs and Packs; both authored Pack manifests migrated, remaining public seams
> gained honest anchors, the decision-readiness posture (MD-26) promoted the 24 registry-ratified
> decisions without manufacturing delivery work, and every format element now has an in-corpus
> specimen or an explicit honest-absence disposition. Re-measured close: 133 Specs, 1 Pack, 258
> nodes, 483 edges, 124 anchors, 115 ready / 14 defined / 1 scoped / 3 idea, zero findings, zero
> operational backlog, and 53/53 ready examples verifier-backed. Re-run the named recipes rather
> than inheriting these close measurements.

## Context

Ask: complete self-hosting so the native `.sdp.md` carrier is the authoring surface at every
maturity rung, every public seam is annotated, and the corpus demonstrates every element of
the format that has an honest in-corpus specimen.

Measured at planning (via `pnpm --silent sdp:q`): 129 Specs (87 ready · 37 defined · 1 scoped ·
4 idea), 1 Pack, 248 nodes, 466 edges, zero findings, zero operational backlog, 53/53 ready
examples verified. The remaining gaps:

1. The two Pack manifests are the last non-native authored artifacts. Plan 18 deferred the
   syntax ruling until a real need forced it; this plan is that ruling.
2. 24 decision Specs are registry-ratified and floor-clear but stated `defined`. Promoting
   them without the MD-26 exemptions floods recipe 1 and the `honesty/gaps` warn signal.
3. Two public seams carry no anchor (`src/cli/q-command.ts`, `src/adapters/vitest.ts`);
   `spec:extraction.build-pipeline` has a verified example child but no implementation binding.
4. Element demonstration gaps: `design` and `ui` sections unused; `supersedes`, `observed`,
   and `inferred` have no authored specimen.
5. Four frontier Specs sit blocked on design questions (impact-graph, intent-composition,
   runtime-overlay, enrichment-lifecycle). This plan defers them with recorded re-entry
   triggers — no design sessions.

Owner decisions at planning: rule the Pack carrier and migrate now; promote the 24 decisions
with per-item review (the C3 table is the review surface — plan approval states the human
readiness for every listed row; any struck row moves to the stay-defined ledger).

## Approach

Ordered for a green tree after each phase. Every blessed commit runs `npm run check`. After
A6 the Pack manifest is Markdown; every new Spec ID enters it in the same commit that
births it.

### Phase 0 — build record

0.1. This file, plus the `AGENTS.md` status blockquote naming plan 26 EXECUTING. The
     handbook carrier sentence stays on the MD-18 wording until A7.

### Phase A — the Pack syntax ruling (MD-25) and native Packs

A1. Author `spec:decisions.pack-markdown-carrier` born-ready, `refines:
    spec:decisions.carrier-ruling`. Registry row MD-25 ("the Pack syntax ruling").
A2. Rewrite `spec:carrier.markdown-pack-authoring` to `defined`: drop the blocking question;
    carry the five ruled behavior rules; keep a `design` section as the first honest
    specimen; add the example space and two defined example children (parity + refusal).
A3. Engine: `reifyMarkdownPack` on the existing `ReifiedPack` shape; branch
    `reifyMarkdownCarrier` on the envelope id namespace; parameterize the closed envelope
    key set. Anchor `impl:protocol.markdown-pack-authoring`.
A4. Generate contracts; bind `test/self-hosting-pack-markdown.test.ts`; mutation-probe both
    assertions; register the suite.
A5. State the parent `ready` after recipe 9. This plan's approval is the human statement.
A6. Migrate both Pack manifests to `.sdp.md`; `git rm` the TS twins; update the membership
    oracle, the self-hosting graph file expectation, and the checkout README. Regenerate
    views in the same commit.
A7. Ripple the completed MD-18 sentence across the live surfaces and
    `check-carrier-truth.mjs` pins. Leave the MD-18 decision record, `plans/`, `reviews/`,
    and the `CHECKOUT_HISTORY` pin untouched.
A8. Reword import rationales that claim "packs stay TS by ruling"; finding ids unchanged.
A9. Add an "Authoring a Pack" paragraph to `sdp-authoring`.

### Phase B — annotation completion

B1. Bind `impl:protocol.build-pipeline-query` on `src/cli/q-command.ts` and
    `impl:protocol.build-pipeline-emit` on `src/cli/build-command.ts`, both satisfying
    `spec:extraction.build-pipeline`.
B2. Bind `impl:protocol.example-runner-adapter` on `src/adapters/vitest.ts`, satisfying
    `spec:extraction.example-runner`.
B3. Add a `ui` section to `spec:consumers.design-review` if the content is honest; otherwise
    record the absence in the close record.

### Phase C — readiness dispositions

C1. Exempt `specKind === "decision"` from `checkGaps`. Both-directions tests.
C2. Author `spec:decisions.decision-readiness-posture` (MD-26) born-ready. Amend recipe 1
    and its live copies: exclude kind `decision`; report `excludedReadyDecisions`.
C3. Promote the 24 decision Specs `defined → ready` (table below). Land C1–C3 in one commit.
C4. Promote `spec:extraction.build-pipeline` after B1; recipe 9 first.
C5. Stay-defined ledger (close record only): the eight standing drift rows plus
    `protocol-domain`, `edit-model`, `validator-self-testing`, `protocol.self-hosting`.

### Phase D — frontier and element dispositions

Recorded in the close record. No carrier edits except the dispositions named here.

D1. `spec:consumers.impact-graph` — deferred; re-entry: a second machine consumer needing
    symbol-level reach, or Studio/MCP work.
D2. `spec:consumers.intent-composition` — deferred; re-entry: a realizing surface exists.
D3. `spec:observation.runtime-overlay` — deferred; re-entry: an adopter with a telemetry
    boundary offering the observation identity/freshness answer.
D4. `spec:model.enrichment-lifecycle` — stays scoped; re-entry: a third enrichment datum or
    recurring authoring friction.
D5. Element-absence record: `supersedes` awaits the first real replacement; `observed` is
    aspirational with D3; `inferred` waits on D1; `ui` per the B3 outcome.
D6. Element-demonstration matrix, re-derived by query at close.

### Phase E — close

E1. Re-measure: recipe 1 returns zero backlog, 53 excluded ready examples (none without
    verifier), 26 excluded ready decisions; recipe 2 returns the same 8 drift ids; recipe 7
    returns only the 14 dispositioned divergence rows; corpus 133 Specs · 1 Pack.
E2. `AGENTS.md` highest-plan pointer → plan 26 EXECUTED.
E3. Stamp this plan EXECUTED; fill the ledgers below.
E4. Final `npm run check` from a clean worktree.

## C3 review table

Plan approval states human readiness for every listed row. Struck rows stay `defined` and
join the C5 ledger.

| Spec | Registry |
|---|---|
| `spec:decisions.executable-meta-model` | MD-1 |
| `spec:decisions.adopt-the-nouns` | MD-2 |
| `spec:decisions.one-primitive` | MD-4 |
| `spec:decisions.protocol-naming` | MD-5 |
| `spec:decisions.binding-not-liveness` | MD-7 |
| `spec:decisions.content-only-sections` | MD-10 |
| `spec:decisions.typing-law` | MD-11 |
| `spec:decisions.kind-conditional-floor` | MD-12 |
| `spec:decisions.one-validation-path` | MD-14 |
| `spec:decisions.sdp-ts-extension` | MD-15 |
| `spec:decisions.carried-evidence` | MD-16 |
| `spec:decisions.point-per-example` | MD-17 |
| `spec:decisions.carrier-ruling` | MD-18 |
| `spec:decisions.prose-ownership` | MD-19 |
| `spec:decisions.exclusion-contract` | MD-20 |
| `spec:decisions.envelope-grammar-posture` | MD-21 |
| `spec:decisions.agent-front-door` | MD-22 |
| `spec:decisions.verification-posture-not-realization` | MD-23 |
| `spec:decisions.example-realization-posture` | MD-24 |
| `spec:decisions.plain-language-references` | pointer list |
| `spec:decisions.concept-docs-dissolve` | pointer list |
| `spec:decisions.pack-reified` | pointer list / D3 |
| `spec:decisions.agent-surface-scripts-graph` | pointer list / D5 |
| `spec:decisions.mcp-deferred` | pointer list / D6 |

No rows struck at approval.

## Disposition ledgers

Re-derived from the graph at close; no row inherits a prior verdict.

### C5 stay-defined

| Spec | Why it stays defined |
|---|---|
| `spec:carrier.markdown-authoring` | Carrier umbrella with one implementation binding and no direct verifier; its refining laws carry the executable evidence. |
| `spec:consumers.projections-model` | Consumer-vocabulary umbrella with one projection binding and no direct verifier. |
| `spec:extraction.claim-taxonomy` | Model vocabulary with one enum binding and no direct witness; a cleared floor is not a human `ready` statement. |
| `spec:extraction.regenerability` | One `runBuild` binding and no direct verifier; the determinism test targets the constraint parent. |
| `spec:model.core-model` | Root vocabulary with two bindings and no direct verifier; it remains deliberately conservative. |
| `spec:model.pack-aggregate` | Aggregate vocabulary with one Pack binding and no direct verifier. |
| `spec:model.relations` | Relation vocabulary with one builder binding and no direct verifier. |
| `spec:model.spec-sections` | Section umbrella with two bindings and no direct verifier; refining Specs carry the witnesses. |
| `spec:model.protocol-domain` | Conceptual dependency with no implementation or verifier binding. |
| `spec:consumers.edit-model` | The intent → agent → git law is settled, but the realizing composer remains deferred; no binding or verifier exists. |
| `spec:validation.validator-self-testing` | Testing posture with no direct binding or verifier; existing validator suites do not bind this Spec. |
| `spec:protocol.self-hosting` | Root self-hosting umbrella with no direct binding or verifier; its refining Specs carry realization. |

### D1–D5 frontier and element dispositions

| Item | Disposition | Re-entry |
|---|---|---|
| `spec:consumers.impact-graph` | Deferred at `idea`; language-neutral symbol identity remains unresolved. | A second machine consumer needs symbol-level reach, or Studio/MCP work begins. |
| `spec:consumers.intent-composition` | Deferred at `idea`; the in-view composer is not a realized surface. | A realizing composition surface exists. |
| `spec:observation.runtime-overlay` | Deferred at `idea`; observation identity and freshness remain unanswered. | An adopter supplies a telemetry boundary that can answer both. |
| `spec:model.enrichment-lifecycle` | Stays `scoped`; the new `design` specimen is only the second enrichment datum. | A third datum or recurring authoring friction appears. |
| `supersedes` | Honest absence. MD-15 was re-pointed and MD-25 refines MD-18; neither replaces prior truth. | The first real in-corpus replacement. |
| `observed` | Honest absence with the deferred runtime overlay. | D3 re-entry. |
| `inferred` | Honest absence; its first producer remains the deferred impact graph. | D1 re-entry. |
| `ui` | Demonstrated on `spec:consumers.design-review` with the emitted index, Spec-page, and Pack-page anatomy. | — |

### D6 element-demonstration matrix

| Element | Measured demonstration |
|---|---|
| Spec kinds | 8/8: behavior · constraint · contract · decision · example · model · rule · workflow |
| Altitudes | 3/3: epic · feature · story |
| Readiness rungs | 4/4 in both self-hosting and checkout: idea · scoped · defined · ready |
| Sections | 8/8: intent · behavior · constraints · model · design · decision · verification · ui |
| Declared edge types | 6/7: `belongsTo` plus five Spec relations; `supersedes` is dispositioned above |
| Anchor flavors | 3/3: `impl:` · `test:` · `oracle:` |
| Delivery facts | 2/3: `implemented` · `has-verifier`; `observed` is dispositioned above |
| Claims | 2/3: `declared` · `anchored`; `inferred` is dispositioned above |
| Carrier/posture specimens | Markdown Spec and Pack carriers; decision records, verifier-backed executable examples, plain lower-rung Specs, and unimplemented Specs all present; the TS carrier remains exercised as the lawful parity option |

### Mutation-probe evidence

| Probe | Mutated value | Result | Restored |
|---|---|---|---|
| Markdown ↔ TypeScript Pack parity | TypeScript framing changed to `Mutated Pack parity point.` | Bound parity example failed on the Pack node framing difference. | Yes; focused suite green. |
| Pack-envelope refusal | Expected finding changed to `extract/unrecognized-property-mutated` | Bound refusal example failed against the actual `extract/unrecognized-property`. | Yes; focused suite green. |

### Per-commit check log

| Commit / phase | `npm run check` |
|---|---|
| `4bd645d` — Phase 0/A native Packs | Green: 49 unit files plus 55 self-hosting contract tests and every repository gate. |
| `418851c` — Phase B annotation completion | Green: 49 unit files plus 55 self-hosting contract tests and every repository gate. |
| `a1d36d9` — Phase C readiness posture | Green: 49 unit files plus 55 self-hosting contract tests and every repository gate. |

## Verification

1. Native Pack (A6): the self-hosting Pack node's `file` is
   `specs/self-hosting.pack.sdp.md`; title/framing/modelRefs match the pre-migration node;
   `belongsTo` edge count equals the post-A6 corpus. Checkout Pack file is
   `specs/checkout.pack.sdp.md`.
2. Parity and refusal (A4): `test/self-hosting-pack-markdown.test.ts` green; both mutation
   probes redden before restoration.
3. Backlog posture (C2): amended recipe 1 returns `{backlog: [], excludedReadyExamples: 53,
   excludedWithoutVerifier: [], excludedReadyDecisions: 26}`.
4. No new warnings after C3: `report.findings.length === 0`.
5. Drift/divergence (E1): recipe 2 returns the 8 recorded ids. Recipe 7 correctly returns `[]`
   because its contract detects overstated readiness. The complementary non-example upward-
   divergence query returns the 14 dispositioned rows: the 12 C5 rows plus `impact-graph` and
   `intent-composition`; the two defined example children are intentionally excluded from that
   disposition census.
6. Full gate: `npm run check` green at every blessed commit and once from a clean worktree.
