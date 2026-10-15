# PR 33's screenshots

The Spec Studio's pages, as `sdp studio` publishes them, opened from `file://` in headless Chrome
with no network. The page set is generated and never committed, so these captures stand in for it
on the pull request.

- `protocol-*.png`: the Protocol's own corpus at `30f196a`, published from the repository root with
  `node dist/cli/sdp.js studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`.
- `platform-*.png`: the first adopter, libar-platform, on its branch `sdp/design-at-scale` at
  `f8a9805`, which pins the Protocol at `30f196a`, published with `npx sdp studio .`.

| File | Page | Width |
| --- | --- | --- |
| `protocol-index.png` | `index.html` | 1280 |
| `protocol-pack.png` | `packs/corpus-checks-v1.html` | 1280 |
| `platform-pack.png` | `packs/history-view.html` | 1280 |
| `platform-pack-phone.png` | `packs/history-view.html` | 390 |
| `platform-question.png` | `specs/application.history-rebuild.html#question.verifyPassUnderPause` | 1280 |
| `platform-search.png` | `search.html#q=OD-157` | 1280 |
| `platform-example.png` | `specs/application.history-rebuild.write-pause-rebuild-interrupt.html` | 1280 |

Each capture is the visible viewport at device scale 1. To see the pages themselves, run the
publish command above and open `generated/spec-studio/index.html`.
