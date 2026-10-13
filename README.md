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

Install from the committed lockfile. The `prepare` script builds the CLI:

```sh
npm ci
```

Then query this repository's self-hosting graph with either supported script runner:

```sh
npm run --silent sdp:q -- 'return g.specs().length'
pnpm --silent sdp:q 'return g.specs().length'
```

The `sdp:q` script supplies this repository's required fixture exclusions. Use the
[graph-first recipes](docs/agent-surface/recipes.md) for backlog, drift, verifier, impact, Pack,
readiness, promotion, open-question, dependency, mention, entry-search, Pack design, design-change,
decision, architecture, design backlog, design diff, context bundle, and curation queries.

The [architecture walkthrough](docs/agent-surface/architecture.md) follows shared policy,
runner and adapter responsibilities, and the one read model through the graph.

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

Pin the Protocol to a full commit SHA in your adopter's `package.json`:

```json
{
  "dependencies": {
    "@libar-dev/software-delivery-protocol": "github:libar-dev/software-delivery-protocol#<sha>"
  }
}
```

Replace `<sha>` with the commit you reviewed, then run `npm install` and commit the lockfile.
The package's `prepare` script builds `dist/`, the CLI, subpath exports and shipped recipes during
the git install. npm installs the build dependencies for this step. While the version is `0.0.0`,
use a commit pin; no npm prerelease is published. See [npm's prepare lifecycle](https://docs.npmjs.com/cli/v11/using-npm/scripts/).

pnpm 10 blocks dependency build scripts unless allowed. Before `pnpm install`, add the Protocol to
your adopter's `pnpm-workspace.yaml`:

```yaml
onlyBuiltDependencies:
  - "@libar-dev/software-delivery-protocol"
```

On pnpm 10.26 or later, including pnpm 11, use `allowBuilds` instead of `onlyBuiltDependencies`:

```yaml
allowBuilds:
  "@libar-dev/software-delivery-protocol": true
```

Keep this alongside your existing build permissions. The permission lets pnpm prepare the git
dependency. See the [pnpm 10 build settings](https://pnpm.io/10.x/settings#allowbuilds).
Verify either install through the linked binary:

```sh
./node_modules/.bin/sdp --version
```

In an adopter repository where the Protocol is installed as a dependency, its binary **is** linked
into `node_modules/.bin`, so the package runner resolves it:

```sh
pnpm exec sdp --help
pnpm exec sdp build .
pnpm exec sdp validate .
pnpm exec sdp view .
pnpm exec sdp q 'return g.specs().map((spec) => spec.id)'
```

`build` derives the graph, executable contracts and registrars, `validate` adds conformance and
honesty checks, `view` generates the Design Review, `census` the census, `mermaid` the Mermaid
diagrams, and `gherkin` the Gherkin-shaped read view. `new spec` scaffolds an idea-rung Markdown
carrier, `import` converts TypeScript Spec carriers to Markdown, and `q` evaluates a local
JavaScript query body against a freshly derived graph. Run `sdp --help` for the complete option
contract. Adopters own their root and exclusion policy.

### Upgrade recipe callers

Recipe 25, address resolution, now reads `params.addresses`. A script that replaces the recipe's
sample address array with a regular expression can silently stop matching. Remove that rewrite
and pass the subject as data to the shipped recipe:

```sh
./node_modules/.bin/sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/25-address-resolution.js)" --params '{"addresses":["spec:orders.create-order#rule.validCart"]}' --json
```

Use your corpus's addresses, or pass `--params @addresses.json` with an object containing
`addresses`. Other parameterized recipes follow the same pattern. The
[recipe catalog](docs/agent-surface/recipes.md) names each parameter.

In the Protocol source checkout, `npm run test:git-install -- <commit>` proves a committed revision
installs through a local git URL with npm and, when available, pnpm. It checks the installed CLI,
export files and a parameterized shipped recipe. This separate gate downloads dependencies and
builds the committed package, so it runs after the unit suite in CI. It does not test uncommitted
edits. An optional second argument selects the parent directory for its temporary projects.

## Gherkin carrier

Behavior and example Specs may use a `.sdp.gherkin` file as their one canonical surface.
Bare `.feature` is not discovered. It stays ordinary Cucumber / import-source territory.

```gherkin
@spec.orders.submit
@altitude.feature
@readiness.idea
Feature: Submit an order
  - outcome: A valid order is accepted when it is submitted.

  @example-space
  Scenario: Vocabulary
    Given an order {orderId:string}
    When the order is submitted
    Then the order is accepted

  @spec.orders.submit.accepted
  @altitude.story
  @readiness.defined
  Scenario: A valid order is accepted
    - outcome: The order "order-42" is accepted.
    Given an order {orderId: "order-42"}
    When the order is submitted
    Then the order is accepted
```

The parent states `idea` until it declares a relation; `sdp validate` checks each rung against its
floor.

Bind the example through a test suite that carries a static test anchor:

```ts
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { registerAccepted } from "./orders.submit.accepted.test.generated.js";

const acceptedAnchor = specTest({
  id: testAnchorId("test:orders.submit.accepted"),
  label: "valid order acceptance",
  verifies: ref("spec:orders.submit.accepted"),
});
void acceptedAnchor;

registerAccepted({ createWorld, invoke, observe, expected });
```

Create the authored suite with this test anchor, then run `pnpm exec sdp build .` to emit its
registrar sibling. Import that sibling and activate it with your four semantics adapters; an
optional `assertions` adapter adds domain checks. `createWorld`, `invoke`, `observe` and
`expected` are your product's semantics: build the world from the bound point, run the behavior,
read its outcome, and give the expected outcome for the point. The generated registrar owns step
dispatch and the comparator. `bindExample` from `@libar-dev/software-delivery-protocol/vitest` is
the low-level adapter for cases the registrar cannot serve.

Cucumber execution is not part of the design. Generated contracts and registrars with anchored
code-side adapters remain the execution boundary.

Editors do not recognize `*.sdp.gherkin` as Gherkin by default. Associate the suffix with Gherkin
(often the `cucumber` language id) for highlighting and formatting. This repository ships the VS
Code mapping:

```json
{
  "files.associations": {
    "*.sdp.gherkin": "cucumber"
  }
}
```

Copy the same `files.associations` entry into an adopter `.vscode/settings.json`, or apply the
equivalent association in another editor.

Extraction always loads the pinned Cucumber parser stack as ordinary runtime dependencies of
`@libar-dev/software-delivery-protocol`, even when a corpus is Markdown-only:

- `@cucumber/gherkin` `42.0.1`
- `@cucumber/messages` `34.2.1`

Install the Protocol package once; do not add a parallel Gherkin parser or re-pin those packages
for carrier support.

The package installs three agent on-ramps as `SKILL.md` files under
`node_modules/@libar-dev/software-delivery-protocol/.agents/skills/`. Use `sdp-agent-surface` to read
the graph, `sdp-authoring` to author intent, and `sdp-sessions` for advisory delivery-session
routing. The same package includes the runnable recipe bodies at `docs/agent-surface/recipes.md`.
