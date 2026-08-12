# Plan 26 — Self-hosting completion: the native carrier everywhere

> **Status:** EXECUTING — native Packs, annotation completion, and readiness dispositions. **What
> this plan does:** finishes self-hosting implementation by ruling the Pack Markdown carrier
> (MD-25), migrating both authored Pack manifests, completing the remaining public-seam
> annotations, promoting the 24 floor-clear decision records under the decision-readiness
> posture (MD-26), and recording the frontier/element dispositions. Plans ≤ 25 are EXECUTED;
> PR #15 is merged. Corpus counts, readiness, and findings stay derived — re-run the named
> recipes rather than quoting this header.

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

Filled at close. Empty on EXECUTING.

### C5 stay-defined

| Spec | Why it stays defined |
|---|---|
| | |

### D1–D5 frontier and element dispositions

| Item | Disposition | Re-entry |
|---|---|---|
| | | |

### D6 element-demonstration matrix

Re-derive at close. Do not quote a cached census.

### Mutation-probe evidence

| Probe | Mutated value | Result | Restored |
|---|---|---|---|
| | | | |

### Per-commit check log

| Commit / phase | `npm run check` |
|---|---|
| | |

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
5. Drift/divergence (E1): recipe 2 returns the 8 recorded ids; recipe 7 returns the 14
   dispositioned divergence rows.
6. Full gate: `npm run check` green at every blessed commit and once from a clean worktree.
