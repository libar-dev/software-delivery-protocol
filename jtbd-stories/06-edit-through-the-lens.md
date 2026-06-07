# F — Edit Through the Lens

The view is a lens, not an editor. The job here is to let people drive a change *from* the view without the view ever becoming a competing source of truth. The write-affordance is composing scoped intent — not mutating state — and an AI agent applies the change to source the same way a human would.

---

## JS-F1
### Drive a change as scoped intent, not a patch

**Phase:** Iterate *(the underlying edit model — agent edits source → git → conformance checks — is MVP-true today; the in-view composer is the Iterate layer)*
**References:** [06 — Consumers & Projections](../docs/concept/06-consumers-and-projections.md)

> **When** I'm exploring a spec in the view and want to change it — add an example, tighten a target, resolve a question — **I want to** select the scope and state my intent so the view hands a clean, token-budgeted prompt to an AI agent that edits the source, **so I can** edit comfortably while the repo stays canonical and conformance checks stay the gate.

**Essence:** A view never writes to canonical source. The editor is an agent editing source — identical in kind to a human editing source — so there is no derived layer writing back, no patch format, no speculative apply. Every edit is an ordinary commit; conformance checks are the validator.

**Acceptance criteria:**
1. The view's only output is scoped, token-budgeted intent: the user picks a scope (parent / siblings / a slice / open questions) and states the change — **scoped intent** — and the view composes the prompt (**intent composition**); it writes nothing to the repo itself.
2. An AI agent (via CLI or MCP) applies the change by editing spec files and code, exactly as a human editing source would.
3. The change lands as an ordinary git commit, reviewable as a normal diff — there is no structured-patch subsystem, no codemod-from-view, and no in-memory patch-validator.
4. Conformance + honesty checks (`akg validate` / CI) are the gate every edit passes — the same gate for an agent-applied edit, a human edit, and any other commit; nothing bypasses it.
5. Lifecycle operations — split, combine, refine, delete — are plain git + edit (`git mv`, edit in place, `git rm`); maturity and group-readiness signals are computed from the graph, not stored.
6. After the commit, regenerating the graph and view reflects the change, closing the loop with no manual sync.
7. The scope preview shows what the agent will be given (the in-context specs/relations and the token budget), so the human can tighten scope before handing it off.
