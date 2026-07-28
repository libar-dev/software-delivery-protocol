# Agent-surface recipes

Runnable bodies for the agent front door. Each recipe below is a body you can pass verbatim to
`sdp q`, unchanged:

```sh
sdp q '<body>' --exclude explorations --exclude examples --exclude test/fixtures/import/parity
sdp q '<body>' --exclude explorations --exclude examples --exclude test/fixtures/import/parity --json
```

**At this repository's root the exclusions are not optional.** The corpus carries deliberate
duplicate-id and carrier-parity fixtures under `examples/`, `explorations/`, and
`test/fixtures/import/parity/`; without those three exclusions the extractor reports errors, the
graph does not derive, and the sink refuses to run the body at all. The three above are exactly the
project's own — the same list `npm run generate:self-hosting` passes and the same list the recipe
check derives with.

For adopters, the portable form keeps root and exclusions project-selected:

```sh
sdp q '<body>' --root PATH
sdp q '<body>' --root PATH --exclude PATH --exclude PATH
```

`--root PATH` picks the extraction root (default: the working directory) and `--exclude` is
repeatable for root-relative path prefixes. `PATH` is a placeholder, not a literal directory.

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
and [`spec:consumers.reader`](../../specs/consumers/reader.sdp.md); the front door is
[`spec:decisions.agent-front-door`](../../specs/decisions/agent-front-door.sdp.md). The vocabulary
these bodies speak — claims, delivery facts, stated versus derived readiness, blast radius,
coverage-unknown, at-risk — is ratified in `CONTEXT.md`.

**Recipes are the growth valve.** When a question is not answered below, script it; do not reach
for a new query verb. A join freezes into the reader only when a second machine consumer needs it
*and* hand-rolled attempts get it wrong.

---

## 1. The build backlog

*When you need this: you are picking up work and want the non-example Specs whose design is
finished and whose code is not — `ready ∧ kind≠example ∧ ¬implemented` — while keeping ready
example evidence visible as an audited exclusion.*

```js
const ready = g.specs().filter((spec) => spec.statedReadiness === "ready");
const backlog = ready.filter(
  (spec) => spec.specKind !== "example" && !spec.deliveryFacts.includes("implemented"),
);
const excludedExamples = ready.filter(
  (spec) => spec.specKind === "example" && !spec.deliveryFacts.includes("implemented"),
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
  excludedWithoutVerifier: excludedExamples
    .filter((spec) => !spec.deliveryFacts.includes("has-verifier"))
    .map((spec) => spec.id),
};
```

`implemented` is a delivery fact: it says a code anchor *binds* to the Spec, never that the code
works or is live. It never propagates through refinement. Ready examples normally carry
verification evidence rather than implementation work, so the example realization posture
(MD-24) keeps the raw `ready ∧ ¬implemented` expression literally true while this operational
recipe excludes examples and audits their verifier bindings. The reverse pairing is recipe 2.

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

```js
const changed = ["src/reader/reader.ts", "docs/agent-surface/recipes.md"];
const radius = g.blastRadius(changed);
const impacted = (items) =>
  items.map((item) => ({
    id: item.id,
    reasons: item.reasons.map((reason) =>
      reason.throughBinding === undefined
        ? { file: reason.file, via: null }
        : {
            file: reason.file,
            via: reason.throughBinding.id,
            edgeType: reason.throughBinding.edgeType,
            claim: reason.throughBinding.claim,
          },
    ),
  }));

return {
  changedFiles: radius.changedFiles,
  impactedSpecs: impacted(radius.impactedSpecs),
  impactedPacks: impacted(radius.impactedPacks),
  atRisk: radius.atRisk.map((item) => ({
    id: item.id,
    nodeType: item.nodeType,
    reasons: item.reasons.map((reason) => ({
      from: reason.from,
      edgeType: reason.edgeType,
      to: reason.to,
      claim: reason.claim,
    })),
  })),
  coverageUnknown: radius.coverageUnknown,
};
```

Three result classes, and none of them may be dropped. **Impacted** is authored-at or bound-to a
changed file. **At-risk** is one explicit hop away, with the connecting edge and its claim carried.
**Coverage-unknown** is the honest blind spot: a changed file the graph records nothing at. File
level reach never claims exhaustive symbol-level reach — that would ride the impact graph, which
does not exist.

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
