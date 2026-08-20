# Task 7 gate-after QA

## Scope and landing

This is a verification-only checkpoint. No file was staged or committed.
The independently verified temporal repair was re-checked in:

- `specs/decisions/shipped-projections-frozen.sdp.md`
- `test/self-hosting-oracle/decisions.ts`

This task added only this evidence file. The unrelated `AGENTS.md` working-tree hunk was preserved.

## Commands and results

### Required full gate

Command (run once):

```text
npm run check
```

Exit code: `1`. It stopped at the first command, `check:temporal`; it did not reach the product checks or tests. Exact finding:

```text
check:temporal — banned temporal tokens found:

.omo/start-work/ledger.jsonl:8:{"event":"task-completed","plan":".omo/plans/briefs-index-into-spec-relations.md","task":"6. Restructure plan 38 to the ruled thin-pointer shape","session_id":"senpi:01a01fe9-6d0e-73a4-a450-d2db4cb7beae","commands":["title/status byte comparison","forbidden and required pointer assertions","git diff --check -- plans/38-graph-first-planning-arc.md","npm run check:self-hosting-gates"],"artifact":".omo/evidence/briefs-index-into-spec-relations/task-6-plan38-restructure.md","adversarial_classes":{"stale_state":"fresh verifier checked every carrier and corrected the false H-trigger pointer against live GFP, mcp-deferred, and plan 35 evidence","dirty_worktree":"commit 037795f3 contains only plan 38; AGENTS.md, plans 29-37, temporal repair, and .omo excluded","misleading_success_output":"fresh verifier required old H claim absent, corrected split present, five exact sections, and all pointer carriers accurate","generated_or_cached_artifacts":"not applicable: Markdown plan and live carrier reads only","malformed_input":"not applicable: no parser input","prompt_injection":"not applicable: repository-authored text only","cancel_resume":"not applicable: bounded prose edit","hung_or_long_commands":"not applicable: commands completed","flaky_tests":"not applicable: deterministic structural assertions","repeated_interruptions":"not applicable: correction completed in one continuation"},"cleanup":["No repository resources created; scratch output only in /tmp"],"notes":"FullyDone after one verifier loop. Fresh verifier st_01a02034 confirmed revision 2 with confidence 0.93. Commit 037795f3e3a8303c6a313e1bfaa3ee3bbf608dce."}
```

Classification: pre-existing workspace-state failure in the task-6 ledger record, not a product corpus error. No check was weakened, suppressed, or modified.

### Supporting gate and validation commands

```text
npm run check:self-hosting-gates
```
Exit code: `1`, same `check:temporal` finding above.

```text
npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```
Exit code: `0`.

Exact validation result:

```text
161 specs · 1 packs · 157 anchors → 319 nodes · 675 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Warnings, all expected honesty/gaps warnings (informational; no errors):

```text
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
```

```text
npx vitest run test/self-hosting-graph.test.ts
```
Exit code: `0`; exact result: `1 file passed, 26 tests passed`.

```text
npx vitest run test/self-hosting-graph.test.ts test/recipes.test.ts
```
Exit code: `0`; exact result: `2 files passed, 48 tests passed`.

```text
npm run generate:self-hosting && npm run check:self-hosting
```
Exit code: `0`. The generated self-hosting corpus reported `161 specs · 1 packs · 157 anchors → 319 nodes · 675 edges`; `check:self-hosting --check-clean` repeated the same five expected honesty/gaps warnings and passed.

```text
npm run check:example
```
Exit code: `0`. The only warning was the expected single `conformance/verifies-linkage` warning for `spec:orders.create-order.invalid-cart`; all four projection checks completed.

```text
npm run preflight
```
Exit code: `1`. Exact finding: `preflight: nonignored runtime garbage:` followed by the task-owned untracked `.omo/drafts/briefs-index-into-spec-relations.md`, all task-1 through task-7 evidence files then present, and `.omo/plans/briefs-index-into-spec-relations.md`. This is the documented untracked OmO-state preflight rejection, distinct from the product validation result; no bypass was invented.

## Live oracle surface

Command:

```text
pnpm --silent sdp:q 'const nodeTypes = {}; for (const n of graph.nodes) nodeTypes[n.nodeType] = (nodeTypes[n.nodeType] ?? 0) + 1; const declared = graph.edges.filter((e) => e.claim === "declared" && e.type !== "belongsTo"); const relationCounts = {}; for (const e of declared) relationCounts[e.type] = (relationCounts[e.type] ?? 0) + 1; const members = graph.edges.filter((e) => e.type === "belongsTo").map((e) => e.from); const family = (prefix) => graph.nodes.filter((n) => n.nodeType === "Primitive" && n.id.startsWith(prefix)).map((n) => ({id:n.id,specKind:n.specKind,altitude:n.altitude,readiness:n.readiness})).sort((a,b)=>a.id.localeCompare(b.id)); return {nodeTypes,graphEdges:graph.edges.length,declaredRelationCount:declared.length,relationCounts,relationTypes:Object.keys(relationCounts).sort(),packMemberCount:members.length,packMemberFirst:members.slice(0,3),packMemberLast:members.slice(-3),consumersCount:family("spec:consumers.").length,decisionsCount:family("spec:decisions.").length,consumersRelevant:family("spec:consumers.").filter((x)=>["spec:consumers.graph-first-planning","spec:consumers.delivery-session-on-ramp","spec:consumers.projections-model"].includes(x.id)),decisionsRelevant:family("spec:decisions.").filter((x)=>["spec:decisions.shipped-projections-frozen","spec:decisions.planning-truths-placement"].includes(x.id))}' --json
```

Live result:

```json
{
  "nodeTypes": {"Primitive": 161, "Pack": 1, "CodeNode": 74, "Anchor": 83},
  "graphEdges": 675,
  "declaredRelationCount": 279,
  "relationCounts": {"refines": 159, "decidedBy": 33, "verifies": 68, "dependsOn": 18, "constrainedBy": 1},
  "relationTypes": ["constrainedBy", "decidedBy", "dependsOn", "refines", "verifies"],
  "packMemberCount": 161,
  "packMemberFirst": ["spec:carrier.markdown-authoring", "spec:carrier.envelope-contract", "spec:carrier.markdown-parser"],
  "packMemberLast": ["spec:decisions.adopted-registrars-committed", "spec:decisions.shipped-projections-frozen", "spec:decisions.planning-truths-placement"],
  "consumersCount": 31,
  "decisionsCount": 33,
  "consumersRelevant": [
    {"id":"spec:consumers.delivery-session-on-ramp","specKind":"behavior","altitude":"story","readiness":"ready"},
    {"id":"spec:consumers.graph-first-planning","specKind":"behavior","altitude":"feature","readiness":"idea"},
    {"id":"spec:consumers.projections-model","specKind":"model","altitude":"feature","readiness":"defined"}
  ],
  "decisionsRelevant": [
    {"id":"spec:decisions.planning-truths-placement","specKind":"decision","altitude":"feature","readiness":"ready"},
    {"id":"spec:decisions.shipped-projections-frozen","specKind":"decision","altitude":"feature","readiness":"ready"}
  ]
}
```

The six lawful authored relation names are `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`. The live corpus uses only the first five; no other authored relation name exists. The self-hosting graph test passed the exact oracle literals for counts, Pack member roster/order, declared-relation roster, family descriptors, and readiness histogram `{ defined: 9, idea: 6, ready: 145, scoped: 1 }`.

## Exact recipe outputs

The documented recipe bodies were run unchanged; recipe 9 substituted only the requested GFP id.

### Recipe 1

```json
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 33,
  "excludedWithoutVerifier": []
}
```

Result: PASS. Total is `0`; there is no session backlog row.

### Recipe 9 for `spec:consumers.graph-first-planning`

```json
{
  "id": "spec:consumers.graph-first-planning",
  "found": true,
  "statedReadiness": "idea",
  "floorReached": "scoped",
  "nextRung": "defined",
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

Additional exact `specContext` question probe:

```json
{
  "deliveryFacts": [],
  "readiness": "idea",
  "questions": [
    {
      "question": "How does an arc boundary stay legible in the graph (a Pack, a relation cluster, a naming convention) without minting a workflow gate or an authored delivery fact? Evidence note: the briefs-index register's do-not-reopen rows land on existing decision-kind Specs and linked carriers, with a lawful non-decision staying in the plan record; that outcome is input to this question, not a ruling on it.",
      "blocking": true
    }
  ]
}
```

Result: PASS. Q1 is absent, Q2 is present and blocking, readiness remains `idea`, and no delivery fact is authored.

### Recipe 11

```json
{
  "total": 16,
  "byFamily": {
    "carrier": [
      {
        "id": "spec:carrier.markdown-pack-authoring.markdown-ts-parity",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      },
      {
        "id": "spec:carrier.markdown-pack-authoring.spec-envelope-refused",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      }
    ],
    "consumers": [
      {
        "id": "spec:consumers.edit-model",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      },
      {
        "id": "spec:consumers.graph-first-planning",
        "statedReadiness": "idea",
        "floorReached": "scoped",
        "nextUnmetClause": null
      },
      {
        "id": "spec:consumers.impact-graph",
        "statedReadiness": "idea",
        "floorReached": "scoped",
        "nextUnmetClause": null
      },
      {
        "id": "spec:consumers.intent-composition",
        "statedReadiness": "idea",
        "floorReached": "ready",
        "nextUnmetClause": null
      },
      {
        "id": "spec:consumers.projections-model",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      }
    ],
    "extraction": [
      {
        "id": "spec:extraction.regenerability",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      }
    ],
    "model": [
      {
        "id": "spec:model.core-model",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      },
      {
        "id": "spec:model.enrichment-lifecycle",
        "statedReadiness": "scoped",
        "floorReached": "scoped",
        "nextUnmetClause": null
      },
      {
        "id": "spec:model.protocol-domain",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      },
      {
        "id": "spec:model.structural-patterns",
        "statedReadiness": "idea",
        "floorReached": "idea",
        "nextUnmetClause": null
      }
    ],
    "observation": [
      {
        "id": "spec:observation.runtime-overlay",
        "statedReadiness": "idea",
        "floorReached": "idea",
        "nextUnmetClause": null
      }
    ],
    "protocol": [
      {
        "id": "spec:protocol.self-hosting",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      },
      {
        "id": "spec:protocol.structural-self-binding",
        "statedReadiness": "idea",
        "floorReached": "scoped",
        "nextUnmetClause": null
      }
    ],
    "validation": [
      {
        "id": "spec:validation.validator-self-testing",
        "statedReadiness": "defined",
        "floorReached": "ready",
        "nextUnmetClause": null
      }
    ]
  }
}
```

Result: PASS. GFP is present on the lower ladder with stated readiness `idea`.

## Agent READ: GFP against the ruled placement map

The final carrier has 11 behavior rules. Each rule has one semantic home; guardrail wording in a rule is not an authored workflow gate or delivery fact.

| GFP rule | Truth type | One lawful home | READ verdict |
| --- | --- | --- | --- |
| Per-session routing vs arc commissioning | Session law | GFP for arc commissioning; `delivery-session-on-ramp` for per-session routing | PASS; ownership split preserved |
| Advisory graph reading; recipes/plans do not advance work | Selection pressure | GFP behavior rules / recipes | PASS; advisory only |
| True dependency only | Work-item dependency maps | `dependsOn` only; absence means independence | PASS; no scheduling authority |
| Decision-kind subject binding | Decision gates and lawful non-decision | `decision` Spec + `decidedBy`; plan/decision content for non-decision | PASS; no workflow gate authored |
| Do-not-reopen register | Do-not-reopen rows | Decision-kind Spec; `supersedes` is reopen path | PASS; no `constraint` substitute |
| Deferred question/precondition | Re-entry triggers | Deferred Spec blocking questions + true `dependsOn` | PASS; no plan re-arm |
| Exclusive deliverable identity | Cross-brief ownership | One Spec identity; consumers `dependsOn` it | PASS; no duplicate truth |
| Advisory heuristic wording | Selection pressure | GFP behavior rules / recipes | PASS; authorizes, blocks, and sequences nothing |
| Re-measure-first | Session law | GFP | PASS; no inherited readiness/backlog/placement |
| Numbering and staleness | Session law | Thin plan file | PASS; not graph structure |
| E2 placement result | Arc-boundary evidence | Plan record as lawful non-decision | PASS; no new Spec or relation |

Global READ checks: only the six lawful authored relation names are permitted and only five are observed; no sequencing authority, workflow gate, or authored delivery fact is introduced; Q2 remains blocking; GFP stated readiness remains `idea`; GFP `deliveryFacts` is `[]`.

## Temporal repair verification

Command:

```text
node - <<'NODE'
const fs = require('node:fs');
const expected = 'The shipped-projections row in the 36 register has lineage to the 34 projection-settling record: it refused re-specifying the four shipped projections, but that refusal lived only as plan prose the graph could not check.';
const carrier = fs.readFileSync('specs/decisions/shipped-projections-frozen.sdp.md', 'utf8');
const oracle = fs.readFileSync('test/self-hosting-oracle/decisions.ts', 'utf8');
const carrierLine = carrier.split('\n').find((line) => line.startsWith('- context:'));
const oracleLine = oracle.split('\n').find((line) => line.includes('The shipped-projections row'));
console.log(JSON.stringify({carrierExact: carrierLine === `- context: ${expected}`, oracleExact: oracleLine === `          \"${expected}\",`, carrierLine, oracleLine, oldPhraseAbsent: !carrier.includes('carried forward from plans/34 into plans/36') && !oracle.includes('carried forward from plans/34 into plans/36')}, null, 2));
NODE
printf '\\n--- temporal target scan ---\\n'
rg -n 'carried forward from plans/34 into plans/36|plans/[0-9]+/[0-9]+' specs/decisions/shipped-projections-frozen.sdp.md test/self-hosting-oracle/decisions.ts || true
```

Exit code: `0`.

```json
{
  "carrierExact": true,
  "oracleExact": true,
  "carrierLine": "- context: The shipped-projections row in the 36 register has lineage to the 34 projection-settling record: it refused re-specifying the four shipped projections, but that refusal lived only as plan prose the graph could not check.",
  "oracleLine": "          \"The shipped-projections row in the 36 register has lineage to the 34 projection-settling record: it refused re-specifying the four shipped projections, but that refusal lived only as plan prose the graph could not check.\",",
  "oldPhraseAbsent": true
}
```

The target scan emitted no matches.

## Worktree, history, and UltraQA

Initial and final status remained dirty but unstaged. Exact final proof:

```text
## feature/graph-first-planning-arc
 M .omo/boulder.json
 M .omo/start-work/ledger.jsonl
 M AGENTS.md
 M specs/decisions/shipped-projections-frozen.sdp.md
 M test/self-hosting-oracle/decisions.ts
?? .omo/drafts/briefs-index-into-spec-relations.md
?? .omo/evidence/briefs-index-into-spec-relations/
?? .omo/plans/briefs-index-into-spec-relations.md
--- cached names ---
(empty)
--- src status ---
(empty)
--- plans 29-37 worktree status ---
(empty)
--- diff check ---
(empty)
```

The `AGENTS.md` diff remained exactly the unrelated `Always use unslop skill.` line. No `src/` files are changed.

The current session commit history contains no plans 29-37 changes and no commit contains the unrelated unslop line. One earlier session commit, `20754a4`, does contain the legitimate plan-38 status-header hunk in `AGENTS.md`; that is distinct from the preserved uncommitted unslop hunk and is reported rather than misrepresented as absent.

UltraQA classifications:

- `stale_state`: ruled out by fresh extraction-backed `sdp q`, validation, generation, and graph oracle tests.
- `dirty_worktree`: accounted for; no staging or commit occurred and unrelated state was preserved.
- `long command`: `npm run check` was run once and terminated deterministically at `check:temporal`; no retry loop.
- `generated/cache`: ruled out by generation plus `--check-clean` self-hosting verification and live graph extraction.
- `misleading success output`: ruled out by recording exit codes and the exact temporal/preflight failures separately from green product diagnostics.
- `repeated interruptions`: none observed.
- `temp processes`: none started.

## Cleanup receipt

Cleanup: none. No temp processes, background processes, watches, or persistent resources were created.

## Resumed T7 gate after ledger repair

The orchestrator removed the forbidden numbered plan-path token from ledger line 8 without changing its meaning. The exact command remains in this exempt evidence artifact.

Command, run exactly once on the updated tree:

```text
npm run check
```

Exit code: `1`. The command reached every product and corpus gate, then failed only at `preflight`. Exact terminal result:

```text
> @libar-dev/software-delivery-protocol@0.0.0 preflight
> node ./preflight.mjs

preflight: semantic diff summary
.omo/boulder.json
.omo/start-work/ledger.jsonl
AGENTS.md
specs/decisions/shipped-projections-frozen.sdp.md
test/self-hosting-oracle/decisions.ts
preflight: tracked/untracked status inspected
preflight: nonignored runtime garbage:
.omo/drafts/briefs-index-into-spec-relations.md
.omo/evidence/briefs-index-into-spec-relations/task-1-register-coverage.md
.omo/evidence/briefs-index-into-spec-relations/task-2-gfp-enrichment.md
.omo/evidence/briefs-index-into-spec-relations/task-3-register-mint.md
.omo/evidence/briefs-index-into-spec-relations/task-4-placement-adr.md
.omo/evidence/briefs-index-into-spec-relations/task-5-onramp-clause.md
.omo/evidence/briefs-index-into-spec-relations/task-6-baseline.txt
.omo/evidence/briefs-index-into-spec-relations/task-6-plan38-restructure.md
.omo/evidence/briefs-index-into-spec-relations/task-7-gate-after-qa.md
.omo/evidence/briefs-index-into-spec-relations/task-7-temporal-lineage-repair.md
.omo/plans/briefs-index-into-spec-relations.md

Command exited with code 1
```

The preceding stages were green: `check:temporal` exit `0`; lint; format check; build; both generation passes; both typechecks; `npm test` (`62` files, `839` passed, `1` skipped); self-hosting gates; self-hosting `--check-clean`; and example `--check-clean`. The expected warnings remained five self-hosting honesty/gaps warnings and one example verifies-linkage warning. Build also emitted its existing esbuild `import.meta`/CJS warning; it did not fail the build.

The repository preflight contract (`preflight.mjs`) was inspected. It excludes only the script-owned generated trees and rejects any remaining nonignored untracked path as `preflight: nonignored runtime garbage`. Therefore the smallest lawful landing prerequisite is to make the listed task-owned `.omo` plan/draft/evidence artifacts tracked in the authorized landing; deleting them or bypassing the contract is not lawful. This session does not stage or commit, so landing remains blocked by that exact untracked-state prerequisite.

Focused confirmation:

```text
npm run check:self-hosting-gates
```

Exit code: `0`. Exact temporal confirmation from its JSON surface:

```json
"temporal": {
  "ran": true,
  "exit": 0
}
```

All previously recorded recipe and READ evidence remains preserved and valid.

## Lawful checkpoint and final T7 rerun

Checkpoint commit:

```text
59f0fd563f5ef7c5ece16fb90c893d2e06cb54fa
chore(evidence): checkpoint graph-first planning QA state
```

Before commit, the staged-name proof listed only these paths:

```text
.omo/boulder.json
.omo/drafts/briefs-index-into-spec-relations.md
.omo/evidence/briefs-index-into-spec-relations/task-1-register-coverage.md
.omo/evidence/briefs-index-into-spec-relations/task-2-gfp-enrichment.md
.omo/evidence/briefs-index-into-spec-relations/task-3-register-mint.md
.omo/evidence/briefs-index-into-spec-relations/task-4-placement-adr.md
.omo/evidence/briefs-index-into-spec-relations/task-5-onramp-clause.md
.omo/evidence/briefs-index-into-spec-relations/task-6-baseline.txt
.omo/evidence/briefs-index-into-spec-relations/task-6-plan38-restructure.md
.omo/evidence/briefs-index-into-spec-relations/task-7-gate-after-qa.md
.omo/evidence/briefs-index-into-spec-relations/task-7-temporal-lineage-repair.md
.omo/plans/briefs-index-into-spec-relations.md
.omo/start-work/ledger.jsonl
specs/decisions/shipped-projections-frozen.sdp.md
test/self-hosting-oracle/decisions.ts
```

The staged `AGENTS.md` diff was empty; staged forbidden-path probes for `src/` and plans 29-37 were empty; and the temporal carrier/oracle parity probe returned `carrierExact: true` and `oracleExact: true`.

After that checkpoint, `npm run check` was rerun once on the tracked state.

Exit code: `0`. Exact final preflight output:

```text
> @libar-dev/software-delivery-protocol@0.0.0 preflight
> node ./preflight.mjs

preflight: semantic diff summary
AGENTS.md
preflight: tracked/untracked status inspected
```

This is a preflight PASS: no nonignored untracked runtime garbage, generated drift, tracked generated writes, or registrar drift was reported. The full gate also passed temporal, lint, format, build, generation, typechecks, tests (`62` files, `839` passed, `1` skipped; package self-hosting suite `80` passed), self-hosting gates, self-hosting projections, and example projections.

Warning classification on the green run is unchanged: five expected self-hosting `honesty/gaps` warnings, one expected example `conformance/verifies-linkage` warning, and the existing non-failing esbuild CJS `import.meta` warning. No errors occurred.

Recipe 1, recipe 9, recipe 11, and the READ table were not rerun. The checkpoint changed only durable tracking state and the already verified temporal mirror; it did not change graph inputs, descriptors, relations, readiness, or behavior rules. Their exact captured outputs therefore remain current.

The evidence file is now modified after checkpoint commit and intentionally remains unstaged. No second commit was made.

## Gate disposition

Product, oracle, recipe, READ, temporal, focused self-hosting gate, and full `npm run check` results pass. The lawful checkpoint is `59f0fd563f5ef7c5ece16fb90c893d2e06cb54fa`; the only remaining action is independent T7 verification of this updated evidence before its final evidence landing. `AGENTS.md` remains the unrelated unstaged working-tree change. Landing remains pending.
