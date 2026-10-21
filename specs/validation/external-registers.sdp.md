---
id: spec:validation.external-registers
kind: behavior
altitude: story
readiness: defined
relations:
  dependsOn:
    - target: spec:validation.corpus-rules
      reason: the recipe answers with findings and runs as a rules file
    - target: spec:consumers.agent-surface.recipe-parameters
      reason: the register arrives as data through `--params register=@PATH`
    - target: spec:consumers.agent-surface.register-recipes
      reason: the recipe reads the strings entry search walks, with its entry paths and lines
---
# A corpus checks the register tokens its prose cites

A corpus written against an earlier design cites that design's numbered things by token: its decisions, laws, scenarios, and the extensions the corpus itself adds. The first adopter keeps such a register as a table in its design README and checks the tokens its Specs cite against it with a script that reads the carriers a second way (`libar-platform/design/tools/check.py`). A register is the corpus's own data and never the Protocol's. A token stays prose: the carrier gains no grammar for it and the graph mints no node for it. Recipe 50 reads the tokens the Specs already hold as text, finds them by a pattern the corpus gives, checks them against a register file the corpus passes, and answers with findings, so the check runs as a rules file on the one validation path. Which registers a corpus may cite, and so which files it passes, is its owner's ruling.

## Intent
- problem: A corpus that cites the tokens of an outside register checks them with a script that reads its carriers a second way, or does not check them at all.
- outcome: Check the tokens a corpus cites from an outside register against a register file it supplies, as a rules file, with no new grammar and no graph node.

## Behavior
- rule: [#tokensStayProse] A register token stays prose: the carrier gains no grammar for it, the graph holds no node or edge for it, and no Protocol validator reads it.
- rule: [#registerAsData] External registers, recipe 50, takes the register as data, a file the corpus passes with `--params register=@PATH`, and the pattern that finds the register's tokens in text, and reads the graph and nothing else.
- rule: [#textRead] It reads every string entry search walks in each Spec, the narrative and every section value with the keys an author coins, open questions and their fields and example steps included, plus each Spec's title and the reason of each relation it declares; it reads no id, fixed field name, Pack manifest, file or source.
- rule: [#citation] Each match of the pattern in one of those strings cites the matched text as a token, at that Spec and entry.
- rule: [#unknownToken] A cited token the register does not list is an `unknown-token` finding, once per citing Spec and token.
- rule: [#retiredToken] A cited token the register retires is a `retired-token` finding, once per citing Spec and token.
- rule: [#uncitedToken] When the caller passes `uncited: true`, each token the register holds that no Spec cites is an `uncited-token` finding; a retired token is never one.
- rule: [#asRulesFile] The answer carries its findings, so the shipped file runs unchanged as a rules file at the severity the corpus passes; a corpus that checks several registers calls the recipe once per register through `recipes` from a rules file of its own, because one rules file is named once.
- rule: The recipe reports and refuses nothing, and states no register: what an outside design may be cited for stays the corpus's own text.

## Design
- registerFile: `{ "tokens": [token] }`, where each token is a non-empty string the register holds, or `{ "token": "<string>", "retired": <boolean> }`, retired when `retired` is true and held otherwise; other keys of the file and of a token object are the corpus's own and ignored, so a register may carry its own columns.
- registerParams: recipe 50 takes `params.register`, the register file's object, `params.pattern`, `params.severity`, `"error"` by default or `"warning"`, and `params.uncited`, `false` by default; `register` and `pattern` have no sample, and a missing or malformed parameter returns `{ diagnostics: [{ parameter, problem }] }` and no findings, which fails the file as a rules file.
- patternParam: `params.pattern` is the source of a JavaScript regular expression compiled with the flags `gu`, whose whole match is the token; a pattern that does not compile, that matches the empty string, or that fails to match each of the register's tokens whole is a diagnostic, as is a token the register lists twice.
- registerAnswer: `{ input: { pattern, severity, uncited }, totals: { specs, citations, tokens, unknown, retired, uncited }, tokens, findings }`, where `specs` counts the Specs read, `citations` the matches, `tokens` the distinct cited tokens, and the last three the findings of each rule id.
- tokenRow: `{ token, held, retired, citations, specs }` for each distinct cited token in code-unit order, where `specs` lists the citing Specs by id and an unknown token has `held` and `retired` false.
- tokenFinding: `{ validatorId, subjectId, relatedId, severity, message, file, path, line }` for `unknown-token` and `retired-token`, where `subjectId` is the citing Spec, `relatedId` the token, `file` the Spec's carrier, `path` the first citing text, in the order the title, the narrative and sections as entry search walks them, then relation reasons as authored, written `title`, a text path in the form the prose-mention check writes, such as `narrative`, `behavior.rules[2]` or `design.<key>`, or `relation.<type>.<target>`, and `line` that text's recorded line, left out when not located; findings sort by Spec id, then token.
- tokenMessages: `<spec> cites <token>, which the register does not list` for `unknown-token`, `<spec> cites <token>, which the register retires` for `retired-token`, and `<token> is held by the register and no Spec cites it` for `uncited-token`.
- uncitedFinding: `{ validatorId: "uncited-token", subjectId, severity, message }`, where `subjectId` is the token; these findings follow the others, in the register's order.

## Example space
```gwt-vocabulary
Given a probe corpus whose Spec cites the tokens {cited:string}
Given a register file that holds {held:string} and retires {retired:string}
When the shipped external-registers file runs as a rules file with the pattern for E-numbers and uncited {uncited:boolean}
Then the command exits {exitCode:number}
Then the corpus findings carry the rule ids {ruleIds:string}
```
