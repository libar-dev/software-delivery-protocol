# The permanent ownership bill

An own grammar buys identity-as-syntax. It also makes every layer below our responsibility. The
table prices that obligation rather than arguing it away; every row is marked **forever** because
none disappears after the first parser ships.

| Owned surface | Duration | What must exist and keep evolving |
|---|---|---|
| Grammar specification | Forever | A versioned normative syntax, ambiguity rules, compatibility policy, and fixtures for every construct. |
| Parser | Forever | Recovery, source spans, structured findings instead of throws, lossless handling of unknown input, and performance limits. |
| Formatter | Forever | Stable indentation, wrapping, comments, tables, and idempotence without changing meaning. |
| Syntax highlighting | Forever | A maintained TextMate grammar, editor registrations, injections, and theme testing. |
| GitHub and web rendering | Forever | Plain-text fallback until an ecosystem recognizes `.sdp`; any rich renderer, security policy, and upgrade path are ours. |
| Editor plugins | Forever | File association, completion activation, navigation, formatting, diagnostics, releases, and support across editors. |
| Language server | Forever | Descriptor/id completion, relation resolution, did-you-mean help, readiness feedback, rename semantics, and incremental parsing. |

## Highlighting made concrete

This is the scale of only the first TextMate slice; it is an ownership artifact, not wired product:

```json
{
  "scopeName": "source.sdp",
  "fileTypes": ["sdp"],
  "patterns": [
    { "include": "#comments" },
    { "include": "#envelope" },
    { "include": "#steps" }
  ],
  "repository": {
    "comments": {
      "patterns": [{ "name": "comment.line.number-sign.sdp", "match": "^\\s*#.*$" }]
    },
    "envelope": {
      "patterns": [
        { "name": "keyword.control.sdp", "match": "^(spec|refines|verifies|dependsOn|constrainedBy|decidedBy)\\b" },
        { "name": "constant.language.sdp", "match": "\\b(idea|scoped|defined|ready)\\b" }
      ]
    },
    "steps": {
      "patterns": [{ "name": "keyword.other.sdp", "match": "^\\s*(Given|When|Then|And)\\b" }]
    }
  }
}
```

## The current public-repo experience

GitHub documents that Linguist determines languages for syntax highlighting and repository
statistics. On 2026-07-12, its current language registry has no `.sdp` association. Without a
repository override, GitHub therefore presents this file family as unhighlighted text; it does not
render a delivery document the way it renders Markdown. That is not a temporary parser task. It is
the permanent cost of owning a new file language.

The raw authored experience today is exactly this:

```text
spec orders.create-order.valid-cart
  example · story · ready
  refines orders.create-order

Valid cart creates an order
```

Sources checked: [GitHub repository-language documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-repository-languages)
and the [current Linguist language registry](https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml).
