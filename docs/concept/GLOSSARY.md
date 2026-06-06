# Ubiquitous Language — Libar Omni

The canonical vocabulary of the system itself (not of the Order-Management running example). This file is the
**single source of truth for terminology**: the concept-doc cleanup applies these names, and any deviation is a
bug to fix, not a synonym to tolerate. Opinionated by design — where several words exist for one concept, one is
chosen and the rest are listed as *aliases to avoid*.

> Method: a DDD ubiquitous-language pass. Status: **ratifies the decisions locked in
> `plans/please-do-a-pedantic-tidy-dove.md` (D1–D6, tensions A–F)**; this is step 2 of the `2 → 1` sequence
> (ratify language, then execute the cleanup). Provisional terms are settled in *Flagged ambiguities* below.

## The primitive & its positioning

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Spec** | The one persistent primitive: a statement of desired system truth, enriched in place and never migrated to another artifact type. | requirement, ticket, artifact, document, story |
| **Envelope** | A Spec's stable minimal outer shape (`id`, `title`, `kind`, `abstraction`, `readiness`, `relations`); changes almost never. | header, schema, base |
| **Facet** | An optional typed slice of detail on a Spec (intent, behavior, constraints, model, design, decision, verification, ui); the extension surface where the system grows. | field, section, attribute |
| **Kind** | What *category of truth* a Spec states: `capability·behavior·workflow·example·rule·constraint·model·decision·contract`. One per Spec. | type, artifact type, category (loose) |
| **Abstraction** | A Spec's *intent altitude* on one scale: `domain → capability → feature → scenario`. Not a lifecycle stage. | level, tier, scope, granularity |
| **Readiness** | The *design maturity* the author **claims**: `sketch → framed → specified → designed → ready`. A claim validators check — never delivery status. | status, state, stage, phase, maturity (loose) |
| **Ready** | The top readiness rung: reviewed in context (at the design-review projection) and implementation-ready — nothing in the design blocks a build agent. | done, complete, approved, final |

## Delivery facts (derived, never authored)

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Delivery fact** | A truth about a Spec's *realization*, **computed from graph edges** and shown as a badge — never written by an author. | readiness, status, state |
| **Implemented** | Delivery fact: at least one `satisfies` edge resolves to the Spec (code claims to realise it). | built, done, bound |
| **Has-verifier** | Delivery fact: an enabled executable verifier links to the Spec via `verifies` (a verifier *exists* — not that it passed). | verified, tested, passing, executable |
| **Observed** | Delivery fact (ASPIRATIONAL): runtime evidence links to the Spec's target. | monitored, live |

## Grouping & domain vocabulary

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Pack** (`SpecPack`) | A reified aggregate over Specs and the recurring **review unit**; not a Spec and not a delivery artifact. | group, bundle, epic, collection, module |
| **Manifest** | A Pack's `specs: [...]` list — the single source of membership; the per-member `belongsTo → pack` edge is *derived* from it. | membership list, index |
| **Model** | The *domain-vocabulary* sense only: the `model` **facet** (terms + concepts) and the `kind:"model"` Spec when that vocabulary is itself significant. Vocabulary and meaning — **not** ORM/schema/persistence. | schema, data model, ERD, the graph (see ambiguities) |
| **Term** / **Concept** | Entries in a model facet: a defined word (**term**) and a named domain thing (**concept**, e.g. an event or actor). | entity (loose), object |
| **modelRefs** | A Pack's references to `kind:"model"` Specs — the one way a Pack shares vocabulary (inline `sharedModel` is retired). | sharedModel |

## The graph & its derivation

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **The graph** (the *one graph*) | The single derived read source: flat **nodes** + **edges**, a projection of the repo at a commit. Never a second source of truth. | database, store, index, read model (prefer "the graph"), model |
| **Extractor** | The pure producer that reads source and emits the graph + a validation report; the *only* thing that reads source. | parser, compiler, indexer, scanner |
| **Derivation** | `graph = f(repo)` and `output = f(graph)` — deterministic and regenerable (delete and rebuild byte-identically). | generation (loose), sync |
| **Marker** | An in-code pointer binding a code location to a Spec ID + structural bindings; one-way (code → Spec), carries no intent. | tag, decorator, annotation (that's the *provenance*, below) |
| **Node** / **Edge** | Graph elements; a node carries `nodeType` (+ `specKind` for Specs); an edge carries a type and provenance. | record, row, link (loose) |

## Provenance & the epistemic boundary

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Provenance** | Where a node/edge came from — `declared` / `annotation` / `inferred` — kept strictly distinct, forever. | origin, source (loose) |
| **Declared** | Provenance: authored intent in a spec/pack file. Human-asserted, authoritative. | authored (loose), manual |
| **Annotation** | Provenance: an edge bound by an in-code **marker**. Human-asserted binding, authoritative. (The marker is the source; "annotation" is the edge class it yields.) | marker, comment |
| **Inferred** | Provenance: structurally derived by the extractor. Machine fact, advisory, **never authoritative**. | detected, guessed, computed (loose) |
| **Epistemic boundary** | The rule that **humans assert intent, machines assert structure** — and the two are never confused. | trust model (loose) |
| **Evidence** | Observed runtime truth, pipeline-populated, **never authored** (ASPIRATIONAL overlay). Distinct from verification. | proof, result, metrics |

## Relations (authored, declared edges)

| Term | From → to | Definition | Notes |
| --- | --- | --- | --- |
| **refines** | Spec → Spec | A more precise child of a parent; also how a Spec expresses **capability membership** (descend the abstraction ladder). | replaces authored capability `belongsTo` |
| **dependsOn** | Spec → Spec | This Spec needs another Spec to hold. | |
| **constrainedBy** | Spec → Spec | This Spec is bounded by a rule/constraint Spec. | |
| **decidedBy** | Spec → Spec / doc | Shaped by a decision Spec (or a linked external `doc:` ADR). | |
| **verifies** | Spec → Spec | A scenario/example Spec intended to verify a target Spec. Also emitted as an *annotation* edge from a test marker — same edge type, distinct provenance. | |
| **supersedes** | decision Spec → decision Spec | A current relationship between two decision records that both still exist. The one kept forward-pointer. | not history |
| **belongsTo** | Spec → Pack | Pack membership — **derived from the Pack manifest, not authored.** | not in the authored set |
| **satisfies** | code node → Spec | Code realises a Spec — an **annotation** edge from a marker, not authored. Views may render "satisfied by". | retired authored `satisfiedBy` |

*Retired:* **exemplifies** — covered by `kind:"example"` + `refines` + `verifies`.

## Validation & honesty

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Validator** | A CI check over the graph; the build fails on error. | linter (loose), rule (loose) |
| **Readiness profile** | The *minimum* a readiness claim must satisfy — a floor to *claim* a rung, never a quota to *fill*. | checklist, requirements, quota |
| **Authoring-shape honesty** | The validator forbidding authored bindings/runtime/evidence/`verification.tests`/delivery facts (anything that should be derived). | |
| **Gap** (gap-warning) | A surfaced absence (e.g. a `ready` Spec with no verifier) — informative, not a build gate. | error, failure |
| **Orphan** | A Spec with no relations and nothing pointing at it. | dangling (that's a *broken reference*) |
| **Coherence** | A Pack's deterministic checks (member refs + `modelRefs` + referenced terms resolve; no duplicate member IDs) — distinct from member completeness. | validity (loose) |

## Consumers & surfaces

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Projection** | A pure function of the graph producing a consumer artifact; disposable, regenerable, never a second source. | export (loose), render (loose), copy |
| **View** | The one generated, read-only human projection. | dashboard, page (loose) |
| **Design-review projection** | The flagship curated view: a Spec/Pack in context + design questions + a findings table; the surface where a Spec earns `ready`. (D4) | report, review doc |
| **Agent surface** | The coding-agent read surface: a **visible typed graph** the agent *scripts* via a typed CLI — no verb wall. (D5) | API (loose), tool surface |
| **Handle** | The thin typed loader that does joins + taxonomy-decode once and returns plain composable data; a front door, not a store. | client, SDK, repository |
| **MCP surface** | The integration surface for **user-facing apps** — designed-in, deferred build, shape TBD. Distinct from the agent surface. (D6) | API (loose), the agent surface |
| **Mechanical substrate** | The exhaustive, derived import/symbol structure used for impact/blast-radius (ASPIRATIONAL); divergence from the curated graph is **curation, not drift**. | the graph, second graph, language server (loose) |
| **Intent composition** | The write-affordance: compose scoped intent → an agent edits source → git → CI. There is no patch loop. | patch, codemod, write-back, editor |

## Relationships

- A **Spec** has exactly one **kind** and one **abstraction**, and *claims* one **readiness**; its **delivery
  facts** are *derived* and never authored.
- `ready ∧ ¬implemented` = the **build backlog**; `implemented ∧ ¬ready` = a **drift alarm** (code ran ahead of
  design). These queries are the payoff of keeping readiness and delivery facts separate.
- A **Pack** groups many **Specs**; a Spec may belong to many Packs; membership lives on the Pack **manifest**,
  and the `belongsTo` edge is derived from it.
- A **marker** produces **annotation**-provenance **edges** (`satisfies`, `verifies`); it never carries intent.
- The **extractor** derives **the graph** from the repo; every **projection** (view, design-review, agent
  surface, MCP surface) is derived from the graph — never from source, never from a second store.
- A Spec earns **ready** at the **design-review projection** (the place it is reviewed in context).

## Example dialogue

> **Engineer:** "`spec:orders.create-order` is at `readiness: designed` but the view shows an `implemented`
> badge. Is that a bug?"
>
> **Designer:** "No — that's the model working. **Readiness** is the *design maturity* the author claims;
> **implemented** is a *delivery fact* we *derive* from a `satisfies` edge. Seeing `implemented` under a
> not-yet-`ready` Spec is a **drift alarm**: the code ran ahead of the design."
>
> **Engineer:** "So to clear it I push the Spec to `ready`?"
>
> **Designer:** "Right — but `ready` is earned at the **design-review projection**, reviewed against its
> neighbours, no blocking open questions. You don't *set* `implemented` or `has-verifier`; you can't — they're
> derived. A marker on the code gives `implemented`; a test marker's `verifies` edge gives `has-verifier`."
>
> **Engineer:** "And the shared vocabulary — I'll add a `sharedModel` to the pack?"
>
> **Designer:** "We retired that. Make a `kind:\"model\"` Spec and point the Pack at it with **modelRefs** —
> one source of truth for the vocabulary. Just keep **model** meaning *domain vocabulary*; when you mean the
> read source, say **the graph**."

## Flagged ambiguities (resolved here)

- **`model` — triple overload (the important one).** It was used for (1) the `model` **facet**, (2) the
  `kind:"model"` Spec, and (3) "the read model" (the graph). **Resolution:** reserve **model** for the
  *domain-vocabulary* sense (1 and 2 are the same concept at different granularities). For the read source, say
  **the graph** / **the one graph** — never "the model". Treat "read model" as legacy phrasing; prefer "the graph".
- **`readiness` vs delivery facts (the D1 conflation).** The old ladder merged author-claimed design maturity
  with machine-observed delivery status. **Resolution:** **readiness** = design maturity only (`sketch…ready`,
  authored); **delivery facts** (`implemented`/`has-verifier`/`observed`) are derived. `bound`/`executable`/
  `verified` are retired *as readiness values*. Don't call a delivery fact a "readiness".
- **`ready` (was provisional) — ratified.** Kept as the top readiness rung (clear: "implementation-ready").
- **`has-verifier` (was provisional) — ratified, deliberately awkward.** Chosen *because* it cannot be misread as
  "verified/passing": it asserts a verifier *exists*, not that it ran green. (Alternatives `verified`, `tested`,
  `checked` all leak a pass/fail claim — avoid.)
- **`abstraction` vs `readiness` — say "altitude" vs "rung", never "level".** "Level" is ambiguous across the two
  axes; use **altitude** for abstraction and **rung** for readiness.
- **`annotation` — provenance, not the marker.** The thing you write in code is a **marker**; the edge class it
  yields is **annotation** provenance. Don't call the marker an "annotation".
- **`belongsTo` — derived, not authored.** It reads like an authored relation but is *derived* from the Pack
  manifest. Authored membership in a capability is **refines**, not `belongsTo`.
- **`satisfies` not `satisfiedBy`.** The edge is `satisfies` (code → Spec, annotation provenance). A view may
  *display* "satisfied by", but the authored/stored direction and name is `satisfies`.
- **`capability` lives in both `kind` and `abstraction` — intentional.** They answer different questions and vary
  independently (a `kind:"capability"` Spec can sit at `abstraction:"domain"`). State this once; don't over-justify.
