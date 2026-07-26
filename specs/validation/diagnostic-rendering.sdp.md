---
id: spec:validation.diagnostic-rendering
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:validation.two-check-families
  dependsOn: spec:consumers.design-review
---
# One diagnostic currency, its location composed from structured fields

## Intent
- outcome: Let a reader locate any reported problem the same way, whichever producer or surface reported it.

## Rule
- There is one diagnostic currency. Extraction, contract generation, and graph validation all report in the one finding shape, and no surface introduces a parallel report shape of its own.
- A finding's location lives in its own structured file and line fields, never baked into its message text, so a location is composed once by whoever renders it and is never rendered twice.
- The command-line rendering is the path and line, the severity in brackets, the validator id, and the message, in that order and separated by the same one-line punctuation for every finding.
- The location degrades by field rather than by placeholder: a file with a line renders both, a file without a line renders the path alone, and a finding carrying no file renders no location prefix at all.
- The Design Review renders the same currency in its findings table under the same composition rule, and shows an em dash where a finding carries no file, because a table cell cannot be absent the way a prefix can.
- The realizing entrypoints are `formatFinding` in `src/cli/output.ts` and `renderFindings` in `src/projections/design-review-context.ts`.

## Example space
```gwt-vocabulary
Given a finding naming the validator {validatorId:string} at severity {severity:"warning"|"error"} carrying the message {message:string}
When the {renderer:"command-line"|"Design Review"} renderer formats that finding once per location shape
Then the finding carrying the file {file:string} and the line {line:number} renders {withLocation:string}
Then the same finding carrying the file alone renders {fileOnly:string}
Then the same finding carrying neither renders {bare:string}
Then the findings row carrying the file {file:string} and the line {line:number} renders {locationRow:string}
Then the same row carrying the file alone renders {fileOnlyRow:string}
Then the same row carrying neither renders {absentRow:string}
```
