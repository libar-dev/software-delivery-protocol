# Orient before work

The orientation queries the repository handbook ([AGENTS.md](../../AGENTS.md)) makes mandatory before work, disclosed from [SKILL.md](SKILL.md) so the skill stays short. They are written for the Protocol source checkout; the bodies are not run by the recipe tests, so a failing query is a finding to report.

Run these eleven queries in order before work of any kind, after `CONTEXT.md`. Together they present the corpus, its honesty, the next work and what is undecided, and they show the practice: a body over `g` and `graph`, the `report` as data, recipes composed with `recipes(n, params)`, subjects passed with `--params`, the entry adapters (`findByConcept`, `byFile`, `blastRadius`) and the frozen joins (`specContext`, `packContext`, `resolveEntryAddress`). The bodies also show where each answer keeps its rows, so copy those paths rather than guessing them.

The commands are written for the Protocol source checkout, with its Pack, file, term and Spec ids as parameters. In an adopter, run the same bodies through the repository's runner with `--root` and `--exclude` (see "Bootstrap discipline" in [SKILL.md](SKILL.md)) and pass your own ids. To ask about another subject, change the `--params` value, never the body. Every number belongs to the commit it ran at: re-run, never quote. Before reading an empty list or a zero as absence, read "Empty answers that mislead" in [SKILL.md](SKILL.md).

## 1. The corpus and its surface

Specs by family, altitude, named coordinate and stated readiness; node, edge and claim counts; the reader's methods, every field a Spec row or an edge carries, and the parameters ten recipes accept.

```bash
pnpm --silent sdp:q 'const specs = g.specs(); const tally = (xs) => xs.reduce((t, x) => ({ ...t, [x]: (t[x] ?? 0) + 1 }), {}); const keys = (rows) => [...new Set(rows.flatMap((r) => Object.keys(r)))].join(" "); const byKind = {}; for (const s of specs) { const row = (byKind[`${s.kindDisplayLabel} (${s.specKind})`] ??= { idea: 0, scoped: 0, defined: 0, ready: 0 }); row[s.statedReadiness] = (row[s.statedReadiness] ?? 0) + 1; } const accepts = {}; for (const n of [3, 4, 6, 20, 23, 25, 29, 46, 53, 54]) accepts[n] = (await recipes(n, { "?": 1 })).accepts.join(" ") || "none"; return { specs: specs.length, byFamily: tally(specs.map((s) => s.id.split(/[:.]/)[1])), byAltitude: tally(specs.map((s) => s.altitude)), byKind, nodesByType: tally(graph.nodes.map((n) => n.nodeType)), edgesByType: tally(graph.edges.map((e) => e.type)), edgesByClaim: tally(graph.edges.map((e) => e.claim)), surface: { reader: Object.keys(g).join(" "), specRow: keys(specs), edge: keys(graph.edges), recipeParams: accepts } }'
```

**Teaches:** An ad-hoc body over `g` and the raw `graph`, pre-shaped into counts; field names collected across every row rather than the first; the unknown-parameter probe, `recipes(n, { "?": 1 }).accepts`, in place of reading the catalog for parameter names.

**Read:** Readiness here is stated readiness, the author's statement; query 4 reads the floor. Kind and altitude are tallied apart, not crossed. A missing key means none exists at that commit (in this checkout, no `inferred` claim and no `supersedes` edge). `g.specs()` rows carry no sections, relations or bindings (some carry `narrative`): a field read off a row returns a silent `undefined`, so read them through `g.specContext(id)` (query 10). `none` means a recipe takes no parameters.

## 2. The capabilities

Each capability epic as a one-line promise, with counts over its refinement descendants, and one `distinct` line of corpus totals.

```bash
pnpm --silent sdp:q 'const map = await recipes(52); const t = map.totals; const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`; const line = (r) => `${count(r.specs, "Spec")} (${count(r.byKind.example, "example")}, ${count(r.byKind.decision, "decision")}), ${r.byStatedReadiness.ready} stated ready, ${r.withImplementationBinding} implementation-bound, ${r.withVerifierBinding} verifier-bound, ${count(r.blockingQuestions, "blocking question")}`; return { epics: t.epics, unreached: t.unreached, cycles: map.cycles.length, damage: map.damage.length, distinct: line(t), rows: map.epics.map((e) => `${e.id}: ${e.title} | ${line(e.rollup)}${e.parentEpicIds.length > 0 ? `; under ${e.parentEpicIds.join(", ")}` : ""}`) }'
```

**Teaches:** A shipped recipe composed in a body, `recipes(52)`, cut to one line per epic.

**Read:** Rows overlap: an epic shown 'under' another is counted again in its parent, and a Spec refining two epics is counted under both. A rollup leaves out the epic itself. Never sum the rows; the `distinct` line is the corpus count. Zero unreached, cycles and damage is the healthy answer. Verifier-bound says a verifier binding exists, not that tests pass. Examples are verification evidence and decisions are ratified records. Neither needs an implementation binding, so an epic made mostly of them shows few implementation bindings without missing any work.

## 3. The Packs

Every Pack with its order, members, stated-ready count, implemented members outside examples and decisions, verifier gaps and unresolved members.

```bash
pnpm --silent sdp:q 'const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`; return g.packs().map((p) => { const pack = g.packContext(p.id); const members = pack.members.filter((m) => m.resolved); const work = members.filter((m) => m.specKind !== "example" && m.specKind !== "decision"); return `${p.id} [${pack.order ?? "reading"}] ${p.title}: ${count(members.length, "member")}, ${members.filter((m) => m.statedReadiness === "ready").length} stated ready, ${work.filter((m) => m.deliveryFacts.includes("implemented")).length}/${work.length} implemented outside examples and decisions, ${count(pack.verifierGaps.length, "verifier gap")}, ${pack.members.length - members.length} unresolved`; })'
```

**Teaches:** The frozen join `g.packContext(id)`, reached with ids `g.packs()` returned.

**Read:** Only a priority Pack orders work, as the corpus's advisory priority: never a schedule, a date or a gate. In this checkout, `pack:self-hosting-v1` holds the whole corpus. A Pack's verifier gaps include members below `ready`; only its ready gaps match query 4's `honesty/gaps` warnings, and decisions are exempt from both. A Pack states no system truth; `g.packContext(id).framing` holds its prose.

## 4. Honest and built

The validation report as data, the drift alarm, readiness divergence, delivery facts outside examples and decisions, the build and design backlogs, and every Spec below `ready` with the clause holding its next rung.

```bash
pnpm --silent sdp:q 'const signals = await recipes(8); const drift = await recipes(2); const divergence = await recipes(7); const build = await recipes(1); const ladder = await recipes(11); const design = await recipes(33); const errors = report.findings.filter((f) => f.severity === "error"); const work = g.specs().filter((s) => s.specKind !== "example" && s.specKind !== "decision"); const has = (fact) => work.filter((s) => s.deliveryFacts.includes(fact)).length; const floor = (r) => `${r.id}: stated ${r.statedReadiness}, floor ${r.floorReached}`; return { findings: report.findings.length, errorCount: errors.length, errors: errors.slice(0, 10).map((f) => `${f.validatorId} ${f.subjectId ?? f.file ?? ""}`), warnings: signals.signals.map((s) => `${s.validatorId} ${s.subjectId}`), warningsLeftOut: signals.leftOut, exemptions: signals.exemptions, driftAlarm: drift.alarms.map(floor), statedAboveFloor: divergence.map(floor), realization: `${work.length} Specs outside examples and decisions: ${has("implemented")} implemented, ${has("has-verifier")} has-verifier`, buildBacklog: Object.values(build.byFamily).flat().map((r) => r.id), designBacklog: design.totals.specs, belowReady: Object.values(ladder.byFamily).flat().map((r) => `${floor(r)}${r.statedNextRung ? `, next ${r.statedNextRung} ${r.nextUnmetClause ? `held by ${r.nextUnmetClause}` : "nothing blocks"}` : ""}`), excludedReady: { examples: build.excludedReadyExamples, decisions: build.excludedReadyDecisions, examplesWithoutVerifier: build.excludedWithoutVerifier.length } }'
```

**Teaches:** The `report` binding read as data, never a gate, beside six composed parameterless recipes (8, 2, 7, 1, 11, 33); a truncated list keeps its count beside it.

**Read:** No errors means conformance and honesty hold, not that the design is right. `errors` shows at most ten, `errorCount` counts them all, and a non-empty `warningsLeftOut` says the warnings list is cut. In this checkout the `honesty/gaps` warnings are intentional and the self-hosting oracle pins them; any other warning is a regression. A drift alarm is drift to resolve deliberately, never permission to promote what the code does into intent. `implemented` says a code anchor binds the Spec, not that it is live; `has-verifier` says a verifier binding resolves, not that tests pass. Only `buildBacklog` is build work. An empty design backlog means no Spec stated `defined` lacks an implementation binding (examples and decisions aside); `belowReady` lists what is left to design. 'nothing blocks' means no floor clause holds the stated next rung: it waits only for its author's statement. A floor reported as not evaluated marks an unratified kind or altitude; report it so, never as a rung nothing blocks. This reads the same report as `sdp validate`, with the same exclusions, without that command's build side effects.

## 5. Next work

The roadmap over `pack:roadmap`: each entry's need, stated rung against its floor, holding questions, build-now ids and drift, plus the statements and the selected decider's questions waiting.

```bash
pnpm --silent sdp:q 'const answer = await recipes(53, { pack: params.pack, decider: params.decider }); if (answer.diagnostics) return answer; return { decider: answer.decider, roadmaps: answer.roadmaps.map((roadmap) => ({ pack: roadmap.pack, totals: roadmap.totals, entries: roadmap.entries.map((e) => `${e.place}. ${e.id}: ${e.need} (stated ${e.statedReadiness}, floor ${e.floorReached})${e.blockingQuestions.length > 0 ? `; held by ${e.blockingQuestions.map((q) => q.address ?? q.spec).join(", ")}` : ""}${e.buildNow.length > 0 ? `; build now ${e.buildNow.join(", ")}` : ""}${e.work.drift > 0 ? `; ${e.work.drift} drift` : ""}`), apart: roadmap.apart.map((a) => `${a.place}. ${a.id}: ${a.need}`), unresolved: roadmap.unresolved.map((u) => `${u.place}. ${u.id}`), waitingStatements: roadmap.waiting.statements.map((s) => s.id), waitingQuestions: roadmap.waiting.questions.map((q) => q.address ?? q.spec), waitingWithoutDecider: roadmap.waiting.withoutDecider.map((q) => q.address ?? q.spec) })) }' --params '{"pack":"pack:roadmap"}'
```

**Teaches:** Subjects passed as `--params` to a composed recipe, `recipes(53, { pack: params.pack, decider: params.decider })`, with a diagnostics guard; the body maps `roadmaps[].entries` instead of truncating the answer.

**Read:** The order is advisory priority: never a schedule, a date or a gate. An entry needs the first of to design, to state and to build that any Spec of its work needs. Coding work is the build-now ids, on whichever entry carries them. 'to design' means the floor does not reach `ready` yet: read the holding questions and their deciders. 'to state' waits only on a person's `ready` statement. 'built' means every Spec of the entry's work states `ready` and every one outside examples and decisions is `implemented`, never that it is live. A drift count is the drift alarm inside the entry. `waitingQuestions` and `totals.questions` count only the decider's questions (`owner` unless `--params` names another `decider`), and `waitingWithoutDecider` lists those naming none. An entry's 'held by' lists every blocking question in its work, whatever its decider. In this checkout, the open arc's record is its draft pull request.

## 6. Undecided

Every open question by entry address, as a hold, a deferral or non-blocking, with its decider and any provisional answer; then the readiness statements waiting, in dependency order.

```bash
pnpm --silent sdp:q 'const register = await recipes(20); const queue = await recipes(46, { decider: params.decider }); if (queue.diagnostics) return queue; return { questions: register.totals, rows: register.specs.flatMap((s) => s.questions.map((q) => `${q.deferral ? "deferred" : q.blocking ? "holds" : "non-blocking"} | ${q.key ? `${s.id}#question.${q.key}` : `${s.id} (unkeyed)`} | decider ${q.decider ?? "none"}${q.provisional ? ", provisional" : ""}`)), queue: queue.totals, waitingStatements: queue.statements.map((w) => `${w.place}. ${w.id}: stated ${w.statedReadiness}, floor ${w.floorReached}${w.restsOn.length > 0 ? `, after ${w.restsOn.join(", ")}` : ""}`) }' --params '{"decider":"owner"}'
```

**Teaches:** A parameterless recipe (20, whose rows sit under `specs[].questions`) composed with a parameterized one (46, `decider` from `--params`).

**Read:** Every blocking question, hold or deferral, keeps its Spec's floor below `defined`. A hold waits on its decider now; a deferral is parked until its trigger fires, so do not reopen it before then. 'decider none' names no decider, and the queue counts these as `withoutDecider`. A decider is a corpus token that references nothing; in this checkout 'delegated' marks a question an agent may answer provisionally, pending the owner's review. The queue states no rung: a waiting statement waits for its author's statement. The register covers the corpus, the queue only the selected decider's questions, query 5 only the roadmap's share for its decider. A ruled-out topic may be a decision, not a question: search it with query 8.

## 7. Architecture and decisions

Each anchored component with its layer, units, satisfied Specs and uses; the direction unit-level `uses` edges run across layers; the decision register's totals; the decisions with the widest reach, by name.

```bash
pnpm --silent sdp:q 'const arch = await recipes(17); const crossings = await recipes(32); const register = await recipes(31); const map = await recipes(18); const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`; const short = (id) => id.replace(/^component:/, ""); const titles = new Map(map.decisions.map((d) => [d.id, d.title])); return { components: arch.components.map((c) => `${short(c.id)} [${c.layer ?? "no layer"}] ${c.label ?? ""}: ${count(c.members.length, "unit")}, satisfies ${count(c.satisfiedSpecs.length, "Spec")}, uses ${c.usesOut.map(short).join(" ") || "nothing"}`), unresolvedUses: arch.unresolvedUses.length, layerDirection: crossings.totals.byLayerPair, decisions: register.totals, mostShaping: map.ranking.slice(0, 8).map((r) => `${r.fanIn} ${r.id}: ${titles.get(r.id)}`) }'
```

**Teaches:** Four parameterless recipes (17, 32, 31, 18) composed into one bounded view. Run bare in this checkout, 17 prints about 344K characters and 18, 31 and 32 print 13-32K each.

**Read:** This is anchored structure, not exhaustive import reach: an unanchored file does not appear (recipe 40 ranks those, but needs an imports file `sdp build --imports` writes). `layerDirection` counts unit-level `uses` edges between components that state different layers. The Protocol orders no layers, and layer and role confer nothing; whether a pair is lawful is a corpus rule (recipe 42). Fan-in ranks reach, not priority. Read one decision's ruling with query 10. The graph has no MD-n field: in this checkout `docs/concept/DECISIONS.md` maps numbers to names, and a few Specs cite numbers in prose. In prose, lead with the name. Never run recipe 17 bare.

## 8. Arrive with a word

Where several terms live, through both matchers: the nodes `findByConcept` matches, with the fields matched, and entry search's count, cap and first addresses with lines.

```bash
pnpm --silent sdp:q 'const terms = [params.terms ?? params.term ?? []].flat(); if (terms.length === 0) return { diagnostics: [{ parameter: "terms", problem: "Expected a list of terms." }] }; const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`; const out = {}; for (const term of terms) { const nodes = g.findByConcept(term); const entries = await recipes(23, { term }); out[term] = { findByConcept: `${count(nodes.length, "node")}${nodes.length > 0 ? ": " : ""}${nodes.slice(0, 5).map((n) => `${n.id} [${n.matchedIn.join(",")}]`).join("; ")}`, entrySearch: `${count(entries.totals.matches, "entry", "entries")} in ${count(entries.totals.specs, "Spec")}, ${entries.totals.shown} shown${entries.matches.length > 0 ? ": " : ""}${entries.matches.slice(0, 4).map((m) => `${m.address ?? `${m.id} ${m.entry ?? m.section}`} line ${m.line}`).join("; ")}` }; } return out' --params '{"terms":["statement queue","localStorage","accessib"]}'
```

**Teaches:** The word entry adapter `g.findByConcept(term)` beside entry search composed per term, `recipes(23, { term })`, over one graph derivation; `terms` takes a list.

**Read:** `findByConcept` matches a case-insensitive substring of ids, titles or labels, Pack framing, narrative and sections. Entry search (recipe 23) matches whole tokens, splits camelCase, and returns addresses and lines. Each misses what the other finds (`localStorage`, `accessib`), so a zero from one is not absence; a spaced phrase can also miss a hyphenated id, so try that form. Entry search shows at most 50 rows: compare `shown` with `matches`, and never filter its rows down to a scope. `line null` means the entry is not located, not absent. Neither searches outside the graph: not `CONTEXT.md`, nor, in this checkout, the concept documents or the job stories.

## 9. Arrive with a file or a changeset

The nodes recorded at one file and the Specs reachable from them; then a changeset's impacted Specs, at-risk nodes and the files the graph records nothing at.

```bash
pnpm --silent sdp:q 'const file = params.file === undefined ? null : g.byFile(params.file); const change = await recipes(4, { files: params.files }); return { file: file && { path: file.path, nodes: file.nodes.map((n) => `${n.nodeType} ${n.id}${n.line === undefined ? "" : ` at line ${n.line}`}`), specs: file.specs }, changeset: { totals: change.totals, impactedSpecs: change.impactedSpecs, impactedPacks: change.impactedPacks, atRiskOther: change.atRisk.other, coverageUnknownFiles: change.coverageUnknownFiles, unlinkedUnits: change.unlinkedUnits, leftOut: change.leftOut } }' --params '{"file":"src/reader/reader.ts","files":["src/projections/studio/pages/roadmap-page.ts","specs/consumers/roadmap.sdp.md","AGENTS.md"]}'
```

**Teaches:** The file entry adapter `g.byFile(path)` called directly, and the changeset adapter `g.blastRadius(files)` through recipe 4's summary, paths passed as JSON data.

**Read:** A file the graph records nothing at lands in `coverageUnknownFiles` (here `AGENTS.md`): its reach is unknown, not empty. `byFile` on such a path returns empty nodes and specs, with the same meaning. A carrier path resolves to its own Spec; a unit bound to no Spec is a lawful identity-only anchor. `impactedPacks` lists only changed Pack manifests; a Pack holding an impacted Spec appears in `atRiskOther`. At-risk is one hop either way and asserts no dependency. For your own changes, pass recipe 4's git-diff file beside a file: `--params "@$changed" --params '{"file":"..."}'` (params merge).

## 10. Read Specs

For a list of Specs, or a Pack's members: named coordinate, stated and derived readiness, delivery facts, carrier file, outcome, keyed rules with their lines, a decision's ruling, Design and UI keys, open questions, relations with claims, implementations and verifiers.

```bash
pnpm --silent sdp:q 'const ids = params.specs === undefined ? g.packContext(params.pack)?.members.map((m) => m.id) : [params.specs].flat(); if (ids === undefined) return { specs: params.specs ?? null, pack: params.pack ?? null, found: false }; return ids.map((id) => { const c = g.specContext(id); if (c === undefined) return { id, found: false }; const s = c.sections; const line = new Map(c.entryLocations.map((l) => [l.entry, l.line])); const keyOf = Object.fromEntries(Object.entries(s.behavior?.ruleKeys ?? {}).map(([k, v]) => [v, k])); const clip = (t) => { const x = typeof t === "string" ? t : JSON.stringify(t); return x.length > 110 ? `${x.slice(0, 110)}...` : x; }; const inbound = {}; for (const r of c.relationsIn) inbound[r.type] = (inbound[r.type] ?? 0) + 1; return { id, title: c.title, coordinate: `${c.kindDisplayLabel}, ${c.altitude}`, readiness: `stated ${c.statedReadiness}, derived ${c.derivedReadiness}`, deliveryFacts: c.deliveryFacts, file: c.file, outcome: clip(s.intent?.outcome ?? ""), ...(s.decision ? { decision: clip(s.decision.decision) } : {}), rules: (s.behavior?.rules ?? []).map((r, i) => `line ${line.get(`rule[${i}]`) ?? "-"} ${keyOf[`rules[${i}]`] ? `#${keyOf[`rules[${i}]`]}` : "(unkeyed)"}: ${clip(r)}`), designKeys: Object.keys(s.design ?? {}), uiKeys: Object.keys(s.ui ?? {}), questions: (s.intent?.openQuestions ?? []).map((q) => `${q.key ?? "(unkeyed)"}${q.blocking ? ", blocking" : ""}`), relationsOut: c.relationsOut.map((r) => `${r.type} ${r.otherId} [${r.claim}]`), relationsIn: inbound, implementations: c.implementations.map((u) => `${u.codeId} at ${u.file}:${u.line} [${u.claim}]`), references: c.references.length, verifiers: c.verifiers.map((v) => `${v.verifierId} via ${v.via}${v.enabled ? "" : ", not enabled"}`) }; })' --params '{"specs":["spec:consumers.agent-surface","spec:decisions.agent-front-door"]}'
```

**Teaches:** The frozen join `g.specContext(id)` over ids from `--params`, joining `ruleKeys` (`rules[N]`) to `entryLocations` (`rule[N]`); `found: false` is the honest answer for an unknown id or Pack.

**Read:** Pass `specs` (a list or one id) or `pack`; a large Pack floods, so pass a list. Read the outline first, then fetch exact wording by address (query 11); rule text is clipped at 110 characters. When stated and derived readiness disagree, report both. Only `implementations` (a `satisfies` edge) confers `implemented`; `references` confers no delivery fact. A verifier via an example counts only when it is enabled. Recipe 3 adds every section's entries and floor clauses for one Spec, but often prints more than the carrier. Open the carrier only for the exact prose to edit, at the printed line.

## 11. Check a citation

For each entry address: the slot it resolves to, its file and line and its full wording, or why it fails and which keys the named section holds.

```bash
pnpm --silent sdp:q 'const answer = await recipes(25, { addresses: [params.addresses ?? []].flat() }); if (answer.diagnostics) return answer; return { totals: answer.totals, rows: answer.rows.map((r) => r.resolves ? `${r.address} -> ${g.resolveEntryAddress(r.address).entry} at ${r.file}:${r.line}: ${typeof r.value === "string" ? r.value : JSON.stringify(r.value)}` : `${r.address} UNRESOLVED (${r.reason})${r.available ? `; its ${r.section} keys: ${r.available.join(" ") || "none"}` : ""}${r.expected ? `; expected ${r.expected}` : ""}`) }' --params '{"addresses":["spec:consumers.agent-surface#rule.entryAdapters","spec:consumers.spec-studio.index-page#rule.packList","spec:consumers.spec-studio.index-page#ui.packList","spec:consumers.agent-surface"]}'
```

**Teaches:** The frozen join `g.resolveEntryAddress(address)` beside address resolution, `recipes(25, { addresses })`, which adds the wording and the line the join leaves out.

**Read:** Run it before writing any entry address into prose, a test or a page. A miss names its reason: `spec`, `section`, `entry` (with the keys that section holds) or `malformed`. A bare Spec id is not an entry address: check it with query 10. Decision sections and narrative carry no entry address, so quote them from the carrier.
