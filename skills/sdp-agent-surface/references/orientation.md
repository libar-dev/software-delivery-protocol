# Orient before work

`scripts/orient.mjs` runs these eleven queries in order over one graph derivation and prints each
answer under its heading. Read each answer with the notes below. Together they present the corpus,
its honesty, the next work and what is undecided, and they show the practice: a body over `g` and
`graph`, the `report` as data, recipes composed with `recipes(n, params)`, subjects passed as
`params`, the entry adapters (`findByConcept`, `byFile`, `blastRadius`) and the frozen joins
(`specContext`, `packContext`, `resolveEntryAddress`). The bodies also show where each answer keeps
its rows, so copy those paths rather than guessing them.

Each body takes its subject from `params` and derives one from the graph when none is given, so
the queries run in any corpus. In the Protocol source checkout, `scripts/orientation/protocol-checkout.json`
supplies the subjects these notes were written against, and the remarks that say "in this
checkout" describe that corpus. To ask about another subject, pass `--subjects` keyed by query
number, as in `--subjects '{"10":{"specs":["spec:example.id"]}}'`, never edit a body. A query that
fails is a finding to report. Every number belongs to the commit it ran at: re-run, never quote.
Before reading an empty list or a zero as absence, read the empty-answer notes in `answers.md`.

## 1. The corpus and its surface

Specs by family, altitude, named coordinate and stated readiness; node, edge and claim counts; the reader's methods, every field a Spec row or an edge carries, and the parameters ten recipes accept.

`scripts/orientation/01-the-corpus.js` · alone: `node scripts/orient.mjs --only 1`

**Teaches:** An ad-hoc body over `g` and the raw `graph`, pre-shaped into counts; field names collected across every row rather than the first; the unknown-parameter probe, `recipes(n, { "?": 1 }).accepts`, in place of reading the catalog for parameter names.

**Read:** Readiness here is stated readiness, the author's statement; query 4 reads the floor. Kind and altitude are tallied apart, not crossed. A missing key means none exists at that commit (in this checkout, no `inferred` claim and no `supersedes` edge). `g.specs()` rows carry no sections, relations or bindings (some carry `narrative`): a field read off a row returns a silent `undefined`, so read them through `g.specContext(id)` (query 10). `none` means a recipe takes no parameters.

## 2. The capabilities

Each capability epic as a one-line promise, with counts over its refinement descendants, and one `distinct` line of corpus totals.

`scripts/orientation/02-the-capabilities.js` · alone: `node scripts/orient.mjs --only 2`

**Teaches:** A shipped recipe composed in a body, `recipes(52)`, cut to one line per epic.

**Read:** Rows overlap: an epic shown 'under' another is counted again in its parent, and a Spec refining two epics is counted under both. A rollup leaves out the epic itself. Never sum the rows; the `distinct` line is the corpus count. Zero unreached, cycles and damage is the healthy answer. Verifier-bound says a verifier binding exists, not that tests pass. Examples are verification evidence and decisions are ratified records. Neither needs an implementation binding, so an epic made mostly of them shows few implementation bindings without missing any work.

## 3. The Packs

Every Pack with its order, members, stated-ready count, implemented members outside examples and decisions, verifier gaps and unresolved members.

`scripts/orientation/03-the-packs.js` · alone: `node scripts/orient.mjs --only 3`

**Teaches:** The frozen join `g.packContext(id)`, reached with ids `g.packs()` returned.

**Read:** Only a priority Pack orders work, as the corpus's advisory priority: never a schedule, a date or a gate. In this checkout, `pack:self-hosting-v1` holds the whole corpus. A Pack's verifier gaps include members below `ready`; only its ready gaps match query 4's `honesty/gaps` warnings, and decisions are exempt from both. A Pack states no system truth; `g.packContext(id).framing` holds its prose.

## 4. Honest and built

The validation report as data, the drift alarm, readiness divergence, delivery facts outside examples and decisions, the build and design backlogs, and every Spec below `ready` with the clause holding its next rung.

`scripts/orientation/04-honest-and-built.js` · alone: `node scripts/orient.mjs --only 4`

**Teaches:** The `report` binding read as data, never a gate, beside six composed parameterless recipes (8, 2, 7, 1, 11, 33); a truncated list keeps its count beside it.

**Read:** No errors means conformance and honesty hold, not that the design is right. `errors` shows at most ten, `errorCount` counts them all, and a non-empty `warningsLeftOut` says the warnings list is cut. In this checkout the `honesty/gaps` warnings are intentional and the self-hosting oracle pins them; any other warning is a regression. A drift alarm is drift to resolve deliberately, never permission to promote what the code does into intent. `implemented` says a code anchor binds the Spec, not that it is live; `has-verifier` says a verifier binding resolves, not that tests pass. Only `buildBacklog` is build work. An empty design backlog means no Spec stated `defined` lacks an implementation binding (examples and decisions aside); `belowReady` lists what is left to design. 'nothing blocks' means no floor clause holds the stated next rung: it waits only for its author's statement. A floor reported as not evaluated marks an unratified kind or altitude; report it so, never as a rung nothing blocks. This reads the same report as `sdp validate`, with the same exclusions, without that command's build side effects.

## 5. Next work

The roadmap over `pack:roadmap`: each entry's need, stated rung against its floor, holding questions, build-now ids and drift, plus the statements and the selected decider's questions waiting.

`scripts/orientation/05-next-work.js` · alone: `node scripts/orient.mjs --only 5`

**Teaches:** Subjects passed as `--params` to a composed recipe, `recipes(53, { pack: params.pack, decider: params.decider })`, with a diagnostics guard; the body maps `roadmaps[].entries` instead of truncating the answer.

**Read:** The order is advisory priority: never a schedule, a date or a gate. An entry needs the first of to design, to state and to build that any Spec of its work needs. Coding work is the build-now ids, on whichever entry carries them. 'to design' means the floor does not reach `ready` yet: read the holding questions and their deciders. 'to state' waits only on a person's `ready` statement. 'built' means every Spec of the entry's work states `ready` and every one outside examples and decisions is `implemented`, never that it is live. A drift count is the drift alarm inside the entry. `waitingQuestions` and `totals.questions` count only the decider's questions (`owner` unless the subjects name another `decider`), and `waitingWithoutDecider` lists those naming none. An entry's 'held by' lists every blocking question in its work, whatever its decider. In this checkout, the open arc's record is its draft pull request.

## 6. Undecided

Every open question by entry address, as a hold, a deferral or non-blocking, with its decider and any provisional answer; then the readiness statements waiting, in dependency order.

`scripts/orientation/06-undecided.js` · alone: `node scripts/orient.mjs --only 6`

**Teaches:** A parameterless recipe (20, whose rows sit under `specs[].questions`) composed with a parameterized one (46, `decider` from `--params`).

**Read:** Every blocking question, hold or deferral, keeps its Spec's floor below `defined`. A hold waits on its decider now; a deferral is parked until its trigger fires, so do not reopen it before then. 'decider none' names no decider, and the queue counts these as `withoutDecider`. A decider is a corpus token that references nothing; in this checkout 'delegated' marks a question an agent may answer provisionally, pending the owner's review. The queue states no rung: a waiting statement waits for its author's statement. The register covers the corpus, the queue only the selected decider's questions, query 5 only the roadmap's share for its decider. A ruled-out topic may be a decision, not a question: search it with query 8.

## 7. Architecture and decisions

Each anchored component with its layer, units, satisfied Specs and uses; the direction unit-level `uses` edges run across layers; the decision register's totals; the decisions with the widest reach, by name.

`scripts/orientation/07-architecture-and-decisions.js` · alone: `node scripts/orient.mjs --only 7`

**Teaches:** Four parameterless recipes (17, 32, 31, 18) composed into one bounded view. Run bare in this checkout, 17 prints about 344K characters and 18, 31 and 32 print 13-32K each.

**Read:** This is anchored structure, not exhaustive import reach: an unanchored file does not appear (recipe 40 ranks those, but needs an imports file `sdp build --imports` writes). `layerDirection` counts unit-level `uses` edges between components that state different layers. The Protocol orders no layers, and layer and role confer nothing; whether a pair is lawful is a corpus rule (recipe 42). Fan-in ranks reach, not priority. Read one decision's ruling with query 10. The graph has no MD-n field: in this checkout `docs/concept/DECISIONS.md` maps numbers to names, and a few Specs cite numbers in prose. In prose, lead with the name. Never run recipe 17 bare.

## 8. Arrive with a word

Where several terms live, through both matchers: the nodes `findByConcept` matches, with the fields matched, and entry search's count, cap and first addresses with lines.

`scripts/orientation/08-arrive-with-a-word.js` · alone: `node scripts/orient.mjs --only 8`

**Teaches:** The word entry adapter `g.findByConcept(term)` beside entry search composed per term, `recipes(23, { term })`, over one graph derivation; `terms` takes a list.

**Read:** `findByConcept` matches a case-insensitive substring of ids, titles or labels, Pack framing, narrative and sections. Entry search (recipe 23) matches whole tokens, splits camelCase, and returns addresses and lines. Each misses what the other finds (`localStorage`, `accessib`), so a zero from one is not absence; a spaced phrase can also miss a hyphenated id, so try that form. Entry search shows at most 50 rows: compare `shown` with `matches`, and never filter its rows down to a scope. `line null` means the entry is not located, not absent. Neither searches outside the graph: not `CONTEXT.md`, nor, in this checkout, the concept documents or the job stories.

## 9. Arrive with a file or a changeset

The nodes recorded at one file and the Specs reachable from them; then a changeset's impacted Specs, at-risk nodes and the files the graph records nothing at.

`scripts/orientation/09-arrive-with-a-file.js` · alone: `node scripts/orient.mjs --only 9`

**Teaches:** The file entry adapter `g.byFile(path)` called directly, and the changeset adapter `g.blastRadius(files)` through recipe 4's summary, paths passed as JSON data.

**Read:** A file the graph records nothing at lands in `coverageUnknownFiles` (here `AGENTS.md`): its reach is unknown, not empty. `byFile` on such a path returns empty nodes and specs, with the same meaning. A carrier path resolves to its own Spec; a unit bound to no Spec is a lawful identity-only anchor. `impactedPacks` lists only changed Pack manifests; a Pack holding an impacted Spec appears in `atRiskOther`. At-risk is one hop either way and asserts no dependency. For your own changes, pass them as query 9's subjects, `--subjects '{"9":{"files":[...]}}'`, or run recipe 4 directly with its git-diff file (its catalog entry shows how).

## 10. Read Specs

For a list of Specs, or a Pack's members: named coordinate, stated and derived readiness, delivery facts, carrier file, outcome, keyed rules with their lines, a decision's ruling, Design and UI keys, open questions, relations with claims, implementations and verifiers.

`scripts/orientation/10-read-specs.js` · alone: `node scripts/orient.mjs --only 10`

**Teaches:** The frozen join `g.specContext(id)` over ids from `params`, joining `ruleKeys` (`rules[N]`) to `entryLocations` (`rule[N]`); `found: false` is the honest answer for an unknown id or Pack.

**Read:** Pass `specs` (a list or one id) or `pack`; a large Pack floods, so pass a list. Read the outline first, then fetch exact wording by address (query 11); rule text is clipped at 110 characters. When stated and derived readiness disagree, report both. Only `implementations` (a `satisfies` edge) confers `implemented`; `references` confers no delivery fact. A verifier via an example counts only when it is enabled. Recipe 3 adds every section's entries and floor clauses for one Spec, but often prints more than the carrier. Open the carrier only for the exact prose to edit, at the printed line.

## 11. Check a citation

For each entry address: the slot it resolves to, its file and line and its full wording, or why it fails and which keys the named section holds.

`scripts/orientation/11-check-a-citation.js` · alone: `node scripts/orient.mjs --only 11`

**Teaches:** The frozen join `g.resolveEntryAddress(address)` beside address resolution, `recipes(25, { addresses })`, which adds the wording and the line the join leaves out.

**Read:** Run it before writing any entry address into prose, a test or a page. A miss names its reason: `spec`, `section`, `entry` (with the keys that section holds) or `malformed`. A bare Spec id is not an entry address: check it with query 10. Decision sections and narrative carry no entry address, so quote them from the carrier.
