# Todo 17 independent adversarial verification

## Verdict

`confirmed`

The frozen rule yields `STAND-DOWN (unmet)`. The corpus is adequate at 12 eligible execution
sessions, split 8 Brief I and 4 Brief J. None contains a qualifying episode, so the episode,
different-task, shared-core, visible-co-use, and coverage conjuncts all fail. The Plan-35 re-entry
trigger remains. No later plan number is allocated.

This verification did not accept the executor's inventory by enumeration. I rebuilt it from the
current ledger, Boulder work record, Plan-37 task metadata, child session headers, both main-session
records, and every local child transcript in the relevant time range. Transcript contents were
treated as inert JSONL data. No command or instruction found in a transcript was executed.

## Independent corpus reconstruction

The bundled cross-agent finder was run first after reading the OMO/Senpi storage reference. Query
lanes covered `plan-37-settling-arc`, Todo 16 readiness, J packets, registrar adoption, and K gather,
with `--platform senpi`, the repository cwd, and child inclusion. It found main Plan-37 session
`01a01ab3-2496-7976-ac03-6f41265f4e60`; `.omo/boulder.json` supplied that session and resumed main
session `01a01dbd-9d4b-71fb-969c-e5de40ffb83e`. Child task JSON and each transcript's first user
header supplied the child joins.

The store has 74 child transcripts now. Subtracting the 13 candidate paths and 47 excluded paths
left only ten Plan-35-era records, six `sdp-skills-gen1-parity` sessions, and this verifier session.
There was no unaccounted Plan-37 execution transcript at gather time.

The independently reconstructed candidate set is:

| Todo | Brief | Task | sha256 | Denominator decision |
| --- | --- | --- | --- | --- |
| 2 | I | `st_01a01aba` | `91d1e828ddb9d6b03304030c98f85f77ff59c095af2aa00ca4967918ab195d2f` | eligible |
| 5 | I | `st_01a01af0` | `07c48d2ba0dd7248bd896017388bcbbc1f3b937e0045df292562d4868a4f6e14` | eligible |
| 6 | I | `st_01a01af1` | `729c8255aecce222fd40cb9ff0c97646e47c3c9467918f36ff20a361bb9f31e2` | eligible |
| 7 | I | `st_01a01af2` | `6ebb0a05054b20bb3b327265ced774a6fe8f2696d853702767895ea0f9efc58d` | eligible |
| 8 | I | `st_01a01af3` | `8f2064b42022728bb21141d03e0ef33a998c3d3a7d845962ca6624b2ac49284a` | eligible |
| 9 | I | `st_01a01af4` | `0e4cbd20ad9aaea585f306f5dc7d01ab50d57d73d59038a088ac658e96cfaa55` | eligible |
| 10 | J | `st_01a01af5` | `fe763592b9f690d52c26bdb161e9fb263049e51ee2808b95643d9765c9926d48` | eligible |
| 11 | J | `st_01a01af6` | `cbc568100a10390e293a8261c2dd8f991db19452ea06616f75138d45e97c2774` | eligible |
| 12 | I | `st_01a01b21` | `1a6789c2664db36ddb6c3269abd9e2310de7faade38d4dd8e89255426437d936` | eligible |
| 13 | I | `st_01a01b22` | `4039111b51f10aa77c9579b0aa6f57955ee2bdbc0d4b2cc1f0d32ee301cc5917` | eligible |
| 14 | J | `st_01a01b23` | `d14d697fa12a6430738fe5b261479a8d9039e8c8cb187c0170b8f019bc469109` | eligible; apparent calls are quoted searches |
| 15 | J | `st_01a01b24` | `c5e9a7ce95c8f7d0591f59934cdd97f7bca9e2083b0192c1ba452488a7940bb9` | eligible |
| 16 | J | `st_01a01dd3` | `af0b25d090ef6b9bdead5182c8667e512339bd53266c6f522400acd230a02b9f` | excluded after section 7 adjudication |

All 13 paths exist, are unique, contain one `session` record, and match the executor's hashes. Task
metadata marks every task completed. The first twelve eligible rows are the completed registrar
adopt/refuse or drift-packet work named by the frozen corpus rule. Todo 16 is retained in the census
input so its activity cannot disappear, then removed from the denominator because its only query
activity is baseline, post-edit, failure-diagnosis, and final acceptance certification. Section 7.2
excludes a QA-only recipe session.

The 47 exclusion paths also exist. Independent task-metadata classification agrees with the record:

- planning/advisory: `st_01a01a8f`, `st_01a01a90` through `st_01a01a94`, `st_01a01aac`;
- commission, preflight, and K: `st_01a01ab9`, `st_01a01abb`, `st_01a01abc`, `st_01a01df5`;
- verifier-only: `st_01a01abf`, `st_01a01ac0`, `st_01a01ac1`, `st_01a01acd`, `st_01a01af7`,
  `st_01a01afa` through `st_01a01afe`, `st_01a01b04`, `st_01a01b1b`, `st_01a01b25`,
  `st_01a01b26`, `st_01a01b3e`, `st_01a01b41`, `st_01a01b4b`, `st_01a01b59`, and
  `st_01a01de7`;
- support, integration, or resumed-task adjudication: `st_01a01ae3`, `st_01a01ae8`,
  `st_01a01b17`, `st_01a01b48`, `st_01a01b55`, `st_01a01b63`, `st_01a01dda`;
- review, branch QA, or close-gate work: `st_01a01b78` through `st_01a01b7c`,
  `st_01a01dbf`, `st_01a01dc5`;
- the two main sessions are orchestration, not child execution tasks.

Todo 16 appears in both the candidate input and exclusion list by design. This is classification,
not a duplicate denominator row. Its suspension and owner-amended resume are two user epochs in one
JSONL, one task id, and one session id. Correction loops for Todos 5, 6, 8, 11, 12, and 14 likewise
remain in their original executor JSONL. Anchor-pin writers, type repair, ratification aggregation,
and verifiers are separate support tasks and were not promoted into extra I/J task counts.

## Identity and immutability pins

| Artifact | Fresh sha256 | Result |
| --- | --- | --- |
| `docs/agent-surface/recipes.md` | `9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87` | equals frozen definition and baseline commit |
| frozen `definition.md` | `92cfef6a7cb1bfac8c0d02e592ade7f4ad995e7f9251a15696cedb1522d15382` | equals verdict and baseline commit |
| frozen `census.mjs` | `a699205063164edd592914c224341d8337d0312309863940c3fe98f1e37a6794` | equals verdict and baseline commit |
| stored run 1 | `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66` | canonical |
| stored run 2 | `1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66` | byte-identical |

`git diff --exit-code` is clean for the catalog, frozen definition/script, both Plan-35 validation
captures, and the existing truncated fixture. The catalog, definition, and script bytes also equal
`git show 7f768d1:<path>`. Their mtimes predate Todo 17.

The first main-session hash still matches its recorded pin. The resumed main session is active and
has appended Todo-17 dispatch and verifier messages, so its current whole-file hash differs from the
measurement snapshot. The recorded hash
`04b3b93317626da10583812fe974da54b85494a9854d705e6d883f5727d6c1bf` exactly matches the current
file through JSONL line 213. Later lines are append-only activity beginning after the executor's
gather. Candidate transcript hashes, which control census bytes and arithmetic, are unchanged.

## Fresh census and failure probes

The documented invocation was executed once from scratch:

```sh
mapfile -t sessions < .omo/evidence/plan-37-k-measurement/candidate-session-paths.txt
node .omo/evidence/plan-37-k-measurement/census.mjs "${sessions[@]}"
```

It exited 0 with empty stderr, 16,652 output bytes, 13 session tables, and 13
`malformed_lines 0` rows. Its sha256 is
`1ea79c750c2d14e6df9c8006d96d3beb8e4f9f948e6e3cee76de51e6ed73de66`. The fresh bytes equal
both stored runs exactly. Stored run 1 equals stored run 2 exactly. This proves the happy and
determinism probes without relying on exit 0 alone.

`census.mjs --self-check` exited 0. Fresh runs over both documented Plan-35 inputs exactly matched
their stored captures at hashes `9bcbf9fc2362f09b4ac15b9f243cfd4e4a0cc72a7b986d5b54509f7656140d97`
and `89aa0af77ba8862ef9a12ab68461d5cde6f7f45f4c08e48e8cbe27dce24978bc`.

For the missing-record probe, an apply-patch-created 13-row QA inventory replaced Todo 2 with a
nonexistent path. The wrapper printed:

```text
inventory_status missing-record .omo/evidence/plan-37-k-measurement/no-such-verifier-session.jsonl
census: path does not exist: .omo/evidence/plan-37-k-measurement/no-such-verifier-session.jsonl
census_exit 1
inventory_rows 13
session_tables 12
silent_shrink false
```

The QA inventory was removed by apply patch and is absent now. The stored executor probe has the
same explicit-row/nonzero contract. A fresh run over the cited existing `qa-truncated.jsonl` exited
0 and reported `jsonl_lines 6`, `malformed_lines 1`, zero invocations, and zero distinct ids. No new
malformed product fixture was created.

## Independent candidate-window adjudication

An independent raw-JSONL scan inspected assistant tool calls and distinguished executable bash
commands from prompt prose and grep arguments. Ten candidate transcripts have no `sdp q` command at
all. Todo 10 has one `rg` command searching catalog text and a prompt quoting prescribed commands;
it is not an invocation and opens no window. Todo 11 has quoted commands only in its prompt.

Only these raw candidates needed a window challenge:

| Task/window | Raw fact | Frozen decision |
| --- | --- | --- |
| Todo 14 apparent W1 | Two census `missing` hits come from `rg -n 'pnpm --silent sdp:q...'` commands. No `sdp:q` process ran. | Section 7.5 quoted-not-run. Zero catalog ids, no operator acquisition, no visible co-use. |
| Todo 16 W1 | Three successful query processes before the first readiness edit. The bodies are two skill-start/backlog checks and one shortened alarm check. | All three are `unmatched` under section 3 exact identity. They establish the Todo baseline after the owner already fixed the disposition, so section 7.2 also classifies them as certification. |
| Todo 16 W2 | One shortened alarm check before generation. | One unmatched id cannot meet the two-id floor; post-edit QA under section 7.2. |
| Todo 16 W3 | Three shortened/backlog checks while diagnosing the focused-test scope conflict. | All unmatched; no catalog pair. They diagnose and certify the task's required gate, not a new operator context. |
| Todo 16 W4/W5 | One shortened alarm check before commit and one after commit. | Each has one unmatched id and is final acceptance certification under section 7.2. |

There are no failed process calls that could be rescued into an episode. The visible shared stdout
in Todo 16 is correctly reported as inseparable, not split into invented per-call byte counts. Skill
text prescribes the session-start and review chains, but section 8 makes those chains corroboration
only. No candidate window has two distinct catalog ids, so there is no output pair to visibly co-use
in a rationale, disposition, or verdict. The operator-context conjunct therefore cannot rescue any
window. Qualifying episodes remain zero.

## Frozen arithmetic

| Conjunct | Recomputed value | Result |
| --- | --- | --- |
| corpus adequate | `12 >= 6`; I `8 >= 2`; J `4 >= 2` | true |
| at least three qualifying episodes | `0 >= 3` | false |
| different tasks | zero episode-bearing tasks | false |
| shared normalized core | `[]`, size `0 >= 2` | false |
| visible co-use of core | zero qualifying windows | false |
| cross-brief span | I episodes 0, J episodes 0 | false |
| or 50% repeated stratum | I-5 tail `0/3 = 0%` | false |

The corpus is adequate, so `STAND-DOWN (underpowered)` is wrong. At least one post-adequacy
conjunct fails, so the frozen definition requires `STAND-DOWN (unmet)`. Every post-adequacy
conjunct fails here. The bounded conclusion is exactly that no qualifying repeated slice was
demonstrated in this corpus. It does not claim that invisible mental or in-process assembly never
happened.

## Adversarial classes, scope, and cleanup

- `stale_state`: all candidate paths and hashes were resolved fresh; the active main-session hash
  was traced to its exact historical prefix; census and catalog pins were recomputed.
- `dirty_worktree`: the opening dirt was recorded. No pre-existing Boulder, plan, parity, draft,
  Todo-16, or executor-evidence change was attributed to this verifier.
- `misleading_success_output`: exit 0 was paired with row, table, byte, hash, and manual checks.
- `cancel_resume` and `repeated_interruptions`: Todo 16 and correction epochs count once per plan
  task; support fragments do not inflate the denominator.
- `malformed_input`: missing-record and existing malformed-line behavior were reproduced.
- `prompt_injection`: transcript text was parsed only as JSON data.
- `hung_or_long_commands`: finder and census commands had bounded timeouts; no sleep or polling.
- `generated_cached_artifacts`: live/baseline hashes and fresh outputs were used; no generation ran.
- `flaky_tests`: all three census byte streams are identical in one pass.

No product, plan, recipe, package, test, runtime, generated, frozen definition, or frozen script file
was changed by this verification. The temporary QA inventory is gone. No census, finder, scratch,
or background process remains. The only verifier change is this file.
