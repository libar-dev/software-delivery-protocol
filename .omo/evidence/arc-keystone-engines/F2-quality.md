# F2 — Code quality review (arc-keystone-engines)

**Verdict: APPROVE**
**Confidence: 0.86**
**Reviewer: F2 (adversarial, read-only)**
**Tree:** `/home/darkomijic/dev-libar/software-delivery-protocol-arc-keystone-engines` @ `269fe51`
**Base:** `4ccc2e9` (`git merge-base HEAD feature/universal-spec`)
**Diff:** `git diff 4ccc2e9..HEAD` (89 files, +5258 / −156)

Plan commits enumerated: `29b11c0`, `7e22c63`, `e2c2698`, `fa4518f`, `107b9e0` (todo-10 merge), `173b64d`, `fed1759`, `269fe51` (todo-9 merge). Working tree clean.

---

## Verdict

No Must-NOT breach, no single-writer collision on the assigned hot files, no residual pre-ratification vocabulary in new prose, and no dead debugging or commented-out blocks. The remaining issues are nits: copy-paste publishers that already drifted in one fail-closed check, one unused public alias, one mislabeled empty-state cell, and two new projection modules over the 250-LOC soft ceiling with a coherent per-file job.

Ship the quality gate. Do not treat the nits as a rework loop unless a later verifier independently needs the cleanup.

---

## Findings

### 1. Three wholesale publishers are near-copies, and Mermaid already drifted — nit

`src/cli/census-command.ts` (128), `src/cli/gherkin-command.ts` (135), and `src/cli/mermaid-command.ts` (144) each reimplement `compareCodeUnits`, recursive `readPublishedPages`, `pagesEqual`, tmp→rename, and `--check-clean`.

Census and Gherkin follow Design Review: publish when a graph exists even if `validate.exitCode !== 0` (findings stay data). Mermaid refuses that path:

```ts
if (validate.exitCode !== 0 || validate.graph === undefined) {
```

That fail-closed branch is Spec-tested (`test/mermaid-cli.test.ts` “refuses validation errors that retain a graph”), and `spec:consumers.mermaid-view` forbids a shared publication bus — so the triplication is partly intentional independence, not accidental DRY failure. Still slop: three copies of the same 90-line publisher with one semantic fork that a later edit will miss.

Not a blocker: each verb is independently tested, and the Specs asked for separate roots.

### 2. Dead public alias `mermaidToken` — nit

`src/projections/mermaid.ts` exports `mermaidToken = machineToken`. Production code and Mermaid tests call `machineToken`. The alias exists so `test/package-smoke.test.ts` can pin it on the root barrel. Unused export on the published surface.

### 3. Anchor-flavor empty cell reuses the structural-bindings phrase — nit

`renderAnchorFlavors` in `src/projections/census.ts`:

```ts
...(rendered.length === 0 ? ["| — | — | no structural bindings exist | 0 |"] : rendered),
```

That string belongs to the structural-bindings section (`No structural bindings exist.`). The flavor table’s real empty token is already `"no binding edge"`. The mislabeled cell only appears when the graph has zero `Anchor`/`CodeNode` nodes; checkout golden and the structural fixture never hit it. Copy-paste residue, not a live census lie.

### 4. `gherkinKindLieReason` is unused by the projection that needs it — nit

`src/extract/gherkin-kind-honesty.ts` exports both the table and `gherkinKindLieReason`. `src/extract/gherkin.ts` uses the helper. `src/projections/gherkin-view.ts` recasts the table twice:

```ts
(GHERKIN_KIND_LIE_REASONS as Readonly<Record<string, string>>)[kind]
```

Same lookup, weaker typing. Local `const marker` for the ` — LOSSY` suffix is a variable name, not the rejected glossary term “marker” (= anchor).

### 5. Census and Gherkin-view exceed the 250-LOC soft ceiling — nit

Pure new logic (non-blank, non-comment):

| Module | Pure LOC | Role |
| --- | ---: | --- |
| `src/projections/census.ts` | 409 | taxonomy + findings + todo-10 structural SCC |
| `src/projections/gherkin-view.ts` | 310 | 8-kind READ renderer |
| `src/projections/mermaid.ts` | 198 | under ceiling |
| `src/testing/index.ts` | 168 | under ceiling |
| `src/codegen/contracts.ts` added | ~185 | registrar emitter on an already-large file |

Justification holds: census is one `Reader → pages` function and the only lawful C∩D seam; splitting the Tarjan block would invent a second census module. Gherkin-view is one disposable renderer over eight kinds. Neither file hides a second feature. Flagged because 409 is 1.6× the ceiling, not because it should be split in this plan.

`src/codegen/contracts.ts` `renderRunnableRegistrar` also carries a 100-column wrap ladder (given/when/then × hanging/inline). Codegen formatting, not a second writer.

### 6. Small trusted-path defensiveness — nit

- `src/extract/derive.ts` re-checks `typeof component === "string"` / `Array.isArray(uses)` after extraction already withheld malformed envelopes.
- `src/projections/mermaid.ts` `assertMachineTokens` fabricates `{ nodeType: "Anchor", claim: "anchored" } as GraphNode` so dangling ids can reuse a node-only helper.
- `renderMermaid` returns `ReadonlyMap`; census/gherkin return page arrays, forcing `normalizePages` only in the Mermaid CLI.

House style already duplicates `compareCodeUnits` in many files; the new copies follow that pattern rather than introducing it.

---

## Scope (Must-NOT) — held

| Guardrail | Result |
| --- | --- |
| Brief E (`sdp new`, `--watch`, MCP, `bySymbol`) | Untouched. No new command, no watcher, no MCP surface. `bySymbol` remains absent (existing typecheck + demand-map point). |
| MD-28 / suffix / dual-recognition / bare `.feature` | Untouched. Universality Spec explicitly leaves MD-28 closed. Generated view uses `.feature.md` under `generated/gherkin/`, never `.sdp.gherkin`. |
| Self-executing prose; `has-verifier` outside generated contracts + anchored handlers | Held. `specTest` remains the sole `has-verifier` source. Generated registrars do not self-register on import. |
| O5 | Refused in `spec:extraction.runnable-modules` and implemented as authored→generated import only. Engine does not load adopter code. |
| Scenario Outlines / Examples tables | Stay refused (carrier + generated view + freeze Spec). |
| Impact-graph smuggling | `spec:consumers.impact-graph` still `idea` with the blocking identity question intact. |
| Anchor-required lint → error | Not present in the diff. Lint files untouched. |
| Authored delivery status / lifecycle tags / free-form tag vocabulary / parallel registry / per-namespace sibling builders | Refused in the structural-anchor Spec; `codeAnchor` gained only `component` / `uses`. |
| Re-specify Design Review | `specs/consumers/design-review.sdp.md` and `src/projections/design-review.ts` untouched. `sdp view` help text was lightly reworded (“contextual” vs “the one”); page anatomy not reopened. |
| Default-carrier flip | Explicitly refused. Markdown stays default; Gherkin stays opt-in per ID. |

`sdp gherkin` is Brief A branch B3 (universal = generated READ projection under the todo-6 publication posture), not Brief E and not a default-carrier flip.

`./testing` package export, `bindExample(..., after?)`, and schema `0.5.0` are inside Brief B / D.

---

## Single-writer discipline — held

| Hot file | Plan owner | Commits in `4ccc2e9..HEAD` |
| --- | --- | --- |
| `src/graph/schema.ts` | todo 5 | `7e22c63` only |
| `src/extract/derive.ts` | todo 5 | `7e22c63` only |
| `src/extract/gherkin.ts` | todo 9 | `fed1759` only |
| `src/codegen/contracts.ts` | todos 4/8 | `fa4518f` only |
| `src/adapters/vitest.ts` | todos 4/8 | `fa4518f` only |
| `src/runner/` | todos 4/8 | **no diff** |
| `src/cli/sdp.ts` (view registration) | 6 / 7 / 9 | `7e22c63` (census), `e2c2698` (mermaid), `fed1759` (gherkin) |

`src/projections/census.ts` is C-owned: `7e22c63` (todo 6) then `173b64d` (todo 10 seam). No second census Spec.

`src/cli/build-command.ts` was edited by 6, 7, 8, and 9. It is not a listed hot file; the edits are additive invalidation paths plus registrar writes.

Wave 1 landed todos 4+5+6 as one integrate commit (`7e22c63`) rather than three atomic commits. That is process hygiene, not a two-writer collision: later commits did not retouch schema/derive.

---

## Vocabulary (CONTEXT.md) — held

Searched added lines in new Specs, plan 31, and new `src/` modules for `abstraction`, `provenance`, `marker` (glossary sense), `facet`, `two axes`, old readiness ladder.

No residual pre-ratification terms in new prose. New Specs use ratified words: `kind`, `altitude`, `readiness` (stated vs derived), `claim`, `section`, `carrier`, `projection`, `anchor`. Refusal lists name `status` / `implements` as rejected, which is correct.

The only `marker` hit is the local `const marker` in `renderIndex` (LOSSY suffix). Not the glossary alias.

---

## What was checked and not found

- `console.log` / `debugger` / `eslint-disable` / `FIXME` / commented-out statements in added TS
- Sleeps or timing waits in new tests
- New Reader accessors (census/Mermaid/Gherkin stay projection-local)
- Delivery-fact or readiness-floor growth (`src/graph/delivery-facts.ts`, `src/validate/readiness-floor.ts` untouched)
- Design Review page re-spec
- `sdp new`, `--watch`, MCP command, `bySymbol` implementation

---

## Method

Read the full `git diff --stat` / `--name-status` / per-commit file lists, then the complete new modules (`census.ts`, `gherkin-view.ts`, `mermaid.ts`, three CLI publishers, `testing/index.ts`, `gherkin-kind-honesty.ts`) and the hot-file diffs (`schema.ts`, `derive.ts`, `gherkin.ts`, `sdp.ts`, `build-command.ts`, `contracts.ts`, `anchors.ts`, `validators.ts`, `reader.ts`). Grepped the added prose and the Must-NOT surfaces. Did not run `npm run check` (F1’s gate) and did not execute the mutation log (F3’s gate).
