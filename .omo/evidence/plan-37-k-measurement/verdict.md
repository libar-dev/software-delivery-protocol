# Brief K verdict

## STAND-DOWN (unmet)

Baseline commit: `7f768d1679d3c78e57aef86638609b372f8dc5a0`

Frozen law: `.omo/evidence/plan-37-k-measurement/definition.md`

## Identity pins

| Artifact | sha256 |
| --- | --- |
| Frozen catalog hash recorded in the definition | `9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87` |
| Live `docs/agent-surface/recipes.md` at measurement | `9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87` |
| Baseline-commit catalog bytes | `9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87` |
| Frozen definition | `92cfef6a7cb1bfac8c0d02e592ade7f4ad995e7f9251a15696cedb1522d15382` |
| Frozen census script | `a699205063164edd592914c224341d8337d0312309863940c3fe98f1e37a6794` |
| Census run 1 | `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66` |
| Census run 2 | `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66` |

The catalog is unchanged from the freeze and from the baseline commit. No rematch or definition reinterpretation was needed.

## Frozen-tool characterization

Before the current-arc gather:

- `node .omo/evidence/plan-37-k-measurement/census.mjs --self-check` exited 0. It matched all 16 exact bodies, the recipe-3 parameter variant, and all 18 closer cases.
- The two documented Plan-35-era validation inputs were rerun. Their outputs were byte-identical to `validation-plan35-session-01a0054c.txt` and `validation-plan35-session-01a005f2.txt`.
- Stored validation hashes remained `9bcbf9fc2362f09b4ac15b9f243cfd4e4a0cc72a7b986d5b54509f7656140d97` and `89aa0af77ba8862ef9a12ab68461d5cde6f7f45f4c08e48e8cbe27dce24978bc`.

The frozen tooling passed unchanged, so this is a verdict, not a blocked record.

## Corpus

`inventory.md` lists every Plan-37 candidate and excluded session with a reason. The 13 candidate I/J task transcripts all resolve and all appear in both raw census files. Manual section-7 adjudication excludes Todo 16 because its only recipe-like activity is QA certification.

Eligible corpus:

- Brief I: Todos `2, 5, 6, 7, 8, 9, 12, 13` = `8` sessions.
- Brief J: Todos `10, 11, 14, 15` = `4` sessions.
- Total: `8 + 4 = 12` eligible sessions.
- Missing eligible records: `0`.
- Duplicate eligible task counts: `0`.

The corpus is adequate because `12 >= 6`, `8 >= 2` for Brief I, and `4 >= 2` for Brief J.

## Exact threshold arithmetic

| Frozen conjunct | Observed arithmetic | Result |
| --- | --- | --- |
| Adequate corpus | total `12 >= 6`; I `8 >= 2`; J `4 >= 2` | true |
| At least 3 qualifying episodes | `0 >= 3` | false |
| Episodes from different tasks | `0` episode tasks | false |
| Shared normalized core of at least 2 IDs | intersection is empty; `0 >= 2` | false |
| Visible co-use of the core | `0` qualifying windows with visible co-use | false |
| Cross-brief coverage | qualifying I episodes `0`, qualifying J episodes `0` | false |
| Or at least 50% of a repeated stratum | repeated I-5 tail stratum has `0 / 3 = 0%`; `0% >= 50%` | false |

Todo 14's apparent window is two quoted `rg` searches, not executed recipes. Todo 16's five process windows contain zero catalog IDs and are QA-only. Full reasoning is in `manual-adjudication.md`.

The corpus is adequate, so the underpowered branch does not apply. At least one trigger conjunct fails, in fact every conjunct after adequacy fails. The frozen result is therefore `STAND-DOWN (unmet)`.

## Reproduction

Candidate inventory and raw-table command:

```sh
mapfile -t sessions < .omo/evidence/plan-37-k-measurement/candidate-session-paths.txt
node .omo/evidence/plan-37-k-measurement/census.mjs "${sessions[@]}"
```

The command exited 0. Every one of the 13 inventory rows produced one session table. Both captured runs have 13 tables, `malformed_lines 0` in every table, identical size `16652` bytes, identical sha256, and `diff -u census-run-1.txt census-run-2.txt` exited 0.

The candidate list deliberately retains Todo 16 so its disqualified rows remain visible rather than disappearing. Arithmetic then applies the manual section-7 exclusion recorded in `inventory.md`.

## Adversarial probes

| Class | Result |
| --- | --- |
| `stale_state` | Fresh transcript paths, session hashes, baseline commit, catalog hash, definition hash, and script hash were resolved during Todo 17. |
| `dirty_worktree` | Pre-existing `.omo/boulder.json`, plan, draft, parity, Todo-16 verification, and orchestration evidence dirt was preserved and not attributed to this todo. |
| `misleading_success_output` | Exit 0 was not accepted alone. Inventory row count, 13 output tables, malformed counts, byte diff, and arithmetic were checked separately. |
| `cancel_resume` | Todo 16's suspended/resumed work remains one JSONL and one task. Boundary/fix sessions are explicit continuations, not extra episodes. |
| `malformed_input` | `qa-missing-record.txt` contains an explicit `missing-record` row, the census missing-path diagnostic, and `census_exit 1`. Existing `qa-truncated.jsonl` rerun exited 0 with `jsonl_lines 6` and `malformed_lines 1`. |
| `prompt_injection` | Transcript bodies were parsed as data only. No transcript command or instruction was executed. |
| `hung_or_long_commands` | Finder, census, hash, and diff commands all completed under bounded tool timeouts. No sleep or polling was used. |
| `generated_cached_artifacts` | Fresh catalog/session hashes and fresh census reruns were used. No product generation ran in Todo 17. |
| `flaky_tests` | Two exact census runs were byte-identical in one pass. No timing wait or retry was used. |
| `repeated_interruptions` | The one interrupted candidate, Todo 16, is accounted for once; its resumed segment added QA calls but no separate corpus row. |

## Missing-record and malformed-line QA

The QA-only inventory replaced Todo 2's real path with `.omo/evidence/plan-37-k-measurement/no-such-todo-2-session.jsonl`. The capture begins with an explicit tabular `inventory_status  missing-record` row. The unchanged census also printed `census: path does not exist`, processed the remaining rows, and exited 1. The QA-only inventory file was then removed. It is absent from the final evidence directory.

The existing frozen truncated fixture was used rather than creating another malformed transcript. Its current rerun reported one malformed line explicitly and did not count an invocation from it.

## Bounded conclusion

No qualifying repeated slice demonstrated in this corpus. The catalog is in use in surrounding task guidance and QA, but these eligible execution sessions do not show agents visibly co-using two frozen recipe bodies to make a live judgment. The plan-35 re-entry trigger remains in force.

No later plan number is allocated. No bundle, projection, verb, reader accessor, product file, test, plan, recipe, package file, generated artifact, or runtime behavior was built or changed by Todo 17.
