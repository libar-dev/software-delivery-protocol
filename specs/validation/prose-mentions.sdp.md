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
- A mention is a maximal token matching `(?<![A-Za-z0-9-])spec:[A-Za-z0-9][A-Za-z0-9.#-]*` with trailing dots removed, so a sentence may end in an id. A token equal to the scanning Spec's own id is skipped.
- A token that fails `parseId` is an error with the message `Mention "<token>" in "<spec>" at <path> is not a Spec id or entry address: <reason>`, where `<reason>` is the grammar's own refusal text.
- A token whose Spec part names no Primitive node is an error with the message `Mention in "<spec>" at <path> points to missing target "<token>".`, followed by the referential-integrity nearest-id suggestion when one is unique.
- A token whose Spec exists and whose entry address names no key of that section, or names `description`, is an error with the message `Mention in "<spec>" at <path> points to missing entry "<section>.<key>" of "<target>".`
- Errors are reported once per scanning Spec, text path, and distinct token; `subjectId` is the scanning Spec, `relatedId` the token as written, `path` the text path, and `file` the Spec's carrier. The path is `narrative` or the section path in the mention audit's form, such as `intent.openQuestions[0].question`, `behavior.rules[2]`, `design.step2`, or `model.terms.<term>`.
- A target Spec that exists and shares no declared `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, or `supersedes` edge with the scanning Spec, in either direction, is one warning per scanning Spec and target Spec pair, counting every location where any token names that Spec or one of its entries. The message is `Mention of "<target>" in "<spec>" at <n> locations, first at <path>, with no declared relation between them; informative only. Declare the relation that fits, or leave the mention as prose and let the warning stand when none does.` with `<n>` the count of distinct paths, written `1 location` when it is one, and `<path>` the first in scan order; `subjectId` is the scanning Spec, `relatedId` the target Spec id, `path` that first path, and `file` the Spec's carrier. An address on the scanning Spec's own id is checked for its entry and never warned.
- The warning is honest when it stands: the six relations are typed, a mention that none of them describes is lawful prose, and no author declares a relation to silence the report. Warnings never fail `sdp validate`; the mention audit recipe reports every location of every pair as data and stays the way to list them at once.
