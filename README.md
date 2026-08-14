# Libar Software Delivery Protocol

Libar Software Delivery Protocol is a typed, executable, self-validating meta-model of software
delivery: author `Spec` documents in the repository, derive one graph, and check conformance and
honesty.

**Carrier rule:** Specs and Packs default to Markdown; the TS DSL survives as import source and a
lawful per-ID option, while behavior and example Specs may use Gherkin canonically per ID (the
carrier ruling, MD-18, the Pack syntax ruling, MD-25, and the Gherkin carrier option, MD-27).

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

The full CLI is available in the checkout through the `sdp` script; graph-deriving verbs at this
root need the same three fixture exclusions the `sdp:q` script supplies:

```sh
pnpm --silent sdp --help
npm run --silent sdp -- --help
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Do **not** use `pnpm exec sdp` (or `npx sdp`) in the Protocol's own checkout. `pnpm exec` resolves
dependency binaries, but a package does not install or link itself into its own
`node_modules/.bin`; on macOS the unresolved name selects Apple's unrelated `/usr/bin/sdp`, which
fails with `xcode-select: error: tool 'sdp' requires Xcode`. The checked-in pnpm setting also
disables pnpm 11's dependency auto-reconciliation for repository scripts, so the supported
`pnpm sdp` / `pnpm sdp:q` forms do not rewrite an npm-installed dependency tree.

## Installed CLI (adopter repositories)

In an adopter repository where the Protocol is installed as a dependency, its binary **is** linked
into `node_modules/.bin`, so the package runner resolves it:

```sh
pnpm exec sdp --help
pnpm exec sdp build .
pnpm exec sdp validate .
pnpm exec sdp view .
pnpm exec sdp q 'return g.specs().map((spec) => spec.id)'
```

`build` derives the graph and executable contracts, `validate` adds conformance and honesty
checks, `view` generates the Design Review, `import` converts TypeScript Spec carriers to Markdown,
and `q` evaluates a local JavaScript query body against a freshly derived graph. Run `sdp --help`
for the complete option contract. Adopters own their root and exclusion policy.

## Gherkin carrier

Behavior and example Specs may use a `.sdp.gherkin` file as their one canonical surface.
Bare `.feature` is not discovered. It stays ordinary Cucumber / import-source territory.

```gherkin
@spec.orders.submit
@altitude.feature
@readiness.defined
Feature: Submit an order

  @example-space
  Scenario: Vocabulary
    Given an order {orderId:string}
    When the order is submitted
    Then the order is accepted

  @spec.orders.submit.accepted
  @altitude.story
  @readiness.defined
  Scenario: A valid order is accepted
    Given an order {orderId: "order-42"}
    When the order is submitted
    Then the order is accepted
```

Build the graph and generated contracts:

```sh
pnpm exec sdp build .
```

Bind the generated step contract to code-side handlers and a resolving test anchor:

```ts
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";
import { acceptedContract } from "../generated/contracts/orders.submit.accepted.contract.js";

const acceptedAnchor = specTest({
  id: testAnchorId("test:orders.submit.accepted"),
  label: "valid order acceptance",
  verifies: ref(acceptedContract.spec),
});
void acceptedAnchor;

bindExample(acceptedContract, createWorld, handlers);
```

Cucumber execution is not part of the design. `.sdp.gherkin` is a canonical carrier suffix, not a
Cucumber runner target. Generated contracts plus anchored code-side handlers remain the execution
boundary. Bare `.feature` is never discovered as a Protocol carrier; keep it for foreign Cucumber
corpora and deferred import-source material only.

Default editor and formatter recognition for bare `.feature` is not inherited. Associate
`*.sdp.gherkin` with Gherkin (often the `cucumber` language id) in the editor when you want
highlighting or formatting. This repository ships the VS Code mapping:

```json
{
  "files.associations": {
    "*.sdp.gherkin": "cucumber"
  }
}
```

Copy the same `files.associations` entry into an adopter `.vscode/settings.json`, or apply the
equivalent association in another editor. No second Gherkin grammar ships with the package.

Extraction always loads the pinned Cucumber parser stack as ordinary runtime dependencies of
`@libar-dev/software-delivery-protocol`, even when a corpus is Markdown-only:

- `@cucumber/gherkin` `42.0.1`
- `@cucumber/messages` `34.2.1`

Install the Protocol package once; do not add a parallel Gherkin parser or re-pin those packages
for carrier support. Lazy loading is not promised.

The package also ships the three agent on-ramps — `sdp-agent-surface` (reading the graph),
`sdp-authoring` (authoring intent), and `sdp-sessions` (advisory delivery-session routing) — as
`SKILL.md` files under `node_modules/@libar-dev/software-delivery-protocol/.agents/skills/`,
beside the eleven recipe bodies at `docs/agent-surface/recipes.md` in the same package.
