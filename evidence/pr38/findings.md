# Findings

Every finding the nine engineering lanes produced at `b5e0a8be`, with its cross-family verdict. Generated from `findings.json`. Within each group, findings are ordered by severity after verification.

Totals: 56 findings, 45 confirmed, 11 refuted.

## Confirmed

### Spec findings (3)

These travel as one change proposal: see `proposal.json`, its check `proposal-check.json` and `proposal-memo.md`.

#### L2-2: answer-shapes Spec still prescribes the retired wrap-the-shipped-body idiom; the catalog now uses recipes()

- **Severity:** medium
- **Location:** specs/consumers/agent-surface.answer-shapes.sdp.md:42 (design.wrapIdiom)
- **Claim:** The ready Spec's design entry wrapIdiom says a caller filters a shipped answer by wrapping the shipped body as `const answer = await (async (params) => { <shipped body> })({ ... });`. Since the fifth binding (spec:consumers.agent-surface.evaluation-sink#rule.fifthBinding and #rule.recipeCall), the catalog and the reading skill teach `await recipes(<n>, { ... })` instead. The Spec's design entry is stale, and the self-hosting oracle pins the stale text.
- **Evidence:** specs/consumers/agent-surface.answer-shapes.sdp.md:42: "- wrapIdiom: to filter a shipped answer, the caller wraps the shipped body in an async arrow function that takes `params`, inside its own body, `const answer = await (async (params) => { <shipped body> })(...)`". docs/agent-surface/recipes.md:136-146: "To filter a shipped answer, call it through `recipes` with only its own parameters:" followed by `pnpm --silent sdp:q 'const answer = await recipes(33); return answer.rows.filter(...)'`. SKILL.md shows the same recipes(29, ...) form. `grep -rn "async (params)" test/*.ts` finds no test that exercises the wrap idiom; test/self-hosting-oracle/consumers.ts:51 pins the wrapIdiom text.
- **Proposed change:** Replace design.wrapIdiom with: "wrapIdiom: to filter a shipped answer, the caller calls `const answer = await recipes(<number>, { <the recipe's own parameters> });` inside its own body and returns a filtered value, so the caller's own parameters never reach the recipe as names it does not take; the catalog shows the shell form and states that the caller's part must hold no shell expansion." Update the pinned text in test/self-hosting-oracle/consumers.ts in the same change.
- **Failure scenario:** An agent reading the carrying Spec (as the skill tells it to for law) inlines a whole recipe body inside its own shell-quoted body. That is the shell-expansion hazard and second derivation of the code that the recipes binding exists to avoid, and it contradicts the catalog.
- **Verifier (GPT):** The ready Spec explicitly prescribes an idiom the catalog no longer demonstrates. Replace design.wrapIdiom with the recipes(number, parameters) form and update its oracle expectation.

#### L6-3: The reader exposes a public resolveEntryAddress method that the ready spec:consumers.reader method list omits

- **Severity:** medium
- **Location:** specs/consumers/reader.sdp.gherkin:74; src/reader/reader.ts:415,1212
- **Claim:** spec:consumers.reader states ready and enumerates the reader's methods: graph, specs, packs, findings, findByConcept, byFile, blastRadius, specContext, packContext. It adds that a join is added only at the second-caller bar. The realized reader also exposes resolveEntryAddress on its public Reader interface. A shipped recipe body depends on it, yet no Spec states it. This is drift. The Spec is likely the stale side, because a shipped recipe already consumes the method. Otherwise it is an owner design question: keep the join, or remove it from the public surface.
- **Evidence:** `sdp q 'return Object.keys(g)'` returns [graph, specs, packs, findings, findByConcept, byFile, blastRadius, resolveEntryAddress, specContext, packContext]. reader.sdp.gherkin:74 reads: "Rule: The reader exposes `graph`, the raw graph it reads, and the methods `specs`, `packs`, `findings`, `findByConcept`, `byFile`, `blastRadius`, `specContext` and `packContext`". `grep -rn resolveEntryAddress specs` finds nothing. docs/agent-surface/recipes.md:5160 (recipe 51) calls `g.resolveEntryAddress(row.address)`. No skill documents the method.
- **Proposed change:** In spec:consumers.reader, extend the rule at reader.sdp.gherkin:74 to: "... `blastRadius`, `specContext`, `packContext` and `resolveEntryAddress`". Add a rule stating its contract: it resolves one entry address by the rules address resolution (recipe 25) applies and returns the resolution with its reason. Name recipe 51 as the second machine consumer. Alternatively, raise it as an owner open question on spec:consumers.reader.
- **Failure scenario:** An agent reading the carrying Spec believes the reader is closed to those eight methods. It hand-rolls address resolution, or it treats recipe 51's call as illegal. Conversely, a refactor that honours the Spec removes the method and breaks a shipped recipe without any Spec catching it.
- **Verifier (GPT):** Spec: The public method and shipped consumer lack a stated reader contract. This confirms drift requiring reconciliation, but code usage alone does not ratify the proposed API addition.

#### L2-1: Reader exposes resolveEntryAddress, which no Spec states; shipped recipe 51 and the vault depend on it

- **Severity:** low (reader rated medium; the verifier adjusted it)
- **Location:** specs/consumers/reader.sdp.gherkin:74; src/reader/reader.ts:415,1212; docs/agent-surface/recipes.md:5160; .agents/skills/sdp-agent-surface/SKILL.md:346
- **Claim:** spec:consumers.reader rule 2 lists the reader's public surface as a closed list: graph, specs, packs, findings, findByConcept, byFile, blastRadius, specContext and packContext. The Reader interface also exposes resolveEntryAddress. Shipped recipe 51 (entry citations) and the vault projection call it. No Spec, skill or catalog prose states it, so adopters script against a public method with no carrying intent. The agent-surface skill even says everything past the three entry adapters is a recipe. The code side has a reason: two machine consumers meet the reader's own rule for adding a join (spec:consumers.agent-surface#rule.growByRecipe). So the Spec is the stale side.
- **Evidence:** `sdp q 'return Object.keys(g)'` returns [graph, specs, packs, findings, findByConcept, byFile, blastRadius, resolveEntryAddress, specContext, packContext]. src/reader/reader.ts:415 declares `resolveEntryAddress(address: string): AddressResolution;` in `export interface Reader`. The recipes.md:5160 body runs `const { reason } = g.resolveEntryAddress(row.address);`. src/projections/vault/notes.ts:197 and src/projections/vault/text.ts:45 call reader.resolveEntryAddress. `grep -rn resolveEntryAddress specs` returns nothing. git -S puts the addition in 604c7432 "fix(d): the review findings".
- **Proposed change:** Replace the rule at specs/consumers/reader.sdp.gherkin:74 with: "Rule: The reader exposes `graph`, the raw graph it reads, and the methods `specs`, `packs`, `findings`, `findByConcept`, `byFile`, `blastRadius`, `resolveEntryAddress`, `specContext` and `packContext`; `resolveEntryAddress` resolves an entry address with the grammar and entry rules prose validation uses and returns `{ resolves, reason }`; a join is added only when a second machine consumer needs it and hand-rolled attempts get it wrong." Then add a reader example or test assertion for it, and name it beside the entry adapters in the 'Do not propose new query verbs' bullet of sdp-agent-surface/SKILL.md.
- **Failure scenario:** An adopter reads spec:consumers.reader to learn the reader contract, does not find resolveEntryAddress, and either re-implements the address grammar (a second, divergent read of the entry rules) or relies on a method the Protocol may remove with no Spec change to flag it. Recipe 51 would break silently if the method were renamed.
- **Verifier (GPT):** The public method is absent from the reader's method inventory and from every Spec's narrative and sections. Add its signature and actual result shape, including entry, resolves and reason; severity is low because entry-citations and prose-mentions already carry the resolution semantics.

### Code findings (15)

Defects in the engine or repository tooling against settled intent.

#### L3-01: The authored-honesty check misses the camelCase delivery-fact spelling `hasVerifier`, so a hand-authored fact passes or is dropped silently

- **Severity:** high
- **Location:** src/validate/validators.ts:1586 (checkAuthoringShape → scanCarrier); parity intent stated at src/extract/reify.ts:109-113
- **Claim:** checkAuthoringShape scans section carriers only for the names in `deliveryFactNames` (`implemented`, `has-verifier`, `observed`, src/graph/schema.ts:48). Extraction lets reserved names inside a section 'reify through' to this validator: the reify.ts comment says 'In-section content stays the honesty checks' jurisdiction' and 'every delivery-fact spelling is reserved in both carriers (R-6 parity)'. The validator never checks the camelCase `hasVerifier`, which the Markdown carrier (markdown-body-owner-support.ts:7), the YAML policy (markdown-yaml-policy.ts:21) and Gherkin (gherkin.ts:377) all reserve. So in a TypeScript carrier, `design.hasVerifier` lands in the graph with no finding, and `behavior.hasVerifier` is dropped with neither an honesty error nor the usual extract/unrecognized-property warning. This breaks the ready rule of spec:validation.authored-honesty ('Specs and Packs author no derived edge or delivery fact') and L2 ('authored content must never silently fall out of the graph').
- **Evidence:** Validator alone, via dist/index.js validateGraph on a Primitive with each design shape: {"implemented":"yes"} → one honesty/authoring-shape error; {"has-verifier":"yes"} → one error; {"hasVerifier":"yes"} → [] (no finding). End to end, a .sdp.ts carrier with `design: { hasVerifier: "yes", observed: "no" }` gives `sdp validate`: only `[error] honesty/authoring-shape … "observed" at "design.observed"`; generated/graph.json line 23 holds `"hasVerifier": "yes"` and the location table holds `"entry": "design.hasVerifier"`. The same carrier with `behavior: { rules: [...], hasVerifier: true }` gives `0 errors · 1 warnings` (the orphan warning only), and graph.json has no hasVerifier key, while `behavior: { …, foo: "bar" }` gives `[warning] extract/unrecognized-property — property "behavior.foo" … is dropped`.
- **Proposed change:** In checkAuthoringShape, scan every reserved delivery-fact spelling rather than `deliveryFactNames` alone, e.g. `const DELIVERY_FACT_SPELLINGS = [...deliveryFactNames, "hasVerifier"] as const;`, and report `relatedId: "has-verifier"` for the camelCase hit. Better, export one shared spelling list (from graph/schema.ts) that reify.ts RESERVED_DERIVED_PROPERTIES, markdown-body-owner-support.ts, markdown-yaml-policy.ts, the gherkin.ts tag pattern and this validator all import, so the parity cannot drift again. Add a validators.test.ts case for `design.hasVerifier` and `behavior.hasVerifier`.
- **Failure scenario:** A TypeScript-carrier author writes `design: { hasVerifier: "yes — covered by e2e" }`. The design section is an open string record, so tsc accepts it. `sdp validate` reports no honesty error, and every reader of the graph sees an authored verification claim on the Spec. The equivalent Markdown carrier is refused.
- **Verifier (GPT):** The reserved camelCase spelling bypasses authoring-shape honesty; high remains warranted for that honesty violation, although it does not forge the derived deliveryFacts badge. Share the reserved spellings across extraction and validation and test both sections.

#### L4-01: Build staging files follow existing links and can overwrite unrelated files

- **Severity:** high
- **Location:** src/cli/build-command.ts:450-453,493-499
- **Claim:** Graph, imports, and registrar-manifest temporaries are opened with the default truncating write mode without rejecting or unlinking existing links. Renaming afterward does not prevent damage to the link target.
- **Evidence:** A read-only runBuild probe with filesystem mutations intercepted returned exitCode 0 and recorded graph.json.tmp operations as write(path, serialized, 'utf8'), then rename(path, graph.json), with no preceding removal or exclusive creation. Lines 452, 453 and 494 use this pattern; registrar sibling temporaries instead receive explicit removal at line 481.
- **Proposed change:** Create staging files exclusively with no-follow semantics after safely handling stale owned temporary entries. Validate the physical output-parent boundary before mutations. Add regressions for symlink and hard-link temporaries targeting an unrelated sentinel file.
- **Failure scenario:** generated/graph.json.tmp is a symlink to ../../README.md. Running build truncates README.md with graph JSON and then publishes the symlink as graph.json, potentially returning success.
- **Verifier (Claude):** Reproduced end to end: `sdp build` exited 0, wrote graph JSON through the planted symlink into a file outside the corpus, and published the symlink itself as graph.json. The code writes the graph and imports temporaries with a plain writeFileSync (build-command.ts:452-453) and the registrar manifest at :494, with no unlink or no-follow first. Registrar siblings get rmSync at :481, and the vault Spec explicitly refuses symbolic links under its owned folder, so build is the inconsistent writer. Severity stays high: arbitrary data loss outside the root. The precondition is a planted link, for example a force-committed generated/graph.json.tmp in a cloned repo.

#### L1-01: A shared Given/When key silently suppresses product invocation

- **Severity:** medium (reader rated high; the verifier adjusted it)
- **Location:** src/codegen/contracts.ts:542
- **Claim:** spec:extraction.runnable-modules requires the first When occurrence to invoke the product (specs/extraction/runnable-modules.sdp.md:35). The generated registrar instead chooses each key's behavior from its first occurrence.
- **Evidence:** An in-memory Markdown parent and child containing 'Given ready / When ready / Then done' produced no validation or generation findings. The generated 'ready' handler was the Given no-op. Executing the generated registrar through production runtime functions and runExamplePlan returned {"invoked":false,"compared":true,"invokeCalls":0,"test":"passed"}, although the supplied invoke callback throws. The bound runtime test at test/testing.test.ts:78 calls invokeRunnableExample directly and does not exercise this generated dispatch case.
- **Proposed change:** Dispatch generated registrar behavior using each step occurrence's phase while retaining its contract key. Do not let deduplication select Given semantics for a When occurrence. Add a generated-registrar regression proving a throwing invoke executes when Given and When share a key.
- **Failure scenario:** A lawful example reuses one skeleton across Given and When. Its initial world already matches the oracle, so verification passes without exercising the product.
- **Verifier (Claude):** The generated registrar dedupes bindings by contract key, so the When occurrence of a shared skeleton runs the Given no-op and `invoke` never runs. This contradicts runnable-modules' rule that the first When invokes the product. Downgraded because it needs one skeleton authored in both Given and When. Under step-keys #oneKeyOneStep ('a step being one skeleton') that is a single step with a single handler, so the owner may prefer to refuse cross-phase skeletons in the Spec (target design) rather than dispatch by phase. Neither validation nor codegen flags the case today.

#### L1-02: An authored unspecified Then can turn a coverage gap into a pass

- **Severity:** medium (reader rated high; the verifier adjusted it)
- **Location:** src/testing/index.ts:110
- **Claim:** spec:extraction.runnable-modules explicitly requires a bound example selecting unspecified to fail (specs/extraction/runnable-modules.sdp.md:39). The runtime only checks whether the oracle kind matches a Then key.
- **Evidence:** A parent vocabulary and child with 'Given ready / When run / Then unspecified' reified and generated without findings. Running the generated registrar with expected() and observe() both returning {"kind":"unspecified"} completed successfully: {"invoked":true,"compared":true,"invokeCalls":1,"test":"passed"}. compareContractOutcome marks this comparison complete at line 128, and completeRunnableExample accepts it.
- **Proposed change:** Explicitly reject oracle.kind === 'unspecified' before matching or comparing any authored Then. Add a regression with an actual Then key named unspecified, covering both skeleton and explicit-key forms.
- **Failure scenario:** A Then skeleton or step key equals unspecified, allowing an oracle's declared coverage gap to count as successful executable evidence.
- **Verifier (Claude):** compareContractOutcome (src/testing/index.ts:110-130) only checks `step.key !== oracle.kind`, and nothing reserves `unspecified` as a Then key. An authored Then `unspecified` therefore makes a bound example selecting unspecified pass, against runnable-modules' bound-unspecified rule. Downgraded because it needs a Then whose skeleton or key is literally `unspecified`. A Spec-side reservation of that key would also work as a fix.

#### L1-03: A legal kind slot generates an invalid Outcome type

- **Severity:** medium
- **Location:** src/codegen/contracts.ts:130
- **Claim:** spec:carrier.slot-notation permits the identifier kind (specs/carrier/slot-notation.sdp.md:17), while spec:extraction.executable-contracts promises typed Outcome variants containing the contract-key discriminant and authored slots (specs/extraction/executable-contracts.sdp.md:30,53). Code generation fails to handle their collision.
- **Evidence:** Reifying a lawful vocabulary with 'Then result {kind:number}' and running generateContracts emitted no finding and generated '{ readonly kind: "result {kind}"; readonly kind: number }'. An in-memory TypeScript compiler check produced TS2300 'Duplicate identifier kind' and TS2717 requiring the two declarations to have the same type.
- **Proposed change:** Detect payload-slot collisions with the Outcome discriminant before rendering. Withhold the unrepresentable space contract and dependent registrars with a named generation warning instead of emitting invalid TypeScript; add a compiler-backed regression. Any revised payload representation should be settled in the carrying Spec.
- **Failure scenario:** An adopter uses a permitted domain slot named kind in a Then step; validation succeeds, but generated contracts break the adopter's typecheck.
- **Verifier (Claude):** slot-notation #slotName admits `kind`, and executable-contracts' outcomeVariant shape `{ readonly kind: "<contract key>"; readonly <slot>: <type> }` collides with it. Codegen emits invalid TypeScript and raises no finding. The fix spans Spec and code: reserve `kind` as a Then slot name (or change the payload representation) in the Spec, and withhold with a named finding in codegen.

#### L1-04: Forbidden Markdown block shapes are accepted inside list entries

- **Severity:** medium
- **Location:** src/extract/markdown-body-content.ts:256
- **Claim:** spec:carrier.markdown-body-grammar#rule.blockShapes explicitly applies block-shape refusals to list text, and #rule.oneLineEntries refuses nested and ordered lists (specs/carrier/markdown-body-grammar.sdp.md:34-35). The parser checks the outer line but does not check the text after stripping '- '.
- **Evidence:** Separate reifyMarkdownCarrier probes under '## Rule' accepted '- > quote', '- \* nested', '- 1. numbered', and '- | table'. Every probe returned specs:1 and findings:[], with the forbidden text retained verbatim in behavior.rules. Lines 258-261 check only empty or whitespace-prefixed list text before accepting it.
- **Proposed change:** Apply the declared block-shape checks to extracted list text before adding an item, preserving code-span handling. Add refusal probes for block quotes, nested bullets, ordered-list prefixes and pipe-prefixed text inside rule bullets.
- **Failure scenario:** An author supplies a block construct the ready carrier contract promises to refuse; extraction accepts it as a rule, producing a different interpretation from the authored Markdown structure.
- **Verifier (Claude):** markdown-body-grammar #blockShapes applies its refusals to list text, and #oneLineEntries refuses nested and ordered lists. The parser strips `- ` and checks only for empty or whitespace-led text (src/extract/markdown-body-content.ts:256-260); it never runs isUnsupportedCommonMarkBlock or the pipe and quote checks on the remainder. The same constructs as top-level lines are refused.

#### L2-3: Parse error inside an unterminated template literal is reported at line 1, column 1

- **Severity:** medium
- **Location:** src/reader/evaluate-body.ts:58-70 (compileBody refusal path)
- **Claim:** The evaluation-sink rule ("A body that fails to parse is reported with the line and column of the error in the body the caller wrote") and design.parseErrorLine are not met when the body ends inside a template literal (and similar cases). The literal swallows the wrapper's closing `})`. V8's stack then has no caret on its third line, so the position regex fails. The code falls back to wrapperLine 2, which yields line 1, column 1 and the raw message "Unexpected end of input". The past-the-end branch, "the body ends before it is complete", is skipped.
- **Evidence:** `node dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity $'const a = 1;\nreturn `x${a`'` prints `sdp q: the body does not parse at line 1, column 1: Unexpected end of input`. The error is at the end of line 2. V8 stack for that wrapper: ["sdp-q-body:4","})"," ",""]: line 4 is known, but the regex `/^sdp-q-body:(\d+)\n[^\n]*\n([^\n^]*)\^/u` needs a caret, so it falls to `Number(position?.[1] ?? 2)`. By contrast `return (1` correctly reports line 1, column 9, "the body ends before it is complete".
- **Proposed change:** Parse the line number separately from the caret: `const lineMatch = /^sdp-q-body:(\d+)/u.exec(stack); const caret = /^sdp-q-body:\d+\n[^\n]*\n([^\n^]*)\^/u.exec(stack); const wrapperLine = Number(lineMatch?.[1] ?? 2);`. Then use `caret?.[1]` for the column. Line 4 then triggers pastEnd and reports line 2 at its end column with "the body ends before it is complete". Add a cli-q test for a body ending inside a template literal.
- **Failure scenario:** An agent's multi-line body with an unclosed template literal (common in bodies that format strings) gets pointed at line 1, column 1. It edits the wrong place. `sdp validate --rules`, which shares the same compiler, misreports the same way.
- **Verifier (GPT):** The unterminated template reproduces an incorrect body position, violating the stated parse-diagnostic guarantee. Extract the wrapper line independently of the caret so the existing past-end handling runs.

#### L4-02: Three projection publishers silently collide on case-insensitive filesystems

- **Severity:** medium
- **Location:** src/projections/design-review-markdown.ts:12-15; src/projections/mermaid.ts:75-83; src/projections/gherkin-view.ts:45-53
- **Claim:** Distinct lawful Spec IDs differing only in letter case produce filesystem-equivalent page paths. The publishers write both without detecting the collision, so one page overwrites another.
- **Evidence:** An in-memory graph containing spec:probe.Twin and spec:probe.twin passed validateGraph with zero errors. renderDesignReview and renderMermaid returned spec/probe.Twin.md and spec/probe.twin.md; renderGherkinView returned the corresponding .feature.md paths. Each pair had only one distinct case-folded path.
- **Proposed change:** Check the complete publication path set for case-insensitive collisions before writing and refuse the affected publication with both IDs named. Alternatively adopt collision-free encoding consistently across page paths and links, as Studio already does.
- **Failure scenario:** On a default case-insensitive macOS volume, view, mermaid, or gherkin reports successful publication while both IDs' links resolve to the same surviving page.
- **Verifier (Claude):** spec:probe.Twin and spec:probe.twin validate with 0 errors. On this macOS volume each of view, mermaid and gherkin reported '3 pages' and exit 0, but only one Spec page file exists. The surviving design-review/spec/probe.Twin.md carries spec:probe.twin's content, so one Spec silently loses its page. Studio avoids the collision with distinct names (specs/probe.\_twin.html and specs/probe.twin.html), so the fix already exists in one publisher.

#### L4-04: Watch mode rejects a symlinked root accepted by ordinary commands

- **Severity:** medium
- **Location:** src/cli/build-args.ts:331-343; src/cli/validate-watch.ts:337-355
- **Claim:** Root parsing accepts directory symlinks through statSync but retains their lexical path. Watch initialization uses lstatSync on that path and incorrectly reports the root as unwatchable before its first cycle.
- **Evidence:** The existing .claude/skills symlink points to ../.agents/skills. Calling the built runSdpCli with ['validate','.claude/skills','--watch'], an abort signal, and a non-writing cycle hook returned exit 1, cycles 0, and 'watch root .../.claude/skills was removed or can no longer be watched'. The graph's validate-watch guarantee requires the ordinary validation path once at startup.
- **Proposed change:** Resolve the explicitly selected root to its physical directory before watcher initialization and use that identity consistently. Continue rejecting descendant directory symlinks during traversal.
- **Failure scenario:** An adopter invokes validate, studio, or vault watch mode through a workspace symlink. Argument parsing accepts the directory, but watch mode immediately fails despite the target directory existing.
- **Verifier (Claude):** Root parsing accepts a symlinked directory, because statSync follows links (build-args.ts:342-344). Watch setup then calls lstatWatchPath on the same lexical path (validate-watch.ts:337-353), sees a symlink rather than a directory, and fails as an unwatchable root. Without --watch, validate on the same symlinked root works. The error message says the root 'was removed', which is also misleading.

#### L9-F2: Root export advertises CommonJS `require` but ships only ESM type declarations

- **Severity:** medium
- **Location:** package.json:31-35 (exports "."); tsup.config.ts:44-46 (cjs build with dts: false)
- **Claim:** `exports["."]` pairs `"require": "./dist/index.cjs"` with one top-level `"types": "./dist/index.d.ts"`. In a `"type": "module"` package that .d.ts is read as ESM, so a TypeScript CommonJS consumer cannot type-import the package, even though the runtime `require` works.
- **Evidence:** `node -e "require('./dist/index.cjs')"` loads 90 exports. A scratch CJS consumer (`{"type":"commonjs"}`, tsconfig module/moduleResolution node16) with `import { ref } from "@libar-dev/software-delivery-protocol"` fails `tsc` with: `a.ts(1,21): error TS1479: The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module...`. `ls dist/index.d.cts` → No such file.
- **Proposed change:** Emit CJS declarations (set `dts: true` on the cjs tsup entry so dist/index.d.cts is produced) and nest the conditions: `".": { "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }, "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" } }`. Alternatively, drop the `require` condition if CommonJS is not a supported surface.
- **Failure scenario:** An adopter with a CommonJS TypeScript test or tooling package (module node16 or nodenext) imports `specTest` or `ref` and gets TS1479, although the package's own exports say `require` is supported.
- **Verifier (GPT):** The declaration export breaks CommonJS TypeScript imports under Node16 resolution; provide condition-specific CJS declarations. Narrow the claim: the same import passes under NodeNext with installed TypeScript 5.9.3.

#### C1: The temporal guard exempts DECISIONS.md as a dated diary it no longer is, and the guard's law has no Spec

- **Severity:** low
- **Location:** check-temporal.mjs:6-20; plans/05-de-temporalization-and-decisions-registry.md:63-78
- **Claim:** check-temporal.mjs exempts `docs/concept/DECISIONS.md` as 'the dated decision diary', but the registry is now lean and holds no token the guard bans. The exemption would let a dated row slip in unchecked. The guard's law ('name by capability, not calendar; state the invariant, not the event') is carried only by the script comment, its test and plan 05. Plan 05's Rule 3 ('status lives in exactly one place: plans/') is superseded by spec:decisions.roadmap-over-plans.
- **Evidence:** `grep -nE "Session[ -][0-9]|Wave[- ][A-Z]|Fold-[A-Z]|deferredInSession|plans/[0-9]+|20[0-9]{2}-[0-9]{2}-[0-9]{2}" docs/concept/DECISIONS.md` → no output. check-temporal.mjs:19 `const excludedFiles = ["docs/concept/DECISIONS.md", "package-lock.json"];`. test/check-temporal.test.ts:140 pins the exclusion.
- **Proposed change:** Remove `docs/concept/DECISIONS.md` from `excludedFiles` and the 'dated decision diary' clause from the header comment, and update test/check-temporal.test.ts:140 to expect DECISIONS.md to be swept. In the cleanup arc, record the guard's law as a rule on spec:protocol.self-hosting (or on spec:protocol.delivery-record-cleanup's design) before plans/ goes.
- **Failure scenario:** A session adds a dated 'ratified 2026-…' note to a registry row and `check:temporal` passes it, contrary to the guard's own rule that durable artifacts carry current truth.
- **Verifier (GPT):** The exemption's dated-diary justification is stale, and the active registry can bypass the guard. The separate assertion that the guard's law is uncarried is too broad because its script and tests preserve it; the actionable defect is the obsolete exclusion.

#### L1-05: Invalid altitude still receives readiness-floor evaluation

- **Severity:** low (reader rated medium; the verifier adjusted it)
- **Location:** src/validate/readiness-floor.ts:631
- **Claim:** spec:validation.claim-separation states that an unratified descriptor produces a conformance error and no readiness floor is evaluated over it (specs/validation/claim-separation.sdp.md:19). The evaluator guards kind and rung but omits altitude.
- **Evidence:** A synthetic Primitive with kind rule, altitude planet, readiness ready, outcome and rules, but no relations, produced both conformance/claim-separation for altitude and honesty/readiness-floor for at-least-one-relation. createReader also derived readiness idea for it. test/validators.test.ts:805 includes an invalid-altitude node, but its no-floor assertion explicitly selects only the invalid-kind and invalid-readiness nodes.
- **Proposed change:** Include altitude validity in the guard before floor evaluation and derived-readiness computation. Extend the existing invalid-descriptor test to assert that an invalid-altitude node receives no floor evaluation or derived rung.
- **Failure scenario:** A caller supplies an off-contract graph through the public validation/reader seam and receives readiness conclusions for a Spec whose descriptors the Protocol has rejected.
- **Verifier (Claude):** claim-separation's rule says no readiness floor is evaluated over any unratified descriptor, but evaluateReadinessFloor (src/validate/readiness-floor.ts:631) guards only kind and rung. The existing test (test/validators.test.ts:842-848) checks no-floor only for the bogus kind and bogus readiness nodes. Downgraded to low: only foreign graph data reaches it, and the claim-separation error already fails validateGraph closed.

#### L2-5: `sdp studio --help` claims every path inside generated/ is refused; only build-owned paths are

- **Severity:** low
- **Location:** src/cli/help.ts:75
- **Claim:** The help says "Keep the base outside <root>/generated/; paths resolving inside it are refused." spec:consumers.spec-studio.data.inputs rule 3 refuses only "an input path that the build could write or remove", and the code follows the Spec: `--base generated/mybase.json` is accepted. The help text overstates the refusal.
- **Evidence:** In a copy of examples/checkout-v1, `sdp studio . --base generated/mybase.json` prints `Wrote …/generated/spec-studio (33 files)` and exits 0, while `sdp studio . --base generated/graph.json` refuses with `--base "generated/graph.json" is inside generated output or another path the build writes or removes`.
- **Proposed change:** Replace the help line with: "Keep the base outside the paths the build writes or removes, such as <root>/generated/graph.json and the projection roots; such paths are refused." Alternatively, if the owner prefers the broader rule, change data.inputs rule 3 and the code together.
- **Failure scenario:** A user or agent trusts the help and treats generated/ as a refused zone, or relies on a refusal that never comes for, say, a base kept at generated/base.json. Help and Spec disagree, and the command-line Spec makes the help the verb's contract text.
- **Verifier (GPT):** The help promises a broader refusal than the Spec and implementation provide. Change src/cli/help.ts:75 to describe build-owned paths and projection roots.

#### L3-03: The ASCII trim regex is quadratic on long whitespace runs inside Markdown prose lines

- **Severity:** low
- **Location:** src/extract/markdown-body-content.ts:42,52 (ASCII_TRIM in normalizeProse); src/extract/markdown-body.ts:45 (asciiTrim); src/extract/markdown-pack.ts:40,54
- **Claim:** `/^[\t ]+|[\t ]+$/gu` backtracks quadratically: for each start position in an interior run of spaces, `[\t ]+$` consumes the run and then fails on the next non-space character. normalizeProse applies it to every narrative and description line of every Markdown carrier, so one long interior whitespace run makes extraction quadratic in the line's length.
- **Evidence:** Regex alone: `"a"+" ".repeat(10000)+"b"` takes 158 ms and the 40000-space version 2501 ms (4x length, about 16x time). End to end: a carrier whose narrative line is `word` + 60000 spaces + `word` takes `real 0m5.875s` under `sdp validate`, against `real 0m0.259s` for the same carrier with one space.
- **Proposed change:** Replace the regex trims with a linear helper shared by the three files: `export function asciiTrim(text: string): string { let start = 0; let end = text.length; while (start < end && (text[start] === " " || text[start] === "\t")) start += 1; while (end > start && (text[end - 1] === " " || text[end - 1] === "\t")) end -= 1; return text.slice(start, end); }`. Use it in normalizeProse, markdown-body.ts asciiTrim and the two markdown-pack.ts call sites.
- **Failure scenario:** A generated or pasted carrier line with a long run of interior padding, such as a converted table or ASCII art in prose, stalls `sdp validate --watch`, `sdp q` and the projections for seconds to minutes on every run.
- **Verifier (GPT):** The quadratic cost reproduces through valid Markdown carrier reification, not merely the isolated regex. Replace the affected trims with a shared linear ASCII-trimming helper.

#### L4-03: Option values bypass the dedicated CLI test pass

- **Severity:** low (reader rated medium; the verifier adjusted it)
- **Location:** vitest-test.mjs:19-48,130-131
- **Claim:** Every argument not beginning with '-' is treated as a test-file filter, including values belonging to options. This bypasses both contract selection and the isolation reserved for test/cli.test.ts.
- **Evidence:** Executed the wrapper in memory with spawnSync intercepted. With no arguments it spawned a pooled run excluding test/cli.test.ts, followed by the dedicated CLI run. With ['--reporter','verbose'] it spawned only ['--run','--reporter','verbose']; with ['--maxWorkers','1'] it likewise spawned one unrestricted pooled run.
- **Proposed change:** Parse positional file filters separately from option values using an argument parser that understands the supported Vitest options. Preserve the dedicated CLI pass when options are supplied without file filters, and test these command-line forms.
- **Failure scenario:** npm test -- --reporter verbose includes the root-mutating CLI suite in the ordinary worker pool, allowing it to regenerate shared contracts and projections while other suites consume them. Missing-contract preflight can also be skipped.
- **Verifier (Claude):** vitest-test.mjs:19 treats every argument without a leading '-' as a file filter, so the value of `--reporter verbose` becomes a filter. That takes the branch at :130-131: one pooled run that does not exclude test/cli.test.ts, with zero contract rows checked. I lowered severity to low: this is a contributor test harness, not a shipped surface. The `--reporter=verbose` form works, and runPooledVitest's fingerprint guard (:112-123) fails the run loudly if generated/ changes, so the race is never silent.

### Test findings (2)

Places where a test would pass with the behavior it guards broken.

#### L5-01: Markdown body grammar's verifier bindings omit the star-bullet regression tests

- **Severity:** medium
- **Location:** test/markdown-reifier.test.ts:91; test/markdown-reifier.test.ts:1004; src/extract/markdown-body-content.ts:64
- **Claim:** The ready, implemented spec:carrier.markdown-body-grammar refuses star bullets in narrative and section prose, but its resolving verifier files remain green when that refusal is removed. Existing tests enforce the guarantee without binding to this Spec.
- **Evidence:** Intended truth: specs/carrier/markdown-body-grammar.sdp.md:34–35. Recipes 3 and 30 returned 325 dependents and verifier files test/self-hosting-markdown-grammar.test.ts and test/self-hosting-validators.test.ts. Exact applied diff at src/extract/markdown-body-content.ts:64: - /^(?:[\*+][\t ]|\d+[.)][\t ]|-[\t]|<)/u.test(text) || + /^(?:[+][\t ]|\d+[.)][\t ]|-[\t]|<)/u.test(text) || With this mutation, npx vitest run test/self-hosting-markdown-grammar.test.ts test/self-hosting-validators.test.ts returned exit 0, 50 passed. Running npx vitest run test/markdown-reifier.test.ts against the same mutation failed three star-bullet cases, with 114 passing. The unmutated regression file passed all 117 tests.
- **Proposed change:** Add a specTest anchor beside the body-grammar regression table in test/markdown-reifier.test.ts, with verifies: ref("spec:carrier.markdown-body-grammar"), so graph-derived verifier selection includes the existing assertions.
- **Failure scenario:** An agent selects tests through this Spec's verifier bindings after changing Markdown parsing. Star bullets become accepted as prose while every selected test passes; the complete regression suite would catch it.
- **Verifier (Claude):** Reproduced. The Spec's [#oneLineEntries] and [#blockShapes] rules refuse star bullets, and none of the 15 bound examples uses one: the constructs are a table row, ordered list, plain bullet, and so on. The mutant survives every bound verifier and is caught only by unbound tests in markdown-reifier.test.ts. The proposed specTest anchor (the same mechanism test/census.test.ts uses) works as a fix. Another option is an executable example such as markdown-body-grammar.star-bullet-refused that exercises blockShapes.

#### L5-02: Anchor-model verifier bindings omit structural refusal evidence

- **Severity:** medium
- **Location:** test/structural-anchors.test.ts:459; test/self-hosting-model.test.ts:292; src/extract/anchors.ts:518
- **Claim:** The ready, implemented spec:model.anchors forbids the same target in satisfies and references. Its resolving verifier examples exercise builder trust only, so disabling the extraction refusal survives all bound tests.
- **Evidence:** Intended truth: specs/model/anchors.sdp.md:27. Recipes 3 and 30 returned 417 dependents and only test/self-hosting-model.test.ts as the resolving verifier file. Exact applied diff at src/extract/anchors.ts:518: - if (satisfies.has(target)) { + if (false && satisfies.has(target)) { With this mutation, npx vitest run test/self-hosting-model.test.ts returned exit 0, 5 passed. Running npx vitest run test/structural-anchors.test.ts against the same mutation failed 'refuses a repeated references target and the satisfies overlap at reification', with 16 passing. The unmutated structural suite passed all 17 tests.
- **Proposed change:** Add a specTest anchor beside the structural-anchor regression suite with verifies: ref("spec:model.anchors"), retaining its existing assertion that an overlapping anchor is absent from the extracted graph.
- **Failure scenario:** Graph-selected verification of an anchor-extraction change passes even though a contradictory anchor is now minted. The downstream graph validator still diagnoses the overlap, but extraction-time refusal has regressed; the existing unbound structural test detects it.
- **Verifier (Claude):** Confirmed, with one correction. The single mutation only moves the refusal from reification to src/validate/validators.ts:688, which still raises the error the Spec guarantees ('a target also named in satisfies is an error', anchors.sdp.md:27). So 'extraction-time refusal has regressed' is not, by itself, a Spec violation. The stronger mutant disables both checks and still passes all 5 tests in the only bound file. That means the guaranteed error can vanish with every bound test green, while structural-anchors.test.ts:355 and :459 would catch it. The proposed specTest anchor (verifies: ref("spec:model.anchors")) on those tests is the right fix.

### Docs findings (12)

Statements in live documentation that the tree contradicts.

#### D1: Concept documents contradict ready, implemented Specs

- **Severity:** medium
- **Location:** docs/concept/06-consumers-and-projections.md:13,58; docs/concept/00-vision-scope-and-mvp-boundary.md:80,82; docs/concept/01-founding-principles-and-invariants.md:119,126,133; docs/concept/04-authoring-and-binding.md:87
- **Claim:** The surviving concept documents describe as unbuilt or aspirational surfaces the graph shows as ready and implemented. 06:13 lists the Spec Studio under 'Surfaces designed and not built'. 06:58 calls the Capability Map 'designed-for, unbuilt'. 00:80 and 01:133 list architecture enforcement as deferred or aspirational. 01:119 lists HTML and Web Components as aspirational. 00:82 says 'The CLI is `sdp build` · `validate` · `view` · `census` · `mermaid` · `gherkin` · `import` · `new spec` · `q`', omitting studio, stamp, vault and generate. 01:126 and 04:87 call 'one runtime truth' the only Principle in this area, while spec:model.planned-architecture makes keeping one composition mechanism a corpus's own architecture rule. Under the drift rule the Specs are intended truth, so the concept text is the stale side.
- **Evidence:** `sdp q` delivery facts: spec:consumers.spec-studio ready implemented,has-verifier; spec:consumers.capability-map ready implemented,has-verifier; spec:validation.architecture-constraints ready implemented,has-verifier. `node dist/cli/sdp.js --help` lists studio, stamp, vault and generate. specs/model/planned-architecture.sdp.md:21: "Keeping one composition mechanism per application is a corpus's own architecture rule when the corpus wants it".
- **Proposed change:** 06:13 → move the Studio to §1's built list: "the Spec Studio (`spec:consumers.spec-studio`), derived HTML (MD-41) from custom elements (MD-42)"; keep the reference projection and MCP as not built. 06:58 → "(+ the Capability Map, recipe 52, `spec:consumers.capability-map`)". 00:80 table row → "Architecture rules are a corpus's own rules over the shipped walk (`spec:validation.architecture-constraints`, recipe 42); the Protocol's validators judge no architecture." Drop it from 01:133. 01:119 → status CORE, pointing to MD-41 and MD-42. 00:82 → use the verb list from `sdp --help`. 01:126 and 04:87 → "Keeping one composition mechanism is a corpus's own architecture rule (`spec:model.planned-architecture`); which mechanism is a Representation."
- **Failure scenario:** A reader evaluating the Protocol from the concept set, which the README offers as the evaluation path, concludes the Studio, capability map and architecture walk do not exist. They miss four CLI verbs, and they treat one runtime truth as Protocol law.
- **Verifier (GPT):** The explicit unbuilt statements, incomplete current CLI list and universal one-composition principle are stale. Qualify the proposed repair: CORE/ASPIRATIONAL also describes the historical MVP boundary, so later implementation alone does not justify relabeling every row CORE.

#### L6-1: AGENTS.md claims check:self-hosting emits pinned conformance/prose-mentions warnings; none exist and the oracle pins their absence

- **Severity:** medium
- **Location:** AGENTS.md:296-299
- **Claim:** AGENTS.md says the check:self-hosting step emits two kinds of intentional warning, honesty/gaps and conformance/prose-mentions, and that the self-hosting oracle pins both sets. The current graph emits only three honesty/gaps warnings. The oracle pins zero prose-mention warnings.
- **Evidence:** `sdp q 'return report.findings.map(f=>f.validatorId+" "+f.subjectId)'` returns only ["honesty/gaps spec:extraction.executable-examples", "honesty/gaps spec:model.spec-sections", "honesty/gaps spec:protocol.role-vocabulary"]. Recipe 22 totals: {pairs:129, backed:99, unbacked:0, reverseOnly:30}. test/self-hosting-oracle/index.ts:52 reads "No intended prose-mention pair is left without a declared relation", and expectedWarnings holds only the three gap() rows. test/self-hosting-graph.test.ts:343 is titled "reports exactly the retained verifier gaps and no unbacked prose mention".
- **Proposed change:** Replace AGENTS.md:296-299 with: "The `check:self-hosting` step emits one kind of intentional warning: `honesty/gaps`, one per owner-ratified ready non-decision Spec without a resolving verifier binding. The self-hosting oracle pins that set and pins that no `conformance/prose-mentions` warning remains (recipe 22's `unbacked` is empty). Any other warning is a regression."
- **Failure scenario:** A session sees a new conformance/prose-mentions warning and reads it as expected under AGENTS.md. In fact it is a regression the oracle fails on. Or a session wastes time looking for pinned pairs that do not exist.
- **Verifier (GPT):** Docs: AGENTS describes prose-mention warnings as expected, but the oracle requires their absence. Correct the documented baseline to retained honesty gaps and zero unbacked prose mentions.

#### L6-2: Concept doc 06 calls the Studio, the Capability Map and roadmap views unbuilt or deferred

- **Severity:** medium
- **Location:** docs/concept/06-consumers-and-projections.md:13, :54, :58, :63
- **Claim:** 06 §1 lists the Spec Studio under "Surfaces designed and not built". §6 calls the Capability Map "a designed-for, unbuilt Capability Map projection". §6 says release, baseline, phase, iteration and milestone are all "optional roadmap views, deferred", and maps Project Management to "the deferred roadmap views". The Specs say the Studio, the capability map and the roadmap reading are ready and realized, and only release and baseline views remain deferred. 06 is the stale side.
- **Evidence:** Graph: spec:consumers.spec-studio, spec:consumers.capability-map and spec:consumers.roadmap all state ready with deliveryFacts [implemented, has-verifier]; `sdp studio` is a shipped verb; recipes 52 and 53 ship. The narrative of spec:consumers.projections-model.roadmap-views reads: "the roadmap reading answers it ... Release and baseline views still wait for a reader of their own." Its Model term says phase / iteration / milestone are "Descriptive words a roadmap's framing may use, never an entry field". CONTEXT.md:240 already says "roadmap readings are built, release and baseline views remain deferred".
- **Proposed change:** 06:13: move the Studio out of the unbuilt bullet. Add a bullet: "**The Spec Studio** — `spec:consumers.spec-studio`: static derived HTML (MD-41) from custom elements (MD-42), published by `sdp studio`, with per-pull-request previews in `spec:consumers.spec-studio.sharing`." Rename the remaining bullet "Surfaces designed and not built — the reference projection ... and the MCP surface ...". 06:54: replace "release, baseline, phase, iteration and milestone are optional roadmap views, deferred until a reader needs them" with "the roadmap reading is built (`spec:consumers.roadmap`); release and baseline views wait for a reader (`spec:consumers.projections-model.roadmap-views`), and phase, iteration and milestone stay descriptive words". 06:58: replace with "(+ the Capability Map, `spec:consumers.capability-map`)". 06:63: replace with "Packs (+ the roadmap, `spec:consumers.roadmap`; release and baseline views deferred)".
- **Failure scenario:** A reader following AGENTS.md's "Where to look" into docs/concept concludes that the Studio, capability map and roadmap are unbuilt. They then propose designing surfaces that already ship, or they skip them.
- **Verifier (GPT):** Docs: Concept 06 is stale against the carrying Specs and realized surfaces. Describe the Studio, Capability Map and roadmap as built, while retaining the release/baseline deferral.

#### L2-6: Catalog's list of recipes that report an absent Pack in diagnostics is incomplete

- **Severity:** low
- **Location:** docs/agent-surface/recipes.md:120-121
- **Claim:** The catalog says "Most use `found: false`; the design diff, context bundle, perspective filter and key-family register report an absent Pack in `diagnostics`." Recipes 44, 48, 51, 53, 54 and 55 also report an absent Pack in diagnostics. That makes ten recipes reporting an absent subject in diagnostics against ten using found: false, so "most" is inaccurate and the list misses six.
- **Evidence:** A body calling recipes(n, {pack:"pack:nope"}) returns found:false for 5, 27, 29, 34 and 39 (plus 3, 9, 14, 19 and 21 for spec or component subjects). It returns diagnostics for 35, 36, 37, 41, 44 (`Pack not found`), 48 (`Expected a resolving Pack id.`), 51 (`Expected a Pack id that resolves.`), 53 and 55 (`Expected the id of a Pack in this graph.`) and 54 (`Pack does not resolve.`).
- **Proposed change:** Replace with: "Recipes 3, 5, 9, 14, 19, 21, 27, 29, 34 and 39 report an absent subject as `found: false`; the design diff, context bundle, perspective filter, key-family register, example-space coverage, rule-key proposal, entry citations, the roadmap, the design slice and the roadmap memo (recipes 35, 36, 37, 41, 44, 48, 51, 53, 54 and 55) report an absent Pack in `diagnostics`."
- **Failure scenario:** An agent following the catalog checks `found === false` on recipe 53, 54 or 51, never sees it, and reads the diagnostics-only answer as an empty result.
- **Verifier (GPT):** The catalog's general guidance omits six diagnostics-based absent-Pack answers and incorrectly describes found:false as the majority among the cited subject recipes. Replace it with the explicit recipe lists or direct callers to each documented result shape.

#### L6-4: DECISIONS.md breaks its own rule that the narrowed row names its narrowers (MD-33, MD-25, MD-27)

- **Severity:** low
- **Location:** docs/concept/DECISIONS.md:7, :36, :38, :44
- **Claim:** The registry preamble says "A decision that narrows one part of another refines it, and the narrowed row names it." MD-32 and MD-42 follow the rule with "narrowed by" links. MD-33's row names neither of its two narrowers, MD-46 and MD-47, although both relation reasons say "narrows". MD-25's row does not name MD-46, which opens its manifest envelope. MD-27's row names MD-28 but omits MD-29.
- **Evidence:** Recipe 31 shows refinedBy for spec:decisions.planning-truths-placement = [roadmap-over-plans, roadmap-priority], with reasons "narrows what a plan file may still carry once a roadmap holds priority" and "narrows the refusal of recorded work order for one case". It shows refinedBy for pack-markdown-carrier = [roadmap-priority], with reason "opens the closed Pack manifest envelope to one optional field". It shows refinedBy for gherkin-carrier-option = [carrier-universality, sdp-gherkin-extension]. DECISIONS.md:44 (MD-33), :36 (MD-25) and :38 (MD-27, gloss mentions MD-28 only) carry no matching names.
- **Proposed change:** Append to the pointer column: - MD-33: "; narrowed by [Spec](../../specs/decisions/roadmap-priority.sdp.md) (`spec:decisions.roadmap-priority`) and [Spec](../../specs/decisions/roadmap-over-plans.sdp.md) (`spec:decisions.roadmap-over-plans`)". - MD-25: "; narrowed by [Spec](../../specs/decisions/roadmap-priority.sdp.md) (`spec:decisions.roadmap-priority`)". - MD-27: "; narrowed by [Spec](../../specs/decisions/sdp-gherkin-extension.sdp.md) (`spec:decisions.sdp-gherkin-extension`) and [Spec](../../specs/decisions/carrier-universality.sdp.md) (`spec:decisions.carrier-universality`)". - Optionally move MD-18's gloss mentions of MD-25 and MD-27 into the same "narrowed by" form.
- **Failure scenario:** A reader resolving MD-33 by name reads its refusal as whole law. They miss that MD-46 and MD-47 narrow it for roadmap priority and plan files. They then treat a roadmap's order as a forbidden recorded work order.
- **Verifier (GPT):** Docs: The narrowed registry rows omit narrowers required by their own preamble. Add the missing forward pointers; MD-27 already mentions MD-28 in its gloss, so only MD-29 is missing there.

#### L6-5: Concept doc 00 lists a nine-verb CLI and calls the intent-composition UI aspirational

- **Severity:** low
- **Location:** docs/concept/00-vision-scope-and-mvp-boundary.md:31, :82
- **Claim:** 00 §4's "Full CLI" row says in the present tense: "The CLI is `sdp build` · `validate` · `view` · `census` · `mermaid` · `gherkin` · `import` · `new spec` · `q`". It omits studio, vault, stamp and generate. §2 says "the richer intent-composition UI is aspirational". The Studio's composing panel is ready and implemented.
- **Evidence:** `node dist/cli/sdp.js --help` lists build, validate, view, census, mermaid, gherkin, studio, stamp, vault, generate, import, new spec and q. AGENTS.md lists the same thirteen. Graph: spec:consumers.spec-studio.intent-panel is ready with [implemented, has-verifier].
- **Proposed change:** 00:82: replace the list with "The CLI is `sdp build` · `validate` · `view` · `census` · `mermaid` · `gherkin` · `studio` · `stamp` · `vault` · `generate` · `import` · `new spec` · `q`". Alternatively, scope the sentence to the MVP: "The MVP's CLI was …; the current surface is in `sdp --help`". 00:31: replace "the richer intent-composition UI is aspirational" with "the Studio's composing panel hands intent off as a change proposal, `spec:consumers.spec-studio.intent-panel`".
- **Failure scenario:** A reader of the vision doc enumerates the CLI from it and misses four shipped verbs. Or they believe no intent-composition UI exists.
- **Verifier (GPT):** Docs: Despite its MVP framing, the document presents an incomplete current CLI list and an obsolete intent-panel deferral. Update those statements or explicitly label them historical.

#### L6-6: The sdp-agent-surface skill calls specContext and packContext entry adapters, against spec:consumers.agent-surface

- **Severity:** low
- **Location:** .agents/skills/sdp-agent-surface/SKILL.md:202-215, :346-347
- **Claim:** The section headed "The entry adapters" documents g.specContext and g.packContext, and omits findByConcept. spec:consumers.agent-surface#rule.entryAdapters says the entry adapters are findByConcept, byFile and blastRadius. specContext and packContext are joins frozen into the reader. Line 346 says "Everything past the frozen entry adapters (findByConcept · byFile · blastRadius) is a recipe", which the same section contradicts by teaching three non-recipe reader joins.
- **Evidence:** Section heading at SKILL.md:202 is "## The entry adapters", and its first sentence describes `g.specContext(id)`. specs/consumers/agent-surface.sdp.md rule [#entryAdapters]: "The string entry is `findByConcept`, the file entry is `byFile`, and the changeset entry is `blastRadius`". The reader keys include specContext, packContext and resolveEntryAddress.
- **Proposed change:** Rename the heading to "## Entry adapters and reader joins". Open the section with: "The entry adapters are `g.findByConcept(term)`, `g.byFile(path)` and `g.blastRadius(files)`. `g.specContext(id)`, `g.packContext(id)` and `g.resolveEntryAddress(address)` are joins frozen into the reader at the second-caller bar." At :346 write: "Everything past the entry adapters and the reader's frozen joins is a recipe."
- **Failure scenario:** An agent reads specContext as a demand-map entry and builds lookups by id. The demand map says agents arrive without the id. Or the agent concludes that any non-adapter reader method must be a recipe.
- **Verifier (GPT):** Docs: The heading incorrectly groups context joins under entry adapters and omits the string adapter. Rename and distinguish them; the alleged absolute recipe prohibition is overstated because the following sentence explicitly permits frozen joins.

#### L9-F1: Worked-example README reports a stale build summary and Pack count

- **Severity:** low (reader rated medium; the verifier adjusted it)
- **Location:** examples/checkout-v1/README.md:3 and :62 (tree b5e0a8be)
- **Claim:** The walkthrough says the example has one Pack and that `build` prints `11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges`. Since the roadmap Pack was added, the example has two Packs and 18 nodes and 34 edges. The same README links that roadmap Pack at line 144, so the file contradicts itself, and article 03 at 230b0d28 prints the correct line.
- **Evidence:** `node dist/cli/sdp.js build <copy of examples/checkout-v1>` prints `11 specs · 2 packs · 5 anchors → 18 nodes · 34 edges (0 errors, 0 warnings)`. README:3 reads "eleven `Spec`s, one `Pack`, five anchors". README:62 reads `11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)`. `git log -1 -- examples/checkout-v1/specs/roadmap.pack.sdp.md` shows it arrived with 46a6440b. No test pins this README line: grep for '17 nodes' outside plans/ only hits this README.
- **Proposed change:** README:3 → "modeled as `pack:checkout-v1` — eleven `Spec`s, two `Pack`s (the checkout Pack and a worked roadmap, `pack:checkout-roadmap`), five anchors." README:62 → `11 specs · 2 packs · 5 anchors → 18 nodes · 34 edges (0 errors, 0 warnings)`. Optionally pin the line with a test, or generate it the way docs/articles/sync-evidence.mjs `exampleBuild()` does, so it cannot go stale silently.
- **Failure scenario:** A newcomer runs step one of the walkthrough, sees different numbers from the ones documented, and cannot tell whether the install or the example is broken.
- **Verifier (GPT):** The documented counts are stale; replace them with two Packs, 18 nodes and 34 edges. Downgraded because this is a minor walkthrough inconsistency and does not prevent execution.

#### L9-F4: The JS-A1 job sentence contradicts its own acceptance criteria and the CLI

- **Severity:** low
- **Location:** jtbd-stories/01-capture-and-evolve-intent.md:13 (vs :18 AC1)
- **Claim:** The job says capture needs "only an `id`, a `title`, and a sentence of intent". AC1 in the same story, the carrier, and `sdp new spec` all also require `kind` and `altitude`.
- **Evidence:** `node dist/cli/sdp.js new spec specs/orders/x.sdp.md --id spec:orders.x --title X --outcome "Do X"` → `sdp new spec: --kind is required.` (exit 1). AC1 reads: "with only `id`, `title`, `kind`, `altitude`, and either `intent.outcome` or a parent relation".
- **Proposed change:** Line 13 → "**I want to** record it as a spec in seconds with only an `id`, a `title`, its `kind` and `altitude`, and a sentence of intent (or a parent relation), **so I can** …"
- **Failure scenario:** A newcomer tries the "zero ceremony" capture the job promises and hits a required-flag error.
- **Verifier (GPT):** The job sentence omits required descriptors that its own acceptance criterion includes. Add kind and altitude, and acknowledge the outcome-or-parent alternative.

#### L9-F5: README opens on insider jargon and uses an undefined "Studio phase 1"

- **Severity:** low
- **Location:** README.md:7-9 and :148 (tree b5e0a8be)
- **Claim:** Line 7, the first thing after the one-sentence definition, is a "Carrier rule" ("lawful per-ID option", three decision names) given before the reader learns what a carrier, Spec or Pack is. Line 148 says "The Studio's phase 1 adds …", relative to a phase 0 the README never defines. The term appears nowhere in the graph or the skills, and the list names two of the five lenses.
- **Evidence:** Recipe 6 with `{"term":"phase 1"}` returns `total: 0`. `grep -n "phase 1" README.md CONTEXT.md .agents/skills/sdp-studio/SKILL.md` matches only README.md:148. The Studio page set has five lens pages: index (Packs), capabilities, architecture, tests and evidence. The articles playbook (230b0d28 README:245) itself warns against saying "phase 0" from memory.
- **Proposed change:** README:148 → "The Studio is a static page set: five lenses (Packs, capabilities, architecture, tests and evidence), static SVG diagrams, every Spec-page panel, registers, the owner queue, the roadmap and a glossary." Move the "Carrier rule" paragraph below the quick start under a "Carriers" heading. In its place, add one plain sentence such as "You write Specs as Markdown files (`*.sdp.md`); `sdp` derives a graph from them and from anchors in your code, then checks it."
- **Failure scenario:** An outsider cannot tell which Studio is being described, and the first screen of the README reads as a ruling rather than an introduction.
- **Verifier (GPT):** The unexplained Studio milestone and front-loaded carrier terminology are valid newcomer clarity issues. Replace 'phase 1' with current capabilities; mentioning two added lenses does not itself claim an exhaustive lens list.

#### L9-F6: Article evidence generator labels any warning as intentional, and some counts sit outside checked blocks

- **Severity:** low
- **Location:** docs/articles/sync-evidence.mjs:141-158; docs/articles/01-the-spec-is-the-prompt-is-the-design.md:140; docs/articles/03-walkthrough-intent-to-verified-code.md:26; docs/articles/README.md:243,247 (all at 230b0d28)
- **Claim:** `baselineMetrics()` parses only the warning total from `sdp validate` and renders it as "N intentional `honesty/gaps` warnings" without checking which validators produced them. A new warning class would be published as intentional, and `--check` would pass as long as the total matched. Several counts the articles state are also hand-written outside the marked blocks, so `--check` cannot catch them going stale: article 01:140 ("3 intentional honesty/gaps warnings"), article 03:26 ("11 Specs, two Packs and five anchors") and the playbook's "55 and five" and "18 nodes and 34 edges".
- **Evidence:** sync-evidence.mjs:142 `const validationMatch = validation.match(/validate: (\d+) errors · (\d+) warnings/);` and :158 `| Validation | ${validationMatch[1]} errors and ${validationMatch[2]} intentional \`honesty/gaps\` warnings |`. These values are correct today: `report.findings.map(f=>f.validatorId)`returns three`honesty/gaps`(executable-examples, spec-sections, role-vocabulary). Article 01 line 140 follows the closing`<!-- /evidence:self-hosting-census -->` at line 138.
- **Proposed change:** In baselineMetrics, read `report.findings` through `query()`, group by `validatorId`, render each group, and throw if any warning's validatorId is not `honesty/gaps`. Move the article 01:140 sentence, the article 03:26 counts and the playbook's recipe, skill and example counts into marked evidence blocks with generators.
- **Failure scenario:** A later pin adds a conformance warning. The refresh regenerates "4 intentional honesty/gaps warnings", which is a false honesty statement, and the hand-written prose counts drift unnoticed.
- **Verifier (GPT):** The generator classifies warnings using only their total; inspect validator IDs before labeling them intentional honesty/gaps. The handwritten counts are a refresh risk, not currently false measurements, and the playbook explicitly requests manual recounting.

#### L9-F7: The documented Node floor ("20 or later") is below what the dev toolchain declares

- **Severity:** low
- **Location:** package.json:57-59 (engines); docs/articles/01-the-spec-is-the-prompt-is-the-design.md:158 at 230b0d28; .github/workflows/ci.yml:18
- **Claim:** The article's try-it and the engines field say Node 20 or later. The walkthrough's test step (`npx vitest`, README example and article 03) runs Vite 8 and rolldown, which declare `^20.19.0 || >=22.12.0`. CI pins `node-version: 20`, which resolves to the newest 20.x, so the floor is never tested.
- **Evidence:** node_modules/vite/package.json engines `{"node":"^20.19.0 || >=22.12.0"}` (vite 8.1.5); node_modules/rolldown/package.json engines the same (1.1.5); package.json engines `{"node":">=20"}`. I did not run on Node < 20.19: the evidence is the declared engines.
- **Proposed change:** State the contributor floor where the tests run: "Node 20.19 or later (22.12 or later on Node 22)" in the article 01 try-it, the examples README and the root README source-checkout section. Keep engines `>=20` if the installed CLI really supports it, or raise it to `^20.19.0 || >=22.12.0`.
- **Failure scenario:** A newcomer on Node 20.10 builds the CLI fine, then reaches the bound-test step of the walkthrough and gets an engine or runtime failure from Vite.
- **Verifier (GPT):** The source-development instructions understate the installed test toolchain's declared Node requirements. Document the contributor floor separately; this evidence does not establish that the installed CLI's runtime engines field must change.

### Design findings (2)

Open design questions for the owner; `open-questions.md` drafts each one.

#### L3-02: Discovery silently skips symlinked carriers and directories; validate exits 0

- **Severity:** medium
- **Location:** src/extract/discover.ts:130-143 (walkDirectory: `entry.isDirectory()` / `entry.isFile()` on Dirent); the canonicalDiscovery rule of spec:extraction.excludes
- **Claim:** `readdirSync(…, { withFileTypes: true })` returns Dirents whose isFile() and isDirectory() are false for symbolic links, so walkDirectory drops a symlinked `.sdp.md` or `.ts` file, or a symlinked directory of carriers, without a finding. The ready rule `spec:extraction.excludes#canonicalDiscovery` lists every skip discovery makes (node_modules, dist, generated, coverage, dot-directories, configured exclusions) and says nothing about symlinks, so the code has an unstated, silent exclusion. The watch path (src/cli/validate-watch.ts:378) refuses to follow symlinks on purpose, so not following may well be the intent. The defect is that the drop is silent and the Spec does not say it, against the 'never silently dropped' discipline the extractor otherwise keeps (unrecognized-property, coverageUnknown).
- **Evidence:** probe8: root/specs → symlink to a directory holding a valid s.sdp.md. `node dist/cli/sdp.js validate probe8/root` prints `note: no *.sdp.ts, *.sdp.md, or *.sdp.gherkin spec files found … the authored model is empty`, `0 specs`, `validate: 0 errors · 0 warnings`, exit=0. probe1: specs/link.sdp.md → symlink to elsewhere/a.sdp.md (spec:demo.a) beside real/b.sdp.md, which refines spec:demo.a. Validate counts `1 specs`, and the only trace of the lost carrier is the dangling-reference error on b. With nothing pointing at the symlinked Spec, it vanishes with no output at all. `grep -rn symlink specs/extraction` finds nothing.
- **Proposed change:** Owner decision: follow, refuse or name. Recommended: keep not following (consistent with watch), but make it loud and stated. (a) Append to the canonicalDiscovery rule in specs/extraction/excludes.sdp.md: 'Discovery never follows a symbolic link; each symbolic link it meets, outside an excluded path and the skipped directories, is named in a warning and read as neither a carrier nor a directory.' (b) In walkDirectory, `if (entry.isSymbolicLink()) { state.skippedLinks.push(relativePath); continue; }`, and have extract() emit one `extract/symbolic-link-skipped` warning per path. Add a fixture with a symlinked carrier.
- **Failure scenario:** A monorepo shares a spec folder through `specs -> ../shared/specs`, or links one carrier into two packages. Every Spec behind the link drops out of the graph, recipes 1, 8 and 53 answer over the reduced corpus, and CI stays green.
- **Verifier (GPT):** Silent omission is real, and canonicalDiscovery leaves symlink handling unstated. Confirmed as a design gap: the owner should state the policy before implementing following, refusal or diagnosed skipping.

#### L9-F3: JS-F1 requires a token-budgeted scope preview in the view, and no Spec carries it

- **Severity:** medium
- **Location:** jtbd-stories/06-edit-through-the-lens.md:13, acceptance criteria 1 and 7
- **Claim:** JS-F1 says the view hands the agent "a clean, token-budgeted prompt". It also says "the scope preview shows what the agent will be given (the in-context specs/relations and the token budget)". The composing-panel Specs, all stated ready and some implemented, say nothing about a budget. The only budgeted reading in the graph is the context bundle (recipe 36), which is an agent-side recipe, not the view. Either the job is stale or it is unserved.
- **Evidence:** `g.findByConcept("budget")` returns Primitive matches only in context-bundle, delivery-session-on-ramp, spec-studio.diagram-kinds and diagrams, and upgrade-kit, never intent-composition or spec-studio.intent-panel. Neither appears for "token". The intent-composition family and spec:consumers.spec-studio.intent-panel are all `ready` (the panel is `implemented,has-verifier`). Its intent outcome is "Give every surface that composes scoped intent one hand-off shape", with no budget.
- **Proposed change:** The owner decides which way to go. Either amend JS-F1 AC1 to "The view's only output is scoped intent: the user picks a scope … and states the change; the view composes the hand-off (intent composition) and writes nothing to the repo" and AC7 to "The hand-off names its scope so the human can tighten it; the agent reads that scope with a budgeted context bundle (recipe 36)". Or add an open question with a decider to spec:consumers.spec-studio.intent-panel asking whether the panel should show a budget.
- **Failure scenario:** A reader takes jtbd-stories as the functional spec, expects the Studio composing panel to show a token budget before hand-off, and finds none. Or a future agent implements a budget the ratified Specs never asked for.
- **Verifier (GPT):** The job promises a view-side token-budget preview that the current composing contracts do not carry. This is design/docs drift requiring owner resolution, not authority to add an implementation requirement silently.

### Record findings (11)

Durable content in the frozen records that nothing carries; `inventory.md` maps each piece to a home.

#### R1: Carrier ruling's grounds and rejected alternatives live only in plan 16

- **Severity:** medium
- **Location:** plans/16-carrier-ruling.md:32-56 (§2 grounds, kind-partitioned dual carrier declined) and :120-139 (§5 directions re-dismissed); spec:decisions.carrier-ruling
- **Claim:** spec:decisions.carrier-ruling has a one-line rationale and no `alternative:` entries. Plan 16 alone records why Markdown won, why each other direction was rejected, and the obligation the C2 parity note carried forward. C2's permanent owned surfaces (parser, formatter, highlighting, LSP) and the grammar-context tax on agents are recorded nowhere else. The rejected directions are pure-data carriers (YAML, JSON, TOML, CUE), embedded doctest-style Specs, other dialects (AsciiDoc, org-mode, Djot, Typst), notebooks, projection or structured editing as the authored surface, typed markup (TSX), and a permanent kind-partitioned dual carrier.
- **Evidence:** `grep -c alternative: specs/decisions/carrier-ruling.sdp.md` → 0 (21 other decision files have them). `grep -rn "AsciiDoc\|notebook\|ipynb\|CUE\|doctest\|TSX" specs` → no hits. Plan 16:124 "**Pure-data carriers** ... making the entire spec data kills prose; CUE is the exact C1 disease." check-self-hosting-gates.mjs:44 reads plan 16 as a frozen historical check.
- **Proposed change:** Add to spec:decisions.carrier-ruling `## Decision`: `- alternative: An owned grammar (C2): its parser, formatter, highlighting, rendering, editor integration and language server stay permanent owned surfaces, and every unfamiliar agent pays a grammar-context tax; its wins (differentiation, slightly less ceremony, diff and merge) do not price that out.`; `- alternative: A permanent kind-partitioned dual carrier: it doubles authoring docs, import paths and teaching for nothing the Markdown exhibit failed at; the per-ID option stays the escape hatch.`; `- alternative: Whole-Spec data (YAML, JSON, TOML, CUE): making the entire Spec data loses prose.`; `- alternative: Embedded in-source Specs: the embedding is refused; colocated placement stays open.`; `- alternative: Other document dialects (AsciiDoc, org-mode, Djot, Typst) and notebooks (.ipynb, MyST): each loses Markdown's agent emission register and renders-everywhere page, and notebooks are hostile to diffs and agents.`; `- alternative: Structured or projection editing, or typed markup (TSX), as the authored surface: it contradicts git as the event log; as-you-type envelope typing stays a projection-layer competency.`
- **Failure scenario:** The cleanup arc removes plans/. A later session proposes an AsciiDoc or notebook carrier or a kind-split carrier. Nothing in the graph says it was weighed and why it lost, so the competition gets re-run.
- **Verifier (GPT):** The detailed tooling-cost rationale and several rejected carrier directions lack graph homes. Narrow the finding: the owned-grammar and kind-split conclusions already survive in the decision, and parser parity is separately specified.

#### R4: The TypeScript carrier's static-data grammar has no carrier Spec

- **Severity:** medium
- **Location:** docs/concept/04-authoring-and-binding.md:37-50
- **Claim:** Only concept 04 §1 states what a `.sdp.ts` Spec file may contain: static, side-effect-free literals; no loops, conditionals, or computed or interpolated ids; no IO or async; no imports of product code; relation arguments as string-literal ids; and the designed-for `sdp/spec-static` lint. The carrier family has Specs for Markdown (spec:carrier.markdown-authoring, spec:carrier.envelope-contract, spec:carrier.markdown-body-grammar) and Gherkin, but none for the TypeScript carrier. spec:carrier.markdown-parser carries only the two-tier finding parity.
- **Evidence:** `ls specs/carrier | grep -i 'ts\|typescript'` → only markdown-pack-authoring.markdown-ts-parity and step-keys.typescript-keyed-step-imports-keyed. `grep -rn -i "statically\|static literal" specs` → no TS grammar rule. Concept 04:42: "no IO, async, or imports of _product_ code (only `@libar-dev/software-delivery-protocol` helpers)".
- **Proposed change:** Capture `spec:carrier.typescript-authoring` (carrier family, behavior, `defined` against the shipped extractor), mirroring spec:carrier.markdown-authoring, with the rules: a `.sdp.ts` Spec or Pack is static data that TypeScript validates; admitted are the package's builders over literal values only (no loops, conditionals, computed or interpolated ids, IO, async, or imports beyond the package); relation targets are string-literal ids; the envelope-hard and section-degrades tiers point to spec:carrier.markdown-parser. Add a non-blocking open question `staticLint` (decider owner) for the designed-for `sdp/spec-static` lint.
- **Failure scenario:** An adopter using the lawful per-ID TS option imports product code or computes an id. The only statement of what is admitted lives in a concept document slated for dissolution, and the CLI only reports a non-static finding after the fact.
- **Verifier (GPT):** The complete TypeScript authoring contract and deferred lint still lack a graph home. Existing Specs and tests carry portions, so the new carrier Spec should distinguish authoring restrictions from the extractor's warning-and-degradation behavior.

#### R5: Concept 00's permanent non-goals are mostly uncarried

- **Severity:** medium
- **Location:** docs/concept/00-vision-scope-and-mvp-boundary.md:88-96
- **Claim:** Three of the five permanent non-goals have no carrying Spec. Change approval lives in git and CI (pull request review, CODEOWNERS), with no embedded RBAC or governance engine. The Protocol is the membrane that links issue trackers, design tools, LikeC4 and OpenAPI, never their replacement. Authoring stays in code; the view is a lens and never a no-code editor. The other two are carried: decider authorizes nothing (spec:model.open-question-fields) and inference stays advisory (spec:extraction.claim-taxonomy).
- **Evidence:** Recipe 6 and recipe 23 on "RBAC", "membrane", "issue tracker", "LikeC4", "non-goal" → 0 matches each. `grep -rli "CODEOWNERS\|no-code\|membrane" specs` → none. spec:decisions.adopt-the-nouns covers only the state-machine refusal.
- **Proposed change:** Add to spec:decisions.executable-meta-model: `- consequence: Change approval stays in git and CI (pull request review, code owners); the Protocol embeds no access control or governance engine.` `- consequence: The Protocol links adjacent tools (issue trackers, design tools, architecture and API formats) rather than replacing them.` `- consequence: Authoring stays in carriers under git; a view is a lens and never an editor of canonical source.` Under MD-33, refusals belong on a decision Spec.
- **Failure scenario:** A future arc proposes an approval workflow or a replacement issue-tracker view inside the graph. No decision Spec records that the Protocol refused that scope, so the refusal has to be re-derived from a deleted document.
- **Verifier (GPT):** Confirmed for the explicit no-RBAC boundary and refusal to replace adjacent tools. The view-versus-canonical-source boundary is already carried and should not be duplicated as another missing non-goal.

#### R6: Deferred trajectory items in concept 00 have no graph home or trigger

- **Severity:** medium
- **Location:** docs/concept/00-vision-scope-and-mvp-boundary.md:27-38 and :71-82; docs/concept/01-founding-principles-and-invariants.md:124,133
- **Claim:** Concept 00 names these as designed-for and deferred, 'never forgotten': standards interop (ingesting dependency graphs, test messages and ADR Markdown; emitting LikeC4 and JSON-LD/PROV-O/SHACL); design and accessibility linkage; multi-tenant, multi-repo and polyglot extraction; incremental builds, caching and sharding; and the file-based graph until traversal scale forces a database. spec:decisions.planning-truths-placement rules that a deferral is a blocking question with a trigger or a ruling on a decision Spec. Recipe 20 lists 6 deferrals and none of these.
- **Evidence:** Recipe 20 totals: {questions:16, deferrals:6}; the triggers cover feature-adapter, symbol-reach, roadmap-views, reference-projection, structural-mermaid and runtime-overlay only. Recipe 6 on "federation", "polyglot", "tenant", "incremental", "accessibility", "LikeC4" → 0 each. spec:extraction.regenerability says only "The graph is one JSON document queried in memory."
- **Proposed change:** Either (a) capture one `idea` Spec per deferral, each with a blocking question and a `trigger`: spec:consumers.standards-interop (trigger: a named consumer of an external format), spec:extraction.multi-repo-federation (trigger: an adopter with Specs in two repositories), spec:extraction.incremental-build (trigger: a measured rebuild time an author reports as pain); or (b) add one decision Spec, spec:decisions.mvp-boundary, whose consequences list each deferral with its re-entry condition. Fold design-tool linkage into the spec-studio lens Specs as a non-tracked source.
- **Failure scenario:** Once concept 00 dissolves, these named deferrals vanish from every readable surface. The vision's 'designed-for, never forgotten' promise becomes false, and a reader cannot tell a refused scope from an unconsidered one.
- **Verifier (GPT):** The remaining federation, tenant, scale and external-format ambitions have no corresponding graph deferrals or re-entry conditions. Existing import and run-evidence capabilities cover parts of the trajectory; new triggers require owner decisions rather than invention during inventory.

#### L8-01: The reason for keeping the reading skill self-contained remains only in a declined review finding

- **Severity:** low
- **Location:** reviews/12-self-hosting-phase-5-post-close-review.md:62
- **Claim:** R-17 preserves a durable explanation for intentional overlap between the reading skill and recipe catalog: an agent loads the skill without surrounding context, so replacing its executable-contract summary with pointers weakens the on-ramp. The current reading-on-ramp Spec carries orientation and citation rules, but not this reason for retaining the overlap.
- **Evidence:** The disposition says: 'the file is loaded cold into agent context, where a pointer-only contract is strictly weaker.' Recipes 6 and 23 returned no matches for 'loaded cold', 'pointer only' or 'self-standing'. Recipe 3 and g.specContext for spec:consumers.reading-on-ramp showed six behavior rules and no narrative explaining this trade-off. Targeted searches of the current skills, recipe guidance and skill/recipe tests found no equivalent rationale.
- **Proposed change:** Preserve the rationale as narrative in specs/consumers/reading-on-ramp.sdp.md before Intent: 'An agent may load this skill without the recipe catalog in context. The skill therefore keeps the execution summary needed to use the front door, while pointing to carrying Specs for law. This intentional overlap keeps the on-ramp usable on its own; it is not another source of authority.' Keep the historical disposition in git.
- **Failure scenario:** A future simplification pass treats the overlap as accidental duplication and removes the self-contained instructions, repeating a change the earlier review explicitly declined.
- **Verifier (Claude):** The overlap the declined R-17 accepted still exists, and no Spec, skill, recipe doc or test carries the reason for it (the skill is loaded cold, so a pointer-only contract is weaker). spec:consumers.reading-on-ramp only allows 'summaries for orientation' and gives no reason. The Studio and vault on-ramp Specs require their skills to 'restate neither', so without the rationale the reading skill's choice looks like an inconsistency.

#### L8-02: The rejected engine-execution alternative loses its trust-boundary rationale outside the review

- **Severity:** low
- **Location:** reviews/14-executable-verification-design-review.md:203-209
- **Claim:** The current runnable-modules Spec preserves the outcome that generation does not load or execute adopter code, but the review alone explains the rejected alternative's cost: moving module loading, isolation, world setup and framework integration into the engine. That explanation remains useful when reconsidering executable-example ergonomics.
- **Evidence:** Line 207 says: 'The engine crosses a new trust boundary by loading and executing adopter code' and identifies the additional responsibilities. Line 209 records the machinery/security trade-off. Recipes 6 and 23 returned no matches for 'trust boundary', 'module loading' or 'security'. Searching 'adopter code' found spec:extraction.runnable-modules, whose current text states the prohibition without that rationale. Recipe 3 for spec:decisions.gherkin-carrier-option retains the Markdown and generated-wrapper alternatives, but not O5's explanation.
- **Proposed change:** Preserve this explanation as narrative in specs/extraction/runnable-modules.sdp.md before Intent: 'Generating registrars removes repeated test structure without making the extraction and generation engine load adopter modules. Moving example execution into that engine would also move module loading, isolation, world setup and test-framework integration into its responsibilities. The authored test therefore activates the generated registrar under the adopter’s runner.' Preserve the original option analysis in git; do not introduce a new validator or imply that this historical review ratified a new decision.
- **Failure scenario:** A later attempt to reduce authored test files sees only an unexplained prohibition and reopens engine-owned execution without the previously identified architectural costs.
- **Verifier (Claude):** spec:extraction.runnable-modules carries only the outcome: its value line and last rule say the engine 'neither loads nor executes adopter code'. No Spec or decision records the rejected engine-execution alternative or its costs (trust boundary, module loading, isolation, world anchors, framework integration). The review's ADR table records that O5 passed the three-part test and was rejected on evidence, so this is durable rationale held only by frozen history.

#### R2: Measured evidence from the earlier system's corpus that motivates enrich-in-place and point-per-example is uncarried

- **Severity:** low (reader rated medium; the verifier adjusted it)
- **Location:** plans/12-executable-examples-design-session.md:453-456 and :477-488
- **Claim:** Plan 12 records a measured reread of the earlier system's (`@libar-dev/architect`) usage in production. The corpus had 22 planning specs and 132 executable features, 93 of them in a truth-table house style. Maturity there meant migrating across two file trees, and rot appeared exactly at the migration: stale cross-pointers, invariants copied by hand, and always-throwing stubs read as coverage. Bold pseudo-fields appeared ×723. This is the field evidence behind point-per-example (MD-17) and the one-file maturity arc, and no decision Spec cites it.
- **Evidence:** Plan 12:455 "the truth-table house style: 93 of 132 executable features in a production gen-1 corpus". `grep -n "132\|truth-table\|migration" specs/decisions/point-per-example.sdp.md specs/decisions/one-primitive.sdp.md specs/model/enrichment-lifecycle.sdp.md` → no hits. The point-per-example context reads only "A single example must remain one witness in its parent's typed example space."
- **Proposed change:** spec:decisions.point-per-example, append to `context:`: "In the earlier system's production corpus, 93 of 132 executable features were written as truth tables, so table authoring is a real need that sugar must serve." spec:decisions.one-primitive, add `- rationale: In the earlier system's production corpus, maturing meant rewriting prose specs into separate executable features, and the rot sat at that migration: stale cross-pointers, invariants copied by hand, and throwing stubs read as coverage.`
- **Failure scenario:** A reviewer challenges table sugar or enrich-in-place without knowing the measured cost of migrating between two trees. The only measurement disappears with plans/.
- **Verifier (GPT):** The historical field evidence is missing from the carrying decisions, although their conclusions are preserved. Downgraded because this is supporting history; preserve its provenance in decision context or the pull request record without presenting the old figures as newly measured.

#### R7: Framework-neutral binding is stated only in concept 04

- **Severity:** low
- **Location:** docs/concept/04-authoring-and-binding.md:79
- **Claim:** Concept 04 says, 'One point no Spec states, kept here: anchors are framework-neutral. An anchor binds any class, function, route or module, however the runtime is wired.' spec:model.anchors does not state it.
- **Evidence:** `grep -n -i "framework\|route\|runtime" specs/model/anchors.sdp.md` → no hits. Recipe 6 "framework neutral" → 0.
- **Proposed change:** Add to spec:model.anchors Model or Rule: `- **framework neutrality** — An anchor binds any class, function, route or module by id, however the runtime is wired; binding never reads framework composition, which stays a later adapter's concern.`
- **Failure scenario:** Once 04 dissolves, a framework-specific anchor form (an Effect layer or Fastify plugin adapter) could be proposed as the binding mechanism with no Spec to refuse it.
- **Verifier (GPT):** Framework-independent binding is stated explicitly in the concept material but not in the anchor Spec. Carry that limited guarantee into spec:model.anchors without promising extraction beyond the supported source forms.

#### R8: The mapping from disciplines to kinds has no carrier

- **Severity:** low
- **Location:** docs/concept/06-consumers-and-projections.md:56-64
- **Claim:** Concept 06 §6 keeps 'the one mapping no Spec carries': Requirements → behavior Specs, Analysis & Design → design sections and decision records, Test → example Specs and `verifies`, Deployment → `observed`, Config & Change Management → git, Project Management → Packs and roadmap views, Business Modeling → model Specs. spec:consumers.projections-model defines `discipline` only as a filter.
- **Evidence:** specs/consumers/projections-model.sdp.md:23 "**discipline** — A filter that selects or groups Specs by kind or section; it is not a phase to pass through." CONTEXT.md:242 has the same gloss without the mapping.
- **Proposed change:** Add to spec:consumers.projections-model a `## Design` entry `disciplineMap:` with the seven rows, updated to current state: Requirements → behavior Specs and the capability map (recipe 52); Project Management → Packs and the roadmap (recipe 53), with release and baseline views deferred (spec:consumers.projections-model.roadmap-views).
- **Failure scenario:** Once 06 dissolves, the guidance on where a classic discipline's work lives on the one graph is lost, and the entries already stale here (an unbuilt capability map) keep misleading until then.
- **Verifier (GPT):** The discipline-to-kind mapping remains uncarried guidance, distinct from the existing definition of discipline. Moving the updated mapping into spec:consumers.projections-model preserves it without introducing phase gates.

#### R9: The graph's sort comparator lives only in a plan and a source comment

- **Severity:** low
- **Location:** plans/06-slice1-extractor.md:102-103; src/extract/serialize.ts:24
- **Claim:** Plan 06 rules that sorting is code-unit string comparison, never `localeCompare`, because locale-aware collation depends on the environment and breaks determinism. spec:extraction.determinism says only 'Nodes sort by id and edges by from, type and to', while newer Specs (capability-map, readiness-planner, obsidian-vault) do say 'code-unit order'.
- **Evidence:** `grep -rn -i "code-unit\|localeCompare" specs` → hits in consumers.capability-map:50, consumers.readiness-planner:36 and consumers.obsidian-vault:57, none in extraction.determinism. The src/extract/serialize.ts:24 comment: "Sorting is code-unit string comparison, never `localeCompare`".
- **Proposed change:** spec:extraction.determinism rule 1 → "Nodes sort by id and edges by from, type and to, in code-unit string order, never a locale-aware collation, which varies by environment. ..."
- **Failure scenario:** A refactor swaps in `localeCompare` for readability. Graph bytes then differ across machine locales, and no Spec rule names the comparator.
- **Verifier (GPT):** The graph-node and edge comparator is explicit only in the historical plan and implementation comment; the determinism Spec leaves it unspecified. Tests specifying code-unit order for locations and citations do not establish the node/edge comparator.

#### R11: Plan 18 brief's routing rubric for decision content is partly uncarried

- **Severity:** low
- **Location:** plans/18-self-hosting-phase-2-brief.md:195-236
- **Claim:** The placement half of the rubric is carried by spec:decisions.planning-truths-placement and the AGENTS.md three-part test. Four parts are not: the rewrite test ('would the sentence still be true if the repo were re-implemented tomorrow under the same design? If not, it is execution context'); the rule that a decision Spec carries no procedural context (dates, SHAs, session numbers); that rejected paths live in the winning decision's alternatives; and that superseded is a graph query, never an authored status.
- **Evidence:** `grep -n -i "rewrite\|execution context\|commit SHA" .agents/skills/sdp-authoring/SKILL.md` → no rubric hits (only an unrelated step-key 'rewording'). The skill's Decision row (line 129) lists the slots but no admission or routing test.
- **Proposed change:** Add to .agents/skills/sdp-authoring/SKILL.md under the decision guidance: "A decision Spec states current law only. Apply the rewrite test: a sentence that would not still hold if the repository were rebuilt tomorrow under the same design is execution context and belongs in git or the pull request. Rejected paths are the winning decision's `alternative:` entries; superseded is a `supersedes` relation, never an authored status."
- **Failure scenario:** Decision Specs accrete dates and landed-at notes once plans/ (the rubric's only home) is gone. This is authoring guidance, never a validator.
- **Verifier (GPT):** Confirmed only for the rewrite test and explicit exclusion of procedural execution context from decision prose. Rejected paths and supersession already have durable guidance in CONTEXT.md, so those portions should not be reported as missing.

## Refuted

Each refutation was re-measured by the other model family. They stay listed so the review is not read as a volume contest.

- **L2-4** edit-model and intent-composition have has-verifier from a test that exercises none of their keyed rules (test, reader rated medium): The binding verifies real promises about scoped handoff and leaving source unchanged; has-verifier does not assert exhaustive rule coverage, and recipe 34 counts declared example exercises. Moved and unresolved scope routing also has tests elsewhere, so removing these bindings is not justified by the cited zero counts.
- **R3** The correctness-oracle law in concept 07 has no carrying Spec (record, reader rated medium): There is no carrying Spec, but this lane explicitly accepts tests as durable carriers. Existing tests name and implement the correctness-golden versus determinism-self-comparison distinction, so the asserted inventory gap does not hold.
- **L2-7** Shipped-corpus Spec's list of shipped files omits the upgrade guide (spec, reader rated low): The shipped-corpus rule makes positive shipping guarantees without saying its list is exclusive. The upgrade guide has an explicit shipping guarantee elsewhere, and both package metadata and the package test include it, so the two Specs do not contradict each other.
- **L2-8** recipes() rejection prints a string argument as if it were a number (code, reader rated low): The awkward rendering reproduces, but the pinned contract does not require type-preserving quotation and the implementation correctly rejects the string. Quoting strings would be a diagnostic usability improvement rather than an intent-versus-realization defect in this lane.
- **L3-04** A dangling reference's 'Did you mean' suggestion can name the referencing Spec itself (code, reader rated low): The suggestion reproduces, but it implements explicit intended behavior: the unique nearest known ID is suggested without excluding the source. Excluding it would require an intent change, not this code correction.
- **L3-05** The derive-graph Spec lists the graph payload without its citation table (spec, reader rated low): The parent rule does not declare an exhaustive payload list, and its entry-citations refinement explicitly adds the optional citation table. The omission alone establishes no stale claim or intent/code disagreement.
- **L6-7** The sdp-agent-surface skill's list of recipes that take params.detail omits recipes 47 and 52 (docs, reader rated low): The parenthetical does omit 47 and 52, but it never claims to enumerate every detail-capable recipe. Their contracts and omission fields are already documented where the skill explicitly directs callers to read them.
- **L6-8** The sdp-agent-surface skill misdescribes the raw graph's top-level shape and omits graph.citations (docs, reader rated low): The parenthetical summarizes graph concepts rather than declaring top-level keys, and the skill explicitly places claims on nodes and edges. Raw citations could be added for completeness, but citation discovery and reading are already documented, so the claimed schema contradiction is unsupported.
- **L9-F8** README's recipe 25 sample address cannot resolve on the worked example (docs, reader rated low): The command is an adopter upgrade example, not a checkout-v1 walkthrough command, and the immediately following text instructs callers to use their own corpus's addresses. Its placeholder failing against checkout-v1 therefore does not demonstrate the claimed defect.
- **L9-F9** Jobs are outside the graph, so which job no Spec serves cannot be queried (design, reader rated low): Missing job-ID mappings do not establish an unserved job or a violated coverage guarantee. Graph-backed job traceability remains a possible owner design choice, but the cited index promises prose inputs and references, not that capability.
- **R10** Plan 39's open question about relation-named Design keys never reached the graph (record, reader rated low): The current carrier law explicitly settles this behavior: lawful relation-named Design keys are ordinary content and create no edge. The frozen plan question is superseded by that authored guarantee, not evidence of a still-open question.
