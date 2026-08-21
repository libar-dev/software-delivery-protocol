# F2 Remediation AdversarialVerify

Independent verify of the combined uncommitted F2 remediation.
Owned deliverable: this file only. No other edits, stage, commit, push, or stash.
Full `npm run check` was not run.

Verdict: **confirmed**
Confidence: **0.92**

## Scope attacked

Original F2 rejection (`f2-code-quality.md`) plus triages `st_01a022a1` / `st_01a022a2` / `st_01a022a3`, red tests `st_01a022aa`, corpus fix `st_01a022ab`, recipe fix `st_01a022b0`, plan/catalog recipe-19 lockstep `st_01a022be`, and the live uncommitted diffs.

Four original findings:

1. HIGH — MD-34 invented a third validator family.
2. MEDIUM — recipe 19 throws on a graph that validly carries validation findings.
3. MEDIUM — architecture-layer `pattern` is refused and defined at once.
4. LOW — recipe 19 machine key `abstractions`.

## Finding 1 — two-family validator law

**Status: fixed.** No third-family promise remains in the canonical Spec, exact oracle, or supplied plan copy.

- `specs/decisions/architectural-significance-rides-primitives.sdp.md`, `test/self-hosting-oracle/decisions.ts`, and `.omo/plans/architectural-patterns-views.md` all contain the replacement grain-limit sentence (`negative constraints remain declared intent, not machine-enforced graph findings`) and **zero** hits for `architecture-enforcement validator family`, `architecture-enforcement`, or `validator family`.
- `CONTEXT.md` locked usage is still `conformance checks + honesty checks`. Runtime `ValidatorFamily` remains `["conformance", "honesty"]`.
- Surviving `architecture-enforcement checks/tiers` hits in `docs/concept/01-founding-principles-and-invariants.md`, `docs/concept/07-mvp-roadmap-and-open-questions.md`, and `jtbd-stories/README.md` name a deferred competency, not a family. That matches triage `st_01a022a1` (those paths were not the defect).
- MD-34 alternative still says `an architecture validator` as a **refused** alternative. That is use-mention of a rejected path, not a family promise.

## Finding 3 — architecture-layer `pattern`

**Status: fixed.** No positive model term/definition. CONTEXT rejection is scoped. Spec id, readiness, and relations are stable.

- `specs/model/structural-patterns.sdp.md` id/filename unchanged. Title is `Architectural significance dissolves into existing primitives`. Model terms = `["architecturally significant unit"]` only. `model.terms.pattern` absent in Spec and `test/self-hosting-oracle/model.ts`.
- CONTEXT rejected ledger: `pattern` (as an architectural primitive, kind, or `pattern:` namespace — ordinary English remains; MD-34). The `generated-union pattern` glossary row is ordinary English and was left untouched.
- Remaining `pattern` hits on the two carrying Specs are stable id `spec:model.structural-patterns`, refused-term / `pattern:` namespace use-mention, or the refused `pattern layer` alternative. `findByConcept("pattern")` live matches: structural-patterns `["id"]` only; MD-34 `["sections.decision"]`; plus out-of-scope ordinary English on `spec:decisions.sdp-gherkin-extension` and `spec:decisions.structural-anchor-semantics`.
- Fresh `sdp:q` graph query (recipe-3 shape):

| Spec | stated | derived | floorFailures | relationsOut | relationsIn |
|---|---|---|---|---|---|
| `spec:model.structural-patterns` | defined | ready | `[]` | `decidedBy` → MD-34 (declared, resolved); `refines` → `spec:model.anchors` (declared, resolved) | `[]` |
| `spec:decisions.architectural-significance-rides-primitives` | ready | ready | `[]` | `dependsOn` binding-not-liveness; `dependsOn` structural-anchor-semantics; `refines` anchors (all declared, resolved) | `decidedBy` from structural-patterns and structural-self-binding |

No findings. No new relation type. Delivery facts `[]`.

## Finding 4 — recipe 19 machine key

**Status: fixed.** Catalog and live JSON emit `implementations` only. No `abstractions` key or alias.

- `docs/agent-surface/recipes.md` token count: `abstractions` **0**, `implementations` 14. Optional chaining `component?.label` / `file` / `line` present. After `st_01a022be`, the plan todo-10 recipe-19 JS body is byte-identical to this catalog body (proof below).
- Live known (`const id = "spec:consumers.agent-surface"`) via `pnpm --silent sdp:q '<catalog-19-body>' --json`: exit 0. Top-level keys include `implementations`, not `abstractions`. Raw JSON has no `abstractions` substring. Implementation ids: `impl:protocol.agent-surface`, `impl:protocol.agent-surface-cli`. Component rows use `implementations` only (`component:protocol.cli` → `impl:protocol.agent-surface-cli`; `component:protocol.reader` → `impl:protocol.agent-surface`).
- Live unknown (only the opening id substituted to `spec:does-not-exist.unknown`): exit 0, `{ "id": "spec:does-not-exist.unknown", "found": false }`. No `abstractions` key.
- Focused tests pin the key contract against live `g.specContext("spec:consumers.agent-surface").implementations` and forbid `abstractions` on the top-level result and every component row.

Triage `st_01a022a3` described top-level `implementations` as the non-component subset. The red tests and catalog instead emit the full `SpecContext.implementations` list (the previous `!componentIds` filter is gone). On this live corpus both implementations are `impl:` ids, so known output is observationally identical. That is a deliberate contract alignment with the reader vocabulary, not a leftover alias.

## Finding 2 — invalid-but-reportable dangling `memberOf`

**Status: fixed.** Dangling target yields a total recipe: no throw, preserved component row, retained implementation id, null metadata, no phantom component entry point.

Independent `/tmp` reproduction (catalog body compiled the same way as `sdp q`; graph cloned from a fresh `extract`; `component:protocol.reader` node dropped; `memberOf` edges kept; `dist` `validateGraph` + `createReader`):

- `validateGraph` reports `conformance` / `conformance/referential-integrity`, including `impl:protocol.agent-surface` → `component:protocol.reader`.
- Body did not throw.
- Unresolved row: `{ id: "component:protocol.reader", label: null, file: null, line: null, directlySatisfies: false, implementations: ["impl:protocol.agent-surface"] }`.
- Top-level `implementations` retains `impl:protocol.agent-surface`.
- `blastRadiusEntryPoints` has **zero** `role: "component"` entries for the missing id (`addEntryPoint` still skips non-string `file`).
- Raw result has no `abstractions` substring.

Focused CLI test `preserves an unresolved component row when memberOf outlives the node` covers the same clone through real `runSdpCli` and asserts exit 0. Combined: body totality + CLI exit 0.

## Tests and quality

| Command | Result |
|---|---|
| `npx vitest run test/recipes.test.ts` (once) | 1 file, **27 passed (27)**, vitest 4.1.10, 3.16s |
| `npx vitest run test/self-hosting-graph.test.ts test/self-hosting-model.test.ts test/readiness.test.ts` | 3 files, **49 passed** |
| `npm run typecheck` | exit 0 |
| `npx prettier --check` on the eight product/corpus files | All matched files use Prettier code style |
| `npm run lint` (`eslint .`) | exit 0; run **after** tests/typecheck and **before** validate (no overlap with generated-contract replacement) |
| `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` | exit 0; 162 specs · 172 anchors · 335 nodes · 731 edges; 0 errors; 5 expected `honesty/gaps` warnings |

Recipe-suite nondeterminism audit: no `sleep`, timers, polling, or clock reads. Live extract is module-level; dirty clone filters nodes into a new array and does not mutate `derived`. Failures of the original regressions were stable key-shape and property-access, not timing.

Assertions were not weakened relative to the red-test lock: the catalog-body fix did not edit `test/recipes.test.ts`. The new tests still go through `runSdpCli` with `--json` and the catalog body. Success is not from `generated/` (query sink derives in-process; tests call `extract()`).

`src/` diff is empty. Product/corpus edits are the F2 lockstep set plus recipe 19 / recipe tests. Unrelated dirty orchestration (`.omo/boulder.json`, `.omo/start-work/ledger.jsonl`, F1/F3/F4 plan checkboxes) is pre-existing parent state, not engine behavior.

## Adversarial classes

| Class | Result |
|---|---|
| Original finding still present | None of the four remain in shipped Spec/oracle/catalog/CONTEXT/live graph/live recipe 19 |
| Regression | None observed on focused recipe, self-hosting/readiness, live known/unknown, dirty-graph, or validate |
| Unrelated path/behavior | No `src/` behavior change. Top-level recipe-19 membership filter removal is latent on this corpus and encoded by the red tests |
| Nondeterminism | None in the new tests or this verify |
| Stale/generated success | Query and tests derive live; validate refreshed ignored `generated/` only |
| Weakened assertions | Red-test contracts kept. Dirty-row check uses `objectContaining` (does not itself forbid an extra `abstractions` key); catalog has zero `abstractions` tokens and independent JSON dump shows the exact row without that key |

## Final lockstep after st_01a022be

Independent parser, not the sync task's claim:

- Catalog bodies: `parseRecipes` rule from `test/recipes.test.ts` (`## N.` heading, then fenced ` ```js `).
- Plan bodies: todo-10 4-space-indented ` ```` ` fences, heading line dropped, 4-space dedent, trailing empty lines stripped.
- Comparison: raw string equality of those JS bodies, plus SHA-256.

| Body | WT plan SHA-256 | WT catalog SHA-256 | bytes | `plan == catalog` | vs HEAD |
|---|---|---|---|---|---|
| 17 | `5b5e5b5a635b81dcd7542fa9b66b72e90ee810138abac1b5e2dc7afd9bed0a9f` | same | 2860 | **yes** | plan and catalog both **unchanged** from HEAD |
| 18 | `e2a4164f68998e0627383f28f547ac269fcb1efd9120e70a0088bb12cb3d60d8` | same | 2475 | **yes** | plan and catalog both **unchanged** from HEAD |
| 19 | `9e2b1cdf2c093667ed6a7d7af8603bef9af43dd0abb2e29b673cca0e0054c50e` | same | 3984 | **yes** | HEAD was `d72d5b8457027a23456fc314090d143cf84f61579a99511fcf7afe8efde58bc2` (4023 bytes, 6 `abstractions`) |

Recipe-19 WT body (plan and catalog):

- `abstractions` tokens: **0** (whole plan file 0; whole `recipes.md` 0)
- `implementations` tokens in the JS body: 11
- nullable CodeNode metadata: `label: component?.label ?? null`, `file: component?.file ?? null`, `line: component?.line ?? null` present
- legacy assignments `label: component.label` / `file: component.file` / `line: component.line` **absent**
- top-level `implementations: implementations` (no `!componentIds` filter)

Checklist in `.omo/plans/architectural-patterns-views.md`:

- `- [x] F1. Plan compliance audit`
- `- [ ] F2. Code quality review`
- `- [x] F3. Real manual QA`
- `- [x] F4. Scope fidelity`

F1/F3/F4 checked, F2 still unchecked.

Four already-confirmed fixes rechecked on the current tree (file/oracle/plan/catalog audit; no full gate this continuation):

1. Two-family law — grain-limit replacement still in Spec, oracle, and plan; zero `architecture-enforcement validator family` there; CONTEXT still locks conformance + honesty.
2. Invalid-but-reportable — catalog and now-matching plan body keep `component?.label/file/line ?? null`; no unguarded CodeNode metadata assignment.
3. Architecture-layer `pattern` — `spec:model.structural-patterns` id stable; `model.terms.pattern` still absent; CONTEXT scoped rejection still present.
4. Recipe-19 key — catalog and plan JS emit `implementations` only; zero `abstractions`.

## Residual risks

- `src/validate/validators.ts` still comments “deferred check families” for architecture enforcement. Triage marked that comment `required: false`; runtime families are unchanged. Out of F2 product scope.
- Dirty-row test does not assert absence of `abstractions` on the unresolved object; covered statically by catalog token count and by the independent dump.
- Full `npm run check` not run, as requested.

## Cleanup

- This continuation updated only this evidence file.
- Prior `/tmp/f2-adv-verify/` already removed; no new temps left.
- Did not stage, commit, push, or stash.
- Did not edit catalog, plan, tests, corpus, Boulder, or ledger.

```json
{
  "AdversarialVerify": {
    "verdict": "confirmed",
    "confidence": 0.92,
    "findings": [],
    "commands": [
      {
        "command": "npx vitest run test/recipes.test.ts",
        "result": "1 file, 27 passed (27), vitest 4.1.10, once"
      },
      {
        "command": "npx vitest run test/self-hosting-graph.test.ts test/self-hosting-model.test.ts test/readiness.test.ts",
        "result": "3 files, 49 passed"
      },
      {
        "command": "npm run typecheck",
        "result": "exit 0"
      },
      {
        "command": "npx prettier --check CONTEXT.md docs/agent-surface/recipes.md docs/concept/DECISIONS.md specs/decisions/architectural-significance-rides-primitives.sdp.md specs/model/structural-patterns.sdp.md test/recipes.test.ts test/self-hosting-oracle/decisions.ts test/self-hosting-oracle/model.ts",
        "result": "All matched files use Prettier code style"
      },
      {
        "command": "npm run lint",
        "result": "exit 0; serial, not overlapped with validate"
      },
      {
        "command": "pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity",
        "result": "exit 0; 162 specs · 172 anchors · 335 nodes · 731 edges; 0 errors; 5 honesty/gaps warnings"
      },
      {
        "command": "pnpm --silent sdp:q '<catalog recipe 19 body>' --json",
        "result": "exit 0; implementations only; no abstractions substring"
      },
      {
        "command": "pnpm --silent sdp:q '<recipe 19 unknown id>' --json",
        "result": "exit 0; {id: spec:does-not-exist.unknown, found: false}"
      },
      {
        "command": "pnpm --silent sdp:q '<specContext+findByConcept query>' --json",
        "result": "exit 0; both Specs ready-floor, hasPatternTerm false, relations unchanged"
      },
      {
        "command": "node /tmp/f2-adv-verify/dirty-graph.mjs",
        "result": "no throw; referential-integrity; unresolved row null metadata; impl retained; no phantom component entry"
      },
      {
        "command": "independent parseRecipes + plan ```` extractor; SHA-256 and raw equality of recipes 17-19; HEAD vs WT",
        "result": "plan19==catalog19==9e2b1cdf…3984 bytes; 17/18 SHA unchanged vs HEAD and catalog; plan/catalog abstractions 0; component?.label/file/line present; F1/F3/F4 [x], F2 [ ]"
      }
    ],
    "adversarialClasses": {
      "originalFindings": "all four still closed in Spec/oracle/plan/catalog/CONTEXT; plan recipe 19 now byte-locks to catalog",
      "regressions": "recipes 17/18 bodies unchanged vs HEAD and catalog; four prior fixes did not recur",
      "unrelatedPaths": "src/ empty; this continuation edited only this evidence file",
      "nondeterminism": "none; hashes are SHA-256 of extracted JS bodies",
      "staleGeneratedSuccess": "false; lockstep is source-body equality, not generated output",
      "weakenedAssertions": "red-test contracts kept; catalog and plan have zero abstractions tokens"
    },
    "cleanup": "this continuation: evidence file only; no stage/commit/push/stash",
    "residualRisks": [
      "optional stale validators.ts 'deferred check families' comment",
      "full npm run check not run"
    ]
  }
}
```
