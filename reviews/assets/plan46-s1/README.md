# S1 measurement and diagram evidence

The base is `2f2611c3eaf6cecc183e1e912303941271ee9745`. The final report names the
S1 delivery commit. `measurements.json` records three sequential trials for each engine/corpus
pair and hashes paths and bytes for every file in each page set. The platform copy is at
`b038bd4`. Times include extraction, generation and publishing, under concurrent lane load.

```sh
node reviews/assets/plan46-s1/measure.mjs /tmp/s1-base-corpus "$PWD" /tmp/s1-platform
```

The base checkout must carry its own base `dist/` so that relative builder imports are trusted
against the correct source root. Both Protocol invocations use the three standard exclusions.

The PNGs are offline SVG renders with the Studio's light-theme colors and Menlo, using
`@resvg/resvg-js@2.6.2` installed only in `/tmp/s1-svg-review`. They show the first architecture
drawing, not the entire page. No dependency was added to the Protocol. Reproduce them after
building both page sets:

```sh
npm install --prefix /tmp/s1-svg-review --no-audit --no-fund @resvg/resvg-js@2.6.2
node reviews/assets/plan46-s1/render-diagrams.mjs generated/spec-studio /tmp/s1-platform/generated/spec-studio /tmp/s1-svg-review
```

The browser security policy rejected the `file://` page, so these are not browser screenshots.
The bundled-element tests cover pan, zoom, pinch, reset, click preservation and cleanup; the
static page tests check all links and fragments.
