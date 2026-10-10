# Agent-surface recipes

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

The same CLI publishes four independent read roots with `view`, `census`, `mermaid`, and `gherkin`.
Repository generation/check scripts run the private projection suite so all four survive and are
certified together; graph questions still enter through `q`.

For adopters, the portable form keeps root and exclusions project-selected:

```sh
pnpm exec sdp q '<body>' --root PATH
pnpm exec sdp q '<body>' --root PATH --exclude PATH --exclude PATH
```

`--root PATH` picks the extraction root (default: the working directory) and `--exclude` is
repeatable for root-relative path prefixes. `PATH` is a placeholder, not a literal directory.

**Some recipes take a parameter.** Recipes 3, 4, 5, 6, 9, 14, 19, 21, 22, 23, 25, 27, 29, and 30
read their subject from the `params` binding on their opening line: a Spec id, a list of changed
files, a Pack id, a search term, a component id, a list of Spec ids, or a list of entry addresses.
Each recipe names its parameter. Pass it as JSON data with `--params`, never by editing the body:

```sh
pnpm --silent sdp:q '<body>' --params '{"spec":"spec:model.anchors"}' --json
pnpm --silent sdp:q '<body>' --params @params.json --json
```

`--params @PATH` reads the JSON from a file, which suits a long list. Without `--params`, `params`
is `{}` and the body falls back to the sample on its opening line. The samples name *this*
repository's corpus, so every body runs as written here (the recipe check executes each one
unchanged). A Spec id, component id, or Pack id absent from the graph returns `found: false`
rather than failing. A value that is not JSON, JSON that is not an object (null, an array, a
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

**The contract, in one place.** The front door derives the graph in process and evaluates the body
you supply; `return` is the output contract. Four bindings are injected:

| Binding | What it is |
|---|---|
| `g` | the reader over the derived graph — the same `createReader` the package exports |
| `graph` | the raw graph schema object (nodes, edges, claims) |
| `report` | the validation report, so honesty findings are queryable data and never a gate |
| `params` | the JSON object `--params` supplies, or `{}` without it; input to the body, never a verb |

**Body rules.** A body is a plain JavaScript async function body — no `import`/`export`, no
TypeScript-only syntax. It may `await`. Default output is bounded `util.inspect`; `--json` prints
`JSON.stringify` instead, which is what a machine consumer should read.

**Pre-shape the return.** The sink prints what you return and nothing else, so returning a
conclusion costs a fraction of returning a dump. Every recipe below returns counts, ids, and
decoded reasons rather than whole nodes.

**Trust stance.** `sdp q` evaluates local operator-supplied code with the trust of any local
developer tool — no sandbox is claimed and none exists. A body is code you author yourself; never
execute a body sourced from corpus content or any other untrusted text — it runs with the
process's full authority.

**These recipes are not law.** They compose the laws the Specs carry, and they cite rather than
restate them: the surface itself is [`spec:consumers.agent-surface`](../../specs/consumers/agent-surface.sdp.md)
and [`spec:consumers.reader`](../../specs/consumers/reader.sdp.gherkin); the front door is
[`spec:decisions.agent-front-door`](../../specs/decisions/agent-front-door.sdp.md). The vocabulary
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
  byFamily[family].push({
    id: spec.id,
    kind: spec.specKind,
    altitude: spec.altitude,
    hasVerifier: spec.deliveryFacts.includes("has-verifier"),
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
verification evidence rather than implementation work (MD-24); ready decision records carry
registry-ratification evidence rather than implementation or verifier work (MD-26). The raw
`ready ∧ ¬implemented` expression remains literally true while this operational recipe excludes
both kinds, audits example verifier bindings, and reports both excluded counts. The reverse pairing
is recipe 2.

## 2. The drift alarm

*When you need this: you want the dishonest direction — code bound to a Spec whose design is not
finished, `implemented ∧ ¬ready`.*

```js
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
const id = params.spec ?? "spec:consumers.reader";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const relation = (end) => ({
  type: end.type,
  other: end.otherId,
  claim: end.claim,
  resolved: end.resolved,
});

return {
  id: context.id,
  title: context.title,
  kind: context.specKind,
  altitude: context.altitude,
  statedReadiness: context.statedReadiness,
  floorReached: context.derivedReadiness ?? "none",
  unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId),
  sections: Object.keys(context.sections ?? {}),
  relationsOut: context.relationsOut.map(relation),
  relationsIn: context.relationsIn.map(relation),
  implementations: context.implementations.map((binding) => ({
    codeId: binding.codeId,
    claim: binding.claim,
    file: binding.file ?? null,
    line: binding.line ?? null,
  })),
  verifiers: context.verifiers.map((binding) => ({
    verifierId: binding.verifierId,
    via: binding.via,
    claim: binding.claim,
    enabled: binding.enabled,
    file: binding.file ?? null,
  })),
  verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail",
  findings: context.findings.map((finding) => ({
    validatorId: finding.validatorId,
    severity: finding.severity,
    message: finding.message,
  })),
};
```

Every relation carries its `claim` and the claim is never collapsed: `declared` is authored intent,
`anchored` is a human binding from source, `inferred` is machine-derived structure. `has-verifier`
rides an *enabled* verifier — a resolving test anchor — and states that a verifier **exists**, not
that it passed. Pass/fail is CI's, exactly as skip and quarantine are.

## 4. What breaks if I change these files

*When you need this: you have a diff (or are about to make one) and want the Specs it reaches.*

The parameter is `params.files`, the list of changed paths, relative to the root. The caller
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
const changed = params.files ?? [];
const radius = g.blastRadius(changed);
const impactReasons = (item) => ({ id: item.id, reasons: item.reasons.map((reason) => reason.throughBinding === undefined ? { file: reason.file, via: null } : { file: reason.file, via: reason.throughBinding.id, edgeType: reason.throughBinding.edgeType, claim: reason.throughBinding.claim }) });
const atRiskReasons = (item) => ({ id: item.id, nodeType: item.nodeType, reasons: item.reasons.map((reason) => ({ from: reason.from, edgeType: reason.edgeType, to: reason.to, claim: reason.claim })) });
return { changedFiles: radius.changedFiles, impactedSpecs: radius.impactedSpecs.map(impactReasons), atRiskSpecs: radius.atRisk.filter((item) => item.nodeType === "Primitive").map(atRiskReasons), atRiskOther: radius.atRisk.filter((item) => item.nodeType !== "Primitive").map(atRiskReasons), coverageUnknownFiles: radius.coverageUnknown, unlinkedUnits: radius.unlinked.map((unit) => ({ id: unit.id, file: unit.file })) };
```

Every result class is returned. **Impacted Specs** are authored-at or bound-to a changed file. **At-risk Specs** are the one-hop Primitive neighbors; **atRiskOther** retains every other at-risk node and its `nodeType`. Each at-risk reason carries its connecting edge and claim, while **coverageUnknownFiles** names changed files the graph records nothing at. **unlinkedUnits** names each changed code unit that binds no Spec, such as an identity-only anchor, with its file; it is recorded, so its file is not coverage-unknown, and it implies no coverage. File-level reach never claims exhaustive symbol-level reach — that would ride the impact graph, which does not exist.

## 5. The Pack review backbone

*When you need this: you are reviewing a Pack as a unit and want its members' readiness, delivery
facts, and verifier gaps.*

The parameter is `params.pack`, the Pack to review; without it the body reads the first Pack in
the graph. An unknown Pack returns `{ id, found: false }`.

```js
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
const warnings = report.findings.filter((finding) => finding.severity === "warning");
const byValidator = {};

for (const finding of warnings) {
  byValidator[finding.validatorId] = (byValidator[finding.validatorId] ?? 0) + 1;
}

return {
  errors: report.findings.filter((finding) => finding.severity === "error").length,
  warnings: warnings.length,
  byValidator,
  signals: warnings.slice(0, 25).map((finding) => ({
    validatorId: finding.validatorId,
    family: finding.family,
    subjectId: finding.subjectId ?? null,
    message: finding.message,
  })),
};
```

`report` is the same validation output `g.findings()` exposes — one validation path, never a second
one. Gaps and orphans are warn-level by design: a `ready` Spec with no verifier and a Spec nothing
points at are both worth surfacing and neither is a failure. Errors are the conformance and honesty
refusals; a green corpus has no errors, but may carry intentional warnings.

## 9. Promotion preflight

*When you need this: you are considering a readiness edit and want the current graph-visible floor
evidence before touching the carrier.*

```js
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
  nextRung: rungs[reachedIndex + 1] ?? null,
  currentFloorFailures: context.floorFailures.map(shape),
  firstUnmetClause: context.floorFailures[0]?.clauseId ?? null,
  nextRungFailures: context.nextRungFailures.map(shape),
  nextRungFirstUnmetClause: context.nextRungFailures[0]?.clauseId ?? null,
  promotionRequiresHumanStatement: true,
};
```

The parameter is `params.spec`, the Spec whose promotion you are weighing.
An empty `currentFloorFailures` list says the stated rung is honest. It does not confer the next
rung, and `floorReached` above the stated rung is information rather than an automatic edit.
`nextRungFailures` are the unmet clauses of `nextRung`, and a typed-dependency failure lists its
`targets`; neither confers the rung.

## 10. Declared versus enabled verifiers

*When you need this: you want example intent and graph-visible verifier realization kept distinct.*

```js
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

*When you need this: you want every non-ready Spec grouped by family, with current floor evidence
visible instead of hidden in plan prose.*

```js
const lower = g.specs().filter((spec) => spec.statedReadiness !== "ready");
const byFamily = Object.create(null);

for (const spec of lower) {
  const family = spec.id.slice("spec:".length).split(".")[0];
  const context = g.specContext(spec.id);
  const failures = context?.floorFailures ?? [];

  byFamily[family] = byFamily[family] ?? [];
  byFamily[family].push({
    id: spec.id,
    statedReadiness: spec.statedReadiness,
    floorReached: spec.derivedReadiness ?? "none",
    nextUnmetClause: failures[0]?.clauseId ?? null,
  });
}

return { total: lower.length, byFamily };
```

`nextUnmetClause: null` means the current stated floor has no failure. It is not permission to
promote: the next rung may require evidence the current-floor evaluator was not asked to police,
and `ready` always remains a human statement.

## 12. Component membership

*When you need this: you want to know which code units belong to each declared component.*

```js
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
component dependencies, not a validation finding.

## 14. Structural neighborhood

*When you need this: you want the members, neighboring components, and Specs satisfied by one component.*

The parameter is `params.component`, the component you are reviewing; an unknown component
returns the exact not-found shape and does not throw.

```js
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
const dependencyNeighbors = (type, end) => [...new Set(
  graph.edges
    .filter((edge) => edge.type === type && edge[end === "to" ? "from" : "to"] === id)
    .map((edge) => edge[end]),
)].sort().map((specId) => ({
  id: specId,
  statedReadiness: readinessById.get(specId) ?? null,
}));
const dependsOn = dependencyNeighbors("dependsOn", "to");
const dependedOnBy = dependencyNeighbors("dependsOn", "from");
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
and as a shaping decision. Dependency neighbors carry `statedReadiness` because an unready
`dependsOn` target holds back the subject's `ready`. For every Spec the subject rests on, across `refines`, `dependsOn`,
`constrainedBy`, and `decidedBy`, with the floor each one reaches, use dependency footing
(recipe 21). The graph does not derive symbol-level impact;
`implemented` still means a code anchor binds, never that the code is live.

## 20. Open-question register

*When you need this: you want every open question in the corpus in one table, blocking ones
first, without keeping that table by hand.*

```js
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

## 21. Dependency footing

*When you need this: you are weighing `ready` on one Spec and want every Spec it rests on, with
the rung each one states and the floor each one reaches. For the floor's verdict on the Spec
itself, run promotion preflight (recipe 9).*

The parameter is `params.spec`, the Spec you are weighing; an unknown id returns
`{ id, found: false }` rather than failing.

```js
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
`constrainedBy`, or `decidedBy`, in that order and then by target id. The reach is one hop; run
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
const scope = params.scope ?? [];
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
  /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*(?:#(design|ui|question)\.([a-z][A-Za-z0-9]*))?$/u;
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
      texts.push({ at: { section, entry }, text: value });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => collect(item, section, `${entry ?? ""}[${index}]`));
    } else if (typeof value === "object" && value !== null) {
      for (const [key, item] of Object.entries(value))
        collect(item, section, entry === null ? key : `${entry}.${key}`);
    }
  };

  collect(context.narrative, "narrative");

  for (const [section, content] of Object.entries(context.sections ?? {})) {
    if (section !== "behavior" || typeof content !== "object" || content === null) {
      collect(content, section);
      continue;
    }

    // The two fences are skipped by position, never by key name alone: `behavior.exampleSpace`
    // is the gwt-vocabulary fence, and an object entry of `behavior.examples` is a gwt fence.
    for (const [key, entry] of Object.entries(content)) {
      if (key === "exampleSpace") continue;
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

  for (const { at, text } of texts) {
    for (const match of text.replace(escapePattern, "$1").matchAll(idPattern)) {
      const rest = match[0].slice("spec:".length).replace(/[.,;:!?*_~]+$/u, "");
      if (rest === "") continue;
      const token = `spec:${rest}`;
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
  unbacked,
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
in Design or UI, or a question key no open question of the Spec carries.
An entry address is `spec:<id>#design.<key>` or `spec:<id>#ui.<key>`, with a key matching
`^[a-z][A-Za-z0-9]*$`. It resolves against the named Spec's own section keys. An entry address may
also be `spec:<id>#question.<key>`, which resolves when one of the named Spec's open questions
carries that key in its marker; there `description` is an ordinary key.

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

## 23. Entry search

*When you need this: you hold a word or a key and want the entries that carry it, where concept
search (recipe 6) stops at the section.*

The parameter is `params.term`, your word or phrase; an empty term returns no matches.

```js
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
  const addressOf = (section, entry) => {
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
    const index = /^openQuestions\[(\d+)\](?:\.question)?$/u.exec(entry ?? "")?.[1];
    const located =
      section === "intent" && index !== undefined
        ? `question[${index}]`
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
      ...(key !== null && hits(key) ? ["key"] : []),
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
      value.forEach((item, index) => walk(section, item, `${entry ?? ""}[${index}]`, null, null));
    } else if (typeof value === "object" && value !== null) {
      // A key the author coins is content: any key of the open sections (`design`, `ui`) except
      // `description`, a `model.terms` term, and the key of an open question, which travels with
      // the text of that question and is never a row of its own. A key the carrier fixes
      // (`outcome`, `rules`, `given`) is structure and never matches.
      const coined =
        section === "design" || section === "ui" || (section === "model" && entry === "terms");
      for (const [name, item] of Object.entries(value)) {
        const path = entry === null ? name : `${entry}.${name}`;
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
and that key matches as the row's key; the key is not a row of its own. `description` in Design or
UI, off-grammar keys, other nested paths, and all other sections have `null`.
Each row also carries `line`, the line in the Spec's carrier where the entry starts, from the
location table the Spec context carries. The table locates a top-level Design or UI key other than
`description` and the text of an open question, at `openQuestions[<n>].question` or, for a question
written as a plain string, at `openQuestions[<n>]`, so a row for any other entry has `line: null`, as
does an entry the carrier did not locate; null reads as not located, never as absent
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
the terms of `model`, and the keys of open questions.
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

```js
const addresses = params.addresses ?? [
  "spec:consumers.design-review#ui.packPage",
  "spec:consumers.design-review#ui.memberTable",
  "spec:consumers.absent#design.anyKey",
  "spec:consumers.design-review",
];
const pattern =
  /^(spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*)#(design|ui|question)\.([a-z][A-Za-z0-9]*)$/u;
const specIds = new Set(g.specs().map((spec) => spec.id));
const entryOf = (sections, section, key) => {
  if (section === "question") {
    const questions = sections.intent?.openQuestions;
    const index = Array.isArray(questions)
      ? questions.findIndex(
          (entry) => typeof entry === "object" && entry !== null && entry.key === key,
        )
      : -1;
    return index < 0
      ? undefined
      : { value: questions[index].question, entry: `question[${index}]` };
  }
  const entries = sections[section];
  if (key === "description" || typeof entries !== "object" || entries === null) return undefined;
  return Object.hasOwn(entries, key)
    ? { value: entries[key], entry: `${section}.${key}` }
    : undefined;
};
const rows = addresses.map((address) => {
  const miss = (reason) => ({
    address,
    resolves: false,
    id: null,
    section: null,
    key: null,
    value: null,
    file: null,
    line: null,
    reason,
  });
  const parsed = typeof address === "string" ? pattern.exec(address) : null;
  if (parsed === null) return miss("malformed");
  const [, id, section, key] = parsed;
  if (!specIds.has(id)) return miss("spec");
  const context = g.specContext(id);
  const found = entryOf(context.sections ?? {}, section, key);
  if (found === undefined) return miss("entry");
  const location = context.entryLocations.find((row) => row.entry === found.entry);
  return {
    address,
    resolves: true,
    id,
    section,
    key,
    value: found.value,
    file: location?.file ?? null,
    line: location?.line ?? null,
    reason: null,
  };
});
const count = (reason) => rows.filter((row) => row.reason === reason).length;

return {
  totals: {
    addresses: rows.length,
    resolved: rows.filter((row) => row.resolves).length,
    malformed: count("malformed"),
    spec: count("spec"),
    entry: count("entry"),
  },
  rows,
};
```

Each row answers one input, in input order, repeats included. A row that resolves carries the
Spec `id`, the `section` (`design`, `ui`, or `question`), the `key`, the entry's `value`, and
`reason: null`. The value is the Design or UI entry's value as the graph holds it, or the
question's text. `file` and `line` say where the entry is written, from the location table the
Spec context carries; both are null when the carrier did not locate the entry, which reads as not
located, never as absent. A row that does not resolve carries `id`, `section`, `key`, `value`,
`file`, and `line` as null and one `reason`: `"malformed"` for an
input that is not an entry address, a bare Spec id, a `pack:` id, and a value that is not a string
among them; `"spec"` for an address whose Spec is absent; and `"entry"` for an address whose Spec
holds no such entry. A Design or UI key resolves as an own key of that section other than
`description`. A question key resolves when one of the Spec's open questions carries it in its
marker, `[blocking #aggregateReach]`. These are the grammar and the rule `sdp validate` applies to
an address written in a Spec's prose, under `spec:decisions.checked-mentions`; the mention audit
(recipe 22) reads addresses inside the Specs, and this recipe reads the ones written anywhere
else. `totals` counts the inputs, the resolving rows, and each reason. The laws are
`spec:consumers.agent-surface.address-and-cycle-recipes` and, for the value, file and line,
`spec:extraction.entry-locations`.

## 26. Dependency cycles

*When you need this: you want every place where Specs rest on each other, or on themselves,
through `dependsOn`.*

```js
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
};
```

The body takes no parameter and reads the whole graph. The walk keeps its own frame stack, so a
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

## 27. References into a design

*When you need this: you are reviewing a Pack and want to see, for each member, which code
answers to it, which code realizes it, whether a verifier is bound, and which built Specs it
builds on, with no fact read as another.*

The parameter is `params.pack`, the Pack you are reviewing; an unknown Pack returns
`{ id, found: false }`.

```js
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
member by member: what holds each one below its next rung, what design it carries, which code
answers to it, and what the Pack rests on, as data a page or a script renders.*

The parameter is `params.pack`, the Pack you are designing; an unknown Pack returns
`{ id, found: false }`.

```js
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

return {
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
  },
  members,
  boundary: {
    restsOn: pack.boundary.restsOn.map(boundaryRow),
    restedOnBy: pack.boundary.restedOnBy.map(boundaryRow),
  },
};
```

The body pre-shapes the Pack design the reader assembles on the Pack context and computes nothing
of its own. Members keep the manifest's order. Each resolved member carries its stated rung, the
floor reached (`"none"` when no rung derives), and its stated next rung, the rung above the stated
one, `null` at `ready`. `statedNextRungFailures` lists the floor clauses that hold the member below
that rung, each with its `targets` when it names dependencies. An empty list beside a next rung
means the floor already holds that rung: the rung waits for its author, and
`totals.waitingForAuthor` counts those members. It is never a promotion. Promotion preflight
(recipe 9) reads the rung above the floor reached instead, under its own names.

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
relate to a member by any authored relation. Each row carries the outside Spec's stated rung,
whether it carries `implemented`, and under `via` the members it joins per relation type. The
columns are counts and lists, never a score or a rung. The Design Review's Pack page renders the
same assembly. The laws are `spec:consumers.pack-design` and
`spec:consumers.agent-surface.design-recipes`.

## 30. Design-change impact

*When you need this: you are about to change a Spec's design and want every Spec that rests on it,
with the code, verifiers and Packs the change asks to follow.*

The parameter is `params.specs`, the Spec ids you are changing; an id the graph does not hold comes
back in `changed` with `resolved: false` and reaches nothing.

```js
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
it, what it shapes, and what it leaves open, read from the graph instead of kept by hand.*

```js
const byCodeUnit = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const ends = (relations, type) =>
  relations
    .filter((relation) => relation.type === type)
    .map((relation) => relation.otherId)
    .sort(byCodeUnit);
const rows = g
  .specs()
  .filter((spec) => spec.specKind === "decision")
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
      shapes: ends(context.relationsIn, "decidedBy"),
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
follow either to walk a chain. `shapes` lists the Specs that name the decision through
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
const rows = [];
for (const edge of uses) {
  const from = componentFor(edge.from);
  const to = componentFor(edge.to);
  if (from === undefined || to === undefined) continue;
  resolved += 1;
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
`totals.byContextPair` and `totals.byLayerPair` tally the crossings as `from -> to`, so the
direction of a corpus's dependencies reads at a glance. The recipe reports and never refuses: which
crossings are lawful is the corpus's own rule, as the architectural annotation decision leaves it.
Roles, layers and contexts (recipe 28) lists the values the anchors state. The law is
`spec:consumers.agent-surface.design-recipes`.
