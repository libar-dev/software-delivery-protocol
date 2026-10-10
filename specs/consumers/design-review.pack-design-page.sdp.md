---
id: spec:consumers.design-review.pack-design-page
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.design-review
  dependsOn:
    - spec:consumers.pack-design
    - spec:consumers.binding-language-views
  decidedBy: spec:decisions.pack-design-page
---
# A Pack page shows where the Pack's design stands

## Intent
- outcome: Render a Pack's design assembly as one deterministic Markdown page a reviewer reads before a design pass, between iterations and before stating readiness.

## Behavior
- rule: The page keeps its title line, framing and vocabulary references, then renders, in this order: the member table, what holds each member below its next rung, the Pack's boundary, the open questions, the code, the verifier coverage gaps, and the findings.
- rule: The member table has one row per member in authored order, numbered from 1: the linked Spec with its title, kind, stated rung, floor reached, the stated next rung with `holds` when its unmet clauses are empty and the first unmet clause otherwise, the design columns as counts (entries, declarations, questions with the blocking count), the decisions it names, and the implementation and verifier binding columns with the present and none values the binding-language rule fixes for every aggregate table, beside a design-reference column that reads present when a code unit references the member and none otherwise. Unit counts stay off the table, which offers existence and never a degree. An unresolved member keeps a row that says so.
- rule: The next-rung section lists each member whose stated next rung has unmet clauses, every clause with the targets it names and their stated rungs. A member whose floor holds its next rung is listed apart as waiting for its author's statement, which the page never presents as approval.
- rule: The boundary section has two tables, the Specs the Pack rests on and the Specs that rest on it, each row with the linked Spec, its stated rung, whether it carries `implemented`, and the members it joins under each relation type.
- rule: The open-questions section groups questions by member in authored order. Each question shows its blocking flag, its entry address when it carries a key, its text, and a link to its line in the carrier file when the location table records one.
- rule: The code section lists, per member, each realizing and each referencing unit with its id, a link to its file and line, its role, and its component with that component's layer and context, under the binding-language headings the Design Review already uses. A member with no unit says so in one line.
- rule: A line link is a relative link from the page to the carrier or source file with a `#L<line>` fragment. Every value is escaped by the Design Review's encoding rules, and the page carries no timestamp, commit or run identity, so two renders of one graph are byte-identical.
- rule: The realizing site is the Pack page renderer under `src/projections/`.
