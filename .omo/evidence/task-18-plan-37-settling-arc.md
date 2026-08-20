# Task 18. Plan 37 close record

## Result

Wrote the Plan-35-shaped close record into `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md`: Brief I ledger, Brief J eight-row table, Brief K `STAND-DOWN (unmet)`, and a re-derived measurement section. Status header stays EXECUTING. Todo 20 owns the gate and the EXECUTED flip.

Every number below was produced in this worker session. Each command ran twice. Outputs were identical. Nothing was inherited from commission, plan 35, or earlier evidence files.

## Commands and both-pass outputs

### 1. Canonical validate

```sh
npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Pass 1 exit 0. Pass 2 exit 0. Stdout both times:

```text
156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

sha256 of that recorded stdout, including the trailing newline: `4370017216124f4ffa6025ba3f7931a70624e12ca039061ea5cece31fc6b2147`.

The first line is derivation, 0/0. The validate summary is 0 errors and 5 warnings. Those are not the same count.

### 2. Recipe 1

Documented body from `docs/agent-surface/recipes.md` §1, run as:

```sh
pnpm --silent sdp:q '<recipe 1 body>' --json
```

Pass 1 exit 0. Pass 2 exit 0. Stdout both times:

```json
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 31,
  "excludedWithoutVerifier": []
}
```

sha256: `2b7e82053e7dd0846fe3edcac759771ce6a7610947f6cc3e44cc04a43a2cc849`.

### 3. Recipe 2

Documented body from `docs/agent-surface/recipes.md` §2, run as:

```sh
pnpm --silent sdp:q '<recipe 2 body>' --json
```

Pass 1 exit 0. Pass 2 exit 0. Stdout both times:

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

sha256: `e352b7975c63477ba3b1fe3522db001a47fd7309762595aacfa8036fa11d48c2`.

Exactly the three DEFINED alarms. The five owner-ratified READY Specs are absent.

### 4. Recipe 8

Documented body from `docs/agent-surface/recipes.md` §8, run as:

```sh
pnpm --silent sdp:q '<recipe 8 body>' --json
```

Pass 1 exit 0. Pass 2 exit 0. Stdout both times:

```json
{
  "errors": 0,
  "warnings": 5,
  "byValidator": {
    "honesty/gaps": 5
  },
  "signals": [
    {
      "validatorId": "honesty/gaps",
      "family": "honesty",
      "subjectId": "spec:carrier.markdown-authoring",
      "message": "Spec \"spec:carrier.markdown-authoring\" states readiness \"ready\" with no resolving verifier — a gap, informative only (ready never requires delivery facts)."
    },
    {
      "validatorId": "honesty/gaps",
      "family": "honesty",
      "subjectId": "spec:extraction.claim-taxonomy",
      "message": "Spec \"spec:extraction.claim-taxonomy\" states readiness \"ready\" with no resolving verifier — a gap, informative only (ready never requires delivery facts)."
    },
    {
      "validatorId": "honesty/gaps",
      "family": "honesty",
      "subjectId": "spec:model.pack-aggregate",
      "message": "Spec \"spec:model.pack-aggregate\" states readiness \"ready\" with no resolving verifier — a gap, informative only (ready never requires delivery facts)."
    },
    {
      "validatorId": "honesty/gaps",
      "family": "honesty",
      "subjectId": "spec:model.relations",
      "message": "Spec \"spec:model.relations\" states readiness \"ready\" with no resolving verifier — a gap, informative only (ready never requires delivery facts)."
    },
    {
      "validatorId": "honesty/gaps",
      "family": "honesty",
      "subjectId": "spec:model.spec-sections",
      "message": "Spec \"spec:model.spec-sections\" states readiness \"ready\" with no resolving verifier — a gap, informative only (ready never requires delivery facts)."
    }
  ]
}
```

Commission-time recipe 8 was clean. Close-time recipe 8 is five `honesty/gaps` warnings on the five READY Specs. That is the honest current tree, not inherited clean output.

### 5. Bind census and registrar counts

```sh
rg -o 'bindExample\(' test/self-hosting-*.test.ts --count-matches
git ls-files -- 'test/*.test.generated.ts'
python3 -c "import json; print(len(json.load(open('generated/registrars.json'))['files']))"
```

Pass 1 and pass 2 bind census, identical:

```text
test/self-hosting-projections.test.ts:1
test/self-hosting-extraction.test.ts:4
test/self-hosting-carrier-gherkin.test.ts:2
test/self-hosting-consumers.test.ts:5
```

Tracked generated siblings: 56 both passes. `generated/registrars.json` owed files: 68 both passes. First-tranche ten all tracked both passes.

Live `bindExample(` activations, re-read against the current tree:

```text
test/self-hosting-projections.test.ts:751:bindExample(boundSpecPageContract, bindingWorld, bindingLanguageBindings);
test/self-hosting-carrier-gherkin.test.ts:358:bindExample(contractParityContract, world, bindings);
test/self-hosting-carrier-gherkin.test.ts:558:bindExample(unboundReadyRefusedContract, world, bindings);
test/self-hosting-consumers.test.ts:251:bindExample(scriptedContextBodyContract, frontDoorWorld, frontDoorBindings);
test/self-hosting-consumers.test.ts:260:bindExample(demandMapEntriesContract, frontDoorWorld, frontDoorBindings);
test/self-hosting-consumers.test.ts:505:bindExample(conceptEntryContract, readerWorld, readerBindings);
test/self-hosting-consumers.test.ts:514:bindExample(fileEntryContract, readerWorld, readerBindings);
test/self-hosting-consumers.test.ts:523:bindExample(changesetEntryContract, readerWorld, readerBindings);
test/self-hosting-extraction.test.ts:582:bindExample(concretenessRefusalContract, contractsWorld, contractsBindings);
test/self-hosting-extraction.test.ts:591:bindExample(multiEntryExampleContract, contractsWorld, contractsBindings);
test/self-hosting-extraction.test.ts:600:bindExample(caseCollidingPathContract, contractsWorld, contractsBindings);
test/self-hosting-extraction.test.ts:786:bindExample(stepOrderContract, runnerWorld, runnerBindings);
```

12 activations. 12 untracked owed siblings. They match.

## Reconciliation arithmetic

```text
owed generated/registrars.json files     68
tracked generated siblings               56
  first-tranche tracked                  10
  later-tranche tracked                  46
untracked owed refusals                  12
live bindExample census                  12

10 + 46 + 12 = 68
56 + 12 = 68
46 adopted + 12 refused = 58 deferred sites
```

First-tranche ten, still tracked:

- `test/model.stable-ids.namespaced-round-trip.test.generated.ts`
- `test/model.stable-ids.malformed-refusal.test.generated.ts`
- `test/model.anchors.physical-identity.test.generated.ts`
- `test/model.anchors.lookalike-refusal.test.generated.ts`
- `test/carrier.slot-notation.typed-declaration.test.generated.ts`
- `test/carrier.slot-notation.refused-guess.test.generated.ts`
- `test/validation.duplicate-ids.dual-carrier.test.generated.ts`
- `test/validation.kind-evidence.constraints-alone.test.generated.ts`
- `test/validation.kind-evidence.empty-promoted-child.test.generated.ts`
- `test/validation.kind-evidence.untargeted-constraint.test.generated.ts`

Untracked owed refusals, all present on disk, none staged:

- `test/carrier.gherkin-authoring.contract-parity.test.generated.ts`
- `test/carrier.gherkin-authoring.unbound-ready-refused.test.generated.ts`
- `test/consumers.agent-surface.demand-map-entries.test.generated.ts`
- `test/consumers.agent-surface.scripted-context-body.test.generated.ts`
- `test/consumers.binding-language-views.bound-spec-page.test.generated.ts`
- `test/consumers.reader.changeset-entry.test.generated.ts`
- `test/consumers.reader.concept-entry.test.generated.ts`
- `test/consumers.reader.file-entry.test.generated.ts`
- `test/extraction.example-runner.step-order.test.generated.ts`
- `test/extraction.executable-contracts.case-colliding-path.test.generated.ts`
- `test/extraction.executable-contracts.concreteness-refusal.test.generated.ts`
- `test/extraction.executable-contracts.multi-entry-example.test.generated.ts`

Re-read of named siblings in this session: adopted `test/carrier.markdown-parser.bounded-parity.test.generated.ts` is a generated registrar for `spec:carrier.markdown-parser.bounded-parity`. Refused `test/consumers.agent-surface.scripted-context-body.test.generated.ts` is the generated registrar for that example and remains untracked.

## I / J / K summaries copied into plans/37

- I: 46 ADOPT + 12 REFUSE = 58 deferred sites. Frozen adapters untouched. Friction recorded. 68 owed siblings reconcile.
- J: READY only the five owner-ratified Specs. DEFINED exactly `core-model`, `regenerability`, `projections-model` with the recorded blocking reasons. Fresh recipe 2 membership is those three.
- K: `STAND-DOWN (unmet)`. 12 eligible sessions = 8 I + 4 J. Zero qualifying episodes. Empty shared core. Re-entry trigger retained. No later plan commissioned.

## Adversarial probes

| Class | Result |
| --- | --- |
| `stale_state` | Exercised. Validate, recipes 1/2/8, bind census, tracked count, and owed count ran twice on the live tree. Named siblings were re-read. Old ledger rows were not trusted. |
| `dirty_worktree` | Exercised. Staging allowlist is the Todo-18-owned paths below. Boulder, parity plan/evidence/draft, ultrawork notepad, and unrelated `.omo` dirt stay unstaged. |
| `misleading_success_output` | Exercised. Exit 0 was not enough. Warning subjects, recipe-2 ids, recipe-8 validator family, and 10+46+12 arithmetic were checked independently. |
| `generated_cached_artifacts` | Exercised. Graph and census counts came from live validate and `sdp:q`. Generated outputs were not staged. |
| `test_weakening` | Not applicable. No test file changed in this todo. A test-file change would have been an immediate blocker. |
| `malformed_input` | Not applicable. No parser or CLI input surface was exercised. |
| `prompt_injection` | Not applicable. Recipe bodies were copied from `docs/agent-surface/recipes.md` by the operator, not from corpus content. |
| `cancel_resume` | Not applicable. No command was cancelled or resumed. |
| `hung_or_long_commands` | Not applicable. Every command completed inside its bound. No sleep or poll. |
| `flaky_tests` | Not applicable. No test was run for this prose todo. Measurement commands were deterministic across two passes. |
| `repeated_interruptions` | Not applicable. No interruption occurred. |

## Formatting and read-only checks

Recorded after the prose edits, before commit:

- `npx prettier --check plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md .omo/evidence/task-18-plan-37-settling-arc.md .omo/plans/plan-37-settling-arc.md` exit 0, `All matched files use Prettier code style!`
- `git diff --check` over the owned Markdown paths, exit 0
- `node check-self-hosting-gates.mjs .` exit 0, `currentRecord.status` still `EXECUTING`, current plan still plan 37. Read-only. Status was not flipped.

The final full gate was not run. Todo 20 owns it.

## Authorized commit manifest

Stage only:

```text
plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md
.omo/evidence/task-18-plan-37-settling-arc.md
.omo/evidence/plan-37-k-measurement/candidate-session-paths.txt
.omo/evidence/plan-37-k-measurement/census-run-1.txt
.omo/evidence/plan-37-k-measurement/census-run-2.txt
.omo/evidence/plan-37-k-measurement/excluded-session-paths.txt
.omo/evidence/plan-37-k-measurement/inventory.md
.omo/evidence/plan-37-k-measurement/manual-adjudication.md
.omo/evidence/plan-37-k-measurement/qa-missing-record.txt
.omo/evidence/plan-37-k-measurement/verdict.md
.omo/evidence/task-17-plan-37-settling-arc.md
.omo/evidence/task-17-verification-plan-37-settling-arc.md
.omo/evidence/task-16-verification-plan-37-settling-arc.md
.omo/plans/plan-37-settling-arc.md
```

Subject exactly: `docs(plans): plan-37 close record — I ledger, J dispositions, K verdict, re-derived measurements`

Footer exactly: `Plan: .omo/plans/plan-37-settling-arc.md`

Do not stage `.omo/boulder.json`, `.omo/drafts/sdp-skills-gen1-parity.md`, `.omo/evidence/task-1-sdp-skills-gen1-parity.md`, `.omo/evidence/task-1-sdp-skills-gen1-parity-verification.md`, `.omo/evidence/ulw-20260820-081346.05dmOx.md`, `.omo/plans/sdp-skills-gen1-parity.md`, generated outputs, product files, tests, Specs, recipes, or `AGENTS.md`.

## Cleanup

- No scratch directory or temporary transcript was created.
- No generated file was staged.
- No stash, reset, checkout, amend, or push.
- Unrelated working-tree dirt remains untouched.

## Input to Todo 19

Review the I ledger against tracked siblings and quoted refuse shapes, the J table against the owner bundle and live recipe 2, the K verdict against `verdict.md` arithmetic, and the close measurements by re-running the same commands. A "verified" row in this file is not inherited evidence. Re-measure it.
