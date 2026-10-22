# Capability map design evidence

The intended corpus is commit `0eb6909` on `p47/e-epics`, based on `44e62ef`. The comparison corpus is libar-platform at `b038bd4`. No platform carrier was changed. These scripts and pages are throwaway evidence; no product code imports them.

`prototype.mjs` reads a live root through this checkout's `sdp q`, or reads a graph snapshot that `sdp q` produced. It evaluates the draft `map-recipe.mjs` through the exported reader evaluator. `studio.css` is copied unchanged from this checkout's Studio. The renderer writes the three capability pages and a companion index for each, with native disclosures containing the complete refinement text. The index prototype exercises epic and kind filtering. The product must retain every existing index filter and Pack card.

The drawing sketches a readable branch: the epic and at most six direct children in id order. Every omitted branch is named as folded and available in the complete text. That sketch does not settle lane G's drawing bound, Mermaid output, zoom or layout algorithm. The product uses the shared diagram implementation. On a phone the prototype uses the complete refinement text instead of shrinking SVG labels.

## Reproduce

Run from `/tmp/plan47-wt/E` with its built `dist/` and dependencies. Scratch paths here are outside the authored corpus. If recreating the evidence elsewhere, pass that checkout's absolute paths and Studio URLs.

```sh
mkdir -p /tmp/plan47-E/base-root
# Restore the base's carriers and source without checking out over the lane.
git archive 44e62ef | tar -x -C /tmp/plan47-E/base-root
# The engine/source is unchanged since the base. Copy dist, never symlink it:
# relative builder trust resolves against the engine's own source checkout.
cp -R /tmp/plan47-wt/E/dist /tmp/plan47-E/base-root/dist
ln -s /tmp/plan47-wt/E/node_modules /tmp/plan47-E/base-root/node_modules
node /tmp/plan47-E/base-root/dist/cli/sdp.js q --root /tmp/plan47-E/base-root --exclude explorations --exclude examples --exclude test/fixtures/import/parity 'return {graph,report}' --json > /tmp/plan47-E/base.json
node dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity 'return {graph,report,specs:g.specs()}' --json > /tmp/plan47-E/head.json

# The shared platform snapshot is read-only. Copy only if this private copy is absent.
cp -R /tmp/plan47-platform /tmp/plan47-platform-E
node dist/cli/sdp.js studio /tmp/plan47-platform-E
# Publish the head Studio after validation, which invalidates generated page roots.
node dist/cli/sdp.js studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity

node reviews/assets/plan47-prototypes/E-capability-map/prototype.mjs protocol-base /tmp/plan47-wt/E 'Protocol · base 44e62ef' http://127.0.0.1:8471/ /tmp/plan47-E/base.json
node reviews/assets/plan47-prototypes/E-capability-map/prototype.mjs protocol-head /tmp/plan47-wt/E 'Protocol · reviewed epics at 0eb6909' file:///tmp/plan47-wt/E/generated/spec-studio/
node reviews/assets/plan47-prototypes/E-capability-map/prototype.mjs platform /tmp/plan47-platform-E 'Platform · unchanged b038bd4' file:///tmp/plan47-platform-E/generated/spec-studio/

node reviews/assets/plan47-prototypes/E-capability-map/measure.mjs /tmp/plan47-E/base-root /tmp/plan47-E/base-root/dist/cli/sdp.js
node reviews/assets/plan47-prototypes/E-capability-map/measure.mjs /tmp/plan47-wt/E
node reviews/assets/plan47-prototypes/E-capability-map/measure.mjs /tmp/plan47-platform
node reviews/assets/plan47-prototypes/E-capability-map/check-prototype.mjs /tmp/plan47-E/head.json /tmp/plan47-E/base.json
node reviews/assets/plan47-prototypes/E-capability-map/check-browser.mjs
```

The base page's Spec links use the base Studio already served at `http://127.0.0.1:8471/`. The head and platform links point to the generated Studio roots above. These local evidence pages are not a portable published preview; use the regenerated Studio or rewrite the supplied URLs before sharing them outside this workspace.

## Screenshots

For each name `protocol-base`, `protocol-head`, and `platform`, capture both widths:

```sh
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head.html /tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head-1440.png 1440 1050 0
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head.html /tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head-390.png 390 1050 0
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head.html /tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head-branch-1440.png 1440 1050 0 '[id="spec:model.core-model"]'
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/platform.html /tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/platform-branch-1440.png 1440 1050 0 '.branch'
```

The base overview shows one broad epic and unreached Specs. The head overview shows the authored capability epics. The platform shows the existing broad epic without changing its design, including the difference between its stated rung and floor. The branch shots demonstrate readable labels and the route to complete text.

Browser checks cover all three corpora at both widths without horizontal overflow, unique HTML ids, an epic's 48 selected Specs, its 27 examples after intersection, reset, invalid and repeated query parameters, and the no-script fallback. Recipe probes cover repeated ancestry, cyclic and unreached graphs, unresolved endpoints, no epics, an empty corpus, nested epic scope, unique descendant counts and determinism. These are prototype checks, not shipped tests or evidence that recipe 52 is implemented.

## Review response

The recipe now defaults to a summary and takes `detail: true` for full rows. The pages use the
full answer. Cards name containing and contained epics. Rows say binding `present` or `none`,
question links use `section.intent` when unkeyed, and singular counts read correctly. The text
walk visits children in id order before folding individual examples and decisions.

`protocol-head-index-1440.png` and `protocol-head-index-390.png` show the agent epic selected,
including its 48 of 423 rows. Reproduce those screenshots with:

```sh
node /tmp/plan47-tools/capture.mjs 'file:///tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head-index.html?epic=spec%3Aconsumers.agent-surface' /tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head-index-1440.png 1440 1050 0
node /tmp/plan47-tools/capture.mjs 'file:///tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head-index.html?epic=spec%3Aconsumers.agent-surface' /tmp/plan47-wt/E/reviews/assets/plan47-prototypes/E-capability-map/protocol-head-index-390.png 390 1050 0
```

The probes also compare summary/full totals and omissions, distinguish parameter refusal from
graph damage, retain direct epic parents and verify the old ready statements, floors and binding
facts against the separately derived base snapshot. All measurements are re-runnable; the
screenshots are the evidence that needs a committed artifact.
