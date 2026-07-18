# Task 41 - Adversarial review remediation evidence

Reviewed scope: `main..8f5aabe` plus the remediation below. The review archive is
[`reviews/07-self-hosting-phase-2-code-review.md`](../../../reviews/07-self-hosting-phase-2-code-review.md).

## B1 re-probe - fidelity refusal

The red probe used TS carriers that previously emitted with no findings while dropping a second
constraint, a string open question, a second `when`, or structural Markdown text. After the fix,
the public import seam returns no `emitted` document and an `import/unsupported-construct` finding.

```text
> npm test -- test/import.test.ts test/cli-import.test.ts test/import-emit-markdown.test.ts test/import-round-trip.test.ts test/package-smoke.test.ts

Test Files  5 passed (5)
Tests  38 passed (38)
```

The same suite covers the public invalid-source-path refusal.

## B2 re-probe - atomic batch publication

The red case placed a Pack carrier and a valid Spec carrier beneath one root. Before remediation,
the command returned one and still created the valid Markdown sibling. The replacement test is
`leaves every target absent when one carrier is refused` in `test/cli-import.test.ts`; it passed in
the command above. The CLI now collects all outcomes before it creates temporary files, and only
publishes after the batch has no refusal or target collision.

## C1 and C2 re-probes - public invocation boundaries

The focused suite passed both:

- importing a requested non-carrier path emits `import/no-sources` and exits one;
- calling `importTypeScriptSpec` with `specs/invalid.ts` returns no output target and
  `import/invalid-source-path`.

## C3 re-probe - carrier documentation agreement

```text
$ node ./check-carrier-rule.mjs
check-carrier-rule - all surfaces agree: canonical-default carrier rule and relations distinction.

$ node ./check-carrier-truth.mjs
check-carrier-truth - 32 repaired claims hold; 19 corpus files scanned; 53 retained mentions classified (no active unqualified sole-TS claim).
```

## Fold and corpus review probe

The empty MD-20/MD-21 former-diary headings were removed; the gate now checks the registry rows
and decision pointers rather than residue headings.

```text
$ node ./check-self-hosting-gates.mjs
phase2Ledger: "G1-G8 scaffold checked"
```

This is deliberately a scaffold result, not an owner G8 acceptance. The pending gate rows and the
fresh final-clone proof remain owned by the next two todo records.
