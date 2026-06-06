# F — Edit Through the Lens

The view should not be read-only forever. The job here is to let people edit comfortably in the generated view, while every change round-trips back to canonical code through a validated patch — so the repo stays the source of truth.

---

## JS-F1
### Round-trip a validated patch from view to code

**Phase:** Iterate
**References:** [07 — Spec Studio & Projections](../docs/concept/07-spec-studio-and-projections.md), [02 — System Architecture](../docs/concept/02-system-architecture.md)

> **When** I'm reviewing a spec in the generated view and want to change it — add an example, tighten a target, resolve a question — **I want to** make that edit in the view and have it flow back to the canonical code as a validated patch, **so I can** edit comfortably without the view becoming a competing source of truth.

**Essence:** Specs are code; the view is the lens; interactions produce patches; validators decide what's allowed. The repo stays canonical even when edits originate in the view.

**Acceptance criteria:**
1. An edit made in the view produces a structured patch, not a direct, unmediated rewrite of source.
2. The patch is validated — against the same rules CI uses — *before* anything is written to the repo.
3. A patch that would break the graph is rejected with a clear reason, leaving the repo untouched.
4. An applied patch updates the canonical code so the change shows up as a normal, reviewable git diff.
5. The flow is transactional: a patch either fully applies and validates, or doesn't apply at all — no half-states.
6. A patch built against a stale graph is detected and refused rather than applied blindly.
7. Edits that would orphan real code or fake derived evidence are not offered as editable in the view.
8. After applying, regenerating the view reflects the change — closing the loop without manual sync.
