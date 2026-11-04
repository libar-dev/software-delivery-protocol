# The graph

What the graph holds, the closed lists of its node types, edge types and claims, and how the
delivery facts derive from them.

## The shape of the graph

The graph's topology is flat: nodes and edges are separate arrays, and relations express
hierarchy, so every question is a filter or a join, never a tree walk. Section content may contain
nested values. `graph.locations` records authored entry locations: the source line of every keyed
Design and UI entry, every rule and flow entry, every Model term, every open question and each of
its fields, and every authored relation target. Primitive and Pack nodes carry no source lines;
Anchor and CodeNode nodes carry their binding file and line. A location is never an identity or a
binding target. Four node types exist:

- `Primitive` — one authored Spec, positioned by `specKind` × `altitude` × `readiness`, carrying
  its title, narrative, reified section content, and the derived `deliveryFacts`. Use case, NFR,
  decision record, epic, and story are coordinates on this one type, never separate node types.
- `Pack` — the review grouping, carrying its title, framing prose, ordered `members` as authored,
  optional `order`, and `modelRefs`. `belongsTo` edges re-express membership in the global edge
  order; read authored order from `members`, advisory priority when `order` is `priority` and
  reading order otherwise. A Pack states no system truth.
- `Anchor` — a test or oracle binding, with the `file` and `line` of the binding itself.
- `CodeNode` — the code unit a code anchor mints, from either form: a `codeAnchor` constant or a
  comment-form block whose id sits in the `impl:`, `api:`, or `component:` namespace. It carries
  `file`, `line`, an optional `label`, and three optional structural attributes: `role`, the
  architectural pattern the unit plays, on any unit; and on a `component:` unit only, `layer` (one
  of `edge`, `application`, `domain`, `adapter`, `infrastructure`) and `context`, its bounded
  context. None of the three confers anything. Structural `memberOf` and `uses` edges run between
  these units.

Twelve edge types exist, and the list is closed. Six are authored Spec relations: `refines`,
`dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, `supersedes`. Six are derived by
extraction: `belongsTo` (Pack membership), `satisfies` (code realization, one edge per target),
`references` (code that answers to a design), `models` (oracle binding), `memberOf` and `uses`
(anchored structure). A `references` edge runs from a code unit to a Spec and says only that the
code answers to that design without claiming to realize it: it confers no delivery fact, moves no
readiness floor, and the drift alarm ignores it. It runs one way. A design that builds on existing
code states that through its own `dependsOn` or `refines` to the Spec the code satisfies, so read
that dependency from the Spec's relations, never from the code. A relation name outside this list
is a bug in whatever prose named it, not a query to attempt. An authored edge may carry a
`reason`, one line on why it holds, and a declared `verifies` from an example may carry
`exercises`, the verified Spec's rule keys it exercises; neither changes what the edge confers.
IDs are namespaced (`spec:` · `pack:`
· `impl:` · `api:` · `component:` · `test:` · `oracle:`), and an edge whose target does not
resolve confers no delivery fact. Every node and edge carries exactly one claim; the edge contract is
`spec:extraction.derive-graph`, the claim law is `spec:extraction.claim-taxonomy`.

## How delivery state derives

Every fact enters the graph through one of three claims, and the claims are never collapsed.
Carrier prose, relations, and stated readiness are `declared` intent. Source anchors are `anchored`
bindings: a code anchor's `satisfies` records that this code realizes that Spec and its `references`
records only that the code answers to it, a test anchor records that this test verifies
its target Specs, an oracle anchor records that this function models that example space.
Structure the extractor computes on its own enters as `inferred`.

Delivery facts fall out of those edges. A Spec is `implemented` when a `satisfies` edge resolves to
it directly; the fact never travels through refinement. A Spec has `has-verifier` through either of
two routes: a resolving `specTest` anchor verifies the Spec directly, or a verifying example is an
enabled verifier, meaning that example is itself backed by a resolving `specTest` anchor. The
test's anchored `verifies` edge and the example's declared `verifies` edge share one relation type
under two claims. Stated readiness, derived readiness, and delivery facts are three
independent coordinates, and the standing queries (build backlog, drift alarm, readiness
divergence) are intersections of them. Runtime liveness would be `observed`, a designed-and-deferred
fact the graph does not derive today.

## Field names

Read a field by these names, never by guessing; the orientation's first query prints the live lists
for a corpus, and when it and this list disagree, the answer is right.

- `graph` holds `schemaVersion`, `nodes`, `edges`, `locations` and `citations`.
- Every node carries `id`, `nodeType` and `claim`. A `Primitive` adds `specKind`, `altitude`,
  `readiness`, `title`, `file`, `sections`, `deliveryFacts` and an optional `narrative`; a `Pack`
  adds `title`, `framing`, `file`, `members`, `modelRefs` and an optional `order`; a `CodeNode`
  adds `label`, `file`, `line` and the optional `role`, `layer` and `context`; an `Anchor` adds
  `label`, `file` and `line`.
- Every edge carries `from`, `type`, `to` and `claim`; an authored edge may add `reason`, and a
  declared `verifies` may add `exercises`.
- A `g.specs()` row carries `id`, `title`, `specKind`, `kindDisplayLabel`, `altitude`,
  `statedReadiness`, `derivedReadiness`, `deliveryFacts`, `file`, `packs` and an optional
  `narrative`. A `g.packs()` row carries `id`, `title`, `framing`, `file`, `modelRefs` and an
  optional `order`. Neither carries sections, relations, members or bindings.
- `g.specContext(id)` adds `sections`, `designColumns`, `floorFailures`, `nextRungFailures`,
  `statedNextRungFailures`, `relationsOut`, `relationsIn`, `implementations`, `references`,
  `verifiers`, `entryLocations`, `entryCitations` and `findings`. `g.packContext(id)` adds
  `members`, `verifierGaps`, `boundary` and `findings`.
- `g.findByConcept(term)` rows carry `id`, `nodeType`, `title` and `matchedIn`. `g.byFile(path)`
  answers `path`, `nodes` and `specs`. `g.blastRadius(files)` answers `changedFiles`,
  `impactedSpecs`, `impactedPacks`, `atRisk`, `coverageUnknown` and `unlinked`.
  `g.resolveEntryAddress(address)` answers `entry`, `resolves` and `reason`, with no wording, file
  or line: address resolution (recipe 25) adds those.
- A `report` finding carries `validatorId`, `family`, `severity`, `message` and, when it has
  them, `subjectId` and `file`.

## Vocabulary

The Protocol's ratified glossary is `CONTEXT.md` at the Protocol repository's root, and
`node_modules/@libar-dev/software-delivery-protocol/CONTEXT.md` in an adopter. It is separate from
any glossary your project keeps. Read it before inventing a term. The terms these queries speak:
`Spec` · `Pack` · `anchor` · constant form · comment form · `claim` · `references` · role · layer ·
context · delivery facts · readiness floor · derived readiness · blast radius · at-risk ·
coverage-unknown · gap · orphan.
