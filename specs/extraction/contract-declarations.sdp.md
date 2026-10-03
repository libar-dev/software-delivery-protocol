---
id: spec:extraction.contract-declarations
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:extraction.executable-contracts
  dependsOn: spec:carrier.inline-code-spans
  decidedBy: spec:decisions.typing-law
---
# Contract declarations derive a compilable module

The re-entry trigger held with the first adopter's rebuild package. libar-platform at `2b6b9db` authored its design as keyed Design entries whose values open with a one-line code span, and a test author and a builder wrote 325 tests and the code from that text apart from each other. Every disagreement that went up for a ruling at the merge was a prose sentence with two readings, and none was a declaration. A long table was split across a table, a validator, and an index entry rather than wrapped. That evidence rules the declaration shape below and leaves the derived module unruled.

## Intent
- problem: Signatures and types in a design are code, yet an author writes them as prose entries no compiler reads, so a name used and never declared, or declared twice, is found only by a reviewer.
- outcome: Give a declaration one ruled shape inside the Design section, so that a module derived from the graph can carry every pinned signature of a corpus and a Spec that disagrees with its code fails the adopter's typecheck the way a step contract does.

### Open questions
- [blocking] The derived module needs a preamble the Spec cannot carry: the imports its spans assume and a declaration for each placeholder word such as `handler`. Does the adopter supply it as configuration to `sdp build`, or does a recipe emit the module inside the adopter's repository until a second adopter needs the same preamble? The lean is the recipe, with `sdp build` taking it over at the second-caller bar.
- [blocking] When the contract section lands, the `contract` row of the kind-evidence table repoints to it. Which evidence counts as present, and which as complete?
- [non-blocking] A compiled module finds a name used and never declared and a name declared twice. It does not find a bullet whose prose uses a declared name with another type, which is the drift the first adopter met at its merge. Checking a span used inside a step bullet as an expression is deferred until an adopter asks for it.
- [non-blocking] The source report's full shape is kept here so the capture does not narrow it in silence: an opaque language-tagged fence as the value of one keyed entry, then the closed section whose declarations derive one module per corpus, then implementation code importing the derived types so that a Spec which disagrees with its code fails the build. Compiling the derived module alone finds only names used and never declared, and names declared twice.

## Behavior
- rule: A declaration is the code span that opens the value of one keyed Design entry, written on one line in the language the adopter's code is written in. The Protocol parses no language inside the span and stores it as authored.
- rule: A fence is not the declaration shape. A declaration that does not fit one line is split across several keyed entries, each a declaration of its own.
- rule: The key names the declaration's role, and the Protocol fixes no key vocabulary. An adopter's prefix convention, such as `fn`, `type`, `table`, `validator`, and `index`, is a project policy that a recipe reads and never a carrier rule.
- rule: A declaration states a shape and never a delivery fact. The anchor's `satisfies` binds the code that claims to realize it and a test anchor binds the verifier that claims to check it, both outside the span.
- rule: The derived module is a projection: regenerable, never edited, imported by the adopter's tests and never by an authored Spec.
