---
id: spec:consumers.spec-studio.sharing
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:extraction.schema-versioning
    - spec:consumers.engine-provenance
    - target: spec:consumers.spec-studio.publisher
      reason: the stamp and the preview take the page set the publisher wrote
  constrainedBy: spec:extraction.determinism
---
# A Studio build is stamped and shared from a static host

A page set is a function of the graph and its named inputs, so it carries no commit or time. A reviewer opening a preview still needs to know which commit and which engine built it, so a publishing step that runs after the build writes one stamp file at the page set's root, and the shell shows it where the set is served over http or https. The same stamp may name where the repository's source is served, so a recorded file and line become a link in a preview and stay text everywhere else. A reusable workflow does the build, the stamp and the upload for every pull request, and deploys a preview only where the repository has chosen a host. Checks and previews use GitHub's default pull-request merge checkout, so the gate proves the merge result and the run evidence, page set and stamp name that same commit.

A stakeholder opens the link, navigates the Studio and composes intent, and the pull request's author hands that intent to an agent that edits the source.

## Intent
- outcome: Let a stakeholder open the Studio of a pull request from a link, and let its author know which graph and which build the stakeholder read.

## Behavior
- rule: A build is shared by uploading its page set to a static host, such as S3, Vercel or GitHub Pages.
- rule: [#buildWritesNoStamp] The Studio's build writes no stamp, so every page and data file it writes stays a function of the graph and its named inputs; the stamp is written apart, after the build.
- rule: [#stampVerb] `sdp stamp [root] [--commit SHA] [--source TEMPLATE]` writes `stamp.json` into `<root>/generated/spec-studio/` and touches no other file: it derives no graph, renders no page, and refuses with exit 1 when the root holds no page set; a stamp without `--commit` names the commit `unknown`.
- rule: [#stampLifetime] A later build removes the page set and its stamp together, so no stamp outlives the build it names.
- rule: [#publishingStep] Publishing a preview and writing its stamp are a step the adopter's CI runs, never the Studio's build; the shell reads the stamp as `spec:consumers.spec-studio.shell#rule.stamp` states.
- rule: [#previewWorkflow] The package's repository ships a reusable GitHub Actions workflow that, on a pull request, installs the caller's dependencies, runs `sdp studio` with the caller's root, exclusions and inputs, runs `sdp stamp` with the checked-out merge commit and the repository's source template, and uploads the page set as a CI artifact; it opens no pull request, writes no comment and holds no credential beyond the run's own token.
- rule: [#previewDeploy] The workflow deploys the stamped page set under `/preview/<pr-number>/` only when the caller asks for it and the repository serves a host from the branch the workflow writes to; a pull request from a fork never deploys.
- rule: [#sourceLinks] Every recorded file and line a page shows as text carries its file and line as data on its element, and when a loaded stamp names a source template the stamp element links each to the template with the file and line filled in; without such a stamp, or through `file://`, each stays text.

## Design
- buildStamp: `{ schemaVersion: string; corpusCommit: string; engine: string; builtAt: string; source?: string }` in `stamp.json` at the page set's root, written by `sdp stamp` and never by the Studio's build: the graph schema version of the stamping engine, the commit `--commit` names or `unknown`, the engine `sdp --version` names, the time the step ran as an ISO 8601 UTC timestamp to the second, and the source template `--source` names, when given.
- sourceTemplate: a URL holding `{file}` and optionally `{line}`, such as `https://github.com/<owner>/<repo>/blob/<commit>/{file}#L{line}`, into which the shell writes a recorded root-relative file and its line; `sdp stamp` refuses a template without `{file}`.
- previewWorkflow: `.github/workflows/studio-preview.yml`, triggered by `workflow_call` and called as `uses: libar-dev/software-delivery-protocol/.github/workflows/studio-preview.yml@<ref>`.
- workflowInputs: `root` (default `.`), `exclude` (root-relative prefixes, one per line), `node-version` (default `20`), `install` (the install command, default `npm ci`), `sdp` (the command that runs the installed `sdp`, default `npx sdp`), `runs-artifact` (the name of an artifact an earlier job uploaded holding CTRF reports, each passed as `--runs`), `diff` (a boolean: write the graph of the pull request's base commit in a separate worktree, with that commit's own install and engine, and pass it as `--base` labelled `base <short commit>`), and `deploy` (a boolean, default false).
- previewArtifact: the artifact `spec-studio-pr-<pr-number>`, holding the stamped page set.
- workflowSource: the workflow stamps with the checked-out merge commit and the source template `<server>/<repository>/blob/<merge commit>/<root>/{file}#L{line}`, the root and its slash left out when the root is `.`.
- previewPath: a pull request's preview is served at `<host>/preview/<pr-number>/`, which the workflow writes as the folder `preview/<pr-number>/` of the `gh-pages` branch, the branch GitHub Pages serves when a repository enables Pages from it.
- stampElement: the page element `sdp-stamp`, once its stamp loads, also sets `data-corpus-commit` on itself and, when the stamp names a source template, wraps each `code` element carrying `data-source-file` and `data-source-line` in a link to the template with `{file}` and `{line}` filled in, the file percent-encoded by path segment; without a template it links nothing.

## UI
- sourceMark: a recorded file and line written as `<file>:<line>` in a `code` element carrying `data-source-file` and `data-source-line`, beside its copy action.

## Example space
```gwt-vocabulary
Given a page set the studio command wrote at an extraction root
When the stamp command runs with the commit {commit:string} and the source template {source:string}
Then the stamp names the corpus commit {corpusCommit:string}
Then every page file stays byte-identical: {pagesUntouched:boolean}
Then a later studio run keeps the stamp: {stampSurvives:boolean}
```
