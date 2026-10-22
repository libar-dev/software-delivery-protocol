---
name: sdp-studio
description: Publish, share and read the Spec Studio, and apply the intent a person composes in it. Use when building or watching its pages, giving it a base graph or CI run reports, stamping a page set or setting up pull-request previews, reviewing a design from a Studio link, exporting a Pack, or receiving a memo, proposal or scoped intent from its composing panel.
---

# Publish, share and read the Spec Studio

The Spec Studio is a static HTML page set rendered from the one graph,
`spec:consumers.spec-studio`. It states no truth: every value on a page is one the reader computed
when the page set was built, and a change a person wants leaves the Studio as scoped intent, never
as an edit. This skill realizes `spec:consumers.studio-on-ramp`. It cites the Studio's Specs for
law; each verb's `--help` owns its flags.

## Start from what you hold

- **A repository**: publish the page set, then stamp and share it.
- **A page set or a link**: read it by task. The pages are the answer, and navigating them needs
  no local graph. To ask past them, query the graph at the commit the stamp names, through
  `sdp-agent-surface`.
- **Composed intent**, a memo, a `proposal.json` or scoped-intent text: receive it.
- **A CI workflow to set up**: call the preview workflow.

## Publish the page set

```sh
pnpm exec sdp studio . --exclude PATH
pnpm exec sdp studio . --base ../base-graph.json --base-label "last design pass" --runs ../ctrf.json
pnpm exec sdp studio . --watch
```

In this source checkout the same run is:

```sh
pnpm --silent sdp studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

- `sdp generate` writes the Studio beside the other four page roots, with no optional input. Run
  `sdp studio` when the page set needs a base graph or run reports.
- Build the Studio last. Every command that enters the shared build, `build`, `validate` and
  `vault` included, first removes `generated/spec-studio/` with the other page roots
  (`spec:consumers.spec-studio.publisher#rule.buildInvalidates`).
- A base graph is the `generated/graph.json` an earlier `sdp build` wrote at the base commit. Write
  it with that commit's own engine, as the design diff's catalog entry (recipe 35) shows: the
  catalog is `docs/agent-surface/recipes.md` in the Protocol repository and
  `node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md` in an adopter.
- Keep every input outside `generated/` and every other path the build writes or removes. The run
  refuses an input at such a path, `generated/graph.json` among them, before it changes a file
  (`spec:consumers.spec-studio.data.inputs#rule.inputPlacement`). Run reports are CTRF JSON files,
  one `--runs` each, read in flag order. An unreadable input refuses the run before extraction.
  Pages name each input in words, the base by its `--base-label`, and never show its path.
- Findings never withhold the page set: the run shows them on the index and on their subject's
  page, and returns validate's exit code. A run whose extraction fails publishes nothing.
- `--watch` republishes after every carrier create, change, delete or rename, byte for byte what a
  plain run writes. Source and input edits start no cycle, and nothing serves or reloads the page:
  reload it to read the new build (`spec:consumers.spec-studio.publisher.watch`).
- Open `generated/spec-studio/index.html` through `file://` or a static host.

## Stamp and share

```sh
pnpm exec sdp stamp . --commit <sha> --source 'https://github.com/<owner>/<repo>/blob/<sha>/{file}#L{line}'
```

- Stamp after the final build, then upload the stamped `generated/spec-studio/` folder to a static
  host. The stamp names the engine, the commit and the UTC time; a later build removes it with the
  page set (`spec:consumers.spec-studio.sharing#rule.stampLifetime`).
- Build from a clean checkout of the commit you stamp. The composing panel takes a proposal's base
  from the stamp, so a page set built from uncommitted carriers hands off intent against a commit
  that never held the graph the person read.
- A source template turns each recorded file and line into a link only where the page set is
  served over http or https; through `file://` they stay text
  (`spec:consumers.spec-studio.sharing#rule.sourceLinks`).

### Pull-request previews

Call the reusable workflow from a workflow that runs on `pull_request`, pinned to a commit:

```yaml
jobs:
  studio-preview:
    uses: libar-dev/software-delivery-protocol/.github/workflows/studio-preview.yml@<sha>
    permissions:
      contents: write
      pages: read
    with:
      exclude: |
        examples
      runs-artifact: ctrf-runs
      diff: true
      deploy: false
```

The inputs and their defaults are `spec:consumers.spec-studio.sharing#design.workflowInputs`.
`install` and `sdp` default to npm; a pnpm repository passes an install command that makes pnpm
available on the runner, and `pnpm exec sdp`.

- The workflow builds and stamps GitHub's pull-request merge commit, not the branch head. Run
  evidence keeps the commit each CTRF report records in `results.environment.commit`, which may
  name another commit or none, and a report uploaded in the same workflow run does not establish
  that they match. Compare each run's commit on `runs.html` with the stamp's before you treat its
  results as evidence for the preview commit
  (`spec:consumers.spec-studio.runs-page#rule.commitShown`): recipe 45 with `params.commit` set
  to the stamp's `corpusCommit` answers `sameCommit` per report, `null` when the report records
  no commit.
- `diff: true` builds the base branch's commit in its own worktree, with that commit's install and
  engine, and passes its graph as the base. `runs-artifact` names an artifact an earlier job of the
  same run uploaded; each JSON report in it becomes one `--runs`.
- Every run uploads the stamped page set as the artifact `spec-studio-pr-<number>`. Validation
  findings still publish a preview; a run that writes no page set fails.
- With `deploy: true` the workflow writes the page set to `preview/<number>/` on the `gh-pages`
  branch, and only when Pages serves that branch; a pull request from a fork never deploys
  (`spec:consumers.spec-studio.sharing#rule.previewDeploy`). The permissions above are the ones its
  deploy job asks for.
- The deploy job then waits for Pages to build the commit it pushed, and fails when that build
  errors or does not finish within ten minutes
  (`spec:consumers.spec-studio.sharing#rule.previewPublished`). On an errored build, re-run the
  repository's `pages-build-deployment` run; a first deployment can wait on an older one.

## Read the pages by task

| The task                                                                   | Open                                                                                                      |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| See where the corpus stands, narrow the Specs, read the findings           | `index.html`, the Packs lens                                                                              |
| Find a Spec, an entry or a bound file by a word                            | `search.html`, which needs the script                                                                     |
| Read a Pack's design member by member                                      | `packs/<name>.html`                                                                                       |
| Read one Spec in context                                                   | `specs/<name>.html`                                                                                       |
| Order the waiting statements and the owner's questions                     | `queue.html`, the statement queue (recipe 46)                                                             |
| List open questions, decisions, pinned declarations and the design backlog | `questions.html`, `decisions.html`, `declarations.html` with the source lines citing each, `backlog.html` |
| Compare designed components with built ones                                | `architecture.html`                                                                                       |
| See how far each Spec's verification reaches                               | `tests.html`                                                                                              |
| Look for runtime evidence                                                  | `evidence.html`, which reads every source as not tracked                                                  |
| See what changed since the base                                            | `diff.html`, only with `--base`: declared changes, with binding changes apart                             |
| Read CI results beside verifier bindings                                   | `runs.html`, only with `--runs`                                                                           |
| Look up a term the Specs define                                            | `glossary.html`                                                                                           |

A page's `<name>` is the id after its namespace, each uppercase letter written as `_` and its
lowercase (`spec:consumers.spec-studio.publisher#rule.pageSet`).

Read what a page states and no more. The queue's order sets no priority, and no waiting
statement is approved. A run row is external evidence from a test file, never a verdict on a
verifier. A binding shown as present says code or a test is bound, not that it works. A diagram
over its bound folds, or leaves only its text equivalent, which states every box and edge
(`spec:consumers.spec-studio.diagrams#rule.textEquivalent`).

### Export and print

Each Pack page links `Download this Pack as one file`, the export `exports/<name>.html`: one HTML
file that loads nothing, with every link inside it or written as text. It carries no stamp, date,
commit or composing panel, so name the commit beside it when you send it
(`spec:consumers.spec-studio.export`). Every page also prints as a document, its disclosures open.

## Receive composed intent

The composing panel hands off two things (`spec:consumers.spec-studio.intent-panel`):

- With a base and a reason, a change proposal and its memo. The memo ends with the exact proposal
  under `## The proposal`; save that JSON as `proposal.json`.
- Every intent the proposal cannot carry, listed under `Not in the proposal` and copied with
  `Copy scoped intent`: every intent when no base or reason was given, a Pack request that could
  not expand to its members, and a change to a Pack's membership or framing.

Ask the person for both, then:

1. Take the base from the proposal. A preview's stamp names the pull request's merge commit,
   which lives on `refs/pull/<number>/merge`, not on a branch: fetch it with
   `git fetch origin pull/<number>/merge` and confirm the fetched commit is the base. When that
   commit can no longer be fetched, the check cannot run: return the proposal to the person.
2. Write the base graph at that commit, as "Publish the page set" says, outside `generated/`.
3. Run the proposal check (recipe 38). In this source checkout the same body runs through
   `pnpm --silent sdp:q`:

   ```sh
   pnpm exec sdp q 'return await recipes(38, params)' --params proposal=@proposal.json --params base=@../base-graph.json --json
   ```

4. If `schemaProblems` is non-empty, the answer has no change rows: return the proposal for
   correction. Send a change to the person when its `moved` is `true` or `null`, which the check
   could not compare, when any `scope` item has `resolvesAtHead: false`, or when its
   `relationTarget` has `resolvesAtHead: false`. Apply only the remaining `moved: false` changes,
   as ordinary carrier edits through `sdp-authoring`, from a worktree `sdp validate` reports no
   error on (`spec:consumers.intent-composition#rule.changedScope`).
5. Scoped-intent text names its scope by id or entry address and carries no base. Resolve each
   intent against a commit you hold, write the proposal yourself against the shipped schema
   `schemas/sdp-proposal-1.schema.json`, render its memo with recipe 49 for the person, and check
   it as above. A Pack's membership and framing live in its manifest: change them with an ordinary
   manifest edit the person agrees to, since no proposal scope names a Pack.
6. Rebuild and restamp the page set so the person reads the result.

The graph outranks this skill. If a page, a recipe or this skill disagrees with the carrying Spec,
report the skill as drift and follow the Spec.
