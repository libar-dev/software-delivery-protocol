---
id: spec:consumers.spec-studio.register-input
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:validation.external-registers
      reason: the input is the register file and pattern the external-registers recipe already reads
    - target: spec:consumers.spec-studio.data.inputs
      reason: the register joins the base graph and the run records as a named input
---
# An outside register is a named Studio input, so a cited token links to its entry

A corpus that cites an outside register, an open-decisions list or an earlier system's references, writes its tokens in prose. The external-registers recipe checks them against a register file the corpus passes; a reader on the page still sees only the token. On the first adopter's pages a reader met a cited open decision and found no route to its entry. The register is the corpus's own data, so it reaches the Studio the way the base graph and the run records do: named on the command line, named on every page that shows it, and never graph data.

## Intent

- actor: A reviewer with only a link who meets a cited token, such as an open decision's number, in a Spec's text.
- problem: A cited token reads as bare text on every page, and the register that defines it is neither linked nor shown.
- outcome: Let the Studio take an outside register as a named input, so each token a corpus cites from it links to its entry, named as outside evidence and never as graph data.

### Open questions

- [blocking #registerEntry] What does a register file give the Studio beyond what the external-registers recipe reads, so a token's entry can be shown?
  - decider: delegated
  - provisional: an optional `title` and an optional `href` on a token object; the Studio writes one page per register listing each token with its title, retired tokens marked, each linking to its `href` when present
- [blocking #inputForm] How does the studio verb name a register, its pattern and the words that name it on a page?
  - decider: delegated
  - provisional: a repeatable `--register NAME=PATH` with a matching `--register-pattern NAME=SOURCE`, the name naming the register in words wherever it shows
- [non-blocking #textLinks] Does a cited token become a link inside the rendered text of a Spec, or only in a list beside it?
  - decider: delegated
  - provisional: inside the text, matched by the register's pattern exactly as the recipe matches it, so the page and the check agree on what is cited

## Behavior

- rule: [#registerNamed] A register is a named input like the base graph and the run records: a page that shows it names it in words, and it never becomes graph data, a finding, a fact or a rung.
- rule: [#tokenRoute] Each token the register's pattern finds in a Spec's text routes to that token's entry on the register's page, and a token the register does not list, or retires, reads so beside it.
- rule: [#withoutRegister] Without the input every page is what the graph alone writes.
