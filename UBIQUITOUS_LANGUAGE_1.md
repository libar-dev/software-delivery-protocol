# Ubiquitous Language — Libar Omni

This document defines the comprehensive, canonical domain vocabulary for the Libar Omni system. It provides the deep semantic anchor required for AI agents and human engineers to reason efficiently about the architecture-connected delivery process. 

By standardizing on these exact terms, reasoning traces become highly token-efficient, and the strict boundaries between intent, structure, and execution are preserved.

## 1. The Epistemic Model & System Spine

The foundational philosophy of Libar Omni separates human intent from machine reality. This section defines the CQRS-inspired, snapshot-based event-logging spine that powers the system.

| Term | Definition | Aliases to avoid |
| ----------- | ------------------------------------------------------- | --------------------- |
| **Epistemic Boundary** | The strict architectural rule dictating that humans assert intent while machines assert structure. | Trust model, boundary |
| **Canonical Source of Truth** | The typed TypeScript specs, code, and markers committed in the repository. | Write model, dual source, DB |
| **Event Log** | Git history acting as the immutable sequence of changes. | Event store, event sourcing |
| **The Graph** | The single derived read source containing flat nodes and edges extracted from the repository. | Pattern graph, database, the model |
| **Projection** | A pure function of the graph producing a consumer-specific artifact. | Export, render, view |
| **Mechanical Substrate** | The exhaustive, machine-derived import and symbol structure used strictly for impact analysis. | Language server, inferred graph |
| **Curated Surface** | The editorially sparse architectural view derived exclusively from authored specs and markers. | Authored graph, manual graph |
| **Context Bundle** | A token-budgeted, curated slice of the graph pushed to an agent for a specific session. | Prompt context, AI payload |
| **Anti-Corruption Layer** | The interop ingest boundary translating external tool outputs into the system's native format. | Membrane, importer, adapter |

## 2. Primitives & Core Groupings

These are the structural atoms of the delivery process. The system uses a single enrichable primitive rather than mutating artifacts through a pipeline.

| Term        | Definition                                              | Aliases to avoid      |
| ----------- | ------------------------------------------------------- | --------------------- |
| **Spec** | A persistent statement of desired system truth that is enriched in place. | Pattern, requirement, ticket, artifact |
| **Envelope** | A Spec's stable, minimal outer shape containing its identity and positioning. | Header, base, schema |
| **Facet** | An optional, typed slice of detail on a Spec acting as the primary extension surface. | Field, section, attribute |
| **Pack** | A reified aggregate over Specs serving as the recurring human review unit. | Bounded context, epic, folder |
| **Manifest** | A Pack's explicit list of members acting as the single source of truth for grouping. | Index, membership list |
| **Model** | A domain vocabulary definition specifying terms and concepts. | Read model, schema, ERD |
| **Term** | A precisely defined domain word living inside a model facet. | Glossary item |

## 3. Classification Axes (Altitude & Category)

Specs are not moved through rigid phases; they are positioned on orthogonal axes. This prevents the "merged progressions" anti-pattern of legacy PM tools.

| Term         | Definition                                  | Aliases to avoid       |
| ------------ | ------------------------------------------- | ---------------------- |
| **Abstraction** | A Spec's intent altitude on a single scale from domain down to scenario. | Level, tier, scope, granularity |
| **Kind** | The specific category of truth a Spec states. | Artifact type, category |
| **Readiness** | The author-claimed design maturity of a Spec indicating its completeness. | FSM status, state, stage, phase |
| **Ready** | The top Readiness rung indicating a Spec is reviewed in context and implementation-ready. | Completed, active, approved |
| **Delivery Fact** | A truth about a Spec's realization computed strictly from graph edges. | Status, workflow state |
| **Implemented** | A derived Delivery Fact indicating a `satisfies` edge resolves to the Spec from code. | Bound, active |
| **Has-verifier** | A derived Delivery Fact indicating an enabled executable verifier links to the Spec via `verifies`. | Verified, passing, tested |
| **Evidence** | Observed runtime truth that is populated by the pipeline and never authored by hand. | Test results, metrics, proof |

## 4. Provenance & Binding

Provenance dictates the authority of an edge. It is never silently collapsed, ensuring that human intent is never overwritten by machine inference.

| Term         | Definition                                  | Aliases to avoid       |
| ------------ | ------------------------------------------- | ---------------------- |
| **Provenance** | The non-collapsible origin of a node or edge indicating its level of authority. | Source, origin |
| **Declared** | Authoritative, human-asserted intent authored directly in a Spec or Pack. | Manual, authored |
| **Marker** | An in-code pointer binding a code location to a Spec ID without carrying intent. | Tag, gate tag, decorator |
| **Annotation** | An authoritative edge originating from an in-code Marker. | Tag, marker (when referring to the edge) |
| **Inferred** | Advisory, machine-derived structure extracted from the mechanical substrate. | Detected, guessed |

## 5. Edges & Relationships

These are the exact verbs used to connect nodes in The Graph. Using precise edge vocabulary is critical for trace queries and impact analysis.

| Term         | Definition                                  | Aliases to avoid       |
| ------------ | ------------------------------------------- | ---------------------- |
| **refines** | An authored edge indicating a Spec is a more precise child of a parent Spec. | contains, includes |
| **dependsOn** | An authored edge indicating a Spec needs another Spec to hold. | requires |
| **constrainedBy**| An authored edge indicating a Spec is bounded by a rule or constraint. | limitedBy |
| **decidedBy** | An authored edge indicating a Spec is shaped by a decision record. | |
| **verifies** | An authored or annotation edge linking an executable scenario or test to its target Spec. | tests, checks |
| **supersedes** | An authored edge representing a current relationship between two decision records that both exist. | replaces |
| **belongsTo** | A derived edge linking a Spec to a Pack based on the Pack's manifest. | memberOf |
| **satisfies** | An annotation edge from code to a Spec indicating the code realizes the intent. | satisfiedBy |

## 6. Validation & Honesty

The mechanisms that keep the Canonical Source of Truth trustworthy and prevent the graph from lying.

| Term         | Definition                                  | Aliases to avoid       |
| ------------ | ------------------------------------------- | ---------------------- |
| **Validator** | A deterministic CI check over the graph that fails the build on errors. | ProcessGuard, linter, rule |
| **Readiness Profile**| The minimum set of facets and edges required to legitimately claim a Readiness rung. | Quota, checklist |
| **Authoring-shape Honesty**| The rule forbidding authors from manually writing data that should be derived by the pipeline. | |
| **Gap** | A surfaced absence of data that is informative but does not block a build. | Error, failure |
| **Orphan** | A Spec with no relations and nothing pointing at it. | Dangling reference |
| **Coherence** | A deterministic check ensuring a Pack's member references and model definitions resolve. | Validity |

## 7. Lifecycle & Value Transfer

The execution phase where design intent becomes durable code, and ephemeral scaffolds are cleaned up.

| Term         | Definition                                  | Aliases to avoid       |
| ------------ | ------------------------------------------- | ---------------------- |
| **Value Transfer** | The post-implementation movement of a Spec's invariants and rationale into durable code and tests. | |
| **Ephemeral Scaffold**| A design-level Spec or step-definition stub that is deleted after its value transfers. | Throwaway code |
| **Promoted Stub**| A code or contract stub whose identity travels with the code into production rather than being deleted. | |
| **Executable Feature**| The permanent Gherkin file carrying the surviving invariants and scenarios. | Test file |
| **Transcription Bloat**| The anti-pattern of copying rule prose verbatim during value transfer instead of distilling it. | Boilerplate |
| **Intent Composition**| The write-affordance where a user scopes intent for an agent to edit the source directly. | Patching, codemod |
| **Handoff** | An end-of-session state capture detailing forward-looking pattern state for the next session. | Recap, summary |

## Relationships

- A **Pack** groups one or more **Specs** via its **Manifest**, resulting in exactly one derived `belongsTo` edge per member.
- A **Spec** claims exactly one **Readiness** and sits at exactly one **Abstraction**.
- A **Spec** possesses zero or more **Delivery Facts** derived purely from edges in **The Graph**.
- The **Canonical Source of Truth** is analyzed by an extractor to project exactly one **The Graph**.
- A **Marker** in the **Canonical Source of Truth** yields exactly one **Annotation** edge in **The Graph**.
- **The Graph** serves data to one or more **Projections**, such as a **Context Bundle**.
- During **Value Transfer**, the invariants of an **Ephemeral Scaffold** move to exactly one **Executable Feature**, after which the scaffold is deleted.

## Example dialogue

> **Dev:** "I'm picking up the User Registration **Spec**. Should I change its **FSM status** to 'active' now that I'm writing code?"
> 
> **Domain expert:** "We don't use FSM statuses or PM lifecycles anymore. Just leave the **Readiness** claim at `ready`. When you add a **Marker** on your route handler, the system will derive the **Delivery Fact** that it is `implemented`."
> 
> **Dev:** "Got it. And once I write the executable tests, do I delete the design spec like we used to with stubs?"
> 
> **Domain expert:** "Yes, but be careful with the distinction. The design-level **Spec** is an **Ephemeral Scaffold** that gets deleted after **Value Transfer** to the **Executable Feature**. However, your contract stubs are **Promoted Stubs**—their identity travels with the code to `src/` and persists."
> 
> **Dev:** "Understood. Should I write a patch script to update the graph?"
> 
> **Domain expert:** "No, we use **Intent Composition**. You declare your scope, and the agent edits the **Canonical Source of Truth** directly. **The Graph** is just a **Projection**; we never mutate it directly."

## Flagged ambiguities (Architect Hazard Resolution)

- **Event Sourcing** vs **Event Log**: Legacy Architect overclaimed "Event Sourcing". *Recommendation:* Use **Event Log** to describe Git's role (snapshot flavor). Avoid implying we fold events to state.
- **Model** vs **The Graph**: "Model" was overloaded to mean the database, the domain vocabulary, and the facet. *Recommendation:* Strictly use **The Graph** for the read model/database. Use **Model** only for the domain-vocabulary sense (e.g., `model` facet, `kind:"model"` Spec).
- **Readiness** vs **Delivery Facts**: Legacy Architect merged authored design maturity and machine-observed code status into a single FSM lifecycle (`candidate -> roadmap -> active -> completed`). *Recommendation:* Split these cleanly. Humans author **Readiness** (`sketch` -> `ready`); machines derive **Delivery Facts** (`implemented`, `has-verifier`).
- **Pattern** vs **Spec**: Architect used "Pattern" for everything organically. *Recommendation:* Use **Spec** as the sole, type-safe primitive. Do not say "Pattern Graph".
- **Tag** vs **Marker** vs **Annotation**: "Tag" in Architect meant Gherkin/JSDoc text. *Recommendation:* A **Marker** is the code construct you write; an **Annotation** is the graph edge provenance it produces. Drop "Tag" entirely.
- **ProcessGuard** vs **Validator**: Architect used "ProcessGuard" and "Scope-Creep" for PM-style gating. *Recommendation:* Use **Validator** to describe strict structural and referential integrity checks. We are not a PM tool.
- **Patching** vs **Intent Composition**: *Recommendation:* Never say "patch loop". AI agents and humans edit source code via **Intent Composition**.
