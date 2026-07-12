# C2 own-grammar carrier scorecard

This self-score tests the standing C2 claims against this exhibit. Ratings are comparative evidence
for plan 16, not a carrier ruling.

| Axis | Score | Exhibit evidence |
|---|---|---|
| Agent emission register | Strong | The line-oriented envelope and GWT-shaped blocks are compact and regular, but an agent must know indentation and the owned grammar; see `specs/`. |
| Non-engineer authoring/review | Partial | The files read cleanly as text, but there is no rendered document, syntax color, or familiar editor mode; `OWNERSHIP.md` prices the gap. |
| Conversation → repo verbatim | Mixed | Step language transfers directly. Prose must obey indentation and keyword boundaries, and envelope metadata must be translated into grammar syntax. |
| Envelope typing | Strong after extraction | The envelope is syntax, so the parser closes descriptors and relations. Until an LSP exists, feedback arrives on save through `sdp validate`, not while typing; see `DIAGNOSTICS.txt`. |
| Prose | Weak | Four paragraphs are counted at the seam, and `PROSE-NOTES.md` records delimiter hazards and the standing truncated-docstrings caution. |
| Kind coverage | Strong | `behavior`, `example`, `decision`, `model`, `contract`, and `rule` share one grammar family; the parser closes all eight kind literals. |
| Ownership cost | Weakest | Parser, formatter, highlighting, rendering, editor integrations, and LSP are permanent owned surfaces; `OWNERSHIP.md` makes each obligation concrete. |
| Differentiation sentence | Strongest | A grammar for delivery state: identity, maturity, relations, behavior vocabulary, and review structure are language syntax rather than annotations. |
| Standalone wedge | Strong | A `.sdp` file has no host-language or package syntax and can be parsed without a TypeScript project. Rich feedback still requires our toolchain. |
| Diff/merge ergonomics | Strongest | The drift edit changes one value on one line; `cases` gives each point one row and static expansion keeps generated siblings out of authored merges. |
| Agent read-back cost | Mixed | As a whitespace-token proxy, the ready parent is 149 words versus 200 for TypeScript; the child is 143 versus 232. Every unfamiliar agent also pays the grammar-context tax until the syntax has a training distribution. |
| Minimum-ceremony `idea` spec | Strongest | `arc/01-idea/create-order.sdp` is 17 whitespace words and the child is 32 including optional prose: one declaration, one descriptor, one parent, one title. |

## What this carrier knows that Gherkin does not

The grammar makes delivery state itself syntax: one file language carries every Spec kind,
altitude, readiness, typed relations, example-space declarations, bound points, decisions, models,
and verification criteria. Gherkin knows behavioral examples; this grammar knows the coordinates
and connections of the authored model around them. Its other genuine wedge is independence from a
host language: a parser can consume `.sdp` without TypeScript, Markdown, or a test-runner grammar.
The line-oriented surface makes that identity especially visible in review. The score must carry
the other half of the claim with equal force: we own that language and its ecosystem forever.
