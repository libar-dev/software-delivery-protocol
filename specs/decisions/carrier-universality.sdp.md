---
id: spec:decisions.carrier-universality
kind: decision
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:decisions.gherkin-carrier-option
    reason: settles the admitted description prose and the meaning of universality as a generated read projection, while reaffirming the behavior and example kind bound
  dependsOn:
    - spec:decisions.prose-ownership
    - target: spec:decisions.pack-markdown-carrier
      reason: leaves the Pack carrier to its separate syntax ruling
---
# Carrier universality is bounded by honest kind structure

## Intent
- outcome: Decide which kinds of truth the Gherkin carrier can hold honestly, what "universal" means, and whether Markdown stays the default.

## Decision
- context: The Gherkin carrier option (MD-27) admitted graph-aware Gherkin only for behavior and example Specs so the corpus would not pretend every kind has a natural Gherkin shape. A preference for one format asks whether that kind bound should be overturned, whether rich content may live inside the carrier, what "universal" means, whether Markdown remains the default, and whether Packs are in scope. The kind-evidence table and the structural collisions in the Gherkin grammar show which kinds it can carry honestly.
- decision: In order, first, Gherkin remains an honest canonical per-ID option only for `behavior` (Feature) and `example` (ordinary Scenario); the other six kinds stay Markdown because a Gherkin mapping would lie against the kind-evidence table — `workflow` has no distinct Gherkin root and Feature mapping erases the kind; `rule` collides with `Rule:` already consumed as inline `behavior.rules`; `constraint` needs machine-readable targets a Scenario cannot own; `model` needs keyed terms; `decision` needs context/decision/rationale/consequences (and supersedes) that Feature structure cannot distinguish; `contract` shares the behavior family row but Feature cannot structurally mark the kind. Second, rich content is ruled by physical form: Feature and Scenario description prose (keyed description bullets and remaining non-heading prose) is lawful only as free prose on the prose owners the prose-ownership law (MD-19) names — narrative or description on the typed owner — never a new field and never a parser-within-a-parser beyond enumerated constructs; Gherkin DocStrings and DataTables remain refused. Third, "universal" means per-ID carriers plus a generated Gherkin-shaped READ projection of any Spec (visibly generated, disposable, lossy commentary allowed for refused kinds), not one default authored carrier for everything and not a lossless codec. Fourth, the corpus default does not flip: Markdown remains the default Spec carrier; a default flip is refused before full honest round-trip exists. Fifth, Packs are out of this ruling; the Pack syntax ruling (MD-25) remains the Pack carrier law.
- rationale: This is hard to reverse because kind coverage, default posture, and the meaning of universality become contracts for authoring guidance, extraction, projections, and later follow-through — flipping them later would churn every carrier surface and every consumer that trusted the bound. It is surprising without context that "universal" is a generated read projection rather than one authored format, that six kinds stay Markdown on honesty grounds rather than missing syntax, and that description prose is admitted only onto slots the prose-ownership law (MD-19) already owns while DocStrings and DataTables stay refused. It is a real trade-off: one preferred stakeholder shape is worth a bounded second parser and a generated view, while refusing dishonest kind mappings, a default flip, self-executing prose, DocString/DataTable expansion, and Pack absorption gives up format uniformity to keep one graph language and the kind-evidence table honest. The rationale of the Gherkin carrier option (MD-27) is therefore reaffirmed and sharpened, not overturned.
- consequence: `spec:carrier.gherkin-authoring` records the closed grammar this ruling bounds.
- consequence: A generated Gherkin-shaped projection may render any Spec for reading; it never uses `.sdp.gherkin` in an authored tree, never claims round-trip parity, never becomes a second source of truth, and may mark refused kinds with lossy commentary.
- consequence: Markdown stays the default Spec carrier under the carrier ruling (MD-18); the Gherkin option stays opt-in per ID for behavior and example only, as the Gherkin carrier option (MD-27) admits it; the `.sdp.gherkin` extension (MD-28) stays untouched, with its suffix, its dual-recognition refusal, and bare `.feature` non-canonicity.
- consequence: Packs stay under the Pack syntax ruling (MD-25); this Spec neither admits a Gherkin Pack surface nor reopens the Pack Markdown envelope.
- consequence: Execution and `has-verifier` stay behind generated contracts and resolving anchored handlers; Gherkin prose does not execute; authored delivery status, lifecycle tags, value-transfer deletion, Scenario Outlines, Examples tables, backgrounds, star steps, and leading conjunctions stay refused.
- alternative: Making Gherkin the default authored carrier for every kind would satisfy the one-preferred-format desire, but would force dishonest Feature mappings for six kinds and an XL migration before round-trip honesty exists.
- alternative: Admitting DocStrings or DataTables as authored rich content would look more BDD-native, but would invent structure outside the prose owners the prose-ownership law (MD-19) names and reopen a parser-within-a-parser the closed grammar refuses.
- alternative: Treating "universal" as one lossless codec between Markdown and Gherkin would promise field-level fidelity the v0 record never designed and the kind-evidence collisions forbid.
