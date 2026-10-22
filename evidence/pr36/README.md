# PR 36 evidence

Screenshots of the Spec Studio for PR 36's description, committed on the arc's branch and removed
before merge (the roadmap over plan and review files, MD-47); the description links them at the
commit that holds them.

- `head-protocol-*`: this branch's own Studio, built with
  `npm run generate:self-hosting` and opened from `generated/spec-studio/`.
- `base-protocol-*`: `main` at `da4b141`, from a clean archive of that commit with its own engine:
  `node dist/cli/sdp.js studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`.
- `head-platform-*`: a copy of libar-platform at `b038bd4` built with this branch's engine:
  `node <protocol>/dist/cli/sdp.js studio <copy>`. The platform is never edited.

Captured in headless Chrome with an exact CSS viewport, 1440 wide (390 for `*-phone`):
`node capture.mjs <file URL> <out.png> <width> <height> 0 <selector to scroll to>`, where
`capture.mjs` drives Chrome's DevTools protocol (`Emulation.setDeviceMetricsOverride`, then
`Page.captureScreenshot`).

The roadmap capture shows the state before this PR removed its six built entries from
`pack:roadmap`.
