# Libar Software Delivery Protocol

Libar Software Delivery Protocol is a typed, executable, self-validating meta-model of software
delivery: author `Spec` documents in the repository, derive one graph, and check conformance and
honesty.

**Carrier rule:** Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS
DSL survives as import source and a lawful per-ID option.

Read the [concept](docs/concept/README.md), the [ubiquitous language](CONTEXT.md), and the
[checkout-v1 walkthrough](examples/checkout-v1/README.md).

## Source-checkout quick start

Install from the committed lockfile and build the CLI:

```sh
npm ci
npm run build
```

Then query this repository's self-hosting graph with either supported script runner:

```sh
npm run --silent sdp:q -- 'return g.specs().length'
pnpm --silent sdp:q 'return g.specs().length'
```

The `sdp:q` script supplies this repository's required fixture exclusions. Use the
[eleven graph-first recipes](docs/agent-surface/recipes.md) for backlog, drift, verifier, impact,
Pack, readiness, and promotion queries.

Do **not** use `pnpm exec sdp` in the Protocol's own checkout. `pnpm exec` resolves dependency
binaries, but a package does not install or link itself into its own `node_modules/.bin`; on macOS,
the unresolved name may select Apple's unrelated `/usr/bin/sdp`. The checked-in pnpm setting also
disables pnpm 11's dependency auto-reconciliation for repository scripts, so the supported
`pnpm sdp:q` form does not rewrite an npm-installed dependency tree.

## Installed CLI

In an adopter repository where the Protocol is installed as a dependency, invoke its binary with
that repository's package runner:

```sh
pnpm exec sdp --help
pnpm exec sdp build .
pnpm exec sdp validate .
pnpm exec sdp view .
pnpm exec sdp q 'return g.specs().map((spec) => spec.id)'
```

`build` derives the graph and executable contracts, `validate` adds conformance and honesty
checks, `view` generates the Design Review, `import` converts TypeScript carriers to Markdown, and
`q` evaluates a local JavaScript query body against a freshly derived graph. Run `sdp --help` for
the complete option contract. Adopters own their root and exclusion policy.
