# Plan 43 demo: the Pack page before and after

Two renderings of the Design Review's Pack page for `pack:design-iteration-v1`, trimmed to its
Members table, for PR 31's description. They are pictures of generated output, never truth:
regenerate the page rather than trusting them.

| Image | Commit | Generated page (sha256) | Image (sha256) |
| --- | --- | --- | --- |
| `pack-before.png` | `258df34`, where the arc began, built with its own engine | `29a0f76dc00dcde497bfe5167a261b45bac59b8540a2afb4bde659d8f7542dbb` | `3263d2f5d7472e581f4fa1af4a51ec1e2219f1d0b048ab53cdd10fb6ffa9dd76` |
| `pack-after.png` | `f708cfc`, PR 31's head when taken | `a20d8645151825b0bc85e145daa6934227e471cb17d8c7c1eebefe6fe8092f57` | `ced16757ce09bfccfcd9a728d71d7087195c719ce2014517d0c65c9448957525` |

How they were made:

1. Generate the page at the commit. At the head, `npm run build && npm run generate:self-hosting`.
   For the base, export `258df34` with `git archive`, link `node_modules`, run `npm run build`,
   then `node dist/cli/sdp.js view . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`.
2. Keep the page's H1 and its Members section, and add a one-line caption naming the commit.
3. Render that Markdown with GitHub's own renderer, `gh api -X POST markdown -f mode=gfm`, wrap it
   in `github-markdown-css` 5.5.1, and capture it with headless Chrome 1720 pixels wide.
