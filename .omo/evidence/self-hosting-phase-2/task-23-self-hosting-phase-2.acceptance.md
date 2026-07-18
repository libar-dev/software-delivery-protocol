# Task 23 - Flip verification acceptance evidence

Verification used a pristine local clone of `feature/protocol-self-application-phase-2` at
`dd19060b89ee8a3299f14cacb682cf2b26a9a47e` in `/tmp/libar-flip-verify-iFfw/repo`. It ran
`npm ci && npm run check` successfully; the full output is in
`task-23-self-hosting-phase-2.clean-clone.log`.

## (1) Flip is total and recorded

```text
COMMAND: find specs examples/checkout-v1/specs -name "*.sdp.ts" ! -name "*.pack.sdp.ts"
exit: 0
```

The command produced no paths. The two lawful TypeScript Pack manifests remain:

```text
COMMAND: find specs examples/checkout-v1/specs -name "*.pack.sdp.ts" -print
specs/self-hosting.pack.sdp.ts
examples/checkout-v1/specs/checkout.pack.sdp.ts
```

The dual-carrier duplicate-ID fixture retains both carrier surfaces:

```text
COMMAND: find test/fixtures/extract/duplicate-id -maxdepth 1 -type f -print | sort
test/fixtures/extract/duplicate-id/first-site.sdp.ts.txt
test/fixtures/extract/duplicate-id/healthy-sibling.sdp.ts.txt
test/fixtures/extract/duplicate-id/second-site.sdp.md.txt
```

The paired negative proof is recorded in `task-23-self-hosting-phase-2.fixture.log`: deleting
`first-site.sdp.ts.txt` makes the fixture-intact assertion exit `1`, and restoring it returns the
assertion to `0`.

## (2) Round-trip fidelity and installed-package proof

The phase's round-trip report remains attached at
`task-13-self-hosting-phase-2.roundtrip.md`. The clean-clone full check independently passed the
three `test/import-round-trip.test.ts` cases, and the installed-package test was rerun after the
flip:

```text
COMMAND: npm ci && npm run build && npm test -- test/package-smoke.test.ts

> @libar-dev/software-delivery-protocol@0.0.0 test
> node ./vitest-test.mjs test/package-smoke.test.ts

 RUN  v2.1.9 /private/tmp/libar-flip-verify-iFfw/repo

 ✓ test/package-smoke.test.ts (1 test) 6813ms
   ✓ published package surface > proves the installed tarball lists import, dry-runs conversion without writes, and exposes the barrel 6812ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
```

An explicit new packed-tarball consumer repeated the public-surface checks:

```text
COMMAND: npm pack --pack-destination <temporary package root>
TARBALL: libar-dev-software-delivery-protocol-0.0.0.tgz
COMMAND: npm install --no-audit --no-fund <packed tarball>

added 12 packages in 1s
COMMAND: node_modules/.bin/sdp import --dry-run behavior.sdp.ts
=== /private/tmp/libar-flip-package-mHwg/consumer/behavior.sdp.md ===
---
id: spec:round-trip.behavior
kind: behavior
altitude: feature
readiness: defined
...
COMMAND: node -e barrel require check
barrel imports available
```

## (3) Hardening claim landed

The parser claim is authored in `specs/carrier/markdown-parser.sdp.md` and was landed by the
required claim commit:

```text
COMMAND: GIT_MASTER=1 git show -s --format="%H%n%s" f71616d
f71616d18f9b15a52453bbc561e1f74c71236e9b
feat(specs): resolve the parser hardening non-claim with pinned parity evidence

COMMAND: rg -n -C 3 "parity|non-claim" specs/carrier/markdown-parser.sdp.md
19:- rule: The ruled Markdown parser has a bounded refusal-parity claim with the TypeScript carrier for `extract/non-static-envelope`, `extract/invalid-id`, `extract/duplicate-id`, `extract/reserved-property`, `extract/unowned-prose`, and `extract/unrecognized-property`.
20:- rule: Named non-claim — `extract/parse-error` remains distinct because YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.
21:- rule: Named non-claim — `extract/non-static-section` remains distinct because TypeScript degrades optional section properties while Markdown refuses malformed documents whole.
22:- rule: Named non-claim — `extract/unrecognized-statement` remains distinct because Markdown owns prose and structures, not TypeScript statement recognition.
23:- rule: Named non-claim — `extract/misplaced-authoring` remains distinct because Markdown has no executable authoring-call surface.
26:- `test/extract-parity.test.ts` executes the settled refusal-parity matrix, including the six same-class findings and four named non-claims.
```

## (8) `sdp import` is documented

The ratified glossary contains the amended public-surface wording, and the checkout README names
the future per-ID import path:

```text
COMMAND: rg -n "many source adapters" CONTEXT.md
150:| **`sdp import`** | one import verb with many source adapters, sharing the document emitter authored once in the winning carrier; the TS→`.sdp.md` adapter landed, the gen-1 `.feature` adapter designed-in and deferred | round-trip sync |

COMMAND: rg -n "sdp import" README.md examples/checkout-v1/README.md
examples/checkout-v1/README.md:39:The checkout Markdown surface was produced by `sdp import` during the migration.
examples/checkout-v1/README.md:41:`sdp import` remains the verb for any future per-ID TypeScript-to-Markdown move. Specs default to
```

The installed tarball exposes the documented help contract and executes dry-run conversion without
writing its Markdown sibling:

```text
COMMAND: node_modules/.bin/sdp --help
  sdp import <path...> [--dry-run]
...
  import     Convert one or more *.sdp.ts files or recursively scanned roots to write-beside
             *.sdp.md documents. The TypeScript source is never deleted. --dry-run writes
             each would-be document to stdout, headed by its target path, without writing.
             Existing Markdown siblings and non-emitting carrier refusals are rendered as
             findings and never throw or overwrite. Exits 0 only when every requested source
             emits (or would emit); any finding error or operational failure exits 1.

COMMAND: node_modules/.bin/sdp import --dry-run behavior.sdp.ts
=== /private/tmp/libar-flip-package-mHwg/consumer/behavior.sdp.md ===
---
id: spec:round-trip.behavior
kind: behavior
altitude: feature
readiness: defined
...
```
