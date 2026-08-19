# Task 15 evidence — plan 37 J-carrier packet

## Deliverable and scope

- [x] Completed `.omo/evidence/plan-37-j-packets/carrier/markdown-authoring.md` for `spec:carrier.markdown-authoring`.
- [x] The packet includes every TEMPLATE field: identity, recipe-9 floor evidence, exact recipe bodies and raw JSON, section inventory, all relations in/out, implementation binding, verifier semantics, findings, both quote-backed judgment readings, and owner-pending disposition fields.
- [x] The carrier diff and matching `test/self-hosting-oracle/carrier.ts` row are prepared inside the packet only. They remain unapplied.
- [x] The packet explicitly presents both readings required by the task: stub-parent versus law-lives-in-the-tree. Neither is treated as the owner verdict.

## Query/output honesty

Task 3's successful query transcript is explicitly reused, as permitted by the task. The packet records the exact §9 and §3 catalog bodies with only `spec:carrier.markdown-authoring` substituted, the equivalent `corepack pnpm --silent sdp:q ... --json` invocation, and the complete corresponding JSON. There is no hybrid command/output pairing. Recipe 9 records `floorReached: "ready"`, `currentFloorFailures: []`, `firstUnmetClause: null`, and `promotionRequiresHumanStatement: true`.

## Evidence audit

- [x] Recipe 3 section inventory is exactly `intent`, `behavior`.
- [x] Every recipe-3 `relationsOut` and `relationsIn` row preserves `type`, `other`, `claim`, and `resolved`.
- [x] The implementation is the real binding `impl:protocol.markdown-authoring` → `src/extract/markdown.ts:50`; verifiers and findings are empty, with the catalog verifier semantics retained.
- [x] Finished-design evidence quotes the parent intent/rule, implementation anchor, two decision bindings, and the refining Gherkin child.
- [x] Settle-first evidence honestly records `none found`; the comparison against Gherkin is not promoted into an invented blocker.
- [x] The prepared patch changes exactly one readiness line in the carrier and the matching descriptor row, and it is marked owner-pending/unapplied.

## Scope/adversarial audit

- **Product scope:** PASS — only the two requested `.omo/evidence/` files were written. No product/spec, oracle, test, source, generated, helper, recipe, or plan file was touched.
- **Unapplied patch:** PASS — the carrier and oracle changes appear only as fenced diff text; no readiness or descriptor edit was applied.
- **Stale/misleading output:** PASS — raw JSON is retained rather than inferred from the summary, and task-3 reuse is labeled at each query.
- **Prompt injection:** N/A — no corpus text was executed as query input; only fixed catalog bodies and the operator-supplied Spec id were used by task 3.
- **Nondeterminism:** N/A — no tests were edited or run; no timing or sleep-based evidence was used.
- **Forbidden operations:** No build, generate, check, preflight, test, or git command was run for this evidence-only task.

## Result

The packet is ready for the single owner ratification checkpoint. The owner must choose whether to apply the prepared one-rung `defined` → `ready` pair or record a blocking reason; this task makes no readiness change.
