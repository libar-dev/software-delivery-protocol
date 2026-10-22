# S1 measurement and diagram evidence

The base is `2f2611c3eaf6cecc183e1e912303941271ee9745`. The final report names the
S1 delivery commit. `measurements.json` records three sequential trials for each engine/corpus
pair and hashes paths and bytes for every file in each page set. The platform copy is at
`b038bd4`. Times include extraction, generation and publishing, under concurrent lane load.

Set `BASE` to the base checkout, `HEAD` to the measured S1 checkout, `PLATFORM` to a disposable
platform copy and `RENDERER` to a disposable renderer install. The commands below use those
portable placeholders. `measurements.json` preserves the commands as they ran, including the
Node binary and checkout paths. Future runs of `measure.mjs` record those exact commands and
a separate `portableCommand` with placeholders. Timings, counts and hashes retain the original
measurements.

```sh
node reviews/assets/plan46-s1/measure.mjs "$BASE" "$HEAD" "$PLATFORM"
```

The base checkout must carry its own base `dist/` so that relative builder imports are trusted
against the correct source root. Both Protocol invocations use the three standard exclusions.

The PNGs are offline SVG renders with the Studio's light-theme colors and Menlo, using
`@resvg/resvg-js@2.6.2` installed only in `$RENDERER`. They show the first architecture
drawing, not the entire page. No dependency was added to the Protocol. Reproduce them after
building both page sets:

```sh
npm install --prefix "$RENDERER" --no-audit --no-fund @resvg/resvg-js@2.6.2
node reviews/assets/plan46-s1/render-diagrams.mjs generated/spec-studio "$PLATFORM/generated/spec-studio" "$RENDERER"
```

The browser security policy rejected the `file://` page, so these are not browser screenshots.
The bundled-element tests cover pan, zoom, pinch, reset, click preservation and cleanup; the
static page tests check all links and fragments.
