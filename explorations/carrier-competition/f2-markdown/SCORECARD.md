# F2 Markdown carrier scorecard

This self-score confirms the standing F2 evidence against this PR's own files. Ratings are
comparative evidence for the ruling session, not a carrier ruling.

| Axis | Score | Exhibit evidence |
|---|---|---|
| Agent emission register | Strongest | Frontmatter, headings, lists, and fences use Markdown patterns already common in agent output; see `specs/`. |
| Non-engineer authoring/review | Strong | Every authored exhibit renders as an ordinary document without a build. |
| Conversation → repo verbatim | Exact | The prose and fenced examples can move from a design conversation into the file without TS/JSX translation. |
| Envelope typing | Strong with a named gap | `envelope.schema.json` provides closed enums and graph-derived ids through a stock YAML language server; frontmatter needs an editor association before the modeline fires. |
| Prose | Strongest | Decision context and readiness notes are ordinary paragraphs; `PROSE-IN-GRAPH.md` names the unresolved graph representation. |
| Kind coverage | Strong | `behavior`, `example`, `decision`, `model`, `contract`, and `rule` are demonstrated in one document family; the envelope enum covers all eight kinds. |
| Ownership cost | Strong | The Protocol owns the envelope and fenced notation, while CommonMark, GitHub rendering, and YAML tooling supply the page. |
| Differentiation sentence | Strong | Delivery state as a typed document: Markdown that compiles to the one delivery graph. |
| Standalone wedge | Partial | Files are readable and reviewable without tooling; deterministic validation still requires `sdp`. |
| Diff/merge ergonomics | Strong | `executable/after-edit/` is a one-line authored diff and a one-line generated diff. `table-sugar/` keeps one point per row, so distinct row edits merge line-by-line. |
| Agent read-back cost | Light | As a whitespace-token proxy, the ready parent is 149 tokens versus 200 for its TS twin; the child is 143 versus 232. The counts exclude no comments, so the comparison favors neither surface artificially. |
| Minimum-ceremony `idea` spec | Strong | `arc/01-idea/create-order.sdp.md` is 18 whitespace tokens and the child is 33 including its optional prose sentence; the minimum shape is the envelope plus H1. |

## What this carrier knows that Gherkin does not

The document combines a typed envelope, all-eight-kinds-one-family section conventions, and a
closed-union slot vocabulary while renting the surrounding page from Markdown. Gherkin knows
behavioral examples; this carrier knows where any Spec sits in altitude and readiness, how it
relates to the rest of the authored model, and how prose-natured and structure-natured kinds share
one reviewable family. The generated contracts keep execution below the authoring surface, so
that additional knowledge does not come from forking a test runner grammar.
