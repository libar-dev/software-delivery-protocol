# Task 8 baseline — Inter-decision dependsOn tranche and decidedBy fills

Evidence-only Manual-QA proof. No carrier, test, plan, Boulder, ledger, or product edits in this step.
Branch: `feature/architectural-patterns-views` @ `723bf95c9975303cef5896c8b97f454e1786a3aa`
Captured: `2026-08-21T01:42:02Z` (queries re-run through `~01:45Z`)
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`

`CONTEXT.md` (ratified glossary) was read before naming terms. Law for this tranche was read graph-first from
`spec:decisions.planning-truths-placement` (MD-33) and
`spec:decisions.architectural-significance-rides-primitives` (MD-34). Carrier prose for every candidate
source/target was taken from live `g.specContext` (decision/intent sections), not from session paraphrase.

Scope of this slice: **this evidence file only**. No commit, no push. Shared oracle rosters remain task 15.

## Plan unit (task 8)

Author frontmatter relations:

- **12 candidate inter-decision `dependsOn` edges** (exact list below), each surviving the plan's
  **"genuinely needs the other"** bar (MD-34: `dependsOn` reserved for genuine semantic need;
  MD-33: scheduling-flavored edges refused; independence = absence of edge).
- **6 inbound `decidedBy` fills** from subject Specs to shaping decisions.
- **No `supersedes`.** No ceremonial edges. Drop survivors that fail the bar and record why here
  (plan also names `.omo/evidence/task-8-architectural-patterns-views.md` as a drop log; this baseline
  is the characterization home under the architectural-patterns-views evidence dir).

Acceptance (plan): validate exits 0; inter-decision `dependsOn` count is **measured** (up to 15 =
pre-existing + todo-2's two MD-34 edges + accepted tranche), never a hardcoded final quota.

## Law pins (graph-first)

### MD-33 — `spec:decisions.planning-truths-placement`

- Title: "Planning truths live in ruled graph homes"
- Stated+derived readiness: `ready`
- Decision head (live): work-item dependency truth rides `dependsOn`, **independence is absence of
  the edge**, **scheduling phrases never authored**; decision gates live on `decision`-kind Specs
  linked by `decidedBy`; tradeoff refusals reopen only via `supersedes` under the ADR three-part test.
- Relations out today: `refines → spec:model.relations` only (no inter-decision `dependsOn` yet).

### MD-34 — `spec:decisions.architectural-significance-rides-primitives`

- Title: "Architectural significance rides existing primitives"
- Stated+derived readiness: `ready`
- Decision head (live): pattern relationships use existing relations; **`dependsOn` reserved for
  genuine semantic need**; `supersedes` for actual replacement under ADR; scheduling-flavored edges
  refused (MD-33).
- Relations out today (todo 2 already landed):
  `dependsOn → structural-anchor-semantics`,
  `dependsOn → binding-not-liveness`,
  `refines → spec:model.anchors`.

### Genuineness bar applied here

A candidate `dependsOn` is **accepted** only when:

1. The **source carrier text** makes a clause that is unintelligible or legally incomplete without the
   target decision's settled content (quoted), and
2. The link is **not** merely reaffirmation, generalization-of-an-instance, planner gloss, or a
   relationship already honestly carried by a `refines` chain, and
3. The edge is **not** scheduling-flavored (MD-33).

`decidedBy` fills are accepted when the **subject** is shaped by the **decision's** intent (subject
outcome / decision text align) and the edge is absent today.

## Baseline green outputs

### Recipe 1 — build backlog (verbatim catalog)

```json
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 34,
  "excludedWithoutVerifier": []
}
```

Exit `0`.

### Recipe 2 — drift alarm (verbatim catalog)

```json
{
  "total": 3,
  "alarms": [
    {
      "id": "spec:consumers.projections-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 2
    },
    {
      "id": "spec:extraction.regenerability",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 1
    },
    {
      "id": "spec:model.core-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 3
    }
  ]
}
```

Exit `0`. None of these alarms are inter-decision relation gaps.

### Validate baseline

```sh
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

```
162 specs · 1 packs · 157 anchors → 320 nodes · 679 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Exit `0`. Warnings are pre-existing ready-without-verifier gaps on unrelated Specs
(`carrier.markdown-authoring`, `extraction.claim-taxonomy`, `model.pack-aggregate`,
`model.relations`, `model.spec-sections`).

Live pulse:

```json
{
  "decisionCount": 34,
  "interDependsOnNow": 3,
  "interSupersedesNow": 0,
  "decidedByNow": 34,
  "specs": 162,
  "nodes": 320,
  "edges": 679,
  "reportErrors": 0
}
```

**Green validate is not the relation tranche.** It is the misleading-success baseline the Manual QA below falsifies.

### Pre-existing inter-decision `dependsOn` (live, claim `declared`)

Count: **3** (not the draft-era "1" — todo 2 already authored MD-34's two edges).

| from | to |
|---|---|
| `spec:decisions.architectural-significance-rides-primitives` | `spec:decisions.structural-anchor-semantics` |
| `spec:decisions.architectural-significance-rides-primitives` | `spec:decisions.binding-not-liveness` |
| `spec:decisions.sdp-gherkin-extension` | `spec:decisions.sdp-ts-extension` |

Inter-decision `refines` still 4 (carrier family only). Inter-decision `supersedes`: **0**.

## Per-candidate `dependsOn` adjudication (12)

Bar evidence is quoted from live carrier decision/consequence text via `g.specContext`.

### 1. `carrier-universality` → `prose-ownership` — **ACCEPT**

- Source clause (decision, ordered second): description prose is lawful only as free prose on
  **MD-19's existing owners** — narrative or description on the typed owner.
- Consequence: "description prose on MD-19 owners only".
- Target decision: "Free prose is stored as a narrative or a description on its typed owner; unowned
  prose is refused."
- **Need:** universality's second ordered clause is legally incomplete without MD-19's owner law.
- Present today: **no**.

### 2. `carrier-universality` → `pack-markdown-carrier` — **ACCEPT**

- Source clause (decision, ordered fifth): "Packs are out of this ruling; **MD-25 remains the Pack
  carrier law**."
- Consequence: "Packs stay under MD-25; this Spec neither admits a Gherkin Pack surface nor reopens
  the Pack Markdown envelope."
- Target is MD-25 (Pack Markdown manifest carrier).
- **Need:** the fifth ordered clause asserts MD-25's continuing authority as part of settled law, not
  a decorative cross-link.
- Present today: **no**.

### 3. `carrier-universality` → `carrier-ruling` — **DROP**

Plan flag: *"reaffirms MD-18 default; drop if it cannot survive the genuinely-needs-the-other bar"*.

- Source clause (decision, ordered fourth): "the corpus default does not flip: Markdown remains the
  default Spec carrier".
- Consequence: "Markdown stays the default Spec carrier (MD-18)".
- Target (MD-18): "Specs default to Markdown…".
- Carrier-ruling consequences already say universality **reaffirms** the default — reaffirmation is
  not semantic need of MD-18's full content (Packs-until-ruling, TS DSL escape hatch).
- Lineage already exists:
  `carrier-universality --refines→ gherkin-carrier-option --refines→ carrier-ruling`.
  A parallel `dependsOn` would ceremonialize what `refines` already places in the carrier stack.
- **Drop reason:** reaffirms ≠ needs; existing `refines` chain; plan-named drop candidate fails the bar.
- Present today: **no** (and must stay absent).

### 4. `agent-front-door` → `agent-surface-scripts-graph` — **ACCEPT**

- Source decision: front door is two entrances over one seam — package exports the reader; CLI is
  one evaluation sink that injects that same reader.
- Target decision: "The typed graph is the visible contract and agents script it directly through a
  thin reader surface."
- **Need:** the front door instantiates the scripts-graph contract; without "agents script the
  visible graph through a thin reader", the sink-over-exported-reader design has no posture to
  realize.
- Both already `refines → spec:consumers.agent-surface`; this `dependsOn` is decision-to-decision need,
  not a substitute for those subject links.
- Present today: **no**.

### 5. `mcp-deferred` → `agent-surface-scripts-graph` — **DROP**

- Plan gloss: "deferral coherent because scripted surface exists".
- Source decision (full): "MCP integration is deferred until a concrete caller establishes its
  boundary and contract."
- Context/consequences name "typed agent and human projections" and "current graph and reader
  surfaces" — **never** `agent-surface-scripts-graph` / MD-21 by id or title.
- Source already `refines → spec:consumers.projections-model` and is `decidedBy` that subject.
- **Drop reason:** carrier supplies no quoted need of scripts-graph; planner coherence gloss ≠
  unintelligibility; plan rule forbids edges without quoted justification.
- Present today: **no** (and must stay absent).

### 6. `structural-anchor-semantics` → `binding-not-liveness` — **ACCEPT**

- Source consequences: "Anchors carry no intent, readiness, status, or delivery fact. `memberOf` and
  structural `uses` mint no delivery facts…"
- Target: "Delivery facts record bindings and enabled verifier existence…"
- **Need:** structural fields stay inside MD-7's binding≠liveness claim boundary; "mint no delivery
  facts" specializes that boundary rather than restating it.
- Present today: **no**.

### 7. `verification-posture-not-realization` → `binding-not-liveness` — **ACCEPT**

- Source decision: "`verification.mode` states the intended verification posture; enabled-verifier
  realization remains a derived fact and the two are never collapsed."
- Rationale: treating authored mode as realization would "duplicate and weaken the
  **binding-derived fact**".
- **Need:** realization stays binding-derived (MD-7).
- Present today: **no**.

### 8. `example-realization-posture` → `binding-not-liveness` — **ACCEPT**

- Source decision: "`implemented` remains a direct, **anchor-derived** delivery fact with no
  propagation through refinement."
- Rationale: parent-inferred implementation would invent a realization claim "no source binding
  asserted".
- **Need:** implemented stays anchor-derived under MD-7.
- Present today: **no**.

### 9. `carried-evidence` → `kind-conditional-floor` — **ACCEPT**

- Source decision: promoted evidence counts only when the promoted Spec holds its **natural
  evidence**.
- Target: readiness floor = kind-blind clauses + one **kind-conditional evidence** clause per rung.
- **Need:** "natural evidence" is the kind-conditional clause (plan justification matches carrier).
- Present today: **no**.

### 10. `carried-evidence` → `content-only-sections` — **ACCEPT**

- Source: polices **promoted** Specs / empty promotion.
- Target: "Sections contain local content only; **promotion moves content exclusively** and relations
  state the linkage."
- **Need:** carried-evidence's promotion police presupposes content-only promotion mechanics.
- Present today: **no**.

### 11. `decision-readiness-posture` → `kind-conditional-floor` — **ACCEPT**

- Source rationale: "Registry ratification is the decision kind's **natural evidence**".
- Decision: ready from registry ratification; never requires implementation/verifier bindings.
- **Need:** instantiates kind-conditional floor for kind `decision`.
- Note: source currently `refines → warn-level-signals` (signal exclusion side); the floor-side need
  is this missing `dependsOn`.
- Present today: **no**.

### 12. `planning-truths-placement` → `shipped-projections-frozen` — **DROP**

- Plan gloss: "generalizes the frozen-reopen pattern".
- Source fully states reopen-via-`supersedes` + ADR test without naming MD-32 /
  `shipped-projections-frozen`.
- Target is a prior **instance** of a frozen tradeoff refusal; generalization does not `dependsOn`
  its instance (direction fails the needs bar).
- **Drop reason:** no carrier citation; "generalizes" ≠ "needs"; would manufacture a ceremonial edge.
- Present today: **no** (and must stay absent).

### dependsOn summary

| # | Edge | Verdict |
|---|---|---|
| 1 | universality → prose-ownership | **ACCEPT** (missing) |
| 2 | universality → pack-markdown-carrier | **ACCEPT** (missing) |
| 3 | universality → carrier-ruling | **DROP** |
| 4 | agent-front-door → agent-surface-scripts-graph | **ACCEPT** (missing) |
| 5 | mcp-deferred → agent-surface-scripts-graph | **DROP** |
| 6 | structural-anchor-semantics → binding-not-liveness | **ACCEPT** (missing) |
| 7 | verification-posture-not-realization → binding-not-liveness | **ACCEPT** (missing) |
| 8 | example-realization-posture → binding-not-liveness | **ACCEPT** (missing) |
| 9 | carried-evidence → kind-conditional-floor | **ACCEPT** (missing) |
| 10 | carried-evidence → content-only-sections | **ACCEPT** (missing) |
| 11 | decision-readiness-posture → kind-conditional-floor | **ACCEPT** (missing) |
| 12 | planning-truths-placement → shipped-projections-frozen | **DROP** |

**Accepted dependsOn: 9. Dropped: 3. All 9 accepted edges absent from the graph.**

Measured post-author expectation for inter-decision `dependsOn` (not a hardcoded quota):

`3 (current) + 9 (accepted missing) = 12`

(Plan ceiling "up to 15" assumed all 12 candidates plus the 3 current; drops lower the measured target to 12.)

## Per-fill `decidedBy` verification (6)

All six absent today (`fillsPresent: []`). Subject vs decision intent checked live.

### A. `spec:consumers.agent-surface` → `spec:decisions.agent-front-door` — **ACCEPT**

- Subject outcome: agent obtains/composes graph context without a verb wall.
- Decision: package exports reader + CLI evaluation sink over that reader.
- Decision already `refines` the subject; subject already `decidedBy` scripts-graph only.
- Front door is the second shaping decision for the same subject surface.
- Present: **no**.

### B. `spec:validation.warn-level-signals` → `spec:decisions.decision-readiness-posture` — **ACCEPT**

- Subject: missing connective evidence warns without failing.
- Decision: decision kind's ready posture; backlog and **verifier-gap signal exclude kind `decision`**.
- Decision already `refines` the subject; inbound `decidedBy` from subject is the missing fill.
- Present: **no**.

### C. `spec:model.core-model` → `spec:decisions.example-realization-posture` — **ACCEPT**

- Subject: one enrichable Spec; independent coordinates for delivery statements.
- Decision: ready examples are evidence not backlog; `implemented` stays direct/anchor-derived with
  no refinement propagation — shapes core delivery-fact coordinates.
- Decision already `refines` core-model; subject `decidedBy` only `one-primitive` today.
- Present: **no**.

### D. `spec:protocol.self-hosting` → `spec:decisions.plain-language-references` — **ACCEPT**

- Subject: Protocol authors and validates itself.
- Decision: durable references lead with plain-language meaning (codes parenthetical).
- Decision already `refines` self-hosting; subject has four other `decidedBy` edges, not this one.
- Present: **no**.

### E. `spec:carrier.gherkin-authoring` → `spec:decisions.sdp-gherkin-extension` — **ACCEPT**

- Subject: Gherkin authoring enters the one graph.
- Decision: canonical suffix `.sdp.gherkin`; bare `.feature` non-canonical; suffix-only discovery.
- Subject already `decidedBy` carrier-universality + gherkin-carrier-option; suffix ruling is the
  missing shaping decision for the authoring surface's discovery contract.
- Present: **no**.

### F. `spec:model.anchors` → `spec:decisions.structural-anchor-semantics` — **ACCEPT**

- Subject: source anchors bind code without carrying intent.
- Decision: admits `component`/`uses` structural fields; no `implements`; structural edges mint no
  delivery facts.
- Subject already `decidedBy` binding-not-liveness; structural-anchor-semantics already `refines`
  anchors — inbound `decidedBy` fill still missing.
- Present: **no**.

**Accepted decidedBy fills: 6/6. All missing.**

Note: `spec:model.structural-patterns` already carries
`decidedBy → architectural-significance-rides-primitives` (todo 3 territory; `statedReadiness:
defined`). That edge is **not** one of task 8's six fills. Live `decidedBy` total is **34** (includes
that structural-patterns edge).

## Exact accepted missing set (15 edges)

### dependsOn (9)

1. `spec:decisions.carrier-universality` → `spec:decisions.prose-ownership`
2. `spec:decisions.carrier-universality` → `spec:decisions.pack-markdown-carrier`
3. `spec:decisions.agent-front-door` → `spec:decisions.agent-surface-scripts-graph`
4. `spec:decisions.structural-anchor-semantics` → `spec:decisions.binding-not-liveness`
5. `spec:decisions.verification-posture-not-realization` → `spec:decisions.binding-not-liveness`
6. `spec:decisions.example-realization-posture` → `spec:decisions.binding-not-liveness`
7. `spec:decisions.carried-evidence` → `spec:decisions.kind-conditional-floor`
8. `spec:decisions.carried-evidence` → `spec:decisions.content-only-sections`
9. `spec:decisions.decision-readiness-posture` → `spec:decisions.kind-conditional-floor`

### decidedBy (6)

10. `spec:consumers.agent-surface` → `spec:decisions.agent-front-door`
11. `spec:validation.warn-level-signals` → `spec:decisions.decision-readiness-posture`
12. `spec:model.core-model` → `spec:decisions.example-realization-posture`
13. `spec:protocol.self-hosting` → `spec:decisions.plain-language-references`
14. `spec:carrier.gherkin-authoring` → `spec:decisions.sdp-gherkin-extension`
15. `spec:model.anchors` → `spec:decisions.structural-anchor-semantics`

### Dropped candidates (do not author)

- `dependsOn` `carrier-universality` → `carrier-ruling`
- `dependsOn` `mcp-deferred` → `agent-surface-scripts-graph`
- `dependsOn` `planning-truths-placement` → `shipped-projections-frozen`

## Failing Manual QA (live graph, decisive pre-edit red)

Requirement under test: every **accepted** edge from the 18-candidate table is present as a declared
graph edge. Dropped candidates are measured in present/missing sets but do not fail the body.

Exact body (fresh `pnpm --silent sdp:q`; derives graph in-process; no generated-graph authority):

```js
const decisionIds = new Set(
  g.specs().filter((spec) => spec.specKind === "decision").map((spec) => spec.id),
);
const pairKey = (type, from, to) => type + "|" + from + "|" + to;
const currentInterDependsOn = graph.edges
  .filter(
    (edge) =>
      edge.type === "dependsOn" &&
      decisionIds.has(edge.from) &&
      decisionIds.has(edge.to),
  )
  .map((edge) => ({ from: edge.from, to: edge.to, claim: edge.claim }))
  .sort((a, b) => (a.from + a.to).localeCompare(b.from + b.to));
const candidateDependsOn = [
  ["spec:decisions.carrier-universality", "spec:decisions.prose-ownership"],
  ["spec:decisions.carrier-universality", "spec:decisions.pack-markdown-carrier"],
  ["spec:decisions.carrier-universality", "spec:decisions.carrier-ruling"],
  ["spec:decisions.agent-front-door", "spec:decisions.agent-surface-scripts-graph"],
  ["spec:decisions.mcp-deferred", "spec:decisions.agent-surface-scripts-graph"],
  ["spec:decisions.structural-anchor-semantics", "spec:decisions.binding-not-liveness"],
  ["spec:decisions.verification-posture-not-realization", "spec:decisions.binding-not-liveness"],
  ["spec:decisions.example-realization-posture", "spec:decisions.binding-not-liveness"],
  ["spec:decisions.carried-evidence", "spec:decisions.kind-conditional-floor"],
  ["spec:decisions.carried-evidence", "spec:decisions.content-only-sections"],
  ["spec:decisions.decision-readiness-posture", "spec:decisions.kind-conditional-floor"],
  ["spec:decisions.planning-truths-placement", "spec:decisions.shipped-projections-frozen"],
];
const candidateDecidedBy = [
  ["spec:consumers.agent-surface", "spec:decisions.agent-front-door"],
  ["spec:validation.warn-level-signals", "spec:decisions.decision-readiness-posture"],
  ["spec:model.core-model", "spec:decisions.example-realization-posture"],
  ["spec:protocol.self-hosting", "spec:decisions.plain-language-references"],
  ["spec:carrier.gherkin-authoring", "spec:decisions.sdp-gherkin-extension"],
  ["spec:model.anchors", "spec:decisions.structural-anchor-semantics"],
];
const acceptedKeys = new Set([
  pairKey("dependsOn", "spec:decisions.carrier-universality", "spec:decisions.prose-ownership"),
  pairKey("dependsOn", "spec:decisions.carrier-universality", "spec:decisions.pack-markdown-carrier"),
  pairKey("dependsOn", "spec:decisions.agent-front-door", "spec:decisions.agent-surface-scripts-graph"),
  pairKey("dependsOn", "spec:decisions.structural-anchor-semantics", "spec:decisions.binding-not-liveness"),
  pairKey("dependsOn", "spec:decisions.verification-posture-not-realization", "spec:decisions.binding-not-liveness"),
  pairKey("dependsOn", "spec:decisions.example-realization-posture", "spec:decisions.binding-not-liveness"),
  pairKey("dependsOn", "spec:decisions.carried-evidence", "spec:decisions.kind-conditional-floor"),
  pairKey("dependsOn", "spec:decisions.carried-evidence", "spec:decisions.content-only-sections"),
  pairKey("dependsOn", "spec:decisions.decision-readiness-posture", "spec:decisions.kind-conditional-floor"),
  pairKey("decidedBy", "spec:consumers.agent-surface", "spec:decisions.agent-front-door"),
  pairKey("decidedBy", "spec:validation.warn-level-signals", "spec:decisions.decision-readiness-posture"),
  pairKey("decidedBy", "spec:model.core-model", "spec:decisions.example-realization-posture"),
  pairKey("decidedBy", "spec:protocol.self-hosting", "spec:decisions.plain-language-references"),
  pairKey("decidedBy", "spec:carrier.gherkin-authoring", "spec:decisions.sdp-gherkin-extension"),
  pairKey("decidedBy", "spec:model.anchors", "spec:decisions.structural-anchor-semantics"),
]);
const edgePresent = (type, from, to) =>
  graph.edges.some((edge) => edge.type === type && edge.from === from && edge.to === to);
const present = [];
const missing = [];
for (const [from, to] of candidateDependsOn) {
  const row = {
    type: "dependsOn",
    from,
    to,
    accepted: acceptedKeys.has(pairKey("dependsOn", from, to)),
  };
  if (edgePresent("dependsOn", from, to)) present.push(row);
  else missing.push(row);
}
for (const [from, to] of candidateDecidedBy) {
  const row = {
    type: "decidedBy",
    from,
    to,
    accepted: acceptedKeys.has(pairKey("decidedBy", from, to)),
  };
  if (edgePresent("decidedBy", from, to)) present.push(row);
  else missing.push(row);
}
const acceptedMissing = missing.filter((row) => row.accepted);
const result = {
  interDependsOnCount: currentInterDependsOn.length,
  interDependsOn: currentInterDependsOn,
  candidateTotal: candidateDependsOn.length + candidateDecidedBy.length,
  present,
  missing,
  acceptedMissing,
  expectedInterDependsOnAfter:
    currentInterDependsOn.length +
    acceptedMissing.filter((row) => row.type === "dependsOn").length,
};
if (acceptedMissing.length > 0) {
  throw new Error("architectural relation tranche missing");
}
return result;
```

Command:

```sh
pnpm --silent sdp:q '<body above>'
```

Observed:

```
sdp q: architectural relation tranche missing
```

Exit code: **`1`**

Exact sentinel: **`architectural relation tranche missing`**

### Companion measurements (same live graph, inspect body)

| Field | Value |
|---|---|
| `interDependsOnCount` (pre-existing) | **3** |
| `candidateTotal` | **18** (12 dependsOn + 6 decidedBy) |
| `present` (of 18) | **[]** / 0 |
| `missing` (of 18) | **18** (all candidates absent) |
| `acceptedMissing` | **15** (9 dependsOn + 6 decidedBy) |
| dropped among missing | **3** (do not fail) |
| `expectedInterDependsOnAfter` | **12** (= 3 current + 9 accepted dependsOn) |
| `interSupersedesNow` | **0** |
| `decidedByNow` | **34** (fill target is +6 accepted, measured later — not hardcoded here) |

No test edit seam: relations are authored graph facts; task 15 owns shared rosters
(`declared-relations.ts`, frozen totals).

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA used live `pnpm --silent sdp:q` (in-process derive). Pre-existing inter-decision count **3** matches todo-2 MD-34 edges + standing gherkin→ts dependsOn. HEAD carriers for the 12 sources were not edited in this step. |
| **dirty_worktree** | Pre-existing dirt (not introduced here): `M .omo/boulder.json`, `M .omo/plans/architectural-patterns-views.md`, `M .omo/start-work/ledger.jsonl`, `M test/self-hosting-oracle/model.ts`, plus sibling untracked evidence under `.omo/evidence/architectural-patterns-views/`. No `specs/decisions/*.sdp.md` dirty for the 12 dependsOn sources or 6 decidedBy subjects in this slice. This file is the only new path for task 8 baseline. |
| **generated-or-cached** | Validate wrote `generated/graph.json` as a green-baseline side effect; coverage claim does **not** read that artifact — `sdp:q` re-derives. Recipe/validate greens are not cached Manual-QA results. |
| **misleading_success_output** | Asserted on **sentinel text and missing-edge sets**, not bare exit codes of green tools. Validate exit `0` / recipe 1 `total: 0` coexist with Manual QA exit `1` and exact message `architectural relation tranche missing`. Decision count 34 and decidedBy 34 do not imply the 15 accepted edges exist. |
| **wrong_location** | N/A — main checkout on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push. |
| **secret / product edit** | N/A — evidence-only; no carrier/test/plan/Boulder/ledger write in this step. |
| **test edit seam** | N/A — relations are authored graph facts; task 15 owns shared roster lockstep. No failing unit test was required or added. |

## Cleanup

No temp files, no partial frontmatter drafts, no carrier touches. No `git` mutations. Evidence path only:

`.omo/evidence/architectural-patterns-views/task-8-baseline.md`

## Executor recommendation (task 8 implementation)

1. Author the **9 accepted `dependsOn`** edges in source decision frontmatter (list above).
2. Author the **6 accepted `decidedBy`** fills on subject Spec frontmatter.
3. **Do not** author the 3 dropped dependsOn edges; keep reasons in evidence.
4. **Do not** author `supersedes` or scheduling-flavored edges.
5. Leave shared oracle/roster updates to **task 15**.
6. Re-run the Manual QA body: sentinel must clear only when all 15 accepted edges resolve;
   measured inter-decision `dependsOn` becomes **12** (= 3 + 9), not a hardcoded 15.
7. `pnpm --silent sdp validate …` (three exclusions) must stay exit 0 after edits.

## Verdict

**BASELINE RED (decisive).**

- Validate and recipes 1/2 are green (corpus healthy).
- Pre-existing inter-decision `dependsOn` count: **3**.
- All **18** plan candidates/fills are absent from the graph today.
- Genuineness bar: **9 dependsOn accepted**, **3 dependsOn dropped** (including
  carrier-universality→carrier-ruling), **6/6 decidedBy accepted**.
- Exact failing sentinel: `architectural relation tranche missing` (exit 1) while any accepted edge
  is absent (`acceptedMissing.length === 15`).
