# PR 35's screenshots

The Spec Studio's pages as `sdp studio` publishes them, at the arc's base and at its head. The
page set is generated and never committed, so these captures stand in for it on the pull request.

## Base: the Studio's phase 0

- `base-protocol-*.png`: the Protocol's own corpus at `main`, `5a0b22c`, published from a clean
  archive of that commit with
  `node dist/cli/sdp.js studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`,
  opened from `file://` in headless Chrome at 1280 × 1600.
- `base-platform-*.png`: the first adopter, libar-platform, at `b038bd4` (which pins the Protocol at
  `abf532d`, PR 33's head), published with its own `npx sdp studio .`, captured the same way.

## Head: the Studio's phase 1

- `head-protocol-*.png`: the Protocol's own corpus at `a9b1d7d`, published as above.
- `head-platform-*.png`: a copy of libar-platform at `b038bd4` with the acceptance's edits applied
  (recipe 48's rule-key proposal for `pack:history-view`, and one component design), published
  with this branch's engine at `a9b1d7d`:

  ```sh
  node <protocol>/dist/cli/sdp.js studio . --base <graph before the proposal> \
    --base-label "Before the history-view rule-key proposal" --runs evidence/plan46-ctrf.json
  node <protocol>/dist/cli/sdp.js stamp --commit b038bd4a77d51690b1ac5bdc31223576193e1266 \
    --source 'https://github.com/libar-dev/libar-platform/blob/b038bd4a77d51690b1ac5bdc31223576193e1266/{file}#L{line}'
  ```

  The page set was served over HTTP, so the shell shows the stamp, and captured through Chrome's
  DevTools protocol with an exact CSS viewport (`Emulation.setDeviceMetricsOverride`), 1280 wide,
  or 390 wide for `head-platform-pack-phone.png`. A plain `--window-size` flag lays a page out
  500 pixels wide and is not a phone check. `reviews/plan46-acceptance.md` records the copy's edits
  and the CTRF run.

| File | Page |
| --- | --- |
| `*-index.png` | `index.html` |
| `*-pack.png` | `packs/history-view.html` (platform) or `packs/spec-studio-v1.html` (Protocol) |
| `*-spec.png` | `specs/application.history-projection.html` (platform) or `specs/consumers.spec-studio.pack-page.html` (Protocol) |
| `head-platform-pack-phone.png` | `packs/history-view.html` at 390 pixels |
| `head-platform-declaration.png` | `specs/application.history-projection.html`, scrolled to `#design.typeHistoryEvent`: pinned declarations with the test lines that cite them |
| `head-platform-coverage.png` | `specs/kernel.domain-kernel.html`, scrolled to `#panel.verification`: verifiers, external run evidence, the example space and its coverage grid |
| `head-*-architecture.png` | `architecture.html` |
| `head-platform-queue.png` | `queue.html`, the owner queue |
| `head-platform-diff.png` | `diff.html`, the design diff of a keying change |
| `head-platform-runs.png` | `runs.html`, run evidence |
| `head-platform-export.png` | `exports/history-view.html`, one Pack as one file |

To see the pages themselves, run the publish command above and open
`generated/spec-studio/index.html`.
