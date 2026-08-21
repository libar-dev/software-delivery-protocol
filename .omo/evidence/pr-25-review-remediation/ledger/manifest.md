# PR 25 ledger recovery manifest

These archives preserve source bytes without deduplication, reordering, or synthesized events.

| Segment order | Archive | Source | Records | SHA-256 |
| --- | --- | --- | ---: | --- |
| 1 | `architecture-and-prior.jsonl` | `5c15962584f5d21f9a2be0cb0f7a325c21a9267f:.omo/start-work/ledger.jsonl` | 135 | `6f59f9ad05bd7240531f31f7b424b01dde036f07edab771ffd6955ec27b29719` |
| 2 | `design-law-transfer-pre-delete.jsonl` | `d8d4e5f50b2802ea9127819c6953578cfe9618f5:.omo/start-work/ledger.jsonl` | 20 | `df465ad50f857996954b6439bcb900ebcde85e6ae4c0656b1a8e32bce6eb3d90` |
| 3 | `design-law-transfer-post-delete.jsonl` | Current ignored `.omo/start-work/ledger.jsonl`, filtered byte-for-byte to records whose `plan` is `.omo/plans/design-law-transfer.md` | 12 | `5ba013bf39cd635d510b85bb615ddde4438f267527bb198dfbe84ac05f47c4b1` |

The segment order above is the recovery presentation order: the architecture-and-prior snapshot,
the design-law-transfer snapshot immediately before deletion, then the workspace-local records
written after deletion. The archives contain 167 records in total.

## Prefix proof

The 24-record `.omo/start-work/ledger.jsonl` blob on `origin/main` is a byte-for-byte prefix of
the 135-record snapshot at `5c15962584f5d21f9a2be0cb0f7a325c21a9267f`. The proof compares the
complete main blob with the first 24 newline-terminated records of that snapshot and `cmp` exits 0.
The main blob has SHA-256
`2c24afb1cd83e5ecd12ca538da8b17b2d6b970aab3a9e4b3e08492df6c27e415`.

## Chronology boundary

Do not infer a single global chronology, uniqueness, or continuity by concatenating these files.
Commit `726eb9dc1832fbce12bbf26592a9e32fa8de768d` replaced the tracked 135-record
ledger with a new design-law-transfer ledger, and commit
`315a0d8c1bc022c1f98de0bc6897798a21a52078` deleted the tracked runtime ledger.
The snapshots preserve what existed on each side of those overwrite/delete boundaries; timestamps,
append position, and repeated events across segments are evidence only within their source context.

## Runtime/durable boundary

`.omo/start-work/ledger.jsonl` remains ignored workspace runtime state. Required recovery history is
checkpointed under `.omo/evidence/<work-id>/` with immutable source identity, record count, and hash
