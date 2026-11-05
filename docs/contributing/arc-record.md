# The arc record

Read this before opening an arc, committing evidence, posting a review or writing a pull request
description. The law is `spec:protocol.roadmap-replaces-plans`; read its rules, with their lines,
through recipe 25 (`dist/recipes/25-address-resolution.js`) before you act on them:

```bash
pnpm --silent sdp:q 'const keys = ["oneRoadmap", "executionRecord", "reviewFindings", "openFindings", "evidence", "acceptance", "forwardSection"]; const { rows } = await recipes(25, { addresses: keys.map((key) => "spec:protocol.roadmap-replaces-plans#rule." + key) }); return rows.map((row) => `${row.key}, line ${row.line}: ${row.value}`)'
```

Each rule speaks at its moment: `executionRecord` when opening or resuming an arc (the first
commit message also names the arc's base), `evidence` and `acceptance` when committing evidence or
measuring acceptance, `reviewFindings` and `openFindings` when reviewing, `oneRoadmap` and
`forwardSection` when writing the forward section. Commit authority, pushing and work in progress
are in `AGENTS.md`; the rest of this page is the owner's practice, which no Spec states.

## Post a review

Write and check the change proposal as the `sdp-sessions` skill's `proposals.md` teaches, then post
its memo, recipe 49 (`dist/recipes/49-the-proposal-memo.js`), to the pull request:

```bash
pnpm --silent sdp:q 'return (await recipes(49, params)).memo' --params proposal=@proposal.json --json | node -p 'JSON.parse(require("fs").readFileSync(0, "utf8"))'
```

## The pull request description

The description is the project's durable narrative record. Sessions return to it long after merge,
for planning as much as for history, so write for the reader who arrives in six months with no
context. Length follows use: a long description is fine when every section answers a question that
reader brings. PR #19 (the universal-Spec arc) set the standard, building on PRs #10 and #16; PR #31
extended it with human views, ruling tables and the next pull request's lanes.

- **Story before inventory.** Lead with what the pull request introduces and why: the questions it
  answers, the arc it closes, the capability it delivers. Change lists and review closure are
  evidence, never the headline. A description written during a review is re-anchored on the full
  scope before it is published.
- **Present new things.** Give each new surface a short explanation and a linked representative
  artifact on the branch (a carrying Spec, a worked example, a Pack), one stop per surface.
- **Show it to a person.** Prose, rendered tables and screenshots are welcome. When the pull request
  moves a human view such as a Design Review page, show it at the arc's base and at the head. Render
  a recipe's answer as a short table, not pasted JSON, and say plainly what no human view shows
  yet. `gh` cannot attach images: commit them on the branch with a short README naming the
  commands, pin links to that commit, and remove them before merge.
- **Self-hosted and graph-measured.** Link the arc's Pack and describe its state and changes with
  the Protocol's own recipes: recipe 29 (`dist/recipes/29-pack-design.js`, `{"pack": ...}`) and
  recipe 35 (`dist/recipes/35-the-design-diff.js`) from the arc's base, whose base graph its catalog
  entry writes. Check every claim about the corpus with a query before writing it.
- **Specified in queries.** Give the exact `sdp:q` bodies or recipe files, with their parameters,
  that reproduce each measurement and scope the next work.
- **Rulings are tables.** Ruling or ratified name, one line, carrying Spec link. The owner's rulings
  sit in one table; rulings delegated to an agent and awaiting the owner's review sit in a second.
  Every registry row the pull request adds appears.
- **Invite use.** A try-it block of real commands, re-run at the head before publishing, and a
  feedback call naming the open questions that most want pressure.
- **Plan the next pull request.** The forward section is recipe 55's memo
  (`dist/recipes/55-the-roadmap-memo.js`) rendered at the head, with the owner's reason for each
  entry's priority, the re-entry condition and the durable refused list in the author's words
  around it:

  ```bash
  pnpm --silent sdp:q 'return (await recipes(55, params)).memo' --params '{"pack":"pack:roadmap"}' --json | node -p 'JSON.parse(require("fs").readFileSync(0, "utf8"))'
  ```
- **Numbers are re-measured and marked.** Re-derive close measurements at close and label them
  ("re-run the recipes rather than inheriting these").
- **Audit, then publish.** Check the description against the arc's Pack, every ruling record the
  pull request carries out and the diff stat from the base, so each finished piece of work appears
  or is left out on purpose. Pin links and images to a commit (`blob/<sha>/…`,
  `raw.githubusercontent.com/<owner>/<repo>/<sha>/…`; a line anchor on a Markdown file needs
  `?plain=1#L…`) and confirm each linked path exists at that commit. Draft the body in your own
  working area; the published description is the record. When replacing the body, keep the
  sections Greptile and CodeRabbit append.
