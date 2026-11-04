# Pull-request previews

Read this to set up the preview workflow, or when a preview did not appear. Its inputs and
defaults are `spec:consumers.spec-studio.sharing#design.workflowInputs`.

- **Deploys need a same-repository pull request and Pages serving `gh-pages`**
  (`spec:consumers.spec-studio.sharing#rule.previewDeploy`). Otherwise the run passes with the
  artifact and no URL.
- **Run reports need a finished job.** `runs-artifact` names an artifact an earlier job of the same
  run uploaded, so the calling job `needs:` it. A missing artifact is skipped without failing:
  no `runs.html`.
- **A pnpm repository** passes an `install` that provides pnpm on the runner, such as
  `corepack enable && pnpm install --frozen-lockfile`, and `sdp: pnpm exec sdp`.

```yaml
on: pull_request
jobs:
  studio-preview:
    needs: test
    uses: libar-dev/software-delivery-protocol/.github/workflows/studio-preview.yml@<sha>
    permissions:
      contents: write
      pages: read
    with:
      exclude: |
        examples
      runs-artifact: ctrf-runs
      diff: true
      deploy: true
```

The workflow stamps GitHub's merge commit, not the branch head. Each run uploads the artifact
`spec-studio-pr-<number>`; a deploy writes `preview/<number>/` on `gh-pages`.
