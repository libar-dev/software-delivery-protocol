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

### Open questions
- [non-blocking #oneLiteralVocabulary] Should a group holding one double-quoted literal declare a one-value dimension in a vocabulary?
  - decider: owner
  - provisional: the group is a binding and declares no vocabulary type; contract generation reports contracts/untyped-vocabulary-slot.

## Rule
- A slot group opens with a name matching ASCII `[A-Za-z_][A-Za-z0-9_]*`, and `__proto__` is always a malformed slot; a brace group that does not open with such a name is prose, and prose is never policed.
- A vocabulary slot declares a type only in the ratified type form — `number`, `string`, `boolean`, or a closed union of two or more quoted literals — while an example binds one scalar literal in the same position.
- The skeleton — every slot group normalized to `{name}` with prose braces left untouched — is the step's identity: it matches an example step to its vocabulary entry, makes a declaration and its binding the same step, and keys the generated step contract unless the step carries a step key under `spec:carrier.step-keys`.
- An identifier-led group whose remainder parses as neither a type nor a value stays a named but unusable slot: it declares nothing, binds nothing, and reads as unbound rather than being guessed into meaning.
- A group holding one double-quoted literal, `{x: "only"}`, is a binding; in a vocabulary it declares no type, the provisional reading of the open question above, and contract generation reports `contracts/untyped-vocabulary-slot`.
- A bare group, `{n}`, names a slot and binds nothing; in an example it is unbound, and in a vocabulary it declares no type.
- Lexical degradation stays local: a stray or unterminated brace group is prose only up to the next candidate, so it never swallows a well-formed binding that follows it.

## Example space
```gwt-vocabulary
Given the step text {stepText:string}
When the notation parses the step text
Then the notation finds {slotCount:number} slot groups
Then the first group has the form {form:"bare"|"typed"|"bound"|"malformed"} and the name {slotName:string}
Then the step skeleton is {skeleton:string}
```
