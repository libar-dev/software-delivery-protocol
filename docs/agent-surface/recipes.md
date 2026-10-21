# Agent-surface recipes

| No. | Recipe | Parameters | Use |
| --- | --- | --- | --- |
| 1 | The build backlog | none | Pick ready implementation work |
| 2 | The drift alarm | none | Find implementation ahead of intent |
| 3 | What does this Spec guarantee, and who verifies it | spec | Read guarantees and bindings |
| 4 | What breaks if I change these files | files, detail | Review changed-file reach |
| 5 | The Pack review backbone | pack | Review Pack readiness and gaps |
| 6 | Where is this concept | term | Locate a concept |
| 7 | Readiness divergence | none | Compare stated readiness to its floor |
| 8 | Orphans and gaps | none | Read warnings and exemptions |
| 9 | Promotion preflight | spec | Check both next rungs |
| 10 | Declared versus enabled verifiers | none | Compare verifier declarations and bindings |
| 11 | The lower ladder | none | Read non-ready Specs |
| 12 | Component membership | none | List component members |
| 13 | Uses fan-in and fan-out | none | Count uses reach |
| 14 | Structural neighborhood | component | Read a structural neighborhood |
| 15 | Census structural coverage | none | Measure structural coverage |
| 16 | Projection coverage upper bound | none | Bound projection coverage |
| 17 | Architecture map | none | Read the architecture map |
| 18 | Decision map | none | Rank shaping decisions |
| 19 | Planning slice | spec | Read a planning slice |
| 20 | Open-question register | none | List open questions |
| 21 | Dependency footing | spec | Read dependency footing |
| 22 | Mention audit | scope, intended | Audit prose mentions |
| 23 | Entry search | term | Find entries by term |
| 24 | Pinned declarations | none | List pinned declarations |
| 25 | Address resolution | addresses, severity | Resolve entry addresses |
| 26 | Dependency cycles | severity | Find dependency cycles |
| 27 | References into a design | pack | Read code references into a Pack |
| 28 | Roles, layers and contexts | none | List architecture vocabulary |
| 29 | Pack design | pack, detail | Review Pack design |
| 30 | Design-change impact | specs | Follow a design change |
| 31 | Decision register | none | Read decision relations |
| 32 | Architecture crossings | none | Read architecture crossings |
| 33 | The design backlog | none | Pick defined design work |
| 34 | Rule coverage | spec or pack | Find keyed rules no example exercises |
| 35 | The design diff | base, pack, detail | Compare design at entry grain |
| 36 | The context bundle | pack or specs, members, budget, declarations | Compose one pass within a budget |
| 37 | The perspective filter | pack, perspective | Select and order Pack members |
| 38 | The proposal check | proposal, base | Resolve proposal scopes and compare intent |
| 39 | Slimming candidates | pack | Compare pinned declarations with bound code |
| 40 | Curation report | imports, limit | Find curation gaps from file imports |
| 41 | The key-family register | prefixes, pack or specs | List a key family's entries |
| 42 | The architecture walk | forbidden, isolated, severity | Check anchored architecture rules |
| 43 | Planned against realized components | none | Compare component designs with anchors |
| 50 | External registers | register, pattern, severity, uncited | Check prose tokens against a supplied register |
| 51 | Entry citations | pack or specs, severity | Find anchored citations and unresolved addresses |

Runnable bodies for the agent front door. Each recipe below is a body you can pass verbatim to
`sdp q`, unchanged. In the Protocol source checkout, pass one to the repository wrapper:

```sh
pnpm --silent sdp:q '<body>'
pnpm --silent sdp:q '<body>' --json
```

**At this repository's root the exclusions are not optional.** The corpus carries deliberate
duplicate-id and carrier-parity fixtures under `examples/`, `explorations/`, and
`test/fixtures/import/parity/`; without those three exclusions the extractor reports errors, the
graph does not derive, and the sink refuses to run the body at all. The three above are exactly the
project's own — the `sdp:q` wrapper owns the same list `npm run generate:self-hosting` passes and
the recipe check derives with. Run `npm run build` first if `dist/` is absent. Do not substitute
`pnpm exec` in this source checkout: `exec` resolves dependency binaries, while a package does not
link itself into its own `node_modules/.bin`; an unresolved `sdp` can select macOS's unrelated
binary.

The same CLI publishes five independent read roots with `view`, `census`, `mermaid`, `gherkin`, and `studio`.
Each publisher's build removes all five projection roots first.
The repository's generate/check scripts preserve and publish all five roots together. They save
the prior trees before the individual publishers run, preserve each result across the next build's
invalidation, and restore all five results at the end. In check mode a prior tree must exist for
each root; Design Review checks repeat-render determinism, while census, Mermaid, Gherkin and Studio also
compare the prior tree's bytes with the current render. Graph questions enter through `q`.

For adopters, the portable form keeps root and exclusions project-selected:

```sh
pnpm exec sdp q '<body>' --root PATH
pnpm exec sdp q '<body>' --root PATH --exclude PATH --exclude PATH
```

`--root PATH` picks the extraction root (default: the working directory) and `--exclude` is
repeatable for root-relative path prefixes. `PATH` is a placeholder, not a literal directory.

Recipes read their documented input from `params`: Spec or component ids, changed files, Pack
ids, search terms, Spec or address lists, base graphs, proposals, perspectives, imports objects,
budgets and detail selections. Each recipe declares the parameter names it takes before reading its
input; a name it does not take returns only `{ unknownParams, accepts }`, with exit 0.
Pass parameters as JSON data with `--params`, never by editing the body:

```sh
pnpm --silent sdp:q '<body>' --params '{"spec":"spec:model.anchors"}' --json
pnpm --silent sdp:q '<body>' --params @params.json --json
```

Repeat `--params` to merge objects at the top level from left to right. `--params @PATH` reads an
object from a file. `--params KEY=@PATH` binds any JSON value from the file to one lower-camel key,
for example `--params base=@graph.json --params '{"spec":"spec:model.anchors"}'`. A key given twice
by any form is refused before the body runs. Without `--params`, `params` is `{}`. Bodies with a
documented sample fall back to it. A required input without a sample returns diagnostic data in
the shape its recipe documents: `diagnostics`, `schemaProblems`, or a `found: false` result with a
reason and expected input. Missing required input is never answered as empty, except recipe 4's
`files`, which reads as an empty change list.
The samples name this repository's corpus, so every body runs as written here. The recipe check
executes each one unchanged. Recipes report absent subjects in their documented result shape.
Most use `found: false`; the design diff, context bundle, perspective filter and key-family register report an absent
Pack in `diagnostics`. A value that is not JSON, JSON that is not an object (null, an array, a
string, a number or a boolean), or a file that cannot be read is refused before the body runs,
with exit 1 and one line on stderr.

**Every body ships as a file.** The build writes each body below to
`dist/recipes/<NN>-<slug>.js`, where `NN` is the two-digit recipe number and the slug is the
heading in lower kebab case, so recipe 25 is `dist/recipes/25-address-resolution.js`. The package
ships that directory, at
`node_modules/@libar-dev/software-delivery-protocol/dist/recipes/` in an adopter. Run a file as
shipped instead of copying its body out of this page:

```sh
pnpm --silent sdp:q "$(cat dist/recipes/25-address-resolution.js)" --params @addresses.json --json
```

This catalog stays the one owner of the bodies. The files are derived from it, and the recipe
check holds each one byte for byte to its body here.

To filter a shipped answer, wrap its body in an async arrow function and return the part you need.
Give the inner body only its own parameters, so an outer caller's parameters do not become unknown
names in the recipe:

```sh
pnpm --silent sdp:q "$(printf '%s\n' 'const answer = await (async (params) => {'; cat dist/recipes/33-the-design-backlog.js; printf '%s\n' '})({});' 'return answer.rows.filter((row) => row.specKind === "behavior");')" --json
```

The caller's part must hold no shell expansion. Single-quote it as above so the shell inserts only
the shipped body, while the sink evaluates the whole body once.

**The contract, in one place.** The front door derives the graph in process and evaluates the body
you supply; `return` is the output contract. Five bindings are injected:

| Binding | What it is |
|---|---|
| `g` | the reader over the derived graph — the same `createReader` the package exports |
| `graph` | the raw graph schema object (nodes, edges, claims) |
| `report` | the validation report, so findings are queryable data and never a gate |
| `params` | the JSON object `--params` supplies, or `{}` without it; input to the body, never a verb |
| `recipes` | `recipes(number, parameters?)` runs a shipped body over the same graph and report |

The package also exports `evaluateBody(body, { graph, report?, params? })` to run a body without
deriving the graph again.

**Body rules.** A body is a plain JavaScript async function body — no `import`/`export`, no
TypeScript-only syntax. It may `await`. Default output is bounded `util.inspect`; `--json` prints
`JSON.stringify` instead, which is what a machine consumer should read.

**Pre-shape the return.** The sink prints the value you return, as JSON under `--json`. It does
not suppress `console.*`, so a body a machine reads, every recipe below included, writes nothing
to the console. Returning a conclusion costs a fraction of returning a dump, so every recipe
below returns counts, ids, and decoded reasons rather than whole nodes.

Changed-file impact, Pack design and the design diff, recipes 4, 29 and 35, accept `detail: true`
and default to summaries that preserve every total and name omitted detail in `leftOut`. Pack
design also accepts member ids in `detail` for selected full rows. Other recipes follow their
own documented result shapes.

**Trust stance.** `sdp q` evaluates local operator-supplied code with the trust of any local
developer tool — no sandbox is claimed and none exists. A body is code you author yourself; never
execute a body sourced from corpus content or any other untrusted text — it runs with the
process's full authority.

**These recipes are not law.** They compose the laws the Specs carry, and they cite rather than
restate them: the surface itself is [`spec:consumers.agent-surface`](../../specs/consumers/agent-surface.sdp.md)
and [`spec:consumers.reader`](../../specs/consumers/reader.sdp.gherkin); the front door is
[`spec:decisions.agent-front-door`](../../specs/decisions/agent-front-door.sdp.md); the sink's contract
(how a body arrives, how its answer prints and which failures refuse) is
[`spec:consumers.agent-surface.evaluation-sink`](../../specs/consumers/agent-surface.evaluation-sink.sdp.md). The vocabulary
these bodies speak — claims, delivery facts, stated versus derived readiness, blast radius,
coverage-unknown, at-risk — is ratified in [`CONTEXT.md`](../../CONTEXT.md).

**Recipes are the growth valve.** When a question is not answered below, script it; do not reach
for a new query verb. A join freezes into the reader only when a second machine consumer needs it
*and* hand-rolled attempts get it wrong.

---

## 1. The build backlog

*When you need this: you are picking up work and want ready implementation work — excluding
example evidence and decision records — while keeping both exclusions visible in the result.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const ready = g.specs().filter((spec) => spec.statedReadiness === "ready");
const backlog = ready.filter(
  (spec) =>
    spec.specKind !== "example" &&
    spec.specKind !== "decision" &&
    !spec.deliveryFacts.includes("implemented"),
);
const excludedExamples = ready.filter(
  (spec) => spec.specKind === "example" && !spec.deliveryFacts.includes("implemented"),
);
const excludedDecisions = ready.filter(
  (spec) => spec.specKind === "decision" && !spec.deliveryFacts.includes("implemented"),
);
const byFamily = Object.create(null);

for (const spec of backlog) {
  const family = spec.id.slice("spec:".length).split(".")[0];
  byFamily[family] = byFamily[family] ?? [];
  const { designColumns } = g.specContext(spec.id);
  byFamily[family].push({
    id: spec.id,
    kind: spec.specKind,
    altitude: spec.altitude,
    hasVerifier: spec.deliveryFacts.includes("has-verifier"),
    designColumns: {
      entries: designColumns.entries,
      declarations: designColumns.declarations,
      openQuestions: designColumns.openQuestions.length,
      blockingQuestions: designColumns.blockingQuestions,
      decisions: designColumns.decisions.length,
    },
  });
}

return {
  total: backlog.length,
  byFamily,
  excludedReadyExamples: excludedExamples.length,
  excludedReadyDecisions: excludedDecisions.length,
  excludedWithoutVerifier: excludedExamples
    .filter((spec) => !spec.deliveryFacts.includes("has-verifier"))
    .map((spec) => spec.id),
};
```

`implemented` is a delivery fact: it says a code anchor *binds* to the Spec, never that the code
works or is live. It never propagates through refinement. Ready examples normally carry
verification evidence rather than implementation work, under the example realization posture
(MD-24); ready decision records carry registry-ratification evidence rather than implementation or
verifier work, under the decision readiness posture (MD-26). The raw
`ready ∧ ¬implemented` expression remains literally true while this operational recipe excludes
both kinds, audits example verifier bindings, and reports both excluded counts. The reverse pairing
is recipe 2. Each backlog row also reports `designColumns` from its Spec context: counts of keyed
Design and UI entries, pinned declarations, open and blocking questions, and shaping decisions.
These columns are derived, never a score, rung or approval.

## 2. The drift alarm

*When you need this: you want the dishonest direction — code bound to a Spec whose design is not
finished, `implemented ∧ ¬ready`.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const rungs = ["idea", "scoped", "defined", "ready"];
const alarms = g
  .specs()
  .filter((spec) => spec.deliveryFacts.includes("implemented") && spec.statedReadiness !== "ready")
  .map((spec) => {
    const context = g.specContext(spec.id);
    const unmet = context === undefined ? [] : context.floorFailures;

    return {
      id: spec.id,
      statedReadiness: spec.statedReadiness,
      floorReached: spec.derivedReadiness ?? "none",
      firstUnmetClause: unmet.length === 0 ? null : unmet[0].clauseId,
      implementationBindings: context === undefined ? 0 : context.implementations.length,
    };
  })
  .sort((left, right) => rungs.indexOf(left.statedReadiness) - rungs.indexOf(right.statedReadiness));

return { total: alarms.length, alarms };
```

`floorReached` is derived readiness — the highest rung whose floor clauses pass. A hit with no
unmet clause is the cheap case: the structure is already there and the author has not stated the
rung. A hit *with* an unmet clause is the expensive one.

## 3. What does this Spec guarantee, and who verifies it

*When you need this: you are about to implement or review one Spec and want its sections,
relations, and bindings in one shot.*

The parameter is `params.spec`, the Spec id to read; an unknown id returns `{ id, found: false }`
rather than failing.

```js
const accepts = ["spec"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const id = params.spec ?? "spec:consumers.reader";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const unitOf = (binding) => ({
  id: binding.codeId,
  file: binding.file ?? null,
  line: binding.line ?? null,
  role: binding.role ?? null,
  component: binding.component === undefined ? null : {
    id: binding.component.id,
    layer: binding.component.layer ?? null,
    context: binding.component.context ?? null,
  },
});
const relation = (end) => ({
  type: end.type,
  other: end.otherId,
  claim: end.claim,
  resolved: end.resolved,
  ...(end.reason === undefined ? {} : { reason: end.reason }),
  ...(end.exercises === undefined ? {} : { exercises: end.exercises }),
});

return {
  id: context.id,
  title: context.title,
  kind: context.specKind,
  altitude: context.altitude,
  statedReadiness: context.statedReadiness,
  floorReached: context.derivedReadiness ?? "none",
  unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId),
  sections: context.sections ?? {},
  designColumns: context.designColumns,
  packs: context.packs,
  relationsOut: context.relationsOut.map(relation),
  relationsIn: context.relationsIn.map(relation),
  implementations: context.implementations.map(unitOf),
  references: context.references.map(unitOf),
  verifiers: context.verifiers.map((binding) => ({
    verifierId: binding.verifierId,
    via: binding.via,
    claim: binding.claim,
    enabled: binding.enabled,
    file: binding.file ?? null,
    line: binding.line ?? null,
  })),
  verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail",
  findings: context.findings.map((finding) => ({
    validatorId: finding.validatorId,
    severity: finding.severity,
    message: finding.message,
  })),
};
```

Every relation carries its `claim` and the claim is never collapsed, and a relation authored with
a reason carries `reason`, as a declared `verifies` naming rule keys carries `exercises`: `declared` is authored intent,
`anchored` is a human binding from source, `inferred` is machine-derived structure. `has-verifier`
rides an *enabled* verifier — a resolving test anchor — and states that a verifier **exists**, not
that it passed. Pass/fail is CI's, exactly as skip and quarantine are.

## 4. What breaks if I change these files

*When you need this: you have a diff (or are about to make one) and want the Specs it reaches.*

The parameters are `params.files`, the list of changed paths relative to the root (absent, an
empty list that reaches nothing), and
`params.detail`, true for full rows and absent or false for a summary. The caller
acquires the paths and passes them as data, never as query source. From the repository root, this
pipeline keeps every valid Git filename byte except NUL (which Git filenames cannot contain),
newlines included, by JSON-encoding the NUL-delimited list before it reaches the sink:

```sh
changed="$(mktemp)"
git diff --name-only -z | node -e 'const fs = require("node:fs"); const names = fs.readFileSync(0).toString("utf8").split("\0"); process.stdout.write(JSON.stringify({ files: names.slice(0, -1) }));' > "$changed"
pnpm --silent sdp:q "$(cat dist/recipes/04-what-breaks-if-i-change-these-files.js)" --params "@$changed" --json
rm -f "$changed"
```

The body is static and reads only the JSON value; neither the shell nor the reader reevaluates
filenames. `--params` parses data, so quotes, shell metacharacters, spaces, Unicode, and embedded
newlines remain filenames rather than JavaScript or shell syntax. The reader never shells to git.

```js
const accepts = ["files", "detail"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const detail = params.detail ?? false;
const changed = params.files ?? [];
const radius = g.blastRadius(changed);
const impacted = new Set([...radius.impactedSpecs, ...radius.impactedPacks].map((item) => item.id));
const impactReasons = (item) => ({
  id: item.id,
  reasons: item.reasons.map((reason) => reason.throughBinding === undefined
    ? { file: reason.file, via: null }
    : { file: reason.file, via: reason.throughBinding.id, edgeType: reason.throughBinding.edgeType, claim: reason.throughBinding.claim }),
});
const atRiskReasons = (item) => ({
  id: item.id,
  nodeType: item.nodeType,
  reasons: item.reasons.map((reason) => ({
    from: reason.from, edgeType: reason.edgeType, to: reason.to, claim: reason.claim,
    direction: impacted.has(reason.to) ? "incoming" : "outgoing",
  })),
});
const specs = radius.atRisk.filter((item) => item.nodeType === "Primitive");
const other = radius.atRisk.filter((item) => item.nodeType !== "Primitive");
const totals = {
  changedFiles: radius.changedFiles.length,
  impactedSpecs: radius.impactedSpecs.length,
  impactedPacks: radius.impactedPacks.length,
  atRiskSpecs: specs.length,
  atRiskOther: other.length,
  coverageUnknownFiles: radius.coverageUnknown.length,
  unlinkedUnits: radius.unlinked.length,
};
if (detail === true) {
  return {
    changedFiles: radius.changedFiles,
    totals,
    impactedSpecs: radius.impactedSpecs.map(impactReasons),
    atRiskSpecs: specs.map(atRiskReasons),
    atRiskOther: other.map(atRiskReasons),
    coverageUnknownFiles: radius.coverageUnknown,
    unlinkedUnits: radius.unlinked.map((unit) => ({ id: unit.id, file: unit.file })),
  };
}
const inDirection = (item, direction) => item.reasons.some((reason) =>
  direction === "incoming" ? impacted.has(reason.to) : impacted.has(reason.from),
);
return {
  changedFiles: radius.changedFiles,
  totals,
  impactedSpecs: radius.impactedSpecs.map((item) => item.id),
  impactedPacks: radius.impactedPacks.map((item) => item.id),
  atRisk: {
    incomingSpecs: specs.filter((item) => inDirection(item, "incoming")).map((item) => item.id),
    outgoingSpecs: specs.filter((item) => inDirection(item, "outgoing")).map((item) => item.id),
    other: other.map((item) => item.id),
  },
  coverageUnknownFiles: radius.coverageUnknown,
  unlinkedUnits: radius.unlinked.map((unit) => unit.id),
  leftOut: ["Impact binding reasons omitted.", "At-risk connecting edges and claims omitted.", "Unlinked unit files omitted."],
};
```

The default summary keeps all totals and lists impacted Spec and Pack ids beside at-risk ids.
Incoming and outgoing name the connecting edge's direction relative to its impacted end; neither
asserts dependency.
`leftOut` names the omitted details. With `detail: true`, impacted Specs carry their binding
reasons, and at-risk Specs carry their connecting edges, claims and directions. `atRiskOther`
keeps the other at-risk nodes with their node types. `coverageUnknownFiles` names changed files
the graph records nothing at. `unlinkedUnits` lists changed code units that bind no Spec, with
their files. Such a unit is recorded, so its file is not coverage-unknown, and it implies no
coverage. File-level reach makes no claim about exhaustive symbol reach.

## 5. The Pack review backbone

*When you need this: you are reviewing a Pack as a unit and want its members' readiness, delivery
facts, and verifier gaps.*

The parameter is `params.pack`, the Pack to review; without it the body reads the first Pack in
the graph. An unknown Pack returns `{ id, found: false }`.

```js
const accepts = ["pack"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const id = params.pack ?? g.packs()[0]?.id;

if (id === undefined) {
  return { packs: 0 };
}

const context = g.packContext(id);

if (context === undefined) {
  return { id, found: false };
}

const byStatedReadiness = {};

for (const member of context.members) {
  const rung = member.statedReadiness ?? "unresolved";
  byStatedReadiness[rung] = (byStatedReadiness[rung] ?? 0) + 1;
}

return {
  id: context.id,
  title: context.title,
  memberCount: context.members.length,
  byStatedReadiness,
  unresolvedMembers: context.members.filter((member) => !member.resolved).map((member) => member.id),
  implementedCount: context.members.filter((member) => member.deliveryFacts.includes("implemented"))
    .length,
  verifierGaps: context.verifierGaps.map((gap) => ({
    id: gap.id,
    statedReadiness: gap.statedReadiness ?? null,
    priority: gap.priority,
  })),
  findings: context.findings.length,
};
```

A verifier gap is an informative absence, never a gate — a `priority` gap is one on a member stated
`ready`, which is where a reviewer looks first. A Pack states no truth of its own; it is a review
aggregate over Specs that do.

## 6. Where is this concept

*When you need this: you have a phrase and no id — the grep-to-graph bridge.*

The parameter is `params.term`, the phrase to look for.

```js
const accepts = ["term"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const term = params.term ?? "blast radius";
const matches = g.findByConcept(term);

return {
  term,
  total: matches.length,
  matches: matches.slice(0, 25).map((match) => ({
    id: match.id,
    nodeType: match.nodeType,
    title: match.title ?? null,
    matchedIn: match.matchedIn,
  })),
};
```

`matchedIn` names the fields that hit — `id`, `title`, `label`, `framing`, `narrative`, or a
`sections.<name>` entry — so you can tell a naming hit from a body-text hit. Matching is
deterministic substring, never fuzzy-scored: the same query returns the same rows.

## 7. Readiness divergence

*When you need this: you want the Specs stating a rung their structure does not earn.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const rungs = ["idea", "scoped", "defined", "ready"];
const rank = (rung) => (rung === undefined ? -1 : rungs.indexOf(rung));

return g
  .specs()
  .filter((spec) => rank(spec.derivedReadiness) < rank(spec.statedReadiness))
  .map((spec) => {
    const context = g.specContext(spec.id);
    const unmet = context === undefined ? [] : context.floorFailures;

    return {
      id: spec.id,
      statedReadiness: spec.statedReadiness,
      floorReached: spec.derivedReadiness ?? "none",
      firstUnmetClause: unmet.length === 0 ? null : unmet[0].clauseId,
      firstUnmetDescription: unmet.length === 0 ? null : unmet[0].description,
    };
  });
```

An empty array is the healthy answer and the expected one on a green corpus: the readiness floor is
already a check, so a divergence here is also a finding in recipe 8. A non-empty answer means an
author stated a rung the structure has not reached — repair the structure or restate the rung, and
never the other way round. Divergence in the *other* direction — the floor reached standing above
the stated rung — is information, not a problem: a floor is a floor, never a quota to fill.

## 8. Orphans and gaps

*When you need this: you want the warn-level signals as data — informative absences, not a gate.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const warnings = report.findings.filter((finding) => finding.severity === "warning");
const byValidator = {};

for (const finding of warnings) {
  byValidator[finding.validatorId] = (byValidator[finding.validatorId] ?? 0) + 1;
}

return {
  errors: report.findings.filter((finding) => finding.severity === "error").length,
  warnings: warnings.length,
  byValidator,
  exemptions: [{
    validatorId: "honesty/gaps",
    exemptKind: "decision",
    readySpecs: g.specs().filter((spec) => spec.specKind === "decision" && spec.statedReadiness === "ready").length,
  }],
  leftOut: warnings.length > 25 ? [`${warnings.length - 25} warning signals omitted.`] : [],
  signals: warnings.slice(0, 25).map((finding) => ({
    validatorId: finding.validatorId,
    family: finding.family,
    subjectId: finding.subjectId ?? null,
    message: finding.message,
  })),
};
```

`exemptions` names the ready decision Specs exempt from the verifier-gap signal. `leftOut`
names any warning signals beyond the first 25.

`report` is the same validation output `g.findings()` exposes — one validation path, never a second
one. Gaps and orphans are warn-level by design: a `ready` Spec with no verifier and a Spec nothing
points at are both worth surfacing and neither is a failure. Errors are the conformance and honesty
refusals; a green corpus has no errors, but may carry intentional warnings.

## 9. Promotion preflight

*When you need this: you are considering a readiness edit and want the current graph-visible floor
evidence before touching the carrier.*

```js
const accepts = ["spec"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const id = params.spec ?? "spec:model.enrichment-lifecycle";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const rungs = ["idea", "scoped", "defined", "ready"];
const reached = context.derivedReadiness ?? "none";
const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached);
const shape = (failure) => ({
  clauseId: failure.clauseId,
  description: failure.description,
  ...(failure.targets === undefined ? {} : { targets: failure.targets }),
});

return {
  id,
  found: true,
  statedReadiness: context.statedReadiness,
  floorReached: reached,
  aboveStated: {
    rung: context.statedNextRung ?? null,
    failures: context.statedNextRungFailures.map(shape),
    firstUnmetClause: context.statedNextRungFailures[0]?.clauseId ?? null,
  },
  aboveFloor: {
    rung: rungs[reachedIndex + 1] ?? null,
    failures: context.nextRungFailures.map(shape),
    firstUnmetClause: context.nextRungFailures[0]?.clauseId ?? null,
  },
  currentFloorFailures: context.floorFailures.map(shape),
  firstUnmetClause: context.floorFailures[0]?.clauseId ?? null,
  promotionRequiresHumanStatement: true,
};
```

The parameter is `params.spec`, the Spec whose promotion you are weighing.
An empty `currentFloorFailures` list says the stated rung is honest. It does not confer the next
rung, and `floorReached` above the stated rung is information rather than an automatic edit.
`aboveStated` reports the rung above the stated rung; `aboveFloor` reports the rung above the
floor reached. Each carries its unmet clauses and first unmet clause, with `rung: null` at ready.
A typed-dependency failure lists its `targets`; neither answer confers a rung.

## 10. Declared versus enabled verifiers

*When you need this: you want example intent and graph-visible verifier realization kept distinct.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const rows = [];

for (const spec of g.specs()) {
  const context = g.specContext(spec.id);
  if (context === undefined) continue;

  const declared = context.verifiers
    .filter((binding) => binding.via === "example")
    .map((binding) => binding.verifierId);
  const enabled = context.verifiers
    .filter((binding) => binding.enabled)
    .map((binding) => binding.verifierId);

  if (declared.length > 0 || enabled.length > 0) {
    rows.push({ id: spec.id, declared, enabled });
  }
}

return {
  total: rows.length,
  withDeclaredOnly: rows.filter((row) =>
    row.declared.some((id) => !row.enabled.includes(id)),
  ).length,
  rows,
};
```

Enabled means a resolving graph-visible test binding exists. This recipe cannot detect a generated
contract no suite binds, and it never reports runner pass or fail.

## 11. The lower ladder

*When you need this: you want every non-ready Spec grouped by family, with its stated next rung
and the first clause that holds it below that rung.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const lower = g.specs().filter((spec) => spec.statedReadiness !== "ready");
const byFamily = Object.create(null);

for (const spec of lower) {
  const family = spec.id.slice("spec:".length).split(".")[0];
  const context = g.specContext(spec.id);
  byFamily[family] = byFamily[family] ?? [];
  byFamily[family].push({
    id: spec.id,
    statedReadiness: spec.statedReadiness,
    floorReached: spec.derivedReadiness ?? "none",
    statedNextRung: context?.statedNextRung ?? null,
    nextUnmetClause: context?.statedNextRungFailures[0]?.clauseId ?? null,
  });
}

return { total: lower.length, byFamily };
```

`statedNextRung` is the rung above the author's statement. `nextUnmetClause: null` means nothing
blocks that rung. The author still decides whether to state it; the recipe never promotes a Spec.

## 12. Component membership

*When you need this: you want to know which code units belong to each declared component.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const componentIds = new Set(
  graph.nodes
    .filter((node) => node.nodeType === "CodeNode" && node.id.startsWith("component:"))
    .map((node) => node.id),
);
const membersByComponent = new Map();

for (const edge of graph.edges.filter((edge) => edge.type === "memberOf")) {
  const members = membersByComponent.get(edge.to) ?? [];
  members.push(edge.from);
  membersByComponent.set(edge.to, members);
}

const components = [...componentIds].sort().map((id) => {
  const members = [...new Set(membersByComponent.get(id) ?? [])].sort();
  return { id, members, memberCount: members.length };
});

return { components };
```

Membership is authored structural data. An empty member list is visible rather than invented away,
and the component ids come from the graph's declared component nodes.

## 13. Uses fan-in and fan-out

*When you need this: you want to know which components depend on which, with both directions visible.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const componentIds = new Set(
  graph.nodes
    .filter((node) => node.nodeType === "CodeNode" && node.id.startsWith("component:"))
    .map((node) => node.id),
);
const ownerByMember = new Map();

for (const edge of graph.edges.filter((edge) => edge.type === "memberOf")) {
  ownerByMember.set(edge.from, edge.to);
}

const ownerOf = (id) => componentIds.has(id) ? id : ownerByMember.get(id);
const usesOutByComponent = new Map();
const usedByByComponent = new Map();

for (const edge of graph.edges.filter((edge) => edge.type === "uses")) {
  const from = ownerOf(edge.from);
  const to = ownerOf(edge.to);
  if (from === undefined || to === undefined) continue;
  const outgoing = usesOutByComponent.get(from) ?? new Set();
  outgoing.add(to);
  usesOutByComponent.set(from, outgoing);
  const incoming = usedByByComponent.get(to) ?? new Set();
  incoming.add(from);
  usedByByComponent.set(to, incoming);
}

const components = [...componentIds].sort().map((id) => {
  const usesOut = [...(usesOutByComponent.get(id) ?? [])].sort();
  const usedBy = [...(usedByByComponent.get(id) ?? [])].sort();
  return { id, fanOut: usesOut.length, fanIn: usedBy.length, usesOut, usedBy };
});

return { components };
```

Fan counts are graph-side composition, not a new reader accessor. A structural cycle is data about
component dependencies, not a validation finding. Fan counts deduplicate mapped component
endpoints and include a component reaching itself through uses between its units; the architecture
map counts only crossings between different components.

## 14. Structural neighborhood

*When you need this: you want the component's members, directly declared uses neighbors, and the
Specs satisfied by its member units.*

The parameter is `params.component`, the component you are reviewing; an unknown component
returns the exact not-found shape and does not throw.

```js
const accepts = ["component"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const subject = params.component ?? "component:protocol.reader";
const component = graph.nodes.find((node) => node.nodeType === "CodeNode" && node.id === subject);

if (component === undefined) {
  return { found: false };
}

const members = graph.edges
  .filter((edge) => edge.type === "memberOf" && edge.to === subject)
  .map((edge) => edge.from)
  .sort();
const usesOut = graph.edges
  .filter((edge) => edge.type === "uses" && edge.from === subject)
  .map((edge) => edge.to)
  .sort();
const usedBy = graph.edges
  .filter((edge) => edge.type === "uses" && edge.to === subject)
  .map((edge) => edge.from)
  .sort();
const satisfiedSpecs = [...new Set(
  graph.edges
    .filter((edge) => edge.type === "satisfies" && members.includes(edge.from))
    .map((edge) => edge.to),
)].sort();

return { found: true, id: subject, members, usesOut, usedBy, satisfiedSpecs };
```

`satisfiedSpecs` reports the member anchors' own realization targets. Structural edges themselves
confer no delivery fact or readiness.

## 15. Census structural coverage

*When you need this: you want to know what the census structural sections will receive from the graph.*

This reads validation findings already supplied by `report`; it never revalidates or reconstructs
dangling references.

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const components = graph.nodes
  .filter((node) => node.nodeType === "CodeNode" && node.id.startsWith("component:"))
  .map((node) => node.id)
  .sort();
const memberOfEdges = graph.edges.filter((edge) => edge.type === "memberOf");
const usesEdges = graph.edges.filter((edge) => edge.type === "uses");
const structuralIds = new Set(
  [...memberOfEdges, ...usesEdges].flatMap((edge) => [edge.from, edge.to]),
);
const danglingStructuralFindings = report.findings.filter(
  (finding) =>
    finding.validatorId === "conformance/referential-integrity" &&
    [finding.subjectId, finding.relatedId].some(
      (id) => id !== undefined && structuralIds.has(id),
    ),
);
const edgeId = (edge) => `${edge.from} -> ${edge.to}`;
const findingId = (finding) => finding.subjectId ?? finding.relatedId ?? finding.validatorId;

return {
  components: { count: components.length, ids: components },
  memberOfEdges: { count: memberOfEdges.length, ids: memberOfEdges.map(edgeId).sort() },
  usesEdges: { count: usesEdges.length, ids: usesEdges.map(edgeId).sort() },
  danglingStructuralFindings: {
    count: danglingStructuralFindings.length,
    ids: danglingStructuralFindings.map(findingId).sort(),
  },
};
```

The component and edge ids make an empty or shortened section observable, while the finding count
keeps census's validator-owned honesty signal distinct from structural data.

## 16. Projection coverage upper bound

*When you need this: you want the graph-side slice each shipped projection root is allowed to render.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const specs = graph.nodes.filter((node) => node.nodeType === "Primitive");
const packs = graph.nodes.filter((node) => node.nodeType === "Pack");
const anchors = graph.nodes.filter(
  (node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode",
);
const memberSpecs = graph.edges.filter((edge) => edge.type === "belongsTo");

return {
  designReview: { packs: packs.length, memberSpecs: memberSpecs.length },
  census: { specs: specs.length, anchors: anchors.length },
  mermaid: { diagramSubjects: specs.length + packs.length },
  gherkin: { specs: specs.length },
};
```

This is a graph-side **upper bound**, not a rendered-page census. Mermaid's per-diagram refusal can
withhold graph rows, and census inclusion rules can withhold rows the graph contains; projection
refusal or inclusion can therefore make rendered output smaller than these counts.

## 17. Architecture map

*When you need this: you want every declared component with its members, uses neighbors,
satisfied Specs, and shaping decisions in one map.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const nodes = graph.nodes;
const edges = graph.edges;
const codeNodesById = new Map(
  nodes
    .filter((node) => node.nodeType === "CodeNode")
    .map((node) => [node.id, node]),
);
const membersByComponent = new Map();
const ownerByMember = new Map();

for (const edge of edges.filter((edge) => edge.type === "memberOf")) {
  const members = membersByComponent.get(edge.to) ?? [];
  members.push(edge.from);
  membersByComponent.set(edge.to, members);
  ownerByMember.set(edge.from, edge.to);
}

// Declared components plus memberOf targets whose component node is missing: a dangling
// component keeps its row (declared: false) instead of hiding its members from the map.
const componentIds = new Set([
  ...[...codeNodesById.keys()].filter((id) => id.startsWith("component:")),
  ...membersByComponent.keys(),
]);
const ownerOf = (id) => componentIds.has(id) ? id : ownerByMember.get(id);
const usesOutByComponent = new Map();
const usedByByComponent = new Map();
const unresolvedUses = [];

for (const edge of edges.filter((edge) => edge.type === "uses")) {
  const from = ownerOf(edge.from);
  const to = ownerOf(edge.to);
  if (from === undefined || to === undefined) {
    unresolvedUses.push({ from: edge.from, to: edge.to });
    continue;
  }
  // Local collaborations remain in usesEdges; component fan counts measure boundary crossings.
  if (from === to) continue;
  const outgoing = usesOutByComponent.get(from) ?? new Set();
  outgoing.add(to);
  usesOutByComponent.set(from, outgoing);
  const incoming = usedByByComponent.get(to) ?? new Set();
  incoming.add(from);
  usedByByComponent.set(to, incoming);
}

const decisionsBySubject = new Map();
for (const edge of edges.filter((edge) => edge.type === "decidedBy")) {
  const decisions = decisionsBySubject.get(edge.from) ?? new Set();
  decisions.add(edge.to);
  decisionsBySubject.set(edge.from, decisions);
}

const components = [...componentIds].sort().map((id) => {
  const memberIds = [...new Set(membersByComponent.get(id) ?? [])].sort();
  const anchors = new Set([id, ...memberIds]);
  const satisfiedSpecs = [...new Set(
    edges
      .filter((edge) => edge.type === "satisfies" && anchors.has(edge.from))
      .map((edge) => edge.to),
  )].sort();
  const decisionSubjects = new Map();

  for (const specId of satisfiedSpecs) {
    for (const decisionId of decisionsBySubject.get(specId) ?? []) {
      const subjects = decisionSubjects.get(decisionId) ?? [];
      subjects.push(specId);
      decisionSubjects.set(decisionId, subjects);
    }
  }

  const usesOut = [...(usesOutByComponent.get(id) ?? [])].sort();
  const usedBy = [...(usedByByComponent.get(id) ?? [])].sort();

  return {
    id,
    declared: codeNodesById.has(id),
    members: memberIds.map((memberId) => {
      const member = codeNodesById.get(memberId);
      return {
        id: memberId,
        label: member?.label ?? null,
        file: member?.file ?? null,
        line: member?.line ?? null,
      };
    }),
    fanOut: usesOut.length,
    fanIn: usedBy.length,
    usesOut,
    usedBy,
    satisfiedSpecs,
    realizations: edges
      .filter((edge) => edge.type === "satisfies" && anchors.has(edge.from))
      .map((edge) => ({ from: edge.from, to: edge.to, claim: edge.claim })),
    shapingDecisions: [...decisionSubjects]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([decisionId, subjects]) => ({
        id: decisionId,
        subjects: [...new Set(subjects)].sort(),
      })),
  };
});

// Retain the unit relationships that aggregation would otherwise erase, including anchored
// or inferred claims as supplied by the graph, never a reconstruction of imports or calls.
const usesEdges = edges
  .filter((edge) => edge.type === "uses")
  .map((edge) => ({ from: edge.from, to: edge.to, claim: edge.claim }))
  .sort((left, right) =>
    left.from.localeCompare(right.from) ||
    left.to.localeCompare(right.to) ||
    left.claim.localeCompare(right.claim),
  );
const subjectIds = [...new Set(components.flatMap((component) => component.satisfiedSpecs))].sort();
const subjects = subjectIds.map((id) => {
  const context = g.specContext(id);
  return {
    id,
    resolved: context !== undefined,
    title: context?.title ?? null,
    specKind: context?.specKind ?? null,
    outcome: context?.sections.intent?.outcome ?? null,
    design: context?.sections.design?.description ?? null,
    relations: context?.relationsOut ?? [],
  };
});

return { components, subjects, usesEdges, unresolvedUses };
```

Membership, uses, and satisfies remain the derived structural edges; shaping decisions are the
`decidedBy` targets of Specs those members realize. Fan counts are graph-side composition, not a
new reader accessor. A `memberOf` target with no component node keeps a `declared: false` row, and
a `uses` edge with no resolvable owner on either end lands in `unresolvedUses` — dangling structure
stays visible instead of silently dropping out of the map.

`subjects` supplies each realized Spec's title, kind, outcome, design description, and outgoing
relations with claims and resolution. `realizations` keeps the binding from each component or
member to its responsibility. `usesEdges` retains original endpoints and claims, so shared policy
and adapter collaborations remain visible below component grain. Fan counts count distinct other
components; a collaboration within a component stays in `usesEdges` without making the component
its own dependency. The live corpus carries anchored structural declarations; the query preserves
any claim supplied by the graph. It does not compute exhaustive import reach.

For worked examples and the gen-1 design comparison, see [Architecture through the graph](architecture.md).

## 18. Decision map

*When you need this: you want every decision record with its inter-decision relations
(dependsOn, refines, supersedes) and the Specs it decides, ranked by how much it shapes.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const decisionNodes = graph.nodes
  .filter(
    (node) =>
      node.nodeType === "Primitive" &&
      node.specKind === "decision" &&
      typeof node.id === "string",
  )
  .sort((left, right) => left.id.localeCompare(right.id));
const decisionIds = new Set(decisionNodes.map((node) => node.id));
const interDecisionEdges = graph.edges.filter(
  (edge) =>
    (edge.type === "dependsOn" || edge.type === "supersedes" || edge.type === "refines") &&
    decisionIds.has(edge.from) &&
    decisionIds.has(edge.to),
);
const subjectsByDecision = new Map();

for (const edge of graph.edges.filter(
  (edge) => edge.type === "decidedBy" && decisionIds.has(edge.to),
)) {
  const subjects = subjectsByDecision.get(edge.to) ?? [];
  subjects.push(edge.from);
  subjectsByDecision.set(edge.to, subjects);
}

const familyOf = (id) => {
  const unprefixed = id.startsWith("spec:") ? id.slice("spec:".length) : id;
  return unprefixed.split(".")[0] || "unknown";
};
const decisions = decisionNodes.map((node) => {
  const outgoing = interDecisionEdges.filter((edge) => edge.from === node.id);
  const incoming = interDecisionEdges.filter((edge) => edge.to === node.id);
  const decidedSubjects = [...new Set(subjectsByDecision.get(node.id) ?? [])].sort();
  const decidedSubjectsByFamily = Object.create(null);

  for (const subjectId of decidedSubjects) {
    const family = familyOf(subjectId);
    decidedSubjectsByFamily[family] = decidedSubjectsByFamily[family] ?? [];
    decidedSubjectsByFamily[family].push(subjectId);
  }

  const fanInByType = {
    dependsOn: incoming.filter((edge) => edge.type === "dependsOn").length,
    refines: incoming.filter((edge) => edge.type === "refines").length,
    supersedes: incoming.filter((edge) => edge.type === "supersedes").length,
    decidedBy: decidedSubjects.length,
  };

  return {
    id: node.id,
    title: node.title ?? null,
    fanIn: fanInByType.dependsOn + fanInByType.refines + fanInByType.decidedBy,
    fanInByType,
    dependsOn: outgoing
      .filter((edge) => edge.type === "dependsOn")
      .map((edge) => edge.to)
      .sort(),
    dependedOnBy: incoming
      .filter((edge) => edge.type === "dependsOn")
      .map((edge) => edge.from)
      .sort(),
    refines: outgoing
      .filter((edge) => edge.type === "refines")
      .map((edge) => edge.to)
      .sort(),
    refinedBy: incoming
      .filter((edge) => edge.type === "refines")
      .map((edge) => edge.from)
      .sort(),
    supersedes: outgoing
      .filter((edge) => edge.type === "supersedes")
      .map((edge) => edge.to)
      .sort(),
    supersededBy: incoming
      .filter((edge) => edge.type === "supersedes")
      .map((edge) => edge.from)
      .sort(),
    decidedSubjectsByFamily,
  };
});
const ranking = decisions
  .map((decision) => ({ id: decision.id, fanIn: decision.fanIn }))
  .sort((left, right) => right.fanIn - left.fanIn || left.id.localeCompare(right.id));

return { total: decisions.length, ranking, decisions };
```

Ranking is the shaping fan-in: inbound `dependsOn` and `refines` among decision Specs plus the
`decidedBy` subjects the decision shapes. Being superseded is replacement, not load-bearing weight,
so `supersedes` is reported per row and in `fanInByType` but excluded from the rank. Independence
is the absence of an edge; `decidedBy` subjects stay grouped by family.

## 19. Planning slice

*When you need this: you want one Spec's refinement and dependency neighborhood, shaping
decisions, bound components, verifiers, and file-level entry points.*

The parameter is `params.spec`, the Spec you are planning around; an unknown id returns
`{ id, found: false }` rather than failing.

```js
const accepts = ["spec"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const id = params.spec ?? "spec:consumers.agent-surface";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const implementations = context.implementations;
const verifiers = context.verifiers;
const parents = [...new Set(
  graph.edges
    .filter((edge) => edge.type === "refines" && edge.from === id)
    .map((edge) => edge.to),
)].sort();
const children = [...new Set(
  graph.edges
    .filter((edge) => edge.type === "refines" && edge.to === id)
    .map((edge) => edge.from),
)].sort();
const readinessById = new Map(g.specs().map((spec) => [spec.id, spec.statedReadiness]));
const dependencyNeighbors = (type, end) => {
  const reasons = new Map();
  for (const edge of graph.edges.filter(
    (edge) => edge.type === type && edge[end === "to" ? "from" : "to"] === id,
  )) {
    if (!reasons.has(edge[end]) || reasons.get(edge[end]) === undefined) {
      reasons.set(edge[end], edge.reason);
    }
  }
  return [...reasons.keys()].sort().map((specId) => ({
    id: specId,
    statedReadiness: readinessById.get(specId) ?? null,
    ...(reasons.get(specId) === undefined ? {} : { reason: reasons.get(specId) }),
  }));
};
const dependsOn = dependencyNeighbors("dependsOn", "to");
const dependedOnBy = dependencyNeighbors("dependsOn", "from");
const byCodeUnit = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const reasons = graph.edges
  .filter((edge) => edge.claim === "declared" && (edge.from === id || edge.to === id) && edge.reason !== undefined)
  .map(({ type, from, to, reason }) => ({ type, from, to, reason }))
  .sort((a, b) => byCodeUnit(a.type, b.type) || byCodeUnit(a.from, b.from) || byCodeUnit(a.to, b.to));
const neighborhoodIds = new Set([id, ...parents, ...children]);
const decisionsById = new Map();

for (const edge of graph.edges.filter(
  (edge) => edge.type === "decidedBy" && neighborhoodIds.has(edge.from),
)) {
  const subjects = decisionsById.get(edge.to) ?? [];
  subjects.push(edge.from);
  decisionsById.set(edge.to, subjects);
}

const codeNodesById = new Map(
  graph.nodes
    .filter((node) => node.nodeType === "CodeNode")
    .map((node) => [node.id, node]),
);
const componentIds = new Set(
  [...codeNodesById.keys()].filter((nodeId) => nodeId.startsWith("component:")),
);
const componentsById = new Map();

for (const binding of implementations) {
  if (componentIds.has(binding.codeId)) {
    const bound = componentsById.get(binding.codeId) ?? {
      direct: false,
      implementations: new Set(),
    };
    bound.direct = true;
    componentsById.set(binding.codeId, bound);
    continue;
  }

  for (const edge of graph.edges.filter(
    (edge) => edge.type === "memberOf" && edge.from === binding.codeId,
  )) {
    const bound = componentsById.get(edge.to) ?? {
      direct: false,
      implementations: new Set(),
    };
    bound.implementations.add(binding.codeId);
    componentsById.set(edge.to, bound);
  }
}

const components = [...componentsById]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([componentId, bound]) => {
    const component = codeNodesById.get(componentId);
    return {
      id: componentId,
      label: component?.label ?? null,
      file: component?.file ?? null,
      line: component?.line ?? null,
      directlySatisfies: bound.direct,
      implementations: [...bound.implementations].sort(),
    };
  });
const entryPoints = [];
const addEntryPoint = (role, subjectId, file, line) => {
  if (typeof file !== "string") return;
  entryPoints.push({ role, id: subjectId, file, line: line ?? null });
};

addEntryPoint("spec", id, context.file);
for (const binding of implementations) {
  addEntryPoint("implementation", binding.codeId, binding.file, binding.line);
}
for (const binding of verifiers) {
  addEntryPoint("verifier", binding.verifierId, binding.file, binding.line);
}
for (const component of components) {
  addEntryPoint("component", component.id, component.file, component.line);
}

const uniqueEntryPoints = [...new Map(
  entryPoints.map((entry) => [`${entry.role}:${entry.id}:${entry.file}:${entry.line}`, entry]),
).values()].sort(
  (left, right) =>
    left.file.localeCompare(right.file) ||
    left.role.localeCompare(right.role) ||
    String(left.id).localeCompare(String(right.id)),
);

return {
  id,
  found: true,
  refinementNeighborhood: { parents, children },
  dependencies: { dependsOn, dependedOnBy },
  reasons,
  shapingDecisions: [...decisionsById]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([decisionId, subjects]) => ({
      id: decisionId,
      subjects: [...new Set(subjects)].sort(),
    })),
  implementations: implementations
    .map((binding) => ({
      id: binding.codeId,
      claim: binding.claim,
      file: binding.file ?? null,
      line: binding.line ?? null,
    })),
  components,
  verifiers: verifiers.map((binding) => ({
    id: binding.verifierId,
    via: binding.via,
    claim: binding.claim,
    enabled: binding.enabled,
    file: binding.file ?? null,
    line: binding.line ?? null,
  })),
  entryPoints: uniqueEntryPoints,
  entryPointsLimit: "file-level graph-recorded paths only; no symbol-level impact graph",
};
```

`entryPoints` is file-level graph-recorded paths only — carrier, implementation, verifier, and
component files. It is not the impact contract; whole-corpus blast radius over changed files stays
recipe 4 (`g.blastRadius`). Shaping decisions are the `decidedBy` targets across the refinement
neighborhood; a decision record that also `refines` the subject appears both as a refinement child
and as a shaping decision. `reasons` lists every authored relation into or out of the subject
that states a reason, as `{ type, from, to, reason }`, sorted by type, then source id, then target id.
Dependency neighbors carry `statedReadiness` because an unready
`dependsOn` target holds back the subject's `ready`, and `reason` when the relation states one. For every Spec the subject rests on, across `refines`, `dependsOn`,
`constrainedBy`, and `decidedBy`, with the floor each one reaches, use dependency footing
(recipe 21). The graph does not derive symbol-level impact;
`implemented` still means a code anchor binds, never that the code is live.

## 20. Open-question register

*When you need this: you want every open question in the corpus in one table, blocking ones
first, without keeping that table by hand.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const rows = [];
const malformed = [];

for (const spec of g.specs()) {
  const authored = g.specContext(spec.id)?.sections?.intent?.openQuestions;
  if (authored === undefined) continue;
  const bad = (entry, reason) =>
    malformed.push({
      id: spec.id,
      section: "intent",
      entry,
      reason,
    });
  if (!Array.isArray(authored)) {
    bad("openQuestions", "Expected a list");
    continue;
  }

  const questions = [];
  authored.forEach((entry, index) => {
    const question = typeof entry === "string" ? entry : entry?.question;
    if (typeof question !== "string" || question.trim().length === 0) {
      bad(`openQuestions[${index}]`, "Expected non-empty question text");
      return;
    }
    if (
      typeof entry !== "string" &&
      (typeof entry !== "object" ||
        entry === null ||
        Array.isArray(entry) ||
        ("blocking" in entry && typeof entry.blocking !== "boolean"))
    ) {
      bad(`openQuestions[${index}]`, "Expected a question and boolean blocking flag");
      return;
    }
    if (
      typeof entry !== "string" &&
      "key" in entry &&
      (typeof entry.key !== "string" || !/^[a-z][A-Za-z0-9]*$/u.test(entry.key))
    ) {
      bad(`openQuestions[${index}]`, "Expected a lower-camel question key");
      return;
    }
    questions.push({
      blocking: typeof entry === "string" ? false : entry.blocking ?? false,
      question,
      key: typeof entry === "string" ? null : entry.key ?? null,
      decider: typeof entry === "string" ? null : entry.decider ?? null,
      links: typeof entry === "string" ? [] : entry.links ?? [],
      provisional: typeof entry === "string" ? null : entry.provisional ?? null,
      trigger: typeof entry === "string" ? null : entry.trigger ?? null,
      deferral: typeof entry !== "string" && entry.trigger !== undefined,
    });
  });
  if (questions.length === 0) continue;
  rows.push({
    id: spec.id,
    statedReadiness: spec.statedReadiness,
    totals: { blocking: questions.filter((entry) => entry.blocking).length },
    questions,
  });
}

const questionCount = rows.reduce((sum, row) => sum + row.questions.length, 0);
const blockingCount = rows.reduce((sum, row) => sum + row.totals.blocking, 0);
const withBlocking = rows.filter((row) => row.totals.blocking > 0);

return {
  totals: {
    questions: questionCount,
    blocking: blockingCount,
    nonBlocking: questionCount - blockingCount,
    deferrals: rows.reduce((sum, row) => sum + row.questions.filter((question) => question.deferral).length, 0),
    holds: rows.reduce((sum, row) => sum + row.questions.filter((question) => question.blocking && !question.deferral).length, 0),
    specs: rows.length,
    specsWithBlocking: withBlocking.length,
    malformed: malformed.length,
  },
  specs: [...withBlocking, ...rows.filter((row) => row.totals.blocking === 0)],
  malformed,
};
```

Each row is one Spec that records open questions under Intent: its stated readiness,
`totals.blocking`, and the questions in authored order with their flags and keys. A question's
`key` is the one its marker carries, `[blocking #aggregateReach]`, which prose cites as
`spec:<id>#question.aggregateReach`; a question without a key has `key: null`. Specs that hold a
blocking question come first, and each group keeps Spec id order. `totals` reports the question
and Spec counts, so the size of the register never needs a second query or a number copied into
prose. The recipe lists and does not judge: a blocking question holding its Spec below `defined`
is the readiness floor's clause, which recipe 9 names for one Spec. A question authored as bare
prose or as an object with no `blocking` flag in a TypeScript carrier reads as non-blocking.
`malformed` reports collections that are not lists, entries without non-empty question text,
entries whose `blocking` flag is present but is not a boolean, and entries whose `key` is present
but is not a lower-camel string. Those entries do not count as questions.

The question columns include `decider`, `links`, `provisional` and `trigger`. Missing text fields
are null and missing links are an empty list. A question with a trigger has `deferral: true`.
The totals count those deferrals apart from holds, blocking questions without a trigger.

## 21. Dependency footing

*When you need this: you are weighing `ready` on one Spec and want every Spec it rests on, with
the rung each one states and the floor each one reaches. For the floor's verdict on the Spec
itself, run promotion preflight (recipe 9).*

The parameter is `params.spec`, the Spec you are weighing; an unknown id returns
`{ id, found: false }` rather than failing.

```js
const accepts = ["spec"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const id = params.spec ?? "spec:extraction.derive-graph";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const types = ["refines", "dependsOn", "constrainedBy", "decidedBy"];
const rungs = ["idea", "scoped", "defined", "ready"];
const specsById = new Map(g.specs().map((spec) => [spec.id, spec]));
const footing = context.relationsOut
  .filter((end) => types.includes(end.type))
  .map((end) => {
    const target = specsById.get(end.otherId);

    return {
      type: end.type,
      id: end.otherId,
      claim: end.claim,
      resolved: end.resolved,
      ...(end.reason === undefined ? {} : { reason: end.reason }),
      statedReadiness: target?.statedReadiness ?? null,
      floorReached: target === undefined ? null : (target.derivedReadiness ?? "none"),
    };
  })
  .sort(
    (left, right) =>
      types.indexOf(left.type) - types.indexOf(right.type) || left.id.localeCompare(right.id),
  );
const count = (key, value) => footing.filter((row) => row[key] === value).length;

return {
  id,
  found: true,
  statedReadiness: context.statedReadiness,
  floorReached: context.derivedReadiness ?? "none",
  totals: {
    relations: footing.length,
    byType: Object.fromEntries(types.map((type) => [type, count("type", type)])),
    byStatedReadiness: Object.fromEntries([
      ...rungs.map((rung) => [rung, count("statedReadiness", rung)]),
      ["unresolved", count("resolved", false)],
      ["nonSpec", footing.filter((row) => row.resolved && row.statedReadiness === null).length],
    ]),
    byFloorReached: Object.fromEntries([
      ...[...rungs, "none"].map((rung) => [rung, count("floorReached", rung)]),
    ]),
  },
  footing,
};
```

`footing` holds one row per relation the Spec declares through `refines`, `dependsOn`,
`constrainedBy`, or `decidedBy`, in that order and then by target id, with `reason` when the
relation states one. The reach is one hop; run
the recipe on a target to see what that target rests on. `floorReached` is the target's derived
readiness, read beside the rung its author stated. A target that does not resolve keeps its row
with `resolved: false` and null readiness, and counts under `totals.byStatedReadiness.unresolved`.
Resolved targets that are not Specs have null readiness and count under
`totals.byStatedReadiness.nonSpec`. The recipe reports readiness and applies no threshold: which rung a target must state before this
Spec can state `ready` is the floor clause carried by `spec:validation.typed-dependency-floor`.
`verifies` and `supersedes` stay out, because a Spec does not rest on what it verifies or replaces.

## 22. Mention audit

*When you need this: you want every Spec id or entry address written in prose that does not
resolve, or that no declared relation backs in either direction. The `reverseOnly` list stays a
separate audit list, for mentions backed only by a relation from the target.*

The parameter is `params.scope`, a list of Spec ids to audit mentions from those Specs only. An
empty or absent list audits the whole corpus.

```js
const accepts = ["scope", "intended"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const scope = params.scope ?? [];
const intendedRows = params.intended ?? [];
const backingTypes = [
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
  "verifies",
  "supersedes",
];
const escapePattern = /\\([!-/:-@[-`{-~])/gu;
const idPattern =
  /(?<![A-Za-z0-9-])spec:(?:[^\p{White_Space}\P{ASCII}`"\u0027()[\]{}<>|]|[^\p{ASCII}\p{White_Space}\p{Pd}\p{Ps}\p{Pe}\p{Pi}\p{Pf}\p{Po}\p{S}\p{Z}])*/gu;
const mentionPattern =
  /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*(?:#(design|ui|question|rule|term)\.([a-z][A-Za-z0-9]*))?$/u;
const specIds = new Set(g.specs().map((spec) => spec.id));
const declared = new Map();

for (const edge of graph.edges) {
  if (edge.claim !== "declared" || !backingTypes.includes(edge.type)) continue;
  const key = `${edge.from} ${edge.to}`;
  declared.set(key, [...(declared.get(key) ?? []), edge.type]);
}

const pairs = new Map();
const unresolvedPairs = new Map();
const record = (map, from, to, at, reason) => {
  const key = `${from} ${to}`;
  const pair = map.get(key) ?? {
    from,
    to,
    ...(reason === undefined ? {} : { reason }),
    totals: { occurrences: 0 },
    at: [],
  };
  pair.totals.occurrences += 1;
  if (!pair.at.some((location) => location.section === at.section && location.entry === at.entry))
    pair.at.push(at);
  map.set(key, pair);
};
let occurrences = 0;

for (const spec of g.specs()) {
  if (scope.length > 0 && !scope.includes(spec.id)) continue;
  const context = g.specContext(spec.id);
  if (context === undefined) continue;

  const texts = [];
  const collect = (value, section, entry = null) => {
    if (typeof value === "string") {
      texts.push({ at: { section, entry }, text: value, link: section === "intent" && /^openQuestions\[\d+\]\.links\[\d+\]$/u.test(entry ?? "") });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => collect(item, section, `${entry ?? ""}[${index}]`));
    } else if (typeof value === "object" && value !== null) {
      for (const [key, item] of Object.entries(value))
        collect(item, section, entry === null ? key : `${entry}.${key}`);
    }
  };

  collect(context.narrative, "narrative");

  for (const [section, content] of Object.entries(context.sections ?? {})) {
    if (section === "model" && typeof content === "object" && content !== null && !Array.isArray(content)) {
      for (const [key, value] of Object.entries(content)) {
        if (key !== "termKeys") collect(value, section, key);
      }
      continue;
    }
    if (section !== "behavior" || typeof content !== "object" || content === null) {
      collect(content, section);
      continue;
    }

    // The two fences are skipped by position, never by key name alone: `behavior.exampleSpace`
    // is the gwt-vocabulary fence, and an object entry of `behavior.examples` is a gwt fence.
    for (const [key, entry] of Object.entries(content)) {
      if (key === "exampleSpace" || key === "stepKeys") continue;
      if (key === "examples" && Array.isArray(entry)) {
        entry.forEach((example, index) => {
          if (typeof example !== "object" || example === null || Array.isArray(example))
            collect(example, "behavior", `examples[${index}]`);
        });
        continue;
      }
      collect(entry, "behavior", key);
    }
  }

  for (const { at, text, link } of texts) {
    const tokens = link ? [text] : [...text.replace(escapePattern, "$1").matchAll(idPattern)]
      .map((match) => match[0].slice("spec:".length).replace(/[.,;:!?*_~]+$/u, ""))
      .filter((rest) => rest !== "").map((rest) => `spec:${rest}`);
    for (const token of tokens) {
      if (token === spec.id) continue;
      occurrences += 1;
      const parsed = mentionPattern.exec(token);
      if (parsed === null) {
        record(unresolvedPairs, spec.id, token, at, "malformed");
        continue;
      }
      const to = token.split("#")[0];
      if (!specIds.has(to)) {
        record(unresolvedPairs, spec.id, token, at, "spec");
        continue;
      }
      const [, section, key] = parsed;
      if (section !== undefined) {
        const sections = g.specContext(to)?.sections ?? {};
        const questions = sections.intent?.openQuestions;
        const holds =
          section === "question"
            ? Array.isArray(questions) &&
              questions.some((entry) => typeof entry === "object" && entry !== null && entry.key === key)
            : section === "rule"
              ? Object.hasOwn(sections.behavior?.ruleKeys ?? {}, key)
              : section === "term"
                ? Object.hasOwn(sections.model?.termKeys ?? {}, key)
                : key !== "description" && Object.hasOwn(sections[section] ?? {}, key);
        if (!holds) record(unresolvedPairs, spec.id, token, at, "entry");
      }
      if (to !== spec.id) record(pairs, spec.id, to, at);
    }
  }
}

const rows = [...pairs.values()].sort(
  (left, right) => left.from.localeCompare(right.from) || left.to.localeCompare(right.to),
);
const unresolved = [...unresolvedPairs.values()].sort(
  (left, right) => left.from.localeCompare(right.from) || left.to.localeCompare(right.to),
);
const withoutForward = rows.filter(
  (row) => specIds.has(row.to) && !declared.has(`${row.from} ${row.to}`),
);
const unbacked = withoutForward.filter((row) => !declared.has(`${row.to} ${row.from}`));
const reverseOnly = withoutForward.filter((row) => declared.has(`${row.to} ${row.from}`));
const intendedByPair = new Map(intendedRows.map((row) => [`${row.from} ${row.to}`, row]));
const intended = unbacked.filter((row) => intendedByPair.has(`${row.from} ${row.to}`))
  .map((row) => ({...row, reason: intendedByPair.get(`${row.from} ${row.to}`).reason}));
const staleIntended = intendedRows.filter((row) => !unbacked.some((pair) => pair.from === row.from && pair.to === row.to));

return {
  totals: {
    occurrences,
    pairs: rows.length + unresolved.length,
    backed: rows.length - withoutForward.length,
    unbacked: unbacked.length,
    reverseOnly: reverseOnly.length,
    unresolved: unresolved.length,
  },
  unresolved,
  unbacked: unbacked.filter((row) => !intendedByPair.has(`${row.from} ${row.to}`)),
  intended,
  staleIntended,
  reverseOnly,
};
```

A mention starts at `spec:` where the character before it, if any, is not an ASCII letter, an
ASCII digit, or `-`. A backslash before ASCII punctuation is read as that punctuation, as Markdown
reads an escape. The token ends at ASCII whitespace, at one of the ASCII delimiters `` ` `` `"` `'`
`(` `)` `[` `]` `{` `}` `<` `>` `|`, or at a character outside ASCII that is whitespace, U+0085
included, punctuation other than connector punctuation, a symbol, or a space, line, or paragraph
separator, so every dash, ellipsis, typographic quote, and arrow ends it. Every other character
stays in the token, letters, combining marks, digits, connector punctuation, control characters
other than whitespace, and format, private-use, and unassigned characters among them. Trailing `.` `,` `;` `:` `!` `?`
`*` `_` `~` are then removed after the prefix, so a sentence, a list, or emphasis may end in an id.
When nothing remains after `spec:`, there is no mention, so a bare prefix or a placeholder such as
`spec:<id>` stays prose. The whole token is checked: `spec:foo_bar`, `spec:foo/bar`,
`spec:foo,spec:bar`, `spec:fooé`, `spec:foo\_bar`, and `spec:foo` followed by a combining mark, a
zero-width space, or a NUL are `"malformed"`, never read as `spec:foo`. The scan reads narrative and every
string under sections, except `behavior.exampleSpace` and object entries of `behavior.examples`.
Titles are not scanned.
A token equal to the scanning Spec's own id is skipped; its own entry addresses are checked.

Each row keeps every distinct location in `at` as `{ section, entry }`, with zero-based indexes
inside `entry`, and counts token occurrences in `totals.occurrences`.
`unresolved` groups by mentioning Spec and token, with `reason: "malformed"` for a refused id or
address, `"spec"` for an absent Spec, and `"entry"` for an absent own section key, `description`
in Design or UI, a question key no open question of the Spec carries, or a rule key no rule or
flow carries, or a term key no Model term carries.
An entry address is `spec:<id>#design.<key>` or `spec:<id>#ui.<key>`, with a key matching
`^[a-z][A-Za-z0-9]*$`. It resolves against the named Spec's own section keys. An entry address may
also be `spec:<id>#question.<key>`, which resolves when one of the named Spec's open questions
carries that key in its marker, or `spec:<id>#rule.<key>`, which resolves when the Spec's
`behavior.ruleKeys` carries that key; there `description` is an ordinary key. A `spec:<id>#term.<key>` address resolves when `model.termKeys` carries its key.

`unbacked` and `reverseOnly` group valid mentions by mentioning Spec and target Spec, combining
Spec-level mentions and addresses, including missing entries. Self-addresses never enter these
lists. `unbacked` has no declared relation in either direction; `reverseOnly` has a relation only
from the target. The backing relations are `refines`, `dependsOn`, `constrainedBy`, `decidedBy`,
`verifies`, and `supersedes`. A parent naming its child lands in `reverseOnly`.
`totals.pairs` counts target pairs plus unresolved token pairs, which may overlap for missing
entries; `totals.backed` counts target pairs backed by a forward relation.
`sdp validate` checks the same mentions under `spec:validation.prose-mentions`: an error for each
unresolved token, and one warning per `unbacked` pair that gives its location count and its first
location. This audit adds what the validator leaves out: a `scope` of chosen Specs, the `reverseOnly` list, and
every location of every pair.

`params.intended` is an optional list of `{ from, to, reason }` rows using whole Spec ids.
`intended` holds matching unbacked pairs with their reasons. The remaining pairs stay in
`unbacked`, and `staleIntended` lists supplied rows that match no current unbacked pair in the
chosen scope. `totals.unbacked` counts both lists, matching the validator's warnings. The
validator reads no intended list and its warnings stand. Question links are checked as complete
ids or addresses.

## 23. Entry search

*When you need this: you hold a word or a key and want the entries that carry it, where concept
search (recipe 6) stops at the section.*

The parameter is `params.term`, your word or phrase; an empty term returns no matches.

```js
const accepts = ["term"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const term = params.term ?? "suffix";
const tokensOf = (text) =>
  text
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 0);
const wanted = tokensOf(term);
const hits = (text) => {
  const tokens = tokensOf(text);

  return (
    wanted.length > 0 &&
    tokens.some((_token, start) =>
      wanted.every((token, offset) => tokens[start + offset] === token),
    )
  );
};
const matches = [];

for (const spec of g.specs()) {
  const context = g.specContext(spec.id);
  if (context === undefined) continue;

  const questions = context.sections?.intent?.openQuestions;
  const questionKeyOf = (entry) => {
    const index = /^openQuestions\[(\d+)\]\.question$/u.exec(entry ?? "")?.[1];
    const key =
      index === undefined || !Array.isArray(questions) ? undefined : questions[Number(index)]?.key;
    return typeof key === "string" && /^[a-z][A-Za-z0-9]*$/u.test(key) ? key : null;
  };
  const ruleKeys = context.sections?.behavior?.ruleKeys ?? {};
  const ruleKeyOf = (entry) => Object.keys(ruleKeys).find((key) => ruleKeys[key] === entry) ?? null;
  const termKeys = context.sections?.model?.termKeys ?? {};
  const terms = context.sections?.model?.terms ?? {};
  const termKeyOf = (entry) => Object.keys(termKeys).find((key) => `terms.${termKeys[key]}` === entry) ?? null;
  const addressOf = (section, entry) => {
    if (section === "model") {
      const key = termKeyOf(entry);
      return key === null ? null : `${spec.id}#term.${key}`;
    }
    if (section === "behavior") {
      const key = ruleKeyOf(entry);
      return key === null ? null : `${spec.id}#rule.${key}`;
    }
    if (section === "intent") {
      const key = questionKeyOf(entry);
      return key === null ? null : `${spec.id}#question.${key}`;
    }
    return (section === "design" || section === "ui") &&
      entry !== "description" &&
      /^[a-z][A-Za-z0-9]*$/u.test(entry ?? "")
      ? `${spec.id}#${section}.${entry}`
      : null;
  };
  const lines = new Map(context.entryLocations.map((location) => [location.entry, location.line]));
  // A Design or UI line is looked up by the top-level key the walk carries, never by the joined
  // path: a literal key `a.b` and a nested `a: { b }` join to one path, and only the top-level
  // entry has a row in the location table.
  const lineOf = (section, entry, topKey) => {
    const question = /^openQuestions\[(\d+)\](?:\.(question|decider|links|provisional|trigger)(?:\[\d+\])?)?$/u.exec(entry ?? "");
    const index = question?.[1];
    const rule = /^(rules|flows)\[(\d+)\]$/u.exec(entry ?? "");
    const termIndex = section === "model" ? Object.keys(terms).findIndex((term) => `terms.${term}` === entry) : -1;
    const located = termIndex >= 0 ? `term[${termIndex}]` :
      section === "intent" && index !== undefined
        ? `question[${index}]${question[2] && question[2] !== "question" ? "." + question[2] : ""}`
        : section === "behavior" && rule !== null
          ? `${rule[1] === "rules" ? "rule" : "flow"}[${rule[2]}]`
        : (section === "design" || section === "ui") && topKey !== null
          ? `${section}.${topKey}`
          : null;
    return lines.get(located) ?? null;
  };
  const row = (section, entry, matchedIn, text, topKey) => ({
    id: spec.id,
    section,
    entry,
    address: addressOf(section, entry),
    line: lineOf(section, entry, topKey),
    matchedIn,
    text,
  });
  const visit = (section, entry, key, text, topKey) => {
    const matchedIn = [
      ...(key !== null && (hits(key) || (section === "model" && hits(termKeyOf(entry) ?? ""))) ? ["key"] : []),
      ...(hits(text) ? ["text"] : []),
    ];
    if (matchedIn.length > 0) matches.push(row(section, entry, matchedIn, text, topKey));
  };
  const walk = (section, value, entry, key, topKey) => {
    if (typeof value === "string") {
      visit(section, entry, key, value, topKey);
      return;
    }
    if (key !== null && hits(key)) {
      matches.push(row(section, entry, ["key"], JSON.stringify(value), topKey));
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const path = `${entry ?? ""}[${index}]`;
        walk(section, item, path, section === "behavior" ? ruleKeyOf(path) : null, null);
      });
    } else if (typeof value === "object" && value !== null) {
      // A key the author coins is content: any key of the open sections (`design`, `ui`) except
      // `description`, a `model.terms` term, and the key of an open question, which travels with
      // the text of that question and is never a row of its own. A key the carrier fixes
      // (`outcome`, `rules`, `given`) is structure and never matches.
      const coined =
        section === "design" || section === "ui" || (section === "model" && entry === "terms");
      for (const [name, item] of Object.entries(value)) {
        const path = entry === null ? name : `${entry}.${name}`;
        if (section === "behavior" && entry === null && (name === "ruleKeys" || name === "stepKeys")) continue;
        if (section === "model" && entry === null && name === "termKeys") continue;
        if (section === "intent" && /^openQuestions\[\d+\]\.key$/u.test(path)) continue;
        walk(
          section,
          item,
          path,
          coined && !(entry === null && name === "description")
            ? name
            : section === "intent"
              ? questionKeyOf(path)
              : null,
          entry === null ? name : null,
        );
      }
    }
  };

  if (typeof context.narrative === "string") {
    visit("narrative", null, null, context.narrative, null);
  }
  for (const [section, content] of Object.entries(context.sections ?? {})) {
    walk(section, content, null, null, null);
  }
}

return {
  term,
  tokens: wanted,
  totals: {
    matches: matches.length,
    specs: new Set(matches.map((match) => match.id)).size,
    shown: Math.min(matches.length, 50),
  },
  matches: matches.slice(0, 50),
};
```

Matching is by whole token. The term and each entry are cut into tokens, which are runs of letters
and digits split at every other character and at each camelCase hump, and compared without case.
The term matches when its tokens appear in the entry as one consecutive run, in order.

| Term | Entry | Result |
|---|---|---|
| `retry` | `retry` | match |
| `retry` | `retryable` | no match, `retryable` is one token |
| `retry` | `retry-worker` | match, the hyphen ends the token |
| `retry` | `retryWorker` | match, the hump ends the token |
| `Retry` | `RETRY.` | match, case and punctuation do not count |
| `retry worker` | `retryWorker` | match, two tokens in order |
| `retry worker` | `worker retry` | no match, the order differs |
| `retry worker` | `retry the worker` | no match, the tokens are not adjacent |

Each row carries `address: string | null`. A Design or UI entry with a key matching
`^[a-z][A-Za-z0-9]*$` has address `spec:<id>#<section>.<key>`. The text of an open question whose
marker carries a key, at `openQuestions[<n>].question`, has address `spec:<id>#question.<key>`,
and that key matches as the row's key; the key is not a row of its own. A keyed rule or flow at
`rules[<n>]` or `flows[<n>]` under Behavior has address `spec:<id>#rule.<key>`. `description` in
Design or UI, off-grammar keys, other nested paths, and every other entry have `address: null`.
A keyed Model term has address `spec:<id>#term.<key>` through `model.termKeys`; its key matches
as a row key, and every Model term takes its line from its `term[<i>]` location row.
Each row also carries `line`, the line in the Spec's carrier where the entry starts, from the
location table the Spec context carries. The table locates a top-level Design or UI key other than
`description` and the text of an open question, at `openQuestions[<n>].question` or, for a question
written as a plain string, at `openQuestions[<n>]`. It also locates rule and flow entries, including
unkeyed entries, and each open question's fields. A question field uses its field's location row.
An entry the table does not locate has `line: null`; null reads as not located, never as absent
(`spec:extraction.entry-locations`). The line comes from the top-level key the walk reaches, never
from the joined path, so a nested `shape: { detail }` reports `line: null` even beside a literal
top-level key `shape.detail`, whose path it spells.
Each row names the Spec, the `section`, the `entry` inside it, and the entry's `text`. `entry` is
the key for a keyed entry (`envelopeSketch`, `terms.claim inheritance`), the field and zero-based
index for a list entry (`rules[2]`), and `null` for the Spec's narrative, which is reported under
the section name `narrative`. `matchedIn` says whether the key, the text, or both matched.
A key matches whatever its value is. A non-string value renders as JSON and reports
`matchedIn: ["key"]`; the front door shortens long text in default output just as it does for
strings. Nested strings remain searchable at paths such as `retryPolicy.mode` or
`retryWorkers[0]`. Keys match only where the author coins them: the keys of `design` and `ui`,
the terms of `model`, the keys of open questions, and rule keys beside their rule or flow text.
Field names the carrier fixes, such as `outcome` or `rules`, never match. Step text inside `gwt`
and `gwt-vocabulary` fences is searched like any other entry. Titles and ids stay with concept
search. Rows keep Spec id order and then the order the graph holds the entries;
`totals.matches` counts every matching entry, `totals.specs` counts the matching Specs, and `totals.shown` counts
the rows shown. `matches` holds the first fifty.

## 24. Pinned declarations

*When you need this: you want every signature, type, validator or table a corpus pins as a
one-line code span opening a keyed Design entry. The list is the input to any derived declarations
module and what a Design Review reads before it compares code with the Spec.*

A declaration is the code span that opens the value of one keyed Design entry, as
`spec:extraction.contract-declarations` rules. The body opens a span at a backtick run of any
length and closes it at the next run of exactly that length on the same line, as the inline code
span law states. It returns the content between the runs as authored and parses no language inside
it. The `description` entry and any value that is not a string are not declarations and are
skipped. Keys carry the adopter's own role prefixes. The Protocol fixes no vocabulary, so group
rows by prefix in your own corpus if you need to.

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const rows = [];
for (const spec of g.specs()) {
  const design = g.specContext(spec.id)?.sections?.design;
  if (design === undefined) continue;
  for (const [key, value] of Object.entries(design)) {
    if (key === "description" || typeof value !== "string") continue;
    const span = /^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u.exec(value);
    if (span) rows.push({ spec: spec.id, key, declaration: span[2] });
  }
}
return { totals: { entries: rows.length, specs: new Set(rows.map((row) => row.spec)).size }, rows };
```

## 25. Address resolution

*When you need this: you hold entry addresses written outside the Specs, in a register, a test,
or a page, and want to know which still resolve.*

The parameter is `params.addresses`, the list of addresses you hold; an empty list returns no
rows. A long list belongs in a file passed as `--params @PATH`.
`params.severity` is `"error"` by default or `"warning"`; another value returns diagnostics.

```js
const accepts = ["addresses", "severity"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const severity = Object.hasOwn(params, "severity") ? params.severity : "error";
if (severity !== "error" && severity !== "warning") {
  return { diagnostics: [{ parameter: "severity", problem: "Expected error or warning." }] };
}
const addresses = params.addresses ?? [
  "spec:consumers.design-review#ui.packPage",
  "spec:consumers.design-review#ui.memberTable",
  "spec:consumers.absent#design.anyKey",
  "spec:consumers.design-review",
];
const expected = "spec:<id>#<section>.<key>, section design, ui, question, rule, or term; key lower-camel ASCII";
const pattern = /^(spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*)#(design|ui|question|rule|term)\.([a-z][A-Za-z0-9]*)$/u;
const specIds = new Set(g.specs().map((spec) => spec.id));
const rows = addresses.map((address) => {
  const parsed = typeof address === "string" ? pattern.exec(address) : null;
  const [, id = null, section = null, key = null] = parsed ?? [];
  const miss = (reason, extra = {}) => ({address, resolves: false, id, section, key,
    value: null, file: null, line: null, reason, ...extra});
  if (parsed === null) return miss("malformed", {expected});
  if (!specIds.has(id)) return miss("spec");
  const context = g.specContext(id);
  const sections = context.sections ?? {};
  const entries = section === "question" ? sections.intent?.openQuestions
    : section === "rule" ? sections.behavior?.ruleKeys
    : section === "term" ? sections.model?.termKeys : sections[section];
  if (entries === undefined || entries === null || typeof entries !== "object") return miss("section", {available: []});
  const available = (section === "question"
    ? entries.flatMap((entry) => typeof entry?.key === "string" ? [entry.key] : [])
    : Object.keys(entries).filter((name) => section === "rule" || section === "term" || name !== "description")).sort();
  if (!available.includes(key)) return miss("entry", {available});
  let entry;
  let value;
  if (section === "question") {
    const index = entries.findIndex((question) => question?.key === key);
    entry = `question[${index}]`;
    value = entries[index].question;
  } else if (section === "rule") {
    const path = entries[key];
    const match = /^(rules|flows)\[(\d+)\]$/u.exec(path);
    value = sections.behavior[match[1]][Number(match[2])];
    entry = `${match[1] === "rules" ? "rule" : "flow"}[${match[2]}]`;
  } else if (section === "term") {
    const term = entries[key];
    entry = `term[${Object.keys(sections.model?.terms ?? {}).indexOf(term)}]`;
    value = sections.model?.terms?.[term];
  } else {
    entry = `${section}.${key}`;
    value = entries[key];
  }
  const location = context.entryLocations.find((row) => row.entry === entry);
  return {address, resolves: true, id, section, key, value,
    file: location?.file ?? null, line: location?.line ?? null, reason: null};
});
const count = (reason) => rows.filter((row) => row.reason === reason).length;
return {
  totals: {addresses: rows.length, resolved: rows.filter((row) => row.resolves).length,
    malformed: count("malformed"), spec: count("spec"), section: count("section"), entry: count("entry")},
  rows,
  findings: rows.filter(row => !row.resolves).map(row => {
    const subjectId = typeof row.address === "string" && row.address.length > 0 ? row.address : JSON.stringify(row.address);
    const why = row.reason === "malformed" ? "not an entry address"
      : row.reason === "spec" ? `no Spec ${row.id}`
      : row.reason === "section" ? `${row.id} has no ${row.section} entries`
      : `${row.id} has no ${row.section} entry ${row.key}`;
    return { validatorId: "unresolved-address", subjectId, severity,
      message: `${subjectId} does not resolve: ${why}` };
  }),
};
```

Each row answers one input in input order, repeats included. A resolving row carries the Spec
id, section, key, value, carrier file and recorded line. An unlocated entry has `line: null`.
A miss keeps the id, section and key it parsed, null where parsing failed. Its reason is
`malformed`, `spec`, `section` or `entry`. A malformed input carries the expected grammar;
a section or entry miss lists the available keys in code-unit order.

Design and UI addresses resolve to their own keys other than `description`. A question address
resolves to a question's text. A rule address reads `behavior.ruleKeys` and resolves to its
rule or flow text, whatever the primary behavior owner. A term address reads `model.termKeys`
and resolves to the term's definition at its `term[<i>]` location. These are the rules the mention
validator applies, carried by `spec:decisions.checked-mentions` and
`spec:consumers.agent-surface.address-and-cycle-recipes`. Recipe 22 audits addresses inside
Specs, and this recipe resolves ones written anywhere else.

## 26. Dependency cycles

*When you need this: you want every place where Specs rest on each other, or on themselves,
through `dependsOn`.*

```js
const accepts = ["severity"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const severity = Object.hasOwn(params, "severity") ? params.severity : "error";
if (severity !== "error" && severity !== "warning") {
  return { diagnostics: [{ parameter: "severity", problem: "Expected error or warning." }] };
}
const ids = g.specs().map((spec) => spec.id);
const known = new Set(ids);
const targets = new Map(ids.map((id) => [id, []]));
for (const edge of graph.edges) {
  if (edge.type === "dependsOn" && edge.claim === "declared" && known.has(edge.from) && known.has(edge.to)) {
    targets.get(edge.from).push(edge.to);
  }
}
for (const list of targets.values()) list.sort();

const order = new Map();
const low = new Map();
const stack = [];
const onStack = new Set();
const sets = [];
const visit = (id) => {
  order.set(id, order.size);
  low.set(id, order.get(id));
  stack.push(id);
  onStack.add(id);
};
const connect = (root) => {
  visit(root);
  const frames = [{ id: root, at: 0 }];
  while (frames.length > 0) {
    const frame = frames[frames.length - 1];
    const list = targets.get(frame.id);
    if (frame.at < list.length) {
      const next = list[frame.at];
      frame.at += 1;
      if (!order.has(next)) {
        visit(next);
        frames.push({ id: next, at: 0 });
      } else if (onStack.has(next)) {
        low.set(frame.id, Math.min(low.get(frame.id), order.get(next)));
      }
      continue;
    }
    frames.pop();
    if (low.get(frame.id) === order.get(frame.id)) {
      const members = [];
      let member;
      do {
        member = stack.pop();
        onStack.delete(member);
        members.push(member);
      } while (member !== frame.id);
      sets.push(members.sort());
    }
    const parent = frames[frames.length - 1];
    if (parent !== undefined) low.set(parent.id, Math.min(low.get(parent.id), low.get(frame.id)));
  }
};
for (const id of ids) if (!order.has(id)) connect(id);

const cycleThrough = (members) => {
  const inside = new Set(members);
  const start = members[0];
  const parent = new Map();
  const queue = [start];
  for (let at = 0; at < queue.length; at += 1) {
    const current = queue[at];
    for (const next of targets.get(current)) {
      if (!inside.has(next)) continue;
      if (next === start) {
        const path = [start];
        for (let step = current; step !== start; step = parent.get(step)) path.splice(1, 0, step);
        return [...path, start];
      }
      if (!parent.has(next)) {
        parent.set(next, current);
        queue.push(next);
      }
    }
  }
  return [];
};

const cycles = sets
  .filter((members) => members.length > 1 || targets.get(members[0]).includes(members[0]))
  .sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0))
  .map((members) => ({ members, cycle: cycleThrough(members) }));

return {
  totals: {
    sets: cycles.filter((entry) => entry.members.length > 1).length,
    selfDependent: cycles.filter((entry) => entry.members.length === 1).length,
    specsInCycles: cycles.reduce((sum, entry) => sum + entry.members.length, 0),
  },
  cycles,
  findings: cycles.map(({ members, cycle }) => {
    const subjectId = members[0];
    const context = g.specContext(subjectId);
    const location = context.entryLocations.find(row => row.entry === `relation.dependsOn.${cycle[1]}`);
    return { validatorId: "dependency-cycle", subjectId, severity,
      message: `${subjectId} rests on itself through dependsOn: ${cycle.join(" -> ")}`,
      file: context.file, ...(location === undefined ? {} : { line: location.line }) };
  }),
};
```

The body reads the whole graph. The walk keeps its own frame stack, so a
dependency chain of any length runs without recursing. Each entry of `cycles` is a set of two or
more Specs in which each Spec reaches every other through declared `dependsOn` edges, or one Spec
that declares `dependsOn` on itself and belongs to no such set. A Spec that reaches a set without
being reached back belongs to none, and an edge whose target is not a Spec in the graph is
ignored. `members` lists the set sorted by id. `cycle` is one closed path through the set: the
shortest that starts and ends at the first member, found by a breadth-first walk over targets in
id order, so a Spec that rests only on itself reads `[id, id]`. Entries keep the order of their
first members. `totals.sets` counts the sets of two or more, `totals.selfDependent` the Specs that
rest only on themselves, and `totals.specsInCycles` every member of either. The recipe reports and
never refuses: a cycle is data about the authored dependencies, and the readiness floor reads each
`dependsOn` target's stated rung without walking a chain. The law is
`spec:consumers.agent-surface.address-and-cycle-recipes`.

Both recipes add `findings` beside their rows or cycles and take `params.severity`, `"error"`
by default or `"warning"`. Another severity returns diagnostics. Each unresolved address and each
cycle yields one finding, so either shipped file can run unchanged under `sdp validate --rules`.

## 27. References into a design

*When you need this: you are reviewing a Pack and want to see, for each member, which code
answers to it, which code realizes it, whether a verifier is bound, and which built Specs it
builds on, with no fact read as another.*

The parameter is `params.pack`, the Pack you are reviewing; an unknown Pack returns
`{ id, found: false }`.

```js
const accepts = ["pack"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const id = params.pack ?? "pack:spec-studio-v1";
const pack = g.packContext(id);

if (pack === undefined) {
  return { id, found: false };
}

const unitsOf = (bindings) => bindings.map((unit) => ({ id: unit.codeId, file: unit.file ?? null }));
const rows = pack.members.map((member) => {
  const context = g.specContext(member.id);
  const buildsOn = (context?.relationsOut ?? [])
    .filter((relation) => relation.type === "dependsOn" || relation.type === "refines")
    .map((relation) => ({ relation, target: g.specContext(relation.otherId) }))
    .filter(({ target }) => (target?.deliveryFacts ?? []).includes("implemented"))
    .map(({ relation, target }) => ({
      id: relation.otherId,
      via: relation.type,
      implementedBy: unitsOf(target.implementations),
    }));
  return {
    id: member.id,
    resolved: context !== undefined,
    referencedBy: unitsOf(context?.references ?? []),
    implementedBy: (context?.implementations ?? []).map((unit) => unit.codeId),
    hasVerifier: (context?.deliveryFacts ?? []).includes("has-verifier"),
    buildsOn,
  };
});
const count = (test) => rows.filter(test).length;

return {
  found: true,
  id,
  totals: {
    members: rows.length,
    withReferences: count((row) => row.referencedBy.length > 0),
    withImplementations: count((row) => row.implementedBy.length > 0),
    withVerifier: count((row) => row.hasVerifier),
    withBuildsOn: count((row) => row.buildsOn.length > 0),
    unbound: count(
      (row) => row.referencedBy.length === 0 && row.implementedBy.length === 0 && !row.hasVerifier,
    ),
  },
  rows,
};
```

Each row puts four independent facts side by side. `referencedBy` lists the code units whose
anchors name the member in `references`, with the file each sits in: that code answers to the
design without claiming to realize it, and the edge confers nothing. `implementedBy` lists the
units whose `satisfies` resolves to the member, the edge behind `implemented`. `hasVerifier` is
the derived `has-verifier` fact: a resolving verifier binding exists, not that it passed.
`buildsOn` lists the Specs the member `dependsOn` or `refines` that carry `implemented`, each with
the relation it comes through and the units that realize it, with their files. It is derived from
the member's own relations and the targets' bindings: a design that builds on existing code says
so on its own side, so the dependency has one home, and the column confers nothing on the member.

An empty `referencedBy` or `implementedBy`, or a `false`, reads as unbound. The graph records no
binding there, which says nothing about whether the code is built. An empty `buildsOn` says only
that the member names no implemented Spec through `dependsOn` or `refines`. The four facts form no
ladder: a member can be referenced and verified while nothing satisfies it, and a member that
builds on implemented code is not itself implemented, so never read `referencedBy` or `buildsOn`
as progress toward `implemented`. Rows keep the manifest's member order and each `buildsOn` list
keeps relation then id order. `resolved: false` marks a member the graph does not hold, and
`totals.unbound` counts the members with none of the first three facts. The law is
`spec:decisions.anchor-binding-grain`.

## 28. Roles, layers and contexts

*When you need this: you want the architecture vocabulary the code anchors actually state, every
role, layer, and context value with the units that carry it, before you name a new one or
reconcile two spellings of one.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const units = graph.nodes.filter((node) => node.nodeType === "CodeNode");
const taxonomy = (field) => {
  const byValue = new Map();
  for (const unit of units) {
    const value = unit[field];
    if (typeof value !== "string") continue;
    const bucket = byValue.get(value);
    if (bucket === undefined) byValue.set(value, [unit.id]);
    else bucket.push(unit.id);
  }
  return [...byValue.keys()].sort().map((value) => ({ value, units: byValue.get(value).sort() }));
};
const references = graph.edges.filter((edge) => edge.type === "references");

return {
  totals: {
    codeUnits: units.length,
    withRole: units.filter((unit) => typeof unit.role === "string").length,
    withLayer: units.filter((unit) => typeof unit.layer === "string").length,
    withContext: units.filter((unit) => typeof unit.context === "string").length,
    references: references.length,
    referencingUnits: new Set(references.map((edge) => edge.from)).size,
    referencedSpecs: new Set(references.map((edge) => edge.to)).size,
  },
  roles: taxonomy("role"),
  layers: taxonomy("layer"),
  contexts: taxonomy("context"),
};
```

The body takes no parameter. The taxonomy reads the CodeNodes alone, so a value appears only when
an anchor states it, and an unlabelled unit counts in `totals.codeUnits` and in no taxonomy row;
omission is lawful. Each value lists its units in id order, so an owner can find the anchors to
edit when two spellings name one category. A role or a context is a free value in one lowercase
kebab token, checked against no list; a layer is one of `edge`, `application`, `domain`, `adapter`,
or `infrastructure`, and only a `component:` anchor carries a layer or a context. The `references`
counts are edges, kept apart from units: one unit that references three Specs is three edges and
one referencing unit. None of these attributes or edges confers a delivery fact or moves a
readiness floor. The census renders the same taxonomy for a human reader. The law is
`spec:decisions.architectural-annotation`.

## 29. Pack design

*When you need this: you are designing or reviewing a Pack and want where its design stands,
member by member: what holds each one below its stated next rung, what design it carries, which code
answers to it, and what the Pack rests on, as data a page or a script renders.*

The parameters are `params.pack`, the Pack you are designing, and `params.detail`, absent or false
for summaries, true for full rows, or a list of member ids for those full rows. An unknown Pack returns
`{ id, found: false }`.

```js
const accepts = ["pack", "detail"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const detail = params.detail ?? false;
const id = params.pack ?? "pack:spec-studio-v1";
const pack = g.packContext(id);

if (pack === undefined) {
  return { id, found: false };
}

const unitOf = (binding) => ({
  id: binding.codeId,
  file: binding.file ?? null,
  line: binding.line ?? null,
  role: binding.role ?? null,
  component:
    binding.component === undefined
      ? null
      : {
          id: binding.component.id,
          layer: binding.component.layer ?? null,
          context: binding.component.context ?? null,
        },
});
const members = pack.members.map((member) => {
  if (!member.resolved) return { id: member.id, resolved: false };
  const { design } = member;

  return {
    id: member.id,
    resolved: true,
    title: member.title ?? null,
    specKind: member.specKind,
    statedReadiness: member.statedReadiness,
    floorReached: member.derivedReadiness ?? "none",
    statedNextRung: member.statedNextRung ?? null,
    statedNextRungFailures: member.statedNextRungFailures.map((failure) => ({
      clauseId: failure.clauseId,
      description: failure.description,
      ...(failure.targets === undefined ? {} : { targets: failure.targets }),
    })),
    design: {
      entries: design.entries,
      declarations: design.declarations,
      openQuestions: design.openQuestions.length,
      blockingQuestions: design.blockingQuestions,
    },
    questions: design.openQuestions.map((entry) => ({
      key: entry.key ?? null,
      blocking: entry.blocking,
      address: entry.key === undefined ? null : `${member.id}#question.${entry.key}`,
      line: entry.line ?? null,
      question: entry.question,
    })),
    decisions: design.decisions.map((decision) => ({
      id: decision.id,
      statedReadiness: decision.statedReadiness ?? null,
      resolved: decision.resolved,
    })),
    implementedBy: member.implementations.map(unitOf),
    referencedBy: member.references.map(unitOf),
    verifiers: member.verifiers,
    examples: member.examples,
  };
});
const boundaryRow = (row) => ({
  id: row.id,
  title: row.title ?? null,
  statedReadiness: row.statedReadiness,
  implemented: row.implemented,
  via: row.via,
});
const resolved = members.filter((member) => member.resolved);
const count = (test) => resolved.filter(test).length;
const sum = (field) => resolved.reduce((total, member) => total + member.design[field], 0);

const answer = {
  found: true,
  id,
  title: pack.title ?? null,
  totals: {
    members: members.length,
    unresolved: members.length - resolved.length,
    heldBelowNextRung: count((member) => member.statedNextRungFailures.length > 0),
    waitingForAuthor: count(
      (member) => member.statedNextRung !== null && member.statedNextRungFailures.length === 0,
    ),
    entries: sum("entries"),
    declarations: sum("declarations"),
    openQuestions: sum("openQuestions"),
    blockingQuestions: sum("blockingQuestions"),
    withImplementations: count((member) => member.implementedBy.length > 0),
    withReferences: count((member) => member.referencedBy.length > 0),
    restsOn: pack.boundary.restsOn.length,
    restedOnBy: pack.boundary.restedOnBy.length,
    verifiedBy: pack.boundary.verifiedBy.length,
    supersededBy: pack.boundary.supersededBy.length,
  },
  members,
  boundary: {
    restsOn: pack.boundary.restsOn.map(boundaryRow),
    restedOnBy: pack.boundary.restedOnBy.map(boundaryRow),
    verifiedBy: pack.boundary.verifiedBy.map(boundaryRow),
    supersededBy: pack.boundary.supersededBy.map(boundaryRow),
  },
};
const selected = Array.isArray(detail) ? new Set(detail) : new Set();
const summaryOf = (member) => {
  if (!member.resolved) return member;
  return {
    id: member.id,
    specKind: member.specKind,
    statedReadiness: member.statedReadiness,
    floorReached: member.floorReached,
    statedNextRung: member.statedNextRung,
    holds: member.statedNextRungFailures.map((failure) => ({
      clauseId: failure.clauseId,
      targets: (failure.targets ?? []).map((target) => target.id),
    })),
    openQuestions: member.design.openQuestions,
    blockingQuestions: member.design.blockingQuestions,
    implementedBy: member.implementedBy.length,
    referencedBy: member.referencedBy.length,
  };
};
if (detail === true) return answer;
const known = new Set(members.map((member) => member.id));
return {
  ...answer,
  members: members.map((member) => selected.has(member.id) ? member : summaryOf(member)),
  boundary: Object.fromEntries(Object.entries(answer.boundary).map(([direction, rows]) => [direction, rows.map((row) => row.id)])),
  leftOut: ["Titles of unselected members and floor descriptions omitted.", "Design counts, question details, decisions, bindings and verifier counts of unselected members omitted.", "Boundary details omitted; ids kept per direction."],
  ...(Array.isArray(detail) ? {
    diagnostics: [...selected].filter((id) => !known.has(id)).map((id) => ({ id, reason: "not-member" })),
  } : {}),
};
```

By default, member summaries keep their rungs, holds and question and binding counts. Boundary
lists keep ids per direction, and `leftOut` names the omitted details. Selecting member ids in
`detail` keeps those full rows beside the summaries and reports unknown ids in `diagnostics`.
Totals always count the whole Pack. With `detail: true`, the body pre-shapes the Pack design the reader assembles on the Pack context and computes nothing
of its own. Members keep the manifest's order. Each resolved member carries its stated rung, the
floor reached (`"none"` when no rung derives), and its stated next rung, the rung above the stated
one, `null` at `ready`. `statedNextRungFailures` lists the floor clauses that hold the member below
that rung, each with its `targets` when it names dependencies. An empty list beside the stated next rung
means the floor already holds that rung: the rung waits for its author, and
`totals.waitingForAuthor` counts those members. It is never a promotion. Promotion preflight
(recipe 9) reports both next rungs under `aboveStated` and `aboveFloor`.

`design` counts the member's keyed Design and UI entries other than `description`, its pinned
declarations by recipe 24's rule, its open questions, and the blocking ones. `questions` lists each
open question with its key, its blocking flag, its entry address when it carries a key, the line
the location table records (`null` when not located), and its text. `decisions` lists the
decisions the member names through `decidedBy`, each with its stated rung, and `resolved: false`
when the target is no Spec. `implementedBy` and `referencedBy` list the code units that satisfy and
that reference the member, each with its file, line, role, and component, with the layer and
context its component anchor states; a reference confers nothing. `verifiers` and `examples` count
the member's verifiers and verifying examples beside how many are enabled. An unresolved member
keeps only its `id` and `resolved: false`.

`boundary.restsOn` lists the Specs outside the Pack that a member relates to by `refines`,
`dependsOn`, `constrainedBy` or `decidedBy`, and `boundary.restedOnBy` the Specs outside it that
relate to a member by the same four relations. `boundary.verifiedBy` lists outside Specs that
`verifies` a member and `boundary.supersededBy` those that `supersedes` one, separately. Each row
carries the outside Spec's stated rung,
whether it carries `implemented`, and under `via` the members it joins per relation type. The
columns are counts and lists, never a score or a rung. The Design Review's Pack page renders the
same assembly. The laws are `spec:consumers.pack-design`, `spec:consumers.agent-surface.design-recipes` and
`spec:consumers.agent-surface.answer-shapes`.

## 30. Design-change impact

*When you need this: you are about to change a Spec's design and want every Spec that rests on it,
with the code, verifiers and Packs the change asks to follow.*

The parameter is `params.specs`, the Spec ids you are changing; an id the graph does not hold comes
back in `changed` with `resolved: false` and reaches nothing.

```js
const accepts = ["specs"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const changed = params.specs ?? ["spec:validation.readiness-floor"];
const followed = new Set(["refines", "dependsOn", "constrainedBy", "decidedBy"]);
const specIds = new Set(g.specs().map((spec) => spec.id));
const byCodeUnit = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const inbound = new Map();
for (const edge of graph.edges) {
  if (!followed.has(edge.type) || edge.claim !== "declared") continue;
  if (!specIds.has(edge.from) || !specIds.has(edge.to)) continue;
  if (!inbound.has(edge.to)) inbound.set(edge.to, []);
  inbound.get(edge.to).push(edge);
}

const reached = new Map();
const queue = [];
for (const id of changed) {
  if (!specIds.has(id) || reached.has(id)) continue;
  reached.set(id, { distance: 0, path: [] });
  queue.push(id);
}
for (let at = 0; at < queue.length; at += 1) {
  const id = queue[at];
  const here = reached.get(id);
  const edges = [...(inbound.get(id) ?? [])].sort(
    (left, right) => byCodeUnit(left.from, right.from) || byCodeUnit(left.type, right.type),
  );
  for (const edge of edges) {
    if (reached.has(edge.from)) continue;
    reached.set(edge.from, {
      distance: here.distance + 1,
      path: [...here.path, { from: edge.from, type: edge.type, to: id }],
    });
    queue.push(edge.from);
  }
}

const unitsOf = (bindings) =>
  bindings.map((unit) => ({ id: unit.codeId, file: unit.file ?? null, line: unit.line ?? null }));
const rows = [...reached.entries()]
  .map(([id, reach]) => {
    const context = g.specContext(id);
    return {
      id,
      distance: reach.distance,
      path: reach.path,
      statedReadiness: context.statedReadiness,
      implementedBy: unitsOf(context.implementations),
      referencedBy: unitsOf(context.references),
      enabledVerifiers: context.verifiers
        .filter((verifier) => verifier.enabled)
        .map((verifier) => verifier.verifierId),
      packs: context.packs,
    };
  })
  .sort((left, right) => left.distance - right.distance || byCodeUnit(left.id, right.id));

return {
  changed: changed.map((id) => ({ id, resolved: specIds.has(id) })),
  totals: {
    specs: rows.length,
    dependents: rows.filter((row) => row.distance > 0).length,
    units: new Set(
      rows.flatMap((row) => [...row.implementedBy, ...row.referencedBy].map((unit) => unit.id)),
    ).size,
  },
  rows,
};
```

The walk follows `refines`, `dependsOn`, `constrainedBy` and `decidedBy` edges backwards, from the
Spec they point at to the Spec that declares them, so it reaches every Spec that refines, depends
on, is constrained by, or is decided by a changed Spec, and then every Spec that rests on those, to
any depth. It never follows a relation outward: what a changed Spec rests on does not move with it,
and dependency footing (recipe 21) reads that side. Each Spec is reached once, by a shortest path.
`distance` counts its hops, 0 for a changed Spec. `path` lists the hops from the changed Spec out,
each naming the dependent Spec (`from`), the relation, and the Spec it rests on (`to`). The walk is
breadth-first and takes each Spec's dependents in id order, then relation type, so of two shortest
paths it keeps the one it finds first. Rows sort by distance, then id.

For each row, `implementedBy` lists the units that satisfy the Spec and `referencedBy` the units
that reference it, each with its file and line. Both are code a design change asks to follow, and a
reference confers nothing. `enabledVerifiers` lists the ids of the verifiers whose binding resolves,
a test anchor or an enabled example; a binding says nothing about whether a test passes. `packs`
lists the Packs the Spec belongs to. `totals.dependents` counts the Specs reached beyond the changed
ones, and `totals.units` the distinct units across all rows. The law is
`spec:consumers.agent-surface.design-recipes`.

## 31. Decision register

*When you need this: you want every decision with its rung, what it supersedes and what supersedes
it, which decisions it refines and which refine it, what it shapes, and what it leaves open, read from the graph instead of kept by hand.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const byCodeUnit = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const ends = (relations, type) =>
  relations
    .filter((relation) => relation.type === type)
    .map((relation) => relation.otherId)
    .sort(byCodeUnit);
const decisions = g.specs().filter((spec) => spec.specKind === "decision");
const decisionIds = new Set(decisions.map((spec) => spec.id));
const refinements = (relations) => ends(relations, "refines").filter((id) => decisionIds.has(id));
const rows = decisions
  .map((spec) => spec.id)
  .sort(byCodeUnit)
  .map((id) => {
    const context = g.specContext(id);
    const authored = context.sections?.intent?.openQuestions;
    const questions = Array.isArray(authored) ? authored : [];
    return {
      id,
      title: context.title ?? null,
      statedReadiness: context.statedReadiness,
      supersedes: ends(context.relationsOut, "supersedes"),
      supersededBy: ends(context.relationsIn, "supersedes"),
      refines: refinements(context.relationsOut),
      refinedBy: refinements(context.relationsIn),
      shapes: ends(context.relationsIn, "decidedBy"),
      reasons: context.relationsOut
        .filter((relation) => relation.reason !== undefined)
        .map((relation) => ({ type: relation.type, to: relation.otherId, reason: relation.reason }))
        .sort((left, right) => byCodeUnit(left.type, right.type) || byCodeUnit(left.to, right.to)),
      questions: questions
        .filter((entry) => typeof entry === "object" && entry !== null)
        .filter((entry) => typeof entry.key === "string")
        .map((entry) => ({
          key: entry.key,
          blocking: entry.blocking === true,
          address: `${id}#question.${entry.key}`,
        })),
      packs: context.packs,
    };
  });
const byRung = {};
for (const row of rows) byRung[row.statedReadiness] = (byRung[row.statedReadiness] ?? 0) + 1;

return {
  totals: {
    decisions: rows.length,
    byRung,
    superseded: rows.filter((row) => row.supersededBy.length > 0).length,
    shapingNothing: rows.filter((row) => row.shapes.length === 0).length,
  },
  rows,
};
```

The body takes no parameter. It returns one row per decision Spec, sorted by id in code-unit order.
`supersedes` lists the decisions this one supersedes and `supersededBy` the ones that supersede it;
follow either to walk a chain. `refines` lists decision-kind Specs this decision refines, and
`refinedBy` lists decision-kind Specs that refine it. Whether a refinement narrows a decision is
that decision's own text, and `reasons` lists every relation this decision declares with a reason,
which on a `refines` says the part it narrows and on a `supersedes` what it replaces. Supersession replaces the whole decision. Other kinds that refine a decision stay out of these
two lists. `shapes` lists the Specs that name the decision through
`decidedBy`. `questions` lists the decision's open questions that carry a key, each with its
blocking flag and entry address; the open-question register (recipe 20) lists the unkeyed ones
too. `totals.byRung` counts the decisions by stated rung, `totals.superseded` the ones another
decision supersedes, and `totals.shapingNothing` the ones no Spec names through `decidedBy`. A
superseded decision stays a row: supersession is a relation, never a removal. The ratified names
stay in the decision registry, `docs/concept/DECISIONS.md`, and the decision map (recipe 18) ranks
decisions by shaping fan-in. The law is `spec:consumers.agent-surface.design-recipes`.

## 32. Architecture crossings

*When you need this: you want every component dependency that crosses a bounded context or a
layer, and which way it runs, before you write or review an architecture rule.*

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const byCodeUnit = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
const componentOf = new Map();
for (const edge of graph.edges) if (edge.type === "memberOf") componentOf.set(edge.from, edge.to);
const componentFor = (id) => {
  const node = nodes.get(id);
  if (node?.nodeType !== "CodeNode") return undefined;
  if (id.startsWith("component:")) return node;
  const component = nodes.get(componentOf.get(id));
  return component?.nodeType === "CodeNode" ? component : undefined;
};
const describe = (component) => ({
  id: component.id,
  layer: component.layer ?? null,
  context: component.context ?? null,
});

const uses = graph.edges.filter((edge) => edge.type === "uses");
let resolved = 0;
let sameLayer = 0;
let sameContext = 0;
const bySameLayer = new Map();
const rows = [];
for (const edge of uses) {
  const from = componentFor(edge.from);
  const to = componentFor(edge.to);
  if (from === undefined || to === undefined) continue;
  resolved += 1;
  if (from.id !== to.id) {
    if (typeof from.layer === "string" && from.layer === to.layer) {
      sameLayer += 1;
      bySameLayer.set(from.layer, (bySameLayer.get(from.layer) ?? 0) + 1);
    }
    if (typeof from.context === "string" && from.context === to.context) sameContext += 1;
  }
  const differs = ["context", "layer"].filter(
    (field) =>
      typeof from[field] === "string" &&
      typeof to[field] === "string" &&
      from[field] !== to[field],
  );
  if (differs.length > 0) {
    rows.push({
      from: edge.from,
      to: edge.to,
      fromComponent: describe(from),
      toComponent: describe(to),
      differs,
    });
  }
}
rows.sort((left, right) => byCodeUnit(left.from, right.from) || byCodeUnit(left.to, right.to));

const tally = (field) => {
  const counts = new Map();
  for (const row of rows) {
    if (!row.differs.includes(field)) continue;
    const pair = `${row.fromComponent[field]} -> ${row.toComponent[field]}`;
    counts.set(pair, (counts.get(pair) ?? 0) + 1);
  }
  return Object.fromEntries(
    [...counts.entries()].sort(([left], [right]) => byCodeUnit(left, right)),
  );
};

return {
  totals: {
    usesEdges: uses.length,
    resolvedToComponents: resolved,
    sameLayer,
    sameContext,
    bySameLayer: Object.fromEntries([...bySameLayer.entries()].sort(([left], [right]) => byCodeUnit(left, right))),
    crossings: rows.length,
    contextCrossings: rows.filter((row) => row.differs.includes("context")).length,
    layerCrossings: rows.filter((row) => row.differs.includes("layer")).length,
    byContextPair: tally("context"),
    byLayerPair: tally("layer"),
  },
  rows,
};
```

The body takes no parameter. It resolves both ends of each `uses` edge to a component: a
`component:` unit is its own, and any other unit belongs to the target of its `memberOf` edge.
`totals.usesEdges` counts every `uses` edge and `totals.resolvedToComponents` the ones whose two
ends both resolve; an edge with an end that belongs to no component is left out of the rows. An
edge crosses when both components state a context and the contexts differ, or both state a layer
and the layers differ. Two units in one component never cross, and an attribute either component
leaves unstated never counts as a difference. Each row names both units (`from`, `to`), both components with their
layer and context, and `differs`, the attributes that differ. Rows sort by `from`, then `to`.
`totals.sameLayer` and `totals.sameContext` count resolved edges between distinct components
that state the same layer or context; `totals.bySameLayer` counts them per layer. Edges within
one component count in neither. `totals.byContextPair` and `totals.byLayerPair` tally the crossings as `from -> to`, so the
direction of a corpus's dependencies reads at a glance. The recipe reports and never refuses: which
crossings are lawful is the corpus's own rule, as the architectural annotation decision leaves it.
Roles, layers and contexts (recipe 28) lists the values the anchors state. The law is
`spec:consumers.agent-surface.design-recipes`.

## 33. The design backlog

*When you need this: you want defined Specs that no code realizes, with their design columns and
references, before maturing the next design.*

The body takes no parameter.

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const defined = g.specs().filter((spec) => spec.statedReadiness === "defined" && !spec.deliveryFacts.includes("implemented"));
const backlog = defined.filter((spec) => spec.specKind !== "example" && spec.specKind !== "decision");
const byFamily = Object.create(null);
const rows = backlog.map((spec) => {
  const context = g.specContext(spec.id);
  const family = spec.id.slice("spec:".length).split(".")[0];
  byFamily[family] = (byFamily[family] ?? 0) + 1;
  return {
    id: spec.id,
    specKind: spec.specKind,
    altitude: spec.altitude,
    floorReached: spec.derivedReadiness ?? "none",
    statedNextRungFailures: context.statedNextRungFailures.map((failure) => failure.clauseId),
    design: {
      entries: context.designColumns.entries,
      declarations: context.designColumns.declarations,
      openQuestions: context.designColumns.openQuestions.length,
      blockingQuestions: context.designColumns.blockingQuestions,
    },
    referencedBy: context.references.map((unit) => unit.codeId),
    packs: context.packs,
  };
}).sort((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
return {
  totals: {
    specs: rows.length,
    byFamily,
    excludedExamples: defined.filter((spec) => spec.specKind === "example").length,
    excludedDecisions: defined.filter((spec) => spec.specKind === "decision").length,
    withReferences: rows.filter((row) => row.referencedBy.length > 0).length,
  },
  rows,
};
```

The stated rung selects the rows, even when the floor reaches another rung. Examples and decisions
are counted as exclusions. A reference says code answers to a design and confers no implementation
fact. The design columns come from the reader and state no score or approval. Rows sort by id in
code-unit order. The law is `spec:consumers.agent-surface.answer-shapes`.

## 34. Rule coverage

*When you need this: you want to see which keyed rules examples exercise and which have no example.*

Pass one scope, `params.spec` or `params.pack`. Without one the recipe asks for a scope.

```js
const accepts = ["spec", "pack"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
if (params.spec === undefined && params.pack === undefined) {
  return {found: false, reason: "scope", expected: "params.spec or params.pack"};
}
if (params.spec !== undefined && params.pack !== undefined) {
  return {found: false, reason: "scope", expected: "one of params.spec or params.pack"};
}
const scope = params.spec !== undefined ? g.specContext(params.spec) : g.packContext(params.pack);
if (scope === undefined) return {found: false, reason: params.spec !== undefined ? "spec" : "pack"};
const ids = params.spec !== undefined ? [params.spec] : scope.members.map((member) => member.id);
const examples = new Map(g.specs().filter((spec) => spec.specKind === "example").map((spec) => [spec.id, spec]));
const rows = [];
let unkeyedRules = 0;
for (const id of ids) {
  const context = g.specContext(id);
  if (context === undefined) continue;
  const behavior = context.sections?.behavior ?? {};
  const keys = behavior.ruleKeys ?? {};
  unkeyedRules += (behavior.rules?.length ?? 0) + (behavior.flows?.length ?? 0) - Object.keys(keys).length;
  for (const [key, path] of Object.entries(keys)) {
    const match = /^(rules|flows)\[(\d+)\]$/u.exec(path);
    const entry = `${match[1] === "rules" ? "rule" : "flow"}[${match[2]}]`;
    const exercisedBy = graph.edges.filter((edge) => edge.type === "verifies" && edge.claim === "declared" && edge.to === id && examples.has(edge.from) && edge.exercises?.includes(key))
      .map((edge) => ({example: edge.from, enabled: context.verifiers.some((binding) => binding.via === "example" && binding.verifierId === edge.from && binding.enabled)}))
      .sort((left, right) => left.example < right.example ? -1 : left.example > right.example ? 1 : 0);
    rows.push({address: `${id}#rule.${key}`, line: context.entryLocations.find((row) => row.entry === entry)?.line ?? null, exercisedBy});
  }
}
const exercised = rows.filter((row) => row.exercisedBy.some((example) => example.enabled)).length;
return {totals: {keyedRules: rows.length, exercised, unexercised: rows.length - exercised, unkeyedRules}, rows};
```

Rows keep each Spec's authored key order and include every keyed rule or flow entry. An example
is enabled when a resolving test binding backs it. `exercisedBy` also lists declared examples
without a test, with `enabled: false`; only a bound example counts toward `totals.exercised`.
The recipe reports intent and verifier bindings. It records no runner pass or fail and confers
no rule delivery fact. The contract is `spec:model.rule-keys`.

## 35. The design diff

*When you need this: you hold the graph from the last design pass and want what changed since
that reading, down to each keyed entry.*

`params.base` is required, the graph `sdp build` wrote at the base commit. `params.pack` optionally
limits Specs to that Pack's members at either commit. `params.detail` defaults to false; true
includes the values and change type for every changed part.

In the Protocol source repository, write the base graph with the base worktree's own engine.
Its constant-form anchors use relative builder imports, trusted against that engine's own source
modules. A current-checkout engine cannot recognize those imports in another worktree. Replace
`BASE` with the commit you read and use the corpus's own exclusions:

```sh
git worktree add --detach .sdp-base BASE
ln -s "$PWD/node_modules" .sdp-base/node_modules
npm --prefix .sdp-base run build
node .sdp-base/dist/cli/sdp.js build .sdp-base --exclude explorations --exclude examples --exclude test/fixtures/import/parity
pnpm --silent sdp:q "$(cat dist/recipes/35-the-design-diff.js)" --params base=@.sdp-base/generated/graph.json --json
git worktree remove --force .sdp-base
```

The linked `node_modules` reuses this checkout's dependencies; use `npm --prefix .sdp-base ci`
instead of the link when the base needs its own lockfile's versions. `--force` removes the link
and the build output with the disposable worktree. An adopter whose anchors
import the package by name may build its base with the engine it has, using its package runner and
its own exclusions. A base written by another engine is accepted and reports what cannot compare.
The caller keeps the base commit outside the graph. The recipe reads only the two graph objects.

```js
const accepts = ["base", "pack", "detail"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const base = params.base;
const packId = params.pack;
const detail = params.detail ?? false;
const diagnostics = [];
if (!base || !Array.isArray(base.nodes) || !Array.isArray(base.edges)) {
  return { diagnostics: [{ part: "base", problem: "Supply the graph written at the base commit." }] };
}
const differentVersion = base.schemaVersion !== graph.schemaVersion;
if (differentVersion) diagnostics.push({ part: "schemaVersion", base: base.schemaVersion, head: graph.schemaVersion });
const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
};
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const specsOf = (value) => new Map(value.nodes.filter((node) => node.nodeType === "Primitive").map((node) => [node.id, node]));
const packsOf = (value) => new Map(value.nodes.filter((node) => node.nodeType === "Pack").map((node) => [node.id, node]));
const before = specsOf(base);
const after = specsOf(graph);
const basePacks = packsOf(base);
const headPacks = packsOf(graph);
const allowed = packId === undefined ? null : new Set([
  ...(basePacks.get(packId)?.members ?? []), ...(headPacks.get(packId)?.members ?? []),
]);
if (allowed !== null && !basePacks.has(packId) && !headPacks.has(packId)) {
  diagnostics.push({ part: "pack", problem: "Pack is absent at both commits.", id: packId });
}
// Capabilities follow the schema contract, never whether this corpus uses an optional field.
const atLeast = (value, minimum) => {
  const version = /^(\d+)\.(\d+)\.(\d+)$/u.exec(value.schemaVersion ?? "");
  if (!version) return false;
  const numbers = version.slice(1).map(Number);
  for (let i = 0; i < minimum.length; i++) {
    if (numbers[i] !== minimum[i]) return numbers[i] > minimum[i];
  }
  return true;
};
const unsupported = new Set();
for (const [part, minimum] of [
  ["narrative", [0, 4, 0]],
  ...["ruleKeys", "decider", "links", "provisional", "trigger", "reason", "exercises"].map((part) => [part, [0, 10, 0]]),
]) {
  const a = atLeast(base, minimum), b = atLeast(graph, minimum);
  if (!a || !b) {
    unsupported.add(part);
    const historical = minimum[1] === 10 && [base.schemaVersion, graph.schemaVersion].includes("0.9.0");
    diagnostics.push({ part, problem: historical
      ? "Schema 0.9.0 does not identify this optional capability."
      : "Part is outside the common schema.", base: a, head: b });
  }
}
// Before ruleKeys, engines left the authored marker in the rule or flow string and kept no
// order between the two lists, so keyed entries in both lists have no comparable order across them.
const behaviorOf = (content) => {
  const result = { ...content, rules: [...(content.rules ?? [])], flows: [...(content.flows ?? [])] };
  if (content.ruleKeys !== undefined) return { behavior: result, crossListOrder: true };
  const keys = {}, keyedLists = new Set();
  for (const list of ["rules", "flows"]) {
    result[list] = result[list].map((text, index) => {
      const marker = /^\[#([a-z][A-Za-z0-9]*)\] (.*)$/su.exec(text);
      if (!marker) return text;
      keys[marker[1]] = `${list}[${index}]`;
      keyedLists.add(list);
      return marker[2];
    });
  }
  result.ruleKeys = keys;
  return { behavior: result, crossListOrder: keyedLists.size < 2 };
};
const unordered = new Set();
const partsOf = (node, value) => {
  const parts = new Map();
  const put = (part, content, position) => parts.set(part, { value: content, position });
  for (const field of ["title", "specKind", "altitude", "narrative"]) {
    if (!unsupported.has(field) && Object.hasOwn(node, field)) put(field, node[field]);
  }
  put("statedReadiness", node.readiness);
  for (const edge of value.edges) {
    if (edge.from !== node.id || edge.claim !== "declared" || edge.type === "belongsTo") continue;
    put(`relation.${edge.type}:${edge.to}`, Object.fromEntries(Object.entries(edge).filter(([key]) => !unsupported.has(key))));
  }
  if (unsupported.has("sections")) return parts;
  for (const [section, content] of Object.entries(node.sections ?? {})) {
    if (unsupported.has(section)) continue;
    if (section === "design" || section === "ui") {
      let position = 0;
      for (const [key, entry] of Object.entries(content)) {
        if (key === "description") put(section, entry);
        else put(`${section}.${key}`, entry, position++);
      }
    } else if (section === "intent") {
      const { openQuestions, ...rest } = content;
      if (Object.keys(rest).length) put(section, rest);
      let position = 0;
      for (const question of openQuestions ?? []) {
        if (question?.key) put(`question.${question.key}`, Object.fromEntries(Object.entries(question).filter(([key]) => !unsupported.has(key))), position++);
      }
      const unkeyed = (openQuestions ?? []).filter((question) => !question?.key);
      if (unkeyed.length) put("intent.openQuestions", openQuestions.map((question) => question && typeof question === "object"
        ? Object.fromEntries(Object.entries(question).filter(([key]) => !unsupported.has(key))) : question));
    } else if (section === "behavior") {
      const { behavior, crossListOrder } = behaviorOf(content);
      const { rules, flows, ruleKeys, ...rest } = behavior;
      if (Object.keys(rest).length) put(section, rest);
      const keys = unsupported.has("ruleKeys") ? {} : ruleKeys ?? {};
      if (!crossListOrder && Object.keys(keys).length) unordered.add(node.id);
      const entries = new Map(Object.entries(keys).map(([key, path]) => [path, key]));
      const positions = new Map(Object.keys(keys).map((key, position) => [key, position]));
      for (const [list, items] of [["rules", rules], ["flows", flows]]) {
        const unkeyed = [];
        let listPosition = 0;
        (items ?? []).forEach((entry, index) => {
          const key = entries.get(`${list}[${index}]`);
          if (key === undefined) unkeyed.push(entry);
          else parts.set(`rule.${key}`, { value: { list, text: entry }, position: positions.get(key), listPosition: listPosition++ });
        });
        if (unkeyed.length) put(`behavior.${list}`, items);
      }
    } else if (section === "model") {
      const { terms, ...rest } = content;
      if (Object.keys(rest).length) put(section, rest);
      Object.entries(terms ?? {}).forEach(([term, entry], position) => put(`term.${term}`, entry, position));
    } else put(section, content);
  }
  return parts;
};
const ids = [...new Set([...before.keys(), ...after.keys()])].filter((id) => allowed === null || allowed.has(id)).sort();
const added = ids.filter((id) => !before.has(id));
const removed = ids.filter((id) => !after.has(id));
const changed = [];
for (const id of ids) {
  if (!before.has(id) || !after.has(id)) continue;
  const a = partsOf(before.get(id), base), b = partsOf(after.get(id), graph);
  // Without order across rules and flows on one side, keyed entries compare by order within each list.
  const order = unordered.has(id) ? "listPosition" : "position";
  if (unordered.has(id)) diagnostics.push({ part: "ruleOrder", id, problem: "One graph keeps no order across rules and flows; keyed entries compare within each list." });
  const parts = [];
  for (const part of [...new Set([...a.keys(), ...b.keys()])].sort()) {
    const from = a.get(part), to = b.get(part);
    const position = (entry) => part.startsWith("rule.") ? entry[order] : entry.position;
    const change = !from ? "added" : !to ? "removed" : !same(from.value, to.value) ? "changed"
      : position(from) !== position(to) ? "moved" : null;
    if (change !== null) parts.push({ part, change, from: from?.value ?? null, to: to?.value ?? null });
  }
  if (parts.length) changed.push({ id, parts: detail === true ? parts : parts.map((entry) => entry.part) });
}
const delta = (a, b) => ({ added: [...new Set(b)].filter((id) => !a.includes(id)).sort(), removed: [...new Set(a)].filter((id) => !b.includes(id)).sort() });
const packs = [];
for (const id of [...new Set([...basePacks.keys(), ...headPacks.keys()])].sort()) {
  if (packId !== undefined && id !== packId) continue;
  const a = basePacks.get(id), b = headPacks.get(id);
  const members = delta(a?.members ?? [], b?.members ?? []);
  const common = new Set((a?.members ?? []).filter((member) => b?.members.includes(member)));
  const reordered = !same((a?.members ?? []).filter((member) => common.has(member)), (b?.members ?? []).filter((member) => common.has(member)));
  if (!a || !b || members.added.length || members.removed.length || reordered) packs.push({ id,
    change: !a ? "added" : !b ? "removed" : "changed", membersAdded: members.added, membersRemoved: members.removed, reordered });
}
const bound = (value, id, type) => {
  const nodes = new Map(value.nodes.map((node) => [node.id, node]));
  return value.edges.filter((edge) => edge.to === id && edge.type === type && (
    edge.claim === "anchored" && nodes.has(edge.from) || type === "verifies" && edge.claim === "declared" &&
    nodes.get(edge.from)?.specKind === "example" && value.edges.some((test) => test.to === edge.from && test.type === "verifies" && test.claim === "anchored" && nodes.has(test.from))
  )).map((edge) => edge.from);
};
const bindings = [];
for (const id of ids) {
  const row = { id };
  for (const [name, type] of [["implementedBy", "satisfies"], ["referencedBy", "references"], ["verifiers", "verifies"]]) row[name] = delta(bound(base, id, type), bound(graph, id, type));
  row.deliveryFacts = unsupported.has("deliveryFacts") ? { added: [], removed: [] } : delta(before.get(id)?.deliveryFacts ?? [], after.get(id)?.deliveryFacts ?? []);
  if (Object.values(row).some((pair) => pair?.added?.length || pair?.removed?.length)) bindings.push(row);
}
return { base: { schemaVersion: base.schemaVersion, specs: ids.filter((id) => before.has(id)).length },
  head: { schemaVersion: graph.schemaVersion, specs: ids.filter((id) => after.has(id)).length }, diagnostics,
  totals: { added: added.length, removed: removed.length, changed: changed.length, packs: packs.length, bindings: bindings.length },
  specs: { added, removed, changed }, packs, bindings,
  leftOut: detail === true ? [] : ["Changed part values and change types; pass detail: true."] };
```

`specs` reports declared intent. A part is an envelope field, narrative, section, relation target,
or keyed Design, UI, question, rule or model term. A list with an unkeyed entry also compares as a whole, including its keyed entries, so an
anonymous entry moving around a keyed one remains visible. A keyed entry
with unchanged value and a different position among its section's keyed entries is `moved`.
Keyed rule values include their owning list, `rules` or `flows`, so a rule becoming a flow changes
its value at the same address. Changed values take precedence over order. Line changes and object property serialization order
alone do not change intent.

`packs` reports membership additions, removals and relative order changes among retained members.
`bindings` keeps anchor-derived changes apart, with added and removed ids for realizing units,
referencing units, enabled verifiers and delivery facts. Each list has a count in `totals`.
A schema difference is diagnostic data. Parts outside the schemas' shared capabilities are
omitted and named in `diagnostics`; an unused optional section still compares. Schema `0.9.0`
does not distinguish engines with the rule keys, question fields, relation reasons and exercises
capabilities. Those comparisons require both graphs to declare at least `0.10.0`; a `0.9.0` input
produces diagnostics even when both versions match. Legacy rule markers
are normalized before comparison when a Spec carries no `ruleKeys`. Such a graph keeps no order
between rules and flows, so when it keys entries in both, keyed entries compare by order within
each list and a `ruleOrder` diagnostic names the Spec. The comparison confers nothing and
records no design pass. The law is `spec:consumers.design-diff`.

## 36. The context bundle

*When you need this: you want the graph's reading material for one design pass in one answer,
with a budget and an account of what was left out.*

Supply exactly one scope: `params.pack`, a Pack id, or `params.specs`, an ordered list of Spec ids.
`params.members` optionally narrows a Pack to an ordered subset, such as the member ids recipe 37
returns. The Pack's framing and full boundary stay visible. `params.budget` defaults to 100,000
UTF-16 code units and accepts a non-negative integer, including zero. `params.declarations` defaults
to `"whole"`; `"addresses"` allows the final cut to reduce pinned declarations to entry addresses.
Any other value returns diagnostics. There is no sample scope.

```js
const accepts = ["pack", "specs", "members", "budget", "declarations"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const packId = params.pack;
const specIds = params.specs;
const subset = params.members;
const budget = params.budget ?? 100000;
const declarationMode = params.declarations ?? "whole";
const diagnostics = [];
const bad = (scope, problem) => diagnostics.push({ scope, problem });
const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");
if ((packId !== undefined) === (specIds !== undefined)) bad("scope", "Supply exactly one of pack or specs.");
if (!Number.isInteger(budget) || budget < 0) bad("budget", "Expected a non-negative integer in UTF-16 code units.");
if (params.declarations === null || (declarationMode !== "whole" && declarationMode !== "addresses")) bad("declarations", "Expected \"whole\" or \"addresses\".");
let pack = null, ids = [];
if (packId !== undefined) {
  pack = typeof packId === "string" ? g.packContext(packId) : undefined;
  if (!pack) bad("pack", "Pack does not resolve.");
  else ids = pack.members.map((member) => member.id);
  if (subset !== undefined) {
    if (!strings(subset) || new Set(subset).size !== subset.length) bad("members", "Expected a unique ordered subset of member ids.");
    else if (subset.some((id) => !ids.includes(id))) bad("members", "Every id must be a member of the Pack.");
    else ids = subset;
  }
} else if (specIds !== undefined) {
  if (!strings(specIds)) bad("specs", "Expected an ordered list of Spec ids.");
  else ids = specIds;
  if (subset !== undefined) bad("members", "members narrows only a Pack scope.");
}
for (const id of ids) if (!g.specContext(id)) bad(id, "Spec does not resolve.");
if (diagnostics.length) return { diagnostics };
const scope = pack ? { pack: packId, subset: subset !== undefined, members: ids } : { specs: ids };
const types = ["refines", "dependsOn", "constrainedBy", "decidedBy"];
const authoredTypes = [...types, "verifies", "supersedes"];
const summaries = new Map(g.specs().map((spec) => [spec.id, spec]));
const byCodeUnit = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const boundary = pack ? JSON.parse(JSON.stringify(pack.boundary)) : (() => {
  const inside = new Set(ids);
  const groups = { restsOn: new Map(), restedOnBy: new Map(), verifiedBy: new Map(), supersededBy: new Map() };
  const join = (group, outside, type, member) => {
    if (inside.has(outside) || !summaries.has(outside)) return;
    if (!group.has(outside)) group.set(outside, new Map());
    const via = group.get(outside);
    if (!via.has(type)) via.set(type, new Set());
    via.get(type).add(member);
  };
  for (const id of ids) {
    const context = g.specContext(id);
    for (const end of context.relationsOut) if (types.includes(end.type)) join(groups.restsOn, end.otherId, end.type, id);
    for (const end of context.relationsIn) {
      const group = types.includes(end.type) ? groups.restedOnBy : end.type === "verifies" ? groups.verifiedBy : groups.supersededBy;
      join(group, end.otherId, end.type, id);
    }
  }
  return Object.fromEntries(Object.entries(groups).map(([name, group]) => [name, [...group].sort(([a], [b]) => byCodeUnit(a, b)).map(([id, via]) => {
    const spec = summaries.get(id);
    return { id, title: spec.title ?? null, statedReadiness: spec.statedReadiness, implemented: spec.deliveryFacts.includes("implemented"),
      via: authoredTypes.filter((type) => via.has(type)).map((type) => ({ type, members: [...via.get(type)] })) };
  })]));
})();
const declarationOf = (value) => {
  if (typeof value !== "string") return null;
  const span = /^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u.exec(value);
  return span?.[2] ?? null;
};
const unitOf = (unit) => ({ id: unit.codeId, claim: unit.claim, file: unit.file ?? null, line: unit.line ?? null,
  role: unit.role ?? null, component: unit.component ?? null });
const members = ids.map((id) => {
  const context = g.specContext(id);
  const sections = JSON.parse(JSON.stringify(context.sections ?? {}));
  // One copy: open questions live in `questions`, never also in sections.intent.
  if (sections.intent) delete sections.intent.openQuestions;
  const questions = context.designColumns.openQuestions.map((question) => ({ ...question,
    address: question.key === undefined ? null : `${id}#question.${question.key}`, line: question.line ?? null }));
  const footing = context.relationsOut.filter((end) => types.includes(end.type)).map((end) => {
    const target = summaries.get(end.otherId);
    return { type: end.type, id: end.otherId, claim: end.claim, resolved: end.resolved,
      ...(end.reason === undefined ? {} : { reason: end.reason }),
      statedReadiness: target?.statedReadiness ?? null, floorReached: target === undefined ? null : target.derivedReadiness ?? "none" };
  }).sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type) || byCodeUnit(a.id, b.id));
  // One copy: each pinned value stays in sections.design; `declarations` names its key.
  const declarations = Object.entries(sections.design ?? {}).flatMap(([key, value]) =>
    key !== "description" && declarationOf(value) !== null ? [key] : []);
  const exampleIds = [...new Set(context.relationsIn.filter((end) => ["refines", "verifies"].includes(end.type) &&
    summaries.get(end.otherId)?.specKind === "example").map((end) => end.otherId))].sort();
  const examples = exampleIds.map((exampleId) => {
    const example = g.specContext(exampleId);
    const member = ids.includes(exampleId);
    return { id: exampleId, member, file: example.file, statedReadiness: example.statedReadiness, enabled: example.verifiers.some((verifier) => verifier.via === "test-anchor" && verifier.enabled),
      steps: member ? null : JSON.parse(JSON.stringify(example.sections?.behavior?.examples ?? [])) };
  });
  return { id, file: context.file, title: context.title ?? null, specKind: context.specKind, altitude: context.altitude,
    statedReadiness: context.statedReadiness, floorReached: context.derivedReadiness ?? "none", statedNextRung: context.statedNextRung ?? null,
    holds: context.statedNextRungFailures, narrative: context.narrative ?? null, sections, questions, footing, declarations, examples,
    design: { entries: context.designColumns.entries, declarations: context.designColumns.declarations,
      openQuestions: questions.length, blockingQuestions: context.designColumns.blockingQuestions },
    decisions: context.designColumns.decisions, implementedBy: context.implementations.map(unitOf), referencedBy: context.references.map(unitOf),
    verifiers: context.verifiers.map((verifier) => ({ id: verifier.verifierId, claim: verifier.claim, enabled: verifier.enabled,
      file: verifier.file ?? null, line: verifier.line ?? null })) };
});
const answer = { scope, budget, declarations: declarationMode, used: 0, tokenEstimate: { value: 0, method: "UTF-16 code units divided by four, an estimate" }, leftOut: [],
  pack: pack ? { id: packId, title: pack.title ?? null, framing: pack.framing ?? null } : null, members, boundary };
const measure = () => {
  for (;;) {
    const length = JSON.stringify(answer).length;
    const estimate = Math.ceil(length / 4);
    if (answer.used === length && answer.tokenEstimate.value === estimate) return length;
    answer.used = length;
    answer.tokenEstimate.value = estimate;
  }
};
// The enclosing member names the Spec and file; the entry position names its path.
const location = (id, path) => {
  const context = g.specContext(id);
  const question = /^intent\.openQuestions\[(\d+)\]/u.exec(path);
  const rule = /^behavior\.(rules|flows)\[(\d+)\]/u.exec(path);
  const term = path.startsWith("model.terms.") ? Object.keys(context.sections?.model?.terms ?? {}).indexOf(path.slice("model.terms.".length)) : -1;
  const entry = question ? `question[${question[1]}]` : rule ? `${rule[1] === "rules" ? "rule" : "flow"}[${rule[2]}]` : term >= 0 ? `term[${term}]` : path;
  const at = context.entryLocations.find((row) => row.entry === entry);
  return { line: at?.line ?? null };
};
const isPointer = (entry) => entry && typeof entry === "object" && !Array.isArray(entry) &&
  (entry.line === null || typeof entry.line === "number") &&
  Object.keys(entry).length === 1 && Object.hasOwn(entry, "line");
const address = (id, section, key) => key !== "description" && /^[a-z][A-Za-z0-9]*$/u.test(key) ? `${id}#${section}.${key}` : null;
const addressesIn = (value) => [...new Set((JSON.stringify(value) ?? "").match(/spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*#(?:design|ui|question|rule|term)\.[a-z][A-Za-z0-9]*(?![A-Za-z0-9_#-]|\.[A-Za-z0-9])/gu) ?? [])];
const reference = (id, path, value, own = null) => {
  const addresses = [...new Set([...(own === null ? [] : [own]), ...addressesIn(value)])];
  if (own !== null) return addresses.length === 1 ? own : addresses;
  return addresses.length ? [...addresses, location(id, path)] : location(id, path);
};
const questionReference = (id, question, index) => {
  const own = question?.key === undefined ? null : `${id}#question.${question.key}`;
  const { links, ...text } = question;
  const pointer = reference(id, `intent.openQuestions[${index}]`, text, own);
  return links?.length ? { pointer, links } : pointer;
};
const order = ["refines", "dependsOn", "constrainedBy", "decidedBy"];
const cuts = [
  () => {
    answer.boundary = Object.fromEntries(Object.entries(answer.boundary).map(([name, rows]) => [name, rows.map((row) => row.id)]));
    answer.leftOut.push("Boundary details; ids kept per direction.");
  },
  () => {
    for (const member of members) member.footing = Object.fromEntries(order.map((type) => [type, member.footing.filter((row) => row.type === type).map((row) => row.id)]).filter(([, list]) => list.length));
    answer.leftOut.push("Footing details; ids kept per relation type.");
  },
  () => {
    for (const member of members) member.narrative = addressesIn(member.narrative).join(" ") || null;
    answer.leftOut.push("Member narrative.");
  },
  () => {
    for (const member of members) {
      const behavior = member.sections.behavior;
      if (behavior) {
        if (behavior.examples) behavior.examples = behavior.examples.map((entry, index) => reference(member.id, `behavior.examples[${index}]`, entry));
        if (behavior.exampleSpace) behavior.exampleSpace = reference(member.id, "behavior.exampleSpace", behavior.exampleSpace);
      }
      for (const example of member.examples) if (example.steps !== null) example.steps = reference(example.id, "behavior.examples", example.steps);
    }
    answer.leftOut.push("Example step text, including member sections and example-space vocabulary.");
  },
  () => {
    for (const member of members) {
      member.questions = member.questions.map((question) => question.blocking ? question : questionReference(member.id, question, question.index));
    }
    answer.leftOut.push("Non-blocking question text; addresses and links kept.");
  },
  () => {
    for (const member of members) {
      const pinned = new Set(member.declarations);
      const keyedEntry = (section, key, value) => section === "design" && pinned.has(key) ? value
        : reference(member.id, `${section}.${key}`, value, address(member.id, section, key));
      const reduce = (value, path) => {
        const rule = /^behavior\.(rules|flows)\[(\d+)\]$/u.exec(path);
        if (rule) {
          const key = Object.keys(member.sections.behavior.ruleKeys ?? {}).find((key) => member.sections.behavior.ruleKeys[key] === `${rule[1]}[${rule[2]}]`);
          return reference(member.id, path, value, key === undefined ? null : `${member.id}#rule.${key}`);
        }
        if (path === "behavior.ruleKeys" || path === "behavior.stepKeys" || path === "model.termKeys") return value;
        if (path.startsWith("model.terms.")) {
          const term = path.slice("model.terms.".length);
          const key = Object.keys(member.sections.model.termKeys ?? {}).find((key) => member.sections.model.termKeys[key] === term);
          return reference(member.id, path, value, key === undefined ? null : `${member.id}#term.${key}`);
        }
        if (isPointer(value)) return value;
        if (Array.isArray(value) && value.some(isPointer) && value.every((entry) => isPointer(entry) ||
          typeof entry === "string" && addressesIn(entry).includes(entry))) return value;
        if (Array.isArray(value)) return value.map((entry, index) => reduce(entry, `${path}[${index}]`));
        if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key,
          path === "design" || path === "ui" ? keyedEntry(path, key, entry) : reduce(entry, path ? `${path}.${key}` : key)]));
        return reference(member.id, path, value);
      };
      member.sections = reduce(member.sections, "");
    }
    answer.leftOut.push("Section entry values other than pinned declarations; addresses and lines kept.");
  },
];
if (declarationMode === "addresses") cuts.push(() => {
  for (const member of members) for (const key of member.declarations) {
    const value = member.sections.design[key];
    member.sections.design[key] = reference(member.id, `design.${key}`, value, address(member.id, "design", key));
  }
  answer.leftOut.push("Pinned declaration text; entry addresses kept.");
});
if (measure() <= budget) return answer;
for (const cut of cuts) { cut(); if (measure() <= budget) return answer; }
return { scope, budget, declarations: declarationMode, budgetExceeded: true, protectedLength: answer.used, leftOut: answer.leftOut };
```

`scope` states a Pack and whether it is narrowed, with its ordered member ids, or the ordered
Spec list. Each member keeps its stated rung, floor and stated next rung, with `holds` naming
unmet floor clauses. `design` counts entries, declarations and questions, beside shaping decisions
and the Pack design's bindings. Questions keep addresses, recorded lines and their fields.
`footing` has recipe 21's dependency rows, including `reason` when the relation states one;
`declarations` lists pinned keys, with each value kept once in `sections.design`.
Each member carries its carrier `file`; questions live only in `questions`, with no second copy
in `sections.intent`. `examples` lists refining or verifying examples with their file, rung,
enabled binding and steps. An example that is itself a member has `member: true` and `steps: null`,
with the steps in its own member row.
Bindings carry their claims and recorded source locations. Boundary rows carry declared
relations, grouped exactly as the Pack design does.

The fixed cuts are boundary details, footing details, member narrative, example step text,
non-blocking question text, then section values other than pinned declarations. With
`declarations: "addresses"`, a final cut reduces pinned values to entry addresses. The recipe
stops at the first cut after which it fits. Footing becomes target ids grouped by relation type.
Blocking questions stay whole. Other entries keep their addresses or `{ line }`, with the
enclosing row and position naming the Spec, file and path. Entry addresses written in cut text
stay beside its pointer, and question links stay beside the question pointer. Null lines mean
unlocated.
`leftOut` lists the cuts taken in that order. `used` counts the compact returned JSON, including
itself, `scope`, `budget`, `tokenEstimate` and `leftOut`. The estimate divides code units by four,
rounded up. A successful bundle always fits the requested budget. A budget-exceeded result carries
only the scope, budget, declaration mode, protected length and omission list, and the CLI exits 0. Invalid or unknown
scopes return diagnostics without a bundle. The law is `spec:consumers.context-bundle`.

## 37. The perspective filter

*When you need this: you read a Pack for one concern and the corpus has a JSON perspective
that selects and orders its members.*

`params.pack` and `params.perspective` are required. The latter is corpus data, passed as JSON or
with `--params perspective=@perspective.json`. The Protocol ships no perspectives.

A perspective has `name`, optional `select` and optional `order`, a priority list of Spec ids.
The selectors are `ids`, `idPrefixes`, `kinds`, `sections`, `designKeys`, `questionKeys`,
`relations` and `bindings`. List values are alternatives; different selectors are requirements.
An absent selector imposes no restriction. A present empty list selects nothing. For example:

```json
{
  "name": "domain",
  "select": {
    "kinds": ["model", "behavior"],
    "designKeys": [{ "key": "layer", "value": "domain" }]
  },
  "order": ["spec:orders.model"]
}
```

`designKeys` entries take `key` and optional `value`. `relations` entries take an authored `type`,
`direction` as `in` or `out`, and optional `target`, the other end's Spec id. `bindings` takes
`via`, a list of `satisfies` or `references`, and optional `layers` and `contexts`. Layers and
contexts must match the same bound unit's component. An absent restriction matches every value;
an empty restriction matches nothing.

```js
const accepts = ["pack", "perspective"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const packId = params.pack;
const perspective = params.perspective;
const diagnostics = [];
const bad = (selector, problem) => diagnostics.push({ selector, problem });
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");
const pack = typeof packId === "string" ? g.packContext(packId) : undefined;
if (!pack) bad("pack", "Supply a Pack id in this graph.");
const data = object(perspective) ? perspective : {};
if (!object(perspective)) bad("perspective", "Supply a perspective object.");
if (typeof data.name !== "string") bad("name", "Expected a name string.");
for (const key of Object.keys(data)) if (!["name", "select", "order"].includes(key)) bad(key, "Unknown perspective field.");
if (data.select !== undefined && !object(data.select)) bad("select", "Expected a selector object.");
const select = object(data.select) ? data.select : {};
const tests = [];
const authoredTypes = ["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"];
const known = ["ids", "idPrefixes", "kinds", "sections", "designKeys", "questionKeys", "relations", "bindings"];
for (const key of Object.keys(select)) if (!known.includes(key)) bad(key, "Unknown selector.");
const add = (selector, values, valid, match) => {
  if (!Array.isArray(values)) { bad(selector, "Expected a list."); return; }
  const understood = values.filter((value, index) => {
    if (valid(value)) return true;
    bad(`${selector}[${index}]`, "Unsupported value or wrong type.");
    return false;
  });
  if (values.length && !understood.length) return;
  tests.push((context) => understood.flatMap((value) => match(context, value)));
};
for (const selector of ["ids", "idPrefixes", "kinds", "sections", "questionKeys"]) {
  if (!Object.hasOwn(select, selector)) continue;
  add(selector, select[selector], (value) => typeof value === "string", (context, value) => {
    const matches = selector === "ids" ? context.id === value
      : selector === "idPrefixes" ? context.id.startsWith(value)
      : selector === "kinds" ? context.specKind === value
      : selector === "sections" ? Object.hasOwn(context.sections ?? {}, value)
      : (context.sections?.intent?.openQuestions ?? []).some((question) => question?.key === value);
    return matches ? [{ selector, value, claim: "declared" }] : [];
  });
}
if (Object.hasOwn(select, "designKeys")) add("designKeys", select.designKeys,
  (value) => object(value) && typeof value.key === "string" && Object.keys(value).every((key) => ["key", "value"].includes(key)),
  (context, value) => Object.hasOwn(context.sections?.design ?? {}, value.key) &&
    (!Object.hasOwn(value, "value") || JSON.stringify(context.sections.design[value.key]) === JSON.stringify(value.value))
    ? [{ selector: "designKeys", value, claim: "declared" }] : []);
if (Object.hasOwn(select, "relations")) add("relations", select.relations,
  (value) => object(value) && authoredTypes.includes(value.type) && ["in", "out"].includes(value.direction) &&
    (value.target === undefined || typeof value.target === "string") && Object.keys(value).every((key) => ["type", "direction", "target"].includes(key)),
  (context, value) => (value.direction === "out" ? context.relationsOut : context.relationsIn)
    .filter((edge) => edge.claim === "declared" && edge.type === value.type && (value.target === undefined || edge.otherId === value.target))
    .map((edge) => ({ selector: "relations", value: { type: edge.type, direction: value.direction, target: edge.otherId }, claim: "declared" })));
if (Object.hasOwn(select, "bindings")) {
  const binding = select.bindings;
  if (!object(binding)) bad("bindings", "Expected a binding selector object.");
  else {
    for (const key of Object.keys(binding)) if (!["via", "layers", "contexts"].includes(key)) bad(`bindings.${key}`, "Unknown selector.");
    let via;
    if (!Object.hasOwn(binding, "via")) bad("bindings.via", "A binding selector requires via.");
    else if (!strings(binding.via)) bad("bindings.via", "Expected a list of satisfies or references.");
    else {
      via = binding.via.filter((value) => ["satisfies", "references"].includes(value));
      if (via.length !== binding.via.length) bad("bindings.via", "Only satisfies and references are supported.");
      if (binding.via.length && !via.length) via = undefined;
    }
    const restrictions = {};
    for (const key of ["layers", "contexts"]) {
      if (!Object.hasOwn(binding, key)) continue;
      if (!strings(binding[key])) bad(`bindings.${key}`, "Expected a list of strings.");
      else restrictions[key] = binding[key];
    }
    if (via !== undefined) tests.push((context) => via.flatMap((type) => (type === "satisfies" ? context.implementations : context.references)
      .filter((unit) => (restrictions.layers === undefined || restrictions.layers.includes(unit.component?.layer)) &&
        (restrictions.contexts === undefined || restrictions.contexts.includes(unit.component?.context)))
      .map((unit) => ({ selector: "bindings", value: { via: type, unit: unit.codeId, component: unit.component ?? null }, claim: "anchored" }))));
  }
}
let order = [];
if (data.order !== undefined) {
  if (!strings(data.order)) bad("order", "Expected a priority list of Spec ids.");
  else order = data.order;
}
const selected = [], notSelected = [];
for (const member of pack?.members ?? []) {
  const context = g.specContext(member.id);
  if (!context) { bad(member.id, "Pack member does not resolve."); notSelected.push(member.id); continue; }
  const matches = tests.map((test) => test(context));
  if (matches.some((rows) => rows.length === 0)) { notSelected.push(member.id); continue; }
  selected.push({ id: member.id, matchedOn: matches.flat(), blockingQuestions: context.designColumns.openQuestions
    .filter((question) => question.blocking).map((question) => ({ address: question.key === undefined ? null : `${member.id}#question.${question.key}`, question: question.question })) });
}
const priority = (id) => order.includes(id) ? order.indexOf(id) : order.length;
selected.sort((a, b) => priority(a.id) - priority(b.id));
return { pack: packId ?? null, perspective: data.name ?? null, totals: { members: pack?.members.length ?? 0, selected: selected.length }, diagnostics, selected, notSelected };
```

Rows keep the priority order, with authored order breaking ties. `matchedOn` names each understood
selector that matched, its value and its claim. Design keys select declared intent. Component
layers and contexts select anchored structure. `blockingQuestions` keeps every blocking question
of each selected Spec. Selection leaves Spec content intact, and `notSelected` keeps authored order.
Diagnostics name unsupported selectors and wrong types; understood selectors still apply. An empty
selection with no diagnostic is a valid empty result. Pass `selected.map(row => row.id)` as the
bundle's `members` parameter. The law is `spec:consumers.review-perspectives`.

## 38. The proposal check

*When you need this: a design pass handed back a proposal and you want to resolve every scope
and see which changes still read the same design.*

`params.proposal` is the required JSON document. `params.base` is required, the graph written at
the commit the proposal's `base` names. Pass the files with `--params proposal=@proposal.json`
and `--params base=@graph.json`. The caller is responsible for pairing the graph with that commit.
The recipe reads the objects, reads no git history, applies no change and writes no carrier.

The package ships `schemas/sdp-proposal-1.schema.json` for structured output. A document has only
`schema: "sdp-proposal/1"`, a non-empty `base`, a one-line `reason` and non-empty `changes`.
Each change has a non-empty `scope` and `request`, and may carry `text`, `replaces` or `follows`,
a `relation`, and a one-line `reason`. `replaces` and `follows` are exclusive entry addresses.
A relation has only `action`, `from`, `type` and `target`; its action is `declare` or `remove`
and its type is one of the six authored relations. Scope entries are Spec ids or entry addresses.
A proposer, status, date, approval, verdict or any other field is refused.

```js
const accepts = ["proposal", "base"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const proposal = params.proposal;
const base = params.base;
const schemaProblems = [];
const problem = (path, message) => schemaProblems.push({ path, problem: message });
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const specId = /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*(?![\s\S])/u;
const entryAddress = /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*#(design|ui|question|rule|term)\.([a-z][A-Za-z0-9]*)(?![\s\S])/u;
const scopeRef = (value) => typeof value === "string" && (specId.test(value) || entryAddress.test(value));
const closed = (value, path, allowed, required) => {
  if (!object(value)) { problem(path, "Expected an object."); return false; }
  for (const key of Object.keys(value)) if (!allowed.includes(key)) problem(`${path}.${key}`, "Unknown field.");
  for (const key of required) if (!Object.hasOwn(value, key)) problem(`${path}.${key}`, "Required field.");
  return true;
};
const text = (value, path, nonempty = false) => {
  if (typeof value !== "string" || nonempty && value.length === 0) problem(path, nonempty ? "Expected a non-empty string." : "Expected a string.");
};
const reason = (value, path) => {
  text(value, path, true);
  if (typeof value === "string" && /[\r\n\u0085\u2028\u2029]/u.test(value)) problem(path, "Expected one line.");
};
const authoredTypes = ["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"];
if (closed(proposal, "$", ["schema", "base", "reason", "changes"], ["schema", "base", "reason", "changes"])) {
  if (proposal.schema !== "sdp-proposal/1") problem("$.schema", "Expected sdp-proposal/1.");
  text(proposal.base, "$.base", true);
  reason(proposal.reason, "$.reason");
  if (!Array.isArray(proposal.changes) || !proposal.changes.length) problem("$.changes", "Expected a non-empty list.");
  else proposal.changes.forEach((change, index) => {
    const path = `$.changes[${index}]`;
    if (!closed(change, path, ["scope", "request", "text", "replaces", "follows", "relation", "reason"], ["scope", "request"])) return;
    if (!Array.isArray(change.scope) || !change.scope.length) problem(`${path}.scope`, "Expected a non-empty list.");
    else change.scope.forEach((ref, index) => { if (!scopeRef(ref)) problem(`${path}.scope[${index}]`, "Expected a Spec id or entry address."); });
    text(change.request, `${path}.request`, true);
    if (Object.hasOwn(change, "text")) text(change.text, `${path}.text`);
    if (Object.hasOwn(change, "reason")) reason(change.reason, `${path}.reason`);
    for (const key of ["replaces", "follows"]) if (Object.hasOwn(change, key) && (typeof change[key] !== "string" || !entryAddress.test(change[key]))) problem(`${path}.${key}`, "Expected an entry address.");
    if (Object.hasOwn(change, "replaces") && Object.hasOwn(change, "follows")) problem(path, "replaces and follows are exclusive.");
    if (Object.hasOwn(change, "relation") && closed(change.relation, `${path}.relation`, ["action", "from", "type", "target"], ["action", "from", "type", "target"])) {
      const relation = change.relation;
      if (!["declare", "remove"].includes(relation.action)) problem(`${path}.relation.action`, "Expected declare or remove.");
      if (!authoredTypes.includes(relation.type)) problem(`${path}.relation.type`, "Expected an authored relation type.");
      for (const key of ["from", "target"]) if (typeof relation[key] !== "string" || !specId.test(relation[key])) problem(`${path}.relation.${key}`, "Expected a Spec id.");
    }
  });
}
const empty = () => ({ schemaProblems, base: typeof proposal?.base === "string" ? proposal.base : null,
  totals: { changes: 0, moved: 0, unresolved: 0 }, changes: [] });
if (schemaProblems.length) return empty();
if (!base || !Array.isArray(base.nodes) || !Array.isArray(base.edges)) { problem("params.base", "Supply the graph written at the proposal base commit."); return empty(); }
const canonical = (value) => Array.isArray(value) ? value.map(canonical) : object(value)
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const diagnostics = [];
if (base.schemaVersion !== graph.schemaVersion) diagnostics.push({ part: "schemaVersion", base: base.schemaVersion, head: graph.schemaVersion });
// Capabilities follow the schema contract, never whether this corpus uses an optional field.
const atLeast = (value, minimum) => {
  const version = /^(\d+)\.(\d+)\.(\d+)$/u.exec(value.schemaVersion ?? "");
  if (!version) return false;
  const numbers = version.slice(1).map(Number);
  for (let i = 0; i < minimum.length; i++) {
    if (numbers[i] !== minimum[i]) return numbers[i] > minimum[i];
  }
  return true;
};
const unsupported = new Set();
for (const [part, minimum] of [
  ["narrative", [0, 4, 0]],
  ...["ruleKeys", "decider", "links", "provisional", "trigger", "reason", "exercises"].map((part) => [part, [0, 10, 0]]),
]) {
  const a = atLeast(base, minimum), b = atLeast(graph, minimum);
  if (!a || !b) {
    unsupported.add(part);
    const historical = minimum[1] === 10 && [base.schemaVersion, graph.schemaVersion].includes("0.9.0");
    diagnostics.push({ part, problem: historical
      ? "Schema 0.9.0 does not identify this optional capability."
      : "Part is outside the common schema.", base: a, head: b });
  }
}
// Before ruleKeys, engines left the authored marker in the rule or flow string and kept no
// order between the two lists, so keyed entries in both lists have no comparable order across them.
const behaviorOf = (content) => {
  const result = { ...content, rules: [...(content.rules ?? [])], flows: [...(content.flows ?? [])] };
  if (content.ruleKeys !== undefined) return { behavior: result, crossListOrder: true };
  const keys = {}, keyedLists = new Set();
  for (const list of ["rules", "flows"]) {
    result[list] = result[list].map((text, index) => {
      const marker = /^\[#([a-z][A-Za-z0-9]*)\] (.*)$/su.exec(text);
      if (!marker) return text;
      keys[marker[1]] = `${list}[${index}]`;
      keyedLists.add(list);
      return marker[2];
    });
  }
  result.ruleKeys = keys;
  return { behavior: result, crossListOrder: keyedLists.size < 2 };
};
const unordered = new Set();
const partsOf = (node, value) => {
  const parts = new Map();
  const put = (part, content, position) => parts.set(part, { value: content, position });
  for (const field of ["title", "specKind", "altitude", "narrative"]) {
    if (!unsupported.has(field) && Object.hasOwn(node, field)) put(field, node[field]);
  }
  put("statedReadiness", node.readiness);
  for (const edge of value.edges) {
    if (edge.from !== node.id || edge.claim !== "declared" || edge.type === "belongsTo") continue;
    put(`relation.${edge.type}:${edge.to}`, Object.fromEntries(Object.entries(edge).filter(([key]) => !unsupported.has(key))));
  }
  if (unsupported.has("sections")) return parts;
  for (const [section, content] of Object.entries(node.sections ?? {})) {
    if (unsupported.has(section)) continue;
    if (section === "design" || section === "ui") {
      let position = 0;
      for (const [key, entry] of Object.entries(content)) {
        if (key === "description") put(section, entry);
        else put(`${section}.${key}`, entry, position++);
      }
    } else if (section === "intent") {
      const { openQuestions, ...rest } = content;
      if (Object.keys(rest).length) put(section, rest);
      let position = 0;
      for (const question of openQuestions ?? []) {
        if (question?.key) put(`question.${question.key}`, Object.fromEntries(Object.entries(question).filter(([key]) => !unsupported.has(key))), position++);
      }
      const unkeyed = (openQuestions ?? []).filter((question) => !question?.key);
      if (unkeyed.length) put("intent.openQuestions", openQuestions.map((question) => question && typeof question === "object"
        ? Object.fromEntries(Object.entries(question).filter(([key]) => !unsupported.has(key))) : question));
    } else if (section === "behavior") {
      const { behavior, crossListOrder } = behaviorOf(content);
      const { rules, flows, ruleKeys, ...rest } = behavior;
      if (Object.keys(rest).length) put(section, rest);
      const keys = unsupported.has("ruleKeys") ? {} : ruleKeys ?? {};
      if (!crossListOrder && Object.keys(keys).length) unordered.add(node.id);
      const entries = new Map(Object.entries(keys).map(([key, path]) => [path, key]));
      const positions = new Map(Object.keys(keys).map((key, position) => [key, position]));
      for (const [list, items] of [["rules", rules], ["flows", flows]]) {
        const unkeyed = [];
        let listPosition = 0;
        (items ?? []).forEach((entry, index) => {
          const key = entries.get(`${list}[${index}]`);
          if (key === undefined) unkeyed.push(entry);
          else parts.set(`rule.${key}`, { value: { list, text: entry }, position: positions.get(key), listPosition: listPosition++ });
        });
        if (unkeyed.length) put(`behavior.${list}`, items);
      }
    } else if (section === "model") {
      const { terms, ...rest } = content;
      if (Object.keys(rest).length) put(section, rest);
      Object.entries(terms ?? {}).forEach(([term, entry], position) => put(`term.${term}`, entry, position));
    } else put(section, content);
  }
  return parts;
};
const before = new Map(base.nodes.filter((node) => node.nodeType === "Primitive").map((node) => [node.id, node]));
const after = new Map(graph.nodes.filter((node) => node.nodeType === "Primitive").map((node) => [node.id, node]));
const cache = new Map();
const changedParts = (id) => {
  if (cache.has(id)) return cache.get(id);
  const a = before.has(id) ? partsOf(before.get(id), base) : new Map();
  const b = after.has(id) ? partsOf(after.get(id), graph) : new Map();
  const changed = new Set(), ordered = new Set();
  // Without order across rules and flows on one side, keyed entries compare by order within each list.
  const order = unordered.has(id) ? "listPosition" : "position";
  if (unordered.has(id) && before.has(id) && after.has(id)) diagnostics.push({ part: "ruleOrder", id, problem: "One graph keeps no order across rules and flows; keyed entries compare within each list." });
  for (const part of new Set([...a.keys(), ...b.keys()])) {
    const position = (entry) => part.startsWith("rule.") ? entry[order] : entry.position;
    if (!a.has(part) || !b.has(part) || !same(a.get(part).value, b.get(part).value)) changed.add(part);
    else if (position(a.get(part)) !== position(b.get(part))) ordered.add(part);
  }
  const result = { changed, ordered, crossListOrder: !unordered.has(id) };
  cache.set(id, result);
  return result;
};
const resolves = (nodes, ref) => {
  const [id, suffix] = ref.split("#");
  const node = nodes.get(id);
  if (!node) return false;
  if (suffix === undefined) return true;
  const [section, key] = suffix.split(".");
  if (section === "question") return (node.sections?.intent?.openQuestions ?? []).some((question) => question?.key === key);
  if (section === "rule") return Object.hasOwn(behaviorOf(node.sections?.behavior ?? {}).behavior.ruleKeys ?? {}, key);
  if (section === "term") return Object.hasOwn(node.sections?.model?.termKeys ?? {}, key);
  return key !== "description" && Object.hasOwn(node.sections?.[section] ?? {}, key);
};
const changes = proposal.changes.map((change, index) => {
  const refs = [...new Set([...change.scope, ...(change.replaces === undefined ? [] : [change.replaces]),
    ...(change.follows === undefined ? [] : [change.follows]), ...(change.relation === undefined ? [] : [change.relation.from])])];
  const scope = refs.map((ref) => {
    const [id, suffix] = ref.split("#");
    const resolution = { ref, resolvesAtHead: resolves(after, ref), resolvesAtBase: resolves(before, ref) };
    const missing = suffix === undefined ? [...unsupported] : suffix.startsWith("rule.")
      ? (unsupported.has("ruleKeys") ? ["ruleKeys"] : []) : suffix.startsWith("question.")
      ? ["decider", "links", "provisional", "trigger"].filter((part) => unsupported.has(part)) : [];
    if (missing.length) return { ...resolution, comparable: false, reason: `Outside the common schema: ${missing.join(", ")}.` };
    const parts = changedParts(id);
    const termValue = (nodes) => {
      const model = nodes.get(id)?.sections?.model;
      const key = suffix.slice("term.".length);
      const term = model?.termKeys?.[key];
      return term === undefined ? undefined : model.terms?.[term];
    };
    const moved = before.has(id) !== after.has(id) || (suffix === undefined
      ? parts.changed.size > 0 || parts.ordered.size > 0 : suffix.startsWith("term.")
      ? !same(termValue(before), termValue(after)) : parts.changed.has(suffix));
    if (!moved && suffix === undefined && !parts.crossListOrder) {
      return { ...resolution, comparable: false, reason: "One graph keeps no order across rules and flows." };
    }
    return { ...resolution, moved };
  });
  const relationTarget = change.relation?.action === "declare"
    ? { ref: change.relation.target, resolvesAtHead: resolves(after, change.relation.target) } : null;
  const incomparable = scope.some((item) => item.comparable === false);
  return { index, scope, moved: scope.some((item) => item.moved) ? true : incomparable ? null : false,
    ...(incomparable ? { comparable: false } : {}), relationTarget };
});
return { schemaProblems, base: proposal.base, diagnostics, totals: { changes: changes.length, moved: changes.filter((change) => change.moved).length,
  unresolved: changes.filter((change) => change.scope.some((item) => !item.resolvesAtHead) || change.relationTarget?.resolvesAtHead === false).length }, changes };
```

`schemaProblems` names each malformed field by its JSON path. A malformed document produces no
change rows. The check resolves the deduplicated union of each change's scope, replaced or followed
entry, and relation source. Each scope row reports resolution at both commits and whether its value
was added, removed or changed under recipe 35's comparison. An order-only entry move keeps its
value unchanged; a whole-Spec scope includes order changes. `relationTarget` reports resolution at
the head for a declared relation, and is null otherwise. `totals.moved` and `totals.unresolved`
count changes, so one moved entry leaves other changes independently visible. Unknown references
remain explicit rows. A scope outside the common schema carries `comparable: false` and a
`reason`, with no `moved` claim, as does an otherwise unmoved whole-Spec scope whose order across
rules and flows one graph does not keep. Its change also carries `comparable: false`, and `moved` is null
unless another comparable scope moved. Schema differences, unsupported parts and a compared Spec
whose order across rules and flows one graph does not keep appear in `diagnostics`. Optional
capabilities from schema `0.9.0` are uncertain, even beside another `0.9.0` graph. The check names
them in diagnostics and marks affected scopes incomparable; both graphs need at least `0.10.0`
for rule keys, question fields, relation reasons and exercises to compare. A base missing from
the parameters is a problem with no change rows.

The rows carry facts about declared intent, with anchored changes excluded from scope movement.
They confer no status or approval. A caller routes a moved change to a person and applies other
changes through ordinary source edits on a worktree checked by `sdp validate`. This recipe does
neither step. The check's law is `spec:consumers.intent-composition.proposal`; routing and applying
are `spec:consumers.intent-composition`.

## 39. Slimming candidates

*When you need this: an implemented Spec has a verifier and you want to compare its pinned
declarations with the bound artifacts before removing duplicated Design detail.*

The optional parameter is `params.pack`; without it the body reads every Spec. An unknown Pack
returns `{ pack, found: false }`. An existing Pack with no candidates keeps its totals and empty
rows. A row is a potential candidate, never permission to delete an entry.

```js
const accepts = ["pack"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const byCodeUnit = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const pack = params.pack === undefined ? undefined : g.packContext(params.pack);
if (params.pack !== undefined && !pack) return { pack: params.pack, found: false };
const specs = params.pack === undefined
  ? g.specs()
  : pack.members;
const rows = [];
for (const spec of specs) {
  const context = g.specContext(spec.id);
  if (!context?.deliveryFacts.includes("implemented") || !context.deliveryFacts.includes("has-verifier")) continue;
  for (const [key, value] of Object.entries(context.sections?.design ?? {})) {
    if (key === "description" || typeof value !== "string") continue;
    const span = /^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u.exec(value);
    if (!span) continue;
    rows.push({
      spec: spec.id,
      key,
      line: context.entryLocations.find((entry) => entry.entry === `design.${key}`)?.line ?? null,
      declaration: span[2],
      implementations: context.implementations.map((unit) => ({
        id: unit.codeId, file: unit.file ?? null, line: unit.line ?? null, claim: unit.claim,
      })),
      verifiers: context.verifiers.map((unit) => ({
        id: unit.verifierId, file: unit.file ?? null, via: unit.via, enabled: unit.enabled, claim: unit.claim,
      })),
    });
  }
}
rows.sort((left, right) => byCodeUnit(left.spec, right.spec) || byCodeUnit(left.key, right.key));
return {
  totals: { specs: specs.length, potentialCandidates: rows.length },
  rows,
  leftOut: [
    "Whole-Spec bindings prove no entry-level realization of a declaration; compare each potential candidate with its bound artifacts.",
    "Whole-Spec bindings prove no entry-level realization by a bound example; bound examples do not identify which Design entries they realize.",
    "Prose entries never qualify, and explanations stay in their Spec. The recipe deletes nothing.",
  ],
};
```

`totals.specs` counts the selected Specs, and `potentialCandidates` counts the returned Design
entries. `declaration` is the opening code span, by pinned declarations' rule in recipe 24;
`line` is the location table's line or null when unlocated. `implementations` names the realizing
units and `verifiers` the declared and anchored verifier bindings, with their claim and whether
they are enabled. A verifier binding says one exists; it records no test result. The declaration
is declared intent, and the candidate classification is advice derived from the graph.
`leftOut` states what whole-Spec bindings cannot prove for declarations and examples. The law is
`spec:model.enrichment-lifecycle`.

## 40. Curation report

*When you need this: you want files ranked for anchor review, component imports that disagree
with anchored uses, and component designs that no planned component realizes yet.*

The required parameter is `params.imports`, the object in the adapter's imports file. The optional
`params.limit` is a positive integer, 20 by default, and cuts only the uncovered-file list.
Missing or malformed imports and invalid limits return `{ diagnostics }` with no report rows.
The imports object may carry `exclude`, the adapter's normalized list of omitted paths. The report
echoes it as `input.exclude`, or `[]` when absent; it does not remove files from supplied input.
Build the input explicitly, then pass it to the body as data:

```sh
pnpm --silent sdp build . --exclude explorations --exclude examples --exclude test/fixtures/import/parity --imports imports.config.json
pnpm --silent sdp:q "$(cat dist/recipes/40-curation-report.js)" --params imports=@generated/imports.json --json
```

The configuration is a JSON object such as
`{ "adapter": "typescript", "tsconfig": "tsconfig.json", "roots": ["src"] }`.
Its paths are relative to the build root. Optional `exclude` paths name a file or directory subtree,
for example `"exclude": ["src/generated", "src/example.test.ts"]`. The adapter refuses unknown
configuration keys, removes excluded files and import endpoints, preserves barrel resolution through
excluded intermediates, and records the normalized exclusions in its output. Only anchored
component identity and `memberOf` assign files to components.

```js
const accepts = ["imports", "limit"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const input = params.imports;
const diagnostics = [];
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
if (!object(input) || input.schema !== "sdp-imports/1" || typeof input.adapter !== "string" || !Array.isArray(input.files) ||
    ("exclude" in input && (!Array.isArray(input.exclude) || input.exclude.some((path) => typeof path !== "string"))) ||
    input.files.some((entry) => !object(entry) || typeof entry.file !== "string" || !Array.isArray(entry.imports) || entry.imports.some((file) => typeof file !== "string"))) {
  diagnostics.push({ parameter: "imports", problem: "Supply an sdp-imports/1 object." });
}
const limit = params.limit ?? 20;
if (params.limit === null || !Number.isInteger(limit) || limit <= 0) diagnostics.push({ parameter: "limit", problem: "Expected a positive integer." });
if (diagnostics.length) return { diagnostics };
const byCodeUnit = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
const anchored = graph.nodes.filter((node) => node.claim === "anchored" && (node.nodeType === "CodeNode" || node.nodeType === "Anchor"));
const anchoredFiles = new Set(anchored.map((node) => node.file));
const componentOf = new Map();
for (const edge of graph.edges) if (edge.type === "memberOf" && edge.claim === "anchored") componentOf.set(edge.from, edge.to);
const componentFor = (id) => {
  const unit = nodes.get(id);
  if (unit?.nodeType !== "CodeNode" || unit.claim !== "anchored") return undefined;
  const component = id.startsWith("component:") ? unit : nodes.get(componentOf.get(id));
  return component?.nodeType === "CodeNode" && component.claim === "anchored" && component.id.startsWith("component:") ? component.id : undefined;
};
const fileComponents = new Map();
for (const unit of anchored) {
  const component = componentFor(unit.id);
  if (component === undefined) continue;
  if (!fileComponents.has(unit.file)) fileComponents.set(unit.file, new Set());
  fileComponents.get(unit.file).add(component);
}
const files = new Map(input.files.map((entry) => [entry.file, new Set(entry.imports)]));
const fanIn = new Map();
for (const imports of files.values()) for (const file of imports) fanIn.set(file, (fanIn.get(file) ?? 0) + 1);
const uncovered = [...files.entries()]
  .filter(([file]) => !anchoredFiles.has(file))
  .map(([file, imports]) => ({ file, fanIn: fanIn.get(file) ?? 0, fanOut: imports.size }))
  .sort((left, right) => right.fanIn - left.fanIn || byCodeUnit(left.file, right.file));
const pairKey = (from, to) => JSON.stringify([from, to]);
const pairs = new Map();
for (const [from, imports] of [...files.entries()].sort(([left], [right]) => byCodeUnit(left, right))) {
  for (const to of [...imports].sort(byCodeUnit)) {
    for (const fromComponent of fileComponents.get(from) ?? []) {
      for (const toComponent of fileComponents.get(to) ?? []) {
        if (fromComponent === toComponent) continue;
        const key = pairKey(fromComponent, toComponent);
        const row = pairs.get(key) ?? { fromComponent, toComponent, imports: 0, sample: { from, to } };
        row.imports += 1;
        pairs.set(key, row);
      }
    }
  }
}
const statedPairs = new Set();
const usesWithoutImport = [];
let componentUses = 0;
for (const edge of graph.edges) {
  if (edge.type !== "uses" || edge.claim !== "anchored") continue;
  const fromComponent = componentFor(edge.from);
  const toComponent = componentFor(edge.to);
  if (fromComponent === undefined || toComponent === undefined || fromComponent === toComponent) continue;
  componentUses += 1;
  const key = pairKey(fromComponent, toComponent);
  statedPairs.add(key);
  if (!pairs.has(key)) usesWithoutImport.push({ from: edge.from, to: edge.to, fromComponent, toComponent });
}
usesWithoutImport.sort((left, right) => byCodeUnit(left.from, right.from) || byCodeUnit(left.to, right.to));
const importsWithoutUses = [...pairs.entries()].filter(([key]) => !statedPairs.has(key)).map(([, row]) => row)
  .sort((left, right) => byCodeUnit(left.fromComponent, right.fromComponent) || byCodeUnit(left.toComponent, right.toComponent));
const unrealizedComponents = [];
for (const spec of g.specs()) {
  const value = g.specContext(spec.id)?.sections?.design?.id;
  if (typeof value !== "string") continue;
  const span = /^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u.exec(value);
  const componentId = span?.[2] ?? value;
  if (!/^component:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*$/u.test(componentId)) continue;
  const component = nodes.get(componentId);
  const realized = component?.nodeType === "CodeNode" && component.claim === "anchored" && graph.edges.some((edge) =>
    edge.from === componentId && edge.to === spec.id && edge.type === "satisfies" && edge.claim === "anchored");
  if (!realized) unrealizedComponents.push({ spec: spec.id, componentId });
}
unrealizedComponents.sort((left, right) => byCodeUnit(left.spec, right.spec));
const oneSided = {
  anchoredOnly: [...anchoredFiles].filter((file) => !files.has(file)).sort(byCodeUnit),
  importsOutsideComponents: [...files.keys()].filter((file) => !fileComponents.has(file)).sort(byCodeUnit),
};
return {
  input: { label: "external inferred input", schema: input.schema, adapter: input.adapter, files: files.size, exclude: input.exclude ?? [] },
  totals: {
    files: files.size, importEdges: [...files.values()].reduce((sum, imports) => sum + imports.size, 0),
    uncovered: uncovered.length, componentUses, usesWithoutImport: usesWithoutImport.length,
    importsWithoutUses: importsWithoutUses.length, unrealizedComponents: unrealizedComponents.length,
    anchoredOnly: oneSided.anchoredOnly.length, importsOutsideComponents: oneSided.importsOutsideComponents.length,
  },
  uncovered: uncovered.slice(0, limit), usesWithoutImport, importsWithoutUses, unrealizedComponents, oneSided,
};
```

`input` labels the file as external inferred input, with its schema, adapter, file count and
normalized exclusions. Read `input.exclude` beside `oneSided` to distinguish deliberate omissions
from missing input.
`totals` counts each list before the limit, the file import edges and the anchored cross-component
uses checked. `uncovered` ranks files with no code or test anchor by distinct importing files
(`fanIn`), then path; `fanOut` counts their distinct imports, including barrel reach.

`usesWithoutImport` names each anchored uses edge whose components share no directed file
import. `fromComponent` and `toComponent` are component ids. `importsWithoutUses` groups inferred
imports by directed component pair that no anchored uses states; `imports` counts distinct file
pairs, and `sample` gives the first pair in path order. A file with anchors in several components
contributes to each component pair. Same-component pairs stay out of both lists. Missing import
input can explain a mismatch, so inspect `oneSided` before editing an anchor.

`unrealizedComponents` reads the component-design convention's Design `id`, as a component id or
an opening code span. The row stays until that exact component has an anchored satisfies binding
to the design Spec; an existing id, a reference or another unit's realization is insufficient.
`oneSided.anchoredOnly` lists anchored source files absent from the input, and
`importsOutsideComponents` lists input files assigned to no anchored component, including anchored
units with no component. Component designs are declared intent, bindings are anchored, and
imports are inferred. Every mismatch and ranking is advice; the body changes nothing and no
finding enters validation. Bad parameters are input errors, not curation findings. The law is
`spec:consumers.impact-graph.curation-assist`.

## 41. The key-family register

*When you need this: you want a corpus's keyed values, such as limits, error messages or storage
tables, as a register derived each time you read it.*

`params.prefixes` is a non-empty list of unique non-empty strings, matched case-sensitively against
the start of each Design or UI key. It defaults to `["finding", "impact"]`. Pass at most one scope,
`params.pack` or `params.specs`; without either, the register reads the corpus. A repeated Spec id
is read once. Rule, flow and question keys and `description` are left out. Rows have no cap and
sort by key, Spec id and section in code-unit order. A malformed prefix list or scope returns only
`{ diagnostics: [{ parameter, problem }] }`.

```js
const accepts = ["prefixes", "pack", "specs"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const prefixes = params.prefixes ?? ["finding", "impact"];
const diagnostics = [];
const bad = (parameter, problem) => diagnostics.push({ parameter, problem });
if (params.prefixes === null || !Array.isArray(prefixes) || prefixes.length === 0 || !prefixes.every((prefix) => typeof prefix === "string" && prefix.length > 0) ||
  new Set(prefixes).size !== prefixes.length) bad("prefixes", "Expected a non-empty list of unique non-empty strings.");
if (params.pack !== undefined && params.specs !== undefined) bad("specs", "Supply at most one of pack or specs.");
let scope = { corpus: true }, ids = g.specs().map((spec) => spec.id);
if (params.pack !== undefined) {
  const pack = typeof params.pack === "string" ? g.packContext(params.pack) : undefined;
  if (!pack) bad("pack", "Pack does not resolve.");
  else {
    scope = { pack: params.pack }; ids = pack.members.map((member) => member.id);
    for (const member of pack.members) if (!member.resolved) bad("pack", `${member.id} does not resolve.`);
  }
} else if (params.specs !== undefined) {
  if (!Array.isArray(params.specs) || !params.specs.every((id) => typeof id === "string")) bad("specs", "Expected a list of Spec ids.");
  else {
    for (const id of params.specs) if (!g.specContext(id)) bad("specs", `${id} does not resolve.`);
    scope = { specs: params.specs }; ids = [...new Set(params.specs)];
  }
}
if (diagnostics.length) return { diagnostics };
const byCodeUnit = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const byPrefix = Object.fromEntries(prefixes.map((prefix) => [prefix, 0]));
const rows = [];
for (const id of ids) {
  const context = g.specContext(id);
  for (const section of ["design", "ui"]) {
    for (const [key, value] of Object.entries(context.sections?.[section] ?? {})) {
      if (key === "description") continue;
      const matched = prefixes.filter((prefix) => key.startsWith(prefix));
      if (matched.length === 0) continue;
      for (const prefix of matched) byPrefix[prefix] += 1;
      const at = context.entryLocations.find((row) => row.entry === `${section}.${key}`);
      rows.push({ key, spec: id, section, value, file: at?.file ?? context.file, line: at?.line ?? null });
    }
  }
}
rows.sort((a, b) => byCodeUnit(a.key, b.key) || byCodeUnit(a.spec, b.spec) || byCodeUnit(a.section, b.section));
return { prefixes, scope, totals: { rows: rows.length, specs: new Set(rows.map((row) => row.spec)).size, byPrefix }, rows };
```

The answer is `{ prefixes, scope, totals: { rows, specs, byPrefix }, rows }`, each row
`{ key, spec, section, value, file, line }`, with `line` null when the location table records none.
`byPrefix` counts a key under every prefix it matches. The law is
`spec:consumers.agent-surface.register-recipes`.

## 42. The architecture walk

*When you need this: check forbidden layer directions and isolated contexts against anchored uses.*

Pass `params.forbidden` as layer pairs `{ from, to }`, `params.isolated` as context tokens, or
both. `params.severity` defaults to `error`. An empty list checks nothing for that form. Missing
attributes appear in `unclassified`; they are curation gaps. With neither list, the answer gives
diagnostics. The same shipped body runs as an operator-selected rules file:

```sh
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity --rules dist/recipes/42-the-architecture-walk.js --params '{"forbidden":[{"from":"domain","to":"infrastructure"}]}'
```

```js
const accepts = ["forbidden", "isolated", "severity"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const layers = ["edge", "application", "domain", "adapter", "infrastructure"];
const token = /^[a-z][a-z0-9-]*$/u;
const diagnostics = [];
if (params.forbidden === undefined && params.isolated === undefined) diagnostics.push("Supply params.forbidden or params.isolated.");
const forbidden = params.forbidden === undefined ? [] : params.forbidden;
const isolated = params.isolated === undefined ? [] : params.isolated;
const severity = params.severity ?? "error";
if (!Array.isArray(forbidden) || forbidden.some((pair) => !pair || typeof pair !== "object" || !layers.includes(pair.from) || !layers.includes(pair.to))) diagnostics.push("forbidden must be a list of { from, to } pairs of layers.");
if (!Array.isArray(isolated) || isolated.some((context) => typeof context !== "string" || !token.test(context))) diagnostics.push("isolated must be a list of lowercase kebab context tokens.");
if (params.severity !== undefined && params.severity !== "error" && params.severity !== "warning") diagnostics.push("severity must be error or warning.");
if (diagnostics.length > 0) return { diagnostics };
const pairs = [...new Map(forbidden.map(({from, to}) => [`${from}:${to}`, {from, to}])).values()];
const contexts = [...new Set(isolated)];
const components = new Map(graph.nodes.filter((node) => node.nodeType === "CodeNode" && node.claim === "anchored" && node.id.startsWith("component:")).map((node) => [node.id, node]));
const membership = new Map(graph.edges.filter((edge) => edge.type === "memberOf" && edge.claim === "anchored").map((edge) => [edge.from, edge.to]));
const componentOf = (id) => components.get(id) ?? components.get(membership.get(id));
const summary = (node) => node ? { id: node.id, layer: node.layer ?? null, context: node.context ?? null } : null;
const uses = graph.edges.filter((edge) => edge.type === "uses" && edge.claim === "anchored");
const findings = [], unclassified = [];
let resolved = 0;
for (const { from, to } of uses) {
  const a = componentOf(from), b = componentOf(to);
  if (a && b) resolved++;
  const fromComponent = summary(a), toComponent = summary(b);
  if (!a || !b) {
    if (pairs.length > 0 || contexts.length > 0) unclassified.push({ from, to, fromComponent, toComponent, missing: ["component"] });
    continue;
  }
  if (a.id === b.id) continue;
  const missing = [];
  if (pairs.length > 0 && (a.layer === undefined || b.layer === undefined)) missing.push("layer");
  if (contexts.length > 0 && (a.context === undefined || b.context === undefined)) missing.push("context");
  if (missing.length > 0) unclassified.push({ from, to, fromComponent, toComponent, missing });
  const base = { subjectId: from, relatedId: to, severity, from, to, fromComponent, toComponent };
  for (const rule of pairs) {
    if (a.layer === rule.from && b.layer === rule.to) findings.push({ ...base, validatorId: "forbidden-layer", rule,
      message: `${from} uses ${to}: layer ${a.layer} uses layer ${b.layer} (${a.id} to ${b.id}), a forbidden pair` });
  }
  if (contexts.includes(a.context) && b.context !== undefined && a.context !== b.context) findings.push({ ...base, validatorId: "isolated-context", rule: { context: a.context },
    message: `${from} uses ${to}: ${a.id} in the isolated context ${a.context} uses ${b.id} in the context ${b.context}` });
}
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
findings.sort((a, b) => compare(a.from, b.from) || compare(a.to, b.to) || compare(a.validatorId, b.validatorId));
unclassified.sort((a, b) => compare(a.from, b.from) || compare(a.to, b.to));
return { input: { forbidden: pairs, isolated: contexts, severity }, totals: { usesEdges: uses.length, resolved, findings: findings.length, unclassified: unclassified.length }, findings, unclassified };
```

Findings retain both units, both component attributes and the rule breached. The runner prints the
shared finding fields. The law is `spec:validation.architecture-constraints`.

## 43. Planned against realized components

*When you need this: compare component designs with the anchors that realize them.*

This recipe takes no parameters. It selects Specs whose Design `id` names a component, then reads
only the keys the design states. A bare value or an opening code span carries the machine value;
prose after the span explains it. `uses: none` states an empty set. An omitted `uses` stays null.

```js
const accepts = [];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const read = (value) => typeof value === "string" ? (/^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u.exec(value)?.[2] ?? value).trim() : null;
const componentId = /^component:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*$/u;
const token = /^[a-z][a-z0-9-]*$/u;
const layers = ["edge", "application", "domain", "adapter", "infrastructure"];
const components = new Map(graph.nodes.filter((node) => node.nodeType === "CodeNode" && node.claim === "anchored" && node.id.startsWith("component:")).map((node) => [node.id, node]));
const membership = new Map(graph.edges.filter((edge) => edge.type === "memberOf" && edge.claim === "anchored").map((edge) => [edge.from, edge.to]));
const componentOf = (id) => components.get(id) ?? components.get(membership.get(id));
const uses = graph.edges.filter((edge) => edge.type === "uses" && edge.claim === "anchored");
const designs = graph.nodes.filter((node) => node.nodeType === "Primitive" && componentId.test(read(node.sections?.design?.id) ?? ""));
const unrealized = [], differing = [], unreadable = [];
let realizedCount = 0, matching = 0;
for (const spec of designs) {
  const entries = spec.sections.design;
  const id = read(entries.id);
  const planned = { layer: null, context: null, role: null, uses: null };
  const invalid = new Set();
  for (const key of ["layer", "context", "role", "uses"]) {
    if (entries[key] === undefined) continue;
    const value = read(entries[key]);
    let valid;
    if (key === "uses") {
      const ids = value === "none" ? [] : value?.split(",").map((item) => item.trim());
      valid = ids !== undefined && ids.every((item) => componentId.test(item));
      if (valid) planned.uses = [...new Set(ids)].sort(compare);
    } else {
      valid = value !== null && (key === "layer" ? layers.includes(value) : token.test(value));
      if (valid) planned[key] = value;
    }
    if (!valid) { invalid.add(key); unreadable.push({ spec: spec.id, key, value: entries[key] }); }
  }
  const anchor = components.get(id);
  const realized = anchor && graph.edges.some((edge) => edge.type === "satisfies" && edge.claim === "anchored" && edge.from === id && edge.to === spec.id);
  if (!realized) { unrealized.push({ spec: spec.id, componentId: id, anchorExists: Boolean(anchor), ...planned }); continue; }
  realizedCount++;
  const before = differing.length;
  for (const field of ["layer", "context", "role", "uses"]) {
    if (entries[field] === undefined || invalid.has(field)) continue;
    if (field === "uses") {
      const actual = new Set(uses.filter((edge) => componentOf(edge.from)?.id === id).map((edge) => componentOf(edge.to)?.id).filter((target) => target !== undefined && target !== id));
      const plannedOnly = planned.uses.filter((target) => !actual.has(target));
      const realizedOnly = [...actual].filter((target) => !planned.uses.includes(target)).sort(compare);
      if (plannedOnly.length > 0 || realizedOnly.length > 0) differing.push({ spec: spec.id, componentId: id, field, planned: plannedOnly, realized: realizedOnly });
    } else {
      const actual = anchor[field] ?? null;
      if (planned[field] !== actual) differing.push({ spec: spec.id, componentId: id, field, planned: planned[field], realized: actual });
    }
  }
  if (differing.length === before && invalid.size === 0) matching++;
}
unrealized.sort((a, b) => compare(a.spec, b.spec));
differing.sort((a, b) => compare(a.spec, b.spec) || compare(a.field, b.field));
unreadable.sort((a, b) => compare(a.spec, b.spec) || compare(a.key, b.key));
return { totals: { designs: designs.length, realized: realizedCount, matching, unrealized: unrealized.length, differing: differing.length, unreadable: unreadable.length }, unrealized, differing, unreadable };
```

An anchor without an anchored `satisfies` edge stays unrealized. `differing` counts rows; `matching`
counts realized designs with neither differences nor unreadable fields. The law is
`spec:model.planned-architecture`.

## 50. External registers

*When you need this:* Check the outside register tokens a corpus cites, or find held tokens no Spec cites.

Check a corpus's prose tokens against its own JSON register. Pass the file as
`--params register=@PATH`, bound to `params.register`, and a JavaScript regular-expression source as `params.pattern`.
The register has a `tokens` array of strings or `{ token, retired }` objects; other columns are
ignored. There is no sample register or pattern. Invalid input returns `diagnostics` without
`findings`, so it fails as a rules file. `params.severity` defaults to `error`; `params.uncited` set to true also
reports held tokens no Spec cites. The answer includes input, totals, cited token rows and
findings. Titles, narrative, section text, authored keys and relation reasons are read from the
graph. No Pack, id or source file is scanned.

The shipped file runs unchanged with `sdp validate --rules`. To check several registers, a rules
file calls recipe 50 once per register through `recipes(50, parameters)` and combines the findings.
The corpus's owner decides which registers it may cite.

```js
const accepts = ["register", "pattern", "severity", "uncited"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const diagnostics = [];
const diagnose = (parameter, problem) => diagnostics.push({ parameter, problem });
const record = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const register = params.register;
const severity = params.severity ?? "error";
const uncited = params.uncited ?? false;
if (params.severity === null || (severity !== "error" && severity !== "warning")) diagnose("severity", "expected error or warning");
if (params.uncited === null || typeof uncited !== "boolean") diagnose("uncited", "expected a boolean");
const held = new Map();
if (!record(register) || !Array.isArray(register.tokens)) {
  diagnose("register", "expected an object with a tokens array");
} else {
  for (const [index, item] of register.tokens.entries()) {
    const token = typeof item === "string" ? item : record(item) ? item.token : undefined;
    if (typeof token !== "string" || token.trim() === "" ||
        (typeof item !== "string" && item.retired !== undefined && typeof item.retired !== "boolean")) {
      diagnose("register", `tokens[${index}] must be a non-empty string or a token with an optional retired boolean`);
      continue;
    }
    if (held.has(token)) diagnose("register", `token ${token} is listed twice`);
    held.set(token, typeof item !== "string" && item.retired === true);
  }
}
let pattern;
if (typeof params.pattern !== "string") {
  diagnose("pattern", "expected a regular-expression source string");
} else {
  try {
    pattern = new RegExp(params.pattern, "gu");
    if ([..."".matchAll(pattern)].some((match) => match[0] === ""))
      diagnose("pattern", "must not match the empty string");
    for (const token of held.keys()) {
      const matches = [...token.matchAll(pattern)];
      if (matches.length !== 1 || matches[0][0] !== token)
        diagnose("pattern", `must match register token ${token} whole`);
    }
  } catch (error) {
    diagnose("pattern", `cannot compile: ${error.message}`);
  }
}
if (diagnostics.length > 0) return { diagnostics };
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const cited = new Map();
const findings = [];
let citations = 0;
const specs = g.specs();
for (const spec of specs) {
  const context = g.specContext(spec.id);
  if (context === undefined) continue;
  const lines = new Map(context.entryLocations.map((row) => [row.entry, row.line]));
  const texts = [];
  const add = (path, text, located) => {
    if (typeof text === "string") texts.push({ path, text, line: lines.get(located) });
  };
  const questionKey = (entry) => {
    const index = /^openQuestions\[(\d+)\]\.question$/u.exec(entry ?? "")?.[1];
    return index === undefined ? undefined : context.sections?.intent?.openQuestions?.[Number(index)]?.key;
  };
  const ruleKeys = context.sections?.behavior?.ruleKeys ?? {};
  const walk = (section, value, entry, topKey) => {
    const path = entry === null ? section : `${section}.${entry}`;
    const question = /^openQuestions\[(\d+)\](?:\.(question|decider|links|provisional|trigger)(?:\[\d+\])?)?$/u.exec(entry ?? "");
    const rule = /^(rules|flows)\[(\d+)\]$/u.exec(entry ?? "");
    const located = section === "intent" && question !== null
      ? `question[${question[1]}]${question[2] && question[2] !== "question" ? "." + question[2] : ""}`
      : section === "behavior" && rule !== null
        ? `${rule[1] === "rules" ? "rule" : "flow"}[${rule[2]}]`
        : section === "design" || section === "ui"
          ? entry === topKey ? path : undefined : path;
    if (typeof value === "string") {
      const key = section === "behavior" ? Object.keys(ruleKeys).find((key) => ruleKeys[key] === entry)
        : section === "intent" ? questionKey(entry) : undefined;
      add(path, key, located);
      add(path, value, located);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => walk(section, item, `${entry ?? ""}[${index}]`, topKey));
    } else if (record(value)) {
      const coined = section === "design" || section === "ui" || (section === "model" && entry === "terms");
      for (const [key, item] of Object.entries(value)) {
        const next = entry === null ? key : `${entry}.${key}`;
        if (section === "behavior" && entry === null && key === "ruleKeys") continue;
        if (section === "intent" && /^openQuestions\[\d+\]\.key$/u.test(next)) continue;
        const nextTop = entry === null ? key : topKey;
        if (coined && !(entry === null && key === "description"))
          add(`${section}.${next}`, key, (section === "design" || section === "ui") && entry !== null ? undefined : `${section}.${next}`);
        walk(section, item, next, nextTop);
      }
    }
  };
  add("title", context.title, "title");
  add("narrative", context.narrative, "narrative");
  for (const [section, value] of Object.entries(context.sections ?? {})) walk(section, value, null, null);
  for (const relation of context.relationsOut.filter((row) => row.claim === "declared").sort((a, b) =>
    (lines.get(`relation.${a.type}.${a.otherId}`) ?? Infinity) - (lines.get(`relation.${b.type}.${b.otherId}`) ?? Infinity))) {
    const path = `relation.${relation.type}.${relation.otherId}`;
    add(path, relation.reason, path);
  }
  const first = new Map();
  for (const text of texts) {
    for (const match of text.text.matchAll(pattern)) {
      const token = match[0];
      if (token === "") { diagnose("pattern", "must not match the empty string"); return { diagnostics }; }
      citations += 1;
      const row = cited.get(token) ?? { token, held: held.get(token) === false, retired: held.get(token) === true, citations: 0, specs: new Set() };
      row.citations += 1;
      row.specs.add(spec.id);
      cited.set(token, row);
      if (!first.has(token)) first.set(token, text);
    }
  }
  for (const [token, text] of first) {
    if (held.has(token) && !held.get(token)) continue;
    const retired = held.get(token) === true;
    findings.push({
      validatorId: retired ? "retired-token" : "unknown-token",
      subjectId: spec.id,
      relatedId: token,
      severity,
      message: `${spec.id} cites ${token}, which the register ${retired ? "retires" : "does not list"}`,
      file: spec.file,
      path: text.path,
      ...(text.line === undefined ? {} : { line: text.line }),
    });
  }
}
if (diagnostics.length > 0) return { diagnostics };
findings.sort((a, b) => compare(a.subjectId, b.subjectId) || compare(a.relatedId, b.relatedId));
if (uncited) for (const [token, retired] of held) {
  if (!retired && !cited.has(token)) findings.push({
    validatorId: "uncited-token", subjectId: token, severity,
    message: `${token} is held by the register and no Spec cites it`,
  });
}
return {
  input: { pattern: params.pattern, severity, uncited },
  totals: {
    specs: specs.length, citations, tokens: cited.size,
    unknown: findings.filter((row) => row.validatorId === "unknown-token").length,
    retired: findings.filter((row) => row.validatorId === "retired-token").length,
    uncited: findings.filter((row) => row.validatorId === "uncited-token").length,
  },
  tokens: [...cited.values()].sort((a, b) => compare(a.token, b.token)).map((row) => ({ ...row, specs: [...row.specs].sort(compare) })),
  findings,
};
```

## 51. Entry citations

Use this to find anchored source lines that cite a pinned declaration or another entry, and to
report citations that no longer resolve. Pass at most one of `params.pack` and `params.specs`;
without either, the scope is the corpus. `params.severity` is `error` by default or `warning`.
Only a non-empty `testAnchors` identifies a test line. A citation records no test verdict.

```js
const accepts = ["pack", "specs", "severity"];
const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
if (unknownParams.length > 0) return { unknownParams, accepts };
const diagnostics = [];
const severity = params.severity === undefined ? "error" : params.severity;
if (severity !== "error" && severity !== "warning") diagnostics.push({ parameter: "severity", problem: "Expected error or warning." });
const all = g.specs().map((spec) => spec.id);
const known = new Set(all);
const hasPack = params.pack !== undefined;
const hasSpecs = params.specs !== undefined;
if (hasPack && hasSpecs) diagnostics.push({ parameter: "scope", problem: "Expected at most one of pack or specs." });
let ids = all;
if (hasPack) {
  const pack = typeof params.pack === "string" ? g.packContext(params.pack) : undefined;
  if (pack === undefined) diagnostics.push({ parameter: "pack", problem: "Expected a Pack id that resolves." });
  else ids = pack.members.map((member) => member.id);
}
if (hasSpecs) {
  if (!Array.isArray(params.specs) || params.specs.some((id) => !known.has(id))) diagnostics.push({ parameter: "specs", problem: "Expected a list of Spec ids that resolve." });
  else ids = params.specs;
}
if (ids.some((id) => !known.has(id))) diagnostics.push({ parameter: "scope", problem: "Every member must name a Spec that resolves." });
if (diagnostics.length > 0) return { diagnostics };
const scope = hasPack ? { pack: params.pack } : hasSpecs ? { specs: params.specs } : { corpus: true };
const selected = new Set(ids);
const entries = new Map();
const citations = [];
for (const id of [...selected].sort()) {
  const context = g.specContext(id);
  for (const [key, value] of Object.entries(context.sections?.design ?? {})) {
    if (key === "description" || typeof value !== "string" || !/^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u.test(value)) continue;
    const address = `${id}#design.${key}`;
    entries.set(address, { address, spec: id, pinned: true, line: context.entryLocations.find((row) => row.entry === `design.${key}`)?.line ?? null, citedBy: [] });
  }
  for (const citation of context.entryCitations) {
    citations.push(citation);
    if (!citation.resolves) continue;
    let entry = entries.get(citation.address);
    if (entry === undefined) {
      entry = { address: citation.address, spec: id, pinned: false, line: context.entryLocations.find((row) => row.entry === citation.entry)?.line ?? null, citedBy: [] };
      entries.set(citation.address, entry);
    }
    entry.citedBy.push({ file: citation.file, line: citation.line, anchors: citation.anchors, testAnchors: citation.testAnchors });
  }
}
// Missing Specs have no Spec context; the reader resolves their addresses with the shared grammar.
const unresolved = citations.filter((row) => !row.resolves).map(({ address, reason, file, line }) => ({ address, reason, file, line }));
if (!hasPack && !hasSpecs) {
  for (const row of graph.citations ?? []) {
    const id = row.address.split("#")[0];
    if (known.has(id)) continue;
    const { reason } = g.resolveEntryAddress(row.address);
    unresolved.push({ ...row, reason });
  }
}
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
unresolved.sort((a, b) => compare(a.file, b.file) || a.line - b.line || compare(a.address, b.address));
const rows = [...entries.values()].sort((a, b) => compare(a.address, b.address));
for (const row of rows) row.citedBy.sort((a, b) => compare(a.file, b.file) || a.line - b.line);
const findings = unresolved.map((row) => {
  const [id, suffix = ""] = row.address.split("#");
  const dot = suffix.indexOf(".");
  const section = suffix.slice(0, dot);
  const key = suffix.slice(dot + 1);
  const why = row.reason === "malformed" ? "not an entry address" : row.reason === "spec" ? `no Spec ${id}` : row.reason === "section" ? `${id} has no ${section} entries` : `${id} has no ${section} entry ${key}`;
  return { validatorId: "unresolved-citation", subjectId: row.address, severity, message: `${row.address} cited at ${row.file}:${row.line} does not resolve: ${why}`, file: row.file, line: row.line };
});
return {
  scope,
  totals: { citations: citations.length, citedEntries: rows.filter((row) => row.citedBy.length > 0).length, declarations: rows.filter((row) => row.pinned).length, citedDeclarations: rows.filter((row) => row.pinned && row.citedBy.length > 0).length, unresolved: unresolved.length },
  entries: rows,
  unresolved,
  findings,
};
```
