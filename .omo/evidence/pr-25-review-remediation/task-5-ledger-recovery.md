# Task 5 ledger recovery evidence

Scope: archive every lost ledger segment and clarify the runtime-to-durable checkpoint rule.
The source runtime ledger was read only at
`/home/darkomijic/dev-libar/software-delivery-protocol/.omo/start-work/ledger.jsonl`.
No runtime-ledger, plan, Boulder, temporal-validator, installed-skill, push, merge, or PR mutation occurred.

## Pinned starting state

```
branch=work/pr25-ledger-recovery
HEAD=3c603e3cba716fb91fed24ec75aeff50ebcc451f
source_runtime_records=12
source_runtime_sha256=5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1
5c15962584f5d21f9a2be0cb0f7a325c21a9267f type=commit
d8d4e5f50b2802ea9127819c6953578cfe9618f5 type=commit
```

The worktree was clean at the checkpoint. The two historical source objects and the current
ignored runtime source were pinned before archive creation.

## Happy-path archive verification

Each non-empty line was parsed with `JSON.parse`, then required to be a non-null, non-array object.

```
.omo/evidence/pr-25-review-remediation/ledger/architecture-and-prior.jsonl: 135 JSON objects
6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719
.omo/evidence/pr-25-review-remediation/ledger/design-law-transfer-pre-delete.jsonl: 20 JSON objects
df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90
.omo/evidence/pr-25-review-remediation/ledger/design-law-transfer-post-delete.jsonl: 12 JSON objects
5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1
```

Byte comparisons used the archive as one operand and a process substitution of the source stream
as the other. The post-delete source stream selected lines from the current ignored ledger whose
`plan` field is `.omo/plans/design-law-transfer.md` without reserializing JSON.

```
architecture_cmp_exit=0
pre_delete_cmp_exit=0
post_delete_cmp_exit=0
concatenated_records=167
```

Main-prefix proof:

```
main_records=24
main_sha256=2c24afb1cd83e5ecd12ca538da8b17b2d6b970aab3a9e4b3e08492df6c27e415
main_prefix_cmp_exit=0
```

The complete `origin/main:.omo/start-work/ledger.jsonl` stream was compared with the first 24
records of `architecture-and-prior.jsonl`; `cmp` exited 0. This establishes a byte prefix only,
not global chronology across the later overwrite boundary.

## Runtime and temporal boundary

```
$ git check-ignore -v .omo/start-work/ledger.jsonl
.gitignore:25:.omo/*  .omo/start-work/ledger.jsonl
check_ignore_exit=0
current_tracked_runtime=
$ git ls-tree -r --name-only d8d4e5f50b2802ea9127819c6953578cfe9618f5 -- .omo/start-work/ledger.jsonl
.omo/start-work/ledger.jsonl
runtime_diff_bytes=0
source_runtime_count_hash=12 5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1
$ node check-temporal.mjs
temporal_exit=0
```

The historical tree query proves the runtime path can be tracked despite an ignore pattern; that
historical state is outside the clarified policy. The current index is empty for the path, while
durable recovery lives under the explicitly tracked `.omo/evidence/<work-id>/` boundary. This
proof used tree/index inspection only: it did not stage, create, remove, or modify a runtime ledger.
`git diff -- .omo/start-work/ledger.jsonl check-temporal.mjs` was empty.

## Failure QA

For each archive, `head -c -1` supplied a non-mutating in-memory stream. No temporary file was
created. Every one-byte-short stream changed the hash and failed `cmp`:

```
architecture-and-prior.jsonl
  expected=6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719
  one_byte_removed=d28128815ff7066e2c8a933728bb6275e58e7b760fb172d1c87788efe1d509f1
  hash_equal=no cmp_exit=1
design-law-transfer-pre-delete.jsonl
  expected=df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90
  one_byte_removed=a27121eefcaea2e729cead4b88862a8fc942076340ab174a208bdce81b7c9a26
  hash_equal=no cmp_exit=1
design-law-transfer-post-delete.jsonl
  expected=5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1
  one_byte_removed=a4a96f18d7779092a4ebf188092e577d5542e69a7e3893d42e0182d83a2539ca
  hash_equal=no cmp_exit=1
```

Malformed input was also tested in memory without altering an archive:

```
invalid JSONL rejected: SyntaxError
malformed_probe_exit=1
```

## Adversarial map

- `stale_state`: applicable and passed; exact source commits and the ignored-ledger hash were pinned before work.
- `generated_or_cached_artifacts`: applicable and passed; all three generated archives were checked by parse, count, hash, and source-byte comparison.
- `dirty_worktree`: applicable and passed; the lane began clean, the runtime source remained external/read-only, and only scoped policy/evidence paths changed.
- `misleading_success_output`: applicable and passed; exit status alone was insufficient, so object shape, counts, hashes, byte comparisons, and source identity were all checked.
- `malformed_input`: applicable and passed; invalid JSONL failed parsing with `SyntaxError` and exit 1.
- `prompt_injection`: not applicable; all inputs are repository-owned JSONL and policy text, with no instruction-bearing external corpus.
- `cancel_resume`: not applicable; no resumable operation or interrupted state transition exists in this file-only task.
- `hung_or_long_commands`: not applicable; all bounded local Git, Node, hash, and comparison commands returned immediately.
- `flaky_tests`: not applicable; verification is deterministic byte and parser behavior with no time, network, concurrency, or retry dependency.
- `repeated_interruptions`: not applicable; execution was continuous with no resumed mutation.

## Diagnostics

Markdown diagnostics were requested for `AGENTS.md`, `ledger/manifest.md`, and this evidence file.
All three returned the same infrastructure failure: `LSP daemon unreachable` at
`/home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock`; the MCP proxy does not run a language server
in-process. No type-bearing source changed. `git diff --check` and the temporal gate both passed.

## Cleanup and residual risk

No temporary file, process, generated build tree, stash, or external write remains. The one-byte
and malformed probes were in-memory streams. The index contains only the seven task-owned files.
The runtime ledger remains 12 records at its pinned hash. Residual risk is limited to consumers
incorrectly concatenating the three snapshots as a globally ordered event stream;
`ledger/manifest.md` explicitly prohibits that inference.
