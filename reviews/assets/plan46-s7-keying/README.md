# S7 keying captures

Source head: `ae6092d`, on `lane/46-s6-polish`. The acceptance corpus is the existing disposable
copy at `/tmp/plan46/accept/platform`. These measurements were taken after rebuilding it with
this lane's engine. Re-run the commands rather than inheriting the counts.

```sh
npm run build
node dist/cli/sdp.js studio /tmp/plan46/accept/platform --base /tmp/plan46/accept/base-graph.json --base-label "Before the history-view rule-key proposal" --runs /tmp/plan46/accept/platform/evidence/plan46-ctrf.json
node dist/cli/sdp.js stamp /tmp/plan46/accept/platform --commit b038bd4a77d51690b1ac5bdc31223576193e1266
python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/plan46/accept/platform/generated/spec-studio
```

Start Chrome headless with its own profile and DevTools port 9247, then run the committed
[capture script](capture.mjs) from this worktree. It writes PNG captures and measurements to
`/tmp/s7-shots`, which must exist. The committed WebP images are lossless conversions of those
PNGs. The script selects CSS viewports through CDP device metrics and disables page script before
navigation. Its query parameter forces a fresh navigation when the viewport changes.

```sh
mkdir -p /tmp/s7-shots
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9247 --user-data-dir=/tmp/s7-chrome --no-first-run --no-default-browser-check about:blank
node reviews/assets/plan46-s7-keying/capture.mjs
```

| Page | Desktop | Phone | What the capture shows |
| --- | --- | --- | --- |
| Diff, at Generation registry | [1280 px](diff-1280.webp) | [390 px](diff-390.webp) | Each keyed row carries its rule text, inline code and addresses. The rows follow the head's rule order. |
| Generation registry | [1280 px](spec-1280.webp) | [390 px](spec-390.webp) | The linked note reads `17 rules keyed, wording unchanged`. |
| History view, at Changed since the base | [1280 px](pack-1280.webp) | [390 px](pack-390.webp) | All 12 changed members read `keyed only`. |

[Measurements](measure.json) cover those pages at 1280, 820 and 390 px. Their document widths
stay within the viewport. Page script was disabled; no request left the local server and no
browser exception was recorded. Each of Generation registry's 17 keyed rows is present at every
width. The long rules wrap into readable paragraphs on a phone.

A separate comparison of the rendered diff with recipe 35 and the head graph's rule-key order
confirmed the order on all 12 changed Spec rows. The unit test also covers reordered rules and
flows with added, renamed and removed keys, and checks that the recipe answer is not mutated.
