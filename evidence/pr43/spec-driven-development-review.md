# Enabling spec-driven development: the short-term roadmap

**Reviewed at `38d738bc`, the PR #43 head at review time · gaps, roadmap and queries re-measured at `4622e202` · companion: the [skills refactoring review][prior], the corrections the next session addresses**

The Spec is the prompt. Spec-driven development works when three routes work without a wrapper document:

1. **Request → Spec.** An agent turns a person's request into Specs and leaves undecided choices open.
2. **Spec → evidence.** From a Spec id, a developer reaches its law, decisions, open questions, implementation, examples, the runnable test and its oracle, and proves a change with the project's own runner.
3. **Change → Spec.** From a changeset, staged changes and deletions included, a reviewer recovers the promises it affects.

Route 1 has had a trial round, and its re-run is the skills review's acceptance question. Routes 2 and 3 have reviewer probes only; the development trial below is their acceptance. [Original checkout scenario][vvision] · [Trace and impact jobs][jobs] · [Arc record][pr]

## Where it stands

**What works.** Following `spec:orders.create-order` in `examples/checkout-v1` reaches its route and use case, an independent oracle, an enabled valid-cart example and a declared invalid-cart example with no bound test. In a disposable copy at `38d738bc`, the review broke the subtotal arithmetic and varied the authored point, with the oracle and test implementation fixed: [Worked example][worked]

<!-- prettier-ignore -->
| State in the disposable copy | Focused test result |
| --- | --- |
| Original implementation and authored example: two lines, quantity 1, unit price 50 | Passed, total 100 |
| Quantity multiplication removed, original example kept | Passed again: the input could not distinguish the broken implementation |
| Broken implementation kept, authored point changed to quantity 2 and total 200, contracts regenerated | Failed at the authored `Then` step: `$.total: expected 200, actual 100` |
| Quantity multiplication restored, same two-unit point | Passed |

The graph answered the same in the red and green states: stated `defined`, derived `ready`, `implemented` and `has-verifier`, zero errors. Those answers describe bindings and the floor; the red run supplied the behavioral evidence. In reverse, recipe 4 mapped `src/orders/create-order.route.ts` to the Spec; once the file was deleted, a query over the new tree listed the path as coverage-unknown, and only recipe 35 over the earlier graph named the deleted `api:orders.post` binding. A reviewer needs both revisions to tell a deleted binding from a file that was never bound. [Total rule][totalrule] · [Use case][usecase] · [Authored point][validpoint] · [Executable test][validtest] · [Independent oracle][oracle] · [Changed-file impact][r4] · [Design diff][r35]

**The gaps, re-measured at `4622e202`.**

<!-- prettier-ignore -->
| Gap | Observed | Route |
| --- | --- | --- |
| A recipe without its subject answers for a sample | Recipe 56 with `{}` answers for `spec:consumers.reading-on-ramp` with `found: true`; recipe 3 answers for `spec:consumers.reader`, which an adopter's corpus lacks. Recipe 36 already refuses: "Supply exactly one of pack or specs." | 2 |
| A parent's verifier rows stop at the example carriers | Both rows for `spec:orders.create-order` end at `specs/orders/create-order-*.sdp.md`. The runnable test, `test/orders/create-order.valid-cart.test.ts:13`, sits behind the child's own verifier; the body under "Reproduce the evidence" makes that hop. | 2 |
| A Markdown deliverable has no file-to-Spec reach | Recipe 4 over `skills/sdp-sessions/SKILL.md` returns no impacted Spec and lists the file as coverage-unknown, though that file teaches an on-ramp. | 3 |
| Recipe 4's documented selection sees unstaged tracked files only | Its catalog entry pipes `git diff --name-only -z`, which compares the working tree with the index. The reading skill's arrival reference now teaches the staged, branch and untracked selections beside it (`afe09ff0`, taken provisionally); the catalog entry still shows the unstaged form alone. | 3 |

## Complete in PR #43

**Already in scope.** The [skills refactoring review][prior] sets the correction scope, which the next session addresses: read back the changed promise or Pack, select the right corpus at startup, route Studio and vault intent correctly, respect commit authority, and align the reading guidance with recipe 56's rule-location coverage and the failure boundary for invalid question fields. Beside it stand the owner's four suggestions:

<!-- prettier-ignore -->
| Owner suggestion | Verified | Treatment |
| --- | --- | --- |
| **Name reusable recipes by file and organize them by task.** | The build writes `dist/recipes/<NN>-<slug>.js`; the index has eight categories; tests check shipped bytes and one category per recipe; the skill rule requires the number and name, and the file at the first instruction to run it. [Shipping rule][skillshape] · [Build code][recipebuild] · [Catalog tests][catalogtests] · [Category test][categorytest] | Keep the catalog as the owner of reusable bodies. At each first actionable mention a correction touches, check that the file is findable and the command runs from the reader's checkout or installation; the generic checker finds a mention, a person checks its placement. [Skill checker][filemention] |
| **Give query callers a short hint and an easy route to the catalog.** | An answered call ends stderr with a one-line hint; an empty body prints the categories, sample recipes and call forms to stderr and exits 1; a thrown query prints its diagnostic alone; JSON stays on stdout. [CLI rule][hintlaw] · [CLI implementation][hintcode] · [CLI tests][hinttests] | Keep the current diagnostics. A hint on *every* call would change ordinary failures and needs an explicit change to the carrying rule and its stderr tests. |
| **Replace repeated handbook instructions with queries or a session-start hook.** | The hook supplies orientation answers 1 and 5; the handbook says to skip them only when present; `CLAUDE.md` points at the handbook. Activation per client needs its own evidence. [Handbook][handbook] · [Hook decision][hook] · [Hook implementation][hookcode] · [Client extensions][extensions] | Move changing facts, such as the roadmap and corpus counts, to graph output. Keep commit authority, destructive-command hazards, fallbacks and the owner's temporary block readable by every client. Fix the shared-workspace case by comparing hook output with a direct query from the same member, then verify live activation per client claimed. |
| **Specify tasks, delegation, hand-offs and PR work partly in queries.** | The handbook, session skill and PR standard call for the skill, the exact recipe file or body, and its parameters. The PR's recipe 35 reproduction used the wrong argument index in `node -e`. [Hand-off guidance][handoff] · [PR standard][arcguide] | State the outcome in the person's words, a query that scopes the work, and a query or test that shows it done. Run the PR's commands as printed from the named revision. Have a second agent reproduce one hand-off. Human decisions, a provisional choice above all, go in the brief beside the evidence. |

A query-scoped brief, for example: a coordinator gives a reviewer `sdp-agent-surface`, asks them to check the authoring skill's readback of a reordered Pack, and supplies the scope below. At review time it returned seven impacted Specs from the test file and listed the Markdown skill as coverage-unknown. The completion check swaps two lawful members in a disposable Pack and shows that the readback distinguishes their order.

```sh
pnpm --silent sdp:q --params '{"files":["test/skills.test.ts","skills/sdp-authoring/SKILL.md"]}' --json < dist/recipes/04-what-breaks-if-i-change-these-files.js
```

**Proposed additions, for the owner to select.** Each closes a gap above. The first and third overlap the skills review's findings, so one change can settle both.

<!-- prettier-ignore -->
| Item | Why now | Smallest closure |
| --- | --- | --- |
| **Refuse a missing recipe subject** (follow-up 2) | With the Spec as the prompt, a substituted subject sends an agent to the wrong law without a warning. Overlaps finding 6 on recipe 56. [Recipe 56][r56] | A missing subject, an unknown id and a lawful whole-corpus request answer differently; orientation demonstrations stay labelled as such. [Context bundle][r36] |
| **Run the development trial as route 2's acceptance** (follow-up 1) | The review's own probe stopped at the example carrier. | The trial below. A session-context recipe is earned only if agents stop at the carrier or keep rebuilding the same join. [Planning slice][r19] · [Session skill][sessions] |
| **Reopen the Markdown-deliverable question** | This PR's deliverables are skills, and they read as coverage-unknown; the handbook's hazard about skills outside the graph is the manual workaround. | Decide first whether the need is navigational reach or a realization claim that confers `implemented`; keep the document-realization test anchor meanwhile. [Question and provisional reading][dmd] |
| **Teach recipe 4's other git selections** (a slice of follow-up 9) | Gives PR review route 3 today with no engine change. | Teach the staged, branch and untracked selections beside the unstaged one, and label which tree the graph was derived from. Taken provisionally in `afe09ff0`, in the reading skill's arrival reference; the owner confirms it at the PR. [Recipe 4][r4] |

### The development trial

Run it in a disposable **installed adopter** with its own test runner. The npm package ships the skills, recipe catalog and Protocol corpus; the worked checkout and article tree are outside its file allowlist, so a successful run stands on the shipped on-ramps and the project's own code. [Package contents][package]

1. **Give the implementer an outcome.** For example: _"An order with two units of an item is undercharged. Restore the stated pricing rule, add a case that distinguishes the defect, and leave evidence another developer can rerun."_ Give the Spec id or the failing behavior; withhold file names and recipe numbers so the trial measures discovery.
2. **Observe the decisions.** The developer identifies the promise, the independent oracle and the production call the test exercises; recognizes a repair; keeps the happy-path example and adds a distinguishing case. A request that changes pricing policy instead changes the carrying Spec and its examples, and a real product choice goes back to its decider.
3. **Measure the behavior.** The new point fails on the broken implementation, passes on the fix and fails again when the fault returns; existing coverage still runs. A green graph and a passing run are reported separately, and the adopter's runner is the command.
4. **Hand off to a second developer.** They receive the brief, Spec ids, revision or dirty scope, changed paths, graph query and exact test invocation; they reproduce the result, name the case still unverified and explain the binding that changed. A changeset-only variant asks them to recover the same Spec from the files, a deletion included.

**Reading the result.** Both developers succeed: the current surface carries the job. The first stops at an example carrier: build the Spec-to-executable join next. The second loses a removed binding or misses staged changes: build the git comparison next.

## Next, after PR #43

- **The roadmap, in order** (recipe 53, re-measured): delivery-record cleanup (to design), Studio cited test-line text (to state), Studio external register input (to design), the composed-intent edit model (to build). The edit model matters most for human feedback on Specs; until it lands, a developer edits the carrier and runs the test directly. Nothing here changes Pack membership or order. [Roadmap manifest][roadmap]
- **Earned by the trial:** a session-context recipe over implementation, repair and review as perspectives on one context (follow-up 1); full diff context over unstaged, staged, branch and commit comparisons, with both graph sides labelled (follow-up 9).
- **At a demonstrated join:** one spelling for rule-entry slots, starting from a returned slot that resolves both a rule and a flow (follow-up 7) [Read-Specs body][o10]; a stale-build warning when a checkout runner would execute older `dist` code during engine work (follow-up 6) [Runtime and skew selection][runner].

## Deferred, with the condition that reopens each

The remaining follow-ups:

<!-- prettier-ignore -->
| Follow-up | Reopen when |
| --- | --- |
| 3. A recipe for a vault note link | Repeated human-to-agent conversion through Obsidian causes friction; test whole-note, term and block links, and keep open whether conversion also confirms resolution. [Vault skill][vault] · [Vault note contract][vaultlaw] |
| 4. Recipe 53 accepting `specs` | A caller repeatedly needs the roadmap's computed need across an arbitrary set; a named Spec uses its own context and recipe 19 today. [Roadmap law][roadlaw] |
| 5. One test file per on-ramp | A focused run shows that splitting buys isolation or time. [On-ramp tests][skilltest] |
| 8. Branch and working-tree heads-up display | The on-demand changeset answer is useful and the hook's workspace-root case is fixed. [Hook decision][hook] |
| 10. An Agent Plugins client | A named development tool needs to **host** plugins, with a discovery or compatibility test. [Plugin decision][plugin] · [Package entry points][readme] · [Client guide][clientguide] · [Conformance][clientcheck] · [Specification][pluginspec] |

The graph-recorded deferrals, each with an owner decider, re-listed by recipe 20 at `4622e202`; the eleventh, Markdown-deliverable anchors, is proposed above:

<!-- prettier-ignore -->
| Deferred question | Reopen when |
| --- | --- |
| Validate preserving or naming removed page roots | A session or CI job loses pages it still needs; record the verb, roots, consumers and whether naming the roots would have sufficed. Read findings through `report` meanwhile. [Question][dval] |
| Importing a bare `.feature` corpus | An adopter undertakes a real migration; canonical `.sdp.gherkin` carriers serve new work. [Question][dimport] |
| Combination coverage for example-space slots | A design pass needs unexercised combinations; recipe 44 reports individual values today. [Question][dcomb] · [Recipe 44][r44] |
| AI-assisted presentation or explanation | A measured UX review task benefits; a generated explanation needs visible sources, revision and an identity apart from graph claims. [Question][dai] |
| Exhaustive symbol-level impact | File-level reach, anchored units and language tools fail a specific investigation, such as a shared unanchored symbol. [Question][dsymbol] |
| Release and baseline views | The first release is published and a reader need outgrows the roadmap and git tags. [Question][drelease] |
| External interface or API reference projection | A named outside reader cannot answer a task from existing material, with a way to measure improvement. [Question][dexternal] |
| Code-rooted structural diagrams | A named reader still cannot make a dependency decision after the architecture map, component membership and the IDE. [Question][ddiag] |
| Freshness of run evidence for bound files | High relevance for review once file-sensitive freshness has a ruled meaning; until then rerun the focused test and label earlier evidence by its basis. [Question][dfresh] · [Recipe 45][r45] |
| Runtime observations and `observed` | An adopter can supply runtime measurements tied to a Spec target, with an identity and freshness policy. [Question][druntime] |

Beside those lists:

- **Maintained skill evals** stay separate from a one-time trial of the core promise; the round-one resume record (a local file) shows honest recovery and binding, not a repair proven by the project's runner. [Round-one resume record][round1]
- **Mapping research output back to the graph:** sample real briefs and mark which answers came from a recipe, a join, a source read or human judgment; a repeated join is evidence for a session-context recipe. [On-ramp observations][observations]
- **Host and repository housekeeping:** the vault's `.DS_Store` rule, the Node 24 `cpSync` case, the long-term `*.tmp.md` ignore and harness-agnostic worktrees. None blocks the Spec-to-code route. [Observations][observations]
- **Owner decisions and acceptance** are listed in the skills review's "Decisions when work resumes"; the PR keeps its six recorded boundaries.

## From this document to Specs

This file and the skills review are the last plans written in Markdown. The skills review's corrections landed in `3a0256b1..98b9573f`. The next session authors the items selected here as Specs: a Spec, a question with its trigger on an existing Spec, or a roadmap entry. That is the first planning pass done in Specs.

It opens with a triage of the open questions, in the graph:

```sh
pnpm --silent sdp:q 'const r = await recipes(20, {}); return r.specs.flatMap((s) => s.questions.map((q) => `${q.blocking ? "B" : "-"} ${(q.decider ?? "-").padEnd(9)} ${q.trigger ? "deferral" : "open    "} ${s.id ?? s.spec}#question.${q.key}`))'
```

Each question leaves the triage one of four ways: settled now as a carrier edit, still waiting on its trigger, delegated to its roadmap entry, or closing with its arc. A deferral is settled early only when its trigger has fired or the answer is to drop it. Three questions sit on the routes above: `spec:model.design-maturity#question.designColumnsSufficiency`, which asks whether a Spec can show settled design apart from intent; `spec:model.anchors.markdown-deliverable#question.markdownAnchor`; and `spec:observation.run-evidence.bound-file-freshness#question.freshness`.

`evidence/` is committed on the branch and removed before merge, so only what lands in the graph outlives the PR. The PR description carries the queries that scope each item and show it done.

## Appendix: the starting design and the current ruling

Lineage is the design written before implementation; the ruled Specs say what holds now. Read lineage through [its README][lineage], which translates v0 terms. Links in this table are pinned to `38d738bc`. [Design index][vindex]

<!-- prettier-ignore -->
| Developer question | What the starting design envisaged | Current ruling and implementation evidence |
| --- | --- | --- |
| What exactly am I changing? | One durable Spec gains detail under the same id, and a distinct child can refine it; the early readiness vocabulary included bound, executable and verified states. [Core primitives][vprimitive] | A Spec has kind, altitude and four stated readiness rungs; implementation and verifier bindings produce separate delivery facts, and a person keeps responsibility for the readiness statement. [Core model][coremodel] · [Descriptor types][descriptors] · [Builder tests][buildtests] |
| Where do I record the change? | Typed intent in TypeScript, linked to implementation through source markers. [Authoring surfaces][vauthor] | One canonical carrier per id: Markdown by default, TypeScript available, `.sdp.gherkin` for behavior and example Specs. Shared signatures can be pinned in keyed Design entries and checked by compiling a consumer. [Carrier ruling][carrier] · [Extractor][extract] · [Carrier parity tests][parity] · [Declaration contract][declarations] |
| Why does this code appear in the answer? | Authored relationships, source annotations and inferred structure, with runtime examples over Fastify and dependency injection. [Graph metamodel][vgraph] · [Runtime anchors][vruntime] | The graph keeps `declared`, `anchored` and `inferred` claims; a constant or comment anchor asserts realization, reference, verification or structure; an example's `verifies` is enabled only when a test anchor resolves to it. [Claim taxonomy][claimspec] · [Annotation context][annot] · [Delivery facts][facts] · [Structural-anchor tests][structest] |
| Can a changed requirement be checked against running code? | Static extraction, graph validation, test discovery and evidence ingestion, with optional CI, deployment and telemetry records. [Extraction and validation][vextract] · [Delivery evidence][vevidence] | Validators check conformance and honesty; the runner compares the observed outcome with the authored point and oracle; a CTRF run joins at test-file grain against a named commit; production observation is an open question. [Validation law][valspec] · [Validators][valcode] · [Runner test][runtest] · [Run-evidence law][runspec] · [Run-page checks][runchecks] · [Runtime question][druntime] |
| How does a person's feedback become a source edit? | Validated JSON patches and a codemod back to canonical source. [System architecture][varchitecture] · [Original Studio loop][vstudio] | The edit model makes the change an ordinary carrier edit; the Studio panel separates proposal-eligible changes from scoped text, Pack-only requests included, and tests cover both. The open part is how the skill tells the recipient to handle each. [Edit model][editmodel] · [Panel implementation][panelcode] · [Studio tests][paneltests] |
| What does an agent receive to implement or review one Spec? | A Spec-specific bundle with impact, source files, findings and open questions. [Context slices][vslices] · [Prompt bundle][vbundle] | A context bundle assembled per design pass, a planning slice for neighbors and code, and the reader's child verifier and oracle bindings. Whether a fresh agent joins them into the runnable test is what the trial measures. [Context-bundle Spec][contextspec] · [Planning slice][r19] · [Current bundle][r36] · [Session skill][sessions] |

## Reproduce the evidence

From the Protocol checkout, this body joins a Spec to its examples' runnable tests over the worked example. It re-ran at `4622e202` and reached `test/orders/create-order.valid-cart.test.ts:13`. It is an ordinary graph query and adds no session format.

```sh
pnpm --silent sdp:q 'const s = g.specContext(params.spec);
if (!s) return { requested: params.spec, found: false };
return {
  spec: s.id, carrier: s.file,
  readiness: [s.statedReadiness, s.derivedReadiness],
  implementations: s.implementations.map(u => [u.codeId, u.file, u.line, u.claim]),
  oracle: s.oracle ?? null,
  verifiers: s.verifiers.map(v => ({
    id: v.verifierId, via: v.via, claim: v.claim, enabled: v.enabled,
    file: v.file,
    tests: v.via === "example"
      ? (g.specContext(v.verifierId)?.verifiers ?? []).filter(t => t.via === "test-anchor").map(t => [t.verifierId, t.file, t.line, t.claim])
      : [[v.verifierId, v.file, v.line, v.claim]]
  }))
};' --root examples/checkout-v1 --params '{"spec":"spec:orders.create-order"}' --json
```

The disposable mutation at `38d738bc` removed `line.quantity *` from the subtotal expression, changed the example to `{q: 2}` and `{total: 200}`, regenerated contracts with `node dist/cli/sdp.js build examples/checkout-v1` **only in the disposable copy**, and ran `node_modules/.bin/vitest run examples/checkout-v1/test/orders/create-order.valid-cart.test.ts`. These experiments measured one example and one deleted binding; they support the trial, not a claim about independent agent performance.

```sh
# Every graph-recorded deferral, its trigger, and its carrying file and line.
pnpm --silent sdp:q 'const rows=(await recipes(20)).specs.flatMap(s=>s.questions.filter(q=>q.trigger).map(q=>({address:(s.id??s.spec)+"#question."+q.key,trigger:q.trigger}))); const located=(await recipes(25,{addresses:rows.map(r=>r.address)})).rows; return rows.map(r=>{const a=located.find(x=>x.address===r.address);return [r.address,r.trigger,a.file,a.line]})' --json

# The entries the owner selected for the roadmap.
pnpm --silent sdp:q 'return (await recipes(53,params)).roadmaps[0].entries.map(e=>[e.id,e.need])' --params '{"pack":"pack:roadmap"}' --json
```

**Verification basis.** The lineage comparisons, code links and experiments are pinned to `38d738bc`. In a disposable checkout of `a23cdec2`, all 258 tests across the eight suites below passed. At `4622e202`, the gaps table, the roadmap, the deferral list, recipe 53's refusal of `specs`, recipes 3, 36 and 56 without a subject, and the join body above were re-run.

```sh
node_modules/.bin/vitest run test/builders.test.ts test/graph-schema.test.ts test/anchor-forms.test.ts test/structural-anchors.test.ts test/readiness.test.ts test/studio-s5.test.ts test/cli-q.test.ts test/runner.test.ts
```

[prior]: ./skills-refactoring-review.md
[pr]: https://github.com/libar-dev/software-delivery-protocol/pull/43
[round1]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/rounds/r1/t3-resumed.md
[jobs]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/jtbd-stories/07-trace-and-impact.md
[sessions]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-sessions/SKILL.md?plain=1#L10-L61
[declarations]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/extraction/contract-declarations.sdp.md?plain=1#L13-L27
[worked]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/examples/checkout-v1/README.md?plain=1#L43-L90
[r19]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L1284-L1300
[r36]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L3352-L3378
[totalrule]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/examples/checkout-v1/specs/orders/order-total-rule.sdp.md?plain=1#L13-L19
[usecase]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/examples/checkout-v1/src/orders/create-order.use-case.ts#L23-L62
[validpoint]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md?plain=1#L16-L29
[validtest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/examples/checkout-v1/test/orders/create-order.valid-cart.test.ts#L9-L17
[oracle]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/examples/checkout-v1/test/orders/create-order.oracle.ts
[r4]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L425-L455
[r35]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L3054-L3078
[r56]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L6366-L6385
[vault]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-vault/SKILL.md?plain=1#L39-L65
[vaultlaw]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/obsidian-vault.notes.sdp.md?plain=1#L28-L41
[roadlaw]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/roadmap.sdp.md?plain=1#L33-L50
[skilltest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/skills.test.ts
[runner]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-agent-surface/scripts/q.mjs#L143-L172
[o10]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-agent-surface/scripts/orientation/10-read-specs.js#L1-L14
[hook]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/decisions/session-start-hook.sdp.md?plain=1#L28-L44
[plugin]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/decisions/agent-plugin-package.sdp.md?plain=1#L19-L28
[readme]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/README.md?plain=1#L309-L337
[r44]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L4473-L4495
[r45]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L4510-L4534
[observations]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/design/07-graph-needs.md?plain=1#L163-L180
[roadmap]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/roadmap.pack.sdp.md
[package]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/package.json#L10-L31
[dmd]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/model/anchors.markdown-deliverable.sdp.md?plain=1#L20
[dval]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/wholesale-view-rewrite.validate-page-roots.sdp.md?plain=1#L20
[dimport]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/carrier/sdp-import.feature-adapter.sdp.md?plain=1#L15
[dcomb]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/agent-surface.combination-coverage.sdp.md?plain=1#L16
[dai]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/ai-assisted-reading.sdp.md?plain=1#L27
[dsymbol]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/impact-graph.symbol-reach.sdp.md?plain=1#L18
[drelease]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/projections-model.roadmap-views.sdp.md?plain=1#L22
[dexternal]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/reference-projection.sdp.md?plain=1#L17
[ddiag]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/structural-mermaid.sdp.md?plain=1#L21
[dfresh]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/observation/run-evidence.bound-file-freshness.sdp.md?plain=1#L16
[druntime]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/observation/runtime-overlay.sdp.md?plain=1#L18
[extensions]: https://agent-plugins.org/plugin-authors/client-extensions
[clientguide]: https://agent-plugins.org/client-implementers/implement-an-agent-plugins-client
[clientcheck]: https://agent-plugins.org/client-implementers/conformance
[pluginspec]: https://agent-plugins.org/specification
[vvision]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/00-vision-and-product.md?plain=1#L153-L173
[vprimitive]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/01-core-primitives.md?plain=1#L443-L471
[varchitecture]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/02-system-architecture.md?plain=1#L85-L126
[vgraph]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/03-graph-metamodel.md?plain=1#L395-L421
[vauthor]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/04-authoring-surfaces.md?plain=1#L279-L301
[vruntime]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/05-runtime-anchors.md?plain=1#L15-L57
[vextract]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/06-extraction-and-validation.md?plain=1#L15-L54
[vstudio]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/07-spec-studio-and-projections.md?plain=1#L542-L550
[vslices]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/07-spec-studio-and-projections.md?plain=1#L473-L488
[vbundle]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/07-spec-studio-and-projections.md?plain=1#L736-L746
[vevidence]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/08-delivery-evidence-and-tooling.md?plain=1#L15-L39
[lineage]: ../../docs/lineage/README.md
[vindex]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/v0-design/README.md
[annot]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/lineage/annotation-context.md?plain=1#L13-L36
[coremodel]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/model/core-model.sdp.md?plain=1#L14-L24
[descriptors]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/model/descriptors.ts#L4-L26
[buildtests]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/builders.test.ts#L52-L137
[carrier]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/decisions/carrier-ruling.sdp.md?plain=1#L14-L18
[extract]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/extract/index.ts#L226-L260
[parity]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/gherkin-parity.test.ts
[claimspec]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/extraction/claim-taxonomy.sdp.md?plain=1#L14-L19
[facts]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/graph/delivery-facts.ts#L46-L115
[structest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/structural-anchors.test.ts#L82-L120
[valspec]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/validation/two-check-families.sdp.md?plain=1#L14-L20
[valcode]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/validate/validators.ts#L1982-L2014
[runspec]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/observation/run-evidence.sdp.md?plain=1#L27-L36
[runchecks]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/studio-s4.test.ts#L703-L733
[editmodel]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/edit-model.sdp.md?plain=1#L12-L17
[panelcode]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/studio-elements/intent-panel.ts#L137-L169
[paneltests]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/studio-s5.test.ts#L419-L456
[contextspec]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/context-bundle.sdp.md?plain=1#L13-L36
[skillshape]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/shipped-protocol-corpus.sdp.md?plain=1#L25-L29
[recipebuild]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/cli/build-artifacts.ts#L201-L217
[catalogtests]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/recipes.test.ts#L4665-L4699
[categorytest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/recipes.test.ts#L6434-L6462
[filemention]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/helpers/on-ramp-checks.ts#L787-L811
[hintlaw]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/agent-surface.evaluation-sink.sdp.md?plain=1#L25-L30
[hintcode]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/cli/q-command.ts#L241-L300
[hinttests]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/cli-q.test.ts#L165-L227
[handbook]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/AGENTS.md?plain=1#L44-L66
[hookcode]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/hooks/session-start.mjs#L190-L218
[handoff]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-sessions/SKILL.md?plain=1#L53-L61
[arcguide]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/contributing/arc-record.md?plain=1#L45-L54
[runtest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/runner.test.ts
