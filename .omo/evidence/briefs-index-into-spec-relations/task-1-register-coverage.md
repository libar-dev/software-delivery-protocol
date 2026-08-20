# Todo 1 register coverage

## Scope and method

Live graph verification for the 11 rows in `plans/36-adoption-tranches-maturation-and-bundle-evidence-briefs.md:201-218`, using the row map in `.omo/plans/briefs-index-into-spec-relations.md`. The required agent-surface skill was loaded first. Queries used `pnpm --silent sdp:q`; required Spec carriers were checked through `g.specContext(...)`, and row 6 also used `g.findByConcept("Design Review")`.

`git status --short` observed during verification (the GFP carrier/oracle edits were present from the parallel T2 work and were not made by this task):

```text
 M .omo/boulder.json
 M .omo/start-work/ledger.jsonl
 M AGENTS.md
 M specs/consumers/graph-first-planning.sdp.md
 M test/self-hosting-oracle/consumers.ts
?? .omo/drafts/briefs-index-into-spec-relations.md
?? .omo/plans/briefs-index-into-spec-relations.md
```

The pre-existing `AGENTS.md` edit and untracked draft/plan were preserved. This task added only this evidence artifact; no product, carrier, plan, or test file was edited.

## Verdict table

| Row | Claimed home | Verdict | Exact carrier section and inspected evidence |
| --- | --- | --- | --- |
| 1 | `spec:decisions.carrier-universality` | **CONFIRMED** | `sections.decision.decision`: the decision says the other six kinds stay Markdown and that “the corpus default does not flip: Markdown remains the default Spec carrier; a default flip is refused before full honest round-trip exists.” `found: true`. |
| 2 | `spec:decisions.carrier-universality` (with runnable-carrier refusal detail) | **CONFIRMED** | `spec:decisions.carrier-universality.sections.decision.decision` refuses DocStrings/DataTables and keeps Packs under MD-25; `spec:extraction.runnable-modules.sections.behavior.rules` contains “Scenario Outlines and inline Examples tables stay refused” and the explicit refusal of O5. Both `found: true`. |
| 3 | `spec:decisions.structural-anchor-semantics` | **CONFIRMED** | `sections.decision.decision`: “`satisfies` remains the only code-to-Spec realization slot ... so no `implements` field is admitted.” `found: true`. |
| 4 | `spec:extraction.runnable-modules` | **CONFIRMED** | `sections.behavior.rules[0]` (“Registrar over self-running module”) freezes the registrar call shape and five adapters; it also says self-running generated modules are refused. `found: true`. |
| 5 | `spec:extraction.runnable-modules` | **CONFIRMED** | `sections.behavior.rules` contains “O5 engine-side execution of adopter code is refused” and “Scenario Outlines stay refused”; `Case mapping and outlines` also refuses Scenario Outlines/inline Examples as executable constructs. `found: true`. |
| 6 | `spec:consumers.projections-model` | **UNHOMED** | `sections.model.terms` confirms projection law and names the four shipped roots only as projection/read-model concepts; it contains no refusal for re-specifying the shipped Design Review, census, Mermaid, or Gherkin projections. `found: true`, but no row-6 refusal carrier. `g.findByConcept("Design Review")` returned 19 matches, including `spec:consumers.design-review`, but those are positive title/behavior/implementation matches, not the claimed freeze. This is the expected row-6 mint candidate; no mint was performed by this task. |
| 7 | HOLD: `spec:consumers.impact-graph` blocking open question | **HOLD** | `sections.intent.openQuestions[0]` is blocking and asks which language-neutral identity/extraction boundary can support exhaustive symbol reach without freezing a compiler representation. `found: true`; the identity question was not answered. |
| 8 | `spec:decisions.sdp-gherkin-extension` | **CONFIRMED** | `sections.decision.decision`: “Canonical graph-aware Gherkin Specs use the `.sdp.gherkin` suffix” and bare `.feature` is not canonical. `found: true`. |
| 9 | `spec:decisions.agent-front-door` | **CONFIRMED** | `sections.decision.decision`: the front door has the exported reader plus one CLI evaluation sink and does not mint query verbs. `found: true`. |
| 10 | Plan-recorded E2 non-decision (`plans/35:22`) | **NON-DECISION** | No Spec carrier is claimed. The plan record says the ADR three-part test fails (“not surprising ... no new trade-off, cheap to deprecate”) and that no decision Spec is minted. This remains a lawful plan-record non-decision. |
| 11 | Split: `spec:decisions.mcp-deferred` for E3; recorded H triggers/GFP for H | **CONFIRMED (split home)** | E3: `spec:decisions.mcp-deferred.sections.decision.decision` says “MCP integration is deferred until a concrete caller establishes its boundary and contract.” H: `spec:consumers.graph-first-planning.sections.behavior.rules[5]` says a re-entry trigger is the deferred Spec’s own blocking open questions plus `dependsOn` for a true precondition, and no plan document re-arms deferred work; the specific H trigger record remains in `plans/35:78-87`. Both Spec contexts returned `found: true`. No new Spec is warranted for this split row. |

All required Spec-context probes for rows 1-5, 8, 9, and 11 returned `found: true`. Row 6's context also returned `found: true`; its refusal was absent, so it is UNHOMED rather than falsely confirmed. No non-row-6 UNHOMED result occurred.

## Probe results inspected

The final live graph checks returned these section shapes and carrier-text facts:

```json
{
  "spec:decisions.carrier-universality": {"found": true, "sections": ["intent", "decision"]},
  "spec:decisions.structural-anchor-semantics": {"found": true, "sections": ["intent", "decision"]},
  "spec:extraction.runnable-modules": {"found": true, "sections": ["intent", "behavior"]},
  "spec:consumers.projections-model": {"found": true, "sections": ["intent", "model"]},
  "spec:consumers.impact-graph": {"found": true, "sections": ["intent", "behavior"]},
  "spec:decisions.sdp-gherkin-extension": {"found": true, "sections": ["intent", "decision"]},
  "spec:decisions.agent-front-door": {"found": true, "sections": ["intent", "decision"]},
  "spec:decisions.mcp-deferred": {"found": true, "sections": ["intent", "decision"]},
  "spec:consumers.graph-first-planning": {"found": true, "sections": ["intent", "behavior"]}
}
```

The row-6 concept probe's exact result was:

```json
{"term":"Design Review","total":19,"matches":[{"id":"spec:consumers.design-review","nodeType":"Primitive","title":"Design Review renders graph context without becoming a gate","matchedIn":["title","sections.behavior","sections.ui"]},{"id":"impl:protocol.design-review","nodeType":"CodeNode","title":null,"matchedIn":["label"]},{"id":"impl:protocol.diagnostic-rendering-design-review","nodeType":"CodeNode","title":null,"matchedIn":["label"]},{"id":"impl:protocol.wholesale-view-build-invalidation","nodeType":"CodeNode","title":null,"matchedIn":["label"]},{"id":"impl:protocol.wholesale-view-rewrite","nodeType":"CodeNode","title":null,"matchedIn":["label"]},{"id":"test:protocol.diagnostic-rendering.table-cell-location","nodeType":"Anchor","title":null,"matchedIn":["label"]},{"id":"spec:consumers.authoring-on-ramp","nodeType":"Primitive","title":"Authors move one Spec from intent to reviewed evidence","matchedIn":["sections.behavior"]},{"id":"spec:consumers.binding-language-views","nodeType":"Primitive","title":"Views speak binding language, never the internal fact name","matchedIn":["sections.behavior"]},{"id":"spec:consumers.binding-language-views.bound-spec-page","nodeType":"Primitive","title":"A fully bound spec renders binding language on the page and in the index","matchedIn":["sections.behavior"]},{"id":"spec:consumers.binding-language-views.pack-member-table","nodeType":"Primitive","title":"The pack member table speaks the page's binding language, not a shorthand","matchedIn":["sections.behavior"]},{"id":"spec:consumers.census-page","nodeType":"Primitive","title":"Census renders the runtime taxonomy without becoming a registry","matchedIn":["sections.behavior"]},{"id":"spec:consumers.derived-readiness-banner","nodeType":"Primitive","title":"Derived readiness renders beside the stated rung and warns in one direction","matchedIn":["sections.behavior"]},{"id":"spec:consumers.derived-readiness-banner.dishonest-divergence","nodeType":"Primitive","title":"An overstated rung raises the banner and names the clause that refused","matchedIn":["sections.behavior"]},{"id":"spec:consumers.derived-readiness-banner.honest-headroom","nodeType":"Primitive","title":"A rung the structure overshoots renders as information, not as a banner","matchedIn":["sections.behavior"]},{"id":"spec:consumers.design-review.pure-projection","nodeType":"Primitive","title":"The view is the graph read twice, and the corpus is untouched by reading it","matchedIn":["sections.behavior"]},{"id":"spec:consumers.gherkin-view","nodeType":"Primitive","title":"Gherkin view renders any Spec as a disposable read shape","matchedIn":["sections.behavior"]},{"id":"spec:consumers.mermaid-view","nodeType":"Primitive","title":"Mermaid renders bounded one-hop and Pack diagrams without becoming a graph browser","matchedIn":["sections.behavior"]},{"id":"spec:validation.diagnostic-rendering","nodeType":"Primitive","title":"One diagnostic currency, its location composed from structured fields","matchedIn":["sections.behavior"]},{"id":"spec:validation.diagnostic-rendering.table-cell-location","nodeType":"Primitive","title":"The same three location shapes, rendered as table cells","matchedIn":["sections.behavior","sections.intent"]}]}
```

## Recipe 9: promotion preflight on GFP (exact output)

Command body was the documented recipe 9 body with its parameter set to `spec:consumers.graph-first-planning`:

```text
pnpm --silent sdp:q 'const id = "spec:consumers.graph-first-planning"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const rungs = ["idea", "scoped", "defined", "ready"]; const reached = context.derivedReadiness ?? "none"; const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached); return { id, found: true, statedReadiness: context.statedReadiness, floorReached: reached, nextRung: rungs[reachedIndex + 1] ?? null, currentFloorFailures: context.floorFailures.map((failure) => ({ clauseId: failure.clauseId, description: failure.description })), firstUnmetClause: context.floorFailures[0]?.clauseId ?? null, promotionRequiresHumanStatement: true };' --json
```

Exact stdout:

```json
{"id":"spec:consumers.graph-first-planning","found":true,"statedReadiness":"idea","floorReached":"scoped","nextRung":"defined","currentFloorFailures":[],"firstUnmetClause":null,"promotionRequiresHumanStatement":true}
```

## Recipe 11: pre-session baseline (exact output)

Command body was the documented recipe 11 body unchanged:

```text
pnpm --silent sdp:q 'const lower = g.specs().filter((spec) => spec.statedReadiness !== "ready"); const byFamily = {}; for (const spec of lower) { const family = spec.id.slice("spec:".length).split(".")[0]; const context = g.specContext(spec.id); const failures = context?.floorFailures ?? []; byFamily[family] = byFamily[family] ?? []; byFamily[family].push({ id: spec.id, statedReadiness: spec.statedReadiness, floorReached: context?.derivedReadiness ?? "none", nextUnmetClause: failures[0]?.clauseId ?? null }); } return { total: lower.length, byFamily };' --json
```

Exact stdout:

```json
{"total":16,"byFamily":{"carrier":[{"id":"spec:carrier.markdown-pack-authoring.markdown-ts-parity","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null},{"id":"spec:carrier.markdown-pack-authoring.spec-envelope-refused","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null}],"consumers":[{"id":"spec:consumers.edit-model","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null},{"id":"spec:consumers.graph-first-planning","statedReadiness":"idea","floorReached":"scoped","nextUnmetClause":null},{"id":"spec:consumers.impact-graph","statedReadiness":"idea","floorReached":"scoped","nextUnmetClause":null},{"id":"spec:consumers.intent-composition","statedReadiness":"idea","floorReached":"ready","nextUnmetClause":null},{"id":"spec:consumers.projections-model","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null}],"extraction":[{"id":"spec:extraction.regenerability","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null}],"model":[{"id":"spec:model.core-model","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null},{"id":"spec:model.enrichment-lifecycle","statedReadiness":"scoped","floorReached":"scoped","nextUnmetClause":null},{"id":"spec:model.protocol-domain","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null},{"id":"spec:model.structural-patterns","statedReadiness":"idea","floorReached":"idea","nextUnmetClause":null}],"observation":[{"id":"spec:observation.runtime-overlay","statedReadiness":"idea","floorReached":"idea","nextUnmetClause":null}],"protocol":[{"id":"spec:protocol.self-hosting","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null},{"id":"spec:protocol.structural-self-binding","statedReadiness":"idea","floorReached":"scoped","nextUnmetClause":null}],"validation":[{"id":"spec:validation.validator-self-testing","statedReadiness":"defined","floorReached":"ready","nextUnmetClause":null}]}}
```

## Cleanup and risks

No processes were left running and no temporary resources were created. The only expected follow-up is T3's row-6 decision mint; this evidence deliberately does not mint it. One ancillary targeted query was malformed and returned `sdp q: Unexpected token ';'`; it was immediately corrected, and the corrected runnable-modules probe returned `found: true` with the inspected carrier text. All required probes and both recipes completed successfully.
