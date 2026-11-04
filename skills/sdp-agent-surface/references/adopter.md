# Run in any corpus

`scripts/q.mjs` and `scripts/orient.mjs` pick the runtime for you. This file names the direct
forms behind them, how to load the skills so they match the installed CLI, and how to read the
Protocol's own Specs from a project that uses the package.

## The direct forms

In an adopter, use the repository's package runner or its documented wrapper script. Select that
repository's root and repeat only the exclusions its corpus needs:

```sh
pnpm exec sdp q 'return g.specs().length' --root PATH --exclude PATH
pnpm exec sdp q 'return g.specContext("spec:example.id")' --root PATH --exclude PATH --json
```

`PATH` is a placeholder, not a universal exclusion.

In the **Protocol source checkout itself**, use its repository script, which runs
`scripts/q.mjs` and so supplies the exact three fixture exclusions:

```sh
pnpm --silent sdp:q 'return g.specs().length'
pnpm --silent sdp:q 'return g.specContext("spec:consumers.reader")' --json
```

Those exclusions are required only for the Protocol source tree: it carries deliberate
duplicate-id and carrier-parity fixtures. They are the same list `npm run generate:self-hosting`
passes. Run `npm run build` first if `dist/` is absent. Do not use `pnpm exec` in this source
checkout: `exec` resolves dependency binaries, while this package does not link itself into its
own `node_modules/.bin`; an unresolved `sdp` can select macOS's unrelated binary. Do not invoke a
global `sdp` either.

## Recipes as shipped files

The catalog of ready-made bodies is `docs/agent-surface/recipes.md` in the Protocol repository
and `node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md` in an
adopter. Each recipe opens under a numbered heading that names it. Every body there runs verbatim
and a test proves it.

A recipe that takes a subject (a Spec id, a Pack id, changed files, addresses, a term) reads it
from `params.<name>`, and the catalog names the parameter. Pass it as JSON data with `--params`,
never by editing the body; `--params @PATH` reads the JSON from a file. The build also ships each
body as `dist/recipes/<NN>-<slug>.js`, so run it as shipped:

```sh
pnpm --silent sdp:q "$(cat dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js)" --params '{"spec":"spec:consumers.reader"}' --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/04-what-breaks-if-i-change-these-files.js)" --params @changed-files.json --json
```

## Load the skills from the installed package

The installed package is an Agent Plugin: `plugin.json` at its root declares it, and the skills
sit under its `skills/` folder. Load
`node_modules/@libar-dev/software-delivery-protocol` as a plugin in a client that reads Agent
Plugins, or link each `skills/sdp-*` folder into the project's own skills folder
(`.agents/skills/`, or `.claude/skills/` for Claude Code). Either way the skills match the CLI the
project pinned. A copy installed from anywhere else can teach a different version: `scripts/q.mjs`
warns when the skill and the CLI come from different copies of the package.

## The Protocol's own Specs

This skill cites Specs, it never restates them. When you need the law, read the carrying Spec.
Protocol references in this skill name the carrying Specs shipped with the package. Placeholder
ids and the order-domain examples demonstrate syntax and do not name Specs in that corpus. In an
adopter, `g.specContext` on a Protocol id returns `undefined` from your own root. Query it with
`--root node_modules/@libar-dev/software-delivery-protocol/specs`, or open its carrier under that
directory. That graph holds intent only. The package ships no source anchors, so its delivery
facts are empty and its gap and verifier-linkage warnings say nothing about what the Protocol has
built.
