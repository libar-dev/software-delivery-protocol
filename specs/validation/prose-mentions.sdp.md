---
id: spec:validation.prose-mentions
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.referential-integrity
  decidedBy: spec:decisions.checked-mentions
---
# Every Spec id written in prose resolves

## Intent
- outcome: Refuse a prose reference to an absent Spec or entry, and report a prose reference that no declared relation backs.

## Rule
- The validator id is `conformance/prose-mentions`, in the conformance family; the realizing entrypoint is `checkProseMentions` in `src/validate/validators.ts`, which reads the graph's Primitive nodes and edges and nothing else.
- The scanned text of a Spec is its narrative and every string value under its sections, except the `gwt-vocabulary` fence at `behavior.exampleSpace` and the `gwt` fences that are object entries of `behavior.examples`. The title is not scanned. Scan order is the narrative first, then the sections in the serialized graph's order, then entries in their authored order.
- A mention starts at `spec:` where the character before it, if any, is not an ASCII letter, an ASCII digit, or `-`. A backslash before ASCII punctuation is read as that punctuation, as Markdown reads an escape. The token ends at ASCII whitespace, at one of the ASCII delimiters `` ` `` `"` `'` `(` `)` `[` `]` `{` `}` `<` `>` `|`, or at a character outside ASCII that is whitespace, U+0085 included, punctuation other than connector punctuation, a symbol, or a space, line, or paragraph separator, so every dash, ellipsis, typographic quote, and arrow ends it. Every other character stays in the token, letters, combining marks, digits, connector punctuation, control characters other than whitespace, and format, private-use, and unassigned characters among them. Trailing `.` `,` `;` `:` `!` `?` `*` `_` `~` are then removed after the prefix, so a sentence, a list, or emphasis may end in an id. When nothing remains after `spec:`, there is no mention, so a bare prefix or a placeholder such as `spec:<id>` stays prose. The whole token goes to `parseId`, so an underscore, a slash, a comma, a control character, or any character outside ASCII that stays in it refuses the whole token as malformed; the token is never cut short to the valid id before that character, and a refused token counts toward no pair. A token equal to the scanning Spec's own id is skipped.
- A token that fails `parseId` is an error with the message `Mention "<token>" in "<spec>" at <path> is not a Spec id or entry address: <reason>`, where `<reason>` is the grammar's refusal text with its `Invalid ID "<token>": ` prefix stripped.
- A token whose Spec part names no Primitive node is an error with the message `Mention in "<spec>" at <path> points to missing target "<token>".`, followed by the referential-integrity nearest-id suggestion when one is unique.
- A token whose Spec exists and whose entry address names no key of that section, or names `description`, is an error with the message `Mention in "<spec>" at <path> points to missing entry "<section>.<key>" of "<target>".`
- Errors are reported once per scanning Spec, text path, and distinct token; `subjectId` is the scanning Spec, `relatedId` the token as written, `path` the text path, and `file` the Spec's carrier. The path is `narrative` or the section path in the mention audit's form, such as `intent.openQuestions[0].question`, `behavior.rules[2]`, `design.step2`, or `model.terms.<term>`.
- A target Spec that exists and shares no declared `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, or `supersedes` edge with the scanning Spec, in either direction, is one warning per scanning Spec and target Spec pair, counting every location where any token names that Spec or one of its entries. The message is `Mention of "<target>" in "<spec>" at <n> locations, first at <path>, with no declared relation between them; informative only. Declare the relation that fits, or leave the mention as prose and let the warning stand when none does.` with `<n>` the count of distinct paths, written `1 location` when it is one, and `<path>` the first in scan order; `subjectId` is the scanning Spec, `relatedId` the target Spec id, `path` that first path, and `file` the Spec's carrier. An address on the scanning Spec's own id is checked for its entry and never warned.
- The warning is honest when it stands: the six relations are typed, a mention that none of them describes is lawful prose, and no author declares a relation to silence the report. Warnings never fail `sdp validate`; the mention audit recipe reports every location of every pair as data and stays the way to list them at once.
