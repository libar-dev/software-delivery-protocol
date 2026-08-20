# Task 17 - Brief K gather and verdict

## Result

`STAND-DOWN (unmet)`

Baseline: `7f768d1679d3c78e57aef86638609b372f8dc5a0`.

The adequate corpus contains 12 eligible sessions, 8 Brief I and 4 Brief J. Manual adjudication found 0 qualifying episodes and no shared recipe core. The plan-35 trigger is retained. No plan number was allocated and no product work was performed.

Primary record: `.omo/evidence/plan-37-k-measurement/verdict.md`.

## Commands and results

| Command | Result |
| --- | --- |
| Bundled `find-agent-sessions.py find` with Plan-37, settling-arc, and recipe query lanes, Senpi platform, cwd filter, and child inclusion | Located the Plan-37 main session. Child joins were then resolved from task metadata and child stores as the Senpi reference directs. |
| `node .omo/evidence/plan-37-k-measurement/census.mjs --self-check` | Exit 0; 16 exact bodies plus recipe-3 variant and 18 closer cases matched. |
| Census over both documented Plan-35-era inputs | Exit 0; each result hash exactly matched its frozen validation file. |
| `sha256sum` over catalog, definition, script, candidate transcripts, and main transcripts | Fresh pins recorded in `inventory.md` and `verdict.md`; live and baseline catalog equal the frozen hash. |
| `mapfile -t sessions < .../candidate-session-paths.txt; node .../census.mjs "${sessions[@]}"` | Exit 0; 13 input rows produced 13 tables; all report zero malformed lines. |
| The same census command captured twice, then `diff -u census-run-1.txt census-run-2.txt` | Exit 0; both files are 16652 bytes and sha256 `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66`. |
| QA-only inventory replacing Todo 2's path with a nonexistent path | Explicit `missing-record` row, census missing-path diagnostic, and exit 1; capture retained as `qa-missing-record.txt`. |
| Census over existing `qa-truncated.jsonl` | Exit 0; `jsonl_lines 6`, `malformed_lines 1`. |
| Final status allowlist against the opening snapshot | No new change outside the two allowed Todo-17 evidence roots. Product, tests, plans, recipes, package files, and runtime unchanged. |

Markdown diagnostics were requested, but the workspace LSP daemon was unreachable. This is prose evidence, and all executable checks above completed.

## Manual QA

Artifact: `.omo/evidence/plan-37-k-measurement/manual-adjudication.md`.

- Todo 14's two apparent calls are quoted `sdp:q` strings inside `rg` commands. They are not executions.
- Todo 16 has five process windows, nine unmatched bodies, and zero catalog IDs. Every run is Todo-16 baseline or post-edit certification, so the QA-only disqualifier removes the session from corpus adequacy.
- Every other candidate session has no census invocation and no window.
- Qualifying episodes: `0`.
- Shared normalized recipe core: `[]`.
- Repeated I-5 tail stratum coverage: `0/3 = 0%`.

## Evidence files added

- `.omo/evidence/plan-37-k-measurement/candidate-session-paths.txt`
- `.omo/evidence/plan-37-k-measurement/census-run-1.txt`
- `.omo/evidence/plan-37-k-measurement/census-run-2.txt`
- `.omo/evidence/plan-37-k-measurement/excluded-session-paths.txt`
- `.omo/evidence/plan-37-k-measurement/inventory.md`
- `.omo/evidence/plan-37-k-measurement/manual-adjudication.md`
- `.omo/evidence/plan-37-k-measurement/qa-missing-record.txt`
- `.omo/evidence/plan-37-k-measurement/verdict.md`
- `.omo/evidence/task-17-plan-37-settling-arc.md`

Frozen Todo-4 files were read and executed but not modified.

## Cleanup

- QA-only `qa-missing-inventory.txt` removed after the failure scenario.
- No temporary transcript was created; the existing truncated fixture was used.
- No census/finder process, scratch process, or temporary path remains.
- No staging, commit, push, product generation, or test mutation.
- Pre-existing unrelated `.omo` working-tree changes remain untouched.

## Risks and limits

The frozen blind spots remain: no token record, invisible in-process reader use, and invisible mental assembly. They do not lower the thresholds. The observed corpus is adequate but has no qualifying episode, so the conclusion is bounded to these transcripts.

## Input to Todo 18

Todo 18 should copy the verdict exactly as `STAND-DOWN (unmet)`, report `12` eligible sessions as `8 I + 4 J`, `0` qualifying episodes, shared core `[]`, and state that the plan-35 re-entry trigger remains. It should point to `verdict.md` for the arithmetic and must not allocate a later plan number or infer any product change from this measurement.
