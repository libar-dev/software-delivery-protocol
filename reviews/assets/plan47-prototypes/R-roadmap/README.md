# Lane R prototype: the roadmap page and the roadmap memo

Throwaway design evidence for `spec:consumers.roadmap`, `spec:consumers.roadmap.memo` and
`spec:consumers.spec-studio.roadmap-page`. Nothing here is product code.

- `recipe-53-the-roadmap.body`: the drafted body of recipe 53, the roadmap. It reads a named Pack
  as a roadmap. The engine has no `order` field yet, so `node.order` is always absent and every
  answer says `order: "reading"`; the page and memo carry a note saying so.
- `recipe-55-the-roadmap-memo.body`: the drafted body of recipe 55, the roadmap memo. The shipped
  body would call `recipes(53, ...)`; this one inlines body 53 in place of `/*RECIPE53*/`.
- `build.mjs`: runs both bodies through `sdp q` on each corpus, writes `<corpus>/roadmap.json`,
  `<corpus>/memo.md`, `<corpus>/roadmap.html` (linking `assets/` here) and `<corpus>/memo.html`
  (the memo rendered as a description would show it, by a renderer for the memo's own grammar
  only), and drops `roadmap.html` and `roadmap-expanded.html` (every entry opened, for
  screenshots) into each corpus's built Studio, where their links resolve.

The bodies are `.body` files because a bare function body is not a module the repository's lint
can parse. The HTML kept here links only the copied stylesheet, so it reads as the page does
without script; the copies dropped into each built Studio run the Studio's own script.

## Corpora

- `protocol/`: this worktree at the lane's commit, with its roadmap Pack `pack:roadmap`
  (`specs/roadmap.pack.sdp.md`).
- `platform/`: a copy of libar-platform at `b038bd4` (`/tmp/plan47-platform-R`) with one added
  file, `design/specs/roadmap.pack.sdp.md`, a trial `pack:roadmap` listing the next units of its
  `design/ROADMAP.md` (round 5): the history projection, the history rebuild, the journal
  (baselines and migration) and the restore. The adopter-facing cut has no Spec, so it is left
  out. The platform itself is never edited.

## Reproduce

```sh
cd /tmp/plan47-wt/R
node dist/cli/sdp.js studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
node dist/cli/sdp.js studio /tmp/plan47-platform-R
node reviews/assets/plan47-prototypes/R-roadmap/build.mjs /tmp/plan47-wt/R /tmp/plan47-platform-R
node /tmp/plan47-tools/capture.mjs file:///tmp/plan47-wt/R/generated/spec-studio/roadmap.html protocol/roadmap-1440.png 1440 1000 0
```

## Screenshots

| File | Shows |
| --- | --- |
| `protocol/roadmap-1440.png` | The Protocol's roadmap at desktop width: framing, summary and the four-column board |
| `protocol/roadmap-1440-expanded.png` | The whole page with every entry opened: what holds each, what it rests on, what waits on it, the owner's list |
| `protocol/roadmap-390.png` | The same page at phone width; the board stacks |
| `protocol/memo-1440.png` | Recipe 55's memo rendered as a pull request's forward section |
| `platform/roadmap-1440.png` | The platform copy's trial roadmap: every entry is "to state", waiting only for the owner's statements |
| `platform/roadmap-1440-expanded.png` | The platform page with every entry opened, including the long dependency folds |
| `platform/memo-1440.png` | The platform's memo |

## What the prototype showed

- On the Protocol, the lane's own Specs moved entries 1 and 6 from "to design" to "to state" as
  soon as they reached `defined`: the board tracks the graph with no edit to the roadmap.
- On the platform, nothing is stated `ready`, so every entry is "to state" and each rests on
  many Specs that also wait for a statement. The page folds those, and the waiting list follows
  the statement queue's order, decisions first. That matches the platform's own roadmap unit
  that makes `ready` the approval to build.
- A decision named by `decidedBy` from an entry must count in what waits on the owner; the first
  draft missed the Protocol's two roadmap decisions until it did.
