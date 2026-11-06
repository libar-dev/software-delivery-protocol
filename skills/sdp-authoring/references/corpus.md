# Start a corpus

For a project, or a new root inside one, that has no Specs yet. The package README covers
installing the package and approving its build.

- **The root.** A verb derives the graph at the directory it is given, and `sdp q` at the working
  directory or `--root`. It reads every `.sdp.md`, `.sdp.gherkin` and `.sdp.ts` carrier below the
  root, and anchors in its other `.ts` and `.tsx` files; it never enters `node_modules`, `dist`,
  `generated` or a dot-directory. Leave fixtures, copies and other corpora out with `--exclude`,
  a root-relative path prefix with no trailing slash, on every call that derives
  (`spec:extraction.excludes`).
- **Identity is the id, never the path** (`spec:model.stable-ids`). An id reads
  `spec:<family>.<name>`, the family a short name for the area it covers, such as `orders`. A
  file can move without changing the graph. Name it for its id, such as
  `specs/<family>/<name>.sdp.md`, so a reader finds it by name.
- **The first Specs.** Start with one epic that states the outcome, then refine it into features
  and stories. The `refines` relation makes the tree, never the folder. Choose each Spec's kind
  as [writing.md](writing.md) says, and scaffold it through the project's package runner:

```sh
pnpm exec sdp new spec specs/<family>/<name>.sdp.md --id spec:<family>.<name> --kind behavior --altitude epic --title "<title>" --outcome "<outcome>"
```

- **A Pack for the body of work.** A manifest named `<name>.pack.sdp.md` holds `id: pack:<name>`,
  the member ids under `specs:` in reading order, and its framing as prose. A Pack that states
  `order: priority` is the project's roadmap (`spec:carrier.markdown-pack-authoring`).
- **Generated output.** `sdp build` writes under the root's `generated/` folder, disposable and
  rebuilt to the same bytes, so keep it out of version control. A registrar that a tracked suite
  imports sits beside that suite and is committed (`spec:decisions.adopted-registrars-committed`).
- **The checks.** Run `sdp validate` wherever the project checks a change, such as CI: an error
  exits 1, and a warning informs. A project's own policy is a rules file ([rules.md](rules.md)).
- **Agents.** Add the README's handbook block to the project's `AGENTS.md`, so each session
  loads these skills and starts from the graph.
