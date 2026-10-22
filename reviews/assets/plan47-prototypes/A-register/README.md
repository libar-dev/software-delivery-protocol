# Architecture register prototype

This is a proposed panel for the existing architecture page. It renders current anchored data,
including omitted roles, component bindings and units with no membership. It never treats an
anchor as a review approval. The source anchor changes proposed in the annotation review have
not been applied.

The Protocol source base is `44e62ef7b036ff3d1ce86d968ddf81ca735ebc75`. The two lane Specs are
read with the design edits in this commit, so the Protocol page can show their role definitions.
The read-only platform input is `sdp/design-at-scale` at `b038bd4`. The commit containing this
README owns the exact prototype bytes and screenshots; find it with
`git log -1 --format=%H -- reviews/assets/plan47-prototypes/A-register/README.md`.
These are throwaway review artifacts, not a stamped Studio publication.

## Files

- `register.mjs` reads each corpus through the lane engine's `sdp q`, using recipes 17, 28 and 43,
  then writes the two HTML files. It reads role meanings only from the selected corpus's Model.
- `studio.css` is the current Studio stylesheet copied for a self-contained local preview.
- `protocol.html` and `platform.html` show membership and role groups with native disclosures.
- `protocol-1440.png` and `platform-1440.png` show the desktop register and component index.
- `protocol-390.png` and `platform-390.png` show the mobile stack and component-index disclosure.

The snapshots use CSS viewports of 1440 × 1000 and 390 × 1000 at device scale 1. The desktop
rail links to component sections. Mobile tables become stacked rows. Every graph row is in the
HTML with JavaScript disabled; native disclosures reveal it. Component source and design bindings
have their own disclosure. A source file, a role and a target retain their recorded spelling.

## Render and capture

From the lane worktree:

```sh
node /tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/register.mjs /tmp/plan47-wt/A /tmp/plan47-platform
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol.html /tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-1440.png 1440 1000 0
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol.html /tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/protocol-390.png 390 1000 0
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform.html /tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform-1440.png 1440 1000 0
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform.html /tmp/plan47-wt/A/reviews/assets/plan47-prototypes/A-register/platform-390.png 390 1000 0
```

Inspect the screenshots with an image reader after capture. Both widths were inspected; the
mobile row stack retains long ids and source paths without horizontal page overflow. The
mechanical detector reported no findings. The final browser check also opens every disclosure,
checks every in-page link target and confirms that every CodeNode has a source row.

## Re-measure the review

The following creates imports inputs outside `generated`, including the configuration files. The
build writes `generated/imports.json`; copy it out before passing it as recipe input. The Protocol
build invalidates its projection roots, so render the prototype afterwards if a live Studio build
is also needed.

```sh
mkdir -p /tmp/plan47-A
cat > /tmp/plan47-A/imports.config.json <<'JSON'
{ "adapter": "typescript", "tsconfig": "tsconfig.json", "roots": ["src"] }
JSON
node /tmp/plan47-wt/A/dist/cli/sdp.js build /tmp/plan47-wt/A --exclude explorations --exclude examples --exclude test/fixtures/import/parity --imports /tmp/plan47-A/imports.config.json
cp /tmp/plan47-wt/A/generated/imports.json /tmp/plan47-A/protocol-imports.json
node /tmp/plan47-wt/A/dist/cli/sdp.js q --root /tmp/plan47-wt/A --exclude explorations --exclude examples --exclude test/fixtures/import/parity 'return await Promise.all([12,13,15,17,27,28,32,43].map(async number => ({ number, answer: await recipes(number, number === 27 ? { pack: "pack:roadmaps-and-slices-v1" } : {}) })));' --json
node /tmp/plan47-wt/A/dist/cli/sdp.js q --root /tmp/plan47-wt/A --exclude explorations --exclude examples --exclude test/fixtures/import/parity 'return await recipes(40, { imports: params.imports, limit: 1000 });' --params imports=@/tmp/plan47-A/protocol-imports.json --json
```

For the platform, first copy `/tmp/plan47-platform` to `/tmp/plan47-platform-A`, omitting `.git`,
`node_modules` and `generated`. Never build into the read-only original. Keep imports over the
runtime, harness and authored examples, with generated Convex sources excluded explicitly:

```sh
cat > /tmp/plan47-A/platform-imports.config.json <<'JSON'
{
  "adapter": "typescript",
  "tsconfig": "tsconfig.json",
  "roots": ["src", "harness", "example", "fixture"],
  "exclude": [
    "example/convex/_generated",
    "example/convex/inventory/_generated",
    "example/convex/orders/_generated",
    "fixture/convex/_generated",
    "fixture/convex/annex/_generated",
    "fixture/convex/depot/_generated",
    "fixture/convex/yard/_generated"
  ]
}
JSON
node /tmp/plan47-wt/A/dist/cli/sdp.js build /tmp/plan47-platform-A --imports /tmp/plan47-A/platform-imports.config.json
cp /tmp/plan47-platform-A/generated/imports.json /tmp/plan47-A/platform-imports.json
node /tmp/plan47-wt/A/dist/cli/sdp.js q --root /tmp/plan47-platform 'return await Promise.all([17,28,43].map(async number => ({ number, answer: await recipes(number) })));' --json
node /tmp/plan47-wt/A/dist/cli/sdp.js q --root /tmp/plan47-platform-A 'return await recipes(40, { imports: params.imports, limit: 1000 });' --params imports=@/tmp/plan47-A/platform-imports.json --json
```

The imports file is labelled external inferred input. Its omission lists are part of the answer;
a missing component mapping is not evidence that a declared use is false.
