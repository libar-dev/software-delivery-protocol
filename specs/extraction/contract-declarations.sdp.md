---
id: spec:extraction.contract-declarations
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:extraction.executable-contracts
  dependsOn: spec:carrier.inline-code-spans
  decidedBy:
    target: spec:decisions.typing-law
    reason: the Design section stays open, so the Protocol fixes no declaration key vocabulary
---
# Pinned declarations give an adopter a derived module to typecheck

The first adopter authored its design as keyed Design entries whose values open with a one-line code span, and a builder and a test author worked apart from that text. Every disagreement raised at the merge was a prose sentence with two readings, never a declaration, and a long table was split across several keyed entries rather than wrapped. That evidence rules the declaration shape below: a one-line code span rather than a fence or a closed section. The shape leaves the contract kind's evidence row unchanged, and a request for a closed contract section needs a Spec of its own. The adopter owns the derived module's emission with its own preamble; implementation and tests may import that module, and compiling it alone does not check their agreement. Nor does it check a span used inside a step bullet against its declaration.

## Intent
- problem: Signatures and types in a design are code, yet an author writes them as prose entries no compiler reads, so a name used and never declared, or declared twice, is found only by a reviewer.
- outcome: Give a pinned declaration one ruled shape inside Design, so the adopter can derive a module and typecheck agreement with its implementation.

## Behavior
- rule: A declaration is the code span that opens the value of one keyed Design entry, written on one line in the language the adopter's code is written in. The Protocol parses no language inside the span and stores it as authored.
- rule: A fence is not the declaration shape. A declaration that does not fit one line is split across several keyed entries, each a declaration of its own.
- rule: The key names the declaration's role, and the Protocol fixes no key vocabulary. An adopter's prefix convention, such as `fn`, `type`, `table`, `validator`, and `index`, is a project policy that a recipe reads and never a carrier rule.
- rule: A declaration states a shape and never a delivery fact. The anchor's `satisfies` binds the code that claims to realize it and a test anchor binds the verifier that claims to check it, both outside the span.
- rule: The derived module is a projection: regenerable, never edited, imported by the adopter's tests and never by an authored Spec.
- rule: The adopter emits the derived module from the pinned declarations list with its own preamble of imports and placeholder declarations, until a second adopter needs the same preamble and the emitter freezes into `sdp build`. The module earns its place only when a changed pinned declaration fails the adopter's typecheck against its implementation; compiling it alone establishes no agreement with that implementation.
