# AI can shape the reading, but it cannot rewrite the record

*Part 5 in a series introducing the Libar Software Delivery Protocol. This is a direction article, not a description of shipped AI presentation features. Links are pinned to one commit; see the footer.*

The Protocol already uses AI agents in two distinct roles. An agent can read the delivery graph and answer questions. It can also receive scoped intent and edit source. A third role belongs to the product's longer-term direction: AI can help decide how a person reads the graph.

That might mean selecting a useful projection, narrowing a Pack to one concern, explaining a difficult relation, or adapting a review to the reader's context. The appeal is not a universal interface generated on every visit. It is presentation that fits the question while the underlying record stays unchanged.

This role needs the same honesty discipline as the other two. It also introduces a real design tension: today's projections are deterministic, while language-model output can vary.

The series should discuss that tension directly.

## Three roles, three different trust boundaries

**AI as a reader is built.** Through `sdp q`, an agent scripts the typed graph. Recipes answer recurring questions. A context bundle composes the reading for a design pass within a stated budget, in parts when the scope needs them. Nothing in this path asks the model to invent the model.

**AI as an editor is built as a hand-off.** A person or agent composes scoped intent. The Studio's composing panel can produce a change proposal and memo. An agent checks the proposal against its base and applies accepted changes as ordinary source edits. Git and the conformance and honesty checks see the same edit they would see from a person.

**AI as a presentation assistant is a future direction.** The current package does not use an LLM to generate Studio pages, select a lens for a reader, summarize a Pack or rearrange a review. The MCP surface for user-facing apps remains deferred. Runtime observation also remains deferred, and supplied run evidence is not runtime observation.

Keeping the roles separate prevents a useful reading aid from acquiring authority it never earned.

## What AI may shape

A presentation assistant could work at several levels.

It could choose among deterministic artifacts. Given a reviewer's question, it might open a design slice, a capability map, a Mermaid diagram or a Spec's source context. The assistant chooses the reading; the existing projection supplies the content.

It could compose a new deterministic projection through code. An agent proposes a projection and its checks. Once reviewed and built, that projection reads the graph like any other. AI helped write the generator, not the answer on each render.

It could produce explanatory prose or a bespoke arrangement beside a deterministic projection. A summary might explain why two Specs conflict or translate a readiness floor failure into plainer language. This is where the fine-tuning and presentation finesse become valuable, and where the current guarantees need careful extension.

All three patterns are options to explore. None is a ratified product design today.

## The determinism question cannot be waved away

Today, `graph = f(repo)` and a shipped projection is a pure, disposable, regenerable function of the graph. The same graph and named inputs produce the same bytes. That property makes staleness falsifiable and lets the repository's checks compare regenerated output.

An LLM-written summary does not automatically inherit that property. Model versions, decoding choices and prompt context can change the words even when the graph has not changed.

A mature design must decide where that variation belongs. It could cache generated prose as a named artifact, record its model and source commit, and present it beside the deterministic view. It could restrict AI to selecting deterministic content. It could define a separate explanatory projection with a different reproducibility contract. These are design questions, not implementation details to hide.

The wrong answer is to call every generated sentence a projection and assume the existing guarantee still applies.

The same caution applies to layout. An adaptive interface may reorder information, but it must not drop a blocking question because the summary seemed complete, turn an inferred edge into an authoritative one, or hide supplied evidence whose commit does not match the page's stamp.

## The record keeps its boundaries

Whatever presentation mechanism emerges, several boundaries remain useful tests for it.

- A model may explain a `declared` relation, but it may not present its own inference as `declared` intent.
- A model may summarize a binding, but `implemented` still means a resolving `satisfies` edge and `has-verifier` still means a resolving verifier exists.
- A model may discuss supplied run results, but it may not turn them into `observed` or imply that a verifier passed when no run record says so.
- A model may recommend a readiness statement. Only an author states readiness, and the structural floor still checks that statement.
- A model may propose a source edit. A view does not become canonical by displaying that proposal.
- A model may omit detail for readability. It must preserve the scope and what was left out, as a context bundle does.

These rules do not guarantee that a summary is good. They make its claims inspectable.

## A better goal than "AI-generated UI"

The seed design treated AI context as a first-class projection and the Studio as a place to explore and refine a living model ([the seed projection design](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/lineage/v0-design/07-spec-studio-and-projections.md)). The current system has made the graph, agent surface, Studio and intent hand-off real.

The next useful step is not a button that generates an entire dashboard. It is a set of measured experiments:

1. Can an assistant select the right existing reading for a review task more reliably than a reader navigating alone?
2. Does a generated explanation help a reviewer understand a Pack without making them less likely to inspect its Specs?
3. Can a compact, reader-specific projection preserve every claim and omission needed for an honest decision?
4. Which generated artifacts need a model, prompt and source-commit record to remain reviewable?
5. When does adaptive presentation save effort, and when does a stable page structure make review easier?

The first UX/UI design pass can explore these questions without committing the product to AI-rendered pages. The deterministic Studio remains a baseline and a fallback.

The strategic value is flexibility. A strong graph and an explicit edit model let us replace weak projections, test specialized ones and add AI assistance where it proves useful. The interface can keep changing. The record does not change with it.

## Up next

Part 6, *Shared language is a performance feature*, returns to the construction of the Protocol: why precise terms reduced ambiguity for people and agents, and how the carrier competition chose Markdown without closing every authoring option.

---

*About this article: Part 5 in a series introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753). Repository links are pinned to commit `b5e0a8be`. Current capabilities are distinguished from design options throughout; the AI presentation direction is not shipped functionality.*
