// The authored descriptors of the `validation` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const validationSpecs = [
  {
    id: "spec:validation.readiness-floor",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/readiness-floor.sdp.md",
    title: "Stated readiness must clear its floor",
    narrative: null,
    sections: {
      intent: { outcome: "Refuse maturity claims that their authored evidence does not support." },
      behavior: {
        rules: [
          "A Spec may state a readiness only when every clause in that readiness floor passes.",
          "Floors are cumulative: a stated rung is checked against its own clauses and every lower rung's, so a Spec that clears a higher rung has cleared each one beneath it.",
          "The `idea` floor reads the envelope through five clauses: the Spec carries a stable id, a human-readable title, a stated kind, and a stated altitude, and it either states its intended outcome or declares a parent relation through `refines`.",
          "The `scoped` floor adds three clauses: the intended outcome is stated, at least one authored relation is declared, and the kind's natural evidence is present.",
          "The `defined` floor adds two clauses: the kind's natural evidence is complete, and no open question the Spec records is flagged as blocking.",
          "The `ready` floor reads the Spec's own edges through three clauses: every authored relation resolves to a known target, every `refines` and `dependsOn` target itself stands at least `defined`, and every anchor bound to the Spec resolves.",
          "Readiness is independent across a refinement relation: a child may be authored at a higher readiness than its parent. Only the child's own cumulative floor applies, including the `ready` target bound above when the child states `ready`.",
          "The anchor clause reads the bindings that are present, so a Spec carrying no anchor clears it — the floor never demands a binding an author has not made.",
          "Only relations the Spec itself declares count toward the relation clauses; membership of a Pack is derived from the manifest and never stands in for an authored relation.",
          "Every clause stated here is kind-blind. The two evidence clauses are the one kind-conditional place in the floor, and what counts as a kind's natural evidence is stated in full by the refining Spec that carries the per-kind evidence table.",
          "One clause table serves both readings: it checks the readiness an author states, and it yields derived readiness — the highest rung whose cumulative clauses all pass — which is read beside the stated rung and never overwrites it.",
          "The floor is the mechanism while the specific clause thresholds are one chosen representation, so a team-overridable floor configuration is a designed-for deferral rather than a landed capability: no validator reads a per-team floor setting, and the shipped clause table is the only floor any Spec is checked against.",
          "The floor table in `src/validate/readiness-floor.ts` is the clause set's code-level source of truth and the realizing entrypoint. The clauses stated here and the rows of that table are one law read twice, so any disagreement between them is drift to resolve on one side, never a second floor.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} stating readiness {readiness:"scoped"|"defined"}',
            'the spec {defect:"declares no relation"|"records a blocking open question"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding names the unmet floor clause {clauseId:string}",
            "the report holds {errorCount:number} errors",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.readiness-floor.unrelated-scoped-spec",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/readiness-floor.unrelated-scoped-spec.sdp.md",
    title: "A scoped spec with no relation names the relation clause",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the scoped rung where every clause but the relation clause is satisfied.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.unrelated-scoped"} stating readiness {readiness: "scoped"}',
              'the spec {defect: "declares no relation"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "at-least-one-relation"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.readiness-floor.blocking-open-question",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/readiness-floor.blocking-open-question.sdp.md",
    title: "A blocking open question holds a spec below defined",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the defined rung where a recorded open question is flagged as blocking.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.blocked-defined"} stating readiness {readiness: "defined"}',
              'the spec {defect: "records a blocking open question"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "no-blocking-open-questions"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/kind-evidence.sdp.md",
    title: "Each kind carries its own evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "State what a Spec of each kind must show before its readiness floor accepts the evidence clauses.",
      },
      behavior: {
        rules: [
          "Each kind names its natural evidence: the `scoped` rung requires that evidence present, and the `defined` rung requires it complete wherever the kind defines a stronger form. This table is the whole kind-aware story — there is no second overlay mechanism.",
          "`behavior`, `workflow`, and `contract` share one row. Evidence is present with rules, examples, flows, or constraints — inline, or promoted onto a refining child or a `constrainedBy` constraint. Evidence is complete with rules and/or examples, inline or promoted; constraints alone no longer suffice.",
          "A `rule` converges across the two rungs: its statement is its evidence, because a rule's content is its statement.",
          "An `example` shows evidence present with an examples entry, prose acceptable. It shows evidence complete with at least one structured given/when/then entry whose every used step is fully bound and belongs compatibly to any example space its parent owns — the concreteness law.",
          "A `constraint` shows evidence present with a non-empty constraints section, and complete when every entry carries a machine-readable target.",
          "A `model` converges on non-empty terms: a vocabulary either has terms or it does not.",
          "A `decision` shows evidence present once its decision section is there — context and alternatives may precede the choice — and complete once the chosen option is written.",
          "The `contract` row stands on the behavior row as a named deferral: when a dedicated contract section lands, the typing law pulls it in and this row repoints to it.",
          "Promoted evidence carries an honesty bound. A promoted child counts only when it is a `rule` or `example` Spec that itself clears its own kind's present cell, and a `constrainedBy` edge counts only when it resolves to a `constraint` Spec carrying its constraints — promotion moves content out, so an empty stub child is not a promotion and confers nothing.",
          "The rows are monotonic, promotion-neutral, and converge honestly where a kind has no stronger form; those three bounds belong to the decision this Spec is shaped by and to the carried-evidence decision, and are not restated as law here.",
          "The evidence table in `src/validate/readiness-floor.ts` is the row set's code-level source of truth and the realizing entrypoint; the rows stated here and that table are one law read twice, so any disagreement between them is drift to resolve on one side.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a {kind:"behavior"|"constraint"} spec {specId:string} stating readiness {readiness:"scoped"|"defined"}',
            'its only evidence is {evidence:"a constraints entry carrying a target"|"a constraints entry with no target"|"an empty promoted rule child"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding names the unmet floor clause {clauseId:string}",
            "the report holds {errorCount:number} errors",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence.constraints-alone",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/kind-evidence.constraints-alone.sdp.md",
    title: "Constraints alone stop short of complete behavior evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the behavior-family row where the only evidence is the form that clears present but not complete.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a {kind: "behavior"} spec {specId: "spec:probe.constraints-alone"} stating readiness {readiness: "defined"}',
              'its only evidence is {evidence: "a constraints entry carrying a target"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence.untargeted-constraint",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/kind-evidence.untargeted-constraint.sdp.md",
    title: "A constraint without a machine-readable target is not complete",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the constraint row where the entry is present but carries no target a machine can read.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a {kind: "constraint"} spec {specId: "spec:probe.untargeted-constraint"} stating readiness {readiness: "defined"}',
              'its only evidence is {evidence: "a constraints entry with no target"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence.empty-promoted-child",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/kind-evidence.empty-promoted-child.sdp.md",
    title: "An empty promoted child confers no evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the promoted-evidence bound where a refining child carries none of its own kind's evidence.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a {kind: "behavior"} spec {specId: "spec:probe.empty-promotion"} stating readiness {readiness: "scoped"}',
              'its only evidence is {evidence: "an empty promoted rule child"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "kind-evidence-present"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.sdp.md",
    title: "Duplicate carrier IDs are excluded loudly",
    narrative: null,
    sections: {
      intent: { outcome: "Prevent ambiguous authored identity from entering the graph." },
      behavior: {
        rules: [
          "If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.",
        ],
        exampleSpace: {
          given: [
            "a {firstCarrier:string} carrier declares {specId:string}",
            "a {secondCarrier:string} carrier declares {specId:string}",
          ],
          when: ["the extraction root is read"],
          then: [
            "both sites report {findingId:string}",
            "no graph node is emitted for {specId:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids.dual-carrier",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.dual-carrier.sdp.md",
    title: "TypeScript and Markdown duplicates are both refused",
    narrative: null,
    sections: {
      intent: { outcome: "Execute the duplicate-ID rule across both carrier surfaces." },
      behavior: {
        examples: [
          {
            given: [
              'a {firstCarrier: "TypeScript"} carrier declares {specId: "spec:fixture.duplicate"}',
              'a {secondCarrier: "Markdown"} carrier declares {specId: "spec:fixture.duplicate"}',
            ],
            when: ["the extraction root is read"],
            then: [
              'both sites report {findingId: "extract/duplicate-id"}',
              'no graph node is emitted for {specId: "spec:fixture.duplicate"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.two-check-families",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/two-check-families.sdp.md",
    title: "Validation separates well-formedness from non-pretending",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep the graph trustworthy by checking conformance and honesty without judging content quality or enforcing workflow.",
      },
      behavior: {
        rules: [
          "Every validator belongs to either the conformance family, which checks meta-model well-formedness, or the honesty family, which rejects authored or overstated derived truth.",
          "Validation errors fail the build; gaps and orphans remain informative signals rather than delivery-process gates.",
          "Types enforce structural shape, schema validates graph payloads, and graph validators enforce cross-file conformance and honesty; no one layer substitutes for the others.",
          "All graph validation runs through the one derived graph path: source, extraction, graph, then checks.",
          "The two families are load-bearing, so an aggregate report spanning both states no family of its own while every finding names the family it came from.",
          "The realizing entrypoints are `graphValidatorIds` and `validateGraph` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}',
            "the spec declares a dependsOn relation to the absent target {targetId:string}",
          ],
          when: ["the graph is validated"],
          then: [
            "the aggregate report states no family of its own",
            'the conformance family reports {conformanceId:string} at severity {conformanceSeverity:"warning"|"error"}',
            'the honesty family reports {honestyId:string} at severity {honestySeverity:"warning"|"error"}',
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.two-check-families.split-report",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/two-check-families.split-report.sdp.md",
    title: "One report carries both families and claims neither as its own",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the family split where one probe graph trips a conformance error and an informative honesty signal at once; the same dangling relation also fails the readiness floor on the ready probe, so the family assertions read by containment.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.two-check-families"} at readiness {readiness: "ready"}',
              'the spec declares a dependsOn relation to the absent target {targetId: "spec:probe.absent-dependency"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the aggregate report states no family of its own",
              'the conformance family reports {conformanceId: "conformance/referential-integrity"} at severity {conformanceSeverity: "error"}',
              'the honesty family reports {honestyId: "honesty/gaps"} at severity {honestySeverity: "warning"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.referential-integrity",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/referential-integrity.sdp.md",
    title: "Every graph reference resolves",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep derived graph relationships trustworthy by refusing references to absent nodes.",
      },
      behavior: {
        rules: [
          "Every edge endpoint and every Pack model reference must resolve to a node in the derived graph; an unresolved reference is a conformance error.",
          "The finding names the unique nearest known id as a suggestion and stays silent when two candidates tie, because resolving ambiguity silently is never the check's job.",
          "The realizing validator entrypoint is `checkReferentialIntegrity` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds one spec {presentId:string}",
            "the spec declares a dependsOn relation to {targetId:string}",
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding offers the nearest-id suggestion: {suggested:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.referential-integrity.dangling-target",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/referential-integrity.dangling-target.sdp.md",
    title: "An unrelated missing target is a bare conformance error",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the unresolved-reference law where no known id is near the missing one.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds one spec {presentId: "spec:probe.create-order"}',
              'the spec declares a dependsOn relation to {targetId: "spec:probe.fulfilment-policy"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/referential-integrity"} at severity {severity: "error"}',
              "the finding offers the nearest-id suggestion: {suggested: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.referential-integrity.did-you-mean",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/referential-integrity.did-you-mean.sdp.md",
    title: "A unique near miss earns a did-you-mean suggestion",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the unresolved-reference law where exactly one known id is a near miss.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds one spec {presentId: "spec:probe.create-order"}',
              'the spec declares a dependsOn relation to {targetId: "spec:probe.create-ordr"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/referential-integrity"} at severity {severity: "error"}',
              "the finding offers the nearest-id suggestion: {suggested: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.claim-separation",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/claim-separation.sdp.md",
    title: "Graph claims and contracts stay distinct",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Preserve the graph's declared, anchored, and inferred distinctions while keeping its typed contracts lawful.",
      },
      behavior: {
        rules: [
          "Node and edge types, claims, descriptors, and relation endpoint contracts must use their ratified forms; the claim taxonomy never collapses.",
          "An unratified descriptor value fails closed: it is a conformance error, and no readiness floor is evaluated over it.",
          "The realizing validator entrypoint is `checkClaimSeparation` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a spec {specId:string}",
            'the graph carries an off-contract {element:"edge claim"|"descriptor value"} spelled {value:string}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding message states {phrase:string}",
            "the report holds {floorCount:number} readiness-floor findings",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.claim-separation.collapsed-edge-claim",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/claim-separation.collapsed-edge-claim.sdp.md",
    title: "A binding edge cannot borrow the declared claim",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the edge-contract law where a satisfies edge carries the authored claim.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.create-order"}',
              'the graph carries an off-contract {element: "edge claim"} spelled {value: "declared"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/claim-separation"} at severity {severity: "error"}',
              'the finding message states {phrase: "never collapsed"}',
              "the report holds {floorCount: 0} readiness-floor findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.claim-separation.unratified-descriptor",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/claim-separation.unratified-descriptor.sdp.md",
    title: "An unratified kind fails closed instead of reaching the floor",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the descriptor law where a foreign producer states a kind the model never ratified.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.create-order"}',
              'the graph carries an off-contract {element: "descriptor value"} spelled {value: "saga"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/claim-separation"} at severity {severity: "error"}',
              'the finding message states {phrase: "outside the ratified descriptor values"}',
              "the report holds {floorCount: 0} readiness-floor findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.verification-linkage",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/verification-linkage.sdp.md",
    title: "Declared verification resolves to a performing trace",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep verification relationships meaningful by requiring declared test and oracle traces to resolve to their enabled bindings.",
      },
      behavior: {
        rules: [
          "A declared verifies relation and an oracle model relation must resolve through their respective binding traces before either can stand as verification evidence.",
          "A non-resolving trace is named loudly and confers no delivery fact, because silence would read as verification the graph never earned.",
          "At most one expected-outcome authority may model an example space: a second resolving oracle binding on the same space is an error, because two authorities leave the modeled outcome ambiguous.",
          "The realizing validator entrypoints are `checkVerifiesLinkage` and `checkOracleLinkage` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a parent spec {parentId:string}",
            'a non-resolving {verifierKind:"example spec"|"oracle anchor"} named {verifierId:string} points at it',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the parent earns the delivery fact has-verifier: {conferred:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.verification-linkage.unbound-example",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/verification-linkage.unbound-example.sdp.md",
    title: "A declared verifier no test binds confers nothing",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the verifies-linkage law where no test anchor completes the spec-to-test trace.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a parent spec {parentId: "spec:probe.create-order"}',
              'a non-resolving {verifierKind: "example spec"} named {verifierId: "spec:probe.create-order.valid-cart"} points at it',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/verifies-linkage"} at severity {severity: "warning"}',
              "the parent earns the delivery fact has-verifier: {conferred: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.verification-linkage.unresolved-oracle",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/verification-linkage.unresolved-oracle.sdp.md",
    title: "An oracle with no example space to model confers nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the oracle-linkage law where the modeled spec owns no example space.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a parent spec {parentId: "spec:probe.order-policy"}',
              'a non-resolving {verifierKind: "oracle anchor"} named {verifierId: "oracle:probe.order-policy"} points at it',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/oracle-linkage"} at severity {severity: "error"}',
              "the parent earns the delivery fact has-verifier: {conferred: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.oracle-target-eligibility",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/oracle-target-eligibility.sdp.md",
    title: "Oracle eligibility follows example-space ownership",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let an expected-outcome oracle model any Spec whose own law defines an example space, regardless of Spec kind.",
      },
      behavior: {
        rules: [
          "Oracle target eligibility follows ownership of an example space, not a behavior-kind check.",
          "A resolving binding is an anchored `models` edge from an `oracle:` Anchor to a Spec that owns an example space.",
          "Missing targets, wrong namespaces, absent example spaces, and competing oracles remain fail-closed refusals.",
          "Validators and graph readers consume the same eligibility result.",
        ],
        exampleSpace: {
          given: [
            'the oracle targets a {targetKind:"behavior"|"rule"} spec',
            "the target owns an example space: {ownsExampleSpace:boolean}",
          ],
          when: ["oracle linkage is resolved"],
          then: [
            "oracle linkage reports {findingCount:number} findings and resolving presence {oraclePresent:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.oracle-target-eligibility.rule-space-accepted",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/oracle-target-eligibility.rule-space-accepted.sdp.md",
    title: "A rule owning an example space accepts an oracle",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute kind-neutral oracle resolution for a rule that owns the vocabulary its oracle models.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the oracle targets a {targetKind: "rule"} spec',
              "the target owns an example space: {ownsExampleSpace: true}",
            ],
            when: ["oracle linkage is resolved"],
            then: [
              "oracle linkage reports {findingCount: 0} findings and resolving presence {oraclePresent: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.oracle-target-eligibility.missing-space-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/oracle-target-eligibility.missing-space-refused.sdp.md",
    title: "A target without an example space refuses an oracle",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the fail-closed refusal when an otherwise valid Spec target owns no example space.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the oracle targets a {targetKind: "behavior"} spec',
              "the target owns an example space: {ownsExampleSpace: false}",
            ],
            when: ["oracle linkage is resolved"],
            then: [
              "oracle linkage reports {findingCount: 1} findings and resolving presence {oraclePresent: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.pack-coherence",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/pack-coherence.sdp.md",
    title: "Packs are coherent aggregates",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep review aggregates coherent without treating them as truth-bearing delivery artifacts.",
      },
      behavior: {
        rules: [
          "Pack membership must not repeat a Spec, and every modelRef must resolve to a model-kind Spec.",
          "Membership is counted on the derived belongsTo edges the manifest re-expresses, so a repeated manifest entry is named once per repeated member.",
          "There is no duplicated-intent check on a Pack: a Pack states no system truth to duplicate, and semantic overlap among its members remains human or agent review rather than validator judgment. This lets a coherent group contain low-detail Specs without turning grouping into implementation demand.",
          "The realizing validator entrypoint is `checkPackCoherence` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "a pack {packId:string} lists the spec {specId:string} {memberCount:number} times",
            "the pack also names that spec as a modelRef",
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the report holds {findingCount:number} pack-coherence findings",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.pack-coherence.incoherent-aggregate",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/pack-coherence.incoherent-aggregate.sdp.md",
    title: "A repeated member and a non-model modelRef are both named",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute both halves of the pack law against one incoherent aggregate.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a pack {packId: "pack:probe.checkout"} lists the spec {specId: "spec:probe.create-order"} {memberCount: 2} times',
              "the pack also names that spec as a modelRef",
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/pack-coherence"} at severity {severity: "error"}',
              "the report holds {findingCount: 2} pack-coherence findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.authored-honesty",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/authored-honesty.sdp.md",
    title: "Machine truth is never authored",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep derived graph truth trustworthy by rejecting any authored substitute for machine-derived claims or facts.",
      },
      behavior: {
        rules: [
          "Specs and Packs must not author derived edges, claims, or delivery facts, and any stated delivery facts must equal the graph's recomputed facts.",
          "The realizing validator entrypoints are `checkAuthoringShape` and `checkDeliveryFacts` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a spec {specId:string}",
            'the spec hand-authors the delivery fact {factName:"implemented"|"has-verifier"} at {site:"a behavior section carrier"|"the node deliveryFacts array"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding names the fact {relatedId:string} and states {phrase:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.authored-honesty.section-authored-fact",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/authored-honesty.section-authored-fact.sdp.md",
    title: "A delivery fact smuggled into a section is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the authoring-shape refusal on a section carrier that names a derived fact.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.smuggled-fact"}',
              'the spec hand-authors the delivery fact {factName: "implemented"} at {site: "a behavior section carrier"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/authoring-shape"} at severity {severity: "error"}',
              'the finding names the fact {relatedId: "implemented"} and states {phrase: "derived, never authored"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.authored-honesty.unearned-stated-fact",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/authored-honesty.unearned-stated-fact.sdp.md",
    title: "A stated delivery fact no binding earns is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the delivery-fact refusal where the stated array outruns the recomputed facts.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.unearned-fact"}',
              'the spec hand-authors the delivery fact {factName: "has-verifier"} at {site: "the node deliveryFacts array"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/delivery-facts"} at severity {severity: "error"}',
              'the finding names the fact {relatedId: "has-verifier"} and states {phrase: "derived, never authored"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.warn-level-signals",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/warn-level-signals.sdp.md",
    title: "Missing connective evidence warns without failing",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Surface graph conditions that need attention without turning informative delivery signals into workflow gates.",
      },
      behavior: {
        rules: [
          "Orphaned Specs and ready Specs lacking a resolving verifier are warnings, not validation errors.",
          "The gap signal reads the delivery facts the one derivation rule recomputes from the graph, never the facts a Spec states, so a hand-authored fact can never silence it.",
          "The severity these informative signals carry is fixed by the Protocol and no validator reads a per-team setting, so a per-team severity override is a designed-for deferral rather than a landed capability.",
          "The realizing validator entrypoints are `checkOrphans` and `checkGaps` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}',
            'the spec declares {relations:"no relation"|"a decidedBy decision"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the report holds {errorCount:number} errors",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.warn-level-signals.orphan-signal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/warn-level-signals.orphan-signal.sdp.md",
    title: "A disconnected spec warns and fails nothing",
    narrative: null,
    sections: {
      intent: { outcome: "Execute the orphan signal on a spec no relation reaches." },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.orphan-signal"} at readiness {readiness: "idea"}',
              'the spec declares {relations: "no relation"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/orphans"} at severity {severity: "warning"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.warn-level-signals.ready-gap-signal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/warn-level-signals.ready-gap-signal.sdp.md",
    title: "A ready spec without a verifier warns and fails nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the gap signal on a connected ready spec no verifier resolves.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.gap-signal"} at readiness {readiness: "ready"}',
              'the spec declares {relations: "a decidedBy decision"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/gaps"} at severity {severity: "warning"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.diagnostic-rendering",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/diagnostic-rendering.sdp.md",
    title: "One diagnostic currency, its location composed from structured fields",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a reader locate any reported problem the same way, whichever producer or surface reported it.",
      },
      behavior: {
        rules: [
          "There is one diagnostic currency. Extraction, contract generation, and graph validation all report in the one finding shape, and no surface introduces a parallel report shape of its own.",
          "A finding's location lives in its own structured file and line fields, never baked into its message text, so a location is composed once by whoever renders it and is never rendered twice.",
          "The command-line rendering is the path and line, the severity in brackets, the validator id, and the message, in that order and separated by the same one-line punctuation for every finding.",
          "The location degrades by field rather than by placeholder: a file with a line renders both, a file without a line renders the path alone, and a finding carrying no file renders no location prefix at all.",
          "The Design Review renders the same currency in its findings table under the same composition rule, and shows an em dash where a finding carries no file, because a table cell cannot be absent the way a prefix can.",
          "The realizing entrypoints are `formatFinding` in `src/cli/output.ts` and `renderFindings` in `src/projections/design-review-context.ts`.",
        ],
        exampleSpace: {
          given: [
            'a finding naming the validator {validatorId:string} at severity {severity:"warning"|"error"} carrying the message {message:string}',
          ],
          when: [
            'the {renderer:"command-line"|"Design Review"} renderer formats that finding once per location shape',
          ],
          then: [
            "the finding carrying the file {file:string} and the line {line:number} renders {withLocation:string}",
            "the same finding carrying the file alone renders {fileOnly:string}",
            "the same finding carrying neither renders {bare:string}",
            "the findings row carrying the file {file:string} and the line {line:number} renders {locationRow:string}",
            "the same row carrying the file alone renders {fileOnlyRow:string}",
            "the same row carrying neither renders {absentRow:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.diagnostic-rendering.composed-location",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/diagnostic-rendering.composed-location.sdp.md",
    title: "One finding, three location shapes, one composition rule",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the composition and both degradations on one finding, so the rule is read as one law rather than three renderings.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a finding naming the validator {validatorId: "honesty/readiness-floor"} at severity {severity: "error"} carrying the message {message: "The stated rung is not earned."}',
            ],
            when: [
              'the {renderer: "command-line"} renderer formats that finding once per location shape',
            ],
            then: [
              'the finding carrying the file {file: "specs/probe.sdp.md"} and the line {line: 7} renders {withLocation: "specs/probe.sdp.md:7 — [error] honesty/readiness-floor — The stated rung is not earned."}',
              'the same finding carrying the file alone renders {fileOnly: "specs/probe.sdp.md — [error] honesty/readiness-floor — The stated rung is not earned."}',
              'the same finding carrying neither renders {bare: "[error] honesty/readiness-floor — The stated rung is not earned."}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.diagnostic-rendering.table-cell-location",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/diagnostic-rendering.table-cell-location.sdp.md",
    title: "The same three location shapes, rendered as table cells",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the one composition rule on the Design Review's findings table, where a cell cannot be absent and a message pipe would otherwise split the row.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a finding naming the validator {validatorId: "honesty/readiness-floor"} at severity {severity: "error"} carrying the message {message: "The stated rung is not earned | its floor refused it."}',
            ],
            when: [
              'the {renderer: "Design Review"} renderer formats that finding once per location shape',
            ],
            then: [
              'the findings row carrying the file {file: "specs/probe.sdp.md"} and the line {line: 7} renders {locationRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \\| its floor refused it. | `specs/probe.sdp.md:7` |"}',
              'the same row carrying the file alone renders {fileOnlyRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \\| its floor refused it. | `specs/probe.sdp.md` |"}',
              'the same row carrying neither renders {absentRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \\| its floor refused it. | — |"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.validator-self-testing",
    specKind: "rule",
    altitude: "feature",
    readiness: "defined",
    file: "specs/validation/validator-self-testing.sdp.md",
    title: "Every validator ships evidence in both directions",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep a validator that has silently stopped firing from reading as a clean build.",
      },
      behavior: {
        rules: [
          "Each validator ships evidence in both directions: at least one input it must refuse, and at least one it must accept.",
          "The should-fail half is what catches the regression that matters most — a validator that no longer fires reports nothing, and nothing is indistinguishable from a clean graph unless something asserts the refusal.",
          "The should-pass half bounds the first: a validator that refuses everything is as useless as one that refuses nothing, and only an accepted input separates the two.",
          "This is evidence discipline over the two check families, never a check of its own. No validator polices whether another validator carries tests: that would police the delivery process rather than conformance or honesty, which the standing guardrail forbids.",
          "The discipline is cheap by construction — a probe world per direction — and it is stated here so the two families are read as checks that are themselves checked.",
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
