# F3 remediation: published Try-it dereference claim

Task: `st_01a024f3`
Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-f3-remediation`
Branch: `work/pr25-f3-remediation`
Published head at start: `91992f11acc33867b857971f5e9a429a391926b4`
`origin/main`: `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`

No push, live PR edit, merge, plan edit, Boulder edit, runtime-ledger edit, code/test edit, or unrelated prose rewrite.

## Blocking mismatch

Publication prose for the Try-it delivery-facts query claimed the `origin/main` failure was `Cannot read properties of undefined (reading 'found')`.

That error belongs to an earlier generic probe that dereferenced `.found`. It is not the published query.

Published Try-it body:

```bash
pnpm --silent sdp:q 'const c = g.specContext("spec:extraction.delivery-facts"); return { readiness: c.statedReadiness, facts: c.deliveryFacts, implementations: c.implementations.length, verifiers: c.verifiers.length }'
```

That body assigns `const c = g.specContext(...)` and then reads `c.statedReadiness`.

## Live-main manual QA

Isolated archive:

```bash
git archive origin/main | tar -x -C /tmp/sdp-f3-main-x2y04E
```

Archive root: `/tmp/sdp-f3-main-x2y04E`
Corpus SHA: `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`
CLI: this worktree's built `dist/cli/sdp.js` after `npm ci && npm run build`

Exact published query against the archive:

```bash
pnpm --silent sdp:q 'const c = g.specContext("spec:extraction.delivery-facts"); return { readiness: c.statedReadiness, facts: c.deliveryFacts, implementations: c.implementations.length, verifiers: c.verifiers.length }' --root /tmp/sdp-f3-main-x2y04E --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

| Field | Value |
| --- | --- |
| exit | `1` |
| stdout | empty (0 bytes) |
| stderr | `sdp q: Cannot read properties of undefined (reading 'statedReadiness')` |
| stderr bytes | `71` |

Broader fact preserved: `g.specContext("spec:extraction.delivery-facts")` itself is `undefined` on that corpus. The published query fails on the first property read from that value, which is `statedReadiness`.

Contrast probe (historical shape, not published):

```bash
pnpm --silent sdp:q 'const c = g.specContext("spec:extraction.delivery-facts"); return { found: c.found }' --root /tmp/sdp-f3-main-x2y04E --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

stderr: `sdp q: Cannot read properties of undefined (reading 'found')` (exit 1). Kept only as the explanation of the stale claim. Not rewritten into any historical probe evidence file.

## Unchanged Try-it expected outputs

Compared against committed publication prose. No other expected stdout blocks were edited:

- validate banner and warning subjects
- four-id readiness query result
- delivery-facts success object on this branch (`readiness`/`facts`/`implementations`/`verifiers`)
- thirteen-component list
- recipe paste guidance
- numbers section

Only the `origin/main` stale-signal sentence that named the published-query failure property changed.

## Byte-level prose scope

Search under `.omo/evidence/pr-25-review-remediation/` for `reading 'found'` found exactly two publication claims that described the published Try-it query:

| Path | Change |
| --- | --- |
| `.omo/evidence/pr-25-review-remediation/pr-body.md` | stale-signal sentence now names `c.statedReadiness` / `reading 'statedReadiness'` |
| `.omo/evidence/pr-25-review-remediation/final-verification.md` | stale / `origin/main` diagnostic now names the same published-query property/error |

No other remediation/publication prose claimed the published Try-it query failed on `.found`. Historical evidence of the earlier `.found` probe was left untouched.

## Diff check and Markdown diagnostics

```bash
git diff --check
```

exit `0`.

Requested Markdown LSP diagnostics for the three remediation Markdown paths. Every request returned the same infrastructure error:

```
LSP daemon unreachable: LSP daemon did not become reachable at /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock.
The MCP server is a thin proxy and never runs language servers in-process.
Socket: /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.sock
Logs: /home/darkomijic/.omo/lsp-daemon/v0.1.0/daemon.log
The daemon is auto-started on demand and will be retried on the next request.
```

Recorded as daemon failure. Authoritative substitute for this prose-only lane: `git diff --check` exit 0 plus the live published-query stderr above.

## Cleanup

Removed the disposable archive root `/tmp/sdp-f3-main-x2y04E` and the temporary stdout/stderr capture files under `/tmp/sdp-f3-*.txt` after recording the results. No watcher, port, generated-state writer, live PR write, or runtime-ledger mutation remains from this task.
