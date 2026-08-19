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

**Some recipes open with a parameter.** Recipes 3, 6, 9, and 14 take their subject on the opening
`const` line(s): a Spec id, a search term, or a component id. Those lines name *this* repository's
corpus so every body runs as written here (the recipe check executes each one verbatim); in your
own corpus, substitute your subject on that line before running. A Spec id or component id absent
from the graph returns `{ found: false }` rather than failing.

**Recipe 4 is different.** Recipe 4 filenames travel via `SDP_CHANGED_FILES_JSON`; callers never
substitute filenames into the JavaScript fence. Keep its query body static and pass changed paths
as JSON data through that environment variable, as shown in the recipe-4 instructions below.

**The contract, in one place.** The front door derives the graph in process and evaluates the body
you supply; `return` is the output contract. Three bindings are injected:

| Binding | What it is |
|---|---|
| `g` | the reader over the derived graph — the same `createReader` the package exports |
| `graph` | the raw graph schema object (nodes, edges, claims) |
| `report` | the validation report, so honesty findings are queryable data and never a gate |

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
coverage-unknown, at-risk — is ratified in `CONTEXT.md`.

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
const byFamily = {};

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

```js
const id = "spec:consumers.reader";
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

The caller acquires the changed paths and passes them as data, never as query source. From the repository root, this exact pipeline preserves every valid Git filename byte except NUL (which Git filenames cannot contain), including newlines, while JSON-encoding the NUL-delimited list before it reaches the environment:

```sh
SDP_CHANGED_FILES_JSON="$(git diff --name-only -z | node -e 'const fs = require("node:fs"); const names = fs.readFileSync(0).toString("utf8").split("\0"); process.stdout.write(JSON.stringify(names.slice(0, -1)));')" \
pnpm --silent sdp:q 'const changed = JSON.parse(process.env.SDP_CHANGED_FILES_JSON ?? "[]"); const radius = g.blastRadius(changed); const impactReasons = (item) => ({ id: item.id, reasons: item.reasons.map((reason) => reason.throughBinding === undefined ? { file: reason.file, via: null } : { file: reason.file, via: reason.throughBinding.id, edgeType: reason.throughBinding.edgeType, claim: reason.throughBinding.claim }) }); const atRiskReasons = (item) => ({ id: item.id, nodeType: item.nodeType, reasons: item.reasons.map((reason) => ({ from: reason.from, edgeType: reason.edgeType, to: reason.to, claim: reason.claim })) }); return { changedFiles: radius.changedFiles, impactedSpecs: radius.impactedSpecs.map(impactReasons), atRiskSpecs: radius.atRisk.filter((item) => item.nodeType === "Primitive").map(atRiskReasons), atRiskOther: radius.atRisk.filter((item) => item.nodeType !== "Primitive").map(atRiskReasons), coverageUnknownFiles: radius.coverageUnknown };' --json
```

The query body is static and reads only the JSON environment value; neither the shell nor the reader reevaluates filenames. `JSON.parse` receives data, so quotes, shell metacharacters, spaces, Unicode, and embedded newlines remain filenames rather than JavaScript or shell syntax. The reader never shells to git.

```js
const changed = JSON.parse(process.env.SDP_CHANGED_FILES_JSON ?? "[]");
const radius = g.blastRadius(changed);
const impactReasons = (item) => ({ id: item.id, reasons: item.reasons.map((reason) => reason.throughBinding === undefined ? { file: reason.file, via: null } : { file: reason.file, via: reason.throughBinding.id, edgeType: reason.throughBinding.edgeType, claim: reason.throughBinding.claim }) });
const atRiskReasons = (item) => ({ id: item.id, nodeType: item.nodeType, reasons: item.reasons.map((reason) => ({ from: reason.from, edgeType: reason.edgeType, to: reason.to, claim: reason.claim })) });
return { changedFiles: radius.changedFiles, impactedSpecs: radius.impactedSpecs.map(impactReasons), atRiskSpecs: radius.atRisk.filter((item) => item.nodeType === "Primitive").map(atRiskReasons), atRiskOther: radius.atRisk.filter((item) => item.nodeType !== "Primitive").map(atRiskReasons), coverageUnknownFiles: radius.coverageUnknown };
```

Every result class is returned. **Impacted Specs** are authored-at or bound-to a changed file. **At-risk Specs** are the one-hop Primitive neighbors; **atRiskOther** retains every other at-risk node and its `nodeType`. Each at-risk reason carries its connecting edge and claim, while **coverageUnknownFiles** names changed files the graph records nothing at. File-level reach never claims exhaustive symbol-level reach — that would ride the impact graph, which does not exist.

## 5. The Pack review backbone

*When you need this: you are reviewing a Pack as a unit and want its members' readiness, delivery
facts, and verifier gaps.*

```js
const packs = g.packs();

if (packs.length === 0) {
  return { packs: 0 };
}

const context = g.packContext(packs[0].id);
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

```js
const term = "blast radius";
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
refusals; on a green corpus both counts read zero.

## 9. Promotion preflight

*When you need this: you are considering a readiness edit and want the current graph-visible floor
evidence before touching the carrier.*

```js
const id = "spec:model.enrichment-lifecycle";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const rungs = ["idea", "scoped", "defined", "ready"];
const reached = context.derivedReadiness ?? "none";
const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached);

return {
  id,
  found: true,
  statedReadiness: context.statedReadiness,
  floorReached: reached,
  nextRung: rungs[reachedIndex + 1] ?? null,
  currentFloorFailures: context.floorFailures.map((failure) => ({
    clauseId: failure.clauseId,
    description: failure.description,
  })),
  firstUnmetClause: context.floorFailures[0]?.clauseId ?? null,
  promotionRequiresHumanStatement: true,
};
```

The `id` line is the recipe's parameter — substitute the Spec whose promotion you are weighing.
An empty `currentFloorFailures` list says the stated rung is honest. It does not confer the next
rung, and `floorReached` above the stated rung is information rather than an automatic edit.

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
const byFamily = {};

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

The opening `const subject` is the parameter. Replace it with the component you are reviewing; an
unknown subject returns the exact not-found shape and does not throw.

```js
const subject = "component:protocol.reader";
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
