# Plan 37 F1 compliance audit

## Current final verdict

`APPROVE`

Open findings: **0**.

The owner accepted the exact historical commit-boundary deviations surfaced by F1 and F4. This closes F1's only finding without rewriting history or claiming the original requirements were met.

## Original verdict (historical)

`REJECT`

Plan 37 has one open compliance defect in the Todo 1/Todo 2 commit boundary. The delivered behavior and current graph otherwise reproduce, but F1 cannot approve while an explicit Must NOT and the binding commit strategy are false in history.

## Blocking finding

| Plan requirement | Missing or contradictory evidence | Current-tree reproduction |
| --- | --- | --- |
| `.omo/plans/plan-37-settling-arc.md:84` says Todo 1 must not touch a suite. Line 265 requires each I-lane suite and force-added sibling to land together and forbids commits that mix lanes. | Commission commit `1dae853a6f51bdcb8c4bde16d84dafda611e0fca` adds `test/carrier.markdown-parser.bounded-parity.test.generated.ts`, a Todo 2 generated registrar suite, together with Todo 1 commission files and Todo 3 evidence. The authorized Todo 2 commit `e0810715e743862c79556241811c2b61f41dea55` contains only `.omo/evidence/task-2-plan-37-settling-arc.md` and `test/self-hosting-carrier.test.ts`; its required sibling did not land with it. Todo 18's independent verifier also records that the sibling landed in the commission commit rather than the tracer commit. | `git show --name-status 1dae853 --` shows the generated sibling in the commission manifest. `git show --name-status e081071 --` shows it absent from the tracer manifest. `nl -ba .omo/plans/plan-37-settling-arc.md` at lines 84 and 265 shows both violated requirements. The expected subjects exist, so the defect is manifest atomicity and scope, not a missing subject. |

This is an F1 finding, so Todo 20 remains blocked. No history rewrite or corrective commit was authorized or attempted in this audit.

## Original evidence matrix (historical)

| Area | Independent evidence | Result |
| --- | --- | --- |
| Graph bootstrap and close identity | Fresh `sdp q` reads report 156 Specs, 1 Pack, 314 nodes, 660 edges, and 157 authored anchors represented by 74 CodeNodes plus 83 Anchor nodes. Findings are 0 errors and 5 warnings. | Pass |
| Recipes 1, 2, and 8 | Fresh exact bodies return backlog 0 with exclusions 66/31 and no verifier-less example; three alarms (`projections-model`, `regenerability`, `core-model`), each stated `defined`, floor `ready`, no unmet clause; five `honesty/gaps` warnings on the READY set. | Pass |
| Todos 1-4 | Commission surfaces, discovery failure/happy QA, eight Recipe 9/3 packets, wrong-id result, frozen K definition, Plan-35 tooling checks, nonexistent/truncated input QA, and cleanup receipts exist in the named task evidence. Wave 0 `npm run check` exit 0 is recorded at ledger event `wave 0 gate PASS`. | **Fail only on the Todo 1/Todo 2 manifest finding above** |
| Todo 2 behavior | `registerBoundedParity` is live, its sibling is tracked, split Thens remain contract-derived assertions, tamper detection/restoration is recorded, and Wave 0 later supplied a clean preflight/full gate. | Pass behavior; fail commit boundary |
| Todos 5-9 and Wave 1 pins | Current accounting and evidence show validators 16 ADOPT; Gherkin 11 ADOPT/2 REFUSE; pack Markdown 2 ADOPT; consumers 5 REFUSE; import 1 ADOPT. Wave 1 changed exactly 30 owned anchor sites and retained seven refusal pins. Ledger records the Wave 1 full gate and clean preflight at exit 0. | Pass |
| Todos 10-15 and Wave 2 pins | All eight J packets retain exact Recipe 9/3 output, both judgment readings, and unapplied prepared dispositions. Projection outcome is 10 ADOPT/1 REFUSE; extraction is 5 ADOPT/4 REFUSE. Wave 2 changed 15 owned pins and retained five refusals. The typecheck repair has focused/typecheck evidence; the ledger records the corrected Wave 2 full gate at exit 0. | Pass |
| Todo 16 owner checkpoint | `RATIFICATION-BUNDLE.md` records owner statement `Ratify proposed set`: five READY and three DEFINED. Carriers, oracle descriptors, exact histogram, exact warning objects, recipe 2, and recipe 8 agree. The owner amendment permits only the exact histogram and warning expectation updates. | Pass |
| Todo 17 Brief K | Fresh census output hashes to `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66`, equal to both stored runs. Definition/script/catalog hashes match their pins. Arithmetic is 12 eligible = 8 I + 4 J, 0 qualifying episodes, empty shared core, so `STAND-DOWN (unmet)` follows. | Pass |
| Todo 18 close | The plans/37 record contains the I ledger, eight-row J table, K verdict, and independently sourced close measurements. Current registrar accounting is 56 tracked/live plus 12 owed refusals against 68 manifest siblings: `10 + 46 + 12 = 68`. | Pass |
| Todo 19 review | Commit `a4a1468` has the required subject/footer and four-file manifest. P37-R1 is ACCEPT/CLOSED under owner statement `Approve Brief-I exception`. Current inventory is exactly 56 tracked generated suites = 56 configured generated paths; the lint override remains confined to the 71-path contract-dependent suite set. The separate verifier confirms the closure, and the current Todo 19 checkbox is checked. | Pass |
| Must NOT scope | `git diff a8d5898..HEAD` is empty under `src/`, `package.json`, `docs/agent-surface/recipes.md`, `test/helpers/`, decision Specs, and the frozen runnable-modules Spec. The ten first-tranche registrars are byte-untouched. No bundle, projection, query verb, reader accessor, floor, validator, or unauthorized readiness/content change landed. P37-R1 is the bounded owner exception. | Pass |
| Dependencies and authorized records | Commit ancestry follows commission, I/J waves, owner-ratified Todo 16, K/close Todo 18, then review Todo 19. Required Todo 16/18/19 subjects, Plan footers, and manifests reproduce. Evidence-only work rides recorded checkpoints. The sole incoherent boundary is the blocker above. | Fail on blocker |
| Status and final-wave honesty | Plans/37 and AGENTS say EXECUTING; Plan 36 says DRAFTED. Todo 20 and F1-F5 are unchecked. No task-20 artifact, consecutive-full-check claim, owner final okay, or forged F-wave approval exists. | Pass; Todo 20 correctly blocked |
| Unrelated worktree state | Current `.omo/boulder.json`, parity draft/plan/evidence, and ultrawork note belong to the paused parity/orchestration work. The untracked Todo 19 verifier and checkbox-only Plan 37 diff are Plan 37 verification state. None changes product scope or the verdict finding. | Attributed, preserved |

## Re-audit after owner disposition

Re-audited at commit `28ec9d133999faf6c0aa52679c8aedff0a10c409`.

Owner raw statement: `pprove historical boundary deviations`.

Normalized accepted choice: `Approve historical boundary deviations`.

| Re-audit check | Evidence | Result |
| --- | --- | --- |
| Original requirements remain visible | Todo 1's suite prohibition remains at operational-plan line 84. W1-B and W2-B remain `Commit: N` at lines 175 and 213. The one-I-lane-commit strategy remains at line 265. Lines 267-279 state that those requirements were not met in history and that history was not rewritten. | Pass |
| Accepted scope is exact | `.omo/evidence/plan-37-historical-boundary-disposition.md` accepts only F1-COMMIT-BOUNDARY/F4-B1 and F4-B2: the bounded-parity sibling in `1dae853` versus activation/evidence in `e081071`, plus standalone anchor-pin commits `4a451e2`, `0b098a3`, and `07098f3`. It says no other exception is authorized. The operational and primary Plan 37 records match it. | Pass |
| Historical manifests still reproduce | `1dae853` contains the generated bounded-parity sibling; `e081071` contains the authored suite and Todo 2 evidence. Each of `4a451e2`, `0b098a3`, and `07098f3` changes `test/self-hosting-oracle/anchors.ts` and carries its matching evidence file. | Pass |
| Disposition commit identity and scope | Commit `28ec9d` has exact subject `docs(plans): record plan-37 historical boundary deviations`, exact footer `Plan: .omo/plans/plan-37-settling-arc.md`, and exactly eight paths: F1-F4 artifacts, the owner-disposition record, Todo 19 verification, the operational plan, and primary Plan 37. It has no `src/`, Spec, test, generated, package, AGENTS, Plan 36, or status-header edit. | Pass |
| Earlier passing matrix remains current | Fresh graph reads still report 156 Specs, 1 Pack, 314 nodes, 660 edges, 0 errors, and 5 warnings. Recipes 1/2/8 remain backlog 0 with exclusions 66/31, exactly three DEFINED alarms, and five `honesty/gaps` warnings. Registrar accounting remains 56 tracked/live, 12 refusals, 68 owed. The frozen K census still hashes byte-identically to both stored runs. Commit `28ec9d` changes records only. | Pass |
| Final-wave and status honesty | F2 and F3 are checked and their artifacts say APPROVE. F1, F4, Todo 20, and F5 remain unchecked. Plan 37 and AGENTS remain EXECUTING; Plan 36 remains DRAFTED. No task-20 artifact, final owner okay, all-F-wave approval, or EXECUTED claim exists. | Pass |
| Unrelated current state | Boulder, parity-plan draft/plan/evidence, and the ultrawork note remain unrelated `.omo` state. No product overlap or new F1 requirement results from them. | Pass |

### Closure

F1-COMMIT-BOUNDARY is **ACCEPTED/CLOSED** by the owner disposition. The historical noncompliance remains recorded in the original verdict and finding above. F1 now has zero open findings and APPROVES Plan 37 through Todo 19. Todo 20 remains blocked on the unchecked F4 review, F1-F4 checkbox completion, and the separate final owner okay.

## Audit discipline

I read the operational plan, Plans 36/37, task 1-19 evidence and verifier artifacts, J packets and owner statements, all K artifacts, the ledger, commit history/manifests, and current status. Corpus claims were queried through `sdp q` before carrier inspection. I ran no build, generation, validation, preflight, full check, test, staging, or history-writing command. The only audit write is this file. No scratch file or process remains.
