# Task 20 parser hardening claim

## Disposition

Option (a) is recorded in plan 18 §6: the executed refusal-parity matrix has six same-class
findings and four named non-claims, so the parser Spec carries a bounded like-for-like
refusal-parity claim rather than a full-parity claim.

## Pinned Evidence

- `test/extract-parity.test.ts` executes all ten matrix cells against on-disk TypeScript and
  Markdown probe twins.
- `task-19-self-hosting-phase-2.matrix.md` records the executed matrix and its ten passing tests.
- `specs/carrier/markdown-parser.sdp.md` names the six same-class findings and all four
  non-claims.

## Named Non-Claims

1. `extract/parse-error` — YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.
2. `extract/non-static-section` — TypeScript degrades optional section properties; Markdown refuses malformed documents whole.
3. `extract/unrecognized-statement` — Markdown owns prose and structures, not TypeScript statement recognition.
4. `extract/misplaced-authoring` — Markdown has no executable authoring-call surface.

## Verification

- `PATH="$PWD/node_modules/.bin:$PATH" node ./vitest-test.mjs test/extract-parity.test.ts` exited 0: 10 tests passed.
- `npm run check` exited 0: 31 test files and 426 tests passed; self-hosting reified 16 Specs, 1 Pack, and 16 anchors with no errors or warnings.
- `node ./check-self-hosting-gates.mjs` exited 0.
