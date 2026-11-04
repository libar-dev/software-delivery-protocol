# From a project that installs the Protocol

Read this in a project rather than the Protocol's checkout: to call the CLI directly, to read the
Protocol's own Specs, or when the runner warns that the skill and the CLI differ.

## Direct forms

The runner wraps `sdp q`. Other verbs run through the project's package runner, which runs only the
installed binary, with the project's root and the exclusions its corpus needs (`PATH` is a
placeholder):

```sh
pnpm exec sdp q 'return g.specs().length' --root . --exclude PATH
pnpm exec sdp generate . --exclude PATH
```

## The Protocol's own Specs

Your project's graph does not hold them. Query them with the runner's `--protocol`, which selects
the installed package's `specs/`, or open the carrier there. That graph is intent only: the package
ships no source anchors, so its delivery facts read empty and its gap warnings say nothing about
what the Protocol built (`spec:consumers.shipped-protocol-corpus`).

## Skills that match the CLI

The installed package is an Agent Plugin, declared by `plugin.json` at its root. Load it as a
plugin, or link all five `skills/sdp-*` folders into the project's skills folder: the skills reach
each other as siblings. A client that caches a copy keeps the siblings together; package files stay
under the installed package root. A copy from anywhere else can teach another version; the runner
warns when the skill and the CLI come from different builds (`spec:decisions.agent-plugin-package`).
