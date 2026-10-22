# Roadmap page build evidence

Captured on `p47/w2c-roadmap-page`, based on `79b049dc`, with the implementation in the commit
that carries this directory. Screenshots are full-page Chrome renders at 1440 and 390 CSS
pixels, with a 1000-pixel viewport height and device scale 1. The page uses the existing Studio
styles and script.

- `roadmap-1440.png` and `roadmap-390.png` show this lane's published page.
- `combined-nav-1440.png` and `combined-nav-390.png` show a preview copy with the Capabilities
  link inserted immediately after Packs. The capability-page lane is absent from this base;
  this preview measures the combined navigation and does not verify the Capabilities route.
- `metrics.json` records the browser measurements. The combined navigation has one line at
  desktop width and three at phone width. Neither layout overflows the document horizontally;
  the board has four columns at desktop width and stacks at phone width.

Build the page with:

```sh
npm run build
node ./dist/cli/sdp.js studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Open `generated/spec-studio/roadmap.html`. For the combined preview, copy that page and its
`assets/` directory outside `generated/`, then insert
`<a href="capabilities.html">Capabilities</a>` after the top navigation's Packs link. No other
HTML or style changes are made to the preview.

The capture and interaction script from this session is `/tmp/plan47-build/W2c-browser.mjs`;
its outputs are also at `/tmp/plan47-build/shots/W2c/`. It checks each viewport's board geometry,
the scripted need filter, all rows visible without script, expanded-page width, and the displayed
and copied memo against recipe 55's exact string. The durable unit suite is
`test/studio-roadmap.test.ts`; the publisher suite checks repeat publication byte for byte.
