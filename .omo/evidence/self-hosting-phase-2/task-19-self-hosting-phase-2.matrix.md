# Task 19 executed refusal-parity matrix

Command:

```text
PATH="$PWD/node_modules/.bin:$PATH" node ./vitest-test.mjs test/extract-parity.test.ts
```

Result:

```text
Test Files  1 passed (1)
Tests       10 passed (10)
```

| TS refusal class | Markdown probe result | Recorded disposition |
|---|---|---|
| `extract/parse-error` | `extract/invalid-frontmatter` | named non-claim — YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue |
| `extract/non-static-envelope` | `extract/non-static-envelope` | same-class finding |
| `extract/invalid-id` | `extract/invalid-id` | same-class finding |
| `extract/duplicate-id` | `extract/duplicate-id` at both sites after the TS and Markdown twins are extracted together | same-class finding |
| `extract/reserved-property` | `extract/reserved-property` | same-class finding |
| `extract/non-static-section` | `extract/invalid-markdown-structure` | named non-claim — TS drops one optional property while Markdown refuses a malformed document whole |
| `extract/unowned-prose` | `extract/unowned-prose` | same-class finding |
| `extract/unrecognized-statement` | `extract/invalid-markdown-structure` | named non-claim — Markdown owns prose and structures, not TypeScript statement recognition |
| `extract/unrecognized-property` | `extract/unrecognized-property` | same-class finding |
| `extract/misplaced-authoring` | `extract/invalid-markdown-structure` | named non-claim — Markdown has no executable authoring-call surface; equivalent placement is document structure |

The test loads every on-disk fixture twin and invokes the appropriate TypeScript carrier or anchor
reifier plus `reifyMarkdownCarrier`. The duplicate pair additionally runs the real extractor because
duplicate IDs are corpus-level findings rather than standalone carrier findings.
