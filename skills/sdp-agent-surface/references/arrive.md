# Arrive with a word, a file or an address

Read this when you hold a term, a file, a changeset or an entry address rather than a Spec id.

## A word

Run orientation 8 on your term. Two matchers answer, and each misses what the other finds.
`g.findByConcept` matches a case-insensitive substring of ids, titles, labels, Pack framing,
narrative and sections; recipe 23, Entry search (`dist/recipes/23-entry-search.js`), matches whole
tokens, splits camelCase and returns addresses and lines. A spaced phrase can miss a hyphenated id:
try both forms. Entry search shows at most 50 rows, so compare `shown` with `matches` and narrow the
term, not the rows. `line: null` means not located, never absent. Neither reads outside the graph:
grep `CONTEXT.md`, the project's docs, job stories and skills.

## A file or a changeset

Run orientation 9 on your files, or recipe 4, What breaks if I change these files
(`dist/recipes/04-what-breaks-if-i-change-these-files.js`), over your diff's files. A file the graph
records nothing at lands in `coverageUnknownFiles`: its reach is unknown, not empty, as for a skill
or handbook edit. A unit bound to no Spec is a lawful identity-only anchor. `impactedPacks` lists
only changed Pack manifests; a Pack holding an impacted Spec is at risk, and at-risk is one hop that
asserts no dependency.

## An address to cite

An entry address names one keyed entry: `spec:<id>#rule.<key>` (a rule or flow), `#design.<key>`,
`#ui.<key>`, `#question.<key>` or `#term.<key>`. Check each with orientation 11, or recipe 25,
Address resolution (`dist/recipes/25-address-resolution.js`), before writing it into prose, a test
or a page (`spec:decisions.checked-mentions`). A bare Spec id is no address: check it with
orientation 10. Decision sections, narrative, unkeyed rules and step keys have no address: cite file
and line. An address cited in source is recorded only when its file carries an anchor
(`spec:extraction.entry-citations`).
