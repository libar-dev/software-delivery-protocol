# Task 12 typecheck fix evidence

## Original gate failure

Wave 2 `npm run check` reached `npm run typecheck`, which failed with nine TypeScript diagnostics in `test/self-hosting-projections.test.ts` while the focused test already passed. The original diagnostic locations were:

- Banner helper: lines 416, 422, 431, and 435.
- Wholesale-view helpers: lines 881, 883, 895, 896, and 898.

The diagnostics came from passing unions of generated `ExampleContract` values to `paramsForStep`. Each contract has its own StepParams record, so the union could not satisfy a concrete contract parameter. Destructuring through the union also degraded fields to incompatible `ParamValue`/`undefined` shapes, producing literal and number assignment errors.

Adversarial class: `misleading-success-output` — the focused test had passed while the compile-time typecheck gate failed.

## Design fix

`test/self-hosting-projections.test.ts` now has no union-typed contract parameter in the shared banner or wholesale-view helpers.

- Each banner registration reads its own `floorReached` and `bannerRaised` parameters from its concrete contract at the exact step text, then passes the typed values to the shared assertion helper. The dishonest registration separately reads its contract-derived `clauseId`.
- Each wholesale-view registration reads its own `exitCode`, survival booleans, and (only for `stalePageRemoved` and `lateStalePage`) `currentPage` from its concrete contract. The shared assertion helper receives a typed expectations object; contracts without `currentPage` do not read or provide that field.
- No expected values were duplicated, cast, widened, suppressed, or replaced with `any`. The composed-location newline behavior was not changed.

## Verification

Commands run after the final edit:

```text
$ npm run typecheck
> @libar-dev/software-delivery-protocol@0.0.0 typecheck
> tsc --noEmit -p tsconfig.json

(exit 0)

$ npx vitest run test/self-hosting-projections.test.ts
Test Files  1 passed (1)
Tests  11 passed (11)

$ npx prettier --check test/self-hosting-projections.test.ts
Checking formatting...
All matched files use Prettier code style!

$ npx eslint test/self-hosting-projections.test.ts
(exit 0)

$ trailing-whitespace check for test/self-hosting-projections.test.ts
whitespace check clean

$ git diff --check -- test/self-hosting-projections.test.ts .omo/evidence/task-12-typecheck-fix-plan-37-settling-arc.md
(no output; clean)
```
