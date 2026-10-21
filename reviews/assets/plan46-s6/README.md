# Studio close-lane captures

Captured from the disposable platform copy at `/tmp/plan46/accept/platform`, served at
`http://127.0.0.1:8765/`. Engine source includes `3dbc328`; its binary was built just before that
commit, so the stamp's engine build identity is `ec55392`. The corpus stamp is
`b038bd4a77d51690b1ac5bdc31223576193e1266`.

Rebuild from the Protocol worktree:

```sh
npm run build
node dist/cli/sdp.js studio /tmp/plan46/accept/platform --base /tmp/plan46/accept/base-graph.json --base-label "Before the history-view rule-key proposal" --runs /tmp/plan46/accept/platform/evidence/plan46-ctrf.json
node dist/cli/sdp.js stamp /tmp/plan46/accept/platform --commit b038bd4a77d51690b1ac5bdc31223576193e1266
```

Chrome ran headless with `--window-size=390,1600 --force-device-scale-factor=1`. Its DevTools
protocol selected a 390 × 1600 viewport for the phone capture and 1440 × 1100 for the desktop
captures. The phone's vertical scrollbar leaves 375 CSS pixels for the document.

| Capture | Page |
| --- | --- |
| [Phone Pack](platform-pack-phone.png) | `packs/history-view.html`, 390 × 1600 |
| [Desktop Pack](platform-pack.png) | `packs/history-view.html`, 1440 × 1100 |
| [Architecture](platform-architecture.png) | `architecture.html`, 1440 × 1100 |
| [Runs](platform-runs.png) | `runs.html`, 1440 × 1100 |
| [Diff](platform-diff.png) | `diff.html`, 1440 × 1100 |

The phone capture restores the contained reading column seen in
[PR 33's capture](../pr33/platform-pack-phone.png). Its longer navigation and stamp wrap. The
maturity table scrolls inside the column, so its later floor columns are reached horizontally.
