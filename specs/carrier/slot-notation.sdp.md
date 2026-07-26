---
id: spec:carrier.slot-notation
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
---
# Slot notation declares, binds, and refuses to guess

## Intent
- outcome: Give step text one owned typed placeholder syntax whose normalized identity a generated contract can key on.

## Rule
- A slot group opens with an identifier; a brace group that does not open with one is prose, and prose is never policed.
- A vocabulary slot declares a type only in the ratified type form — `number`, `string`, `boolean`, or a closed union of two or more quoted literals — while an example binds one scalar literal in the same position.
- The skeleton — every slot group normalized to `{name}` with prose braces left untouched — is the step's identity: it keys the generated step contract, matches an example step to its vocabulary entry, and makes a declaration and its binding the same step.
- An identifier-led group whose remainder parses as neither a type nor a value stays a named but unusable slot: it declares nothing, binds nothing, and reads as unbound rather than being guessed into meaning.
- The single-quoted-literal form parses as a binding, and what it would declare in a vocabulary is unruled — so a vocabulary consumer treats it as declaring nothing and says so rather than inventing a one-value dimension.
- Lexical degradation stays local: a stray or unterminated brace group is prose only up to the next candidate, so it never swallows a well-formed binding that follows it.
- The realizing entrypoints are `parseSlots` and `stepSkeleton` in `src/notation/slots.ts`.

## Example space
```gwt-vocabulary
Given the step text {stepText:string}
When the notation parses the step text
Then the notation finds {slotCount:number} slot groups
Then the first group has the form {form:"bare"|"typed"|"bound"|"malformed"} and the name {slotName:string}
Then the step skeleton is {skeleton:string}
```
