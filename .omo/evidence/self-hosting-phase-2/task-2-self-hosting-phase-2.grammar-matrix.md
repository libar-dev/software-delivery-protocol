# Task 2 Checkout Grammar Matrix Evidence

Scope: the eleven `Spec` carriers below `examples/checkout-v1/specs/**`; the Pack manifest is excluded.
The frozen grammar is plan 17b rows 122-156. Every observed checkout shape has a ruled form; no GAP
ruling seed is required.

| Checkout ID | Kind / altitude / readiness | Sections and fields used | Relation keys | Frozen 17b coverage | Result |
| --- | --- | --- | --- | --- | --- |
| `spec:orders.order-management` | behavior / epic / defined | Intent (`outcome`, `value`); Behavior (`rules`) | `decidedBy` | 128, 138, 139 | confirmed |
| `spec:orders.create-order` | behavior / feature / defined | Intent (`actor`, `outcome`, `value`); Example space (`given`, `when`, `then`) | `refines`, `constrainedBy`, `decidedBy` | 128, 138, 143 | confirmed |
| `spec:orders.create-order.valid-cart` | example / story / ready | Intent (`outcome`, `value`); immediate `gwt`; Verification (`mode`, `criteria`) | `refines`, `verifies` | 128, 138, 144, 149 | confirmed |
| `spec:orders.create-order.invalid-cart` | example / story / defined | Intent (`outcome`, `value`); immediate `gwt`; Verification (`mode`, `criteria`) | `refines`, `verifies` | 128, 138, 144, 149 | confirmed |
| `spec:orders.create-order.api-contract` | contract / story / idea | Intent (`outcome`, blocking `openQuestions`) | `refines` | 128, 138 | confirmed |
| `spec:orders.order-total-rule` | rule / story / defined | Intent (`outcome`, `value`); Rule (`rules`) | `refines` | 128, 138, 140 | confirmed |
| `spec:orders.order-inventory-rule` | rule / story / defined | Intent (`outcome`, `value`); Rule (`rules`) | `refines` | 128, 138, 140 | confirmed |
| `spec:orders.order-placement-flow` | workflow / feature / scoped | Intent (`outcome`, `value`); Workflow (`flows`) | `refines`, `dependsOn` | 128, 138, 141 | confirmed |
| `spec:orders.order-latency-constraint` | constraint / story / defined | Intent (`outcome`, `value`); Constraints (`flavor`, `statement`, `target`) | `refines` | 128, 138, 145 | confirmed |
| `spec:orders.order-model` | model / story / defined | Intent (`outcome`, `value`); Model (`terms`) | `refines` | 128, 138, 146 | confirmed |
| `spec:decisions.order-lifecycle` | decision / feature / defined | Intent (`outcome`, `value`); Decision (`decision`, `rationale`, `consequences`) | `refines` | 128, 138, 148 | confirmed |

The relation inventory is complete: `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, and
`verifies` appear in checkout; `supersedes` is allowed by row 128 but is not claimed as
checkout-forced. The two example rows independently confirm the immediate `gwt` rule in row 144.

## Hardening Skeleton Cross-check

| TS refusal class | Markdown inventory disposition | Evidence | Checkout forcing |
| --- | --- | --- | --- |
| `extract/parse-error` | named non-claim via `extract/invalid-frontmatter` | `markdown-support.ts:3-12`; 17b row 170 | none |
| `extract/non-static-envelope` | same ID | `markdown.ts:173-196` | all static descriptor envelopes |
| `extract/invalid-id` | same ID | `markdown.ts:158-171` | all eleven `spec:` IDs |
| `extract/duplicate-id` | same shared ID | `reify.ts:53-64`; `validators.ts:204` | migration no-dual-ID atom |
| `extract/reserved-property` | same ID | `markdown.ts:100-110`; `markdown-body-owner-support.ts:26-35` | none |
| `extract/non-static-section` | named non-claim via `extract/invalid-markdown-structure` | `markdown-body.ts:35-37`; 17b row 171 | none |
| `extract/unowned-prose` | same ID | `markdown-body-content.ts:233-241`; 17b row 173 | ruled owned content only |
| `extract/unrecognized-statement` | named non-claim via `extract/invalid-markdown-structure` | 17b rows 139-150 and 171 | lists and fences |
| `extract/unrecognized-property` | same ID | `markdown.ts:100-110`; `markdown-body-owner-support.ts:26-35` | envelope and owner keys |
| `extract/misplaced-authoring` | named non-claim via `extract/invalid-markdown-structure` | 17b row 144 and row 171 | both immediate `gwt` fences |

The ten-row skeleton is therefore confirmed: each TS refusal class has a same-class Markdown
finding or an explicit bounded non-claim, and every checkout-forced shape is named above.
