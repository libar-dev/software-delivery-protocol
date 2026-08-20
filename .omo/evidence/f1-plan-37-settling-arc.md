# Plan 37 F1 compliance audit

## Verdict

`REJECT`

Plan 37 has one open compliance defect in the Todo 1/Todo 2 commit boundary. The delivered behavior and current graph otherwise reproduce, but F1 cannot approve while an explicit Must NOT and the binding commit strategy are false in history.

## Blocking finding

| Plan requirement | Missing or contradictory evidence | Current-tree reproduction |
| --- | --- | --- |
| `.omo/plans/plan-37-settling-arc.md:84` says Todo 1 must not touch a suite. Line 265 requires each I-lane suite and force-added sibling to land together and forbids commits that mix lanes. | Commission commit `1dae853a6f51bdcb8c4bde16d84dafda611e0fca` adds `test/carrier.markdown-parser.bounded-parity.test.generated.ts`, a Todo 2 generated registrar suite, together with Todo 1 commission files and Todo 3 evidence. The authorized Todo 2 commit `e0810715e743862c79556241811c2b61f41dea55` contains only `.omo/evidence/task-2-plan-37-settling-arc.md` and `test/self-hosting-carrier.test.ts`; its required sibling did not land with it. Todo 18's independent verifier also records that the sibling landed in the commission commit rather than the tracer commit. | `git show --name-status 1dae853 --` shows the generated sibling in the commission manifest. `git show --name-status e081071 --` shows it absent from the tracer manifest. `nl -ba .omo/plans/plan-37-settling-arc.md` at lines 84 and 265 shows both violated requirements. The expected subjects exist, so the defect is manifest atomicity and scope, not a missing subject. |

This is an F1 finding, so Todo 20 remains blocked. No history rewrite or corrective commit was authorized or attempted in this audit.

## Evidence matrix

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

## Audit discipline

I read the operational plan, Plans 36/37, task 1-19 evidence and verifier artifacts, J packets and owner statements, all K artifacts, the ledger, commit history/manifests, and current status. Corpus claims were queried through `sdp q` before carrier inspection. I ran no build, generation, validation, preflight, full check, test, staging, or history-writing command. The only audit write is this file. No scratch file or process remains.
