---
name: sdp-studio
description: Publish, stamp and read the Spec Studio, and apply what a person composes in it. Use when building its pages with a base graph or CI run reports, sharing a page set or pull-request previews, reading a Studio link, or receiving a memo, proposal or scoped intent from its composing panel.
metadata:
  realizes: spec:consumers.studio-on-ramp
---

# The Spec Studio

The Studio (`spec:consumers.spec-studio`) is a projection: static pages of values the build
computed from the one graph; a person's change leaves it as scoped intent for a carrier. Run
commands from the project root; `<skill-dir>` is this skill's directory. Recipes not named here sit
in the catalog's categories under the installed package root, such as
`docs/agent-surface/recipes.md#change-and-proposals` and
`docs/agent-surface/recipes.md#evidence-and-coverage`.

## Hazards

- **Build, then stamp, last.** Any later `build`, `validate` or `vault` run, or any publisher,
  removes the page set and its stamp (`spec:consumers.spec-studio.publisher#rule.buildInvalidates`).
- **Stamp a clean checkout of the commit you name:** the composing panel takes a proposal's base
  from the stamp.
- **A missing page is a missing input:** `sdp generate` takes neither `--base` nor `--runs`, which
  `diff.html` and `runs.html` need.
- **A run is evidence for its own commit only**
  (`spec:consumers.spec-studio.runs-page#rule.commitShown`): check each report's commit against
  the stamp's before you publish it or read a run row, as below.

## Start from what you hold

- **A page set or a link: read it**, no graph needed; [pages.md](references/pages.md) maps tasks
  to pages. A page states only what it shows: queue order sets no priority; roadmap order is
  advisory; a run row is no verdict; a folded diagram keeps a text equivalent of every box and edge
  (`spec:consumers.spec-studio.diagrams#rule.textEquivalent`); `search.html` needs its script; a
  Pack export carries no stamp or composing panel, so name its commit when you send one.
  To ask past the pages, add a worktree at `stamp.json`'s `corpusCommit` and prepare it as
  recipe 35, The design diff, prepares its base
  (`docs/agent-surface/recipes.md#35-the-design-diff`): link the project's `node_modules` into it
  and, in the Protocol checkout, build its `dist/`. From the worktree's root, run orientation 10
  on the page's ids (`<skill-dir>/../sdp-agent-surface/scripts/orient.mjs`).
- **A repository: publish.** `sdp generate` writes every page root; `sdp studio` writes the
  Studio alone, with a base graph or run reports. A base graph is the `generated/graph.json` a
  worktree at the base commit builds with its own engine (recipe 35, The design diff:
  `docs/agent-surface/recipes.md#35-the-design-diff`). Pass inputs from outside this checkout's
  `generated/` (`spec:consumers.spec-studio.data.inputs#rule.inputPlacement`).
  - **CI run reports: check their commits** against the stamp's `corpusCommit` through recipe 45,
    run evidence (`dist/recipes/45-run-evidence.js`), before `sdp studio --runs` or a `runs.html`
    reading; a report from another commit says nothing about this one, and a report under
    `diagnostics` was not read:

    ```sh
    node <skill-dir>/../sdp-agent-surface/scripts/q.mjs 'const { inputs = [], diagnostics } = await recipes(45, params); return { diagnostics, inputs: inputs.map(({ index, commit, sameCommit }) => ({ index, commit, sameCommit })) }' --params runs=@ctrf.json --params '{"commit":"<corpusCommit>"}'
    ```

  - **The final build: stamp it** with the commit it read (`sdp stamp --commit`), then upload
    `generated/spec-studio/`. Source links need the stamp's `--source` template and pages served
    over http(s); otherwise file and line stay text
    (`spec:consumers.spec-studio.sharing#rule.sourceLinks`).

- **A CI workflow: set up previews** with [previews.md](references/previews.md).
- **Composed intent: receive it**, below.

## Receive composed intent

The panel hands off what its contract can carry
(`spec:consumers.spec-studio.intent-panel#rule.textApart`): with a base and a reason, a change
proposal and its memo, whose JSON sits under `## The proposal`; apart from it, under
`Not in the proposal`, scoped-intent text for each intent a proposal cannot hold; without a base
or a reason, that text alone. Ask the person for every part they hold, then route each intent once:

- **The proposal.** A preview's base is a merge commit GitHub made for the pull request, which
  `refs/pull/<number>/merge` holds only until the next push to either branch. Fetch the
  proposal's `base` by its id, `git fetch origin <base>`, and return the proposal only when that
  fails: a base the pull request has since moved past is still checked, and the check sends each
  change whose scope moved to the person. Then apply it through the
  [receive procedure](../sdp-sessions/references/proposals.md)
  (`spec:consumers.delivery-session-on-ramp#rule.receiveProposal`).
- **Text naming Specs or entries**, everything when the person gave no base or reason: write it
  into a proposal (`spec:consumers.intent-composition`) against a commit the person agrees is the
  one they read, then the same procedure.
- **Text naming a Pack's members**: confirm they are the Pack's members at that base
  (`g.packContext`), then write them into that proposal as Spec changes; members that differ go
  back to the person.
- **A Pack's membership or framing**: no proposal can carry it
  (`spec:consumers.spec-studio.intent-panel#rule.packScope`). Edit the manifest with the person's
  agreement and check it with `sdp-authoring`'s loop, which reads the members and framing back.

Done when each intent is applied once, through the check or the manifest, sent to the person, or
returned.
