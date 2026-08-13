@spec.consumers.reader
@altitude.feature
@readiness.ready
@refines.spec:consumers.agent-surface
Feature: The reader bridges agent entry points to composable graph context
  - outcome: Let agents enter the curated graph from the strings, files, and changesets they already have without rebuilding its joins or taxonomy.

  @example-space
  Scenario: Reader entry vocabulary
    Given a reader built over the graph a real extraction derives from the probe root
    Given the concept {concept:string} appears in the corpus only inside the recorded context of {conceptSpecId:string}
    Given the source file {boundFile:string} carries the binding {bindingId:string}
    Given the changeset also holds the file {unrecordedFile:string} the graph records nothing at
    When the reader answers the {entry:"concept"|"file"|"changeset"} entry
    Then the reader names {matchedId:string} as a match on the field {matchedField:string}
    Then the reader names {matchCount:number} matches in all
    Then the file entry names the node {nodeId:string} the graph records at that path
    Then the file entry reaches the spec {reachedSpecId:string} that binding names
    Then the spec carrier {carrierFile:string} answers with its own spec {carrierSpecId:string}
    Then the impacted specs name {impactedSpecId:string} through the binding {impactBindingId:string} at claim {impactClaim:string}
    Then the one-hop at-risk neighbors name {atRiskId:string} through the edge {atRiskEdge:string} at claim {atRiskClaim:string}
    Then the at-risk neighbors number {atRiskCount:number}
    Then the coverage-unknown files name {coverageUnknownFile:string}
    Then the coverage-unknown files number {coverageUnknownCount:number}

  @spec.consumers.reader.concept-entry
  @altitude.story
  @readiness.ready
  Scenario: A concept recorded only inside a Spec's sections is still reached, and the field is named
    - outcome: Execute the string entry against the case a title-and-id lookup would miss, and read back the field the match was recorded in.
    Given a reader built over the graph a real extraction derives from the probe root
    Given the concept {concept: "backorder"} appears in the corpus only inside the recorded context of {conceptSpecId: "spec:orders.order-management"}
    When the reader answers the {entry: "concept"} entry
    Then the reader names {matchedId: "spec:orders.order-management"} as a match on the field {matchedField: "sections.behavior"}
    Then the reader names {matchCount: 1} matches in all

  @spec.consumers.reader.file-entry
  @altitude.story
  @readiness.ready
  Scenario: A source file reaches the Spec its binding names, and a carrier reaches its own Spec
    - outcome: Execute the file entry on both halves it has to bridge — a source file the graph records only a binding at, and the carrier a Spec is authored in.
    Given a reader built over the graph a real extraction derives from the probe root
    Given the source file {boundFile: "src/create-order.ts"} carries the binding {bindingId: "impl:orders.create-order"}
    When the reader answers the {entry: "file"} entry
    Then the file entry names the node {nodeId: "impl:orders.create-order"} the graph records at that path
    Then the file entry reaches the spec {reachedSpecId: "spec:orders.create-order"} that binding names
    Then the spec carrier {carrierFile: "specs/create-order.sdp.md"} answers with its own spec {carrierSpecId: "spec:orders.create-order"}

  @spec.consumers.reader.changeset-entry
  @altitude.story
  @readiness.ready
  Scenario: A changeset names what it reaches, why, and what it cannot see
    - outcome: Execute the changeset entry on a mixed changeset, so the impacted reason, the one-hop at-risk edge with its claim, and the coverage-unknown file are all read from one answer.
    Given a reader built over the graph a real extraction derives from the probe root
    Given the source file {boundFile: "src/create-order.ts"} carries the binding {bindingId: "impl:orders.create-order"}
    Given the changeset also holds the file {unrecordedFile: "src/price-book.ts"} the graph records nothing at
    When the reader answers the {entry: "changeset"} entry
    Then the impacted specs name {impactedSpecId: "spec:orders.create-order"} through the binding {impactBindingId: "impl:orders.create-order"} at claim {impactClaim: "anchored"}
    Then the one-hop at-risk neighbors name {atRiskId: "spec:orders.order-management"} through the edge {atRiskEdge: "refines"} at claim {atRiskClaim: "declared"}
    Then the at-risk neighbors number {atRiskCount: 4}
    Then the coverage-unknown files name {coverageUnknownFile: "src/price-book.ts"}
    Then the coverage-unknown files number {coverageUnknownCount: 1}

  Rule: `createReader` constructs a fresh thin typed loader that decodes graph joins, claims, delivery facts, derived readiness, and validation findings once, then returns plain composable data without persisting state.
  Rule: `findByConcept` and `byFile` bridge strings and extraction-root-relative files to the graph's recorded context.
  Rule: `findByConcept` matches a string against every field the graph records — ids, titles, anchor labels, Pack framing, narrative, and reified section content — and names the fields a node matched on rather than returning a bare hit.
  Rule: `byFile` answers with the nodes the graph records at the path and with the Specs those nodes reach, so a source file carrying a binding names the Spec it binds and a carrier file names the Spec authored in it.
  Rule: The reader's `blastRadius` surface maps changed files to directly impacted Specs and Packs, their explicit one-hop at-risk neighbors, and every coverage-unknown file.
  Rule: Every impact and at-risk answer carries its reason as data — the changed file, the binding it travelled through, the connecting edge, and that edge's claim — so nothing about the reach is left to the caller's inference.
  Rule: File-level blast radius reports curated graph reach without claiming exhaustive symbol-level usage reach.
  Rule: The realizing entrypoint is `createReader` in `src/reader/reader.ts`.
