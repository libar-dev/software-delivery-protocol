# Brief K current-arc session inventory

Measured at baseline commit `7f768d1679d3c78e57aef86638609b372f8dc5a0`.

Sources were resolved fresh from `.omo/start-work/ledger.jsonl`, `.omo/boulder.json`, `.omo/senpi-task/tasks/*.json`, `.omo/senpi-task/children/*/sessions/`, and the two main-session paths under `~/.omo/agent/sessions/--home-darkomijic-dev-libar-software-delivery-protocol--/`. The bundled session finder independently located main session `01a01ab3-2496-7976-ac03-6f41265f4e60`. Child task metadata supplied the child joins. Transcript text was parsed as data only.

Path shorthand `st_X/file.jsonl` means `.omo/senpi-task/children/st_X/sessions/st_X/file.jsonl`. Every candidate task has one transcript file. No candidate transcript is missing. Todo 16 was suspended and resumed inside one JSONL, so it is one session, not two.

## Candidate I/J execution sessions

The census input has 13 rows. Frozen definition section 7 removes Todo 16 after manual classification because every recipe-like invocation in that session is Todo-16 QA certification. This leaves 12 eligible sessions: Brief I 8, Brief J 4.

| Todo | Brief | Task/session | Transcript sha256 | Census result | Eligibility and reason |
| --- | --- | --- | --- | --- | --- |
| 2 | I | `st_01a01aba` / `01a01ab9-d145-7964-aee6-2090a65204dc` | `91d1e828ddb9d6b03304030c98f85f77ff59c095af2aa00ca4967918ab195d2f` | no invocations, no windows | INCLUDE. Completed I-0 registrar tracer adoption with a recoverable transcript. No recipe activity is still an observed zero, not a disqualified recipe-only session. |
| 5 | I | `st_01a01af0` / `01a01af0-93b9-7bc1-a2fc-639a862e4cfc` | `07c48d2ba0dd7248bd896017388bcbbc1f3b937e0045df292562d4868a4f6e14` | no invocations, no windows | INCLUDE. Completed I-1 validators adopt/refuse task. |
| 6 | I | `st_01a01af1` / `01a01af0-9585-7d7c-aecb-8d20ed3d74a8` | `729c8255aecce222fd40cb9ff0c97646e47c3c9467918f36ff20a361bb9f31e2` | no invocations, no windows | INCLUDE. Completed I-2 Gherkin adopt/refuse task. |
| 7 | I | `st_01a01af2` / `01a01af0-95ae-76f6-a2cf-67bb8fb1a74e` | `6ebb0a05054b20bb3b327265ced774a6fe8f2696d853702767895ea0f9efc58d` | no invocations, no windows | INCLUDE. Completed I-5a pack-markdown adopt/refuse task. |
| 8 | I | `st_01a01af3` / `01a01af0-95dc-78f5-8596-95bc3042383f` | `8f2064b42022728bb21141d03e0ef33a998c3d3a7d845962ca6624b2ac49284a` | no invocations, no windows | INCLUDE. Completed I-5b consumers adopt/refuse task. |
| 9 | I | `st_01a01af4` / `01a01af4-3ee2-7d9d-9e90-bf9df739f5f7` | `0e4cbd20ad9aaea585f306f5dc7d01ab50d57d73d59038a088ac658e96cfaa55` | no invocations, no windows | INCLUDE. Completed I-5c import adopt/refuse task. |
| 10 | J | `st_01a01af5` / `01a01af4-6dd8-7034-9be4-d73eb85bf8a7` | `fe763592b9f690d52c26bdb161e9fb263049e51ee2808b95643d9765c9926d48` | no invocations, no windows | INCLUDE. Completed J-model packet task. Reused prior recipe output in its packet does not become a transcript invocation. |
| 11 | J | `st_01a01af6` / `01a01af6-e91b-7f93-9af6-279096b73a30` | `cbc568100a10390e293a8261c2dd8f991db19452ea06616f75138d45e97c2774` | no invocations, no windows | INCLUDE. Completed J-extraction packet task. Reused task-3 output and quoted bodies are not executions. |
| 12 | I | `st_01a01b21` / `01a01b21-8016-7627-9d07-9205282567f2` | `1a6789c2664db36ddb6c3269abd9e2310de7faade38d4dd8e89255426437d936` | no invocations, no windows | INCLUDE. Completed I-3 projections adopt/refuse task. |
| 13 | I | `st_01a01b22` / `01a01b21-81e7-7a3b-89a8-e0ff3621616a` | `4039111b51f10aa77c9579b0aa6f57955ee2bdbc0d4b2cc1f0d32ee301cc5917` | no invocations, no windows | INCLUDE. Completed I-4 extraction adopt/refuse task. |
| 14 | J | `st_01a01b23` / `01a01b21-821b-763c-abec-d0141c8924ee` | `d14d697fa12a6430738fe5b261479a8d9039e8c8cb187c0170b8f019bc469109` | two `missing` rows, one apparent window | INCLUDE as a completed J-consumers packet task. Manual inspection proves both rows are false-positive quoted `sdp:q` strings inside `rg` commands, so they are disqualified and the apparent window is not real. |
| 15 | J | `st_01a01b24` / `01a01b21-824e-7f5e-88ac-d1950ed1f39e` | `c5e9a7ce95c8f7d0591f59934cdd97f7bca9e2083b0192c1ba452488a7940bb9` | no invocations, no windows | INCLUDE. Completed J-carrier packet task. |
| 16 | J | `st_01a01dd3` / `01a01dd3-8d44-7638-ab70-355b65ca0ac7` | `af0b25d090ef6b9bdead5182c8667e512339bd53266c6f522400acd230a02b9f` | nine `unmatched` rows, five candidate windows, zero recipe IDs | EXCLUDE after adjudication. The session's only recipe-like activity is the todo's baseline, post-edit, failure-diagnosis, and final certification reruns. Definition section 7 excludes QA-certification-only recipe activity. The suspend/resume is one continued task session. |

The exact candidate input is `candidate-session-paths.txt`. `census-run-1.txt` and `census-run-2.txt` contain all 13 per-session tables. Each table reports `malformed_lines 0`.

## Ineligible and supporting sessions

Every Plan-37 planning, orchestration, verifier, continuation, review, and K session found in the same stores is listed here. These rows never enter the adequacy denominator. `excluded-session-paths.txt` records the exact resolved JSONL path for every row, including Todo 16 because manual adjudication removes it from the candidate set.

| Task/session | Status | Exclusion reason |
| --- | --- | --- |
| `st_01a01a8f` Extract plan-35 F/H | completed | Planning/research before Plan 37 execution. |
| `st_01a01a90` Map registrar mechanics | completed | Planning/research. |
| `st_01a01a91` Readiness evidence study | completed | Planning/research. |
| `st_01a01a92` Map bundle measurement | completed | Planning/research. |
| `st_01a01a93` Arc decomposition advisory | completed | Advisory. |
| `st_01a01a94` Measurement-design advisory | completed | Advisory. |
| `st_01a01aac` Metis gap analysis | lost, transcript present | Interrupted planning session. Its transcript is recoverable, but it is neither completed nor I/J execution. |
| main `01a01ab3-2496-7976-ac03-6f41265f4e60` | completed/resumed orchestration | Main coordinator for dispatch, commits, gates, and PR preparation. Not one I/J execution todo. Transcript sha256 `ac956d65af8113eab2417d1212db66e5ed8645a11bacc0d19e5a2a99d9d918ca`. |
| main `01a01dbd-9d4b-71fb-969c-e5de40ffb83e` | active orchestration | Resumed coordinator for owner ratification and Todo 16/17 dispatch. Not one I/J execution todo. Transcript sha256 `04b3b93317626da10583812fe974da54b85494a9854d705e6d883f5727d6c1bf`. |
| `st_01a01ab9` Todo 1 commission | completed | Commission hygiene. |
| `st_01a01abb` Todo 3 J preflight/template | completed | Preflight/template task, not an actual drift-alarm packet or ratification apply. Its prescribed recipe runs are corroboration only. |
| `st_01a01abc` Todo 4 definition/census | completed | K activity, explicitly excluded. |
| `st_01a01abf` verify Todo 1 | completed | Verifier-only. |
| `st_01a01ac0` verify Todo 2 | completed | Verifier-only; Todo 2 is counted once through its executor. |
| `st_01a01ac1` verify Todo 3 | completed | Verifier-only. |
| `st_01a01acd` verify Todo 4 | completed | K verifier-only. |
| `st_01a01ae3` temporal-token fix | completed | Wave-gate repair, not a distinct I/J todo. |
| `st_01a01ae8` tracer anchor-pin flip | completed | Todo-2 continuation/integration. Count Todo 2 once. |
| `st_01a01af7` verify Todo 6 | completed | Verifier-only. |
| `st_01a01afa` verify Todo 7 | completed | Verifier-only. |
| `st_01a01afb` verify Todo 8 | completed | Verifier-only. |
| `st_01a01afc` verify Todo 9 | completed | Verifier-only. |
| `st_01a01afd` verify Todo 10 | completed | Verifier-only. |
| `st_01a01afe` verify Todo 11 | completed | Verifier-only. |
| `st_01a01b04` verify Todo 5 | completed | Verifier-only. |
| `st_01a01b17` Wave-1 anchor-pin writer | completed | Shared continuation for Todos 5-9. Count each plan todo once, not this support task. |
| `st_01a01b1b` verify Wave-1 pins | completed | Verifier-only. |
| `st_01a01b25` verify Todo 14 | completed | Verifier-only. |
| `st_01a01b26` verify Todo 15 | completed | Verifier-only. |
| `st_01a01b3e` verify Todo 13 | completed | Verifier-only. |
| `st_01a01b41` verify Todo 12 | completed | Verifier-only. |
| `st_01a01b48` Wave-2 anchor-pin writer | completed | Shared continuation for Todos 12-13. |
| `st_01a01b4b` verify Wave-2 pins | completed | Verifier-only. |
| `st_01a01b55` projections type fix | completed | Todo-12 continuation after the gate found a type error. Todo 12 is counted once. |
| `st_01a01b59` verify projections type fix | completed | Verifier-only. |
| `st_01a01b63` assemble ratification bundle | completed | Owner-checkpoint aggregation of existing J packets, not a distinct packet or apply todo. |
| `st_01a01b78` draft-PR goal review | completed | Review. |
| `st_01a01b79` branch QA | completed | QA-certification session. |
| `st_01a01b7a` code/evidence review | completed | Review. |
| `st_01a01b7b` security audit | completed | Review. |
| `st_01a01b7c` GitHub context mining | completed | Review/advisory. |
| `st_01a01dbf` verify Plan-37 closure gate | completed | Close-gate verifier. |
| `st_01a01dc5` independently verify blocker | completed | Close-gate/advisory verifier. |
| `st_01a01dda` adjudicate Todo-16 scope conflict | completed | Review/advisory continuation during the interrupted Todo-16 chain. |
| `st_01a01de7` verify Todo-16 commit | completed | Verifier-only. |
| `st_01a01df5` Todo 17 measurement | running | K's own activity, explicitly excluded. |

The six `st_01a01da0` through `st_01a01dbb` skill-plan sessions belong to `sdp-skills-gen1-parity`, not Plan 37, and are outside this inventory. No close-record, final-review, or Todo-20 session existed at measurement time.

## Missing, duplicate, and resume accounting

- Missing candidate records: `0/13` before the QA mutation.
- Duplicate candidate transcript files: `0`.
- Todo 16 suspend/resume fragments: one JSONL and one task identity, classified once and excluded as QA-only.
- Shared boundary/fix sessions: listed above as continuations, never promoted into extra eligible tasks.
- The two main sessions are orchestration records, not substitutes for child execution transcripts.
