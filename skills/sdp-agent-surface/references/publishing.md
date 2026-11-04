# Publish pages and notes

`sdp q` writes nothing. Every other command below enters the shared build, so read this before
running one for its output.

The public projection publishers are `sdp view`, `sdp census`, `sdp mermaid`, `sdp gherkin`,
and `sdp studio`. Each of them, like `sdp build`, `sdp validate` and `sdp vault`, enters the shared
build, which first removes all five page roots, so after one publisher runs only its own root is
current (`spec:consumers.wholesale-view-rewrite#rule.buildInvalidates`).

- Use `sdp generate` when all five page roots are wanted. It publishes them from one validated
  graph, synchronizes the vault first except under `--check-clean`, and writes the Studio without
  optional inputs: it takes neither `--base` nor `--runs`.
- Use `sdp studio` for a page set with `--base PATH`, `--base-label TEXT`, or repeatable
  `--runs PATH`; that run invalidates the other four page roots. Keep supplied inputs outside
  `generated/`: the run refuses an input at a path the build writes or removes, such as
  `generated/graph.json` or a file beneath a page root (`spec:consumers.spec-studio.data.inputs`).
  `sdp studio --watch` rebuilds after carrier edits; source and input edits start no cycle
  (`spec:consumers.spec-studio.publisher.watch`).
- After the final Studio build, run `sdp stamp` with the corpus commit, then upload the stamped
  page set. A later build removes the stamp
  (`spec:consumers.spec-studio.sharing#rule.stampLifetime`). Follow `sdp-studio` for previews,
  page reading, exports and composing-panel hand-offs.
- For linked notes, use `sdp-vault`. Open the directory `sdp vault --out DIR` names as the vault;
  the command owns its `sdp/` folder. Keep personal notes outside that folder, conventionally
  under `intent/`. `sdp vault` enters the shared build and invalidates the five page roots; use
  `sdp generate --vault DIR` when those roots must also be published.

In this source checkout, `npm run generate:self-hosting` and `npm run check:self-hosting` preserve
and publish all five roots together. In check mode a prior tree must exist for each root; Design
Review checks repeat-render determinism, while census, Mermaid, Gherkin and Studio also compare
the prior tree's bytes with the current render.
