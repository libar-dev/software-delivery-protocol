# F5. Plan 37 reviewer-ready pull request

Opened. Not merged.

## Identity

- Branch: `feature/sdp-skills`
- Base: `origin/main` (`7b99baab4c7d722c9472d7e59e37b656772a625c`, PR #21 merge)
- Product HEAD at open: `85a338ab79b2e98d6cc6ba0a2777ce03f57cdcf2` (`chore(plans): plan 37 EXECUTED — statuses, AGENTS, gate green twice`)
- Remote: `git@github.com:libar-dev/software-delivery-protocol.git` (SSH)
- PR: https://github.com/libar-dev/software-delivery-protocol/pull/22
- Title: `feat(plans): plan 37 settling arc — I/J/K close`
- State at create: OPEN, base `main`, head `feature/sdp-skills` @ `85a338ab79b2e98d6cc6ba0a2777ce03f57cdcf2`

## Preconditions

`git rev-parse HEAD` was `85a338ab79b2e98d6cc6ba0a2777ce03f57cdcf2` before push. Linear history `origin/main..HEAD` is ten commits, no merge in the range. No upstream existed; `git ls-remote origin refs/heads/feature/sdp-skills` was empty. `gh auth status` reported Git operations protocol `ssh`. Unrelated dirty path `.omo/evidence/ulw-20260820-081346.05dmOx.md` left unstaged.

Todo 20 already ran `npm run check` twice consecutively, both exit 0 (838 passed, 1 skipped), then flipped statuses in `85a338a`. F5 did not re-run the full gate.

## Push and create

```
git push -u origin feature/sdp-skills
```

New remote branch. Tracking set to `origin/feature/sdp-skills`.

```
gh pr create --base main --title "feat(plans): plan 37 settling arc — I/J/K close" --body-file /tmp/plan37-f5-pr-body.md
```

Returned `https://github.com/libar-dev/software-delivery-protocol/pull/22`. `gh pr view 22` confirmed url, title, base `main`, head `feature/sdp-skills`, head oid `85a338ab79b2e98d6cc6ba0a2777ce03f57cdcf2`, state OPEN.

## Recipes re-run at `85a338a`

Catalog bodies lifted from `docs/agent-surface/recipes.md` fences 1, 2, and 8, piped to `pnpm --silent sdp:q --json`. All three exit 0.

Recipe 1:

```json
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 31,
  "excludedWithoutVerifier": []
}
```

Recipe 2: `total: 3`. Alarms `spec:consumers.projections-model` (bindings 2), `spec:extraction.regenerability` (1), `spec:model.core-model` (3). Each stated `defined`, `floorReached: ready`, `firstUnmetClause: null`.

Recipe 8: `errors: 0`, `warnings: 5`, `byValidator: { "honesty/gaps": 5 }`. Subjects: `spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`.

Matches the Todo 18 close record and the PR body.

## Tracking commit

This evidence file, the F5 checkbox, and `boulder.json` (`status: completed`, `current_commit: 85a338a`) land after PR create. They are not in the product HEAD the PR was opened at.
