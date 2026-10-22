# Vault acceptance for plan 46

Run these commands from the lane checkout. The source platform repository is read only. The
clone is disposable, and the procedure writes only there.

```sh
git clone -q /Users/darkomijic/dev-libar/libar-platform/.git /tmp/plan46-v-platform-acceptance
git -C /tmp/plan46-v-platform-acceptance checkout -q b038bd4
npm run build
node reviews/assets/plan46-vault/measure.mjs /tmp/plan46-v-platform-acceptance
```

The measurement script runs `sdp vault` from the built lane CLI, checks every generated link and
block target, writes `intent/acceptance.md`, edits a generated note, and checks that regeneration
refuses it. It restores the note, regenerates, and compares the intent note's bytes and SHA-256.
It prints file counts, link counts and wall times. The summary's file count covers generated
content files; `filesUnderSdp` also includes the file list.

`platform-measurement.json` records the lane run. Rerun the script against a fresh clone for a new
initial-build time. Machine load affects the times.

## Open the result in Obsidian

1. Open Obsidian's vault switcher and choose **Open folder as vault**.
2. Select `/tmp/plan46-v-platform-acceptance/generated/obsidian-vault`, or the `vault` path printed
   by the measurement script. Select that directory itself, so `sdp/` and `intent/` are its children.
3. Open `sdp/index.md`. Enable the built-in Bases core plugin if its embedded table does not
   appear. No community plugin is required.
4. Open a Pack through the index. Its embedded Base should select its members, and its numbered
   member list should keep the manifest order. Follow a member link, a relation link and a keyed
   entry link. Open the local graph or backlinks to follow incoming relations.
5. Open `intent/acceptance.md` and confirm the note is still there after the measurement. Keep
   Obsidian settings and personal notes outside `sdp/`.
6. To follow a pass, run the command below from the lane checkout, then edit a carrier in the
   disposable clone. The corresponding note reloads; other notes retain their modification time.
   Stop the watcher with Ctrl+C.

```sh
node dist/cli/sdp.js vault /tmp/plan46-v-platform-acceptance --watch
```

Compose proposed changes in `intent/` and cite generated entry block links. Give that note to an
agent as input to the existing change-proposal workflow. The agent forms a proposal, runs recipe
38 with it and its base graph, and applies accepted changes as ordinary carrier edits. The vault
command writes neither proposals nor carriers.

Opening the vault in real Obsidian and recording screenshots belong to the integration lane.
This lane verifies the generated files, filters, links, guard and byte preservation from disk.
The default vault lies under `generated/`. Use `--out` for a vault you want to keep elsewhere;
an in-root directory must be skipped by discovery or explicitly excluded.
