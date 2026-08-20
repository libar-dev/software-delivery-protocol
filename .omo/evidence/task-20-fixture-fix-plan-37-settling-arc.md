# Todo 20 fixture fix evidence

- Live Spec: `specs/carrier/markdown-authoring.sdp.md`.
- Fixture: `test/fixtures/extract/self-hosting-carrier/specs/carrier/markdown-authoring.sdp.md.txt`.
- Changed the fixture frontmatter from `readiness: defined` to `readiness: ready`.
- `cmp` confirms the fixture is byte-identical to the live Spec.
- Rechecked the Plan-37 READY set. No other matching self-hosting fixture has a readiness lag; this was the only lagging fixture path.
- Targeted test passed:
  `npx vitest run test/markdown-reifier.test.ts -t "keeps specs/carrier/markdown-authoring.sdp.md.txt"`
  Result: 1 passed, 102 skipped.

The evidence file is intentionally left untracked for the Todo 20 commit.
