# PR 25 publication and cleanup receipt

Plan: `.omo/plans/pr-25-review-remediation.md` · Todo 8
Session: `senpi:01a02484-8a26-71b5-be12-039515d854cc`
PR: https://github.com/libar-dev/software-delivery-protocol/pull/25

## Fast-forward proof

Before publication:

- remote branch: `feature/architectural-patterns-views`
- remote head: `5584ed91cf2c3efbf31ad83c28054febd0ec62b7`
- verified local head: `33cc0aa02822c1b858ef020c34f9c094472b02c4`
- base: `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`
- `git merge-base --is-ancestor FETCH_HEAD HEAD`: exit 0
- remote: `git@github.com:libar-dev/software-delivery-protocol.git`
- `gh auth status`: `Git operations protocol: ssh`

The push was:

```text
git push origin HEAD:refs/heads/feature/architectural-patterns-views
To github.com:libar-dev/software-delivery-protocol.git
   5584ed9..33cc0aa  HEAD -> feature/architectural-patterns-views
```

No force flag, merge, remote edit, credential edit, or second PR was used. The read-only
counterfactual refusal is the ancestry gate above: a remote head that is not an ancestor of the
verified local head stops publication before push.

## Live PR proof

`gh pr edit 25 --body-file .omo/evidence/pr-25-review-remediation/pr-body.md` updated the existing
PR only.

The post-write query returned:

```json
{
  "baseRefOid": "bb97d829eea7b3689d5d8569d307e1bb5e77fd0d",
  "headRefOid": "33cc0aa02822c1b858ef020c34f9c094472b02c4",
  "state": "OPEN",
  "title": "Architectural significance rides existing primitives",
  "url": "https://github.com/libar-dev/software-delivery-protocol/pull/25"
}
```

Raw-template body comparison against committed `pr-body.md` exited 0. The first comparison through
`gh --jq` added its own terminal newline and correctly failed at local EOF; it was not treated as a
body mismatch. `git ls-remote` returned the same `33cc0aa02822c1b858ef020c34f9c094472b02c4`.

## Required checks

The observable `gh pr checks 25 --watch --interval 10` monitor completed with exit 0 at the
published head:

```text
check  pass  1m49s  https://github.com/libar-dev/software-delivery-protocol/actions/runs/32496289023/job/96815356877
check  pass  2m7s   https://github.com/libar-dev/software-delivery-protocol/actions/runs/32496292574/job/96815366895
```

## Worktree cleanup

Clean-status proof was captured before removal for:

- `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-recipe-totality`
- `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-structural-coverage`
- `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-ledger-recovery`
- `/home/darkomijic/dev-libar/software-delivery-protocol-pr25-review-evidence`
- `/tmp/sdp-review-architectural-patterns-views`

All five were removed with `git worktree remove`, followed by `git worktree prune`. Their branch
refs were preserved. The primary checkout was untouched.

The integration worktree is retained only long enough to commit and fast-forward this durable
publication receipt. It is clean at `33cc0aa02822c1b858ef020c34f9c094472b02c4` and will be removed
immediately after that receipt reaches the remote. Final orchestration verifies the resulting
worktree registry from the primary checkout.

## Adversarial classes

- `stale_state`: live remote and PR OIDs were fetched immediately before and after writes.
- `dirty_worktree`: every removed auxiliary worktree and the integration worktree were clean.
- `misleading_success_output`: remote SHA, PR JSON, raw body bytes, and both check URLs were observed.
- `hung_or_long_commands`: checks were followed by an observable monitor, not a sleep or turn-level poll.
- `repeated_interruptions`: publication needed no retry or force push.
- `malformed_input`: not applicable; no new input parser.
- `prompt_injection`: not applicable; the body is committed repository-authored prose.
- `cancel_resume`: not applicable; push, body update, and check monitor completed.
- `flaky_tests`: required GitHub checks each passed once at the exact published OID.

No task-owned process, port, browser, monitor, or temporary QA artifact remains.
