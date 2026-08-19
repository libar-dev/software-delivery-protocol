# Task 4 — Brief K measurement definition + read-only census

Lane: w0-t4. Plan: `.omo/plans/plan-37-settling-arc.md` todo 4.
No product surface was touched. No verdict was rendered. No 2026-08-19 session was opened for gather/verdict.

## Freeze-before-results (stale_state probe)

Ordering is the load-bearing fact. Recorded from `stat` / `find` on this workstation:

| When (local, +02:00) | What | Proof |
| --- | --- | --- |
| 2026-08-19T17:53:41 | measurement dir created empty | `mkdir` then `ls` showed only `.` / `..` |
| 2026-08-19 17:54:55 | `definition.md` first written | first mtime; directory contained this file only |
| 2026-08-19 18:00:51 | catalog sha256 + freeze-mtime annotation appended to `definition.md` | still no `census.mjs`, still no session tables |
| 2026-08-19 18:09:48 | `census.mjs` last edit | after the freeze file |
| 2026-08-19 18:10:51 | first captured census tables | `validation-plan35-session-*.txt` |

`definition.md` mtime **18:00:51.049200155** precedes every census output file (**18:10:51.113692589** earliest). The operational rules themselves were on disk at **17:54:55**, before the script existed.

Catalog baseline frozen in the definition:

`docs/agent-surface/recipes.md` sha256 `9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87`

Shape inspection of plan-35-era jsonl / ledger (required to write the parser) happened **after** the freeze and is **not** a verdict: no §5 arithmetic, no MET/UNMET/UNDERPOWERED, no 2026-08-19 session bodies read.

## Definition completeness (verbatim-grade checklist)

`.omo/evidence/plan-37-k-measurement/definition.md` names:

- assembly window = first successful `sdp q` recipe invocation until first product mutation/disposition (§1)
- qualifying episode = ≥2 distinct catalog recipe bodies in one window AND visible co-use in one context/rationale/verdict AND operator-context acquisition, not test/QA runs (§2)
- recipe identity = sixteen fenced bodies in `docs/agent-surface/recipes.md`; parameter lines normalized for recipes 3, 6, 9, 14; recipe 4 takes filenames from `SDP_CHANGED_FILES_JSON` (§3)
- corpus = this arc's completed I/J execution sessions; ≥6 eligible and ≥2 per brief, else underpowered (§4)
- trigger MET = ≥3 qualifying episodes from different tasks sharing a normalized core of ≥2 recipe IDs with visible co-use, spanning both briefs or ≥50% of a repeated work-shape stratum; any failed conjunct with adequate corpus = unmet (§5)
- disqualifiers: recipe test suites, QA-certification runs, failed calls, duplicate/resumed transcripts, quoted-not-run commands, K's own activity (§7)
- skill-prescribed chains are corroboration, never trigger evidence (§8; quotes from both skills)

Todo-4 vs todo-17 split is explicit: this lane must not examine this arc's sessions for a verdict and must not emit COMMISSION / STAND-DOWN. Bytes only; never estimated tokens.

## Tooling

`node .omo/evidence/plan-37-k-measurement/census.mjs <session.jsonl>` — Node, no deps, stdout/stderr only. Also accepts `.omo/start-work/ledger.jsonl` (command-array shape) and `--self-check` (catalog identity, not a verdict).

Matcher proof (not a verdict): `--self-check` exits 0 and matches all sixteen catalog fences plus a recipe-3 parameter variant (`spec:consumers.reader` → `spec:model.core-model`) as id 3. Sequence `1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,3`.

Honest non-matches are required by §3.3 (no "close enough"):

- abbreviated recipe-1-like bodies → `unmatched`
- `sdp:q "$(cat /tmp/r2.js)"` → `unresolved` (`command_substitution`)
- ledger prose (`fresh sdp:q readiness`) is dropped, not counted

Limitation (candidate windows, not identity): any `git commit` closes a window. The script cannot see the commit tree from the argv, so an `.omo`-only commit is treated as a closer. Wave 3 re-adjudicates against §1 ("a commit that lands product bytes"). Shared multi-`sdp:q` bash results report `output_bytes=unknown` plus `shared_tool_result_bytes`.

## Happy QA — two plan-35-era sessions (raw tables)

Identified as the two `2026-08-15` files under `~/.omo/agent/sessions/--home-darkomijic-dev-libar-software-delivery-protocol--/`. Both runs exit 0.

### Session `01a0054c-67c9-7597-a1ea-f11b2864e0c4` (exit 0)

```
================================================================
kind            session
file            /home/darkomijic/.omo/agent/sessions/--home-darkomijic-dev-libar-software-delivery-protocol--/2026-08-15T12-01-28-521Z_01a0054c-67c9-7597-a1ea-f11b2864e0c4.jsonl
session_id      01a0054c-67c9-7597-a1ea-f11b2864e0c4
cwd             /home/darkomijic/dev-libar/software-delivery-protocol
started         2026-08-15T12:01:28.521Z
jsonl_lines     410
malformed_lines 0
catalog         /home/darkomijic/dev-libar/software-delivery-protocol/docs/agent-surface/recipes.md
catalog_sha256  9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87
invocations     3
recipe_sequence unmatched,unresolved,unresolved
distinct_ids    (none)
distinct_count  0

seq recipe     ok       out_bytes   body_bytes body_sha256     runner
--- ---------- -------- ----------- ---------- --------------- ------------------------------
1   unmatched  yes      unknown     288        f49527c7eb75e48d npm run --silent sdp:q
    note=- preview=const ready = g.specs().filter((spec) => spec.statedReadiness === "ready"); const backlog = read
    shared_tool_result_bytes=449 (per-invocation stdout not separable)
2   unresolved yes      unknown     0                          npm run --silent sdp:q
    note=command_substitution preview=-
    shared_tool_result_bytes=449 (per-invocation stdout not separable)
3   unresolved yes      unknown     0                          npm run --silent sdp:q
    note=command_substitution preview=-
    shared_tool_result_bytes=449 (per-invocation stdout not separable)

candidate_windows:
  W1 open_seq=1 open_ts=2026-08-15T12:19:34.667Z close=bash:cd /home/darkomijic/dev-libar/software-delivery-protocol git commit -m "chore(om close_seq=3 recipes=unmatched,unresolved,unresolved distinct=(none)
================================================================
```

### Session `01a005f2-9ee1-7329-8c3c-c36c986a62aa` (exit 0)

```
================================================================
kind            session
file            /home/darkomijic/.omo/agent/sessions/--home-darkomijic-dev-libar-software-delivery-protocol--/2026-08-15T15-03-01-602Z_01a005f2-9ee1-7329-8c3c-c36c986a62aa.jsonl
session_id      01a005f2-9ee1-7329-8c3c-c36c986a62aa
cwd             /home/darkomijic/dev-libar/software-delivery-protocol
started         2026-08-15T15:03:01.602Z
jsonl_lines     575
malformed_lines 0
catalog         /home/darkomijic/dev-libar/software-delivery-protocol/docs/agent-surface/recipes.md
catalog_sha256  9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87
invocations     0
recipe_sequence (none)
distinct_ids    (none)
distinct_count  0

seq recipe     ok       out_bytes   body_bytes body_sha256     runner
--- ---------- -------- ----------- ---------- --------------- ------------------------------
(no sdp q / sdp:q invocations)

candidate_windows:
  (none)
================================================================
```

Session 2 is a real empty table: 68 bash calls, none an `sdp q` / `sdp:q` invocation. That is the honest tooling result, not a parser miss of a wrapper form. `sdp:q` strings in that transcript are quoted plan/docs text (quoted-not-run).

Ledger (shape validation only; not a verdict corpus): after dropping prose mentions, one recoverable JS body remains (`return g.specs().filter(...)`, unmatched against the sixteen fences). Ledger has no mutation timeline, so candidate windows are reported unavailable.

## Failure QA — malformed_input probe

### Nonexistent path (expect non-zero, clean error)

```
$ node .omo/evidence/plan-37-k-measurement/census.mjs .omo/evidence/plan-37-k-measurement/no-such-session.jsonl
exit: 1
stdout: (empty)
stderr: census: path does not exist: .omo/evidence/plan-37-k-measurement/no-such-session.jsonl
```

### Truncated jsonl (expect skipped-malformed-line count, exit 0)

Fixture: first 5 valid lines of the 01a0054c session plus one cut-off `{"type":"message",...sdp:q` object. Documented behavior: unparseable lines increment `malformed_lines` and are skipped; exit 0 if the file itself was readable.

```
$ node .omo/evidence/plan-37-k-measurement/census.mjs .omo/evidence/plan-37-k-measurement/qa-truncated.jsonl
exit: 0
```

```
================================================================
kind            session
file            /home/darkomijic/dev-libar/software-delivery-protocol/.omo/evidence/plan-37-k-measurement/qa-truncated.jsonl
session_id      01a0054c-67c9-7597-a1ea-f11b2864e0c4
cwd             /home/darkomijic/dev-libar/software-delivery-protocol
started         2026-08-15T12:01:28.521Z
jsonl_lines     6
malformed_lines 1
catalog         /home/darkomijic/dev-libar/software-delivery-protocol/docs/agent-surface/recipes.md
catalog_sha256  9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87
invocations     0
recipe_sequence (none)
distinct_ids    (none)
distinct_count  0

seq recipe     ok       out_bytes   body_bytes body_sha256     runner
--- ---------- -------- ----------- ---------- --------------- ------------------------------
(no sdp q / sdp:q invocations)

candidate_windows:
  (none)
================================================================
```

`malformed_lines 1` on `jsonl_lines 6`. The truncated line is not silently treated as an invocation.

## Write-nothing proof

`census.mjs` contains no `writeFile` / `appendFile` / `createWriteStream` / `mkdir`. `strace` is not installed on this workstation (`command -v strace` empty). Substitute: snapshot every non-measurement file (`mtime_ns, size, ino`; 1151 files, `.git`/`node_modules` pruned), run the census over session 01a005f2 with stdout discarded, re-snapshot.

- outside_added / outside_removed / outside_changed = `[]`
- measurement dir also unchanged across that run (no rewrite of `definition.md` or `census.mjs`)

`git status --short` after the run shows this lane's deliverable as `?? .omo/evidence/plan-37-k-measurement/` plus this evidence file. Other dirty/untracked paths (`AGENTS.md`, `plans/36`, `plans/37`, `test/self-hosting-carrier.test.ts`, `test/check-self-hosting-gates.test.ts`, staged generated registrar, sibling evidence files) belong to parallel Wave-0 lanes. This lane did not create or edit them.

## Adversarial classes

| Class | Result |
| --- | --- |
| malformed_input | probed: nonexistent → exit 1 + clean stderr; truncated → `malformed_lines 1`, exit 0 |
| stale_state | probed: definition mtime before any census output; ordering table above |
| misleading_success_output | probed: raw tables pasted; empty session 2 is empty; unmatched/unresolved not dressed as catalog IDs |
| prompt injection | N/A — no untrusted body was executed; census only reads jsonl / catalog |
| cancel/resume | N/A — no cancelled or resumed census run |
| dirty worktree | N/A as a blocker — lane writes only under `.omo/evidence/`; parallel-lane dirt is not this todo's |
| hung commands | N/A — both session runs and both failure runs returned |
| flaky tests | N/A — no test suite; census is deterministic over a file |
| repeated interruptions | N/A — single uninterrupted pass after the freeze |

## Cleanup receipts

- `/tmp/k-self.txt` removed
- no `/tmp/r2.js` / `/tmp/r8.js` created by this lane
- QA fixtures kept **inside** `.omo/evidence/plan-37-k-measurement/` (`qa-truncated.jsonl`, `qa-*.stdout`, `qa-*.stderr`, `validation-plan35-session-*.txt`) because that directory is the deliverable home
- no `git add` / `git commit` / `git push`
- no serialized commands (`npm run build`, `generate:*`, `check:self-hosting`, `check:example`, `preflight`, `npm run check`)

## Must-NOT confirmation

- no bundle / projection / verb / accessor
- no script in `src/` or `package.json`
- no 2026-08-19 session opened for a verdict
- no estimated tokens reported

## Wave-3 visibility (not a plan miss; no script or frozen-rule change)

§7 says mixed sessions list `disqualified_candidate` "when the script can see them." `census.mjs` never emits that label. Wave 3 adjudicates those rows manually against §7. Left as-is per AdversarialVerify: do not change the script or the frozen rules for it.

## Post-freeze amendment A1 + AdversarialVerify verdict

**Verdict:** AdversarialVerify NEEDS-FIX (confidence 0.86), verifier `st_01a01acd`. Single finding: RISK (b) shared multi-`sdp:q` stdout was implemented and evidenced but absent from the frozen law.

**Fix (2026-08-19T18:33:46+02:00):** post-freeze amendment A1 added under definition §9 and in `## Post-freeze amendments`. The original §9 sentence was not rewritten. No verdict-corpus examination. `census.mjs` unchanged.

Amendment text now in the law: an inseparable shared multi-`sdp q` / `sdp:q` tool result — more than one recipe invocation recovered from a single bash `toolCall`, so the recorded stdout is a combined payload — must be reported as `output_bytes=unknown`. Required, not a miss. Never a fabricated per-invocation split. Combined payload bytes, when retained, are `shared_tool_result_bytes` with `per-invocation stdout not separable`.

Quoted script line the amendment matches (`census.mjs`):

```js
outputBytes: shared || resultBytes === null ? "unknown" : resultBytes,
```

where `const shared = extracted.length !== 1;` and `const resultBytes = result ? byteLen(result.text) : null;`.
