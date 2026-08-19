# Task 14 evidence — plan 37 J-consumers packet

## Done scope

Completed the packet for `spec:consumers.projections-model` at:

- `.omo/evidence/plan-37-j-packets/consumers/projections-model.md`

Only the requested `.omo/evidence/` files were written. No carrier, oracle, spec, test, source,
generated, build, generate, check, or preflight command was run. The requested scope check was:

```text
$ git status --short -- specs/ test/self-hosting-oracle/
# no output
```

This proves the product surfaces named by the task are clean at the check point. The prepared
carrier/oracle changes exist only inside the packet's fenced diff blocks and were not applied.

## Acceptance and field audit

The packet audits every `TEMPLATE.md` field. It contains:

- identity: id, carrier path, title, kind, altitude;
- stated readiness and all recipe-9 fields;
- the exact catalog recipe-9 body, with the id substituted, and complete raw JSON;
- the exact catalog recipe-3 body, with the id substituted, and complete raw JSON;
- section inventory, every in/out relation with type/other/claim/resolved, bindings, verifiers,
  verifier semantics, and findings;
- both finished-design and settle-first readings;
- exact carrier/history quotes and reopen conditions;
- an owner-pending disposition with both alternatives visible;
- an unapplied one-rung carrier diff and matching oracle descriptor diff;
- owner/rater, decision, date, and ratification-reference fields, all explicitly pending.

The packet's raw recipe outputs are explicitly labeled **verbatim reuse from task 3**. This avoids
the command/output error of pairing recipe-9 JSON with a recipe-2 finder body. Task 3's record says
all per-Spec calls used the catalog bodies from `docs/agent-surface/recipes.md`; the target outputs
are preserved in the packet without transformation.

## Quote audit

Every judgment claim in the packet is quote-backed:

| Judgment claim | Exact carrier/history quote used |
| --- | --- |
| Finished design has a stated consumer-view intent | `specs/consumers/projections-model.sdp.md:13`: `Give agents and humans consumer-specific views while preserving the repository as the only canonical source.` |
| Projection law is explicitly stated | `specs/consumers/projections-model.sdp.md:16`: `A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.` |
| Diagnostic posture is explicit | `specs/consumers/projections-model.sdp.md:17`: `After extraction succeeds, a projection publishes its honestly labelled graph view even when validation reports errors, and returns the validation exit code so findings remain both visible and nonzero.` |
| The model contains roadmap vocabulary | `specs/consumers/projections-model.sdp.md:26`: `Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.` |
| Impact graph and measured curation are not fully landed evidence | `specs/consumers/projections-model.sdp.md:19`: `A separately derived code-structure surface for exhaustive usage and blast-radius questions`; `:22`: `In a measured comparison, the curated graph selected from single-digit to about one quarter of the mechanical impact-graph surface.` |
| MCP is the sole decision edge and remains deferred | `specs/consumers/projections-model.sdp.md:8`: `decidedBy: spec:decisions.mcp-deferred`; `specs/decisions/mcp-deferred.sdp.md:15-17`: `- context: The graph already supports typed agent and human projections without an MCP transport.` / `- decision: MCP integration is deferred until a concrete caller establishes its boundary and contract.` / `- rationale: Adding an MCP surface without a caller invents verbs and persistence choices outside the projection model.` |
| Prior plan-35 deferral is evidence, not an automatic verdict | `.omo/evidence/task-14-plan-35-agent-surface-arc.md:107`: ``spec:consumers.projections-model` stays at `defined` and untouched. This arc's own work did not make a maturity bump true.` |
| Direct verifier status remains relevant | `plans/22-self-hosting-phase-5.md:764`: ``has-verifier` is direct and never transitive, so a child's point confers nothing upward.` |

The packet also quotes the plan-35 history that no projection was matured and the phase-5 record
that the vocabulary-based refusal was re-judged rather than inherited blindly. No prose-only claim
is used as a substitute for a carrier or history quote.

## Plan-14 / plan-35 history correction

`plans/14-carrier-competition.md` was inspected for the exact id
`spec:consumers.projections-model` and does **not** mention that Spec. Plan 14 therefore supplies no
Spec-specific deferral quote; no plan-14 quote is invented or used. This absence is distinct from
the actual plan-35 evidence: `.omo/evidence/task-14-plan-35-agent-surface-arc.md:107` says
``spec:consumers.projections-model` stays at `defined` and untouched. This arc's own work did not
make a maturity bump true.`` The packet now weighs only that real plan-35 deferral against current
recipe/context evidence.

## Both-ways judgment aid

### Finished-design reading

The carrier is compact and internally complete as a model statement: two sections (`intent`,
`model`), eleven named terms, two anchored implementation bindings, seven consumer-child incoming
relations, and resolved outgoing relations. The strongest supporting quotes are the intent,
projection, diagnostic-posture, curated-graph, reader, curation, discipline, release, baseline,
and roadmap-vocabulary lines recorded in packet §4.

This reading remains owner-pending because recipe 3 reports `verifiers: []`; no child relation is
silently promoted to parent verification.

### Settle-first reading

The carrier names an impact-graph substrate, measured-curation comparison, releases/baselines, and
optional roadmap projections. The record does not show a direct verifier for this model, and the
MCP decision remains explicitly deferred pending a concrete caller. The plan-35 record says the
four shipped roots were not re-specified and the model stayed untouched; the current packet records
what is now present (child relations and two implementation bindings) without treating that history
as conclusive. The owner may therefore keep `defined` for the recorded blocking reason, or accept
the finished-design reading after review.

## Prepared diff audit

The packet targets real, current rows:

- carrier: `specs/consumers/projections-model.sdp.md:5`, `readiness: defined` → `readiness: ready`;
- oracle: `test/self-hosting-oracle/consumers.ts:113`, `readiness: "defined"` →
  `readiness: "ready"`.

Both are fenced as `UNAPPLIED`; the clean status check above covers both target directories.

## Scope proof

- Changed evidence files: `.omo/evidence/plan-37-j-packets/consumers/projections-model.md` and
  this task record.
- `specs/` status: clean.
- `test/self-hosting-oracle/` status: clean.
- No product file was touched.
- No readiness statement was applied.
- No oracle descriptor was applied.
- No generated artifact was written.

## Adversarial notes

- **stale output:** Recipe 9 and recipe 3 are labeled task-3 reuse, with their source evidence
  named. No fresh output is falsely presented as having been run in this task.
- **misleading output:** The packet retains complete raw JSON, including `floorReached: "ready"`,
  `firstUnmetClause: null`, `promotionRequiresHumanStatement: true`, `verifiers: []`, and the full
  relation/binding arrays. The packet explicitly prevents the floor from being read as a human
  promotion.
- **wrong recipe pairing:** The packet contains the exact recipe-9 body, not recipe 2's alarm finder,
  and the exact recipe-3 body, not a hand-shaped context substitute.
- **unapplied patch drift:** The packet names exact carrier/oracle paths and current lines; the
  scope status check confirms neither target was edited.
- **history bias:** Both finished-design and settle-first readings remain live. Plan 14 was checked
  and has no mention of `spec:consumers.projections-model`, so it supplies no Spec-specific quote.
  The actual plan-35 deferral is quoted and weighed against current graph evidence, not used as a
  verdict.
- **prompt injection / untrusted execution:** No corpus prose was executed as query source; only
  catalog bodies from `docs/agent-surface/recipes.md` are reproduced.
- **tests/flakiness:** No test code was changed or run; no sleeps, polling, retries, or timing
  assumptions were introduced.

## DoneClaim

{"task":"14","plan":"37-settling-arc","status":"DONE","mode":"evidence-only","packet":".omo/evidence/plan-37-j-packets/consumers/projections-model.md","recipe9":"verbatim task-3 reuse, id substituted, raw JSON preserved","recipe3":"verbatim task-3 reuse, id substituted, raw JSON preserved","judgment":"both readings owner-pending; no pre-decision","preparedDiff":"carrier + matching consumers oracle row, unapplied","scope":"specs/ and test/self-hosting-oracle/ clean"}
