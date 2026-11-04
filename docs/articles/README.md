# Media plan and living series playbook

> **Pinned source baseline:** commit [`b5e0a8be`](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753), the merge of [PR #36](https://github.com/libar-dev/software-delivery-protocol/pull/36).
> **Posture:** This directory is maintained on `main` through focused refresh PRs as the Protocol advances. The opening arc used a standing PR for review, but no permanent media diff is needed. Current behavior, seed-design intent and future directions must read as three different things. Re-run Protocol-corpus measurements at a new pin rather than inheriting them; adopter and historical counts keep their cited measurement sources. Evidence verification always uses a separate checkout of the exact source pin, so manuscript commits cannot change the answers being verified. The sync creates and removes that disposable checkout in both local and CI runs; its writes are described in Step 4.

## 1. The series argument

Software teams keep intent in tickets and product documents, architecture in diagrams and wikis, decisions in ADRs, acceptance criteria in test files and run results in CI. The links between them are usually prose. AI coding agents inherit that fragmentation and must guess at structure.

Libar Software Delivery Protocol (`@libar-dev/software-delivery-protocol`, CLI `sdp`) models delivery as typed repository content, derives one graph and generates consumer-specific readings from it. Its founding slogan is:

> Specs are code; the graph is derived; the `claim` stays honest; git is the event log.

The series has to carry four consequences, not just the engine behind them:

1. **One Spec, enriched in place.** Eight kinds, three altitudes and four stated readiness rungs cover delivery intent without migrating an idea through artifact types.
2. **Authored intent and derived facts stay separate.** `declared`, `anchored` and `inferred` claims are never collapsed. `implemented` and `has-verifier` are derived from bindings; `observed` remains deferred.
3. **Projections are regenerable readings.** Markdown, Mermaid, Gherkin, HTML, CLI answers and generated notes are readings, not competing stores. Reshaping Design Review, census, Mermaid or Gherkin requires a decision that refines or supersedes the [shipped-projections decision](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/decisions/shipped-projections-frozen.sdp.md) (MD-32). The Studio can evolve under its own Specs and remains working material for UX learning.
4. **AI has explicit trust boundaries.** Agents already read the graph and apply scoped intent. AI-assisted presentation is a future direction that must preserve those boundaries and address non-determinism honestly.

The pre-code seed design in [`docs/lineage/v0-design/`](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/v0-design) is primary context for the product experience. It is historical evidence, not current law. Current Specs decide what is built and ratified.

## 2. Audiences and distribution

| Audience | Problem to lead with | Protocol story | Main articles |
|---|---|---|---|
| Staff engineers and architects | Design and code drift apart; impact and ownership are hard to reconstruct | Stable Spec identities, source anchors, claim-aware graph, architecture and design slices | 1, 3, 7, 9 |
| AI and coding-agent builders | Verb walls and raw-file search waste calls and context | `sdp q`, typed reader, recipes, context bundles and explicit edit hand-offs | 1, 4, 5, 9 |
| Engineering leaders and technical founders | Process theater and hand-authored status create false confidence | Readiness floors instead of quotas, live backlog and drift queries, evidence with named limits | 1, 2, 5, 6 |
| Product, QA and design reviewers | The repository holds the design but the useful review job is hard to perform | Stamped Studio previews, task-based projections, open questions, run evidence and scoped intent | 2, 3, 5, 9 |
| UX/UI designers | The product has many possible readings and no settled visual language | One graph, disposable projections, visible honesty, current Studio as prototype | 2 and 5, with 1 as orientation |
| BDD practitioners | Scenario text and step regexes drift; non-behavioral truth fits Gherkin poorly | Typed example spaces, generated contracts, oracles and lawful carriers | 3 and 8 |

### Channels

- Publish long-form manuscripts from `docs/articles/` to the project blog, dev.to or another canonical home. Keep commit-pinned repository links and runnable try-it blocks.
- Convert Markdown tables to lists or accessible images on platforms that do not render tables.
- Lead technical launches with Articles 1, 4 and 7. Lead design and product discussions with Article 2.
- Generate the articles' Markdown tables, source excerpts, CLI output and Mermaid blocks at the publication pin. Screenshots are optional UX review material, not the primary evidence and never a substitute for regenerable content.
- Use compact versions of Articles 1, 2 and 5 as the first UX/UI design packet, together with the Studio page set generated at the source pin. Article 2 already contains the compact design brief. The generated pages let the designer inspect the current interface without relying on screenshots. The packet does not need to wait for public serialization.
- For audio or NotebookLM, supply the five full manuscripts and the reading path below, not the whole repository.

## 3. Source reading path

### Current vocabulary and jobs

1. [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/CONTEXT.md), the ratified language.
2. [`docs/concept/00`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/concept/00-vision-scope-and-mvp-boundary.md) and [`01`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/concept/01-founding-principles-and-invariants.md), scope and principles.
3. [`jtbd-stories/05`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/jtbd-stories/05-see-and-share.md) and [`06`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/jtbd-stories/06-edit-through-the-lens.md), the human reading and edit jobs.

### Seed design and annotation evidence

4. [`docs/lineage/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/README.md), the lineage guide and annotation-scout pointer.
5. Seed [`00`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/v0-design/00-vision-and-product.md), [`01`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/v0-design/01-core-primitives.md) and [`02`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/v0-design/02-system-architecture.md), the original model and canonical/derived split.
6. Seed [`07`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/v0-design/07-spec-studio-and-projections.md) and [`08`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/v0-design/08-delivery-evidence-and-tooling.md), the original human experience, AI slices and evidence ambition.
7. The [short annotation context](../lineage/annotation-context.md), with the archived scout behind it and the rulings carried by [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29). It explains why complete annotation exclusion was an overcorrection and why source bindings are critical to projections.

### Current carrying Specs and on-ramps

8. [`spec:model.core-model`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/model/core-model.sdp.md) and [`spec:consumers.projections-model`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/projections-model.sdp.md).
9. [`spec:consumers.spec-studio`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/spec-studio.sdp.md), its lenses, sharing and intent-panel Specs in the same directory.
10. [`spec:consumers.agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/agent-surface.sdp.md), [`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/context-bundle.sdp.md) and [`spec:consumers.design-slice`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/design-slice.sdp.md).
11. The repository-owned skills under [`.agents/skills/`](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753/.agents/skills) and the [recipe catalog](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/agent-surface/recipes.md).
12. [`examples/checkout-v1`](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753/examples/checkout-v1), the worked engineering loop.

For any corpus fact, query the graph before reading a carrier. The source list is reading material for prose and design context, not permission to bypass the graph for measurements.

## 4. The ten-part series

| # | Title and file | Status | Job in the series |
|---|---|---|---|
| 01 | [The spec is the prompt is the design](./01-the-spec-is-the-prompt-is-the-design.md) | Full draft | The problem, one Spec, one graph, claim separation and the two check families |
| 02 | [One graph, many views: the interface is allowed to change](./02-one-graph-many-views.md) | Full draft and UX/UI input | The seed's human scenario updated to current mechanics, the projection family, Studio honesty and a compact designer's brief |
| 03 | [From rough idea to verified code](./03-walkthrough-intent-to-verified-code.md) | Full draft | The engineering loop through the worked example, bindings, contracts, oracles and deliberate failures |
| 04 | [Stop building 30-verb CLI walls for coding agents](./04-stop-building-verb-walls-for-coding-agents.md) | Full draft | Demand map, `sdp q`, recipes, bundles in parts, design slices and measured agent use |
| 05 | [AI can shape the reading, but it cannot rewrite the record](./05-ai-can-shape-the-reading.md) | Full direction draft | Built AI roles versus future presentation assistance, including the deterministic-projection tension |
| 06 | Shared language is a performance feature | Detailed outline | Vocabulary decisions, readiness wording and the four-way carrier competition |
| 07 | Excluding annotations was the mistake: what three generations taught us | Detailed outline | Gen 1, the pre-code seed and the current Protocol; the return of source bindings and what projections need from them |
| 08 | Executable specifications without Cucumber glue | Detailed outline | The design behind typed example spaces, contracts and expected-outcome oracles, without repeating Part 3's tutorial |
| 09 | Designing a large platform ahead of its code | Detailed outline | The first adopter, entry addresses, bundles in parts, design slices, corpus rules and roadmap readings |
| 10 | Auditing your own corpus with cross-family AI reviewers | Detailed outline | A transferable review method, with the historical whole-corpus audit as evidence rather than the headline |

### Article 06: *Shared language is a performance feature*

- Open on the cost of ambiguous words such as `status`, `abstraction` and `provenance` for people and agents.
- Explain the governing rubric in `CONTEXT.md`: adopt established delivery nouns, reject process gates, coin a term only for a real difference.
- Use the seed's "readiness is a claim" as the concrete collision. Today readiness is stated, while `claim` names epistemic status. The wording change records a model decision.
- Cover the rename ledger and why a rejected name may return with a narrower job, as `marker` did for carrier syntax.
- Tell the four-way carrier competition through its exhibits and probes. Explain why Markdown won the default, why TypeScript remains lawful per ID and why graph-aware Gherkin returned for behavior and example Specs.
- Keep one canonical carrier per ID as the closing rule.

### Article 07: *Excluding annotations was the mistake*

- Start with the apparent contradiction: Gen 1's tag sprawl was a real failure, but removing source annotations altogether cut off the bindings that make architecture, traceability and impact projections valuable.
- Use three generations rather than a simple old-versus-new story. Gen 1 proved production value and taxonomy drift. The pre-code seed restored structured source markers to the design. The early current Protocol overcorrected by refusing JSDoc identity tags and restricting bindings.
- Let the annotation scout supply the evidence: formal vocabulary cleanup was not the same as a shipped runtime registry shrinking; multiple extractors do not require multiple read models; source bindings feed generated documentation.
- Explain why adoption made the cost visible. Runtime code that could not import the package had to bind in tests, and source-file queries missed the actual units.
- Cover the comment-form return, optional plural bindings, `satisfies` versus `references`, and architectural `role`, `layer` and `context` where they are realized.
- Connect the ruling to Article 2: a projection cannot show a component, realization or design reference the graph does not hold. Anchors are identity and structure, never Spec prose, and that narrowness is what makes them safe to project.
- Include what did not return: sprawling tags, workflow statuses in code and hand-authored delivery facts.

### Article 08: *Executable specifications without Cucumber glue*

- Lead with regex rot and with the deeper problem of tests verifying values that no longer match the authored example.
- Explain carrier independence: Markdown and Gherkin can derive the same example space and contracts.
- Focus on the authored/generated direction, point-per-example, bound points and the outcome union. Point back to Part 3 for registrar mechanics.
- Explain the oracle's job and `unspecified`, including why [`spec:extraction.runnable-modules`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/extraction/runnable-modules.sdp.md) makes a bound example whose oracle selects `unspecified` fail rather than silently witness a gap. The engine at the source baseline has one exception: it still passes such an example when its Then step's own contract key is `unspecified`, a gap the whole-repository review in [PR #38](https://github.com/libar-dev/software-delivery-protocol/pull/38) records as L1-02. Re-check the rule at the article's own pin before stating it without that exception.
- Use the Protocol's own reader Spec in `.sdp.gherkin` as the self-hosting example.
- Keep the boundary clear: `has-verifier` records a binding, supplied run evidence records results, and `observed` remains a separate deferred fact.

### Article 09: *Designing a large platform ahead of its code*

- Use the first adopter's historical 243-Spec pin as the opening scale example, not as a current count.
- Show why design ahead of code needs entry addresses, pinned declarations and planned components rather than fabricated implementation bindings.
- Follow one design pass through a context bundle. Explain deterministic cuts, complete scopes and ordered parts. Do not repeat the retired claim that a bundle never returns a subset of members.
- Add the design slice as the whole-Pack reading and the design diff as the comparison between passes.
- Explain change proposals against a named base and corpus rules that remain separate from Protocol findings.
- Close with capability maps, design slices and the priority roadmap as current readings of planned work, with recipe 53 as the live source of next work.

### Article 10: *Auditing your own corpus with cross-family AI reviewers*

- Lead with the method, not the finding count: one lens checks Specs against code and tests, another checks cross-Spec consistency and language, and a different model family verifies each finding.
- Use the historical 258-Spec, 595-finding audit as the evidence at its own pin. Include the 59 refuted findings so review does not become a volume contest.
- Show what the method caught: code that broke promises, two homes of one law and stale authoring guidance.
- Explain why self-hosting makes drift testable and why the self-hosting oracle must be re-transcribed rather than inherited.
- Close with slimming candidates and curation advice as different recurring hygiene tasks.

## 5. Editorial house rules

1. Use ratified terminology from `CONTEXT.md`. Readiness is stated, never "claimed." The Protocol defines a contract and instances conform. Claim "deterministically validated," never "provably correct."
2. Label time and status. Current realization comes from the pinned graph and source. The seed design is pre-code evidence and direction. AI-assisted presentation is a future direction, not shipped functionality.
3. Do not present today's Studio layout as settled UX. It is a working projection used to learn which readings help. Conversely, do not treat an open visual question as permission to change graph law in prose.
4. Keep AI roles distinct: reading the graph, applying scoped intent and assisting presentation. If an AI-generated view varies, do not silently attribute the deterministic projection guarantee to it.
5. Derive every current count at the named commit. Cite historical adopter and audit figures to the pull request or review that measured them.
6. Run `npm run check:temporal`. Articles must not contain raw calendar dates, numbered plan paths or session/wave/fold tokens. Link the pull request that carried historical material instead of a dated lineage file.
7. Link sibling articles relatively. At publication, rewrite relative links to public URLs or commit-pinned repository URLs. Refresh sibling links after renumbering.
8. Use sentence-case headings and plain language. Cut repeated definitions; cross-link to the article that owns the detailed treatment.
9. Check code fences and links manually. The standard formatter ignores `docs/**`, and the green gate does not prove that article links resolve.
10. Regenerate article evidence at the publication pin and run its check mode. Screenshots are optional UX review material. Name the commit beside any screenshot or shared Pack export.

## 6. Refresh playbook

A refresh measures both numbers and qualitative claims. A design diff alone cannot tell you that the series now describes an old Studio phase or misses a new recipe parameter.

### Step 1: Install and build

Use Node `^20.19.0 || ^22.12.0 || >=24.0.0`, where the ranges declared by the installed test toolchain (Vitest, Vite and Rolldown) overlap. This source-development requirement is separate from the CLI's runtime range, declared in the checkout's `package.json` under `engines.node`.

```sh
npm ci
```

Use `npm run --silent sdp:q --` or `pnpm --silent sdp:q` in this checkout. Never invoke a bare `sdp`.

### Step 2: Diff against the previous pin

Generate the base graph in a temporary worktree outside the repository. The current previous pin is `b5e0a8bea1e3bedd48c616f96c9928e955792753`.

```sh
set -euo pipefail
BASE_SHA="b5e0a8bea1e3bedd48c616f96c9928e955792753"
BASE_DIR="$(mktemp -d)/base"
trap 'git worktree remove --force "$BASE_DIR" 2>/dev/null || true' EXIT
git worktree add --detach "$BASE_DIR" "$BASE_SHA"
npm --prefix "$BASE_DIR" ci --ignore-scripts
npm --prefix "$BASE_DIR" run build
node "$BASE_DIR/dist/cli/sdp.js" build "$BASE_DIR" \
  --exclude explorations --exclude examples --exclude test/fixtures/import/parity
npm run --silent sdp:q -- "$(cat dist/recipes/35-the-design-diff.js)" \
  --params "base=@$BASE_DIR/generated/graph.json" --params '{"detail":true}' --json
```

Read the roadmap at the new head too:

```sh
npm run --silent sdp:q -- "$(cat dist/recipes/53-the-roadmap.js)" \
  --params '{"pack":"pack:roadmap"}' --json
```

### Step 3: Re-derive corpus metrics

```sh
set -euo pipefail
npm run --silent sdp:q -- 'const tally = (xs, f) => xs.reduce((a, x) => ((a[f(x)] = (a[f(x)] || 0) + 1), a), {}); return {
  schemaVersion: graph.schemaVersion,
  specs: g.specs().length,
  packs: graph.nodes.filter((n) => n.nodeType === "Pack").map((p) => ({ id: p.id, members: p.members.length })),
  nodes: graph.nodes.length,
  nodeTypes: tally(graph.nodes, (n) => n.nodeType),
  edges: graph.edges.length,
  edgeClaims: tally(graph.edges, (e) => e.claim),
  locations: graph.locations.length,
  readiness: tally(g.specs(), (s) => s.statedReadiness),
  kinds: tally(g.specs(), (s) => s.specKind),
  deliveryFacts: {
    implemented: g.specs().filter((s) => s.deliveryFacts.includes("implemented")).length,
    hasVerifier: g.specs().filter((s) => s.deliveryFacts.includes("has-verifier")).length,
    observed: g.specs().filter((s) => s.deliveryFacts.includes("observed")).length
  }
}' --json

npm run --silent sdp:q -- "$(cat dist/recipes/01-the-build-backlog.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/02-the-drift-alarm.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/20-open-question-register.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/33-the-design-backlog.js)" --json
ls dist/recipes/*.js | wc -l
```

<!-- evidence:baseline-metrics -->
Measured at commit `b5e0a8bea1e3bedd48c616f96c9928e955792753`:

| Metric | Value |
|---|---|
| Schema | `0.12.0` |
| Specs and readiness | 456: 447 `ready`, 4 `scoped`, 5 `idea` |
| Packs | 9: `adopter-speed-v1`, `spec-studio-v1`, `corpus-checks-v1`, `design-iteration-v1`, `design-management-v1`, `obsidian-vault-v1`, `roadmap`, `roadmaps-and-slices-v1`, `self-hosting-v1` |
| Nodes, edges and locations | 1,072 nodes (456 Primitive, 9 Pack, 241 CodeNode, 366 Anchor); 2,978 edges (1,929 declared, 1,049 anchored); 3,120 locations |
| Delivery facts | 166 `implemented`, 397 `has-verifier`, 0 `observed` |
| Build backlog | 2, with 232 ready examples and 47 ready decisions audited and excluded |
| Drift alarm | 0 |
| Design backlog | 0 |
| Open questions | 16 across 12 Specs: 10 blocking (6 deferrals, 4 holds), 6 non-blocking |
| Validation | 0 errors and 3 intentional warnings (3 `honesty/gaps`) |
| Shipped recipes | 55 |
| Repository-owned skills | 5 |
<!-- /evidence:baseline-metrics -->

### Step 4: Regenerate the article evidence

Marked evidence blocks are generated, not maintained by hand. The sync reads this playbook's pin and fills a disposable worktree from that commit's raw Git blobs, with replacement objects disabled. It installs dependencies with `npm ci --ignore-scripts` and builds the CLI before collecting evidence. The supplied repository provides git objects only: its working files, sparse-checkout settings, attribute filters, installed dependencies and existing build are not used. It covers graph-derived tables, build and query output, carrier excerpts, source anchors, the oracle and Mermaid. Self-hosting validation accepts only `honesty/gaps` warnings; every other warning rule fails the sync.

```sh
# SOURCE_DIR is a repository checkout containing the pinned commit.
node docs/articles/sync-evidence.mjs "$SOURCE_DIR"

# Check mode leaves the manuscripts unchanged and fails when any block differs.
node docs/articles/sync-evidence.mjs --check "$SOURCE_DIR"
```

Both commands create a worktree in the system temporary directory (they refuse a `TMPDIR` inside either checkout), install dependencies, build `dist/`, and regenerate `generated/`, test registrars and the example's generated outputs there. They temporarily register the worktree in `$SOURCE_DIR`'s Git metadata and remove only their own directory and registration on success, failure, SIGINT or SIGTERM; they do not overwrite outputs in `$SOURCE_DIR`. Installing dependencies may populate npm's cache and needs registry access or a populated cache. Sync mode also writes the marked manuscript blocks. Check mode writes no manuscript. On interruption, the supervising process stops the worker and its child processes before removing the worktree. SIGKILL of the supervisor leaves the detached worker running: it finishes and cleans up its own worktree, and sync mode can still write manuscript blocks. Wait for that worker to stop before removing anything. After it stops, or after a machine failure, remove any surviving worktree with `git worktree remove --force <path>` from the source repository.

Always pass the source repository explicitly. Add a marked block and its generator whenever a manuscript gains a reusable output excerpt. Missing, duplicate, unknown, nested or fenced markers fail the check. Keep elision explicit, as in the constant-anchor excerpt. Do not paste a modified version of source or command output and call it an example.

Mermaid stays live source. Markdown tables come from graph queries. Screenshots remain optional supplements for discussing visual design, never the only record of behavior.

### Step 5: Check version-sensitive prose

- Recheck runtime and engines statements outside evidence blocks, including Step 1 and Part 1, against the new pin's `package.json` and installed toolchain.
- Recount recipes and skills in the [generated baseline metrics](#step-3-re-derive-corpus-metrics).
- Check `sdp q` bindings. The current sink injects `g`, `graph`, `report`, `params` and `recipes`.
- Re-read the Studio's carrying Specs and publish a current page set. Check lenses, roadmap, registers, queue, diff, runs, export and composing panel rather than saying "phase 0" from memory.
- Check context-bundle parameters and behavior. `part` now returns ordered parts; never restore the old blanket statement that partial member lists are refused.
- Re-run the worked example and refresh the [generated build output in Part 3](./03-walkthrough-intent-to-verified-code.md#the-worked-example).
- Keep run evidence, `has-verifier` and `observed` distinct. Supplied CTRF results do not derive runtime observation.
- Review command coverage. Any new reusable output belongs in a generated evidence block.
- Check every sibling link after renumbering, every commit-pinned path, every code fence and every image.
- Record which articles need conceptual changes, not only which tables need new counts. This is the feedback loop between the repository and the series.

### Step 6: Verify

Run `npm run check:articles -- "$SOURCE_DIR"` and `npm run check` after staging new article files so preflight can see them. CI runs the same article check with full git history, using its disposable build of the pinned source, so a manuscript branch behind the pin cannot merge stale evidence green. On checkouts with `test/markdown-links.test.ts`, `npm run check` runs that Markdown link gate: it checks that relative link target paths exist, including article paths under `docs/`. Manually inspect the rendered Markdown, link fragments, commit-pinned URLs and code fence structure, which a repository-path check does not establish.
